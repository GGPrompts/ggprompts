# GGPrompts Monorepo Migration Progress

**Last Updated:** 2025-12-31 (Wave 3 In Progress)
**Coordinator:** Conductor Agent

## Overview

Consolidating 5 Next.js projects into a Turborepo monorepo with shared packages.

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Foundation | ✅ Complete | Monorepo created, audits done |
| 2. Extract Packages | ✅ Complete | themes, ui, config, tabz extracted |
| 3. Migrate Apps | ✅ Complete | All 5 apps migrated |
| 4. Unify | ⚪ Pending | Auth consolidation, preferences sync |

---

## Current State

### Apps (5 total)

| App | Package | Port | Status | Notes |
|-----|---------|------|--------|-------|
| web | @ggprompts/web | 3000 | ✅ Working | Main site, Supabase auth |
| design | @ggprompts/design | 3001 | ✅ Working | Design system |
| kit | @ggprompts/kit | 3002 | ✅ Working | Personal dashboard (local only) |
| styles | @ggprompts/styles | 3003 | ✅ Working | Template gallery |
| useless | @ggprompts/useless | 3007 | ✅ Migrated | E-commerce (Better Auth) |

### Packages (7 total)

| Package | Status | Notes |
|---------|--------|-------|
| @ggprompts/ui | ✅ Complete | 44 shadcn components |
| @ggprompts/themes | ✅ Complete | 9 themes x 2 modes |
| @ggprompts/config | ✅ Complete | Shared ESLint + TypeScript configs |
| @ggprompts/tabz | ✅ Complete | TabzChrome integration hooks |
| @ggprompts/auth | ⚪ Placeholder | Future: shared Supabase auth |
| @ggprompts/db | ⚪ Placeholder | Future: shared Drizzle schemas |

---

## Wave 2 Complete! ✅

### Session Summary (2025-12-31)

**7 major tasks completed:**

1. **Turbo Config Enhancement** (`865c39e`)
   - Added globalDependencies, inputs exclusions, env tracking
   - New typecheck task with caching

2. **CSS Consolidation** (`8b27de6`)
   - Removed duplicate theme CSS from app globals.css
   - Themes now only in @ggprompts/themes

3. **Radix Deps Cleanup** (`03b6cfa`)
   - Removed 23 duplicate Radix packages from all apps
   - **-11,872 lines, 158 files deleted!**

4. **Turborepo Remote Caching** (`26f008a`)
   - CI workflow with TURBO_TOKEN/TURBO_TEAM
   - 60-90% faster CI builds

5. **@ggprompts/config Package** (`7c1a5cb`)
   - Shared ESLint config (eslint/nextjs.js)
   - Shared TypeScript configs (base.json, nextjs.json)
   - All apps now extend from shared configs

6. **@ggprompts/tabz Package** (`51661b5`)
   - useTerminalExtension hook
   - TabzConnectionStatus component
   - Selector utilities for MCP automation

7. **useless-io Migration** (`8b54ac6`)
   - Full e-commerce app: auth, cart, checkout, admin
   - Gamification system, product reviews
   - **+33,831 lines, 199 files**
   - Kept Better Auth (documented difference from Supabase)

---

## Infrastructure

### CI/CD
- **GitHub Actions:** `.github/workflows/ci.yml`
- **Turborepo Remote Cache:** Enabled (add secrets to GitHub)
- **Vercel:** ✅ Configured! See `docs/VERCEL.md` for deployment guide
  - 4 apps linked: web, design, styles, useless
  - kit skipped (local-only)

### Environment Variables

| App | Env File | Required Vars |
|-----|----------|---------------|
| web | apps/web/.env.local | SUPABASE_URL, SUPABASE_ANON_KEY |
| useless | apps/useless/.env | DATABASE_URL, BETTER_AUTH_*, Stripe keys |

---

## Wave 3 Progress

### Completed (2025-12-31)

8. **Vercel Deployments** (`12b5138`)
   - 4 apps linked and configured
   - Per-app vercel.json with turbo build commands
   - `docs/VERCEL.md` deployment guide

9. **Useless App Database** (`a045a4f`)
   - Drizzle migrations for 14 tables
   - Neon PostgreSQL connection configured
   - .env with DATABASE_URL ready

---

## Next Steps

### High Priority
- [x] Configure Vercel deployments for monorepo (multiple apps) ✅
- [x] Set up useless app database (Neon PostgreSQL) ✅
- [ ] Consolidate auth strategy (Supabase vs Better Auth)

### Medium Priority
- [ ] Add tests to CI workflow
- [ ] Extract @ggprompts/auth package (shared Supabase client)
- [ ] Create @ggprompts/db package (shared Drizzle schemas)

### Low Priority
- [ ] Documentation improvements
- [ ] Performance optimization
- [ ] Add more themes to @ggprompts/themes

---

## Key Decisions

1. **Theme System:** 9 color themes x 2 modes (dark/light)
   - Terminal, Amber, Carbon, Ocean, Sunset, Forest, Midnight, Neon, Slate

2. **Auth Strategy:**
   - web/design/styles/kit: Supabase Auth
   - useless: Better Auth (documented, future migration possible)

3. **Local-only Apps:** kit is local-only (TabzChrome, filesystem access)

---

## Quick Reference

- **Repo:** https://github.com/GGPrompts/ggprompts
- **Dev:** `npx next dev -p <port>` from app folder
- **Build:** `pnpm build` from root
- **Beads:** `bd ready` for next tasks
