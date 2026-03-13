'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, Search, Check, Loader2 } from 'lucide-react'
import { addInventoryItem } from '@/app/(app)/fridge/actions'
import type { Ingredient } from '@/lib/types'

const categories = [
  { id: '채소', label: '채소', icon: '🥬' },
  { id: '육류', label: '육류', icon: '🥩' },
  { id: '해산물', label: '해산물', icon: '🐟' },
  { id: '유제품', label: '유제품', icon: '🥛' },
  { id: '양념', label: '양념', icon: '🧂' },
  { id: '곡류', label: '곡류', icon: '🍚' },
  { id: '과일', label: '과일', icon: '🍎' },
]

const storageTypes = [
  { id: '냉장', label: '냉장' },
  { id: '냉동', label: '냉동' },
  { id: '실온', label: '실온' },
]

export function AddIngredientForm({ ingredients }: { ingredients: Ingredient[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<'select' | 'details'>('select')
  const [selectedCategory, setSelectedCategory] = useState<string>('채소')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [quantity, setQuantity] = useState('1')
  const [storageType, setStorageType] = useState('냉장')
  const [expiryDays, setExpiryDays] = useState('7')

  const filteredIngredients = ingredients.filter(
    (ing) =>
      ing.category === selectedCategory &&
      ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setExpiryDays(String(ingredient.default_shelf_life_days))
    setStep('details')
  }

  const handleSubmit = () => {
    if (!selectedIngredient) return

    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays))

    startTransition(async () => {
      await addInventoryItem({
        ingredient_id: selectedIngredient.id,
        quantity: parseFloat(quantity),
        unit: selectedIngredient.default_unit,
        storage_type: storageType,
        expiry_date: expiryDate.toISOString().split('T')[0],
      })
      router.push('/fridge')
      router.refresh()
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === 'details' ? setStep('select') : router.back())}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">
          {step === 'select' ? '식재료 선택' : '상세 정보'}
        </h1>
      </div>

      {step === 'select' ? (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="식재료 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Tabs */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="flex-shrink-0"
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Ingredients Grid */}
          <div className="grid grid-cols-3 gap-2">
            {filteredIngredients.map((ingredient) => (
              <Card
                key={ingredient.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedIngredient?.id === ingredient.id
                    ? 'border-primary bg-accent'
                    : ''
                }`}
                onClick={() => handleSelectIngredient(ingredient)}
              >
                <CardContent className="flex flex-col items-center justify-center p-3 text-center">
                  <span className="mb-1 text-2xl">
                    {categories.find((c) => c.id === ingredient.category)?.icon}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {ingredient.name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIngredients.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              검색 결과가 없습니다
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          {/* Selected Ingredient */}
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-2xl">
                {categories.find((c) => c.id === selectedIngredient?.category)?.icon}
              </div>
              <div>
                <p className="font-semibold text-foreground">{selectedIngredient?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedIngredient?.category}</p>
              </div>
              <Check className="ml-auto h-5 w-5 text-primary" />
            </CardContent>
          </Card>

          {/* Quantity */}
          <div className="space-y-2">
            <Label>수량</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0.1"
                step="0.1"
                className="w-24"
              />
              <span className="text-muted-foreground">{selectedIngredient?.default_unit}</span>
            </div>
          </div>

          {/* Storage Type */}
          <div className="space-y-2">
            <Label>보관 방법</Label>
            <RadioGroup
              value={storageType}
              onValueChange={setStorageType}
              className="flex gap-4"
            >
              {storageTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.id} id={type.id} />
                  <Label htmlFor={type.id} className="cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label>유통기한 (일)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                min="1"
                className="w-24"
              />
              <span className="text-muted-foreground">일 후</span>
            </div>
            <p className="text-xs text-muted-foreground">
              예상 유통기한:{' '}
              {new Date(
                Date.now() + parseInt(expiryDays || '0') * 24 * 60 * 60 * 1000
              ).toLocaleDateString('ko-KR')}
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                추가 중...
              </>
            ) : (
              '냉장고에 추가'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
