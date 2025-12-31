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
  Pencil
} from 'lucide-react'
import { Badge, Button, Tooltip, TooltipContent, TooltipTrigger, cn } from '@ggprompts/ui'
import {
  getRepoContents,
  RepoComponent,
  RepoContentsResult
} from '@/app/claude-code/github-sync-actions'
import { ComponentType, Component } from '@/lib/types'
import { RepoComponentModal } from './RepoComponentModal'

const typeConfig: Record<ComponentType, { icon: typeof Sparkles; color: string; label: string; path: string }> = {
  skill: { icon: Sparkles, color: 'text-purple-500', label: 'Skills', path: 'skills' },
  agent: { icon: Bot, color: 'text-blue-500', label: 'Agents', path: 'agents' },
  command: { icon: Command, color: 'text-green-500', label: 'Commands', path: 'commands' },
  hook: { icon: Webhook, color: 'text-orange-500', label: 'Hooks', path: 'hooks' },
  mcp: { icon: Plug, color: 'text-cyan-500', label: 'MCP Servers', path: 'mcps' },
}

interface ComponentItemProps {
  component: RepoComponent
  onEdit: () => void
}

function ComponentItem({ component, onEdit }: ComponentItemProps) {
  const config = typeConfig[component.type]
  const Icon = config.icon

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors group">
      <div className="flex items-center gap-3">
        <Icon className={cn('h-4 w-4', config.color)} />
        <span className="font-medium">{component.name}</span>
      </div>
      <div className="flex items-center gap-2">
        {component.source === 'ggprompts' ? (
          <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
            GGPrompts
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs">
            Your file
          </Badge>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
              <span className="sr-only">View/Edit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View/Edit</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export function RepoContents() {
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
      <div className="glass border-border/50 rounded-xl p-6">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading repository contents...</span>
        </div>
      </div>
    )
  }

  if (!result?.success) {
    // Don't show anything if not connected
    if (result?.error === 'GitHub not connected' || result?.error === 'Repository not configured') {
      return null
    }
    return (
      <div className="glass border-border/50 rounded-xl p-6">
        <div className="text-center text-muted-foreground">
          <Github className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{result?.error || 'Failed to load repository'}</p>
        </div>
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

  return (
    <div className="glass border-border/50 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FolderGit2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Your Repository</h3>
            <p className="text-xs text-muted-foreground">
              {ggpromptsCount} from GGPrompts, {userCount} added by you
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchContents(true)}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          </Button>
          <a
            href={result.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {result.repoFullName}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {components.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No components found in your repository</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(Object.keys(byType) as ComponentType[]).map((type) => {
            const items = byType[type]
            if (items.length === 0) return null

            const config = typeConfig[type]
            const Icon = config.icon

            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn('h-4 w-4', config.color)} />
                  <span className="text-sm font-medium text-muted-foreground">
                    {config.label}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {items.length}
                  </Badge>
                </div>
                <div className="space-y-1 pl-6">
                  {items.map((component) => (
                    <ComponentItem
                      key={`${component.type}:${component.slug}`}
                      component={component}
                      onEdit={() => {
                        setSelectedComponent(component)
                        setModalOpen(true)
                      }}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

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
