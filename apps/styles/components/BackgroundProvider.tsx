'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Background options - CSS styles plus animated stars
export type Background = 'gradient' | 'mesh' | 'textured' | 'minimal' | 'stars' | 'none'

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

// Custom media background settings
export type MediaBackgroundType = 'none' | 'image' | 'video'

export interface MediaBackgroundSettings {
  url: string
  type: MediaBackgroundType
  opacity: number // 0-100
}

interface BackgroundContextType {
  background: Background
  setBackground: (bg: Background) => void
  backgrounds: Background[]
  backgroundTone: BackgroundTone
  setBackgroundTone: (tone: BackgroundTone) => void
  backgroundTones: BackgroundTone[]
  // Custom media background
  mediaBackground: MediaBackgroundSettings
  setMediaBackground: (settings: Partial<MediaBackgroundSettings>) => void
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

const DEFAULT_MEDIA_BACKGROUND: MediaBackgroundSettings = {
  url: '',
  type: 'none',
  opacity: 20, // Default low opacity so glassmorphism remains visible
}

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [background, setBackgroundState] = useState<Background>('gradient')
  const [backgroundTone, setBackgroundToneState] = useState<BackgroundTone>('charcoal')
  const [mediaBackground, setMediaBackgroundState] = useState<MediaBackgroundSettings>(DEFAULT_MEDIA_BACKGROUND)
  const [mounted, setMounted] = useState(false)

  const backgrounds: Background[] = [
    'gradient',
    'mesh',
    'textured',
    'minimal',
    'stars',
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

    // Load media background settings
    const savedMedia = localStorage.getItem('page-background')
    if (savedMedia) {
      try {
        const parsed = JSON.parse(savedMedia) as Partial<MediaBackgroundSettings>
        setMediaBackgroundState({
          url: parsed.url || '',
          type: parsed.type || 'none',
          opacity: typeof parsed.opacity === 'number' ? parsed.opacity : 20,
        })
      } catch {
        // Invalid JSON, use defaults
      }
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

  const setMediaBackground = (settings: Partial<MediaBackgroundSettings>) => {
    setMediaBackgroundState(prev => {
      const updated = { ...prev, ...settings }
      if (mounted) {
        localStorage.setItem('page-background', JSON.stringify(updated))
      }
      return updated
    })
  }

  return (
    <BackgroundContext.Provider value={{
      background,
      setBackground,
      backgrounds,
      backgroundTone,
      setBackgroundTone,
      backgroundTones,
      mediaBackground,
      setMediaBackground,
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
