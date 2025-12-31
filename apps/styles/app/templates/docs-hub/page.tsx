'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  BookOpen,
  Code,
  FileText,
  PlayCircle,
  HelpCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Globe,
  GitBranch,
  Clock,
  TrendingUp,
  Star,
  Download,
  Video,
  MessageSquare,
  ExternalLink,
  Terminal,
  Command,
  ArrowRight,
  FileCode,
  Zap,
  Settings,
  Users,
  Github,
  BookMarked,
  Lightbulb,
  Package,
  Layers,
  Shield,
  Activity,
  Database,
  Server,
  Cloud,
  Key,
  Lock,
  Cpu,
  Palette,
  Box,
  Hash,
  Edit3,
  ThumbsUp,
  Filter,
  X,
  Menu,
  Home,
  ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

// Documentation Categories
const docCategories = [
  {
    icon: Zap,
    title: 'Getting Started',
    description: 'Quick setup guides and installation instructions',
    href: '#getting-started',
    color: 'from-primary/20 to-secondary/20',
    articles: 12
  },
  {
    icon: Code,
    title: 'API Reference',
    description: 'Complete API documentation with examples',
    href: '#api',
    color: 'from-cyan-500/20 to-blue-500/20',
    articles: 48
  },
  {
    icon: BookOpen,
    title: 'Tutorials',
    description: 'Step-by-step guides for common tasks',
    href: '#tutorials',
    color: 'from-blue-500/20 to-indigo-500/20',
    articles: 24
  },
  {
    icon: FileCode,
    title: 'Examples',
    description: 'Real-world examples and use cases',
    href: '#examples',
    color: 'from-indigo-500/20 to-purple-500/20',
    articles: 36
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Answers to frequently asked questions',
    href: '#faq',
    color: 'from-purple-500/20 to-pink-500/20',
    articles: 18
  },
  {
    icon: AlertCircle,
    title: 'Troubleshooting',
    description: 'Solutions to common problems',
    href: '#troubleshooting',
    color: 'from-pink-500/20 to-rose-500/20',
    articles: 15
  }
]

// Popular docs
const popularDocs = [
  { title: 'Quick Start Guide', views: '12.5k', time: '5 min', trending: true },
  { title: 'Authentication Setup', views: '8.3k', time: '10 min', trending: true },
  { title: 'Database Configuration', views: '6.7k', time: '8 min', trending: false },
  { title: 'API Rate Limiting', views: '5.2k', time: '7 min', trending: true },
  { title: 'Deployment Guide', views: '4.8k', time: '15 min', trending: false }
]

// Recent updates
const recentUpdates = [
  { title: 'WebSocket Support Added', date: '2 hours ago', type: 'new' },
  { title: 'Authentication v2.0', date: '1 day ago', type: 'update' },
  { title: 'Database Migrations', date: '3 days ago', type: 'update' },
  { title: 'GraphQL Integration', date: '1 week ago', type: 'new' },
  { title: 'Security Best Practices', date: '2 weeks ago', type: 'guide' }
]

// Documentation tree structure
const docTree = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    children: [
      { id: 'installation', title: 'Installation', time: '5 min' },
      { id: 'configuration', title: 'Configuration', time: '8 min' },
      { id: 'first-app', title: 'Your First App', time: '10 min' },
      { id: 'project-structure', title: 'Project Structure', time: '6 min' }
    ]
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    icon: Cpu,
    children: [
      { id: 'architecture', title: 'Architecture', time: '12 min' },
      { id: 'components', title: 'Components', time: '8 min' },
      { id: 'state-management', title: 'State Management', time: '15 min' },
      { id: 'routing', title: 'Routing', time: '10 min' }
    ]
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: Code,
    children: [
      { id: 'rest-api', title: 'REST API', time: '20 min' },
      { id: 'graphql', title: 'GraphQL', time: '25 min' },
      { id: 'websockets', title: 'WebSockets', time: '15 min' },
      { id: 'webhooks', title: 'Webhooks', time: '12 min' }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    icon: Settings,
    children: [
      { id: 'performance', title: 'Performance', time: '18 min' },
      { id: 'security', title: 'Security', time: '20 min' },
      { id: 'scaling', title: 'Scaling', time: '15 min' },
      { id: 'monitoring', title: 'Monitoring', time: '12 min' }
    ]
  }
]

// Code examples
const codeExamples = {
  javascript: `// Quick start example
import { App } from '@framework/core'

const app = new App({
  name: 'my-app',
  version: '1.0.0'
})

app.on('ready', () => {
  console.log('App is ready!')
})

app.start()`,
  typescript: `// TypeScript example
import { App, Config } from '@framework/core'

interface AppConfig extends Config {
  name: string
  version: string
}

const app = new App<AppConfig>({
  name: 'my-app',
  version: '1.0.0'
})

app.on('ready', (): void => {
  console.log('App is ready!')
})

app.start()`,
  python: `# Python example
from framework import App

app = App(
    name='my-app',
    version='1.0.0'
)

@app.on('ready')
def on_ready():
    print('App is ready!')

app.start()`,
  rust: `// Rust example
use framework::App;

fn main() {
    let app = App::new("my-app", "1.0.0");

    app.on("ready", || {
        println!("App is ready!");
    });

    app.start();
}`
}

// Resources
const resources = [
  { icon: Download, title: 'PDF Documentation', size: '2.4 MB', type: 'pdf' },
  { icon: Video, title: 'Video Tutorials', count: '24 videos', type: 'playlist' },
  { icon: Github, title: 'GitHub Repository', stars: '12.5k', type: 'repo' },
  { icon: MessageSquare, title: 'Community Forum', members: '8.3k', type: 'forum' }
]

export default function DocsHubTemplate() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVersion, setSelectedVersion] = useState('v3.0.0')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['getting-started'])
  const [activeSection, setActiveSection] = useState('')
  const [showSearchDialog, setShowSearchDialog] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackType, setFeedbackType] = useState('helpful')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearchDialog(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return

      const sections = scrollContainerRef.current.querySelectorAll('section[id]')
      const scrollPosition = scrollContainerRef.current.scrollTop + 100

      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        const top = rect.top + scrollContainerRef.current!.scrollTop
        const bottom = top + rect.height

        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveSection(section.id)
        }
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const copyCode = (code: string, lang: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(lang)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Documentation Hub</h1>
                  <p className="text-xs text-muted-foreground">Everything you need to know</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Version Selector */}
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger className="w-32 glass border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-dark border-white/10">
                  <SelectItem value="v3.0.0">
                    <div className="flex items-center gap-2">
                      <span>v3.0.0</span>
                      <Badge className="text-[10px] px-1 py-0">Latest</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="v2.5.0">v2.5.0</SelectItem>
                  <SelectItem value="v2.0.0">v2.0.0</SelectItem>
                  <SelectItem value="v1.0.0">
                    <div className="flex items-center gap-2">
                      <span>v1.0.0</span>
                      <Badge variant="secondary" className="text-[10px] px-1 py-0">Legacy</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Language Selector */}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-24 glass border-white/10">
                  <Globe className="w-4 h-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-dark border-white/10">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ar">
                    <div className="flex items-center gap-2">
                      <span>العربية</span>
                      <Badge variant="outline" className="text-[10px] px-1 py-0">RTL</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={cn(
          "fixed md:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-64 glass-dark border-r border-white/10 overflow-hidden transition-transform duration-300 z-40",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <ScrollArea className="h-full p-4">
            {/* Search in Sidebar */}
            <div className="mb-4">
              <Button
                variant="outline"
                className="w-full justify-start glass border-white/10 text-zinc-400"
                onClick={() => setShowSearchDialog(true)}
              >
                <Search className="w-4 h-4 mr-2" />
                Search docs...
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-black/50 px-1.5 font-mono text-[10px] font-medium opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>

            <Separator className="mb-4 bg-white/10" />

            {/* Documentation Tree */}
            <div className="space-y-2">
              {docTree.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => toggleNode(section.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                      "hover:bg-white/5 text-zinc-300 hover:text-white",
                      activeSection === section.id && "bg-primary/10 text-primary border-l-2 border-primary"
                    )}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{section.title}</span>
                    {expandedNodes.includes(section.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedNodes.includes(section.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 space-y-1">
                          {section.children.map((child) => (
                            <a
                              key={child.id}
                              href={`#${child.id}`}
                              className={cn(
                                "flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors",
                                "hover:bg-white/5 text-zinc-400 hover:text-zinc-200",
                                activeSection === child.id && "bg-primary/10 text-primary"
                              )}
                            >
                              <span>{child.title}</span>
                              <span className="text-xs text-zinc-500">{child.time}</span>
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <Separator className="my-4 bg-white/10" />

            {/* Quick Links */}
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>Community</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                <Video className="w-4 h-4" />
                <span>Video Tutorials</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto" ref={scrollContainerRef}>
          <div className="container mx-auto px-6 py-8 max-w-6xl">
            {/* Hero Section with Search */}
            <section className="mb-12">
              <div className="glass rounded-xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    How can we help you today?
                  </h2>
                  <p className="text-muted-foreground">
                    Search our documentation or browse by category
                  </p>
                </div>

                {/* Main Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <Input
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-32 h-12 glass border-white/10 text-foreground placeholder:text-muted-foreground"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <kbd className="hidden sm:inline-flex h-7 items-center gap-1 rounded border border-white/10 bg-black/50 px-2 font-mono text-xs text-zinc-400">
                      <span className="text-sm">⌘</span>K
                    </kbd>
                    <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                      Search
                    </Button>
                  </div>
                </div>

                {/* Search Suggestions */}
                {searchQuery && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <span className="text-xs text-muted-foreground">Try:</span>
                    {['authentication', 'api', 'getting started', 'deployment'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="text-xs px-2 py-1 rounded-lg glass border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Quick Start Section */}
            <section id="quickstart" className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Quick Start
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Installation */}
                <Card className="glass border-white/10 p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-secondary" />
                    Installation
                  </h4>

                  <div className="space-y-3">
                    {['npm install @framework/core', 'yarn add @framework/core', 'pnpm add @framework/core'].map((cmd, i) => (
                      <div key={i} className="relative group">
                        <pre className="bg-muted/50 border border-white/10 rounded-lg p-3 pr-12 text-sm text-primary font-mono overflow-x-auto">
                          {cmd}
                        </pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyCode(cmd, `install-${i}`)}
                        >
                          {copiedCode === `install-${i}` ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Prerequisites */}
                <Card className="glass border-white/10 p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-secondary" />
                    Prerequisites
                  </h4>

                  <div className="space-y-3">
                    {[
                      { label: 'Node.js 18.0+', checked: true },
                      { label: 'npm or yarn', checked: true },
                      { label: 'Git installed', checked: true },
                      { label: 'Code editor (VS Code recommended)', checked: false }
                    ].map((item, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                          item.checked
                            ? "bg-primary/20 border-primary text-primary"
                            : "border-white/20 group-hover:border-white/40"
                        )}>
                          {item.checked && <Check className="w-3 h-3" />}
                        </div>
                        <span className={cn(
                          "text-sm",
                          item.checked ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Watch Setup Video
                    </Button>
                  </div>
                </Card>
              </div>
            </section>

            {/* Documentation Categories Grid */}
            <section id="categories" className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" />
                Documentation Categories
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docCategories.map((category, i) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass border-white/10 p-6 hover:bg-white/5 transition-all duration-300 group cursor-pointer">
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4",
                        category.color
                      )}>
                        <category.icon className="w-6 h-6 text-foreground" />
                      </div>

                      <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {category.articles} articles
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Popular & Trending */}
            <section id="popular" className="mb-12">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Popular Docs */}
                <Card className="glass border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Popular Documentation
                  </h3>

                  <div className="space-y-3">
                    {popularDocs.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-muted-foreground">
                            #{i + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                {doc.title}
                              </span>
                              {doc.trending && (
                                <Badge className="text-[10px] bg-primary/20 text-primary border-primary/30">
                                  Trending
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {doc.time}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {doc.views} views
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-primary" />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Updates */}
                <Card className="glass border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-secondary" />
                    Recent Updates
                  </h3>

                  <div className="space-y-3">
                    {recentUpdates.map((update, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            update.type === 'new' ? "bg-primary" :
                            update.type === 'update' ? "bg-secondary" :
                            "bg-purple-400"
                          )} />
                          <div>
                            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                              {update.title}
                            </span>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {update.date}
                              </span>
                              <Badge variant="outline" className="text-[10px] border-white/10">
                                {update.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-primary" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>

            {/* Code Examples Showcase */}
            <section id="examples" className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Code className="w-6 h-6 text-primary" />
                Code Examples
              </h3>

              <Card className="glass border-white/10 p-6">
                <Tabs defaultValue="javascript" className="w-full">
                  <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <TabsList className="grid w-max md:w-auto grid-cols-2 sm:grid-cols-4 glass border-white/10">
                      <TabsTrigger value="javascript" className="text-xs sm:text-sm whitespace-nowrap">
                        <span className="hidden sm:inline">JavaScript</span>
                        <span className="sm:hidden">JS</span>
                      </TabsTrigger>
                      <TabsTrigger value="typescript" className="text-xs sm:text-sm whitespace-nowrap">
                        <span className="hidden sm:inline">TypeScript</span>
                        <span className="sm:hidden">TS</span>
                      </TabsTrigger>
                      <TabsTrigger value="python" className="text-xs sm:text-sm whitespace-nowrap">Python</TabsTrigger>
                      <TabsTrigger value="rust" className="text-xs sm:text-sm whitespace-nowrap">Rust</TabsTrigger>
                    </TabsList>
                  </div>

                  {Object.entries(codeExamples).map(([lang, code]) => (
                    <TabsContent key={lang} value={lang} className="mt-4">
                      <div className="relative">
                        <pre className="bg-muted/50 border border-white/10 rounded-lg p-4 text-sm text-primary font-mono overflow-x-auto">
                          {code}
                        </pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-2 top-2"
                          onClick={() => copyCode(code, lang)}
                        >
                          {copiedCode === lang ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" className="glass border-white/10 text-foreground">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Run in Playground
                        </Button>
                        <Button variant="ghost" className="text-muted-foreground">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Full Example
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </Card>
            </section>

            {/* Interactive Examples */}
            <section id="playground" className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Box className="w-6 h-6 text-primary" />
                Interactive Playground
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Basic Setup', difficulty: 'Beginner', time: '5 min', color: 'from-green-500/20 to-emerald-500/20' },
                  { title: 'API Integration', difficulty: 'Intermediate', time: '10 min', color: 'from-blue-500/20 to-secondary/20' },
                  { title: 'Advanced Patterns', difficulty: 'Advanced', time: '15 min', color: 'from-purple-500/20 to-pink-500/20' }
                ].map((example) => (
                  <Card key={example.title} className="glass border-white/10 p-6 hover:bg-white/5 transition-all cursor-pointer group">
                    <div className={cn(
                      "h-32 rounded-lg bg-gradient-to-br mb-4 flex items-center justify-center",
                      example.color
                    )}>
                      <PlayCircle className="w-12 h-12 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>

                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {example.title}
                    </h4>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-white/10">
                        {example.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {example.time}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Resources Section */}
            <section id="resources" className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Download className="w-6 h-6 text-primary" />
                Resources & Downloads
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {resources.map((resource) => (
                  <Card key={resource.title} className="glass border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <resource.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {resource.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {resource.size || resource.count || resource.stars || resource.members}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Contribution Section */}
            <section id="contribute" className="mb-12">
              <Card className="glass border-white/10 p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Contribute to Documentation
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Help us improve our documentation by contributing examples, fixing typos, or adding new content.
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit on GitHub
                    </Button>
                    <Button variant="outline" className="glass border-white/10 text-foreground">
                      <BookMarked className="w-4 h-4 mr-2" />
                      Contribution Guide
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground"
                      onClick={() => setShowFeedback(true)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Feedback
                    </Button>
                  </div>
                </div>
              </Card>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                Frequently Asked Questions
              </h3>

              <Accordion type="single" collapsible className="space-y-2">
                {[
                  {
                    question: 'How do I get started with the framework?',
                    answer: 'Follow our Quick Start guide which covers installation, configuration, and creating your first application. The entire process takes less than 5 minutes.'
                  },
                  {
                    question: 'What are the system requirements?',
                    answer: 'You need Node.js 18.0 or higher, npm or yarn package manager, and a modern web browser. We recommend VS Code as your editor for the best development experience.'
                  },
                  {
                    question: 'Is there a migration guide from v2 to v3?',
                    answer: 'Yes! Check out our comprehensive migration guide that covers all breaking changes and provides step-by-step instructions for upgrading your existing applications.'
                  },
                  {
                    question: 'How can I contribute to the project?',
                    answer: 'We welcome contributions! You can help by improving documentation, reporting bugs, suggesting features, or submitting pull requests. See our contribution guidelines for more details.'
                  }
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="glass border-white/10 rounded-lg px-6">
                    <AccordionTrigger className="text-foreground hover:text-primary transition-colors">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>
        </main>
      </div>

      {/* Search Dialog */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="glass-dark border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Search Documentation</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Search across all documentation, tutorials, and API references
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Type to search..."
                className="pl-10 glass border-white/10 text-foreground"
                autoFocus
              />
            </div>

            {/* Search Results */}
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {[
                { title: 'Getting Started Guide', category: 'Guides', matches: 3 },
                { title: 'Authentication API', category: 'API', matches: 5 },
                { title: 'Database Configuration', category: 'Configuration', matches: 2 },
                { title: 'Deployment Best Practices', category: 'Tutorials', matches: 4 }
              ].map((result, i) => (
                <button
                  key={i}
                  className="w-full p-3 rounded-lg glass border border-white/10 hover:bg-white/5 transition-colors text-left group"
                  onClick={() => setShowSearchDialog(false)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {result.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.category} · {result.matches} matches
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="glass-dark border-white/10">
          <DialogHeader>
            <DialogTitle className="text-foreground">Documentation Feedback</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Help us improve our documentation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-foreground mb-2">Was this page helpful?</Label>
              <RadioGroup value={feedbackType} onValueChange={setFeedbackType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="helpful" id="helpful" />
                  <Label htmlFor="helpful" className="text-muted-foreground cursor-pointer">
                    Yes, very helpful
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="somewhat" id="somewhat" />
                  <Label htmlFor="somewhat" className="text-muted-foreground cursor-pointer">
                    Somewhat helpful
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-helpful" id="not-helpful" />
                  <Label htmlFor="not-helpful" className="text-muted-foreground cursor-pointer">
                    Not helpful
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="feedback" className="text-foreground mb-2">
                Additional comments (optional)
              </Label>
              <Textarea
                id="feedback"
                placeholder="Tell us how we can improve..."
                className="glass border-white/10 text-foreground min-h-[100px]"
              />
            </div>

            <Button
              className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
              onClick={() => setShowFeedback(false)}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}