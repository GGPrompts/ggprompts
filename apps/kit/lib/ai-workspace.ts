// ============================================================================
// AI WORKSPACE - TYPES, CONSTANTS & UTILITIES
// ============================================================================

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type MessageRole = 'user' | 'assistant' | 'system'
export type AIBackend = 'claude' | 'gemini' | 'codex' | 'docker' | 'mock'

// Tool use tracking
export interface ToolUse {
  id: string
  name: string
  input?: string
  status: 'running' | 'complete'
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  feedback?: 'up' | 'down'
  isStreaming?: boolean
  model?: AIBackend  // Which model generated this response
  toolUses?: ToolUse[]  // Tool uses in this message
}

// Claude stream event types (matching lib/ai/claude.ts)
export interface ClaudeStreamEvent {
  type: 'text' | 'tool_start' | 'tool_input' | 'tool_end' | 'heartbeat' | 'error' | 'done'
  content?: string
  tool?: {
    id: string
    name: string
    input?: string
  }
  error?: string
  sessionId?: string
}

export interface TokenUsage {
  inputTokens: number
  outputTokens: number
  cacheReadTokens?: number
  cacheCreationTokens?: number
  totalTokens: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  model?: string
  projectPath?: string | null
  settings?: ConversationSettings
  claudeSessionId?: string | null
  usage?: TokenUsage | null  // Actual token usage from Claude CLI (when available)
}

// Settings stored per-conversation
export interface ConversationSettings {
  systemPrompt?: string
  // Claude CLI specific options
  claudeModel?: string
  additionalDirs?: string[]
  allowedTools?: string[]
  disallowedTools?: string[]
  permissionMode?: 'acceptEdits' | 'bypassPermissions' | 'default' | 'plan'
  // Docker model options (only applicable for docker backend)
  temperature?: number
  maxTokens?: number
}

export interface SuggestedPrompt {
  text: string
  category: string
}

export interface ChatSettings {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  suggestedPrompts?: SuggestedPrompt[]
  // Claude CLI specific options
  additionalDirs?: string[]
  claudeModel?: string
  claudeAgent?: string  // --agent flag
  allowedTools?: string[]
  disallowedTools?: string[]
  permissionMode?: 'acceptEdits' | 'bypassPermissions' | 'default' | 'plan'
  // Gemini CLI specific options
  geminiModel?: string
  // Codex CLI specific options
  codexModel?: string
  reasoningEffort?: 'low' | 'medium' | 'high'
  sandbox?: 'read-only' | 'full' | 'off'
}

export interface ModelInfo {
  id: string
  name: string
  backend: AIBackend
  description?: string
}

export interface BackendStatus {
  backend: string
  available: boolean
  error?: string
}

export interface GeneratingState {
  startedAt: number
  model: string
}

export type GeneratingConversations = Record<string, GeneratingState>

// ============================================================================
// CONSTANTS
// ============================================================================

export const DEFAULT_SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { text: "What files are in this project?", category: "Explore" },
  { text: "Explain the architecture of this codebase", category: "Learn" },
  { text: "Find any TODO comments in the code", category: "Search" },
  { text: "What dependencies does this project use?", category: "Info" },
]

export const DEFAULT_SETTINGS: ChatSettings = {
  model: 'mock', // Default to mock until we fetch real models
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: '', // Empty by default - let the AI use its vanilla behavior
  suggestedPrompts: DEFAULT_SUGGESTED_PROMPTS,
}

// Model colors for badges
export const MODEL_COLORS: Record<AIBackend, { bg: string; text: string; border: string }> = {
  claude: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' },
  gemini: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40' },
  codex: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40' },
  docker: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40' },
  mock: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/40' },
}

export const MODEL_ICONS: Record<AIBackend, string> = {
  claude: '🧡',
  gemini: '💎',
  codex: '🤖',
  docker: '🐳',
  mock: '🎭',
}

export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  claude: 'Claude',
  gemini: 'Gemini',
  codex: 'Codex',
  docker: 'Local Model',
  mock: 'Mock AI',
}

// Mock responses for demonstration
export const MOCK_RESPONSES: Record<string, string> = {
  debug: "I'd be happy to help debug your TypeScript error! Here's a systematic approach:\n\n```typescript\n// Common TypeScript errors and fixes:\n\n// 1. Type mismatch\nconst value: string = 42; // ❌ Error\nconst value: string = \"42\"; // ✅ Fixed\n\n// 2. Property doesn't exist\ninterface User {\n  name: string;\n}\nconst user: User = { name: \"John\", age: 30 }; // ❌\n\n// Fix: Extend interface\ninterface User {\n  name: string;\n  age?: number; // Optional property\n}\n```\n\nCould you share the specific error message you're seeing?",

  async: "Great question! `async/await` is syntactic sugar for working with Promises in JavaScript:\n\n```javascript\n// Traditional Promise chain\nfetchUser(id)\n  .then(user => fetchPosts(user.id))\n  .then(posts => console.log(posts))\n  .catch(error => console.error(error));\n\n// Same with async/await\nasync function getUserPosts(id) {\n  try {\n    const user = await fetchUser(id);\n    const posts = await fetchPosts(user.id);\n    console.log(posts);\n  } catch (error) {\n    console.error(error);\n  }\n}\n```\n\n**Key concepts:**\n- `async` makes a function return a Promise\n- `await` pauses execution until Promise resolves\n- Makes asynchronous code look synchronous",

  component: "Here's a modern React component with TypeScript:\n\n```tsx\nimport React, { useState } from 'react';\n\ninterface UserCardProps {\n  name: string;\n  role: string;\n  avatarUrl?: string;\n  onContact?: () => void;\n}\n\nexport function UserCard({ \n  name, \n  role, \n  avatarUrl, \n  onContact \n}: UserCardProps) {\n  const [isHovered, setIsHovered] = useState(false);\n\n  return (\n    <div \n      className=\"glass rounded-lg p-6\"\n      onMouseEnter={() => setIsHovered(true)}\n      onMouseLeave={() => setIsHovered(false)}\n    >\n      <div className=\"flex items-center gap-4\">\n        <img \n          src={avatarUrl || '/default-avatar.png'} \n          alt={name}\n          className=\"w-16 h-16 rounded-full\"\n        />\n        \n        <div className=\"flex-1\">\n          <h3 className=\"text-lg font-semibold terminal-glow\">{name}</h3>\n          <p className=\"text-sm text-muted-foreground\">{role}</p>\n        </div>\n        \n        {onContact && (\n          <button\n            onClick={onContact}\n            className=\"px-4 py-2 bg-primary text-primary-foreground rounded-md\"\n          >\n            Contact\n          </button>\n        )}\n      </div>\n    </div>\n  );\n}\n```",

  review: "I'll review your code for best practices. Here are key areas I look for:\n\n**✅ Good Practices:**\n```typescript\n// 1. Descriptive naming\nconst calculateUserAge = (birthDate: Date) => {...}\n\n// 2. Single responsibility\nfunction validateEmail(email: string): boolean {...}\nfunction sendEmail(to: string, subject: string) {...}\n\n// 3. Early returns\nfunction processUser(user: User | null) {\n  if (!user) return null;\n  if (!user.isActive) return null;\n  \n  return processActiveUser(user);\n}\n\n// 4. Type safety\ninterface Config {\n  apiKey: string;\n  timeout: number;\n}\n```\n\nShare your code and I'll provide specific feedback!",

  default: "I'm here to help! I can assist with:\n\n🐛 **Debugging** - Fix errors and issues in your code\n📚 **Learning** - Explain concepts and best practices\n⚡ **Coding** - Generate components and functions\n✅ **Review** - Analyze code quality\n\nNote: This is a mock response. In Phase 2, I'll connect to real AI backends.\n\nWhat would you like to work on?"
}

export const GENERATING_STORAGE_KEY = 'ai-workspace-generating'
const GENERATING_STALE_THRESHOLD = 10 * 60 * 1000 // 10 minutes

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Parse Claude events from content that may contain __CLAUDE_EVENT__<JSON>__END_EVENT__ markers
export function parseClaudeEvents(content: string): { text: string; events: ClaudeStreamEvent[] } {
  const events: ClaudeStreamEvent[] = []
  const eventRegex = /__CLAUDE_EVENT__(.*?)__END_EVENT__/g
  let text = content

  let match
  while ((match = eventRegex.exec(content)) !== null) {
    try {
      const event = JSON.parse(match[1]) as ClaudeStreamEvent
      events.push(event)
    } catch {
      // Invalid JSON, skip
    }
  }

  // Remove event markers from text
  text = content.replace(/__CLAUDE_EVENT__.*?__END_EVENT__/g, '').replace(/\n{3,}/g, '\n\n')

  return { text, events }
}

export function getResponseForPrompt(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()

  if (lowerPrompt.includes('debug') || lowerPrompt.includes('error')) return MOCK_RESPONSES.debug
  if (lowerPrompt.includes('async') || lowerPrompt.includes('await')) return MOCK_RESPONSES.async
  if (lowerPrompt.includes('component') || lowerPrompt.includes('react')) return MOCK_RESPONSES.component
  if (lowerPrompt.includes('review') || lowerPrompt.includes('best practice')) return MOCK_RESPONSES.review

  return MOCK_RESPONSES.default
}

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

// Load conversations from localStorage
export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return []

  const now = new Date()
  const today = now.toDateString()

  try {
    const saved = localStorage.getItem("ai-workspace-conversations")
    if (saved) {
      const parsed = JSON.parse(saved)
      // Convert date strings back to Date objects
      // Also refresh empty conversations to current date
      return parsed.map((conv: any) => {
        const createdAt = new Date(conv.createdAt)
        const updatedAt = new Date(conv.updatedAt)
        const isEmpty = !conv.messages || conv.messages.length === 0
        const isOldEmptyConversation = isEmpty && createdAt.toDateString() !== today

        return {
          ...conv,
          // Reset empty conversations to today's date
          createdAt: isOldEmptyConversation ? now : createdAt,
          updatedAt: isOldEmptyConversation ? now : updatedAt,
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }
      })
    }
  } catch {
    // Invalid JSON, use defaults
  }

  return [{
    id: generateId(),
    title: 'New Conversation',
    messages: [],
    createdAt: now,
    updatedAt: now,
  }]
}

// Load settings from localStorage
export function loadSettings(): ChatSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS

  try {
    const saved = localStorage.getItem("ai-workspace-settings")
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
    }
  } catch {
    // Invalid JSON, use defaults
  }

  return DEFAULT_SETTINGS
}

// ============================================================================
// GENERATING STATE TRACKING
// ============================================================================

export function loadGeneratingConversations(): GeneratingConversations {
  if (typeof window === "undefined") return {}

  try {
    const saved = localStorage.getItem(GENERATING_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as GeneratingConversations
      // Clean up stale entries
      const now = Date.now()
      const cleaned: GeneratingConversations = {}
      for (const [id, state] of Object.entries(parsed)) {
        if (now - state.startedAt < GENERATING_STALE_THRESHOLD) {
          cleaned[id] = state
        }
      }
      // Save cleaned version if different
      if (Object.keys(cleaned).length !== Object.keys(parsed).length) {
        localStorage.setItem(GENERATING_STORAGE_KEY, JSON.stringify(cleaned))
      }
      return cleaned
    }
  } catch {
    // Invalid JSON
  }
  return {}
}

export function setGenerating(convId: string, model: string): void {
  if (typeof window === "undefined") return

  const current = loadGeneratingConversations()
  current[convId] = { startedAt: Date.now(), model }
  localStorage.setItem(GENERATING_STORAGE_KEY, JSON.stringify(current))

  // Dispatch storage event for cross-tab sync
  window.dispatchEvent(new StorageEvent('storage', {
    key: GENERATING_STORAGE_KEY,
    newValue: JSON.stringify(current)
  }))
}

export function clearGenerating(convId: string): void {
  if (typeof window === "undefined") return

  const current = loadGeneratingConversations()
  delete current[convId]
  localStorage.setItem(GENERATING_STORAGE_KEY, JSON.stringify(current))

  // Dispatch storage event for cross-tab sync
  window.dispatchEvent(new StorageEvent('storage', {
    key: GENERATING_STORAGE_KEY,
    newValue: JSON.stringify(current)
  }))
}

export function isGenerating(convId: string): boolean {
  const current = loadGeneratingConversations()
  return convId in current
}

// ============================================================================
// EXPORT & COMPACT UTILITIES
// ============================================================================

export function exportConversationToMarkdown(conv: Conversation): string {
  const lines: string[] = [
    `# ${conv.title}`,
    '',
    `**Created:** ${conv.createdAt.toLocaleString()}`,
    `**Last updated:** ${conv.updatedAt.toLocaleString()}`,
    conv.model ? `**Model:** ${conv.model}` : '',
    conv.projectPath ? `**Project:** ${conv.projectPath}` : '',
    '',
    '---',
    '',
  ].filter(Boolean)

  for (const msg of conv.messages) {
    if (msg.role === 'user') {
      lines.push(`## User`)
      lines.push('')
      lines.push(msg.content)
    } else if (msg.role === 'assistant') {
      const modelName = msg.model ? MODEL_DISPLAY_NAMES[msg.model] || msg.model : 'Assistant'
      lines.push(`## ${modelName}`)
      lines.push('')
      lines.push(msg.content)
    }
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Generate a compact summary prompt for the AI
export function generateCompactPrompt(conv: Conversation): string {
  const modelNames = new Set<string>()
  for (const msg of conv.messages) {
    if (msg.role === 'assistant' && msg.model) {
      modelNames.add(MODEL_DISPLAY_NAMES[msg.model] || msg.model)
    }
  }

  const modelsUsed = modelNames.size > 0 ? Array.from(modelNames).join(', ') : 'AI'

  return `Please generate a compact summary of our conversation so far that can be used to continue in a new chat. Use this format:

## Conversation Summary
**Original conversation:** "${conv.title}"
**Models used:** ${modelsUsed}
**Messages:** ${conv.messages.length}

### What we're working on
- [Primary task/topic]

### Key decisions made
- [Important choices, noting which model suggested them if relevant]

### Current state
- [Where we left off]
- [Any files modified or created]

### Important context
- [Technical details that matter for continuing]

### Next steps
- [Immediate next action]

Be concise but capture what's needed to continue without re-explaining. Focus on actionable state, not conversation history.`
}
