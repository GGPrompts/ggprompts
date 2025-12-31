# GGPrompts - AI Prompt Engineering Platform

Next.js rebuild of the original GGPrompts (`~/projects/GGPrompts`), using the theme system from `~/projects/portfolio-style-guides`.

## Quick Reference

| What | Where |
|------|-------|
| Dev server | `npm run dev` (runs on port 4001) |
| Tech stack | Next.js 16, shadcn/ui, Tailwind, Supabase |
| Themes | 10 themes via `data-theme` attribute |
| Auth | Supabase Auth (OAuth + email) |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/prompts` | Prompt library with search/filter |
| `/forums` | Community discussions |
| `/forums/[id]` | Forum post detail |
| `/claude-code` | Claude Code Marketplace landing |
| `/claude-code/skills` | Browse skills |
| `/claude-code/commands` | Browse commands |
| `/claude-code/agents` | Browse agents |
| `/claude-code/toolkit` | User's curated toolkit (auth required) |
| `/claude-code/submit` | Submit new component (auth required) |
| `/admin/components` | Admin component review dashboard |
| `/u/[username]` | Public user profile with stats |
| `/profile` | User dashboard (auth required) |
| `/settings` | User settings (auth required) |
| `/login` | Sign in |
| `/signup` | Create account |

## Key Files

```
app/settings/page.tsx              # Settings with Supabase integration
app/claude-code/actions.ts         # Toolkit + submission server actions
app/claude-code/review-actions.ts  # Reviews server actions
app/claude-code/github-sync-actions.ts  # GitHub sync actions
app/admin/components/actions.ts    # Admin moderation actions
app/admin/components/page.tsx      # Admin review dashboard
app/api/webhooks/github-sync/      # GitHub webhook for auto-sync
lib/sync-plugins.ts                # Sync logic from my-gg-plugins repo
lib/export-to-github.ts            # Export approved components to GitHub
lib/avatar.ts                      # DiceBear + OAuth avatar system
lib/userStats.ts                   # User statistics utility functions
lib/supabase/client.ts             # Browser Supabase client
lib/supabase/server.ts             # Server Supabase client
lib/types.ts                       # TypeScript types for DB
components/ThemeProvider.tsx       # Theme context
components/claude-code/            # Marketplace components
components/github-sync/            # GitHub sync components
```

## Documentation

See `/docs` for detailed documentation:
- [Architecture](docs/ARCHITECTURE.md) - Routes, components, file structure
- [Database](docs/DATABASE.md) - Supabase tables, types, queries
- [Theming](docs/THEMING.md) - 10 themes, CSS variables, glass utilities
- [Avatars](docs/AVATARS.md) - DiceBear system, OAuth integration
- [Claude Code Marketplace](docs/CLAUDE_CODE_MARKETPLACE_PLAN.md) - Marketplace architecture and features
- **[Automation Pages Plan](docs/AUTOMATION_PAGES_PLAN.md)** - New direction: AI-automatable pages for TabzChrome

## Automation Pages (New Direction)

Transform ggprompts into a collection of **pages designed for AI browser automation** via TabzChrome MCP tools.

### Concept
Each page has known CSS selectors (`id`, `data-testid`) that Claude can interact with via:
- `tabz_click` - Click buttons, links
- `tabz_fill` - Fill form fields
- `tabz_screenshot` - Verify state

### TabzChrome Reference Files
Before building automation pages, read these from `~/projects/TabzChrome`:

| File | What to Learn |
|------|---------------|
| `backend/public/templates/mcp-test/*.html` | Selector patterns, layout, feedback |
| `.prompts/images/dalle3.prompty` | Workflow format with selectors |
| `.prompts/diagrams/diagrams.prompty` | Multi-step workflows |
| `tabz-mcp-server/MCP_TOOLS.md` | Available MCP tools |
| `docs/API.md` | Spawn/terminal APIs |

### Planned Pages
See [Automation Pages Plan](docs/AUTOMATION_PAGES_PLAN.md) for full details:
- `/automations/dalle3` - Image generation
- `/automations/diagrams` - Diagram creation
- `/automations/research` - Multi-source research
- `/prompt-launcher` - Load & execute any .prompty file
- `/agent-dashboard` - Monitor Claude workers

### For Conductor
Use `nextjs` and `shadcn-ui` skills. Split work across 5 workers per plan.
