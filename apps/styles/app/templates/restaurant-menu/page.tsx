"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChefHat,
  Clock,
  Flame,
  Heart,
  Leaf,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Timer,
  Trash2,
  Wheat,
  X,
  AlertTriangle,
  Info,
  Phone,
  Check,
  ChevronRight,
  Utensils,
  Coffee,
  Wine,
  IceCream,
  Salad,
  Pizza,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// TypeScript Interfaces
interface ModifierOption {
  name: string
  price: number
}

interface ModifierGroup {
  name: string
  required: boolean
  maxSelect: number
  options: ModifierOption[]
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  photo: string
  category: string
  dietary: ("vegetarian" | "vegan" | "gluten-free" | "spicy" | "contains-nuts")[]
  calories?: number
  prepTime: string
  isPopular: boolean
  isAvailable: boolean
  modifiers?: ModifierGroup[]
  protein?: number
  carbs?: number
  fat?: number
}

interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
  modifiers: { group: string; selection: string[] }[]
  specialInstructions: string
  subtotal: number
}

interface SpecialOffer {
  id: string
  title: string
  description: string
  discount: string
  validUntil: string
  items: string[]
}

// Mock Data
const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: "app-1",
    name: "Crispy Calamari",
    description: "Tender calamari rings lightly breaded and fried, served with marinara and aioli",
    price: 14.99,
    photo: "calamari",
    category: "Appetizers",
    dietary: [],
    calories: 380,
    protein: 18,
    carbs: 32,
    fat: 20,
    prepTime: "12 min",
    isPopular: true,
    isAvailable: true,
    modifiers: [
      {
        name: "Sauce",
        required: true,
        maxSelect: 2,
        options: [
          { name: "Marinara", price: 0 },
          { name: "Garlic Aioli", price: 0 },
          { name: "Spicy Mayo", price: 0.5 },
        ],
      },
    ],
  },
  {
    id: "app-2",
    name: "Garden Bruschetta",
    description: "Toasted ciabatta topped with fresh tomatoes, basil, garlic, and balsamic glaze",
    price: 11.99,
    photo: "bruschetta",
    category: "Appetizers",
    dietary: ["vegetarian", "vegan"],
    calories: 240,
    protein: 6,
    carbs: 38,
    fat: 8,
    prepTime: "8 min",
    isPopular: false,
    isAvailable: true,
  },
  {
    id: "app-3",
    name: "Spicy Thai Wings",
    description: "Crispy chicken wings tossed in sweet chili sauce with sesame seeds",
    price: 15.99,
    photo: "wings",
    category: "Appetizers",
    dietary: ["spicy", "gluten-free"],
    calories: 520,
    protein: 32,
    carbs: 18,
    fat: 38,
    prepTime: "15 min",
    isPopular: true,
    isAvailable: true,
    modifiers: [
      {
        name: "Heat Level",
        required: true,
        maxSelect: 1,
        options: [
          { name: "Mild", price: 0 },
          { name: "Medium", price: 0 },
          { name: "Hot", price: 0 },
          { name: "Extra Hot", price: 0 },
        ],
      },
      {
        name: "Dipping Sauce",
        required: false,
        maxSelect: 2,
        options: [
          { name: "Ranch", price: 0.75 },
          { name: "Blue Cheese", price: 0.75 },
          { name: "Honey Mustard", price: 0.75 },
        ],
      },
    ],
  },
  {
    id: "app-4",
    name: "Stuffed Mushrooms",
    description: "Portobello caps filled with herb cream cheese and breadcrumbs",
    price: 12.99,
    photo: "mushrooms",
    category: "Appetizers",
    dietary: ["vegetarian"],
    calories: 290,
    protein: 8,
    carbs: 22,
    fat: 18,
    prepTime: "18 min",
    isPopular: false,
    isAvailable: true,
  },
  // Mains
  {
    id: "main-1",
    name: "Grilled Ribeye Steak",
    description: "12oz prime ribeye with garlic herb butter, served with mashed potatoes and asparagus",
    price: 38.99,
    photo: "steak",
    category: "Mains",
    dietary: ["gluten-free"],
    calories: 850,
    protein: 62,
    carbs: 28,
    fat: 54,
    prepTime: "25 min",
    isPopular: true,
    isAvailable: true,
    modifiers: [
      {
        name: "Temperature",
        required: true,
        maxSelect: 1,
        options: [
          { name: "Rare", price: 0 },
          { name: "Medium Rare", price: 0 },
          { name: "Medium", price: 0 },
          { name: "Medium Well", price: 0 },
          { name: "Well Done", price: 0 },
        ],
      },
      {
        name: "Add Sides",
        required: false,
        maxSelect: 3,
        options: [
          { name: "Loaded Potato", price: 4.99 },
          { name: "Grilled Shrimp", price: 8.99 },
          { name: "Sautéed Mushrooms", price: 3.99 },
        ],
      },
    ],
  },
  {
    id: "main-2",
    name: "Pan-Seared Salmon",
    description: "Atlantic salmon with lemon dill sauce, quinoa pilaf, and roasted vegetables",
    price: 28.99,
    photo: "salmon",
    category: "Mains",
    dietary: ["gluten-free"],
    calories: 620,
    protein: 48,
    carbs: 32,
    fat: 34,
    prepTime: "20 min",
    isPopular: true,
    isAvailable: true,
    modifiers: [
      {
        name: "Preparation",
        required: true,
        maxSelect: 1,
        options: [
          { name: "Pan-Seared", price: 0 },
          { name: "Grilled", price: 0 },
          { name: "Blackened", price: 1.5 },
        ],
      },
    ],
  },
  {
    id: "main-3",
    name: "Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms, parmesan, and truffle oil",
    price: 22.99,
    photo: "risotto",
    category: "Mains",
    dietary: ["vegetarian", "gluten-free"],
    calories: 580,
    protein: 14,
    carbs: 68,
    fat: 28,
    prepTime: "22 min",
    isPopular: false,
    isAvailable: true,
  },
  {
    id: "main-4",
    name: "Thai Green Curry",
    description: "Coconut curry with vegetables and jasmine rice - choice of protein",
    price: 19.99,
    photo: "curry",
    category: "Mains",
    dietary: ["vegan", "gluten-free", "spicy"],
    calories: 480,
    protein: 12,
    carbs: 52,
    fat: 24,
    prepTime: "18 min",
    isPopular: true,
    isAvailable: true,
    modifiers: [
      {
        name: "Protein",
        required: true,
        maxSelect: 1,
        options: [
          { name: "Tofu", price: 0 },
          { name: "Chicken", price: 3.99 },
          { name: "Shrimp", price: 5.99 },
          { name: "Vegetables Only", price: 0 },
        ],
      },
      {
        name: "Spice Level",
        required: true,
        maxSelect: 1,
        options: [
          { name: "Mild", price: 0 },
          { name: "Medium", price: 0 },
          { name: "Thai Hot", price: 0 },
        ],
      },
    ],
  },
  {
    id: "main-5",
    name: "Classic Burger",
    description: "8oz Angus beef patty with lettuce, tomato, onion, and special sauce",
    price: 17.99,
    photo: "burger",
    category: "Mains",
    dietary: [],
    calories: 720,
    protein: 42,
    carbs: 48,
    fat: 40,
    prepTime: "15 min",
    isPopular: true,
    isAvailable: true,
    modifiers: [
      {
        name: "Cheese",
        required: false,
        maxSelect: 1,
        options: [
          { name: "American", price: 1.5 },
          { name: "Cheddar", price: 1.5 },
          { name: "Swiss", price: 1.5 },
          { name: "Blue Cheese", price: 2.0 },
        ],
      },
      {
        name: "Extras",
        required: false,
        maxSelect: 4,
        options: [
          { name: "Bacon", price: 2.99 },
          { name: "Avocado", price: 2.49 },
          { name: "Fried Egg", price: 1.99 },
          { name: "Jalapeños", price: 0.99 },
        ],
      },
    ],
  },
  {
    id: "main-6",
    name: "Vegan Buddha Bowl",
    description: "Quinoa, roasted chickpeas, avocado, sweet potato, and tahini dressing",
    price: 18.99,
    photo: "buddha-bowl",
    category: "Mains",
    dietary: ["vegan", "gluten-free"],
    calories: 520,
    protein: 18,
    carbs: 62,
    fat: 24,
    prepTime: "12 min",
    isPopular: false,
    isAvailable: true,
  },
  // Desserts
  {
    id: "des-1",
    name: "Chocolate Lava Cake",
    description: "Warm molten chocolate cake with vanilla ice cream and raspberry coulis",
    price: 10.99,
    photo: "lava-cake",
    category: "Desserts",
    dietary: ["vegetarian"],
    calories: 680,
    protein: 8,
    carbs: 72,
    fat: 42,
    prepTime: "15 min",
    isPopular: true,
    isAvailable: true,
    modifiers: [
      {
        name: "Ice Cream",
        required: false,
        maxSelect: 1,
        options: [
          { name: "Vanilla", price: 0 },
          { name: "Chocolate", price: 0 },
          { name: "Salted Caramel", price: 1.0 },
        ],
      },
    ],
  },
  {
    id: "des-2",
    name: "New York Cheesecake",
    description: "Classic creamy cheesecake with graham cracker crust and berry compote",
    price: 9.99,
    photo: "cheesecake",
    category: "Desserts",
    dietary: ["vegetarian"],
    calories: 520,
    protein: 10,
    carbs: 42,
    fat: 34,
    prepTime: "5 min",
    isPopular: true,
    isAvailable: true,
  },
  {
    id: "des-3",
    name: "Vegan Tiramisu",
    description: "Plant-based layers of coffee-soaked ladyfingers and cashew mascarpone",
    price: 11.99,
    photo: "tiramisu",
    category: "Desserts",
    dietary: ["vegan"],
    calories: 420,
    protein: 6,
    carbs: 48,
    fat: 22,
    prepTime: "5 min",
    isPopular: false,
    isAvailable: true,
  },
  {
    id: "des-4",
    name: "Fresh Fruit Sorbet",
    description: "Trio of seasonal fruit sorbets - refreshing and dairy-free",
    price: 7.99,
    photo: "sorbet",
    category: "Desserts",
    dietary: ["vegan", "gluten-free"],
    calories: 180,
    protein: 0,
    carbs: 44,
    fat: 0,
    prepTime: "5 min",
    isPopular: false,
    isAvailable: true,
  },
  // Drinks
  {
    id: "drink-1",
    name: "Craft Lemonade",
    description: "Fresh-squeezed lemonade with choice of flavors",
    price: 4.99,
    photo: "lemonade",
    category: "Drinks",
    dietary: ["vegan", "gluten-free"],
    calories: 120,
    prepTime: "3 min",
    isPopular: true,
    isAvailable: true,
    modifiers: [
      {
        name: "Flavor",
        required: true,
        maxSelect: 1,
        options: [
          { name: "Classic", price: 0 },
          { name: "Strawberry", price: 0.5 },
          { name: "Lavender", price: 0.5 },
          { name: "Ginger", price: 0.5 },
        ],
      },
    ],
  },
  {
    id: "drink-2",
    name: "Espresso Martini",
    description: "Vodka, coffee liqueur, and fresh espresso",
    price: 14.99,
    photo: "espresso-martini",
    category: "Drinks",
    dietary: ["vegan", "gluten-free"],
    calories: 220,
    prepTime: "5 min",
    isPopular: true,
    isAvailable: true,
  },
  {
    id: "drink-3",
    name: "Signature Sangria",
    description: "House red wine with fresh fruits and citrus",
    price: 12.99,
    photo: "sangria",
    category: "Drinks",
    dietary: ["vegan", "gluten-free"],
    calories: 180,
    prepTime: "3 min",
    isPopular: false,
    isAvailable: true,
  },
  {
    id: "drink-4",
    name: "Mint Mojito Mocktail",
    description: "Fresh mint, lime, and sparkling water - alcohol-free",
    price: 5.99,
    photo: "mojito",
    category: "Drinks",
    dietary: ["vegan", "gluten-free"],
    calories: 80,
    prepTime: "3 min",
    isPopular: false,
    isAvailable: true,
  },
  // Salads
  {
    id: "salad-1",
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, croutons, and house-made Caesar dressing",
    price: 13.99,
    photo: "caesar",
    category: "Salads",
    dietary: ["vegetarian"],
    calories: 380,
    protein: 12,
    carbs: 24,
    fat: 28,
    prepTime: "8 min",
    isPopular: true,
    isAvailable: true,
    modifiers: [
      {
        name: "Add Protein",
        required: false,
        maxSelect: 1,
        options: [
          { name: "Grilled Chicken", price: 5.99 },
          { name: "Grilled Shrimp", price: 7.99 },
          { name: "Salmon", price: 9.99 },
        ],
      },
    ],
  },
  {
    id: "salad-2",
    name: "Mediterranean Bowl",
    description: "Mixed greens, feta, olives, cucumber, tomato, and lemon herb vinaigrette",
    price: 14.99,
    photo: "mediterranean",
    category: "Salads",
    dietary: ["vegetarian", "gluten-free"],
    calories: 340,
    protein: 10,
    carbs: 22,
    fat: 26,
    prepTime: "8 min",
    isPopular: false,
    isAvailable: true,
  },
]

const specialOffers: SpecialOffer[] = [
  {
    id: "offer-1",
    title: "Date Night Special",
    description: "Two mains + appetizer + dessert to share",
    discount: "25% OFF",
    validUntil: "Wed-Thu after 5PM",
    items: ["Any Main", "Any Appetizer", "Any Dessert"],
  },
  {
    id: "offer-2",
    title: "Happy Hour",
    description: "Half-price appetizers and drink specials",
    discount: "50% OFF",
    validUntil: "Daily 4-6PM",
    items: ["All Appetizers", "House Wine", "Draft Beer"],
  },
  {
    id: "offer-3",
    title: "Lunch Combo",
    description: "Any salad + soup of the day + drink",
    discount: "$14.99",
    validUntil: "Mon-Fri 11AM-3PM",
    items: ["Any Salad", "Soup of the Day", "Soft Drink"],
  },
]

const categories = ["All", "Appetizers", "Salads", "Mains", "Desserts", "Drinks"]

const categoryIcons: Record<string, React.ReactNode> = {
  All: <Utensils className="h-4 w-4" />,
  Appetizers: <Pizza className="h-4 w-4" />,
  Salads: <Salad className="h-4 w-4" />,
  Mains: <ChefHat className="h-4 w-4" />,
  Desserts: <IceCream className="h-4 w-4" />,
  Drinks: <Coffee className="h-4 w-4" />,
}

const dietaryIcons: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  vegetarian: { icon: <Leaf className="h-3 w-3" />, label: "Vegetarian", color: "text-primary" },
  vegan: { icon: <Leaf className="h-3 w-3" />, label: "Vegan", color: "text-primary" },
  "gluten-free": { icon: <Wheat className="h-3 w-3" />, label: "Gluten-Free", color: "text-secondary" },
  spicy: { icon: <Flame className="h-3 w-3" />, label: "Spicy", color: "text-orange-500" },
  "contains-nuts": { icon: <AlertTriangle className="h-3 w-3" />, label: "Contains Nuts", color: "text-amber-500" },
}

export default function RestaurantMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showNutrition, setShowNutrition] = useState<string | null>(null)

  // Item customization state
  const [itemQuantity, setItemQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({})
  const [specialInstructions, setSpecialInstructions] = useState("")

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDietary =
        dietaryFilters.length === 0 || dietaryFilters.every((filter) => item.dietary.includes(filter as any))
      return matchesCategory && matchesSearch && matchesDietary && item.isAvailable
    })
  }, [selectedCategory, searchQuery, dietaryFilters])

  // Popular items
  const popularItems = menuItems.filter((item) => item.isPopular && item.isAvailable)

  // Cart calculations
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Open item detail
  const openItemDetail = (item: MenuItem) => {
    setSelectedItem(item)
    setItemQuantity(1)
    setSelectedModifiers({})
    setSpecialInstructions("")
    setIsDetailOpen(true)
  }

  // Calculate item subtotal
  const calculateSubtotal = () => {
    if (!selectedItem) return 0
    let total = selectedItem.price * itemQuantity
    Object.entries(selectedModifiers).forEach(([group, selections]) => {
      const modGroup = selectedItem.modifiers?.find((m) => m.name === group)
      if (modGroup) {
        selections.forEach((sel) => {
          const option = modGroup.options.find((o) => o.name === sel)
          if (option) total += option.price * itemQuantity
        })
      }
    })
    return total
  }

  // Add to cart
  const addToCart = () => {
    if (!selectedItem) return

    const cartItem: CartItem = {
      id: `${selectedItem.id}-${Date.now()}`,
      menuItem: selectedItem,
      quantity: itemQuantity,
      modifiers: Object.entries(selectedModifiers).map(([group, selection]) => ({
        group,
        selection,
      })),
      specialInstructions,
      subtotal: calculateSubtotal(),
    }

    setCart((prev) => [...prev, cartItem])
    setIsDetailOpen(false)
    setIsCartOpen(true)
  }

  // Quick add to cart
  const quickAddToCart = (item: MenuItem) => {
    if (item.modifiers && item.modifiers.some((m) => m.required)) {
      openItemDetail(item)
    } else {
      const cartItem: CartItem = {
        id: `${item.id}-${Date.now()}`,
        menuItem: item,
        quantity: 1,
        modifiers: [],
        specialInstructions: "",
        subtotal: item.price,
      }
      setCart((prev) => [...prev, cartItem])
    }
  }

  // Remove from cart
  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId))
  }

  // Update cart item quantity
  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(cartItemId)
      return
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const unitPrice = item.subtotal / item.quantity
          return { ...item, quantity: newQuantity, subtotal: unitPrice * newQuantity }
        }
        return item
      })
    )
  }

  // Toggle modifier selection
  const toggleModifier = (group: string, option: string, maxSelect: number) => {
    setSelectedModifiers((prev) => {
      const current = prev[group] || []
      if (current.includes(option)) {
        return { ...prev, [group]: current.filter((o) => o !== option) }
      }
      if (maxSelect === 1) {
        return { ...prev, [group]: [option] }
      }
      if (current.length >= maxSelect) {
        return { ...prev, [group]: [...current.slice(1), option] }
      }
      return { ...prev, [group]: [...current, option] }
    })
  }

  // Toggle dietary filter
  const toggleDietaryFilter = (filter: string) => {
    setDietaryFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    )
  }

  return (
    <div className="min-h-screen">
      {/* Restaurant Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-border/30 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">The Glass Kitchen</h1>
                <p className="text-muted-foreground text-sm">Modern American Cuisine</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>11AM - 10PM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>123 Main St</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-primary" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-foreground">4.8</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Special Offers Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Special Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {specialOffers.map((offer, idx) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass border-primary/30 p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{offer.title}</h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30">{offer.discount}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{offer.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {offer.items.map((item) => (
                      <Badge key={item} variant="outline" className="text-xs border-border/50 text-muted-foreground">
                        {item}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-secondary flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {offer.validUntil}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Search and Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-border/30"
            />
          </div>

          {/* Category Navigation */}
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="glass border-border/30 w-max">
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="flex items-center gap-1.5 whitespace-nowrap">
                    {categoryIcons[cat]}
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Dietary Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2">Dietary:</span>
            {Object.entries(dietaryIcons).map(([key, { icon, label, color }]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => toggleDietaryFilter(key)}
                className={`text-xs h-7 ${
                  dietaryFilters.includes(key)
                    ? "bg-primary/20 border-primary/50"
                    : "border-border/30 hover:border-border/50"
                }`}
              >
                <span className={color}>{icon}</span>
                <span className="ml-1">{label}</span>
                {dietaryFilters.includes(key) && <Check className="h-3 w-3 ml-1 text-primary" />}
              </Button>
            ))}
          </div>
        </motion.section>

        {/* Popular Items */}
        {selectedCategory === "All" && dietaryFilters.length === 0 && !searchQuery && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-400" />
              Most Popular
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {popularItems.slice(0, 5).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="min-w-[280px] md:min-w-[320px]"
                >
                  <Card
                    className="glass border-primary/30 overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.02]"
                    onClick={() => openItemDetail(item)}
                  >
                    <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                      <ChefHat className="h-16 w-16 text-primary/40" />
                      <Badge className="absolute top-2 right-2 bg-red-500/90 text-foreground border-0">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        Popular
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {item.dietary.map((d) => (
                            <span key={d} className={dietaryIcons[d]?.color}>
                              {dietaryIcons[d]?.icon}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {item.prepTime}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Menu Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {selectedCategory === "All" ? "Full Menu" : selectedCategory}
            </h2>
            <Badge variant="outline" className="text-muted-foreground border-border/50">
              {filteredItems.length} items
            </Badge>
          </div>

          {filteredItems.length === 0 ? (
            <Card className="glass border-border/30 p-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="glass border-border/30 overflow-hidden group hover:border-primary/50 transition-all">
                    <div
                      className="h-48 bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center relative cursor-pointer"
                      onClick={() => openItemDetail(item)}
                    >
                      <ChefHat className="h-20 w-20 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                      {item.isPopular && (
                        <Badge className="absolute top-2 left-2 bg-red-500/90 text-foreground border-0">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Popular
                        </Badge>
                      )}
                      <Badge variant="outline" className="absolute top-2 right-2 border-border/50 bg-background/80 text-muted-foreground">
                        {item.category}
                      </Badge>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={() => openItemDetail(item)}>
                          {item.name}
                        </h3>
                        <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                      </div>

                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{item.description}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.dietary.map((d) => (
                          <Badge key={d} variant="outline" className={`text-xs border-border/50 ${dietaryIcons[d]?.color}`}>
                            {dietaryIcons[d]?.icon}
                            <span className="ml-1">{dietaryIcons[d]?.label}</span>
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {item.prepTime}
                          </span>
                          {item.calories && (
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3" />
                              {item.calories} cal
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {item.calories && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setShowNutrition(showNutrition === item.id ? null : item.id)}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                            onClick={() => quickAddToCart(item)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Nutrition Info Panel */}
                      <AnimatePresence>
                        {showNutrition === item.id && item.calories && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <Separator className="my-3 bg-border/30" />
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div>
                                <p className="text-xs text-muted-foreground">Calories</p>
                                <p className="text-sm font-semibold text-foreground">{item.calories}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Protein</p>
                                <p className="text-sm font-semibold text-foreground">{item.protein || 0}g</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Carbs</p>
                                <p className="text-sm font-semibold text-foreground">{item.carbs || 0}g</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Fat</p>
                                <p className="text-sm font-semibold text-foreground">{item.fat || 0}g</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

      {/* Item Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="glass border-border/30 max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <div className="h-48 -mx-6 -mt-6 mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center rounded-t-lg">
                  <ChefHat className="h-24 w-24 text-primary/40" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl text-foreground">{selectedItem.name}</DialogTitle>
                    <p className="text-muted-foreground text-sm mt-1">{selectedItem.description}</p>
                  </div>
                  <span className="text-xl font-bold text-primary">${selectedItem.price.toFixed(2)}</span>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Dietary badges */}
                {selectedItem.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.dietary.map((d) => (
                      <Badge key={d} variant="outline" className={`border-border/50 ${dietaryIcons[d]?.color}`}>
                        {dietaryIcons[d]?.icon}
                        <span className="ml-1">{dietaryIcons[d]?.label}</span>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Modifiers */}
                {selectedItem.modifiers?.map((group) => (
                  <div key={group.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground font-medium">{group.name}</Label>
                      <span className="text-xs text-muted-foreground">
                        {group.required ? "Required" : "Optional"}
                        {group.maxSelect > 1 && ` • Select up to ${group.maxSelect}`}
                      </span>
                    </div>

                    {group.maxSelect === 1 ? (
                      <RadioGroup
                        value={selectedModifiers[group.name]?.[0] || ""}
                        onValueChange={(value) => toggleModifier(group.name, value, 1)}
                      >
                        {group.options.map((option) => (
                          <div key={option.name} className="flex items-center justify-between glass-dark rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value={option.name} id={`${group.name}-${option.name}`} />
                              <Label htmlFor={`${group.name}-${option.name}`} className="text-foreground cursor-pointer">
                                {option.name}
                              </Label>
                            </div>
                            {option.price > 0 && (
                              <span className="text-sm text-secondary">+${option.price.toFixed(2)}</span>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="space-y-2">
                        {group.options.map((option) => (
                          <div key={option.name} className="flex items-center justify-between glass-dark rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`${group.name}-${option.name}`}
                                checked={selectedModifiers[group.name]?.includes(option.name) || false}
                                onCheckedChange={() => toggleModifier(group.name, option.name, group.maxSelect)}
                              />
                              <Label htmlFor={`${group.name}-${option.name}`} className="text-foreground cursor-pointer">
                                {option.name}
                              </Label>
                            </div>
                            {option.price > 0 && (
                              <span className="text-sm text-secondary">+${option.price.toFixed(2)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Special Instructions */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Special Instructions</Label>
                  <Textarea
                    placeholder="Any allergies or special requests..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="glass border-border/30 resize-none"
                    rows={2}
                  />
                </div>

                {/* Quantity and Add to Cart */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-border/30"
                      onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-semibold text-foreground w-8 text-center">{itemQuantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-border/30"
                      onClick={() => setItemQuantity(itemQuantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                    onClick={addToCart}
                    disabled={selectedItem.modifiers?.some((m) => m.required && !selectedModifiers[m.name]?.length)}
                  >
                    Add ${calculateSubtotal().toFixed(2)}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md glass border-l border-border/30 z-50 flex flex-col"
            >
              <div className="p-4 border-b border-border/30 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Your Order
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground mt-1">Add some delicious items to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <Card key={item.id} className="glass-dark border-border/30 p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                            <ChefHat className="h-8 w-8 text-primary/40" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-foreground truncate">{item.menuItem.name}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mr-2 text-muted-foreground hover:text-red-400"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {item.modifiers.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {item.modifiers.map((m) => m.selection.join(", ")).join(" • ")}
                              </div>
                            )}

                            {item.specialInstructions && (
                              <p className="text-xs text-secondary mt-1 italic">"{item.specialInstructions}"</p>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 border-border/30"
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium text-foreground w-6 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 border-border/30"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="font-semibold text-primary">${item.subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {cart.length > 0 && (
                <div className="p-4 border-t border-border/30 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8.5%)</span>
                      <span className="text-foreground">${(cartTotal * 0.085).toFixed(2)}</span>
                    </div>
                    <Separator className="bg-border/30" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">${(cartTotal * 1.085).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg">
                    Checkout
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-30"
      >
        <ShoppingCart className="h-6 w-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </motion.button>
    </div>
  )
}
