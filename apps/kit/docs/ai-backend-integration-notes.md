# AI Backend Integration Notes

## Phase 2 Implementation Status

### ✅ Completed
- Backend detection system (`lib/ai/detect.ts`)
- Docker Model Runner integration (`lib/ai/docker.ts`) - OpenAI-compatible API
- Mock backend integration (`lib/ai/mock.ts`) - Always available fallback
- API Routes:
  - `/api/ai/models` - Lists available models from all backends
  - `/api/ai/chat` - Streaming chat endpoint with SSE
- Frontend integration with real-time streaming
- Model selector with backend status indicators
- Fallback chain: Claude → Docker → Mock

### ⚠️ Claude CLI Integration Notes

The Claude CLI integration is implemented in `lib/ai/claude.ts` but may require additional work:

**Current Implementation:**
- Uses `claude --print --output-format stream-json --verbose`
- Spawns subprocess and parses streaming JSON
- Filters `content_block_delta` events for text chunks

**Known Issues:**
- Claude CLI appears to have different behavior when called non-interactively
- May require investigation into proper stream-json format parsing
- Current timeout behavior suggests additional configuration may be needed

**Alternative Approaches to Consider:**
1. **Direct OAuth Integration** - Implement PKCE flow like OpenCode (more complex but more control)
2. **HTTP Server Wrapper** - Run a simple Node server that wraps Claude CLI (Termux approach)
3. **Use Claude API Directly** - Skip CLI entirely and use Anthropic API with Max subscription

**Recommendation:**
For now, the mock backend provides reliable functionality for testing and demos. Docker Model Runner provides free local models. Claude integration can be refined based on actual usage patterns.

## Testing Results

### Mock Backend ✅
```bash
curl http://localhost:3001/api/ai/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}], "backend": "mock"}'
```
- **Status:** Working perfectly
- **Streaming:** SSE chunks delivered correctly
- **Response quality:** Good for demos

### Docker Model Runner ⏸️
- **Status:** Not tested (Docker not running)
- **Implementation:** Complete and follows OpenAI API spec
- **Expected behavior:** Should work when Docker Desktop + models are available

### Claude CLI ⚠️
- **Status:** Implemented but needs refinement
- **Issue:** CLI behavior in non-interactive mode needs investigation
- **Fallback:** If Claude fails, automatically falls back to mock

## Backend Priority (Fallback Chain)

1. **Claude CLI** - If available and working
2. **Docker Models** - If localhost:12434 responds
3. **Mock** - Always available (guaranteed fallback)

The API automatically tries backends in order and falls back gracefully.

## How to Test Each Backend

### Test Mock (Always Works)
```bash
curl http://localhost:3001/api/ai/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "debug"}],
    "backend": "mock",
    "model": "mock"
  }'
```

### Test Docker (Requires Docker Desktop + Model)
```bash
# Start Docker Desktop
# Pull a model (e.g., qwen3)
# Then:
curl http://localhost:3001/api/ai/chat \
  -X POST \
  -H "Content-Type": "application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "backend": "docker",
    "model": "qwen3"
  }'
```

### Test Claude (Requires Investigation)
```bash
curl http://localhost:3001/api/ai/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "backend": "claude",
    "model": "claude"
  }'
```

## UI Features Implemented

- ✅ Model selector with real-time detection
- ✅ Backend status indicators (Available/Unavailable)
- ✅ Streaming responses with typewriter effect
- ✅ Automatic fallback on error
- ✅ Error messages shown in chat
- ✅ Settings persistence (localStorage)
- ✅ Mobile-responsive design

## Next Steps (Phase 3 & Beyond)

### Phase 3: Multi-Provider Support
- GitHub Copilot integration
- OpenAI / Codex integration
- Google Gemini integration
- Provider abstraction layer
- Per-provider settings (API keys, endpoints)

### Phase 4: Saved Prompts
- Prompt CRUD operations
- Prompt palette UI (⌘K)
- Variable interpolation
- GitHub sync for prompts

### Claude CLI Refinement
If Claude CLI integration is desired:
1. Test `stream-json` output format directly
2. Investigate workspace trust and permission handling
3. Consider alternative approaches (OAuth, HTTP wrapper)
4. Add better error handling and diagnostics

## Success Metrics

- ✅ Can select between available backends in UI
- ⏸️ Claude CLI responses stream (needs refinement)
- ⏸️ Docker model responses stream (not tested, no Docker running)
- ✅ Falls back to mock gracefully
- ✅ No errors in normal operation
- ✅ Works on mobile

## Files Created

```
lib/ai/
  ├── types.ts          # Shared TypeScript types
  ├── detect.ts         # Backend detection
  ├── claude.ts         # Claude CLI integration
  ├── docker.ts         # Docker Model Runner
  └── mock.ts           # Mock backend

app/api/ai/
  ├── models/route.ts   # List available models
  └── chat/route.ts     # Chat with streaming

app/sections/
  └── ai-workspace.tsx  # Updated with real backend integration
```

## Configuration

No configuration files needed. Backend detection is automatic:
- Claude: Checks for `claude` command
- Docker: Pings `http://localhost:12434/v1/models`
- Mock: Always available

Settings are stored in localStorage:
- `ai-workspace-settings` - Model, temperature, tokens, system prompt
- `ai-workspace-conversations` - Conversation history
