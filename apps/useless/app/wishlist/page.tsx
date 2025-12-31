'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import { Button } from '@ggprompts/ui'
import { Separator } from '@ggprompts/ui'
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  HeartOff,
  ArrowLeft,
  Sparkles,
  Clock,
  TrendingDown,
  AlertTriangle,
  Percent,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '@/components/wishlist/WishlistProvider'
import { useCart } from '@/components/cart/CartProvider'
import { getOldestItemAgeDays } from '@/lib/wishlist'
import { toast } from 'sonner'

// Mock wishlist items for demo purposes
const MOCK_WISHLIST_ITEMS = [
  {
    productId: 'toaster-3000',
    slug: 'self-aware-toaster-3000',
    name: 'Self-Aware Toaster 3000',
    brand: 'JudgyAppliances',
    price: 499.99,
    image: '/images/products/toaster.jpg',
    addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    productId: 'telepathic-remote',
    slug: 'telepathic-tv-remote',
    name: 'Telepathic TV Remote',
    brand: 'MindControl Inc',
    price: 299.99,
    image: '/images/products/remote.jpg',
    addedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    productId: 'invisible-socks',
    slug: 'invisible-socks',
    name: 'Invisible Socks',
    brand: 'GhostWear',
    price: 19.99,
    originalPrice: 29.99,
    image: '/images/products/socks.jpg',
    addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    productId: 'wifi-rock',
    slug: 'wifi-enabled-rock',
    name: 'WiFi-Enabled Rock',
    brand: 'StoneAge Tech',
    price: 79.99,
    image: '/images/products/rock.jpg',
    addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    productId: 'procrastination-timer',
    slug: 'procrastination-timer',
    name: 'Procrastination Timer',
    brand: 'Later Labs',
    price: 59.99,
    image: '/images/products/timer.jpg',
    addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    productId: 'judgmental-mirror',
    slug: 'judgmental-mirror',
    name: 'Judgmental Mirror',
    brand: 'ReflectOnThat',
    price: 399.99,
    image: '/images/products/mirror.jpg',
    addedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock recommended products
const RECOMMENDED_PRODUCTS = [
  {
    productId: 'anxiety-blanket',
    slug: 'anxiety-blanket-premium',
    name: 'Premium Anxiety Blanket',
    brand: 'ComfortZone',
    price: 149.99,
    image: '/images/products/blanket.jpg',
  },
  {
    productId: 'motivational-doorbell',
    slug: 'motivational-doorbell',
    name: 'Motivational Doorbell',
    brand: 'InspireHome',
    price: 89.99,
    originalPrice: 119.99,
    image: '/images/products/doorbell.jpg',
  },
  {
    productId: 'quantum-coasters',
    slug: 'quantum-coasters',
    name: 'Quantum Coasters (4-Pack)',
    brand: 'SchrodingerGoods',
    price: 34.99,
    image: '/images/products/coasters.jpg',
  },
  {
    productId: 'existential-alarm',
    slug: 'existential-alarm-clock',
    name: 'Existential Alarm Clock',
    brand: 'DreadfulMornings',
    price: 69.99,
    image: '/images/products/alarm.jpg',
  },
]

function formatDaysAgo(dateString: string): string {
  const now = new Date()
  const addedDate = new Date(dateString)
  const diffTime = Math.abs(now.getTime() - addedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Added today'
  if (diffDays === 1) return 'Added yesterday'
  return `Added ${diffDays} days ago`
}

export default function WishlistPage() {
  const { wishlist, removeItem, clearWishlist, itemCount, totalValue, potentialSavings, isLoading } =
    useWishlist()
  const { addItem: addToCart } = useCart()

  // Use mock data if wishlist is empty for demo
  const displayItems = wishlist.items.length > 0 ? wishlist.items : []
  const displayCount = itemCount
  const displayTotalValue = totalValue
  const displaySavings = potentialSavings

  const oldestDays = wishlist.items.length > 0 ? getOldestItemAgeDays(wishlist) : 0

  const handleAddToCart = (item: (typeof displayItems)[0]) => {
    addToCart({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
    })
  }

  const handleAddAllToCart = () => {
    displayItems.forEach((item) => {
      addToCart({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        brand: item.brand,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
      })
    })
    toast.success('Shopping spree activated!', {
      description: `All ${displayCount} items have been added to your cart.`,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold terminal-glow flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              Your Wishlist
            </h1>
            {displayCount > 0 && (
              <Badge variant="secondary" className="text-sm">
                {displayCount} {displayCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2">
            Things you want but probably don't need
          </p>
        </motion.div>

        {/* Empty State */}
        {displayItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-overlay rounded-lg p-12 text-center max-w-2xl mx-auto"
          >
            <div className="relative inline-block mb-6">
              <HeartOff className="h-24 w-24 mx-auto text-muted-foreground opacity-50" />
              <span className="absolute -top-2 -right-2 text-4xl">?</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your wallet thanks you for your restraint. But are you really living?
              <br />
              <span className="text-sm italic">
                Life is short. Fill this list with things you'll never buy.
              </span>
            </p>
            <Button asChild size="lg" className="border-glow">
              <Link href="/products">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Browsing
              </Link>
            </Button>
          </motion.div>
        ) : (
          /* Wishlist Content */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Wishlist Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {displayItems.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Card className="glass overflow-hidden h-full hover:border-primary/50 transition-all">
                        <div className="relative w-full h-48 bg-muted">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                              <Heart className="h-12 w-12 opacity-20" />
                            </div>
                          )}
                          {item.originalPrice && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white shadow-md">
                              Sale
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                              {item.brand}
                            </p>
                            <h3 className="font-semibold line-clamp-2 mt-1">
                              {item.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDaysAgo(item.addedAt)}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleAddToCart(item)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Clear Wishlist Button */}
              {displayItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (
                        confirm(
                          'Are you sure you want to clear your wishlist? Your wallet will be so proud.'
                        )
                      ) {
                        clearWishlist()
                      }
                    }}
                  >
                    <HeartOff className="h-4 w-4 mr-2" />
                    Clear Wishlist
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Sidebar Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="glass-overlay sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Wishlist Summary</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Value</span>
                        <span className="font-bold text-xl">
                          ${displayTotalValue.toFixed(2)}
                        </span>
                      </div>

                      {displaySavings > 0 && (
                        <div className="flex justify-between text-green-500">
                          <span className="flex items-center gap-1">
                            <Percent className="h-4 w-4" />
                            Potential Savings
                          </span>
                          <span className="font-semibold">
                            ${displaySavings.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <Button
                    className="w-full border-glow"
                    size="lg"
                    onClick={handleAddAllToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add All to Cart
                  </Button>

                  <Separator />

                  {/* Funny Stats */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                      Wishlist Analytics
                    </h4>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Days since oldest item:
                        </span>
                        <span className="font-medium">{oldestDays}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Purchase probability:
                        </span>
                        <span className="font-medium text-amber-500">23%</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Regret potential:
                        </span>
                        <span className="font-medium text-red-500">High</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground italic">
                      * Statistics are 100% made up, just like your intention to buy
                      these.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Similar Items Section */}
        {displayItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                Similar Items You'll Also Want
              </h2>
              <Link
                href="/products"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
              {RECOMMENDED_PRODUCTS.map((product, index) => (
                <RecommendedProductCard key={product.productId} product={product} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function RecommendedProductCard({
  product,
  index,
}: {
  product: (typeof RECOMMENDED_PRODUCTS)[0]
  index: number
}) {
  const { addItem, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.productId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      className="glass rounded-lg p-4 hover:border-primary/50 transition-colors min-w-[280px] snap-start"
    >
      <div className="relative w-full h-40 bg-muted rounded-md mb-4">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-10 w-10 opacity-20" />
          </div>
        )}
        {product.originalPrice && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white shadow-md">Sale</Badge>
        )}
      </div>

      <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{product.brand}</p>

      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">${product.price.toFixed(2)}</div>
          {product.originalPrice && (
            <div className="text-xs text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </div>
          )}
        </div>
        <Button
          size="sm"
          variant={inWishlist ? 'secondary' : 'default'}
          onClick={() =>
            addItem({
              productId: product.productId,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.image,
            })
          }
          disabled={inWishlist}
        >
          <Heart
            className={`h-4 w-4 mr-1 ${inWishlist ? 'fill-current' : ''}`}
          />
          {inWishlist ? 'Wishlisted' : 'Add to Wishlist'}
        </Button>
      </div>
    </motion.div>
  )
}
