/**
 * AI Chat API
 * Handles chat requests with streaming responses
 * Supports multi-model conversations via JSONL storage
 */

import { NextRequest } from 'next/server'
import { streamClaude } from '@/lib/ai/claude'
import { streamDockerModel } from '@/lib/ai/docker'
import { streamMock } from '@/lib/ai/mock'
import { streamGemini } from '@/lib/ai/gemini'
import { streamCodex } from '@/lib/ai/codex'
import {
  readConversation,
  appendMessage,
  buildModelContext,
  createConversation,
  type ModelId
} from '@/lib/ai/conversation'
import type { ChatRequest, AIBackend } from '@/lib/ai/types'

// Map API backend names to conversation ModelId
function toModelId(backend: AIBackend): ModelId {
  if (backend === 'mock') return 'claude' // Mock pretends to be Claude
  return backend as ModelId
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()

    const { messages, backend, model, settings, cwd, conversationId, claudeSessionId } = body

    // Validate we have either messages or a conversationId
    if ((!messages || messages.length === 0) && !conversationId) {
      return new Response(
        JSON.stringify({ error: 'No messages or conversationId provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    let stream: ReadableStream<string>
    let messageId: string | undefined
    let convId = conversationId
    let getSessionId: (() => string | null) | undefined

    try {
      // JSONL conversation mode - multi-model aware
      if (conversationId || body.conversationId) {
        convId = conversationId || createConversation()

        // Get the last user message from the request
        const lastUserMessage = messages?.findLast(m => m.role === 'user')
        if (!lastUserMessage) {
          return new Response(
            JSON.stringify({ error: 'No user message found' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }

        // Append user message to conversation
        const userMsg = appendMessage(convId, {
          role: 'user',
          content: lastUserMessage.content
        })

        // Read full conversation and build model-aware context
        const history = readConversation(convId)
        const modelId = toModelId(backend)
        const context = buildModelContext(
          history,
          modelId,
          settings?.systemPrompt,
          50 // max messages for context
        )

        // Get stream from appropriate backend with model-aware context
        if (backend === 'claude') {
          // Claude uses its own conversation format for now
          // Pass session ID for multi-turn context
          const result = await streamClaude(messages, settings, cwd, claudeSessionId)
          stream = result.stream
          getSessionId = result.getSessionId
        } else if (backend === 'gemini') {
          stream = await streamGemini(context, settings, cwd)
        } else if (backend === 'codex') {
          stream = await streamCodex(context, settings, cwd)
        } else if (backend === 'docker') {
          if (!model) {
            return new Response(
              JSON.stringify({ error: 'Model required for Docker backend' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }
          stream = await streamDockerModel(model, messages, settings)
        } else {
          stream = await streamMock(messages)
        }

        // We'll append the assistant response after streaming completes
        messageId = `msg_${Date.now()}_pending`

      } else {
        // Legacy mode - no JSONL, just pass messages directly
        if (backend === 'claude') {
          const result = await streamClaude(messages, settings, cwd, claudeSessionId)
          stream = result.stream
          getSessionId = result.getSessionId
        } else if (backend === 'gemini') {
          const context = {
            systemPrompt: settings?.systemPrompt || '',
            messages: messages.map(m => ({ role: m.role, content: m.content }))
          }
          stream = await streamGemini(context, settings, cwd)
        } else if (backend === 'codex') {
          const context = {
            systemPrompt: settings?.systemPrompt || '',
            messages: messages.map(m => ({ role: m.role, content: m.content }))
          }
          stream = await streamCodex(context, settings, cwd)
        } else if (backend === 'docker') {
          if (!model) {
            return new Response(
              JSON.stringify({ error: 'Model required for Docker backend' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }
          stream = await streamDockerModel(model, messages, settings)
        } else {
          stream = await streamMock(messages)
        }
      }
    } catch (error) {
      console.error('Backend error, falling back to mock:', error)
      stream = await streamMock(messages)
    }

    // Convert to SSE (Server-Sent Events) format
    // Also collect full response for JSONL storage
    const encoder = new TextEncoder()
    let fullResponse = ''
    let capturedUsage: { inputTokens: number; outputTokens: number; cacheReadTokens?: number; cacheCreationTokens?: number; totalTokens: number } | undefined

    // Helper to parse Claude events from stream chunks
    const parseClaudeEvents = (chunk: string): { text: string; events: Array<{ type: string; usage?: typeof capturedUsage; sessionId?: string }> } => {
      const events: Array<{ type: string; usage?: typeof capturedUsage; sessionId?: string }> = []
      let text = chunk

      // Extract __CLAUDE_EVENT__....__END_EVENT__ markers
      const eventRegex = /__CLAUDE_EVENT__(.*?)__END_EVENT__/g
      let match
      while ((match = eventRegex.exec(chunk)) !== null) {
        try {
          const event = JSON.parse(match[1])
          events.push(event)
          text = text.replace(match[0], '')
        } catch {
          // Invalid JSON, skip
        }
      }

      return { text: text.replace(/\n+/g, ''), events }
    }

    const sseStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader()

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              // If using JSONL mode, save the assistant response
              if (convId) {
                appendMessage(convId, {
                  role: 'assistant',
                  content: fullResponse,
                  model: toModelId(backend),
                  metadata: {
                    cwd
                  }
                })
              }

              // Send done event with conversation metadata and usage
              const doneData = JSON.stringify({
                done: true,
                conversationId: convId,
                model: backend,
                claudeSessionId: getSessionId?.() || undefined,
                usage: capturedUsage
              })
              controller.enqueue(encoder.encode(`data: ${doneData}\n\n`))
              controller.close()
              break
            }

            // Parse out Claude events (usage, tool use, etc.) from the stream
            const { text, events } = parseClaudeEvents(value)

            // Capture usage from done events
            for (const event of events) {
              if (event.type === 'done' && event.usage) {
                capturedUsage = event.usage
              }
            }

            // Accumulate clean text for JSONL storage
            if (text) {
              fullResponse += text

              // Send content chunk
              const data = JSON.stringify({
                content: text,
                done: false,
                model: backend,
                conversationId: convId
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
        } catch (error) {
          // Send error event
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          const data = JSON.stringify({ error: errorMessage, done: true })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(sseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('Chat API error:', error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
