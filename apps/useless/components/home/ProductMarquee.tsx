'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Sparkles } from 'lucide-react'
import { Button } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import { useCart } from '@/components/cart/CartProvider'
import { cn } from '@ggprompts/ui'

interface MarqueeProduct {
  id: string
  slug: string
  name: string
  brand: string
  price: number
  rating: number
  reviews: number
  tagline: string
  image: string
}

interface ProductMarqueeProps {
  products: MarqueeProduct[]
  direction?: 'left' | 'right'
  speed?: 'slow' | 'normal' | 'fast'
  pauseOnHover?: boolean
  className?: string
}

export function ProductMarquee({
  products,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
}: ProductMarqueeProps) {
  const { addItem } = useCart()

  const handleAddToCart = (product: MarqueeProduct, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
    })
  }

  // Duplicate products for seamless looping
  const duplicatedProducts = [...products, ...products]

  // Card width + gap (300px mobile / 340px desktop + 24px gap)
  // We use mobile size for consistent perceived speed
  const cardWidth = 324 // 300px card + 24px gap
  const setWidth = products.length * cardWidth

  // Speed in pixels per second (consistent across screen sizes)
  const speedMap = {
    slow: 50,
    normal: 80,
    fast: 120,
  }

  const pixelsPerSecond = speedMap[speed]
  const duration = setWidth / pixelsPerSecond

  return (
    <div
      className={cn(
        'relative overflow-hidden group',
        className
      )}
    >
      {/* Gradient fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      <div
        className={cn(
          'flex gap-6',
          pauseOnHover && 'marquee-pause-on-hover'
        )}
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
          // Use pixel-based translation for consistent speed
          ['--marquee-distance' as string]: `-${setWidth}px`,
        }}
      >
        {duplicatedProducts.map((product, index) => (
          <MarqueeCard
            key={`${product.id}-${index}`}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  )
}

function MarqueeCard({
  product,
  onAddToCart,
}: {
  product: MarqueeProduct
  onAddToCart: (product: MarqueeProduct, e: React.MouseEvent) => void
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group/card relative flex-shrink-0 w-[300px] sm:w-[340px]"
    >
      <div className="glass rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 h-full">
        {/* Product Image with Overlay */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-110"
            sizes="340px"
          />

          {/* Hover Overlay - uses dark gradient for text contrast on images */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity" />

          {/* Floating Badge - solid background for visibility on any image */}
          <Badge
            className="absolute top-3 left-3 bg-emerald-600 text-white shadow-lg border border-emerald-400/30 backdrop-blur-sm"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {product.brand}
          </Badge>

          {/* Price Tag - dark bg with light text for consistent visibility on any image */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-white shadow-md">
            ${product.price}
          </div>

          {/* Bottom Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-lg mb-1 line-clamp-1 drop-shadow-lg">
              {product.name}
            </h3>
            <p className="text-sm text-white/80 line-clamp-1">
              {product.tagline}
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-4 flex items-center justify-between gap-3">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews.toLocaleString()})
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="sm"
            variant="default"
            className="gap-1.5 shadow-lg"
            onClick={(e) => onAddToCart(product, e)}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  )
}

// Stacked Marquee with two rows going opposite directions
export function DoubleMarquee({
  products,
  className,
}: {
  products: MarqueeProduct[]
  className?: string
}) {
  // Split products for variety between rows
  const firstRow = products
  const secondRow = [...products].reverse()

  return (
    <div className={cn('space-y-6', className)}>
      <ProductMarquee
        products={firstRow}
        direction="left"
        speed="normal"
        pauseOnHover
      />
      <ProductMarquee
        products={secondRow}
        direction="right"
        speed="slow"
        pauseOnHover
      />
    </div>
  )
}
