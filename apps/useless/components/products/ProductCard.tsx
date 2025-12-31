"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@ggprompts/ui";
import { Button } from "@ggprompts/ui";
import { cn } from "@ggprompts/ui";

export interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    price: string;
    originalPrice?: string | null;
    images: string[];
    rating: string | null;
    reviewCount: number | null;
    inStock: boolean;
    featured: boolean;
    category: string;
    tags: string[];
  };
  onAddToCart?: (productId: string) => void;
  onWishlist?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart, onWishlist }: ProductCardProps) {
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  const rating = product.rating ? parseFloat(product.rating) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <div className="glass rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-glow h-full flex flex-col">
        {/* Image Container */}
        <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted/20">
          <Image
            src={product.images[0] || "/placeholder-product.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges - solid backgrounds with backdrop for contrast on any image */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
            {product.featured && (
              <Badge className="bg-emerald-600 text-white shadow-lg border border-emerald-400/30 backdrop-blur-sm">
                Featured
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-red-600 text-white shadow-lg border border-red-400/30 backdrop-blur-sm">
                {discountPercent}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="bg-gray-800/90 text-gray-200 shadow-lg border border-gray-600/30 backdrop-blur-sm">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 z-10 glass opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10"
            onClick={(e) => {
              e.preventDefault();
              onWishlist?.(product.id);
            }}
            aria-label={`Add ${product.name} to wishlist`}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </Link>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Brand */}
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.brand}
          </p>

          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="font-semibold text-foreground hover:text-primary transition-colors mb-2 line-clamp-2"
          >
            {product.name}
          </Link>

          {/* Category */}
          <p className="text-xs text-muted-foreground mb-2 capitalize">
            {product.category.replace(/-/g, " ")}
          </p>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-3" role="img" aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}>
              <div className="flex" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between gap-2 mt-auto">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-foreground terminal-glow">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${parseFloat(product.originalPrice!).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <Button
              size="icon"
              variant="default"
              disabled={!product.inStock}
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.(product.id);
              }}
              className="shrink-0 h-10 w-10"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
