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

// Custom background media type
export type BackgroundMediaType = 'none' | 'image' | 'video'

interface BackgroundContextType {
  background: Background
  setBackground: (bg: Background) => void
  backgrounds: Background[]
  backgroundTone: BackgroundTone
  setBackgroundTone: (tone: BackgroundTone) => void
  backgroundTones: BackgroundTone[]
  // Custom URL background settings
  backgroundUrl: string
  setBackgroundUrl: (url: string) => void
  backgroundMediaType: BackgroundMediaType
  setBackgroundMediaType: (type: BackgroundMediaType) => void
  backgroundOpacity: number
  setBackgroundOpacity: (opacity: number) => void
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [background, setBackgroundState] = useState<Background>('gradient')
  const [backgroundTone, setBackgroundToneState] = useState<BackgroundTone>('charcoal')
  const [mounted, setMounted] = useState(false)

  // Custom URL background state
  const [backgroundUrl, setBackgroundUrlState] = useState<string>('')
  const [backgroundMediaType, setBackgroundMediaTypeState] = useState<BackgroundMediaType>('none')
  const [backgroundOpacity, setBackgroundOpacityState] = useState<number>(20)

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

    // Load custom URL background settings
    const savedPageBg = localStorage.getItem('page-background')
    if (savedPageBg) {
      try {
        const parsed = JSON.parse(savedPageBg)
        if (parsed.url) setBackgroundUrlState(parsed.url)
        if (parsed.type && ['none', 'image', 'video'].includes(parsed.type)) {
          setBackgroundMediaTypeState(parsed.type)
        }
        if (typeof parsed.opacity === 'number') {
          setBackgroundOpacityState(parsed.opacity)
        }
      } catch {
        // Invalid JSON, ignore
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

  // Helper to save page-background settings
  const savePageBackground = (url: string, type: BackgroundMediaType, opacity: number) => {
    localStorage.setItem('page-background', JSON.stringify({ url, type, opacity }))
  }

  const setBackgroundUrl = (url: string) => {
    setBackgroundUrlState(url)
    if (mounted) {
      savePageBackground(url, backgroundMediaType, backgroundOpacity)
    }
  }

  const setBackgroundMediaType = (type: BackgroundMediaType) => {
    setBackgroundMediaTypeState(type)
    if (mounted) {
      savePageBackground(backgroundUrl, type, backgroundOpacity)
    }
  }

  const setBackgroundOpacity = (opacity: number) => {
    setBackgroundOpacityState(opacity)
    if (mounted) {
      savePageBackground(backgroundUrl, backgroundMediaType, opacity)
    }
  }

  return (
    <BackgroundContext.Provider value={{
      background,
      setBackground,
      backgrounds,
      backgroundTone,
      setBackgroundTone,
      backgroundTones,
      backgroundUrl,
      setBackgroundUrl,
      backgroundMediaType,
      setBackgroundMediaType,
      backgroundOpacity,
      setBackgroundOpacity
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
