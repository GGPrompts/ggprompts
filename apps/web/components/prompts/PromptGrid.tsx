'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { PromptCard } from './PromptCard'
import { PromptDetailModal } from './PromptDetailModal'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Prompt } from '@/lib/types'
import { fetchPrompts } from '@/app/prompts/actions'
import { FetchPromptsParams } from '@/app/prompts/constants'
import { useFuzzySearch, FuzzySearchResult } from '@/hooks/useFuzzySearch'
import { useAuth } from '@/hooks/useAuth'
import { getUserInteractionStates } from '@/lib/database/prompt-interactions'
import { getMatchesForField } from '@/components/ui/search-highlight'
import { useKeyboardNav } from '@/hooks'
import { cn } from '@/lib/utils'

// Responsive column breakpoints matching Tailwind classes
function useResponsiveColumns() {
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width >= 1280) setColumns(4)       // xl:grid-cols-4
      else if (width >= 1024) setColumns(3)  // lg:grid-cols-3
      else if (width >= 768) setColumns(2)   // md:grid-cols-2
      else setColumns(1)                      // grid-cols-1
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  return columns
}

interface PromptGridProps {
  initialPrompts: Prompt[]
  initialTotal: number
  initialHasMore: boolean
  filterParams: FetchPromptsParams
  /** Search query for client-side fuzzy matching and highlighting */
  searchQuery?: string
}

// Keys to search in for fuzzy matching
const FUZZY_SEARCH_KEYS = ['title', 'description', 'content']

export function PromptGrid({
  initialPrompts,
  initialTotal,
  initialHasMore,
  filterParams,
  searchQuery = '',
}: PromptGridProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [prompts, setPrompts] = useState(initialPrompts)
  const [total, setTotal] = useState(initialTotal)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const columns = useResponsiveColumns()

  // Reset state when server data changes (e.g., after filtering)
  useEffect(() => {
    setPrompts(initialPrompts)
    setTotal(initialTotal)
    setHasMore(initialHasMore)
    setCurrentPage(1)
  }, [initialPrompts, initialTotal, initialHasMore])

  // Fetch user's liked and bookmarked prompt IDs
  useEffect(() => {
    if (!user || prompts.length === 0) {
      setLikedIds(new Set())
      setBookmarkedIds(new Set())
      return
    }

    // When bookmarkedOnly filter is active, all displayed prompts are bookmarked
    if (filterParams.bookmarkedOnly) {
      setBookmarkedIds(new Set(prompts.map(p => p.id)))
    }

    // When likedOnly filter is active, all displayed prompts are liked
    if (filterParams.likedOnly) {
      setLikedIds(new Set(prompts.map(p => p.id)))
    }

    // Still fetch actual states for accurate display (handles edge cases)
    const promptIds = prompts.map(p => p.id)
    getUserInteractionStates(promptIds, user.id)
      .then(({ likedIds, bookmarkedIds }) => {
        setLikedIds(likedIds)
        setBookmarkedIds(bookmarkedIds)
      })
      .catch(error => {
        console.error('Failed to fetch interaction states:', error)
      })
  }, [user, prompts, filterParams.bookmarkedOnly, filterParams.likedOnly])

  // Apply client-side fuzzy search for better matching and highlighting
  const { results: fuzzyResults, isSearching } = useFuzzySearch(
    prompts,
    FUZZY_SEARCH_KEYS,
    searchQuery,
    {
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    }
  )

  // Map fuzzy results to prompts with match data
  const promptsWithMatches = useMemo(() => {
    return fuzzyResults.map((result) => ({
      prompt: result.item,
      titleMatches: getMatchesForField(result.matches, 'title'),
      descriptionMatches: [
        ...getMatchesForField(result.matches, 'description'),
        ...getMatchesForField(result.matches, 'content'),
      ],
    }))
  }, [fuzzyResults])

  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Keyboard navigation
  const { selectedIndex, isSelected, getItemProps } = useKeyboardNav({
    itemCount: promptsWithMatches.length,
    columns,
    onSelect: (index) => {
      const item = promptsWithMatches[index]
      if (item) {
        setSelectedPrompt(item.prompt)
        setModalOpen(true)
      }
    },
  })

  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setModalOpen(true)
  }

  // Handle prompt update from modal
  const handlePromptUpdate = useCallback((updatedPrompt: Prompt) => {
    // Update in local state for optimistic UI
    setPrompts((prev) =>
      prev.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p))
    )
    // Update the selected prompt in the modal
    setSelectedPrompt(updatedPrompt)
    // Refresh the page data
    router.refresh()
  }, [router])

  // Handle like change from card
  const handleLikeChange = useCallback((promptId: string, liked: boolean, newCount: number) => {
    setLikedIds(prev => {
      const next = new Set(prev)
      if (liked) {
        next.add(promptId)
      } else {
        next.delete(promptId)
      }
      return next
    })
    // Update prompt like count in local state
    setPrompts(prev =>
      prev.map(p => p.id === promptId ? { ...p, like_count: newCount } : p)
    )
  }, [])

  // Handle bookmark change from card
  const handleBookmarkChange = useCallback((promptId: string, bookmarked: boolean) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev)
      if (bookmarked) {
        next.add(promptId)
      } else {
        next.delete(promptId)
      }
      return next
    })
  }, [])

  // Load more prompts
  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const nextPage = currentPage + 1
      const result = await fetchPrompts({
        ...filterParams,
        page: nextPage,
      })

      // Deduplicate before appending
      const existingIds = new Set(prompts.map((p) => p.id))
      const newPrompts = result.prompts.filter((p) => !existingIds.has(p.id))

      setPrompts((prev) => [...prev, ...newPrompts])
      setTotal(result.total)
      setHasMore(result.hasMore)
      setCurrentPage(nextPage)
    } catch (error) {
      console.error('Error loading more prompts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, currentPage, filterParams, prompts])

  // Display count - show fuzzy-matched count when searching
  const displayCount = isSearching ? promptsWithMatches.length : prompts.length

  return (
    <>
      {/* Count display */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing <span className="text-foreground font-medium">{displayCount}</span>
          {total > displayCount && (
            <> of <span className="text-foreground font-medium">{total}</span></>
          )} prompts
          {isSearching && promptsWithMatches.length !== prompts.length && (
            <span className="text-xs ml-2 text-primary">
              (fuzzy matched)
            </span>
          )}
        </p>
      </div>

      {/* Prompt grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="listbox"
        aria-label="Prompts"
      >
        {promptsWithMatches.map(({ prompt, titleMatches, descriptionMatches }, index) => (
          <div
            key={prompt.id}
            {...getItemProps(index)}
            className={cn(
              'rounded-xl transition-all outline-none',
              isSelected(index) && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
            )}
            role="option"
            aria-selected={isSelected(index)}
          >
            <PromptCard
              prompt={prompt}
              onClick={() => handlePromptClick(prompt)}
              isLiked={likedIds.has(prompt.id)}
              isBookmarked={bookmarkedIds.has(prompt.id)}
              onLikeChange={handleLikeChange}
              onBookmarkChange={handleBookmarkChange}
              titleMatches={titleMatches}
              descriptionMatches={descriptionMatches}
            />
          </div>
        ))}
      </div>

      {/* Load More button */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="glass border-border/50 hover:border-primary/50 min-w-[160px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      <PromptDetailModal
        prompt={selectedPrompt}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdate={handlePromptUpdate}
      />
    </>
  )
}
