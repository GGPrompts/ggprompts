"use client";

import { Product } from "@/lib/db/schema";
import { ProductCard } from "./ProductCard";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@ggprompts/ui";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { cn } from "@ggprompts/ui";

export interface ProductGridProps {
  products: Product[];
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export function ProductGrid({ products, viewMode = "grid", onViewModeChange }: ProductGridProps) {
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (productId: string) => {
    // Find the product
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Use the CartProvider's addItem function for consistent cart management
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: parseFloat(product.price),
      image: product.images[0] || "/placeholder-product.png",
    });
  };

  const handleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Use the WishlistProvider for consistent wishlist management
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: parseFloat(product.price),
        image: product.images[0] || "/placeholder-product.png",
      });
    }
  };

  if (products.length === 0) {
    return (
      <div className="glass rounded-lg p-12 text-center">
        <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div className="flex justify-end gap-2">
          <Button
            size="icon"
            variant={viewMode === "grid" ? "default" : "ghost"}
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "list" ? "default" : "ghost"}
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Products Grid */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        )}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              price: product.price,
              originalPrice: product.originalPrice,
              images: product.images,
              rating: product.rating,
              reviewCount: product.reviewCount,
              inStock: product.inStock,
              featured: product.featured,
              category: product.category,
              tags: product.tags,
            }}
            onAddToCart={handleAddToCart}
            onWishlist={handleWishlist}
          />
        ))}
      </div>
    </div>
  );
}
