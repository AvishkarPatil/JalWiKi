"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/context/theme-context" // Import useTheme
import { cn } from "@/lib/utils" // Import cn

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const { darkMode } = useTheme() // Get darkMode state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <Search
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        )}
      />
      <Input
        type="search"
        placeholder="Search forum..."
        value={query}
        onChange={handleChange}
        className={cn(
          "w-full pl-10 pr-4 py-2 rounded-full focus-visible:ring-offset-0",
          "bg-background text-foreground placeholder:text-muted-foreground/60",
          "border-border focus-visible:ring-ring"
        )}
      />
    </div>
  )
}