'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const displayRating = hoverRating || rating

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= displayRating
        const isHalf = !isFilled && starValue - 0.5 <= displayRating

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              'transition-colors',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors',
                isFilled
                  ? 'fill-yellow-500 text-yellow-500'
                  : isHalf
                  ? 'fill-yellow-500/50 text-yellow-500'
                  : 'fill-transparent text-muted-foreground/50'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
