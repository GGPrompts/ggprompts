/**
 * AI Models API
 * Lists available models from all backends (Claude, Gemini, Codex, Docker, Mock)
 */

import { NextResponse } from 'next/server'
import { getAvailableBackends } from '@/lib/ai/detect'
import { listDockerModels } from '@/lib/ai/docker'
import { getMockModel } from '@/lib/ai/mock'
import type { Model } from '@/lib/ai/types'

export async function GET() {
  try {
    const models: Model[] = []

    // Check which backends are available
    const backends = await getAvailableBackends()

    // Add Claude if available
    const claudeBackend = backends.find(b => b.backend === 'claude')
    if (claudeBackend?.available) {
      models.push({
        id: 'claude',
        name: 'Claude',
        backend: 'claude',
        description: 'Claude Code CLI (Max subscription)'
      })
    }

    // Add Gemini if available
    const geminiBackend = backends.find(b => b.backend === 'gemini')
    if (geminiBackend?.available) {
      models.push({
        id: 'gemini',
        name: 'Gemini',
        backend: 'gemini',
        description: 'Google Gemini CLI'
      })
    }

    // Add Codex if available
    const codexBackend = backends.find(b => b.backend === 'codex')
    if (codexBackend?.available) {
      models.push({
        id: 'codex',
        name: 'Codex',
        backend: 'codex',
        description: 'OpenAI Codex CLI (GPT-5)'
      })
    }

    // Add Docker models if available
    const dockerBackend = backends.find(b => b.backend === 'docker')
    if (dockerBackend?.available) {
      const dockerModels = await listDockerModels()
      models.push(...dockerModels)
    }

    // Always add mock as fallback
    models.push(getMockModel())

    return NextResponse.json({
      models,
      backends: backends.map(b => ({
        backend: b.backend,
        available: b.available,
        error: b.error
      }))
    })
  } catch (error) {
    console.error('Failed to list AI models:', error)

    return NextResponse.json(
      {
        error: 'Failed to list models',
        models: [getMockModel()], // Always return mock as fallback
        backends: []
      },
      { status: 500 }
    )
  }
}
