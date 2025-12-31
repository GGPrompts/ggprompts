'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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
 * Delete a forum post (admin only)
 */
export async function deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Verify admin status
  if (!(await isAdmin(supabase))) {
    return { success: false, error: 'Unauthorized: Admin access required' }
  }

  // Delete the post (comments will cascade delete via FK)
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) {
    console.error('Error deleting post:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/forums')
  return { success: true }
}

/**
 * Delete a forum comment (admin only)
 */
export async function deleteComment(
  commentId: string,
  postId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Verify admin status
  if (!(await isAdmin(supabase))) {
    return { success: false, error: 'Unauthorized: Admin access required' }
  }

  // Soft delete the comment
  const { error } = await supabase
    .from('comments')
    .update({ is_deleted: true, content: '[deleted]' })
    .eq('id', commentId)

  if (error) {
    console.error('Error deleting comment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/forums/${postId}`)
  return { success: true }
}
