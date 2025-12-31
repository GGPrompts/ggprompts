# GGPrompts Packages

Shared packages used across apps.

## Packages Overview

| Package | Status | Purpose |
|---------|--------|---------|
| @ggprompts/themes | ✅ Ready | 9 color themes × 2 modes |
| @ggprompts/ui | 🚧 Pending | Shared shadcn/ui components |
| @ggprompts/auth | ⚪ Planned | Supabase auth helpers |
| @ggprompts/db | ⚪ Planned | Database schema/queries |
| @ggprompts/tabz | ⚪ Planned | TabzChrome integration helpers |

## Development

```bash
# Build all packages
pnpm build --filter="./packages/*"

# Build specific package
pnpm build --filter=@ggprompts/themes
```

## Package Structure

```
packages/
├── themes/
│   ├── package.json      # @ggprompts/themes
│   ├── src/
│   │   ├── base.css      # CSS variables, utilities
│   │   ├── themes/       # Individual theme files
│   │   └── index.ts      # Exports
│   └── CLAUDE.md
├── ui/
│   ├── package.json      # @ggprompts/ui
│   ├── src/
│   │   ├── components/   # shadcn/ui components
│   │   └── index.ts
│   └── CLAUDE.md
└── ...
```

## Creating a New Package

1. Create directory: `packages/my-package/`
2. Add `package.json`:
   ```json
   {
     "name": "@ggprompts/my-package",
     "version": "0.1.0",
     "private": true,
     "main": "./src/index.ts",
     "types": "./src/index.ts"
   }
   ```
3. Add to consuming app's package.json:
   ```json
   "dependencies": {
     "@ggprompts/my-package": "workspace:*"
   }
   ```
4. Run `pnpm install` from root

## @ggprompts/themes

### Usage

```css
/* In app's globals.css */
@import "@ggprompts/themes/base.css";
```

```tsx
// Theme switcher
<html data-theme="ocean" data-mode="dark">
```

### Available Themes

Terminal, Amber, Carbon, Ocean, Sunset, Forest, Midnight, Neon, Slate

Each has dark/light modes via `data-mode="dark"` or `data-mode="light"`.

## @ggprompts/ui (Planned)

### Purpose

Shared shadcn/ui components to avoid duplication across apps.

### Components to Include

Button, Card, Dialog, Input, Select, Tabs, Badge, Avatar, Dropdown, Sheet, Toast, etc.

### Usage (Once Ready)

```tsx
import { Button, Card, Input } from "@ggprompts/ui"
```

## @ggprompts/tabz (Planned)

### Purpose

Shared TabzChrome integration helpers:
- `useTerminalExtension` hook
- `TabzConnectionStatus` component
- Selector utilities

### Usage (Once Ready)

```tsx
import { useTerminalExtension, TabzConnectionStatus } from "@ggprompts/tabz"
```

## Package Dependencies

Packages can depend on each other:

```
@ggprompts/ui
  └── @ggprompts/themes (for CSS variables)

@ggprompts/tabz
  └── @ggprompts/ui (for TabzConnectionStatus component)
```

Turborepo handles build order automatically via `dependsOn: ["^build"]`.
