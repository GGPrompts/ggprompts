# AI Workspace

A personal AI chat workspace integrated into the homepage dashboard, supporting both Claude (via Max subscription) and local models (via Docker Model Runner).

## Overview

The AI Workspace provides a unified interface for interacting with multiple AI backends:
- **Claude (Local)** - Via CLI on your machine using Max subscription
- **Claude (Termux)** - Via phone running Claude CLI, accessible remotely
- **Local Models** - Via Docker Model Runner API (free, private, fast)

This enables flexible workflows:
- **Desktop**: Claude CLI locally or Docker models
- **Mobile (Termux)**: Web UI + Termux backend on same device (bypasses xterm.js/node-pty limitation)
- **Remote**: Connect to home machine or phone via Tailscale
- **Sensitive data**: Use local Docker models (never leaves your machine)
- **Demo/Sharing**: Mock responses work without any backend configured

### Why Termux + Web UI?

Claude Code works great in Termux, but xterm.js terminals don't work on mobile (node-pty isn't supported). The AI Workspace solves this by providing a clean, mobile-friendly chat UI that communicates with a simple HTTP server wrapping the Claude CLI - all running on the same phone. Best of both worlds: Claude's power + polished mobile UX.

## Features

### Core Chat Interface
- Clean chat UI with conversation threading
- Real-time streaming responses (typewriter effect)
- Code block rendering with syntax highlighting
- Copy, regenerate, feedback actions on messages
- Mobile-responsive design

### Model Selection
- Switch between Claude and local Docker models
- Model-specific settings (temperature, max tokens)
- Visual indicator of which model is active
- Fallback to local model if Claude unavailable

### Saved Prompts / Templates
- Create and save reusable prompt templates
- Categories: Coding, Review, Debug, Explain, Custom
- Variables support (e.g., `{{code}}`, `{{language}}`)
- Quick-access prompt palette (keyboard shortcut)
- GitHub sync (like bookmarks/notes)

### Conversation Management
- Multiple conversation threads
- Auto-generated titles from first message
- Search/filter conversations (planned)
- Export to Markdown (Download button in header)
- Background generation support - responses continue when navigating away
- Context usage indicator with warning/danger thresholds
- "Continue in new chat" with AI-generated summary when context gets high
- GitHub sync for persistence (planned)

### Context Injection
- Paste code snippets with language detection
- Reference local files (via file picker)
- Inject system prompts per conversation
- Presets: "Coding Assistant", "Code Reviewer", "Explain Like I'm 5"

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Workspace UI                          │
│  ┌─────────────┐ ┌─────────────────────┐ ┌───────────────┐  │
│  │ Sidebar     │ │ Chat Interface      │ │ Settings      │  │
│  │ - History   │ │ - Messages          │ │ - Model       │  │
│  │ - Prompts   │ │ - Input             │ │ - Temperature │  │
│  │ - Search    │ │ - Streaming         │ │ - System      │  │
│  └─────────────┘ └─────────────────────┘ └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  /api/ai/chat      - Main chat endpoint                     │
│  /api/ai/models    - List available models                  │
│  /api/ai/prompts   - CRUD for saved prompts                 │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌───────────────────┐ ┌─────────────┐ ┌───────────────────────┐
│    Claude CLI     │ │   Termux    │ │  Docker Model Runner  │
│  - Local machine  │ │   Backend   │ │  - Local models       │
│  - Max sub        │ │  - Phone    │ │  - OpenAI-compat API  │
│  - stream-json    │ │  - Remote   │ │  - Free, private      │
└───────────────────┘ └─────────────┘ └───────────────────────┘
```

## API Design

### Chat Endpoint

```typescript
// POST /api/ai/chat
interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
  model: 'claude' | string  // 'claude' or docker model name
  settings?: {
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  }
  stream?: boolean
}

// Response: Server-Sent Events stream or JSON
```

### Claude Integration

```typescript
// lib/ai/claude.ts
import { spawn } from 'child_process'

export async function streamClaude(prompt: string, options: ClaudeOptions) {
  const args = [
    '-p', prompt,
    '--output-format', 'stream-json',
    '--include-partial-messages'
  ]

  if (options.systemPrompt) {
    args.push('--system-prompt', options.systemPrompt)
  }

  const claude = spawn('claude', args)

  // Return readable stream for SSE
  return new ReadableStream({
    start(controller) {
      claude.stdout.on('data', (chunk) => {
        controller.enqueue(chunk)
      })
      claude.on('close', () => controller.close())
      claude.on('error', (err) => controller.error(err))
    }
  })
}
```

### Direct OAuth Integration (Alternative to CLI)

Instead of wrapping the Claude CLI, you could implement OAuth directly like OpenCode does. This gives more control but is more complex.

**OAuth Details (from Claude Code/OpenCode):**

```
Client ID:      9d1c250a-e61b-44d9-88ed-5944d1962f5e
Auth Endpoint:  https://console.anthropic.com/oauth/authorize
Token Endpoint: https://console.anthropic.com/oauth/token
Callback:       http://localhost:54545/callback (or custom)
Scopes:         org:create_api_key user:profile user:inference
```

**PKCE Flow:**
1. Generate `code_verifier` (random string)
2. Create `code_challenge` = base64url(sha256(code_verifier))
3. Redirect user to auth endpoint with challenge
4. User logs in at Anthropic
5. Receive authorization code at callback
6. Exchange code + verifier for tokens at token endpoint
7. Store tokens, refresh before expiry (5-min buffer)

**Token Storage:**
- Claude Code stores at `~/.claude/.credentials.json` or `~/.claude/oauth_token.json`
- Contains: `access_token`, `refresh_token`, `expires_at`

**Important:** Remove `ANTHROPIC_API_KEY` env var to force subscription auth instead of API credits.

**Considerations:**
- More complex than CLI wrapper approach
- Direct API access (no CLI subprocess)
- OpenCode uses same client ID as Claude Code (gray area)
- For personal use, CLI wrapper is simpler and officially supported

### Termux Backend Integration

Run a simple HTTP server on your phone that wraps the Claude CLI. Access it remotely when away from your main machine.

**Termux Setup (on phone):**

```bash
# Install dependencies
pkg install nodejs

# Create simple server (termux-claude-server.js)
cat << 'EOF' > ~/termux-claude-server.js
const http = require('http');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(404);
    return res.end();
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const { prompt, systemPrompt } = JSON.parse(body);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Access-Control-Allow-Origin': '*'
    });

    const args = ['-p', prompt, '--output-format', 'stream-json'];
    if (systemPrompt) args.push('--system-prompt', systemPrompt);

    const claude = spawn('claude', args);
    claude.stdout.on('data', data => res.write(data));
    claude.on('close', () => res.end());
  });
});

server.listen(8787, '0.0.0.0', () => {
  console.log('Claude server running on :8787');
});
EOF

# Run server
node ~/termux-claude-server.js
```

**Client Integration:**

```typescript
// lib/ai/termux.ts
export async function streamTermux(
  endpoint: string,  // e.g., 'http://192.168.1.50:8787' or Tailscale IP
  prompt: string,
  options: TermuxOptions
) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      systemPrompt: options.systemPrompt
    })
  })

  return res.body // ReadableStream
}
```

**Connection Options:**
- **Local network** - Use phone's IP (e.g., `192.168.1.x:8787`)
- **Tailscale** - Access from anywhere via Tailscale IP (recommended)
- **Cloudflare Tunnel** - Expose securely over internet

### Docker Model Runner Integration

Docker Model Runner exposes an OpenAI-compatible API at `http://localhost:12434` (or via `DOCKER_MODEL_API` env var for WSL2):

```typescript
// lib/ai/docker-models.ts
const DOCKER_MODEL_API = process.env.DOCKER_MODEL_API || 'http://localhost:12434'
const API_BASE = `${DOCKER_MODEL_API}/engines/v1`  // Note: /engines/v1, not /v1

export async function listLocalModels() {
  const res = await fetch(`${API_BASE}/models`)
  return res.json()
}

export async function streamLocalModel(
  model: string,
  messages: Message[],
  options: ModelOptions
) {
  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
      stream: true
    })
  })

  return res.body // ReadableStream
}
```

### Docker Model Runner Setup (WSL2)

When running the homepage in WSL2 and Docker Desktop on Windows, extra configuration is needed because:

1. **Docker Model Runner binds to `127.0.0.1` on Windows** - Not accessible from WSL2
2. **WSL2 can't reach Windows localhost directly** - Different network namespace
3. **Solution: Use `netsh portproxy` + Tailscale IP**

**Step 1: Enable Docker Model Runner with TCP**

```bash
# In Windows terminal
docker desktop enable model-runner --tcp=12434

# Check status
docker model status --json

# List available models
docker model list

# Pull a model (example)
docker model pull ai/phi4
```

**Step 2: Configure Windows Port Forwarding**

```powershell
# Windows Admin PowerShell - enable port proxy from all interfaces to localhost
netsh interface portproxy add v4tov4 listenport=12434 listenaddress=0.0.0.0 connectport=12434 connectaddress=127.0.0.1

# Add Windows Firewall rule
New-NetFirewallRule -DisplayName 'Docker Model Runner' -Direction Inbound -LocalPort 12434 -Protocol TCP -Action Allow
```

**Step 3: Configure Environment Variable**

Set `DOCKER_MODEL_API` in `.env.local` to your Windows machine's Tailscale IP:

```bash
# .env.local
DOCKER_MODEL_API=http://<windows-tailscale-ip>:12434
```

**Step 4: Verify Connection**

```bash
# Test from Windows
curl http://localhost:12434/engines/v1/models

# Test from WSL2 (using Tailscale IP)
curl http://<windows-tailscale-ip>:12434/engines/v1/models
```

**Important:** The API endpoint is `/engines/v1` (not `/v1`). The models endpoint is `/engines/v1/models` and chat completions is `/engines/v1/chat/completions`.

**Useful Docker Model Commands:**

```bash
# Enable model runner with TCP
docker desktop enable model-runner --tcp=12434

# Check status
docker model status --json

# List models
docker model list

# Pull a model
docker model pull ai/phi4

# Remove port proxy (if needed)
netsh interface portproxy delete v4tov4 listenport=12434 listenaddress=0.0.0.0
```

## Data Models

### Conversation

```typescript
interface Conversation {
  id: string
  title: string
  model: string
  systemPrompt?: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  model?: string  // Track which model generated this
  feedback?: 'up' | 'down'
}
```

### Saved Prompt

```typescript
interface SavedPrompt {
  id: string
  name: string
  description?: string
  content: string
  category: 'coding' | 'review' | 'debug' | 'explain' | 'custom'
  variables?: string[]  // e.g., ['code', 'language']
  model?: string  // Preferred model for this prompt
  createdAt: string
}
```

## UI Components

### Files to Create

```
app/sections/ai-workspace.tsx      # Main section component
components/ai/
  ChatInterface.tsx                # Chat messages + input
  ConversationSidebar.tsx          # History + saved prompts
  ModelSelector.tsx                # Model dropdown
  PromptPalette.tsx                # Quick prompt selection (⌘K style)
  MessageBubble.tsx                # Individual message
  SettingsPanel.tsx                # Model settings
  StreamingText.tsx                # Animated text streaming
lib/ai/
  claude.ts                        # Claude CLI integration
  docker-models.ts                 # Docker Model Runner API
  types.ts                         # Shared types
hooks/
  useAIChat.ts                     # Chat state + streaming
  useLocalModels.ts                # Docker model discovery
  useSavedPrompts.ts               # Prompt management
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘ + K` | Open prompt palette |
| `⌘ + N` | New conversation |
| `⌘ + Enter` | Send message |
| `⌘ + Shift + C` | Copy last response |
| `Escape` | Close panels |

## Implementation Phases

### Phase 1: Basic Chat ✅ COMPLETED
- [x] Port chat UI from portfolio-style-guides template
- [x] Add AI Workspace to navigation
- [x] Basic conversation state (localStorage)
- [x] Mock response system (ready for Phase 2 backend integration)

**Template Adaptations Completed:**
- ✅ Hide avatar icons on mobile (chat bubbles fit screen width)
- ✅ Removed `SpaceBackground` (homepage handles background)
- ✅ Use existing `glass` / `glass-dark` classes from homepage design system
- ✅ Consistent styling with other homepage sections
- ✅ Mobile-responsive layout
- ✅ Removed widget mode (not needed for dashboard integration)

**What's Working:**
- Create and manage multiple conversations
- Send messages with mock responses
- Streaming animation for responses
- Settings panel (model, temperature, tokens, system prompt)
- Conversations persist in localStorage
- Suggested prompts for quick starts
- Message actions (copy, regenerate, feedback)

### Phase 2: Backend Integration ✅ COMPLETED
- [x] Claude CLI integration (streaming via `--output-format stream-json`)
- [x] Docker Model Runner API integration
- [x] Model discovery and listing
- [x] Model selector UI
- [x] Unified streaming handler for all backends
- [x] **Keep mock responses as fallback** - If no backend is configured, use mock responses so the UI remains functional for demos/sharing

**Backend Infrastructure Completed:**
- ✅ Backend detection system (`lib/ai/detect.ts`)
- ✅ Claude CLI integration (`lib/ai/claude.ts`)
- ✅ Docker Model Runner integration (`lib/ai/docker.ts`)
- ✅ Mock backend always available (`lib/ai/mock.ts`)
- ✅ Shared TypeScript types (`lib/ai/types.ts`)

**API Routes Implemented:**
- ✅ `/api/ai/models` - Lists available models from all backends
- ✅ `/api/ai/chat` - Streaming chat endpoint with SSE

**Frontend Features:**
- ✅ Dynamic model selector with real-time detection
- ✅ Backend status indicators (Available/Unavailable)
- ✅ Streaming response parsing with Server-Sent Events
- ✅ Automatic fallback to mock on errors
- ✅ Error messages displayed in chat
- ✅ Settings persistence (localStorage)

**Fallback Chain:**
1. Claude CLI (if available)
2. Docker Model Runner (if localhost:12434 responds)
3. Mock backend (always available)

**Testing Status:**
- ✅ Mock backend: Fully tested and working
- ✅ Models API: Backend detection working
- ⏸️ Claude CLI: Implementation complete, may need refinement for stream-json output
- ⏸️ Docker: Ready but not tested (requires Docker Desktop + models)

See `docs/ai-backend-integration-notes.md` for detailed implementation notes and troubleshooting.

### Phase 3: Multi-Provider Support ✅ COMPLETED
- [x] Gemini CLI integration with model selection (2.5 Pro, 2.5 Flash, 2.5 Flash Lite, 2.0 Flash)
- [x] OpenAI Codex CLI integration with model selection + Reasoning Effort + Sandbox Mode
- [x] Claude Agent support (`--agent` flag, reads from `~/.claude/agents/`)
- [x] Provider-specific settings (only show relevant options per backend)
- [x] Temperature/Max Tokens only shown for Docker models (CLI tools don't support these)

**Settings Improvements (Dec 2024):**
- ✅ Claude model options: Opus, Sonnet, Haiku (simplified, no version numbers)
- ✅ Claude agents dropdown (loads from `~/.claude/agents/*.md`)
- ✅ Gemini model dropdown with current models
- ✅ Codex model dropdown (GPT-5, GPT-5.1, Codex Mini variants)
- ✅ Codex Reasoning Effort (Low/Medium/High)
- ✅ Codex Sandbox Mode (Read Only/Full/Off)
- ✅ "Append System Prompt" - empty by default, clearly labeled
- ✅ Editable Quick Prompts (customize the 4 starter prompts in Settings)
- ✅ Empty conversations refresh to current date on load

**API Endpoints Added:**
- `/api/ai/agents` - Lists agents from `~/.claude/agents/`

**Infrastructure:**
- Claude CLI uses `~/.claude/local/claude` path directly (supports v2.0.59+ features)
- Detection checks specific path instead of relying on PATH

### Phase 4: Background Processing & Resilience ✅ COMPLETED
- [x] Background conversation support - Conversations continue when navigating away
- [x] Generating state persistence (localStorage tracks active generations)
- [x] Sidebar spinner indicator for conversations still generating
- [x] Poll server for completion when returning to workspace
- [x] Cross-tab sync via storage events
- [x] Stale flag cleanup (10-minute timeout)
- [x] Server-side JSONL persistence (responses saved even if client disconnects)

**How it works:**
1. User sends message → generation starts → flag saved to localStorage
2. User navigates away → stream aborts locally but server continues writing to JSONL
3. User returns → detects generating flag → polls server for completion
4. Server response found → syncs to local state → clears flag

### Phase 5: Export & Context Management ✅ COMPLETED
- [x] Export conversation as markdown (Download button in header)
- [x] Context usage indicator with warning/danger thresholds (70%/90%)
- [x] "Continue in new chat" feature when context gets high
- [x] AI-generated summary for conversation handoffs
- [x] Multi-model attribution in summaries

**Export Format:**
- Markdown with metadata (title, date, model, project)
- Each message attributed: `## User` / `## Claude` / `## Gemini` etc.
- Filename: `{conversation-title}-{date}.md`

**Context Warning Banner:**
- Appears at 70% (warning/yellow) and 90% (danger/red)
- Buttons: "Continue in new chat" | "Dismiss"
- Dismissal is per-conversation

**Continue in New Chat:**
- Creates new conversation titled "Continued: {original title}"
- Copies settings & project path from original
- Sends prompt asking AI to generate structured summary
- Summary includes: what we're working on, key decisions (with model attribution), current state, important context, next steps

### Phase 6: Saved Prompts
- [ ] Prompt CRUD operations
- [ ] Prompt palette UI (⌘K)
- [ ] Variable interpolation
- [ ] GitHub sync for prompts

### Phase 7: Polish
- [ ] Conversation GitHub sync
- [ ] Search/filter conversations
- [ ] System prompt presets
- [ ] Mobile optimizations

## Docker Models of Interest

From Docker Hub Model Runner:

| Model | Best For | Size |
|-------|----------|------|
| `qwen3` | General coding, math, reasoning | 100K+ downloads |
| `qwen3-vl` | Vision + text (multimodal) | 10K+ downloads |
| `gpt-oss` | Agentic tasks, reasoning | 100K+ downloads |
| `gemma3-vllm` | Fast chat, general | 8.6K downloads |
| `granite-4.0-nano` | Lightweight, fast | 3.8K downloads |
| `moondream2` | Image understanding | 4.8K downloads |

## Settings Storage

```typescript
interface AIWorkspaceSettings {
  defaultBackend: 'claude-local' | 'claude-termux' | 'docker'
  defaultModel: string  // For docker backend
  claudeSettings: {
    temperature: number
    maxTokens: number
  }
  localModelSettings: {
    temperature: number
    maxTokens: number
  }
  systemPromptPresets: Array<{
    name: string
    prompt: string
  }>
  dockerApiUrl: string      // Default: http://localhost:12434
  termuxEndpoint: string    // e.g., http://192.168.1.50:8787 or Tailscale IP
}
```

Store in localStorage with key `ai-workspace-settings`.

## Open Questions

1. **Conversation sync** - Use GitHub Gist like Quick Notes, or separate repo?
2. **Model auto-detection** - Ping Docker API on load to show available models?
3. **File attachments** - Support uploading files for context? (Claude supports this)
4. **Multi-turn context** - How much history to send with each request?

## Cost Notes

- **Claude Max** - Flat subscription ($20-200/mo), no per-token billing. Use `/usage` in CLI to check limits.
- **Docker models** - Free, runs locally on your hardware. No usage limits.

## Mobile Workflow

A complete mobile-first development setup using Termux + personal-homepage.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Phone (Termux)                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Claude CLI   │  │ Git/GitHub   │  │ Code Editor      │   │
│  │ (Max sub)    │  │ Sync         │  │ (neovim, etc.)   │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘   │
│         │                 │                                  │
│         ▼                 ▼                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              HTTP Server (:8787)                      │   │
│  │              Wraps Claude CLI                         │   │
│  └──────────────────────────┬───────────────────────────┘   │
│                             │                                │
│  ┌──────────────────────────▼───────────────────────────┐   │
│  │           Browser: personal-homepage                  │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ │   │
│  │  │ AI Workspace│ │ Quick Notes │ │ Projects        │ │   │
│  │  │ (Chat UI)   │ │ (GitHub)    │ │ (GitHub)        │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ git push
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Cloud                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ GitHub       │─▶│ Vercel       │─▶│ Live Sites       │   │
│  │ (repos)      │  │ (builds)     │  │ (production)     │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### What Runs Where

| Task | Where | How |
|------|-------|-----|
| Code editing | Termux | neovim, micro, etc. |
| Claude AI | Termux → Web UI | CLI + HTTP server + AI Workspace |
| Git operations | Termux | git CLI |
| Notes/Bookmarks | Browser | personal-homepage (GitHub sync) |
| Project management | Browser | personal-homepage Projects section |
| Go/Python/Node scripts | Termux | Direct execution |
| Next.js/React builds | Vercel | Push to GitHub, auto-deploy |
| Preview deployments | Vercel | PR previews |

### Termux Setup

```bash
# Essential packages
pkg install git nodejs python golang neovim openssh

# Claude Code
npm install -g @anthropic-ai/claude-code

# Authenticate Claude
claude  # Follow OAuth flow

# Start Claude HTTP server (for AI Workspace)
node ~/termux-claude-server.js &

# Optional: Run on boot with Termux:Boot
mkdir -p ~/.termux/boot
echo 'node ~/termux-claude-server.js &' > ~/.termux/boot/claude-server.sh
chmod +x ~/.termux/boot/claude-server.sh
```

### Termux:API Integration

Enhance the mobile workflow with Termux:API:

```bash
pkg install termux-api
```

| API | Use Case |
|-----|----------|
| `termux-notification` | Alert when long Claude task completes |
| `termux-clipboard-get/set` | Copy code between apps |
| `termux-share` | Share Claude responses to other apps |
| `termux-tts-speak` | Read responses aloud |
| `termux-wake-lock` | Keep alive during long operations |

### Workflow Examples

**Quick code question:**
1. Open personal-homepage in browser
2. Go to AI Workspace
3. Ask Claude, get streaming response
4. Copy code to clipboard
5. Paste into neovim in Termux

**Working on a project:**
1. `cd ~/projects/my-app && nvim .`
2. Edit code in Termux
3. Ask Claude for help via AI Workspace (side by side or split screen)
4. `git add . && git commit -m "feature" && git push`
5. Vercel auto-deploys, check preview URL

**Syncing notes:**
1. Jot notes in Quick Notes (personal-homepage)
2. Auto-syncs to GitHub
3. Available on any device

### Advantages

- **Portable** - Full dev environment in your pocket
- **Always on** - Phone is always charged and connected
- **Synced** - GitHub keeps everything in sync across devices
- **No desktop dependency** - Desktop becomes optional
- **Clean UI** - personal-homepage provides polished mobile UX
- **Cost effective** - Uses existing Max subscription, no extra API costs

### Limitations

- **Build times** - Complex builds offloaded to Vercel
- **Screen size** - Split screen helps but still limited
- **Battery** - Heavy Claude usage can drain battery
- **Some packages** - Not everything compiles on Android/Termux

## Development Tools

The following tools are available for building the AI Workspace:

### shadcn MCP Server
MCP server for browsing and installing shadcn/ui components. Use to:
- Search for components (`mcp__shadcn__search_items_in_registries`)
- View component code (`mcp__shadcn__view_items_in_registries`)
- Get usage examples (`mcp__shadcn__get_item_examples_from_registries`)
- Get install commands (`mcp__shadcn__get_add_command_for_items`)

### Claude Skills
- `shadcn-ui` skill - For component installation and usage patterns
- `docs-seeker` skill - For looking up latest documentation

### Existing Components
The homepage already has these shadcn/ui components installed:
- Button, Input, Textarea, Badge, Card
- Select, Dropdown, Dialog, Drawer
- ScrollArea, Separator, Tooltip
- Tabs, Collapsible, Switch, Slider

Check `components/ui/` for full list.

## References

- [Claude Code CLI Reference](https://docs.anthropic.com/en/docs/claude-code)
- [Docker Model Runner Docs](https://docs.docker.com/desktop/features/model-runner/)
- [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat) (Docker uses this format)
- Chat UI Template: `~/projects/portfolio-style-guides/app/templates/chat-helpbot/`
- [OpenCode OAuth Implementation](https://github.com/sst/opencode) - Reference for direct OAuth approach
- [Claude Max OAuth Article](https://idsc2025.substack.com/p/how-i-built-claude_max-to-unlock) - Detailed PKCE flow breakdown
- [Roo-Code OAuth Discussion](https://github.com/RooCodeInc/Roo-Code/issues/4799) - Community OAuth implementation notes
