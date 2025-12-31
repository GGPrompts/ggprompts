'use client'

import Link from 'next/link'
import { Component, ComponentType } from '@/lib/types'
import { Badge, Button, Tooltip, TooltipContent, TooltipTrigger } from '@ggprompts/ui'
import { FloatingCard } from '@/components/ui/floating-card'
import {
  Sparkles,
  Bot,
  Command,
  Webhook,
  Plug,
  Plus,
  Check,
  Star,
  Download,
  Eye,
  Bookmark,
} from 'lucide-react'
import { useState } from 'react'
import { ComponentContentModal } from './ComponentContentModal'
import { InstallPluginButton } from './InstallPluginButton'
import { SearchHighlight, HighlightMatch } from '@/components/ui/search-highlight'

const typeConfig: Record<ComponentType, { icon: typeof Sparkles; color: string }> = {
  skill: { icon: Sparkles, color: 'text-purple-500' },
  agent: { icon: Bot, color: 'text-blue-500' },
  command: { icon: Command, color: 'text-green-500' },
  hook: { icon: Webhook, color: 'text-orange-500' },
  mcp: { icon: Plug, color: 'text-cyan-500' },
}

interface ComponentCardProps {
  component: Component
  isInToolkit?: boolean
  isBookmarked?: boolean
  onAddToToolkit?: (componentId: string) => Promise<void>
  onToggleBookmark?: (componentId: string) => Promise<void>
  /** Match data for highlighting search terms in name */
  nameMatches?: HighlightMatch[]
  /** Match data for highlighting search terms in description */
  descriptionMatches?: HighlightMatch[]
}

export function ComponentCard({
  component,
  isInToolkit = false,
  isBookmarked = false,
  onAddToToolkit,
  onToggleBookmark,
  nameMatches,
  descriptionMatches,
}: ComponentCardProps) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(isInToolkit)
  const [bookmarking, setBookmarking] = useState(false)
  const [bookmarked, setBookmarked] = useState(isBookmarked)
  const [modalOpen, setModalOpen] = useState(false)

  const config = typeConfig[component.type]
  const Icon = config.icon

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!onAddToToolkit || added) return

    setAdding(true)
    try {
      await onAddToToolkit(component.id)
      setAdded(true)
    } catch (error) {
      console.error('Failed to add to toolkit:', error)
    } finally {
      setAdding(false)
    }
  }

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setModalOpen(true)
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!onToggleBookmark || bookmarking) return

    setBookmarking(true)
    const previousState = bookmarked
    setBookmarked(!bookmarked) // Optimistic update

    try {
      await onToggleBookmark(component.id)
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
      setBookmarked(previousState) // Revert on error
    } finally {
      setBookmarking(false)
    }
  }

  return (
    <FloatingCard>
      <Link
        href={`/claude-code/${component.type}s/${component.slug}`}
        className="glass border-primary/20 rounded-xl p-5 hover:border-primary/50 transition-all hover:shadow-lg group flex flex-col h-full"
      >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {component.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {component.is_official && (
            <Badge variant="secondary" className="text-xs">Official</Badge>
          )}
          {component.is_verified && (
            <Badge variant="outline" className="text-xs text-green-500 border-green-500/50">
              <Check className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
        <SearchHighlight
          text={component.name}
          matches={nameMatches}
        />
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
        <SearchHighlight
          text={component.description || ''}
          matches={descriptionMatches}
        />
      </p>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        {component.tags?.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {component.tags && component.tags.length > 3 && (
          <span className="text-xs text-muted-foreground">+{component.tags.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {component.rating && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {component.rating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {component.downloads}
          </span>
          <span>v{component.version}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* View Content Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={handleView}
                className="h-7 w-7 p-0"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View content</TooltipContent>
          </Tooltip>

          {/* Install Plugin Button */}
          <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="inline-flex">
            <InstallPluginButton slug={component.slug} />
          </span>

          {/* Bookmark Button */}
          {onToggleBookmark && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  className="h-7 w-7 p-0"
                >
                  <Bookmark
                    className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current text-primary' : ''}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{bookmarked ? 'Remove bookmark' : 'Bookmark'}</TooltipContent>
            </Tooltip>
          )}

          {/* Add to Toolkit Button */}
          {onAddToToolkit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant={added ? 'secondary' : 'default'}
                  onClick={handleAdd}
                  disabled={adding || added}
                  className="h-7 w-7 p-0"
                >
                  {added ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : adding ? (
                    <Plus className="h-3.5 w-3.5 animate-pulse" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{added ? 'In toolkit' : 'Add to toolkit'}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Content Modal */}
      <ComponentContentModal
        component={component}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
      </Link>
    </FloatingCard>
  )
}
