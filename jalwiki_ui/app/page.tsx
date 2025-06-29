"use client"

import Link from "next/link"
import { ArrowDown } from "lucide-react"

import { techniques } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { HeroCarousel } from "@/components/hero-carousel"
import { ServicesGrid } from "@/components/services-grid"
import { UserScroller } from "@/components/user-scroller" // Ensure this component is also themed
import { QuoteBox } from "@/components/quote-box"
import { HashtagSection } from "@/components/hashtag-section"
import { useTheme } from "@/context/theme-context" // Import useTheme
import { cn } from "@/lib/utils" // Import cn

export default function HomePage() {
  const { darkMode } = useTheme() // Get darkMode state

  return (
    // The main page background (e.g., bg-gray-950) is assumed to be set by a higher-level layout component
    <main className="min-h-screen">
      {/* Hero Section - No explicit background, inherits from main layout */}
      <section className="relative w-full">
        <HeroCarousel techniques={techniques} />
      </section>

      {/* What We Do Section */}
      <section
        className={cn(
          "relative py-16 px-4 sm:px-6 lg:px-8",
          darkMode ? "bg-gray-900" : "bg-white" // Dark mode background
        )}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            {/* "Get Started" Button - Accent color, generally works for both themes */}
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md shadow-md transition-all"
            >
              <Link href="/techniques">Get Started</Link>
            </Button>
            {/* Scroll Down Button */}
            <button
              onClick={() => {
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
              }}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full bg-transparent transition-colors",
                darkMode
                  ? "text-purple-400 hover:bg-purple-800/30" // Dark mode scroll button
                  : "text-purple-600 hover:bg-purple-50" // Light mode scroll button
              )}
              aria-label="Scroll to next section"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section
        id="services"
        className={cn(
          "py-16 px-4 sm:px-6 lg:px-8",
          darkMode ? "bg-gray-800" : "bg-blue-50" // Dark mode background
        )}
      >
        <div className="container mx-auto max-w-6xl">
          <h2
            className={cn(
              "text-3xl font-bold text-center mb-12",
              darkMode ? "text-gray-100" : "text-gray-900" // Dark mode heading
            )}
          >
            Our Services
          </h2>
          <ServicesGrid /> {/* Assumed to be themed */}
        </div>
      </section>

      {/* Who Are Our Users Section */}
      <section
        className={cn(
          "py-16 px-4 sm:px-6 lg:px-8",
          darkMode ? "bg-gray-900" : "bg-white" // Dark mode background
        )}
      >
        <div className="container mx-auto max-w-6xl">
          <h2
            className={cn(
              "text-3xl font-bold text-center mb-12",
              darkMode ? "text-gray-100" : "text-gray-900" // Dark mode heading
            )}
          >
            Who Are Our Users
          </h2>
          <UserScroller /> {/* Ensure UserScroller is themed */}
        </div>
      </section>

      {/* Quote Box Section */}
      <section
        className={cn(
          "py-16 px-4 sm:px-6 lg:px-8",
          darkMode ? "bg-gray-900" : "bg-white" // Dark mode background
        )}
      >
        <div className="container mx-auto max-w-4xl">
          <QuoteBox /> {/* Assumed to be themed */}
        </div>
      </section>

      {/* Hashtag Section */}
      <section
        className={cn(
          "py-16 px-4 sm:px-6 lg:px-8",
          darkMode ? "bg-gray-900" : "bg-white" // Dark mode background
        )}
      >
        <div className="container mx-auto max-w-6xl">
          <HashtagSection /> {/* Assumed to be themed */}
        </div>
      </section>
    </main>
  )
}