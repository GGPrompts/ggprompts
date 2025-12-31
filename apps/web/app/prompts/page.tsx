import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { SearchBar, SortOption } from '@/components/prompts/SearchBar'
import { CategoryFilter } from '@/components/prompts/CategoryFilter'
import { PromptGrid } from '@/components/prompts/PromptGrid'
import { CreatePromptButton } from '@/components/prompts/CreatePromptButton'
import { Badge } from '@ggprompts/ui'
import { Sparkles } from 'lucide-react'
import { fetchPrompts } from './actions'
import { FetchPromptsParams } from './constants'

interface PromptsPageProps {
  searchParams: Promise<{
    q?: string
    categories?: string
    page?: string
    sort?: SortOption
    mine?: string
    liked?: string
    bookmarked?: string
  }>
}

function PromptsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="glass border-border/50 rounded-xl p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-border/50">
            <div className="h-7 w-7 bg-muted rounded-full" />
            <div className="h-4 bg-muted rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface PromptsContentProps {
  query?: string
  categories?: string[]
  sort?: SortOption
  userId?: string
  myPromptsOnly?: boolean
  likedOnly?: boolean
  bookmarkedOnly?: boolean
  /** Search query for fuzzy matching (passed to client) */
  searchQuery?: string
}

async function PromptsContent(props: PromptsContentProps) {
  const { query, categories, sort = 'newest', userId, myPromptsOnly, likedOnly, bookmarkedOnly, searchQuery } = props

  // Fetch initial page of prompts
  const { prompts, total, hasMore } = await fetchPrompts({
    page: 1,
    query,
    categories,
    sort,
    userId,
    myPromptsOnly,
    likedOnly,
    bookmarkedOnly,
  })

  const hasFilters = query || (categories && categories.length > 0) || myPromptsOnly || likedOnly || bookmarkedOnly

  if (prompts.length === 0) {
    return (
      <div className="text-center py-20">
        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No prompts found</h3>
        <p className="text-muted-foreground">
          {hasFilters
            ? 'Try adjusting your search or filter criteria.'
            : 'Be the first to share a prompt!'}
        </p>
      </div>
    )
  }

  // Build filter params for client-side pagination
  const filterParams: FetchPromptsParams = {
    page: 1,
    query,
    categories,
    sort,
    userId,
    myPromptsOnly,
    likedOnly,
    bookmarkedOnly,
  }

  return (
    <PromptGrid
      initialPrompts={prompts}
      initialTotal={total}
      initialHasMore={hasMore}
      filterParams={filterParams}
      searchQuery={searchQuery}
    />
  )
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const categories = params.categories?.split(',').filter(Boolean) || []
  const sort = (params.sort as SortOption) || 'newest'
  const myPromptsOnly = params.mine === '1'
  const likedOnly = params.liked === '1'
  const bookmarkedOnly = params.bookmarked === '1'

  // Get the current user ID for server-side filtering
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              Prompt Library
            </Badge>

            <h1 className="text-3xl md:text-5xl font-mono font-bold mb-6 tracking-tight">
              <span className="gradient-text-theme animate-gradient">
                Discover AI Prompts
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Browse our curated collection of high-quality prompts crafted by the community.
            </p>

            {/* Search Bar and Create Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Suspense fallback={<div className="w-full max-w-2xl h-11 glass rounded-md animate-pulse" />}>
                <SearchBar
                  defaultValue={query}
                  defaultSort={sort}
                  defaultMyPrompts={myPromptsOnly}
                  defaultLikedOnly={likedOnly}
                  defaultBookmarkedOnly={bookmarkedOnly}
                />
              </Suspense>
              <CreatePromptButton />
            </div>

            {/* Category Filter */}
            <Suspense fallback={<div className="h-10" />}>
              <CategoryFilter currentCategories={categories} />
            </Suspense>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Prompts Grid */}
      <section className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <Suspense fallback={<PromptsSkeleton />}>
            <PromptsContent
              query={query}
              categories={categories}
              sort={sort}
              userId={userId}
              myPromptsOnly={myPromptsOnly}
              likedOnly={likedOnly}
              bookmarkedOnly={bookmarkedOnly}
              searchQuery={query}
            />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
