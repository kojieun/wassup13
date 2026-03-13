'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Clock, Users, Play, Check, ChefHat, Loader2 } from 'lucide-react'
import { completeCooking } from '@/app/(app)/recipes/actions'
import type { Recipe, RecipeItem, Ingredient, InventoryItem } from '@/lib/types'

type RecipeWithItems = Recipe & {
  recipe_items: (RecipeItem & { ingredients: Ingredient })[]
}

type InventoryWithIngredient = InventoryItem & { ingredients: Ingredient }

interface RecipeStep {
  step: number
  instruction: string
}

export function RecipeDetailView({
  recipe,
  inventory,
}: {
  recipe: RecipeWithItems
  inventory: InventoryWithIngredient[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isCooking, setIsCooking] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const inventoryIngredientIds = new Set(inventory.map((item) => item.ingredient_id))
  
  const requiredIngredients = recipe.recipe_items.filter((item) => !item.is_optional)
  const optionalIngredients = recipe.recipe_items.filter((item) => item.is_optional)
  
  const hasIngredient = (ingredientId: string) => inventoryIngredientIds.has(ingredientId)

  const steps = recipe.steps as RecipeStep[]
  const progress = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepIndex)
        ? prev.filter((s) => s !== stepIndex)
        : [...prev, stepIndex]
    )
  }

  const handleStartCooking = () => {
    setIsCooking(true)
    setCurrentStep(0)
    setCompletedSteps([])
  }

  const handleCompleteCooking = () => {
    startTransition(async () => {
      // Get consumed ingredients from inventory
      const consumedIngredients = recipe.recipe_items
        .filter((item) => hasIngredient(item.ingredient_id))
        .map((item) => ({
          ingredient_id: item.ingredient_id,
          quantity: item.quantity,
        }))

      await completeCooking({
        recipe_id: recipe.id,
        consumed_ingredients: consumedIngredients,
      })

      router.push('/recipes')
      router.refresh()
    })
  }

  if (isCooking) {
    return (
      <CookingMode
        recipe={recipe}
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        progress={progress}
        onToggleStep={toggleStep}
        onBack={() => setIsCooking(false)}
        onComplete={handleCompleteCooking}
        isPending={isPending}
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-xl font-bold text-foreground">{recipe.title}</h1>
      </div>

      {/* Recipe Info */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <p className="mb-4 text-muted-foreground">{recipe.description}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {recipe.cook_time_minutes}분
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {recipe.servings}인분
            </Badge>
            <Badge variant="outline">{recipe.difficulty}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">필요한 재료</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiredIngredients.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-foreground">필수 재료</h4>
              <div className="space-y-2">
                {requiredIngredients.map((item) => (
                  <IngredientRow
                    key={item.id}
                    item={item}
                    hasIngredient={hasIngredient(item.ingredient_id)}
                  />
                ))}
              </div>
            </div>
          )}
          {optionalIngredients.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">선택 재료</h4>
              <div className="space-y-2">
                {optionalIngredients.map((item) => (
                  <IngredientRow
                    key={item.id}
                    item={item}
                    hasIngredient={hasIngredient(item.ingredient_id)}
                    isOptional
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Steps Preview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">조리 순서</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {step.step}
                </span>
                <span className="text-muted-foreground">{step.instruction}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Start Cooking Button */}
      <Button onClick={handleStartCooking} className="w-full" size="lg">
        <Play className="mr-2 h-4 w-4" />
        요리 시작하기
      </Button>
    </div>
  )
}

function IngredientRow({
  item,
  hasIngredient,
  isOptional = false,
}: {
  item: RecipeItem & { ingredients: Ingredient }
  hasIngredient: boolean
  isOptional?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={hasIngredient ? 'text-foreground' : 'text-muted-foreground'}>
        {item.ingredients?.name}
        {isOptional && ' (선택)'}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">
          {item.quantity} {item.unit}
        </span>
        {hasIngredient ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <span className="text-xs text-warning">부족</span>
        )}
      </div>
    </div>
  )
}

function CookingMode({
  recipe,
  steps,
  currentStep,
  completedSteps,
  progress,
  onToggleStep,
  onBack,
  onComplete,
  isPending,
}: {
  recipe: Recipe
  steps: RecipeStep[]
  currentStep: number
  completedSteps: number[]
  progress: number
  onToggleStep: (step: number) => void
  onBack: () => void
  onComplete: () => void
  isPending: boolean
}) {
  const allCompleted = completedSteps.length === steps.length

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">{recipe.title}</h1>
          <p className="text-xs text-muted-foreground">요리 중...</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <ChefHat className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">진행률</span>
            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="mb-6 space-y-3">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index)
          return (
            <Card
              key={index}
              className={isCompleted ? 'border-primary/50 bg-accent/50' : ''}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => onToggleStep(index)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-medium text-primary">
                        STEP {step.step}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        isCompleted
                          ? 'text-muted-foreground line-through'
                          : 'text-foreground'
                      }`}
                    >
                      {step.instruction}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Complete Button */}
      <Button
        onClick={onComplete}
        disabled={!allCompleted || isPending}
        className="w-full"
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            저장 중...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            요리 완료
          </>
        )}
      </Button>
    </div>
  )
}
