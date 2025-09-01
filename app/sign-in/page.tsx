"use client"

import { Suspense, useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { createSimpleClient as createClient } from "@/lib/supabase/simple-client"

function SignInContent() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      setSuccessMessage("Check your email to confirm your account.");
      setIsLoading(false);
    } catch (e: any) {
      setError(e?.message || "Failed to sign up with email");
      setIsLoading(false);
    }
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      window.location.href = "/dashboard";
    } catch (e: any) {
      setError(e?.message || "Failed to sign in with email");
      setIsLoading(false);
    }
  } 
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get("error")
    const messageParam = searchParams.get("message")
    if (errorParam) setError(decodeURIComponent(errorParam))
    if (messageParam) setSuccessMessage(decodeURIComponent(messageParam))
  }, [searchParams])

  const handleDiscordLogin = async () => {
    setError("")
    setSuccessMessage("")
    setIsLoading(true)
    
    try {
      const supabase = createClient()

      const redirectTo = `${window.location.origin}/auth/callback`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo,
          scopes: "identify email",
        },
      })

      if (error) {
        console.error("Discord OAuth error:", error)
        throw error
      }

      // The user will be redirected to Discord, then back to the callback
      // The callback will handle the session exchange and redirect to dashboard
      console.log("Redirecting to Discord OAuth...")
      
    } catch (e: any) {
      console.error("Login error:", e)
      setError(e?.message || "Failed to sign in with Discord")
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
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-md mb-6">
              {successMessage}
            </div>
          )}

          <div className="space-y-6">
            <Button
              onClick={handleDiscordLogin}
              disabled={isLoading}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-6 rounded-md transition-colors duration-200 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Continue with Discord
                </>
              )}
            </Button>


            {mode === 'sign-in' ? (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-800 text-white focus:border-teal-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-800 text-white focus:border-teal-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-black font-medium py-3 rounded-md transition-colors duration-200"
                >
                  {isLoading ? "Signing in..." : "Sign In with Email"}
                </Button>
                <p className="text-xs text-gray-400 pt-2">Don't have an account? <button type="button" className="text-teal-400 underline" onClick={() => { setMode('sign-up'); setError(""); setSuccessMessage(""); }}>Sign up</button></p>
              </form>
            ) : (
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-800 text-white focus:border-teal-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-800 text-white focus:border-teal-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-black font-medium py-3 rounded-md transition-colors duration-200"
                >
                  {isLoading ? "Signing up..." : "Sign Up with Email"}
                </Button>
                <p className="text-xs text-gray-400 pt-2">Already have an account? <button type="button" className="text-teal-400 underline" onClick={() => { setMode('sign-in'); setError(""); setSuccessMessage(""); }}>Sign in</button></p>
              </form>
            )}

            <p className="text-center text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy. Powered by Supabase authentication.
            </p>
          </div>
        </div>
      </main>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-950 to-transparent -z-10" />
    </div>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-6">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
