"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()
      
      setResult({
        success: !error,
        session: data.session,
        error: error?.message,
        timestamp: new Date().toISOString()
      })
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const testDiscordAuth = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "identify email",
        },
      })
      
      if (error) {
        setResult({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      }
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Supabase Connection</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={testConnection} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Testing..." : "Test Connection"}
          </Button>
          
          <Button 
            onClick={testDiscordAuth} 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? "Testing..." : "Test Discord Auth"}
          </Button>
        </div>

        {result && (
          <div className="bg-gray-900 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Result:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Environment Check:</h2>
          <pre className="text-sm">
            {JSON.stringify({
              hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
              hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'server-side'
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
