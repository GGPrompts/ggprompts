import { Skeleton, Card, CardContent, CardHeader } from '@ggprompts/ui'

export function ForumPostCardSkeleton() {
  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content preview */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <Skeleton className="h-7 w-7 rounded-full" />
            {/* Username */}
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-3">
            {/* Comment count */}
            <Skeleton className="h-4 w-10" />
            {/* Time */}
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ForumPostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ForumPostCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ForumPostDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Main Post */}
      <Card className="glass border-border/50">
        <CardContent className="pt-6 space-y-6">
          {/* Title */}
          <Skeleton className="h-8 w-3/4" />

          {/* Author info */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Comment form placeholder */}
        <Skeleton className="h-24 w-full rounded-lg" />

        <Skeleton className="h-px w-full" />

        {/* Comment skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
