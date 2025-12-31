# GGPrompts Monorepo

Turborepo monorepo with Next.js apps and shared packages.

## Structure

```
apps/           → Next.js applications (see apps/CLAUDE.md)
packages/       → Shared packages (see packages/CLAUDE.md)
docs/           → Planning docs, progress tracking
```

## Quick Commands

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all apps/packages
pnpm dev              # Dev mode (all apps)
pnpm dev --filter=@ggprompts/web   # Single app
```

## TabzChrome Integration

All apps can integrate with TabzChrome for terminal automation and AI-assisted browsing.

### Spawn Terminals

```bash
# Get auth token
TOKEN=$(cat /tmp/tabz-auth-token)

# Spawn a terminal
curl -X POST http://localhost:8129/api/spawn \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $TOKEN" \
  -d '{"name": "Dev Server", "workingDir": "~/projects/app", "command": "pnpm dev"}'
```

### Data Selectors

Add `data-tabz-*` attributes for MCP automation:

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-tabz-section` | Section identity | `"dashboard"` |
| `data-tabz-action` | Action type | `"submit"`, `"navigate"` |
| `data-tabz-input` | Input field | `"search"`, `"email"` |
| `data-tabz-item` | List item | `"item-0"`, `"task-abc"` |

See `apps/kit/docs/tabz-integration.md` for full selector reference.

## Worktree Guidance

When creating git worktrees for isolated work:

| Working on... | Read these CLAUDE.md files |
|---------------|---------------------------|
| `apps/web` | Root → `apps/CLAUDE.md` → `apps/web/CLAUDE.md` |
| `apps/kit` | Root → `apps/CLAUDE.md` → `apps/kit/CLAUDE.md` |
| `packages/ui` | Root → `packages/CLAUDE.md` |
| Full monorepo | Root + all subdocs |

## Key Docs

| Doc | Purpose |
|-----|---------|
| `docs/PROGRESS.md` | Migration status and next tasks |
| `apps/CLAUDE.md` | App development patterns |
| `packages/CLAUDE.md` | Package development patterns |
| `apps/kit/docs/tabz-integration.md` | Full TabzChrome selector reference |
