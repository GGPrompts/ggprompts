import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton for client-side usage
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}

// Database table names for consistency
export const TABLES = {
  USERS: 'users',
  FORUMS: 'forums',
  POSTS: 'posts',
  COMMENTS: 'comments',
  PROMPTS: 'prompts',
  PROMPT_LIKES: 'prompt_likes',
  PROMPT_DISCUSSIONS: 'prompt_discussions',
  VOTES: 'votes'
} as const

// Auth provider options
export const AUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github'
} as const
