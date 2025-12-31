"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FastForward,
  Grid3X3,
  Headphones,
  Heart,
  History,
  Home,
  List,
  ListMusic,
  Mic,
  Moon,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Radio,
  Rewind,
  Search,
  Settings,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  Sliders,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// TypeScript Interfaces
interface Chapter {
  id: string
  title: string
  startTime: number
}

interface Episode {
  id: string
  title: string
  description: string
  duration: number
  publishDate: string
  audioUrl: string
  isPlayed: boolean
  playProgress: number
  isDownloaded: boolean
  showNotes?: string
  chapters?: Chapter[]
}

interface Podcast {
  id: string
  title: string
  author: string
  description: string
  artwork: string
  category: string
  episodeCount: number
  latestEpisode: string
  isSubscribed: boolean
  rating?: number
  episodes?: Episode[]
}

interface PlaybackState {
  episode: Episode | null
  podcast: Podcast | null
  isPlaying: boolean
  progress: number
  speed: number
  volume: number
}

interface QueueItem {
  episode: Episode
  podcast: Podcast
}

// Format time helper
const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Format duration helper
const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hrs > 0) {
    return `${hrs}h ${mins}m`
  }
  return `${mins} min`
}

// Format date helper
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function PodcastApp() {
  // Mock Podcasts Data
  const [podcasts] = useState<Podcast[]>([
    {
      id: "pod-1",
      title: "Tech Frontiers",
      author: "Sarah Chen & Mike Rodriguez",
      description:
        "Weekly deep dives into emerging technologies, from AI breakthroughs to quantum computing, with industry experts and researchers.",
      artwork: "🎙️",
      category: "Technology",
      episodeCount: 234,
      latestEpisode: "2024-12-26",
      isSubscribed: true,
      rating: 4.8,
      episodes: [
        {
          id: "ep-1-1",
          title: "The AI Agent Revolution: What's Next?",
          description:
            "We explore how AI agents are transforming software development and what it means for the future of work.",
          duration: 3720,
          publishDate: "2024-12-26",
          audioUrl: "#",
          isPlayed: false,
          playProgress: 0,
          isDownloaded: true,
          showNotes:
            "In this episode, we discuss:\n- The rise of autonomous AI agents\n- How Claude Code is changing development\n- Interview with Dr. Emily Zhang on agent architectures\n- Predictions for 2025",
          chapters: [
            { id: "ch-1", title: "Introduction", startTime: 0 },
            { id: "ch-2", title: "The Agent Landscape", startTime: 420 },
            { id: "ch-3", title: "Interview: Dr. Emily Zhang", startTime: 1200 },
            { id: "ch-4", title: "Future Predictions", startTime: 2700 },
            { id: "ch-5", title: "Closing Thoughts", startTime: 3400 },
          ],
        },
        {
          id: "ep-1-2",
          title: "Quantum Computing: From Lab to Production",
          description:
            "A practical look at where quantum computing stands today and what problems it can actually solve.",
          duration: 4200,
          publishDate: "2024-12-19",
          audioUrl: "#",
          isPlayed: true,
          playProgress: 4200,
          isDownloaded: false,
        },
        {
          id: "ep-1-3",
          title: "The Future of Browser APIs",
          description:
            "WebGPU, WebCodecs, and the APIs that will power the next generation of web applications.",
          duration: 2880,
          publishDate: "2024-12-12",
          audioUrl: "#",
          isPlayed: true,
          playProgress: 1440,
          isDownloaded: false,
        },
      ],
    },
    {
      id: "pod-2",
      title: "Design Systems Daily",
      author: "Jordan Park",
      description:
        "Short daily episodes exploring design system patterns, component architecture, and scaling design across organizations.",
      artwork: "🎨",
      category: "Design",
      episodeCount: 412,
      latestEpisode: "2024-12-27",
      isSubscribed: true,
      rating: 4.9,
      episodes: [
        {
          id: "ep-2-1",
          title: "Glassmorphism in Production",
          description:
            "How to implement glassmorphism effects that are performant and accessible.",
          duration: 1080,
          publishDate: "2024-12-27",
          audioUrl: "#",
          isPlayed: false,
          playProgress: 0,
          isDownloaded: false,
        },
        {
          id: "ep-2-2",
          title: "Token Architecture Deep Dive",
          description: "Building a scalable design token system from scratch.",
          duration: 1320,
          publishDate: "2024-12-26",
          audioUrl: "#",
          isPlayed: false,
          playProgress: 540,
          isDownloaded: true,
        },
      ],
    },
    {
      id: "pod-3",
      title: "Startup Stories",
      author: "The Venture Pod",
      description:
        "Founders share their journey from idea to IPO, including the failures, pivots, and breakthroughs along the way.",
      artwork: "🚀",
      category: "Business",
      episodeCount: 89,
      latestEpisode: "2024-12-24",
      isSubscribed: true,
      rating: 4.7,
      episodes: [
        {
          id: "ep-3-1",
          title: "Building in Public: Lessons from a $10M ARR Journey",
          description:
            "How transparent building created a community that drove growth.",
          duration: 5400,
          publishDate: "2024-12-24",
          audioUrl: "#",
          isPlayed: false,
          playProgress: 0,
          isDownloaded: false,
        },
      ],
    },
    {
      id: "pod-4",
      title: "The Science Hour",
      author: "Dr. Alex Morrison",
      description:
        "Breaking down complex scientific discoveries into digestible explanations for curious minds.",
      artwork: "🔬",
      category: "Science",
      episodeCount: 156,
      latestEpisode: "2024-12-25",
      isSubscribed: false,
      rating: 4.6,
      episodes: [
        {
          id: "ep-4-1",
          title: "CRISPR 2.0: Gene Editing Gets Precise",
          description:
            "New developments in gene editing technology and their implications.",
          duration: 3000,
          publishDate: "2024-12-25",
          audioUrl: "#",
          isPlayed: false,
          playProgress: 0,
          isDownloaded: false,
        },
      ],
    },
    {
      id: "pod-5",
      title: "Mindful Developer",
      author: "Lisa Wang",
      description:
        "Combining software development with mindfulness practices for sustainable productivity and career growth.",
      artwork: "🧘",
      category: "Self-Improvement",
      episodeCount: 78,
      latestEpisode: "2024-12-23",
      isSubscribed: false,
      rating: 4.5,
      episodes: [
        {
          id: "ep-5-1",
          title: "Beating Burnout: A Developer's Guide",
          description:
            "Practical strategies for maintaining energy and enthusiasm in tech.",
          duration: 2400,
          publishDate: "2024-12-23",
          audioUrl: "#",
          isPlayed: false,
          playProgress: 0,
          isDownloaded: false,
        },
      ],
    },
    {
      id: "pod-6",
      title: "History Unplugged",
      author: "Prof. James Mitchell",
      description:
        "Exploring forgotten stories and hidden connections in world history.",
      artwork: "📜",
      category: "History",
      episodeCount: 203,
      latestEpisode: "2024-12-22",
      isSubscribed: false,
      rating: 4.8,
      episodes: [
        {
          id: "ep-6-1",
          title: "The Silk Road's Digital Echo",
          description:
            "How ancient trade networks mirror today's internet infrastructure.",
          duration: 3600,
          publishDate: "2024-12-22",
          audioUrl: "#",
          isPlayed: false,
          playProgress: 0,
          isDownloaded: false,
        },
      ],
    },
  ])

  // Playback State
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    episode: podcasts[0].episodes?.[0] || null,
    podcast: podcasts[0],
    isPlaying: false,
    progress: 1245,
    speed: 1,
    volume: 80,
  })

  // Queue State
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      episode: podcasts[1].episodes?.[0]!,
      podcast: podcasts[1],
    },
    {
      episode: podcasts[0].episodes?.[1]!,
      podcast: podcasts[0],
    },
  ])

  // Listening History
  const [history] = useState<QueueItem[]>([
    {
      episode: podcasts[0].episodes?.[1]!,
      podcast: podcasts[0],
    },
    {
      episode: podcasts[0].episodes?.[2]!,
      podcast: podcasts[0],
    },
  ])

  // Downloaded Episodes
  const [downloads] = useState<QueueItem[]>([
    {
      episode: podcasts[0].episodes?.[0]!,
      podcast: podcasts[0],
    },
    {
      episode: podcasts[1].episodes?.[1]!,
      podcast: podcasts[1],
    },
  ])

  // UI States
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [showChapters, setShowChapters] = useState(false)
  const [sleepTimer, setSleepTimer] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  // Categories
  const categories = [
    { name: "Technology", icon: Radio, count: 156 },
    { name: "Business", icon: TrendingUp, count: 89 },
    { name: "Science", icon: Sparkles, count: 124 },
    { name: "Design", icon: Grid3X3, count: 67 },
    { name: "Self-Improvement", icon: Heart, count: 98 },
    { name: "History", icon: BookOpen, count: 143 },
  ]

  // Speed options
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3]

  // Sleep timer options (in minutes)
  const sleepTimerOptions = [15, 30, 45, 60, 90, 120]

  // Subscribed podcasts
  const subscribedPodcasts = podcasts.filter((p) => p.isSubscribed)

  // Trending podcasts
  const trendingPodcasts = [...podcasts].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0)
  )

  // Search filtered podcasts
  const filteredPodcasts = podcasts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Play episode
  const playEpisode = (episode: Episode, podcast: Podcast) => {
    setPlaybackState((prev) => ({
      ...prev,
      episode,
      podcast,
      isPlaying: true,
      progress: episode.playProgress || 0,
    }))
  }

  // Toggle play/pause
  const togglePlay = () => {
    setPlaybackState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }))
  }

  // Skip forward/back
  const skipForward = () => {
    if (!playbackState.episode) return
    setPlaybackState((prev) => ({
      ...prev,
      progress: Math.min(prev.progress + 30, prev.episode?.duration || 0),
    }))
  }

  const skipBack = () => {
    setPlaybackState((prev) => ({
      ...prev,
      progress: Math.max(prev.progress - 15, 0),
    }))
  }

  // Change speed
  const changeSpeed = () => {
    const currentIndex = speedOptions.indexOf(playbackState.speed)
    const nextIndex = (currentIndex + 1) % speedOptions.length
    setPlaybackState((prev) => ({
      ...prev,
      speed: speedOptions[nextIndex],
    }))
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  // Add to queue
  const addToQueue = (episode: Episode, podcast: Podcast) => {
    setQueue((prev) => [...prev, { episode, podcast }])
  }

  // Remove from queue
  const removeFromQueue = (episodeId: string) => {
    setQueue((prev) => prev.filter((item) => item.episode.id !== episodeId))
  }

  // Simulate progress
  useEffect(() => {
    if (!playbackState.isPlaying || !playbackState.episode) return

    const interval = setInterval(() => {
      setPlaybackState((prev) => {
        if (prev.progress >= (prev.episode?.duration || 0)) {
          return { ...prev, isPlaying: false }
        }
        return {
          ...prev,
          progress: prev.progress + prev.speed,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [playbackState.isPlaying, playbackState.episode])

  // Current progress percentage
  const progressPercent = playbackState.episode
    ? (playbackState.progress / playbackState.episode.duration) * 100
    : 0

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
              Podcast App
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover, subscribe, and listen to your favorite shows
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search podcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass border-primary/30 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-primary/30 hover:bg-primary/10"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="home" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger
                  value="home"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </TabsTrigger>
                <TabsTrigger
                  value="discover"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Discover
                </TabsTrigger>
                <TabsTrigger
                  value="library"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Library
                </TabsTrigger>
                <TabsTrigger
                  value="queue"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  <ListMusic className="h-4 w-4 mr-2" />
                  Queue
                </TabsTrigger>
                <TabsTrigger
                  value="downloads"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Downloads
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Home Tab */}
            <TabsContent value="home" className="space-y-6">
              {/* Now Playing Card */}
              {playbackState.episode && playbackState.podcast && (
                <Card className="glass border-primary/30 p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 w-32 h-32 mx-auto md:mx-0 glass-dark rounded-xl flex items-center justify-center text-6xl">
                      {playbackState.podcast.artwork}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
                          Now Playing
                        </Badge>
                        <h2 className="text-xl font-bold text-foreground">
                          {playbackState.episode.title}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          {playbackState.podcast.title} •{" "}
                          {playbackState.podcast.author}
                        </p>
                      </div>

                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {playbackState.episode.description}
                      </p>

                      {/* Chapters */}
                      {playbackState.episode.chapters && (
                        <Collapsible
                          open={showChapters}
                          onOpenChange={setShowChapters}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-secondary hover:bg-secondary/10"
                            >
                              <List className="h-4 w-4 mr-2" />
                              {playbackState.episode.chapters.length} Chapters
                              <ChevronDown
                                className={`h-4 w-4 ml-2 transition-transform ${showChapters ? "rotate-180" : ""}`}
                              />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3">
                            <div className="space-y-2">
                              {playbackState.episode.chapters.map((chapter) => (
                                <button
                                  key={chapter.id}
                                  onClick={() =>
                                    setPlaybackState((prev) => ({
                                      ...prev,
                                      progress: chapter.startTime,
                                    }))
                                  }
                                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                                    playbackState.progress >= chapter.startTime
                                      ? "glass-dark text-primary"
                                      : "hover:bg-primary/5 text-muted-foreground"
                                  }`}
                                >
                                  <span className="text-sm">{chapter.title}</span>
                                  <span className="text-xs font-mono">
                                    {formatTime(chapter.startTime)}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Continue Listening */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Continue Listening
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((item, idx) => (
                    <motion.div
                      key={item.episode.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <Card
                        className="glass border-primary/30 p-4 cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => playEpisode(item.episode, item.podcast)}
                      >
                        <div className="flex gap-4">
                          <div className="w-16 h-16 glass-dark rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                            {item.podcast.artwork}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-medium text-sm truncate">
                              {item.episode.title}
                            </p>
                            <p className="text-muted-foreground text-xs truncate">
                              {item.podcast.title}
                            </p>
                            <div className="mt-2">
                              <Progress
                                value={
                                  (item.episode.playProgress /
                                    item.episode.duration) *
                                  100
                                }
                                className="h-1"
                              />
                              <p className="text-muted-foreground text-xs mt-1">
                                {formatDuration(
                                  item.episode.duration -
                                    item.episode.playProgress
                                )}{" "}
                                left
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Subscriptions */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-secondary" />
                  Your Subscriptions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {subscribedPodcasts.map((podcast, idx) => (
                    <motion.div
                      key={podcast.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Card
                        className="glass border-primary/30 p-4 cursor-pointer hover:border-primary/50 transition-all hover:scale-105"
                        onClick={() => setSelectedPodcast(podcast)}
                      >
                        <div className="w-full aspect-square glass-dark rounded-lg flex items-center justify-center text-4xl mb-3">
                          {podcast.artwork}
                        </div>
                        <p className="text-foreground font-medium text-sm truncate">
                          {podcast.title}
                        </p>
                        <p className="text-muted-foreground text-xs truncate">
                          {podcast.author}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* New Episodes */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  New Episodes
                </h3>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {subscribedPodcasts
                      .flatMap((p) =>
                        (p.episodes || []).map((e) => ({ episode: e, podcast: p }))
                      )
                      .sort(
                        (a, b) =>
                          new Date(b.episode.publishDate).getTime() -
                          new Date(a.episode.publishDate).getTime()
                      )
                      .slice(0, 10)
                      .map((item, idx) => (
                        <motion.div
                          key={item.episode.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="glass-dark border-primary/20 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 glass rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                              {item.podcast.artwork}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-foreground font-medium text-sm line-clamp-1">
                                    {item.episode.title}
                                  </p>
                                  <p className="text-muted-foreground text-xs">
                                    {item.podcast.title} •{" "}
                                    {formatDate(item.episode.publishDate)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {item.episode.playProgress > 0 &&
                                    item.episode.playProgress <
                                      item.episode.duration && (
                                      <div className="w-16">
                                        <Progress
                                          value={
                                            (item.episode.playProgress /
                                              item.episode.duration) *
                                            100
                                          }
                                          className="h-1"
                                        />
                                      </div>
                                    )}
                                  {item.episode.isPlayed && (
                                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                                      Played
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                                {item.episode.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <Button
                                  size="sm"
                                  className="bg-primary/20 text-primary hover:bg-primary/30 h-8"
                                  onClick={() =>
                                    playEpisode(item.episode, item.podcast)
                                  }
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  {item.episode.playProgress > 0
                                    ? "Resume"
                                    : "Play"}
                                </Button>
                                <span className="text-muted-foreground text-xs">
                                  {formatDuration(item.episode.duration)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-muted-foreground hover:text-foreground"
                                  onClick={() =>
                                    addToQueue(item.episode, item.podcast)
                                  }
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Queue
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Discover Tab */}
            <TabsContent value="discover" className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Browse Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category, idx) => {
                    const Icon = category.icon
                    return (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        <Card className="glass border-primary/30 p-4 cursor-pointer hover:border-primary/50 transition-all hover:scale-105 text-center">
                          <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="text-foreground font-medium text-sm">
                            {category.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {category.count} shows
                          </p>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Trending */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  Trending Now
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendingPodcasts.slice(0, 4).map((podcast, idx) => (
                    <motion.div
                      key={podcast.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <Card
                        className="glass border-secondary/30 p-5 cursor-pointer hover:border-secondary/50 transition-colors"
                        onClick={() => setSelectedPodcast(podcast)}
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 glass-dark rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                            {podcast.artwork}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                                #{idx + 1} Trending
                              </Badge>
                            </div>
                            <h4 className="text-foreground font-bold text-lg truncate">
                              {podcast.title}
                            </h4>
                            <p className="text-muted-foreground text-sm truncate">
                              {podcast.author}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                <span className="text-foreground text-sm font-mono">
                                  {podcast.rating}
                                </span>
                              </div>
                              <span className="text-muted-foreground text-sm">
                                {podcast.episodeCount} episodes
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Search Results for "{searchQuery}"
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPodcasts.map((podcast, idx) => (
                      <motion.div
                        key={podcast.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        <Card
                          className="glass border-primary/30 p-4 cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => setSelectedPodcast(podcast)}
                        >
                          <div className="flex gap-4">
                            <div className="w-16 h-16 glass-dark rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                              {podcast.artwork}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-foreground font-medium truncate">
                                {podcast.title}
                              </h4>
                              <p className="text-muted-foreground text-sm truncate">
                                {podcast.author}
                              </p>
                              <Badge className="mt-2 bg-muted text-muted-foreground border-border text-xs">
                                {podcast.category}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Shows */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  All Shows
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {podcasts.map((podcast, idx) => (
                    <motion.div
                      key={podcast.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                    >
                      <Card
                        className="glass border-primary/30 p-4 cursor-pointer hover:border-primary/50 transition-all hover:scale-105"
                        onClick={() => setSelectedPodcast(podcast)}
                      >
                        <div className="w-full aspect-square glass-dark rounded-lg flex items-center justify-center text-4xl mb-3">
                          {podcast.artwork}
                        </div>
                        <p className="text-foreground font-medium text-sm truncate">
                          {podcast.title}
                        </p>
                        <p className="text-muted-foreground text-xs truncate">
                          {podcast.author}
                        </p>
                        {podcast.isSubscribed && (
                          <Badge className="mt-2 bg-primary/20 text-primary border-primary/30 text-xs">
                            Subscribed
                          </Badge>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Library Tab */}
            <TabsContent value="library" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscriptions List */}
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <Headphones className="h-5 w-5" />
                    Subscriptions ({subscribedPodcasts.length})
                  </h3>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {subscribedPodcasts.map((podcast, idx) => (
                        <motion.div
                          key={podcast.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="glass-dark border-primary/20 rounded-lg p-4 cursor-pointer hover:border-primary/40 transition-colors"
                          onClick={() => setSelectedPodcast(podcast)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 glass rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                              {podcast.artwork}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground font-medium truncate">
                                {podcast.title}
                              </p>
                              <p className="text-muted-foreground text-sm truncate">
                                {podcast.episodeCount} episodes
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>

                {/* Listening Stats */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Listening Stats
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-dark rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-primary font-mono">
                          42
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Hours Listened
                        </p>
                      </div>
                      <div className="glass-dark rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-secondary font-mono">
                          127
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Episodes Played
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    <div>
                      <p className="text-foreground font-medium mb-3">
                        Top Categories
                      </p>
                      <div className="space-y-3">
                        {[
                          { name: "Technology", percent: 45, color: "primary" },
                          { name: "Design", percent: 30, color: "secondary" },
                          { name: "Business", percent: 25, color: "accent" },
                        ].map((cat) => (
                          <div key={cat.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-muted-foreground text-sm">
                                {cat.name}
                              </span>
                              <span className="text-foreground text-sm font-mono">
                                {cat.percent}%
                              </span>
                            </div>
                            <Progress value={cat.percent} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    <div>
                      <p className="text-foreground font-medium mb-3">
                        This Week
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground text-sm">
                            Daily Average
                          </span>
                        </div>
                        <span className="text-foreground font-mono">
                          1h 12m
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* History */}
              <Card className="glass border-accent/30 p-6">
                <h3 className="text-lg font-semibold text-accent mb-4 flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recently Played
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((item, idx) => (
                    <motion.div
                      key={item.episode.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="glass-dark border-accent/20 rounded-lg p-4"
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 glass rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                          {item.podcast.artwork}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-medium text-sm truncate">
                            {item.episode.title}
                          </p>
                          <p className="text-muted-foreground text-xs truncate">
                            {item.podcast.title}
                          </p>
                          {item.episode.playProgress < item.episode.duration && (
                            <div className="mt-2">
                              <Progress
                                value={
                                  (item.episode.playProgress /
                                    item.episode.duration) *
                                  100
                                }
                                className="h-1"
                              />
                            </div>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => playEpisode(item.episode, item.podcast)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Queue Tab */}
            <TabsContent value="queue" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <ListMusic className="h-5 w-5" />
                    Up Next ({queue.length} episodes)
                  </h3>
                  {queue.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setQueue([])}
                    >
                      Clear Queue
                    </Button>
                  )}
                </div>

                {queue.length === 0 ? (
                  <div className="text-center py-12">
                    <ListMusic className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Your queue is empty</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Add episodes to play them next
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {queue.map((item, idx) => (
                        <motion.div
                          key={item.episode.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="glass-dark border-primary/20 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground font-mono w-6 text-center">
                              {idx + 1}
                            </span>
                            <div className="w-12 h-12 glass rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                              {item.podcast.artwork}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground font-medium text-sm truncate">
                                {item.episode.title}
                              </p>
                              <p className="text-muted-foreground text-xs truncate">
                                {item.podcast.title} •{" "}
                                {formatDuration(item.episode.duration)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() =>
                                  playEpisode(item.episode, item.podcast)
                                }
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-red-400"
                                onClick={() => removeFromQueue(item.episode.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </Card>
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="glass border-primary/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">Downloaded</p>
                    <Download className="h-5 w-5 text-primary/50" />
                  </div>
                  <p className="text-2xl font-bold text-primary font-mono mt-1">
                    {downloads.length}
                  </p>
                  <p className="text-muted-foreground text-xs">episodes</p>
                </Card>
                <Card className="glass border-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">Storage Used</p>
                    <Sliders className="h-5 w-5 text-secondary/50" />
                  </div>
                  <p className="text-2xl font-bold text-secondary font-mono mt-1">
                    247 MB
                  </p>
                  <p className="text-muted-foreground text-xs">of 2 GB limit</p>
                </Card>
                <Card className="glass border-accent/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">Total Duration</p>
                    <Clock className="h-5 w-5 text-accent/50" />
                  </div>
                  <p className="text-2xl font-bold text-accent font-mono mt-1">
                    1h 24m
                  </p>
                  <p className="text-muted-foreground text-xs">of content</p>
                </Card>
              </div>

              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Downloaded Episodes
                </h3>

                {downloads.length === 0 ? (
                  <div className="text-center py-12">
                    <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No downloads yet</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Download episodes to listen offline
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {downloads.map((item, idx) => (
                      <motion.div
                        key={item.episode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="glass-dark border-primary/20 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 glass rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                            {item.podcast.artwork}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-medium text-sm">
                              {item.episode.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {item.podcast.title} •{" "}
                              {formatDuration(item.episode.duration)}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                124 MB
                              </Badge>
                              <span className="text-muted-foreground text-xs">
                                Downloaded{" "}
                                {formatDate(item.episode.publishDate)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() =>
                                playEpisode(item.episode, item.podcast)
                              }
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Podcast Detail Modal */}
        <AnimatePresence>
          {selectedPodcast && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedPodcast(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass border-primary/30 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-32 h-32 glass-dark rounded-xl flex items-center justify-center text-6xl flex-shrink-0">
                      {selectedPodcast.artwork}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {selectedPodcast.title}
                          </h2>
                          <p className="text-muted-foreground">
                            {selectedPodcast.author}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setSelectedPodcast(null)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge className="bg-muted text-muted-foreground border-border">
                          {selectedPodcast.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          <span className="text-foreground text-sm font-mono">
                            {selectedPodcast.rating}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {selectedPodcast.episodeCount} episodes
                        </span>
                      </div>
                      <Button
                        className={`mt-4 ${
                          selectedPodcast.isSubscribed
                            ? "bg-primary/20 text-primary hover:bg-primary/30"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {selectedPodcast.isSubscribed ? (
                          <>
                            <Headphones className="h-4 w-4 mr-2" />
                            Subscribed
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Subscribe
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-6">
                    {selectedPodcast.description}
                  </p>

                  <Separator className="bg-border/50 mb-4" />

                  <h3 className="text-foreground font-semibold mb-4">
                    Episodes
                  </h3>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3 pr-4">
                      {selectedPodcast.episodes?.map((episode, idx) => (
                        <div
                          key={episode.id}
                          className="glass-dark border-primary/20 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground font-medium text-sm">
                                {episode.title}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {formatDate(episode.publishDate)} •{" "}
                                {formatDuration(episode.duration)}
                              </p>
                            </div>
                            {episode.isDownloaded && (
                              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs ml-2">
                                <Download className="h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                            {episode.description}
                          </p>
                          {episode.playProgress > 0 &&
                            episode.playProgress < episode.duration && (
                              <Progress
                                value={
                                  (episode.playProgress / episode.duration) * 100
                                }
                                className="h-1 mb-3"
                              />
                            )}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-primary/20 text-primary hover:bg-primary/30 h-7"
                              onClick={() =>
                                playEpisode(episode, selectedPodcast)
                              }
                            >
                              <Play className="h-3 w-3 mr-1" />
                              {episode.playProgress > 0 ? "Resume" : "Play"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-muted-foreground"
                              onClick={() =>
                                addToQueue(episode, selectedPodcast)
                              }
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Queue
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-muted-foreground"
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass border-primary/30 rounded-xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Playback Settings
                    </h2>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowSettings(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Playback Speed */}
                    <div>
                      <label className="text-foreground font-medium text-sm mb-3 block">
                        Playback Speed
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {speedOptions.map((speed) => (
                          <Button
                            key={speed}
                            size="sm"
                            variant={
                              playbackState.speed === speed
                                ? "default"
                                : "outline"
                            }
                            className={
                              playbackState.speed === speed
                                ? "bg-primary text-primary-foreground"
                                : "border-primary/30"
                            }
                            onClick={() =>
                              setPlaybackState((prev) => ({ ...prev, speed }))
                            }
                          >
                            {speed}x
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Sleep Timer */}
                    <div>
                      <label className="text-foreground font-medium text-sm mb-3 block flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Sleep Timer
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={sleepTimer === null ? "default" : "outline"}
                          className={
                            sleepTimer === null
                              ? "bg-primary text-primary-foreground"
                              : "border-primary/30"
                          }
                          onClick={() => setSleepTimer(null)}
                        >
                          Off
                        </Button>
                        {sleepTimerOptions.map((mins) => (
                          <Button
                            key={mins}
                            size="sm"
                            variant={
                              sleepTimer === mins ? "default" : "outline"
                            }
                            className={
                              sleepTimer === mins
                                ? "bg-primary text-primary-foreground"
                                : "border-primary/30"
                            }
                            onClick={() => setSleepTimer(mins)}
                          >
                            {mins}m
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Skip Settings */}
                    <div>
                      <label className="text-foreground font-medium text-sm mb-3 block">
                        Skip Duration
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="glass-dark border-primary/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Rewind className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground text-sm">
                              Skip Back
                            </span>
                          </div>
                          <p className="text-foreground font-mono font-bold">
                            15 seconds
                          </p>
                        </div>
                        <div className="glass-dark border-primary/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <FastForward className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground text-sm">
                              Skip Forward
                            </span>
                          </div>
                          <p className="text-foreground font-mono font-bold">
                            30 seconds
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Audio Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-sm">
                          Trim Silence
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/30"
                        >
                          Off
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-sm">
                          Volume Boost
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/30"
                        >
                          Off
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Player Bar */}
      {playbackState.episode && playbackState.podcast && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 glass border-t border-primary/30 z-40"
        >
          <div className="max-w-7xl mx-auto">
            {/* Progress Bar */}
            <div className="relative h-1 bg-muted cursor-pointer group">
              <div
                className="absolute inset-y-0 left-0 bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Slider
                  value={[progressPercent]}
                  max={100}
                  step={0.1}
                  onValueChange={([value]) => {
                    if (playbackState.episode) {
                      setPlaybackState((prev) => ({
                        ...prev,
                        progress:
                          (value / 100) * (prev.episode?.duration || 0),
                      }))
                    }
                  }}
                  className="h-1"
                />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-4">
                {/* Episode Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 glass-dark rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {playbackState.podcast.artwork}
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground font-medium text-sm truncate">
                      {playbackState.episode.title}
                    </p>
                    <p className="text-muted-foreground text-xs truncate">
                      {playbackState.podcast.title}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  {/* Skip Back */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 hidden sm:flex"
                    onClick={skipBack}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>

                  {/* Play/Pause */}
                  <Button
                    size="icon"
                    className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={togglePlay}
                  >
                    {playbackState.isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </Button>

                  {/* Skip Forward */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 hidden sm:flex"
                    onClick={skipForward}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                  {/* Time Display */}
                  <div className="text-muted-foreground text-xs font-mono hidden md:block">
                    {formatTime(playbackState.progress)} /{" "}
                    {formatTime(playbackState.episode.duration)}
                  </div>

                  {/* Speed */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="font-mono text-xs px-2 hidden sm:flex"
                    onClick={changeSpeed}
                  >
                    {playbackState.speed}x
                  </Button>

                  {/* Volume */}
                  <div className="hidden md:flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : playbackState.volume]}
                      max={100}
                      step={1}
                      onValueChange={([value]) => {
                        setPlaybackState((prev) => ({ ...prev, volume: value }))
                        if (value > 0) setIsMuted(false)
                      }}
                      className="w-20"
                    />
                  </div>

                  {/* Sleep Timer Indicator */}
                  {sleepTimer && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs hidden sm:flex">
                      <Timer className="h-3 w-3 mr-1" />
                      {sleepTimer}m
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
