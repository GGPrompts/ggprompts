# Component Examples

Quick reference for building portfolio components with glassmorphism and 3D effects.

## GlassCard Component

### Basic Usage
```tsx
import GlassCard from '@/components/ui/GlassCard';

<GlassCard>
  <h3>Content here</h3>
</GlassCard>
```

### With 3D Hover Effect
```tsx
<GlassCard hover3d>
  <h3>Lifts on hover</h3>
</GlassCard>
```

### Dark Variant
```tsx
<GlassCard variant="dark">
  <h3>Darker glass effect</h3>
</GlassCard>
```

## Framer Motion Examples

### Fade In
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Slide Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Stagger Children
```tsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="show"
>
  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
    Item 1
  </motion.div>
  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
    Item 2
  </motion.div>
</motion.div>
```

### Hover Scale
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
>
  Hover me
</motion.div>
```

### 3D Rotation
```tsx
<motion.div
  style={{ perspective: 1000 }}
  whileHover={{ rotateY: 10, rotateX: -5 }}
  transition={{ duration: 0.3 }}
>
  3D effect
</motion.div>
```

## Project Card Example

```tsx
'use client';

import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
}

export default function ProjectCard({
  title,
  description,
  tags,
  image,
  demoUrl,
  githubUrl
}: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard variant="dark" className="overflow-hidden">
        {/* Image */}
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-white/70 mb-4">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 text-sm glass rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {demoUrl && (
            <a
              href={demoUrl}
              className="px-4 py-2 glass rounded-lg hover:scale-105 transition-transform"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              className="px-4 py-2 glass rounded-lg hover:scale-105 transition-transform"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
```

## TUI Showcase Example

```tsx
'use client';

import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';

interface TUIProjectProps {
  title: string;
  description: string;
  demoVideo: string; // OBS recording
  githubUrl: string;
  installation: string;
}

export default function TUIProject({
  title,
  description,
  demoVideo,
  githubUrl,
  installation
}: TUIProjectProps) {
  return (
    <GlassCard variant="dark">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="text-green-400">$</span>
        {title}
      </h3>

      {/* OBS Recording */}
      <div className="mb-4 rounded-lg overflow-hidden bg-black/50">
        <video
          src={demoVideo}
          controls
          loop
          className="w-full"
        />
      </div>

      <p className="text-white/70 mb-4">{description}</p>

      {/* Installation */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-purple-400">Installation</h4>
        <code className="block p-3 bg-black/30 rounded text-sm font-mono">
          {installation}
        </code>
      </div>

      {/* GitHub Link */}
      <a
        href={githubUrl}
        className="inline-block px-4 py-2 glass rounded-lg hover:scale-105 transition-transform"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on GitHub
      </a>
    </GlassCard>
  );
}
```

## Grid Layout Example

```tsx
'use client';

import { motion } from 'framer-motion';

export default function ProjectsGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}
```

## Gradient Text

```tsx
<h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
  Gradient Text
</h1>
```

## Custom Glassmorphism

If you need custom glass effects beyond the utilities:

```tsx
<div className="
  bg-white/10
  backdrop-blur-lg
  rounded-xl
  border border-white/20
  shadow-xl
  p-6
">
  Custom glass
</div>
```

## 3D Perspective Container

```tsx
<div className="perspective-[1000px]">
  <motion.div
    className="transform-3d"
    whileHover={{
      rotateY: 15,
      rotateX: -5,
    }}
  >
    Content with 3D effect
  </motion.div>
</div>
```

Add to `globals.css` for the utility:
```css
.perspective-1000 {
  perspective: 1000px;
}

.transform-3d {
  transform-style: preserve-3d;
}
```

## Scroll Animations

Using Framer Motion with scroll triggers:

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ScrollSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
    >
      Content that fades and moves with scroll
    </motion.div>
  );
}
```
