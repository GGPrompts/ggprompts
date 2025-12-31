'use client'

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@ggprompts/ui'
import { Component, ComponentType, UserToolkit } from '@/lib/types'
import {
  Package,
  Sparkles,
  Bot,
  Command,
  Webhook,
  Plug,
  ExternalLink,
  Check,
  X
} from 'lucide-react'
import Link from 'next/link'

interface ToolkitItemWithComponent extends UserToolkit {
  component: Component
}

interface UserToolkitListProps {
  toolkitItems: ToolkitItemWithComponent[]
}

const typeConfig: Record<ComponentType, { icon: typeof Sparkles; color: string; label: string; path: string }> = {
  skill: { icon: Sparkles, color: 'text-purple-500', label: 'Skills', path: 'skills' },
  agent: { icon: Bot, color: 'text-blue-500', label: 'Agents', path: 'agents' },
  command: { icon: Command, color: 'text-green-500', label: 'Commands', path: 'commands' },
  hook: { icon: Webhook, color: 'text-orange-500', label: 'Hooks', path: 'hooks' },
  mcp: { icon: Plug, color: 'text-cyan-500', label: 'MCP Servers', path: 'mcps' },
}

export function UserToolkitList({ toolkitItems }: UserToolkitListProps) {
  if (toolkitItems.length === 0) {
    return (
      <Card className="border-border/30 bg-transparent">
        <CardContent className="py-16">
          <div className="text-center">
            <div className="glass rounded-full p-4 w-fit mx-auto mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your toolkit is empty</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Browse the Claude Code marketplace to find skills, commands, and agents to add to your toolkit.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild>
                <Link href="/claude-code/skills">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Browse Skills
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/claude-code/commands">
                  <Command className="h-4 w-4 mr-2" />
                  Browse Commands
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Group components by type
  const componentsByType: Record<ComponentType, ToolkitItemWithComponent[]> = {
    skill: [],
    agent: [],
    command: [],
    hook: [],
    mcp: [],
  }

  toolkitItems.forEach((item) => {
    if (item.component && componentsByType[item.component.type]) {
      componentsByType[item.component.type].push(item)
    }
  })

  const enabledCount = toolkitItems.filter(t => t.enabled).length

  return (
    <Card className="border-border/30 bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            My Toolkit
          </CardTitle>
          <Badge variant="secondary">{toolkitItems.length}</Badge>
          <span className="text-sm text-muted-foreground">
            {enabledCount} enabled
          </span>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2 border-primary/50">
          <Link href="/claude-code/toolkit">
            <ExternalLink className="h-4 w-4" />
            Manage Toolkit
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {(Object.keys(componentsByType) as ComponentType[]).map((type) => {
          const items = componentsByType[type]
          if (items.length === 0) return null

          const config = typeConfig[type]
          const Icon = config.icon

          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-4 w-4 ${config.color}`} />
                <h3 className="font-medium">{config.label}</h3>
                <Badge variant="outline" className="text-xs">{items.length}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map(({ component, enabled }) => (
                  <Link
                    key={component.id}
                    href={`/claude-code/${config.path}/${component.slug}`}
                    className="glass border border-border/50 rounded-lg p-3 hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate group-hover:text-primary transition-colors">
                            {component.name}
                          </span>
                          {component.is_official && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              Official
                            </Badge>
                          )}
                        </div>
                        {component.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {component.description}
                          </p>
                        )}
                      </div>
                      <div className={`shrink-0 ${enabled ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        <div className="pt-4 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Sync your toolkit to GitHub for easy installation
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/claude-code/toolkit">
              <Package className="h-4 w-4 mr-2" />
              Open Full Toolkit
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
