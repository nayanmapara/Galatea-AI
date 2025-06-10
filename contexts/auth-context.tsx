"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  signup: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithFacebook: () => Promise<void>
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
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName })
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password).then(() => {})
  }

  function logout() {
    return signOut(auth)
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  async function loginWithFacebook() {
    const provider = new FacebookAuthProvider()
    await signInWithPopup(auth, provider)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
