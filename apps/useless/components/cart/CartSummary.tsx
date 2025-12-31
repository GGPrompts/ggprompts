'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Truck, Clock, Tag } from 'lucide-react'
import { Button } from '@ggprompts/ui'
import { Input } from '@ggprompts/ui'
import { Separator } from '@ggprompts/ui'
import { useCart } from './CartProvider'

const FREE_SHIPPING_THRESHOLD = 100
const TAX_RATE = 0.08

export function CartSummary() {
  const router = useRouter()
  const { subtotal, savings, itemCount } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true)
      // In a real app, this would validate the coupon with the backend
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  return (
    <div className="glass-overlay rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* Subtotal */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex justify-between text-sm text-green-500">
            <span>Savings</span>
            <span>-${savings.toFixed(2)}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          {shipping === 0 ? (
            <span className="text-green-500 font-medium">FREE</span>
          ) : (
            <span className="font-medium">${shipping.toFixed(2)}</span>
          )}
        </div>

        {/* Free Shipping Progress */}
        {shipping > 0 && (
          <div className="text-xs text-muted-foreground">
            Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free
            shipping
          </div>
        )}

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (estimated)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Coupon Code */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Coupon Code</label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={couponApplied}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || couponApplied}
          >
            <Tag className="h-4 w-4" />
          </Button>
        </div>
        {couponApplied && (
          <p className="text-xs text-green-500 mt-2">Coupon applied!</p>
        )}
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold terminal-glow">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={handleCheckout}
        className="w-full border-glow mb-4"
        size="lg"
      >
        Proceed to Checkout
      </Button>

      {/* Trust Badges */}
      <div className="space-y-3 pt-4 border-t border-border/50">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Truck className="h-4 w-4 text-primary flex-shrink-0" />
          <span>Fast shipping</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary flex-shrink-0" />
          <span>24/7 support</span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-4 p-3 rounded bg-muted/20 text-xs text-muted-foreground">
        Pay with UselessBucks or credit card at checkout
      </div>
    </div>
  )
}
