"use client"

import { useEffect, useState, useCallback, createContext, useContext, ReactNode } from "react"
import {
  TABZ_API_BASE,
  TABZ_WS_URL,
  HEALTH_CHECK_INTERVAL,
  HEALTH_CHECK_TIMEOUT,
  WEBSOCKET_TIMEOUT,
  MARKETPLACE_STORAGE_KEY,
  DEFAULT_MARKETPLACE,
} from "../constants"
import type { SpawnTerminalOptions, InstallPluginOptions, UseTabzChromeReturn } from "../types"
import { sanitizeToken, checkTabzChromeHealth } from "../utils"

/**
 * Queue a prompt to TabzChrome chat bar via WebSocket
 */
async function queueToChatBar(prompt: string): Promise<boolean> {
  try {
    let wsUrl = TABZ_WS_URL
    try {
      const tokenResponse = await fetch(`${TABZ_API_BASE}/api/auth/token`, {
        signal: AbortSignal.timeout(2000),
      })
      if (tokenResponse.ok) {
        const { token } = await tokenResponse.json()
        if (token) {
          const cleanToken = sanitizeToken(token)
          wsUrl = `${TABZ_WS_URL}?token=${cleanToken}`
        }
      }
    } catch {
      // Continue without token
    }

    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(wsUrl)
        const timeout = setTimeout(() => {
          ws.close()
          resolve(false)
        }, WEBSOCKET_TIMEOUT)

        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "QUEUE_COMMAND", command: prompt }))
          clearTimeout(timeout)
          ws.close()
          resolve(true)
        }

        ws.onerror = () => {
          clearTimeout(timeout)
          resolve(false)
        }
      } catch {
        resolve(false)
      }
    })
  } catch {
    return false
  }
}

/**
 * Spawn a new terminal session via TabzChrome API
 */
async function spawnTerminalSession(options: SpawnTerminalOptions): Promise<boolean> {
  try {
    const res = await fetch(`${TABZ_API_BASE}/api/spawn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: options.name,
        command: options.command,
        workingDir: options.workingDir || "~",
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

const TabzChromeContext = createContext<UseTabzChromeReturn | null>(null)

/**
 * Provider component for TabzChrome context
 *
 * Wrap your app with this provider to enable TabzChrome functionality
 * throughout your application.
 */
export function TabzChromeProvider({ children }: { children: ReactNode }) {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkAvailability = useCallback(async () => {
    setIsChecking(true)
    const available = await checkTabzChromeHealth(HEALTH_CHECK_TIMEOUT)
    setIsAvailable(available)
    setLastChecked(new Date())
    setIsChecking(false)
    return available
  }, [])

  const spawnTerminal = useCallback(async (options: SpawnTerminalOptions): Promise<boolean> => {
    const available = await checkTabzChromeHealth(HEALTH_CHECK_TIMEOUT)
    if (!available) {
      setIsAvailable(false)
      return false
    }

    const success = await spawnTerminalSession(options)
    return success
  }, [])

  const queueToChat = useCallback(async (prompt: string): Promise<boolean> => {
    const available = await checkTabzChromeHealth(HEALTH_CHECK_TIMEOUT)
    if (!available) {
      setIsAvailable(false)
      return false
    }

    const success = await queueToChatBar(prompt)
    return success
  }, [])

  const isMarketplaceAdded = useCallback((repo: string): boolean => {
    if (typeof window === "undefined") return false
    try {
      const stored = localStorage.getItem(MARKETPLACE_STORAGE_KEY)
      const marketplaces: string[] = stored ? JSON.parse(stored) : []
      return marketplaces.includes(repo)
    } catch {
      return false
    }
  }, [])

  const markMarketplaceAdded = useCallback((repo: string): void => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem(MARKETPLACE_STORAGE_KEY)
      const marketplaces: string[] = stored ? JSON.parse(stored) : []
      if (!marketplaces.includes(repo)) {
        marketplaces.push(repo)
        localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(marketplaces))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const ensureMarketplace = useCallback(
    async (repo: string): Promise<boolean> => {
      if (isMarketplaceAdded(repo)) {
        return true
      }

      const available = await checkTabzChromeHealth(HEALTH_CHECK_TIMEOUT)
      if (!available) {
        setIsAvailable(false)
        return false
      }

      const success = await queueToChatBar(`/plugin marketplace add ${repo}`)
      if (success) {
        markMarketplaceAdded(repo)
      }
      return success
    },
    [isMarketplaceAdded, markMarketplaceAdded]
  )

  const installPlugin = useCallback(async (options: InstallPluginOptions): Promise<boolean> => {
    const { slug, marketplace = DEFAULT_MARKETPLACE, scope = "user" } = options

    const available = await checkTabzChromeHealth(HEALTH_CHECK_TIMEOUT)
    if (!available) {
      setIsAvailable(false)
      return false
    }

    const marketplaceName = marketplace.includes("/") ? marketplace.split("/").pop() : marketplace

    const command = `/plugin install ${slug}@${marketplaceName} --scope ${scope}`
    return queueToChatBar(command)
  }, [])

  const uninstallPlugin = useCallback(
    async (slug: string, marketplace?: string): Promise<boolean> => {
      const marketplaceName = marketplace
        ? marketplace.includes("/")
          ? marketplace.split("/").pop()
          : marketplace
        : "my-gg-plugins"

      const available = await checkTabzChromeHealth(HEALTH_CHECK_TIMEOUT)
      if (!available) {
        setIsAvailable(false)
        return false
      }

      const command = `/plugin uninstall ${slug}@${marketplaceName}`
      return queueToChatBar(command)
    },
    []
  )

  // Initial check and periodic re-checks
  useEffect(() => {
    checkAvailability()

    const interval = setInterval(checkAvailability, HEALTH_CHECK_INTERVAL)
    return () => clearInterval(interval)
  }, [checkAvailability])

  return (
    <TabzChromeContext.Provider
      value={{
        isAvailable,
        isChecking,
        lastChecked,
        spawnTerminal,
        queueToChat,
        checkAvailability,
        ensureMarketplace,
        installPlugin,
        uninstallPlugin,
        isMarketplaceAdded,
      }}
    >
      {children}
    </TabzChromeContext.Provider>
  )
}

/**
 * Hook for accessing TabzChrome functionality
 *
 * Provides:
 * - `isAvailable`: Whether TabzChrome is running (checked via health endpoint)
 * - `queueToChat(prompt)`: Queue a prompt to the TabzChrome chat bar via WebSocket
 * - `spawnTerminal(options)`: Spawn a new terminal session with an optional command
 * - `checkAvailability()`: Manually re-check TabzChrome availability
 * - Plugin installation methods for Claude Code marketplace
 *
 * Must be used within a TabzChromeProvider, but provides a graceful fallback
 * for components not wrapped in the provider.
 */
export function useTabzChrome(): UseTabzChromeReturn {
  const context = useContext(TabzChromeContext)

  if (!context) {
    // Return a fallback for components not wrapped in provider
    return {
      isAvailable: false,
      isChecking: false,
      lastChecked: null,
      spawnTerminal: async () => false,
      queueToChat: async () => false,
      checkAvailability: async () => false,
      ensureMarketplace: async () => false,
      installPlugin: async () => false,
      uninstallPlugin: async () => false,
      isMarketplaceAdded: () => false,
    }
  }

  return context
}
