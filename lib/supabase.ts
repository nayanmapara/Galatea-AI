import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error("Supabase URL is missing. Please set NEXT_PUBLIC_SUPABASE_URL environment variable.")
}

if (!supabaseAnonKey) {
  console.error("Supabase anon key is missing. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.")
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

export default supabase
