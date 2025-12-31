'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  Wishlist,
  WishlistItem,
  getWishlist,
  addToWishlist as addToWishlistUtil,
  removeFromWishlist as removeFromWishlistUtil,
  isInWishlist as isInWishlistUtil,
  clearWishlist as clearWishlistUtil,
  getWishlistTotal,
} from '@/lib/wishlist'
import { toast } from 'sonner'

interface WishlistContextType {
  wishlist: Wishlist
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  itemCount: number
  totalValue: number
  potentialSavings: number
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Wishlist>({
    items: [],
    updatedAt: new Date().toISOString(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Initialize wishlist from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedWishlist = getWishlist()
    setWishlist(savedWishlist)
    setIsLoading(false)
  }, [])

  const addItem = (item: Omit<WishlistItem, 'addedAt'>) => {
    if (!mounted) return

    // Check if already in wishlist
    if (isInWishlistUtil(item.productId)) {
      toast.info('Already wishlisted', {
        description: "This one's already on your list of dreams.",
      })
      return
    }

    const updatedWishlist = addToWishlistUtil(item)
    setWishlist(updatedWishlist)
    toast.success("Another one for the 'maybe later' pile!", {
      description: `${item.name} has been added to your wishlist.`,
    })
  }

  const removeItem = (productId: string) => {
    if (!mounted) return

    const itemToRemove = wishlist.items.find((i) => i.productId === productId)
    const updatedWishlist = removeFromWishlistUtil(productId)
    setWishlist(updatedWishlist)

    if (itemToRemove) {
      toast.success('Your wallet says thank you.', {
        description: `${itemToRemove.name} has been removed from your wishlist.`,
      })
    }
  }

  const isInWishlist = (productId: string): boolean => {
    return wishlist.items.some((i) => i.productId === productId)
  }

  const clearWishlist = () => {
    if (!mounted) return

    const updatedWishlist = clearWishlistUtil()
    setWishlist(updatedWishlist)
    toast.success('A fresh start! How responsible.', {
      description: 'All items have been removed from your wishlist.',
    })
  }

  const { totalValue, itemCount, potentialSavings } = getWishlistTotal(wishlist)

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
        itemCount,
        totalValue,
        potentialSavings,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
