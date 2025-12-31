// Database types for GGPrompts

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

// User type (same as Profile, for database consistency)
export interface User {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio?: string | null
  reputation?: number
  privacy_settings?: PrivacySettings | null
  created_at: string
}

export interface PrivacySettings {
  show_recent_activity: boolean
  show_detailed_stats: boolean
  allow_profile_views: boolean
}

// Public profile data returned from get_public_profile RPC
export interface PublicProfile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  reputation: number
  privacy_settings: PrivacySettings | null
  // Stats (null if privacy settings hide them)
  forum_posts_count: number | null
  forum_comments_count: number | null
  forum_votes_count: number | null
  prompts_created_count: number | null
  prompt_likes_count: number | null
  prompt_copies_count: number | null
}

export interface UserStats {
  forumPosts: number
  forumComments: number
  forumVotes: number
  promptsCreated: number
  promptLikes: number
  promptCopies: number
}

// Partial types for recent activity displays
export interface RecentPrompt {
  id: string
  title: string
  category: string | null
  like_count: number
  usage_count: number
  created_at: string
}

export interface RecentPost {
  id: string
  title: string
  forum_id: string | null
  created_at: string
  forums?: { name: string } | null
}

export interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  category: string | null
  tags: string[] | null
  user_id: string | null
  username: string | null
  like_count: number
  usage_count: number
  is_template: boolean
  template_fields: Record<string, unknown> | null
  attribution_url: string | null
  attribution_text: string | null
  created_at: string
  updated_at: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  user_id: string
  forum_id?: string
  view_count?: number
  comment_count?: number
  created_at: string
  updated_at: string
  users?: User | null
}

export interface ForumComment {
  id: string
  content: string
  post_id: string
  user_id: string
  parent_id?: string | null
  is_deleted?: boolean
  created_at: string
  updated_at?: string
  users?: User | null
}

// Claude Code Marketplace types
export type ComponentType = 'skill' | 'agent' | 'hook' | 'mcp' | 'command'
export type ComponentStatus = 'pending' | 'approved' | 'rejected'

export interface Component {
  id: string
  type: ComponentType
  slug: string
  name: string
  description: string | null
  category: string | null
  tags: string[]
  files: { path: string; content: string }[]
  author_id: string | null
  author_name: string | null
  source_url: string | null
  version: string
  license: string | null
  downloads: number
  rating: number | null
  rating_count: number
  is_official: boolean
  is_featured: boolean
  is_verified: boolean
  status: ComponentStatus
  created_at: string
  updated_at: string
}

export interface ComponentCategory {
  slug: string
  name: string
  description: string | null
  icon: string | null
  component_type: ComponentType | null
  sort_order: number
}

export interface UserToolkit {
  id: string
  user_id: string
  component_id: string
  enabled: boolean
  is_forked: boolean
  added_at: string
  component?: Component
}

export interface UserGithubSync {
  user_id: string
  repo_name: string
  repo_full_name: string | null
  is_private: boolean
  last_synced_at: string | null
  sync_status: 'synced' | 'pending' | 'error' | null
  sync_error: string | null
}
