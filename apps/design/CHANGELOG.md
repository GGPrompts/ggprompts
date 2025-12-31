# Changelog

All notable changes and completed tasks for design2prompt.

**Format:** Move completed items from PLAN.md here with date and details.

---

## [Unreleased]

### Customization System Enhancement - 2025-11-30

**Completed comprehensive customization overhaul across 4 phases:**

**Phase 1: Fixed Broken Implementations**
- ✅ Fixed SidebarNav to use `sidebarWidth`/`collapseWidth` props (was hardcoded 70/240)
- ✅ Fixed StickyHeader to use `glassOpacity`/`blurAmount` props (was hardcoded blur)
- ✅ Verified TransparentHeader, GlassNav, GlassModal already correct

**Phase 2: Added Missing UI Controls**
- ✅ Added GlowButton controls (glowIntensity, glowSpread)
- ✅ Added SidebarNav controls (sidebarWidth, collapseWidth)
- ✅ Refactored glass components to share controls (10+ components)
- ✅ Added gradient angle controls for 15+ components
- ✅ Added hover scale controls for button variants

**Phase 3: Enhanced Basic Components**
- ✅ ProfileCard: avatarSize, showSocialLinks
- ✅ ProductCard: imageHeight, showRating
- ✅ BlogCard: excerptLines, showAuthor
- ✅ StatCard: iconSize, showTrend
- ✅ ToastNotification: toastWidth, showIcon
- ✅ LoadingButton: spinnerSize, showSuccessState

**Phase 4: Advanced Effects**
- ✅ Created CursorFollow.tsx with trailLength, cursorSize, cursorBlendMode
- ✅ Created ParallaxScroll.tsx with parallaxSpeed, layerCount, parallaxDirection
- ✅ Added UI controls for both effects in CustomizationPanel

**Files Changed:**
- `components/studio/CustomizationPanel.tsx` - Major expansion with new controls
- `lib/component-registry.ts` - Added new customizable props to 6+ components
- `components/component-previews/navigation/SidebarNav.tsx` - Fixed width props
- `components/component-previews/headers/StickyHeader.tsx` - Fixed glass props
- `components/component-previews/cards/*.tsx` - Enhanced 3 card components
- `components/component-previews/data-display/StatCard.tsx` - Enhanced
- `components/component-previews/feedback/ToastNotification.tsx` - Enhanced
- `components/component-previews/buttons/LoadingButton.tsx` - Enhanced
- `components/component-previews/effects/CursorFollow.tsx` - Created
- `components/component-previews/effects/ParallaxScroll.tsx` - Created

**Impact:**
- 70+ components now have working customization
- UI controls exposed for all registered props
- 6 basic components enhanced with 2 new props each
- 2 new advanced effect components created

---

### Phase 3: Canvas Mode - 2025-11-29

**Completed:**
- ✅ Full canvas implementation with @dnd-kit drag & drop
- ✅ Grid system with configurable size (10/20/40/50px)
- ✅ Snap-to-grid functionality
- ✅ Zoom controls (0.25x - 2x) with scroll wheel
- ✅ Pan with Alt+drag or middle mouse button
- ✅ Viewport presets (mobile 375x812, tablet 768x1024, desktop 1440x900)
- ✅ Component lock/unlock and visibility toggle
- ✅ Z-index layer management (bring to front, send to back)
- ✅ Layout save/load system with localStorage persistence
- ✅ JSON export of canvas layouts
- ✅ Component library sidebar with search and categories
- ✅ Framer Motion animations throughout

**Canvas Components Created:**
- `components/canvas/Canvas.tsx` - Main DndContext canvas with pan/zoom
- `components/canvas/CanvasComponent.tsx` - Draggable wrapper with controls
- `components/canvas/CanvasToolbar.tsx` - Zoom, grid, viewport controls
- `components/canvas/CanvasGrid.tsx` - SVG grid overlay with guides
- `components/canvas/ComponentLibrarySidebar.tsx` - Add components panel

**Canvas Store Enhancements:**
- Viewport state (x, y, zoom)
- Selection system with multi-select support
- Position utilities (snapToGrid, screenToCanvas, canvasToScreen)
- Layout management (saveLayout, loadLayout)
- Z-index tracking and management

**New Page:**
- `app/canvas/page.tsx` - Full canvas mode page with save/export

---

### Component Library Expansion - 2025-11-29

**Added 18 New Components (6 → 24 total):**

| Category | New Components |
|----------|----------------|
| Forms | AnimatedInput, FloatingLabelInput, SearchCommand |
| Navigation | GlassNav, CommandPalette |
| Data Display | StatCard, MetricTile, ProgressRing |
| Heroes | GradientHero, BentoHero |
| Modals | GlassModal, SlideDrawer |
| Pricing | PricingCard, FeatureGrid |
| Testimonials | TestimonialCard, QuoteCard |
| Auth | LoginCard, SignupCard |

**New Categories Added:**
- Heroes (landing page hero sections)
- Pricing (pricing cards and feature grids)
- Testimonials (customer quotes and reviews)
- Auth (login/signup forms)

**Visual Effects Used:**
- Glassmorphism (blur, transparency)
- Gradient animations
- Framer Motion (stagger, spring, hover)
- Neon glow effects
- SVG progress rings
- Shimmer effects
- Border trail animations

**Files Updated:**
- `types/component.ts` - Added 4 new category types
- `lib/component-registry.ts` - Full rewrite with 24 components
- `components/component-previews/index.ts` - All exports

**Documentation Added:**
- `docs/COMPONENT_MAPPING.md` - Comprehensive mapping from portfolio-style-guides (90 component target)

---

### Phase 2: Collections System - 2025-11-29

**Completed:**
- ✅ Zustand collection store with localStorage persistence
- ✅ Collection CRUD operations (create, update, delete, duplicate)
- ✅ Save components to collections from Studio
- ✅ Collections page with grid layout, search, and tag filtering
- ✅ Collection detail page with component management
- ✅ Add to Collection dialog with collection picker
- ✅ Create/Edit Collection dialog with tag support
- ✅ Collection export as mega-prompt (markdown)
- ✅ Design tokens extraction from collections
- ✅ View in Studio from collection (URL params)
- ✅ Toast notifications for user feedback

**UI Components Added (shadcn/ui):**
- Dialog, AlertDialog, DropdownMenu, Badge, Card, Textarea, Toast, Toaster

**Files Created:**
- `lib/stores/collection-store.ts` - Zustand store with persistence
- `types/collection.ts` - Collection and SavedComponent types
- `app/collections/page.tsx` - Collections gallery page
- `app/collections/[id]/page.tsx` - Collection detail page
- `components/collections/CollectionCard.tsx` - Collection card with actions
- `components/collections/CollectionGrid.tsx` - Responsive grid with filters
- `components/collections/CreateCollectionDialog.tsx` - Create/edit dialog
- `components/collections/AddToCollectionDialog.tsx` - Save component dialog
- `components/collections/SavedComponentCard.tsx` - Saved component card
- `components/collections/index.ts` - Component exports

**Export Features:**
- `generateCollectionPrompt()` - Full collection as markdown prompt
- `generateIndividualPrompts()` - Array of individual component prompts
- `exportDesignTokens()` - Extract colors, typography, spacing, effects

---

### Phase 1: Component Browser - 2025-11-29

**Completed:**
- ✅ Component registry system with 12 components across 6 categories
- ✅ 6 fully working component previews (GlassCard, FloatingCard, NeonCard, GradientButton, NeomorphicButton, ParticleButton)
- ✅ 3-panel Studio layout (Component Library, Live Preview, Customization Panel)
- ✅ Component Library sidebar with categories, search, and collapsible sections
- ✅ Customization Panel with 5 tabs (Colors, Typography, Spacing, Effects, Code)
- ✅ 6 color presets (Terminal, Sunset, Ocean, Forest, Midnight, Rose)
- ✅ Component-specific customization options
- ✅ Live Preview with dynamic background that adapts to colors
- ✅ Claude prompt generation with copy/download/open buttons
- ✅ Polished landing page with animations

**Components Built:**
| Category | Components |
|----------|------------|
| Cards | GlassCard, FloatingCard, NeonCard |
| Buttons | GradientButton, NeomorphicButton, ParticleButton |
| Forms | AnimatedForm, StepForm (metadata) |
| Navigation | FloatingNav, SidebarNav (metadata) |
| Effects | CursorFollow, ParallaxScroll (metadata) |

**UI Components (shadcn/ui style):**
- Button, Input, Label, Slider, Switch, Tabs, ScrollArea, Separator

**Files Created:**
- `lib/component-registry.ts` - Component definitions and search
- `lib/ai-targets/claude.ts` - Prompt generation
- `config/presets.config.ts` - Color/framework presets
- `components/studio/*` - Studio UI components
- `components/component-previews/*` - 6 component renders
- `components/ui/*` - 8 shadcn-style components

---

### Planning Phase - 2025-11-29

**Completed:**
- ✅ Created comprehensive project plan (PLAN.md)
- ✅ Researched optimal tech stack with Context7 MCP
- ✅ Tech stack decisions documented (TECH_STACK.md)
- ✅ GitHub repository created and initialized
- ✅ Global Claude skills added (nextjs, shadcn-ui, canvas-design, gemini-image-gen)
- ✅ Documentation structure established

**Tech Stack Decided:**
- Next.js 16.0.3 (Trust: 10/10)
- Zustand 5.0.8 (Trust: 9.6/10) with built-in persistence
- dnd-kit (Trust: 9.3/10) over react-dnd
- Framer Motion 11
- shadcn/ui via MCP

**Key Decisions:**
- App Router only (no Pages Router)
- 3 separate Zustand stores for better performance
- dnd-kit for modern drag & drop
- LocalStorage persistence via Zustand middleware

---

## Template

```markdown
### [Feature Name] - YYYY-MM-DD

**Completed:**
- ✅ Task 1
- ✅ Task 2

**Changes:**
- Changed X to Y because...

**Performance:**
- Improved Z by N%

**Fixes:**
- Fixed bug in...

**Notes:**
- Important context...
```
