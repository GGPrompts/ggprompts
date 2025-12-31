import { Skeleton, Card, CardContent, CardHeader } from '@ggprompts/ui'

export function PromptCardSkeleton() {
  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          {/* Title */}
          <Skeleton className="h-6 w-3/4" />
          {/* Badge */}
          <Skeleton className="h-5 w-16 shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
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
          <div className="flex items-center gap-1">
            {/* Like button */}
            <Skeleton className="h-8 w-12 rounded-md" />
            {/* Copy button */}
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PromptGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PromptCardSkeleton key={i} />
      ))}
    </div>
  )
}
