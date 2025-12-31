'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Grid3x3, List, SlidersHorizontal, Star, Heart, ShoppingCart, Eye,
  ChevronDown, X, Check, Search, ArrowUpDown, Filter, Package,
  TrendingUp, Clock, DollarSign, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Separator, Input, Label, Checkbox, RadioGroup, RadioGroupItem, Slider, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, cn } from "@ggprompts/ui"

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
  tags: string[]
  inStock: boolean
  featured?: boolean
  newArrival?: boolean
}

const products: Product[] = [
  { id: 1, name: 'Self-Aware Toaster 3000™', brand: 'JudgyAppliances', price: 499.99, originalPrice: 799.99, rating: 4.2, reviews: 13847, image: '/products/toaster-1.webp', category: 'Kitchen', tags: ['smart', 'judgmental'], inStock: true, featured: true },
  { id: 2, name: 'Toaster 3000™ (Black Edition)', brand: 'JudgyAppliances', price: 549.99, rating: 4.3, reviews: 8234, image: '/products/toaster-2.webp', category: 'Kitchen', tags: ['smart', 'premium'], inStock: true, newArrival: true },
  { id: 3, name: 'Invisible Socks™ (Beige)', brand: 'GhostWear', price: 19.99, originalPrice: 29.99, rating: 1.2, reviews: 5672, image: '/products/socks-1.webp', category: 'Apparel', tags: ['invisible', 'comfort'], inStock: true },
  { id: 4, name: 'Invisible Socks™ (White)', brand: 'GhostWear', price: 19.99, rating: 1.3, reviews: 4521, image: '/products/socks-2.webp', category: 'Apparel', tags: ['invisible', 'breathable'], inStock: true, featured: true },
  { id: 5, name: 'Telepathic TV Remote', brand: 'MindControl Inc', price: 299.99, rating: 3.8, reviews: 2891, image: '/products/remote-1.webp', category: 'Electronics', tags: ['telepathic', 'wireless'], inStock: true },
  { id: 6, name: 'Telepathic Remote (Deluxe)', brand: 'MindControl Inc', price: 349.99, originalPrice: 449.99, rating: 3.9, reviews: 1845, image: '/products/remote-2.webp', category: 'Electronics', tags: ['telepathic', 'premium'], inStock: true },
  { id: 7, name: 'Procrastination Timer™', brand: 'LaterTech', price: 59.99, rating: 4.9, reviews: 8234, image: '/products/timer-1.webp', category: 'Productivity', tags: ['timer', 'reverse'], inStock: false },
  { id: 8, name: 'Procrastination Timer™ Pro', brand: 'LaterTech', price: 79.99, rating: 4.8, reviews: 3124, image: '/products/timer-2.webp', category: 'Productivity', tags: ['timer', 'premium'], inStock: true, newArrival: true },
  { id: 9, name: 'Self-Folding Laundry Basket', brand: 'LazyHome', price: 149.99, originalPrice: 199.99, rating: 2.9, reviews: 5672, image: '/products/basket-1.webp', category: 'Home', tags: ['self-folding', 'lazy'], inStock: true },
  { id: 10, name: 'Self-Folding Basket (XL)', brand: 'LazyHome', price: 199.99, rating: 2.8, reviews: 2341, image: '/products/basket-2.webp', category: 'Home', tags: ['self-folding', 'large'], inStock: true },
]

const categories = ['All', 'Kitchen', 'Apparel', 'Electronics', 'Productivity', 'Home']
const brands = ['JudgyAppliances', 'GhostWear', 'MindControl Inc', 'LaterTech', 'LazyHome']
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'popular', label: 'Most Popular' },
]

export default function ProductListingPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 500])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [inStock, setInStock] = useState(false)
  const itemsPerPage = 12

  const toggleWishlist = (id: number) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedBrands([])
    setPriceRange([0, 500])
    setMinRating(0)
    setSearchQuery('')
    setInStock(false)
  }

  // Filter products
  let filteredProducts = products.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false
    if (product.rating < minRating) return false
    if (inStock && !product.inStock) return false
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'rating': return b.rating - a.rating
      case 'newest': return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0)
      case 'popular': return b.reviews - a.reviews
      case 'featured': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      default: return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const activeFiltersCount = (
    (selectedCategory !== 'All' ? 1 : 0) +
    selectedBrands.length +
    (priceRange[0] !== 0 || priceRange[1] !== 500 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStock ? 1 : 0)
  )

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Products</h1>
          <p className="text-muted-foreground">
            Browse our collection of premium tech products
          </p>
        </motion.div>

        {/* Search & Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-overlay rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="glass w-full md:w-[200px]">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-5 h-5" />
              </Button>
            </div>

            {/* Filters Toggle (Mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6 lg:col-span-1"
              >
                <Card className="glass-overlay sticky top-8">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5" />
                        Filters
                      </CardTitle>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          Clear All
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Category Filter */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Category</Label>
                      <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                        {categories.map(category => {
                          const count = products.filter(p => category === 'All' || p.category === category).length
                          return (
                            <div key={category} className="flex items-center space-x-2">
                              <RadioGroupItem value={category} id={`cat-${category}`} />
                              <Label
                                htmlFor={`cat-${category}`}
                                className="flex-1 cursor-pointer hover:text-foreground transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <span>{category}</span>
                                  <span className="text-muted-foreground text-sm">({count})</span>
                                </div>
                              </Label>
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </div>

                    <Separator />

                    {/* Brand Filter */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Brand</Label>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {brands.map(brand => {
                          const count = products.filter(p => p.brand === brand).length
                          return (
                            <div key={brand} className="flex items-center space-x-2">
                              <Checkbox
                                id={`brand-${brand}`}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => toggleBrand(brand)}
                              />
                              <Label
                                htmlFor={`brand-${brand}`}
                                className="flex-1 cursor-pointer hover:text-foreground transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <span>{brand}</span>
                                  <span className="text-muted-foreground text-sm">({count})</span>
                                </div>
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={500}
                        step={10}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$0</span>
                        <span>$500</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Rating Filter */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Minimum Rating</Label>
                      <RadioGroup value={minRating.toString()} onValueChange={(v) => setMinRating(Number(v))}>
                        {[4, 3, 2, 1, 0].map(rating => (
                          <div key={rating} className="flex items-center space-x-2">
                            <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                            <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
                              {rating > 0 ? (
                                <>
                                  {[...Array(rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                  ))}
                                  <span className="ml-1">& Up</span>
                                </>
                              ) : (
                                <span>All Ratings</span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Separator />

                    {/* Stock Filter */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock"
                        checked={inStock}
                        onCheckedChange={(checked) => setInStock(checked as boolean)}
                      />
                      <Label htmlFor="in-stock" className="cursor-pointer">
                        In Stock Only
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid/List */}
          <div className={cn("space-y-6", showFilters ? "lg:col-span-3" : "lg:col-span-4")}>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
              {activeFiltersCount > 0 && (
                <div className="flex gap-2">
                  {selectedCategory !== 'All' && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('All')}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedBrands.map(brand => (
                    <Badge key={brand} variant="secondary" className="gap-1">
                      {brand}
                      <button onClick={() => toggleBrand(brand)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Products */}
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                )}
              >
                {paginatedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {viewMode === 'grid' ? (
                      /* Grid View */
                      <Card className="glass group overflow-hidden cursor-pointer h-full flex flex-col">
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.featured && (
                              <Badge className="bg-primary">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {product.newArrival && (
                              <Badge className="bg-secondary">New</Badge>
                            )}
                            {product.originalPrice && (
                              <Badge className="bg-destructive">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </Badge>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleWishlist(product.id)
                              }}
                            >
                              <Heart className={cn(
                                "w-4 h-4",
                                wishlist.includes(product.id) && "fill-current text-destructive"
                              )} />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                setQuickViewProduct(product)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Stock Badge */}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                              <Badge className="bg-destructive text-lg px-4 py-2">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                            <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "w-3.5 h-3.5",
                                      i < Math.floor(product.rating)
                                        ? "fill-primary text-primary"
                                        : "text-muted"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ({product.reviews})
                              </span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold terminal-glow">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>

                            <Button
                              className="w-full border-glow"
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      /* List View */
                      <Card className="glass group overflow-hidden cursor-pointer">
                        <div className="flex gap-6 p-6">
                          <div className="relative w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                <Badge className="bg-destructive">Out of Stock</Badge>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                                <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>

                                <div className="flex items-center gap-2 mb-3">
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
                                    {product.rating} ({product.reviews} reviews)
                                  </span>
                                </div>

                                <div className="flex gap-2 mb-3">
                                  {product.featured && (
                                    <Badge><Sparkles className="w-3 h-3 mr-1" />Featured</Badge>
                                  )}
                                  {product.newArrival && (
                                    <Badge variant="secondary">New Arrival</Badge>
                                  )}
                                  <Badge variant="outline">{product.category}</Badge>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="flex items-baseline gap-2 mb-3">
                                  <span className="text-3xl font-bold terminal-glow">
                                    ${product.price}
                                  </span>
                                  {product.originalPrice && (
                                    <span className="text-lg text-muted-foreground line-through">
                                      ${product.originalPrice}
                                    </span>
                                  )}
                                </div>
                                {product.originalPrice && (
                                  <Badge className="bg-destructive mb-3">
                                    Save ${(product.originalPrice - product.price).toFixed(2)}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-3 mt-auto">
                              <Button
                                className="flex-1 border-glow"
                                disabled={!product.inStock}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => toggleWishlist(product.id)}
                              >
                                <Heart className={cn(
                                  "w-4 h-4 mr-2",
                                  wishlist.includes(product.id) && "fill-current text-destructive"
                                )} />
                                Wishlist
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setQuickViewProduct(product)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Quick View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2"
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(currentPage === i + 1 && "border-glow")}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Quick View Dialog */}
        <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
          <DialogContent className="glass-overlay max-w-4xl">
            {quickViewProduct && (
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{quickViewProduct.brand}</p>
                    <h2 className="text-3xl font-bold mb-3">{quickViewProduct.name}</h2>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4",
                              i < Math.floor(quickViewProduct.rating)
                                ? "fill-primary text-primary"
                                : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {quickViewProduct.rating} ({quickViewProduct.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold terminal-glow">
                      ${quickViewProduct.price}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-2xl text-muted-foreground line-through">
                        ${quickViewProduct.originalPrice}
                      </span>
                    )}
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    {quickViewProduct.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 border-glow" disabled={!quickViewProduct.inStock}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
