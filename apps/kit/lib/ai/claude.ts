/**
 * Claude CLI Integration
 * Uses the @anthropic-ai/claude-code CLI with Max subscription
 */

import { spawn, ChildProcess } from 'child_process'
import { homedir } from 'os'
import { join } from 'path'
import { existsSync } from 'fs'
import type { ChatMessage, ChatSettings } from './types'

// Path to the Claude CLI binary - check local install first, fall back to PATH
const LOCAL_CLAUDE = join(homedir(), '.claude', 'local', 'claude')
const CLAUDE_BIN = existsSync(LOCAL_CLAUDE) ? LOCAL_CLAUDE : 'claude'

// Content block types from Claude CLI stream-json
interface TextBlock {
  type: 'text'
  text: string
}

interface ToolUseBlock {
  type: 'tool_use'
  id: string
  name: string
  input: Record<string, unknown>
}

interface ToolResultBlock {
  type: 'tool_result'
  tool_use_id: string
  content: string
  is_error?: boolean
}

type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock

interface ClaudeUsage {
  input_tokens: number
  output_tokens: number
  cache_read_input_tokens?: number
  cache_creation_input_tokens?: number
}

interface ClaudeStreamEvent {
  type: 'system' | 'assistant' | 'result' | 'error' | 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_start' | 'message_stop'
  subtype?: string
  session_id?: string
  message?: {
    content: ContentBlock[]
  }
  index?: number
  content_block?: ContentBlock
  result?: string
  is_error?: boolean
  usage?: ClaudeUsage
  delta?: {
    type: 'text_delta' | 'input_json_delta'
    text?: string
    partial_json?: string
  }
  error?: {
    type: string
    message: string
  }
}

// Stream chunk types for the client
export interface StreamChunk {
  type: 'text' | 'tool_start' | 'tool_input' | 'tool_end' | 'heartbeat' | 'error' | 'done'
  content?: string
  tool?: {
    id: string
    name: string
    input?: string
  }
  error?: string
  sessionId?: string
  usage?: {
    inputTokens: number
    outputTokens: number
    cacheReadTokens?: number
    cacheCreationTokens?: number
    totalTokens: number
  }
}

export interface ClaudeStreamResult {
  stream: ReadableStream<string>
  getSessionId: () => string | null
}

// Heartbeat interval in ms (send every 15 seconds to keep connection alive)
const HEARTBEAT_INTERVAL = 15000

/**
 * Stream chat completions from Claude CLI
 * Returns stream and a function to get the captured session_id
 *
 * Features:
 * - Heartbeat to keep connection alive during long operations
 * - Tool use events surfaced to client
 * - Proper cleanup on cancel/error
 * - Protection against double-close
 */
export async function streamClaude(
  messages: ChatMessage[],
  settings?: ChatSettings,
  cwd?: string,
  sessionId?: string
): Promise<ClaudeStreamResult> {
  // Build the conversation context
  const systemPrompt = settings?.systemPrompt || ''

  // Get the last user message as the prompt
  const lastUserMessage = messages.findLast(m => m.role === 'user')
  if (!lastUserMessage) {
    throw new Error('No user message found')
  }

  const args = [
    '--print',
    '--output-format', 'stream-json',
    '--verbose'
  ]

  // Resume existing session if we have a session ID
  if (sessionId) {
    args.push('--resume', sessionId)
  }

  if (systemPrompt) {
    args.push('--append-system-prompt', systemPrompt)
  }

  // Add Claude-specific model
  if (settings?.claudeModel) {
    args.push('--model', settings.claudeModel)
  }

  // Add agent (from ~/.claude/agents/)
  if (settings?.claudeAgent) {
    args.push('--agent', settings.claudeAgent)
  }

  // Add additional directories
  if (settings?.additionalDirs && settings.additionalDirs.length > 0) {
    args.push('--add-dir', ...settings.additionalDirs)
  }

  // Add tool permissions
  if (settings?.allowedTools && settings.allowedTools.length > 0) {
    args.push('--allowed-tools', ...settings.allowedTools)
  }

  if (settings?.disallowedTools && settings.disallowedTools.length > 0) {
    args.push('--disallowed-tools', ...settings.disallowedTools)
  }

  // Add permission mode
  if (settings?.permissionMode) {
    args.push('--permission-mode', settings.permissionMode)
  }

  // Add the prompt as the last argument
  args.push(lastUserMessage.content)

  const claude = spawn(CLAUDE_BIN, args, {
    env: {
      ...process.env,
      // Remove ANTHROPIC_API_KEY to force subscription auth
      ANTHROPIC_API_KEY: undefined
    },
    cwd: cwd || process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false
  })

  // Capture session_id from stream events
  let capturedSessionId: string | null = null

  // Track stream state to prevent double operations
  let isClosed = false
  let heartbeatInterval: NodeJS.Timeout | null = null
  let lastActivity = Date.now()

  // Track current tool use for streaming input
  const activeTools = new Map<number, { id: string; name: string; input: string }>()

  // Helper to safely close the stream
  const safeClose = (controller: ReadableStreamDefaultController<string>) => {
    if (isClosed) return
    isClosed = true

    // Clear heartbeat
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }

    // Kill process if still running
    if (!claude.killed) {
      claude.kill()
    }

    try {
      controller.close()
    } catch {
      // Already closed
    }
  }

  // Helper to safely error the stream
  const safeError = (controller: ReadableStreamDefaultController<string>, error: Error) => {
    if (isClosed) return
    isClosed = true

    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }

    if (!claude.killed) {
      claude.kill()
    }

    try {
      controller.error(error)
    } catch {
      // Already closed/errored
    }
  }

  // Helper to enqueue with JSON encoding for structured data
  const enqueueChunk = (controller: ReadableStreamDefaultController<string>, chunk: StreamChunk) => {
    if (isClosed) return
    lastActivity = Date.now()

    // For text content, just send the raw text for backwards compatibility
    if (chunk.type === 'text' && chunk.content) {
      controller.enqueue(chunk.content)
    } else {
      // For structured events (tool use, heartbeat), send as JSON with marker
      controller.enqueue(`\n__CLAUDE_EVENT__${JSON.stringify(chunk)}__END_EVENT__\n`)
    }
  }

  const stream = new ReadableStream<string>({
    start(controller) {
      let buffer = ''

      // Start heartbeat to keep connection alive
      heartbeatInterval = setInterval(() => {
        if (isClosed) return

        const timeSinceActivity = Date.now() - lastActivity
        if (timeSinceActivity >= HEARTBEAT_INTERVAL) {
          enqueueChunk(controller, { type: 'heartbeat' })
        }
      }, HEARTBEAT_INTERVAL)

      // Process stream-json format from Claude CLI
      claude.stdout.on('data', (chunk: Buffer) => {
        if (isClosed) return

        buffer += chunk.toString()
        lastActivity = Date.now()

        // Process complete JSON lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim()) continue

          try {
            const event: ClaudeStreamEvent = JSON.parse(line)

            // Capture session_id from init event
            if (event.type === 'system' && event.subtype === 'init' && event.session_id) {
              capturedSessionId = event.session_id
            }

            // Handle different event types
            switch (event.type) {
              case 'assistant':
                // Full assistant message with content blocks
                if (event.message?.content) {
                  for (const block of event.message.content) {
                    if (block.type === 'text' && block.text) {
                      enqueueChunk(controller, { type: 'text', content: block.text })
                    } else if (block.type === 'tool_use') {
                      // Tool use in assistant message
                      enqueueChunk(controller, {
                        type: 'tool_start',
                        tool: {
                          id: block.id,
                          name: block.name,
                          input: JSON.stringify(block.input, null, 2)
                        }
                      })
                      enqueueChunk(controller, {
                        type: 'tool_end',
                        tool: { id: block.id, name: block.name }
                      })
                    }
                  }
                }
                break

              case 'content_block_start':
                // Start of a content block (text or tool_use)
                if (event.content_block?.type === 'tool_use' && event.index !== undefined) {
                  const tool = event.content_block as ToolUseBlock
                  activeTools.set(event.index, { id: tool.id, name: tool.name, input: '' })
                  enqueueChunk(controller, {
                    type: 'tool_start',
                    tool: { id: tool.id, name: tool.name }
                  })
                }
                break

              case 'content_block_delta':
                if (event.delta?.type === 'text_delta' && event.delta.text) {
                  // Text streaming
                  enqueueChunk(controller, { type: 'text', content: event.delta.text })
                } else if (event.delta?.type === 'input_json_delta' && event.delta.partial_json && event.index !== undefined) {
                  // Tool input streaming
                  const activeTool = activeTools.get(event.index)
                  if (activeTool) {
                    activeTool.input += event.delta.partial_json
                    enqueueChunk(controller, {
                      type: 'tool_input',
                      tool: {
                        id: activeTool.id,
                        name: activeTool.name,
                        input: event.delta.partial_json
                      }
                    })
                  }
                }
                break

              case 'content_block_stop':
                // End of a content block
                if (event.index !== undefined) {
                  const activeTool = activeTools.get(event.index)
                  if (activeTool) {
                    enqueueChunk(controller, {
                      type: 'tool_end',
                      tool: {
                        id: activeTool.id,
                        name: activeTool.name,
                        input: activeTool.input
                      }
                    })
                    activeTools.delete(event.index)
                  }
                }
                break

              case 'result':
                // Capture session_id from result event
                if (event.session_id) {
                  capturedSessionId = event.session_id
                }
                // End of stream
                if (event.is_error) {
                  safeError(controller, new Error(event.result || 'Claude CLI error'))
                } else {
                  // Send done event with usage data if available
                  if (event.usage) {
                    const totalTokens = event.usage.input_tokens +
                      event.usage.output_tokens +
                      (event.usage.cache_read_input_tokens || 0) +
                      (event.usage.cache_creation_input_tokens || 0)
                    enqueueChunk(controller, {
                      type: 'done',
                      sessionId: capturedSessionId || undefined,
                      usage: {
                        inputTokens: event.usage.input_tokens,
                        outputTokens: event.usage.output_tokens,
                        cacheReadTokens: event.usage.cache_read_input_tokens,
                        cacheCreationTokens: event.usage.cache_creation_input_tokens,
                        totalTokens
                      }
                    })
                  }
                  safeClose(controller)
                }
                break

              case 'message_stop':
                safeClose(controller)
                break

              case 'error':
                safeError(controller, new Error(event.error?.message || 'Claude CLI error'))
                break
            }
          } catch (error) {
            console.error('Failed to parse Claude stream-json:', line, error)
          }
        }
      })

      claude.stderr.on('data', (chunk: Buffer) => {
        const stderr = chunk.toString()
        console.error('Claude CLI stderr:', stderr)

        // Check for fatal errors in stderr
        if (stderr.includes('Error:') || stderr.includes('FATAL')) {
          safeError(controller, new Error(`Claude CLI: ${stderr.trim()}`))
        }
      })

      claude.on('close', (code) => {
        if (isClosed) return

        if (code !== 0 && code !== null) {
          safeError(controller, new Error(`Claude CLI exited with code ${code}`))
        } else {
          safeClose(controller)
        }
      })

      claude.on('error', (error) => {
        safeError(controller, error)
      })
    },

    cancel() {
      isClosed = true

      if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
        heartbeatInterval = null
      }

      if (!claude.killed) {
        claude.kill()
      }
    }
  })

  return {
    stream,
    getSessionId: () => capturedSessionId
  }
}

/**
 * Check if Claude CLI is authenticated
 */
export async function isClaudeAuthenticated(): Promise<boolean> {
  return new Promise((resolve) => {
    const claude = spawn(CLAUDE_BIN, ['--version'])

    claude.on('close', (code) => {
      resolve(code === 0)
    })

    claude.on('error', () => {
      resolve(false)
    })
  })
}
