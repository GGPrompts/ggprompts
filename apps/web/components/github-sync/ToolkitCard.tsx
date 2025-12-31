'use client'

import { ComponentType } from '@/lib/types'
import { Badge } from '@ggprompts/ui'
import { FloatingCard } from '@/components/ui/floating-card'
import {
  Sparkles,
  Bot,
  Command,
  Webhook,
  Plug,
} from 'lucide-react'
import { RepoComponent } from '@/app/claude-code/github-sync-actions'

const typeConfig: Record<ComponentType, { icon: typeof Sparkles; color: string }> = {
  skill: { icon: Sparkles, color: 'text-purple-500' },
  agent: { icon: Bot, color: 'text-blue-500' },
  command: { icon: Command, color: 'text-green-500' },
  hook: { icon: Webhook, color: 'text-orange-500' },
  mcp: { icon: Plug, color: 'text-cyan-500' },
}

interface ToolkitCardProps {
  component: RepoComponent
  onClick: () => void
}

export function ToolkitCard({ component, onClick }: ToolkitCardProps) {
  const config = typeConfig[component.type]
  const Icon = config.icon

  return (
    <FloatingCard>
      <button
        onClick={onClick}
        className="w-full text-left glass border-primary/20 rounded-xl p-5 hover:border-primary/50 transition-all hover:shadow-lg group flex flex-col h-full"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {component.type}
            </span>
          </div>
          {component.source === 'ggprompts' ? (
            <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
              GGPrompts
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              Your file
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {component.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
          {component.description || 'No description available'}
        </p>
      </button>
    </FloatingCard>
  )
}
