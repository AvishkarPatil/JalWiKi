"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link" // Keep for commented out header example
import { SidebarNav } from "@/components/forum_comp/sidebar-nav"
import { UserDetails } from "@/components/forum_comp/user-details"
import { MobileNav } from "@/components/forum_comp/mobile-nav"
// import { SearchBar } from "@/components/forum_comp/search-bar"; // Is commented out in JSX
import { Button } from "@/components/ui/button"; // Keep for commented out header example
import { Droplet, Menu, User, Bell } from "lucide-react"; // Keep for commented out header example

import { useTheme } from "@/context/theme-context"; // Import useTheme
import { cn } from "@/lib/utils"; // Import cn

export function ForumLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // const [searchQuery, setSearchQuery] = useState("") // Not used as SearchBar is commented

  // const handleSearch = (query: string) => { // Not used as SearchBar is commented
  //   setSearchQuery(query)
  // }

  const { darkMode } = useTheme(); // Get darkMode state

  return (
    <div className={cn(
      "min-h-screen",
      darkMode ? "bg-gray-950 text-gray-200" : "bg-gray-100 text-gray-900" // Page background and default text
    )}>
      {/* Top Navigation - Example of how it would be themed if active */}
      {/*
      <header className={cn(
        "sticky top-0 z-50 w-full border-b shadow-sm",
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "mr-2 md:hidden",
              darkMode ? "text-gray-400 hover:bg-gray-700/60 hover:text-purple-400" : "text-gray-500 hover:bg-gray-100 hover:text-purple-600"
            )}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <Link href="/" className="flex items-center gap-2 mr-6">
            <Droplet className={cn("h-6 w-6", darkMode ? "text-purple-400" : "text-purple-600")} />
            <span className={cn(
              "text-xl font-bold",
              darkMode ? "text-purple-400" : "text-purple-700"
            )}>WaterForum</span>
          </Link>

          <div className="hidden md:flex md:flex-1 items-center justify-end gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={cn(darkMode ? "text-gray-400 hover:text-purple-400 hover:bg-gray-700/60" : "text-gray-500 hover:text-purple-600")}
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full", darkMode ? "text-gray-400 hover:text-purple-400 hover:bg-gray-700/60" : "text-gray-500 hover:text-purple-600")}
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>
      </header>
      */}

      {/* Mobile Navigation */}
      {/* MobileNav component is expected to handle its own dark theme internally */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Search Bar - Centered at the top */}
      {/* The container for SearchBar doesn't need specific bg, it sits on the page bg. */}
      {/* SearchBar itself should be themed if uncommented. */}
      <div className="container px-4 py-6">
        {/*<SearchBar onSearch={handleSearch} />*/}
      </div>

      {/* Main Content with Sidebars */}
      {/* The grid container also sits on the page bg. */}
      <div className="container px-4 pb-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Sidebar - Navigation */}
        {/* SidebarNav component is expected to handle its own dark theme internally. */}
        {/* It will sit on the main page background (bg-gray-950 in dark mode). */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-2">
          <SidebarNav />
        </aside>

        {/* Main Content */}
        {/* The main content area also sits on the page bg. */}
        {/* Children components (like ThreadList cards) will have their own backgrounds. */}
        <main className="md:col-span-6 lg:col-span-7">{children}</main>

        {/* Right Sidebar - User Details */}
        {/* UserDetails component is expected to handle its own dark theme internally. */}
        {/* It will sit on the main page background. */}
        <aside className="hidden md:block md:col-span-3">
          <UserDetails />
        </aside>
      </div>
    </div>
  )
}