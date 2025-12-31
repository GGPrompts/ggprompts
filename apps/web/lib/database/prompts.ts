/**
 * Prompt CRUD operations
 * Handles prompt creation, retrieval, updates, and deletion
 */

import { getSupabase, TABLES } from '@/lib/supabase/client'
import { Prompt } from '@/lib/types'
import { parseTemplate, isTemplate } from '@/lib/prompt-template'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CreatePromptInput {
  title: string
  content: string
  description?: string
  category: string
  tags?: string[]
  attribution_url?: string
  attribution_text?: string
  user_id: string
  username?: string
}

export interface UpdatePromptInput {
  title?: string
  content?: string
  description?: string | null
  category?: string
  tags?: string[]
  attribution_url?: string | null
  attribution_text?: string | null
}

// ============================================================================
// CREATE
// ============================================================================

/**
 * Create a new prompt
 * Automatically detects template fields from content
 */
export async function createPrompt(data: CreatePromptInput): Promise<Prompt> {
  const supabase = getSupabase()

  // Parse template fields from content
  const hasTemplateFields = isTemplate(data.content)
  const parsed = hasTemplateFields ? parseTemplate(data.content) : null
  const templateFields = parsed?.fields.reduce(
    (acc, field) => {
      acc[field.id] = { hint: field.hint, placeholder: field.placeholder }
      return acc
    },
    {} as Record<string, { hint: string; placeholder: string }>
  )

  const insertData = {
    title: data.title.trim(),
    content: data.content.trim(),
    description: data.description?.trim() || null,
    category: data.category,
    tags: data.tags || [],
    user_id: data.user_id,
    username: data.username || null,
    is_template: hasTemplateFields,
    template_fields: templateFields || null,
    attribution_url: data.attribution_url?.trim() || null,
    attribution_text: data.attribution_text?.trim() || null,
    like_count: 0,
    usage_count: 0,
  }

  const { data: prompt, error } = await supabase
    .from(TABLES.PROMPTS)
    .insert(insertData)
    .select('*')
    .single()

  if (error) {
    console.error('Error creating prompt:', error)
    throw new Error(`Failed to create prompt: ${error.message}`)
  }

  return prompt as Prompt
}

// ============================================================================
// READ
// ============================================================================

/**
 * Get a single prompt by ID
 */
export async function getPromptById(promptId: string): Promise<Prompt | null> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from(TABLES.PROMPTS)
    .select('*')
    .eq('id', promptId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    console.error('Error fetching prompt:', error)
    throw new Error(`Failed to fetch prompt: ${error.message}`)
  }

  return data as Prompt
}

/**
 * Get prompts by user ID
 */
export async function getPromptsByUserId(userId: string): Promise<Prompt[]> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from(TABLES.PROMPTS)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user prompts:', error)
    throw new Error(`Failed to fetch user prompts: ${error.message}`)
  }

  return (data as Prompt[]) || []
}

// ============================================================================
// UPDATE
// ============================================================================

/**
 * Update an existing prompt
 * Re-parses template fields if content changes
 * Admins can update any prompt, regular users can only update their own
 */
export async function updatePrompt(
  promptId: string,
  data: UpdatePromptInput,
  userId: string,
  isAdmin: boolean = false
): Promise<Prompt> {
  const supabase = getSupabase()

  // Build update object
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (data.title !== undefined) {
    updateData.title = data.title.trim()
  }

  if (data.description !== undefined) {
    updateData.description = data.description?.trim() || null
  }

  if (data.category !== undefined) {
    updateData.category = data.category
  }

  if (data.tags !== undefined) {
    updateData.tags = data.tags
  }

  if (data.attribution_url !== undefined) {
    updateData.attribution_url = data.attribution_url?.trim() || null
  }

  if (data.attribution_text !== undefined) {
    updateData.attribution_text = data.attribution_text?.trim() || null
  }

  // If content is being updated, re-parse template fields
  if (data.content !== undefined) {
    const content = data.content.trim()
    updateData.content = content

    const hasTemplateFields = isTemplate(content)
    updateData.is_template = hasTemplateFields

    if (hasTemplateFields) {
      const parsed = parseTemplate(content)
      updateData.template_fields = parsed.fields.reduce(
        (acc, field) => {
          acc[field.id] = { hint: field.hint, placeholder: field.placeholder }
          return acc
        },
        {} as Record<string, { hint: string; placeholder: string }>
      )
    } else {
      updateData.template_fields = null
    }
  }

  // Build the query - admins can update any prompt, regular users only their own
  let query = supabase
    .from(TABLES.PROMPTS)
    .update(updateData)
    .eq('id', promptId)

  // Only restrict by user_id if not an admin
  if (!isAdmin) {
    query = query.eq('user_id', userId)
  }

  const { data: prompt, error } = await query.select('*').single()

  if (error) {
    console.error('Error updating prompt:', error)
    throw new Error(`Failed to update prompt: ${error.message}`)
  }

  return prompt as Prompt
}

// ============================================================================
// DELETE
// ============================================================================

/**
 * Delete a prompt
 * Admins can delete any prompt, regular users can only delete their own
 */
export async function deletePrompt(
  promptId: string,
  userId: string,
  isAdmin: boolean = false
): Promise<void> {
  const supabase = getSupabase()

  // Build the query - admins can delete any prompt, regular users only their own
  let query = supabase
    .from(TABLES.PROMPTS)
    .delete()
    .eq('id', promptId)

  // Only restrict by user_id if not an admin
  if (!isAdmin) {
    query = query.eq('user_id', userId)
  }

  const { error } = await query

  if (error) {
    console.error('Error deleting prompt:', error)
    throw new Error(`Failed to delete prompt: ${error.message}`)
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate prompt data before creation/update
 */
export function validatePromptData(
  data: Partial<CreatePromptInput>
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

  if (!data.category) {
    errors.push('Category is required')
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters')
  }

  if (data.attribution_url) {
    try {
      new URL(data.attribution_url)
    } catch {
      errors.push('Attribution URL must be a valid URL')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
