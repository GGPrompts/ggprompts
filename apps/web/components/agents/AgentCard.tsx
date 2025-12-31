'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@ggprompts/ui'
import { Copy, Check, Bot, Wrench, Cpu, Zap } from 'lucide-react'

export interface Agent {
  id: string
  name: string
  description: string
  tools: string[]
  model: 'haiku' | 'sonnet' | 'opus'
  pattern: 'researcher' | 'reviewer' | 'specialist' | 'builder' | 'quick' | 'orchestrator' | 'planner'
  author?: string
  systemPrompt?: string
}

interface AgentCardProps {
  agent: Agent
  onClick?: () => void
}

const modelConfig = {
  haiku: { label: 'Haiku', color: 'bg-green-500/10 text-green-500 border-green-500/30' },
  sonnet: { label: 'Sonnet', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  opus: { label: 'Opus', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
}

const patternConfig = {
  researcher: { label: 'Researcher', icon: '🔍' },
  reviewer: { label: 'Reviewer', icon: '📋' },
  specialist: { label: 'Specialist', icon: '🎯' },
  builder: { label: 'Builder', icon: '🔨' },
  quick: { label: 'Quick', icon: '⚡' },
  orchestrator: { label: 'Orchestrator', icon: '🎭' },
  planner: { label: 'Planner', icon: '📐' },
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()

    // Generate the agent markdown file content
    const content = `---
name: ${agent.name}
description: "${agent.description}"
tools:
${agent.tools.map(t => `  - ${t}`).join('\n')}
model: ${agent.model}
---

${agent.systemPrompt || '# TODO: Add system prompt'}
`

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const model = modelConfig[agent.model]
  const pattern = patternConfig[agent.pattern]

  return (
    <Card
      className="glass border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {agent.name}
            </CardTitle>
          </div>
          <Badge variant="outline" className={model.color}>
            <Cpu className="h-3 w-3 mr-1" />
            {model.label}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <Badge variant="secondary" className="text-xs gap-1">
            <span>{pattern.icon}</span>
            {pattern.label}
          </Badge>
          <Badge variant="outline" className="text-xs gap-1 border-muted-foreground/30">
            <Wrench className="h-3 w-3" />
            {agent.tools.length} tools
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {agent.description}
        </p>

        {/* Tools preview */}
        <div className="flex flex-wrap gap-1">
          {agent.tools.slice(0, 4).map((tool) => (
            <Badge key={tool} variant="outline" className="text-xs font-mono">
              {tool}
            </Badge>
          ))}
          {agent.tools.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{agent.tools.length - 4} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4" />
            <code className="text-xs">claude --agent {agent.name}</code>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy agent config</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
