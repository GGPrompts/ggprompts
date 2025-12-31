import { Review } from '@/app/claude-code/review-actions'
import { StarRating } from './StarRating'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

interface ReviewsListProps {
  reviews: Review[]
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No reviews yet. Be the first to review!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="glass border-border/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={review.user?.avatar_url || undefined} />
              <AvatarFallback>
                {(review.user?.display_name || review.user?.username || 'U')[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">
                  {review.user?.display_name || review.user?.username || 'Anonymous'}
                </span>
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </span>
              </div>

              {review.review && (
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                  {review.review}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
