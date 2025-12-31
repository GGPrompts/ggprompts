/**
 * Shared types for AI integrations
 */

export type MessageRole = 'user' | 'assistant' | 'system'

// All supported AI backends
export type AIBackend = 'claude' | 'gemini' | 'codex' | 'docker' | 'mock'

export interface ChatMessage {
  role: MessageRole
  content: string
}

export interface ChatSettings {
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  // Claude CLI specific options
  additionalDirs?: string[]  // --add-dir
  claudeModel?: string  // --model (sonnet, opus, haiku, or full model name)
  claudeAgent?: string  // --agent (agent name from ~/.claude/agents/)
  allowedTools?: string[]  // --allowed-tools
  disallowedTools?: string[]  // --disallowed-tools
  permissionMode?: 'acceptEdits' | 'bypassPermissions' | 'default' | 'plan'  // --permission-mode
  // Codex CLI specific options
  codexModel?: string  // Default: gpt-5
  reasoningEffort?: 'low' | 'medium' | 'high'
  sandbox?: 'read-only' | 'full' | 'off'
  // Gemini CLI specific options
  geminiModel?: string  // --model (e.g., flash-2.5)
}

export interface ChatRequest {
  messages: ChatMessage[]
  backend: AIBackend
  model?: string
  settings?: ChatSettings
  stream?: boolean
  cwd?: string  // Working directory for CLI tools (project path)
  // JSONL conversation mode
  conversationId?: string  // Use JSONL conversation instead of messages array
  // Claude session for multi-turn context
  claudeSessionId?: string  // Pass to resume a Claude CLI session
}

export interface Model {
  id: string
  name: string
  backend: AIBackend
  description?: string
}

export interface StreamChunk {
  content: string
  done: boolean
  error?: string
  // Added for multi-model conversations
  model?: AIBackend
  messageId?: string
}
