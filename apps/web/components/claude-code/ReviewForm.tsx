'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from './StarRating'
import { submitReview } from '@/app/claude-code/review-actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ReviewFormProps {
  componentId: string
  componentName: string
  existingReview?: { rating: number; review: string | null } | null
  isAuthenticated: boolean
  onSubmit?: () => void
}

export function ReviewForm({
  componentId,
  componentName,
  existingReview,
  isAuthenticated,
  onSubmit
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [review, setReview] = useState(existingReview?.review || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setSubmitting(true)

    const result = await submitReview(componentId, rating, review || null)

    if (result.success) {
      toast.success(existingReview ? 'Review updated!' : 'Review submitted!')
      onSubmit?.()
    } else {
      toast.error(result.error || 'Failed to submit review')
    }

    setSubmitting(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="glass border-border/50 rounded-xl p-6">
        <p className="text-sm text-muted-foreground text-center">
          <a href="/login" className="text-primary hover:underline">Log in</a> to leave a review
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass border-border/50 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold">
        {existingReview ? 'Update Your Review' : 'Leave a Review'}
      </h3>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Your Rating</label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onRatingChange={setRating}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          Review (optional)
        </label>
        <Textarea
          placeholder={`Share your experience with ${componentName}...`}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={3}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {review.length}/1000
        </p>
      </div>

      <Button type="submit" disabled={submitting || rating === 0}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : existingReview ? (
          'Update Review'
        ) : (
          'Submit Review'
        )}
      </Button>
    </form>
  )
}
