import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Leaf, AlertTriangle, Clock } from 'lucide-react'
import type { InventoryItem, Ingredient } from '@/lib/types'

type InventoryWithIngredient = InventoryItem & { ingredients: Ingredient }

function getExpiryStatus(expiryDate: string): { status: string; daysLeft: number } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  const diffTime = expiry.getTime() - today.getTime()
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) return { status: 'expired', daysLeft }
  if (daysLeft <= 3) return { status: 'expiring_soon', daysLeft }
  return { status: 'fresh', daysLeft }
}

function getStatusBadge(status: string, daysLeft: number) {
  if (status === 'expired') {
    return (
      <Badge variant="destructive" className="text-xs">
        유통기한 지남
      </Badge>
    )
  }
  if (status === 'expiring_soon') {
    return (
      <Badge className="bg-warning text-warning-foreground text-xs">
        {daysLeft === 0 ? '오늘까지' : `${daysLeft}일 남음`}
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="text-xs">
      {daysLeft}일 남음
    </Badge>
  )
}

function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    '채소': '🥬',
    '육류': '🥩',
    '해산물': '🐟',
    '유제품': '🥛',
    '양념': '🧂',
    '곡류': '🍚',
    '과일': '🍎',
  }
  return icons[category] || '🍽️'
}

export default async function FridgePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: inventory } = await supabase
    .from('inventory')
    .select('*, ingredients(*)')
    .eq('user_id', user!.id)
    .order('expiry_date', { ascending: true })

  const items = (inventory || []) as InventoryWithIngredient[]

  const categorizedItems = items.reduce((acc, item) => {
    const category = item.ingredients?.category || '기타'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, InventoryWithIngredient[]>)

  const expiringSoonCount = items.filter((item) => {
    const { status } = getExpiryStatus(item.expiry_date)
    return status === 'expiring_soon' || status === 'expired'
  }).length

  const storageTypes = ['전체', '냉장', '냉동', '실온'] as const

  return (
    <div className="container mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">내 냉장고</h1>
        </div>
        <Button size="sm" asChild>
          <Link href="/fridge/add">
            <Plus className="mr-1 h-4 w-4" />
            추가
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{items.length}</p>
              <p className="text-xs text-muted-foreground">총 식재료</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{expiringSoonCount}</p>
              <p className="text-xs text-muted-foreground">소진 필요</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Type Tabs */}
      <Tabs defaultValue="전체" className="w-full">
        <TabsList className="mb-4 w-full">
          {storageTypes.map((type) => (
            <TabsTrigger key={type} value={type} className="flex-1 text-sm">
              {type}
            </TabsTrigger>
          ))}
        </TabsList>

        {storageTypes.map((storageType) => (
          <TabsContent key={storageType} value={storageType} className="space-y-4">
            {items.length === 0 ? (
              <EmptyState />
            ) : (
              Object.entries(categorizedItems).map(([category, categoryItems]) => {
                const filteredItems =
                  storageType === '전체'
                    ? categoryItems
                    : categoryItems.filter((item) => item.storage_type === storageType)

                if (filteredItems.length === 0) return null

                return (
                  <div key={category}>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <span>{getCategoryIcon(category)}</span>
                      {category}
                      <span className="text-muted-foreground">({filteredItems.length})</span>
                    </h3>
                    <div className="space-y-2">
                      {filteredItems.map((item) => {
                        const { status, daysLeft } = getExpiryStatus(item.expiry_date)
                        return (
                          <Link
                            key={item.id}
                            href={`/fridge/${item.id}`}
                            className="block"
                          >
                            <Card className="transition-colors hover:bg-accent/50">
                              <CardContent className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-foreground">
                                      {item.ingredients?.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {item.quantity} {item.unit} · {item.storage_type}
                                    </span>
                                  </div>
                                </div>
                                {getStatusBadge(status, daysLeft)}
                              </CardContent>
                            </Card>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Leaf className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        냉장고가 비어있어요
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        식재료를 추가하고 관리를 시작하세요
      </p>
      <Button asChild>
        <Link href="/fridge/add">
          <Plus className="mr-1 h-4 w-4" />
          식재료 추가
        </Link>
      </Button>
    </div>
  )
}
