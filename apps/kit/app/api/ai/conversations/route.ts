/**
 * Conversations API
 * List and manage JSONL-based conversations
 */

import { NextRequest } from 'next/server'
import {
  listConversations,
  readConversation,
  createConversation,
  exportConversation,
  pruneConversation
} from '@/lib/ai/conversation'

// GET /api/ai/conversations - List all conversations
// GET /api/ai/conversations?id=xxx - Get specific conversation
// GET /api/ai/conversations?id=xxx&export=true - Export as markdown
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const exportFormat = searchParams.get('export')

    if (id) {
      if (exportFormat === 'true' || exportFormat === 'markdown') {
        const markdown = exportConversation(id)
        return new Response(markdown, {
          headers: { 'Content-Type': 'text/markdown' }
        })
      }

      const messages = readConversation(id)
      return Response.json({ id, messages })
    }

    const conversations = listConversations()
    return Response.json({ conversations })
  } catch (error) {
    console.error('Conversations API error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/ai/conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { name } = body

    const id = createConversation(name)
    return Response.json({ id, name })
  } catch (error) {
    console.error('Conversations API error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE /api/ai/conversations?id=xxx&prune=100 - Prune to last N messages
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const pruneCount = searchParams.get('prune')

    if (!id) {
      return Response.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      )
    }

    if (pruneCount) {
      pruneConversation(id, parseInt(pruneCount, 10))
      return Response.json({ success: true, action: 'pruned', keepLast: pruneCount })
    }

    // TODO: Full delete - for now just prune to 0
    pruneConversation(id, 0)
    return Response.json({ success: true, action: 'deleted' })
  } catch (error) {
    console.error('Conversations API error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
