'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type BackgroundType = 'none' | 'image' | 'video'

export interface BackgroundSettings {
  backgroundUrl: string
  backgroundType: BackgroundType
  backgroundOpacity: number
}

interface BackgroundContextType extends BackgroundSettings {
  setBackgroundUrl: (url: string) => void
  setBackgroundType: (type: BackgroundType) => void
  setBackgroundOpacity: (opacity: number) => void
  resetBackground: () => void
}

const defaultSettings: BackgroundSettings = {
  backgroundUrl: '',
  backgroundType: 'none',
  backgroundOpacity: 20,
}

const STORAGE_KEY = 'page-background'

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<BackgroundSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<BackgroundSettings>
        setSettings({
          backgroundUrl: parsed.backgroundUrl || defaultSettings.backgroundUrl,
          backgroundType: parsed.backgroundType || defaultSettings.backgroundType,
          backgroundOpacity: parsed.backgroundOpacity ?? defaultSettings.backgroundOpacity,
        })
      }
    } catch (e) {
      console.error('Failed to load background settings:', e)
    }
  }, [])

  // Persist settings to localStorage
  const saveSettings = (newSettings: BackgroundSettings) => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
    } catch (e) {
      console.error('Failed to save background settings:', e)
    }
  }

  const setBackgroundUrl = (url: string) => {
    const newSettings = { ...settings, backgroundUrl: url }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const setBackgroundType = (type: BackgroundType) => {
    const newSettings = { ...settings, backgroundType: type }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const setBackgroundOpacity = (opacity: number) => {
    const newSettings = { ...settings, backgroundOpacity: opacity }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const resetBackground = () => {
    setSettings(defaultSettings)
    if (mounted) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <BackgroundContext.Provider
      value={{
        ...settings,
        setBackgroundUrl,
        setBackgroundType,
        setBackgroundOpacity,
        resetBackground,
      }}
    >
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
