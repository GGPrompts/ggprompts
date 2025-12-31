'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Trash2, Plus, Minus, Heart, Gift, Tag, ArrowRight,
  ShoppingBag, Truck, Shield, Clock, AlertCircle, X, Check, Percent
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'

interface CartItem {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
  color?: string
  size?: string
  stock: number
  inStock: boolean
  saved?: boolean
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Self-Aware Toaster 3000™',
    brand: 'JudgyAppliances',
    price: 499.99,
    originalPrice: 799.99,
    quantity: 1,
    image: '/products/toaster-1.webp',
    color: 'Judgmental Chrome',
    size: 'Standard (2-slice)',
    stock: 42,
    inStock: true,
  },
  {
    id: 2,
    name: 'Telepathic TV Remote',
    brand: 'MindControl Inc',
    price: 299.99,
    quantity: 1,
    image: '/products/remote-1.webp',
    color: 'Psychic Purple',
    stock: 15,
    inStock: true,
  },
  {
    id: 3,
    name: 'Invisible Socks™',
    brand: 'GhostWear',
    price: 19.99,
    originalPrice: 29.99,
    quantity: 2,
    image: '/products/socks-1.webp',
    stock: 8,
    inStock: true,
  },
  {
    id: 4,
    name: 'Procrastination Timer™',
    brand: 'LaterTech',
    price: 59.99,
    quantity: 1,
    image: '/products/timer-1.webp',
    stock: 0,
    inStock: false,
  },
]

const recommendedProducts = [
  { id: 10, name: 'Self-Folding Laundry Basket', price: 149.99, image: '/products/basket-1.webp', rating: 2.9 },
  { id: 11, name: 'Toaster 3000™ (Alt Color)', price: 499.99, image: '/products/toaster-2.webp', rating: 4.2 },
  { id: 12, name: 'Invisible Socks™ (White)', price: 19.99, image: '/products/socks-2.webp', rating: 1.2 },
  { id: 13, name: 'Telepathic Remote (Deluxe)', price: 349.99, image: '/products/remote-2.webp', rating: 3.8 },
]

const coupons = [
  { code: 'SAVE10', discount: 10, type: 'percentage', minSpend: 100 },
  { code: 'FREESHIP', discount: 0, type: 'shipping', minSpend: 50 },
  { code: 'TECH25', discount: 25, type: 'fixed', minSpend: 200 },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [savedItems, setSavedItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<typeof coupons[0] | null>(null)
  const [isGift, setIsGift] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')
  const [showRecommended, setShowRecommended] = useState(true)
  const [removingId, setRemovingId] = useState<number | null>(null)

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(item.stock, item.quantity + change)) }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    setRemovingId(id)
    setTimeout(() => {
      setCartItems(items => items.filter(item => item.id !== id))
      setRemovingId(null)
    }, 300)
  }

  const saveForLater = (id: number) => {
    const item = cartItems.find(i => i.id === id)
    if (item) {
      setSavedItems([...savedItems, { ...item, saved: true }])
      removeItem(id)
    }
  }

  const moveToCart = (id: number) => {
    const item = savedItems.find(i => i.id === id)
    if (item) {
      setCartItems([...cartItems, { ...item, saved: false }])
      setSavedItems(savedItems.filter(i => i.id !== id))
    }
  }

  const applyCoupon = () => {
    const coupon = coupons.find(c => c.code === couponCode.toUpperCase())
    if (coupon && subtotal >= coupon.minSpend) {
      setAppliedCoupon(coupon)
      setCouponCode('')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity)
    }
    return sum
  }, 0)

  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount) / 100
    } else if (appliedCoupon.type === 'fixed') {
      discount = appliedCoupon.discount
    }
  }

  const tax = (subtotal - discount) * 0.08
  const shipping = appliedCoupon?.type === 'shipping' || subtotal > 100 ? 0 : 15.99
  const total = subtotal - discount + tax + shipping

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-mono font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button variant="outline" size="lg">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
        </motion.div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-overlay rounded-2xl p-16 text-center"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="border-glow">
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              {savedItems.length > 0 && (
                <Button size="lg" variant="outline">
                  View Saved Items ({savedItems.length})
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">

              {/* Free Shipping Banner */}
              {subtotal < 100 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-4 rounded-lg flex items-center gap-3"
                >
                  <Truck className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
                    </p>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(subtotal / 100) * 100}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Items List */}
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{
                      opacity: removingId === item.id ? 0 : 1,
                      x: 0,
                      scale: removingId === item.id ? 0.8 : 1,
                    }}
                    exit={{ opacity: 0, x: -50, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      "glass-overlay",
                      !item.inStock && "opacity-60"
                    )}>
                      <CardContent className="p-6">
                        <div className="flex gap-6">

                          {/* Product Image */}
                          <div className="relative">
                            <div className="w-32 h-32 rounded-lg overflow-hidden glass">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {!item.inStock && (
                              <Badge className="absolute -top-2 -right-2 bg-destructive">
                                Out of Stock
                              </Badge>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">{item.brand}</p>
                              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                {item.color && <span>Color: {item.color}</span>}
                                {item.size && <span>Size: {item.size}</span>}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center glass rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1 || !item.inStock}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  disabled={item.quantity >= item.stock || !item.inStock}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>

                              {item.stock <= 5 && item.inStock && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Only {item.stock} left
                                </Badge>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => saveForLater(item.id)}
                              >
                                <Heart className="w-4 h-4 mr-2" />
                                Save for Later
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right space-y-2">
                            <div className="text-2xl font-bold terminal-glow">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            {item.originalPrice && (
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground line-through">
                                  ${(item.originalPrice * item.quantity).toFixed(2)}
                                </div>
                                <Badge className="bg-green-500/20 text-green-500">
                                  Save ${((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                                </Badge>
                              </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Saved Items */}
              {savedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold">Saved for Later ({savedItems.length})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedItems.map((item) => (
                      <Card key={item.id} className="glass">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1 space-y-2">
                              <h4 className="font-semibold line-clamp-2">{item.name}</h4>
                              <p className="font-bold">${item.price}</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => moveToCart(item.id)}>
                                  Move to Cart
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSavedItems(savedItems.filter(i => i.id !== item.id))}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Recommended Products */}
              {showRecommended && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Recommended for You</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRecommended(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recommendedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <Card className="glass cursor-pointer group overflow-hidden">
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-4 space-y-2">
                            <h4 className="font-semibold line-clamp-2 text-sm">{product.name}</h4>
                            <p className="font-bold terminal-glow">${product.price}</p>
                            <Button size="sm" className="w-full">
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="sticky top-8 space-y-6">

                {/* Coupon Code */}
                <Card className="glass-overlay">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Promo Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="glass"
                      />
                      <Button onClick={applyCoupon} disabled={!couponCode}>
                        Apply
                      </Button>
                    </div>

                    {appliedCoupon && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between glass p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">{appliedCoupon.code}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAppliedCoupon(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Available coupons:</p>
                      {coupons.map((coupon) => (
                        <button
                          key={coupon.code}
                          onClick={() => {
                            setCouponCode(coupon.code)
                          }}
                          className="w-full glass p-3 rounded-lg text-left hover:border-glow transition-all text-sm"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-primary">{coupon.code}</span>
                            <Badge variant="secondary">
                              {coupon.type === 'percentage' && `${coupon.discount}% OFF`}
                              {coupon.type === 'fixed' && `$${coupon.discount} OFF`}
                              {coupon.type === 'shipping' && 'FREE SHIP'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Min. spend ${coupon.minSpend}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Gift Options */}
                <Card className="glass-overlay">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-primary" />
                        <Label htmlFor="gift">Gift wrapping</Label>
                      </div>
                      <Switch
                        id="gift"
                        checked={isGift}
                        onCheckedChange={setIsGift}
                      />
                    </div>
                    {isGift && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Input
                          placeholder="Gift message (optional)"
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          className="glass"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          + $5.99 gift wrapping fee
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="glass-overlay border-glow">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>

                      {savings > 0 && (
                        <div className="flex justify-between text-sm text-green-500">
                          <span>Savings</span>
                          <span>-${savings.toFixed(2)}</span>
                        </div>
                      )}

                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-500">
                          <span>Coupon Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">
                          {shipping === 0 ? (
                            <span className="text-green-500">FREE</span>
                          ) : (
                            `$${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (8%)</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>

                      {isGift && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Gift Wrapping</span>
                          <span className="font-medium">$5.99</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="terminal-glow text-2xl">
                        ${(total + (isGift ? 5.99 : 0)).toFixed(2)}
                      </span>
                    </div>

                    <Button size="lg" className="w-full border-glow text-lg h-14">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      <div className="text-center">
                        <Shield className="w-6 h-6 mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">Secure</p>
                      </div>
                      <div className="text-center">
                        <Truck className="w-6 h-6 mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">Fast Ship</p>
                      </div>
                      <div className="text-center">
                        <Clock className="w-6 h-6 mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">24/7</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="glass">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      We accept
                    </p>
                    <div className="flex justify-center gap-3 opacity-60">
                      <div className="w-12 h-8 glass rounded flex items-center justify-center text-xs">VISA</div>
                      <div className="w-12 h-8 glass rounded flex items-center justify-center text-xs">MC</div>
                      <div className="w-12 h-8 glass rounded flex items-center justify-center text-xs">AMEX</div>
                      <div className="w-12 h-8 glass rounded flex items-center justify-center text-xs">PayPal</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
