"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { useAuth } from "@/contexts/simple-auth-context"
import { 
  DesktopNavigation, 
  UserProfileSection, 
  MobileNavigation, 
  MobileMenuButton 
} from "@/components/navbar-components"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { currentUser, logout } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  // Check if we're on an authentication page
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/60 backdrop-blur-md border-b border-teal-500/20" : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
        
        <DesktopNavigation currentUser={currentUser} />

        <div className="hidden md:flex space-x-4 items-center">
          <UserProfileSection 
            currentUser={currentUser}
            handleLogout={handleLogout}
            mounted={mounted}
            isAuthPage={isAuthPage}
          />
        </div>

        <MobileMenuButton 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </nav>

      <MobileNavigation 
        currentUser={currentUser}
        handleLogout={handleLogout}
        mounted={mounted}
        isAuthPage={isAuthPage}
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </header>
  )
}
