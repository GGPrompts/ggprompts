'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card, Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, cn } from '@ggprompts/ui'
import { GenerationPromptModal } from './GenerationPromptModal'
import {
  Newspaper,
  Sparkles,
  TrendingUp,
  GitBranch,
  MessageSquareQuote,
  Code2,
  ExternalLink,
  Github,
  Star,
  Calendar,
  Zap,
  Eye,
  FileCode,
  ArrowRight,
  Clock,
  Bot,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Package,
  Youtube,
  Play,
  Webhook,
} from 'lucide-react'
import { type DailyNews, type AiTool } from '@/lib/news/types'

interface NewsPageClientProps {
  news: DailyNews
  availableDates: string[]
  currentDate: string
}

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
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

// Floating card component with cursor follow (desktop only)
function FloatingCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]))
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]))
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    if (isMobile) return
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  // On mobile, render without 3D transforms to prevent overflow issues
  if (isMobile) {
    return (
      <div className={cn('relative', className)}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn('relative', className)}
    >
      <div style={{ transform: 'translateZ(30px)' }}>
        {children}
      </div>
    </motion.div>
  )
}

// Tool icon mapping
const toolIcons: Record<AiTool, { icon: typeof Code2; color: string; name: string }> = {
  'claude-code': { icon: Bot, color: 'from-orange-500 to-amber-500', name: 'Claude Code' },
  'gemini-cli': { icon: Sparkles, color: 'from-blue-500 to-cyan-500', name: 'Gemini CLI' },
  'codex': { icon: Code2, color: 'from-green-500 to-emerald-500', name: 'OpenAI Codex' },
}

// Source badge colors
const sourceColors: Record<string, string> = {
  hackernews: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  github: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  lobsters: 'bg-red-500/20 text-red-400 border-red-500/30',
  devto: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  web: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  skillsmp: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  youtube: 'bg-red-500/20 text-red-400 border-red-500/30',
}

// Format view count to human-readable (1.2M, 45K, etc.)
function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

export default function NewsPageClient({ news, availableDates, currentDate }: NewsPageClientProps) {
  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const [isMounted, setIsMounted] = useState(false)
  const [promptModalOpen, setPromptModalOpen] = useState(false)
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

  // Parse date parts to avoid timezone issues (new Date("2025-12-04") is midnight UTC, shows as previous day in US timezones)
  const [year, month, day] = news.date.split('-').map(Number)
  const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Find adjacent dates for navigation
  const currentIndex = availableDates.indexOf(currentDate)
  const prevDate = currentIndex < availableDates.length - 1 ? availableDates[currentIndex + 1] : null
  const nextDate = currentIndex > 0 ? availableDates[currentIndex - 1] : null

  return (
    <div className="min-h-screen">
      {/* Animated background particles */}
      {isMounted && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              animate={{
                x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
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

      {/* Prompt Transparency Button - Fixed Position */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed top-24 right-4 z-50 p-3 glass border border-primary/30 rounded-full shadow-lg hover:border-primary/50 transition-colors group"
        title="See how this page was made"
        onClick={() => setPromptModalOpen(true)}
      >
        <FileCode className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
      </motion.button>

      <GenerationPromptModal
        open={promptModalOpen}
        onOpenChange={setPromptModalOpen}
        modelUsed={news.modelUsed}
        generatedAt={news.generatedAt}
        promptGistUrl={news.promptGistUrl}
      />

      {/* Hero Section - Top Story */}
      <motion.section
        className="relative min-h-[80vh] flex items-center justify-center px-4 py-20"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Newspaper className="w-3 h-3 mr-1" />
              AI News Digest
            </Badge>

            {/* Date Navigation */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
              {prevDate ? (
                <Link
                  href={`/news/${prevDate}`}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  title="Previous day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <div className="p-2 opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {availableDates.length > 1 ? (
                  <Select
                    value={currentDate}
                    onValueChange={(value) => {
                      window.location.href = value === availableDates[0] ? '/news' : `/news/${value}`
                    }}
                  >
                    <SelectTrigger className="w-auto border-none bg-transparent h-auto p-0 text-sm">
                      <SelectValue>{formattedDate}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="glass" position="popper" align="center">
                      {availableDates.map((date) => {
                        const [year, month, day] = date.split('-').map(Number)
                        const d = new Date(year, month - 1, day)
                        return (
                          <SelectItem key={date} value={date}>
                            {d.toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                ) : (
                  <span>{formattedDate}</span>
                )}
              </div>

              {nextDate ? (
                <Link
                  href={`/news/${nextDate}`}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  title="Next day"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="p-2 opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </motion.div>

          <FloatingCard>
            <Card className="glass border-primary/20 overflow-hidden">
              {news.hero.imageUrl && (
                <div className="relative min-h-[350px] sm:min-h-0 sm:aspect-video md:aspect-[21/9] bg-black/50 overflow-visible">
                  <Image
                    src={news.hero.imageUrl}
                    alt={news.hero.headline}
                    fill
                    className="object-cover opacity-80"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
                    <Badge className={cn('mb-2 sm:mb-4', sourceColors[news.hero.source])}>
                      {news.hero.source}
                    </Badge>
                    <h1
                      className="font-bold mb-2 sm:mb-4 text-white"
                      style={{ fontSize: 'clamp(1.125rem, 4vw, 3rem)' }}
                    >
                      {news.hero.headline}
                    </h1>
                    <p
                      className="text-white/80 max-w-3xl mb-2 sm:mb-4"
                      style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                    >
                      {news.hero.summary}
                    </p>
                  </div>
                </div>
              )}
              <div className="p-6 md:p-8 border-t border-primary/10">
                <div className="flex items-start gap-3 mb-6">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Why It Matters</h3>
                    <p className="text-muted-foreground">{news.hero.whyItMatters}</p>
                  </div>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <a href={news.hero.sourceUrl} target="_blank" rel="noopener noreferrer">
                    Read Full Story
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </Card>
          </FloatingCard>
        </div>
      </motion.section>

      {/* Today's Pulse - Stats Dashboard */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary"
          >
            Today&apos;s Pulse
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Stories Curated', value: news.pulse.storiesCurated, icon: Newspaper },
              { label: 'Sources Scanned', value: news.pulse.sourcesScanned, icon: Eye },
              { label: 'Tool Updates', value: news.pulse.toolUpdates, icon: GitBranch },
              { label: 'Topics Trending', value: news.pulse.topTopics.length, icon: TrendingUp },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <FloatingCard>
                    <Card className="glass border-primary/20 p-4 md:p-6 text-center">
                      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">
                        <AnimatedCounter value={stat.value} />
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                    </Card>
                  </FloatingCard>
                </motion.div>
              )
            })}
          </div>

          {/* Trending Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
          >
            {news.pulse.topTopics.map((topic) => (
              <Badge key={topic} variant="outline" className="border-primary/30 text-primary">
                #{topic}
              </Badge>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Stories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary"
          >
            Top Stories
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.topStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FloatingCard>
                  <Card className="glass border-primary/20 p-6 h-full group hover:border-primary/40 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={cn('text-xs', sourceColors[story.source])}>
                            {story.source}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-border/50">
                            {story.category}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {story.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {story.summary}
                        </p>
                        <a
                          href={story.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Read more <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </Card>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Skills Section */}
      {news.trendingSkills && news.trendingSkills.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-center mb-2 text-primary"
            >
              Trending Claude Skills
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center text-muted-foreground mb-8"
            >
              From <a href="https://skillsmp.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SkillsMP</a>
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {news.trendingSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Card className="glass border-primary/20 p-4 h-full hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary truncate">
                        {skill.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs border-border/50 mb-2">
                      {skill.category}
                    </Badge>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {skill.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <a
                        href={skill.marketplaceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View on SkillsMP <ExternalLink className="w-3 h-3" />
                      </a>
                      {skill.stars > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          {skill.stars.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MCP Servers Section */}
      {news.newMcpServers && news.newMcpServers.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary"
            >
              Notable MCP Servers
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {news.newMcpServers.map((server, index) => (
                <motion.div
                  key={server.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Card className="glass border-primary/20 p-4 h-full hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary truncate">
                        {server.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs border-border/50 mb-2">
                      {server.category}
                    </Badge>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {server.description}
                    </p>
                    <code className="text-xs bg-black/30 px-2 py-1 rounded text-primary/80 block mb-2 truncate">
                      {server.installCommand}
                    </code>
                    <a
                      href={server.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <Github className="w-3 h-3" /> Source
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Notable Hooks Section */}
      {news.notableHooks && news.notableHooks.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary"
            >
              Notable Claude Code Hooks
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {news.notableHooks.map((hook, index) => (
                <motion.div
                  key={hook.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Card className="glass border-primary/20 p-4 h-full hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Webhook className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-primary truncate">
                        {hook.name}
                      </span>
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs mb-2">
                      {hook.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {hook.description}
                    </p>
                    <a
                      href={hook.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View Source <ExternalLink className="w-3 h-3" />
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TUI Tools Section */}
      {news.tuiTools && news.tuiTools.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-center mb-2 text-primary"
            >
              Trending TUI Tools
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center text-muted-foreground mb-8"
            >
              Beautiful terminal experiences
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {news.tuiTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <motion.a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="block"
                  >
                    <Card className="glass border-primary/20 p-4 h-full hover:border-primary/40 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-primary truncate">
                          {tool.name}
                        </span>
                      </div>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs mb-2">
                        {tool.language}
                      </Badge>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          {tool.stars.toLocaleString()}
                        </div>
                        {tool.starsToday && tool.starsToday > 0 && (
                          <span className="text-cyan-400">
                            +{tool.starsToday} today
                          </span>
                        )}
                      </div>
                    </Card>
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Videos Section */}
      {news.trendingVideos && news.trendingVideos.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary"
            >
              Trending Videos
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {news.trendingVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <motion.a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="block"
                  >
                    <Card className="glass border-primary/20 overflow-hidden h-full hover:border-primary/40 transition-all group">
                      {/* Thumbnail with play overlay */}
                      <div className="relative aspect-video bg-black/50">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                            {video.duration}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate">{video.channelName}</span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Eye className="w-3 h-3" />
                            {formatViewCount(video.viewCount)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Repos Gallery */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary"
          >
            Trending Repositories
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {news.trendingRepos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <motion.a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="block"
                >
                  <Card className="glass border-primary/20 p-4 h-full hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Github className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-primary truncate">
                        {repo.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {repo.stars.toLocaleString()}
                      </div>
                      {repo.language && (
                        <Badge variant="outline" className="text-xs border-border/50">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                  </Card>
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Updates Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary"
          >
            Tool Updates
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.toolUpdates.map((update, index) => {
              const toolInfo = toolIcons[update.tool]
              const Icon = toolInfo.icon
              return (
                <motion.div
                  key={update.tool}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <FloatingCard>
                    <Card className="glass border-primary/20 p-6 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          'bg-gradient-to-br',
                          toolInfo.color
                        )}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{toolInfo.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              v{update.version}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {update.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {update.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={update.fullChangelogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Full changelog <ExternalLink className="w-3 h-3" />
                      </a>
                    </Card>
                  </FloatingCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Notable Quotes Carousel */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary"
          >
            Notable Quotes
          </motion.h2>

          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {news.notableQuotes.map((quote) => (
                <CarouselItem key={quote.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="glass border-primary/20 p-8">
                      <MessageSquareQuote className="w-10 h-10 text-primary/30 mb-4" />
                      <blockquote className="text-lg md:text-xl mb-6 italic text-foreground/90">
                        &ldquo;{quote.quote}&rdquo;
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{quote.author}</div>
                          <div className="text-sm text-muted-foreground">{quote.role}</div>
                        </div>
                        <a
                          href={quote.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-primary/30 text-primary hover:bg-primary/10" />
            <CarouselNext className="border-primary/30 text-primary hover:bg-primary/10" />
          </Carousel>
        </div>
      </section>

      {/* How It's Made - Tabbed Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary"
          >
            Behind the Scenes
          </motion.h2>

          <Tabs defaultValue="sources" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8 glass border border-primary/20">
              <TabsTrigger value="sources" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Sources
              </TabsTrigger>
              <TabsTrigger value="prompt" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                The Prompt
              </TabsTrigger>
              <TabsTrigger value="model" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Model Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sources">
              <Card className="glass border-primary/20 p-6">
                <p className="text-muted-foreground mb-4">
                  This news digest was compiled from the following sources:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {news.allSources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <Badge className={cn('text-xs', sourceColors[source.source])}>
                        {source.source}
                      </Badge>
                      <span className="text-sm">{source.title}</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="prompt">
              <Card className="glass border-primary/20 p-6">
                <p className="text-muted-foreground mb-4">
                  This page was generated using a simple prompt. We believe in transparency—here&apos;s exactly what was used:
                </p>
                <pre className="text-sm bg-black/30 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap border border-border/50 mb-4">
                  {news.prompt}
                </pre>
                <Button variant="outline" className="border-primary/30" asChild>
                  <a href={news.promptGistUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    View Prompt History on GitHub
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="model">
              <Card className="glass border-primary/20 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Model</h3>
                    <p className="font-mono">{news.modelUsed}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Generated At</h3>
                    <p>{new Date(news.generatedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Philosophy</h3>
                    <p className="text-muted-foreground">
                      We use intentionally simple prompts and let the model use its judgment.
                      Complex, rigid prompts often constrain output quality. By keeping it simple,
                      the AI can adapt to each day&apos;s unique content.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-mono font-bold gradient-text-theme">
              Stay Updated on AI Development
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This page is updated daily with the latest news from the AI coding tool ecosystem.
              Bookmark it or check back tomorrow for fresh insights.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group" asChild>
                <a href="/prompts">
                  Explore Prompts
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" asChild>
                <a href={news.promptGistUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  Fork the Prompt
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

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
