"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  MapPin,
  MessageSquare,
  Navigation,
  Package,
  Phone,
  QrCode,
  RotateCcw,
  Route,
  Truck,
  User,
  X,
  Wifi,
  WifiOff,
  Home,
  Building2,
  Timer,
  Target,
  TrendingUp,
  Pen,
} from "lucide-react"
import { Card, Button, Badge, Progress, Separator, ScrollArea, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Tabs, TabsContent, TabsList, TabsTrigger, Input, Textarea } from "@ggprompts/ui"

// TypeScript Interfaces
interface Recipient {
  name: string
  phone?: string
  email?: string
}

interface Package {
  id: string
  trackingNumber: string
  description: string
  weight: number
  requiresSignature: boolean
}

interface DeliveryProof {
  photo?: string
  signature?: string
  recipientName?: string
  timestamp: number
}

interface Stop {
  id: string
  sequence: number
  address: string
  city: string
  coordinates: { lat: number; lng: number }
  timeWindow?: { start: string; end: string }
  recipient: Recipient
  packages: Package[]
  status: "pending" | "arrived" | "completed" | "failed"
  instructions?: string
  proof?: DeliveryProof
  type: "residential" | "commercial"
  arrivalTime?: number
  completionTime?: number
}

interface RouteData {
  id: string
  driverId: string
  driverName: string
  date: string
  stops: Stop[]
  totalDistance: number
  estimatedDuration: number
  status: "not-started" | "in-progress" | "completed"
  currentStopIndex: number
  startTime?: number
}

export default function DeliveryRouteDashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showScanner, setShowScanner] = useState(false)
  const [showProofDialog, setShowProofDialog] = useState(false)
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null)
  const [expandedStopId, setExpandedStopId] = useState<string | null>(null)
  const [signatureData, setSignatureData] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [scannedPackages, setScannedPackages] = useState<string[]>([])

  // Mock Route Data
  const [route, setRoute] = useState<RouteData>({
    id: "RT-2024-1227-001",
    driverId: "DRV-4521",
    driverName: "Alex Johnson",
    date: new Date().toISOString().split("T")[0],
    totalDistance: 42.5,
    estimatedDuration: 285,
    status: "in-progress",
    currentStopIndex: 3,
    startTime: Date.now() - 7200000,
    stops: [
      {
        id: "stop-1",
        sequence: 1,
        address: "123 Oak Street",
        city: "Downtown",
        coordinates: { lat: 40.7128, lng: -74.006 },
        timeWindow: { start: "08:00", end: "10:00" },
        recipient: { name: "Sarah Mitchell", phone: "+1 555-0101" },
        packages: [
          {
            id: "pkg-1",
            trackingNumber: "TRK-8842991",
            description: "Electronics - Laptop",
            weight: 3.2,
            requiresSignature: true,
          },
        ],
        status: "completed",
        type: "residential",
        instructions: "Leave at front door if not home",
        completionTime: Date.now() - 5400000,
        proof: {
          recipientName: "Sarah Mitchell",
          timestamp: Date.now() - 5400000,
        },
      },
      {
        id: "stop-2",
        sequence: 2,
        address: "456 Commerce Blvd, Suite 200",
        city: "Business District",
        coordinates: { lat: 40.7148, lng: -74.008 },
        timeWindow: { start: "09:00", end: "12:00" },
        recipient: { name: "Apex Solutions Inc.", phone: "+1 555-0202" },
        packages: [
          {
            id: "pkg-2",
            trackingNumber: "TRK-8843102",
            description: "Office Supplies",
            weight: 8.5,
            requiresSignature: false,
          },
          {
            id: "pkg-3",
            trackingNumber: "TRK-8843103",
            description: "Printer Cartridges",
            weight: 2.1,
            requiresSignature: false,
          },
        ],
        status: "completed",
        type: "commercial",
        instructions: "Deliver to reception desk on 2nd floor",
        completionTime: Date.now() - 3600000,
        proof: {
          recipientName: "Mike (Reception)",
          timestamp: Date.now() - 3600000,
        },
      },
      {
        id: "stop-3",
        sequence: 3,
        address: "789 Maple Avenue",
        city: "Westside",
        coordinates: { lat: 40.7168, lng: -74.012 },
        timeWindow: { start: "10:00", end: "14:00" },
        recipient: { name: "James Chen", phone: "+1 555-0303" },
        packages: [
          {
            id: "pkg-4",
            trackingNumber: "TRK-8843204",
            description: "Furniture - Chair",
            weight: 15.0,
            requiresSignature: true,
          },
        ],
        status: "completed",
        type: "residential",
        instructions: "Ring doorbell twice",
        completionTime: Date.now() - 1800000,
        proof: {
          recipientName: "James Chen",
          timestamp: Date.now() - 1800000,
        },
      },
      {
        id: "stop-4",
        sequence: 4,
        address: "321 Pine Road",
        city: "Northside",
        coordinates: { lat: 40.7188, lng: -74.004 },
        timeWindow: { start: "11:00", end: "15:00" },
        recipient: { name: "Emily Watson", phone: "+1 555-0404" },
        packages: [
          {
            id: "pkg-5",
            trackingNumber: "TRK-8843305",
            description: "Clothing - Dress",
            weight: 0.8,
            requiresSignature: false,
          },
          {
            id: "pkg-6",
            trackingNumber: "TRK-8843306",
            description: "Accessories",
            weight: 0.3,
            requiresSignature: false,
          },
        ],
        status: "arrived",
        type: "residential",
        instructions: "Gate code: 1234",
        arrivalTime: Date.now() - 300000,
      },
      {
        id: "stop-5",
        sequence: 5,
        address: "555 Industrial Way",
        city: "Industrial Park",
        coordinates: { lat: 40.7208, lng: -74.016 },
        timeWindow: { start: "12:00", end: "16:00" },
        recipient: { name: "TechStart Labs", phone: "+1 555-0505" },
        packages: [
          {
            id: "pkg-7",
            trackingNumber: "TRK-8843407",
            description: "Lab Equipment",
            weight: 12.5,
            requiresSignature: true,
          },
        ],
        status: "pending",
        type: "commercial",
        instructions: "Call upon arrival - restricted access",
      },
      {
        id: "stop-6",
        sequence: 6,
        address: "888 Sunset Drive",
        city: "Suburbs",
        coordinates: { lat: 40.7228, lng: -74.02 },
        recipient: { name: "David Park", phone: "+1 555-0606" },
        packages: [
          {
            id: "pkg-8",
            trackingNumber: "TRK-8843508",
            description: "Books",
            weight: 4.2,
            requiresSignature: false,
          },
        ],
        status: "pending",
        type: "residential",
      },
      {
        id: "stop-7",
        sequence: 7,
        address: "102 River Street",
        city: "Waterfront",
        coordinates: { lat: 40.7248, lng: -74.024 },
        timeWindow: { start: "14:00", end: "18:00" },
        recipient: { name: "Marina Apartments - Unit 4B", phone: "+1 555-0707" },
        packages: [
          {
            id: "pkg-9",
            trackingNumber: "TRK-8843609",
            description: "Home Decor",
            weight: 6.8,
            requiresSignature: false,
          },
        ],
        status: "pending",
        type: "residential",
        instructions: "Building has secure entry - buzz 4B",
      },
      {
        id: "stop-8",
        sequence: 8,
        address: "250 Market Street",
        city: "Downtown",
        coordinates: { lat: 40.7268, lng: -74.002 },
        timeWindow: { start: "15:00", end: "17:00" },
        recipient: { name: "Fresh Cafe", phone: "+1 555-0808" },
        packages: [
          {
            id: "pkg-10",
            trackingNumber: "TRK-8843710",
            description: "Coffee Supplies",
            weight: 22.0,
            requiresSignature: false,
          },
          {
            id: "pkg-11",
            trackingNumber: "TRK-8843711",
            description: "Pastry Boxes",
            weight: 5.5,
            requiresSignature: false,
          },
        ],
        status: "pending",
        type: "commercial",
        instructions: "Use back entrance on loading dock",
      },
    ],
  })

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Simulate online/offline status
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        setIsOnline((prev) => !prev)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Calculate metrics
  const completedStops = route.stops.filter((s) => s.status === "completed").length
  const totalStops = route.stops.length
  const progressPercent = (completedStops / totalStops) * 100
  const remainingStops = totalStops - completedStops
  const currentStop = route.stops.find((s) => s.status === "arrived") ||
                      route.stops.find((s) => s.status === "pending")

  // Calculate on-time percentage
  const onTimeDeliveries = route.stops.filter((stop) => {
    if (stop.status !== "completed" || !stop.timeWindow || !stop.completionTime) return false
    const endTime = new Date(`${route.date} ${stop.timeWindow.end}`).getTime()
    return stop.completionTime <= endTime
  }).length
  const onTimePercent = completedStops > 0 ? (onTimeDeliveries / completedStops) * 100 : 100

  // Estimate remaining time
  const avgTimePerStop = route.estimatedDuration / totalStops
  const remainingMinutes = Math.round(avgTimePerStop * remainingStops)

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  // Status helpers
  const getStatusColor = (status: Stop["status"]) => {
    switch (status) {
      case "completed":
        return "bg-primary/20 text-primary border-primary/30"
      case "arrived":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-muted/50 text-muted-foreground border-border"
    }
  }

  const getStatusIcon = (status: Stop["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-primary" />
      case "arrived":
        return <MapPin className="h-5 w-5 text-blue-400" />
      case "failed":
        return <X className="h-5 w-5 text-red-400" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  // Handle stop actions
  const handleArriveAtStop = (stopId: string) => {
    setRoute((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) =>
        stop.id === stopId ? { ...stop, status: "arrived" as const, arrivalTime: Date.now() } : stop
      ),
    }))
  }

  const handleCompleteDelivery = (stopId: string) => {
    setRoute((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) =>
        stop.id === stopId
          ? {
              ...stop,
              status: "completed" as const,
              completionTime: Date.now(),
              proof: {
                recipientName: recipientName || "Left at door",
                signature: signatureData || undefined,
                timestamp: Date.now(),
              },
            }
          : stop
      ),
      currentStopIndex: prev.currentStopIndex + 1,
    }))
    setShowProofDialog(false)
    setRecipientName("")
    setSignatureData("")
    setDeliveryNotes("")
    setScannedPackages([])
  }

  const handleFailDelivery = (stopId: string) => {
    setRoute((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) =>
        stop.id === stopId ? { ...stop, status: "failed" as const } : stop
      ),
      currentStopIndex: prev.currentStopIndex + 1,
    }))
  }

  const handleScanPackage = (trackingNumber: string) => {
    if (!scannedPackages.includes(trackingNumber)) {
      setScannedPackages((prev) => [...prev, trackingNumber])
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-mono font-bold text-foreground terminal-glow">
                Route Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {route.driverName} • {formatTime(currentTime)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`${
                  isOnline
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
              >
                {isOnline ? (
                  <Wifi className="h-3 w-3 mr-1" />
                ) : (
                  <WifiOff className="h-3 w-3 mr-1" />
                )}
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>

          {/* Route ID */}
          <Badge variant="outline" className="w-fit text-xs">
            Route: {route.id}
          </Badge>
        </motion.div>

        {/* Route Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {/* Progress */}
          <Card className="glass border-primary/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-xs">Progress</p>
              <Target className="h-4 w-4 text-primary/50" />
            </div>
            <p className="text-2xl font-bold text-primary font-mono">
              {completedStops}/{totalStops}
            </p>
            <Progress value={progressPercent} className="h-1.5 mt-2" />
          </Card>

          {/* Remaining Time */}
          <Card className="glass border-secondary/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-xs">Remaining</p>
              <Timer className="h-4 w-4 text-secondary/50" />
            </div>
            <p className="text-2xl font-bold text-secondary font-mono">
              {formatDuration(remainingMinutes)}
            </p>
            <p className="text-muted-foreground text-xs mt-1">{remainingStops} stops left</p>
          </Card>

          {/* Distance */}
          <Card className="glass border-blue-500/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-xs">Distance</p>
              <Route className="h-4 w-4 text-blue-400/50" />
            </div>
            <p className="text-2xl font-bold text-blue-400 font-mono">
              {route.totalDistance.toFixed(1)}
            </p>
            <p className="text-muted-foreground text-xs mt-1">miles total</p>
          </Card>

          {/* On-Time Rate */}
          <Card className="glass border-accent/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-xs">On-Time</p>
              <TrendingUp className="h-4 w-4 text-accent/50" />
            </div>
            <p className="text-2xl font-bold text-accent font-mono">
              {onTimePercent.toFixed(0)}%
            </p>
            <p className="text-muted-foreground text-xs mt-1">{onTimeDeliveries} of {completedStops}</p>
          </Card>
        </motion.div>

        {/* Current Stop - Prominent Display */}
        {currentStop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass border-blue-500/30 p-4 md:p-6 border-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {currentStop.status === "arrived" ? "Current Stop" : "Next Stop"}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    Stop #{currentStop.sequence}
                  </p>
                </div>
                <Badge className={`ml-auto ${getStatusColor(currentStop.status)}`}>
                  {currentStop.status === "arrived" ? "Arrived" : "En Route"}
                </Badge>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 mb-4">
                {currentStop.type === "commercial" ? (
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                ) : (
                  <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-foreground font-medium">{currentStop.address}</p>
                  <p className="text-muted-foreground text-sm">{currentStop.city}</p>
                </div>
              </div>

              {/* Time Window */}
              {currentStop.timeWindow && (
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Deliver by:</span>
                  <span className="text-foreground font-mono">
                    {currentStop.timeWindow.start} - {currentStop.timeWindow.end}
                  </span>
                </div>
              )}

              {/* Recipient */}
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{currentStop.recipient.name}</span>
              </div>

              {/* Packages */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {currentStop.packages.length} Package{currentStop.packages.length > 1 ? "s" : ""}
                </p>
                <div className="space-y-2">
                  {currentStop.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="glass-dark rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-foreground">{pkg.description}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {pkg.trackingNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pkg.requiresSignature && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                            Signature
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {pkg.weight} lbs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {currentStop.instructions && (
                <div className="glass-dark rounded-lg p-3 mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Delivery Instructions
                  </p>
                  <p className="text-foreground text-sm">{currentStop.instructions}</p>
                </div>
              )}

              <Separator className="my-4 bg-border/50" />

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Navigation */}
                <Button
                  variant="outline"
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 h-14"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Navigate
                </Button>

                {/* Customer Contact */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-secondary/30 text-secondary hover:bg-secondary/10 h-14"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass border-border">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Contact Customer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                      <Button className="w-full h-14 bg-primary/20 text-primary hover:bg-primary/30">
                        <Phone className="h-5 w-5 mr-2" />
                        Call {currentStop.recipient.phone || "Customer"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-14 border-secondary/30 text-secondary hover:bg-secondary/10"
                      >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Send SMS
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-3">
                {currentStop.status === "pending" ? (
                  <Button
                    onClick={() => handleArriveAtStop(currentStop.id)}
                    className="w-full h-14 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Mark as Arrived
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Complete Delivery */}
                    <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedStop(currentStop)}
                          className="w-full h-14 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                        >
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Complete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass border-border max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">
                            Proof of Delivery
                          </DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="confirm" className="mt-4">
                          <TabsList className="glass w-full">
                            <TabsTrigger value="confirm" className="flex-1">
                              Confirm
                            </TabsTrigger>
                            <TabsTrigger value="scan" className="flex-1">
                              Scan
                            </TabsTrigger>
                            <TabsTrigger value="signature" className="flex-1">
                              Sign
                            </TabsTrigger>
                            <TabsTrigger value="photo" className="flex-1">
                              Photo
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="confirm" className="space-y-4 mt-4">
                            <div>
                              <label className="text-sm text-muted-foreground">
                                Recipient Name
                              </label>
                              <Input
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                placeholder="Who received the package?"
                                className="mt-1 bg-background/50"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">
                                Delivery Notes (Optional)
                              </label>
                              <Textarea
                                value={deliveryNotes}
                                onChange={(e) => setDeliveryNotes(e.target.value)}
                                placeholder="Any notes about the delivery..."
                                className="mt-1 bg-background/50"
                                rows={3}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="scan" className="mt-4">
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                Scan packages to confirm delivery:
                              </p>
                              {currentStop?.packages.map((pkg) => (
                                <div
                                  key={pkg.id}
                                  className={`glass-dark rounded-lg p-3 flex items-center justify-between ${
                                    scannedPackages.includes(pkg.trackingNumber)
                                      ? "border border-primary/50"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {scannedPackages.includes(pkg.trackingNumber) ? (
                                      <CheckCircle2 className="h-5 w-5 text-primary" />
                                    ) : (
                                      <Package className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <span className="text-sm font-mono">
                                      {pkg.trackingNumber}
                                    </span>
                                  </div>
                                  {!scannedPackages.includes(pkg.trackingNumber) && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleScanPackage(pkg.trackingNumber)}
                                      className="border-primary/30"
                                    >
                                      <QrCode className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                className="w-full h-12 border-primary/30"
                                onClick={() => setShowScanner(true)}
                              >
                                <QrCode className="h-5 w-5 mr-2" />
                                Open Scanner
                              </Button>
                            </div>
                          </TabsContent>

                          <TabsContent value="signature" className="mt-4">
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                Have customer sign below:
                              </p>
                              <div className="glass-dark rounded-lg h-40 flex items-center justify-center border-2 border-dashed border-border">
                                <div className="text-center text-muted-foreground">
                                  <Pen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">Signature Pad</p>
                                  <p className="text-xs">(Tap to sign)</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border"
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Clear
                              </Button>
                            </div>
                          </TabsContent>

                          <TabsContent value="photo" className="mt-4">
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                Take a photo as proof:
                              </p>
                              <div className="glass-dark rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-border">
                                <div className="text-center text-muted-foreground">
                                  <Camera className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">Photo Preview</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                className="w-full h-12 border-primary/30"
                              >
                                <Camera className="h-5 w-5 mr-2" />
                                Take Photo
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="mt-6">
                          <Button
                            onClick={() =>
                              currentStop && handleCompleteDelivery(currentStop.id)
                            }
                            className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Check className="h-5 w-5 mr-2" />
                            Confirm Delivery
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Exception */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-14 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Exception
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass border-border">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">
                            Delivery Exception
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 mt-4">
                          {[
                            "Customer Not Available",
                            "Wrong Address",
                            "Access Denied",
                            "Damaged Package",
                            "Refused by Customer",
                            "Other",
                          ].map((reason) => (
                            <Button
                              key={reason}
                              variant="outline"
                              className="w-full h-12 justify-start border-border hover:border-red-500/30 hover:text-red-400"
                              onClick={() => {
                                if (currentStop) handleFailDelivery(currentStop.id)
                              }}
                            >
                              {reason}
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Map View (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Route Map</h3>
              <Badge variant="outline" className="text-xs">
                {totalStops} stops
              </Badge>
            </div>
            <div className="relative rounded-lg overflow-hidden bg-muted/20 h-48 md:h-64">
              {/* Map placeholder with route visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Map View</p>
                  <p className="text-xs opacity-50">Interactive route display</p>
                </div>
              </div>
              {/* Route line visualization */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                <path
                  d="M 50,150 Q 100,50 150,100 T 250,80 T 350,120"
                  fill="none"
                  stroke="hsl(var(--primary) / 0.3)"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                />
                {/* Stop markers */}
                {route.stops.map((stop, idx) => {
                  const x = 50 + (idx * 300) / (totalStops - 1)
                  const y = 100 + Math.sin(idx * 0.8) * 40
                  return (
                    <circle
                      key={stop.id}
                      cx={x}
                      cy={y}
                      r={stop.status === "arrived" ? 10 : 6}
                      className={
                        stop.status === "completed"
                          ? "fill-primary"
                          : stop.status === "arrived"
                          ? "fill-blue-400"
                          : stop.status === "failed"
                          ? "fill-red-400"
                          : "fill-muted-foreground/50"
                      }
                    />
                  )
                })}
              </svg>
            </div>
          </Card>
        </motion.div>

        {/* Stop List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass border-border">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">All Stops</h3>
            </div>
            <ScrollArea className="h-[400px] md:h-[500px]">
              <div className="p-4 space-y-3">
                <AnimatePresence>
                  {route.stops.map((stop, idx) => (
                    <motion.div
                      key={stop.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                    >
                      <div
                        className={`glass-dark rounded-lg overflow-hidden transition-all ${
                          stop.status === "arrived"
                            ? "border-2 border-blue-500/50"
                            : "border border-border/50"
                        }`}
                      >
                        {/* Stop Header */}
                        <button
                          onClick={() =>
                            setExpandedStopId(
                              expandedStopId === stop.id ? null : stop.id
                            )
                          }
                          className="w-full p-4 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground mb-1">
                                #{stop.sequence}
                              </span>
                              {getStatusIcon(stop.status)}
                            </div>
                            <div>
                              <p className="text-foreground font-medium text-sm">
                                {stop.address}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {stop.recipient.name}
                                {stop.timeWindow && (
                                  <span className="ml-2">
                                    • {stop.timeWindow.start}-{stop.timeWindow.end}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getStatusColor(stop.status)}`}>
                              {stop.status}
                            </Badge>
                            {expandedStopId === stop.id ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </button>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {expandedStopId === stop.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-3">
                                <Separator className="bg-border/50" />

                                {/* Packages */}
                                <div>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    Packages ({stop.packages.length})
                                  </p>
                                  {stop.packages.map((pkg) => (
                                    <div
                                      key={pkg.id}
                                      className="flex items-center justify-between py-1"
                                    >
                                      <span className="text-sm text-foreground">
                                        {pkg.description}
                                      </span>
                                      <span className="text-xs text-muted-foreground font-mono">
                                        {pkg.trackingNumber}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {/* Instructions */}
                                {stop.instructions && (
                                  <div className="bg-muted/30 rounded p-2">
                                    <p className="text-xs text-muted-foreground">
                                      {stop.instructions}
                                    </p>
                                  </div>
                                )}

                                {/* Proof (if completed) */}
                                {stop.proof && (
                                  <div className="bg-primary/10 rounded p-2">
                                    <p className="text-xs text-primary">
                                      Delivered to: {stop.proof.recipientName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {stop.proof.timestamp &&
                                        new Date(stop.proof.timestamp).toLocaleTimeString()}
                                    </p>
                                  </div>
                                )}

                                {/* Quick Actions for non-current stops */}
                                {stop.status === "pending" &&
                                  stop.id !== currentStop?.id && (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 border-blue-500/30 text-blue-400"
                                      >
                                        <Navigation className="h-4 w-4 mr-1" />
                                        Navigate
                                      </Button>
                                      {stop.recipient.phone && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-secondary/30 text-secondary"
                                        >
                                          <Phone className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </Card>
        </motion.div>

        {/* Route Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass border-border p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Route Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary font-mono">
                  {completedStops}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400 font-mono">
                  {route.stops.filter((s) => s.status === "arrived").length}
                </p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground font-mono">
                  {route.stops.filter((s) => s.status === "pending").length}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400 font-mono">
                  {route.stops.filter((s) => s.status === "failed").length}
                </p>
                <p className="text-xs text-muted-foreground">Exceptions</p>
              </div>
            </div>

            <Separator className="my-4 bg-border/50" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-mono">
                    {route.startTime
                      ? formatTime(new Date(route.startTime))
                      : "--:--"}
                  </p>
                  <p className="text-xs text-muted-foreground">Started</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-foreground font-mono">
                    {formatDuration(
                      route.startTime
                        ? Math.round((Date.now() - route.startTime) / 60000)
                        : 0
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Elapsed</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground font-mono">
                    ~{formatTime(new Date(Date.now() + remainingMinutes * 60000))}
                  </p>
                  <p className="text-xs text-muted-foreground">ETA Complete</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Floating Quick Actions (Mobile) */}
        <div className="fixed bottom-6 left-4 right-4 md:hidden">
          <Card className="glass border-primary/30 p-2">
            <div className="flex items-center justify-around">
              <Button
                size="sm"
                variant="ghost"
                className="flex-col h-auto py-2 text-muted-foreground hover:text-primary"
              >
                <Route className="h-5 w-5 mb-1" />
                <span className="text-xs">Route</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="flex-col h-auto py-2 text-muted-foreground hover:text-primary"
              >
                <QrCode className="h-5 w-5 mb-1" />
                <span className="text-xs">Scan</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="flex-col h-auto py-2 text-blue-400"
              >
                <Navigation className="h-5 w-5 mb-1" />
                <span className="text-xs">Navigate</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="flex-col h-auto py-2 text-muted-foreground hover:text-primary"
              >
                <Phone className="h-5 w-5 mb-1" />
                <span className="text-xs">Call</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Bottom Spacing for Mobile Nav */}
        <div className="h-20 md:hidden" />
      </div>
    </div>
  )
}
