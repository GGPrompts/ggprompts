/**
 * AI Module Exports
 *
 * Multi-model AI chat system with JSONL-based conversation storage
 */

// Types
export * from './types'

// Conversation system (JSONL-based, multi-model aware)
export {
  // Types
  type ModelId,
  type ConversationMessage,
  type Conversation,
  type ModelContext,
  // JSONL operations
  appendMessage,
  readConversation,
  readLastMessages,
  listConversations,
  createConversation,
  pruneConversation,
  exportConversation,
  // Context building
  buildModelContext,
  buildTranscriptContext,
  // Utilities
  generateMessageId
} from './conversation'

// Backend integrations
export { streamClaude, isClaudeAuthenticated } from './claude'
export { streamGemini, streamGeminiSimple, isGeminiAvailable } from './gemini'
export { streamCodex, streamCodexSimple, isCodexAvailable } from './codex'
export { streamDockerModel } from './docker'
export { streamMock } from './mock'

// Backend detection
export { detectBackend, getAvailableBackends } from './detect'
