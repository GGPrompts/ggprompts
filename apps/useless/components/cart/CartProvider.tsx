'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  Cart,
  CartItem,
  getCart,
  addToCart as addToCartUtil,
  updateQuantity as updateQuantityUtil,
  removeFromCart as removeFromCartUtil,
  clearCart as clearCartUtil,
  getCartTotal,
} from '@/lib/cart'
import { toast } from 'sonner'

interface CartContextType {
  cart: Cart
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  savings: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    updatedAt: new Date().toISOString(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Initialize cart from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedCart = getCart()
    setCart(savedCart)
    setIsLoading(false)
  }, [])

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    if (!mounted) return

    const updatedCart = addToCartUtil(item, quantity)
    setCart(updatedCart)
    toast.success('Added to cart', {
      description: `${item.name} has been added to your cart.`,
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (!mounted) return

    const updatedCart = updateQuantityUtil(productId, quantity)
    setCart(updatedCart)
  }

  const removeItem = (productId: string) => {
    if (!mounted) return

    const itemToRemove = cart.items.find((i) => i.productId === productId)
    const updatedCart = removeFromCartUtil(productId)
    setCart(updatedCart)

    if (itemToRemove) {
      toast.success('Removed from cart', {
        description: `${itemToRemove.name} has been removed from your cart.`,
      })
    }
  }

  const clearCart = () => {
    if (!mounted) return

    const updatedCart = clearCartUtil()
    setCart(updatedCart)
    toast.success('Cart cleared', {
      description: 'All items have been removed from your cart.',
    })
  }

  const { subtotal, itemCount, savings } = getCartTotal(cart)

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        savings,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
