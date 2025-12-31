'use client'

import { useCallback, useState, useTransition, useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Heart,
  Bookmark,
  User,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

// Sort options
export type SortOption = 'newest' | 'oldest' | 'most-liked' | 'most-used'

export interface SearchFilters {
  query: string
  sort: SortOption
  myPromptsOnly: boolean
  likedOnly: boolean
  bookmarkedOnly: boolean
}

interface SearchBarProps {
  defaultValue?: string
  defaultSort?: SortOption
  defaultMyPrompts?: boolean
  defaultLikedOnly?: boolean
  defaultBookmarkedOnly?: boolean
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most-liked', label: 'Most Liked' },
  { value: 'most-used', label: 'Most Used' },
]

export function SearchBar({
  defaultValue = '',
  defaultSort = 'newest',
  defaultMyPrompts = false,
  defaultLikedOnly = false,
  defaultBookmarkedOnly = false,
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { user, loading: authLoading } = useAuth()

  // Local state
  const [value, setValue] = useState(defaultValue)
  const [sort, setSort] = useState<SortOption>(defaultSort)
  const [myPromptsOnly, setMyPromptsOnly] = useState(defaultMyPrompts)
  const [likedOnly, setLikedOnly] = useState(defaultLikedOnly)
  const [bookmarkedOnly, setBookmarkedOnly] = useState(defaultBookmarkedOnly)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Track if any filters are active (besides search)
  const hasActiveFilters = sort !== 'newest' || myPromptsOnly || likedOnly || bookmarkedOnly

  // Debounce timer ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  // Search input ref for keyboard navigation
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle "/" to focus search and Escape to clear/blur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const isEditable = target.isContentEditable
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select'

      // "/" to focus search (only when not in input)
      if (e.key === '/' && !isInput && !isEditable) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Update URL with all filter parameters
  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    const newQuery = updates.query ?? value
    const newSort = updates.sort ?? sort
    const newMyPrompts = updates.myPromptsOnly ?? myPromptsOnly
    const newLikedOnly = updates.likedOnly ?? likedOnly
    const newBookmarkedOnly = updates.bookmarkedOnly ?? bookmarkedOnly

    const params = new URLSearchParams(searchParams.toString())

    // Query
    if (newQuery) {
      params.set('q', newQuery)
    } else {
      params.delete('q')
    }

    // Sort
    if (newSort !== 'newest') {
      params.set('sort', newSort)
    } else {
      params.delete('sort')
    }

    // My prompts only
    if (newMyPrompts) {
      params.set('mine', '1')
    } else {
      params.delete('mine')
    }

    // Liked only
    if (newLikedOnly) {
      params.set('liked', '1')
    } else {
      params.delete('liked')
    }

    // Bookmarked only
    if (newBookmarkedOnly) {
      params.set('bookmarked', '1')
    } else {
      params.delete('bookmarked')
    }

    // Reset to page 1 when filtering
    params.delete('page')

    startTransition(() => {
      router.push(`/prompts?${params.toString()}`, { scroll: false })
    })
  }, [router, searchParams, value, sort, myPromptsOnly, likedOnly, bookmarkedOnly])

  // Handle search input change with debounce
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    // Clear existing timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce by 300ms
    debounceRef.current = setTimeout(() => {
      updateFilters({ query: newValue })
    }, 300)
  }, [updateFilters])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const clearSearch = useCallback(() => {
    setValue('')
    updateFilters({ query: '' })
  }, [updateFilters])

  // Handle Escape in search input
  const handleInputKeyDown = useCallback((e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      if (value) {
        clearSearch()
      }
      inputRef.current?.blur()
    }
  }, [value, clearSearch])

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort)
    updateFilters({ sort: newSort })
  }

  const handleMyPromptsToggle = (checked: boolean) => {
    setMyPromptsOnly(checked)
    updateFilters({ myPromptsOnly: checked })
  }

  const handleLikedOnlyToggle = (checked: boolean) => {
    setLikedOnly(checked)
    updateFilters({ likedOnly: checked })
  }

  const handleBookmarkedOnlyToggle = (checked: boolean) => {
    setBookmarkedOnly(checked)
    updateFilters({ bookmarkedOnly: checked })
  }

  const clearAllFilters = () => {
    setValue('')
    setSort('newest')
    setMyPromptsOnly(false)
    setLikedOnly(false)
    setBookmarkedOnly(false)
    updateFilters({
      query: '',
      sort: 'newest',
      myPromptsOnly: false,
      likedOnly: false,
      bookmarkedOnly: false,
    })
    setFiltersOpen(false)
  }

  const isAuthenticated = !authLoading && !!user

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <div className="flex items-center gap-2">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search prompts... (press /)"
          value={value}
          onChange={handleSearchChange}
          onKeyDown={handleInputKeyDown}
          className="pl-10 pr-10 h-11 glass border-border/50 focus:border-primary/50"
        />
        {value && !isPending && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Sort Dropdown */}
      <Select value={sort} onValueChange={(val) => handleSortChange(val as SortOption)}>
        <SelectTrigger className="w-[150px] h-11 glass border-border/50">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Advanced Filters Popover */}
      <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={`h-11 w-11 glass border-border/50 ${hasActiveFilters ? 'border-primary/50 text-primary' : ''}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
            )}
            <span className="sr-only">Filter options</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 glass" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={clearAllFilters}
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* User-specific filters (only show when authenticated) */}
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="my-prompts"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    My Prompts
                  </Label>
                  <Switch
                    id="my-prompts"
                    checked={myPromptsOnly}
                    onCheckedChange={handleMyPromptsToggle}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="liked-only"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Heart className="h-4 w-4" />
                    Liked
                  </Label>
                  <Switch
                    id="liked-only"
                    checked={likedOnly}
                    onCheckedChange={handleLikedOnlyToggle}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="bookmarked-only"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Bookmark className="h-4 w-4" />
                    Bookmarked
                  </Label>
                  <Switch
                    id="bookmarked-only"
                    checked={bookmarkedOnly}
                    onCheckedChange={handleBookmarkedOnlyToggle}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sign in to filter by your prompts, likes, and bookmarks.
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      </div>

      {/* Active filter badges */}
      {(myPromptsOnly || likedOnly || bookmarkedOnly) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {myPromptsOnly && (
            <button
              onClick={() => handleMyPromptsToggle(false)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            >
              <User className="h-3 w-3" />
              My Prompts
              <X className="h-3 w-3" />
            </button>
          )}
          {likedOnly && (
            <button
              onClick={() => handleLikedOnlyToggle(false)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Heart className="h-3 w-3 fill-current" />
              Liked
              <X className="h-3 w-3" />
            </button>
          )}
          {bookmarkedOnly && (
            <button
              onClick={() => handleBookmarkedOnlyToggle(false)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
            >
              <Bookmark className="h-3 w-3 fill-current" />
              Bookmarked
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
