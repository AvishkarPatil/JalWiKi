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
            {/* Localized gradient overlay only over text area */}
            <div
              className="absolute inset-y-0 left-0 w-1/2 lg:w-2/5 bg-gradient-to-r from-black/80 via-black/60 to-transparent"
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
                            ? "bg-primary/90 hover:bg-primary/80 border border-primary/80"
                            : "bg-primary hover:bg-primary/90 border border-primary/90"
                        )}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  {/* White text for contrast against dark gradient */}
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{technique.title}</h1>
                  <p className="text-lg text-white/90 mb-6">{technique.summary}</p>
                  <Button
                    asChild
                    className="font-medium px-6 py-2 shadow-md"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center text-white bg-black/20 hover:bg-black/40 transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center text-white bg-black/20 hover:bg-black/40 transition-colors z-10"
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
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === currentIndex
                  ? "bg-primary"
                  : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}