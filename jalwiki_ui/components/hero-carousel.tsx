"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/context/theme-context" // Import useTheme
import { cn } from "@/lib/utils" // Import cn

interface Technique {
  id: number
  title: string
  slug: string
  categories: { id: number; name: string; description: string }[]
  summary: string
  main_image: string
}

interface HeroCarouselProps {
  techniques: Technique[]
}

export function HeroCarousel({ techniques }: HeroCarouselProps) {
  const { darkMode } = useTheme() // Get darkMode state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % techniques.length)
  }, [techniques.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + techniques.length) % techniques.length)
  }, [techniques.length])

  useEffect(() => {
    if (!isAutoPlaying || techniques.length <= 1) return // Stop if not playing or only one slide

    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext, techniques.length])

  const pauseAutoPlay = () => setIsAutoPlaying(false)
  const resumeAutoPlay = () => setIsAutoPlaying(true)

  if (!techniques || techniques.length === 0) return null

  return (
    <div
      className="relative w-full h-[600px] overflow-hidden"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      {techniques.map((technique, index) => (
        <div
          key={technique.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={technique.main_image || "/placeholder.svg"}
              alt={technique.title}
              fill
              className="object-cover"
              priority={index === 0} // Only first image is high priority
            />
            {/* Gradient overlay for text readability, works for both themes */}
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-black/40 to-black/70"
              style={{ zIndex: 1 }}
            />

            <div className="absolute inset-0 flex items-center" style={{ zIndex: 2 }}>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl ml-0 md:ml-12">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {technique.categories.map((category) => (
                      <Badge
                        key={category.id}
                        className={cn(
                          // Common badge styles
                          "text-white", // Ensuring text is white for better contrast on these badges
                          darkMode
                            ? "bg-sky-700 hover:bg-sky-600 border border-sky-600" // Dark mode badge
                            : "bg-blue-500 hover:bg-blue-600 border border-blue-500" // Light mode badge
                        )}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  {/* Text is already white, suitable for dark overlay */}
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{technique.title}</h1>
                  <p className="text-lg text-white/90 mb-6">{technique.summary}</p>
                  {/* Button style is accent, should work for both themes */}
                  <Button
                    asChild
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md shadow-md transition-all"
                  >
                    <Link href={`/techniques/${technique.slug}`}>View Technique</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      {techniques.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center text-white transition-colors z-10",
              darkMode
                ? "bg-black/40 hover:bg-black/60" // Dark mode nav button
                : "bg-white/20 hover:bg-white/30" // Light mode nav button
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center text-white transition-colors z-10",
              darkMode
                ? "bg-black/40 hover:bg-black/60" // Dark mode nav button
                : "bg-white/20 hover:bg-white/30" // Light mode nav button
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {techniques.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {techniques.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              // Indicator colors are white-based, work well on dark overlay
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}