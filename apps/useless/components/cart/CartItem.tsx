'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2, Heart } from 'lucide-react'
import { Button } from '@ggprompts/ui'
import { CartItem as CartItemType } from '@/lib/cart'
import { useCart } from './CartProvider'

interface CartItemProps {
  item: CartItemType
  index: number
}

export function CartItem({ item, index }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const handleIncrement = () => {
    updateQuantity(item.productId, item.quantity + 1)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1)
    }
  }

  const handleRemove = () => {
    removeItem(item.productId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-lg p-4 flex gap-4"
    >
      {/* Product Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-muted"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 96px, 112px"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.slug}`}
            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
          >
            {item.name}
          </Link>
          <p className="text-sm text-muted-foreground mt-1">{item.brand}</p>

          {/* Color/Size Options */}
          {(item.color || item.size) && (
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              {item.color && (
                <span className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-full border border-border"
                    style={{ backgroundColor: item.color.toLowerCase() }}
                  />
                  {item.color}
                </span>
              )}
              {item.size && <span>Size: {item.size}</span>}
            </div>
          )}
        </div>

        {/* Quantity and Price - Mobile */}
        <div className="flex items-center justify-between mt-3 sm:hidden">
          <div className="flex items-center gap-2" role="group" aria-label={`Quantity for ${item.name}`}>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center font-medium" aria-live="polite">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={handleIncrement}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="font-semibold">${item.price.toFixed(2)}</div>
            {item.originalPrice && (
              <div className="text-xs text-muted-foreground line-through">
                ${item.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Controls - Desktop */}
      <div className="hidden sm:flex items-center gap-2" role="group" aria-label={`Quantity for ${item.name}`}>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={handleDecrement}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-10 text-center font-medium" aria-live="polite">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={handleIncrement}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Price - Desktop */}
      <div className="hidden sm:flex flex-col items-end justify-center min-w-[100px]">
        <div className="font-semibold text-lg">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
        {item.originalPrice && (
          <div className="text-sm text-muted-foreground line-through">
            ${(item.originalPrice * item.quantity).toFixed(2)}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          ${item.price.toFixed(2)} each
        </div>
      </div>

      {/* Actions - Desktop */}
      <div className="hidden sm:flex flex-col gap-2 justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-primary"
          aria-label={`Save ${item.name} for later`}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions - Mobile */}
      <div className="flex sm:hidden flex-col gap-2 justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
