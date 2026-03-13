import { createClient } from '@/lib/supabase/server'
import { AddIngredientForm } from '@/components/add-ingredient-form'
import type { Ingredient } from '@/lib/types'

export default async function AddIngredientPage() {
  const supabase = await createClient()

  const { data: ingredients } = await supabase
    .from('ingredients')
    .select('*')
    .order('category')
    .order('name')

  return (
    <div className="container mx-auto max-w-lg px-4 py-6">
      <AddIngredientForm ingredients={(ingredients || []) as Ingredient[]} />
    </div>
  )
}
