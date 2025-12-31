# GGPrompts Apps

Next.js applications in the monorepo.

## Apps Overview

| App | Package | Port | Purpose | Deployment |
|-----|---------|------|---------|------------|
| web | @ggprompts/web | 3000 | Main hub, marketplace | Vercel |
| design | @ggprompts/design | 3002 | Design → AI prompts | Vercel |
| styles | @ggprompts/styles | 3003 | Style guide builder | Vercel |
| kit | @ggprompts/kit | 3001 | Personal dashboard | **Local only** |

## Development

```bash
# Single app
pnpm dev --filter=@ggprompts/web

# All apps
pnpm dev
```

## Shared Patterns

### Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React Query, localStorage
- **Auth:** Supabase (GitHub OAuth)

### Type Errors

React 19 has compatibility issues with some component libraries (cmdk, vaul, styled-jsx). All apps use `typescript.ignoreBuildErrors: true` in next.config.ts until libraries update.

### Shared Packages

```typescript
// When @ggprompts/ui is ready:
import { Button, Card } from "@ggprompts/ui"

// Theme CSS (import in globals.css):
@import "@ggprompts/themes/base.css";
```

## TabzChrome Integration

### Why TabzChrome?

TabzChrome enables:
- **Terminal spawning** - Launch dev servers, run commands from UI
- **MCP automation** - AI can interact with your app via selectors
- **Browser control** - Screenshots, clicks, form filling

### Adding Selectors

Add `data-tabz-*` attributes to interactive elements:

```tsx
// Section container
<div data-tabz-section="dashboard">

// Action button  
<Button data-tabz-action="submit-form">Submit</Button>

// Input field
<Input data-tabz-input="search-query" />

// List items
<ul data-tabz-list="results">
  {items.map((item, i) => (
    <li key={item.id} data-tabz-item={`result-${i}`}>{item.name}</li>
  ))}
</ul>

// Terminal command trigger
<Button
  data-tabz-action="spawn-terminal"
  data-tabz-command="pnpm dev"
  data-tabz-project="~/projects/my-app"
>
  Start Dev Server
</Button>
```

### Selector Taxonomy

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `data-tabz-section` | Page section identity | `"dashboard"`, `"settings"` |
| `data-tabz-action` | What clicking does | `"submit"`, `"navigate"`, `"spawn-terminal"` |
| `data-tabz-input` | Input field purpose | `"search"`, `"email"`, `"chat-message"` |
| `data-tabz-list` | Container for items | `"results"`, `"tasks"` |
| `data-tabz-item` | Individual list item | `"task-0"`, `"result-abc"` |
| `data-tabz-command` | Terminal command | `"npm run dev"` |
| `data-tabz-project` | Working directory | `"~/projects/app"` |

### Using useTerminalExtension

Copy from `apps/kit/hooks/useTerminalExtension.ts`:

```typescript
import { useTerminalExtension } from "@/hooks/useTerminalExtension"

function MyComponent() {
  const { available, runCommand, error } = useTerminalExtension()
  
  const handleSpawn = async () => {
    if (!available) return
    await runCommand("pnpm dev", {
      workingDir: "~/projects/my-app",
      name: "Dev Server"
    })
  }
  
  return (
    <Button 
      onClick={handleSpawn}
      disabled={!available}
      data-tabz-action="spawn-terminal"
      data-tabz-command="pnpm dev"
    >
      {available ? "Start Dev" : "TabzChrome not connected"}
    </Button>
  )
}
```

### Full Reference

See `apps/kit/docs/tabz-integration.md` for complete selector reference and automation patterns.

## App-Specific Docs

Each app has its own CLAUDE.md:

- `apps/web/CLAUDE.md` - Marketplace, forums, news
- `apps/design/CLAUDE.md` - Component previews, canvas builder
- `apps/styles/CLAUDE.md` - Template gallery, style guides
- `apps/kit/CLAUDE.md` - Dashboard sections, local APIs
