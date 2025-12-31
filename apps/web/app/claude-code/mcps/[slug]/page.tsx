import { createClient } from '@/lib/supabase/server'
import { Component } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge, Button } from '@ggprompts/ui'
import { AddToToolkitButton } from '@/components/claude-code/AddToToolkitButton'
import {
  Plug,
  ArrowLeft,
  Star,
  Download,
  Github,
  ExternalLink,
  Clock,
  User,
  Check,
  FileText,
  FolderOpen
} from 'lucide-react'
import { CopyPromptButton } from '@/components/claude-code/CopyPromptButton'
import { FileCopyButton } from '@/components/claude-code/FileCopyButton'
import { ReviewForm } from '@/components/claude-code/ReviewForm'
import { ReviewsList } from '@/components/claude-code/ReviewsList'
import { getComponentReviews, getUserReview } from '@/app/claude-code/review-actions'
import { MarkdownContent } from '@/components/claude-code/MarkdownContent'

interface McpDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function McpDetailPage({ params }: McpDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: mcp } = await supabase
    .from('components')
    .select('*')
    .eq('type', 'mcp')
    .eq('slug', slug)
    .single()

  if (!mcp) {
    notFound()
  }

  // Get current user's toolkit status
  const { data: { user } } = await supabase.auth.getUser()
  let isInToolkit = false

  if (user) {
    const { data: toolkit } = await supabase
      .from('user_toolkit')
      .select('id')
      .eq('user_id', user.id)
      .eq('component_id', mcp.id)
      .single()

    isInToolkit = !!toolkit
  }

  const component = mcp as Component

  // Fetch reviews
  const [reviews, userReview] = await Promise.all([
    getComponentReviews(mcp.id),
    getUserReview(mcp.id)
  ])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <Link
        href="/claude-code/mcps"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to MCP Servers
      </Link>

      {/* Header */}
      <div className="glass border-border/50 rounded-2xl p-8 mb-8">
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 shrink-0">
              <Plug className="h-8 w-8 text-cyan-500" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold">{component.name}</h1>
                {component.is_official && (
                  <Badge variant="secondary">Official</Badge>
                )}
                {component.is_verified && (
                  <Badge variant="outline" className="text-green-500 border-green-500/50">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">v{component.version}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <CopyPromptButton
              componentName={component.name}
              componentType={component.type}
              description={component.description}
              files={component.files}
            />
            {component.source_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={component.source_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Source
                </a>
              </Button>
            )}
            <AddToToolkitButton
              componentId={component.id}
              componentName={component.name}
              isInToolkit={isInToolkit}
              isAuthenticated={!!user}
              redirectPath={`/claude-code/mcps/${slug}`}
            />
          </div>
        </div>

        <p className="text-lg mb-6">{component.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {component.rating && (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              {component.rating.toFixed(1)} ({component.rating_count} reviews)
            </span>
          )}
          <span className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {component.downloads} downloads
          </span>
          {component.author_name && (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {component.author_name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {new Date(component.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Tags */}
      {component.tags && component.tags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {component.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* MCP Files */}
      <div className="space-y-6 mb-8">
        {/* GitHub Link if available */}
        {component.source_url && (
          <div className="glass border-border/50 rounded-xl p-4">
            <a
              href={component.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-primary hover:underline"
            >
              <FolderOpen className="h-5 w-5" />
              <span className="font-medium">View full source on GitHub</span>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </a>
            <p className="text-sm text-muted-foreground mt-2 ml-8">
              Browse all files, folder structure, and version history
            </p>
          </div>
        )}

        {/* File Contents */}
        {component.files && component.files.filter(f => f.path).length > 0 ? (
          component.files.filter(file => file.path).map((file, index) => (
            <div key={file.path} className="glass border-border/50 rounded-xl overflow-hidden">
              {/* File Header */}
              <div className="flex items-center justify-between px-6 py-3 bg-muted/30 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-mono text-sm font-medium">{file.path}</span>
                </div>
                <FileCopyButton
                  content={file.content || ''}
                  fileName={file.path}
                />
              </div>

              {/* File Content */}
              <div className="p-6">
                {file.path?.endsWith('.md') ? (
                  <MarkdownContent content={file.content || ''} />
                ) : (
                  <pre className="font-mono text-sm whitespace-pre-wrap break-words text-foreground/90 leading-relaxed bg-muted/20 rounded-lg p-4 overflow-x-auto">
                    {file.content || ''}
                  </pre>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass border-border/50 rounded-xl p-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No content files available for this MCP server.</p>
          </div>
        )}

        {/* Configuration Info */}
        <div className="glass border-border/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Configure in settings.json:
          </p>
          <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
            <code>~/.claude/settings.json → "mcpServers"</code>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Reviews</h2>

        <div className="space-y-6">
          <ReviewForm
            componentId={component.id}
            componentName={component.name}
            existingReview={userReview}
            isAuthenticated={!!user}
          />

          <ReviewsList reviews={reviews} />
        </div>
      </div>
    </div>
  )
}
