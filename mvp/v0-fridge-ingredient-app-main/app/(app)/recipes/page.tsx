import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChefHat, Clock, Users, Sparkles } from 'lucide-react'
import type { Recipe, RecipeItem, Ingredient, InventoryItem } from '@/lib/types'

type RecipeWithItems = Recipe & {
  recipe_items: (RecipeItem & { ingredients: Ingredient })[]
}

type InventoryWithIngredient = InventoryItem & { ingredients: Ingredient }

function calculateMatchPercentage(
  recipeItems: (RecipeItem & { ingredients: Ingredient })[],
  inventory: InventoryWithIngredient[]
): { percentage: number; missingItems: Ingredient[] } {
  const inventoryIngredientIds = new Set(inventory.map((item) => item.ingredient_id))
  const requiredItems = recipeItems.filter((item) => !item.is_optional)
  
  const matchingItems = requiredItems.filter((item) =>
    inventoryIngredientIds.has(item.ingredient_id)
  )
  
  const missingItems = requiredItems
    .filter((item) => !inventoryIngredientIds.has(item.ingredient_id))
    .map((item) => item.ingredients)

  const percentage = requiredItems.length > 0
    ? Math.round((matchingItems.length / requiredItems.length) * 100)
    : 0

  return { percentage, missingItems }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case '쉬움':
      return 'bg-success/10 text-success'
    case '보통':
      return 'bg-warning/10 text-warning-foreground'
    case '어려움':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export default async function RecipesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [recipesResult, inventoryResult] = await Promise.all([
    supabase
      .from('recipes')
      .select('*, recipe_items(*, ingredients(*))')
      .order('title'),
    supabase
      .from('inventory')
      .select('*, ingredients(*)')
      .eq('user_id', user!.id),
  ])

  const recipes = (recipesResult.data || []) as RecipeWithItems[]
  const inventory = (inventoryResult.data || []) as InventoryWithIngredient[]

  // Calculate match percentages and sort by match
  const recipesWithMatch = recipes.map((recipe) => {
    const { percentage, missingItems } = calculateMatchPercentage(
      recipe.recipe_items,
      inventory
    )
    return { ...recipe, matchPercentage: percentage, missingItems }
  })

  const sortedByMatch = [...recipesWithMatch].sort(
    (a, b) => b.matchPercentage - a.matchPercentage
  )

  const recommendedRecipes = sortedByMatch.filter((r) => r.matchPercentage >= 50)
  const allRecipes = recipesWithMatch

  return (
    <div className="container mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <ChefHat className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">레시피</h1>
      </div>

      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="recommended" className="flex-1">
            <Sparkles className="mr-1 h-4 w-4" />
            추천
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            전체
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-3">
          {recommendedRecipes.length === 0 ? (
            <EmptyRecommendations />
          ) : (
            recommendedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                matchPercentage={recipe.matchPercentage}
                missingItems={recipe.missingItems}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3">
          {allRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              matchPercentage={recipe.matchPercentage}
              missingItems={recipe.missingItems}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RecipeCard({
  recipe,
  matchPercentage,
  missingItems,
}: {
  recipe: Recipe
  matchPercentage: number
  missingItems: Ingredient[]
}) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{recipe.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {recipe.description}
              </p>
            </div>
            <Badge
              variant={matchPercentage >= 80 ? 'default' : 'secondary'}
              className={matchPercentage >= 80 ? 'bg-primary' : ''}
            >
              {matchPercentage}%
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className={`rounded-full px-2 py-0.5 ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {recipe.cook_time_minutes}분
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {recipe.servings}인분
            </span>
          </div>
          {missingItems.length > 0 && matchPercentage < 100 && (
            <div className="mt-2 text-xs text-muted-foreground">
              부족: {missingItems.slice(0, 3).map((i) => i.name).join(', ')}
              {missingItems.length > 3 && ` 외 ${missingItems.length - 3}개`}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

function EmptyRecommendations() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Sparkles className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        추천 레시피가 없어요
      </h3>
      <p className="text-sm text-muted-foreground">
        냉장고에 식재료를 추가하면
        <br />
        만들 수 있는 레시피를 추천해드려요
      </p>
    </div>
  )
}
