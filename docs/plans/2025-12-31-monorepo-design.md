# GGPrompts Monorepo Design

**Date:** 2025-12-31
**Status:** In Progress

## Vision

GGPrompts product suite under ggprompts.com with shared authentication, theming, and TabzChrome integration.

## Sites

| App | Domain | Purpose |
|-----|--------|---------|
| **web** | ggprompts.com | Main hub - Claude Code marketplace, news, forums |
| **kit** | kit.ggprompts.com | Personal homepage/kit builder |
| **design** | design.ggprompts.com | Design → prompt tool |
| **styles** | styles.ggprompts.com | Portfolio style guide builder |
| **useless** | useless.io | Fun/comedic "business" site |

## Structure

```
ggprompts/
├── apps/
│   ├── web/          → ggprompts.com (main hub) [MIGRATED]
│   ├── kit/          → kit.ggprompts.com (personal-homepage)
│   ├── design/       → design.ggprompts.com (design2prompt)
│   ├── styles/       → styles.ggprompts.com (portfolio-style-guides)
│   └── useless/      → useless.io (useless-io)
├── packages/
│   ├── themes/       → Unified 11-theme CSS system
│   ├── ui/           → Shared shadcn components
│   ├── auth/         → Shared NextAuth/Supabase auth
│   ├── db/           → Shared database schema/client
│   └── tabz/         → TabzChrome integration helpers
├── turbo.json
└── package.json
```

## Shared Packages

### @ggprompts/themes
- 11 color themes: terminal, amber, carbon, light, ocean, sunset, forest, midnight, neon, slate
- Background tones (independent of theme)
- Glassmorphism utilities (.glass, .glass-dark, .glass-overlay)
- Gradient text utilities (.gradient-text-theme)
- Theme switcher component

### @ggprompts/ui
- Shared shadcn components (button, card, dialog, etc.)
- GlassCard component
- Logo component
- Navigation components

### @ggprompts/auth
- Supabase auth configuration
- GitHub OAuth setup
- Shared auth hooks (useAuth, useUserRole)
- Cookie configuration for subdomain sharing (`.ggprompts.com`)

### @ggprompts/db
- Supabase client configuration
- Shared database types
- User preferences schema (including theme selection)

### @ggprompts/tabz
- TabzChrome detection hook
- Terminal spawn helpers
- MCP selector attributes
- Send-to-terminal utilities

## Authentication Strategy

### Subdomain Cookie Sharing
All ggprompts.com subdomains share authentication:
- Login once at any subdomain
- Cookie set with domain `.ggprompts.com`
- All apps share the same Supabase project

### Separate Domain (useless.io)
- Own auth or "Login with GGPrompts" SSO flow
- Redirect to ggprompts.com for auth, return with token

## Theme System

### CSS Variables (HSL format)
```css
:root {
  --background: 250 30% 4%;
  --foreground: 40 100% 95%;
  --primary: 40 100% 67%;
  --primary-rgb: 255 200 87;  /* For rgba() */
  /* ... */
}

:root[data-theme="terminal"] { /* ... */ }
:root[data-theme="ocean"] { /* ... */ }
```

### Theme Selection
- `data-theme` attribute on `:root`
- `data-bg-tone` for background (independent of theme)
- Stored in user preferences (DB) when logged in
- LocalStorage fallback for anonymous users

## TabzChrome Integration

All apps include:
- `data-tabz-*` selectors for MCP navigation
- Terminal spawn buttons where relevant
- "Send to Terminal" for prompts/commands
- "Paste to Terminal" for code snippets

## Migration Plan

### Phase 1: Foundation (Current)
- [x] Create monorepo structure
- [x] Migrate ggprompts-next to apps/web
- [ ] Audit other 4 projects

### Phase 2: Extract Packages
- [ ] Extract themes to packages/themes
- [ ] Extract shared UI to packages/ui
- [ ] Extract auth to packages/auth

### Phase 3: Migrate Apps
- [ ] Migrate design2prompt (simplest, no auth)
- [ ] Migrate portfolio-style-guides
- [ ] Migrate personal-homepage
- [ ] Migrate useless-io

### Phase 4: Unify
- [ ] Consolidate auth across all apps
- [ ] Sync theme preferences across apps
- [ ] Add TabzChrome integration everywhere
- [ ] Deploy to subdomains

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4
- **Auth:** Supabase Auth (GitHub OAuth)
- **Database:** Supabase PostgreSQL
- **Components:** shadcn/ui (Radix + Tailwind)
- **Monorepo:** Turborepo + pnpm workspaces
- **Deployment:** Vercel (per-app)

## Open Questions

1. Should useless.io have its own auth or use GGPrompts SSO?
2. Which theme should be default for each app?
3. Should we extract a shared layout/navigation package?
