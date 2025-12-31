"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  Phone,
  MessageSquare,
  Calendar,
  RefreshCw,
  Home,
  Building2,
  Star,
  Camera,
  PenTool,
  ChevronRight,
  AlertCircle,
  Navigation,
  Box,
  Weight,
  Ruler,
  User,
  Mail,
  Bell,
  Copy,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Send,
  ArrowRight,
  Pause,
  Play,
  Route,
} from "lucide-react"
import { Card, Button, Badge, Progress, Separator, ScrollArea, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Textarea } from "@ggprompts/ui"

// TypeScript Interfaces
interface Address {
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  instructions?: string
}

interface Location {
  lat: number
  lng: number
  city: string
  state: string
}

interface Item {
  id: string
  name: string
  quantity: number
  image: string
  sku: string
}

interface TrackingEvent {
  id: string
  status: string
  description: string
  location: string
  timestamp: string
  isCompleted: boolean
  isCurrent?: boolean
}

interface DeliveryProof {
  photo?: string
  signature?: string
  timestamp: string
  recipient?: string
}

interface Shipment {
  id: string
  trackingNumber: string
  carrier: string
  status: "ordered" | "shipped" | "in-transit" | "out-for-delivery" | "delivered" | "exception"
  estimatedDelivery: string
  deliveredAt?: string
  origin: Address
  destination: Address
  currentLocation?: Location
  items: Item[]
  timeline: TrackingEvent[]
  weight: string
  dimensions: string
  proof?: DeliveryProof
}

export default function OrderTrackingPage() {
  const [copied, setCopied] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [liveUpdates, setLiveUpdates] = useState(true)
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 34, seconds: 12 })

  // Mock shipment data
  const [shipment] = useState<Shipment>({
    id: "ORD-2024-78432",
    trackingNumber: "1Z999AA10123456784",
    carrier: "FastShip Express",
    status: "out-for-delivery",
    estimatedDelivery: "Today by 5:00 PM",
    origin: {
      name: "Distribution Center",
      street: "1234 Warehouse Blvd",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    destination: {
      name: "John Smith",
      street: "456 Oak Avenue, Apt 7B",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "USA",
      phone: "+1 (555) 123-4567",
      instructions: "Leave at front door. Ring doorbell.",
    },
    currentLocation: {
      lat: 37.4419,
      lng: -122.143,
      city: "Palo Alto",
      state: "CA",
    },
    items: [
      {
        id: "item-1",
        name: "Wireless Noise-Canceling Headphones",
        quantity: 1,
        image: "/placeholder-product-1.jpg",
        sku: "WH-1000XM5",
      },
      {
        id: "item-2",
        name: "USB-C Charging Cable (6ft)",
        quantity: 2,
        image: "/placeholder-product-2.jpg",
        sku: "USBC-6FT-BLK",
      },
    ],
    timeline: [
      {
        id: "evt-1",
        status: "Order Placed",
        description: "Your order has been confirmed and is being processed",
        location: "Online",
        timestamp: "Dec 24, 2024 - 2:30 PM",
        isCompleted: true,
      },
      {
        id: "evt-2",
        status: "Shipped",
        description: "Package picked up by carrier",
        location: "Los Angeles, CA",
        timestamp: "Dec 25, 2024 - 8:15 AM",
        isCompleted: true,
      },
      {
        id: "evt-3",
        status: "In Transit",
        description: "Package departed facility",
        location: "Los Angeles, CA",
        timestamp: "Dec 25, 2024 - 11:42 AM",
        isCompleted: true,
      },
      {
        id: "evt-4",
        status: "In Transit",
        description: "Package arrived at regional hub",
        location: "Fresno, CA",
        timestamp: "Dec 26, 2024 - 3:18 AM",
        isCompleted: true,
      },
      {
        id: "evt-5",
        status: "Out for Delivery",
        description: "Package is on the delivery vehicle",
        location: "San Francisco, CA",
        timestamp: "Dec 27, 2024 - 7:45 AM",
        isCompleted: true,
        isCurrent: true,
      },
      {
        id: "evt-6",
        status: "Delivered",
        description: "Package will be delivered",
        location: "San Francisco, CA",
        timestamp: "Expected Today",
        isCompleted: false,
      },
    ],
    weight: "1.2 lbs",
    dimensions: "12 x 8 x 4 in",
  })

  // Update feed items
  const [updates] = useState([
    {
      id: "upd-1",
      message: "Driver is 3 stops away from your location",
      timestamp: "Just now",
      type: "info",
    },
    {
      id: "upd-2",
      message: "Package scanned at local delivery facility",
      timestamp: "2 hours ago",
      type: "success",
    },
    {
      id: "upd-3",
      message: "Delivery scheduled for today between 2-5 PM",
      timestamp: "5 hours ago",
      type: "info",
    },
    {
      id: "upd-4",
      message: "Package arrived in San Francisco",
      timestamp: "Yesterday",
      type: "success",
    },
  ])

  // Countdown timer
  useEffect(() => {
    if (!liveUpdates) return
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [liveUpdates])

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(shipment.trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (status: Shipment["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-primary/20 text-primary border-primary/30"
      case "out-for-delivery":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "in-transit":
        return "bg-secondary/20 text-secondary border-secondary/30"
      case "shipped":
        return "bg-accent/20 text-accent border-accent/30"
      case "ordered":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      case "exception":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusLabel = (status: Shipment["status"]) => {
    switch (status) {
      case "out-for-delivery":
        return "Out for Delivery"
      case "in-transit":
        return "In Transit"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const getProgressValue = () => {
    const statusOrder = ["ordered", "shipped", "in-transit", "out-for-delivery", "delivered"]
    const currentIndex = statusOrder.indexOf(shipment.status)
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  const mainTimelineSteps = [
    { status: "ordered", label: "Ordered", icon: Package },
    { status: "shipped", label: "Shipped", icon: Box },
    { status: "in-transit", label: "In Transit", icon: Truck },
    { status: "out-for-delivery", label: "Out for Delivery", icon: Navigation },
    { status: "delivered", label: "Delivered", icon: CheckCircle2 },
  ]

  const isStepCompleted = (step: string) => {
    const statusOrder = ["ordered", "shipped", "in-transit", "out-for-delivery", "delivered"]
    const currentIndex = statusOrder.indexOf(shipment.status)
    const stepIndex = statusOrder.indexOf(step)
    return stepIndex <= currentIndex
  }

  const isStepCurrent = (step: string) => step === shipment.status

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-primary/30 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Order Info */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={`${getStatusColor(shipment.status)} text-sm px-3 py-1`}>
                    {getStatusLabel(shipment.status)}
                  </Badge>
                  <span className="text-slate-400 text-sm">Order {shipment.id}</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-mono font-bold text-foreground">
                  {shipment.status === "delivered"
                    ? "Package Delivered!"
                    : "Your package is on the way"}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Truck className="h-4 w-4" />
                    <span>{shipment.carrier}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Tracking:</span>
                    <code className="text-primary font-mono">{shipment.trackingNumber}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={copyTrackingNumber}
                    >
                      {copied ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* ETA Countdown */}
              <div className="glass-dark border-primary/20 rounded-lg p-5 text-center min-w-[200px]">
                <p className="text-slate-400 text-sm mb-2">Estimated Arrival</p>
                <p className="text-primary font-semibold mb-3">{shipment.estimatedDelivery}</p>
                <div className="flex justify-center gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-foreground">
                      {countdown.hours.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-slate-500">hrs</div>
                  </div>
                  <div className="text-2xl font-mono text-slate-500">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-foreground">
                      {countdown.minutes.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-slate-500">min</div>
                  </div>
                  <div className="text-2xl font-mono text-slate-500">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-foreground">
                      {countdown.seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-slate-500">sec</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Progress Timeline (Horizontal) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass border-secondary/30 p-6">
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-border/30 mx-10">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressValue()}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {mainTimelineSteps.map((step, idx) => {
                  const Icon = step.icon
                  const completed = isStepCompleted(step.status)
                  const current = isStepCurrent(step.status)

                  return (
                    <div key={step.status} className="flex flex-col items-center z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          completed
                            ? current
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/20 text-primary border border-primary/50"
                            : "bg-background border border-border text-muted-foreground"
                        }`}
                      >
                        {completed && !current ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </motion.div>
                      <span
                        className={`text-xs mt-2 text-center hidden md:block ${
                          completed ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Current Location
                  </h2>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Navigation className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>

                {/* Map Placeholder */}
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-background border border-border">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5">
                    {/* Grid Pattern */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                      }}
                    />

                    {/* Route Line */}
                    <svg className="absolute inset-0 w-full h-full">
                      <motion.path
                        d="M 50 200 Q 150 100 250 150 T 450 100 T 650 80"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        strokeDasharray="10 5"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                    </svg>

                    {/* Origin Pin */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="absolute left-[5%] top-[70%]"
                    >
                      <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                          <Building2 className="h-3 w-3 text-secondary-foreground" />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-secondary" />
                      </div>
                    </motion.div>

                    {/* Current Location Pin (Animated) */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                      className="absolute left-[60%] top-[35%]"
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="relative"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Truck className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-primary" />
                        {/* Pulse Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary"
                          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Destination Pin */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                      className="absolute right-[10%] top-[25%]"
                    >
                      <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <Home className="h-3 w-3 text-accent-foreground" />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-accent" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Location Info Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="glass-dark rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {shipment.currentLocation?.city}, {shipment.currentLocation?.state}
                          </p>
                          <p className="text-xs text-muted-foreground">3 stops away</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-primary/30 text-primary">
                        <Route className="h-4 w-4 mr-1" />
                        View Route
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Detailed Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="glass border-secondary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    Tracking History
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLiveUpdates(!liveUpdates)}
                    className={liveUpdates ? "text-primary" : "text-muted-foreground"}
                  >
                    {liveUpdates ? (
                      <Pause className="h-4 w-4 mr-1" />
                    ) : (
                      <Play className="h-4 w-4 mr-1" />
                    )}
                    {liveUpdates ? "Live" : "Paused"}
                  </Button>
                </div>

                <div className="relative pl-6">
                  {/* Vertical Line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

                  <div className="space-y-6">
                    {shipment.timeline.map((event, idx) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * idx }}
                        className="relative"
                      >
                        {/* Dot */}
                        <div
                          className={`absolute -left-6 top-1 w-4 h-4 rounded-full flex items-center justify-center ${
                            event.isCurrent
                              ? "bg-primary"
                              : event.isCompleted
                              ? "bg-primary/30 border border-primary"
                              : "bg-background border border-border"
                          }`}
                        >
                          {event.isCurrent && (
                            <motion.div
                              className="w-2 h-2 bg-primary-foreground rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                          {event.isCompleted && !event.isCurrent && (
                            <CheckCircle2 className="h-3 w-3 text-primary" />
                          )}
                        </div>

                        {/* Content */}
                        <div
                          className={`glass-dark rounded-lg p-4 ${
                            event.isCurrent ? "border-primary/30" : "border-border/30"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <h3
                              className={`font-medium ${
                                event.isCurrent ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {event.status}
                            </h3>
                            <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Package Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="glass border-accent/30 p-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
                  <Package className="h-5 w-5 text-accent" />
                  Package Contents
                </h2>

                <div className="space-y-4">
                  {shipment.items.map((item) => (
                    <div
                      key={item.id}
                      className="glass-dark rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <Badge className="bg-secondary/20 text-secondary border-secondary/30 w-fit">
                        Qty: {item.quantity}
                      </Badge>
                    </div>
                  ))}
                </div>

                <Separator className="my-6 bg-border/30" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Weight className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-mono text-foreground">{shipment.weight}</p>
                  </div>
                  <div className="text-center">
                    <Ruler className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Dimensions</p>
                    <p className="font-mono text-foreground">{shipment.dimensions}</p>
                  </div>
                  <div className="text-center">
                    <Box className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Items</p>
                    <p className="font-mono text-foreground">{shipment.items.length}</p>
                  </div>
                  <div className="text-center">
                    <Truck className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Carrier</p>
                    <p className="font-mono text-foreground text-sm">{shipment.carrier}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Live Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <Card className="glass border-blue-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-400" />
                    Live Updates
                  </h2>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-blue-400"
                  />
                </div>

                <ScrollArea className="h-[200px]">
                  <div className="space-y-3 pr-4">
                    {updates.map((update, idx) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * idx }}
                        className="glass-dark rounded-lg p-3"
                      >
                        <div className="flex items-start gap-2">
                          {update.type === "success" ? (
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                          )}
                          <div>
                            <p className="text-sm text-foreground">{update.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{update.timestamp}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </motion.div>

            {/* Delivery Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Card className="glass border-primary/30 p-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Home className="h-5 w-5 text-primary" />
                  Delivery Address
                </h2>

                <div className="space-y-4">
                  <div className="glass-dark rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {shipment.destination.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{shipment.destination.street}</p>
                    <p className="text-sm text-muted-foreground">
                      {shipment.destination.city}, {shipment.destination.state}{" "}
                      {shipment.destination.zip}
                    </p>
                    {shipment.destination.phone && (
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {shipment.destination.phone}
                      </p>
                    )}
                  </div>

                  {shipment.destination.instructions && (
                    <div className="glass-dark rounded-lg p-4 border-l-4 border-secondary">
                      <p className="text-xs text-muted-foreground mb-1">Delivery Instructions</p>
                      <p className="text-sm text-foreground">{shipment.destination.instructions}</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Delivery Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <Card className="glass border-secondary/30 p-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <RefreshCw className="h-5 w-5 text-secondary" />
                  Delivery Options
                </h2>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-between border-border/50 hover:bg-primary/10 hover:border-primary/30"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Reschedule Delivery
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-border/50 hover:bg-secondary/10 hover:border-secondary/30"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Redirect Package
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-border/50 hover:bg-accent/10 hover:border-accent/30"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Hold at Location
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Contact Driver */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="glass border-amber-500/30 p-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-amber-400" />
                  Contact Driver
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Available while package is out for delivery
                </p>
              </Card>
            </motion.div>

            {/* Proof of Delivery (Placeholder) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <Card className="glass border-slate-500/30 p-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Camera className="h-5 w-5 text-slate-400" />
                  Proof of Delivery
                </h2>

                <div className="glass-dark rounded-lg p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-background border border-border flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Photo and signature will appear here after delivery
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Rate Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="glass border-primary/30 p-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  Rate Your Experience
                </h2>

                {!showRating ? (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      How was your delivery experience?
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-primary/30 hover:bg-primary/10"
                        onClick={() => {
                          setRating(5)
                          setShowRating(true)
                        }}
                      >
                        <ThumbsUp className="h-5 w-5 text-primary" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-red-500/30 hover:bg-red-500/10"
                        onClick={() => {
                          setRating(1)
                          setShowRating(true)
                        }}
                      >
                        <ThumbsDown className="h-5 w-5 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <Textarea
                        placeholder="Share your feedback (optional)"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="bg-background border-border min-h-[80px]"
                      />

                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Send className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </Button>
                    </motion.div>
                  </AnimatePresence>
                )}
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Mobile Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 glass border-primary/30 rounded-full px-4 py-2 flex items-center gap-2 md:hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <span className="text-primary text-sm font-mono">Tracking Live</span>
        </motion.div>
      </div>
    </div>
  )
}
