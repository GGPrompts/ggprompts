"use client"

import { useEffect, useCallback, useState, useRef } from "react"
import { toast } from "sonner"
import { CONNECTION_CHECK_INTERVAL, CONNECTION_TIMEOUT } from "../constants"
import type { TabzInboundMessage, TabzOutboundMessage, UseTabzBridgeReturn } from "../types"

/**
 * Hook for bi-directional messaging with TabzChrome extension via postMessage
 *
 * This hook provides communication with the TabzChrome content script
 * for features like:
 * - Receiving commands from TabzChrome context menu
 * - Sending prompts to TabzChrome chat
 * - Terminal spawning and pasting
 * - Connection status detection
 */
export function useTabzBridge(): UseTabzBridgeReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [lastReceivedCommand, setLastReceivedCommand] = useState<string | null>(null)
  const [lastReceivedAt, setLastReceivedAt] = useState<number | null>(null)

  const pingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const connectionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleTabzMessage = useCallback((data: TabzInboundMessage) => {
    switch (data.type) {
      case "TABZ_QUEUE_COMMAND":
        if (data.command) {
          setLastReceivedCommand(data.command)
          setLastReceivedAt(Date.now())
          toast.success("Command received from TabzChrome", {
            description:
              data.command.length > 50 ? `${data.command.substring(0, 50)}...` : data.command,
            duration: 3000,
          })
        }
        break

      case "TABZ_PASTE_COMMAND":
        if (data.command) {
          setLastReceivedCommand(data.command)
          setLastReceivedAt(Date.now())
          toast.info("Text pasted from TabzChrome", {
            description:
              data.command.length > 50 ? `${data.command.substring(0, 50)}...` : data.command,
            duration: 3000,
          })
        }
        break

      case "TABZ_STATUS":
        if (data.status === "connected") {
          setIsConnected(true)
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

  const sendMessage = useCallback(
    (message: Omit<TabzOutboundMessage, "source" | "timestamp">) => {
      const fullMessage: TabzOutboundMessage = {
        ...message,
        source: "personal-homepage",
        timestamp: Date.now(),
      }

      window.postMessage(fullMessage, "*")
    },
    []
  )

  const sendToChat = useCallback(
    (command: string) => {
      sendMessage({
        type: "HOMEPAGE_SEND_CHAT",
        command,
      })
      toast.success("Sent to TabzChrome chat", {
        description: command.length > 50 ? `${command.substring(0, 50)}...` : command,
        duration: 2000,
      })
    },
    [sendMessage]
  )

  const pasteToTerminal = useCallback(
    (command: string) => {
      sendMessage({
        type: "HOMEPAGE_PASTE_TERMINAL",
        command,
      })
      toast.success("Pasted to terminal", {
        description: command.length > 50 ? `${command.substring(0, 50)}...` : command,
        duration: 2000,
      })
    },
    [sendMessage]
  )

  const spawnTerminal = useCallback(
    (command: string, options?: { workingDir?: string; name?: string }) => {
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
    },
    [sendMessage]
  )

  const clearLastCommand = useCallback(() => {
    setLastReceivedCommand(null)
    setLastReceivedAt(null)
  }, [])

  const checkConnection = useCallback(() => {
    sendMessage({ type: "HOMEPAGE_PING" })

    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current)
    }

    pingTimeoutRef.current = setTimeout(() => {
      setIsConnected(false)
    }, CONNECTION_TIMEOUT)
  }, [sendMessage])

  const detectExtension = useCallback(() => {
    const marker = document.querySelector('[data-tabz-chrome="true"]')
    if (marker) {
      setIsConnected(true)
      return true
    }

    if ((window as unknown as { __TABZ_CHROME_CONNECTED__?: boolean }).__TABZ_CHROME_CONNECTED__) {
      setIsConnected(true)
      return true
    }

    return false
  }, [])

  // Set up message listener
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.source !== window) return

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
    const hasMarker = detectExtension()

    if (!hasMarker) {
      checkConnection()
    }

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
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            if (
              node instanceof Element &&
              node.getAttribute("data-tabz-chrome") === "true"
            ) {
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
