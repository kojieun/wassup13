'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Trash2, Minus, Loader2 } from 'lucide-react'
import { updateInventoryItem, deleteInventoryItem, consumeInventoryItem } from '@/app/(app)/fridge/actions'
import type { InventoryItem, Ingredient } from '@/lib/types'

type InventoryWithIngredient = InventoryItem & { ingredients: Ingredient }

const categoryIcons: Record<string, string> = {
  '채소': '🥬',
  '육류': '🥩',
  '해산물': '🐟',
  '유제품': '🥛',
  '양념': '🧂',
  '곡류': '🍚',
  '과일': '🍎',
}

function getExpiryInfo(expiryDate: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  const diffTime = expiry.getTime() - today.getTime()
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) return { status: 'expired', daysLeft, label: '유통기한 지남', variant: 'destructive' as const }
  if (daysLeft <= 3) return { status: 'expiring_soon', daysLeft, label: `${daysLeft}일 남음`, variant: 'warning' as const }
  return { status: 'fresh', daysLeft, label: `${daysLeft}일 남음`, variant: 'secondary' as const }
}

export function IngredientDetail({ item }: { item: InventoryWithIngredient }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [quantity, setQuantity] = useState(String(item.quantity))
  const [consumeAmount, setConsumeAmount] = useState('1')

  const expiryInfo = getExpiryInfo(item.expiry_date)
  const ingredient = item.ingredients

  const handleUpdate = () => {
    startTransition(async () => {
      await updateInventoryItem(item.id, {
        quantity: parseFloat(quantity),
      })
      router.refresh()
    })
  }

  const handleConsume = () => {
    const amount = parseFloat(consumeAmount)
    if (amount <= 0 || amount > item.quantity) return

    startTransition(async () => {
      await consumeInventoryItem(item.id, amount)
      if (amount >= item.quantity) {
        router.push('/fridge')
      } else {
        setQuantity(String(item.quantity - amount))
        router.refresh()
      }
    })
  }

  const handleDelete = () => {
    setIsDeleting(true)
    startTransition(async () => {
      await deleteInventoryItem(item.id)
      router.push('/fridge')
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-xl font-bold text-foreground">식재료 상세</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>식재료 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                {ingredient?.name}을(를) 냉장고에서 삭제하시겠습니까?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? '삭제 중...' : '삭제'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Ingredient Card */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent text-3xl">
            {categoryIcons[ingredient?.category || ''] || '🍽️'}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">{ingredient?.name}</h2>
            <p className="text-sm text-muted-foreground">{ingredient?.category}</p>
          </div>
          <Badge
            variant={expiryInfo.variant === 'warning' ? 'outline' : expiryInfo.variant}
            className={expiryInfo.variant === 'warning' ? 'bg-warning text-warning-foreground' : ''}
          >
            {expiryInfo.label}
          </Badge>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">보관 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">보관 방법</span>
            <span className="font-medium text-foreground">{item.storage_type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">유통기한</span>
            <span className="font-medium text-foreground">
              {new Date(item.expiry_date).toLocaleDateString('ko-KR')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">등록일</span>
            <span className="font-medium text-foreground">
              {new Date(item.created_at).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quantity Update */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">수량 수정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="w-16">현재</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0.1"
              step="0.1"
              className="w-24"
            />
            <span className="text-muted-foreground">{item.unit}</span>
          </div>
          <Button onClick={handleUpdate} disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            수량 저장
          </Button>
        </CardContent>
      </Card>

      {/* Quick Consume */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">빠른 소진</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="w-16">소진량</Label>
            <Input
              type="number"
              value={consumeAmount}
              onChange={(e) => setConsumeAmount(e.target.value)}
              min="0.1"
              max={item.quantity}
              step="0.1"
              className="w-24"
            />
            <span className="text-muted-foreground">{item.unit}</span>
          </div>
          <Button
            onClick={handleConsume}
            disabled={isPending || parseFloat(consumeAmount) <= 0}
            variant="outline"
            className="w-full"
          >
            <Minus className="mr-2 h-4 w-4" />
            소진하기
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
