/**
 * TabzChrome utility functions
 */

import { DEFAULT_WORK_DIR, DEFAULT_WORKDIR_KEY, TOKEN_STORAGE_KEY, TABZ_API_BASE } from "./constants"

/**
 * Sanitize auth token by removing non-ASCII characters
 * Copy-paste can introduce invisible unicode that breaks HTTP headers
 */
export function sanitizeToken(token: string): string {
  return token.replace(/[^\x00-\xFF]/g, "")
}

/**
 * Check if we're running on localhost (safe to probe local network)
 */
export function isLocalhost(): boolean {
  if (typeof window === "undefined") return false
  const hostname = window.location.hostname
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
  )
}

/**
 * Get stored API token from localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    return token ? sanitizeToken(token) : null
  } catch {
    return null
  }
}

/**
 * Store API token in localStorage
 */
export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear stored API token
 */
export function clearStoredToken(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get default working directory from localStorage
 */
export function getDefaultWorkDir(): string {
  if (typeof window === "undefined") return DEFAULT_WORK_DIR
  try {
    return localStorage.getItem(DEFAULT_WORKDIR_KEY) || DEFAULT_WORK_DIR
  } catch {
    return DEFAULT_WORK_DIR
  }
}

/**
 * Set default working directory in localStorage
 */
export function setDefaultWorkDir(dir: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(DEFAULT_WORKDIR_KEY, dir)
  } catch {
    // Ignore storage errors
  }
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
  const parts = ["claude"]

  if (options?.yoloMode) {
    parts.push("--dangerously-skip-permissions")
  }

  if (options?.agent) {
    parts.push("--agent", options.agent)
  }

  // Escape the prompt content for shell
  const escapedContent = promptContent.replace(/'/g, "'\\''")
  parts.push("-p", `'${escapedContent}'`)

  return parts.join(" ")
}

/**
 * Check if TabzChrome backend is running via health endpoint
 */
export async function checkTabzChromeHealth(timeout = 500): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

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
 * Fetch auth token from TabzChrome backend
 */
export async function fetchTokenFromBackend(): Promise<string | null> {
  if (!isLocalhost()) return null

  try {
    const response = await fetch(`${TABZ_API_BASE}/api/auth/token`, {
      method: "GET",
    })
    if (response.ok) {
      const data = await response.json()
      return data.token || null
    }
  } catch {
    // Backend not reachable
  }
  return null
}
