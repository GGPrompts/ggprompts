# Multi-Model Chat System

The AI Workspace supports conversations across multiple AI models (Claude, Gemini, Codex) with shared context and model-aware identity.

## Features

- **Multi-model conversations**: Switch between Claude, Gemini, and Codex mid-conversation
- **Model badges**: Each message shows which AI generated it
- **Shared working directory**: All models run from the same project context
- **JSONL storage**: Portable, git-syncable conversation history
- **Model identity awareness**: Each model knows which messages are theirs vs others'

## How It Works

### Model Identity

When you switch models mid-conversation, each AI receives a system prompt that clarifies:

```
You are Gemini, an AI assistant participating in a multi-model conversation.

IMPORTANT - Understanding this conversation:
- Messages marked [Gemini] are YOUR previous responses
- Messages marked with [Claude], [Codex] are from OTHER AI assistants
- You can reference, agree with, or respectfully disagree with other assistants
```

This prevents confusion about who said what and enables genuine multi-perspective discussions.

### Conversation Storage

Conversations are stored in `.conversations/` as JSONL (JSON Lines) files:

```jsonl
{"id":"msg_001","ts":1701700000,"role":"user","content":"Explain this error"}
{"id":"msg_002","ts":1701700010,"role":"assistant","model":"claude","content":"The issue is..."}
{"id":"msg_003","ts":1701700100,"role":"user","content":"What do you think, Gemini?"}
{"id":"msg_004","ts":1701700110,"role":"assistant","model":"gemini","content":"I agree, but..."}
```

Benefits of JSONL:
- Append-only (atomic writes, no corruption)
- Easy to tail/grep
- Git-friendly diffs
- Portable between machines

## UI Components

### Inline Model Selector

Quick model switching next to the send button:

```
[Ask me anything...              ] [🧡 Claude ▼] [Send]
```

### Model Badges

Each assistant message displays a colored badge:

| Model | Icon | Color |
|-------|------|-------|
| Claude | 🧡 | Orange |
| Gemini | 💎 | Blue |
| Codex | 🤖 | Green |
| Docker | 🐳 | Purple |
| Mock | 🎭 | Gray |

### Project Context

All models run from the selected project directory, giving them access to:
- File contents
- Git history
- Package dependencies
- Project structure

## API Endpoints

### POST /api/ai/chat

Send a message with optional conversation tracking:

```typescript
{
  messages: [{ role: 'user', content: 'Your message' }],
  backend: 'claude' | 'gemini' | 'codex' | 'docker' | 'mock',
  conversationId?: string,  // For JSONL persistence
  cwd?: string              // Working directory
}
```

### GET /api/ai/models

List available models and backend status:

```json
{
  "models": [
    { "id": "claude", "name": "Claude", "backend": "claude" },
    { "id": "gemini", "name": "Gemini", "backend": "gemini" },
    { "id": "codex", "name": "Codex", "backend": "codex" }
  ],
  "backends": [
    { "backend": "claude", "available": true },
    { "backend": "gemini", "available": true },
    { "backend": "codex", "available": true }
  ]
}
```

### GET /api/ai/conversations

List or export conversations:

```
GET /api/ai/conversations              # List all
GET /api/ai/conversations?id=conv_123  # Get specific
GET /api/ai/conversations?id=conv_123&export=true  # Export as markdown
```

## File Structure

```
lib/ai/
├── conversation.ts   # JSONL storage + model-aware context building
├── claude.ts         # Claude CLI integration
├── gemini.ts         # Gemini CLI integration
├── codex.ts          # Codex CLI integration
├── docker.ts         # Docker Model Runner integration
├── mock.ts           # Mock backend for testing
├── detect.ts         # Backend availability detection
├── types.ts          # Shared types
└── index.ts          # Exports

app/api/ai/
├── chat/route.ts          # Streaming chat endpoint
├── models/route.ts        # Model discovery
└── conversations/route.ts # Conversation management
```

## Usage Examples

### Basic Multi-Model Chat

1. Open AI Workspace
2. Select a project from the dropdown (optional)
3. Ask Claude a question
4. Use the model selector to switch to Gemini
5. Ask "What do you think of Claude's answer?"
6. Each response shows which model generated it

### Comparing Approaches

```
User: How should I structure authentication in this Next.js app?

Claude: I'd recommend using NextAuth.js with...
[🧡 Claude]

User: @gemini what's your take?

Gemini: Claude's suggestion is solid. I'd add that you could also consider...
[💎 Gemini]

User: @codex which approach would be more performant?

Codex: From a performance perspective...
[🤖 Codex]
```

## Backend Requirements

Each backend requires its CLI to be installed:

- **Claude**: `npm install -g @anthropic-ai/claude-code` (requires Max subscription)
- **Gemini**: Google's gemini CLI
- **Codex**: OpenAI's codex CLI

Check availability via the models API or backend status in the Settings panel.
