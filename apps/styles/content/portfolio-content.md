# Portfolio Content for Matt M.

## 1. Hero Section

### Tagline
```
From Zero to Deploy: Building with AI at Terminal Velocity
```

**Alternative taglines:**
- "Full Stack Prompt Engineer: Where Strategic Thinking Meets AI-Powered Development"
- "Shipping Real Software in 6 Months—Thanks to Claude Code and Terminal Focus"

### Subtitle
```
Six months ago, I'd never written a line of code. Today, I build production-ready web apps and terminal tools—proving that AI doesn't replace developers, it creates them. Former Program Analyst turned Full Stack Prompt Engineer, combining strategic architecture thinking with Claude Code velocity.
```

---

## 2. About Section

```markdown
### The Journey: Analyst to Engineer in 180 Days

I spent years as a Program Analyst, architecting IT systems and translating requirements into technical specs—but I never wrote the code. Six months ago, that changed. With Claude Code as my pair programmer, I went from zero coding experience to shipping production applications.

My background isn't traditional. I was an EA beta tester for Command & Conquer, achieving top 10 global rankings. That gaming experience taught me something crucial: complex systems are puzzles waiting to be solved. Build orders, resource optimization, split-second strategic decisions—these translate directly to software architecture, state management, and real-time system design.

I call myself a **Full Stack Prompt Engineer** not as a joke, but as a philosophy. I embrace AI-assisted development because it lets me focus on what I'm best at: understanding problems, designing architectures, and shipping solutions. Claude Code handles the syntax gymnastics while I handle the strategy.

My technical interests gravitate toward what I call "power user tools"—terminal UIs built with Go/Bubbletea, browser-based development environments with xterm.js integration, real-time collaborative apps. I love the terminal aesthetic because it strips away the noise and reveals the structure underneath.

This portfolio showcases 45+ projects built in six months. Some are rough experiments. Others are production-ready. All of them represent a belief that **the best time to start building is now**, and the best tools are the ones that multiply your velocity—whether that's AI, the command line, or both.
```

---

## 3. Skills / Tech Stack

### Languages
- **TypeScript** - Primary language for full-stack development
- **JavaScript** - Frontend and Node.js applications
- **Go** - Terminal applications and CLI tools

### Frontend
- **React** - Component architecture and state management
- **Next.js 15** - Server components, App Router, static generation
- **Tailwind CSS** - Rapid UI development with custom design systems
- **Framer Motion** - Complex animations and 3D interactions
- **Canvas API** - Custom visualizations and interactive graphics
- **xterm.js** - Terminal emulation in the browser

### Backend & Infrastructure
- **Supabase** - PostgreSQL, real-time subscriptions, authentication
- **Node.js** - API development and server-side logic
- **Vercel** - Deployment and edge functions
- **Real-time Systems** - WebSocket architecture, live collaboration

### Terminal / CLI
- **Bubbletea** - Interactive terminal UI framework (Go)
- **Lipgloss** - Terminal styling and layout
- **tmux** - Terminal workflow orchestration
- **Unix Tools** - grep, awk, sed, shell scripting

### AI-Assisted Development
- **Claude Code** - Primary development environment
- **Prompt Engineering** - System design through conversation
- **AI Pair Programming** - Iterative development workflow

### Architecture & Design
- **Component Systems** - Reusable UI architecture
- **Design Systems** - Glassmorphism, terminal aesthetics
- **Real-time Architecture** - Event-driven systems
- **Browser-Based IDEs** - Building development tools for the web

---

## 4. Career Highlights Timeline

### 1998-2008: Gaming & Strategic Thinking
- **EA Beta Tester** for Command & Conquer series
- **Top 10 Global Rankings** in competitive RTS games
- Developed deep understanding of:
  - Complex system optimization
  - Resource management under pressure
  - Split-second decision-making patterns
  - Pattern recognition in chaotic environments

### 2008-2024: Program Analyst Role
- **IT Architecture & Systems Analysis**
- Translated business requirements into technical specifications
- Designed enterprise system architectures
- Project management and stakeholder communication
- Built expertise in:
  - Systems thinking and architecture design
  - Technical documentation
  - Cross-functional collaboration
  - Problem decomposition

### May 2024: The Pivot
- **First Line of Code Written**
- Discovered Claude Code as pair programming tool
- Built first project: Simple terminal-based todo app in Go
- Realized AI could bridge the experience gap

### June-August 2024: Foundation Building
- **Learning Phase**: TypeScript, React, Next.js fundamentals
- Built 10+ practice projects (calculators, dashboards, utilities)
- Discovered passion for terminal UIs and Bubbletea framework
- Started developing "Full Stack Prompt Engineering" workflow

### September-October 2024: Production Projects
- **First Production Deploy**: Real-time collaborative tool on Vercel
- Built browser-based terminal emulator with xterm.js
- Shipped multiple Supabase-backed applications
- Developed custom design system (glassmorphism + terminal aesthetic)

### November 2024: Portfolio Milestone
- **45+ Projects Completed** in 6 months
- Mix of web applications (Next.js) and TUI tools (Go/Bubbletea)
- Established unique visual style across all projects
- Created this portfolio to showcase the journey

### Current Focus (2025)
- **Real-time Development Tools**: Browser-based IDEs and collaboration platforms
- **Terminal Applications**: Building sophisticated CLI tools with Go
- **Design Systems**: Perfecting glassmorphic + terminal aesthetic
- **Open Source**: Contributing to Bubbletea/Lipgloss ecosystem
- **Teaching**: Documenting AI-assisted development workflows

---

## 5. SEO Meta Descriptions

### Homepage (155 chars)
```
Matt M. - Full Stack Prompt Engineer. Zero to 45+ projects in 6 months using Claude Code. TypeScript, React, Next.js, Go, and terminal-first development.
```

### About Page (155 chars)
```
From Program Analyst to Full Stack Developer in 6 months with Claude Code. Building production apps, terminal UIs, and embracing AI-assisted development.
```

### Projects Page (155 chars)
```
45+ projects built in 6 months: Next.js web apps, Go terminal tools, real-time systems. See what's possible when AI meets strategic thinking and velocity.
```

### Alternative Shorter Version (145 chars)
```
Matt M.: Program Analyst turned Full Stack Prompt Engineer. 45+ projects in 6 months with Claude Code, TypeScript, React, Next.js, and Go.
```

---

## 6. Additional Content Snippets

### Call-to-Action Phrases
```
"Let's build something together"
"See the full project showcase"
"From strategic thinking to shipping code"
"Explore 45+ projects built with AI velocity"
"Terminal-first. AI-assisted. Production-ready."
```

### Pull Quotes (for design elements)
```
"AI doesn't replace developers—it creates them"
"Strategic gaming thinking translates directly to software architecture"
"Six months. 45+ projects. Zero to production."
"The best time to start building is now"
"Focus on strategy. Let AI handle the syntax."
```

### Social Media / Link Descriptions
```
Full Stack Prompt Engineer | TypeScript • React • Next.js • Go | Building with Claude Code | Former EA Beta Tester → Production Developer in 6 months
```

---

## Usage Notes

### Integrating into React Components

**Hero Component:**
```tsx
<Hero
  tagline="From Zero to Deploy: Building with AI at Terminal Velocity"
  subtitle="Six months ago, I'd never written a line of code. Today, I build production-ready web apps and terminal tools—proving that AI doesn't replace developers, it creates them."
/>
```

**About Component:**
```tsx
<About>
  {/* Use the About Section markdown content */}
  {/* Parse with remark/rehype or use as plain text */}
</About>
```

**Timeline Component:**
```tsx
<Timeline events={[
  {
    year: "1998-2008",
    title: "Gaming & Strategic Thinking",
    description: "EA Beta Tester for Command & Conquer...",
    achievements: ["Top 10 Global Rankings", "Complex system optimization"]
  },
  // ... rest of timeline
]} />
```

**Skills Component:**
```tsx
<SkillsGrid categories={[
  {
    name: "Languages",
    skills: ["TypeScript", "JavaScript", "Go"]
  },
  // ... rest of skills
]} />
```

---

**Content Version:** 1.0
**Last Updated:** 2025-11-22
**Tone:** Authentic, Technical, Enthusiastic
**Target Audience:** Technical recruiters, potential collaborators, fellow developers
