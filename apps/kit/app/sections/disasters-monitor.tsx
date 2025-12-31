"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertTriangle,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Globe,
  Waves,
  Info,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Filter,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface DisastersMonitorProps {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
}

interface EarthquakeProperties {
  mag: number
  place: string
  time: number
  updated: number
  url: string
  detail: string
  felt: number | null
  cdi: number | null
  mmi: number | null
  alert: string | null
  status: string
  tsunami: number
  sig: number
  net: string
  code: string
  ids: string
  sources: string
  types: string
  nst: number | null
  dmin: number | null
  rms: number | null
  gap: number | null
  magType: string
  type: string
  title: string
}

interface EarthquakeGeometry {
  type: string
  coordinates: [number, number, number] // [longitude, latitude, depth]
}

interface Earthquake {
  type: string
  properties: EarthquakeProperties
  geometry: EarthquakeGeometry
  id: string
}

interface EarthquakeResponse {
  type: string
  metadata: {
    generated: number
    url: string
    title: string
    status: number
    api: string
    count: number
  }
  features: Earthquake[]
}

type MagnitudeRange = "all" | "2.5-4" | "4-5" | "5-6" | "6+"

// API endpoints
const USGS_RECENT_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
const USGS_SIGNIFICANT_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

// Refresh interval: 5 minutes
const REFRESH_INTERVAL = 5 * 60 * 1000

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatNumber(num: number, decimals = 1): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function getMagnitudeColor(magnitude: number): string {
  if (magnitude < 4) return "text-emerald-500"
  if (magnitude < 5) return "text-yellow-500"
  if (magnitude < 6) return "text-orange-500"
  return "text-red-500"
}

function getMagnitudeBgColor(magnitude: number): string {
  if (magnitude < 4) return "bg-emerald-500/20 border-emerald-500/30"
  if (magnitude < 5) return "bg-yellow-500/20 border-yellow-500/30"
  if (magnitude < 6) return "bg-orange-500/20 border-orange-500/30"
  return "bg-red-500/20 border-red-500/30"
}

function getMagnitudeBadgeVariant(magnitude: number): "default" | "secondary" | "destructive" | "outline" {
  if (magnitude < 4) return "default"
  if (magnitude < 5) return "secondary"
  if (magnitude < 6) return "outline"
  return "destructive"
}

function getSeverityLabel(magnitude: number): string {
  if (magnitude < 4) return "Minor"
  if (magnitude < 5) return "Light"
  if (magnitude < 6) return "Moderate"
  if (magnitude < 7) return "Strong"
  if (magnitude < 8) return "Major"
  return "Great"
}

function formatDepth(depth: number): string {
  return `${formatNumber(depth, 1)} km`
}

function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S"
  const lonDir = lon >= 0 ? "E" : "W"
  return `${Math.abs(lat).toFixed(3)}${latDir}, ${Math.abs(lon).toFixed(3)}${lonDir}`
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DisastersMonitor({ activeSubItem, onSubItemHandled }: DisastersMonitorProps) {
  const [selectedQuake, setSelectedQuake] = useState<Earthquake | null>(null)
  const [activeTab, setActiveTab] = useState<"recent" | "significant">("recent")
  const [magnitudeFilter, setMagnitudeFilter] = useState<MagnitudeRange>("all")
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)

  // Handle sub-item navigation
  useEffect(() => {
    if (activeSubItem) {
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Fetch recent earthquakes (M2.5+ last 24h)
  const {
    data: recentData,
    isLoading: recentLoading,
    refetch: refetchRecent,
    dataUpdatedAt: recentUpdatedAt,
  } = useQuery<EarthquakeResponse>({
    queryKey: ["earthquakes-recent"],
    queryFn: async () => {
      const res = await fetch(USGS_RECENT_URL)
      if (!res.ok) throw new Error("Failed to fetch recent earthquakes")
      return res.json()
    },
    refetchInterval: isAutoRefresh ? REFRESH_INTERVAL : false,
    staleTime: 60000,
  })

  // Fetch significant earthquakes (past week)
  const {
    data: significantData,
    isLoading: significantLoading,
    refetch: refetchSignificant,
    dataUpdatedAt: significantUpdatedAt,
  } = useQuery<EarthquakeResponse>({
    queryKey: ["earthquakes-significant"],
    queryFn: async () => {
      const res = await fetch(USGS_SIGNIFICANT_URL)
      if (!res.ok) throw new Error("Failed to fetch significant earthquakes")
      return res.json()
    },
    refetchInterval: isAutoRefresh ? REFRESH_INTERVAL : false,
    staleTime: 60000,
  })

  // Filter earthquakes by magnitude
  const filteredRecentQuakes = useMemo(() => {
    if (!recentData?.features) return []

    return recentData.features.filter((quake) => {
      const mag = quake.properties.mag
      switch (magnitudeFilter) {
        case "2.5-4":
          return mag >= 2.5 && mag < 4
        case "4-5":
          return mag >= 4 && mag < 5
        case "5-6":
          return mag >= 5 && mag < 6
        case "6+":
          return mag >= 6
        default:
          return true
      }
    })
  }, [recentData, magnitudeFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!recentData?.features) {
      return {
        total: 0,
        minor: 0,
        light: 0,
        moderate: 0,
        strong: 0,
        avgMagnitude: 0,
        maxMagnitude: 0,
      }
    }

    const quakes = recentData.features
    const magnitudes = quakes.map((q) => q.properties.mag)

    return {
      total: quakes.length,
      minor: quakes.filter((q) => q.properties.mag < 4).length,
      light: quakes.filter((q) => q.properties.mag >= 4 && q.properties.mag < 5).length,
      moderate: quakes.filter((q) => q.properties.mag >= 5 && q.properties.mag < 6).length,
      strong: quakes.filter((q) => q.properties.mag >= 6).length,
      avgMagnitude: magnitudes.length > 0 ? magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length : 0,
      maxMagnitude: magnitudes.length > 0 ? Math.max(...magnitudes) : 0,
    }
  }, [recentData])

  // Get the active earthquakes list
  const activeQuakes = activeTab === "recent" ? filteredRecentQuakes : (significantData?.features || [])
  const isLoading = activeTab === "recent" ? recentLoading : significantLoading
  const lastUpdated = activeTab === "recent" ? recentUpdatedAt : significantUpdatedAt

  // Refresh handler
  const handleRefresh = () => {
    if (activeTab === "recent") {
      refetchRecent()
    } else {
      refetchSignificant()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground terminal-glow">Earthquake Monitor</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time seismic activity from USGS
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            Live Data
          </Badge>
          {lastUpdated && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              Updated {timeAgo(lastUpdated)}
            </Badge>
          )}
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isAutoRefresh ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
            {isAutoRefresh ? "Auto" : "Paused"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Earthquakes (24h)</p>
                <motion.p
                  key={stats.total}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-foreground"
                >
                  {stats.total}
                </motion.p>
              </div>
              <Globe className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Strongest</p>
                <motion.p
                  key={stats.maxMagnitude}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-2 text-3xl font-bold ${getMagnitudeColor(stats.maxMagnitude)}`}
                >
                  M{formatNumber(stats.maxMagnitude)}
                </motion.p>
              </div>
              <Zap className="h-8 w-8 text-orange-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <motion.p
                  key={Math.floor(stats.avgMagnitude * 10)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-foreground"
                >
                  M{formatNumber(stats.avgMagnitude)}
                </motion.p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Significant (7d)</p>
                <motion.p
                  key={significantData?.metadata?.count || 0}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-red-500"
                >
                  {significantData?.metadata?.count || 0}
                </motion.p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Magnitude Distribution */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Magnitude Distribution (24h)</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div
              className={`cursor-pointer rounded-lg border p-4 transition-all ${
                magnitudeFilter === "2.5-4" ? "border-emerald-500 bg-emerald-500/10" : "border-border hover:border-emerald-500/50"
              }`}
              onClick={() => setMagnitudeFilter(magnitudeFilter === "2.5-4" ? "all" : "2.5-4")}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Minor</span>
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                  2.5-4
                </Badge>
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-500">{stats.minor}</p>
            </div>

            <div
              className={`cursor-pointer rounded-lg border p-4 transition-all ${
                magnitudeFilter === "4-5" ? "border-yellow-500 bg-yellow-500/10" : "border-border hover:border-yellow-500/50"
              }`}
              onClick={() => setMagnitudeFilter(magnitudeFilter === "4-5" ? "all" : "4-5")}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Light</span>
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                  4-5
                </Badge>
              </div>
              <p className="mt-2 text-2xl font-bold text-yellow-500">{stats.light}</p>
            </div>

            <div
              className={`cursor-pointer rounded-lg border p-4 transition-all ${
                magnitudeFilter === "5-6" ? "border-orange-500 bg-orange-500/10" : "border-border hover:border-orange-500/50"
              }`}
              onClick={() => setMagnitudeFilter(magnitudeFilter === "5-6" ? "all" : "5-6")}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Moderate</span>
                <Badge variant="outline" className="bg-orange-500/20 text-orange-500 border-orange-500/30">
                  5-6
                </Badge>
              </div>
              <p className="mt-2 text-2xl font-bold text-orange-500">{stats.moderate}</p>
            </div>

            <div
              className={`cursor-pointer rounded-lg border p-4 transition-all ${
                magnitudeFilter === "6+" ? "border-red-500 bg-red-500/10" : "border-border hover:border-red-500/50"
              }`}
              onClick={() => setMagnitudeFilter(magnitudeFilter === "6+" ? "all" : "6+")}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Strong+</span>
                <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/30">
                  6+
                </Badge>
              </div>
              <p className="mt-2 text-2xl font-bold text-red-500">{stats.strong}</p>
            </div>
          </div>
          {magnitudeFilter !== "all" && (
            <div className="mt-4 flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Filtering by magnitude {magnitudeFilter}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMagnitudeFilter("all")}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Earthquakes List */}
        <div className="lg:col-span-2">
          <Card className="glass border-border">
            <CardHeader>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "recent" | "significant")}>
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="recent" className="gap-2">
                      <Clock className="h-4 w-4" />
                      Recent (24h)
                    </TabsTrigger>
                    <TabsTrigger value="significant" className="gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Significant (7d)
                    </TabsTrigger>
                  </TabsList>
                  <Badge variant="outline">
                    {activeQuakes.length} earthquakes
                  </Badge>
                </div>
              </Tabs>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : activeQuakes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Globe className="h-8 w-8 mb-2" />
                    <p>No earthquakes found</p>
                    <p className="text-xs">Try adjusting the filter</p>
                  </div>
                ) : (
                  <div className="space-y-3 px-3 py-2">
                    <AnimatePresence mode="popLayout">
                      {activeQuakes.map((quake) => {
                        const { properties: props, geometry, id } = quake
                        const [lon, lat, depth] = geometry.coordinates
                        const isSelected = selectedQuake?.id === id

                        return (
                          <motion.div
                            key={id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setSelectedQuake(isSelected ? null : quake)}
                            className={`cursor-pointer rounded-lg border p-4 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/10"
                                : `border-border hover:border-primary/50 ${getMagnitudeBgColor(props.mag)}`
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge
                                    variant={getMagnitudeBadgeVariant(props.mag)}
                                    className={`font-bold ${
                                      props.mag >= 6 ? "bg-red-500 text-white" : ""
                                    }`}
                                  >
                                    M{formatNumber(props.mag)}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {getSeverityLabel(props.mag)}
                                  </Badge>
                                  {props.tsunami === 1 && (
                                    <Badge variant="destructive" className="gap-1">
                                      <Waves className="h-3 w-3" />
                                      Tsunami
                                    </Badge>
                                  )}
                                  {props.alert && (
                                    <Badge
                                      variant="outline"
                                      className={
                                        props.alert === "red"
                                          ? "bg-red-500/20 text-red-500 border-red-500/30"
                                          : props.alert === "orange"
                                          ? "bg-orange-500/20 text-orange-500 border-orange-500/30"
                                          : props.alert === "yellow"
                                          ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                                          : "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                                      }
                                    >
                                      {props.alert.toUpperCase()} Alert
                                    </Badge>
                                  )}
                                </div>

                                <div className="mt-2 flex items-center gap-2 text-sm">
                                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <span className="text-foreground truncate">
                                    {props.place || "Unknown location"}
                                  </span>
                                </div>

                                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {timeAgo(props.time)}
                                  </span>
                                  <span>Depth: {formatDepth(depth)}</span>
                                  {props.felt && (
                                    <span className="text-cyan-500">
                                      {props.felt} felt reports
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1">
                                <span className={`text-2xl font-bold ${getMagnitudeColor(props.mag)}`}>
                                  {formatNumber(props.mag)}
                                </span>
                                {isSelected ? (
                                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <Separator className="my-4" />
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">Coordinates</p>
                                      <p className="font-semibold">{formatCoordinates(lat, lon)}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Depth</p>
                                      <p className="font-semibold">{formatDepth(depth)}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Time</p>
                                      <p className="font-semibold">{formatDateTime(props.time)}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Status</p>
                                      <p className="font-semibold capitalize">{props.status}</p>
                                    </div>
                                    {props.felt && (
                                      <div>
                                        <p className="text-muted-foreground">Felt Reports</p>
                                        <p className="font-semibold text-cyan-500">{props.felt}</p>
                                      </div>
                                    )}
                                    {props.cdi && (
                                      <div>
                                        <p className="text-muted-foreground">CDI (Intensity)</p>
                                        <p className="font-semibold">{formatNumber(props.cdi)}</p>
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-muted-foreground">Network</p>
                                      <p className="font-semibold uppercase">{props.net}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Magnitude Type</p>
                                      <p className="font-semibold uppercase">{props.magType}</p>
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <a
                                      href={props.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      View on USGS
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="space-y-6 lg:col-span-1">
          {/* Selected Earthquake Details */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Earthquake Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedQuake ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-4xl font-bold ${getMagnitudeColor(selectedQuake.properties.mag)}`}>
                      M{formatNumber(selectedQuake.properties.mag)}
                    </span>
                    <Badge variant="outline" className="text-sm">
                      {getSeverityLabel(selectedQuake.properties.mag)}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold text-foreground">
                        {selectedQuake.properties.place || "Unknown"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Latitude</p>
                        <p className="font-semibold">
                          {selectedQuake.geometry.coordinates[1].toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Longitude</p>
                        <p className="font-semibold">
                          {selectedQuake.geometry.coordinates[0].toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Depth</p>
                        <p className="font-semibold">
                          {formatDepth(selectedQuake.geometry.coordinates[2])}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold">
                          {timeAgo(selectedQuake.properties.time)}
                        </p>
                      </div>
                    </div>

                    {selectedQuake.properties.felt && (
                      <div>
                        <p className="text-sm text-muted-foreground">Felt Reports</p>
                        <p className="font-semibold text-cyan-500">
                          {selectedQuake.properties.felt} people
                        </p>
                      </div>
                    )}

                    {selectedQuake.properties.tsunami === 1 && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                        <Waves className="h-4 w-4" />
                        Tsunami warning issued
                      </div>
                    )}
                  </div>

                  <Separator />

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => window.open(selectedQuake.properties.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Full Details on USGS
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Info className="h-8 w-8 mb-2" />
                  <p>Select an earthquake</p>
                  <p className="text-xs">to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Magnitude Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-500">Minor (2.5-4)</span>
                  <span className="text-muted-foreground">Usually not felt</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500">Light (4-5)</span>
                  <span className="text-muted-foreground">Felt, minor damage</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500">Moderate (5-6)</span>
                  <span className="text-muted-foreground">Damage to buildings</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-500">Strong (6-7)</span>
                  <span className="text-muted-foreground">Severe damage</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-600">Major (7-8)</span>
                  <span className="text-muted-foreground">Widespread damage</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-700">Great (8+)</span>
                  <span className="text-muted-foreground">Near total destruction</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="text-xs text-muted-foreground">
                <p className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Data from USGS Earthquake Hazards Program
                </p>
                <p className="mt-1">Auto-refreshes every 5 minutes</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Significant */}
          {significantData && significantData.features.length > 0 && (
            <Card className="glass border-border border-red-500/30 bg-red-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-lg text-red-500">
                    Latest Significant
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {significantData.features[0] && (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedQuake(significantData.features[0])
                      setActiveTab("significant")
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-2xl font-bold ${getMagnitudeColor(significantData.features[0].properties.mag)}`}>
                        M{formatNumber(significantData.features[0].properties.mag)}
                      </span>
                      <Badge variant="destructive">{getSeverityLabel(significantData.features[0].properties.mag)}</Badge>
                    </div>
                    <p className="text-sm text-foreground">
                      {significantData.features[0].properties.place}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {timeAgo(significantData.features[0].properties.time)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
