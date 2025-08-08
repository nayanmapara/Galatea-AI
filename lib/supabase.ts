'use client'

import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

// Create a singleton browser client and export it as `supabase`
let _supabase: SupabaseClient | null = null
export const supabase: SupabaseClient = (() => {
  if (!_supabase) {
    _supabase = createClient() as SupabaseClient
  }
  return _supabase
})()
