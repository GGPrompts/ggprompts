import { createClient } from '@/lib/supabase/server'
import { Component, ComponentCategory } from '@/lib/types'
import { ComponentGrid } from '@/components/claude-code/ComponentGrid'
import { MarketplaceSearchInput } from '@/components/claude-code/MarketplaceSearchInput'
import { Badge, Button } from '@ggprompts/ui'
import Link from 'next/link'
import { Webhook, ArrowLeft, Filter } from 'lucide-react'

interface HooksPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
  }>
}

export default async function HooksPage({ searchParams }: HooksPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from('component_categories')
    .select('*')
    .or('component_type.eq.hook,component_type.is.null')
    .order('sort_order')

  // Build query - only show approved components to public
  let query = supabase
    .from('components')
    .select('*')
    .eq('type', 'hook')
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('downloads', { ascending: false })

  // Apply search filter
  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }

  // Apply category filter
  if (params.category) {
    query = query.eq('category', params.category)
  }

  const { data: hooks } = await query

  // Get current user's toolkit and bookmarks
  const { data: { user } } = await supabase.auth.getUser()
  let toolkitIds: string[] = []
  let bookmarkedIds: string[] = []

  if (user) {
    const [toolkitResult, bookmarksResult] = await Promise.all([
      supabase
        .from('user_toolkit')
        .select('component_id')
        .eq('user_id', user.id),
      supabase
        .from('user_component_bookmarks')
        .select('component_id')
        .eq('user_id', user.id)
    ])

    toolkitIds = toolkitResult.data?.map(t => t.component_id) || []
    bookmarkedIds = bookmarksResult.data?.map(b => b.component_id) || []
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/claude-code"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Marketplace
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Webhook className="h-6 w-6 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold">Hooks</h1>
          <Badge variant="secondary">{hooks?.length || 0}</Badge>
        </div>

        <p className="text-muted-foreground">
          Event-driven scripts that run before or after Claude Code actions
        </p>
      </div>

      {/* Filters */}
      <div className="glass border-border/50 rounded-xl p-4 mb-8">
        <form className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <MarketplaceSearchInput
              name="q"
              placeholder="Search hooks..."
              defaultValue={params.q}
            />
            <Button type="submit" className="sm:flex-shrink-0">Search</Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Link href="/claude-code/hooks">
              <Badge
                variant={!params.category ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80"
              >
                All
              </Badge>
            </Link>
            {categories?.map((cat) => (
              <Link key={cat.slug} href={`/claude-code/hooks?category=${cat.slug}`}>
                <Badge
                  variant={params.category === cat.slug ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/80"
                >
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>
        </form>
      </div>

      {/* Results */}
      {hooks && hooks.length > 0 ? (
        <ComponentGrid
          components={hooks as Component[]}
          toolkitIds={toolkitIds}
          bookmarkedIds={bookmarkedIds}
          isAuthenticated={!!user}
          searchQuery={params.q}
        />
      ) : (
        <div className="text-center py-20">
          <Webhook className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No hooks found</h3>
          <p className="text-muted-foreground">
            {params.q || params.category
              ? 'Try adjusting your search or filter criteria.'
              : 'Check back soon for new hooks!'}
          </p>
        </div>
      )}
    </div>
  )
}
