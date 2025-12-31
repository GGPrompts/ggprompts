import { Skeleton, Card, CardContent } from '@ggprompts/ui'

export function ProfileHeaderSkeleton() {
  return (
    <Card className="glass border-border/50 overflow-hidden">
      {/* Cover gradient */}
      <div className="relative h-32 sm:h-40 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 sm:-mt-12 gap-4">
          {/* Avatar */}
          <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-background" />

          {/* Profile Info */}
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-6">
          <Skeleton className="h-4 w-36" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass rounded-lg p-4 text-center border border-border/30 space-y-2">
              <Skeleton className="h-4 w-4 mx-auto" />
              <Skeleton className="h-8 w-12 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProfileTabsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/50 pb-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Tab content - show grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="glass border-border/50">
            <CardContent className="pt-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <ProfileHeaderSkeleton />
      <ProfileTabsSkeleton />
    </div>
  )
}
