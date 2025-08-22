"use client"

import { useState, useEffect } from "react"
import { Quote as QuoteIcon } from "lucide-react" // Renamed to avoid conflict if Quote type is used
import { useTheme } from "@/context/theme-context"; // Import useTheme
import { cn } from "@/lib/utils"; // Import cn

const quotes = [
  {
    text: "Thousands have lived without love, not one without water.",
    author: "W. H. Auden",
  },
  {
    text: "When the well is dry, we know the worth of water.",
    author: "Benjamin Franklin",
  },
  {
    text: "Water is the driving force of all nature.",
    author: "Leonardo da Vinci",
  },
  {
    text: "We forget that the water cycle and the life cycle are one.",
    author: "Jacques Yves Cousteau",
  },
  {
    text: "A drop of water is worth more than a sack of gold to a thirsty man.",
    author: "Traditional Proverb",
  },
]

export function QuoteBox() {
  const { darkMode } = useTheme(); // Get darkMode state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length)
        setIsTransitioning(false)
      }, 500) // Transition duration
    }, 10000) // Time each quote is displayed

    return () => clearInterval(interval)
  }, [])

  const currentQuote = quotes[currentQuoteIndex]

  return (
    <div
      className={cn(
        "max-w-3xl mx-auto rounded-xl p-10",
        "shadow-md",
        darkMode
          ? "bg-card border border-border"
          : "bg-accent/30"
      )}
      style={{
        '--tw-shadow': 'var(--shadow-md)'
      } as React.CSSProperties}
    >
      <div className="flex justify-center mb-6">
        <QuoteIcon
          className={cn(
            "h-10 w-10",
            darkMode ? "text-primary" : "text-primary"
          )}
        />
      </div>
      <div
        className={`transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <blockquote
          className={cn(
            "text-2xl font-medium mb-4 text-center",
            darkMode ? "text-foreground" : "text-foreground"
          )}
        >
          "{currentQuote.text}"
        </blockquote>
        <cite
          className={cn(
            "block text-lg not-italic text-center",
            darkMode ? "text-muted-foreground" : "text-muted-foreground"
          )}
        >
          — {currentQuote.author}
        </cite>
      </div>
    </div>
  )
}