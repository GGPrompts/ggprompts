"use client"

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  Rocket,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Play,
  Pause,
  ExternalLink,
  Target,
  Flame,
  Globe,
  Info,
  Timer,
  Activity,
  X,
  Youtube,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface SpaceXTrackerProps {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
}

interface Launch {
  id: string
  name: string
  date_utc: string
  date_unix: number
  date_local: string
  date_precision: string
  static_fire_date_utc: string | null
  static_fire_date_unix: number | null
  tbd: boolean
  net: boolean
  window: number | null
  rocket: string
  success: boolean | null
  failures: Array<{
    time: number
    altitude: number | null
    reason: string
  }>
  upcoming: boolean
  details: string | null
  fairings: {
    reused: boolean | null
    recovery_attempt: boolean | null
    recovered: boolean | null
    ships: string[]
  } | null
  crew: string[]
  ships: string[]
  capsules: string[]
  payloads: string[]
  launchpad: string
  flight_number: number
  cores: Array<{
    core: string | null
    flight: number | null
    gridfins: boolean | null
    legs: boolean | null
    reused: boolean | null
    landing_attempt: boolean | null
    landing_success: boolean | null
    landing_type: string | null
    landpad: string | null
  }>
  links: {
    patch: {
      small: string | null
      large: string | null
    }
    reddit: {
      campaign: string | null
      launch: string | null
      media: string | null
      recovery: string | null
    }
    flickr: {
      small: string[]
      original: string[]
    }
    presskit: string | null
    webcast: string | null
    youtube_id: string | null
    article: string | null
    wikipedia: string | null
  }
  auto_update: boolean
}

interface Rocket {
  id: string
  name: string
  type: string
  active: boolean
  stages: number
  boosters: number
  cost_per_launch: number
  success_rate_pct: number
  first_flight: string
  country: string
  company: string
  height: { meters: number; feet: number }
  diameter: { meters: number; feet: number }
  mass: { kg: number; lb: number }
  description: string
}

interface Launchpad {
  id: string
  name: string
  full_name: string
  locality: string
  region: string
  timezone: string
  latitude: number
  longitude: number
  launch_attempts: number
  launch_successes: number
  status: string
}

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

const SPACEX_API_BASE = "https://api.spacexdata.com/v5"

// ============================================================================
// HOOKS
// ============================================================================

function useCountdown(targetDate: string | null): CountdownTime {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })

  useEffect(() => {
    if (!targetDate) return

    const calculateCountdown = () => {
      const now = Date.now()
      const target = new Date(targetDate).getTime()
      const diff = target - now

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds, total: diff }
    }

    setCountdown(calculateCountdown())

    const interval = setInterval(() => {
      setCountdown(calculateCountdown())
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return countdown
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}

function padNumber(num: number): string {
  return num.toString().padStart(2, "0")
}

// ============================================================================
// VIDEO PLAYER MODAL COMPONENT
// ============================================================================

interface VideoPlayerModalProps {
  youtubeId: string | null
  title: string
  onClose: () => void
}

function VideoPlayerModal({ youtubeId, title, onClose }: VideoPlayerModalProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  // Tilt toward cursor - card "follows" the mouse position
  const rotateX = useSpring(useTransform(y, [-200, 200], [-8, 8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-200, 200], [8, -8]), { stiffness: 300, damping: 30 })
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle mouse movement for 3D effect
  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!modalRef.current) return
    const rect = modalRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  if (!youtubeId) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Floating ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-10%", "10%", "-10%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ left: "30%", top: "20%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]"
          animate={{
            x: ["20%", "-20%", "20%"],
            y: ["10%", "-10%", "10%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ right: "20%", bottom: "20%" }}
        />
      </div>

      {/* Modal content with 3D effect */}
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        className="relative w-full max-w-5xl"
      >
        {/* Card with depth effect */}
        <div style={{ transform: "translateZ(40px)" }}>
          <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-black/60 backdrop-blur-xl shadow-2xl shadow-primary/20">
            {/* Header bar with window controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                  />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-muted-foreground truncate max-w-[300px] md:max-w-none">
                    {title}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Video embed */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Footer with actions */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-t border-primary/20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Rocket className="w-3 h-3 text-primary" />
                <span>SpaceX Webcast</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-primary/30 text-primary hover:bg-primary/10 text-xs"
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open on YouTube
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection/glow effect */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"
          style={{ transform: "translateZ(20px)" }}
        />
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SpaceXTracker({ activeSubItem, onSubItemHandled }: SpaceXTrackerProps) {
  const queryClient = useQueryClient()

  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null)
  const [expandedLaunchId, setExpandedLaunchId] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [videoModal, setVideoModal] = useState<{ youtubeId: string; title: string } | null>(null)

  // Handle sub-item navigation
  useEffect(() => {
    if (activeSubItem) {
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Fetch next launch
  const { data: nextLaunch, isLoading: nextLoading, refetch: refetchNext } = useQuery<Launch>({
    queryKey: ["spacex-next"],
    queryFn: async () => {
      const res = await fetch(`${SPACEX_API_BASE}/launches/next`)
      if (!res.ok) throw new Error("Failed to fetch next launch")
      return res.json()
    },
    refetchInterval: isLive ? 60000 : false,
    staleTime: 30000,
  })

  // Fetch upcoming launches
  const { data: upcomingLaunches, isLoading: upcomingLoading, refetch: refetchUpcoming } = useQuery<Launch[]>({
    queryKey: ["spacex-upcoming"],
    queryFn: async () => {
      const res = await fetch(`${SPACEX_API_BASE}/launches/upcoming`)
      if (!res.ok) throw new Error("Failed to fetch upcoming launches")
      const data = await res.json()
      // Sort by date
      return data.sort((a: Launch, b: Launch) => a.date_unix - b.date_unix)
    },
    refetchInterval: isLive ? 60000 : false,
    staleTime: 30000,
  })

  // Fetch past launches (limited to recent 10)
  const { data: pastLaunches, isLoading: pastLoading, refetch: refetchPast } = useQuery<Launch[]>({
    queryKey: ["spacex-past"],
    queryFn: async () => {
      const res = await fetch(`${SPACEX_API_BASE}/launches/past`)
      if (!res.ok) throw new Error("Failed to fetch past launches")
      const data = await res.json()
      // Sort by date descending and limit to 10
      return data.sort((a: Launch, b: Launch) => b.date_unix - a.date_unix).slice(0, 10)
    },
    staleTime: 300000, // 5 minutes
  })

  // Fetch rockets for display
  const { data: rockets } = useQuery<Rocket[]>({
    queryKey: ["spacex-rockets"],
    queryFn: async () => {
      const res = await fetch(`${SPACEX_API_BASE}/rockets`)
      if (!res.ok) throw new Error("Failed to fetch rockets")
      return res.json()
    },
    staleTime: 3600000, // 1 hour
  })

  // Fetch launchpads for display
  const { data: launchpads } = useQuery<Launchpad[]>({
    queryKey: ["spacex-launchpads"],
    queryFn: async () => {
      const res = await fetch(`${SPACEX_API_BASE}/launchpads`)
      if (!res.ok) throw new Error("Failed to fetch launchpads")
      return res.json()
    },
    staleTime: 3600000, // 1 hour
  })

  // Create lookup maps
  const rocketMap = useMemo(() => {
    const map = new Map<string, Rocket>()
    rockets?.forEach((r) => map.set(r.id, r))
    return map
  }, [rockets])

  const launchpadMap = useMemo(() => {
    const map = new Map<string, Launchpad>()
    launchpads?.forEach((l) => map.set(l.id, l))
    return map
  }, [launchpads])

  // Countdown to next launch
  const countdown = useCountdown(nextLaunch?.date_utc || null)

  // Calculate statistics
  const stats = useMemo(() => {
    if (!pastLaunches) return { total: 0, successful: 0, failed: 0, successRate: 0 }

    const successful = pastLaunches.filter((l) => l.success === true).length
    const failed = pastLaunches.filter((l) => l.success === false).length
    const total = pastLaunches.length
    const successRate = total > 0 ? (successful / total) * 100 : 0

    return { total, successful, failed, successRate }
  }, [pastLaunches])

  // Refresh all data
  const handleRefresh = useCallback(() => {
    refetchNext()
    refetchUpcoming()
    refetchPast()
  }, [refetchNext, refetchUpcoming, refetchPast])

  // Toggle launch expansion
  const toggleLaunchExpansion = (launchId: string) => {
    setExpandedLaunchId(expandedLaunchId === launchId ? null : launchId)
  }

  // Get rocket name by ID
  const getRocketName = (rocketId: string): string => {
    return rocketMap.get(rocketId)?.name || "Unknown Rocket"
  }

  // Get launchpad info by ID
  const getLaunchpad = (launchpadId: string): Launchpad | undefined => {
    return launchpadMap.get(launchpadId)
  }

  // Loading state
  const isLoading = nextLoading || upcomingLoading || pastLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground terminal-glow">SpaceX Launch Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time launch data from SpaceX</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="gap-1">
            <Rocket className="h-3 w-3" />
            {upcomingLaunches?.length || 0} Upcoming
          </Badge>
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-2"
          >
            {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isLive ? "Live" : "Paused"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Next Launch Countdown */}
      {nextLaunch && (
        <Card className="glass border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl terminal-glow">{nextLaunch.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Flight #{nextLaunch.flight_number} - {getRocketName(nextLaunch.rocket)}
                  </p>
                </div>
              </div>
              {nextLaunch.links.youtube_id && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setVideoModal({ youtubeId: nextLaunch.links.youtube_id!, title: nextLaunch.name })}
                >
                  <Play className="h-4 w-4" />
                  Watch Webcast
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Countdown Display */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hours" },
                { value: countdown.minutes, label: "Minutes" },
                { value: countdown.seconds, label: "Seconds" },
              ].map((unit) => (
                <motion.div
                  key={unit.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.p
                    key={unit.value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-foreground terminal-glow font-mono"
                  >
                    {padNumber(unit.value)}
                  </motion.p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{unit.label}</p>
                </motion.div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Launch Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Launch Date</p>
                  <p className="font-semibold">{formatDate(nextLaunch.date_utc)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Launch Time</p>
                  <p className="font-semibold">{formatTime(nextLaunch.date_utc)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Launchpad</p>
                  <p className="font-semibold truncate">
                    {getLaunchpad(nextLaunch.launchpad)?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* TBD Warning */}
            {nextLaunch.tbd && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-amber-500">
                <Info className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">Launch date/time is tentative and subject to change</p>
              </div>
            )}

            {/* Details */}
            {nextLaunch.details && (
              <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">{nextLaunch.details}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Launches</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {upcomingLaunches?.length || 0}
                </p>
              </div>
              <Timer className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recent Successful</p>
                <p className="mt-2 text-3xl font-bold text-emerald-500">{stats.successful}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recent Failed</p>
                <p className="mt-2 text-3xl font-bold text-red-500">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate (Recent)</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {stats.successRate.toFixed(1)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-cyan-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabbed Launches */}
      <Card className="glass border-border">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upcoming" | "past")}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="upcoming" className="gap-2">
                <Rocket className="h-4 w-4" />
                Upcoming ({upcomingLaunches?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="past" className="gap-2">
                <Globe className="h-4 w-4" />
                Past ({pastLaunches?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4">
              <ScrollArea className="h-[500px]">
                {upcomingLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : upcomingLaunches && upcomingLaunches.length > 0 ? (
                  <div className="space-y-3 pr-4">
                    <AnimatePresence mode="popLayout">
                      {upcomingLaunches.map((launch, index) => (
                        <LaunchCard
                          key={launch.id}
                          launch={launch}
                          index={index}
                          isExpanded={expandedLaunchId === launch.id}
                          onToggle={() => toggleLaunchExpansion(launch.id)}
                          getRocketName={getRocketName}
                          getLaunchpad={getLaunchpad}
                          isUpcoming={true}
                          onWatchVideo={(youtubeId, title) => setVideoModal({ youtubeId, title })}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Rocket className="h-8 w-8 mb-2" />
                    <p>No upcoming launches</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              <ScrollArea className="h-[500px]">
                {pastLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : pastLaunches && pastLaunches.length > 0 ? (
                  <div className="space-y-3 pr-4">
                    <AnimatePresence mode="popLayout">
                      {pastLaunches.map((launch, index) => (
                        <LaunchCard
                          key={launch.id}
                          launch={launch}
                          index={index}
                          isExpanded={expandedLaunchId === launch.id}
                          onToggle={() => toggleLaunchExpansion(launch.id)}
                          getRocketName={getRocketName}
                          getLaunchpad={getLaunchpad}
                          isUpcoming={false}
                          onWatchVideo={(youtubeId, title) => setVideoModal({ youtubeId, title })}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Globe className="h-8 w-8 mb-2" />
                    <p>No past launches found</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Video Player Modal */}
      <AnimatePresence>
        {videoModal && (
          <VideoPlayerModal
            youtubeId={videoModal.youtubeId}
            title={videoModal.title}
            onClose={() => setVideoModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// LAUNCH CARD COMPONENT
// ============================================================================

interface LaunchCardProps {
  launch: Launch
  index: number
  isExpanded: boolean
  onToggle: () => void
  getRocketName: (rocketId: string) => string
  getLaunchpad: (launchpadId: string) => Launchpad | undefined
  isUpcoming: boolean
  onWatchVideo?: (youtubeId: string, title: string) => void
}

function LaunchCard({
  launch,
  index,
  isExpanded,
  onToggle,
  getRocketName,
  getLaunchpad,
  isUpcoming,
  onWatchVideo,
}: LaunchCardProps) {
  const launchpad = getLaunchpad(launch.launchpad)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-lg border p-4 transition-all cursor-pointer ${
        isExpanded ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}
      onClick={onToggle}
    >
      {/* Main Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Mission Patch or Placeholder */}
          <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {launch.links.patch.small ? (
              <img
                src={launch.links.patch.small}
                alt={`${launch.name} patch`}
                className="h-full w-full object-contain"
              />
            ) : (
              <Rocket className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-foreground">{launch.name}</p>
              {!isUpcoming && (
                <Badge
                  variant={launch.success === true ? "default" : launch.success === false ? "destructive" : "secondary"}
                  className="h-5 text-xs"
                >
                  {launch.success === true ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Success
                    </>
                  ) : launch.success === false ? (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Failed
                    </>
                  ) : (
                    "Unknown"
                  )}
                </Badge>
              )}
              {isUpcoming && launch.tbd && (
                <Badge variant="outline" className="h-5 text-xs">
                  TBD
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Flight #{launch.flight_number} - {getRocketName(launch.rocket)}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(launch.date_utc)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(launch.date_utc)}
              </span>
            </div>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="flex-shrink-0">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Separator className="my-4" />

            {/* Launch Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Launchpad */}
              {launchpad && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Launchpad</p>
                    <p className="text-sm font-medium">{launchpad.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {launchpad.locality}, {launchpad.region}
                    </p>
                  </div>
                </div>
              )}

              {/* Core Recovery Info */}
              {launch.cores[0] && (
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Core Info</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {launch.cores[0].reused && (
                        <Badge variant="outline" className="h-5 text-xs">
                          Reused (Flight {launch.cores[0].flight})
                        </Badge>
                      )}
                      {launch.cores[0].landing_attempt && (
                        <Badge
                          variant={launch.cores[0].landing_success ? "default" : "secondary"}
                          className="h-5 text-xs"
                        >
                          {launch.cores[0].landing_type || "Landing"}
                          {launch.cores[0].landing_success !== null && (
                            launch.cores[0].landing_success ? " Success" : " Failed"
                          )}
                        </Badge>
                      )}
                      {launch.cores[0].gridfins && (
                        <Badge variant="outline" className="h-5 text-xs">Gridfins</Badge>
                      )}
                      {launch.cores[0].legs && (
                        <Badge variant="outline" className="h-5 text-xs">Legs</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mission Details */}
            {launch.details && (
              <div className="rounded-lg bg-muted/50 p-3 mb-4">
                <p className="text-sm text-muted-foreground">{launch.details}</p>
              </div>
            )}

            {/* Failure Details (for failed launches) */}
            {launch.failures && launch.failures.length > 0 && (
              <div className="rounded-lg bg-red-500/10 p-3 mb-4">
                <p className="text-sm font-medium text-red-500 mb-1">Failure Details</p>
                {launch.failures.map((failure, i) => (
                  <p key={i} className="text-sm text-red-500/80">
                    {failure.reason}
                    {failure.time && ` (T+${failure.time}s)`}
                    {failure.altitude && ` at ${failure.altitude}km`}
                  </p>
                ))}
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-2">
              {launch.links.youtube_id && onWatchVideo && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    onWatchVideo(launch.links.youtube_id!, launch.name)
                  }}
                >
                  <Play className="h-3 w-3" />
                  Watch Webcast
                </Button>
              )}
              {launch.links.article && (
                <Button variant="outline" size="sm" asChild className="gap-1">
                  <a href={launch.links.article} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className="h-3 w-3" />
                    Article
                  </a>
                </Button>
              )}
              {launch.links.wikipedia && (
                <Button variant="outline" size="sm" asChild className="gap-1">
                  <a href={launch.links.wikipedia} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <Globe className="h-3 w-3" />
                    Wikipedia
                  </a>
                </Button>
              )}
              {launch.links.reddit.launch && (
                <Button variant="outline" size="sm" asChild className="gap-1">
                  <a href={launch.links.reddit.launch} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <Flame className="h-3 w-3" />
                    Reddit
                  </a>
                </Button>
              )}
              {launch.links.presskit && (
                <Button variant="outline" size="sm" asChild className="gap-1">
                  <a href={launch.links.presskit} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <Info className="h-3 w-3" />
                    Press Kit
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
