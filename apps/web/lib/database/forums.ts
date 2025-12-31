/**
 * Forum CRUD operations
 * Handles post creation, retrieval, updates, and deletion
 */

import { getSupabase, TABLES } from '@/lib/supabase/client'
import { ForumPost, ForumComment } from '@/lib/types'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CreatePostInput {
  title: string
  content: string
  user_id: string
  forum_id?: string
}

export interface UpdatePostInput {
  title?: string
  content?: string
}

export interface CreateCommentInput {
  content: string
  post_id: string
  user_id: string
  parent_id?: string
}

// ============================================================================
// POST OPERATIONS
// ============================================================================

/**
 * Create a new forum post
 */
export async function createPost(data: CreatePostInput): Promise<ForumPost> {
  const supabase = getSupabase()

  const insertData = {
    title: data.title.trim(),
    content: data.content.trim(),
    user_id: data.user_id,
    forum_id: data.forum_id || null,
    view_count: 0,
  }

  const { data: post, error } = await supabase
    .from(TABLES.POSTS)
    .insert(insertData)
    .select('*, users!user_id(username, display_name, avatar_url)')
    .single()

  if (error) {
    console.error('Error creating post:', error)
    throw new Error(`Failed to create post: ${error.message}`)
  }

  return post as ForumPost
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string): Promise<ForumPost | null> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from(TABLES.POSTS)
    .select('*, users!user_id(username, display_name, avatar_url)')
    .eq('id', postId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching post:', error)
    throw new Error(`Failed to fetch post: ${error.message}`)
  }

  return data as ForumPost
}

/**
 * Get all posts (with pagination)
 */
export async function getPosts(options?: {
  forumId?: string
  limit?: number
  offset?: number
}): Promise<ForumPost[]> {
  const supabase = getSupabase()
  const { forumId, limit = 50, offset = 0 } = options || {}

  let query = supabase
    .from(TABLES.POSTS)
    .select('*, users!user_id(username, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (forumId) {
    query = query.eq('forum_id', forumId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    throw new Error(`Failed to fetch posts: ${error.message}`)
  }

  return (data as ForumPost[]) || []
}

/**
 * Get posts by user ID
 */
export async function getPostsByUserId(userId: string): Promise<ForumPost[]> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from(TABLES.POSTS)
    .select('*, users!user_id(username, display_name, avatar_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user posts:', error)
    throw new Error(`Failed to fetch user posts: ${error.message}`)
  }

  return (data as ForumPost[]) || []
}

/**
 * Update an existing post
 */
export async function updatePost(
  postId: string,
  data: UpdatePostInput,
  userId: string
): Promise<ForumPost> {
  const supabase = getSupabase()

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (data.title !== undefined) {
    updateData.title = data.title.trim()
  }

  if (data.content !== undefined) {
    updateData.content = data.content.trim()
  }

  const { data: post, error } = await supabase
    .from(TABLES.POSTS)
    .update(updateData)
    .eq('id', postId)
    .eq('user_id', userId) // Ensure user owns the post
    .select('*, users!user_id(username, display_name, avatar_url)')
    .single()

  if (error) {
    console.error('Error updating post:', error)
    throw new Error(`Failed to update post: ${error.message}`)
  }

  return post as ForumPost
}

/**
 * Delete a post
 */
export async function deletePost(postId: string, userId: string): Promise<void> {
  const supabase = getSupabase()

  const { error } = await supabase
    .from(TABLES.POSTS)
    .delete()
    .eq('id', postId)
    .eq('user_id', userId) // Ensure user owns the post

  if (error) {
    console.error('Error deleting post:', error)
    throw new Error(`Failed to delete post: ${error.message}`)
  }
}

/**
 * Increment view count for a post
 */
export async function incrementPostViewCount(postId: string): Promise<void> {
  const supabase = getSupabase()

  // Fetch current view count
  const { data: post } = await supabase
    .from(TABLES.POSTS)
    .select('view_count')
    .eq('id', postId)
    .single()

  const currentCount = (post as { view_count: number } | null)?.view_count || 0

  await supabase
    .from(TABLES.POSTS)
    .update({ view_count: currentCount + 1 })
    .eq('id', postId)
}

// ============================================================================
// COMMENT OPERATIONS
// ============================================================================

/**
 * Create a new comment
 */
export async function createComment(
  data: CreateCommentInput
): Promise<ForumComment> {
  const supabase = getSupabase()

  const insertData = {
    content: data.content.trim(),
    post_id: data.post_id,
    user_id: data.user_id,
    parent_id: data.parent_id || null,
  }

  const { data: comment, error } = await supabase
    .from(TABLES.COMMENTS)
    .insert(insertData)
    .select('*, users!user_id(username, display_name, avatar_url)')
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    throw new Error(`Failed to create comment: ${error.message}`)
  }

  return comment as ForumComment
}

/**
 * Get comments for a post
 */
export async function getCommentsByPostId(
  postId: string
): Promise<ForumComment[]> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from(TABLES.COMMENTS)
    .select('*, users!user_id(username, display_name, avatar_url)')
    .eq('post_id', postId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    throw new Error(`Failed to fetch comments: ${error.message}`)
  }

  return (data as ForumComment[]) || []
}

/**
 * Delete a comment (soft delete)
 */
export async function deleteComment(
  commentId: string,
  userId: string
): Promise<void> {
  const supabase = getSupabase()

  const { error } = await supabase
    .from(TABLES.COMMENTS)
    .update({ is_deleted: true, content: '[deleted]' })
    .eq('id', commentId)
    .eq('user_id', userId) // Ensure user owns the comment

  if (error) {
    console.error('Error deleting comment:', error)
    throw new Error(`Failed to delete comment: ${error.message}`)
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate post data before creation/update
 */
export function validatePostData(
  data: Partial<CreatePostInput>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push('Title is required')
  } else if (data.title.length > 200) {
    errors.push('Title must be less than 200 characters')
  }

  if (!data.content?.trim()) {
    errors.push('Content is required')
  } else if (data.content.length > 50000) {
    errors.push('Content must be less than 50,000 characters')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
