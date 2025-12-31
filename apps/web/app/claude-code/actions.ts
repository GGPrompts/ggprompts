'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ToolkitActionResult {
  success: boolean
  error?: string
}

export async function addToToolkit(componentId: string): Promise<ToolkitActionResult> {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in to add to toolkit' }
  }

  // Check if component exists
  const { data: component } = await supabase
    .from('components')
    .select('id')
    .eq('id', componentId)
    .single()

  if (!component) {
    return { success: false, error: 'Component not found' }
  }

  // Check if already in toolkit
  const { data: existing } = await supabase
    .from('user_toolkit')
    .select('id')
    .eq('user_id', user.id)
    .eq('component_id', componentId)
    .single()

  if (existing) {
    return { success: false, error: 'Already in toolkit' }
  }

  // Add to toolkit (always as user's own copy)
  const { error } = await supabase
    .from('user_toolkit')
    .insert({
      user_id: user.id,
      component_id: componentId,
      enabled: true,
      is_forked: true
    })

  if (error) {
    console.error('Failed to add to toolkit:', error)
    return { success: false, error: 'Failed to add to toolkit' }
  }

  // Update download count
  await supabase.rpc('increment_downloads', { component_id: componentId })

  revalidatePath('/claude-code')
  revalidatePath('/claude-code/toolkit')

  return { success: true }
}

export async function removeFromToolkit(componentId: string): Promise<ToolkitActionResult> {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in to remove from toolkit' }
  }

  // Remove from toolkit
  const { error } = await supabase
    .from('user_toolkit')
    .delete()
    .eq('user_id', user.id)
    .eq('component_id', componentId)

  if (error) {
    console.error('Failed to remove from toolkit:', error)
    return { success: false, error: 'Failed to remove from toolkit' }
  }

  revalidatePath('/claude-code')
  revalidatePath('/claude-code/toolkit')

  return { success: true }
}

export async function toggleToolkitEnabled(componentId: string, enabled: boolean): Promise<ToolkitActionResult> {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in' }
  }

  // Update enabled status
  const { error } = await supabase
    .from('user_toolkit')
    .update({ enabled })
    .eq('user_id', user.id)
    .eq('component_id', componentId)

  if (error) {
    console.error('Failed to update toolkit item:', error)
    return { success: false, error: 'Failed to update toolkit item' }
  }

  revalidatePath('/claude-code/toolkit')

  return { success: true }
}

export async function getUserToolkitIds(): Promise<string[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data: toolkit } = await supabase
    .from('user_toolkit')
    .select('component_id')
    .eq('user_id', user.id)

  return toolkit?.map(t => t.component_id) || []
}

// ============================================================================
// BOOKMARK FUNCTIONS
// ============================================================================

export interface BookmarkActionResult {
  success: boolean
  bookmarked?: boolean
  error?: string
}

export async function toggleComponentBookmark(componentId: string): Promise<BookmarkActionResult> {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in to bookmark' }
  }

  // Check if component exists
  const { data: component } = await supabase
    .from('components')
    .select('id')
    .eq('id', componentId)
    .single()

  if (!component) {
    return { success: false, error: 'Component not found' }
  }

  // Check if already bookmarked
  const { data: existing } = await supabase
    .from('user_component_bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('component_id', componentId)
    .maybeSingle()

  if (existing) {
    // Remove bookmark
    const { error } = await supabase
      .from('user_component_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('component_id', componentId)

    if (error) {
      console.error('Failed to remove bookmark:', error)
      return { success: false, error: 'Failed to remove bookmark' }
    }

    revalidatePath('/claude-code')
    return { success: true, bookmarked: false }
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('user_component_bookmarks')
      .insert({
        user_id: user.id,
        component_id: componentId
      })

    if (error) {
      console.error('Failed to add bookmark:', error)
      return { success: false, error: 'Failed to add bookmark' }
    }

    revalidatePath('/claude-code')
    return { success: true, bookmarked: true }
  }
}

export async function getUserBookmarkedComponentIds(): Promise<string[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data: bookmarks } = await supabase
    .from('user_component_bookmarks')
    .select('component_id')
    .eq('user_id', user.id)

  return bookmarks?.map(b => b.component_id) || []
}

// ============================================================================
// COMPONENT SUBMISSION
// ============================================================================

export interface SubmitComponentData {
  name: string
  type: 'skill' | 'agent' | 'command'
  description: string
  category: string
  content: string
  tags?: string[]
  sourceUrl?: string
}

export interface SubmitComponentResult {
  success: boolean
  slug?: string
  error?: string
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function submitComponent(data: SubmitComponentData): Promise<SubmitComponentResult> {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in to submit a component' }
  }

  // Get user profile for author_name
  const { data: profile } = await supabase
    .from('users')
    .select('username, display_name')
    .eq('id', user.id)
    .single()

  const authorName = profile?.display_name || profile?.username || 'Anonymous'

  // Generate slug
  let slug = generateSlug(data.name)

  // Check if slug exists, append number if needed
  const { data: existing } = await supabase
    .from('components')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    // Append a random suffix to make unique
    slug = `${slug}-${Date.now().toString(36)}`
  }

  // Determine file path based on component type
  const fileExtension = data.type === 'command' ? 'md' : 'md'
  const filePath = data.type === 'skill'
    ? `${slug}.md`
    : data.type === 'command'
    ? `${slug}.md`
    : `${slug}.md`

  // Create files array
  const files = [{
    path: filePath,
    content: data.content
  }]

  // Insert component with pending status for user submissions
  const { error } = await supabase
    .from('components')
    .insert({
      type: data.type,
      slug,
      name: data.name,
      description: data.description,
      category: data.category,
      tags: data.tags || [],
      files,
      author_id: user.id,
      author_name: authorName,
      source_url: data.sourceUrl || null,
      version: '1.0.0',
      license: 'MIT',
      downloads: 0,
      rating: null,
      rating_count: 0,
      is_official: false,
      is_featured: false,
      is_verified: false,
      status: 'pending'
    })

  if (error) {
    console.error('Failed to submit component:', error)
    return { success: false, error: 'Failed to submit component. Please try again.' }
  }

  // Revalidate component listing pages
  revalidatePath('/claude-code')
  revalidatePath(`/claude-code/${data.type}s`)

  return { success: true, slug }
}
