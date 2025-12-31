# design2prompt - Claude Context

**Visual component builder → Perfect AI prompts**

## What This Is

A visual tool that helps developers:
1. Browse UI components (cards, buttons, forms, etc.)
2. Customize them in real-time (colors, effects, spacing)
3. Save to collections for projects
4. Arrange on canvas to see full layouts
5. Export as optimized prompts for any AI (Claude, GPT, Cursor, etc.)

**Think:** Figma meets AI prompting - learn component terminology while building.

## Quick Start

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
```

## Project Structure

```
app/                 # Next.js App Router
  studio/           # Component browser
  collections/      # Saved collections
  canvas/           # Visual layout builder

components/
  studio/           # Browse & customize UI
  component-previews/  # 70+ component renders
  collections/      # Collection management
  canvas/          # Drag & drop canvas

lib/
  stores/          # Zustand state (3 stores)
  component-registry.ts  # All components metadata

types/             # TypeScript definitions
config/            # Presets & configs
```

## Tech Stack

- **Next.js 16** - App Router, Server Components
- **Zustand 5** - State with built-in persistence
- **dnd-kit** - Modern drag & drop for canvas
- **Framer Motion** - Animations
- **shadcn/ui** - UI component library

## State Management (Zustand)

**3 separate stores:**

1. **Customization Store** - Current component being edited (session)
2. **Collection Store** - Saved components (localStorage persist)
3. **Canvas Store** - Layout positions (localStorage persist)

All use `zustand/middleware/persist` for auto-save.

## Key Features

### 1. Component Browser
- 70+ customizable components
- Search/filter by category
- Real-time preview with live customization

### 2. Collections
- Save customized components
- Organize by project/theme
- Export all at once or individually

### 3. Canvas Mode
- Drag & drop components
- Snap to grid (dnd-kit modifiers)
- See full page layouts
- Export as layout prompt

### 4. Multi-AI Export
- Claude (natural language, detailed)
- GPT-4 (structured, code blocks)
- Cursor (inline snippets)
- Windsurf, Codeium, Copilot formats

## Development Guidelines

**Server vs Client Components:**
```typescript
// Default: Server Component (fast, SEO)
export default async function Page() {
  return <ClientComponent />
}

// Client only when needed
'use client'
import { useState } from 'react'
```

**Zustand Store Pattern:**
```typescript
const useStore = create<StoreType>()(
  persist(
    (set, get) => ({
      data: [],
      addItem: (item) => set(state => ({
        data: [...state.data, item]
      })),
    }),
    { name: 'store-key' }
  )
)
```

**dnd-kit Canvas:**
```typescript
import { DndContext } from '@dnd-kit/core'
import { createSnapModifier } from '@dnd-kit/modifiers'

const snapToGrid = createSnapModifier(20)

<DndContext modifiers={[snapToGrid]}>
  {/* draggable components */}
</DndContext>
```

## Files to Know

- `PLAN.md` - Full roadmap and phases
- `TECH_STACK.md` - Research and decisions
- `CHANGELOG.md` - Completed features
- `BACKLOG.md` - Future ideas
- `docs/` - Detailed documentation

## Common Tasks

**Add new component:**
1. Create preview in `components/component-previews/`
2. Add metadata to `lib/component-registry.ts` (customizableProps + defaultCustomization)
3. Add UI controls in `components/studio/CustomizationPanel.tsx` (ComponentSpecificOptions function)

**Add AI export format:**
1. Create generator in `lib/ai-targets/`
2. Add config to `config/ai-targets.config.ts`
3. Update export menu

## Important Notes

- Use App Router (not Pages Router)
- Keep Server Components default
- Zustand auto-persists to localStorage
- dnd-kit for all drag & drop (not react-dnd)
- Follow exact versions from TECH_STACK.md

## Next Steps

See `PLAN.md` for current phase and roadmap.
