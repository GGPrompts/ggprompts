'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@ggprompts/ui'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { useCart } from '@/components/cart/CartProvider'
import type { Product } from '@/lib/db/schema'

interface CartPageClientProps {
  recommendedProducts: Product[]
}

export function CartPageClient({ recommendedProducts }: CartPageClientProps) {
  const { cart, itemCount, addItem, clearCart } = useCart()

  // Filter out products already in cart
  const cartProductIds = new Set(cart.items.map(item => item.productId))
  const filteredRecommendations = recommendedProducts.filter(
    product => !cartProductIds.has(product.id)
  ).slice(0, 3)

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
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold terminal-glow flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Shopping Cart
            {itemCount > 0 && (
              <span className="text-lg text-muted-foreground">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>
        </motion.div>

        {/* Empty Cart State */}
        {cart.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-overlay rounded-lg p-12 text-center max-w-2xl mx-auto"
          >
            <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any useless products yet.
            </p>
            <Button asChild size="lg" className="border-glow">
              <Link href="/products">
                <Sparkles className="h-5 w-5 mr-2" />
                Browse Products
              </Link>
            </Button>
          </motion.div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cart.items.map((item, index) => (
                  <CartItem key={item.productId} item={item} index={index} />
                ))}
              </AnimatePresence>

              {/* Clear Cart Button */}
              {cart.items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (
                        confirm('Are you sure you want to clear your cart?')
                      ) {
                        clearCart()
                      }
                    }}
                  >
                    Clear Cart
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CartSummary />
            </motion.div>
          </div>
        )}

        {/* Recommended Products */}
        {cart.items.length > 0 && filteredRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-semibold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendations.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="glass rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative w-full h-48 bg-muted rounded-md mb-4 overflow-hidden">
                      <Image
                        src={product.images[0] || '/placeholder-product.png'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </Link>

                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold mb-1 line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3">
                    {product.brand}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        ${parseFloat(product.price).toFixed(2)}
                      </div>
                      {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                        <div className="text-xs text-muted-foreground line-through">
                          ${parseFloat(product.originalPrice).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        addItem({
                          productId: product.id,
                          slug: product.slug,
                          name: product.name,
                          brand: product.brand,
                          price: parseFloat(product.price),
                          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
                          image: product.images[0] || '/placeholder-product.png',
                        })
                      }
                    >
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
