'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, MessageSquare, Users, Newspaper, ArrowRight, Code, Lightbulb, Palette, Briefcase, Terminal, Zap, TrendingUp } from 'lucide-react'
import { AnimatedHeroSection } from '@/components/ui/animated-hero-section'
import { NewsBanner } from '@/components/news-banner'
import { FloatingCard } from '@/components/ui/floating-card'
import { BorderTrail } from '@/components/ui/border-trail'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Sparkles,
    title: 'Curated Prompts',
    description: 'Access a library of high-quality, production-ready AI prompts crafted by the community.',
    href: '/prompts',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Newspaper,
    title: 'Daily AI News',
    description: 'Stay updated with AI-curated news from the coding tools ecosystem, updated daily.',
    href: '/news',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageSquare,
    title: 'Community Forums',
    description: 'Join discussions, share techniques, and learn from other prompt engineers.',
    href: '/forums',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: Users,
    title: 'User Profiles',
    description: 'Build your reputation, track your contributions, and showcase your best prompts.',
    href: '/profile',
    color: 'from-orange-500 to-amber-500',
  },
]

const categories = [
  { name: 'Development', value: 'development-code', icon: Code },
  { name: 'Creative', value: 'creative-marketing', icon: Palette },
  { name: 'Productivity', value: 'productivity-workflow', icon: Lightbulb },
  { name: 'Business', value: 'business-strategy', icon: Briefcase },
  { name: 'Writing', value: 'writing-content', icon: MessageSquare },
]

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function LandingPageClient() {
  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.98])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const [isMounted, setIsMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="flex flex-col relative">
      {/* Animated background particles */}
      {isMounted && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              animate={{
                x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              }}
              transition={{
                duration: Math.random() * 20 + 25,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Section with scroll parallax */}
      <motion.section
        className="relative py-20 md:py-32 overflow-hidden"
        style={{ scale: heroScale }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            style={{ opacity: heroOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Prompt Engineering Platform
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="gradient-text-theme animate-gradient">
                Discover, Create & Share
              </span>
              <br />
              <span className="gradient-text-theme animate-gradient">
                Perfect AI Prompts
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join a community of prompt engineers. Access curated prompts, share your creations,
              and master the art of communicating with AI.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button size="lg" className="gap-2 group" asChild>
                <Link href="/prompts">
                  <Sparkles className="w-5 h-5" />
                  Explore Prompts
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10" asChild>
                <Link href="/forums">
                  <MessageSquare className="w-5 h-5" />
                  Join Community
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.section>

      {/* Animated Visualization Section */}
      <AnimatedHeroSection />

      {/* Today in AI Banner */}
      <NewsBanner />

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Prompts', value: 500, icon: Sparkles, suffix: '+' },
              { label: 'Community Members', value: 2500, icon: Users, suffix: '+' },
              { label: 'Daily Visitors', value: 1000, icon: TrendingUp, suffix: '+' },
              { label: 'Tools Covered', value: 25, icon: Terminal, suffix: '+' },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FloatingCard>
                    <Card className="glass border-primary/20 p-4 text-center">
                      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl md:text-3xl font-bold text-primary">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                    </Card>
                  </FloatingCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Link
                  href={`/prompts?category=${category.value}`}
                  className="glass px-6 py-3 rounded-full flex items-center gap-3 hover:border-primary/50 transition-colors group border border-border/50"
                >
                  <category.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{category.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for prompt engineers, by prompt engineers. All the tools you need to create
              and share amazing AI interactions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={feature.href}>
                  <FloatingCard>
                    <Card className="glass border-border/50 hover:border-primary/30 transition-all h-full group relative overflow-hidden">
                      <BorderTrail
                        className={cn('bg-gradient-to-r', feature.color)}
                        size={80}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      />
                      <CardHeader>
                        <motion.div
                          className={cn(
                            'w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-primary/20',
                            'bg-gradient-to-br',
                            feature.color
                          )}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <feature.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </FloatingCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Claude Code CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <FloatingCard>
              <Card className="glass border-primary/20 overflow-hidden relative">
                <BorderTrail
                  className="bg-gradient-to-r from-primary via-secondary to-primary"
                  size={100}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                      <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                        <Terminal className="w-3 h-3 mr-1" />
                        New Feature
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Claude Code Marketplace
                      </h2>
                      <p className="text-muted-foreground mb-6 max-w-xl">
                        Browse and install skills, agents, commands, and hooks to supercharge your Claude Code experience.
                        One-click install directly to your Claude Code setup.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button size="lg" className="gap-2 group" asChild>
                          <Link href="/claude-code">
                            <Zap className="w-5 h-5" />
                            Explore Marketplace
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <motion.div
                      className="w-32 h-32 md:w-40 md:h-40 relative"
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-xl" />
                      <div className="relative w-full h-full glass rounded-2xl flex items-center justify-center border border-primary/30">
                        <Terminal className="w-16 h-16 md:w-20 md:h-20 text-primary" />
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="glass-dark border-primary/20 max-w-3xl mx-auto">
              <CardContent className="p-8 md:p-12 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Ready to Level Up Your Prompts?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of prompt engineers already using GGPrompts.
                  </p>
                  <Button size="lg" className="gap-2 group" asChild>
                    <Link href="/signup">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold">GGPrompts</span>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1">
              <p className="text-sm text-muted-foreground">
                &copy; 2025 GGPrompts
              </p>
              <p className="text-xs text-muted-foreground/70 flex flex-wrap justify-center md:justify-end gap-x-1">
                <span>Built with</span>
                <a href="https://www.claude.com/pricing/max" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Claude Max</a>
                <span>&middot;</span>
                <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Next.js</a>
                <span>&middot;</span>
                <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">shadcn/ui</a>
                <span>&middot;</span>
                <a href="https://github.com/anthropics/claude-code" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Claude Code</a>
                <span>&middot;</span>
                <a href="https://github.com/mrgoonie/claudekit-skills" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">claudekit-skills</a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating cursor effect */}
      {isMounted && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30"
          style={{
            background: `radial-gradient(600px circle at ${mouseX.get()}px ${mouseY.get()}px, hsl(var(--primary) / 0.03), transparent 40%)`,
          }}
        />
      )}
    </div>
  )
}
