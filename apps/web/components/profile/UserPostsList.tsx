'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ForumPost } from '@/lib/types'
import { MessageSquare, Plus, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface UserPostsListProps {
  posts: ForumPost[]
}

export function UserPostsList({ posts }: UserPostsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength).trim() + '...'
  }

  if (posts.length === 0) {
    return (
      <Card className="border-border/30 bg-transparent">
        <CardContent className="py-16">
          <div className="text-center">
            <div className="glass rounded-full p-4 w-fit mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No forum posts yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't posted in the forums. Join the conversation!
            </p>
            <Button asChild className="gap-2">
              <Link href="/forums">
                <Plus className="h-4 w-4" />
                Browse Forums
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/30 bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-secondary" />
          My Posts
        </CardTitle>
        <Button asChild variant="outline" size="sm" className="gap-2 border-secondary/50">
          <Link href="/forums/new">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/forums/${post.id}`}
              className="block glass rounded-lg p-4 border border-border/30 hover:border-secondary/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground group-hover:text-secondary transition-colors line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {truncateContent(post.content)}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
