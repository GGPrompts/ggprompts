/**
 * Docker Model Runner Integration
 * Uses the OpenAI-compatible API at http://localhost:12434/engines/v1
 *
 * For WSL2: Set DOCKER_MODEL_API env var to Windows Tailscale IP
 * e.g., DOCKER_MODEL_API=http://100.95.196.24:12434
 */

import type { ChatMessage, ChatSettings, Model } from './types'

const DOCKER_API_BASE = process.env.DOCKER_MODEL_API
  ? `${process.env.DOCKER_MODEL_API}/engines/v1`
  : 'http://localhost:12434/engines/v1'

interface DockerModel {
  id: string
  object: string
  created: number
  owned_by: string
}

interface DockerChatCompletionChunk {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
    }
    finish_reason: string | null
  }>
}

/**
 * List available Docker models
 */
export async function listDockerModels(): Promise<Model[]> {
  try {
    const response = await fetch(`${DOCKER_API_BASE}/models`, {
      signal: AbortSignal.timeout(2000)
    })

    if (!response.ok) {
      throw new Error(`Docker API returned ${response.status}`)
    }

    const data = await response.json() as { data: DockerModel[] }

    return data.data.map(model => ({
      id: model.id,
      name: model.id,
      backend: 'docker' as const,
      description: `Local model via Docker`
    }))
  } catch (error) {
    console.error('Failed to list Docker models:', error)
    return []
  }
}

/**
 * Stream chat completions from Docker Model Runner
 */
export async function streamDockerModel(
  model: string,
  messages: ChatMessage[],
  settings?: ChatSettings
): Promise<ReadableStream<string>> {
  const response = await fetch(`${DOCKER_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      temperature: settings?.temperature ?? 0.7,
      max_tokens: settings?.maxTokens ?? 2048,
      stream: true
    })
  })

  if (!response.ok) {
    throw new Error(`Docker API returned ${response.status}: ${await response.text()}`)
  }

  if (!response.body) {
    throw new Error('No response body from Docker API')
  }

  // Transform the SSE stream from Docker API
  return new ReadableStream<string>({
    async start(controller) {
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            controller.close()
            break
          }

          buffer += decoder.decode(value, { stream: true })

          // Process complete SSE events
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim() || line.startsWith(':')) continue

            if (line.startsWith('data: ')) {
              const data = line.slice(6)

              if (data === '[DONE]') {
                controller.close()
                return
              }

              try {
                const chunk: DockerChatCompletionChunk = JSON.parse(data)

                const content = chunk.choices[0]?.delta?.content
                if (content) {
                  controller.enqueue(content)
                }

                if (chunk.choices[0]?.finish_reason) {
                  controller.close()
                  return
                }
              } catch (error) {
                console.error('Failed to parse Docker stream chunk:', data, error)
              }
            }
          }
        }
      } catch (error) {
        controller.error(error)
      }
    }
  })
}

/**
 * Check if a specific model is available
 */
export async function isDockerModelAvailable(modelId: string): Promise<boolean> {
  const models = await listDockerModels()
  return models.some(m => m.id === modelId)
}
