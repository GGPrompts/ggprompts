# Personal Homepage

A personal dashboard/homepage with accordion sidebar navigation. Features weather, feeds, notes, bookmarks, stock trading, tasks, world clocks, and more. Sections can be toggled on/off and reordered via Settings.

## Quick Reference

| Task | Documentation |
|------|---------------|
| Add new section | [docs/navigation.md](docs/navigation.md) |
| Styling/themes | [docs/design-system.md](docs/design-system.md) |
| Authentication | [docs/auth.md](docs/auth.md) |
| State management | [docs/state-management.md](docs/state-management.md) |
| Terminal bookmarks | [docs/terminal-integration.md](docs/terminal-integration.md) |
| TabzChrome integration | [docs/tabz-integration.md](docs/tabz-integration.md) |

## Documentation

| Document | Description |
|----------|-------------|
| [docs/navigation.md](docs/navigation.md) | Sidebar system, adding sections |
| [docs/auth.md](docs/auth.md) | GitHub OAuth via Supabase |
| [docs/weather.md](docs/weather.md) | Weather APIs and features |
| [docs/daily-feed.md](docs/daily-feed.md) | Feed sources and schema |
| [docs/api-playground.md](docs/api-playground.md) | HTTP client features |
| [docs/quick-notes.md](docs/quick-notes.md) | GitHub-synced markdown editor |
| [docs/stocks-dashboard.md](docs/stocks-dashboard.md) | Paper trading, Finnhub/Alpha Vantage |
| [docs/terminal-integration.md](docs/terminal-integration.md) | Chrome extension terminal bookmarks |
| [docs/tabz-integration.md](docs/tabz-integration.md) | TabzChrome API, selectors, automation |
| [docs/design-system.md](docs/design-system.md) | Themes, glassmorphism, backgrounds |
| [docs/state-management.md](docs/state-management.md) | TanStack Query, caching |
| [docs/claude-jobs.md](docs/claude-jobs.md) | Automated Claude prompts across projects |
| [docs/ai-workspace-patterns.md](docs/ai-workspace-patterns.md) | Claude non-interactive mode, streaming, tokens |
| [docs/roadmap.md](docs/roadmap.md) | Planned features |

## Sections

| Section | File | Description |
|---------|------|-------------|
| Home | `app/page.tsx` | Dashboard overview + World Clocks widget |
| Weather | `app/sections/weather.tsx` | Weather + radar + alerts |
| Daily Feed | `app/sections/daily-feed.tsx` | HN, GitHub, Reddit, etc. |
| API Playground | `app/sections/api-playground.tsx` | HTTP request builder |
| Quick Notes | `app/sections/quick-notes.tsx` | Markdown editor (GitHub sync) |
| Bookmarks | `app/sections/bookmarks.tsx` | Links + terminal commands (GitHub sync) |
| Search Hub | `app/sections/search-hub.tsx` | Search + AI chat |
| Paper Trading | `app/sections/stocks-dashboard.tsx` | Stock trading practice |
| Tasks | `app/sections/tasks.tsx` | Quick todo list (localStorage) |
| Jobs | `app/sections/jobs.tsx` | Claude batch prompts + results inbox |
| AI Workspace | `app/sections/ai-workspace.tsx` | Claude Code chat interface |
| Integrations | `app/sections/integrations.tsx` | Connected services status |
| Profile | `app/sections/profile.tsx` | Auth, sync status |
| Settings | `app/page.tsx` (SettingsSection) | Theme, sections, API keys |
| Setup | `app/sections/setup.tsx` | API keys wizard, TabzChrome config |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: TanStack Query + localStorage
- **Auth**: Supabase (GitHub OAuth)
- **APIs**: Open-Meteo, Finnhub, Alpha Vantage, GitHub

## Development

```bash
npm run dev    # http://localhost:3001
npm run build
```

## Key Patterns

### Adding a Section

1. Add to `Section` type in `app/page.tsx`
2. Add to `navigationItems` array
3. Create `app/sections/[name].tsx`
4. Add case to `renderContent()` switch

See [docs/navigation.md](docs/navigation.md) for details.

### Styling

- Use `glass` / `glass-dark` for panels
- Use `terminal-glow` for headings
- See [docs/design-system.md](docs/design-system.md)

### Auth

- `useAuth()` hook from `components/AuthProvider.tsx`
- `getGitHubToken()` for GitHub API calls
- See [docs/auth.md](docs/auth.md)

### Hydration

Add `suppressHydrationWarning` for dynamic time displays.

### Section Preferences

Sections can be hidden/shown and reordered via Settings → Sections:
- `useSectionPreferences` hook in `hooks/useSectionPreferences.ts`
- Preferences stored in localStorage (`section-preferences`)
- Uses `DEFAULT_SECTION_ORDER` during SSR to prevent hydration mismatch
- Pass `prefsLoaded` flag to components that need visibility checks

### TabzChrome Integration

All interactive elements have `data-tabz-*` attributes for MCP automation:
- `data-tabz-section` - Section identity
- `data-tabz-action` - Action type (navigate, submit, refresh, etc.)
- `data-tabz-input` - Input field purpose
- `data-tabz-list` / `data-tabz-item` - List containers and items
- `data-tabz-command` / `data-tabz-project` - Terminal commands

Key hooks:
- `useTerminalExtension()` - Spawn terminals, check connection
- `useTabzBridge()` - Bi-directional messaging with TabzChrome

See [docs/tabz-integration.md](docs/tabz-integration.md) for complete selector reference.
