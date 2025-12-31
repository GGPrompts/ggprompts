import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ForumPostList } from '@/components/forums/ForumPostList'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Plus } from 'lucide-react'
import { ForumPost } from '@/lib/types'

async function getForumPosts(): Promise<(ForumPost & { comment_count: number })[]> {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, users!user_id(username, display_name, avatar_url)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching forum posts:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return []
  }

  // Get comment counts for each post
  const postsWithCounts = await Promise.all(
    (posts || []).map(async (post) => {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id)

      return {
        ...post,
        comment_count: count || 0,
      }
    })
  )

  return postsWithCounts as (ForumPost & { comment_count: number })[]
}

function ForumsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass border-border/50 rounded-xl p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 bg-muted rounded-full" />
              <div className="h-4 bg-muted rounded w-20" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 bg-muted rounded w-12" />
              <div className="h-4 bg-muted rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function ForumsContent() {
  const posts = await getForumPosts()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          <span className="text-foreground font-medium">{posts.length}</span> discussions
        </p>
      </div>
      <ForumPostList posts={posts} />
    </>
  )
}

export default async function ForumsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
              <MessageSquare className="w-3 h-3 mr-1" />
              Community Forums
            </Badge>

            <h1 className="text-3xl md:text-5xl font-mono font-bold mb-6 tracking-tight">
              <span className="gradient-text-theme animate-gradient">
                Join the Discussion
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Connect with fellow prompt engineers. Share insights, ask questions, and learn from the community.
            </p>

            <Button asChild size="lg">
              <Link href="/forums/new">
                <Plus className="w-4 h-4 mr-2" />
                Start a Discussion
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Forums List */}
      <section className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={<ForumsSkeleton />}>
              <ForumsContent />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  )
}
