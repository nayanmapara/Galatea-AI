"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/sign-in")
    }
  }, [currentUser, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-teal-400 text-2xl">Loading...</div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return <>{children}</>
}
