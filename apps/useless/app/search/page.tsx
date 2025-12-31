"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/lib/db/schema";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@ggprompts/ui";
import { Button } from "@ggprompts/ui";
import { Search, Loader2, PackageX } from "lucide-react";
import { Badge } from "@ggprompts/ui";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="glass-dark rounded-lg p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-mono terminal-glow">INITIALIZING SEARCH...</p>
        </div>
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to search products");
        }

        setProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          {/* Terminal-style header */}
          <div className="glass rounded-lg p-6 border-primary/30">
            <h1 className="text-3xl font-bold mb-2 terminal-glow">
              &gt; SEARCH DATABASE
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              {query ? (
                <>
                  QUERY: <span className="text-primary">&quot;{query}&quot;</span>
                </>
              ) : (
                "AWAITING INPUT..."
              )}
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for useless products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-24 h-12 text-base glass"
                autoFocus
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                disabled={!searchInput.trim() || loading}
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Loading State */}
          {loading && (
            <div className="glass-dark rounded-lg p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-mono terminal-glow">
                SEARCHING DATABASE...
              </p>
              <p className="text-sm text-muted-foreground mt-2 font-mono">
                Scanning {query ? `for "${query}"` : "all products"}...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="glass-dark rounded-lg p-8 text-center border border-destructive/50">
              <div className="text-destructive mb-4 font-mono text-xl">
                ERROR: {error}
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry Search
              </Button>
            </div>
          )}

          {/* No Query State */}
          {!query && !loading && (
            <div className="glass rounded-lg p-12 text-center">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Start Your Search</h2>
              <p className="text-muted-foreground">
                Enter a search term above to find wonderfully useless products
              </p>
            </div>
          )}

          {/* No Results State */}
          {query && !loading && !error && products.length === 0 && (
            <div className="glass-dark rounded-lg p-12 text-center">
              <PackageX className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2 font-mono terminal-glow">
                NO RESULTS FOUND
              </h2>
              <p className="text-muted-foreground mb-2 font-mono">
                SEARCH TERM: <span className="text-primary">&quot;{query}&quot;</span>
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Try searching for something else or browse all products
              </p>
              <div className="mt-6 flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push("/products")}>
                  Browse All Products
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchInput("");
                    router.push("/search");
                  }}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}

          {/* Results with Terminal Style */}
          {query && !loading && !error && products.length > 0 && (
            <>
              <div className="glass-dark rounded-lg p-4 border-primary/30">
                <div className="flex items-center gap-4 font-mono">
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    RESULTS FOUND: {products.length}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    Showing matches for &quot;{query}&quot;
                  </span>
                </div>
              </div>

              <ProductGrid products={products} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
