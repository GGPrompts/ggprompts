'use server'

import { createClient } from '@/lib/supabase/server'
import { Prompt } from '@/lib/types'
import { PROMPTS_PER_PAGE, FetchPromptsParams, FetchPromptsResult } from './constants'

export async function fetchPrompts(params: FetchPromptsParams): Promise<FetchPromptsResult> {
  const {
    page = 1,
    query,
    categories,
    sort = 'newest',
    userId,
    myPromptsOnly,
    likedOnly,
    bookmarkedOnly,
  } = params

  const supabase = await createClient()
  const offset = (page - 1) * PROMPTS_PER_PAGE

  // Handle liked/bookmarked filters - need to get IDs first
  let promptIds: string[] | null = null

  if (userId && (likedOnly || bookmarkedOnly)) {
    const ids: string[] = []

    if (likedOnly) {
      const { data: likedData } = await supabase
        .from('prompt_likes')
        .select('prompt_id')
        .eq('user_id', userId)

      if (likedData && likedData.length > 0) {
        ids.push(...likedData.map(l => l.prompt_id))
      } else if (likedOnly) {
        return { prompts: [], total: 0, hasMore: false }
      }
    }

    if (bookmarkedOnly) {
      const { data: bookmarkedData } = await supabase
        .from('prompt_bookmarks')
        .select('prompt_id')
        .eq('user_id', userId)

      if (bookmarkedData && bookmarkedData.length > 0) {
        if (likedOnly) {
          const bookmarkedIds = new Set(bookmarkedData.map(b => b.prompt_id))
          promptIds = ids.filter(id => bookmarkedIds.has(id))
          if (promptIds.length === 0) return { prompts: [], total: 0, hasMore: false }
        } else {
          ids.push(...bookmarkedData.map(b => b.prompt_id))
        }
      } else if (bookmarkedOnly) {
        return { prompts: [], total: 0, hasMore: false }
      }
    }

    if (!promptIds) {
      promptIds = [...new Set(ids)]
    }
  }

  // Build the base query for counting
  let countQuery = supabase.from('prompts').select('*', { count: 'exact', head: true })

  // Build the data query
  let dataQuery = supabase.from('prompts').select('*')

  // Apply sorting to data query
  switch (sort) {
    case 'oldest':
      dataQuery = dataQuery.order('created_at', { ascending: true })
      break
    case 'most-liked':
      dataQuery = dataQuery.order('like_count', { ascending: false })
      break
    case 'most-used':
      dataQuery = dataQuery.order('usage_count', { ascending: false })
      break
    case 'newest':
    default:
      dataQuery = dataQuery.order('created_at', { ascending: false })
      break
  }

  // Apply filters to both queries
  if (query) {
    const searchFilter = `title.ilike.%${query}%,content.ilike.%${query}%,description.ilike.%${query}%`
    countQuery = countQuery.or(searchFilter)
    dataQuery = dataQuery.or(searchFilter)
  }

  if (categories && categories.length > 0) {
    countQuery = countQuery.in('category', categories)
    dataQuery = dataQuery.in('category', categories)
  }

  if (userId && myPromptsOnly) {
    countQuery = countQuery.eq('user_id', userId)
    dataQuery = dataQuery.eq('user_id', userId)
  }

  if (promptIds) {
    countQuery = countQuery.in('id', promptIds)
    dataQuery = dataQuery.in('id', promptIds)
  }

  // Apply pagination to data query
  dataQuery = dataQuery.range(offset, offset + PROMPTS_PER_PAGE - 1)

  // Execute both queries in parallel
  const [countResult, dataResult] = await Promise.all([countQuery, dataQuery])

  if (dataResult.error) {
    console.error('Error fetching prompts:', dataResult.error)
    return { prompts: [], total: 0, hasMore: false }
  }

  const total = countResult.count || 0
  const prompts = dataResult.data as Prompt[]
  const hasMore = offset + prompts.length < total

  return { prompts, total, hasMore }
}
