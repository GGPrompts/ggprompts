# Projects Data Usage Guide

This guide shows how to use the researched project data in your portfolio components.

## Files Created

1. **`/home/user/my-portfolio/project-data-research.json`**
   - Complete JSON with all research data
   - Use for reference and data analysis

2. **`/home/user/my-portfolio/PORTFOLIO_PROJECT_SUMMARY.md`**
   - Human-readable summary with recommendations
   - Portfolio copy examples and messaging strategies

3. **`/home/user/my-portfolio/lib/projects-data.ts`**
   - TypeScript data structure ready for Next.js
   - Import directly into components

## Quick Start: Using in Components

### 1. Import the Data

```tsx
import {
  featuredProjects,
  tuiProjects,
  webProjects,
  allProjects,
  portfolioStats,
  getProjectById,
  getFeaturedProjects
} from '@/lib/projects-data';
```

### 2. Featured Projects Grid Component

```tsx
// components/FeaturedProjects.tsx
'use client';

import { featuredProjects } from '@/lib/projects-data';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FeaturedProjects() {
  return (
    <section className="py-20">
      <h2 className="text-4xl font-bold mb-12 terminal-glow">Featured Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass border-white/20 p-6 h-full hover:scale-105 transition-transform">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-primary">{project.name}</h3>
                {project.stats?.stars && (
                  <Badge variant="secondary" className="ml-2">
                    ⭐ {project.stats.stars}
                  </Badge>
                )}
              </div>

              {/* Tagline */}
              <p className="text-lg font-semibold text-cyan-400 mb-3">
                {project.tagline}
              </p>

              {/* Description */}
              <p className="text-muted-foreground mb-4">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Key Features (first 3) */}
              <ul className="space-y-1 mb-4 text-sm">
                {project.keyFeatures.slice(0, 3).map((feature, i) => (
                  <li key={i} className="text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">▸</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Links */}
              <div className="flex gap-3 mt-auto pt-4">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-cyan-400 transition-colors"
                  >
                    {link.type === 'github' ? 'GitHub →' : link.label}
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

### 3. TUI Showcase Section

```tsx
// components/TUIShowcase.tsx
'use client';

import { getTUIProjects } from '@/lib/projects-data';
import { Card } from '@/components/ui/card';

export default function TUIShowcase() {
  const projects = getTUIProjects();

  return (
    <section className="py-20">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4 terminal-glow">Terminal Applications</h2>
        <p className="text-xl text-muted-foreground">
          Beautiful, functional TUIs built with Go and Bubbletea
        </p>
      </div>

      {/* Terminal-themed display */}
      <div className="glass-dark border border-primary/30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-primary/20">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-sm text-primary/60 font-mono">
            ~/projects/tui-applications
          </span>
        </div>

        <div className="grid gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="glass border-primary/20 p-5 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-2 font-mono">
                    $ {project.name.toLowerCase()}
                  </h3>
                  <p className="text-muted-foreground mb-3">{project.tagline}</p>

                  {/* First 2 key features */}
                  <ul className="space-y-1">
                    {project.keyFeatures.slice(0, 2).map((feature, i) => (
                      <li key={i} className="text-sm text-foreground/80 font-mono">
                        <span className="text-green-500">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech stack badges */}
                <div className="flex flex-col gap-1 ml-4">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 4. Portfolio Stats Component

```tsx
// components/PortfolioStats.tsx
import { portfolioStats } from '@/lib/projects-data';

export default function PortfolioStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12">
      <div className="glass border-white/20 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-primary terminal-glow">
          {portfolioStats.totalProjects}
        </div>
        <div className="text-sm text-muted-foreground mt-2">Total Projects</div>
      </div>

      <div className="glass border-white/20 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-primary terminal-glow">
          {portfolioStats.totalStars}+
        </div>
        <div className="text-sm text-muted-foreground mt-2">GitHub Stars</div>
      </div>

      <div className="glass border-white/20 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-primary terminal-glow">
          {portfolioStats.categories['TUI Application'] +
           portfolioStats.categories['Game']}
        </div>
        <div className="text-sm text-muted-foreground mt-2">TUI Apps</div>
      </div>

      <div className="glass border-white/20 rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-primary terminal-glow">
          43.7%
        </div>
        <div className="text-sm text-muted-foreground mt-2">Cost Reduction</div>
      </div>
    </div>
  );
}
```

### 5. Project Detail Modal

```tsx
// components/ProjectDetailModal.tsx
'use client';

import { Project } from '@/lib/projects-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectDetailModalProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectDetailModal({
  project,
  open,
  onOpenChange,
}: ProjectDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{project.name}</DialogTitle>
            {project.stats?.stars && (
              <Badge variant="secondary">⭐ {project.stats.stars}</Badge>
            )}
          </div>
          <p className="text-lg text-primary">{project.tagline}</p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Key Features</h3>
            <ul className="space-y-2">
              {project.keyFeatures.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-primary mr-2">▸</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Highlights</h3>
              <ul className="space-y-2">
                {project.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span className="text-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
              >
                {link.type === 'github' ? 'View on GitHub' : link.label}
              </a>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
```

### 6. All Projects with Filtering

```tsx
// components/AllProjects.tsx
'use client';

import { useState } from 'react';
import { allProjects, Project } from '@/lib/projects-data';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function AllProjects() {
  const categories = [
    'All',
    'Developer Tools',
    'TUI Application',
    'Web Application',
    'Browser Extension',
    'Template',
    'Game',
  ] as const;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredProjects =
    selectedCategory === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-20">
      <h2 className="text-4xl font-bold mb-8 terminal-glow">All Projects</h2>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="glass mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Tabs>
    </section>
  );
}
```

## Helper Functions

### Get Project by ID

```tsx
import { getProjectById } from '@/lib/projects-data';

const project = getProjectById('claude-global-commands');
if (project) {
  console.log(project.name); // "ClaudeGlobalCommands"
}
```

### Filter by Category

```tsx
import { getProjectsByCategory } from '@/lib/projects-data';

const tuiApps = getProjectsByCategory('TUI Application');
console.log(tuiApps.length); // Number of TUI applications
```

### Get Collections

```tsx
import {
  getFeaturedProjects,
  getTUIProjects,
  getWebProjects
} from '@/lib/projects-data';

const featured = getFeaturedProjects(); // 6 featured projects
const tui = getTUIProjects(); // All TUI projects including featured ones
const web = getWebProjects(); // All web projects including featured ones
```

## Next Steps

1. **Create Screenshots/Recordings**
   - Use OBS Studio for TUI applications
   - Save to `/home/user/my-portfolio/public/screenshots/`
   - Update `screenshots` field in project data

2. **Add to `projects-data.ts`:**
   ```tsx
   screenshots: [
     '/screenshots/tfe-main.png',
     '/screenshots/tfe-prompts.png',
   ],
   ```

3. **Display in Components:**
   ```tsx
   {project.screenshots?.map((screenshot) => (
     <Image
       key={screenshot}
       src={screenshot}
       alt={`${project.name} screenshot`}
       width={800}
       height={600}
     />
   ))}
   ```

## Example: Complete Page

```tsx
// app/projects/page.tsx
import FeaturedProjects from '@/components/FeaturedProjects';
import TUIShowcase from '@/components/TUIShowcase';
import AllProjects from '@/components/AllProjects';
import PortfolioStats from '@/components/PortfolioStats';

export default function ProjectsPage() {
  return (
    <main className="container mx-auto px-4">
      <PortfolioStats />
      <FeaturedProjects />
      <TUIShowcase />
      <AllProjects />
    </main>
  );
}
```

## Portfolio Messaging

Use these proven highlights from the research:

### Hero Section
- "43.7% cost reduction in AI workflows"
- "100+ terminal fonts with multi-language export"
- "140+ GitHub stars across 22 projects"

### About Section
- "Specializing in terminal user interfaces and browser-based terminal emulation"
- "Deep expertise in Go, TypeScript, and cross-platform development"
- "Building developer productivity tools that make a measurable impact"

### Skills Tags
```tsx
const skills = [
  'Go', 'TypeScript', 'React', 'Next.js',
  'Bubbletea', 'Lipgloss', 'xterm.js', 'tmux',
  'Node.js', 'WebSocket', 'Rust', 'Tauri',
];
```

---

**Ready to build your portfolio!** All the data is structured and ready to import. Start with the Featured Projects grid and expand from there.
