# Terminal Integration

> **Note:** For comprehensive TabzChrome documentation including REST API, MCP selectors, and automation patterns, see [tabz-integration.md](tabz-integration.md).

The homepage supports terminal bookmarks that run commands in the browser's sidebar terminal via the TabzChrome extension.

## Overview

Terminal bookmarks allow you to save and quickly execute shell commands directly from the bookmarks section. When clicked, commands are sent to the TabzChrome Chrome extension which spawns them in a terminal panel.

## Requirements

- **Chrome browser** with TabzChrome-simplified extension installed
- Extension must be configured with `externally_connectable` for your homepage URL

## Setup

### 1. Install TabzChrome Extension

Load the TabzChrome-simplified extension in Chrome:
1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the extension directory
4. Copy the extension ID (shown under the extension name)

### 2. Configure Extension ID

The homepage needs the extension ID to communicate with it:
1. Open the homepage
2. The extension ID is stored in localStorage key `terminal-extension-id`
3. Set it manually in browser dev tools:
   ```javascript
   localStorage.setItem('terminal-extension-id', 'YOUR_EXTENSION_ID')
   ```
4. Refresh the page

Once configured, the homepage will auto-detect the extension on load.

## Usage

### Creating Terminal Bookmarks

1. Go to **Bookmarks** section
2. Click **Add** button
3. If the extension is detected, you'll see a **Type** selector:
   - **Link** - Standard URL bookmark
   - **Terminal** - Command to run in terminal
4. For terminal type, enter:
   - **Name** - Display name (e.g., "LazyGit")
   - **Command** - Shell command to run (e.g., `lazygit`)
   - **Working Directory** (optional) - Path to cd to before running

### Running Commands

- **Click** a terminal bookmark to execute it immediately
- **Right-click** for context menu:
  - Run in Terminal
  - Copy Command
  - Edit / Delete

### Visual Indicators

Terminal bookmarks are styled differently from regular bookmarks:
- Green background tint (`bg-emerald-500/20`)
- Green border (`border-emerald-500/30`)
- Color bar indicator if custom color is set
- Dynamic icon based on action type:
  - Terminal icon - standard execute
  - ClipboardPaste icon - paste without execute (autoExecute: false)
  - MessageSquare icon - send to chat (sendToChat: true)
- Profile badge displayed if profile is set
- Action indicator icon on the right side in list view

## Architecture

### Hook: `useTerminalExtension`

Location: `hooks/useTerminalExtension.ts`

```typescript
const {
  available,
  backendRunning,
  authenticated,
  error,
  isLoaded,
  hasToken,
  defaultWorkDir,
  runCommand,
  spawnWithOptions,
  pasteToTerminal,
  sendToChat,
  setApiToken,
  clearApiToken,
  refreshStatus,
  updateDefaultWorkDir,
} = useTerminalExtension()
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `available` | `boolean` | Whether extension is detected and responding |
| `backendRunning` | `boolean` | Whether TabzChrome backend is running |
| `authenticated` | `boolean` | Whether API token is valid |
| `error` | `string \| null` | Error message if any |
| `isLoaded` | `boolean` | Whether initial check is complete |
| `hasToken` | `boolean` | Whether an API token is configured |
| `defaultWorkDir` | `string` | Default working directory |
| `runCommand` | `function` | Execute a command in terminal |
| `spawnWithOptions` | `function` | Spawn terminal with full options |
| `pasteToTerminal` | `function` | Paste command without executing |
| `sendToChat` | `function` | Send command to TabzChrome chat |
| `setApiToken` | `function` | Set API token |
| `clearApiToken` | `function` | Clear API token |
| `refreshStatus` | `function` | Refresh connection status |
| `updateDefaultWorkDir` | `function` | Update default working directory |

**runCommand signature:**
```typescript
runCommand(command: string, options?: {
  workingDir?: string  // Directory to run in
  name?: string        // Tab/session name
}): Promise<SpawnResult>
```

**spawnWithOptions signature:**
```typescript
interface SpawnOptions {
  name?: string
  command?: string
  workingDir?: string
  profile?: string
  autoExecute?: boolean
  color?: string
}

spawnWithOptions(options: SpawnOptions): Promise<SpawnResult>
```

**pasteToTerminal signature:**
```typescript
pasteToTerminal(command: string, options?: {
  workingDir?: string
  name?: string
  profile?: string
  color?: string
}): Promise<SpawnResult>
```

**sendToChat signature:**
```typescript
sendToChat(command: string): void
```

### BookmarkItem Type

Extended to support terminal commands with full TabzChrome spawn options:

```typescript
// Context action for terminal bookmarks
interface TerminalContextAction {
  label: string
  command: string
}

interface BookmarkItem {
  id: string
  name: string
  url: string           // For terminals: "terminal://command"
  folderId: string | null
  icon?: string
  description?: string
  createdAt: string
  // Terminal integration
  type?: "link" | "terminal"
  command?: string      // Shell command to execute
  workingDir?: string   // Working directory
  // TabzChrome-specific fields
  profile?: string           // TabzChrome terminal profile name
  autoExecute?: boolean      // Run command immediately vs paste only (default true)
  sendToChat?: boolean       // Queue in TabzChrome chat input instead
  color?: string             // Terminal tab color (e.g., "#10b981")
  contextActions?: TerminalContextAction[]  // Additional context menu items
}
```

### TabzChrome Options

When creating or editing a terminal bookmark, the following TabzChrome-specific options are available:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `profile` | string | - | Terminal profile name (e.g., "Default", "Zsh", "PowerShell") |
| `autoExecute` | boolean | true | If true, command runs immediately; if false, it's pasted without executing |
| `sendToChat` | boolean | false | If true, queues command in TabzChrome chat input instead of spawning terminal |
| `color` | string | - | Tab color in hex format (e.g., "#10b981") |
| `contextActions` | array | - | Custom context menu actions with label and command |

### Context Menu Actions

Right-click a terminal bookmark for enhanced actions:
- **Run in Terminal** - Execute command immediately (uses autoExecute setting)
- **Paste to Terminal** - Paste command without executing
- **Send to Chat** - Queue command in TabzChrome chat input
- **Copy Command** - Copy command to clipboard
- Custom actions defined in `contextActions` array

### Data Attributes

Terminal bookmark buttons include comprehensive data attributes for automation and external tools:

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-terminal-command` | The command to execute | `lazygit` |
| `data-tabz-action` | Action type | `spawn-terminal`, `paste-terminal`, `send-chat` |
| `data-tabz-command` | The command | `npm run dev` |
| `data-tabz-project` | Working directory | `~/projects/my-app` |
| `data-tabz-profile` | Terminal profile | `Default` |
| `data-tabz-item` | Unique identifier | `bookmark-abc123` |

These attributes enable:
- MCP-based automation selecting elements by action type
- External scripts discovering terminal bookmarks
- TabzChrome content scripts detecting actionable elements

### Chrome Extension Communication

Uses Chrome's `externally_connectable` messaging:

```typescript
// Ping to check availability
chrome.runtime.sendMessage(extensionId, { type: "PING" }, (response) => {
  // response: { ok: true, version: "1.0.0" }
})

// Spawn terminal
chrome.runtime.sendMessage(extensionId, {
  type: "SPAWN_TERMINAL",
  command: "lazygit",
  workingDir: "~/projects",
  name: "LazyGit"
}, (response) => {
  // response: { ok: true }
})
```

### Extension Manifest Requirements

The TabzChrome extension must include:

```json
{
  "externally_connectable": {
    "matches": [
      "http://localhost:*/*",
      "https://*.vercel.app/*"
    ]
  }
}
```

And handle external messages:

```javascript
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.type === "PING") {
    sendResponse({ ok: true, version: chrome.runtime.getManifest().version })
  } else if (message.type === "SPAWN_TERMINAL") {
    // Spawn terminal with message.command, message.workingDir, message.name
    sendResponse({ ok: true })
  }
})
```

## Conditional UI

The type selector (Link/Terminal) only appears when the extension is detected:

```typescript
const { available: terminalAvailable } = useTerminalExtension()

// In JSX:
{terminalAvailable && (
  <div>
    <label>Type</label>
    <Button onClick={() => setFormType("link")}>Link</Button>
    <Button onClick={() => setFormType("terminal")}>Terminal</Button>
  </div>
)}
```

This prevents users from creating terminal bookmarks they can't use.

## Storage

| Key | Location | Purpose |
|-----|----------|---------|
| `terminal-extension-id` | localStorage | Chrome extension ID |
| Bookmarks with `type: "terminal"` | GitHub repo | Synced terminal commands |

## File Locations

| File | Purpose |
|------|---------|
| `hooks/useTerminalExtension.ts` | Extension communication hook |
| `app/sections/bookmarks.tsx` | Bookmark UI with terminal support |

## See Also

- [TabzChrome Integration](tabz-integration.md) - Comprehensive TabzChrome documentation including:
  - REST API reference
  - MCP selector inventory for automation
  - Security considerations
  - Troubleshooting guide
