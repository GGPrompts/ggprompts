// User statistics utility functions

import { createClient } from '@/lib/supabase/client'
import type { UserStats } from '@/lib/types'

/**
 * Get comprehensive user statistics
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  if (!userId) {
    return {
      forumPosts: 0,
      forumComments: 0,
      forumVotes: 0,
      promptsCreated: 0,
      promptLikes: 0,
      promptCopies: 0
    }
  }

  const supabase = createClient()

  try {
    // Get forum posts count
    const { count: postsCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Get forum comments count
    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Get forum votes count
    const { count: votesCount } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Get prompts created by user
    const { count: promptsCount } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Get total likes on user's prompts
    const { data: userPrompts } = await supabase
      .from('prompts')
      .select('like_count')
      .eq('user_id', userId)

    const totalPromptLikes = userPrompts?.reduce((sum, prompt) => sum + (prompt.like_count || 0), 0) || 0

    // Get total copies of user's prompts (using usage_count)
    const { data: promptUsage } = await supabase
      .from('prompts')
      .select('usage_count')
      .eq('user_id', userId)

    const totalPromptCopies = promptUsage?.reduce((sum, prompt) => sum + (prompt.usage_count || 0), 0) || 0

    return {
      forumPosts: postsCount || 0,
      forumComments: commentsCount || 0,
      forumVotes: votesCount || 0,
      promptsCreated: promptsCount || 0,
      promptLikes: totalPromptLikes,
      promptCopies: totalPromptCopies
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return {
      forumPosts: 0,
      forumComments: 0,
      forumVotes: 0,
      promptsCreated: 0,
      promptLikes: 0,
      promptCopies: 0
    }
  }
}

/**
 * Format large numbers for display (e.g., 1.2K, 3.5M)
 */
export function formatStatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
