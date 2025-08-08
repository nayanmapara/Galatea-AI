import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code?: string; error?: string }
}) {
  const supabase = await createClient()

  if (searchParams.error) {
    redirect('/sign-in?error=' + encodeURIComponent(searchParams.error))
  }

  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code)
    
    if (error) {
      redirect('/sign-in?error=' + encodeURIComponent(error.message))
    }
  }

  // Successful authentication, redirect to profile or dashboard
  redirect('/profile')
}
