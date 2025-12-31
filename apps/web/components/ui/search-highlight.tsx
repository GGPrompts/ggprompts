'use client'

import { useMemo } from 'react'
import Fuse, { FuseResultMatch } from 'fuse.js'

export interface HighlightMatch {
  indices: readonly [number, number][]
  key?: string
  value?: string
}

interface SearchHighlightProps {
  text: string
  matches?: HighlightMatch[]
  highlightClassName?: string
  className?: string
}

/**
 * Component that highlights matched portions of text based on Fuse.js match indices
 */
export function SearchHighlight({
  text,
  matches,
  highlightClassName = 'bg-primary/20 text-primary font-medium rounded-sm px-0.5',
  className = '',
}: SearchHighlightProps) {
  const highlightedText = useMemo(() => {
    if (!matches || matches.length === 0 || !text) {
      return text
    }

    // Collect all match indices for this text
    const allIndices: [number, number][] = []
    for (const match of matches) {
      for (const [start, end] of match.indices) {
        allIndices.push([start, end])
      }
    }

    if (allIndices.length === 0) {
      return text
    }

    // Sort indices by start position
    allIndices.sort((a, b) => a[0] - b[0])

    // Merge overlapping indices
    const mergedIndices: [number, number][] = []
    for (const [start, end] of allIndices) {
      if (mergedIndices.length === 0) {
        mergedIndices.push([start, end])
      } else {
        const last = mergedIndices[mergedIndices.length - 1]
        if (start <= last[1] + 1) {
          // Overlapping or adjacent, merge
          last[1] = Math.max(last[1], end)
        } else {
          mergedIndices.push([start, end])
        }
      }
    }

    // Build the highlighted text parts
    const parts: React.ReactNode[] = []
    let lastIndex = 0

    for (let i = 0; i < mergedIndices.length; i++) {
      const [start, end] = mergedIndices[i]

      // Add non-highlighted part before this match
      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start))
      }

      // Add highlighted part
      parts.push(
        <mark key={i} className={highlightClassName}>
          {text.slice(start, end + 1)}
        </mark>
      )

      lastIndex = end + 1
    }

    // Add remaining non-highlighted text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts
  }, [text, matches, highlightClassName])

  return <span className={className}>{highlightedText}</span>
}

/**
 * Helper function to extract matches for a specific field from Fuse.js result
 */
export function getMatchesForField(
  matches: readonly FuseResultMatch[] | undefined,
  fieldName: string
): HighlightMatch[] {
  if (!matches) return []

  return matches
    .filter((match) => match.key === fieldName)
    .map((match) => ({
      indices: match.indices as [number, number][],
      key: match.key,
      value: match.value,
    }))
}
