'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Badge, Avatar, AvatarFallback, AvatarImage, Button } from '@ggprompts/ui'
import { FloatingCard } from '@/components/ui/floating-card'
import { Heart, Copy, Check, FileText, Bookmark } from 'lucide-react'
import { Prompt } from '@/lib/types'
import { isTemplate, parseTemplate } from '@/lib/prompt-template'
import { useAuth } from '@/hooks/useAuth'
import { togglePromptLike, toggleBookmark, incrementUsageCount } from '@/lib/database/prompt-interactions'
import { generateDiceBearAvatar, getInitials } from '@/lib/avatar'
import { getCategoryByValue } from '@/lib/constants/categories'
import { SendToTerminalButton } from './SendToTerminalButton'
import { SearchHighlight, HighlightMatch } from '@/components/ui/search-highlight'

interface PromptCardProps {
  prompt: Prompt
  onClick: () => void
  isLiked?: boolean
  isBookmarked?: boolean
  onLikeChange?: (promptId: string, liked: boolean, newCount: number) => void
  onBookmarkChange?: (promptId: string, bookmarked: boolean) => void
  /** Match data for highlighting search terms in title */
  titleMatches?: HighlightMatch[]
  /** Match data for highlighting search terms in description/content */
  descriptionMatches?: HighlightMatch[]
}

export function PromptCard({
  prompt,
  onClick,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  onLikeChange,
  onBookmarkChange,
  titleMatches,
  descriptionMatches,
}: PromptCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(prompt.like_count || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isBookmarking, setIsBookmarking] = useState(false)

  // Check if this is a template prompt
  const promptIsTemplate = prompt.is_template || isTemplate(prompt.content)
  const fieldCount = promptIsTemplate ? parseTemplate(prompt.content).fields.length : 0

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)

      // Track usage
      try {
        await incrementUsageCount(prompt.id)
      } catch (error) {
        console.warn('Failed to track usage:', error)
      }

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()

      if (!user) {
        router.push('/login')
        return
      }

      if (isLiking) return

      // Optimistic update
      const previousLiked = isLiked
      const previousCount = likeCount
      const newLiked = !isLiked
      setIsLiked(newLiked)
      setLikeCount(newLiked ? likeCount + 1 : likeCount - 1)
      setIsLiking(true)

      try {
        const result = await togglePromptLike(prompt.id, user.id)
        setIsLiked(result.liked)
        setLikeCount(result.newCount)

        // Notify parent of change
        if (onLikeChange) {
          onLikeChange(prompt.id, result.liked, result.newCount)
        }
      } catch (error) {
        // Rollback on error
        console.error('Failed to toggle like:', error)
        setIsLiked(previousLiked)
        setLikeCount(previousCount)
      } finally {
        setIsLiking(false)
      }
    },
    [user, router, isLiked, likeCount, isLiking, prompt.id, onLikeChange]
  )

  const handleBookmark = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()

      if (!user) {
        router.push('/login')
        return
      }

      if (isBookmarking) return

      // Optimistic update
      const previousBookmarked = isBookmarked
      setIsBookmarked(!isBookmarked)
      setIsBookmarking(true)

      try {
        const result = await toggleBookmark(prompt.id, user.id)
        setIsBookmarked(result)

        // Notify parent of change
        if (onBookmarkChange) {
          onBookmarkChange(prompt.id, result)
        }
      } catch (error) {
        // Rollback on error
        console.error('Failed to toggle bookmark:', error)
        setIsBookmarked(previousBookmarked)
      } finally {
        setIsBookmarking(false)
      }
    },
    [user, router, isBookmarked, isBookmarking, prompt.id, onBookmarkChange]
  )

  // Generate avatar for author
  const authorAvatarUrl = prompt.username
    ? generateDiceBearAvatar(prompt.username)
    : generateDiceBearAvatar('anonymous')

  return (
    <FloatingCard>
      <Card
        className="glass border-primary/20 hover:border-primary/50 transition-all cursor-pointer group h-full"
        onClick={onClick}
      >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          <SearchHighlight
            text={prompt.title}
            matches={titleMatches}
          />
        </CardTitle>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {promptIsTemplate && (
            <Badge
              variant="outline"
              className="gap-1 border-primary/50 text-primary text-xs"
            >
              <FileText className="h-3 w-3" />
              {fieldCount}
            </Badge>
          )}
          {prompt.category && (() => {
            const category = getCategoryByValue(prompt.category)
            const Icon = category?.icon
            return (
              <Badge variant="secondary" className="text-xs gap-1">
                {Icon && <Icon className="h-3 w-3" />}
                {category?.name || prompt.category}
              </Badge>
            )
          })()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          <SearchHighlight
            text={prompt.description || prompt.content}
            matches={descriptionMatches}
          />
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={authorAvatarUrl} alt={prompt.username || 'Author'} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(prompt.username)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {prompt.username || 'Anonymous'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 h-8 px-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </Button>

            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isBookmarked ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={handleBookmark}
              disabled={isBookmarking}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="sr-only">{isBookmarked ? 'Remove bookmark' : 'Bookmark'}</span>
            </Button>

            {/* Send to Terminal Button */}
            <SendToTerminalButton
              content={prompt.content}
              title={prompt.title}
              variant="icon"
            />

            {/* Copy Button */}
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
              <span className="sr-only">Copy prompt</span>
            </Button>
          </div>
        </div>
      </CardContent>
      </Card>
    </FloatingCard>
  )
}
