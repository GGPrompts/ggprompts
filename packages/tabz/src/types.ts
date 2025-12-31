/**
 * TabzChrome integration types
 */

// Terminal state from useTerminalExtension
export interface TerminalState {
  available: boolean
  backendRunning: boolean
  authenticated: boolean
  error: string | null
}

// Result from spawn operations
export interface SpawnResult {
  success: boolean
  error?: string
  terminal?: {
    id: string
    name: string
  }
}

// Full spawn options for TabzChrome API
export interface SpawnOptions {
  name?: string
  command?: string
  workingDir?: string
  profile?: string
  autoExecute?: boolean
  color?: string
}

// Simplified spawn options (used by useTabzChrome)
export interface SpawnTerminalOptions {
  name: string
  command?: string
  workingDir?: string
}

// Plugin installation
export type PluginScope = "user" | "project" | "local"

export interface InstallPluginOptions {
  slug: string
  marketplace?: string
  scope?: PluginScope
}

// TabzBridge message types
export interface TabzInboundMessage {
  type: "TABZ_QUEUE_COMMAND" | "TABZ_PASTE_COMMAND" | "TABZ_STATUS"
  command?: string
  status?: "connected" | "disconnected"
  source?: string
  timestamp?: number
}

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

// Hook return types
export interface UseTabzBridgeReturn {
  isConnected: boolean
  lastReceivedCommand: string | null
  lastReceivedAt: number | null
  sendToChat: (command: string) => void
  pasteToTerminal: (command: string) => void
  spawnTerminal: (command: string, options?: { workingDir?: string; name?: string }) => void
  clearLastCommand: () => void
  checkConnection: () => void
}

export interface UseTerminalExtensionReturn {
  available: boolean
  backendRunning: boolean
  authenticated: boolean
  error: string | null
  isLoaded: boolean
  hasToken: boolean
  defaultWorkDir: string
  runCommand: (command: string, options?: { workingDir?: string; name?: string }) => Promise<SpawnResult>
  spawnWithOptions: (options: SpawnOptions) => Promise<SpawnResult>
  pasteToTerminal: (command: string, options?: { workingDir?: string; name?: string; profile?: string; color?: string }) => Promise<SpawnResult>
  sendToChat: (command: string) => Promise<boolean>
  setApiToken: (token: string) => Promise<boolean>
  clearApiToken: () => void
  refreshStatus: () => Promise<boolean>
  updateDefaultWorkDir: (dir: string) => void
}

export interface UseTabzChromeReturn {
  isAvailable: boolean
  isChecking: boolean
  lastChecked: Date | null
  spawnTerminal: (options: SpawnTerminalOptions) => Promise<boolean>
  queueToChat: (prompt: string) => Promise<boolean>
  checkAvailability: () => Promise<boolean>
  ensureMarketplace: (repo: string) => Promise<boolean>
  installPlugin: (options: InstallPluginOptions) => Promise<boolean>
  uninstallPlugin: (slug: string, marketplace?: string) => Promise<boolean>
  isMarketplaceAdded: (repo: string) => boolean
}
