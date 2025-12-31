"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Ticket,
  Plus,
  Minus,
  ShoppingCart,
  Users,
  UtensilsCrossed,
  ShoppingBag,
  AlertTriangle,
  Heart,
  Shield,
  Send,
  Download,
  QrCode,
  CheckCircle2,
  PartyPopper,
  Sparkles,
  Building,
  Globe,
  MessageSquare,
  FileText,
  Share2,
  Calendar as CalendarIcon,
  UserCircle,
  Briefcase,
  Star,
  Gift,
  Tag,
  DollarSign,
  ArrowRight,
  Info,
  Users2,
  Utensils,
  Zap,
  Save,
  GraduationCap,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, Button, Input, Label, Switch, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, RadioGroup, RadioGroupItem, Checkbox, Badge, Separator, ScrollArea, Progress, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ggprompts/ui"

// Ticket types
const ticketTypes = [
  {
    id: "general",
    name: "General Admission",
    description: "Access to main event and general seating",
    price: 99,
    features: ["Event access", "General seating", "Digital program", "Networking session"],
    available: 150,
    icon: Ticket,
    color: "text-blue-400",
  },
  {
    id: "vip",
    name: "VIP Pass",
    description: "Premium experience with exclusive benefits",
    price: 299,
    features: [
      "Priority seating",
      "VIP lounge access",
      "Meet & greet",
      "Gift bag",
      "Premium catering",
      "Networking dinner"
    ],
    available: 50,
    icon: Star,
    color: "text-amber-400",
  },
  {
    id: "student",
    name: "Student Ticket",
    description: "Special pricing for students with valid ID",
    price: 49,
    features: ["Event access", "General seating", "Digital program"],
    available: 100,
    icon: GraduationCap,
    color: "text-green-400",
  },
  {
    id: "group",
    name: "Group Package (5+)",
    description: "Special rate for groups of 5 or more",
    price: 79,
    priceNote: "per person",
    features: ["Event access", "Reserved group seating", "Group photo", "Networking session"],
    available: 200,
    icon: Users2,
    color: "text-purple-400",
  },
]

// Add-ons
const addOns = [
  {
    id: "workshop-morning",
    name: "Morning Workshop",
    description: "Hands-on workshop session (9 AM - 12 PM)",
    price: 49,
    icon: Briefcase,
    category: "workshop",
  },
  {
    id: "workshop-afternoon",
    name: "Afternoon Workshop",
    description: "Advanced techniques session (2 PM - 5 PM)",
    price: 49,
    icon: Briefcase,
    category: "workshop",
  },
  {
    id: "lunch",
    name: "Catered Lunch",
    description: "Full buffet lunch with dietary options",
    price: 25,
    icon: Utensils,
    category: "meal",
  },
  {
    id: "dinner",
    name: "Networking Dinner",
    description: "Evening dinner with speakers and attendees",
    price: 45,
    icon: UtensilsCrossed,
    category: "meal",
  },
  {
    id: "tshirt",
    name: "Event T-Shirt",
    description: "Premium quality event merchandise",
    price: 30,
    icon: ShoppingBag,
    category: "merchandise",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "parking",
    name: "Reserved Parking",
    description: "Guaranteed parking spot at venue",
    price: 20,
    icon: MapPin,
    category: "service",
  },
]

// Steps configuration
const steps = [
  {
    id: "event-details",
    title: "Event Details",
    description: "Basic event information",
    icon: Calendar,
  },
  {
    id: "attendee-info",
    title: "Your Information",
    description: "Personal details",
    icon: User,
  },
  {
    id: "tickets",
    title: "Select Tickets",
    description: "Choose your ticket type",
    icon: Ticket,
  },
  {
    id: "add-ons",
    title: "Add-ons",
    description: "Enhance your experience",
    icon: Plus,
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Dietary & accessibility",
    icon: Heart,
  },
  {
    id: "emergency",
    title: "Emergency Contact",
    description: "For your safety",
    icon: Shield,
  },
  {
    id: "payment",
    title: "Payment",
    description: "Complete registration",
    icon: CreditCard,
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "You're all set!",
    icon: CheckCircle2,
  },
]

export default function EventRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Event Details
    eventName: "Tech Conference 2025",
    eventDate: "March 15, 2025",
    eventLocation: "Convention Center, San Francisco",
    eventTime: "9:00 AM - 6:00 PM",

    // Attendee Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    linkedin: "",

    // Tickets
    selectedTickets: {} as Record<string, number>,

    // Add-ons
    selectedAddOns: {} as Record<string, any>,

    // Preferences
    dietaryRestrictions: [] as string[],
    otherDietary: "",
    accessibilityNeeds: [] as string[],
    otherAccessibility: "",

    // Emergency Contact
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",

    // Payment
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",

    // Marketing
    marketingConsent: false,
    newsletterConsent: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveDraft, setSaveDraft] = useState(false)

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  // Calculate total price
  const calculateTotal = () => {
    let total = 0

    // Tickets
    Object.entries(formData.selectedTickets).forEach(([ticketId, quantity]) => {
      const ticket = ticketTypes.find(t => t.id === ticketId)
      if (ticket) {
        total += ticket.price * quantity
      }
    })

    // Add-ons
    Object.entries(formData.selectedAddOns).forEach(([addonId, data]) => {
      if (data.selected) {
        const addon = addOns.find(a => a.id === addonId)
        if (addon) {
          total += addon.price * (data.quantity || 1)
        }
      }
    })

    return total
  }

  // Get total tickets
  const getTotalTickets = () => {
    return Object.values(formData.selectedTickets).reduce((sum, qty) => sum + qty, 0)
  }

  // Validate step
  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) { // Attendee Info
      if (!formData.firstName) newErrors.firstName = "First name is required"
      if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.email) newErrors.email = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
      if (!formData.phone) newErrors.phone = "Phone number is required"
    }

    if (currentStep === 2) { // Tickets
      if (getTotalTickets() === 0) {
        newErrors.tickets = "Please select at least one ticket"
      }
    }

    if (currentStep === 5) { // Emergency Contact
      if (!formData.emergencyName) newErrors.emergencyName = "Emergency contact name is required"
      if (!formData.emergencyPhone) newErrors.emergencyPhone = "Emergency contact phone is required"
    }

    if (currentStep === 6) { // Payment
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required"
      if (!formData.cardName) newErrors.cardName = "Cardholder name is required"
      if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"
      if (!formData.cvv) newErrors.cvv = "CVV is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Next step
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
    }
  }

  // Previous step
  const previousStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1))
  }

  // Handle ticket quantity change
  const updateTicketQuantity = (ticketId: string, change: number) => {
    const currentQty = formData.selectedTickets[ticketId] || 0
    const newQty = Math.max(0, currentQty + change)
    updateFormData("selectedTickets", {
      ...formData.selectedTickets,
      [ticketId]: newQty
    })
  }

  // Toggle add-on
  const toggleAddOn = (addonId: string, selected: boolean) => {
    updateFormData("selectedAddOns", {
      ...formData.selectedAddOns,
      [addonId]: { ...formData.selectedAddOns[addonId], selected, quantity: selected ? 1 : 0 }
    })
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold terminal-glow flex items-center gap-3 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                <CalendarIcon className="w-8 h-8" />
                Event Registration
              </h1>
              <p className="text-muted-foreground mt-2">
                Complete your registration for {formData.eventName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSaveDraft(true)}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="hidden md:grid grid-cols-8 gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`text-center ${
                  index === currentStep
                    ? "opacity-100"
                    : index < currentStep
                    ? "opacity-60"
                    : "opacity-30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    index < currentStep
                      ? "bg-green-500/20 border-2 border-green-500"
                      : index === currentStep
                      ? "bg-primary/20 border-2 border-primary"
                      : "bg-muted border-2 border-border"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-xs font-medium">{step.title}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Form */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="col-span-12 lg:col-span-8"
          >
            <Card className="glass">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-primary" })}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {steps[currentStep].description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <AnimatePresence mode="wait">
                    {/* Step 0: Event Details */}
                    {currentStep === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div className="text-center py-8">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                            <PartyPopper className="w-10 h-10 text-primary" />
                          </div>
                          <h2 className="text-3xl font-bold mb-3">{formData.eventName}</h2>
                          <p className="text-xl text-muted-foreground mb-6">
                            Join us for an unforgettable experience!
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Card className="glass-dark">
                            <CardContent className="p-6">
                              <Calendar className="w-8 h-8 text-primary mb-3" />
                              <div className="text-sm text-muted-foreground mb-1">Date</div>
                              <div className="font-semibold">{formData.eventDate}</div>
                            </CardContent>
                          </Card>
                          <Card className="glass-dark">
                            <CardContent className="p-6">
                              <Clock className="w-8 h-8 text-primary mb-3" />
                              <div className="text-sm text-muted-foreground mb-1">Time</div>
                              <div className="font-semibold">{formData.eventTime}</div>
                            </CardContent>
                          </Card>
                          <Card className="glass-dark md:col-span-2">
                            <CardContent className="p-6">
                              <MapPin className="w-8 h-8 text-primary mb-3" />
                              <div className="text-sm text-muted-foreground mb-1">Location</div>
                              <div className="font-semibold">{formData.eventLocation}</div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div>
                              <div className="font-semibold text-blue-400 mb-1">What to Expect</div>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Keynote speeches from industry leaders</li>
                                <li>• Interactive workshops and breakout sessions</li>
                                <li>• Networking opportunities with peers</li>
                                <li>• Catered meals and refreshments</li>
                                <li>• Exclusive swag and giveaways</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 1: Attendee Info */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">
                              First Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => updateFormData("firstName", e.target.value)}
                              className={errors.firstName ? "border-destructive" : ""}
                            />
                            {errors.firstName && (
                              <p className="text-sm text-destructive">{errors.firstName}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">
                              Last Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => updateFormData("lastName", e.target.value)}
                              className={errors.lastName ? "border-destructive" : ""}
                            />
                            {errors.lastName && (
                              <p className="text-sm text-destructive">{errors.lastName}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email Address <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => updateFormData("email", e.target.value)}
                              className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                              placeholder="you@example.com"
                            />
                          </div>
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            Phone Number <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => updateFormData("phone", e.target.value)}
                              className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone}</p>
                          )}
                        </div>

                        <Separator />

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) => updateFormData("company", e.target.value)}
                                className="pl-10"
                                placeholder="Acme Inc."
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="jobTitle">Job Title</Label>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="jobTitle"
                                value={formData.jobTitle}
                                onChange={(e) => updateFormData("jobTitle", e.target.value)}
                                className="pl-10"
                                placeholder="Software Engineer"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="linkedin"
                              value={formData.linkedin}
                              onChange={(e) => updateFormData("linkedin", e.target.value)}
                              className="pl-10"
                              placeholder="linkedin.com/in/yourprofile"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Tickets */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        {errors.tickets && (
                          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                            <p className="text-sm text-destructive">{errors.tickets}</p>
                          </div>
                        )}

                        {ticketTypes.map(ticket => {
                          const quantity = formData.selectedTickets[ticket.id] || 0
                          const TicketIcon = ticket.icon
                          return (
                            <Card
                              key={ticket.id}
                              className={`glass-dark transition-all ${
                                quantity > 0 ? "border-primary" : ""
                              }`}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 rounded-xl bg-primary/10">
                                    <TicketIcon className={`w-6 h-6 ${ticket.color}`} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h3 className="text-lg font-semibold">{ticket.name}</h3>
                                        <p className="text-sm text-muted-foreground">{ticket.description}</p>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-2xl font-bold">${ticket.price}</div>
                                        {ticket.priceNote && (
                                          <div className="text-xs text-muted-foreground">{ticket.priceNote}</div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {ticket.features.map((feature, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          <Check className="w-3 h-3 mr-1" />
                                          {feature}
                                        </Badge>
                                      ))}
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="text-sm text-muted-foreground">
                                        {ticket.available} tickets available
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateTicketQuantity(ticket.id, -1)}
                                          disabled={quantity === 0}
                                        >
                                          <Minus className="w-4 h-4" />
                                        </Button>
                                        <div className="w-12 text-center font-semibold">{quantity}</div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateTicketQuantity(ticket.id, 1)}
                                          disabled={quantity >= ticket.available}
                                        >
                                          <Plus className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </motion.div>
                    )}

                    {/* Step 3: Add-ons */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <p className="text-muted-foreground">
                          Enhance your experience with these optional add-ons
                        </p>

                        {["workshop", "meal", "merchandise", "service"].map(category => {
                          const categoryAddOns = addOns.filter(a => a.category === category)
                          if (categoryAddOns.length === 0) return null

                          return (
                            <div key={category}>
                              <h3 className="text-lg font-semibold mb-3 capitalize">{category}s</h3>
                              <div className="space-y-3">
                                {categoryAddOns.map(addon => {
                                  const selected = formData.selectedAddOns[addon.id]?.selected || false
                                  const AddonIcon = addon.icon
                                  return (
                                    <Card
                                      key={addon.id}
                                      className={`glass-dark cursor-pointer transition-all ${
                                        selected ? "border-primary" : ""
                                      }`}
                                      onClick={() => toggleAddOn(addon.id, !selected)}
                                    >
                                      <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                          <Checkbox checked={selected} className="mt-1" />
                                          <div className="p-2 rounded-lg bg-primary/10">
                                            <AddonIcon className="w-5 h-5 text-primary" />
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                              <div>
                                                <h4 className="font-semibold">{addon.name}</h4>
                                                <p className="text-sm text-muted-foreground">{addon.description}</p>
                                              </div>
                                              <div className="text-lg font-bold">+${addon.price}</div>
                                            </div>
                                            {addon.sizes && selected && (
                                              <div className="mt-3">
                                                <Label className="text-xs mb-2 block">Select Size</Label>
                                                <div className="flex gap-2">
                                                  {addon.sizes.map(size => (
                                                    <Button
                                                      key={size}
                                                      variant={formData.selectedAddOns[addon.id]?.size === size ? "default" : "outline"}
                                                      size="sm"
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        updateFormData("selectedAddOns", {
                                                          ...formData.selectedAddOns,
                                                          [addon.id]: { ...formData.selectedAddOns[addon.id], size }
                                                        })
                                                      }}
                                                    >
                                                      {size}
                                                    </Button>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </motion.div>
                    )}

                    {/* Step 4: Preferences */}
                    {currentStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div className="space-y-3">
                          <Label className="text-base font-semibold flex items-center gap-2">
                            <Utensils className="w-5 h-5" />
                            Dietary Restrictions
                          </Label>
                          <div className="space-y-2">
                            {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut Allergy", "Halal", "Kosher"].map(option => (
                              <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                  id={option}
                                  checked={formData.dietaryRestrictions.includes(option)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      updateFormData("dietaryRestrictions", [...formData.dietaryRestrictions, option])
                                    } else {
                                      updateFormData("dietaryRestrictions", formData.dietaryRestrictions.filter(d => d !== option))
                                    }
                                  }}
                                />
                                <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                              </div>
                            ))}
                          </div>
                          <Textarea
                            value={formData.otherDietary}
                            onChange={(e) => updateFormData("otherDietary", e.target.value)}
                            placeholder="Other dietary restrictions or allergies..."
                            rows={2}
                          />
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <Label className="text-base font-semibold flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Accessibility Needs
                          </Label>
                          <div className="space-y-2">
                            {["Wheelchair Access", "Sign Language Interpreter", "Hearing Loop", "Large Print Materials", "Service Animal"].map(option => (
                              <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                  id={option}
                                  checked={formData.accessibilityNeeds.includes(option)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      updateFormData("accessibilityNeeds", [...formData.accessibilityNeeds, option])
                                    } else {
                                      updateFormData("accessibilityNeeds", formData.accessibilityNeeds.filter(a => a !== option))
                                    }
                                  }}
                                />
                                <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                              </div>
                            ))}
                          </div>
                          <Textarea
                            value={formData.otherAccessibility}
                            onChange={(e) => updateFormData("otherAccessibility", e.target.value)}
                            placeholder="Other accessibility requirements..."
                            rows={2}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 5: Emergency Contact */}
                    {currentStep === 5 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                          <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
                          <div>
                            <div className="font-semibold text-amber-400 mb-1">For Your Safety</div>
                            <p className="text-sm text-muted-foreground">
                              Please provide an emergency contact in case we need to reach someone on your behalf.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emergencyName">
                            Emergency Contact Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="emergencyName"
                            value={formData.emergencyName}
                            onChange={(e) => updateFormData("emergencyName", e.target.value)}
                            className={errors.emergencyName ? "border-destructive" : ""}
                          />
                          {errors.emergencyName && (
                            <p className="text-sm text-destructive">{errors.emergencyName}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emergencyRelation">Relationship</Label>
                          <Select
                            value={formData.emergencyRelation}
                            onValueChange={(value) => updateFormData("emergencyRelation", value)}
                          >
                            <SelectTrigger id="emergencyRelation">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse/Partner</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emergencyPhone">
                            Emergency Contact Phone <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="emergencyPhone"
                              type="tel"
                              value={formData.emergencyPhone}
                              onChange={(e) => updateFormData("emergencyPhone", e.target.value)}
                              className={`pl-10 ${errors.emergencyPhone ? "border-destructive" : ""}`}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          {errors.emergencyPhone && (
                            <p className="text-sm text-destructive">{errors.emergencyPhone}</p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 6: Payment */}
                    {currentStep === 6 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">
                            Card Number <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="cardNumber"
                              value={formData.cardNumber}
                              onChange={(e) => updateFormData("cardNumber", e.target.value)}
                              className={`pl-10 ${errors.cardNumber ? "border-destructive" : ""}`}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                            />
                          </div>
                          {errors.cardNumber && (
                            <p className="text-sm text-destructive">{errors.cardNumber}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardName">
                            Cardholder Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="cardName"
                            value={formData.cardName}
                            onChange={(e) => updateFormData("cardName", e.target.value)}
                            className={errors.cardName ? "border-destructive" : ""}
                            placeholder="John Doe"
                          />
                          {errors.cardName && (
                            <p className="text-sm text-destructive">{errors.cardName}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">
                              Expiry Date <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => updateFormData("expiryDate", e.target.value)}
                              className={errors.expiryDate ? "border-destructive" : ""}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            {errors.expiryDate && (
                              <p className="text-sm text-destructive">{errors.expiryDate}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">
                              CVV <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="cvv"
                              type="password"
                              value={formData.cvv}
                              onChange={(e) => updateFormData("cvv", e.target.value)}
                              className={errors.cvv ? "border-destructive" : ""}
                              placeholder="123"
                              maxLength={4}
                            />
                            {errors.cvv && (
                              <p className="text-sm text-destructive">{errors.cvv}</p>
                            )}
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <Label className="text-base font-semibold">Billing Address</Label>
                          <Input
                            value={formData.billingAddress}
                            onChange={(e) => updateFormData("billingAddress", e.target.value)}
                            placeholder="Street address"
                          />
                          <div className="grid grid-cols-3 gap-3">
                            <Input
                              value={formData.city}
                              onChange={(e) => updateFormData("city", e.target.value)}
                              placeholder="City"
                            />
                            <Input
                              value={formData.state}
                              onChange={(e) => updateFormData("state", e.target.value)}
                              placeholder="State"
                            />
                            <Input
                              value={formData.zipCode}
                              onChange={(e) => updateFormData("zipCode", e.target.value)}
                              placeholder="ZIP"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="newsletter"
                              checked={formData.newsletterConsent}
                              onCheckedChange={(checked) => updateFormData("newsletterConsent", !!checked)}
                            />
                            <Label htmlFor="newsletter" className="cursor-pointer text-sm">
                              Send me event updates and newsletters
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="marketing"
                              checked={formData.marketingConsent}
                              onCheckedChange={(checked) => updateFormData("marketingConsent", !!checked)}
                            />
                            <Label htmlFor="marketing" className="cursor-pointer text-sm">
                              I agree to receive marketing communications
                            </Label>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                          <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                          <div className="text-sm text-muted-foreground">
                            Your payment information is secure and encrypted. We never store your full card details.
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 7: Confirmation */}
                    {currentStep === 7 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8 space-y-6"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", duration: 0.6 }}
                        >
                          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                          </div>
                        </motion.div>

                        <div>
                          <h2 className="text-3xl font-bold mb-3">Registration Complete!</h2>
                          <p className="text-lg text-muted-foreground mb-6">
                            You're all set for {formData.eventName}
                          </p>
                        </div>

                        <Card className="glass-dark max-w-md mx-auto">
                          <CardContent className="p-6">
                            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                              <QrCode className="w-24 h-24 text-black" />
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">Confirmation Code</div>
                            <div className="text-2xl font-mono font-bold">EC-{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
                          </CardContent>
                        </Card>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <Button size="lg">
                            <Download className="w-5 h-5 mr-2" />
                            Download Ticket
                          </Button>
                          <Button variant="outline" size="lg">
                            <CalendarIcon className="w-5 h-5 mr-2" />
                            Add to Calendar
                          </Button>
                          <Button variant="outline" size="lg">
                            <Mail className="w-5 h-5 mr-2" />
                            Email Confirmation
                          </Button>
                        </div>

                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                          <div className="text-sm text-muted-foreground">
                            A confirmation email has been sent to <strong>{formData.email}</strong>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-6">
                <Button
                  variant="outline"
                  onClick={previousStep}
                  disabled={currentStep === 0 || currentStep === steps.length - 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button onClick={nextStep}>
                    {currentStep === steps.length - 2 ? "Complete Registration" : "Next"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={() => window.location.reload()}>
                    Register Another Attendee
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>

          {/* Order Summary - Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-12 lg:col-span-4"
          >
            <Card className="glass-dark sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[500px]">
                  <div className="space-y-4">
                    {/* Tickets */}
                    {Object.entries(formData.selectedTickets).map(([ticketId, quantity]) => {
                      if (quantity === 0) return null
                      const ticket = ticketTypes.find(t => t.id === ticketId)
                      if (!ticket) return null
                      return (
                        <div key={ticketId} className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{ticket.name}</div>
                            <div className="text-sm text-muted-foreground">Qty: {quantity}</div>
                          </div>
                          <div className="font-semibold">${ticket.price * quantity}</div>
                        </div>
                      )
                    })}

                    {/* Add-ons */}
                    {Object.entries(formData.selectedAddOns).map(([addonId, data]) => {
                      if (!data.selected) return null
                      const addon = addOns.find(a => a.id === addonId)
                      if (!addon) return null
                      return (
                        <div key={addonId} className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{addon.name}</div>
                            {data.size && (
                              <div className="text-sm text-muted-foreground">Size: {data.size}</div>
                            )}
                          </div>
                          <div className="font-semibold">${addon.price}</div>
                        </div>
                      )
                    })}

                    {getTotalTickets() === 0 && Object.keys(formData.selectedAddOns).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Your cart is empty</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {getTotalTickets() > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${calculateTotal()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span>${Math.round(calculateTotal() * 0.03)}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${calculateTotal() + Math.round(calculateTotal() * 0.03)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
