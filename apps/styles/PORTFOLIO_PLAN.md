# Portfolio Development Plan

## Project Overview
Professional portfolio showcasing web projects and TUI applications with a modern glassmorphism/3D design aesthetic.

## Tech Stack

### Core Framework
- **Next.js 15** (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling + glassmorphism utilities
- **Framer Motion** - Smooth animations and 3D transforms

### Optional Enhancements
- **React Three Fiber** - Interactive 3D elements (if needed)
- **shadcn/ui** - Pre-built components with glassmorphism styling
- **react-syntax-highlighter** - Beautiful code snippets

## Design Aesthetic: Glassmorphism/3D

### Key Visual Elements
- Frosted glass effects with `backdrop-filter: blur()`
- Semi-transparent backgrounds with `rgba()`
- Subtle borders and shadows
- 3D depth with `transform: perspective()`
- Smooth hover transitions
- Gradient backgrounds (purple/blue/dark themes)

### Pre-configured Utility Classes
Located in `app/globals.css`:
- `.glass` - Light glassmorphic effect
- `.glass-dark` - Dark glassmorphic effect

## Portfolio Structure

```
/
├── Hero Section
│   └── 3D glassmorphic card with intro
│       - Name/title
│       - Brief tagline
│       - Unique hero art (canvas-design skill)
│
├── About
│   └── Brief professional intro
│       - Background
│       - Interests
│       - Tech philosophy
│
├── Projects
│   ├── Web Applications
│   │   └── Deployed on Vercel
│   │       - Live demo links
│   │       - Screenshots/GIFs
│   │       - Tech stack badges
│   │       - GitHub links
│   │
│   └── TUI/Terminal Applications
│       └── Bubbletea/Lipgloss projects
│           - OBS screen recordings (not asciinema/vhs)
│           - Static screenshots of box art
│           - Code snippets
│           - GitHub links
│           - Installation instructions
│
├── Skills/Tech Stack
│   └── Visual display of technologies
│       - Icons or glassmorphic cards
│       - Categories (Frontend, Backend, Tools, etc.)
│
└── Contact
    └── Links and ways to connect
        - GitHub
        - Email
        - Other platforms
```

## TUI App Recording - IMPORTANT

### Why OBS Instead of asciinema/vhs
**Problem**: Bubbletea/Lipgloss use sophisticated box-drawing characters and styling that break in asciinema and vhs recordings. The beautiful box art doesn't render correctly.

**Solution**: Use OBS (Open Broadcaster Software) for screen recordings
- Captures actual terminal rendering
- Preserves all styling and box art
- Export as MP4 or convert to GIF
- Higher quality but larger file sizes

### OBS Recording Workflow
1. Open TUI app in terminal with good color scheme
2. Configure OBS to capture terminal window
3. Record demo/walkthrough
4. Edit/trim in video editor if needed
5. Export as MP4 for web or convert to GIF
6. Optimize GIF with tools like `gifsicle` or `ffmpeg`

### Alternative: Static Screenshots
For initial version, use high-quality screenshots:
- Multiple states of the TUI
- Show different features/screens
- Annotate with descriptions

## Available Skills

### 1. nextjs
**Location**: `.claude/skills/nextjs/SKILL.md`
**Use for**:
- App Router patterns
- Server/Client component decisions
- Image optimization
- Metadata/SEO
- Data fetching
- Route handlers

### 2. canvas-design
**Location**: `.claude/skills/canvas-design/SKILL.md`
**Use for**:
- Creating unique hero image
- Project section posters
- Abstract background art
- Custom visual assets
- Downloadable PDF/PNG designs

**Workflow**:
1. Creates design philosophy (.md)
2. Expresses visually on canvas (.pdf/.png)
3. Emphasizes craftsmanship and sophistication

### 3. gemini-image-gen
**Location**: `.claude/skills/gemini-image-gen/SKILL.md`
**Use for**:
- Custom project thumbnails
- Unique icons/decorative elements
- Quick visual mockups
- Image editing/composition

**Requires**: `GEMINI_API_KEY` environment variable

## Component Structure

### Planned Components
```
components/
├── Hero.tsx                 # Main hero section with 3D card
├── About.tsx                # About section
├── ProjectCard.tsx          # Reusable project card (glassmorphic)
├── ProjectsGrid.tsx         # Grid layout for projects
├── TUIShowcase.tsx          # Special showcase for TUI apps
├── SkillsDisplay.tsx        # Tech stack visualization
├── Contact.tsx              # Contact section
└── ui/                      # Shared UI components
    ├── GlassCard.tsx
    ├── Button.tsx
    └── Section.tsx
```

## Glassmorphism Implementation Guide

### Example Glass Card
```tsx
<div className="glass rounded-xl p-6 hover:scale-105 transition-transform duration-300">
  <h3 className="text-2xl font-bold mb-2">Project Title</h3>
  <p className="text-white/80">Description...</p>
</div>
```

### 3D Transform Examples
```tsx
// Perspective container
<div className="perspective-1000">
  <div className="transform hover:rotate-y-12 transition-all duration-500">
    {/* Content */}
  </div>
</div>
```

### Color Palette (Glassmorphism Friendly)
- Background: Dark gradients (slate-900, purple-900, indigo-900)
- Glass tint: White/light with low opacity
- Accents: Purple, blue, cyan
- Text: White with varying opacity

## Development Phases

### Phase 1: Foundation ✓
- [x] Next.js setup
- [x] Tailwind + glassmorphism utilities
- [x] Basic layout structure
- [x] Skills integration

### Phase 2: Core Components
- [ ] Hero section with 3D card
- [ ] Navigation
- [ ] Basic layout components
- [ ] Glassmorphic card components

### Phase 3: Content Sections
- [ ] About section
- [ ] Project grid
- [ ] Individual project cards
- [ ] TUI showcase component

### Phase 4: Visual Assets
- [ ] Hero art (canvas-design)
- [ ] Project screenshots
- [ ] TUI recordings (OBS)
- [ ] Icons and graphics

### Phase 5: Interactivity
- [ ] Framer Motion animations
- [ ] Hover effects
- [ ] Scroll animations
- [ ] 3D transforms

### Phase 6: Polish & Deploy
- [ ] SEO metadata
- [ ] Performance optimization
- [ ] Responsive design
- [ ] Deploy to Vercel

## Quick Start

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000`

## Notes

- Keep design sophisticated and professional
- Glassmorphism works best on dark backgrounds with gradients
- Balance 3D effects - don't overdo it
- TUI demos are a unique differentiator - make them shine
- Use OBS for all TUI recordings to preserve box art quality
- Consider loading performance with large video files - optimize or use lazy loading

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Glassmorphism CSS Generator](https://hype4.academy/tools/glassmorphism-generator)
- [OBS Studio](https://obsproject.com/)
