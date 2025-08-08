"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { CheckCircleIcon } from 'lucide-react'
import { signInWithDiscord } from "@/lib/auth-actions"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const searchParams = useSearchParams()

  // Check for error messages from URL params
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const messageParam = searchParams.get('message')
    
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
    
    if (messageParam) {
      setSuccessMessage(decodeURIComponent(messageParam))
    }
  }, [searchParams])

  const handleDiscordLogin = async () => {
    setError("")
    setSuccessMessage("")
    setIsLoading(true)

    try {
      await signInWithDiscord()
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Discord")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="container mx-auto px-6 pt-24 pb-16 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/favicon.png"
              alt="Galatea.AI Logo"
              width={80}
              height={80}
              className="mx-auto filter brightness-0 invert mb-4"
            />
            <h1 className="text-3xl font-bold">
              Welcome to <span className="text-teal-400">Galatea.AI</span>
            </h1>
            <p className="text-gray-400 mt-2">Sign in or create your account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
              <CheckCircleIcon size={20} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Discord Login - Primary and Only Option */}
          <div className="space-y-6">
            <Button
              onClick={handleDiscordLogin}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-6 rounded-md transition-colors duration-200 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                  </svg>
                  Continue with Discord
                </>
              )}
            </Button>

            <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Why Discord?</h3>
                <p className="text-gray-400 text-sm">
                  We use Discord for authentication to provide you with a seamless experience. 
                  Your Discord profile helps us personalize your AI companion matching.
                </p>
              </div>

              <p className="text-gray-500 text-xs">
                New to Galatea.AI? Your account will be created automatically when you sign in with Discord.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-950 to-transparent -z-10"></div>
    </div>
  )
}
