# design2prompt - Project Plan

**Visual Component Builder → Perfect AI Prompts**

## Vision

A visual design system builder that helps developers learn component terminology, customize designs in real-time, and generate perfect prompts for any AI coding assistant. Think Figma meets AI prompting.

### The Problem We Solve

**Before:**
- Developers don't know what to call UI patterns ("that card with the blur thing")
- Endless back-and-forth with AI to get designs right
- No way to visualize before building
- Prompts lack specific design parameters

**After:**
- Browse visual component library with real names
- Customize in real-time, see exactly what you're building
- Save components to collections for projects
- Arrange on canvas to see full layouts
- Export perfect prompts for Claude, GPT, Cursor, or any AI

## Target Users

1. **Visual Learners** - Need to see components to understand them
2. **Design-First Developers** - Want to plan UI before coding
3. **AI Power Users** - Want to maximize AI coding productivity
4. **Design System Builders** - Creating consistent component libraries

## Core Features

### 1. Component Browser (Phase 1)
Visual library of 50+ customizable components across categories:
- Cards (glassmorphic, 3D, neon, gradient)
- Buttons (gradient, neumorphic, particle effects)
- Forms (animated, multi-step, validation)
- Navigation (floating, sidebar, mega menu)
- Effects (parallax, cursor trails, scroll animations)
- Data Display (stats, progress, timelines, metrics)
- Modals & Overlays (dialogs, drawers, toasts)

**Key Features:**
- Real-time customization (colors, typography, spacing, effects)
- Live preview with interactions
- Search & filter
- Category browsing
- Favorites system

### 2. Collections (Phase 2)
Save customized components into named collections for projects.

**User Flow:**
```
1. Browse → Find "Glassmorphic Card"
2. Customize → Adjust colors, blur, opacity
3. Save → Add to "Dashboard Components" collection
4. Repeat → Add button, form, etc.
5. Export → Get prompts for entire design system
```

**Features:**
- Create/edit/delete collections
- Tag collections (dashboard, marketing, e-commerce)
- Thumbnail previews
- Share collections via URL
- Export as:
  - Single mega-prompt
  - Individual component prompts
  - Design tokens (JSON/CSS)
  - Design spec document

### 3. Canvas Mode (Phase 3)
Visual layout builder - arrange components to see full page designs.

**Features:**
- Drag & drop components onto canvas
- Resize/reposition with snap-to-grid
- Auto-layout tools (stack, grid, flex)
- Alignment guides
- Responsive preview (mobile/tablet/desktop)
- Export canvas as:
  - Screenshot/image
  - Layout prompt
  - Component hierarchy

**Use Cases:**
- Plan landing page structure
- Design dashboard layouts
- Visualize form flows
- Create design mockups

### 4. Multi-AI Export (Phase 4)
Generate optimized prompts for different AI coding assistants.

**AI Targets:**
- **Claude** - Natural language, detailed specs
- **GPT-4** - Structured format with code blocks
- **Cursor** - Inline code snippets
- **Windsurf** - Step-by-step instructions
- **Codeium** - Minimal, focused
- **GitHub Copilot** - JSDoc-style comments

**Export Options:**
- Copy to clipboard
- Download as .txt/.md
- Send directly to AI (future: API integration)
- Export code (React/Vue/Svelte)

## Technology Stack

### Core
- **Next.js 15** - App Router, Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS v3** - Styling
- **Framer Motion** - Animations

### UI Components
- **shadcn/ui** - Base components
- **Radix UI** - Accessible primitives
- **Lucide Icons** - Icon system

### State Management
- **Zustand** - Global state (collections, canvas)
- **React Context** - Customization state
- **Local Storage** - Persist collections

### Canvas/Layout
- **react-dnd** - Drag & drop
- **react-grid-layout** - Grid system
- **html-to-image** - Canvas screenshots

### Future Considerations
- **Supabase** - Cloud storage for collections
- **NextAuth** - User authentication
- **Vercel Postgres** - Shared collections database

## Project Structure

```
design2prompt/
├── app/
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Landing page
│   ├── studio/
│   │   ├── page.tsx                    # Component browser
│   │   ├── canvas/page.tsx             # Canvas mode
│   │   └── layout.tsx                  # Studio layout
│   │
│   ├── collections/
│   │   ├── page.tsx                    # All collections
│   │   └── [id]/page.tsx               # View/edit collection
│   │
│   └── api/
│       ├── collections/route.ts        # CRUD endpoints
│       └── export/route.ts             # Export handlers
│
├── components/
│   ├── studio/
│   │   ├── ComponentLibrary.tsx        # Left sidebar - browse
│   │   ├── CustomizationPanel.tsx      # Right panel - customize
│   │   ├── LivePreview.tsx             # Center - preview
│   │   ├── SearchBar.tsx               # Search/filter
│   │   └── ExportMenu.tsx              # Export options
│   │
│   ├── customization/
│   │   ├── ColorTab.tsx                # Color picker
│   │   ├── TypographyTab.tsx           # Font controls
│   │   ├── SpacingTab.tsx              # Layout controls
│   │   ├── EffectsTab.tsx              # Animations
│   │   ├── FrameworkTab.tsx            # Code settings
│   │   └── ComponentSpecificOptions.tsx # Per-component controls
│   │
│   ├── component-previews/
│   │   ├── cards/
│   │   │   ├── GlassCard.tsx
│   │   │   ├── FloatingCard.tsx
│   │   │   ├── NeonCard.tsx
│   │   │   └── GradientCard.tsx
│   │   ├── buttons/
│   │   │   ├── GradientButton.tsx
│   │   │   ├── NeomorphicButton.tsx
│   │   │   └── ParticleButton.tsx
│   │   ├── forms/
│   │   ├── navigation/
│   │   ├── effects/
│   │   └── index.ts                    # Export all
│   │
│   ├── collections/
│   │   ├── CollectionCard.tsx          # Collection preview
│   │   ├── CollectionGrid.tsx          # Grid of collections
│   │   ├── ComponentThumbnail.tsx      # Mini component preview
│   │   ├── CreateCollectionDialog.tsx
│   │   └── ShareDialog.tsx
│   │
│   ├── canvas/
│   │   ├── CanvasView.tsx              # Main canvas
│   │   ├── ComponentNode.tsx           # Draggable component
│   │   ├── CanvasToolbar.tsx           # Tools (grid, snap, align)
│   │   ├── GridOverlay.tsx             # Grid lines
│   │   ├── LayoutGuides.tsx            # Alignment guides
│   │   └── ViewportSelector.tsx        # Mobile/tablet/desktop
│   │
│   ├── export/
│   │   ├── PromptGenerator.tsx         # Generate prompts
│   │   ├── AITargetSelector.tsx        # Choose AI (Claude/GPT)
│   │   ├── CodeExporter.tsx            # Export raw code
│   │   └── DesignTokenExporter.tsx     # Export design tokens
│   │
│   └── ui/                             # shadcn/ui components
│
├── lib/
│   ├── component-registry.ts           # All components metadata
│   ├── presets.ts                      # Color/theme presets
│   │
│   ├── collections/
│   │   ├── collection-manager.ts       # CRUD operations
│   │   ├── storage.ts                  # LocalStorage adapter
│   │   └── export-utils.ts             # Export helpers
│   │
│   ├── ai-targets/
│   │   ├── claude.ts                   # Claude prompt format
│   │   ├── gpt.ts                      # GPT prompt format
│   │   ├── cursor.ts                   # Cursor format
│   │   ├── windsurf.ts                 # Windsurf format
│   │   └── base.ts                     # Shared utilities
│   │
│   ├── canvas/
│   │   ├── layout-engine.ts            # Auto-layout algorithms
│   │   ├── snap-to-grid.ts             # Snapping logic
│   │   ├── alignment.ts                # Alignment guides
│   │   └── export-canvas.ts            # Canvas to image
│   │
│   ├── code-generators/
│   │   ├── react.tsx                   # React code gen
│   │   ├── vue.ts                      # Vue code gen
│   │   ├── svelte.ts                   # Svelte code gen
│   │   └── html.ts                     # Vanilla HTML/CSS
│   │
│   ├── hooks/
│   │   ├── useCustomization.ts         # Customization state
│   │   ├── useComponentLibrary.ts      # Component selection
│   │   ├── useCollections.ts           # Collection management
│   │   └── useCanvas.ts                # Canvas state
│   │
│   └── stores/
│       ├── customization-store.ts      # Zustand store
│       ├── collection-store.ts
│       └── canvas-store.ts
│
├── types/
│   ├── component.ts                    # Component definitions
│   ├── customization.ts                # Customization types
│   ├── collection.ts                   # Collection types
│   ├── canvas.ts                       # Canvas types
│   └── ai-target.ts                    # AI export types
│
├── config/
│   ├── components.config.ts            # Component metadata
│   ├── ai-targets.config.ts            # AI prompt templates
│   └── presets.config.ts               # Default presets
│
└── public/
    └── component-thumbnails/           # Static previews
```

## Data Models

### Component Registry

```typescript
type Component = {
  id: string;                           // 'glass-card'
  name: string;                         // 'Glassmorphic Card'
  category: ComponentCategory;          // 'cards'
  description: string;
  tags: string[];                       // ['glass', 'blur', 'modern']
  customizableProps: CustomizableProp[];
  defaultCustomization: Customization;
  previewComponent: React.ComponentType<PreviewProps>;
  thumbnail: string;                    // Path to preview image
};

type ComponentCategory =
  | 'cards'
  | 'buttons'
  | 'forms'
  | 'navigation'
  | 'effects'
  | 'data-display'
  | 'modals'
  | 'headers';

type CustomizableProp = {
  key: string;                          // 'glassOpacity'
  label: string;                        // 'Glass Opacity'
  type: 'slider' | 'color' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue: any;
  description?: string;
  tooltip?: string;
};
```

### Customization State

```typescript
type Customization = {
  // Colors
  primaryColor: string;                 // '#10b981'
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;

  // Typography
  fontFamily: string;
  fontSize: string;
  fontWeight: string;

  // Spacing
  padding: string;
  margin: string;
  borderRadius: string;

  // Effects
  animation: 'none' | 'smooth' | 'bounce' | 'spring';
  duration: string;
  shadowIntensity: string;
  blurAmount: string;

  // Framework
  framework: 'react' | 'nextjs' | 'vue' | 'svelte' | 'vanilla' | 'astro';
  typescript: boolean;
  styling: 'tailwind' | 'css-modules' | 'styled-components';

  // Features
  responsive: boolean;
  darkMode: boolean;
  accessibility: boolean;
  animations: boolean;

  // Component-specific (dynamic based on selected component)
  [key: string]: any;
};
```

### Collections

```typescript
type Collection = {
  id: string;                           // UUID
  name: string;
  description?: string;
  tags: string[];
  components: SavedComponent[];
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;                   // Auto-generated from first component
};

type SavedComponent = {
  id: string;                           // UUID
  componentId: string;                  // 'glass-card'
  customization: Customization;
  notes?: string;
  order: number;                        // For sorting
  canvasPosition?: CanvasPosition;      // If used on canvas
};

type CanvasPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
};
```

### Canvas Layout

```typescript
type CanvasLayout = {
  id: string;
  collectionId: string;
  viewport: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  components: CanvasComponent[];
  grid: {
    size: number;                       // Grid cell size in px
    show: boolean;
    snap: boolean;
  };
  guides: {
    show: boolean;
    positions: number[];                // Horizontal/vertical guide positions
  };
};

type CanvasComponent = SavedComponent & {
  position: CanvasPosition;
  locked: boolean;
  hidden: boolean;
};
```

### Export Formats

```typescript
type ExportFormat = {
  target: AITarget;
  format: 'prompt' | 'code' | 'tokens' | 'spec';
  content: string;
  metadata: {
    componentCount: number;
    framework?: string;
    timestamp: Date;
  };
};

type AITarget =
  | 'claude'
  | 'gpt4'
  | 'cursor'
  | 'windsurf'
  | 'codeium'
  | 'copilot'
  | 'universal';
```

## Implementation Phases

### Phase 1: Foundation & Component Browser (Week 1-2)

**Goal:** Extract from portfolio-style-guides, create modular architecture, working component browser.

**Tasks:**
1. ✅ Create project structure
2. ✅ Setup Next.js 16 + TypeScript + Tailwind
3. ✅ Install dependencies (shadcn/ui, Framer Motion, Zustand, dnd-kit)
4. ✅ Create component registry system
5. ✅ Extract 12 existing components from portfolio
   - ✅ Modularize into separate files
   - ✅ Add TypeScript types
   - ✅ Create component metadata
6. ✅ Build Component Library sidebar
   - ✅ Category organization
   - ✅ Search/filter
   - ✅ Component selection
7. ✅ Build Customization Panel
   - ✅ Tab system (Colors, Typography, Spacing, Effects, Framework)
   - ✅ Reusable control components
   - ✅ Real-time state updates
8. ✅ Build Live Preview
   - ✅ Preview container
   - ✅ Dynamic background
   - ✅ Component-specific options
9. ✅ Implement basic prompt generation
   - ✅ Claude format
   - ✅ Copy to clipboard
   - ✅ Download option

**Deliverable:** ✅ Working studio with 12 components, full customization, prompt generation.

**PHASE 1 COMPLETED: 2025-11-29**

### Phase 2: Collections System (Week 3)

**Goal:** Save components, organize into collections, export design systems.

**Tasks:**
1. ✅ Design collection data model
2. ✅ Implement LocalStorage persistence (Zustand middleware)
3. ✅ Build Collection Manager
   - ✅ Create/edit/delete collections
   - ✅ Add/remove components
   - ✅ Reorder components
   - ✅ Duplicate collections
4. ✅ Build Collection UI
   - ✅ Collections page with grid layout
   - ✅ Collection cards with thumbnails
   - ✅ Component thumbnails
   - ✅ Collection detail page
5. ✅ Implement collection export
   - ✅ Single mega-prompt
   - ✅ Individual prompts
   - ✅ Design tokens (JSON)
6. ✅ Add tagging system
7. ⬜ Add favorites/starred components (moved to backlog)

**Deliverable:** ✅ Full collection management, save/load, export.

**PHASE 2 COMPLETED: 2025-11-29**

### Phase 3: Canvas Mode (Week 4-5)

**Goal:** Visual layout builder with drag & drop.

**Tasks:**
1. ✅ Setup @dnd-kit canvas (chose dnd-kit over react-dnd)
2. ✅ Build Canvas View
   - ✅ Drag & drop with DndContext
   - ✅ Component rendering with zoom awareness
   - ✅ Selection handling with multi-select support
3. ✅ Implement grid system
   - ✅ SVG Grid overlay with visual guides
   - ✅ Snap to grid with createSnapModifier
   - ✅ Grid size controls (10/20/40/50px)
4. ✅ Add alignment guides
   - ✅ Center crosshair guides
   - ✅ Grid-based alignment
5. ✅ Build canvas toolbar
   - ✅ Viewport selector (mobile/tablet/desktop)
   - ✅ Zoom controls (0.25x - 2x)
   - ✅ Grid toggle and snap toggle
   - ✅ Grid size selector
6. ✅ Implement canvas export
   - ✅ JSON layout export
   - ✅ Layout save/load system
   - ⬜ Screenshot export (html-to-image) - moved to backlog

**Deliverable:** ✅ Working canvas with drag & drop, grid snapping, viewport presets, export.

**PHASE 3 COMPLETED: 2025-11-29**

### Phase 4: Multi-AI Export (Week 6)

**Goal:** Generate optimized prompts for all major AI assistants.

**Tasks:**
1. ⬜ Create AI target system
   - Template engine
   - Format converters
2. ⬜ Implement Claude format (enhance existing)
3. ⬜ Implement GPT-4 format
4. ⬜ Implement Cursor format
5. ⬜ Implement Windsurf format
6. ⬜ Implement Codeium format
7. ⬜ Implement Copilot format
8. ⬜ Build AI Target Selector UI
9. ⬜ Add code export (React/Vue/Svelte)
10. ⬜ Add design token export (CSS/Tailwind)

**Deliverable:** Export to 6+ AI formats, code generation, design tokens.

### Phase 5: Enhanced Component Library (Week 7-8)

**Goal:** Expand to 50+ components across all categories.

**New Components:**
- **Cards:** Gradient, Stats, Profile, Product
- **Buttons:** Icon, Loading, Split, Floating Action
- **Forms:** Validation, Multi-field, Search, Date Picker
- **Navigation:** Breadcrumb, Tabs, Pagination, Mega Menu
- **Data Display:** Stats, Progress Ring, Timeline, Metric Card, Badge Group
- **Modals:** Dialog, Drawer, Toast, Tooltip, Popover
- **Headers:** Hero, Sticky Header, Animated Text
- **Effects:** Scroll Reveal, Hover Cards, Magnetic Cursor

**Tasks:**
1. ⬜ Design and implement 38+ new components
2. ⬜ Add component-specific customization options
3. ⬜ Create thumbnails for all components
4. ⬜ Add educational tooltips/descriptions
5. ⬜ Build example prompts for each component

**Deliverable:** 50+ components, comprehensive library.

### Phase 6: Polish & Launch (Week 9-10)

**Goal:** Production-ready, public launch.

**Tasks:**
1. ⬜ Create landing page
   - Hero section
   - Feature showcase
   - Demo video
   - Testimonials
2. ⬜ Write documentation
   - Getting started guide
   - Component documentation
   - Export guides
   - API documentation (if applicable)
3. ⬜ Build onboarding flow
   - Interactive tutorial
   - Sample collections
   - Quick tips
4. ⬜ Implement share URLs
   - Shareable collections
   - Shareable components
5. ⬜ Performance optimization
   - Code splitting
   - Lazy loading
   - Image optimization
6. ⬜ SEO & metadata
7. ⬜ Analytics setup
8. ⬜ Deploy to Vercel
9. ⬜ Launch!

**Deliverable:** Public launch, marketing site, documentation.

## Future Enhancements (Post-Launch)

### Cloud Storage & Sync
- User authentication (NextAuth)
- Cloud-saved collections (Supabase)
- Sync across devices
- Team collaboration

### AI Integration
- Claude API integration (send prompts directly)
- GPT API integration
- Real-time AI preview (generate actual code)

### Advanced Features
- Component variants (size, color schemes)
- Animation timeline editor
- Custom component builder (upload your own)
- Design system exporter (full Figma-style design system)
- Version history
- Component comments/annotations
- Accessibility checker
- Performance metrics

### Community
- Public component gallery
- User-submitted components
- Upvoting/rating
- Component packs/bundles
- Premium components

### Integrations
- Figma plugin (import designs)
- VS Code extension (quick component insert)
- Chrome extension (capture components from websites)
- Storybook integration

## Success Metrics

### Launch Goals (Month 1)
- 100 active users
- 500 components customized
- 200 collections created
- 1,000 prompts generated

### Growth Goals (Month 3)
- 1,000 active users
- 10,000 prompts generated
- 5,000 collections created
- 50+ GitHub stars
- Featured on Product Hunt

### Long-term Goals (Year 1)
- 10,000+ active users
- Premium tier launched
- API for programmatic access
- Component marketplace
- Team collaboration features

## Marketing & Distribution

### Launch Strategy
1. **Product Hunt** - Main launch day
2. **Hacker News** - Show HN post
3. **Reddit** - r/webdev, r/reactjs, r/nextjs
4. **Twitter/X** - Thread showing before/after workflow
5. **Dev.to** - Article: "Building Better AI Prompts with Visual Tools"
6. **YouTube** - Demo video walkthrough

### Content Marketing
- Blog posts on AI-assisted development
- Twitter threads showing component examples
- YouTube tutorials
- Guest posts on web development blogs

### Community Building
- Discord server for users
- Weekly component releases
- User showcase (best designs)
- Open source (MIT license)

## Technical Considerations

### Performance
- Code splitting per component category
- Lazy load components on scroll
- Virtualized lists for large libraries
- Optimized canvas rendering
- Service worker for offline support

### Accessibility
- Keyboard navigation throughout
- Screen reader support
- WCAG AA compliance
- Focus management
- Color contrast checking

### Browser Support
- Chrome/Edge (primary)
- Firefox
- Safari
- Mobile browsers (responsive)

### Data Privacy
- LocalStorage first (no accounts required)
- Optional cloud sync
- No tracking without consent
- GDPR compliant

## Risks & Mitigations

**Risk:** Too complex for beginners
**Mitigation:** Interactive tutorial, simple defaults, templates

**Risk:** AI formats change
**Mitigation:** Plugin system for custom formats, community contributions

**Risk:** Performance with 50+ components
**Mitigation:** Lazy loading, virtualization, code splitting

**Risk:** Users don't understand component terminology
**Mitigation:** Educational tooltips, visual search, examples

**Risk:** Low adoption
**Mitigation:** Free forever tier, aggressive marketing, solve real pain point

## Budget & Resources

### Development Time
- **Phase 1-2:** 3 weeks (foundation + collections)
- **Phase 3-4:** 3 weeks (canvas + multi-AI)
- **Phase 5-6:** 4 weeks (components + polish)
- **Total:** ~10 weeks to launch

### Costs (Monthly)
- Vercel hosting: Free (Pro if needed: $20)
- Domain: $12/year
- Supabase (future): Free tier
- Analytics: Free (Vercel Analytics)
- **Total:** ~$0-20/month

### Revenue Model (Future)
- Free tier: All core features
- Pro tier ($9/month):
  - Cloud sync
  - Unlimited collections
  - Priority support
  - Premium components
- Team tier ($29/month):
  - Team collaboration
  - Shared collections
  - Admin controls

## Next Steps

### ✅ Phase 1 Complete
1. ✅ Create project folder
2. ✅ Draft this plan
3. ✅ Initialize Next.js 16 project
4. ✅ Setup shadcn/ui components
5. ✅ Create component registry structure
6. ✅ Extract 6 components from portfolio (with previews)
7. ✅ Build 3-panel studio layout
8. ✅ Implement full customization panel
9. ✅ Add Claude prompt generation

### ✅ Phase 2 Complete
1. ✅ Design collection data model
2. ✅ Implement LocalStorage persistence with Zustand
3. ✅ Build Collection Manager (CRUD)
4. ✅ Build Collections page UI
5. ✅ Implement collection export (mega-prompt, individual, design tokens)
6. ✅ Add tagging system
7. ✅ Integrate Save to Collection in Studio

### ✅ Phase 3 Complete
1. ✅ Setup @dnd-kit canvas with DndContext
2. ✅ Build drag & drop layout builder with zoom/pan
3. ✅ Implement grid system with configurable snap
4. ✅ Add viewport selector (mobile/tablet/desktop)
5. ✅ Layout save/load and JSON export
6. ✅ Component library sidebar for canvas

### Component Library Expansion (In Progress)
1. ✅ Added 18 new components (24 total)
2. ✅ Added 4 new categories (heroes, pricing, testimonials, auth)
3. ✅ Created component mapping document (90 component target)
4. ⬜ Add remaining ~66 components from mapping

### ✅ Customization System Enhancement - 2025-11-30
1. ✅ Fixed broken props (SidebarNav widths, StickyHeader glass effects)
2. ✅ Added UI controls for all registered props (glass, gradient, hover scale)
3. ✅ Enhanced 6 basic components with new customizable props
4. ✅ Created advanced effects (CursorFollow, ParallaxScroll) with full controls
5. ✅ 70+ components now have working customization

### Phase 4: Multi-AI Export (Next)
1. ⬜ Create AI target system with template engine
2. ⬜ Implement GPT-4 format
3. ⬜ Implement Cursor format
4. ⬜ Implement Windsurf/Codeium/Copilot formats
5. ⬜ Build AI Target Selector UI

---

**Last Updated:** 2025-11-30
**Status:** Customization Enhancement Complete - 70+ components fully customizable
**Target Launch:** Q1 2025
