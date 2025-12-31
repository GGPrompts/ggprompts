import { Skeleton } from "@ggprompts/ui";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <Skeleton className="h-5 w-32 mb-6" />

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main Image */}
            <Skeleton className="aspect-square rounded-lg" />

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Brand */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Product Name */}
            <Skeleton className="h-10 w-3/4" />

            {/* Category */}
            <Skeleton className="h-5 w-32" />

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-5" />
                ))}
              </div>
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>

            {/* Stock Status */}
            <Skeleton className="h-6 w-24" />

            {/* Separator */}
            <div className="h-px bg-border/50" />

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-12">
          <div className="flex gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32" />
            ))}
          </div>
          <div className="glass rounded-lg p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div>
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-lg overflow-hidden">
                <Skeleton className="aspect-square" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-10 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
