'use client'

import { useMemo } from 'react'
import Fuse, { IFuseOptions, FuseResult, FuseResultMatch } from 'fuse.js'

export interface FuzzySearchOptions<T> extends IFuseOptions<T> {
  /** Minimum score threshold (0 = perfect match, 1 = no match). Results above this are filtered out */
  scoreThreshold?: number
}

export interface FuzzySearchResult<T> {
  /** The matched item */
  item: T
  /** Match score (0 = perfect, 1 = no match) */
  score: number
  /** Match details with indices for highlighting */
  matches: readonly FuseResultMatch[]
  /** Original index in the data array */
  refIndex: number
}

const defaultOptions: Partial<IFuseOptions<unknown>> = {
  // Include match info for highlighting
  includeMatches: true,
  includeScore: true,
  // Fuzzy matching settings
  threshold: 0.4, // Lower = stricter matching (0 = exact, 1 = match anything)
  distance: 100, // How far to search for a fuzzy match
  ignoreLocation: true, // Search entire string, not just beginning
  minMatchCharLength: 2,
  // Use extended search for more powerful queries
  useExtendedSearch: false,
}

/**
 * Hook for client-side fuzzy search using Fuse.js
 *
 * @param data - Array of items to search through
 * @param keys - Fields to search in (e.g., ['title', 'description'])
 * @param query - Search query string
 * @param options - Optional Fuse.js configuration
 * @returns Sorted array of results with match data for highlighting
 *
 * @example
 * ```tsx
 * const { results, hasResults } = useFuzzySearch(
 *   prompts,
 *   ['title', 'description', 'content'],
 *   searchQuery,
 *   { threshold: 0.3 }
 * )
 * ```
 */
export function useFuzzySearch<T>(
  data: T[],
  keys: string[],
  query: string,
  options: FuzzySearchOptions<T> = {}
): {
  results: FuzzySearchResult<T>[]
  hasResults: boolean
  isSearching: boolean
} {
  const fuse = useMemo(() => {
    const fuseOptions: IFuseOptions<T> = {
      ...defaultOptions,
      ...options,
      keys,
    }
    return new Fuse(data, fuseOptions)
  }, [data, keys, options])

  const results = useMemo(() => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      // Return all items with no matches when there's no query
      return data.map((item, index) => ({
        item,
        score: 0,
        matches: [],
        refIndex: index,
      }))
    }

    const fuseResults = fuse.search(trimmedQuery)
    const { scoreThreshold = 0.6 } = options

    // Filter by score threshold and map to our format
    return fuseResults
      .filter((result) => (result.score ?? 1) <= scoreThreshold)
      .map((result) => ({
        item: result.item,
        score: result.score ?? 0,
        matches: result.matches ?? [],
        refIndex: result.refIndex ?? 0,
      }))
  }, [fuse, query, data, options])

  return {
    results,
    hasResults: results.length > 0,
    isSearching: query.trim().length > 0,
  }
}

/**
 * Create a standalone Fuse instance for use outside of React components
 */
export function createFuzzySearch<T>(
  data: T[],
  keys: string[],
  options: FuzzySearchOptions<T> = {}
): Fuse<T> {
  const fuseOptions: IFuseOptions<T> = {
    ...defaultOptions,
    ...options,
    keys,
  }
  return new Fuse(data, fuseOptions)
}
