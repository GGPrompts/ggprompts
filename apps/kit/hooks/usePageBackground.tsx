"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export type PageBackgroundType = 'none' | 'image' | 'video'

export interface PageBackgroundSettings {
  backgroundUrl: string
  backgroundType: PageBackgroundType
  backgroundOpacity: number // 0-100
  backgroundStyleOpacity: number // 0-100, opacity of gradient/mesh/textured/minimal
}

const DEFAULT_SETTINGS: PageBackgroundSettings = {
  backgroundUrl: '',
  backgroundType: 'none',
  backgroundOpacity: 20,
  backgroundStyleOpacity: 100, // Full opacity by default
}

const STORAGE_KEY = 'page-background'

function loadSettings(): PageBackgroundSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        backgroundUrl: parsed.backgroundUrl || '',
        backgroundType: parsed.backgroundType || 'none',
        backgroundOpacity: typeof parsed.backgroundOpacity === 'number'
          ? Math.min(100, Math.max(0, parsed.backgroundOpacity))
          : 20,
        backgroundStyleOpacity: typeof parsed.backgroundStyleOpacity === 'number'
          ? Math.min(100, Math.max(0, parsed.backgroundStyleOpacity))
          : 100,
      }
    }
  } catch {
    // Invalid JSON, use defaults
  }

  return DEFAULT_SETTINGS
}

interface PageBackgroundContextType {
  backgroundUrl: string
  backgroundType: PageBackgroundType
  backgroundOpacity: number
  backgroundStyleOpacity: number
  isLoaded: boolean
  mediaError: boolean
  showMedia: boolean
  setBackgroundUrl: (url: string) => void
  setBackgroundType: (type: PageBackgroundType) => void
  setBackgroundOpacity: (opacity: number) => void
  setBackgroundStyleOpacity: (opacity: number) => void
  resetToDefaults: () => void
  handleMediaError: () => void
}

const PageBackgroundContext = createContext<PageBackgroundContextType | undefined>(undefined)

export function PageBackgroundProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PageBackgroundSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mediaError, setMediaError] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setSettings(loadSettings())
    setIsLoaded(true)
  }, [])

  // Save to localStorage when settings change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    }
  }, [settings, isLoaded])

  // Reset error when URL changes
  useEffect(() => {
    setMediaError(false)
  }, [settings.backgroundUrl])

  const setBackgroundUrl = useCallback((url: string) => {
    setSettings((prev) => ({ ...prev, backgroundUrl: url }))
  }, [])

  const setBackgroundType = useCallback((type: PageBackgroundType) => {
    setSettings((prev) => ({ ...prev, backgroundType: type }))
  }, [])

  const setBackgroundOpacity = useCallback((opacity: number) => {
    setSettings((prev) => ({
      ...prev,
      backgroundOpacity: Math.min(100, Math.max(0, opacity)),
    }))
  }, [])

  const setBackgroundStyleOpacity = useCallback((opacity: number) => {
    setSettings((prev) => ({
      ...prev,
      backgroundStyleOpacity: Math.min(100, Math.max(0, opacity)),
    }))
  }, [])

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [])

  const handleMediaError = useCallback(() => {
    setMediaError(true)
  }, [])

  const showMedia = settings.backgroundType !== 'none' &&
    !!settings.backgroundUrl &&
    !mediaError

  return (
    <PageBackgroundContext.Provider value={{
      ...settings,
      isLoaded,
      mediaError,
      showMedia,
      setBackgroundUrl,
      setBackgroundType,
      setBackgroundOpacity,
      setBackgroundStyleOpacity,
      resetToDefaults,
      handleMediaError,
    }}>
      {children}
    </PageBackgroundContext.Provider>
  )
}

export function usePageBackground() {
  const context = useContext(PageBackgroundContext)
  if (context === undefined) {
    throw new Error('usePageBackground must be used within a PageBackgroundProvider')
  }
  return context
}
