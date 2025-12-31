'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type AuthProvider = 'github' | 'google'

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return user
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    return null
  }

  return session
}
