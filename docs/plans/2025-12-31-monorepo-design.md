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
**Color Themes (9):** Terminal, Amber, Carbon, Ocean, Sunset, Forest, Midnight, Neon, Slate
**Mode Toggle (2):** Dark, Light

Each color theme has both dark and light variants = 18 total combinations.

**Implementation:**
```html
<html data-theme="ocean" data-mode="dark">  <!-- Ocean Dark -->
<html data-theme="ocean" data-mode="light"> <!-- Ocean Light -->
```

**UI Pattern:**
- Theme picker: 9 color swatches to choose palette
- Separate sun/moon toggle for light/dark mode

**Includes:**
- CSS variables for all 18 theme/mode combinations
- Background tones (independent of theme): charcoal, deep-purple, pure-black, ocean, sunset, forest, midnight, neon-dark, slate
- Glassmorphism utilities (.glass, .glass-dark, .glass-overlay)
- Gradient text utilities (.gradient-text-theme)
- Glow effects (.terminal-glow, .border-glow)
- Theme switcher component
- Mode toggle component

**Custom Background Media (app-specific):**
- Supported in: web, kit, styles, useless
- NOT in design app (clean backgrounds for component design)

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

### Two-Axis Design
```
Color Theme (9 options)     Mode (2 options)
├── Terminal                ├── Dark (default)
├── Amber                   └── Light
├── Carbon
├── Ocean
├── Sunset
├── Forest
├── Midnight
├── Neon
└── Slate
```

### CSS Variables (HSL format)
```css
/* Base theme defines the palette */
:root[data-theme="ocean"] {
  --primary: 188 100% 50%;        /* Aqua */
  --secondary: 25 95% 60%;        /* Coral contrast */
  --primary-rgb: 0 212 255;
  /* ... palette colors ... */
}

/* Mode adjusts lightness/darkness */
:root[data-mode="dark"] {
  --background: 210 50% 4%;       /* Deep dark */
  --foreground: 190 80% 95%;      /* Light text */
  --card: 210 45% 12%;
}

:root[data-mode="light"] {
  --background: 210 30% 98%;      /* Light background */
  --foreground: 210 50% 10%;      /* Dark text */
  --card: 0 0% 100%;
}
```

### Data Attributes
- `data-theme` - Color palette (terminal, amber, ocean, etc.)
- `data-mode` - Light/dark mode
- `data-bg-tone` - Background gradient (independent of theme)

### Persistence
- Logged in: Stored in user preferences (DB), synced across apps
- Anonymous: LocalStorage fallback

## TabzChrome Integration

All apps include:
- `data-tabz-*` selectors for MCP navigation
- Terminal spawn buttons where relevant
- "Send to Terminal" for prompts/commands
- "Paste to Terminal" for code snippets

## Migration Plan

### Phase 1: Foundation ✅
- [x] Create monorepo structure
- [x] Migrate ggprompts-next to apps/web
- [x] Audit other 4 projects (see docs/audits/)

### Phase 2: Extract Packages (Current)
- [ ] Extract themes to packages/themes (9 themes × 2 modes)
- [ ] Extract shared UI to packages/ui
- [ ] Extract auth to packages/auth

### Phase 3: Migrate Apps
- [ ] Migrate design2prompt (simplest - no auth, no db, no custom backgrounds)
- [ ] Migrate portfolio-style-guides (no auth, no db, 145 templates)
- [ ] Migrate personal-homepage (Supabase auth, TabzChrome integration)
- [ ] Migrate useless-io (Better Auth → decision needed, Drizzle/Neon)

### Phase 4: Unify
- [ ] Consolidate auth across ggprompts.com subdomains
- [ ] Sync theme preferences across apps (DB for logged in, localStorage for anon)
- [ ] Add TabzChrome integration to design, styles, useless
- [ ] Deploy to subdomains

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4
- **Auth:** Supabase Auth (GitHub OAuth)
- **Database:** Supabase PostgreSQL
- **Components:** shadcn/ui (Radix + Tailwind)
- **Monorepo:** Turborepo + pnpm workspaces
- **Deployment:** Vercel (per-app)

## Audit Summary

| Project | Auth | Database | Themes | TabzChrome |
|---------|------|----------|--------|------------|
| **ggprompts-next** | Supabase | Supabase | 10 (Amber default) | Some |
| **personal-homepage** | Supabase | None (localStorage) | 10 | Extensive |
| **useless-io** | Better Auth | Neon + Drizzle | 10 + modes | None |
| **design2prompt** | None | None (Zustand) | Basic | None |
| **portfolio-style-guides** | None | None (static) | 10 + bg tones | Docs only |

## Open Questions

1. **useless.io auth:** Keep Better Auth separate (different domain) or migrate to Supabase SSO?
2. **Default themes per app:**
   - web: Amber (current)
   - kit: Terminal?
   - design: Carbon (neutral for design work)?
   - styles: Terminal (matches portfolio aesthetic)?
   - useless: Neon (fits the satirical vibe)?
3. **Shared navigation:** Extract to package or keep app-specific?

## Decisions Made

1. ✅ Theme system: 9 color themes × 2 modes (not "light" as a theme)
2. ✅ Custom background media: Supported everywhere except design app
3. ✅ Monorepo structure: Turborepo with apps/ and packages/
