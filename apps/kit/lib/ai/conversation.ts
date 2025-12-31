/**
 * JSONL-based Multi-Model Conversation System
 *
 * Stores conversations in append-only JSONL format, enabling:
 * - Multi-model conversations (Claude, Gemini, Codex in same thread)
 * - Portable, git-syncable history
 * - Model-aware context building (each model knows who they are)
 */

import * as fs from 'fs'
import * as path from 'path'

// ============================================================================
// Types
// ============================================================================

export type ModelId = 'claude' | 'gemini' | 'codex' | 'docker'

export interface ConversationMessage {
  id: string
  ts: number                    // Unix timestamp
  role: 'user' | 'assistant' | 'system'
  content: string
  model?: ModelId              // Which model generated this (for assistant messages)
  modelVersion?: string        // e.g., "claude-sonnet-4", "gemini-1.5-pro"
  metadata?: {
    tokenCount?: number
    durationMs?: number
    toolsUsed?: string[]
    cwd?: string               // Working directory context
  }
}

export interface Conversation {
  id: string
  name?: string
  createdAt: number
  updatedAt: number
  messages: ConversationMessage[]
}

// What each backend receives
export interface ModelContext {
  systemPrompt: string
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
}

// Model display names for context
const MODEL_NAMES: Record<ModelId, string> = {
  claude: 'Claude',
  gemini: 'Gemini',
  codex: 'Codex',
  docker: 'Local Model'
}

// ============================================================================
// JSONL File Operations
// ============================================================================

const CONVERSATIONS_DIR = process.env.CONVERSATIONS_DIR || '.conversations'

function getConversationPath(conversationId: string): string {
  return path.join(process.cwd(), CONVERSATIONS_DIR, `${conversationId}.jsonl`)
}

function ensureDir(): void {
  const dir = path.join(process.cwd(), CONVERSATIONS_DIR)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * Append a message to a conversation (atomic, append-only)
 */
export function appendMessage(
  conversationId: string,
  message: Omit<ConversationMessage, 'id' | 'ts'>
): ConversationMessage {
  ensureDir()

  const fullMessage: ConversationMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    ...message
  }

  const filePath = getConversationPath(conversationId)
  fs.appendFileSync(filePath, JSON.stringify(fullMessage) + '\n')

  return fullMessage
}

/**
 * Read all messages from a conversation
 */
export function readConversation(conversationId: string): ConversationMessage[] {
  const filePath = getConversationPath(conversationId)

  if (!fs.existsSync(filePath)) {
    return []
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())

  return lines.map(line => JSON.parse(line) as ConversationMessage)
}

/**
 * Read last N messages (efficient for large files)
 */
export function readLastMessages(conversationId: string, count: number): ConversationMessage[] {
  const all = readConversation(conversationId)
  return all.slice(-count)
}

/**
 * List all conversations
 */
export function listConversations(): Array<{ id: string; messageCount: number; updatedAt: number }> {
  ensureDir()
  const dir = path.join(process.cwd(), CONVERSATIONS_DIR)
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'))

  return files.map(file => {
    const id = file.replace('.jsonl', '')
    const messages = readConversation(id)
    const lastMessage = messages[messages.length - 1]

    return {
      id,
      messageCount: messages.length,
      updatedAt: lastMessage?.ts || 0
    }
  }).sort((a, b) => b.updatedAt - a.updatedAt)
}

/**
 * Create a new conversation
 */
export function createConversation(name?: string): string {
  ensureDir()
  const id = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  // Write initial metadata as first line
  const metadata: ConversationMessage = {
    id: `msg_init`,
    ts: Date.now(),
    role: 'system',
    content: `Conversation started${name ? `: ${name}` : ''}`,
    metadata: {}
  }

  const filePath = getConversationPath(id)
  fs.writeFileSync(filePath, JSON.stringify(metadata) + '\n')

  return id
}

// ============================================================================
// Context Building - The Key Part!
// ============================================================================

/**
 * Build context for a specific model from conversation history
 *
 * This is where we make each model understand:
 * 1. Who they are ("You are Claude")
 * 2. Which messages are theirs (role: assistant)
 * 3. Which messages are from other models (clearly labeled)
 */
export function buildModelContext(
  messages: ConversationMessage[],
  targetModel: ModelId,
  baseSystemPrompt?: string,
  maxMessages: number = 50
): ModelContext {

  // Trim to recent messages if needed
  const recentMessages = messages.slice(-maxMessages)

  // Build the identity-aware system prompt
  const modelName = MODEL_NAMES[targetModel]
  const otherModels = Object.entries(MODEL_NAMES)
    .filter(([id]) => id !== targetModel)
    .map(([, name]) => name)

  const identityPrompt = `You are ${modelName}, an AI assistant participating in a multi-model conversation.

IMPORTANT - Understanding this conversation:
- Messages marked [${modelName}] are YOUR previous responses - you said these
- Messages marked with other names like [${otherModels.join('], [')}] are from OTHER AI assistants
- You can reference, agree with, or respectfully disagree with other assistants' responses
- Be yourself - don't try to mimic other models' styles
- If asked "what did you say earlier?", only reference [${modelName}] messages`

  const systemPrompt = baseSystemPrompt
    ? `${identityPrompt}\n\n${baseSystemPrompt}`
    : identityPrompt

  // Transform messages for this model's perspective
  const contextMessages = recentMessages
    .filter(m => m.role !== 'system') // Skip system messages
    .map(msg => {
      if (msg.role === 'user') {
        // User messages pass through unchanged
        return { role: 'user' as const, content: msg.content }
      }

      if (msg.role === 'assistant') {
        if (msg.model === targetModel) {
          // This model's own messages - standard assistant role
          return { role: 'assistant' as const, content: msg.content }
        } else {
          // Another model's message - embed as a labeled block
          // We include it as a "user" message showing what the other model said
          // This way the model sees it as context, not as something it said
          const otherModelName = msg.model ? MODEL_NAMES[msg.model] : 'Assistant'
          return {
            role: 'user' as const,
            content: `[${otherModelName} responded]:\n${msg.content}`
          }
        }
      }

      // Fallback
      return { role: 'user' as const, content: msg.content }
    })

  // Merge consecutive user messages (from other model responses + actual user messages)
  const mergedMessages = mergeConsecutiveUserMessages(contextMessages)

  return {
    systemPrompt,
    messages: mergedMessages
  }
}

/**
 * Merge consecutive user messages to avoid API issues
 * (Some APIs don't allow consecutive same-role messages)
 */
function mergeConsecutiveUserMessages(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
  const merged: typeof messages = []

  for (const msg of messages) {
    const last = merged[merged.length - 1]

    if (last && last.role === msg.role && msg.role === 'user') {
      // Merge consecutive user messages
      last.content = `${last.content}\n\n${msg.content}`
    } else {
      merged.push({ ...msg })
    }
  }

  return merged
}

// ============================================================================
// Alternative Context Strategy: Full Transcript Mode
// ============================================================================

/**
 * Alternative: Build context as a full transcript
 * Better for models that benefit from seeing the full conversation flow
 */
export function buildTranscriptContext(
  messages: ConversationMessage[],
  targetModel: ModelId,
  baseSystemPrompt?: string,
  maxMessages: number = 50
): ModelContext {

  const recentMessages = messages.slice(-maxMessages)
  const modelName = MODEL_NAMES[targetModel]

  const identityPrompt = `You are ${modelName}. You're participating in a multi-model conversation.
Your previous responses are marked [${modelName}]. Other AI responses have their model names.
Continue the conversation naturally, being aware of what you and others have said.`

  const systemPrompt = baseSystemPrompt
    ? `${identityPrompt}\n\n${baseSystemPrompt}`
    : identityPrompt

  // Build transcript as a single user message with the conversation
  const transcript = recentMessages
    .filter(m => m.role !== 'system')
    .map(msg => {
      if (msg.role === 'user') {
        return `[User]: ${msg.content}`
      } else {
        const name = msg.model ? MODEL_NAMES[msg.model] : 'Assistant'
        return `[${name}]: ${msg.content}`
      }
    })
    .join('\n\n---\n\n')

  return {
    systemPrompt,
    messages: [
      { role: 'user', content: `Here's our conversation so far:\n\n${transcript}\n\n---\n\nPlease continue as ${modelName}.` }
    ]
  }
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Prune old messages from a conversation (keep last N)
 */
export function pruneConversation(conversationId: string, keepLast: number = 100): void {
  const messages = readConversation(conversationId)

  if (messages.length <= keepLast) {
    return
  }

  const toKeep = messages.slice(-keepLast)
  const filePath = getConversationPath(conversationId)

  // Rewrite file with only recent messages
  fs.writeFileSync(filePath, toKeep.map(m => JSON.stringify(m)).join('\n') + '\n')
}

/**
 * Export conversation to a shareable format
 */
export function exportConversation(conversationId: string): string {
  const messages = readConversation(conversationId)

  return messages
    .filter(m => m.role !== 'system')
    .map(msg => {
      if (msg.role === 'user') {
        return `**User**: ${msg.content}`
      } else {
        const name = msg.model ? MODEL_NAMES[msg.model] : 'Assistant'
        return `**${name}**: ${msg.content}`
      }
    })
    .join('\n\n---\n\n')
}
