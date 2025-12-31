import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent, Separator } from '@ggprompts/ui'
import { ArrowLeft, MessageSquare, Clock } from 'lucide-react'
import { LocalDate } from '@/components/LocalDate'
import { MarkdownContent } from '@/components/claude-code/MarkdownContent'
import { ForumPost, ForumComment } from '@/lib/types'
import { CommentForm } from '@/components/forums/CommentForm'
import { CommentList } from '@/components/forums/CommentList'
import { DeletePostButton } from '@/components/forums/DeletePostButton'

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

async function getPost(id: string): Promise<ForumPost | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*, users!user_id(username, display_name, avatar_url)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data as ForumPost
}

async function getComments(postId: string): Promise<ForumComment[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('comments')
    .select('*, users!user_id(username, display_name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data as ForumComment[]
}

async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, isAdmin: false }

  // Fetch user role
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  return { user, isAdmin: data?.role === 'admin' }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}


function PostSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-muted rounded w-3/4" />
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-muted rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-32" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    </div>
  )
}

async function PostContent({ id }: { id: string }) {
  const [post, comments, { user, isAdmin }] = await Promise.all([
    getPost(id),
    getComments(id),
    getCurrentUser(),
  ])

  if (!post) {
    notFound()
  }

  const username = post.users?.username || post.users?.display_name || 'Anonymous'
  const avatarUrl = post.users?.avatar_url

  return (
    <>
      {/* Post */}
      <Card className="glass border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
            {isAdmin && <DeletePostButton postId={post.id} />}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Avatar className="h-10 w-10">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={username} />}
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{username}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <LocalDate dateString={post.created_at} />
              </div>
            </div>
          </div>

          <MarkdownContent content={post.content} />
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h2>
        </div>

        {user ? (
          <CommentForm postId={id} />
        ) : (
          <Card className="glass border-border/50">
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                Sign in to join the discussion
              </p>
              <Button asChild variant="outline">
                <Link href="/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Separator className="bg-border/50" />

        <CommentList comments={comments} postId={id} isAdmin={isAdmin} />
      </div>
    </>
  )
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/forums">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forums
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Suspense fallback={<PostSkeleton />}>
              <PostContent id={id} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  )
}
