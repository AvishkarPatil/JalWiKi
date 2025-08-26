"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/context/theme-context"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: number
  title: string
  type: 'technique' | 'forum' | 'article' | 'resource'
  slug: string
  summary?: string
  category?: string
}

interface GlobalSearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function GlobalSearchBar({ 
  onSearch, 
  placeholder = "Search water conservation topics...", 
  className 
}: GlobalSearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const { darkMode } = useTheme()
  const router = useRouter()

  // Mock search function - in a real app, this would fetch from an API
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200))

    // Mock data - in a real app, this would come from your backend
    const mockResults: SearchResult[] = [
      {
        id: 1,
        title: "Rainwater Harvesting",
        type: 'technique' as const,
        slug: 'rainwater-harvesting',
        summary: 'Collecting and storing rainwater for reuse',
        category: 'Water Conservation'
      },
      {
        id: 2,
        title: "Drip Irrigation Systems",
        type: 'technique' as const,
        slug: 'drip-irrigation-systems',
        summary: 'Efficient water delivery to plant roots',
        category: 'Irrigation'
      },
      {
        id: 3,
        title: "Water Recycling Methods",
        type: 'article' as const,
        slug: 'water-recycling-methods',
        summary: 'Techniques for reusing wastewater',
        category: 'Sustainability'
      },
      {
        id: 4,
        title: "Community Water Conservation Forum",
        type: 'forum' as const,
        slug: 'community-water-conservation',
        summary: 'Discuss water saving techniques',
        category: 'Community'
      }
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setResults(mockResults)
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, performSearch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.(value)
    setShowResults(value.length > 0)
  }

  const handleFocus = () => {
    setIsFocused(true)
    setShowResults(query.length > 0)
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Delay hiding results to allow clicks
    setTimeout(() => setShowResults(false), 200)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
    onSearch?.("")
  }

  const handleResultClick = (result: SearchResult) => {
    let path = ''
    switch (result.type) {
      case 'technique':
        path = `/techniques/${result.slug}`
        break
      case 'forum':
        path = `/forum/${result.slug}`
        break
      case 'article':
      case 'resource':
        path = `/resources/${result.slug}`
        break
    }
    router.push(path)
    setShowResults(false)
    setQuery("")
  }

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
            darkMode ? "text-gray-500" : "text-gray-400"
          )}
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "w-full pl-10 pr-10 py-2 rounded-full focus-visible:ring-offset-0",
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus-visible:ring-purple-500"
              : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-purple-500"
          )}
          aria-label="Search water conservation topics"
          role="searchbox"
        />
        {query && (
          <button
            onClick={clearSearch}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full",
              darkMode ? "text-gray-500 hover:text-gray-300 hover:bg-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            )}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-1 max-h-96 overflow-y-auto rounded-lg border shadow-lg z-50",
          darkMode 
            ? "bg-gray-900 border-gray-700" 
            : "bg-white border-gray-200"
        )}>
          <div className="p-2 space-y-1">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={cn(
                  "w-full text-left p-3 rounded-md transition-colors",
                  "hover:bg-purple-100 hover:text-purple-900",
                  darkMode && "hover:bg-purple-900/50 hover:text-purple-300"
                )}
                role="option"
                aria-selected="false"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{result.title}</h4>
                    {result.summary && (
                      <p className={cn(
                        "text-xs mt-1 line-clamp-1",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}>
                        {result.summary}
                      </p>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full ml-2",
                    darkMode 
                      ? "bg-purple-900/30 text-purple-300" 
                      : "bg-purple-100 text-purple-700"
                  )}>
                    {result.type}
                  </span>
                </div>
                {result.category && (
                  <p className={cn(
                    "text-xs mt-1",
                    darkMode ? "text-gray-500" : "text-gray-500"
                  )}>
                    Category: {result.category}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showResults && query && results.length === 0 && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-1 p-4 rounded-lg border shadow-lg z-50",
          darkMode 
            ? "bg-gray-900 border-gray-700 text-gray-300" 
            : "bg-white border-gray-200 text-gray-600"
        )}>
          <p className="text-sm text-center">
            No results found for "<span className="font-medium">{query}</span>"
          </p>
          <p className="text-xs text-center mt-1">
            Try different keywords like "rainwater", "recycling", or "irrigation"
          </p>
        </div>
      )}
    </div>
  )
}
