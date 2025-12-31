'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Static background options - no JavaScript animation, pure CSS
export type Background = 'gradient' | 'mesh' | 'textured' | 'minimal' | 'none'

// Background tone controls the body gradient color, independent of theme
export type BackgroundTone =
  | 'charcoal'     // Dark slate (Terminal default)
  | 'deep-purple'  // Purple-blue (Amber)
  | 'pure-black'   // True black (Carbon)
  | 'light'        // Off-white (Light)
  | 'ocean'        // Deep blue
  | 'sunset'       // Purple-pink
  | 'forest'       // Dark green
  | 'midnight'     // Indigo
  | 'neon-dark'    // Near-black
  | 'slate'        // Blue-gray

interface BackgroundContextType {
  background: Background
  setBackground: (bg: Background) => void
  backgrounds: Background[]
  backgroundTone: BackgroundTone
  setBackgroundTone: (tone: BackgroundTone) => void
  backgroundTones: BackgroundTone[]
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [background, setBackgroundState] = useState<Background>('gradient')
  const [backgroundTone, setBackgroundToneState] = useState<BackgroundTone>('charcoal')
  const [mounted, setMounted] = useState(false)

  const backgrounds: Background[] = [
    'gradient',
    'mesh',
    'textured',
    'minimal',
    'none'
  ]

  const backgroundTones: BackgroundTone[] = [
    'charcoal',
    'deep-purple',
    'pure-black',
    'light',
    'ocean',
    'sunset',
    'forest',
    'midnight',
    'neon-dark',
    'slate'
  ]

  // Load saved preferences on mount
  useEffect(() => {
    setMounted(true)
    const savedBg = localStorage.getItem('portfolio-background')
    if (savedBg && backgrounds.includes(savedBg as Background)) {
      setBackgroundState(savedBg as Background)
    }

    const savedTone = localStorage.getItem('portfolio-bg-tone')
    if (savedTone && backgroundTones.includes(savedTone as BackgroundTone)) {
      setBackgroundToneState(savedTone as BackgroundTone)
      document.documentElement.setAttribute('data-bg-tone', savedTone)
    } else {
      // Set default tone
      document.documentElement.setAttribute('data-bg-tone', 'charcoal')
    }
  }, [])

  // Save preference when it changes
  const setBackground = (bg: Background) => {
    setBackgroundState(bg)
    localStorage.setItem('portfolio-background', bg)
  }

  const setBackgroundTone = (tone: BackgroundTone) => {
    setBackgroundToneState(tone)
    if (mounted) {
      localStorage.setItem('portfolio-bg-tone', tone)
      document.documentElement.setAttribute('data-bg-tone', tone)
    }
  }

  return (
    <BackgroundContext.Provider value={{
      background,
      setBackground,
      backgrounds,
      backgroundTone,
      setBackgroundTone,
      backgroundTones
    }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider')
  }
  return context
}
