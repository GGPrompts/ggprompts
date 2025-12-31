'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Check, Plus, ShoppingCart, Heart, Share2, Star, Printer,
  Download, Minus, Info, ArrowRight, ChevronDown, ChevronUp, Zap,
  Shield, Truck, RotateCcw, AlertCircle, TrendingUp, Award
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Separator, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, cn } from "@ggprompts/ui"

interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: string
  inStock: boolean
  features: {
    processor?: string
    ram?: string
    storage?: string
    display?: string
    battery?: string
    camera?: string
    weight?: string
    connectivity?: string[]
    warranty?: string
    color?: string[]
  }
  pros: string[]
  cons: string[]
  bestFor?: string
}

const availableProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones Pro',
    brand: 'AudioTech',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 2847,
    image: '/api/placeholder/300/300',
    category: 'Audio',
    inStock: true,
    features: {
      battery: '40 hours',
      weight: '250g',
      connectivity: ['Bluetooth 5.3', 'USB-C', '3.5mm'],
      warranty: '2 years',
      color: ['Black', 'White', 'Blue'],
    },
    pros: ['Exceptional sound quality', 'Long battery life', 'Comfortable for extended use', 'Premium build quality'],
    cons: ['Expensive', 'No IP rating', 'Bulky case'],
    bestFor: 'Audiophiles and frequent travelers',
  },
  {
    id: 2,
    name: 'Premium Wireless Headphones Lite',
    brand: 'AudioTech',
    price: 199.99,
    rating: 4.6,
    reviews: 1923,
    image: '/api/placeholder/300/300',
    category: 'Audio',
    inStock: true,
    features: {
      battery: '30 hours',
      weight: '220g',
      connectivity: ['Bluetooth 5.2', 'USB-C'],
      warranty: '1 year',
      color: ['Black', 'White'],
    },
    pros: ['Great value', 'Good sound quality', 'Lightweight', 'Compact design'],
    cons: ['Shorter battery life', 'Plastic build', 'Basic ANC'],
    bestFor: 'Budget-conscious buyers',
  },
  {
    id: 3,
    name: 'Premium Wireless Headphones Max',
    brand: 'AudioTech',
    price: 449.99,
    rating: 4.9,
    reviews: 3241,
    image: '/api/placeholder/300/300',
    category: 'Audio',
    inStock: true,
    features: {
      battery: '60 hours',
      weight: '280g',
      connectivity: ['Bluetooth 5.3', 'USB-C', '3.5mm', 'LDAC'],
      warranty: '3 years',
      color: ['Black', 'Silver', 'Blue', 'Rose Gold'],
    },
    pros: ['Best-in-class ANC', 'Premium materials', 'Exceptional battery', 'Hi-Res Audio'],
    cons: ['Very expensive', 'Heavy', 'Overkill for casual use'],
    bestFor: 'Professionals and serious audiophiles',
  },
  {
    id: 4,
    name: 'Wireless Earbuds Pro',
    brand: 'AudioTech',
    price: 179.99,
    originalPrice: 229.99,
    rating: 4.7,
    reviews: 3124,
    image: '/api/placeholder/300/300',
    category: 'Audio',
    inStock: true,
    features: {
      battery: '8 hours (32 with case)',
      weight: '5g per bud',
      connectivity: ['Bluetooth 5.3', 'USB-C'],
      warranty: '1 year',
      color: ['Black', 'White', 'Blue'],
    },
    pros: ['Compact and portable', 'Good ANC', 'IPX4 water resistant', 'Comfortable fit'],
    cons: ['Smaller soundstage', 'Easy to lose', 'Touch controls finicky'],
    bestFor: 'Active lifestyles and commuters',
  },
]

const specifications = [
  { key: 'battery', label: 'Battery Life', icon: Zap },
  { key: 'weight', label: 'Weight', icon: Award },
  { key: 'connectivity', label: 'Connectivity', icon: Truck },
  { key: 'warranty', label: 'Warranty', icon: Shield },
  { key: 'color', label: 'Available Colors', icon: Info },
]

export default function ProductComparisonPage() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([
    availableProducts[0],
    availableProducts[1],
    availableProducts[2],
  ])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [highlightDifferences, setHighlightDifferences] = useState(true)
  const [expandedSections, setExpandedSections] = useState<string[]>(['features', 'pricing'])
  const [wishlist, setWishlist] = useState<number[]>([])

  const addProduct = (product: Product) => {
    if (selectedProducts.length < 4 && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product])
      setShowAddProduct(false)
    }
  }

  const removeProduct = (id: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id))
  }

  const toggleWishlist = (id: number) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const getValueDifference = (key: string) => {
    const values = selectedProducts.map(p => p.features[key as keyof typeof p.features])
    const unique = [...new Set(values.filter(v => v !== undefined))]
    return unique.length > 1
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    const data = selectedProducts.map(p => ({
      name: p.name,
      brand: p.brand,
      price: p.price,
      rating: p.rating,
      ...p.features
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-comparison.json'
    a.click()
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Product Comparison</h1>
            <p className="text-muted-foreground">
              Compare {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} side by side
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-overlay rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowAddProduct(true)}
                disabled={selectedProducts.length >= 4}
                className="border-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product {selectedProducts.length < 4 && `(${4 - selectedProducts.length} slots)`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setHighlightDifferences(!highlightDifferences)}
              >
                {highlightDifferences ? 'Show All' : 'Highlight Differences'}
              </Button>
            </div>

            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Comparing {selectedProducts.length} products
                </Badge>
                {selectedProducts.length < 2 && (
                  <p className="text-sm text-muted-foreground">
                    Add at least 2 products to compare
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {selectedProducts.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-overlay rounded-2xl p-16 text-center"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
              <TrendingUp className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Start Comparing Products</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Add products to compare their features, specifications, and prices side by side
            </p>
            <Button size="lg" onClick={() => setShowAddProduct(true)} className="border-glow">
              <Plus className="w-5 h-5 mr-2" />
              Add Products
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">

            {/* Product Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-overlay h-full">
                    <CardContent className="p-6 space-y-4">
                      {/* Remove Button */}
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeProduct(product.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Product Image */}
                      <div className="aspect-square rounded-lg overflow-hidden glass">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                        <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < Math.floor(product.rating)
                                    ? "fill-primary text-primary"
                                    : "text-muted"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold terminal-glow">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          {product.originalPrice && (
                            <Badge className="bg-green-500/20 text-green-500">
                              Save ${(product.originalPrice - product.price).toFixed(2)}
                            </Badge>
                          )}
                        </div>

                        {/* Stock */}
                        {product.inStock ? (
                          <Badge className="bg-green-500/20 text-green-500">
                            <Check className="w-3 h-3 mr-1" />
                            In Stock
                          </Badge>
                        ) : (
                          <Badge className="bg-destructive/20 text-destructive">
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button
                          className="w-full border-glow"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => toggleWishlist(product.id)}
                          >
                            <Heart className={cn(
                              "w-4 h-4",
                              wishlist.includes(product.id) && "fill-current text-destructive"
                            )} />
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Add Product Placeholder */}
              {selectedProducts.length < 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: selectedProducts.length * 0.1 }}
                >
                  <Card
                    className="glass cursor-pointer h-full hover:border-glow transition-all"
                    onClick={() => setShowAddProduct(true)}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
                      <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                        <Plus className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-semibold mb-2">Add Product</p>
                      <p className="text-sm text-muted-foreground text-center">
                        Compare up to 4 products
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Comparison Table */}
            {selectedProducts.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {/* Features Comparison */}
                <Card className="glass-overlay">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/5 transition-colors"
                    onClick={() => toggleSection('features')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle>Features & Specifications</CardTitle>
                      {expandedSections.includes('features') ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedSections.includes('features') && (
                    <CardContent className="space-y-1">
                      {specifications.map((spec) => {
                        const Icon = spec.icon
                        const hasDifference = getValueDifference(spec.key)
                        const shouldHighlight = highlightDifferences && hasDifference

                        return (
                          <div
                            key={spec.key}
                            className={cn(
                              "grid gap-4 p-4 rounded-lg transition-colors",
                              shouldHighlight && "glass border-primary/30"
                            )}
                            style={{
                              gridTemplateColumns: `200px repeat(${selectedProducts.length}, 1fr)`
                            }}
                          >
                            <div className="flex items-center gap-2 font-medium">
                              <Icon className="w-4 h-4 text-primary" />
                              {spec.label}
                              {shouldHighlight && (
                                <Badge variant="secondary" className="text-xs">Different</Badge>
                              )}
                            </div>
                            {selectedProducts.map((product) => {
                              const value = product.features[spec.key as keyof typeof product.features]
                              return (
                                <div key={product.id} className="text-sm">
                                  {Array.isArray(value) ? (
                                    <div className="flex flex-wrap gap-1">
                                      {value.map((v, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                          {v}
                                        </Badge>
                                      ))}
                                    </div>
                                  ) : value ? (
                                    <span>{value}</span>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </CardContent>
                  )}
                </Card>

                {/* Pros & Cons */}
                <Card className="glass-overlay">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/5 transition-colors"
                    onClick={() => toggleSection('pros-cons')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle>Pros & Cons</CardTitle>
                      {expandedSections.includes('pros-cons') ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedSections.includes('pros-cons') && (
                    <CardContent>
                      <div
                        className="grid gap-6"
                        style={{
                          gridTemplateColumns: `repeat(${selectedProducts.length}, 1fr)`
                        }}
                      >
                        {selectedProducts.map((product) => (
                          <div key={product.id} className="space-y-4">
                            {/* Pros */}
                            <div className="glass p-4 rounded-lg space-y-2">
                              <h4 className="font-semibold text-green-500 flex items-center gap-2 mb-3">
                                <Check className="w-4 h-4" />
                                Pros
                              </h4>
                              <ul className="space-y-2">
                                {product.pros.map((pro, i) => (
                                  <li key={i} className="text-sm flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Cons */}
                            <div className="glass p-4 rounded-lg space-y-2">
                              <h4 className="font-semibold text-destructive flex items-center gap-2 mb-3">
                                <X className="w-4 h-4" />
                                Cons
                              </h4>
                              <ul className="space-y-2">
                                {product.cons.map((con, i) => (
                                  <li key={i} className="text-sm flex items-start gap-2">
                                    <Minus className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                    <span>{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Best For */}
                            {product.bestFor && (
                              <div className="glass p-4 rounded-lg">
                                <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                                  <Award className="w-4 h-4" />
                                  Best For
                                </h4>
                                <p className="text-sm text-muted-foreground">{product.bestFor}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Value Comparison */}
                <Card className="glass-overlay">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/5 transition-colors"
                    onClick={() => toggleSection('value')}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle>Value Analysis</CardTitle>
                      {expandedSections.includes('value') ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedSections.includes('value') && (
                    <CardContent>
                      <div
                        className="grid gap-6"
                        style={{
                          gridTemplateColumns: `repeat(${selectedProducts.length}, 1fr)`
                        }}
                      >
                        {selectedProducts.map((product) => {
                          const savings = product.originalPrice
                            ? product.originalPrice - product.price
                            : 0
                          const savingsPercent = product.originalPrice
                            ? Math.round((savings / product.originalPrice) * 100)
                            : 0

                          return (
                            <div key={product.id} className="glass p-6 rounded-lg space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Price</span>
                                <span className="text-2xl font-bold terminal-glow">
                                  ${product.price}
                                </span>
                              </div>

                              {savings > 0 && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Original Price</span>
                                    <span className="line-through">${product.originalPrice}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">You Save</span>
                                    <Badge className="bg-green-500/20 text-green-500">
                                      ${savings.toFixed(2)} ({savingsPercent}%)
                                    </Badge>
                                  </div>
                                </div>
                              )}

                              <Separator />

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Rating</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-primary text-primary" />
                                  <span className="font-semibold">{product.rating}/5</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Reviews</span>
                                <span className="font-semibold">{product.reviews.toLocaleString()}</span>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Value Score</span>
                                <Badge variant="secondary">
                                  {Math.round((product.rating / product.price) * 1000)}/10
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* Add Product Dialog */}
        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogContent className="glass-overlay max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add Product to Compare</DialogTitle>
              <DialogDescription>
                Select a product to add to your comparison (max 4 products)
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {availableProducts
                .filter(p => !selectedProducts.find(sp => sp.id === p.id))
                .map((product) => (
                  <Card
                    key={product.id}
                    className="glass cursor-pointer hover:border-glow transition-all"
                    onClick={() => addProduct(product)}
                  >
                    <CardContent className="p-4 flex gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                        <h4 className="font-semibold line-clamp-2">{product.name}</h4>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                        <p className="font-bold terminal-glow">${product.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
