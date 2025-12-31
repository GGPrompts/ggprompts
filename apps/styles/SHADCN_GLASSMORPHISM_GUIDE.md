# shadcn/ui + Glassmorphism Integration Guide

Quick guide for using shadcn/ui components with your glassmorphism aesthetic.

## Setup

```bash
cd /home/matt/projects/my-portfolio
npx shadcn@latest init
```

**Configuration choices:**
- TypeScript? **Yes**
- Style? **Default** or **New York** (either works)
- Base color? **Slate** (matches your dark theme)
- CSS variables? **Yes**
- Tailwind config? **tailwind.config.js**
- Components location? **components**
- Utils location? **lib/utils**

## Essential Components for Portfolio

### 1. Card Component
Perfect for project cards with glassmorphism.

```bash
npx shadcn@latest add card
```

**Basic usage:**
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

<Card className="glass border-white/20">
  <CardHeader>
    <CardTitle>Project Name</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Project details...</p>
  </CardContent>
</Card>
```

**With Framer Motion:**
```tsx
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<motion.div
  whileHover={{ scale: 1.05, rotateY: 5 }}
  transition={{ duration: 0.3 }}
>
  <Card className="glass-dark border-white/20 backdrop-blur-lg">
    <CardHeader>
      <CardTitle className="text-white">Project Title</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-white/80">Description</p>
    </CardContent>
  </Card>
</motion.div>
```

### 2. Badge Component
For technology tags.

```bash
npx shadcn@latest add badge
```

**Usage:**
```tsx
import { Badge } from "@/components/ui/badge"

<div className="flex flex-wrap gap-2">
  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
    Next.js
  </Badge>
  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
    TypeScript
  </Badge>
  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
    Tailwind
  </Badge>
</div>
```

### 3. Button Component
For CTAs and actions.

```bash
npx shadcn@latest add button
```

**Glassmorphic buttons:**
```tsx
import { Button } from "@/components/ui/button"

{/* Glass effect button */}
<Button className="glass hover:glass-dark border-white/20">
  View Project
</Button>

{/* Gradient button */}
<Button className="bg-gradient-to-r from-purple-500 to-pink-500 border-0">
  Get in Touch
</Button>

{/* Ghost button */}
<Button variant="ghost" className="text-white hover:bg-white/10">
  Learn More
</Button>
```

### 4. Dialog Component
For project details modal.

```bash
npx shadcn@latest add dialog
```

**Usage:**
```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<Dialog>
  <DialogTrigger asChild>
    <Button className="glass">View Details</Button>
  </DialogTrigger>
  <DialogContent className="glass-dark border-white/20 backdrop-blur-xl">
    <DialogHeader>
      <DialogTitle className="text-white">Project Details</DialogTitle>
      <DialogDescription className="text-white/70">
        Full project information
      </DialogDescription>
    </DialogHeader>
    {/* Project content */}
  </DialogContent>
</Dialog>
```

### 5. Skeleton Component
For loading states.

```bash
npx shadcn@latest add skeleton
```

**Usage:**
```tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

<Card className="glass-dark border-white/20">
  <CardHeader>
    <Skeleton className="h-6 w-3/4 bg-white/10" />
    <Skeleton className="h-4 w-1/2 bg-white/10" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-40 w-full bg-white/10" />
  </CardContent>
</Card>
```

### 6. Tabs Component
For organizing projects.

```bash
npx shadcn@latest add tabs
```

**Usage:**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="web" className="w-full">
  <TabsList className="glass-dark border-white/20">
    <TabsTrigger value="web" className="data-[state=active]:bg-white/20">
      Web Apps
    </TabsTrigger>
    <TabsTrigger value="tui" className="data-[state=active]:bg-white/20">
      TUI Apps
    </TabsTrigger>
  </TabsList>
  <TabsContent value="web">
    {/* Web projects grid */}
  </TabsContent>
  <TabsContent value="tui">
    {/* TUI projects grid */}
  </TabsContent>
</Tabs>
```

## Complete Project Card Example

```tsx
'use client'

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl?: string
  githubUrl?: string
}

export function ProjectCard({ title, description, image, tags, demoUrl, githubUrl }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, rotateY: 2 }}
      transition={{ duration: 0.3 }}
      style={{ perspective: 1000 }}
    >
      <Card className="glass-dark border-white/20 backdrop-blur-lg overflow-hidden">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>

        {/* Content */}
        <CardHeader>
          <CardTitle className="text-white text-xl">{title}</CardTitle>
          <CardDescription className="text-white/70">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-purple-500/20 text-purple-300 border-purple-500/30"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          {demoUrl && (
            <Button
              asChild
              className="glass hover:glass-dark border-white/20 flex-1"
            >
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Demo
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button
              asChild
              variant="outline"
              className="border-white/20 hover:bg-white/10 flex-1"
            >
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Code
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
```

## Customizing shadcn Components

Since shadcn components live in your codebase, you can customize them directly!

### Example: Custom Card Styles

Edit `components/ui/card.tsx`:

```tsx
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Default styles
      "rounded-xl border bg-card text-card-foreground shadow",
      // Add your default glassmorphism
      "backdrop-blur-md bg-white/10 border-white/20",
      className
    )}
    {...props}
  />
))
```

Now every `<Card>` automatically has glassmorphism!

## Color Customization

Update your `globals.css` to match shadcn with your palette:

```css
@layer base {
  :root {
    --background: 222.2 84% 4.9%; /* Dark slate */
    --foreground: 210 40% 98%; /* White */
    --primary: 271.5 81.3% 55.9%; /* Purple */
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%; /* Dark blue */
    --secondary-foreground: 210 40% 98%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 271.5 81.3% 55.9%; /* Purple */
    --radius: 0.75rem; /* Rounded corners */
  }
}
```

## Quick Start Checklist

- [ ] Run `npx shadcn@latest init`
- [ ] Add essential components: `card button badge dialog skeleton tabs`
- [ ] Customize default Card styles for glassmorphism
- [ ] Update color variables in `globals.css`
- [ ] Test components with `.glass` and `.glass-dark` utilities
- [ ] Integrate with Framer Motion for animations
- [ ] Add lucide-react icons: `npm install lucide-react`

## Useful shadcn Commands

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add single component
npx shadcn@latest add card

# Add multiple components
npx shadcn@latest add card button badge dialog

# List available components
npx shadcn@latest add

# Update component
npx shadcn@latest add card --overwrite
```

## Tips

1. **Always add className props** - shadcn components accept className for easy customization
2. **Use asChild pattern** - For wrapping Next.js Link or other components
3. **Combine with Framer Motion** - Wrap shadcn components in motion.div
4. **Icons from lucide-react** - Perfectly sized for shadcn components
5. **Dark mode works automatically** - Components adapt to dark mode
6. **Form validation is built-in** - Use with React Hook Form + Zod

## Resources

- shadcn/ui docs: https://ui.shadcn.com
- Component examples: https://ui.shadcn.com/examples
- Skill file: `.claude/skills/shadcn-ui/SKILL.md`
