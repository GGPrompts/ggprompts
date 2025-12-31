'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import {
  Sparkles,
  Terminal,
  Zap,
  ArrowRight,
  Package,
  Bot,
  Command,
  Plug,
  Webhook,
  Plus,
  Github,
  ExternalLink,
  Star,
  Download,
} from 'lucide-react'
import { Badge, Button, Card, BorderTrail, GlowEffect, cn } from '@ggprompts/ui'
import { FloatingCard } from '@/components/ui/floating-card'
import { GitHubCTA } from '@/components/github-sync'
import { Component } from '@/lib/types'

const typeConfig = {
  skill: { icon: Sparkles, label: 'Skills', color: 'text-purple-500', bgColor: 'from-purple-500 to-violet-500', href: '/claude-code/skills' },
  agent: { icon: Bot, label: 'Agents', color: 'text-blue-500', bgColor: 'from-blue-500 to-cyan-500', href: '/claude-code/agents' },
  command: { icon: Command, label: 'Commands', color: 'text-green-500', bgColor: 'from-green-500 to-emerald-500', href: '/claude-code/commands' },
  hook: { icon: Webhook, label: 'Hooks', color: 'text-orange-500', bgColor: 'from-orange-500 to-amber-500', href: '/claude-code/hooks' },
  mcp: { icon: Plug, label: 'MCPs', color: 'text-cyan-500', bgColor: 'from-cyan-500 to-teal-500', href: '/claude-code/mcps' },
}

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

    const duration = 1500
    const steps = 40
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

function ComponentCard({ component, index }: { component: Component; index: number }) {
  const config = typeConfig[component.type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <Link href={`/claude-code/${component.type}s/${component.slug}`}>
        <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ type: 'spring', stiffness: 400 }}>
          <Card className="glass border-border/50 rounded-xl p-5 hover:border-primary/50 transition-all hover:shadow-lg group h-full relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  className={cn('p-1.5 rounded-md bg-gradient-to-br', config.bgColor)}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Icon className="h-4 w-4 text-white" />
                </motion.div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {component.type}
                </span>
              </div>
              {component.is_official && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                  Official
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {component.name}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {component.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {component.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-border/50">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  )
}

function TypeCard({ type, count, index }: { type: keyof typeof typeConfig; count: number; index: number }) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={config.href}>
        <FloatingCard>
          <Card className="glass border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg group relative overflow-hidden">
            <BorderTrail
              className={cn('bg-gradient-to-r', config.bgColor)}
              size={60}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className={cn('p-3 rounded-lg bg-gradient-to-br', config.bgColor)}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-lg">{config.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    <AnimatedCounter value={count} /> available
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            </div>
          </Card>
        </FloatingCard>
      </Link>
    </motion.div>
  )
}

interface ClaudeCodeClientProps {
  featured: Component[] | null
  counts: {
    skill: number
    agent: number
    command: number
    hook: number
    mcp: number
  }
}

export default function ClaudeCodeClient({ featured, counts }: ClaudeCodeClientProps) {
  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98])
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

  const totalComponents = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen relative">
      {/* Animated background particles */}
      {isMounted && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/15 rounded-full"
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

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          style={{ scale: heroScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-medium">Claude Code Marketplace</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="gradient-text-theme animate-gradient">Your Claude Code Toolkit</span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Browse, curate, and sync skills, agents, and commands to supercharge your Claude Code experience.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" className="group" asChild>
              <Link href="/claude-code/skills">
                <Package className="h-5 w-5 mr-2" />
                Browse Components
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10" asChild>
              <Link href="/claude-code/toolkit">
                <Zap className="h-5 w-5 mr-2" />
                My Toolkit
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10" asChild>
              <Link href="/claude-code/submit">
                <Plus className="h-5 w-5 mr-2" />
                Submit
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {[
            { label: 'Total Components', value: totalComponents, icon: Package },
            { label: 'Skills', value: counts.skill, icon: Sparkles },
            { label: 'Agents', value: counts.agent, icon: Bot },
            { label: 'Commands', value: counts.command, icon: Command },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass border-primary/20 p-4 text-center">
                  <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* How It Works */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FloatingCard>
            <Card className="glass border-border/50 rounded-2xl p-8 relative overflow-hidden">
              <BorderTrail
                className="bg-gradient-to-r from-primary via-secondary to-primary"
                size={80}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>

              {/* Quick Install Path */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  Quick Install (Recommended)
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      step: 1,
                      title: 'One-Time Setup',
                      description: 'Add the GGPrompts marketplace to Claude Code:',
                      code: '/plugin marketplace add GGPrompts/my-gg-plugins',
                    },
                    {
                      step: 2,
                      title: 'Browse & Click Install',
                      description: 'Find components you like and click the install button. Commands are sent directly to Claude Code.',
                    },
                    {
                      step: 3,
                      title: 'Done!',
                      description: 'Components install instantly. Use skills, commands, and agents right away.',
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.step}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 text-lg font-bold"
                        whileHover={{ scale: 1.1, backgroundColor: 'hsl(var(--primary) / 0.2)' }}
                      >
                        {item.step}
                      </motion.div>
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      {item.code && (
                        <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
                          {item.code}
                        </code>
                      )}
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Requires <a href="https://github.com/GGPrompts/TabzChrome" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TabzChrome</a> for direct install. Without it, you can copy commands manually.
                </p>
              </div>

              <div className="border-t border-border/50 my-6" />

              {/* GitHub Sync Path */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                  <Github className="h-5 w-5" />
                  Alternative: GitHub Sync
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For teams or offline use, you can sync your toolkit to a GitHub repo instead.
                </p>
                <div className="grid md:grid-cols-3 gap-6 opacity-75">
                  {[
                    { title: 'Add to Toolkit', description: 'Click + to save components to your GGPrompts toolkit.' },
                    { title: 'Sync to GitHub', description: 'Push your selections to your own plugin repo.' },
                    { title: 'Load in Claude Code', description: 'Clone and load with /plugin load .' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="text-center"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </FloatingCard>
        </motion.div>

        {/* Browse by Type */}
        <div className="mb-16">
          <motion.h2
            className="text-2xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Browse by Type
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(typeConfig).map(([type], index) => (
              <TypeCard
                key={type}
                type={type as keyof typeof typeConfig}
                count={counts[type as keyof typeof counts]}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Featured Components */}
        {featured && featured.length > 0 && (
          <div className="mb-16">
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                Featured
              </h2>
              <Button variant="ghost" className="group" asChild>
                <Link href="/claude-code/skills">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((component, index) => (
                <ComponentCard key={component.id} component={component} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* GitHub Integration CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <GitHubCTA />
        </motion.div>
      </div>

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
