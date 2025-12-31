# Claude CLI Resume Sessions Feature

Add multi-turn conversation support to the AI chat using Claude CLI's `--resume` flag with session IDs.

## Overview

Currently, each message to the Claude backend is stateless - Claude doesn't remember previous messages in the conversation. By capturing and reusing session IDs, we can enable true multi-turn conversations where Claude maintains context.

## How It Works

### 1. Session ID in Response

When using `--output-format json` or `--output-format stream-json --verbose`, Claude CLI returns a `session_id` in the response:

```json
{
  "type": "result",
  "session_id": "f6590507-4923-47e9-86a6-9513ec72ab7c",
  "result": "...",
  ...
}
```

### 2. Resume with Session ID

Pass the session ID on subsequent requests:

```bash
claude --print --resume "f6590507-4923-47e9-86a6-9513ec72ab7c" "follow-up question"
```

Claude will have full context of the previous conversation.

## Implementation

### Backend Changes (`lib/ai/claude.ts`)

#### 1. Update the function signature to accept/return session ID:

```typescript
export async function streamClaude(
  messages: ChatMessage[],
  settings?: ChatSettings,
  cwd?: string,
  sessionId?: string  // Add this parameter
): Promise<{ stream: ReadableStream<string>; sessionId: string }> {
```

#### 2. Add `--resume` flag when session ID provided:

```typescript
const args = [
  '--print',
  '--output-format', 'stream-json',
  '--verbose'  // Required for stream-json now
]

// Resume existing session if we have a session ID
if (sessionId) {
  args.push('--resume', sessionId)
}
```

#### 3. Capture session ID from stream-json output:

The session ID appears in multiple event types. Capture it from the first `init` event:

```typescript
// In the stdout handler
for (const line of lines) {
  if (!line.trim()) continue

  try {
    const event = JSON.parse(line)

    // Capture session ID from init event
    if (event.type === 'system' && event.subtype === 'init' && event.session_id) {
      capturedSessionId = event.session_id
    }

    // Handle content as before...
    if (event.type === 'assistant' && event.message?.content) {
      for (const block of event.message.content) {
        if (block.type === 'text') {
          controller.enqueue(block.text)
        }
      }
    }

    // Also available in result event
    if (event.type === 'result') {
      capturedSessionId = event.session_id
    }
  } catch (error) {
    // Handle parse error
  }
}
```

### API Route Changes (`app/api/ai/chat/route.ts`)

#### 1. Accept session ID in request:

```typescript
const { messages, settings, projectPath, sessionId } = await req.json()
```

#### 2. Pass to Claude and return new/continued session ID:

```typescript
const { stream, sessionId: newSessionId } = await streamClaude(
  messages,
  settings,
  projectPath,
  sessionId
)

// Include session ID in response headers or SSE stream
```

### Frontend Changes (`app/sections/ai-workspace.tsx`)

#### 1. Store session ID per conversation:

```typescript
interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  sessionId?: string  // Add this
  // ...
}
```

#### 2. Send session ID with requests:

```typescript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages,
    settings,
    projectPath,
    sessionId: currentConversation.sessionId  // Include if exists
  })
})
```

#### 3. Capture and store session ID from response:

```typescript
// Parse session ID from SSE stream or response header
// Update conversation with session ID
setConversations(prev => prev.map(c =>
  c.id === currentConversation.id
    ? { ...c, sessionId: newSessionId }
    : c
))
```

## Token/Context Management

### Monitor Usage

The response includes token counts:

```json
{
  "usage": {
    "input_tokens": 2,
    "cache_read_input_tokens": 26554,
    "output_tokens": 100
  }
}
```

Track `input_tokens + cache_read_input_tokens` to monitor context size.

### Handle Context Limits

When approaching limits (~150k tokens), you have options:

1. **Start fresh session** - Drop the session ID, start new conversation
2. **Handoff** - Generate a summary of current state, start new session with summary
3. **Warn user** - Show "Context getting full" message, let user decide

Example handoff approach:

```typescript
if (totalTokens > 150000) {
  // Show warning to user
  // Option to "Continue in new session" which:
  // 1. Asks Claude to summarize current conversation
  // 2. Starts fresh session with summary as first message
  // 3. Clears sessionId from conversation state
}
```

## Testing

### Manual test in terminal:

```bash
# First message - capture session ID
SESSION=$(claude --print --output-format json "my name is Matt" 2>/dev/null | jq -r '.session_id')
echo "Session: $SESSION"

# Resume - should remember name
claude --print --resume "$SESSION" "what is my name?"
```

### Expected behavior:

- First request: Claude responds, returns new session ID
- Subsequent requests with same session ID: Claude has full context
- Requests without session ID: Stateless, no memory of previous messages

## Notes

- `stream-json` format now requires `--verbose` flag
- Session IDs are UUIDs, persist across Claude Code restarts
- Sessions are scoped to working directory
- Max subscription auth works with `--resume` (no API key needed)
