# AI Workspace Patterns & Reference

Research on Claude Code non-interactive mode integration patterns, based on analysis of [Vibe Kanban](https://github.com/BloopAI/vibe-kanban) and our own implementation.

## Claude Code Non-Interactive Mode

### CLI Flags Reference

```bash
claude --print \
  --output-format=stream-json \
  --input-format=stream-json \
  --permission-prompt-tool=stdio \
  --permission-mode={Plan|Default|BypassPermissions} \
  --include-partial-messages \
  --disallowedTools=AskUserQuestion \
  --verbose \
  --resume <session-id> \
  --model <model-name> \
  --append-system-prompt "..." \
  --add-dir /path/to/dir
```

| Flag | Purpose |
|------|---------|
| `--print` | Non-interactive mode |
| `--output-format=stream-json` | Stream newline-delimited JSON events |
| `--input-format=stream-json` | Accept JSON input format |
| `--permission-prompt-tool=stdio` | Route permission prompts to stdin/stdout for programmatic handling |
| `--permission-mode` | Control permission behavior (Plan, Default, BypassPermissions) |
| `--include-partial-messages` | Get real-time streaming updates |
| `--disallowedTools=AskUserQuestion` | Prevent Claude from asking questions requiring interactive input |
| `--resume <id>` | Resume existing session for multi-turn conversations |

### Stream JSON Event Types

Events from `--output-format=stream-json`:

```typescript
interface ClaudeStreamEvent {
  type: 'system' | 'assistant' | 'result' | 'error' |
        'content_block_start' | 'content_block_delta' |
        'content_block_stop' | 'message_start' | 'message_stop'
  subtype?: string           // e.g., 'init' for system events
  session_id?: string        // Capture for multi-turn
  usage?: ClaudeUsage        // Token counts (in result event)
  message?: { content: ContentBlock[] }
  delta?: { type: string; text?: string }
}

interface ClaudeUsage {
  input_tokens: number
  output_tokens: number
  cache_read_input_tokens?: number
  cache_creation_input_tokens?: number
}
```

### Key Events to Handle

| Event | When | What to Extract |
|-------|------|-----------------|
| `system` (subtype: `init`) | Start of stream | `session_id` |
| `content_block_delta` | During streaming | Text chunks (`delta.text`) |
| `content_block_start` | Tool use begins | Tool name, ID |
| `result` | End of stream | `usage` (token counts), `session_id` |

## Context Window Tracking

### Interactive vs Non-Interactive Mode

| Aspect | Interactive Statusline | Non-Interactive (--print) |
|--------|----------------------|---------------------------|
| **Data source** | `context_window.current_usage` via Status hook | `usage` in `result` event |
| **Includes context size** | Yes - `context_window_size` | No - must know model limit |
| **Update frequency** | Real-time (~300ms) | After each response |
| **Baseline overhead** | Known immediately | Only after first response |

### Calculating Context Percentage

```typescript
// After receiving usage from result event:
const CONTEXT_LIMIT = 200000  // Model's context window

const totalTokens = usage.input_tokens +
  usage.output_tokens +
  (usage.cache_read_input_tokens || 0) +
  (usage.cache_creation_input_tokens || 0)

const contextPercentage = Math.round((totalTokens / CONTEXT_LIMIT) * 100)
```

**Note:** Before the first Claude response, you must estimate. After the first response, `input_tokens` includes all overhead (system prompt, tools, MCP, CLAUDE.md, etc.).

## Architecture Patterns (from Vibe Kanban)

### Separation of Concerns

```
CommandBuilder       → Assembles CLI flags and arguments
LogProcessor         → Buffers/parses stream-json lines
NormalizedEntry      → Unified format across agent types
Executor             → Spawns process, handles lifecycle
```

### Our Current Implementation

```
lib/ai/claude.ts           → Spawns Claude, parses stream, extracts usage
app/api/ai/chat/route.ts   → SSE bridge, forwards usage to client
lib/ai-workspace.ts        → Types (Conversation, TokenUsage)
app/sections/ai-workspace.tsx → UI, context calculation, display
```

### Potential Refactoring

Extract from `ai-workspace.tsx` (currently ~25k tokens):

| Component | Purpose |
|-----------|---------|
| `hooks/useAIChat.ts` | Chat state, streaming, message handling |
| `hooks/useConversations.ts` | Conversation CRUD, persistence |
| `components/ai-workspace/ChatMessage.tsx` | Message rendering, tool uses |
| `components/ai-workspace/ConversationSidebar.tsx` | Sidebar list |
| `components/ai-workspace/ChatInput.tsx` | Input area, prompts |
| `components/ai-workspace/ContextIndicator.tsx` | Context % display |

## Multi-Turn Conversations

### Session Management

1. Capture `session_id` from `system` (init) or `result` event
2. Store with conversation state
3. Pass `--resume <session_id>` on subsequent requests
4. Claude maintains full conversation context server-side

### Our Implementation

```typescript
// In claude.ts - capture session_id
if (event.type === 'system' && event.subtype === 'init') {
  capturedSessionId = event.session_id
}
if (event.type === 'result' && event.session_id) {
  capturedSessionId = event.session_id
}

// On next request
args.push('--resume', sessionId)
```

## Resources

- [Vibe Kanban GitHub](https://github.com/BloopAI/vibe-kanban)
- [Vibe Kanban Docs](https://www.vibekanban.com/docs)
- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Code Release Notes](/release-notes in CLI)

## Changelog

- **2025-12-30**: Added accurate token tracking from `result` event usage field
- **2025-12-30**: Initial documentation based on Vibe Kanban analysis
