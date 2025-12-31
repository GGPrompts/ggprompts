/**
 * @ggprompts/tabz - TabzChrome integration helpers
 *
 * Provides hooks and components for integrating with TabzChrome,
 * a browser extension for terminal spawning and AI automation.
 */

// Constants
export * from "./constants"

// Types
export * from "./types"

// Utilities
export {
  sanitizeToken,
  isLocalhost,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  getDefaultWorkDir,
  setDefaultWorkDir,
  buildClaudeCommand,
  checkTabzChromeHealth,
  fetchTokenFromBackend,
} from "./utils"

// Hooks
export { useTerminalExtension } from "./hooks/useTerminalExtension"
export { useTabzBridge } from "./hooks/useTabzBridge"
export { useTabzChrome, TabzChromeProvider } from "./hooks/useTabzChrome"

// Components
export { TabzConnectionStatus } from "./components/TabzConnectionStatus"
