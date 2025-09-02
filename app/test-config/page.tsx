"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function TestSupabasePage() {
  const [config, setConfig] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // Check if the config script worked
      const injectedConfig = (globalThis as any).__SUPABASE
      setConfig({
        injected: injectedConfig,
        env: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      })
    }
  }, [mounted])

  const testSupabaseClient = async () => {
    try {
      const { createClient } = await import("@/utils/supabase/client")
      const supabase = createClient()
      alert("Supabase client created successfully!")
      console.log("Supabase client:", supabase)
    } catch (error) {
      alert(`Error: ${error}`)
      console.error("Error creating Supabase client:", error)
    }
  }

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Test Supabase Configuration</h1>
      
      <div className="mb-8">
        <Button onClick={testSupabaseClient} className="bg-blue-600 hover:bg-blue-700">
          Test Supabase Client Creation
        </Button>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Configuration Status:</h2>
        <pre className="text-sm overflow-auto whitespace-pre-wrap">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  )
}
