import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { IngredientDetail } from '@/components/ingredient-detail'
import type { InventoryItem, Ingredient } from '@/lib/types'

type InventoryWithIngredient = InventoryItem & { ingredients: Ingredient }

export default async function IngredientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item, error } = await supabase
    .from('inventory')
    .select('*, ingredients(*)')
    .eq('id', id)
    .single()

  if (error || !item) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-6">
      <IngredientDetail item={item as InventoryWithIngredient} />
    </div>
  )
}
