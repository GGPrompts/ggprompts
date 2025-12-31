'use client'

import { useEffect, useState, useCallback, createContext, useContext, ReactNode } from 'react'

const TABZ_API_BASE = 'http://localhost:8129'
const HEALTH_CHECK_TIMEOUT = 500
const HEALTH_CHECK_INTERVAL = 30000 // Re-check every 30 seconds

/**
 * Sanitize auth token by removing non-ASCII characters
 * Copy-paste can introduce invisible unicode that breaks HTTP headers
 */
function sanitizeToken(token: string): string {
  return token.replace(/[^\x00-\xFF]/g, '')
}

export interface SpawnTerminalOptions {
  name: string
  command?: string
  workingDir?: string
}

export type PluginScope = 'user' | 'project' | 'local'

export interface InstallPluginOptions {
  slug: string
  marketplace?: string
  scope?: PluginScope
}

interface TabzChromeContextValue {
  isAvailable: boolean
  isChecking: boolean
  lastChecked: Date | null
  spawnTerminal: (options: SpawnTerminalOptions) => Promise<boolean>
  queueToChat: (prompt: string) => Promise<boolean>
  checkAvailability: () => Promise<boolean>
  // Plugin installation methods
  ensureMarketplace: (repo: string) => Promise<boolean>
  installPlugin: (options: InstallPluginOptions) => Promise<boolean>
  uninstallPlugin: (slug: string, marketplace?: string) => Promise<boolean>
  isMarketplaceAdded: (repo: string) => boolean
}

const TabzChromeContext = createContext<TabzChromeContextValue | null>(null)

/**
 * Check if TabzChrome backend is running
 * Works from any site - browsers allow HTTPS→localhost WebSocket connections
 */
async function checkTabzChromeHealth(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT)

    const res = await fetch(`${TABZ_API_BASE}/api/health`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return res.ok
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: options.name,
        command: options.command,
        workingDir: options.workingDir || '~',
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

const TABZ_WS_URL = 'ws://localhost:8129'

/**
 * Queue a prompt to TabzChrome chat bar via WebSocket
 * Sends QUEUE_COMMAND message which adds text to the chat input without executing
 *
 * Authentication flow:
 * 1. Fetch auth token from /api/auth/token (required for newer TabzChrome versions)
 * 2. Connect to WebSocket with token in query string
 * 3. Send QUEUE_COMMAND message
 * 4. Gracefully falls back to no-token connection for older backends
 */
async function queueToChatBar(prompt: string): Promise<boolean> {
  try {
    // Step 1: Fetch auth token from backend
    let wsUrl = TABZ_WS_URL
    try {
      const tokenResponse = await fetch(`${TABZ_API_BASE}/api/auth/token`, {
        signal: AbortSignal.timeout(2000),
      })
      if (tokenResponse.ok) {
        const { token } = await tokenResponse.json()
        if (token) {
          // Sanitize token to remove non-ASCII characters that break WebSocket URLs
          const cleanToken = sanitizeToken(token)
          wsUrl = `${TABZ_WS_URL}?token=${cleanToken}`
        }
      }
    } catch {
      // Backend might not require auth (older version) - continue without token
    }

    // Step 2: Connect via WebSocket with token
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(wsUrl)
        const timeout = setTimeout(() => {
          ws.close()
          resolve(false)
        }, 3000)

        ws.onopen = () => {
          ws.send(JSON.stringify({ type: 'QUEUE_COMMAND', command: prompt }))
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
 * Provider component for TabzChrome context
 */
export function TabzChromeProvider({ children }: { children: ReactNode }) {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkAvailability = useCallback(async () => {
    setIsChecking(true)
    const available = await checkTabzChromeHealth()
    setIsAvailable(available)
    setLastChecked(new Date())
    setIsChecking(false)
    return available
  }, [])

  const spawnTerminal = useCallback(async (options: SpawnTerminalOptions): Promise<boolean> => {
    // Re-check availability before spawning
    const available = await checkTabzChromeHealth()
    if (!available) {
      setIsAvailable(false)
      return false
    }

    const success = await spawnTerminalSession(options)
    return success
  }, [])

  const queueToChat = useCallback(async (prompt: string): Promise<boolean> => {
    // Re-check availability before queuing
    const available = await checkTabzChromeHealth()
    if (!available) {
      setIsAvailable(false)
      return false
    }

    const success = await queueToChatBar(prompt)
    return success
  }, [])

  const MARKETPLACE_STORAGE_KEY = 'ggprompts:marketplaces'
  const DEFAULT_MARKETPLACE = 'GGPrompts/my-gg-plugins'

  const isMarketplaceAdded = useCallback((repo: string): boolean => {
    if (typeof window === 'undefined') return false
    try {
      const stored = localStorage.getItem(MARKETPLACE_STORAGE_KEY)
      const marketplaces: string[] = stored ? JSON.parse(stored) : []
      return marketplaces.includes(repo)
    } catch {
      return false
    }
  }, [])

  const markMarketplaceAdded = useCallback((repo: string): void => {
    if (typeof window === 'undefined') return
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

  const ensureMarketplace = useCallback(async (repo: string): Promise<boolean> => {
    // Check if already added
    if (isMarketplaceAdded(repo)) {
      return true
    }

    // Re-check availability
    const available = await checkTabzChromeHealth()
    if (!available) {
      setIsAvailable(false)
      return false
    }

    // Send marketplace add command
    const success = await queueToChatBar(`/plugin marketplace add ${repo}`)
    if (success) {
      markMarketplaceAdded(repo)
    }
    return success
  }, [isMarketplaceAdded, markMarketplaceAdded])

  const installPlugin = useCallback(async (options: InstallPluginOptions): Promise<boolean> => {
    const { slug, marketplace = DEFAULT_MARKETPLACE, scope = 'user' } = options

    // Re-check availability
    const available = await checkTabzChromeHealth()
    if (!available) {
      setIsAvailable(false)
      return false
    }

    // Extract just the repo name from full path (e.g., "GGPrompts/my-gg-plugins" -> "my-gg-plugins")
    const marketplaceName = marketplace.includes('/') ? marketplace.split('/').pop() : marketplace

    // Send install command directly
    // Users should add the marketplace once with auto-update enabled:
    // /plugin marketplace add GGPrompts/my-gg-plugins
    const command = `/plugin install ${slug}@${marketplaceName} --scope ${scope}`
    return queueToChatBar(command)
  }, [])

  const uninstallPlugin = useCallback(async (slug: string, marketplace?: string): Promise<boolean> => {
    const marketplaceName = marketplace
      ? (marketplace.includes('/') ? marketplace.split('/').pop() : marketplace)
      : 'my-gg-plugins'

    // Re-check availability
    const available = await checkTabzChromeHealth()
    if (!available) {
      setIsAvailable(false)
      return false
    }

    const command = `/plugin uninstall ${slug}@${marketplaceName}`
    return queueToChatBar(command)
  }, [])

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
 * Hook for accessing TabzChrome functionality.
 *
 * Provides:
 * - `isAvailable`: Whether TabzChrome is running (checked via health endpoint)
 * - `queueToChat(prompt)`: Queue a prompt to the TabzChrome chat bar via WebSocket.
 *   The prompt appears in the input for user review before submission.
 * - `spawnTerminal(options)`: Spawn a new terminal session with an optional command.
 * - `checkAvailability()`: Manually re-check TabzChrome availability.
 *
 * The `queueToChat` method sends a QUEUE_COMMAND WebSocket message to ws://localhost:8129,
 * which adds the prompt text to the chat input without executing it.
 */
export function useTabzChrome(): TabzChromeContextValue {
  const context = useContext(TabzChromeContext)

  if (!context) {
    // Return a fallback for components not wrapped in provider
    // This allows gradual adoption
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

/**
 * Utility to build a Claude command from prompt content
 */
export function buildClaudeCommand(
  promptContent: string,
  options?: {
    yoloMode?: boolean
    agent?: string
  }
): string {
  const parts = ['claude']

  if (options?.yoloMode) {
    parts.push('--dangerously-skip-permissions')
  }

  if (options?.agent) {
    parts.push('--agent', options.agent)
  }

  // Escape the prompt content for shell
  const escapedContent = promptContent.replace(/'/g, "'\\''")
  parts.push('-p', `'${escapedContent}'`)

  return parts.join(' ')
}
