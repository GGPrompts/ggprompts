'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage } from '@ggprompts/ui'
import { MessageCircle, Clock } from 'lucide-react'
import { ForumPost } from '@/lib/types'

interface ForumPostCardProps {
  post: ForumPost & { comment_count?: number }
}

export function ForumPostCard({ post }: ForumPostCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const truncateContent = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  const formatDate = (dateString: string) => {
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

  const username = post.users?.username || 'Anonymous'
  const avatarUrl = post.users?.avatar_url

  return (
    <Link href={`/forums/${post.id}`}>
      <Card className="glass border-border/50 hover:border-primary/30 transition-all cursor-pointer group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateContent(post.content)}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={username} />}
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(username)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{username}</span>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{post.comment_count || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{formatDate(post.created_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
