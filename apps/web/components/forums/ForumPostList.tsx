'use client'

import { useRouter } from 'next/navigation'
import { ForumPostCard } from './ForumPostCard'
import { ForumPost } from '@/lib/types'
import { MessageSquare } from 'lucide-react'
import { useKeyboardNav } from '@/hooks'
import { cn } from '@/lib/utils'

interface ForumPostListProps {
  posts: (ForumPost & { comment_count?: number })[]
}

export function ForumPostList({ posts }: ForumPostListProps) {
  const router = useRouter()

  const { selectedIndex, isSelected, getItemProps } = useKeyboardNav({
    itemCount: posts.length,
    columns: 1,
    onSelect: (index) => {
      const post = posts[index]
      if (post) {
        router.push(`/forums/${post.id}`)
      }
    },
  })

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No discussions yet</h3>
        <p className="text-muted-foreground">
          Be the first to start a conversation!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4" role="listbox" aria-label="Forum posts">
      {posts.map((post, index) => (
        <div
          key={post.id}
          {...getItemProps(index)}
          className={cn(
            'rounded-xl transition-all outline-none',
            isSelected(index) && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          )}
          role="option"
          aria-selected={isSelected(index)}
        >
          <ForumPostCard post={post} />
        </div>
      ))}
      {selectedIndex >= 0 && (
        <p className="sr-only" aria-live="polite">
          {posts[selectedIndex]?.title} selected. Press Enter to open.
        </p>
      )}
    </div>
  )
}
