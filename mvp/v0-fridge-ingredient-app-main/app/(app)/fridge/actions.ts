'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addInventoryItem(data: {
  ingredient_id: string
  quantity: number
  unit: string
  storage_type: string
  expiry_date: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase.from('inventory').insert({
    user_id: user.id,
    ingredient_id: data.ingredient_id,
    quantity: data.quantity,
    unit: data.unit,
    storage_type: data.storage_type,
    expiry_date: data.expiry_date,
    status: 'fresh',
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/fridge')
}

export async function updateInventoryItem(
  id: string,
  data: {
    quantity?: number
    unit?: string
    storage_type?: string
    expiry_date?: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('inventory')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/fridge')
}

export async function deleteInventoryItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/fridge')
}

export async function consumeInventoryItem(id: string, consumedQuantity: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: item, error: fetchError } = await supabase
    .from('inventory')
    .select('quantity')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  const newQuantity = item.quantity - consumedQuantity

  if (newQuantity <= 0) {
    await deleteInventoryItem(id)
  } else {
    await updateInventoryItem(id, { quantity: newQuantity })
  }

  revalidatePath('/fridge')
}
