# design2prompt - Tech Stack Decision

**Research Date:** 2025-11-29
**Context7 MCP Research:** ✅ Completed

## Final Tech Stack

### Core Framework
- **Next.js 16.0.3** (Latest stable, Trust Score: 10/10)
  - App Router with Server Components
  - Async data fetching
  - Built-in SEO + metadata API
  - TypeScript native

### Drag & Drop
- **@dnd-kit** (Trust Score: 9.3/10) ✅ **WINNER**
  - `@dnd-kit/core` - Core drag & drop
  - `@dnd-kit/sortable` - Sortable lists
  - `@dnd-kit/modifiers` - Snap to grid, constraints

**Why NOT react-dnd:**
- Lower trust score (8.3/10)
- Older HOC-based architecture
- Less performant
- Not as actively maintained

**dnd-kit Advantages:**
- Modern React 18+ design
- Better performance (no HOCs)
- Built-in accessibility
- Modular architecture
- Active development

### State Management
- **Zustand 5.0.8** (Trust Score: 9.6/10) ✅ **PERFECT**

**Why Zustand:**
- Smallest bundle (~1KB vs Redux ~15KB)
- **Built-in persistence middleware** (critical for us!)
- Zero boilerplate
- TypeScript-first
- DevTools support included
- No provider wrapper needed

**Built-in Persistence:**
```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({ collections: [] }),
    {
      name: 'design2prompt-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ collections: state.collections }),
    }
  )
)
```

### Animation
- **Framer Motion 11** (Keep existing)
  - Hardware-accelerated
  - Works great with dnd-kit
  - Component animations
  - Layout animations

### UI Components
- **shadcn/ui** via MCP (Keep existing)
  - Radix UI primitives
  - Tailwind-based
  - Copy-paste ownership
  - 40+ components available

### Styling
- **Tailwind CSS 3.4** (Stable, not v4 beta)
  - Native backdrop-blur
  - JIT compilation
  - Glassmorphism utilities

## Package Versions

```json
{
  "dependencies": {
    "next": "^16.0.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",

    "zustand": "^5.0.8",

    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/modifiers": "^7.0.0",

    "framer-motion": "^11.0.0",

    "@radix-ui/react-slot": "latest",
    "@radix-ui/react-separator": "latest",
    "@radix-ui/react-scroll-area": "latest",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-tooltip": "latest",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-slider": "latest",
    "@radix-ui/react-switch": "latest",
    "@radix-ui/react-radio-group": "latest",

    "tailwindcss": "^3.4.0",
    "tailwind-merge": "^2.2.0",
    "clsx": "^2.1.0",
    "class-variance-authority": "^0.7.0",

    "lucide-react": "latest",
    "sonner": "latest"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^16.0.3",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Architecture Decisions

### 1. State Organization

**3 Separate Zustand Stores:**

```typescript
// stores/customization-store.ts
export const useCustomizationStore = create<CustomizationStore>()(
  devtools((set) => ({
    selectedComponent: null,
    customization: defaultCustomization,
    setComponent: (component) => set({ selectedComponent: component }),
    updateCustomization: (updates) =>
      set(state => ({
        customization: { ...state.customization, ...updates }
      })),
  }), { name: 'CustomizationStore' })
)

// stores/collection-store.ts
export const useCollectionStore = create<CollectionStore>()(
  devtools(
    persist(
      (set, get) => ({
        collections: [],
        addCollection: (collection) =>
          set(state => ({
            collections: [...state.collections, collection]
          })),
        removeCollection: (id) =>
          set(state => ({
            collections: state.collections.filter(c => c.id !== id)
          })),
      }),
      {
        name: 'design2prompt-collections',
        partialize: (state) => ({ collections: state.collections }),
      }
    ),
    { name: 'CollectionStore' }
  )
)

// stores/canvas-store.ts
export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set) => ({
      components: [],
      grid: { size: 20, show: true, snap: true },
      viewport: 'desktop',
      addComponent: (component) =>
        set(state => ({
          components: [...state.components, component]
        })),
      updateComponentPosition: (id, position) =>
        set(state => ({
          components: state.components.map(c =>
            c.id === id ? { ...c, position } : c
          )
        })),
    }),
    { name: 'design2prompt-canvas' }
  )
)
```

### 2. Canvas Implementation

**dnd-kit with Custom Layout Engine:**

```typescript
// components/canvas/CanvasView.tsx
'use client'

import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { createSnapModifier } from '@dnd-kit/modifiers'

export function CanvasView() {
  const { components, grid, updateComponentPosition } = useCanvasStore()
  const snapToGrid = createSnapModifier(grid.size)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    updateComponentPosition(active.id, {
      x: delta.x,
      y: delta.y
    })
  }

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={grid.snap ? [restrictToWindowEdges, snapToGrid] : [restrictToWindowEdges]}
    >
      {components.map(component => (
        <ComponentNode key={component.id} component={component} />
      ))}
      <DragOverlay>{/* Preview */}</DragOverlay>
    </DndContext>
  )
}
```

### 3. Persistence Strategy

**Zustand persist middleware handles everything:**

| Data | Storage | Auto-Save | Rehydrate |
|------|---------|-----------|-----------|
| Collections | localStorage | ✅ | On mount |
| Canvas layouts | localStorage | ✅ | On mount |
| Current customization | sessionStorage | ✅ | Temp |
| Shared collections | URL params | Manual | On load |

**Migration Support:**
```typescript
persist(
  (set) => ({ /* store */ }),
  {
    name: 'collections',
    version: 1,
    migrate: (persistedState, version) => {
      if (version === 0) {
        // Handle old schema
        return { /* new schema */ }
      }
      return persistedState
    },
  }
)
```

## Key Implementation Patterns

### Next.js App Router Best Practices

**From Context7 Research:**

1. **Server Components by default:**
```typescript
// app/studio/page.tsx (Server Component)
export default async function StudioPage() {
  // Can do server-side data fetching here
  return <ClientStudio />
}
```

2. **Client Components only when needed:**
```typescript
// components/studio/ComponentLibrary.tsx
'use client' // Only mark interactive components

import { useCustomizationStore } from '@/stores/customization-store'
```

3. **Metadata API for SEO:**
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'design2prompt - Visual Component Builder',
  description: 'Generate perfect AI prompts from visual designs',
}
```

### dnd-kit Best Practices

**From Context7 Research:**

1. **Modifiers for constraints:**
```typescript
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
  createSnapModifier
} from '@dnd-kit/modifiers'

const gridSize = 20
const snapToGrid = createSnapModifier(gridSize)

<DndContext modifiers={[restrictToWindowEdges, snapToGrid]}>
```

2. **Sortable lists for component library:**
```typescript
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

<SortableContext items={components} strategy={verticalListSortingStrategy}>
  {components.map(component => (
    <SortableComponent key={component.id} component={component} />
  ))}
</SortableContext>
```

### Zustand Best Practices

**From Context7 Research:**

1. **Split stores by domain:**
```typescript
// ✅ Good - Separate concerns
const useCustomizationStore = create(...)
const useCollectionStore = create(...)
const useCanvasStore = create(...)

// ❌ Bad - One giant store
const useAppStore = create(...)
```

2. **Use persist middleware:**
```typescript
// ✅ Built-in persistence
persist(
  (set) => ({ data: [] }),
  {
    name: 'storage-key',
    partialize: (state) => ({ data: state.data }), // Only save what's needed
  }
)
```

3. **DevTools for debugging:**
```typescript
devtools(
  persist(...),
  { name: 'StoreName' }
)
```

## Performance Optimizations

### 1. Code Splitting

```typescript
// Lazy load heavy components
const Canvas = dynamic(() => import('@/components/canvas/CanvasView'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Canvas only on client
})
```

### 2. Zustand Selectors

```typescript
// ✅ Good - Only re-render when collections change
const collections = useCollectionStore(state => state.collections)

// ❌ Bad - Re-renders on any store change
const store = useCollectionStore()
const collections = store.collections
```

### 3. dnd-kit Virtualization

For large component libraries:
```typescript
// Use react-window with dnd-kit
import { FixedSizeList } from 'react-window'
```

## Why This Stack Beats Alternatives

### vs React-DnD
| Feature | dnd-kit | react-dnd |
|---------|---------|-----------|
| Trust Score | 9.3/10 | 8.3/10 |
| Performance | Excellent | Good |
| TypeScript | Native | Added |
| Modifiers | Built-in | Manual |
| Accessibility | Built-in | Manual |

### vs Redux/Context
| Feature | Zustand | Redux | Context |
|---------|---------|-------|---------|
| Bundle Size | 1KB | 15KB | 0KB |
| Boilerplate | None | High | Medium |
| Persistence | Built-in | Manual | Manual |
| DevTools | Built-in | Built-in | None |
| TypeScript | Native | Good | Manual |

### vs Tailwind v4
| Feature | v3 (Stable) | v4 (Beta) |
|---------|-------------|-----------|
| Production Ready | ✅ | ⚠️ Beta |
| Plugin Support | Full | Limited |
| Breaking Changes | None | Many |

## Migration from portfolio-style-guides

### Easy Migrations
1. **Framer Motion** - Already using ✅
2. **shadcn/ui** - Already using ✅
3. **Tailwind** - Already using ✅

### New Additions
1. **dnd-kit** - New (replace any drag logic)
2. **Zustand** - New (replace useState/Context)

### Code to Extract
```typescript
// From: portfolio-style-guides/app/templates/claude-component-studio/page.tsx
// Extract:
- Component registry (componentLibrary object)
- ComponentPreview component
- Customization logic
- Color presets

// Refactor to:
- lib/component-registry.ts
- components/component-previews/
- stores/customization-store.ts
- config/presets.config.ts
```

## Next Steps

1. ✅ Tech stack decided
2. ⬜ Initialize Next.js 16 project
3. ⬜ Install dependencies
4. ⬜ Setup Zustand stores
5. ⬜ Extract components from portfolio
6. ⬜ Implement dnd-kit canvas
7. ⬜ Test persistence

---

**Research Sources:**
- Next.js: /vercel/next.js/v16.0.3 (Trust: 10/10)
- dnd-kit: /clauderic/dnd-kit (Trust: 9.3/10)
- Zustand: /pmndrs/zustand/v5.0.8 (Trust: 9.6/10)

**Last Updated:** 2025-11-29
