"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Heart, Mail, Lock, User, Sparkles } from "lucide-react"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (!firstName.trim()) {
      setError("Please enter your first name")
      return
    }

    setIsLoading(true)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName.trim()
          }
        }
      })
      
      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }
      
      setSuccessMessage("Check your email to confirm your account before signing in.")
      setIsLoading(false)
    } catch (e: any) {
      setError(e?.message || "Failed to sign up with email")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Welcome Content */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-teal-400" />
              <h1 className="text-4xl font-bold mb-4">Start Your Journey</h1>
              <p className="text-lg text-gray-300">
                Join thousands of users building confidence and making meaningful connections with AI companions.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-left border border-gray-800">
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 mr-2 text-teal-400" />
                  <span className="font-semibold">Build Confidence</span>
                </div>
                <p className="text-sm text-gray-400">Practice conversations in a judgment-free zone</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-left border border-gray-800">
                <div className="flex items-center mb-2">
                  <Sparkles className="w-5 h-5 mr-2 text-teal-400" />
                  <span className="font-semibold">Meaningful Conversations</span>
                </div>
                <p className="text-sm text-gray-400">Engage in deep, thoughtful discussions anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <Heart className="w-12 h-12 mx-auto mb-4 text-teal-400" />
              <h1 className="text-3xl font-bold text-white">Join Galatea.AI</h1>
              <p className="text-gray-400 mt-2">Create your account and start connecting</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Join our community and build your confidence</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-900/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-gray-900 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-gray-900 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-gray-900 text-white placeholder-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-gray-900 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  required
                  className="w-4 h-4 text-teal-500 border-gray-600 rounded focus:ring-teal-500 bg-gray-900 mt-1" 
                />
                <span className="ml-2 text-sm text-gray-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-teal-400 hover:text-teal-300">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-teal-400 hover:text-teal-300">Privacy Policy</Link>
                </span>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-500 hover:bg-teal-400 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating your account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link 
                  href="/sign-in" 
                  className="font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-teal-900/20 rounded-lg border border-teal-500/30">
              <p className="text-xs text-teal-400 text-center">
                🎉 Join over 10,000 users building confidence with AI companions!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}