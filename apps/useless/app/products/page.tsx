import { Suspense } from "react";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { sql, and, gte, lte, eq, inArray } from "drizzle-orm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Useless.io",
  description: "Browse our collection of wonderfully useless products that you absolutely don't need.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brands?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    inStock?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // Build filters
  const filters = [];

  if (params.category && params.category !== "all") {
    filters.push(eq(products.category, params.category));
  }

  if (params.brands) {
    const brandList = params.brands.split(",").filter(Boolean);
    if (brandList.length > 0) {
      filters.push(inArray(products.brand, brandList));
    }
  }

  if (params.minPrice) {
    filters.push(gte(products.price, params.minPrice));
  }

  if (params.maxPrice) {
    filters.push(lte(products.price, params.maxPrice));
  }

  if (params.minRating) {
    const minRating = params.minRating;
    filters.push(gte(products.rating, minRating));
  }

  if (params.inStock === "true") {
    filters.push(eq(products.inStock, true));
  }

  // Fetch products with filters
  const filteredProducts =
    filters.length > 0
      ? await db.select().from(products).where(and(...filters))
      : await db.select().from(products);

  // Get unique categories and brands for filter options
  const allProducts = await db.select().from(products);
  const categories = Array.from(new Set(allProducts.map((p) => p.category))).sort();
  const brands = Array.from(new Set(allProducts.map((p) => p.brand))).sort();

  // Calculate max price for slider
  const maxPrice = Math.ceil(
    Math.max(...allProducts.map((p) => parseFloat(p.price)))
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 terminal-glow">
            Browse Products
          </h1>
          <p className="text-muted-foreground">
            Discover our collection of wonderfully useless items
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="glass rounded-lg p-6 animate-pulse h-96" />}>
              <ProductFilters
                categories={categories}
                brands={brands}
                maxPrice={maxPrice}
              />
            </Suspense>
          </aside>

          {/* Products Grid */}
          <section className="lg:col-span-3 min-h-[600px]" aria-label="Product listing">
            <Suspense fallback={<ProductGridSkeleton />}>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </div>
              <ProductGrid products={filteredProducts} />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-square bg-muted/20" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted/20 rounded w-1/3" />
            <div className="h-5 bg-muted/20 rounded w-3/4" />
            <div className="h-4 bg-muted/20 rounded w-1/2" />
            <div className="flex justify-between items-center mt-4">
              <div className="h-6 bg-muted/20 rounded w-1/4" />
              <div className="h-10 w-10 bg-muted/20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
