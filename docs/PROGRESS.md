# GGPrompts Monorepo Migration Progress

**Last Updated:** 2025-12-31
**Coordinator:** Conductor Agent

## Overview

Consolidating 5 Next.js projects into a Turborepo monorepo with shared packages.

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Foundation | ✅ Complete | Monorepo created, audits done |
| 2. Extract Packages | 🟡 In Progress | Starting with themes |
| 3. Migrate Apps | ⚪ Pending | After packages ready |
| 4. Unify | ⚪ Pending | Auth, preferences sync |

---

## Package Extraction

| Package | Status | Worker | Notes |
|---------|--------|--------|-------|
| @ggprompts/themes | ⚪ Ready to Start | - | 9 themes × 2 modes |
| @ggprompts/ui | ⚪ Pending | - | After themes |
| @ggprompts/auth | ⚪ Pending | - | After app migrations |
| @ggprompts/db | ⚪ Pending | - | After auth |
| @ggprompts/tabz | ⚪ Pending | - | After apps migrated |

---

## App Migrations

| App | Source Repo | Status | Worker | Blockers |
|-----|-------------|--------|--------|----------|
| web | ggprompts-next | ✅ Done | - | Base app |
| design | design2prompt | ⚪ Ready | - | None (no auth/db) |
| styles | portfolio-style-guides | ⚪ Ready | - | None (no auth/db) |
| kit | personal-homepage | ⚪ Pending | - | Needs themes |
| useless | useless-io | ⚪ Pending | - | Auth decision |

---

## Key Decisions

1. **Theme System:** 9 color themes × 2 modes (dark/light toggle)
   - Themes: Terminal, Amber, Carbon, Ocean, Sunset, Forest, Midnight, Neon, Slate
   - `data-theme="ocean" data-mode="dark"`

2. **Custom Backgrounds:** Supported in all apps EXCEPT design (clean bg for components)

3. **Auth Strategy:**
   - ggprompts.com subdomains: Shared Supabase auth
   - useless.io: TBD (keep Better Auth or migrate)

---

## Worker Assignments (Wave 1)

When spawning workers, assign these directories:

| Worker | Directory | Task |
|--------|-----------|------|
| themes-worker | packages/themes/ | Extract CSS theme system from apps/web |
| design-worker | apps/design/ | Copy design2prompt, update imports |
| styles-worker | apps/styles/ | Copy portfolio-style-guides, update imports |

**No overlapping writes** - each worker owns their directory.

---

## Quick Reference

- **Repo:** https://github.com/GGPrompts/ggprompts
- **Design Doc:** docs/plans/2025-12-31-monorepo-design.md
- **Audits:** docs/audits/*.md
- **Source Projects:**
  - ~/projects/ggprompts-next (already in apps/web)
  - ~/projects/design2prompt
  - ~/projects/portfolio-style-guides
  - ~/projects/personal-homepage
  - ~/projects/useless-io
