'use client'

import Link from 'next/link'
import {
  GitBranch,
  Image,
  Search,
  Video,
  Palette,
  GitPullRequest,
  GitCommit,
  FileText,
  PlayCircle,
  Users,
  Workflow,
  ArrowRight,
} from 'lucide-react'
import { Card, Badge, cn } from '@ggprompts/ui'

type AutomationStatus = 'available' | 'coming-soon'

interface Automation {
  slug: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  status: AutomationStatus
  gradient: string
}

const AUTOMATIONS: Automation[] = [
  {
    slug: 'diagrams',
    title: 'Diagrams',
    description: 'Create architecture diagrams, flowcharts, and ERDs via Diagrams GPT or Mermaid',
    icon: GitBranch,
    category: 'Creative',
    status: 'available',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    slug: 'dalle3',
    title: 'DALL-E 3',
    description: 'Generate images via ChatGPT DALL-E 3 with style presets',
    icon: Image,
    category: 'Creative',
    status: 'available',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    slug: 'research',
    title: 'Research',
    description: 'Multi-source research aggregator with web, GitHub, and LLM sources',
    icon: Search,
    category: 'Productivity',
    status: 'available',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    slug: 'sora',
    title: 'Sora',
    description: 'Generate videos via OpenAI Sora with duration and style controls',
    icon: Video,
    category: 'Creative',
    status: 'available',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    slug: 'canva',
    title: 'Canva',
    description: 'Create designs via Canva for social, presentations, and logos',
    icon: Palette,
    category: 'Creative',
    status: 'available',
    gradient: 'from-teal-500 to-emerald-500',
  },
  {
    slug: 'github-pr',
    title: 'GitHub PR',
    description: 'Create pull requests with proper format and test plans',
    icon: GitPullRequest,
    category: 'Developer',
    status: 'available',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    slug: 'commit',
    title: 'Commit',
    description: 'Compose conventional commits with type, scope, and message',
    icon: GitCommit,
    category: 'Developer',
    status: 'available',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    slug: 'docs-generator',
    title: 'Docs Generator',
    description: 'Generate README, API docs, and JSDoc from source files',
    icon: FileText,
    category: 'Developer',
    status: 'available',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    slug: 'prompt-launcher',
    title: 'Prompt Launcher',
    description: 'Load any .prompty file, fill variables, and execute',
    icon: PlayCircle,
    category: 'Orchestration',
    status: 'available',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    slug: 'agent-dashboard',
    title: 'Agent Dashboard',
    description: 'Monitor and control Claude workers in real-time',
    icon: Users,
    category: 'Orchestration',
    status: 'available',
    gradient: 'from-red-500 to-pink-500',
  },
  {
    slug: 'workflow-builder',
    title: 'Workflow Builder',
    description: 'Visual workflow editor for multi-step automations',
    icon: Workflow,
    category: 'Orchestration',
    status: 'available',
    gradient: 'from-indigo-500 to-blue-500',
  },
]

const CATEGORIES = ['Creative', 'Developer', 'Productivity', 'Orchestration']

export default function AutomationsPage() {
  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            TabzChrome Automation
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text-theme animate-gradient">Automation Pages</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI-automatable pages designed for TabzChrome MCP tools. Each page has known selectors
            that Claude can interact with via <code className="text-primary">tabz_click</code>,{' '}
            <code className="text-primary">tabz_fill</code>, and{' '}
            <code className="text-primary">tabz_screenshot</code>.
          </p>
        </div>

        {/* Automations by Category */}
        {CATEGORIES.map((category) => {
          const categoryAutomations = AUTOMATIONS.filter((a) => a.category === category)
          if (categoryAutomations.length === 0) return null

          return (
            <div key={category} className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-muted-foreground">{category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAutomations.map((automation) => {
                  const Icon = automation.icon
                  const isAvailable = automation.status === 'available'

                  const CardContent = (
                    <Card
                      className={cn(
                        'glass border-border/50 rounded-xl p-5 transition-all h-full relative overflow-hidden group',
                        isAvailable && 'hover:border-primary/50 hover:shadow-lg cursor-pointer'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-lg bg-gradient-to-br shrink-0',
                            automation.gradient,
                            !isAvailable && 'opacity-50'
                          )}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={cn(
                                'font-semibold',
                                isAvailable && 'group-hover:text-primary transition-colors'
                              )}
                            >
                              {automation.title}
                            </h3>
                            {!isAvailable && (
                              <Badge variant="outline" className="text-xs opacity-60">
                                Soon
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {automation.description}
                          </p>
                        </div>
                        {isAvailable && (
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                        )}
                      </div>
                    </Card>
                  )

                  return isAvailable ? (
                    <Link key={automation.slug} href={`/automations/${automation.slug}`}>
                      {CardContent}
                    </Link>
                  ) : (
                    <div key={automation.slug} className="opacity-60">
                      {CardContent}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* How It Works */}
        <Card className="glass border-border/50 rounded-xl p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4">How Automation Pages Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 font-bold">
                1
              </div>
              <h3 className="font-medium mb-1">Known Selectors</h3>
              <p className="text-sm text-muted-foreground">
                Each page documents all interactive elements with stable IDs like{' '}
                <code className="text-primary">#btn-submit</code>.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 font-bold">
                2
              </div>
              <h3 className="font-medium mb-1">TabzChrome MCP</h3>
              <p className="text-sm text-muted-foreground">
                Claude uses <code className="text-primary">tabz_fill</code> and{' '}
                <code className="text-primary">tabz_click</code> to interact with elements.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 font-bold">
                3
              </div>
              <h3 className="font-medium mb-1">Visual Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Pages show success/error states that Claude can verify with{' '}
                <code className="text-primary">tabz_screenshot</code>.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
