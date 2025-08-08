"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { headers } from "next/headers"

export async function signInWithDiscord() {
  const supabase = createClient()
  
  const origin = headers().get("origin")
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Error signing in with Discord:", error)
    redirect("/sign-in?error=discord_auth_error")
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Error signing in:", error)
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/start-swiping")
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const supabase = createClient()
  
  const origin = headers().get("origin")

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) {
    console.error("Error signing up:", error)
    redirect(`/sign-up?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/sign-up?message=Check your email to confirm your account")
}

export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error("Error signing out:", error)
    redirect("/sign-in?error=signout_error")
  }
  
  redirect("/sign-in")
}

export async function getUser() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error("Error getting user:", error)
    return null
  }
  
  return user
}
