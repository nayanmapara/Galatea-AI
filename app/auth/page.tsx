"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to sign-in page since this is the auth entry point
    router.replace("/sign-in")
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
        <p className="text-white">Redirecting to sign in...</p>
      </div>
    </div>
  )
}