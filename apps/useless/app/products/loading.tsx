import { Skeleton } from "@ggprompts/ui";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar Skeleton */}
          <aside className="lg:col-span-1">
            <div className="glass rounded-lg p-6 space-y-6">
              <Skeleton className="h-6 w-20" />

              {/* Category Filter */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>

              {/* Brand Filter */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </aside>

          {/* Products Grid Skeleton */}
          <section className="lg:col-span-3" aria-label="Product listing">
            <Skeleton className="h-5 w-48 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="glass rounded-lg overflow-hidden">
                  {/* Image */}
                  <Skeleton className="aspect-square" />

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Skeleton key={j} className="h-3 w-3" />
                      ))}
                      <Skeleton className="h-3 w-8 ml-1" />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-10 w-10 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
