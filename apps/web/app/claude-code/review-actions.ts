'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ReviewActionResult {
  success: boolean
  error?: string
}

export interface Review {
  id: string
  rating: number
  review: string | null
  created_at: string
  user: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
  } | null
}

export async function submitReview(
  componentId: string,
  rating: number,
  review: string | null
): Promise<ReviewActionResult> {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in to submit a review' }
  }

  // Validate rating
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return { success: false, error: 'Rating must be between 1 and 5' }
  }

  // Check if user already reviewed this component
  const { data: existing } = await supabase
    .from('component_reviews')
    .select('id')
    .eq('user_id', user.id)
    .eq('component_id', componentId)
    .single()

  if (existing) {
    // Update existing review
    const { error } = await supabase
      .from('component_reviews')
      .update({
        rating,
        review: review || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)

    if (error) {
      console.error('Failed to update review:', error)
      return { success: false, error: 'Failed to update review' }
    }
  } else {
    // Create new review
    const { error } = await supabase
      .from('component_reviews')
      .insert({
        component_id: componentId,
        user_id: user.id,
        rating,
        review: review || null
      })

    if (error) {
      console.error('Failed to submit review:', error)
      return { success: false, error: 'Failed to submit review' }
    }
  }

  // Update component's average rating
  await updateComponentRating(componentId)

  revalidatePath('/claude-code')

  return { success: true }
}

export async function deleteReview(componentId: string): Promise<ReviewActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in' }
  }

  const { error } = await supabase
    .from('component_reviews')
    .delete()
    .eq('user_id', user.id)
    .eq('component_id', componentId)

  if (error) {
    console.error('Failed to delete review:', error)
    return { success: false, error: 'Failed to delete review' }
  }

  await updateComponentRating(componentId)

  revalidatePath('/claude-code')

  return { success: true }
}

export async function getComponentReviews(componentId: string): Promise<Review[]> {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from('component_reviews')
    .select(`
      id,
      rating,
      review,
      created_at,
      users:user_id (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('component_id', componentId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (!reviews) return []

  return reviews.map(r => ({
    id: r.id,
    rating: r.rating,
    review: r.review,
    created_at: r.created_at,
    user: r.users as unknown as Review['user']
  }))
}

export async function getUserReview(componentId: string): Promise<{ rating: number; review: string | null } | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('component_reviews')
    .select('rating, review')
    .eq('user_id', user.id)
    .eq('component_id', componentId)
    .single()

  return data || null
}

async function updateComponentRating(componentId: string) {
  const supabase = await createClient()

  // Calculate new average rating
  const { data: reviews } = await supabase
    .from('component_reviews')
    .select('rating')
    .eq('component_id', componentId)

  if (!reviews || reviews.length === 0) {
    // No reviews, set to null
    await supabase
      .from('components')
      .update({ rating: null, rating_count: 0 })
      .eq('id', componentId)
  } else {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await supabase
      .from('components')
      .update({
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        rating_count: reviews.length
      })
      .eq('id', componentId)
  }
}
