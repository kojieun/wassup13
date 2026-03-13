import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RecipeDetailView } from '@/components/recipe-detail-view'
import type { Recipe, RecipeItem, Ingredient, InventoryItem } from '@/lib/types'

type RecipeWithItems = Recipe & {
  recipe_items: (RecipeItem & { ingredients: Ingredient })[]
}

type InventoryWithIngredient = InventoryItem & { ingredients: Ingredient }

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [recipeResult, inventoryResult] = await Promise.all([
    supabase
      .from('recipes')
      .select('*, recipe_items(*, ingredients(*))')
      .eq('id', id)
      .single(),
    supabase
      .from('inventory')
      .select('*, ingredients(*)')
      .eq('user_id', user!.id),
  ])

  if (recipeResult.error || !recipeResult.data) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-6">
      <RecipeDetailView
        recipe={recipeResult.data as RecipeWithItems}
        inventory={(inventoryResult.data || []) as InventoryWithIngredient[]}
      />
    </div>
  )
}
