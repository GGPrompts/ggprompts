# Architecture

**design2prompt** - System architecture and design decisions.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Studio     │  │ Collections  │  │    Canvas    │      │
│  │   Browse &   │  │   Manage     │  │  Visual      │      │
│  │  Customize   │  │   Saved      │  │  Layout      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    State Management (Zustand)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Customization │  │  Collection  │  │    Canvas    │      │
│  │    Store     │  │    Store     │  │    Store     │      │
│  │ (session)    │  │ (persist)    │  │  (persist)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Component   │  │  AI Export   │  │   Canvas     │      │
│  │   Registry   │  │  Generators  │  │   Layout     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      Persistence Layer                       │
│                    localStorage / URL                         │
└─────────────────────────────────────────────────────────────┘
```

---

## State Architecture

### Why 3 Separate Stores?

**Performance & Isolation:**
- Components re-render only when their store changes
- Clear separation of concerns
- Easier to test and maintain

### Store Responsibilities

**1. Customization Store** (`lib/stores/customization-store.ts`)
```typescript
{
  selectedComponent: Component | null,
  customization: CustomizationState,
  setComponent: (component) => void,
  updateCustomization: (updates) => void,
}
```
- **Persistence:** sessionStorage (temporary)
- **Purpose:** Current editing session
- **Scope:** Single component being customized

**2. Collection Store** (`lib/stores/collection-store.ts`)
```typescript
{
  collections: Collection[],
  addCollection: (collection) => void,
  updateCollection: (id, updates) => void,
  removeCollection: (id) => void,
  addComponentToCollection: (collectionId, component) => void,
}
```
- **Persistence:** localStorage (permanent)
- **Purpose:** Saved work
- **Scope:** All user collections

**3. Canvas Store** (`lib/stores/canvas-store.ts`)
```typescript
{
  components: CanvasComponent[],
  grid: { size: number, show: boolean, snap: boolean },
  viewport: 'mobile' | 'tablet' | 'desktop',
  addComponent: (component) => void,
  updatePosition: (id, position) => void,
  removeComponent: (id) => void,
}
```
- **Persistence:** localStorage (per-layout)
- **Purpose:** Canvas layout state
- **Scope:** Current canvas arrangement

---

## Component System

### Component Lifecycle

```
1. Definition (component-registry.ts)
   ↓
2. Preview Render (component-previews/)
   ↓
3. Customization (customization-store)
   ↓
4. Save to Collection (collection-store)
   ↓
5. Place on Canvas (canvas-store)
   ↓
6. Export as Prompt (ai-targets/)
```

### Component Registry

Central source of truth for all components:

```typescript
// lib/component-registry.ts
export const componentRegistry: ComponentRegistry = {
  'glass-card': {
    id: 'glass-card',
    name: 'Glassmorphic Card',
    category: 'cards',
    preview: GlassCardPreview,
    defaultCustomization: { ... },
    customizableProps: [
      { key: 'glassOpacity', type: 'slider', min: 5, max: 50 },
      { key: 'blurAmount', type: 'slider', min: 0, max: 24 },
    ],
  },
  // ... 50+ more
}
```

### Preview Components

Each component has a preview that:
- Accepts `CustomizationState` as props
- Renders using Framer Motion
- Shows real-time changes
- Demonstrates interactivity

```typescript
// components/component-previews/cards/GlassCard.tsx
export function GlassCardPreview({
  customization
}: PreviewProps) {
  return (
    <motion.div
      style={{
        backgroundColor: `${customization.primaryColor}15`,
        backdropFilter: `blur(${customization.blurAmount}px)`,
      }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Card content */}
    </motion.div>
  )
}
```

---

## Canvas Architecture

### Drag & Drop (dnd-kit)

**Why dnd-kit over react-dnd:**
- Modern API (React 18+)
- Better performance (no HOCs)
- Built-in modifiers
- Accessibility out of the box

**Key Concepts:**

```typescript
<DndContext
  onDragEnd={handleDragEnd}
  modifiers={[restrictToWindowEdges, snapToGrid]}
  sensors={sensors}
>
  <Droppable id="canvas">
    {components.map(component => (
      <Draggable key={component.id} id={component.id}>
        <ComponentNode component={component} />
      </Draggable>
    ))}
  </Droppable>

  <DragOverlay>
    {activeComponent && <PreviewNode />}
  </DragOverlay>
</DndContext>
```

### Grid System

Snap-to-grid using dnd-kit modifiers:

```typescript
import { createSnapModifier } from '@dnd-kit/modifiers'

const gridSize = 20 // pixels
const snapToGrid = createSnapModifier(gridSize)

// Apply modifier
<DndContext modifiers={grid.snap ? [snapToGrid] : []}>
```

### Layout Engine

Handles component positioning and alignment:

```typescript
// lib/canvas/layout-engine.ts
export function calculatePosition(
  event: DragEndEvent,
  gridSize: number
): Position {
  const { x, y } = event.delta
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  }
}
```

---

## Export System

### AI Target Generators

Each AI has unique prompt requirements:

**Claude (Natural Language):**
```
Create a glassmorphic card component with:
- Background: rgba(16, 185, 129, 0.15)
- Backdrop blur: 12px
- Border: 1px solid rgba(16, 185, 129, 0.4)
...
```

**GPT-4 (Structured):**
```json
{
  "component": "card",
  "variant": "glassmorphic",
  "props": {
    "background": "rgba(16, 185, 129, 0.15)",
    "blur": "12px"
  }
}
```

**Cursor (Code-first):**
```tsx
<Card className="backdrop-blur-md bg-emerald-500/15 border-emerald-500/40">
```

### Generator Architecture

```typescript
// lib/ai-targets/base.ts
export abstract class AITargetGenerator {
  abstract generatePrompt(
    component: Component,
    customization: Customization
  ): string

  abstract generateCollection(
    collection: Collection
  ): string
}

// lib/ai-targets/claude.ts
export class ClaudeGenerator extends AITargetGenerator {
  generatePrompt(component, customization) {
    return `Create a ${component.name} with:
${this.formatCustomization(customization)}
...`
  }
}
```

---

## Data Flow

### Component Customization Flow

```
1. User selects component
   → CustomizationStore.setComponent()

2. User adjusts slider
   → CustomizationStore.updateCustomization()

3. Preview re-renders
   → ComponentPreview receives new props

4. User saves to collection
   → CollectionStore.addComponent()
   → localStorage auto-updated by Zustand persist
```

### Canvas Flow

```
1. User drags component from library
   → dnd-kit onDragStart

2. User moves over canvas
   → dnd-kit modifiers apply (snap to grid)

3. User drops component
   → dnd-kit onDragEnd
   → CanvasStore.addComponent()
   → localStorage auto-updated

4. Canvas re-renders
   → Components in new positions
```

---

## Performance Optimizations

### Code Splitting

```typescript
// Lazy load heavy components
const Canvas = dynamic(
  () => import('@/components/canvas/CanvasView'),
  {
    loading: () => <Skeleton />,
    ssr: false, // Canvas only on client
  }
)
```

### Zustand Selectors

```typescript
// ✅ Good - Only re-renders when collections change
const collections = useCollectionStore(state => state.collections)

// ❌ Bad - Re-renders on any store change
const store = useCollectionStore()
```

### Component Virtualization

For large component libraries:

```typescript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={components.length}
  itemSize={80}
>
  {({ index, style }) => (
    <ComponentRow
      component={components[index]}
      style={style}
    />
  )}
</FixedSizeList>
```

---

## Security Considerations

### XSS Prevention

- All user input sanitized
- Color values validated (hex/rgb only)
- No `dangerouslySetInnerHTML`
- CSP headers configured

### localStorage Safety

- Data validation on hydration
- Schema versioning
- Migration functions for breaking changes

```typescript
persist(
  (set) => ({ /* store */ }),
  {
    version: 1,
    migrate: (persisted, version) => {
      if (version === 0) {
        // Handle old schema
        return migrateV0ToV1(persisted)
      }
      return persisted
    },
  }
)
```

---

## Testing Strategy

### Unit Tests
- Component previews (render + props)
- Store actions (Zustand)
- Generators (AI export)
- Utilities (helpers)

### Integration Tests
- Store persistence
- Canvas drag & drop
- Collection CRUD
- Export flow

### E2E Tests
- Complete user flows
- Multi-step workflows
- Cross-browser compatibility

---

## Deployment

### Build Process

```bash
npm run build        # Next.js production build
npm run start        # Start production server
```

### Environment Variables

```bash
# Not needed initially - all client-side
# Future: API keys for cloud features
```

### Vercel Deployment

```bash
vercel --prod
```

Automatic:
- Server Components rendered on edge
- Static assets CDN-cached
- Incremental Static Regeneration
- Zero-config deployment

---

## Future Architecture Considerations

### Cloud Storage
- Supabase for collections
- Real-time sync across devices
- User authentication

### API Layer
- RESTful API for collections
- Webhooks for integrations
- Rate limiting

### Caching Strategy
- Redis for session storage
- CDN for static assets
- Browser caching for collections

---

Last Updated: 2025-11-29
