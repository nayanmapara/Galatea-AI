"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"
import { UserIcon, LogOutIcon, MenuIcon, XIcon } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/70 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-10 w-10" />
            <span className="text-xl font-bold text-white">Galatea.AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white/80 hover:text-teal-400 transition-colors">
              Home
            </Link>
            <Link href="/companions" className="text-white/80 hover:text-teal-400 transition-colors">
              Companions
            </Link>
            <Link href="/about" className="text-white/80 hover:text-teal-400 transition-colors">
              About
            </Link>
            <Link href="/start-swiping" className="text-white/80 hover:text-teal-400 transition-colors">
              Start Swiping
            </Link>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                    <UserIcon className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-white/10">
                  <LogOutIcon className="h-5 w-5" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-teal-500 text-black hover:bg-teal-400">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-4 pb-4">
            <Link
              href="/"
              className="text-white/80 hover:text-teal-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/companions"
              className="text-white/80 hover:text-teal-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Companions
            </Link>
            <Link
              href="/about"
              className="text-white/80 hover:text-teal-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/start-swiping"
              className="text-white/80 hover:text-teal-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start Swiping
            </Link>
            {currentUser ? (
              <>
                <Link
                  href="/profile"
                  className="text-white/80 hover:text-teal-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="justify-start p-0 hover:bg-transparent hover:text-teal-400"
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-white/80 hover:text-teal-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-white/80 hover:text-teal-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
