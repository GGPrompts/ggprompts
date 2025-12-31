# GGPrompts Claude Code Marketplace Plan

## The Problem

Managing Claude Code plugins from the terminal sucks:
- `/plugin` menu becomes unusable with 30+ skills
- Terminal flashes and bugs out with long lists
- No search, filter, or categories
- No previews or descriptions
- Hard to discover new skills

## The Solution

**GGPrompts becomes the control plane for your Claude Code setup.**

### Path A: Direct Install (Recommended)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   GGPrompts.com    →   TabzChrome    →   Claude Code        │
│   (Browse UI)          (Bridge)          (Runtime)          │
│                                                             │
│   - Search/filter      - WebSocket       - /plugin install  │
│   - Click Install      - Queue command   - Instant install  │
│   - Scope selection    - localhost:8129                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

One-time setup: `/plugin marketplace add GGPrompts/my-gg-plugins`
Then click Install on any component - command sent directly to Claude Code.

### Path B: GitHub Sync (Teams/Offline)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   GGPrompts.com          →    GitHub Repo    →   Claude Code│
│   (Browse/Curate UI)          (Storage)          (Runtime)  │
│                                                             │
│   - Search/filter             - my-gg-plugins    - /plugin  │
│   - Categories                - .claude/skills/  - reads    │
│   - Ratings/previews          - auto-synced        from repo│
│   - Toggle on/off                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Users can also BUILD their own marketplace on GGPrompts, hosted on their GitHub.

---

## User Flow

### Quick Install (Recommended)
1. **Setup** - One-time: `/plugin marketplace add GGPrompts/my-gg-plugins`
2. **Browse** - Search/filter skills, agents, commands on ggprompts.com
3. **Install** - Click the Terminal icon → command sent to Claude Code
4. **Done** - Component installs instantly, ready to use

### GitHub Sync (Teams/Offline)
1. **Browse** - Search/filter skills, agents, hooks, commands on ggprompts.com
2. **Curate** - Toggle on/off what they want in their toolkit
3. **Sync** - Click "Sync to GitHub" → pushes to their `my-gg-plugins` repo
4. **Use** - In Claude Code, `/plugin load .` in cloned repo
5. **Update** - Change selections on site, sync again, `git pull` locally

---

## Architecture

### GGPrompts.com (This Project)

**The management UI:**
- Browse components by type (skills, agents, hooks, MCPs, commands)
- Search and filter by category, tags
- Preview component details, ratings, reviews
- Toggle what you want in your toolkit
- One-click sync to GitHub

### User's GitHub Repo

**The storage layer:**
- `my-gg-plugins` (or custom name)
- Contains `.claude/` folder with selected components
- GGPrompts has write access via OAuth
- User clones once, `git pull` to update

```
my-gg-plugins/
└── .claude/
    ├── skills/
    │   ├── nextjs/
    │   │   ├── SKILL.md
    │   │   └── references/
    │   └── supabase/
    │       └── SKILL.md
    ├── commands/
    │   └── review-pr.md
    ├── hooks/
    │   └── pre-commit.sh
    └── agents/
        └── researcher.md
```

### Claude Code (Runtime)

- Points to user's repo as plugin source
- `/plugin` shows their curated list (not 100+ items)
- Handles installation/loading
- We don't reinvent this - just feed it the right format

---

## Database Schema

### Core Tables

```sql
-- Universal component storage
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('skill', 'agent', 'hook', 'mcp', 'command')),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[],

  -- The actual content
  files JSONB NOT NULL,
  /*
    files: [
      { "path": "SKILL.md", "content": "..." },
      { "path": "references/api.md", "content": "..." }
    ]
  */

  -- Metadata
  author_id UUID REFERENCES profiles(id),
  source_url TEXT,  -- Original GitHub URL if imported
  downloads INTEGER DEFAULT 0,
  rating NUMERIC(2,1),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's selected components (their "marketplace")
CREATE TABLE user_toolkit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  component_id UUID REFERENCES components(id) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, component_id)
);

-- User's GitHub sync settings
CREATE TABLE user_github_sync (
  user_id UUID PRIMARY KEY REFERENCES profiles(id),
  repo_name TEXT DEFAULT 'my-gg-plugins',
  repo_full_name TEXT,  -- e.g., "username/my-gg-plugins"
  is_private BOOLEAN DEFAULT FALSE,
  last_synced_at TIMESTAMPTZ,
  sync_status TEXT  -- 'synced', 'pending', 'error'
);

-- Categories for organization
CREATE TABLE component_categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  component_type TEXT,  -- 'skill', 'agent', etc. or NULL for all
  sort_order INTEGER DEFAULT 0
);
```

### Indexes

```sql
CREATE INDEX idx_components_type ON components(type);
CREATE INDEX idx_components_category ON components(category);
CREATE INDEX idx_components_tags ON components USING GIN(tags);
CREATE INDEX idx_user_toolkit_user ON user_toolkit(user_id);
CREATE INDEX idx_user_toolkit_enabled ON user_toolkit(user_id) WHERE enabled = TRUE;
```

---

## Site Routes

| Route | Description |
|-------|-------------|
| `/claude-code` | Landing page - explains the system |
| `/claude-code/skills` | Browse skills |
| `/claude-code/agents` | Browse agents |
| `/claude-code/hooks` | Browse hooks |
| `/claude-code/mcps` | Browse MCP configs |
| `/claude-code/commands` | Browse slash commands |
| `/claude-code/[type]/[slug]` | Component detail + preview |
| `/claude-code/toolkit` | User's curated selection |
| `/settings/github-sync` | Configure repo name, sync settings |

---

## Key UI Components

### Component Card
```
┌─────────────────────────────────────┐
│ 🧩 Next.js Expert              ⭐ 4.8│
│ skill • web-development            │
│                                     │
│ Build modern Next.js apps with     │
│ App Router, Server Components...   │
│                                     │
│ [+ Add] [Preview] [♡ 234]          │
└─────────────────────────────────────┘
```

### My Toolkit Page
```
┌─────────────────────────────────────┐
│ My Claude Code Toolkit              │
│                                     │
│ Skills (3)                          │
│ ├── ✅ Next.js Expert    [remove]  │
│ ├── ✅ Supabase          [remove]  │
│ └── ✅ TailwindCSS       [remove]  │
│                                     │
│ Commands (1)                        │
│ └── ✅ review-pr         [remove]  │
│                                     │
│ Last synced: 2 hours ago            │
│                                     │
│ [🔄 Sync to GitHub]                 │
└─────────────────────────────────────┘
```

### Sync Modal (v1 - simple)
```
┌─────────────────────────────────────┐
│ Sync to GitHub                      │
│                                     │
│ Repo: my-gg-plugins                 │
│ □ Make private                      │
│                                     │
│ This will create/update:            │
│ username/my-gg-plugins              │
│                                     │
│ [Cancel]              [Sync Now]    │
└─────────────────────────────────────┘
```

---

## GitHub Sync Logic

### First Sync
1. Create repo `my-gg-plugins` via GitHub API
2. Create `.claude/` folder structure
3. Write selected component files
4. Commit and push

### Subsequent Syncs
1. Fetch current repo state
2. Diff against user's selections
3. Add new components, remove deselected ones
4. Commit with message: "Sync from GGPrompts - added X, removed Y"
5. Push

### File Tracking
Each synced file gets frontmatter:
```yaml
---
# Managed by GGPrompts - do not edit directly
# Source: https://ggprompts.com/claude-code/skills/nextjs
# Component: nextjs-expert
# Synced: 2024-12-05T10:30:00Z
---
```

This lets us know which files we "own" vs user-created files.

---

## Other AI Tools (Phase 2)

For non-Claude tools, simpler approach:

### Copy Prompt
"Copy Setup Prompt" button generates:
```markdown
Create the following skills in my config:

## Next.js Expert
Purpose: Help build Next.js applications
[full content...]
```

User pastes into Gemini/Cursor/etc., AI creates files.

### Download ZIP
Download all selected components as ZIP, user extracts manually.

---

## Implementation Phases

### Phase 1: Foundation ✅ COMPLETE (2024-12-05)
- [x] Create database tables (components, user_toolkit, user_github_sync, component_categories, component_reviews)
- [x] Add RLS policies for all tables
- [x] Seed with 20 components (12 skills, 7 commands, 1 agent) from my-gg-plugins
- [x] Seed 11 categories (web-development, ui-design, terminal, ai-ml, etc.)
- [x] Build `/claude-code` landing page with featured components
- [x] Build browse pages with search/filter (`/claude-code/skills`, `/commands`, `/agents`)
- [x] Component detail pages (`/claude-code/skills/[slug]`, etc.)
- [x] Add `.claude-plugin/marketplace.json` to my-gg-plugins repo (Anthropic spec compliant)

**Components seeded:**
- Skills: ui-styling, web-frameworks, docker-mcp, agent-creator, skill-creator, ai-multimodal, docs-seeker, bubbletea, xterm-js, canvas-design, problem-solving, debugging
- Commands: handoff, wipe, prompt-engineer, gemini, codex, validate-plan, pmux
- Agents: mcp-manager

### Phase 2: User Toolkit ✅ COMPLETE (2024-12-05)
- [x] Server actions for add/remove/toggle components in toolkit
- [x] "My Toolkit" page at `/claude-code/toolkit` with grouped components
- [x] Persist selections in database via user_toolkit table
- [x] AddToToolkitButton component for detail pages
- [x] ComponentCardWrapper with add-to-toolkit functionality
- [x] Toast notifications for success/error feedback
- [x] Remove from toolkit with confirmation
- [x] Enable/disable toggle for toolkit items

### Phase 3: GitHub Sync ✅ COMPLETE (2024-12-05)
- [x] GitHub OAuth connect flow with `repo` scope (`/auth/github-connect`)
- [x] GitHub token storage in `user_github_sync.github_token_encrypted`
- [x] Repo creation via GitHub API
- [x] Sync logic - creates `.claude/` folder structure with components
- [x] Sync status tracking (`synced`, `pending`, `error`)
- [x] "Sync to GitHub" button on toolkit page with modal
- [x] GitHub Sync settings section in `/settings` page
- [x] Disconnect GitHub functionality
- [x] Repo name customization

**Implementation Details:**
- Server actions in `app/claude-code/github-sync-actions.ts`
- OAuth callback in `app/auth/github-connect/route.ts`
- UI components in `components/github-sync/`
- Settings at `/settings?tab=github`

### Phase 4: Community ✅ COMPLETE (2024-12-05)
- [x] Ratings and reviews system
- [x] "Copy Prompt" button for non-GitHub users
- [x] Download as ZIP for toolkit
- [x] Seeded 18 new high-quality components from community research

**Implementation Details:**
- Copy Prompt: `components/claude-code/CopyPromptButton.tsx`
- Download ZIP: `app/claude-code/download-zip/route.ts` (pure JS ZIP generation, no deps)
- Reviews: `app/claude-code/review-actions.ts`, `StarRating.tsx`, `ReviewForm.tsx`, `ReviewsList.tsx`
- New categories: devops, database, testing, security, documentation, mobile, api-development, code-review, data-science

**Components Added (38 total now):**
- Skills: test-driven-development, systematic-debugging, security-scanner, accessibility-auditor, performance-profiler, database-migration
- Agents: devops-engineer, data-scientist, code-reviewer, kubernetes-specialist, postgres-pro
- Commands: security-scan, docker-optimize, api-scaffold, db-migrate, k8s-manifest
- Hooks: pre-tool-use-security, notification-hub

### Phase 5: User Submissions & Admin Tools ✅ COMPLETE (2024-12-06)
- [x] User submission flow at `/claude-code/submit`
- [x] Admin review dashboard at `/admin/components`
- [x] Component approval/rejection workflow
- [x] Bulk moderation tools (select multiple, batch actions)
- [x] Auto-sync from my-gg-plugins via GitHub webhook
- [x] Export approved user components back to GitHub repo
- [x] Set author_id on official components for RLS

**Implementation Details:**
- Submission form: `app/claude-code/submit/page.tsx`, `components/claude-code/SubmitComponentForm.tsx`
- Admin actions: `app/admin/components/actions.ts` (approve, reject, delete, bulk operations)
- Sync: `lib/sync-plugins.ts`, `app/api/webhooks/github-sync/route.ts`
- Export: `lib/export-to-github.ts`

**Environment Variables:**
- `GITHUB_WEBHOOK_SECRET` - Verify webhook signatures
- `GITHUB_EXPORT_TOKEN` - PAT with repo scope for export

### Phase 6: Direct Install via TabzChrome ✅ COMPLETE (2024-12-16)
- [x] Restructure my-gg-plugins for remote marketplace support
  - [x] Remove `plugin.json` (keep only `marketplace.json`)
  - [x] Add `$schema` field to marketplace.json
  - [x] Create `plugins/` directory with proper structure for each component
  - [x] Update source paths from `./skills/name` to `./plugins/name`
- [x] Add TabzChrome integration to useTabzChrome hook
  - [x] `installPlugin({ slug, marketplace, scope })` - sends install command
  - [x] `uninstallPlugin(slug, marketplace)` - sends uninstall command
  - [x] `ensureMarketplace(repo)` - available for manual marketplace setup
  - [x] Security: `isLocalhost()` check to skip probing from remote HTTPS sites
  - [x] Security: `sanitizeToken()` to remove non-ASCII characters from auth tokens
- [x] Create `InstallPluginButton` component
  - [x] Icon-only button with tooltip (Terminal icon)
  - [x] Dropdown for scope selection (User/Project/Local)
  - [x] Falls back to "Copy Install" when TabzChrome unavailable
  - [x] Toast notifications for install feedback
- [x] Update ComponentCard with icon-only action buttons
  - [x] View, Install, Bookmark, Add buttons all 7x7 square icons
  - [x] Tooltips on hover for all buttons
- [x] Update "How It Works" section on landing page
  - [x] Primary: Quick Install via TabzChrome (3 steps)
  - [x] Secondary: GitHub Sync for teams/offline

**Implementation Details:**
- Hook: `hooks/useTabzChrome.tsx` (extended with plugin methods)
- Button: `components/claude-code/InstallPluginButton.tsx`
- my-gg-plugins: Restructured with `plugins/<name>/skills/<name>/SKILL.md` pattern
- Global: `TooltipProvider` added to `app/layout.tsx`

**Install Command Flow:**
```
User clicks Install → installPlugin() → queueToChatBar() → TabzChrome WebSocket
                                                              ↓
                                            Claude Code receives: /plugin install {slug}@my-gg-plugins --scope {scope}
```

---

### Phase 7: Enhanced GitHub Integration ✅ COMPLETE (2024-12-16)
- [x] Sync status indicator on toolkit items (green/gray dot with tooltip)
- [x] "View on GitHub" button opens file in user's repo
- [x] In-app edit mode for synced components
- [x] Direct commit to user's GitHub repo via API
- [x] Conflict detection via GGPrompts frontmatter check
- [x] Fresh content fetch from GitHub when entering edit mode

**Implementation Details:**
- Server actions: `getFullSyncData()`, `updateComponentFile()`, `checkComponentConflict()`, `fetchFileContent()`
- Extended `ComponentContentModal` with edit mode (Textarea, Save/Cancel buttons)
- `ToolkitItem` shows sync status indicator and GitHub button
- Toolkit page fetches `lastSyncedFiles` to determine per-component sync state

**Files Modified:**
- `app/claude-code/github-sync-actions.ts` - New server actions for file operations
- `app/claude-code/toolkit/page.tsx` - Fetches sync data, passes to ToolkitItem
- `app/claude-code/toolkit/ToolkitItem.tsx` - Sync status dot, GitHub button
- `components/claude-code/ComponentContentModal.tsx` - Edit mode with GitHub save

### Phase 7.1: Simplified to Always-Fork Model ✅ COMPLETE (2024-12-21)
- [x] Removed sync/fork choice dialog - components add directly with one click
- [x] All toolkit items are now user's personal copy (always forked)
- [x] GitHub sync pushes ALL enabled components to user's repo
- [x] Removed fork badge and toggle button from toolkit UI
- [x] Simplified status indicator to just synced vs not-synced

**Rationale:**
The fork/sync distinction added complexity without clear benefit. Users expected their toolkit to be their own copy. Now:
- "Add to Toolkit" adds directly (no dialog)
- All components are the user's own copy
- GitHub sync pushes everything enabled to their repo
- Users edit components in their GitHub repo directly

**Files Modified:**
- `components/claude-code/AddToToolkitButton.tsx` - Removed dialog, direct add
- `app/claude-code/actions.ts` - Hardcoded `is_forked: true`, removed `toggleForkStatus()`
- `app/claude-code/toolkit/ToolkitItem.tsx` - Removed fork badge/toggle
- `app/claude-code/toolkit/page.tsx` - Removed isForked from queries
- `app/claude-code/github-sync-actions.ts` - Removed `is_forked` filter from sync
- `app/profile/page.tsx` - Removed isForked from toolkit query

---

## Future Ideas

### Phase 8: Localhost Mode (Considering)
- [ ] Run GGPrompts locally for full TabzChrome integration
- [ ] Offline browsing with cached component data
- [ ] Alternative: Lightweight local proxy for TabzChrome bridge
- [ ] Alternative: TabzChrome extension content script injection

---

## Success Metrics

- Components in marketplace: 50+ at launch
- Users with synced repos: 100+ in first month
- Weekly active toolkit users: 30%+ retention
- Community submissions: 10+ per month

---

## The Pitch

> "Managing Claude Code plugins from the terminal sucks. Browse, search, and curate your toolkit from a real UI. Sync to GitHub. Your `/plugin` menu shows exactly what you want - nothing more."

**GGPrompts: The control plane for your Claude Code setup.**
