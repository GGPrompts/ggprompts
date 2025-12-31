/**
 * Backend Detection Utility
 * Checks which AI backends are available on the system
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import { homedir } from 'os'
import { join } from 'path'
import { access } from 'fs/promises'
import type { AIBackend } from './types'

const execAsync = promisify(exec)

// Path to the Claude CLI binary (local install)
const CLAUDE_BIN = join(homedir(), '.claude', 'local', 'claude')

const DOCKER_API_BASE = process.env.DOCKER_MODEL_API
  ? `${process.env.DOCKER_MODEL_API}/engines/v1`
  : 'http://localhost:12434/engines/v1'

export interface BackendStatus {
  backend: AIBackend
  available: boolean
  error?: string
}

/**
 * Check if a CLI tool is available
 */
async function checkCLI(command: string): Promise<boolean> {
  try {
    await execAsync(`command -v ${command}`)
    return true
  } catch {
    return false
  }
}

/**
 * Check if Claude CLI is available
 */
export async function checkClaudeCLI(): Promise<BackendStatus> {
  try {
    // Check if the claude binary exists at the expected path
    await access(CLAUDE_BIN)
    return { backend: 'claude', available: true }
  } catch {
    // Fall back to checking PATH
    const available = await checkCLI('claude')
    return {
      backend: 'claude',
      available,
      error: available ? undefined : 'Claude CLI not found at ~/.claude/local/claude'
    }
  }
}

/**
 * Check if Gemini CLI is available
 */
export async function checkGeminiCLI(): Promise<BackendStatus> {
  const available = await checkCLI('gemini')
  return {
    backend: 'gemini',
    available,
    error: available ? undefined : 'Gemini CLI not found'
  }
}

/**
 * Check if Codex CLI is available
 */
export async function checkCodexCLI(): Promise<BackendStatus> {
  const available = await checkCLI('codex')
  return {
    backend: 'codex',
    available,
    error: available ? undefined : 'Codex CLI not found'
  }
}

/**
 * Check if Docker Model Runner API is available
 */
export async function checkDockerModels(): Promise<BackendStatus> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)

    const response = await fetch(`${DOCKER_API_BASE}/models`, {
      signal: controller.signal
    })

    clearTimeout(timeout)

    if (response.ok) {
      return { backend: 'docker', available: true }
    }

    return {
      backend: 'docker',
      available: false,
      error: 'Docker Model Runner API not responding'
    }
  } catch (error) {
    return {
      backend: 'docker',
      available: false,
      error: `Docker Model Runner not available at ${DOCKER_API_BASE}`
    }
  }
}

/**
 * Mock backend is always available as fallback
 */
export function checkMock(): BackendStatus {
  return { backend: 'mock', available: true }
}

/**
 * Check all backends and return their status
 */
export async function getAvailableBackends(): Promise<BackendStatus[]> {
  const [claude, gemini, codex, docker, mock] = await Promise.all([
    checkClaudeCLI(),
    checkGeminiCLI(),
    checkCodexCLI(),
    checkDockerModels(),
    Promise.resolve(checkMock())
  ])

  return [claude, gemini, codex, docker, mock]
}

/**
 * Alias for getAvailableBackends (legacy name)
 */
export const detectBackend = getAvailableBackends

/**
 * Get the first available backend (priority order: claude, gemini, codex, docker, mock)
 */
export async function getDefaultBackend(): Promise<AIBackend> {
  const backends = await getAvailableBackends()
  const available = backends.find(b => b.available)
  return available?.backend || 'mock'
}
