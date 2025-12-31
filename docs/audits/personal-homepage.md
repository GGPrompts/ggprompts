# Personal Homepage - Monorepo Migration Audit

**Source:** `~/projects/personal-homepage`
**Audit Date:** 2025-12-31
**Target:** GGPrompts Monorepo

---

## 1. Package.json

### Framework & Runtime
| Package | Version | Notes |
|---------|---------|-------|
| Next.js | ^16.0.7 | Latest major version |
| React | ^19.2.0 | React 19 |
| React DOM | ^19.2.0 | React 19 |
| TypeScript | ^5.9.3 | Latest |

### Scripts
```json
{
  "dev": "next dev -p 3001",
  "build": "next build",
  "start": "next start -p 3001",
  "lint": "next lint"
}
```

### Key Dependencies
| Category | Packages |
|----------|----------|
| **UI/Components** | @radix-ui/* (16 packages), lucide-react, cmdk, vaul, embla-carousel-react |
| **State/Data** | @tanstack/react-query, @tanstack/react-table |
| **Auth/Backend** | @supabase/ssr, @supabase/supabase-js |
| **Animation** | framer-motion, motion |
| **Styling** | tailwindcss ^3.4.18, tailwind-merge, class-variance-authority, clsx |
| **Date/Charts** | date-fns, recharts, react-day-picker |
| **DnD** | @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities |
| **Theming** | next-themes |
| **Notifications** | sonner |

### Dev Dependencies
- autoprefixer ^10.4.22
- postcss ^8.5.6
- tailwindcss ^3.4.18

---

## 2. Authentication

### System: Supabase OAuth
- **File:** `components/AuthProvider.tsx`
- **Library:** `@supabase/ssr` + `@supabase/supabase-js`

### OAuth Providers
- GitHub (with `repo` scope for API access)
- Google (configured but scope not specified)

### Key Implementation Details
- `AuthProvider` React context wrapper
- `useAuth()` hook exports: `user`, `session`, `loading`, `isConfigured`, `signInWithProvider`, `signOut`, `getGitHubToken`
- GitHub provider token stored in localStorage (`github-provider-token`) since Supabase doesn't persist `provider_token`
- Auth callback route: `/auth/callback`
- Gracefully handles unconfigured Supabase (disables auth features)

### Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 3. Database

### System: None (Supabase Auth Only)
- Uses Supabase **only for authentication**, not as a database
- No Prisma, Drizzle, or other ORM
- No database schema files

### Data Storage
| Data Type | Storage Method |
|-----------|----------------|
| User preferences | localStorage |
| Section order | localStorage |
| API tokens | localStorage |
| Notes/Bookmarks | GitHub API (synced to gists/repos) |
| Trades/Stocks | localStorage |

---

## 4. Theming

### System: CSS Variables + next-themes + data-attributes

### Theme Files
- `app/globals.css` - All theme definitions

### Available Themes (10 total)
| Theme | Primary Color | Background |
|-------|--------------|------------|
| Terminal (default) | Emerald/Cyan | Dark slate |
| Amber | Gold/Orange | Purple-blue |
| Carbon | White/Gray | Pure black |
| Light | Blue | Off-white |
| Ocean | Aqua/Turquoise | Deep blue |
| Sunset | Orange/Pink | Purple |
| Forest | Lime/Green | Dark green |
| Midnight | Magenta/Fuchsia | Indigo |
| Neon | Hot pink/Cyan | Near-black |
| Slate | Sky blue | Blue-gray |

### Theme Implementation
- Uses `data-theme` attribute on `:root`
- CSS custom properties for all colors: `--background`, `--foreground`, `--primary`, `--card`, etc.
- RGB variables for glow effects: `--primary-rgb`, `--secondary-rgb`
- Glassmorphism classes: `.glass`, `.glass-dark`, `.glass-overlay`
- Glow effects: `.terminal-glow`, `.border-glow`
- Gradient utilities: `.gradient-text-theme`, `.animate-gradient`

### Background Tones
Separate from themes, uses `data-bg-tone` attribute:
- charcoal, deep-purple, pure-black, light, ocean, sunset, forest, midnight, neon-dark, slate

### Key CSS Classes
```css
.glass          /* Glassmorphism with blur */
.glass-dark     /* Darker glass variant */
.glass-overlay  /* High-opacity for readability */
.terminal-glow  /* Text glow effect */
.border-glow    /* Box shadow glow */
.gradient-text-theme  /* Theme-aware gradient text */
```

---

## 5. shadcn/ui Components (45 total)

### Standard Components
accordion, alert, alert-dialog, avatar, badge, button, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, hover-card, input, label, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

### Custom Extensions
- `GlassCard.tsx` - Theme-aware glass card
- `kbd.tsx` - Keyboard shortcut display
- `spinner.tsx` - Loading spinner
- `animated-background.tsx` - Animated background
- `border-trail.tsx` - Border trail effect
- `glow-effect.tsx` - Glow effect wrapper
- `scroll-progress.tsx` - Scroll progress indicator
- `text-morph.tsx` - Text morphing animation

---

## 6. TabzChrome Integration

### Status: Extensive Integration

### Hooks
| Hook | File | Purpose |
|------|------|---------|
| `useTerminalExtension` | `hooks/useTerminalExtension.ts` | Spawn terminals, run commands, check connection |
| `useTabzBridge` | `hooks/useTabzBridge.ts` | Bi-directional messaging |

### API Configuration
- Base URL: `http://localhost:8129`
- Auth: Token-based (`X-Auth-Token` header)
- Endpoints used: `/api/health`, `/api/auth/token`, `/api/spawn`

### Data Attributes (16 files use `data-tabz-*`)
```
data-tabz-section   - Section identity
data-tabz-action    - Action type (navigate, submit, refresh, etc.)
data-tabz-input     - Input field purpose
data-tabz-list      - List containers
data-tabz-item      - List items
data-tabz-command   - Terminal commands
data-tabz-project   - Project identifiers
```

### Sections with TabzChrome Integration
- ai-workspace, projects-dashboard, bookmarks, setup, weather, daily-feed, stocks-dashboard, tasks, api-playground, quick-notes

### Components
- `TabzConnectionStatus.tsx` - Connection status indicator

---

## 7. Key Files & Routes

### Pages
| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Main dashboard with accordion sidebar |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | Project detail page |
| `/auth/callback` | `app/auth/callback/route.ts` | OAuth callback handler |

### Sections (19 total)
| Section | File |
|---------|------|
| AI Workspace | `app/sections/ai-workspace.tsx` |
| API Playground | `app/sections/api-playground.tsx` |
| Bookmarks | `app/sections/bookmarks.tsx` |
| Crypto Dashboard | `app/sections/crypto-dashboard.tsx` |
| Daily Feed | `app/sections/daily-feed.tsx` |
| Disasters Monitor | `app/sections/disasters-monitor.tsx` |
| GitHub Activity | `app/sections/github-activity.tsx` |
| Integrations | `app/sections/integrations.tsx` |
| Jobs | `app/sections/jobs.tsx` |
| Market Pulse | `app/sections/market-pulse.tsx` |
| Profile | `app/sections/profile.tsx` |
| Projects Dashboard | `app/sections/projects-dashboard.tsx` |
| Quick Notes | `app/sections/quick-notes.tsx` |
| Search Hub | `app/sections/search-hub.tsx` |
| Setup | `app/sections/setup.tsx` |
| SpaceX Tracker | `app/sections/spacex-tracker.tsx` |
| Stocks Dashboard | `app/sections/stocks-dashboard.tsx` |
| Tasks | `app/sections/tasks.tsx` |
| Weather | `app/sections/weather.tsx` |

### API Routes (18 total)
| Route | Purpose |
|-------|---------|
| `/api/ai/agents` | AI agents |
| `/api/ai/chat` | AI chat endpoint |
| `/api/ai/conversations` | Conversation storage |
| `/api/ai/models` | Available models |
| `/api/bls` | Bureau of Labor Statistics data |
| `/api/feed` | Daily feed aggregation |
| `/api/git` | Git operations |
| `/api/github/defaults` | GitHub defaults |
| `/api/jobs` | Job management |
| `/api/jobs/run` | Job execution |
| `/api/projects/github` | GitHub projects |
| `/api/projects/local` | Local projects |
| `/api/projects/meta` | Project metadata |
| `/api/quicknotes` | Quick notes CRUD |
| `/api/status` | System status |
| `/api/stocks` | Stock data |
| `/api/stocks/history` | Stock history |
| `/api/stocks/search` | Stock search |

---

## Migration Notes

### Compatibility Considerations
1. **Next.js 16** - Very recent, check monorepo Next.js version
2. **React 19** - Latest major, ensure monorepo compatibility
3. **Tailwind 3.x** - Standard, should work
4. **Supabase Auth** - Consider consolidating with monorepo auth if different

### Shared Potential
- Theme system (CSS variables) could be extracted to shared package
- shadcn/ui components already standard
- TabzChrome hooks could be shared across apps

### Migration Blocklist
- GitHub token storage in localStorage (security review needed)
- TabzChrome localhost API assumptions
- Heavy reliance on localStorage for state

### Recommended Steps
1. Extract theme variables to shared package
2. Standardize auth approach with monorepo
3. Keep TabzChrome integration app-specific initially
4. Move shadcn/ui components to shared if not already present
