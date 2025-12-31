# Portfolio Content Usage Examples

This guide shows how to use the portfolio content data in your React components.

## Files Created

1. `/content/portfolio-content.md` - Full markdown content reference
2. `/lib/portfolio-data.ts` - Structured TypeScript data (use this in components)

## Quick Start Examples

### 1. Hero Section

```tsx
// app/page.tsx or components/Hero.tsx
import { hero } from '@/lib/portfolio-data';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="glass p-12 max-w-4xl">
        <h1 className="text-5xl font-bold terminal-glow mb-6">
          {hero.tagline}
        </h1>
        <p className="text-xl text-foreground/80">
          {hero.subtitle}
        </p>
      </div>
    </section>
  );
}
```

### 2. About Section

```tsx
// components/About.tsx
'use client';

import { about } from '@/lib/portfolio-data';
import { motion } from 'framer-motion';

export function About() {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="glass-dark p-8 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-6 terminal-glow">
          {about.title}
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            number={about.stats.monthsLearning}
            label="Months Learning"
          />
          <StatCard
            number={`${about.stats.projectsCompleted}+`}
            label="Projects"
          />
          <StatCard
            text={about.stats.primaryTool}
            label="Primary Tool"
          />
          <StatCard
            text={about.stats.previousRole}
            label="Previous Role"
          />
        </div>

        {/* Content - can be split into paragraphs */}
        <div className="prose prose-invert max-w-none">
          {about.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-4 text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function StatCard({ number, text, label }: {
  number?: number | string;
  text?: string;
  label: string
}) {
  return (
    <div className="glass p-4 text-center">
      <div className="text-2xl font-bold text-primary">
        {number || text}
      </div>
      <div className="text-sm text-foreground/60">{label}</div>
    </div>
  );
}
```

### 3. Skills Grid

```tsx
// components/Skills.tsx
'use client';

import { skills, getAllSkills } from '@/lib/portfolio-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function Skills() {
  return (
    <section className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12 terminal-glow">
        Tech Stack
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(skills).map((category, idx) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass-dark p-6 h-full">
              <h3 className="text-xl font-bold mb-4 text-primary">
                {category.title}
              </h3>
              <div className="space-y-3">
                {category.items.map((skill) => (
                  <div key={skill.name}>
                    <div className="font-semibold text-foreground">
                      {skill.name}
                    </div>
                    <div className="text-sm text-foreground/60">
                      {skill.description}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Alternative: Badge-based skills display
export function SkillsBadges() {
  const allSkills = getAllSkills();

  return (
    <div className="flex flex-wrap gap-2">
      {allSkills.map((skill) => (
        <Badge
          key={skill.name}
          variant="outline"
          className="border-primary/40 text-primary"
        >
          {skill.name}
        </Badge>
      ))}
    </div>
  );
}
```

### 4. Timeline Component

```tsx
// components/Timeline.tsx
'use client';

import { timeline, getMilestones } from '@/lib/portfolio-data';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export function Timeline() {
  return (
    <section className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12 terminal-glow">
        Career Journey
      </h2>

      <div className="max-w-4xl mx-auto">
        {timeline.map((event, idx) => (
          <motion.div
            key={event.period}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="mb-8 relative"
          >
            {/* Timeline line */}
            {idx < timeline.length - 1 && (
              <div className="absolute left-0 top-12 w-px h-full bg-primary/20" />
            )}

            <div className="flex gap-6">
              {/* Period marker */}
              <div className="flex-shrink-0 w-32">
                <Badge
                  variant={event.milestone || event.current ? "default" : "outline"}
                  className="border-primary/40"
                >
                  {event.period}
                </Badge>
              </div>

              {/* Content */}
              <div className="glass-dark p-6 flex-1">
                <h3 className="text-xl font-bold mb-2 text-primary">
                  {event.title}
                </h3>
                <p className="text-foreground/80 mb-4">
                  {event.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 text-sm text-foreground/70">
                  {event.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">▸</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Project count */}
                {event.projectCount && (
                  <div className="mt-4 pt-4 border-t border-primary/20">
                    <span className="text-2xl font-bold text-primary">
                      {event.projectCount}+
                    </span>
                    <span className="text-sm text-foreground/60 ml-2">
                      projects completed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Compact version - milestones only
export function MilestonesTimeline() {
  const milestones = getMilestones();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {milestones.map((milestone) => (
        <div key={milestone.period} className="glass p-4 text-center">
          <div className="text-sm text-primary mb-2">{milestone.period}</div>
          <div className="font-bold">{milestone.title}</div>
        </div>
      ))}
    </div>
  );
}
```

### 5. SEO Metadata

```tsx
// app/layout.tsx
import { seo } from '@/lib/portfolio-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: seo.homepage.title,
  description: seo.homepage.description,
  keywords: seo.homepage.keywords,
  openGraph: {
    title: seo.homepage.title,
    description: seo.homepage.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.homepage.title,
    description: seo.homepage.description,
  },
};

// app/about/page.tsx
import { seo } from '@/lib/portfolio-data';

export const metadata = {
  title: seo.about.title,
  description: seo.about.description,
};

// app/projects/page.tsx
import { seo } from '@/lib/portfolio-data';

export const metadata = {
  title: seo.projects.title,
  description: seo.projects.description,
};
```

### 6. Pull Quotes / Testimonials

```tsx
// components/PullQuote.tsx
import { pullQuotes } from '@/lib/portfolio-data';

export function PullQuotes() {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pullQuotes.map((quote, idx) => (
          <div key={idx} className="glass-dark p-8">
            <blockquote className="text-2xl font-bold text-primary italic">
              "{quote}"
            </blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}

// Or use as rotating quote in hero
export function RotatingQuote() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % pullQuotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-xl text-primary italic terminal-glow">
      "{pullQuotes[index]}"
    </div>
  );
}
```

### 7. Call to Action Buttons

```tsx
// components/CTA.tsx
import { callsToAction } from '@/lib/portfolio-data';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 text-center">
      <div className="glass-dark p-12 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 terminal-glow">
          {callsToAction[0]}
        </h2>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="border-glow">
            View Projects
          </Button>
          <Button size="lg" variant="outline" className="border-primary/40">
            Contact Me
          </Button>
        </div>
      </div>
    </section>
  );
}
```

### 8. Social Bio (for footer/header)

```tsx
// components/Footer.tsx
import { socialBio } from '@/lib/portfolio-data';

export function Footer() {
  return (
    <footer className="py-12 border-t border-primary/20">
      <div className="text-center">
        <p className="text-sm text-foreground/60 mb-4">
          {socialBio}
        </p>
        {/* Social links */}
      </div>
    </footer>
  );
}
```

## Complete Page Example

```tsx
// app/page.tsx
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Timeline } from '@/components/Timeline';
import { PullQuotes } from '@/components/PullQuote';
import { CTASection } from '@/components/CTA';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Timeline />
      <PullQuotes />
      <CTASection />
    </main>
  );
}
```

## Helper Functions

The data file includes helper functions:

```tsx
import {
  getAllSkills,      // Get all skills as flat array
  getMilestones,     // Get timeline milestones only
  getTotalProjects   // Calculate total projects from timeline
} from '@/lib/portfolio-data';

// Example usage
const allSkills = getAllSkills(); // Array of all skills with category info
const milestones = getMilestones(); // Just the major milestones
const projectCount = getTotalProjects(); // Total number (55 from timeline data)
```

## Markdown Rendering

If you want to render the markdown content directly:

```bash
npm install react-markdown remark-gfm
```

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { about } from '@/lib/portfolio-data';

export function AboutMarkdown() {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-invert max-w-none"
    >
      {about.content}
    </ReactMarkdown>
  );
}
```

## Tips

1. **Type Safety**: All data is typed with `as const`, giving you autocomplete and type checking
2. **Modularity**: Import only what you need for each component
3. **Easy Updates**: Change content in one place (`portfolio-data.ts`)
4. **SEO**: Use the `seo` object for all metadata
5. **Consistency**: Use pull quotes and CTAs throughout the site

## Next Steps

1. Create components based on these examples
2. Add your actual project data to a similar structure
3. Customize the styling to match your glassmorphism theme
4. Add animations with Framer Motion
5. Deploy to Vercel

---

**All content is production-ready and optimized for your terminal-themed glassmorphic portfolio.**
