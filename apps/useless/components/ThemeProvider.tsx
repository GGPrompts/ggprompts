'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Color themes (the accent color)
type ColorTheme = 'terminal' | 'amber' | 'ocean' | 'sunset' | 'forest' | 'midnight' | 'neon' | 'slate' | 'carbon'

// Light or dark mode
type Mode = 'light' | 'dark'

interface ThemeContextType {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
  colorThemes: ColorTheme[]
  mode: Mode
  setMode: (mode: Mode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorThemes: ColorTheme[] = ['terminal', 'amber', 'ocean', 'sunset', 'forest', 'midnight', 'neon', 'slate', 'carbon']
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('terminal')
  const [mode, setModeState] = useState<Mode>('dark')
  const [mounted, setMounted] = useState(false)

  // Load theme and mode from localStorage on mount
  useEffect(() => {
    setMounted(true)

    // Load color theme
    const savedTheme = localStorage.getItem('useless-color-theme') as ColorTheme
    if (savedTheme && colorThemes.includes(savedTheme)) {
      setColorThemeState(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'terminal')
    }

    // Load mode (default to dark)
    const savedMode = localStorage.getItem('useless-mode') as Mode
    if (savedMode === 'light' || savedMode === 'dark') {
      setModeState(savedMode)
      document.documentElement.setAttribute('data-mode', savedMode)
    } else {
      document.documentElement.setAttribute('data-mode', 'dark')
    }
  }, [])

  // Update color theme (also ensures mode stays applied)
  const setColorTheme = (newTheme: ColorTheme) => {
    setColorThemeState(newTheme)
    if (mounted) {
      localStorage.setItem('useless-color-theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
      // Ensure mode attribute stays in sync when changing theme
      document.documentElement.setAttribute('data-mode', mode)
    }
  }

  // Update mode
  const setMode = (newMode: Mode) => {
    setModeState(newMode)
    if (mounted) {
      localStorage.setItem('useless-mode', newMode)
      document.documentElement.setAttribute('data-mode', newMode)
    }
  }

  // Toggle between light and dark
  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{
      colorTheme,
      setColorTheme,
      colorThemes,
      mode,
      setMode,
      toggleMode
    }}>
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

// Legacy export for backwards compatibility during migration
export function useLegacyTheme() {
  const { colorTheme, setColorTheme, colorThemes } = useTheme()
  return {
    theme: colorTheme,
    setTheme: setColorTheme,
    themes: colorThemes
  }
}
