'use client'

import React, { useState, useEffect } from 'react'
import {
  Github,
  Loader2,
  ExternalLink,
  Sparkles,
  Bot,
  Command,
  Webhook,
  Plug,
  RefreshCw,
  FolderGit2,
  Package,
} from 'lucide-react'
import { Badge, Button, cn } from '@ggprompts/ui'
import {
  getRepoContents,
  RepoComponent,
  RepoContentsResult
} from '@/app/claude-code/github-sync-actions'
import { ComponentType } from '@/lib/types'
import { RepoComponentModal } from './RepoComponentModal'
import { ToolkitCard } from './ToolkitCard'

const typeConfig: Record<ComponentType, { icon: typeof Sparkles; color: string; label: string; path: string }> = {
  skill: { icon: Sparkles, color: 'text-purple-500', label: 'Skills', path: 'skills' },
  agent: { icon: Bot, color: 'text-blue-500', label: 'Agents', path: 'agents' },
  command: { icon: Command, color: 'text-green-500', label: 'Commands', path: 'commands' },
  hook: { icon: Webhook, color: 'text-orange-500', label: 'Hooks', path: 'hooks' },
  mcp: { icon: Plug, color: 'text-cyan-500', label: 'MCP Servers', path: 'mcps' },
}

export function ToolkitGrid() {
  const [result, setResult] = useState<RepoContentsResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<RepoComponent | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchContents = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    try {
      const data = await getRepoContents()
      setResult(data)
    } catch (error) {
      console.error('Failed to fetch repo contents:', error)
      setResult({ success: false, error: 'Failed to fetch repository contents' })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [])

  if (isLoading) {
    return (
      <div className="glass border-border/50 rounded-2xl p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Loading your toolkit...</p>
      </div>
    )
  }

  // Not connected to GitHub
  if (!result?.success) {
    if (result?.error === 'GitHub not connected' || result?.error === 'Repository not configured') {
      return (
        <div className="glass border-border/50 rounded-2xl p-12 text-center">
          <Github className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connect GitHub to view your toolkit</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Your toolkit lives in your GitHub repository. Connect your account to view and manage your plugins.
          </p>
        </div>
      )
    }
    return (
      <div className="glass border-border/50 rounded-2xl p-12 text-center">
        <Github className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">{result?.error || 'Failed to load repository'}</p>
      </div>
    )
  }

  const components = result.components || []

  // Group by type
  const byType: Record<ComponentType, RepoComponent[]> = {
    skill: [],
    agent: [],
    command: [],
    hook: [],
    mcp: [],
  }

  components.forEach(c => {
    if (byType[c.type]) {
      byType[c.type].push(c)
    }
  })

  const ggpromptsCount = components.filter(c => c.source === 'ggprompts').length
  const userCount = components.filter(c => c.source === 'user').length

  // Empty state
  if (components.length === 0) {
    return (
      <div className="glass border-border/50 rounded-2xl p-12 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your toolkit is empty</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Add skills, commands, and agents to your GitHub repository to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Repository info header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderGit2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <a
              href={result.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary flex items-center gap-1"
            >
              {result.repoFullName}
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="text-xs text-muted-foreground">
              {ggpromptsCount} from GGPrompts, {userCount} added by you
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchContents(true)}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Type sections with card grids */}
      {(Object.keys(byType) as ComponentType[]).map((type) => {
        const items = byType[type]
        if (items.length === 0) return null

        const config = typeConfig[type]
        const Icon = config.icon

        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-4">
              <Icon className={cn('h-5 w-5', config.color)} />
              <h2 className="text-lg font-semibold">{config.label}</h2>
              <Badge variant="outline">{items.length}</Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((component) => (
                <ToolkitCard
                  key={`${component.type}:${component.slug}`}
                  component={component}
                  onClick={() => {
                    setSelectedComponent(component)
                    setModalOpen(true)
                  }}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* View/Edit Modal */}
      <RepoComponentModal
        component={selectedComponent}
        open={modalOpen}
        onOpenChange={setModalOpen}
        repoFullName={result.repoFullName}
      />
    </div>
  )
}
