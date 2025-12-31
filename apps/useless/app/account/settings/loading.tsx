import { Card, CardContent, CardHeader } from '@ggprompts/ui';
import { Skeleton } from '@ggprompts/ui';

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Category Navigation Skeleton */}
      <Card className="glass-dark border-primary/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Card Skeleton */}
      <Card className="glass-dark border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Setting Item Skeletons */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-5 w-9 rounded-full" />
              </div>
              {i < 3 && <Skeleton className="h-px w-full" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Second Card Skeleton */}
      <Card className="glass-dark border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-4 w-52 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1 p-4 glass rounded-lg">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button Skeleton */}
      <Card className="glass border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
