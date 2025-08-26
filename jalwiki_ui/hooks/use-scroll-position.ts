"use client"

import { useState, useEffect } from 'react'

export function useScrollPosition(threshold = 200) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold)
    }

    // Initial check
    handleScroll()

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isScrolled
}
