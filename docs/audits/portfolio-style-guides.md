# Portfolio Style Guides - Monorepo Migration Audit

**Source**: `~/projects/portfolio-style-guides`
**Audit Date**: 2025-12-31
**Purpose**: Consolidation into GGPrompts monorepo

---

## 1. Package.json

### Dependencies Overview
| Category | Package | Version |
|----------|---------|---------|
| **Framework** | next | ^16.0.7 |
| **React** | react / react-dom | ^19.2.0 |
| **TypeScript** | typescript | ^5.9.3 |
| **Styling** | tailwindcss | ^3.4.18 |
| **Animation** | framer-motion / motion | ^12.23.24 |
| **UI Library** | @radix-ui/* | Various (21 packages) |
| **Charts** | recharts | ^2.15.4 |
| **Toast** | sonner | ^2.0.7 |
| **Table** | @tanstack/react-table | ^8.21.3 |
| **Date** | date-fns / react-day-picker | ^4.1.0 / ^9.11.1 |
| **Carousel** | embla-carousel-react | ^8.6.0 |
| **Drawer** | vaul | ^1.1.2 |
| **Command** | cmdk | ^1.1.1 |
| **Theming** | next-themes | ^0.4.6 |
| **Icons** | lucide-react | ^0.554.0 |

### Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### Migration Notes
- **Next.js 16** - bleeding edge, may need downgrade to 15.x for monorepo compatibility
- **React 19** - also cutting edge, verify monorepo compatibility
- Heavy Radix UI dependency (21 packages) - all required for shadcn/ui
- No test scripts defined

---

## 2. Authentication

**Status**: None

No authentication system implemented:
- No `next-auth` or `@auth/*` packages
- No Supabase auth
- No custom auth implementation
- No OAuth providers

This is a **static portfolio/template showcase** - no user accounts needed.

---

## 3. Database

**Status**: None

No database integration:
- No Prisma
- No Drizzle
- No Supabase client
- No database schema files

All data is:
- Hardcoded in components
- Static JSON files (`PROJECTS_DATA.json`, `project-data-research.json`)
- Template metadata in `templates.config.json`

---

## 4. Theming

### Theme System Architecture

**Provider Stack** (in `app/layout.tsx`):
```
BackgroundProvider
  └── ThemeProvider
        └── MasterBackground
              └── {children}
```

### Themes Available (10 total)
| Theme | Primary Color | Description |
|-------|---------------|-------------|
| **Terminal** (default) | Emerald/Cyan | Phosphor glow terminal aesthetic |
| **Amber** | Gold/Orange | Warm golden tones on purple |
| **Carbon** | Grayscale | Monochrome slate/gray |
| **Light** | Blue | Professional blue on white |
| **Ocean** | Aqua/Turquoise | Deep blue with coral accents |
| **Sunset** | Orange/Pink | Purple-pink with orange |
| **Forest** | Lime/Chartreuse | Dark green with lime accents |
| **Midnight** | Magenta/Fuchsia | Deep indigo with magenta |
| **Neon** | Hot Pink/Cyan | Near-black with neon accents |
| **Slate** | Sky Blue | Blue-gray professional |

### Background Tones (10 options)
Independent of theme colors:
- Charcoal, Deep Purple, Pure Black, Light, Ocean
- Sunset, Forest, Midnight, Neon Dark, Slate

### CSS Variables (in `globals.css`)
```css
--background, --foreground
--card, --card-foreground
--popover, --popover-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
--chart-1 through --chart-5
--primary-rgb, --secondary-rgb (for glow effects)
--glass-bg, --glass-dark-bg, --glass-overlay-bg
--gradient-1, --gradient-2
```

### Custom Utility Classes
- `.glass` - Glassmorphism with theme-specific overrides
- `.glass-dark` - Darker glassmorphism variant
- `.glass-overlay` - High-opacity readable overlay
- `.terminal-glow` - Text glow effect
- `.border-glow` - Border glow effect
- `.gradient-text-theme` - Theme-aware gradient text
- `.animate-gradient` / `.animate-gradient-*` - Animated gradients
- `.bg-style-gradient` / `.bg-style-mesh` / `.bg-style-textured` / `.bg-style-minimal` - Background styles
- `.scrollbar-visible` - Styled scrollbars

### Theme Implementation Size
`globals.css`: **1,281 lines** (extensive theme definitions)

---

## 5. Shared Components

### shadcn/ui Components (44 total)

**Core UI**
- `button.tsx`, `badge.tsx`, `card.tsx`, `separator.tsx`, `skeleton.tsx`

**Forms**
- `input.tsx`, `textarea.tsx`, `checkbox.tsx`, `radio-group.tsx`
- `label.tsx`, `select.tsx`, `switch.tsx`, `slider.tsx`

**Navigation**
- `tabs.tsx`, `accordion.tsx`, `navigation-menu.tsx`, `collapsible.tsx`

**Overlays**
- `dialog.tsx`, `drawer.tsx`, `sheet.tsx`, `popover.tsx`
- `tooltip.tsx`, `hover-card.tsx`, `dropdown-menu.tsx`

**Feedback**
- `alert.tsx`, `alert-dialog.tsx`, `sonner.tsx`, `progress.tsx`

**Data Display**
- `table.tsx`, `chart.tsx`, `avatar.tsx`, `scroll-area.tsx`, `carousel.tsx`

**Interactive**
- `command.tsx`, `toggle.tsx`, `toggle-group.tsx`, `kbd.tsx`

**Motion Primitives**
- `border-trail.tsx`, `animated-background.tsx`, `text-morph.tsx`
- `glow-effect.tsx`, `scroll-progress.tsx`

**Custom**
- `GlassCard.tsx`, `spinner.tsx`

### Application Components
- `Hero.tsx`, `HeroSection.tsx`, `AboutSection.tsx`, `ContactSection.tsx`
- `FeaturedProjects.tsx`, `ThemeProvider.tsx`, `ThemeCustomizer.tsx`
- `ThemeSettingsPanel.tsx`, `MasterBackground.tsx`, `SpaceBackground.tsx`
- `BackgroundProvider.tsx`, `BackgroundMediaSettings.tsx`

### shadcn/ui Configuration
```json
{
  "style": "new-york",
  "rsc": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "baseColor": "slate",
    "cssVariables": true
  },
  "registries": {
    "@motion-primitives": "https://motion-primitives.com/c/{name}.json"
  }
}
```

---

## 6. TabzChrome Integration

**Status**: Documentation only

TabzChrome is mentioned in documentation files for recording TUI demos:
- `QUICK_START.md`
- `CLAUDE_AI_SESSIONS.md`
- `BUILD_STRATEGY.md`
- `PROJECT_SCANNER.md`
- `lib/projects-data.ts`
- `PORTFOLIO_PROJECT_SUMMARY.md`

**No actual code integration** - references are for OBS Studio recording workflow guidance.

---

## 7. Key Files & Routes

### App Structure
```
app/
├── layout.tsx          # Root layout (ThemeProvider, BackgroundProvider)
├── page.tsx            # Homepage (redirects to /templates)
├── globals.css         # Theme system (1,281 lines)
├── icon.svg            # Favicon
├── api/
│   └── placeholder/    # Placeholder API
├── styleguide/         # Style guide page
└── templates/
    ├── layout.tsx      # Template wrapper
    ├── page.tsx        # Template gallery
    └── [145 template directories]
```

### Template Routes (145 total)
Organized by category:

**SaaS & Business**: api-reference, help-center, roadmap, community, affiliates, feature-flags

**Authentication**: login, signup, password-reset, 2fa-setup, email-verification

**E-Commerce**: product-detail, cart, checkout, product-listing, product-comparison, order-confirmation, order-tracking

**Dashboards** (22):
- analytics-dashboard, sales-dashboard, devops-dashboard, finance-dashboard
- marketing-dashboard, support-dashboard, admin-dashboard, ai-agent-dashboard
- fleet-dashboard, git-dashboard, iot-sensor-dashboard, kubernetes-dashboard
- llm-training-dashboard, live-weather-dashboard, ml-model-performance
- social-analytics-dashboard, stock-trading-dashboard, terraform-dashboard
- vector-db-dashboard, wallet-dashboard, project-dashboard, dashboard

**Billing**: billing-history, subscription-management, invoice-detail, usage-metering, payment-methods, invoice-generator, expense-tracker

**Landing Pages**: waitlist, product-launch, landing-app, landing-agency, landing-portfolio, squeeze-page, saas-landing, pricing

**Content**: blog-post, author-profile, category, tag, archive, newsletter, resources, changelog

**Portfolio**: portfolio-minimal, portfolio-bento, portfolio-magazine, case-study, resume-timeline, resume-bento, resume-terminal

**Builders**: form-builder, survey-builder, quiz-builder, email-campaign-builder, prompt-studio, cron-builder, db-schema-designer, regex-tester

**Communication**: email-transactional, email-marketing, email-analytics, email-inbox, chat-helpbot, video-call

**Scheduling**: calendar-scheduler, booking-flow, shift-scheduler

**Specialized**: inventory-management, patient-portal, property-listing, restaurant-menu, fitness-tracker, music-player, video-player, podcast-app, photo-gallery, media-library, gaming-leaderboard, job-board, notion-workspace, kanban-board, sprint-board, contact-management, deal-pipeline, nist-compliance, log-viewer, webhook-inspector, delivery-route

**Status**: status-page, uptime-monitor, incident-report, maintenance

**Error Pages**: 404, 500

### API Routes
```
app/api/
└── placeholder/        # Single placeholder route
```

---

## 8. Migration Recommendations

### Priority Actions
1. **Version Alignment**: May need to align Next.js (16→15) and React (19→18) versions with monorepo
2. **Shared Dependencies**: Can share: Radix UI, Tailwind, Framer Motion, Lucide, date-fns
3. **Theme System**: Consider extracting to shared package - highly reusable
4. **Components**: shadcn/ui components can be shared across apps

### Keep Separate
- Template pages (app-specific content)
- Custom background components
- Project-specific data files

### Potential Conflicts
- Theme CSS variables must not conflict with other apps
- Font loading strategy (Inter + JetBrains Mono)
- Background provider context

### File Sizes
| File | Lines |
|------|-------|
| globals.css | 1,281 |
| SpaceBackground.tsx | 10,944 |
| templates/page.tsx | ~1,430 |
| 145 template pages | ~80,000+ total |

---

## Summary

| Aspect | Status |
|--------|--------|
| Authentication | None |
| Database | None |
| Themes | 10 themes + 10 bg tones |
| UI Components | 44 shadcn/ui |
| Template Pages | 145 routes |
| TabzChrome | Docs only |
| Next.js Version | 16.0.7 (bleeding edge) |
| React Version | 19.2.0 (bleeding edge) |
| Total CSS Lines | 1,281 |
| Estimated Total Code | 80,000+ lines |

**Complexity Level**: Medium-High (extensive theming, many templates, cutting-edge versions)
