"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Heart, Share2, ShoppingCart, ChevronLeft, Minus, Plus } from "lucide-react";
import { Button } from "@ggprompts/ui";
import { Badge } from "@ggprompts/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ggprompts/ui";
import { Separator } from "@ggprompts/ui";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ProductCard } from "@/components/products/ProductCard";
import { ReviewsSummary, ReviewsList, ReviewForm, type ReviewCardData } from "@/components/reviews";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { getProductVideo } from "@/lib/product-videos";
import { toast } from "sonner";
import { cn } from "@ggprompts/ui";
import type { Product, Review, User } from "@/lib/db/schema";

interface ProductDetailClientProps {
  product: Product;
  reviews: (Review & { user: Pick<User, "name" | "image"> })[];
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, reviews, relatedProducts }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [votedReviewIds, setVotedReviewIds] = useState<Set<string>>(new Set());
  const [localReviews, setLocalReviews] = useState(reviews);

  // Check for product video
  const productVideo = getProductVideo(product.slug);

  // Extract color and size options from tags
  const colorOptions = product.tags.filter((tag) => tag.startsWith("color:")).map((tag) => tag.replace("color:", ""));
  const sizeOptions = product.tags.filter((tag) => tag.startsWith("size:")).map((tag) => tag.replace("size:", ""));

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  const rating = product.rating ? parseFloat(product.rating) : 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (wishlist.includes(product.id)) {
      const newWishlist = wishlist.filter((id: string) => id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      toast.info("Removed from wishlist");
    } else {
      wishlist.push(product.id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success("Added to wishlist");
    }
  };

  const handleHelpfulVote = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to vote");
      setVotedReviewIds((prev) => new Set([...prev, reviewId]));
    } catch (error) {
      console.error("Failed to vote:", error);
      toast.error("Failed to record vote");
    }
  };

  const handleReviewSubmit = async (data: { rating: number; title: string; content: string }) => {
    const response = await fetch(`/api/products/${product.id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        toast.error("Please sign in to write a review");
        throw new Error("Unauthorized");
      }
      throw new Error(errorData.error || "Failed to submit review");
    }

    const result = await response.json();

    // Add the new review to local state
    setLocalReviews((prev) => [result.review, ...prev]);
    setShowReviewForm(false);

    // Show bonus toast
    if (result.bonusAwarded) {
      toast.success(`You earned ${result.bonusAwarded} UselessBucks for your review!`);
    }
  };

  // Convert reviews to ReviewCardData format
  const reviewCardData: ReviewCardData[] = localReviews.map((review) => ({
    id: review.id,
    productId: review.productId,
    userId: review.userId,
    rating: review.rating,
    title: review.title,
    content: review.content,
    helpful: review.helpful ?? 0,
    verified: review.verified,
    createdAt: new Date(review.createdAt),
    user: {
      name: review.user.name,
      image: review.user.image,
    },
  }));

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-lg overflow-hidden aspect-square relative"
            >
              <Image
                src={product.images[selectedImage] || "/placeholder-product.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "glass rounded-lg overflow-hidden aspect-square relative transition-all",
                      selectedImage === index ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Featured Badge */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.brand}</p>
              {product.featured && <Badge className="bg-primary/90 text-primary-foreground">Featured</Badge>}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold terminal-glow">{product.name}</h1>

            {/* Category */}
            <p className="text-muted-foreground capitalize">{product.category.replace(/-/g, " ")}</p>

            {/* Rating and Reviews */}
            {rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating.toFixed(1)} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground terminal-glow">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${parseFloat(product.originalPrice!).toFixed(2)}
                  </span>
                  <Badge className="bg-destructive/90 text-destructive-foreground">Save {discountPercent}%</Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.inStock ? (
                <Badge variant="outline" className="border-primary/50 text-primary">
                  In Stock
                  {product.stockCount && product.stockCount < 10 && ` (Only ${product.stockCount} left!)`}
                </Badge>
              ) : (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Color Selection */}
            {colorOptions.length > 0 && (
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-4 py-2 rounded-md glass transition-all capitalize",
                        selectedColor === color ? "ring-2 ring-primary" : "hover:border-primary/50"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizeOptions.length > 0 && (
              <div className="space-y-2">
                <Label>Size</Label>
                <div className="flex gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-4 py-2 rounded-md glass transition-all uppercase",
                        selectedSize === size ? "ring-2 ring-primary" : "hover:border-primary/50"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="glass px-6 py-2 rounded-md text-center min-w-[80px]">
                  <span className="text-lg font-semibold">{quantity}</span>
                </div>
                <Button size="icon" variant="outline" onClick={() => handleQuantityChange(1)} disabled={quantity >= 99}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <AddToCartButton
                productId={product.id}
                productSlug={product.slug}
                productName={product.name}
                productBrand={product.brand}
                productPrice={product.price}
                productImage={product.images[0] || "/placeholder-product.png"}
                quantity={quantity}
                disabled={!product.inStock}
                className="flex-1"
                size="lg"
                color={selectedColor}
                productSize={selectedSize}
              />
              <div className="flex gap-3">
                <Button size="lg" variant="outline" onClick={handleWishlist} className="flex-1 sm:flex-none" aria-label="Add to wishlist">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={handleShare} className="flex-1 sm:flex-none" aria-label="Share product">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Video (if available) */}
        {productVideo && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 terminal-glow">See It In Action</h2>
            <div className="max-w-4xl mx-auto">
              <VideoPlayer
                src={productVideo.src}
                poster={productVideo.poster}
                aspectRatio={productVideo.aspectRatio}
                autoPlay
                loop
              />
            </div>
          </div>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="description" className="mb-12">
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <TabsList className="glass w-max min-w-full">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({localReviews.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="description" className="glass rounded-lg p-6 mt-4">
            <h3 className="text-xl font-semibold mb-4">Product Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.longDescription || product.description}
            </p>
          </TabsContent>

          <TabsContent value="features" className="glass rounded-lg p-6 mt-4">
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Premium quality materials (imaginary)</li>
              <li>Ergonomic design for maximum uselessness</li>
              <li>Guaranteed to do absolutely nothing</li>
              <li>Comes with a sense of buyer's remorse</li>
              <li>Perfect conversation starter</li>
            </ul>
          </TabsContent>

          <TabsContent value="specs" className="glass rounded-lg p-6 mt-4">
            <h3 className="text-xl font-semibold mb-4">Specifications</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-semibold mb-1">Category</dt>
                <dd className="text-muted-foreground capitalize">{product.category.replace(/-/g, " ")}</dd>
              </div>
              <div>
                <dt className="font-semibold mb-1">Brand</dt>
                <dd className="text-muted-foreground">{product.brand}</dd>
              </div>
              <div>
                <dt className="font-semibold mb-1">SKU</dt>
                <dd className="text-muted-foreground">{product.id.slice(0, 8).toUpperCase()}</dd>
              </div>
              <div>
                <dt className="font-semibold mb-1">Stock</dt>
                <dd className="text-muted-foreground">{product.stockCount || "Limited"}</dd>
              </div>
            </dl>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4 space-y-6">
            {/* Reviews Summary */}
            <ReviewsSummary
              reviews={reviewCardData}
              onWriteReview={() => setShowReviewForm(true)}
            />

            {/* Review Form (conditionally shown) */}
            {showReviewForm && (
              <ReviewForm
                productId={product.id}
                onSubmit={handleReviewSubmit}
                onSuccess={() => setShowReviewForm(false)}
              />
            )}

            {/* Reviews List */}
            <ReviewsList
              reviews={reviewCardData}
              onHelpful={handleHelpfulVote}
              votedReviewIds={votedReviewIds}
              pageSize={5}
            />
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 terminal-glow">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={{
                    id: relatedProduct.id,
                    slug: relatedProduct.slug,
                    name: relatedProduct.name,
                    brand: relatedProduct.brand,
                    price: relatedProduct.price,
                    originalPrice: relatedProduct.originalPrice,
                    images: relatedProduct.images,
                    rating: relatedProduct.rating,
                    reviewCount: relatedProduct.reviewCount,
                    inStock: relatedProduct.inStock,
                    featured: relatedProduct.featured,
                    category: relatedProduct.category,
                    tags: relatedProduct.tags,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}
