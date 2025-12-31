"use client"

import { useState, useEffect, useCallback } from "react"
import { TABZ_API_BASE, WEBSOCKET_TIMEOUT } from "../constants"
import type { TerminalState, SpawnResult, SpawnOptions, UseTerminalExtensionReturn } from "../types"
import {
  isLocalhost,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  getDefaultWorkDir,
  setDefaultWorkDir,
  sanitizeToken,
  fetchTokenFromBackend,
} from "../utils"

/**
 * Hook for TabzChrome REST API integration
 *
 * Provides terminal spawning, command execution, and connection status
 * via the TabzChrome backend at localhost:8129.
 *
 * Features:
 * - Token-based authentication
 * - Terminal spawning with custom options
 * - Command pasting without execution
 * - WebSocket chat integration
 * - Automatic token fetching on localhost
 */
export function useTerminalExtension(): UseTerminalExtensionReturn {
  const [state, setState] = useState<TerminalState>({
    available: false,
    backendRunning: false,
    authenticated: false,
    error: null,
  })
  const [token, setToken] = useState<string | null>(null)
  const [defaultWorkDir, setDefaultWorkDirState] = useState<string>(() => getDefaultWorkDir())
  const [isLoaded, setIsLoaded] = useState(false)

  // Check if backend is running and we have valid auth
  const checkBackend = useCallback(async (authToken: string | null, skipProbe = false): Promise<TerminalState> => {
    if (skipProbe) {
      if (!authToken) {
        return {
          available: false,
          backendRunning: false,
          authenticated: false,
          error: "API token required. Paste from TabzChrome extension Settings > API Token",
        }
      }
      return {
        available: false,
        backendRunning: false,
        authenticated: false,
        error: null,
      }
    }

    try {
      const response = await fetch(`${TABZ_API_BASE}/api/health`, {
        method: "GET",
      })
      if (!response.ok) {
        return {
          available: false,
          backendRunning: false,
          authenticated: false,
          error: "TabzChrome backend not responding",
        }
      }
    } catch {
      return {
        available: false,
        backendRunning: false,
        authenticated: false,
        error: "TabzChrome backend not running. Start the backend on localhost:8129",
      }
    }

    if (!authToken) {
      return {
        available: false,
        backendRunning: true,
        authenticated: false,
        error: "API token required. Copy from TabzChrome extension Settings > API Token",
      }
    }

    try {
      const tokenResponse = await fetch(`${TABZ_API_BASE}/api/auth/token`)
      if (tokenResponse.ok) {
        const data = await tokenResponse.json()
        const backendToken = data.token
        if (backendToken && backendToken !== authToken) {
          return {
            available: false,
            backendRunning: true,
            authenticated: false,
            error: "API token expired. Copy a fresh token from TabzChrome extension Settings > API Token",
          }
        }
      }
    } catch {
      // Fall through to optimistic auth
    }

    return {
      available: true,
      backendRunning: true,
      authenticated: true,
      error: null,
    }
  }, [])

  // Initialize
  useEffect(() => {
    const init = async () => {
      const onLocalhost = isLocalhost()

      let authToken = await fetchTokenFromBackend()

      if (!authToken) {
        authToken = getStoredToken()
      } else {
        setStoredToken(authToken)
      }

      setToken(authToken)

      const newState = await checkBackend(authToken, !onLocalhost)
      setState(newState)
      setIsLoaded(true)
    }

    init()
  }, [checkBackend])

  // Run a command in the terminal via REST API
  const runCommand = useCallback(
    async (command: string, options?: { workingDir?: string; name?: string }): Promise<SpawnResult> => {
      const currentToken = token || getStoredToken()

      if (!currentToken) {
        return {
          success: false,
          error: "API token required. Add your TabzChrome API token in Profile settings.",
        }
      }

      try {
        const workingDir = options?.workingDir || defaultWorkDir || getDefaultWorkDir()

        const response = await fetch(`${TABZ_API_BASE}/api/spawn`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": currentToken,
          },
          body: JSON.stringify({
            name: options?.name || "Terminal",
            workingDir,
            command,
          }),
        })

        const data = await response.json()

        if (response.status === 401 || response.status === 403) {
          setState(prev => ({
            ...prev,
            authenticated: false,
            available: false,
            error: "Invalid API token. Copy a fresh token from TabzChrome extension Settings > API Token",
          }))
          return {
            success: false,
            error: "Authentication failed. Your API token may be expired or invalid.",
          }
        }

        if (!response.ok) {
          return {
            success: false,
            error: data.error || `Request failed with status ${response.status}`,
          }
        }

        if (data.success) {
          return {
            success: true,
            terminal: data.terminal,
          }
        } else {
          return {
            success: false,
            error: data.error || "Unknown error",
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"

        const isNetworkError =
          errorMessage.includes("fetch") ||
          errorMessage.includes("network") ||
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("NetworkError") ||
          errorMessage.includes("CORS") ||
          err instanceof TypeError

        if (isNetworkError) {
          setState({
            available: false,
            backendRunning: false,
            authenticated: false,
            error: "TabzChrome backend not running. Start the backend on localhost:8129",
          })
          return {
            success: false,
            error: "Cannot connect to TabzChrome backend. Make sure it's running on localhost:8129",
          }
        }

        return {
          success: false,
          error: errorMessage,
        }
      }
    },
    [token, defaultWorkDir]
  )

  // Spawn terminal with full options
  const spawnWithOptions = useCallback(
    async (options: SpawnOptions): Promise<SpawnResult> => {
      const currentToken = token || getStoredToken()

      if (!currentToken) {
        return {
          success: false,
          error: "API token required. Add your TabzChrome API token in Profile settings.",
        }
      }

      try {
        const workingDir = options.workingDir || defaultWorkDir || getDefaultWorkDir()

        const response = await fetch(`${TABZ_API_BASE}/api/spawn`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": currentToken,
          },
          body: JSON.stringify({
            name: options.name || "Terminal",
            workingDir,
            command: options.command,
            profile: options.profile,
            autoExecute: options.autoExecute !== false,
            color: options.color,
          }),
        })

        const data = await response.json()

        if (response.status === 401 || response.status === 403) {
          setState(prev => ({
            ...prev,
            authenticated: false,
            available: false,
            error: "Invalid API token. Copy a fresh token from TabzChrome extension Settings > API Token",
          }))
          return {
            success: false,
            error: "Authentication failed. Your API token may be expired or invalid.",
          }
        }

        if (!response.ok) {
          return {
            success: false,
            error: data.error || `Request failed with status ${response.status}`,
          }
        }

        if (data.success) {
          return {
            success: true,
            terminal: data.terminal,
          }
        } else {
          return {
            success: false,
            error: data.error || "Unknown error",
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"

        const isNetworkError =
          errorMessage.includes("fetch") ||
          errorMessage.includes("network") ||
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("NetworkError") ||
          errorMessage.includes("CORS") ||
          err instanceof TypeError

        if (isNetworkError) {
          setState({
            available: false,
            backendRunning: false,
            authenticated: false,
            error: "TabzChrome backend not running. Start the backend on localhost:8129",
          })
          return {
            success: false,
            error: "Cannot connect to TabzChrome backend. Make sure it's running on localhost:8129",
          }
        }

        return {
          success: false,
          error: errorMessage,
        }
      }
    },
    [token, defaultWorkDir]
  )

  // Paste command to terminal without executing
  const pasteToTerminal = useCallback(
    async (
      command: string,
      options?: { workingDir?: string; name?: string; profile?: string; color?: string }
    ): Promise<SpawnResult> => {
      return spawnWithOptions({
        command,
        name: options?.name,
        workingDir: options?.workingDir,
        profile: options?.profile,
        color: options?.color,
        autoExecute: false,
      })
    },
    [spawnWithOptions]
  )

  // Send command to TabzChrome chat via WebSocket
  const sendToChat = useCallback(async (command: string): Promise<boolean> => {
    if (typeof window === "undefined") return false

    try {
      const tokenResponse = await fetch(`${TABZ_API_BASE}/api/auth/token`, {
        signal: AbortSignal.timeout(2000),
      })
      if (!tokenResponse.ok) {
        return false
      }
      const { token: wsToken } = await tokenResponse.json()
      if (!wsToken) {
        return false
      }

      const cleanToken = sanitizeToken(wsToken)
      const wsUrl = `ws://localhost:8129?token=${cleanToken}`

      return new Promise((resolve) => {
        try {
          const ws = new WebSocket(wsUrl)
          const timeout = setTimeout(() => {
            ws.close()
            resolve(false)
          }, WEBSOCKET_TIMEOUT)

          ws.onopen = () => {
            ws.send(JSON.stringify({ type: "QUEUE_COMMAND", command }))
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
  }, [])

  // Set default working directory
  const updateDefaultWorkDir = useCallback((dir: string) => {
    setDefaultWorkDir(dir)
    setDefaultWorkDirState(dir)
  }, [])

  // Set API token manually
  const setApiToken = useCallback(async (newToken: string): Promise<boolean> => {
    if (!newToken.trim()) {
      return false
    }

    const sanitizedToken = sanitizeToken(newToken.trim())

    try {
      const response = await fetch(`${TABZ_API_BASE}/api/health`)
      if (!response.ok) {
        setState({
          available: false,
          backendRunning: false,
          authenticated: false,
          error: "TabzChrome backend not responding",
        })
        return false
      }
    } catch {
      setState({
        available: false,
        backendRunning: false,
        authenticated: false,
        error: "Cannot reach TabzChrome backend. Make sure it's running on localhost:8129",
      })
      return false
    }

    try {
      const tokenResponse = await fetch(`${TABZ_API_BASE}/api/auth/token`)
      if (tokenResponse.ok) {
        const data = await tokenResponse.json()
        const backendToken = data.token
        if (backendToken && backendToken !== sanitizedToken) {
          setState({
            available: false,
            backendRunning: true,
            authenticated: false,
            error: "Invalid token. Make sure you copied the current token from TabzChrome extension Settings.",
          })
          return false
        }
      }
    } catch {
      // Allow through
    }

    setStoredToken(sanitizedToken)
    setToken(sanitizedToken)

    setState({
      available: true,
      backendRunning: true,
      authenticated: true,
      error: null,
    })
    return true
  }, [])

  // Clear API token
  const clearApiToken = useCallback(() => {
    clearStoredToken()
    setToken(null)
    setState(prev => ({
      ...prev,
      authenticated: false,
      available: false,
      error: "API token required. Copy from TabzChrome extension Settings > API Token",
    }))
  }, [])

  // Refresh connection status
  const refreshStatus = useCallback(async () => {
    let authToken = await fetchTokenFromBackend()

    if (!authToken) {
      authToken = getStoredToken()
    } else {
      setStoredToken(authToken)
    }

    setToken(authToken)
    const newState = await checkBackend(authToken, false)
    setState(newState)

    return newState.available
  }, [checkBackend])

  return {
    available: state.available,
    backendRunning: state.backendRunning,
    authenticated: state.authenticated,
    error: state.error,
    isLoaded,
    hasToken: !!token,
    defaultWorkDir,
    runCommand,
    spawnWithOptions,
    pasteToTerminal,
    sendToChat,
    setApiToken,
    clearApiToken,
    refreshStatus,
    updateDefaultWorkDir,
  }
}
