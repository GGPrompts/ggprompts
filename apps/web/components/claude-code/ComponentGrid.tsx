'use client'

import { useMemo, useEffect, useState } from 'react'
import { Component } from '@/lib/types'
import { ComponentCard } from './ComponentCard'
import { addToToolkit, toggleComponentBookmark } from '@/app/claude-code/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useFuzzySearch } from '@/hooks/useFuzzySearch'
import { getMatchesForField } from '@/components/ui/search-highlight'
import { useKeyboardNav } from '@/hooks'
import { cn } from '@ggprompts/ui'

// Responsive column breakpoints matching Tailwind classes
function useResponsiveColumns() {
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width >= 1024) setColumns(3)       // lg:grid-cols-3
      else if (width >= 768) setColumns(2)   // md:grid-cols-2
      else setColumns(1)                      // default
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  return columns
}

// Keys to search in for fuzzy matching
const FUZZY_SEARCH_KEYS = ['name', 'description']

interface ComponentGridProps {
  components: Component[]
  toolkitIds: string[]
  bookmarkedIds: string[]
  isAuthenticated: boolean
  /** Search query for client-side fuzzy matching and highlighting */
  searchQuery?: string
}

export function ComponentGrid({
  components,
  toolkitIds,
  bookmarkedIds,
  isAuthenticated,
  searchQuery = '',
}: ComponentGridProps) {
  const router = useRouter()
  const columns = useResponsiveColumns()

  // Apply client-side fuzzy search for better matching and highlighting
  const { results: fuzzyResults, isSearching } = useFuzzySearch(
    components,
    FUZZY_SEARCH_KEYS,
    searchQuery,
    {
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    }
  )

  // Map fuzzy results to components with match data
  const componentsWithMatches = useMemo(() => {
    return fuzzyResults.map((result) => ({
      component: result.item,
      nameMatches: getMatchesForField(result.matches, 'name'),
      descriptionMatches: getMatchesForField(result.matches, 'description'),
    }))
  }, [fuzzyResults])

  // Keyboard navigation - Enter opens component detail page
  const { selectedIndex, isSelected, getItemProps } = useKeyboardNav({
    itemCount: componentsWithMatches.length,
    columns,
    onSelect: (index) => {
      const item = componentsWithMatches[index]
      if (item) {
        router.push(`/claude-code/${item.component.type}s/${item.component.slug}`)
      }
    },
  })

  const handleAddToToolkit = async (component: Component) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add to toolkit')
      router.push(`/login?redirect=/claude-code/${component.type}s`)
      return
    }

    const result = await addToToolkit(component.id)

    if (result.success) {
      toast.success(`Added ${component.name} to toolkit`)
    } else {
      toast.error(result.error || 'Failed to add to toolkit')
      throw new Error(result.error)
    }
  }

  const handleToggleBookmark = async (component: Component) => {
    if (!isAuthenticated) {
      toast.error('Please log in to bookmark')
      router.push(`/login?redirect=/claude-code/${component.type}s`)
      return
    }

    const result = await toggleComponentBookmark(component.id)

    if (result.success) {
      if (result.bookmarked) {
        toast.success(`Bookmarked ${component.name}`)
      } else {
        toast.success(`Removed bookmark`)
      }
    } else {
      toast.error(result.error || 'Failed to toggle bookmark')
      throw new Error(result.error)
    }
  }

  if (componentsWithMatches.length === 0) {
    return null
  }

  return (
    <div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="listbox"
      aria-label="Components"
    >
      {componentsWithMatches.map(({ component, nameMatches, descriptionMatches }, index) => (
        <div
          key={component.id}
          {...getItemProps(index)}
          className={cn(
            'rounded-xl transition-all outline-none',
            isSelected(index) && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          )}
          role="option"
          aria-selected={isSelected(index)}
        >
          <ComponentCard
            component={component}
            isInToolkit={toolkitIds.includes(component.id)}
            isBookmarked={bookmarkedIds.includes(component.id)}
            onAddToToolkit={() => handleAddToToolkit(component)}
            onToggleBookmark={() => handleToggleBookmark(component)}
            nameMatches={nameMatches}
            descriptionMatches={descriptionMatches}
          />
        </div>
      ))}
    </div>
  )
}
