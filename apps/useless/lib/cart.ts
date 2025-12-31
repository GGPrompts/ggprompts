export interface CartItem {
  productId: string
  slug: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  color?: string
  size?: string
}

export interface Cart {
  items: CartItem[]
  updatedAt: string
}

const CART_KEY = 'useless-cart'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

/**
 * Get the cart from localStorage
 */
export function getCart(): Cart {
  if (!isBrowser) {
    return { items: [], updatedAt: new Date().toISOString() }
  }

  try {
    const cartData = localStorage.getItem(CART_KEY)
    if (!cartData) {
      return { items: [], updatedAt: new Date().toISOString() }
    }
    return JSON.parse(cartData)
  } catch (error) {
    console.error('Error reading cart from localStorage:', error)
    return { items: [], updatedAt: new Date().toISOString() }
  }
}

/**
 * Save the cart to localStorage
 */
function saveCart(cart: Cart): void {
  if (!isBrowser) return

  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

/**
 * Add an item to the cart
 */
export function addToCart(
  item: Omit<CartItem, 'quantity'>,
  quantity: number = 1
): Cart {
  const cart = getCart()

  // Check if item already exists in cart (matching productId, color, and size)
  const existingItemIndex = cart.items.findIndex(
    (i) =>
      i.productId === item.productId &&
      i.color === item.color &&
      i.size === item.size
  )

  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    cart.items[existingItemIndex].quantity += quantity
  } else {
    // Add new item to cart
    cart.items.push({ ...item, quantity })
  }

  cart.updatedAt = new Date().toISOString()
  saveCart(cart)
  return cart
}

/**
 * Update the quantity of an item in the cart
 */
export function updateQuantity(productId: string, quantity: number): Cart {
  const cart = getCart()

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    return removeFromCart(productId)
  }

  const itemIndex = cart.items.findIndex((i) => i.productId === productId)

  if (itemIndex >= 0) {
    cart.items[itemIndex].quantity = quantity
    cart.updatedAt = new Date().toISOString()
    saveCart(cart)
  }

  return cart
}

/**
 * Remove an item from the cart
 */
export function removeFromCart(productId: string): Cart {
  const cart = getCart()
  cart.items = cart.items.filter((i) => i.productId !== productId)
  cart.updatedAt = new Date().toISOString()
  saveCart(cart)
  return cart
}

/**
 * Clear all items from the cart
 */
export function clearCart(): Cart {
  const cart: Cart = {
    items: [],
    updatedAt: new Date().toISOString(),
  }
  saveCart(cart)
  return cart
}

/**
 * Calculate cart totals
 */
export function getCartTotal(cart: Cart): {
  subtotal: number
  itemCount: number
  savings: number
} {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  const savings = cart.items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)

  return { subtotal, itemCount, savings }
}
