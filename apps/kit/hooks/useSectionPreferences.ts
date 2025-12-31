"use client"

import { useState, useEffect, useCallback } from "react"

// Section IDs that can be toggled (excluding home and settings which are always visible)
export type ToggleableSection = "weather" | "feed" | "api-playground" | "notes" | "bookmarks" | "search" | "stocks" | "crypto" | "spacex" | "github-activity" | "disasters" | "tasks" | "projects" | "jobs" | "integrations" | "profile" | "ai-workspace" | "market-pulse" | "setup"

// All sections including non-toggleable ones
export type Section = "home" | ToggleableSection | "settings"

// Default order of sections in sidebar
export const DEFAULT_SECTION_ORDER: ToggleableSection[] = [
  "weather",
  "feed",
  "market-pulse",
  "api-playground",
  "notes",
  "bookmarks",
  "search",
  "ai-workspace",
  "stocks",
  "crypto",
  "spacex",
  "github-activity",
  "disasters",
  "tasks",
  "projects",
  "jobs",
  "integrations",
  "profile",
  "setup",
]

// Default visibility (all visible)
export const DEFAULT_VISIBILITY: Record<ToggleableSection, boolean> = {
  weather: true,
  feed: true,
  "market-pulse": true,
  "api-playground": true,
  notes: true,
  bookmarks: true,
  search: true,
  "ai-workspace": true,
  stocks: true,
  crypto: true,
  spacex: true,
  "github-activity": true,
  disasters: true,
  tasks: true,
  projects: true,
  jobs: true,
  integrations: true,
  profile: true,
  setup: true,
}

const STORAGE_KEY = "section-preferences"

interface SectionPreferences {
  visibility: Record<ToggleableSection, boolean>
  order: ToggleableSection[]
}

function loadPreferences(): SectionPreferences {
  if (typeof window === "undefined") {
    return { visibility: DEFAULT_VISIBILITY, order: DEFAULT_SECTION_ORDER }
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)

      // Merge visibility with defaults (new sections get default visibility)
      const visibility = { ...DEFAULT_VISIBILITY, ...parsed.visibility }

      // Merge order: keep saved order but append any new sections at the end
      let order: ToggleableSection[] = []
      if (parsed.order?.length) {
        // Start with saved order
        order = [...parsed.order]
        // Add any new sections that aren't in saved order
        for (const section of DEFAULT_SECTION_ORDER) {
          if (!order.includes(section)) {
            order.push(section)
          }
        }
      } else {
        order = DEFAULT_SECTION_ORDER
      }

      return { visibility, order }
    }
  } catch {
    // Invalid JSON, use defaults
  }

  return { visibility: DEFAULT_VISIBILITY, order: DEFAULT_SECTION_ORDER }
}

export function useSectionPreferences() {
  const [preferences, setPreferences] = useState<SectionPreferences>(loadPreferences)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setPreferences(loadPreferences())
    setIsLoaded(true)
  }, [])

  // Save to localStorage when preferences change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    }
  }, [preferences, isLoaded])

  // Toggle visibility of a section
  const toggleVisibility = useCallback((section: ToggleableSection) => {
    setPreferences((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [section]: !prev.visibility[section],
      },
    }))
  }, [])

  // Set visibility of a section
  const setVisibility = useCallback((section: ToggleableSection, visible: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [section]: visible,
      },
    }))
  }, [])

  // Move a section up in the order
  const moveUp = useCallback((section: ToggleableSection) => {
    setPreferences((prev) => {
      const order = [...prev.order]
      const index = order.indexOf(section)
      if (index > 0) {
        [order[index - 1], order[index]] = [order[index], order[index - 1]]
      }
      return { ...prev, order }
    })
  }, [])

  // Move a section down in the order
  const moveDown = useCallback((section: ToggleableSection) => {
    setPreferences((prev) => {
      const order = [...prev.order]
      const index = order.indexOf(section)
      if (index < order.length - 1) {
        [order[index], order[index + 1]] = [order[index + 1], order[index]]
      }
      return { ...prev, order }
    })
  }, [])

  // Reorder sections (for drag-and-drop)
  const reorder = useCallback((newOrder: ToggleableSection[]) => {
    setPreferences((prev) => ({ ...prev, order: newOrder }))
  }, [])

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setPreferences({ visibility: DEFAULT_VISIBILITY, order: DEFAULT_SECTION_ORDER })
  }, [])

  // Get visible sections in order
  const getVisibleSections = useCallback((): ToggleableSection[] => {
    return preferences.order.filter((section) => preferences.visibility[section])
  }, [preferences])

  // Check if a section is visible
  const isVisible = useCallback((section: ToggleableSection): boolean => {
    return preferences.visibility[section]
  }, [preferences.visibility])

  return {
    visibility: preferences.visibility,
    order: preferences.order,
    isLoaded,
    toggleVisibility,
    setVisibility,
    moveUp,
    moveDown,
    reorder,
    resetToDefaults,
    getVisibleSections,
    isVisible,
  }
}
