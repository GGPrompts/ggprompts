"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Clock,
  Play,
  Pause,
  Hash,
  MapPin,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  Calendar,
  Filter,
  Download,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

// ============================================================================
// TYPES
// ============================================================================

type Platform = "twitter" | "instagram" | "linkedin" | "facebook" | "tiktok"
type ActionType = "like" | "comment" | "share" | "follow" | "post"
type Sentiment = "positive" | "neutral" | "negative"
type DeviceType = "mobile" | "desktop" | "tablet"

interface Metrics {
  followers: number
  engagementRate: number
  impressions: number
  clicks: number
  shares: number
  saves: number
  growthRate: number
}

interface Activity {
  id: string
  user: {
    name: string
    avatar: string
    handle: string
  }
  action: ActionType
  platform: Platform
  postPreview?: string
  engagement: number
  time: Date
}

interface TrendingTopic {
  hashtag: string
  mentions: number
  sentiment: Sentiment
  growth: number
  momentum: "rising" | "falling" | "stable"
}

interface Post {
  id: string
  platform: Platform
  type: "image" | "video" | "text" | "link"
  preview: string
  likes: number
  comments: number
  shares: number
  reach: number
  impressions: number
  posted: Date
}

interface Competitor {
  name: string
  followers: number
  engagementRate: number
  shareOfVoice: number
  growthVelocity: number
  contentFrequency: number
}

interface DemographicData {
  ageGroup: string
  percentage: number
}

interface LocationData {
  location: string
  percentage: number
  count: number
}

interface EngagementTimeData {
  hour: string
  engagement: number
  posts: number
}

// ============================================================================
// MOCK DATA & GENERATORS
// ============================================================================

const PLATFORM_COLORS: Record<Platform, string> = {
  twitter: "#1DA1F2",
  instagram: "#E4405F",
  linkedin: "#0A66C2",
  facebook: "#1877F2",
  tiktok: "#000000",
}

const INITIAL_METRICS: Metrics = {
  followers: 284392,
  engagementRate: 4.8,
  impressions: 1247000,
  clicks: 89234,
  shares: 12456,
  saves: 8923,
  growthRate: 3.2,
}

const TRENDING_TOPICS: TrendingTopic[] = [
  { hashtag: "#AI", mentions: 12300, sentiment: "positive", growth: 23.4, momentum: "rising" },
  { hashtag: "#MachineLearning", mentions: 8900, sentiment: "positive", growth: 18.2, momentum: "rising" },
  { hashtag: "#WebDev", mentions: 7600, sentiment: "neutral", growth: -2.1, momentum: "falling" },
  { hashtag: "#React", mentions: 6800, sentiment: "positive", growth: 12.8, momentum: "rising" },
  { hashtag: "#TypeScript", mentions: 5400, sentiment: "positive", growth: 8.3, momentum: "stable" },
  { hashtag: "#OpenSource", mentions: 4900, sentiment: "positive", growth: 15.6, momentum: "rising" },
  { hashtag: "#DevOps", mentions: 4200, sentiment: "neutral", growth: 5.1, momentum: "stable" },
  { hashtag: "#Cloud", mentions: 3800, sentiment: "positive", growth: 9.4, momentum: "rising" },
  { hashtag: "#DataScience", mentions: 3500, sentiment: "positive", growth: 11.2, momentum: "rising" },
  { hashtag: "#CyberSecurity", mentions: 3100, sentiment: "neutral", growth: 6.7, momentum: "stable" },
]

const COMPETITORS: Competitor[] = [
  {
    name: "TechLeader",
    followers: 512000,
    engagementRate: 3.2,
    shareOfVoice: 28.5,
    growthVelocity: 2.8,
    contentFrequency: 4.2,
  },
  {
    name: "InnovateCo",
    followers: 398000,
    engagementRate: 5.1,
    shareOfVoice: 22.3,
    growthVelocity: 4.1,
    contentFrequency: 3.8,
  },
  {
    name: "CodeMasters",
    followers: 287000,
    engagementRate: 4.6,
    shareOfVoice: 19.7,
    growthVelocity: 3.5,
    contentFrequency: 5.1,
  },
  {
    name: "DevHub",
    followers: 195000,
    engagementRate: 6.2,
    shareOfVoice: 15.8,
    growthVelocity: 5.3,
    contentFrequency: 2.9,
  },
]

const TOP_POSTS: Post[] = [
  {
    id: "post-1",
    platform: "twitter",
    type: "image",
    preview: "New AI features launch announcement",
    likes: 45000,
    comments: 2300,
    shares: 8900,
    reach: 523000,
    impressions: 789000,
    posted: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "post-2",
    platform: "instagram",
    type: "video",
    preview: "Behind the scenes: Product development",
    likes: 38000,
    comments: 1800,
    shares: 5600,
    reach: 412000,
    impressions: 687000,
    posted: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: "post-3",
    platform: "linkedin",
    type: "text",
    preview: "10 tips for developers in 2025",
    likes: 32000,
    comments: 1200,
    shares: 7800,
    reach: 398000,
    impressions: 592000,
    posted: new Date(Date.now() - 86400000 * 5),
  },
]

const AGE_DEMOGRAPHICS: DemographicData[] = [
  { ageGroup: "13-17", percentage: 8 },
  { ageGroup: "18-24", percentage: 28 },
  { ageGroup: "25-34", percentage: 35 },
  { ageGroup: "35-44", percentage: 18 },
  { ageGroup: "45-54", percentage: 8 },
  { ageGroup: "55+", percentage: 3 },
]

const TOP_LOCATIONS: LocationData[] = [
  { location: "United States", percentage: 42, count: 119000 },
  { location: "United Kingdom", percentage: 15, count: 42700 },
  { location: "Canada", percentage: 12, count: 34100 },
  { location: "Germany", percentage: 8, count: 22800 },
  { location: "India", percentage: 6, count: 17100 },
  { location: "Australia", percentage: 5, count: 14200 },
  { location: "France", percentage: 4, count: 11400 },
  { location: "Others", percentage: 8, count: 22800 },
]

const generateActivity = (platforms: Platform[]): Activity => {
  const platform = platforms[Math.floor(Math.random() * platforms.length)]
  const actions: ActionType[] = ["like", "comment", "share", "follow", "post"]
  const action = actions[Math.floor(Math.random() * actions.length)]
  const names = ["Alice Chen", "Bob Smith", "Carol Davis", "David Kim", "Emma Wilson", "Frank Brown"]
  const name = names[Math.floor(Math.random() * names.length)]

  return {
    id: Math.random().toString(36).substr(2, 9),
    user: {
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      handle: `@${name.toLowerCase().replace(" ", "")}`,
    },
    action,
    platform,
    postPreview: action === "post" ? "Just published a new article..." : undefined,
    engagement: Math.floor(Math.random() * 1000) + 50,
    time: new Date(),
  }
}

const ENGAGEMENT_BY_HOUR: EngagementTimeData[] = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  engagement: Math.floor(Math.random() * 5000) + 1000,
  posts: Math.floor(Math.random() * 20) + 5,
}))

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SocialAnalyticsDashboard() {
  const [isLive, setIsLive] = useState(true)
  const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS)
  const [activities, setActivities] = useState<Activity[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>(TRENDING_TOPICS)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">("all")
  const [sentimentScore, setSentimentScore] = useState(67)
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h")

  // Initialize activities
  useEffect(() => {
    const platforms: Platform[] = ["twitter", "instagram", "linkedin", "facebook", "tiktok"]
    const initialActivities = Array.from({ length: 50 }, () => generateActivity(platforms))
    setActivities(initialActivities.sort((a, b) => b.time.getTime() - a.time.getTime()))
  }, [])

  // Real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Update metrics
      setMetrics((prev) => ({
        followers: prev.followers + Math.floor(Math.random() * 10) - 3,
        engagementRate: Math.max(0, prev.engagementRate + (Math.random() - 0.5) * 0.1),
        impressions: prev.impressions + Math.floor(Math.random() * 1000),
        clicks: prev.clicks + Math.floor(Math.random() * 50),
        shares: prev.shares + Math.floor(Math.random() * 10),
        saves: prev.saves + Math.floor(Math.random() * 5),
        growthRate: Math.max(0, prev.growthRate + (Math.random() - 0.5) * 0.2),
      }))

      // Add new activity
      if (Math.random() > 0.3) {
        const platforms: Platform[] = ["twitter", "instagram", "linkedin", "facebook", "tiktok"]
        const newActivity = generateActivity(platforms)
        setActivities((prev) => [newActivity, ...prev.slice(0, 99)])
      }

      // Update trending topics
      setTrendingTopics((prev) =>
        prev.map((topic) => ({
          ...topic,
          mentions: topic.mentions + Math.floor(Math.random() * 50) - 20,
          growth: topic.growth + (Math.random() - 0.5) * 2,
        }))
      )

      // Update sentiment
      setSentimentScore((prev) => Math.max(-100, Math.min(100, prev + (Math.random() - 0.5) * 5)))

      setLastUpdate(new Date())
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [isLive])

  // Filtered activities
  const filteredActivities = useMemo(() => {
    if (selectedPlatform === "all") return activities
    return activities.filter((a) => a.platform === selectedPlatform)
  }, [activities, selectedPlatform])

  // Time ago helper
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(0)
  }

  // Get action icon
  const getActionIcon = (action: ActionType) => {
    switch (action) {
      case "like":
        return Heart
      case "comment":
        return MessageCircle
      case "share":
        return Share2
      case "follow":
        return Users
      case "post":
        return Activity
      default:
        return Activity
    }
  }

  // Sentiment color
  const getSentimentColor = (score: number) => {
    if (score > 40) return "text-primary"
    if (score < -40) return "text-red-500"
    return "text-slate-400"
  }

  // Device distribution
  const deviceData = [
    { name: "Mobile", value: 62, icon: Smartphone, color: "#10b981" },
    { name: "Desktop", value: 28, icon: Monitor, color: "#06b6d4" },
    { name: "Tablet", value: 10, icon: Tablet, color: "#8b5cf6" },
  ]

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Social Media Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time audience insights and engagement tracking</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge variant="outline" className="gap-1 hidden sm:flex">
            <Clock className="h-3 w-3" />
            Updated {timeAgo(lastUpdate)}
          </Badge>
          <div className="flex gap-1 rounded-lg border border-border bg-background p-1">
            {(["24h", "7d", "30d"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="px-2 sm:px-3"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-1 sm:gap-2"
          >
            {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="hidden sm:inline">{isLive ? "Live" : "Paused"}</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Followers</p>
                <motion.p
                  key={Math.floor(metrics.followers / 100)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-foreground"
                >
                  {formatNumber(metrics.followers)}
                </motion.p>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <ArrowUpRight className="h-3 w-3 text-primary" />
                  <span className="text-primary">+{formatNumber(1247)} today</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-secondary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <motion.p
                  key={Math.floor(metrics.engagementRate * 10)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-foreground"
                >
                  {metrics.engagementRate.toFixed(1)}%
                </motion.p>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <ArrowUpRight className="h-3 w-3 text-primary" />
                  <span className="text-primary">+0.3%</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <motion.p
                  key={Math.floor(metrics.impressions / 1000)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-foreground"
                >
                  {formatNumber(metrics.impressions)}
                </motion.p>
                <p className="mt-1 text-sm text-muted-foreground">Today</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <motion.p
                  key={Math.floor(metrics.growthRate * 10)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-primary"
                >
                  +{metrics.growthRate.toFixed(1)}%
                </motion.p>
                <p className="mt-1 text-sm text-muted-foreground">vs Yesterday</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Button
          variant={selectedPlatform === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedPlatform("all")}
        >
          All Platforms
        </Button>
        {(["twitter", "instagram", "linkedin", "facebook", "tiktok"] as Platform[]).map((platform) => (
          <Button
            key={platform}
            variant={selectedPlatform === platform ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatform(platform)}
            className="capitalize"
          >
            {platform}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live Activity Feed */}
        <div className="lg:col-span-1">
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Live Activity Feed</CardTitle>
              <p className="text-sm text-muted-foreground">Real-time engagement updates</p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <AnimatePresence mode="popLayout">
                  {filteredActivities.map((activity) => {
                    const Icon = getActionIcon(activity.action)
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="mb-3 rounded-lg border border-border p-3"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                            <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">{activity.user.name}</p>
                              <Badge
                                variant="outline"
                                className="h-5 text-xs"
                                style={{ borderColor: PLATFORM_COLORS[activity.platform] }}
                              >
                                {activity.platform}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{activity.user.handle}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm capitalize">
                                {activity.action}
                                {activity.action === "post" && "ed"}
                                {activity.action !== "post" && "d"} your content
                              </p>
                            </div>
                            {activity.postPreview && (
                              <p className="mt-1 text-xs text-muted-foreground italic">
                                "{activity.postPreview}"
                              </p>
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">{timeAgo(activity.time)}</p>
                              <Badge variant="secondary" className="h-5 text-xs">
                                <Heart className="mr-1 h-3 w-3" />
                                {formatNumber(activity.engagement)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Charts */}
        <div className="space-y-6 lg:col-span-2">
          {/* Engagement Timeline */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Engagement Timeline (24h)</CardTitle>
              <p className="text-sm text-muted-foreground">Peak activity hours and optimal posting times</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <div className="min-w-[500px] h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ENGAGEMENT_BY_HOUR}>
                    <defs>
                      <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value, index) => (index % 4 === 0 ? value : "")}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#engagementGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    Peak: <span className="font-semibold text-foreground">14:00 - 16:00</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-muted-foreground">
                    Best time to post: <span className="font-semibold text-foreground">15:00</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Trending Topics</CardTitle>
                  <p className="text-sm text-muted-foreground">Top hashtags and their momentum</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {trendingTopics.map((topic, index) => (
                    <motion.div
                      key={topic.hashtag}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-lg border border-border p-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-xs sm:text-sm font-bold text-primary">#{index + 1}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                              <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-secondary shrink-0" />
                              <p className="font-semibold text-sm truncate">{topic.hashtag}</p>
                              <Badge
                                variant={
                                  topic.sentiment === "positive"
                                    ? "default"
                                    : topic.sentiment === "negative"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className="h-5 text-xs hidden sm:flex"
                              >
                                {topic.sentiment === "positive" && <ThumbsUp className="mr-1 h-3 w-3" />}
                                {topic.sentiment === "negative" && <ThumbsDown className="mr-1 h-3 w-3" />}
                                {topic.sentiment === "neutral" && <Minus className="mr-1 h-3 w-3" />}
                                {topic.sentiment}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatNumber(topic.mentions)} mentions
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            topic.momentum === "rising"
                              ? "default"
                              : topic.momentum === "falling"
                                ? "destructive"
                                : "secondary"
                          }
                          className="gap-1 self-end sm:self-auto shrink-0"
                        >
                          {topic.momentum === "rising" && <TrendingUp className="h-3 w-3" />}
                          {topic.momentum === "falling" && <TrendingDown className="h-3 w-3" />}
                          {topic.momentum === "stable" && <Minus className="h-3 w-3" />}
                          {topic.growth >= 0 ? "+" : ""}
                          {topic.growth.toFixed(1)}%
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">Overall audience sentiment and reactions</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-4 text-center">
                    <motion.p
                      key={Math.floor(sentimentScore / 5)}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-5xl font-bold ${getSentimentColor(sentimentScore)}`}
                    >
                      {sentimentScore > 0 ? "+" : ""}
                      {sentimentScore.toFixed(0)}
                    </motion.p>
                    <p className="mt-2 text-sm text-muted-foreground">Sentiment Score</p>
                  </div>
                  <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((sentimentScore + 100) / 200) * 100}%` }}
                      className={`h-full ${
                        sentimentScore > 40
                          ? "bg-primary"
                          : sentimentScore < -40
                            ? "bg-red-500"
                            : "bg-slate-500"
                      }`}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span className="text-left">-100</span>
                    <span className="hidden sm:inline">Neutral (0)</span>
                    <span className="sm:hidden">0</span>
                    <span className="text-right">+100</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="rounded-lg border border-primary/30 bg-primary/10 p-2 sm:p-3 text-center">
                  <ThumbsUp className="mx-auto h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-primary">72%</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">Positive</p>
                </div>
                <div className="rounded-lg border border-slate-500/30 bg-slate-500/10 p-2 sm:p-3 text-center">
                  <Minus className="mx-auto h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-400">21%</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">Neutral</p>
                </div>
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 sm:p-3 text-center">
                  <ThumbsDown className="mx-auto h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                  <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-red-500">7%</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">Negative</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Demographics, Top Posts, Competitors */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Audience Demographics */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-lg">Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="age">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="age">Age</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="device">Device</TabsTrigger>
              </TabsList>
              <TabsContent value="age" className="mt-4">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={AGE_DEMOGRAPHICS}
                        cx="50%"
                        cy="55%"
                        labelLine={false}
                        label={(entry) => `${entry.ageGroup}: ${entry.percentage}%`}
                        outerRadius={65}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {AGE_DEMOGRAPHICS.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"][index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                        itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="location" className="mt-4">
                <div className="space-y-3">
                  {TOP_LOCATIONS.slice(0, 5).map((location, index) => (
                    <div key={location.location}>
                      <div className="mb-1 flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{location.location}</span>
                        </div>
                        <span className="font-semibold">{location.percentage}%</span>
                      </div>
                      <Progress value={location.percentage} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="device" className="mt-4">
                <div className="space-y-4">
                  {deviceData.map((device) => {
                    const Icon = device.icon
                    return (
                      <div key={device.name}>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" style={{ color: device.color }} />
                            <span className="text-sm">{device.name}</span>
                          </div>
                          <span className="text-sm font-semibold">{device.value}%</span>
                        </div>
                        <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${device.value}%` }}
                            style={{ backgroundColor: device.color }}
                            className="h-full"
                            transition={{ duration: 0.5, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Top Performing Posts */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TOP_POSTS.map((post, index) => (
                <div key={post.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" style={{ borderColor: PLATFORM_COLORS[post.platform] }}>
                          {post.platform}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {post.type}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm font-medium">{post.preview}</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>{formatNumber(post.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 text-secondary" />
                          <span>{formatNumber(post.comments)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-3 w-3 text-primary" />
                          <span>{formatNumber(post.shares)}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatNumber(post.impressions)} impressions • {timeAgo(post.posted)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competitor Comparison */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-lg">Competitor Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {COMPETITORS.map((competitor, index) => (
                <div key={competitor.name} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <span className="text-sm font-bold">#{index + 1}</span>
                      </div>
                      <p className="font-semibold">{competitor.name}</p>
                    </div>
                    <Badge variant="outline">{formatNumber(competitor.followers)}</Badge>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engagement Rate</span>
                      <span className="font-semibold">{competitor.engagementRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Share of Voice</span>
                      <span className="font-semibold">{competitor.shareOfVoice.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Growth Velocity</span>
                      <span className="font-semibold text-primary">
                        +{competitor.growthVelocity.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
