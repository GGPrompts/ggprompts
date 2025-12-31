/**
 * TabzChrome API configuration constants
 */

// REST API
export const TABZ_API_BASE = "http://localhost:8129"
export const TABZ_WS_URL = "ws://localhost:8129"

// Storage keys
export const TOKEN_STORAGE_KEY = "tabz-api-token"
export const DEFAULT_WORKDIR_KEY = "tabz-default-workdir"
export const MARKETPLACE_STORAGE_KEY = "ggprompts:marketplaces"
export const BRIDGE_STATE_KEY = "tabz-bridge-state"

// Timeouts
export const HEALTH_CHECK_TIMEOUT = 500
export const HEALTH_CHECK_INTERVAL = 30000 // 30 seconds
export const CONNECTION_CHECK_INTERVAL = 30000 // 30 seconds
export const CONNECTION_TIMEOUT = 5000 // 5 seconds
export const WEBSOCKET_TIMEOUT = 3000

// Defaults
export const DEFAULT_MARKETPLACE = "GGPrompts/my-gg-plugins"
export const DEFAULT_WORK_DIR = "~/projects"
