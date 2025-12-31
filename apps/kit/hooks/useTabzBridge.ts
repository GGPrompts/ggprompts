"use client"

import { useEffect, useCallback, useState, useRef } from "react"
import { toast } from "sonner"

// ============================================================================
// TYPES
// ============================================================================

/**
 * Inbound message types from TabzChrome extension
 */
export interface TabzInboundMessage {
  type: "TABZ_QUEUE_COMMAND" | "TABZ_PASTE_COMMAND" | "TABZ_STATUS"
  command?: string
  status?: "connected" | "disconnected"
  source?: string
  timestamp?: number
}

/**
 * Outbound message types to TabzChrome extension
 */
export interface TabzOutboundMessage {
  type:
    | "HOMEPAGE_SEND_CHAT"
    | "HOMEPAGE_SPAWN_TERMINAL"
    | "HOMEPAGE_PASTE_TERMINAL"
    | "HOMEPAGE_PING"
  command?: string
  workingDir?: string
  name?: string
  source: "personal-homepage"
  timestamp: number
}

/**
 * Return type for the useTabzBridge hook
 */
export interface UseTabzBridgeReturn {
  /** Whether TabzChrome extension is detected/connected */
  isConnected: boolean
  /** Last command received from TabzChrome (via "Send to Tabz" context menu) */
  lastReceivedCommand: string | null
  /** Timestamp of when the last command was received */
  lastReceivedAt: number | null
  /** Send a command/prompt to TabzChrome chat interface */
  sendToChat: (command: string) => void
  /** Request TabzChrome to paste command to terminal */
  pasteToTerminal: (command: string) => void
  /** Request TabzChrome to spawn a new terminal with optional command */
  spawnTerminal: (command: string, options?: { workingDir?: string; name?: string }) => void
  /** Clear the last received command */
  clearLastCommand: () => void
  /** Manually trigger a connection check */
  checkConnection: () => void
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CONNECTION_CHECK_INTERVAL = 30000 // 30 seconds
const CONNECTION_TIMEOUT = 5000 // 5 seconds to wait for pong response
const STORAGE_KEY = "tabz-bridge-state"

// ============================================================================
// HOOK
// ============================================================================

export function useTabzBridge(): UseTabzBridgeReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [lastReceivedCommand, setLastReceivedCommand] = useState<string | null>(null)
  const [lastReceivedAt, setLastReceivedAt] = useState<number | null>(null)

  // Track pending ping for connection check
  const pingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const connectionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // ============================================================================
  // MESSAGE HANDLERS
  // ============================================================================

  const handleTabzMessage = useCallback((data: TabzInboundMessage) => {
    switch (data.type) {
      case "TABZ_QUEUE_COMMAND":
        if (data.command) {
          setLastReceivedCommand(data.command)
          setLastReceivedAt(Date.now())
          toast.success("Command received from TabzChrome", {
            description: data.command.length > 50
              ? `${data.command.substring(0, 50)}...`
              : data.command,
            duration: 3000,
          })
        }
        break

      case "TABZ_PASTE_COMMAND":
        if (data.command) {
          setLastReceivedCommand(data.command)
          setLastReceivedAt(Date.now())
          toast.info("Text pasted from TabzChrome", {
            description: data.command.length > 50
              ? `${data.command.substring(0, 50)}...`
              : data.command,
            duration: 3000,
          })
        }
        break

      case "TABZ_STATUS":
        if (data.status === "connected") {
          setIsConnected(true)
          // Clear any pending ping timeout since we got a response
          if (pingTimeoutRef.current) {
            clearTimeout(pingTimeoutRef.current)
            pingTimeoutRef.current = null
          }
        } else if (data.status === "disconnected") {
          setIsConnected(false)
        }
        break
    }
  }, [])

  // ============================================================================
  // OUTBOUND MESSAGE SENDERS
  // ============================================================================

  const sendMessage = useCallback((message: Omit<TabzOutboundMessage, "source" | "timestamp">) => {
    const fullMessage: TabzOutboundMessage = {
      ...message,
      source: "personal-homepage",
      timestamp: Date.now(),
    }

    // Post to window (content script will pick it up)
    window.postMessage(fullMessage, "*")
  }, [])

  const sendToChat = useCallback((command: string) => {
    sendMessage({
      type: "HOMEPAGE_SEND_CHAT",
      command,
    })
    toast.success("Sent to TabzChrome chat", {
      description: command.length > 50 ? `${command.substring(0, 50)}...` : command,
      duration: 2000,
    })
  }, [sendMessage])

  const pasteToTerminal = useCallback((command: string) => {
    sendMessage({
      type: "HOMEPAGE_PASTE_TERMINAL",
      command,
    })
    toast.success("Pasted to terminal", {
      description: command.length > 50 ? `${command.substring(0, 50)}...` : command,
      duration: 2000,
    })
  }, [sendMessage])

  const spawnTerminal = useCallback((command: string, options?: { workingDir?: string; name?: string }) => {
    sendMessage({
      type: "HOMEPAGE_SPAWN_TERMINAL",
      command,
      workingDir: options?.workingDir,
      name: options?.name,
    })
    toast.success("Terminal spawn requested", {
      description: command.length > 50 ? `${command.substring(0, 50)}...` : command,
      duration: 2000,
    })
  }, [sendMessage])

  const clearLastCommand = useCallback(() => {
    setLastReceivedCommand(null)
    setLastReceivedAt(null)
  }, [])

  // ============================================================================
  // CONNECTION DETECTION
  // ============================================================================

  const checkConnection = useCallback(() => {
    // Send a ping message
    sendMessage({ type: "HOMEPAGE_PING" })

    // Set a timeout - if we don't get a pong (TABZ_STATUS connected) within timeout, mark as disconnected
    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current)
    }

    pingTimeoutRef.current = setTimeout(() => {
      // No response received, likely not connected
      setIsConnected(false)
    }, CONNECTION_TIMEOUT)
  }, [sendMessage])

  // Check for TabzChrome content script marker
  const detectExtension = useCallback(() => {
    // Check for content script marker element
    const marker = document.querySelector('[data-tabz-chrome="true"]')
    if (marker) {
      setIsConnected(true)
      return true
    }

    // Also check for window property that content script might set
    if ((window as any).__TABZ_CHROME_CONNECTED__) {
      setIsConnected(true)
      return true
    }

    return false
  }, [])

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Set up message listener
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Only process messages from the same window (content script)
      if (event.source !== window) return

      // Check if it's a Tabz message
      const data = event.data
      if (!data || typeof data !== "object") return
      if (!data.type || typeof data.type !== "string") return
      if (!data.type.startsWith("TABZ_")) return

      handleTabzMessage(data as TabzInboundMessage)
    }

    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [handleTabzMessage])

  // Initial detection and periodic connection check
  useEffect(() => {
    // Initial detection
    const hasMarker = detectExtension()

    // If no marker found, try a ping
    if (!hasMarker) {
      checkConnection()
    }

    // Set up periodic connection check
    connectionCheckIntervalRef.current = setInterval(() => {
      checkConnection()
    }, CONNECTION_CHECK_INTERVAL)

    return () => {
      if (connectionCheckIntervalRef.current) {
        clearInterval(connectionCheckIntervalRef.current)
      }
      if (pingTimeoutRef.current) {
        clearTimeout(pingTimeoutRef.current)
      }
    }
  }, [detectExtension, checkConnection])

  // Listen for extension installation/activation
  useEffect(() => {
    // Watch for the marker element being added
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            if (node instanceof Element && node.getAttribute("data-tabz-chrome") === "true") {
              setIsConnected(true)
              return
            }
          }
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    isConnected,
    lastReceivedCommand,
    lastReceivedAt,
    sendToChat,
    pasteToTerminal,
    spawnTerminal,
    clearLastCommand,
    checkConnection,
  }
}
