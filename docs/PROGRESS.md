# GGPrompts Monorepo Migration Progress

**Last Updated:** 2025-12-31 (Wave 2 - @ggprompts/ui integrated into all apps)
**Coordinator:** Conductor Agent

## Overview

Consolidating 5 Next.js projects into a Turborepo monorepo with shared packages.

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Foundation | ✅ Complete | Monorepo created, audits done |
| 2. Extract Packages | 🟡 In Progress | @ggprompts/themes + @ggprompts/ui done |
| 3. Migrate Apps | 🟡 In Progress | design + styles + kit done, useless pending |
| 4. Unify | ⚪ Pending | Auth, preferences sync |

## Wave 1 Complete ✅

All 3 branches merged to main:
- `feat/themes-package` → packages/themes/ (16 files, 9 themes × 2 modes)
- `feat/design-app` → apps/design/ (187 files, 70+ components)
- `feat/styles-app` → apps/styles/ (472 files, 145 templates)

Old `GGPrompts` directory archived to `_archive_GGPrompts_2024`.

---

## Package Extraction

| Package | Status | Worker | Notes |
|---------|--------|--------|-------|
| @ggprompts/themes | ✅ Complete | themes-worker | 9 themes × 2 modes, 16 files |
| @ggprompts/ui | ✅ Complete | ui-worker | 44 components, shadcn/ui + custom |
| @ggprompts/auth | ⚪ Pending | - | After app migrations |
| @ggprompts/db | ⚪ Pending | - | After auth |
| @ggprompts/tabz | ⚪ Pending | - | After apps migrated |

---

## App Migrations

| App | Source Repo | Status | Worker | Blockers |
|-----|-------------|--------|--------|----------|
| web | ggprompts-next | ✅ Done | - | Base app |
| design | design2prompt | ✅ Complete | design-worker | 188 files, 43 dirs |
| styles | portfolio-style-guides | ✅ Complete | styles-worker | 474 files, 145 templates |
| kit | personal-homepage | ✅ Complete | manual | 176 files, local-only app |
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

## Wave 2 Progress

### Completed
- ✅ `apps/kit` migrated from personal-homepage (176 files)
  - Local-only app (not for Vercel deployment)
  - TabzChrome integration, local filesystem access
  - 19 sections, 22 API routes
- ✅ `packages/ui` extracted with 44 components
  - Core shadcn: accordion, alert, badge, button, card, dialog, input, etc.
  - Custom: GlassCard, border-trail, glow-effect, animated-background, etc.
  - All apps still building successfully
- ✅ **@ggprompts/ui integrated into all 4 apps**
  - apps/web: 84 files updated
  - apps/design: 15 files updated
  - apps/styles: 111 files updated
  - apps/kit: 38 files updated
  - Local-only components (page-loader, context-menu, etc.) kept as @/components/ui/*

### Next Tasks

| Task | Priority | Notes |
|------|----------|-------|
| Integrate @ggprompts/themes into apps | High | Update design/styles/kit to use shared themes |
| Cleanup unused local UI components | Low | After verifying all imports work |

**Next Step:** Update each app's CSS imports to use `@ggprompts/themes`.

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
