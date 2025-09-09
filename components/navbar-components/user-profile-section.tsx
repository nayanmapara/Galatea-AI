"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Settings, LogOut } from "lucide-react"
import { NavbarProps } from "./navbar-types"

interface UserProfileSectionProps {
  currentUser: NavbarProps["currentUser"]
  handleLogout: NavbarProps["handleLogout"]
  mounted: NavbarProps["mounted"]
  isAuthPage: NavbarProps["isAuthPage"]
}

export function UserProfileSection({ 
  currentUser, 
  handleLogout, 
  mounted, 
  isAuthPage 
}: UserProfileSectionProps) {
  if (!mounted) {
    // Show loading state during hydration
    return <div className="w-24 h-8 bg-gray-700 rounded animate-pulse"></div>
  }

  if (currentUser && !isAuthPage) {
    return (
      <>
        {/* Profile Section - Clickable */}
        <Link
          href="/dashboard"
          className="flex items-center space-x-3 text-gray-300 hover:text-teal-400 transition-colors group"
        >
          {/* Profile Picture */}
          {currentUser.user_metadata?.avatar_url ? (
            <img
              src={currentUser.user_metadata.avatar_url || "/placeholder.svg"}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-teal-500 group-hover:border-teal-400 transition-colors"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-teal-500 group-hover:bg-teal-400 transition-colors flex items-center justify-center">
              <User size={18} className="text-black" />
            </div>
          )}
          {/* Username */}
          <span className="text-sm font-medium">
            {currentUser.user_metadata?.full_name ||
              currentUser.user_metadata?.name ||
              currentUser.user_metadata?.preferred_username ||
              currentUser.email?.split("@")[0]}
          </span>
        </Link>

        {/* Quick Action Buttons */}
        <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:text-teal-400 hover:bg-black/20">
          <Link href="/profile">
            <Settings size={18} />
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-gray-300 hover:text-red-400 hover:bg-black/20"
        >
          <LogOut size={18} />
        </Button>
      </>
    )
  }

  if (!currentUser && !isAuthPage) {
    return (
      <Button className="bg-teal-500 text-black hover:bg-teal-400" asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
    )
  }

  return null
}
