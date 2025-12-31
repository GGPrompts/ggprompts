export interface WishlistItem {
  productId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  brand: string
  slug: string
  addedAt: string
}

export interface Wishlist {
  items: WishlistItem[]
  updatedAt: string
}

const WISHLIST_KEY = 'useless-wishlist'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

/**
 * Get the wishlist from localStorage
 */
export function getWishlist(): Wishlist {
  if (!isBrowser) {
    return { items: [], updatedAt: new Date().toISOString() }
  }

  try {
    const wishlistData = localStorage.getItem(WISHLIST_KEY)
    if (!wishlistData) {
      return { items: [], updatedAt: new Date().toISOString() }
    }
    return JSON.parse(wishlistData)
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error)
    return { items: [], updatedAt: new Date().toISOString() }
  }
}

/**
 * Save the wishlist to localStorage
 */
function saveWishlist(wishlist: Wishlist): void {
  if (!isBrowser) return

  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error)
  }
}

/**
 * Add an item to the wishlist
 */
export function addToWishlist(item: Omit<WishlistItem, 'addedAt'>): Wishlist {
  const wishlist = getWishlist()

  // Check if item already exists in wishlist
  const existingItem = wishlist.items.find((i) => i.productId === item.productId)

  if (existingItem) {
    // Item already in wishlist, return as-is
    return wishlist
  }

  // Add new item to wishlist
  wishlist.items.push({
    ...item,
    addedAt: new Date().toISOString(),
  })

  wishlist.updatedAt = new Date().toISOString()
  saveWishlist(wishlist)
  return wishlist
}

/**
 * Remove an item from the wishlist
 */
export function removeFromWishlist(productId: string): Wishlist {
  const wishlist = getWishlist()
  wishlist.items = wishlist.items.filter((i) => i.productId !== productId)
  wishlist.updatedAt = new Date().toISOString()
  saveWishlist(wishlist)
  return wishlist
}

/**
 * Check if an item is in the wishlist
 */
export function isInWishlist(productId: string): boolean {
  const wishlist = getWishlist()
  return wishlist.items.some((i) => i.productId === productId)
}

/**
 * Clear all items from the wishlist
 */
export function clearWishlist(): Wishlist {
  const wishlist: Wishlist = {
    items: [],
    updatedAt: new Date().toISOString(),
  }
  saveWishlist(wishlist)
  return wishlist
}

/**
 * Get the count of items in the wishlist
 */
export function getWishlistCount(): number {
  const wishlist = getWishlist()
  return wishlist.items.length
}

/**
 * Calculate wishlist totals
 */
export function getWishlistTotal(wishlist: Wishlist): {
  totalValue: number
  itemCount: number
  potentialSavings: number
} {
  const totalValue = wishlist.items.reduce((sum, item) => sum + item.price, 0)

  const itemCount = wishlist.items.length

  const potentialSavings = wishlist.items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price)
    }
    return sum
  }, 0)

  return { totalValue, itemCount, potentialSavings }
}

/**
 * Get the oldest item's age in days
 */
export function getOldestItemAgeDays(wishlist: Wishlist): number {
  if (wishlist.items.length === 0) return 0

  const oldestItem = wishlist.items.reduce((oldest, item) => {
    return new Date(item.addedAt) < new Date(oldest.addedAt) ? item : oldest
  })

  const now = new Date()
  const addedDate = new Date(oldestItem.addedAt)
  const diffTime = Math.abs(now.getTime() - addedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
