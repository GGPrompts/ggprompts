"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bath,
  Bed,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid,
  Heart,
  Home,
  Mail,
  Map,
  MapPin,
  Phone,
  Ruler,
  Search,
  Share2,
  Shield,
  Star,
  TrendingDown,
  TrendingUp,
  User,
  X,
  GraduationCap,
  Trees,
  Car,
  Footprints,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

// TypeScript Interfaces
interface Property {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  pricePerSqft: number
  beds: number
  baths: number
  sqft: number
  lotSize: string
  yearBuilt: number
  propertyType: "house" | "condo" | "townhouse" | "multi-family"
  status: "for-sale" | "for-rent" | "pending" | "sold"
  photos: string[]
  daysOnMarket: number
  isFavorite: boolean
  coordinates: { lat: number; lng: number }
  description?: string
  features?: string[]
}

interface PriceHistory {
  date: string
  price: number
  event: "listed" | "price-change" | "pending" | "sold"
}

interface NeighborhoodStats {
  walkScore: number
  transitScore: number
  bikeScore: number
  schoolRating: number
  crimeIndex: "low" | "medium" | "high"
  nearbyAmenities: string[]
}

interface FilterState {
  priceRange: [number, number]
  beds: number[]
  baths: number[]
  propertyTypes: string[]
  minSqft: number
  maxSqft: number
  status: string[]
}

// Mock Data
const mockProperties: Property[] = [
  {
    id: "prop-1",
    address: "1234 Maple Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    price: 1250000,
    pricePerSqft: 892,
    beds: 3,
    baths: 2,
    sqft: 1401,
    lotSize: "0.15 acres",
    yearBuilt: 2018,
    propertyType: "house",
    status: "for-sale",
    photos: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
    daysOnMarket: 12,
    isFavorite: true,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    description: "Stunning modern home with open floor plan, chef's kitchen, and private backyard. Recently renovated with high-end finishes throughout.",
    features: ["Central AC", "Hardwood Floors", "Smart Home", "EV Charger", "Solar Panels"],
  },
  {
    id: "prop-2",
    address: "567 Oak Street Unit 4B",
    city: "San Francisco",
    state: "CA",
    zipCode: "94117",
    price: 875000,
    pricePerSqft: 729,
    beds: 2,
    baths: 2,
    sqft: 1200,
    lotSize: "N/A",
    yearBuilt: 2015,
    propertyType: "condo",
    status: "for-sale",
    photos: ["/api/placeholder/800/600", "/api/placeholder/800/600"],
    daysOnMarket: 5,
    isFavorite: false,
    coordinates: { lat: 37.7699, lng: -122.4469 },
    description: "Luxury condo in the heart of the city with stunning views, modern amenities, and walkable to everything.",
    features: ["Doorman", "Gym", "Rooftop", "Parking", "In-unit Laundry"],
  },
  {
    id: "prop-3",
    address: "890 Pine Road",
    city: "Oakland",
    state: "CA",
    zipCode: "94612",
    price: 725000,
    pricePerSqft: 604,
    beds: 4,
    baths: 2.5,
    sqft: 1200,
    lotSize: "0.22 acres",
    yearBuilt: 1965,
    propertyType: "house",
    status: "pending",
    photos: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
    daysOnMarket: 28,
    isFavorite: true,
    coordinates: { lat: 37.8044, lng: -122.2712 },
    description: "Charming mid-century home with original character, updated kitchen and baths, spacious backyard perfect for entertaining.",
    features: ["Fireplace", "Large Yard", "Garage", "Deck", "Updated Kitchen"],
  },
  {
    id: "prop-4",
    address: "222 Cedar Lane #12",
    city: "Berkeley",
    state: "CA",
    zipCode: "94704",
    price: 650000,
    pricePerSqft: 650,
    beds: 2,
    baths: 1,
    sqft: 1000,
    lotSize: "N/A",
    yearBuilt: 2020,
    propertyType: "townhouse",
    status: "for-sale",
    photos: ["/api/placeholder/800/600", "/api/placeholder/800/600"],
    daysOnMarket: 3,
    isFavorite: false,
    coordinates: { lat: 37.8716, lng: -122.2727 },
    description: "Brand new townhouse with modern finishes, private patio, and attached garage. Near UC Berkeley campus.",
    features: ["New Construction", "Patio", "Garage", "A/C", "Quartz Counters"],
  },
  {
    id: "prop-5",
    address: "455 Birch Boulevard",
    city: "San Francisco",
    state: "CA",
    zipCode: "94110",
    price: 2100000,
    pricePerSqft: 1050,
    beds: 5,
    baths: 3.5,
    sqft: 2000,
    lotSize: "0.18 acres",
    yearBuilt: 2022,
    propertyType: "house",
    status: "for-sale",
    photos: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
    daysOnMarket: 7,
    isFavorite: false,
    coordinates: { lat: 37.7489, lng: -122.4180 },
    description: "Newly built luxury home with premium finishes, gourmet kitchen, home office, and landscaped yard.",
    features: ["New Build", "Wine Cellar", "Home Office", "Smart Home", "Designer Kitchen"],
  },
  {
    id: "prop-6",
    address: "789 Elm Court",
    city: "Palo Alto",
    state: "CA",
    zipCode: "94301",
    price: 3500000,
    pricePerSqft: 1400,
    beds: 4,
    baths: 4,
    sqft: 2500,
    lotSize: "0.25 acres",
    yearBuilt: 2019,
    propertyType: "house",
    status: "for-sale",
    photos: ["/api/placeholder/800/600", "/api/placeholder/800/600"],
    daysOnMarket: 21,
    isFavorite: true,
    coordinates: { lat: 37.4419, lng: -122.1430 },
    description: "Stunning Silicon Valley estate with pool, home theater, and guest house. Top-rated schools nearby.",
    features: ["Pool", "Theater", "Guest House", "Solar", "Smart Home"],
  },
]

const mockPriceHistory: PriceHistory[] = [
  { date: "Jan 2023", price: 1350000, event: "listed" },
  { date: "Mar 2023", price: 1300000, event: "price-change" },
  { date: "Jun 2023", price: 1275000, event: "price-change" },
  { date: "Sep 2023", price: 1250000, event: "price-change" },
  { date: "Dec 2023", price: 1250000, event: "pending" },
]

const mockNeighborhoodStats: NeighborhoodStats = {
  walkScore: 92,
  transitScore: 88,
  bikeScore: 85,
  schoolRating: 8,
  crimeIndex: "low",
  nearbyAmenities: ["Grocery Store", "Parks", "Restaurants", "Coffee Shops", "Gym", "Public Transit"],
}

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`
  }
  return `$${price.toLocaleString()}`
}

export default function PropertyListingPage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [viewMode, setViewMode] = useState<"split" | "list" | "map">("split")
  const [listingType, setListingType] = useState<"buy" | "rent">("buy")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [photoIndices, setPhotoIndices] = useState<Record<string, number>>({})
  const [showSaved, setShowSaved] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000000],
    beds: [],
    baths: [],
    propertyTypes: [],
    minSqft: 0,
    maxSqft: 10000,
    status: ["for-sale"],
  })

  const toggleFavorite = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    )
  }

  const nextPhoto = (propertyId: string, totalPhotos: number) => {
    setPhotoIndices((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalPhotos,
    }))
  }

  const prevPhoto = (propertyId: string, totalPhotos: number) => {
    setPhotoIndices((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + totalPhotos) % totalPhotos,
    }))
  }

  const savedProperties = properties.filter((p) => p.isFavorite)

  const getStatusBadge = (status: Property["status"]) => {
    switch (status) {
      case "for-sale":
        return <Badge className="bg-primary/20 text-primary border-primary/30">For Sale</Badge>
      case "for-rent":
        return <Badge className="bg-secondary/20 text-secondary border-secondary/30">For Rent</Badge>
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>
      case "sold":
        return <Badge className="bg-muted text-muted-foreground border-border">Sold</Badge>
      default:
        return null
    }
  }

  const getPropertyTypeIcon = (type: Property["propertyType"]) => {
    switch (type) {
      case "house":
        return <Home className="h-4 w-4" />
      case "condo":
        return <Building className="h-4 w-4" />
      case "townhouse":
        return <Building className="h-4 w-4" />
      case "multi-family":
        return <Building className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  // Property Card Component
  const PropertyCard = ({ property, compact = false }: { property: Property; compact?: boolean }) => {
    const currentPhotoIndex = photoIndices[property.id] || 0

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card
              className={`glass border-border/50 overflow-hidden cursor-pointer ${
                compact ? "flex flex-row" : ""
              }`}
              onClick={() => setSelectedProperty(property)}
            >
              {/* Photo Carousel */}
              <div className={`relative ${compact ? "w-32 h-24 flex-shrink-0" : "aspect-[4/3]"}`}>
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <Home className="h-12 w-12 text-muted-foreground/30" />
                </div>

                {/* Photo Navigation */}
                {property.photos.length > 1 && !compact && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevPhoto(property.id, property.photos.length)
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 text-foreground hover:bg-background z-10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextPhoto(property.id, property.photos.length)
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 text-foreground hover:bg-background z-10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                      {property.photos.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            idx === currentPhotoIndex ? "bg-primary" : "bg-background/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Overlays */}
                <div className="absolute top-2 left-2 z-10">
                  {getStatusBadge(property.status)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(property.id)
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background z-10"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      property.isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
                    }`}
                  />
                </button>
                {property.daysOnMarket <= 7 && (
                  <div className="absolute bottom-2 left-2 z-10">
                    <Badge className="bg-secondary/90 text-secondary-foreground border-0 text-xs">
                      New
                    </Badge>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className={`p-4 ${compact ? "flex-1" : ""}`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xl font-bold text-primary font-mono">
                    {formatPrice(property.price)}
                  </p>
                  {!compact && (
                    <span className="text-xs text-muted-foreground">
                      ${property.pricePerSqft}/sqft
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm text-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    {property.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    {property.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    {property.sqft.toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-foreground font-medium truncate">
                  {property.address}
                </p>
                <p className="text-xs text-muted-foreground">
                  {property.city}, {property.state} {property.zipCode}
                </p>

                {!compact && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {getPropertyTypeIcon(property.propertyType)}
                      {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                    </span>
                    <span>•</span>
                    <span>{property.daysOnMarket} days on market</span>
                  </div>
                )}
              </div>
            </Card>
          </HoverCardTrigger>

          <HoverCardContent className="w-80 glass border-border" side="right">
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-foreground">{property.address}</p>
                <p className="text-sm text-muted-foreground">{property.city}, {property.state}</p>
              </div>
              {property.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {property.description}
                </p>
              )}
              {property.features && (
                <div className="flex flex-wrap gap-1">
                  {property.features.slice(0, 4).map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs border-border text-muted-foreground">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
              <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                View Details
              </Button>
            </div>
          </HoverCardContent>
        </HoverCard>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass border-b border-border"
      >
        <div className="max-w-[1800px] mx-auto p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Logo/Title */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground font-mono">PropertyHub</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 w-full md:max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city, neighborhood, or ZIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Buy/Rent Toggle */}
            <div className="flex items-center gap-2">
              <Tabs value={listingType} onValueChange={(v) => setListingType(v as "buy" | "rent")}>
                <TabsList className="glass border-border">
                  <TabsTrigger value="buy" className="text-xs sm:text-sm">Buy</TabsTrigger>
                  <TabsTrigger value="rent" className="text-xs sm:text-sm">Rent</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Quick Price Select */}
            <div className="hidden lg:flex items-center gap-2">
              {["Any", "$500K", "$750K", "$1M", "$2M+"].map((price) => (
                <Button
                  key={price}
                  variant="outline"
                  size="sm"
                  className="text-xs border-border text-muted-foreground hover:text-foreground hover:border-primary"
                >
                  {price}
                </Button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-border text-foreground"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaved(!showSaved)}
                className="border-border text-foreground relative"
              >
                <Heart className={`h-4 w-4 ${savedProperties.length > 0 ? "text-red-500" : ""}`} />
                {savedProperties.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {savedProperties.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Filter Bar (Collapsible) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {/* Price Range */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Price Range</Label>
                      <div className="px-2">
                        <Slider
                          value={filters.priceRange}
                          min={0}
                          max={5000000}
                          step={50000}
                          onValueChange={(value) =>
                            setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
                          }
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{formatPrice(filters.priceRange[0])}</span>
                          <span>{formatPrice(filters.priceRange[1])}</span>
                        </div>
                      </div>
                    </div>

                    {/* Beds */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Bedrooms</Label>
                      <div className="flex gap-1">
                        {["1+", "2+", "3+", "4+", "5+"].map((bed) => (
                          <Button
                            key={bed}
                            variant="outline"
                            size="sm"
                            className={`flex-1 text-xs border-border ${
                              filters.beds.includes(parseInt(bed))
                                ? "bg-primary text-primary-foreground border-primary"
                                : "text-muted-foreground"
                            }`}
                            onClick={() => {
                              const num = parseInt(bed)
                              setFilters((prev) => ({
                                ...prev,
                                beds: prev.beds.includes(num)
                                  ? prev.beds.filter((b) => b !== num)
                                  : [...prev.beds, num],
                              }))
                            }}
                          >
                            {bed}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Baths */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Bathrooms</Label>
                      <div className="flex gap-1">
                        {["1+", "2+", "3+", "4+"].map((bath) => (
                          <Button
                            key={bath}
                            variant="outline"
                            size="sm"
                            className={`flex-1 text-xs border-border ${
                              filters.baths.includes(parseInt(bath))
                                ? "bg-primary text-primary-foreground border-primary"
                                : "text-muted-foreground"
                            }`}
                            onClick={() => {
                              const num = parseInt(bath)
                              setFilters((prev) => ({
                                ...prev,
                                baths: prev.baths.includes(num)
                                  ? prev.baths.filter((b) => b !== num)
                                  : [...prev.baths, num],
                              }))
                            }}
                          >
                            {bath}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Property Type */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Property Type</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "house", label: "House" },
                          { value: "condo", label: "Condo" },
                          { value: "townhouse", label: "Townhouse" },
                        ].map((type) => (
                          <div key={type.value} className="flex items-center gap-1.5">
                            <Checkbox
                              id={type.value}
                              checked={filters.propertyTypes.includes(type.value)}
                              onCheckedChange={(checked) => {
                                setFilters((prev) => ({
                                  ...prev,
                                  propertyTypes: checked
                                    ? [...prev.propertyTypes, type.value]
                                    : prev.propertyTypes.filter((t) => t !== type.value),
                                }))
                              }}
                            />
                            <Label htmlFor={type.value} className="text-xs text-foreground">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Square Footage */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Square Feet</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.minSqft || ""}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, minSqft: parseInt(e.target.value) || 0 }))
                          }
                          className="w-full bg-background/50 border-border text-foreground text-xs"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.maxSqft || ""}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, maxSqft: parseInt(e.target.value) || 10000 }))
                          }
                          className="w-full bg-background/50 border-border text-foreground text-xs"
                        />
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFilters({
                            priceRange: [0, 5000000],
                            beds: [],
                            baths: [],
                            propertyTypes: [],
                            minSqft: 0,
                            maxSqft: 10000,
                            status: ["for-sale"],
                          })
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* View Mode Toggle (Mobile) */}
      <div className="md:hidden p-4 flex justify-center gap-2">
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
          className={viewMode === "list" ? "bg-primary text-primary-foreground" : "border-border text-foreground"}
        >
          <Grid className="h-4 w-4 mr-2" />
          List
        </Button>
        <Button
          variant={viewMode === "map" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("map")}
          className={viewMode === "map" ? "bg-primary text-primary-foreground" : "border-border text-foreground"}
        >
          <Map className="h-4 w-4 mr-2" />
          Map
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto p-4">
        <div className={`flex flex-col md:flex-row gap-4 ${viewMode === "map" && "md:flex-row-reverse"}`}>
          {/* Map View */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${
              viewMode === "list" ? "hidden md:block" : ""
            } ${viewMode === "map" ? "w-full" : "w-full md:w-2/5"} ${
              viewMode === "split" ? "hidden md:block md:w-2/5" : ""
            }`}
          >
            <Card className="glass border-border h-[300px] md:h-[calc(100vh-200px)] md:sticky md:top-32 overflow-hidden">
              <div className="relative w-full h-full bg-muted flex items-center justify-center">
                {/* Mock Map */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <div className="relative z-10 text-center p-4">
                  <Map className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-sm">Interactive Map View</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">
                    {properties.length} properties in this area
                  </p>
                </div>

                {/* Property Markers */}
                {properties.slice(0, 6).map((property, idx) => (
                  <motion.div
                    key={property.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${20 + (idx % 3) * 25}%`,
                      top: `${25 + Math.floor(idx / 3) * 30}%`,
                    }}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-mono font-bold shadow-lg ${
                        property.isFavorite
                          ? "bg-red-500 text-white"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {formatPrice(property.price)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Property Grid */}
          <div
            className={`${
              viewMode === "map" ? "hidden md:block" : ""
            } ${viewMode === "list" ? "w-full" : "w-full md:w-3/5"} ${
              viewMode === "split" ? "w-full md:w-3/5" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-semibold">{properties.length}</span> properties found
              </p>
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={viewMode === "split" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("split")}
                  className={viewMode === "split" ? "bg-primary text-primary-foreground" : "border-border text-foreground"}
                >
                  Split View
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-primary text-primary-foreground" : "border-border text-foreground"}
                >
                  List Only
                </Button>
              </div>
            </div>

            <div className={`grid gap-4 ${viewMode === "list" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 lg:grid-cols-2"}`}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Properties Sidebar */}
      <AnimatePresence>
        {showSaved && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setShowSaved(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md glass border-l border-border z-50"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Saved Properties ({savedProperties.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSaved(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-120px)]">
                  <div className="space-y-4 pr-4">
                    {savedProperties.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No saved properties yet</p>
                        <p className="text-muted-foreground/60 text-sm mt-1">
                          Click the heart icon to save properties
                        </p>
                      </div>
                    ) : (
                      savedProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} compact />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setSelectedProperty(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 glass border-border rounded-xl z-50 overflow-hidden"
            >
              <ScrollArea className="h-full">
                <div className="p-4 md:p-8">
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedProperty(null)}
                    className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Photos & Details */}
                    <div className="space-y-6">
                      {/* Main Photo */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Home className="h-24 w-24 text-muted-foreground/20" />
                        </div>
                        <div className="absolute top-4 left-4">
                          {getStatusBadge(selectedProperty.status)}
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => toggleFavorite(selectedProperty.id)}
                            className="bg-background/80 hover:bg-background"
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                selectedProperty.isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
                              }`}
                            />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="bg-background/80 hover:bg-background"
                          >
                            <Share2 className="h-4 w-4 text-foreground" />
                          </Button>
                        </div>
                      </div>

                      {/* Photo Thumbnails */}
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-lg bg-muted flex items-center justify-center cursor-pointer hover:ring-2 ring-primary"
                          >
                            <Home className="h-6 w-6 text-muted-foreground/20" />
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      {selectedProperty.description && (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">About this property</h3>
                          <p className="text-muted-foreground">{selectedProperty.description}</p>
                        </div>
                      )}

                      {/* Features */}
                      {selectedProperty.features && (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3">Features</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProperty.features.map((feature) => (
                              <Badge
                                key={feature}
                                variant="outline"
                                className="border-border text-muted-foreground"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price History Chart */}
                      <Card className="glass-dark border-border p-4">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Price History</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={mockPriceHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                              dataKey="date"
                              stroke="hsl(var(--muted-foreground))"
                              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                              tickFormatter={(value) => formatPrice(value)}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--popover))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                color: "hsl(var(--popover-foreground))",
                              }}
                              formatter={(value: number) => [formatPrice(value), "Price"]}
                            />
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              dot={{ fill: "hsl(var(--primary))" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="flex items-center gap-4 mt-4 text-sm">
                          <div className="flex items-center gap-1 text-primary">
                            <TrendingDown className="h-4 w-4" />
                            <span>-7.4% since listing</span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Right Column - Info & Contact */}
                    <div className="space-y-6">
                      {/* Header */}
                      <div>
                        <p className="text-3xl font-bold text-primary font-mono mb-2">
                          {formatPrice(selectedProperty.price)}
                        </p>
                        <h2 className="text-xl font-semibold text-foreground">
                          {selectedProperty.address}
                        </h2>
                        <p className="text-muted-foreground">
                          {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}
                        </p>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                          <Bed className="h-5 w-5 mx-auto text-primary mb-1" />
                          <p className="text-lg font-bold text-foreground">{selectedProperty.beds}</p>
                          <p className="text-xs text-muted-foreground">Beds</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                          <Bath className="h-5 w-5 mx-auto text-secondary mb-1" />
                          <p className="text-lg font-bold text-foreground">{selectedProperty.baths}</p>
                          <p className="text-xs text-muted-foreground">Baths</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                          <Ruler className="h-5 w-5 mx-auto text-primary mb-1" />
                          <p className="text-lg font-bold text-foreground">{selectedProperty.sqft.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Sqft</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                          <Calendar className="h-5 w-5 mx-auto text-secondary mb-1" />
                          <p className="text-lg font-bold text-foreground">{selectedProperty.yearBuilt}</p>
                          <p className="text-xs text-muted-foreground">Built</p>
                        </div>
                      </div>

                      {/* Property Details */}
                      <Card className="glass-dark border-border p-4">
                        <h3 className="font-semibold text-foreground mb-3">Property Details</h3>
                        <div className="grid grid-cols-2 gap-y-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Property Type</p>
                            <p className="text-foreground capitalize">{selectedProperty.propertyType}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Lot Size</p>
                            <p className="text-foreground">{selectedProperty.lotSize}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Price per Sqft</p>
                            <p className="text-foreground">${selectedProperty.pricePerSqft}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Days on Market</p>
                            <p className="text-foreground">{selectedProperty.daysOnMarket} days</p>
                          </div>
                        </div>
                      </Card>

                      {/* Neighborhood Stats */}
                      <Card className="glass-dark border-border p-4">
                        <h3 className="font-semibold text-foreground mb-4">Neighborhood</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Footprints className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-foreground">{mockNeighborhoodStats.walkScore}</p>
                              <p className="text-xs text-muted-foreground">Walk Score</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-secondary/10">
                              <Car className="h-4 w-4 text-secondary" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-foreground">{mockNeighborhoodStats.transitScore}</p>
                              <p className="text-xs text-muted-foreground">Transit Score</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <GraduationCap className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-foreground">{mockNeighborhoodStats.schoolRating}/10</p>
                              <p className="text-xs text-muted-foreground">Schools</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-secondary/10">
                              <Shield className="h-4 w-4 text-secondary" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-foreground capitalize">{mockNeighborhoodStats.crimeIndex}</p>
                              <p className="text-xs text-muted-foreground">Crime</p>
                            </div>
                          </div>
                        </div>
                        <Separator className="my-4 bg-border" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Nearby</p>
                          <div className="flex flex-wrap gap-1">
                            {mockNeighborhoodStats.nearbyAmenities.map((amenity) => (
                              <Badge
                                key={amenity}
                                variant="outline"
                                className="text-xs border-border text-muted-foreground"
                              >
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>

                      {/* Agent Contact */}
                      <Card className="glass border-primary/30 p-4">
                        <h3 className="font-semibold text-foreground mb-4">Contact Agent</h3>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Sarah Johnson</p>
                            <p className="text-sm text-muted-foreground">Premier Real Estate Group</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Tour
                          </Button>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="border-border text-foreground">
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                            <Button variant="outline" className="border-border text-foreground">
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Similar Properties */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Similar Properties</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {properties
                        .filter((p) => p.id !== selectedProperty.id)
                        .slice(0, 4)
                        .map((property) => (
                          <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
