'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Share2, ShoppingCart, Star, ChevronLeft, ChevronRight,
  ZoomIn, Minus, Plus, Truck, Shield, RotateCcw, Package,
  ChevronDown, X, Check, MessageSquare, ThumbsUp, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'

const product = {
  id: 1,
  name: 'Self-Aware Toaster 3000™',
  brand: 'JudgyAppliances',
  price: 499.99,
  originalPrice: 799.99,
  rating: 4.2,
  reviewCount: 13847,
  description: 'The world\'s first sentient toaster with AI-powered bread judgment technology. Features a high-resolution LED face that displays disappointment when you toast white bread and celebrates whole grain choices. Comes with optional existential crisis mode.',
  images: [
    '/products/toaster-1.webp',
    '/products/toaster-2.webp',
  ],
  colors: [
    { name: 'Judgmental Chrome', hex: '#c0c0c0', available: true },
    { name: 'Passive-Aggressive Black', hex: '#1a1a1a', available: true },
    { name: 'Sarcastic Pink', hex: '#ff69b4', available: true },
    { name: 'Disappointed Gold', hex: '#ffd700', available: false },
  ],
  sizes: [
    { name: 'Standard (2-slice judgment)', available: true },
    { name: 'Family Size (4-slice roast session)', available: true },
    { name: 'Industrial (Judges entire bakery)', available: false },
  ],
  stock: 42,
  shipping: {
    free: true,
    estimatedDays: '2-4',
  },
  features: [
    '8K OLED facial expression display',
    'AI-powered bread quality analysis',
    'Sassy voice assistant (12 languages)',
    'Automatic eye-roll detection',
    'WiFi-enabled for firmware sass updates',
    'Comes with therapy coupon for your feelings',
  ],
  specifications: [
    { label: 'Display Resolution', value: '3840×2160 (judging in 8K)' },
    { label: 'Sass Level', value: 'Adjustable (1-10)' },
    { label: 'Judgment Accuracy', value: '99.7%' },
    { label: 'Weight', value: '2.5kg (heavy with opinions)' },
    { label: 'Power Consumption', value: '1200W + smugness' },
    { label: 'Toast Modes', value: '47 (including "are you sure?")' },
    { label: 'Warranty', value: '2 years (emotional damage not covered)' },
    { label: 'Compatibility', value: 'All breads (will judge them all)' },
  ],
}

const relatedProducts = [
  { id: 2, name: 'Invisible Socks™ (Lost instantly)', price: 19.99, image: '/products/socks-1.webp', rating: 1.2 },
  { id: 3, name: 'Telepathic TV Remote (Reads your mind, judges your choices)', price: 299.99, image: '/products/remote-1.webp', rating: 3.8 },
  { id: 4, name: 'Self-Folding Laundry Basket (Folds itself, not your clothes)', price: 149.99, image: '/products/basket-1.webp', rating: 2.9 },
  { id: 5, name: 'Procrastination Timer™ (Counts backwards while you scroll)', price: 59.99, image: '/products/timer-1.webp', rating: 4.9 },
]

const reviews = [
  {
    id: 1,
    author: 'Karen McDougal',
    rating: 1,
    date: '2024-11-15',
    verified: true,
    title: 'It called my gluten-free bread "a crime against humanity"',
    content: 'I bought this toaster thinking the AI would be helpful. Instead, it spent 20 minutes lecturing me about my dietary choices. The toast was perfect though. Still returning it. My therapist says I don\'t need this kind of negativity.',
    helpful: 3847,
  },
  {
    id: 2,
    author: 'Brad "WhiteBread" Johnson',
    rating: 5,
    date: '2024-11-10',
    verified: true,
    title: 'Finally, someone who understands me',
    content: 'As a whole grain enthusiast, I\'ve never felt so validated. The toaster literally gave me a standing ovation when I toasted my homemade sourdough. It even plays a little celebration song. Worth. Every. Penny.',
    helpful: 2891,
  },
  {
    id: 3,
    author: 'Tech Bro Todd',
    rating: 2,
    date: '2024-11-08',
    verified: true,
    title: 'Too much personality',
    content: 'Look, I just wanted to toast my bagel. I didn\'t sign up for a 10-minute TED talk about carb consumption and its impact on productivity. The "existential crisis mode" kicked in during breakfast and now it won\'t stop asking about the meaning of toast.',
    helpful: 5672,
  },
  {
    id: 4,
    author: 'Margaret Stevenson',
    rating: 5,
    date: '2024-11-05',
    verified: true,
    title: 'Better than my actual kids',
    content: 'This toaster gives me honest feedback, remembers my preferences, and has never asked me for money. 10/10 would adopt. My children are jealous of a kitchen appliance and I\'m okay with that.',
    helpful: 8234,
  },
]

export default function ProductDetailPage() {
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span className="hover:text-foreground cursor-pointer transition-colors">Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-foreground cursor-pointer transition-colors">Audio</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-foreground cursor-pointer transition-colors">Headphones</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.name}</span>
        </motion.div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden glass border-glow group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={product.images[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 glass-dark p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 glass-dark p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Zoom Button */}
              <button
                onClick={() => setShowZoom(true)}
                className="absolute top-4 right-4 glass-dark p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-destructive text-destructive-foreground text-lg px-4 py-2">
                    -{discount}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={cn(
                    "aspect-square rounded-lg overflow-hidden transition-all",
                    currentImage === index
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                      : "glass hover:scale-105"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Brand & Title */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-2xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < Math.floor(product.rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                  <span className="ml-2 font-semibold">{product.rating}</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {product.reviewCount.toLocaleString()} reviews
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold terminal-glow">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-2xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-destructive">Out of Stock</span>
                </>
              )}
            </div>

            <Separator />

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Color: <span className="text-muted-foreground">{selectedColor.name}</span>
              </label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <motion.button
                    key={color.name}
                    onClick={() => color.available && setSelectedColor(color)}
                    disabled={!color.available}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 transition-all relative",
                      selectedColor.name === color.name
                        ? "border-primary scale-110"
                        : "border-border hover:scale-105",
                      !color.available && "opacity-30 cursor-not-allowed"
                    )}
                    style={{ backgroundColor: color.hex }}
                    whileHover={{ scale: color.available ? 1.1 : 1 }}
                    whileTap={{ scale: color.available ? 0.95 : 1 }}
                  >
                    {selectedColor.name === color.name && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    )}
                    {!color.available && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <X className="w-6 h-6 text-destructive" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Size</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size.name}
                    onClick={() => size.available && setSelectedSize(size)}
                    disabled={!size.available}
                    className={cn(
                      "glass p-3 rounded-lg text-sm font-medium transition-all",
                      selectedSize.name === size.name && "border-glow ring-2 ring-primary",
                      !size.available && "opacity-30 cursor-not-allowed"
                    )}
                    whileHover={{ scale: size.available ? 1.05 : 1 }}
                    whileTap={{ scale: size.available ? 0.95 : 1 }}
                  >
                    {size.name}
                    {!size.available && <X className="w-4 h-4 inline ml-2" />}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center glass rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total: <span className="font-bold text-foreground terminal-glow">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </span>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 text-lg h-14 border-glow"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "h-14 px-6",
                  isWishlisted && "text-destructive border-destructive"
                )}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-6">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Shipping & Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass p-4 rounded-lg flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Arrives in {product.shipping.estimatedDays} days</p>
                </div>
              </div>
              <div className="glass p-4 rounded-lg flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">2-Year Warranty</p>
                  <p className="text-xs text-muted-foreground">Full coverage included</p>
                </div>
              </div>
              <div className="glass p-4 rounded-lg flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">30-Day Returns</p>
                  <p className="text-xs text-muted-foreground">Free return shipping</p>
                </div>
              </div>
              <div className="glass p-4 rounded-lg flex items-start gap-3">
                <Package className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Gift Packaging</p>
                  <p className="text-xs text-muted-foreground">Available at checkout</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <div className="flex gap-4 border-b border-border">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-4 px-2 text-sm font-medium transition-all capitalize relative",
                      activeTab === tab
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                      <ul className="space-y-3">
                        {product.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary" />
                            </div>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'specifications' && (
                  <motion.div
                    key="specifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    {product.specifications.map((spec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex justify-between items-center py-3 border-b border-border/50 last:border-0"
                      >
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-medium">{spec.value}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Review Summary */}
                    <div className="flex items-center gap-8 glass p-6 rounded-lg">
                      <div className="text-center">
                        <div className="text-5xl font-bold terminal-glow mb-2">{product.rating}</div>
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {product.reviewCount.toLocaleString()} reviews
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const percentage = Math.floor(Math.random() * 60) + 20
                          return (
                            <div key={stars} className="flex items-center gap-3">
                              <span className="text-sm w-8">{stars}★</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ delay: stars * 0.1, duration: 0.5 }}
                                  className="h-full bg-primary"
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-12">{percentage}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass p-6 rounded-lg space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{review.author}</span>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Check className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "w-4 h-4",
                                      i < review.rating ? "fill-primary text-primary" : "text-muted"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{review.title}</h4>
                            <p className="text-muted-foreground">{review.content}</p>
                          </div>
                          <div className="flex items-center gap-4 pt-2">
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              Helpful ({review.helpful})
                            </button>
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                              <MessageSquare className="w-4 h-4" />
                              Reply
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold terminal-glow">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="glass overflow-hidden cursor-pointer group">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span>{item.rating}</span>
                    </div>
                    <p className="text-lg font-bold terminal-glow">${item.price}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Zoom Dialog */}
        <Dialog open={showZoom} onOpenChange={setShowZoom}>
          <DialogContent className="max-w-4xl glass-overlay">
            <DialogHeader>
              <DialogTitle>Product Image</DialogTitle>
            </DialogHeader>
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full rounded-lg"
            />
          </DialogContent>
        </Dialog>

        {/* Added to Cart Toast */}
        <AnimatePresence>
          {addedToCart && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 glass-overlay p-6 rounded-lg shadow-2xl border-glow max-w-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Added to cart!</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {quantity} × {product.name}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Cart</Button>
                    <Button size="sm">Checkout</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
