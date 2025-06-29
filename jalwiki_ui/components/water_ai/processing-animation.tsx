"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useTheme } from "@/context/theme-context" // Import useTheme
import { cn } from "@/lib/utils" // Import cn

const loadingMessages = [
  "Analyzing your water usage patterns...",
  "Identifying optimal water-saving techniques...",
  "Calculating potential water savings...",
  "Customizing recommendations for your location...",
  "Preparing your personalized water efficiency plan...",
]

export function ProcessingAnimation() {
  const { darkMode } = useTheme(); // Get darkMode state
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3000) // Message changes every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <div className="text-center space-y-8"> {/* Increased space-y */}
        <div className="relative">
          {/* Adjusted blur pulse for dark mode */}
          <div
            className={cn(
              "absolute -inset-1.5 rounded-full blur-xl animate-pulse", // Slightly larger inset for better blur visibility
              darkMode ? "bg-purple-500/20" : "bg-purple-600/20"
            )}
          ></div>
          {/* Adjusted loader icon container for dark mode */}
          <div
            className={cn(
              "relative rounded-full p-4 shadow-lg", // Added shadow for better depth
              darkMode ? "bg-gray-800" : "bg-white"
            )}
          >
            <Loader2
              className={cn(
                "h-12 w-12 animate-spin",
                darkMode ? "text-purple-400" : "text-purple-600"
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3
            className={cn(
              "text-xl sm:text-2xl font-semibold", // Made font-semibold and responsive
              darkMode ? "text-purple-400" : "text-purple-700"
            )}
          >
            Processing Your Data
          </h3>
          <p
            className={cn(
              "max-w-md mx-auto text-sm sm:text-base", // Responsive text
              darkMode ? "text-gray-400" : "text-gray-600"
            )}
          >
            {loadingMessages[messageIndex]}
          </p>
        </div>

        {/* Adjusted progress bar for dark mode */}
        <div
          className={cn(
            "w-64 h-2.5 rounded-full overflow-hidden mx-auto", // Centered progress bar, slightly thicker
            darkMode ? "bg-gray-700" : "bg-gray-200"
          )}
        >
          <div
            className={cn(
              "h-full rounded-full animate-progress",
              darkMode ? "bg-purple-500" : "bg-purple-600"
            )}
          ></div>
        </div>
      </div>
    </div>
  )
}