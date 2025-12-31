'use client'

import { useState, useTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Trash2, Loader2 } from 'lucide-react'
import { ForumComment } from '@/lib/types'
import { deleteComment } from '@/app/forums/actions'
import { MarkdownContent } from '@/components/claude-code/MarkdownContent'

interface CommentListProps {
  comments: ForumComment[]
  postId: string
  isAdmin?: boolean
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function CommentList({ comments, postId, isAdmin }: CommentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    setDeletingId(commentId)
    startTransition(async () => {
      const result = await deleteComment(commentId, postId)
      if (!result.success) {
        alert(result.error || 'Failed to delete comment')
      }
      setDeletingId(null)
    })
  }

  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No comments yet. Be the first to share your thoughts!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const username = comment.users?.username || comment.users?.display_name || 'Anonymous'
        const avatarUrl = comment.users?.avatar_url
        const isDeleting = deletingId === comment.id && isPending

        return (
          <Card key={comment.id} className="glass border-border/50">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={username} />}
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{username}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(comment.created_at)}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(comment.id)}
                        disabled={isDeleting}
                        title="Delete comment (Admin)"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                  </div>

                  <MarkdownContent
                    content={comment.content}
                    className="text-sm [&_p]:mb-2 [&_p:last-child]:mb-0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
