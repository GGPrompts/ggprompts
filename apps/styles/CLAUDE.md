# Matt's Portfolio - Project Context

## Project Overview

A modern, professional portfolio website showcasing web applications and Terminal User Interface (TUI) projects with a unique glassmorphism/3D design aesthetic.

**Live Goal**: Deploy to Vercel as the primary showcase for technical projects and skills.

## What We're Building

### Core Features
1. **Hero Section** - Animated glassmorphic card with 3D hover effects
2. **Web Projects** - Grid of projects deployed on Vercel with live demos
3. **TUI Projects** - Special showcase for Bubbletea/Lipgloss terminal apps
4. **Skills Display** - Visual representation of technical stack
5. **Contact Section** - Professional links and ways to connect

### Design Philosophy
- **Glassmorphism**: Frosted glass effects, semi-transparent backgrounds, subtle borders
- **3D Depth**: Perspective transforms, hover lifts, rotation effects
- **Professional**: Sophisticated and modern without being cartoony
- **Performance**: Optimized images, minimal JavaScript, fast loading

## Tech Stack (Verified with Context7)

### Core Framework ✓
- **Next.js 15** (App Router) - Server Components, static generation, image optimization
- **TypeScript** - Type safety throughout
- **Tailwind CSS v3** - Native `backdrop-blur`, `backdrop-filter` utilities
- **Framer Motion** - 3D transforms, whileHover animations, layout animations

### Why This Stack
Based on Context7 documentation analysis:
- Next.js handles performance/SEO automatically with Server Components
- Tailwind has native glassmorphism support (`backdrop-blur-*`, `bg-white/10`)
- Framer Motion provides 3D transforms without needing React Three Fiber
- This combination is lighter and more maintainable than alternatives

### NOT Using
- ❌ **React Three Fiber** - Overkill for portfolio, adds 100KB+ bundle size
- ❌ **Tailwind CSS v4** - Still in beta, stick with stable v3

## Available Skills

Skills are located in `.claude/skills/` and provide expert guidance:

### 1. nextjs (`skills/nextjs/SKILL.md`)
**Use for:**
- App Router patterns (Server/Client Components)
- Image optimization with `next/image`
- Metadata and SEO configuration
- Data fetching strategies
- Route handlers and API routes
- Performance optimization

**Key patterns:**
- Server Components by default
- Client Components only for interactivity
- Static generation with `generateStaticParams`
- Proper `next/image` usage for all screenshots

### 2. canvas-design (`skills/canvas-design/SKILL.md`)
**Use for:**
- Creating unique hero images
- Abstract background art
- Project section posters
- Custom visual assets

**Workflow:**
1. Creates a design philosophy (.md file)
2. Expresses it visually on canvas (.pdf/.png)
3. Emphasizes craftsmanship and sophistication

**When to invoke:**
- "Create a hero image for my portfolio"
- "Design an abstract background"
- "Generate a poster for the projects section"

### 3. gemini-image-gen (`skills/gemini-image-gen/SKILL.md`)
**Use for:**
- Custom project thumbnails
- Icons and decorative elements
- Quick visual mockups
- Image editing/composition

**Requirements:**
- Needs `GEMINI_API_KEY` environment variable
- Get key from: https://aistudio.google.com/apikey

**Setup:**
```bash
# Create .env file
echo "GEMINI_API_KEY=your_key_here" > .env
```

### 4. shadcn-ui (`skills/shadcn-ui/SKILL.md`)
**Use for:**
- Pre-built, accessible UI components (cards, buttons, dialogs, forms)
- Building design systems with Tailwind CSS
- Form validation with React Hook Form + Zod
- Data tables, navigation menus, overlays
- Dark mode implementation
- Complex UI patterns

**Why it's perfect for this portfolio:**
- **Copy-paste components** - Not an npm package, you own the code
- **Built with Radix UI** - Fully accessible by default
- **Tailwind-based** - Easy to apply glassmorphism with `.glass` utilities
- **Highly customizable** - Modify components directly in your codebase
- **753+ code examples** - Comprehensive documentation

**Key components for portfolio:**
- `Card` - Perfect base for project cards
- `Button` - Call-to-action buttons
- `Badge` - Technology tags
- `Skeleton` - Loading states
- `Dialog/Drawer` - Project detail modals
- `Tabs` - Organize projects by category

**Setup:**
```bash
npx shadcn@latest init
npx shadcn@latest add card button badge
```

**Glassmorphic integration:**
```tsx
import { Card } from "@/components/ui/card"

<Card className="glass border-white/20">
  {/* shadcn component + your glassmorphism */}
</Card>
```

**When to use:**
- "Add a card component for projects"
- "Create a contact form with validation"
- "Add loading skeletons"
- "Implement a project detail modal"

## Template Library

### Overview
This project contains **95 production-ready templates** totaling **74,515 lines** of TypeScript/React code across **18 categories**. Each template is a fully functional, interactive page built with Next.js 15, TypeScript, shadcn/ui components, Framer Motion animations, and glassmorphism design.

### Access Templates
- **Main Gallery**: `/templates` - Browse all 95 templates with search and filtering
- **Individual Templates**: `/templates/[template-name]` - Each template has its own route

### Template Categories (95 Total)

**SaaS & Business** (5): roadmap, help-center, api-reference, community, affiliates

**Onboarding** (4): product-tour, setup-wizard, onboarding-checklist, welcome-series

**Social & Community** (3): social-feed, user-directory, leaderboard

**E-Commerce** (6): product-detail, cart, checkout, product-listing, product-comparison, order-confirmation

**Authentication** (5): login, signup, password-reset, 2fa-setup, email-verification

**Marketing** (8): features, integrations, comparison, testimonials, about, press-kit, careers, security

**Monitoring & Status** (4): status-page, uptime-monitor, incident-report, maintenance

**Blog & Content** (6): author-profile, category, tag, archive, newsletter, resources

**Portfolio** (3): portfolio-minimal, portfolio-bento, portfolio-magazine

**Projects & Documentation** (3): case-study, api-docs, blog-post

**Dashboards** (3): dashboard, admin-dashboard, user-profile

**Specialized Dashboards** (6): analytics-dashboard, sales-dashboard, devops-dashboard, finance-dashboard, marketing-dashboard, support-dashboard

**Billing & Payments** (5): billing-history, subscription-management, invoice-detail, usage-metering, payment-methods

**Launch & Landing** (5): waitlist, product-launch, landing-app, landing-agency, squeeze-page

**Forms & Builders** (4): form-builder, survey-builder, quiz-builder, event-registration

**Email Templates** (4): email-transactional, email-marketing, email-campaign-builder, email-analytics

**Landing Pages** (3): saas-landing, pricing, contact-hub

**Resumes** (4): timeline, team, resume-timeline, resume-bento, resume-terminal

**Utility** (6): changelog, settings, search-results, docs-hub, 404, 500

**Additional** (8): claude-component-studio, project-case-study, project-technical, project-visual, test

### Notable Templates

**Largest/Most Complex**:
- `settings` (1,497 lines) - Comprehensive settings panel
- `event-registration` (1,297 lines) - 8-step registration wizard
- `quiz-builder` (1,209 lines) - Full quiz creation system
- `survey-builder` (1,173 lines) - Survey builder with logic jumps

**Unique/Interactive**:
- `resume-terminal` - Full terminal emulation with 20+ commands
- `404/500` - Interactive error pages with matrix effects
- `form-builder` - Drag-and-drop with 16 field types
- `email-campaign-builder` - Visual email editor

**Dashboard Suite** (9 specialized dashboards):
Analytics, Sales, DevOps, Finance, Marketing, Support, Admin, User Profile, and general Dashboard

### Theme System
All 95 templates support **4 built-in themes**:
1. **Terminal** (default) - Emerald/cyan on dark slate
2. **Amber** - Golden amber on dark purple-blue
3. **Carbon** - Monochrome slate/gray
4. **Light** - Sky blue on white

Switch themes using the theme selector (controlled by ThemeProvider component).

## Project Structure

```
portfolio-style-guides/
├── app/
│   ├── layout.tsx                  # Root layout with ThemeProvider
│   ├── page.tsx                    # Portfolio homepage
│   ├── globals.css                 # Theme system + glassmorphism utilities
│   └── templates/
│       ├── layout.tsx              # Templates wrapper with back button
│       ├── page.tsx                # Main template gallery (1,430 lines)
│       └── [template-name]/
│           └── page.tsx            # 95 individual templates
├── components/
│   ├── Hero.tsx                    # Portfolio hero section
│   ├── ThemeProvider.tsx           # Theme switching system
│   ├── SpaceBackground.tsx         # Animated backgrounds
│   ├── CircuitBackground.tsx
│   └── ui/                         # 40+ shadcn/ui components
│       ├── card.tsx
│       ├── button.tsx
│       ├── badge.tsx
│       └── ... (37 more components)
├── public/                         # Static assets
│   ├── demos/                      # TUI recordings (OBS videos)
│   ├── screenshots/                # Project screenshots
│   └── art/                        # Canvas-design exports
├── lib/
│   └── utils.ts                    # Utility functions (cn helper)
├── templates.config.json           # Template metadata
└── .claude/
    └── skills/                     # AI development skills
        ├── nextjs/
        ├── canvas-design/
        ├── gemini-image-gen/
        └── shadcn-ui/
```

## Design System

### Color Palette (Terminal Theme)
- **Background**: Very dark slate/black `hsl(220 13% 5%)`
- **Foreground**: Light cyan-white `hsl(160 84% 95%)`
- **Primary**: Terminal green/cyan `hsl(160 84% 39%)`
- **Secondary**: Teal accent `hsl(173 80% 40%)`
- **Border**: Cyan border `hsl(160 60% 25%)`
- **Page Background**: `from-black via-slate-950 to-zinc-950`
- **Subtle Glow**: Radial gradients with emerald/cyan at 5% opacity

### Glassmorphism Utilities (in globals.css)
```css
.glass {
  background: rgba(16, 185, 129, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.3);
  box-shadow:
    0 0 20px rgba(16, 185, 129, 0.1),
    inset 0 0 20px rgba(16, 185, 129, 0.02);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.2);
  box-shadow:
    0 0 15px rgba(6, 182, 212, 0.1),
    inset 0 0 15px rgba(6, 182, 212, 0.02);
}

.terminal-glow {
  text-shadow:
    0 0 10px rgba(16, 185, 129, 0.5),
    0 0 20px rgba(16, 185, 129, 0.3),
    0 0 30px rgba(16, 185, 129, 0.2);
}

.border-glow {
  box-shadow:
    0 0 10px rgba(16, 185, 129, 0.3),
    0 0 20px rgba(16, 185, 129, 0.1);
}
```

### Framer Motion Patterns
```tsx
// 3D hover effect
<motion.div
  whileHover={{ scale: 1.05, rotateY: 10, rotateX: -5 }}
  transition={{ duration: 0.3 }}
  style={{ perspective: 1000 }}
>
  {/* Content */}
</motion.div>

// Fade in animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  {/* Content */}
</motion.div>
```

## TUI Projects - IMPORTANT

### Recording Method: OBS Studio
**Why OBS, not asciinema/vhs:**
- Bubbletea/Lipgloss use sophisticated box-drawing characters
- asciinema and vhs **BREAK** the box art rendering
- OBS captures the actual terminal rendering perfectly

### Workflow
1. Open TUI app in terminal with good color scheme
2. Configure OBS to capture terminal window
3. Record demo/walkthrough
4. Export as MP4 or convert to GIF
5. Optimize with `gifsicle` or `ffmpeg`
6. Save to `public/demos/`

### Alternative: Static Screenshots
For initial version, use high-quality screenshots:
- Multiple states of the TUI
- Show different features/screens
- Save to `public/screenshots/`

## Development Guidelines

### Component Patterns
1. **Server Components by default** - Use for static content
2. **Client Components sparingly** - Only for interactivity (mark with `'use client'`)
3. **Reusable UI components** - Build once, use everywhere
4. **Responsive design** - Mobile-first approach

### Performance Rules
1. **Always use `next/image`** for all images/screenshots
2. **Optimize videos** - Compress TUI recordings before committing
3. **Lazy load** - Use Suspense for below-fold content
4. **Minimize Client JS** - Keep interactive components small

### File Organization
```
components/
├── Hero.tsx              # Sections (single-purpose)
├── About.tsx
├── ProjectCard.tsx       # Cards (reusable)
├── TUIShowcase.tsx
└── ui/                   # Base components
    ├── GlassCard.tsx
    ├── Button.tsx
    └── Section.tsx
```

## Git Workflow

**Important**: Only commit when explicitly requested by the user.

### What to Commit
- Source code changes
- Configuration updates
- Documentation updates
- Optimized assets (compressed images/videos)

### What NOT to Commit
- `.env` files (contains API keys)
- `node_modules/`
- `.next/` build output
- Unoptimized/raw recordings

## Quick Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm start            # Start production server

# Asset Optimization
# (Add specific commands as needed)
```

## Current Status

### ✅ Completed (Latest: 95 Production Templates)
- [x] Next.js 15 setup with TypeScript
- [x] Tailwind CSS v3 configured with terminal color scheme
- [x] Framer Motion installed and extensively used
- [x] Terminal-themed glassmorphism (green/cyan phosphor glow)
- [x] JetBrains Mono + Inter fonts configured
- [x] Darker metallic background (black/slate-950/zinc-950)
- [x] Hero component with terminal aesthetic
- [x] **Complete shadcn/ui component library installed (40+ components)**
- [x] **Motion primitives for advanced animations (5 components)**
- [x] **shadcn MCP integration configured**
- [x] **95 production-ready templates (74,515 lines of code)**
- [x] **18 template categories covering all major SaaS use cases**
- [x] **4 theme variants (Terminal, Amber, Carbon, Light)**
- [x] **Template gallery at /templates with search and filtering**
- [x] **ThemeProvider component for dynamic theme switching**
- [x] Skills integrated (nextjs, canvas-design, gemini-image-gen, shadcn-ui)
- [x] lib/utils.ts with cn() helper
- [x] Custom design system utilities (.glass, .terminal-glow, .border-glow)
- [x] SpaceBackground and CircuitBackground components

### 🎯 Template Library Highlights
- **74,515 lines** of production TypeScript/React code
- **95 fully-functional templates** across 18 categories
- **9 specialized dashboards** (Analytics, Sales, DevOps, Finance, Marketing, Support, etc.)
- **4 builder templates** (Form, Survey, Quiz, Email Campaign)
- **Unique interactive experiences** (Terminal Resume, Matrix 404/500 pages)
- **Complete e-commerce flow** (Product → Cart → Checkout → Confirmation)
- **Full authentication suite** (Login, Signup, 2FA, Password Reset, Email Verification)
- **All templates support 4 themes** with instant switching

### 🚧 Next Steps (Portfolio Enhancement)
- [ ] Test all 95 templates for functionality and responsiveness
- [ ] Create featured projects selector (choose 8-12 best templates to showcase)
- [ ] Build portfolio homepage with selected templates
- [ ] Add project data/content structure for portfolio
- [ ] Record/capture TUI app demos with OBS
- [ ] Create hero image with canvas-design skill
- [ ] Implement portfolio About section
- [ ] Implement portfolio Contact section with form
- [ ] SEO optimization for template pages
- [ ] Performance audit across all templates
- [ ] Deploy to Vercel

### 📦 Installed Components (40+)
**Core UI (5):** Card, Badge, Button, Separator, Skeleton
**Navigation (4):** Tabs, Accordion, Carousel, Scroll Area
**Interactive (5):** Dialog, Drawer, Tooltip, Hover Card, Popover
**Forms (7):** Input, Textarea, Select, Checkbox, Radio Group, Switch, Label
**Data Display (8):** Table, Progress, Chart, Avatar, Command, Toggle, ToggleGroup, Kbd
**Feedback (3):** Alert, AlertDialog, Sonner (toasts)
**Layout (3):** Sheet, Collapsible, NavigationMenu
**Motion (5):** Border Trail, Animated Background, Text Morph, Glow Effect, Scroll Progress

All components are pre-styled with the terminal theme and support all 4 theme variants.

## Key Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion API](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [OBS Studio](https://obsproject.com/)

## Notes for Claude

### When Working on This Project
1. **Check skills first** - Use `.claude/skills/` for guidance on Next.js, design, or images
2. **Maintain glassmorphism aesthetic** - Always use the `.glass` utilities or Tailwind's `backdrop-blur-*`
3. **Keep it professional** - Sophisticated, not cartoony
4. **Performance matters** - This is a portfolio to showcase technical ability
5. **Use Server Components** - Default to server, only go client when needed
6. **Follow established patterns** - Check `COMPONENT_EXAMPLES.md` for code snippets

### Common Tasks
- **"Create a project card component"** → Use GlassCard + Framer Motion patterns
- **"Add a new section"** → Server Component with glassmorphic styling
- **"Generate a hero image"** → Invoke canvas-design skill
- **"Optimize an image"** → Use `next/image` with appropriate props
- **"Create a 3D effect"** → Use Framer Motion `whileHover` with perspective

### What Makes This Portfolio Unique
- **TUI projects showcase** - Most portfolios don't have terminal apps
- **Glassmorphism aesthetic** - Modern, eye-catching design
- **Performance-focused** - Next.js 15 + Server Components
- **3D interactions** - Subtle but impressive hover effects
- **Professional execution** - Every detail matters

---

**Last Updated**: 2025-11-22
**Project Type**: Portfolio Website + Template Library
**Target**: Vercel Deployment
**Design Style**: Glassmorphism/3D
**Template Count**: 95 templates (74,515 lines)
