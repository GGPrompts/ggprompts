'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'terminal' | 'amber' | 'carbon' | 'light' | 'ocean' | 'sunset' | 'forest' | 'midnight' | 'neon' | 'slate'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themes: Theme[] = ['terminal', 'amber', 'carbon', 'light', 'ocean', 'sunset', 'forest', 'midnight', 'neon', 'slate']
  const [theme, setThemeState] = useState<Theme>('terminal')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme
    if (savedTheme && themes.includes(savedTheme)) {
      setThemeState(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  // Update theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (mounted) {
      localStorage.setItem('portfolio-theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
