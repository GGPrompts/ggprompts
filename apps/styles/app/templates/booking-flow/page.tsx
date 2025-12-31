"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Bed,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Coffee,
  CreditCard,
  Gift,
  Globe,
  Heart,
  Info,
  Loader2,
  Mail,
  MapPin,
  Moon,
  Phone,
  Shield,
  Sparkles,
  Star,
  User,
  Users,
  Utensils,
  Wifi,
  Wine,
  X,
} from "lucide-react"
import { Card, Button, Badge, Input, Label, Checkbox, RadioGroup, RadioGroupItem, Separator, Progress, ScrollArea } from "@ggprompts/ui"

// TypeScript Interfaces
interface Hotel {
  id: string
  name: string
  rating: number
  reviewCount: number
  address: string
  city: string
  photos: string[]
  amenities: string[]
  checkInTime: string
  checkOutTime: string
  description: string
}

interface RoomType {
  id: string
  name: string
  description: string
  maxGuests: number
  beds: string
  sqft: number
  amenities: string[]
  pricePerNight: number
  available: number
  popular?: boolean
}

interface AddOn {
  id: string
  name: string
  description: string
  price: number
  priceType: "per_night" | "one_time" | "per_person"
  icon: React.ElementType
}

interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests: string
}

interface BookingDetails {
  checkIn: string
  checkOut: string
  nights: number
  room: RoomType | null
  guests: { adults: number; children: number }
  addOns: string[]
  guestInfo: GuestInfo
}

// Mock Data
const hotel: Hotel = {
  id: "hotel-1",
  name: "The Grand Horizon Resort & Spa",
  rating: 4.8,
  reviewCount: 2847,
  address: "1234 Oceanfront Boulevard",
  city: "Malibu, California",
  photos: ["/hotel-1.jpg", "/hotel-2.jpg", "/hotel-3.jpg"],
  amenities: ["Pool", "Spa", "Restaurant", "Bar", "Gym", "Beach Access", "Free WiFi", "Concierge"],
  checkInTime: "3:00 PM",
  checkOutTime: "11:00 AM",
  description: "Experience luxury beachfront living with panoramic ocean views, world-class dining, and award-winning spa services.",
}

const roomTypes: RoomType[] = [
  {
    id: "room-deluxe",
    name: "Deluxe Ocean View",
    description: "Spacious room with stunning ocean views, private balcony, and premium amenities.",
    maxGuests: 2,
    beds: "1 King Bed",
    sqft: 450,
    amenities: ["Ocean View", "Balcony", "Mini Bar", "Smart TV", "Rain Shower"],
    pricePerNight: 349,
    available: 5,
    popular: true,
  },
  {
    id: "room-suite",
    name: "Executive Suite",
    description: "Luxurious suite with separate living area, panoramic views, and exclusive lounge access.",
    maxGuests: 3,
    beds: "1 King Bed + Sofa Bed",
    sqft: 750,
    amenities: ["Panoramic View", "Living Room", "Lounge Access", "Butler Service", "Jacuzzi Tub"],
    pricePerNight: 599,
    available: 3,
  },
  {
    id: "room-family",
    name: "Family Ocean Suite",
    description: "Perfect for families with connecting rooms, kids area, and family-friendly amenities.",
    maxGuests: 5,
    beds: "2 Queen Beds",
    sqft: 850,
    amenities: ["Connected Rooms", "Kids Corner", "Game Console", "Extra Bathroom", "Ocean View"],
    pricePerNight: 699,
    available: 2,
  },
  {
    id: "room-penthouse",
    name: "Penthouse Collection",
    description: "The ultimate luxury experience with private terrace, personal chef, and 24/7 concierge.",
    maxGuests: 4,
    beds: "1 King Bed + 2 Singles",
    sqft: 1500,
    amenities: ["Private Terrace", "Personal Chef", "Hot Tub", "Private Pool", "Helicopter Pad"],
    pricePerNight: 1299,
    available: 1,
  },
]

const addOns: AddOn[] = [
  {
    id: "breakfast",
    name: "Breakfast Buffet",
    description: "Full breakfast buffet at our oceanfront restaurant",
    price: 45,
    priceType: "per_person",
    icon: Coffee,
  },
  {
    id: "parking",
    name: "Valet Parking",
    description: "Premium valet parking with 24/7 access",
    price: 35,
    priceType: "per_night",
    icon: Car,
  },
  {
    id: "late-checkout",
    name: "Late Checkout",
    description: "Extend your stay until 3:00 PM",
    price: 75,
    priceType: "one_time",
    icon: Clock,
  },
  {
    id: "spa-credit",
    name: "Spa Credit",
    description: "$100 credit for spa treatments",
    price: 85,
    priceType: "one_time",
    icon: Sparkles,
  },
  {
    id: "romantic",
    name: "Romance Package",
    description: "Champagne, roses, and chocolates in room",
    price: 150,
    priceType: "one_time",
    icon: Heart,
  },
  {
    id: "dining-credit",
    name: "Dining Credit",
    description: "$150 credit at any hotel restaurant",
    price: 125,
    priceType: "one_time",
    icon: Utensils,
  },
]

const STEPS = [
  { id: 1, label: "Dates", icon: Calendar },
  { id: 2, label: "Room", icon: Bed },
  { id: 3, label: "Extras", icon: Gift },
  { id: 4, label: "Details", icon: User },
  { id: 5, label: "Payment", icon: CreditCard },
  { id: 6, label: "Confirm", icon: CheckCircle2 },
]

export default function BookingFlowPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [showMobileSummary, setShowMobileSummary] = useState(false)

  // Booking state
  const [booking, setBooking] = useState<BookingDetails>({
    checkIn: "",
    checkOut: "",
    nights: 0,
    room: null,
    guests: { adults: 2, children: 0 },
    addOns: [],
    guestInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  })

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  // Calculate nights from dates
  const calculateNights = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = end.getTime() - start.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  // Update nights when dates change
  const handleDateChange = (field: "checkIn" | "checkOut", value: string) => {
    const newBooking = { ...booking, [field]: value }
    newBooking.nights = calculateNights(
      field === "checkIn" ? value : booking.checkIn,
      field === "checkOut" ? value : booking.checkOut
    )
    setBooking(newBooking)
  }

  // Calculate total price
  const priceBreakdown = useMemo(() => {
    const roomTotal = booking.room ? booking.room.pricePerNight * booking.nights : 0

    let addOnsTotal = 0
    booking.addOns.forEach((addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      if (addOn) {
        switch (addOn.priceType) {
          case "per_night":
            addOnsTotal += addOn.price * booking.nights
            break
          case "per_person":
            addOnsTotal += addOn.price * (booking.guests.adults + booking.guests.children) * booking.nights
            break
          case "one_time":
            addOnsTotal += addOn.price
            break
        }
      }
    })

    const subtotal = roomTotal + addOnsTotal
    const taxes = subtotal * 0.12
    const fees = 35 // Resort fee
    const total = subtotal + taxes + fees

    return {
      roomTotal,
      addOnsTotal,
      subtotal,
      taxes,
      fees,
      total,
    }
  }, [booking])

  // Navigation
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return booking.nights >= 1
      case 2:
        return booking.room !== null
      case 3:
        return true // Add-ons are optional
      case 4:
        return !!(
          booking.guestInfo.firstName &&
          booking.guestInfo.lastName &&
          booking.guestInfo.email &&
          booking.guestInfo.phone
        )
      case 5:
        return !!(cardDetails.number && cardDetails.expiry && cardDetails.cvv && cardDetails.name)
      default:
        return true
    }
  }

  const handleNext = async () => {
    if (currentStep === 5) {
      // Process payment
      setIsProcessing(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsProcessing(false)
      setBookingReference(`GHR-${Date.now().toString(36).toUpperCase()}`)
      setBookingComplete(true)
      setCurrentStep(6)
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 6))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    )
  }

  // Get minimum check-in date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  // Get minimum check-out date (day after check-in)
  const getMinCheckoutDate = () => {
    if (!booking.checkIn) return getMinDate()
    const checkIn = new Date(booking.checkIn)
    checkIn.setDate(checkIn.getDate() + 1)
    return checkIn.toISOString().split("T")[0]
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Property Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="glass border-primary/30 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Hotel Image Placeholder */}
              <div className="w-full md:w-32 h-24 md:h-24 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                <Globe className="h-10 w-10 text-primary/50" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
                    {hotel.name}
                  </h1>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {hotel.rating} {renderStars(hotel.rating)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{hotel.address}, {hotel.city}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, 5).map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="outline"
                      className="text-xs border-border text-muted-foreground"
                    >
                      {amenity}
                    </Badge>
                  ))}
                  {hotel.amenities.length > 5 && (
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                      +{hotel.amenities.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-1 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Check-in: {hotel.checkInTime}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Check-out: {hotel.checkOutTime}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Progress Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="glass border-primary/30 p-4 md:p-6">
            {/* Desktop Stepper */}
            <div className="hidden md:flex items-center justify-between">
              {STEPS.map((step, idx) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isComplete = step.id < currentStep || bookingComplete

                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          isComplete
                            ? "bg-primary text-primary-foreground border-primary"
                            : isActive
                            ? "border-primary text-primary bg-primary/10"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {isComplete ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isActive ? "text-primary" : isComplete ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {idx < STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 mx-4">
                        <div
                          className={`h-full transition-all ${
                            step.id < currentStep ? "bg-primary" : "bg-border"
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>

            {/* Mobile Stepper */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {STEPS.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {STEPS[currentStep - 1].label}
                </span>
              </div>
              <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Step Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {/* Step 1: Date Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="dates"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass border-primary/30 p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Select Your Dates
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="checkin" className="text-foreground">Check-in Date</Label>
                        <Input
                          id="checkin"
                          type="date"
                          min={getMinDate()}
                          value={booking.checkIn}
                          onChange={(e) => handleDateChange("checkIn", e.target.value)}
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout" className="text-foreground">Check-out Date</Label>
                        <Input
                          id="checkout"
                          type="date"
                          min={getMinCheckoutDate()}
                          value={booking.checkOut}
                          onChange={(e) => handleDateChange("checkOut", e.target.value)}
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    {booking.nights > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-dark border-primary/20 rounded-lg p-4 mb-6"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="text-xl font-bold text-primary">
                            {booking.nights} {booking.nights === 1 ? "Night" : "Nights"}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    <Separator className="bg-border/50 my-6" />

                    <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-secondary" />
                      Guests
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Adults</Label>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setBooking((prev) => ({
                                ...prev,
                                guests: { ...prev.guests, adults: Math.max(1, prev.guests.adults - 1) },
                              }))
                            }
                            disabled={booking.guests.adults <= 1}
                            className="border-border"
                          >
                            <span className="text-lg">-</span>
                          </Button>
                          <span className="text-xl font-semibold text-foreground w-8 text-center">
                            {booking.guests.adults}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setBooking((prev) => ({
                                ...prev,
                                guests: { ...prev.guests, adults: Math.min(6, prev.guests.adults + 1) },
                              }))
                            }
                            disabled={booking.guests.adults >= 6}
                            className="border-border"
                          >
                            <span className="text-lg">+</span>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Children</Label>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setBooking((prev) => ({
                                ...prev,
                                guests: { ...prev.guests, children: Math.max(0, prev.guests.children - 1) },
                              }))
                            }
                            disabled={booking.guests.children <= 0}
                            className="border-border"
                          >
                            <span className="text-lg">-</span>
                          </Button>
                          <span className="text-xl font-semibold text-foreground w-8 text-center">
                            {booking.guests.children}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setBooking((prev) => ({
                                ...prev,
                                guests: { ...prev.guests, children: Math.min(4, prev.guests.children + 1) },
                              }))
                            }
                            disabled={booking.guests.children >= 4}
                            className="border-border"
                          >
                            <span className="text-lg">+</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Room Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="room"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass border-primary/30 p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Bed className="h-5 w-5 text-primary" />
                      Choose Your Room
                    </h2>

                    <div className="space-y-4">
                      {roomTypes.map((room) => {
                        const isSelected = booking.room?.id === room.id
                        const canAccommodate = room.maxGuests >= booking.guests.adults + booking.guests.children

                        return (
                          <motion.div
                            key={room.id}
                            whileHover={{ scale: canAccommodate ? 1.01 : 1 }}
                            className={`glass-dark rounded-lg p-4 md:p-5 border-2 transition-all cursor-pointer ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : canAccommodate
                                ? "border-border hover:border-primary/50"
                                : "border-border/50 opacity-60"
                            }`}
                            onClick={() => canAccommodate && setBooking((prev) => ({ ...prev, room }))}
                          >
                            <div className="flex flex-col md:flex-row gap-4">
                              {/* Room Image Placeholder */}
                              <div className="w-full md:w-40 h-32 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center flex-shrink-0">
                                <Bed className="h-10 w-10 text-secondary/50" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
                                    {room.popular && (
                                      <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                                        Popular
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">
                                      ${room.pricePerNight}
                                    </p>
                                    <p className="text-xs text-muted-foreground">per night</p>
                                  </div>
                                </div>

                                <p className="text-sm text-muted-foreground mb-3">{room.description}</p>

                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    Up to {room.maxGuests} guests
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Bed className="h-4 w-4" />
                                    {room.beds}
                                  </span>
                                  <span>{room.sqft} sq ft</span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {room.amenities.map((amenity) => (
                                    <Badge
                                      key={amenity}
                                      variant="outline"
                                      className="text-xs border-border text-muted-foreground"
                                    >
                                      {amenity}
                                    </Badge>
                                  ))}
                                </div>

                                {!canAccommodate && (
                                  <p className="text-sm text-destructive mt-3">
                                    Room cannot accommodate {booking.guests.adults + booking.guests.children} guests
                                  </p>
                                )}
                              </div>

                              {/* Selection indicator */}
                              <div className="flex items-center md:self-center">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "border-primary bg-primary"
                                      : "border-border"
                                  }`}
                                >
                                  {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Add-ons */}
              {currentStep === 3 && (
                <motion.div
                  key="extras"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass border-primary/30 p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      Enhance Your Stay
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      Add extras to make your trip even more special
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {addOns.map((addOn) => {
                        const isSelected = booking.addOns.includes(addOn.id)
                        const Icon = addOn.icon

                        const getPriceLabel = () => {
                          switch (addOn.priceType) {
                            case "per_night":
                              return `$${addOn.price}/night`
                            case "per_person":
                              return `$${addOn.price}/person/night`
                            case "one_time":
                              return `$${addOn.price} total`
                          }
                        }

                        return (
                          <motion.div
                            key={addOn.id}
                            whileHover={{ scale: 1.02 }}
                            className={`glass-dark rounded-lg p-4 border-2 transition-all cursor-pointer ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() =>
                              setBooking((prev) => ({
                                ...prev,
                                addOns: isSelected
                                  ? prev.addOns.filter((id) => id !== addOn.id)
                                  : [...prev.addOns, addOn.id],
                              }))
                            }
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  isSelected ? "bg-primary/20" : "bg-muted"
                                }`}
                              >
                                <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h3 className="font-medium text-foreground">{addOn.name}</h3>
                                  <Checkbox checked={isSelected} className="border-border" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{addOn.description}</p>
                                <p className="text-sm font-semibold text-primary">{getPriceLabel()}</p>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 4: Guest Details */}
              {currentStep === 4 && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass border-primary/30 p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Guest Information
                    </h2>

                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-foreground">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={booking.guestInfo.firstName}
                            onChange={(e) =>
                              setBooking((prev) => ({
                                ...prev,
                                guestInfo: { ...prev.guestInfo, firstName: e.target.value },
                              }))
                            }
                            className="bg-background border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-foreground">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={booking.guestInfo.lastName}
                            onChange={(e) =>
                              setBooking((prev) => ({
                                ...prev,
                                guestInfo: { ...prev.guestInfo, lastName: e.target.value },
                              }))
                            }
                            className="bg-background border-border"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              value={booking.guestInfo.email}
                              onChange={(e) =>
                                setBooking((prev) => ({
                                  ...prev,
                                  guestInfo: { ...prev.guestInfo, email: e.target.value },
                                }))
                              }
                              className="bg-background border-border pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              value={booking.guestInfo.phone}
                              onChange={(e) =>
                                setBooking((prev) => ({
                                  ...prev,
                                  guestInfo: { ...prev.guestInfo, phone: e.target.value },
                                }))
                              }
                              className="bg-background border-border pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="requests" className="text-foreground">Special Requests</Label>
                        <textarea
                          id="requests"
                          placeholder="Any special requests or preferences? (e.g., high floor, quiet room, dietary requirements)"
                          value={booking.guestInfo.specialRequests}
                          onChange={(e) =>
                            setBooking((prev) => ({
                              ...prev,
                              guestInfo: { ...prev.guestInfo, specialRequests: e.target.value },
                            }))
                          }
                          className="w-full min-h-[100px] px-3 py-2 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Special requests cannot be guaranteed but we will do our best to accommodate them.
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 5: Payment */}
              {currentStep === 5 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass border-primary/30 p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Details
                    </h2>

                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <Label className="text-foreground mb-3 block">Payment Method</Label>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3"
                      >
                        <div className={`glass-dark rounded-lg p-4 border-2 cursor-pointer ${paymentMethod === "card" ? "border-primary" : "border-border"}`}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="cursor-pointer flex items-center gap-2 text-foreground">
                              <CreditCard className="h-4 w-4" />
                              Credit Card
                            </Label>
                          </div>
                        </div>
                        <div className={`glass-dark rounded-lg p-4 border-2 cursor-pointer ${paymentMethod === "paypal" ? "border-primary" : "border-border"}`}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal" className="cursor-pointer flex items-center gap-2 text-foreground">
                              <Globe className="h-4 w-4" />
                              PayPal
                            </Label>
                          </div>
                        </div>
                        <div className={`glass-dark rounded-lg p-4 border-2 cursor-pointer ${paymentMethod === "apple" ? "border-primary" : "border-border"}`}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="apple" id="apple" />
                            <Label htmlFor="apple" className="cursor-pointer flex items-center gap-2 text-foreground">
                              <Phone className="h-4 w-4" />
                              Apple Pay
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName" className="text-foreground">Name on Card *</Label>
                          <Input
                            id="cardName"
                            placeholder="JOHN DOE"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))}
                            className="bg-background border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber" className="text-foreground">Card Number *</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardDetails.number}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 16)
                                const formatted = value.replace(/(\d{4})/g, "$1 ").trim()
                                setCardDetails((prev) => ({ ...prev, number: formatted }))
                              }}
                              className="bg-background border-border pl-10"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry" className="text-foreground">Expiry Date *</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "").slice(0, 4)
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + "/" + value.slice(2)
                                }
                                setCardDetails((prev) => ({ ...prev, expiry: value }))
                              }}
                              className="bg-background border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv" className="text-foreground">CVV *</Label>
                            <Input
                              id="cvv"
                              type="password"
                              placeholder="***"
                              maxLength={4}
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                              className="bg-background border-border"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod !== "card" && (
                      <div className="glass-dark rounded-lg p-6 text-center">
                        <Globe className="h-12 w-12 mx-auto text-primary/50 mb-3" />
                        <p className="text-muted-foreground">
                          You will be redirected to {paymentMethod === "paypal" ? "PayPal" : "Apple Pay"} to complete your payment.
                        </p>
                      </div>
                    )}

                    <Separator className="bg-border/50 my-6" />

                    {/* Security Notice */}
                    <div className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p>
                        Your payment information is encrypted and secure. We never store your full card details.
                      </p>
                    </div>
                  </Card>

                  {/* Cancellation Policy */}
                  <Card className="glass border-secondary/30 p-4 md:p-6 mt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Info className="h-5 w-5 text-secondary" />
                      Cancellation Policy
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground font-medium">Free cancellation until 48 hours before check-in</p>
                          <p className="text-sm text-muted-foreground">Full refund if cancelled before this time</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground font-medium">50% refund for late cancellation</p>
                          <p className="text-sm text-muted-foreground">If cancelled within 48 hours of check-in</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <X className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground font-medium">No refund for no-shows</p>
                          <p className="text-sm text-muted-foreground">Full charge applies if you don&apos;t show up</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 6: Confirmation */}
              {currentStep === 6 && bookingComplete && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="glass border-primary/30 p-6 md:p-8">
                    {/* Success Animation */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center mb-8"
                    >
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        Booking Confirmed!
                      </h2>
                      <p className="text-muted-foreground">
                        Your reservation has been successfully completed
                      </p>
                    </motion.div>

                    {/* Booking Reference */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="glass-dark rounded-lg p-6 mb-6"
                    >
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Confirmation Number</p>
                        <p className="text-3xl font-mono font-bold text-primary tracking-wider">
                          {bookingReference}
                        </p>
                      </div>
                    </motion.div>

                    {/* Booking Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-4"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="glass-dark rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Check-in</span>
                          </div>
                          <p className="text-foreground font-medium">
                            {new Date(booking.checkIn).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">After {hotel.checkInTime}</p>
                        </div>
                        <div className="glass-dark rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-secondary" />
                            <span className="text-sm text-muted-foreground">Check-out</span>
                          </div>
                          <p className="text-foreground font-medium">
                            {new Date(booking.checkOut).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">Before {hotel.checkOutTime}</p>
                        </div>
                      </div>

                      <div className="glass-dark rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Bed className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Room</span>
                        </div>
                        <p className="text-foreground font-medium">{booking.room?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.guests.adults} {booking.guests.adults === 1 ? "Adult" : "Adults"}
                          {booking.guests.children > 0 && `, ${booking.guests.children} ${booking.guests.children === 1 ? "Child" : "Children"}`}
                        </p>
                      </div>

                      <div className="glass-dark rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Guest</span>
                        </div>
                        <p className="text-foreground font-medium">
                          {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{booking.guestInfo.email}</p>
                      </div>

                      <Separator className="bg-border/50" />

                      <div className="flex items-center justify-between text-xl font-bold">
                        <span className="text-foreground">Total Paid</span>
                        <span className="text-primary">${priceBreakdown.total.toFixed(2)}</span>
                      </div>
                    </motion.div>

                    {/* Email Notice */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 flex items-center gap-3 text-sm text-muted-foreground glass-dark rounded-lg p-4"
                    >
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <p>
                        A confirmation email has been sent to{" "}
                        <span className="text-foreground font-medium">{booking.guestInfo.email}</span>
                      </p>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-8 flex flex-col sm:flex-row gap-3"
                    >
                      <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                        Download Confirmation
                      </Button>
                      <Button variant="outline" className="flex-1 border-border text-foreground">
                        Add to Calendar
                      </Button>
                    </motion.div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep < 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-between gap-3 mt-6"
              >
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="border-border text-foreground order-2 sm:order-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isProcessing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground order-1 sm:order-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : currentStep === 5 ? (
                    <>
                      Complete Booking
                      <CheckCircle2 className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          {/* Right Column - Price Summary (Desktop Sticky) */}
          {currentStep < 6 && (
            <div className="lg:w-96">
              {/* Mobile Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowMobileSummary(!showMobileSummary)}
                  className="w-full border-primary text-primary justify-between"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Price Summary
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-bold">${priceBreakdown.total.toFixed(2)}</span>
                    {showMobileSummary ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                </Button>
              </div>

              {/* Summary Card */}
              <AnimatePresence>
                {(showMobileSummary || typeof window !== "undefined" && window.innerWidth >= 1024) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:sticky lg:top-8"
                  >
                    <Card className="glass border-primary/30 p-4 md:p-6 block">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Price Summary
                      </h3>

                      {/* Selected Room */}
                      {booking.room && (
                        <div className="glass-dark rounded-lg p-4 mb-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="font-medium text-foreground">{booking.room.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.nights} {booking.nights === 1 ? "night" : "nights"}
                              </p>
                            </div>
                            <p className="text-primary font-semibold">
                              ${priceBreakdown.roomTotal.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ${booking.room.pricePerNight}/night
                          </p>
                        </div>
                      )}

                      {/* Add-ons */}
                      {booking.addOns.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium text-muted-foreground">Add-ons</p>
                          {booking.addOns.map((addOnId) => {
                            const addOn = addOns.find((a) => a.id === addOnId)
                            if (!addOn) return null

                            let addOnPrice = 0
                            switch (addOn.priceType) {
                              case "per_night":
                                addOnPrice = addOn.price * booking.nights
                                break
                              case "per_person":
                                addOnPrice = addOn.price * (booking.guests.adults + booking.guests.children) * booking.nights
                                break
                              case "one_time":
                                addOnPrice = addOn.price
                                break
                            }

                            return (
                              <div key={addOn.id} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{addOn.name}</span>
                                <span className="text-foreground">${addOnPrice.toFixed(2)}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      <Separator className="bg-border/50 my-4" />

                      {/* Breakdown */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="text-foreground">${priceBreakdown.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Taxes & Fees (12%)</span>
                          <span className="text-foreground">${priceBreakdown.taxes.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Resort Fee</span>
                          <span className="text-foreground">${priceBreakdown.fees.toFixed(2)}</span>
                        </div>
                      </div>

                      <Separator className="bg-border/50 my-4" />

                      {/* Total */}
                      <motion.div
                        key={priceBreakdown.total}
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-between"
                      >
                        <span className="text-lg font-semibold text-foreground">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          ${priceBreakdown.total.toFixed(2)}
                        </span>
                      </motion.div>

                      {/* Dates Summary */}
                      {booking.checkIn && booking.checkOut && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Check-in</span>
                            <span className="text-foreground">
                              {new Date(booking.checkIn).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Check-out</span>
                            <span className="text-foreground">
                              {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Free Cancellation Badge */}
                      <div className="mt-4 flex items-center gap-2 text-xs text-primary">
                        <Shield className="h-4 w-4" />
                        <span>Free cancellation until 48 hours before check-in</span>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
