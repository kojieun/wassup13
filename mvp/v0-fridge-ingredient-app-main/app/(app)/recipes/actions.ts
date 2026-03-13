'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function completeCooking(data: {
  recipe_id: string
  consumed_ingredients: { ingredient_id: string; quantity: number }[]
  rating?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Record cooking history
  const { error: historyError } = await supabase.from('cooking_history').insert({
    user_id: user.id,
    recipe_id: data.recipe_id,
    cooked_at: new Date().toISOString(),
    rating: data.rating || null,
    saved_ingredients: data.consumed_ingredients,
  })

  if (historyError) {
    throw new Error(historyError.message)
  }

  // Update inventory (reduce quantities)
  for (const consumed of data.consumed_ingredients) {
    // Get current inventory item
    const { data: inventoryItems } = await supabase
      .from('inventory')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('ingredient_id', consumed.ingredient_id)
      .order('expiry_date', { ascending: true })
      .limit(1)

    if (inventoryItems && inventoryItems.length > 0) {
      const item = inventoryItems[0]
      const newQuantity = item.quantity - consumed.quantity

      if (newQuantity <= 0) {
        await supabase.from('inventory').delete().eq('id', item.id)
      } else {
        await supabase
          .from('inventory')
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', item.id)
      }
    }
  }

  // Create notification for successful cooking
  await supabase.from('notifications').insert({
    user_id: user.id,
    type: 'TIP',
    title: '요리 완료!',
    content: '맛있는 식사 되세요. 사용한 재료가 자동으로 차감되었습니다.',
    sent_at: new Date().toISOString(),
  })

  revalidatePath('/fridge')
  revalidatePath('/recipes')
  revalidatePath('/notifications')
}

export async function rateCooking(historyId: string, rating: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('cooking_history')
    .update({ rating })
    .eq('id', historyId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/recipes')
}
