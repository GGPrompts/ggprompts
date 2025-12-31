"use client"

import { useState, useEffect } from "react"

export type Environment = "local" | "deployed" | "unknown"

interface EnvironmentInfo {
  environment: Environment
  isLocal: boolean
  isDeployed: boolean
  hostname: string
}

/**
 * Hook to detect whether the app is running locally or deployed
 *
 * Detection logic:
 * - localhost or 127.0.0.1 → local
 * - *.vercel.app or other domains → deployed
 */
export function useEnvironment(): EnvironmentInfo {
  const [info, setInfo] = useState<EnvironmentInfo>({
    environment: "unknown",
    isLocal: false,
    isDeployed: false,
    hostname: "",
  })

  useEffect(() => {
    const hostname = window.location.hostname
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1"
    const environment: Environment = isLocal ? "local" : "deployed"

    setInfo({
      environment,
      isLocal,
      isDeployed: !isLocal,
      hostname,
    })
  }, [])

  return info
}

/**
 * Sections that require localhost to function
 * These use Node.js APIs (execSync, spawn, fs) that don't work on Vercel
 */
export const LOCALHOST_REQUIRED_SECTIONS = [
  "projects",      // Scans ~/projects/ directory
  "jobs",          // Executes Claude CLI
  "ai-workspace",  // Streams from Claude/Gemini/Codex CLIs
] as const

export type LocalhostRequiredSection = typeof LOCALHOST_REQUIRED_SECTIONS[number]

export function requiresLocalhost(sectionId: string): boolean {
  return LOCALHOST_REQUIRED_SECTIONS.includes(sectionId as LocalhostRequiredSection)
}
