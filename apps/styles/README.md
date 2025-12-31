# My Portfolio

A modern, professional portfolio showcasing 45 projects built over 6 months - featuring web applications and Terminal User Interface (TUI) projects with a terminal-inspired glassmorphism design aesthetic.

## Features

- **Terminal-themed design** - Matrix-style green/cyan color scheme with phosphor glow effects
- **Comprehensive component library** - 29 shadcn/ui components + motion primitives
- **Live style guide** - Full component showcase at `/styleguide`
- **Dual project types** - Web apps (Vercel deployments) and TUI applications (Bubbletea/Lipgloss)
- **Professional typography** - JetBrains Mono for headings, Inter for body
- **Advanced animations** - Framer Motion + motion-primitives for smooth interactions
- **MCP integration** - shadcn MCP for enhanced development workflow

## Tech Stack

### Core Framework
- **Next.js 15** (App Router) - Server Components, static generation, image optimization
- **TypeScript** - Type safety throughout
- **React 19** - Latest React features

### Styling & Design
- **Tailwind CSS v3** - Utility-first CSS with custom terminal theme
- **shadcn/ui** - 29+ accessible, customizable UI components
- **Framer Motion** - 3D transforms and animations
- **Motion Primitives** - Advanced animation effects (border trails, glow effects, text morphing)

### Fonts
- **JetBrains Mono** - Monospace font for headings and terminal aesthetic
- **Inter** - Clean sans-serif for body text

### Development Tools
- **shadcn MCP** - Model Context Protocol integration for component management
- **Claude Code Skills** - nextjs, canvas-design, gemini-image-gen, shadcn-ui

### Deployment
- **Vercel** - Optimized for Next.js with automatic deployments

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## Project Structure

```
my-portfolio/
├── app/
│   ├── layout.tsx              # Root layout with fonts
│   ├── page.tsx                # Home page
│   ├── globals.css             # Terminal theme + glassmorphism utilities
│   └── styleguide/
│       └── page.tsx            # Component showcase
├── components/
│   ├── Hero.tsx                # Hero section
│   └── ui/                     # shadcn/ui components (29 total)
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── dialog.tsx
│       ├── border-trail.tsx    # Motion primitive
│       ├── glow-effect.tsx     # Motion primitive
│       └── ...                 # + 22 more components
├── lib/
│   └── utils.ts                # cn() utility for className merging
├── public/                     # Static assets
├── .claude/
│   └── skills/                 # Development skills
│       ├── nextjs/
│       ├── canvas-design/
│       ├── gemini-image-gen/
│       └── shadcn-ui/
├── .mcp.json                   # MCP server configuration
├── components.json             # shadcn/ui configuration
└── CLAUDE.md                   # Project context for Claude
```

## Development Plan

See [PORTFOLIO_PLAN.md](./PORTFOLIO_PLAN.md) for detailed:
- Design specifications
- Component architecture
- Development phases
- TUI recording guidelines (OBS workflow)
- Available skills and resources

## TUI App Showcase

This portfolio includes a special section for Terminal User Interface (TUI) applications built with Bubbletea/Lipgloss. These demos are recorded using OBS Studio to preserve the sophisticated box-drawing characters and styling that break in traditional terminal recorders.

## Design System

### Color Scheme (Terminal Theme)
- **Primary**: Terminal green/cyan (`hsl(160 84% 39%)`)
- **Secondary**: Teal accent (`hsl(173 80% 40%)`)
- **Background**: Very dark slate/black (`hsl(220 13% 5%)`)
- **Foreground**: Light cyan-white (`hsl(160 84% 95%)`)
- **Border**: Cyan border with glow (`hsl(160 60% 25%)`)

### Custom Utilities
- `.glass` - Light glassmorphic background with blur
- `.glass-dark` - Dark glassmorphic background with blur
- `.terminal-glow` - Phosphor-style text glow effect
- `.border-glow` - Glowing cyan border effect

### Components Available
**Core UI (5)**
- Card, Badge, Button, Separator, Skeleton

**Navigation (4)**
- Tabs, Accordion, Carousel, Scroll Area

**Interactive (5)**
- Dialog, Drawer, Tooltip, Hover Card, Popover

**Forms (7)**
- Input, Textarea, Select, Checkbox, Radio Group, Switch, Label

**Motion Primitives (5)**
- Border Trail, Animated Background, Text Morph, Glow Effect, Scroll Progress

View all components with examples at `/styleguide`

## Skills Integration

This project uses Claude Code skills for enhanced development:
- **nextjs**: Next.js best practices and patterns
- **canvas-design**: Creating unique visual art and hero images
- **gemini-image-gen**: Generating custom visual assets
- **shadcn-ui**: Component library integration and customization

## MCP Integration

shadcn MCP server is configured in `.mcp.json` for:
- Component browsing and search
- Adding components via MCP tools
- Accessing component examples and documentation
- Managing custom registries (e.g., @motion-primitives)

## License

MIT
