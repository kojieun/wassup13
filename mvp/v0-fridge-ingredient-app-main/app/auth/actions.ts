'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/auth/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/fridge')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string
  const householdSize = parseInt(formData.get('household_size') as string) || 1

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      data: {
        nickname,
        household_size: householdSize,
      },
    },
  })

  if (error) {
    redirect('/auth/sign-up?error=' + encodeURIComponent(error.message))
  }

  redirect('/auth/sign-up-success')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const nickname = formData.get('nickname') as string
  const householdSize = parseInt(formData.get('household_size') as string) || 1
  const allergyInfo = (formData.get('allergy_info') as string)?.split(',').filter(Boolean) || []
  const dietaryPreference = formData.get('dietary_preference') as string || null

  const { error } = await supabase
    .from('profiles')
    .update({
      nickname,
      household_size: householdSize,
      allergy_info: allergyInfo,
      dietary_preference: dietaryPreference,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings')
  return { success: true }
}
