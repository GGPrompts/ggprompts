'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from './useAuth'
import {
  togglePromptLike,
  toggleBookmark,
  incrementUsageCount,
  isPromptLikedByUser,
  isPromptBookmarkedByUser,
} from '@/lib/database/prompt-interactions'

interface UsePromptInteractionsOptions {
  promptId: string
  initialLikeCount?: number
  initialUsageCount?: number
}

interface UsePromptInteractionsReturn {
  // State
  isLiked: boolean
  isBookmarked: boolean
  likeCount: number
  usageCount: number
  loading: boolean

  // Actions
  handleLike: () => Promise<void>
  handleBookmark: () => Promise<void>
  handleCopy: (content: string) => Promise<boolean>

  // Auth state
  isAuthenticated: boolean
}

/**
 * Hook for managing prompt interactions (likes, bookmarks, usage tracking)
 * Handles optimistic updates and error rollback
 */
export function usePromptInteractions({
  promptId,
  initialLikeCount = 0,
  initialUsageCount = 0,
}: UsePromptInteractionsOptions): UsePromptInteractionsReturn {
  const { user, loading: authLoading } = useAuth()

  // State
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [usageCount, setUsageCount] = useState(initialUsageCount)
  const [loading, setLoading] = useState(true)

  // Fetch initial like/bookmark state when user loads
  useEffect(() => {
    if (authLoading) return

    if (!user || !promptId) {
      setIsLiked(false)
      setIsBookmarked(false)
      setLoading(false)
      return
    }

    const fetchState = async () => {
      try {
        const [likedResult, bookmarkedResult] = await Promise.all([
          isPromptLikedByUser(promptId, user.id),
          isPromptBookmarkedByUser(promptId, user.id),
        ])
        setIsLiked(likedResult)
        setIsBookmarked(bookmarkedResult)
      } catch (error) {
        console.error('Failed to fetch interaction state:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchState()
  }, [promptId, user, authLoading])

  // Update counts when props change
  useEffect(() => {
    setLikeCount(initialLikeCount)
  }, [initialLikeCount])

  useEffect(() => {
    setUsageCount(initialUsageCount)
  }, [initialUsageCount])

  // Handle like toggle
  const handleLike = useCallback(async () => {
    if (!user) {
      // Could trigger a login modal here
      console.warn('Must be logged in to like prompts')
      return
    }

    // Optimistic update
    const previousLiked = isLiked
    const previousCount = likeCount
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)

    try {
      const result = await togglePromptLike(promptId, user.id)
      setIsLiked(result.liked)
      setLikeCount(result.newCount)
    } catch (error) {
      // Rollback on error
      console.error('Failed to toggle like:', error)
      setIsLiked(previousLiked)
      setLikeCount(previousCount)
    }
  }, [user, promptId, isLiked, likeCount])

  // Handle bookmark toggle
  const handleBookmark = useCallback(async () => {
    if (!user) {
      console.warn('Must be logged in to bookmark prompts')
      return
    }

    // Optimistic update
    const previousBookmarked = isBookmarked
    setIsBookmarked(!isBookmarked)

    try {
      const result = await toggleBookmark(promptId, user.id)
      setIsBookmarked(result)
    } catch (error) {
      // Rollback on error
      console.error('Failed to toggle bookmark:', error)
      setIsBookmarked(previousBookmarked)
    }
  }, [user, promptId, isBookmarked])

  // Handle copy (increments usage count)
  const handleCopy = useCallback(
    async (content: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(content)

        // Optimistic update
        const previousCount = usageCount
        setUsageCount(usageCount + 1)

        try {
          const newCount = await incrementUsageCount(promptId)
          setUsageCount(newCount)
        } catch (error) {
          // Rollback on error (though we still copied successfully)
          console.error('Failed to track usage:', error)
          setUsageCount(previousCount)
        }

        return true
      } catch (error) {
        console.error('Failed to copy:', error)
        return false
      }
    },
    [promptId, usageCount]
  )

  return {
    isLiked,
    isBookmarked,
    likeCount,
    usageCount,
    loading: loading || authLoading,
    handleLike,
    handleBookmark,
    handleCopy,
    isAuthenticated: !!user,
  }
}
