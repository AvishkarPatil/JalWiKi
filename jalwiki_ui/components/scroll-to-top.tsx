"use client"

import { ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useScrollPosition } from '@/hooks/use-scroll-position'
import { useTheme } from '@/context/theme-context'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const isScrolled = useScrollPosition(200)
  const { darkMode } = useTheme()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isScrolled) return null

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-all duration-300",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        darkMode 
          ? "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white" 
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-purple-700"
      )}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  )
}
