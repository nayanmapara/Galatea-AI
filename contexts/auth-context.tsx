"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  signup: (email: string, password: string, displayName: string) => Promise<User>
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<User>
  loginWithFacebook: () => Promise<User>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function signup(email: string, password: string, displayName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("No user returned from signup")
      }

      return data.user
    } catch (error: any) {
      console.error("Error in signup:", error)
      throw new Error(error.message || "Failed to create account")
    }
  }

  async function login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("No user returned from login")
      }

      return data.user
    } catch (error: any) {
      console.error("Error in login:", error)
      throw new Error(error.message || "Failed to sign in")
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Error in logout:", error)
      throw new Error(error.message || "Failed to sign out")
    }
  }

  async function loginWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("No user returned from Google login")
      }

      return data.user
    } catch (error: any) {
      console.error("Error in Google login:", error)
      throw new Error(error.message || "Failed to sign in with Google")
    }
  }

  async function loginWithFacebook() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("No user returned from Facebook login")
      }

      return data.user
    } catch (error: any) {
      console.error("Error in Facebook login:", error)
      throw new Error(error.message || "Failed to sign in with Facebook")
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setCurrentUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    loginWithFacebook,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
