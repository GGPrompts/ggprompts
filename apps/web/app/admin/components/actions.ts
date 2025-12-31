'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ComponentStatus } from '@/lib/types'
import { syncPluginsToDatabase, SyncResponse } from '@/lib/sync-plugins'
import { exportApprovedComponentsToGitHub, ExportResponse } from '@/lib/export-to-github'

export interface AdminActionResult {
  success: boolean
  error?: string
}

/**
 * Check if the current user is an admin
 */
async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role === 'admin'
}

/**
 * Update component status (approve/reject)
 */
export async function updateComponentStatus(
  componentId: string,
  status: ComponentStatus
): Promise<AdminActionResult> {
  const supabase = await createClient()

  // Verify admin status
  if (!(await isAdmin(supabase))) {
    return { success: false, error: 'Unauthorized: Admin access required' }
  }

  const { error } = await supabase
    .from('components')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', componentId)

  if (error) {
    console.error('Error updating component status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/components')
  revalidatePath('/claude-code')
  revalidatePath('/claude-code/skills')
  revalidatePath('/claude-code/agents')
  revalidatePath('/claude-code/commands')

  return { success: true }
}

/**
 * Approve a component
 */
export async function approveComponent(componentId: string): Promise<AdminActionResult> {
  return updateComponentStatus(componentId, 'approved')
}

/**
 * Reject a component
 */
export async function rejectComponent(componentId: string): Promise<AdminActionResult> {
  return updateComponentStatus(componentId, 'rejected')
}

/**
 * Delete a component permanently
 */
export async function deleteComponent(componentId: string): Promise<AdminActionResult> {
  const supabase = await createClient()

  // Verify admin status
  if (!(await isAdmin(supabase))) {
    return { success: false, error: 'Unauthorized: Admin access required' }
  }

  // Delete related records first (reviews, toolkit entries, bookmarks)
  await supabase.from('component_reviews').delete().eq('component_id', componentId)
  await supabase.from('user_toolkit').delete().eq('component_id', componentId)
  await supabase.from('user_component_bookmarks').delete().eq('component_id', componentId)

  // Delete the component
  const { error } = await supabase
    .from('components')
    .delete()
    .eq('id', componentId)

  if (error) {
    console.error('Error deleting component:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/components')
  revalidatePath('/claude-code')
  revalidatePath('/claude-code/skills')
  revalidatePath('/claude-code/agents')
  revalidatePath('/claude-code/commands')

  return { success: true }
}

/**
 * Toggle featured status
 */
export async function toggleFeatured(
  componentId: string,
  isFeatured: boolean
): Promise<AdminActionResult> {
  const supabase = await createClient()

  // Verify admin status
  if (!(await isAdmin(supabase))) {
    return { success: false, error: 'Unauthorized: Admin access required' }
  }

  const { error } = await supabase
    .from('components')
    .update({
      is_featured: isFeatured,
      updated_at: new Date().toISOString()
    })
    .eq('id', componentId)

  if (error) {
    console.error('Error toggling featured status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/components')
  revalidatePath('/claude-code')

  return { success: true }
}

export interface BulkActionResult {
  success: boolean
  count: number
  error?: string
}

/**
 * Bulk approve multiple components
 */
export async function bulkApproveComponents(
  componentIds: string[]
): Promise<BulkActionResult> {
  const supabase = await createClient()

  if (!(await isAdmin(supabase))) {
    return { success: false, count: 0, error: 'Unauthorized: Admin access required' }
  }

  if (componentIds.length === 0) {
    return { success: false, count: 0, error: 'No components selected' }
  }

  const { error, count } = await supabase
    .from('components')
    .update({
      status: 'approved' as ComponentStatus,
      updated_at: new Date().toISOString()
    })
    .in('id', componentIds)

  if (error) {
    console.error('Error bulk approving components:', error)
    return { success: false, count: 0, error: error.message }
  }

  revalidatePath('/admin/components')
  revalidatePath('/claude-code')
  revalidatePath('/claude-code/skills')
  revalidatePath('/claude-code/agents')
  revalidatePath('/claude-code/commands')

  return { success: true, count: count || componentIds.length }
}

/**
 * Bulk reject multiple components
 */
export async function bulkRejectComponents(
  componentIds: string[]
): Promise<BulkActionResult> {
  const supabase = await createClient()

  if (!(await isAdmin(supabase))) {
    return { success: false, count: 0, error: 'Unauthorized: Admin access required' }
  }

  if (componentIds.length === 0) {
    return { success: false, count: 0, error: 'No components selected' }
  }

  const { error, count } = await supabase
    .from('components')
    .update({
      status: 'rejected' as ComponentStatus,
      updated_at: new Date().toISOString()
    })
    .in('id', componentIds)

  if (error) {
    console.error('Error bulk rejecting components:', error)
    return { success: false, count: 0, error: error.message }
  }

  revalidatePath('/admin/components')
  revalidatePath('/claude-code')
  revalidatePath('/claude-code/skills')
  revalidatePath('/claude-code/agents')
  revalidatePath('/claude-code/commands')

  return { success: true, count: count || componentIds.length }
}

/**
 * Bulk delete multiple components
 */
export async function bulkDeleteComponents(
  componentIds: string[]
): Promise<BulkActionResult> {
  const supabase = await createClient()

  if (!(await isAdmin(supabase))) {
    return { success: false, count: 0, error: 'Unauthorized: Admin access required' }
  }

  if (componentIds.length === 0) {
    return { success: false, count: 0, error: 'No components selected' }
  }

  // Delete related records first for all components
  await supabase.from('component_reviews').delete().in('component_id', componentIds)
  await supabase.from('user_toolkit').delete().in('component_id', componentIds)
  await supabase.from('user_component_bookmarks').delete().in('component_id', componentIds)

  // Delete all components
  const { error, count } = await supabase
    .from('components')
    .delete()
    .in('id', componentIds)

  if (error) {
    console.error('Error bulk deleting components:', error)
    return { success: false, count: 0, error: error.message }
  }

  revalidatePath('/admin/components')
  revalidatePath('/claude-code')
  revalidatePath('/claude-code/skills')
  revalidatePath('/claude-code/agents')
  revalidatePath('/claude-code/commands')

  return { success: true, count: count || componentIds.length }
}

/**
 * Manually trigger sync from my-gg-plugins repository
 */
export async function triggerPluginSync(): Promise<SyncResponse & { error?: string }> {
  const supabase = await createClient()

  // Verify admin status
  if (!(await isAdmin(supabase))) {
    return {
      success: false,
      synced: 0,
      errors: 0,
      results: [],
      error: 'Unauthorized: Admin access required'
    }
  }

  try {
    const result = await syncPluginsToDatabase()

    // Revalidate paths after sync
    revalidatePath('/admin/components')
    revalidatePath('/claude-code')
    revalidatePath('/claude-code/skills')
    revalidatePath('/claude-code/agents')
    revalidatePath('/claude-code/commands')

    return result
  } catch (error) {
    console.error('Sync error:', error)
    return {
      success: false,
      synced: 0,
      errors: 1,
      results: [],
      error: error instanceof Error ? error.message : 'Unknown sync error'
    }
  }
}

/**
 * Export approved user-submitted components to GitHub repository
 */
export async function triggerGitHubExport(): Promise<ExportResponse & { error?: string }> {
  const supabase = await createClient()

  // Verify admin status
  if (!(await isAdmin(supabase))) {
    return {
      success: false,
      exported: 0,
      skipped: 0,
      errors: 0,
      results: [],
      error: 'Unauthorized: Admin access required'
    }
  }

  try {
    const result = await exportApprovedComponentsToGitHub()
    return result
  } catch (error) {
    console.error('Export error:', error)
    return {
      success: false,
      exported: 0,
      skipped: 0,
      errors: 1,
      results: [],
      error: error instanceof Error ? error.message : 'Unknown export error'
    }
  }
}
