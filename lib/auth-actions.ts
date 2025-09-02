"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function signInWithDiscord() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    }
  })

  if (error) {
    console.error('Discord sign in error:', error)
    redirect('/sign-in?error=' + encodeURIComponent(error.message))
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/sign-in?error=' + encodeURIComponent(error.message))
  }

  redirect('/')
}

export async function signUp(email: string, password: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/sign-up?error=' + encodeURIComponent(error.message))
  }

  redirect('/sign-in?message=' + encodeURIComponent('Check your email to confirm your account'))
}

export async function signOut() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign out error:', error)
  }

  redirect('/')
}
