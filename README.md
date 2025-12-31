# GGPrompts Monorepo

Turborepo monorepo for the GGPrompts product suite.

## Apps

| App | Description | Domain |
|-----|-------------|--------|
| `apps/web` | Main hub - Claude Code marketplace, news, forums | ggprompts.com |
| `apps/design` | Design → AI prompt generator | design.ggprompts.com |
| `apps/styles` | Portfolio style guide builder (145 templates) | styles.ggprompts.com |
| `apps/kit` | Personal dashboard (local-only) | localhost:3001 |

## Packages

| Package | Description |
|---------|-------------|
| `packages/themes` | 9 color themes × 2 modes (dark/light) |
| `packages/ui` | Shared shadcn/ui components (coming soon) |
| `packages/auth` | Shared Supabase auth (coming soon) |
| `packages/db` | Shared database schema (coming soon) |
| `packages/tabz` | TabzChrome integration helpers (coming soon) |

## Development

```bash
# Install dependencies
pnpm install

# Build all apps
pnpm build

# Dev mode (all apps)
pnpm dev

# Dev single app
pnpm dev --filter=@ggprompts/web
```

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix + Tailwind)
- **Monorepo:** Turborepo + pnpm workspaces
- **Auth:** Supabase (GitHub OAuth)
- **Deployment:** Vercel

## CI & Remote Caching

This repo uses Turborepo remote caching in CI for 60-90% faster builds.

### Setup (one-time)

1. **Get a Turbo token:**
   ```bash
   npx turbo login
   npx turbo link
   ```

2. **Add GitHub secrets** (Settings → Secrets → Actions):
   - `TURBO_TOKEN`: Your Vercel/Turbo access token
   - `TURBO_TEAM`: Your team slug (from `turbo link`)

That's it! CI will now share cached artifacts across runs.

### Local caching

Local builds cache automatically in `node_modules/.cache/turbo`. No setup needed.

## Progress

See [docs/PROGRESS.md](docs/PROGRESS.md) for migration status.
