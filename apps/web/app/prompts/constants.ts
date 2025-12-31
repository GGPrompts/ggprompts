import { SortOption } from '@/components/prompts/SearchBar'

export const PROMPTS_PER_PAGE = 30

export interface FetchPromptsParams {
  page: number
  query?: string
  categories?: string[]
  sort?: SortOption
  userId?: string
  myPromptsOnly?: boolean
  likedOnly?: boolean
  bookmarkedOnly?: boolean
}

export interface FetchPromptsResult {
  prompts: import('@/lib/types').Prompt[]
  total: number
  hasMore: boolean
}
