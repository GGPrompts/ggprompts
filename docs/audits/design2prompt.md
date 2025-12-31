# design2prompt Monorepo Migration Audit

**Project Path:** `~/projects/design2prompt`
**Audit Date:** 2025-12-31
**Purpose:** Consolidate into GGPrompts monorepo

---

## 1. Package.json

### Core Dependencies
| Package | Version | Notes |
|---------|---------|-------|
| next | ^16.0.7 | Latest major version |
| react | ^19.0.0 | React 19 |
| react-dom | ^19.0.0 | React 19 |
| zustand | ^5.0.8 | State management with persistence |
| framer-motion | ^11.0.0 | Animations |
| @dnd-kit/core | ^6.1.0 | Drag and drop |
| @dnd-kit/modifiers | ^7.0.0 | DnD modifiers |
| @dnd-kit/sortable | ^8.0.0 | Sortable lists |
| tailwindcss | ^3.4.0 | Styling |
| sonner | latest | Toast notifications |
| lucide-react | latest | Icons |

### Radix UI Primitives
- alert-dialog, dialog, dropdown-menu, radio-group, scroll-area
- select, separator, slider, slot, switch, tabs, toast, tooltip

### Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### Dev Dependencies
- TypeScript ^5.3.0
- ESLint 9 with eslint-config-next 16.0.3
- Standard PostCSS/Autoprefixer setup

---

## 2. Authentication

**Status:** No authentication system

- No NextAuth, Supabase Auth, or custom auth implementation
- No OAuth providers configured
- No `.env` files with auth secrets
- Contains only UI component previews for auth screens (`components/component-previews/auth/LoginCard.tsx`)

**Migration Impact:** None - app is purely client-side with no auth requirements

---

## 3. Database

**Status:** No database

- No Prisma schema files
- No Supabase integration
- No database connections or migrations
- All data persisted client-side via Zustand stores with localStorage

### Zustand Stores (lib/stores/)
| Store | File | Purpose |
|-------|------|---------|
| Customization | customization-store.ts | Current component being edited (session) |
| Collection | collection-store.ts | Saved components (localStorage persist) |
| Canvas | canvas-store.ts | Layout positions (localStorage persist) |

**Migration Impact:** None - no database migration required

---

## 4. Theming

### shadcn/ui Configuration (components.json)
```json
{
  "style": "new-york",
  "rsc": true,
  "tailwind": {
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide"
}
```

### Theme System (app/globals.css)
- **Light theme:** `:root` CSS variables
- **Dark theme:** `.dark` class CSS variables
- Uses HSL color format with CSS variables
- Chart colors defined for data visualization

### CSS Variables
```
--background, --foreground, --card, --popover, --primary,
--secondary, --muted, --accent, --destructive, --border,
--input, --ring, --radius, --chart-1 through --chart-5
```

### Custom Utilities
```css
.glass          /* Glassmorphism effect */
.glass-dark     /* Dark glassmorphism */
.terminal-glow  /* Cyan glow effect */
.border-glow    /* Border with glow */
```

### Fonts (lib/fonts.ts)
| ID | Font | Use Case |
|----|------|----------|
| modern | Inter | Default, clean UI |
| developer | JetBrains Mono | Code/terminal feel |
| geometric | Space Grotesk | Modern geometric |
| elegant | Playfair Display | Serif, formal |

**Migration Impact:** Theming is standard shadcn/ui - should merge cleanly with monorepo theme system

---

## 5. Shared Components (shadcn/ui)

### In Use (20 components)
```
components/ui/
├── alert-dialog.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── label.tsx
├── mobile-drawer.tsx    # Custom
├── mobile-nav.tsx       # Custom
├── scroll-area.tsx
├── separator.tsx
├── slider.tsx
├── switch.tsx
├── tabs.tsx
├── textarea.tsx
├── themed-scroll-area.tsx  # Custom
├── toast.tsx
├── toaster.tsx
└── tooltip.tsx
```

### Custom UI Components
- `mobile-drawer.tsx` - Mobile-specific drawer
- `mobile-nav.tsx` - Mobile navigation
- `themed-scroll-area.tsx` - Scroll area with theme support

**Migration Impact:** Standard shadcn components can use shared monorepo versions; custom components need evaluation

---

## 6. TabzChrome Integration

**Status:** No existing integration

- No TabzChrome MCP tools used
- No browser automation or extension hooks
- Standalone web application

**Migration Impact:** Can add TabzChrome integration post-migration if needed

---

## 7. Key Files & Routes

### App Routes (app/)
| Route | Page | Description |
|-------|------|-------------|
| `/` | page.tsx | Landing page with hero showcase |
| `/studio` | studio/page.tsx | Component browser & customization |
| `/collections` | collections/page.tsx | Saved component collections |
| `/collections/[id]` | collections/[id]/page.tsx | Individual collection view |
| `/canvas` | canvas/page.tsx | Visual layout builder |

### Key Directories
```
components/
├── studio/              # Component browser UI
├── component-previews/  # 70+ component renders (16 categories)
├── collections/         # Collection management
├── canvas/              # Drag & drop canvas
├── landing/             # Landing page components
└── ui/                  # shadcn/ui components

lib/
├── stores/              # Zustand state management
├── ai-targets/          # AI export format generators
├── canvas/              # Canvas utilities
├── code-generators/     # Code generation
├── collections/         # Collection utilities
├── component-registry.ts  # All components metadata
├── fonts.ts             # Font configuration
└── utils.ts             # Shared utilities
```

### Component Preview Categories
```
auth, badges, buttons, cards, data-display, effects,
feedback, footers, forms, headers, heroes, marketing,
modals, navigation, pricing, testimonials
```

---

## Migration Recommendations

### Low Risk
- No auth or database - simplifies migration significantly
- Standard Next.js App Router structure
- Compatible package versions (Next 16, React 19)
- Standard shadcn/ui theming

### Action Items
1. **Dependencies:** Consolidate shared deps (React, Next.js, Tailwind, Zustand)
2. **Components:** Move custom UI components to shared package or keep app-specific
3. **Theming:** Merge CSS variables with monorepo theme system
4. **Fonts:** Consolidate font configuration if monorepo has shared fonts
5. **Stores:** Keep app-specific stores or move to shared state if collections are cross-app

### Files to Migrate
- `app/` - All routes
- `components/` - All components (evaluate ui/ for sharing)
- `lib/` - All utilities and stores
- `types/` - TypeScript definitions
- `config/` - Configuration files
- `public/` - Static assets

### Unique Value
- 70+ pre-built component previews
- AI prompt export system (Claude, GPT, Cursor, etc.)
- Visual canvas with dnd-kit
- Component customization system

---

**Status:** Ready for migration - no blocking dependencies
