"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Gamepad2,
  Clock,
  Zap,
  Target,
  Award,
  Star,
  Flame,
  Shield,
  Swords,
  Play,
  Pause,
  Filter,
  Search,
  Calendar,
  BarChart3,
  Eye,
  Timer,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, ScrollArea, Progress, Separator, Avatar, AvatarFallback, AvatarImage, Input } from "@ggprompts/ui"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// ============================================================================
// TYPES
// ============================================================================

type Tier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master"
type GameMode = "ranked" | "casual" | "arena" | "tournament"
type MatchResult = "win" | "loss" | "draw"

interface Player {
  id: string
  username: string
  avatar: string
  rank: number
  previousRank: number
  score: number
  level: number
  tier: Tier
  wins: number
  losses: number
  draws: number
  winRate: number
  avgScore: number
  bestScore: number
  currentStreak: number
  longestStreak: number
  hoursPlayed: number
  achievementsUnlocked: number
  isCurrentUser?: boolean
}

interface Match {
  id: string
  opponent: string
  opponentAvatar: string
  result: MatchResult
  score: number
  opponentScore: number
  duration: number
  mode: GameMode
  rewardsEarned: number
  time: Date
}

interface LiveMatch {
  id: string
  player1: string
  player2: string
  player1Avatar: string
  player2Avatar: string
  player1Score: number
  player2Score: number
  timeElapsed: number
  mode: GameMode
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: number
  unlockedBy: number
  unlocked: boolean
  progress?: number
  requirement?: number
}

interface SeasonReward {
  tier: number
  name: string
  unlocked: boolean
  requirement: number
}

// ============================================================================
// MOCK DATA & GENERATORS
// ============================================================================

const TIER_COLORS: Record<Tier, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
  platinum: "#E5E4E2",
  diamond: "#B9F2FF",
  master: "#FF69B4",
}

const TIER_ICONS: Record<Tier, typeof Shield> = {
  bronze: Shield,
  silver: Shield,
  gold: Trophy,
  platinum: Crown,
  diamond: Sparkles,
  master: Flame,
}

const INITIAL_PLAYERS: Omit<Player, "rank" | "previousRank">[] = [
  {
    id: "p1",
    username: "xX_ProGamer_Xx",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer",
    score: 245892,
    level: 87,
    tier: "master",
    wins: 1287,
    losses: 453,
    draws: 87,
    winRate: 73.9,
    avgScore: 4523,
    bestScore: 12847,
    currentStreak: 12,
    longestStreak: 23,
    hoursPlayed: 2847,
    achievementsUnlocked: 142,
  },
  {
    id: "p2",
    username: "QuantumDestroyer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quantum",
    score: 238456,
    level: 84,
    tier: "master",
    wins: 1156,
    losses: 412,
    draws: 73,
    winRate: 71.8,
    avgScore: 4387,
    bestScore: 11923,
    currentStreak: 8,
    longestStreak: 19,
    hoursPlayed: 2634,
    achievementsUnlocked: 138,
  },
  {
    id: "p3",
    username: "ShadowNinja_97",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow",
    score: 231089,
    level: 82,
    tier: "diamond",
    wins: 1089,
    losses: 398,
    draws: 91,
    winRate: 69.2,
    avgScore: 4234,
    bestScore: 11456,
    currentStreak: 15,
    longestStreak: 21,
    hoursPlayed: 2512,
    achievementsUnlocked: 135,
  },
  {
    id: "user",
    username: "YouThePlayer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    score: 187234,
    level: 72,
    tier: "platinum",
    wins: 891,
    losses: 367,
    draws: 54,
    winRate: 67.8,
    avgScore: 3892,
    bestScore: 9823,
    currentStreak: 5,
    longestStreak: 14,
    hoursPlayed: 1847,
    achievementsUnlocked: 98,
    isCurrentUser: true,
  },
]

// Generate 96 more players to make 100 total
const generatePlayers = (): Player[] => {
  const players: Player[] = INITIAL_PLAYERS.map((p, i) => ({
    ...p,
    rank: i + 1,
    previousRank: i + 1 + Math.floor(Math.random() * 7) - 3,
  }))

  const usernames = [
    "CyberKnight",
    "PhoenixRising",
    "StormBreaker",
    "TitanSlayer",
    "NeonGhost",
    "VoidWalker",
    "CrimsonBlade",
    "ThunderStrike",
    "FrostByte",
    "IronWolf",
  ]

  for (let i = players.length; i < 100; i++) {
    const username = `${usernames[Math.floor(Math.random() * usernames.length)]}_${Math.floor(Math.random() * 999)}`
    const wins = Math.floor(Math.random() * 800) + 200
    const losses = Math.floor(Math.random() * 400) + 150
    const draws = Math.floor(Math.random() * 50) + 10
    const total = wins + losses + draws
    const winRate = (wins / total) * 100
    const score = Math.floor(Math.random() * 150000) + 50000

    let tier: Tier = "bronze"
    if (score > 200000) tier = "master"
    else if (score > 170000) tier = "diamond"
    else if (score > 140000) tier = "platinum"
    else if (score > 110000) tier = "gold"
    else if (score > 80000) tier = "silver"

    players.push({
      id: `p${i + 1}`,
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      rank: i + 1,
      previousRank: i + 1 + Math.floor(Math.random() * 7) - 3,
      score,
      level: Math.floor(score / 3000) + 20,
      tier,
      wins,
      losses,
      draws,
      winRate: Number(winRate.toFixed(1)),
      avgScore: Math.floor(Math.random() * 4000) + 2000,
      bestScore: Math.floor(Math.random() * 10000) + 5000,
      currentStreak: Math.floor(Math.random() * 10),
      longestStreak: Math.floor(Math.random() * 20) + 5,
      hoursPlayed: Math.floor(Math.random() * 2000) + 500,
      achievementsUnlocked: Math.floor(Math.random() * 100) + 30,
    })
  }

  return players.sort((a, b) => b.score - a.score).map((p, i) => ({ ...p, rank: i + 1 }))
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach1",
    name: "First Blood",
    description: "Win your first match",
    icon: "🎯",
    rarity: 95,
    unlockedBy: 95234,
    unlocked: true,
  },
  {
    id: "ach2",
    name: "Unstoppable",
    description: "Win 10 matches in a row",
    icon: "🔥",
    rarity: 12,
    unlockedBy: 12048,
    unlocked: true,
  },
  {
    id: "ach3",
    name: "Legendary",
    description: "Reach Master tier",
    icon: "👑",
    rarity: 3,
    unlockedBy: 3012,
    unlocked: false,
    progress: 187234,
    requirement: 200000,
  },
  {
    id: "ach4",
    name: "Marathon Runner",
    description: "Play for 1000 hours",
    icon: "⏱️",
    rarity: 8,
    unlockedBy: 8024,
    unlocked: true,
  },
  {
    id: "ach5",
    name: "Perfect Game",
    description: "Win with a perfect score",
    icon: "⭐",
    rarity: 5,
    unlockedBy: 5018,
    unlocked: false,
    progress: 8,
    requirement: 10,
  },
  {
    id: "ach6",
    name: "Comeback King",
    description: "Win after being 1000 points behind",
    icon: "💪",
    rarity: 15,
    unlockedBy: 15089,
    unlocked: true,
  },
]

const SEASON_REWARDS: SeasonReward[] = [
  { tier: 1, name: "Bronze Frame", unlocked: true, requirement: 10000 },
  { tier: 2, name: "Silver Badge", unlocked: true, requirement: 30000 },
  { tier: 3, name: "Gold Title", unlocked: true, requirement: 60000 },
  { tier: 4, name: "Platinum Emote", unlocked: true, requirement: 100000 },
  { tier: 5, name: "Diamond Skin", unlocked: true, requirement: 150000 },
  { tier: 6, name: "Master Avatar", unlocked: false, requirement: 200000 },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function GamingLeaderboard() {
  const [isLive, setIsLive] = useState(true)
  const [players, setPlayers] = useState<Player[]>([])
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])
  const [matchHistory, setMatchHistory] = useState<Match[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTier, setFilterTier] = useState<Tier | "all">("all")
  const [currentUser, setCurrentUser] = useState<Player | null>(null)
  const [globalStats, setGlobalStats] = useState({
    totalPlayers: 100487,
    matchesInProgress: 1247,
    matchesToday: 4829,
    avgMatchDuration: 847,
  })

  // Initialize players and matches
  useEffect(() => {
    const initialPlayers = generatePlayers()
    setPlayers(initialPlayers)
    setCurrentUser(initialPlayers.find((p) => p.isCurrentUser) || null)

    // Generate match history
    const modes: GameMode[] = ["ranked", "casual", "arena", "tournament"]
    const results: MatchResult[] = ["win", "loss", "draw"]
    const history: Match[] = Array.from({ length: 20 }, (_, i) => {
      const result = results[Math.floor(Math.random() * results.length)]
      const score = Math.floor(Math.random() * 5000) + 1000
      const opponentScore =
        result === "win"
          ? score - Math.floor(Math.random() * 500) - 100
          : result === "loss"
            ? score + Math.floor(Math.random() * 500) + 100
            : score

      return {
        id: `match-${i}`,
        opponent: `Opponent_${Math.floor(Math.random() * 999)}`,
        opponentAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=opp${i}`,
        result,
        score,
        opponentScore,
        duration: Math.floor(Math.random() * 1200) + 300,
        mode: modes[Math.floor(Math.random() * modes.length)],
        rewardsEarned: Math.floor(Math.random() * 500) + 100,
        time: new Date(Date.now() - i * 3600000),
      }
    })
    setMatchHistory(history)

    // Generate live matches
    const live: LiveMatch[] = Array.from({ length: 8 }, (_, i) => ({
      id: `live-${i}`,
      player1: initialPlayers[Math.floor(Math.random() * 50)].username,
      player2: initialPlayers[Math.floor(Math.random() * 50) + 50].username,
      player1Avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=live${i}a`,
      player2Avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=live${i}b`,
      player1Score: Math.floor(Math.random() * 3000),
      player2Score: Math.floor(Math.random() * 3000),
      timeElapsed: Math.floor(Math.random() * 600) + 60,
      mode: modes[Math.floor(Math.random() * modes.length)],
    }))
    setLiveMatches(live)
  }, [])

  // Real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Update player scores and ranks
      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers.map((player) => {
          const scoreChange = Math.floor(Math.random() * 100) - 40
          return {
            ...player,
            score: Math.max(0, player.score + scoreChange),
          }
        })

        // Re-sort and update ranks
        const sorted = updatedPlayers.sort((a, b) => b.score - a.score)
        return sorted.map((player, index) => ({
          ...player,
          previousRank: player.rank,
          rank: index + 1,
        }))
      })

      // Update live matches
      setLiveMatches((prev) =>
        prev.map((match) => ({
          ...match,
          player1Score: match.player1Score + Math.floor(Math.random() * 50),
          player2Score: match.player2Score + Math.floor(Math.random() * 50),
          timeElapsed: match.timeElapsed + 3,
        }))
      )

      // Update global stats
      setGlobalStats((prev) => ({
        ...prev,
        matchesInProgress: prev.matchesInProgress + Math.floor(Math.random() * 10) - 5,
        matchesToday: prev.matchesToday + Math.floor(Math.random() * 5),
      }))

      setLastUpdate(new Date())
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [isLive])

  // Update current user when players change
  useEffect(() => {
    const user = players.find((p) => p.isCurrentUser)
    if (user) setCurrentUser(user)
  }, [players])

  // Filtered players
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      if (searchQuery && !player.username.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (filterTier !== "all" && player.tier !== filterTier) {
        return false
      }
      return true
    })
  }, [players, searchQuery, filterTier])

  // Top 3 players
  const topThree = players.slice(0, 3)

  // Time formatter
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  // Time ago
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Rank change indicator
  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current
    if (diff > 0)
      return (
        <Badge variant="default" className="gap-1">
          <ChevronUp className="h-3 w-3" />+{diff}
        </Badge>
      )
    if (diff < 0)
      return (
        <Badge variant="destructive" className="gap-1">
          <ChevronDown className="h-3 w-3" />
          {diff}
        </Badge>
      )
    return (
      <Badge variant="secondary" className="gap-1">
        <Minus className="h-3 w-3" />0
      </Badge>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Gaming Leaderboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Season 8 • Ends in 14 days, 6 hours</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Updated {timeAgo(lastUpdate)}
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
        </div>
      </div>

      {/* Global Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Players Online</p>
                <motion.p
                  key={Math.floor(globalStats.totalPlayers / 100)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-foreground"
                >
                  {formatNumber(globalStats.totalPlayers)}
                </motion.p>
              </div>
              <Users className="h-8 w-8 text-secondary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Matches in Progress</p>
                <motion.p
                  key={Math.floor(globalStats.matchesInProgress / 10)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-primary"
                >
                  {formatNumber(globalStats.matchesInProgress)}
                </motion.p>
              </div>
              <Gamepad2 className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Matches Today</p>
                <motion.p
                  key={Math.floor(globalStats.matchesToday / 100)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-foreground"
                >
                  {formatNumber(globalStats.matchesToday)}
                </motion.p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Match Time</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{formatTime(globalStats.avgMatchDuration)}</p>
              </div>
              <Timer className="h-8 w-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Podium - Top 3 */}
      <Card className="glass border-border mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Top Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {/* 2nd Place */}
            {topThree[1] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="order-1"
              >
                <div className="rounded-lg border-2 border-muted bg-muted/10 p-4 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="relative">
                      <Avatar className="h-20 w-20 border-2 border-muted">
                        <AvatarImage src={topThree[1].avatar} />
                        <AvatarFallback>{topThree[1].username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-white">
                        2
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-foreground">{topThree[1].username}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Badge
                      variant="outline"
                      style={{ borderColor: TIER_COLORS[topThree[1].tier] }}
                      className="capitalize"
                    >
                      {topThree[1].tier}
                    </Badge>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-muted-foreground">{formatNumber(topThree[1].score)}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="order-2"
              >
                <div className="rounded-lg border-2 border-amber-500 bg-amber-500/10 p-4 text-center shadow-lg shadow-amber-500/20">
                  <div className="mb-3 flex justify-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-amber-500">
                        <AvatarImage src={topThree[0].avatar} />
                        <AvatarFallback>{topThree[0].username[0]}</AvatarFallback>
                      </Avatar>
                      <Crown className="absolute -top-6 left-1/2 h-8 w-8 -translate-x-1/2 text-amber-500" />
                      <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-lg">
                        1
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-foreground text-lg">{topThree[0].username}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Badge
                      variant="outline"
                      style={{ borderColor: TIER_COLORS[topThree[0].tier] }}
                      className="capitalize"
                    >
                      {topThree[0].tier}
                    </Badge>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-amber-500">{formatNumber(topThree[0].score)}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <Badge variant="default" className="gap-1">
                      <Flame className="h-3 w-3" />
                      {topThree[0].currentStreak} streak
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="order-3"
              >
                <div className="rounded-lg border-2 border-amber-700 bg-amber-700/10 p-4 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="relative">
                      <Avatar className="h-20 w-20 border-2 border-amber-700">
                        <AvatarImage src={topThree[2].avatar} />
                        <AvatarFallback>{topThree[2].username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-700 text-white">
                        3
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-foreground">{topThree[2].username}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Badge
                      variant="outline"
                      style={{ borderColor: TIER_COLORS[topThree[2].tier] }}
                      className="capitalize"
                    >
                      {topThree[2].tier}
                    </Badge>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-amber-700">{formatNumber(topThree[2].score)}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-lg">Global Leaderboard</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search players..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value as Tier | "all")}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All Tiers</option>
                    <option value="master">Master</option>
                    <option value="diamond">Diamond</option>
                    <option value="platinum">Platinum</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="bronze">Bronze</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredPlayers.map((player, index) => {
                    const TierIcon = TIER_ICONS[player.tier]
                    return (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`rounded-lg border p-3 transition-all ${
                          player.isCurrentUser
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="flex w-12 flex-col items-center">
                            <motion.p
                              key={player.rank}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`text-2xl font-bold ${
                                player.rank <= 3 ? "text-amber-500" : "text-foreground"
                              }`}
                            >
                              {player.rank <= 3 && <Trophy className="h-6 w-6 inline" />}
                              {player.rank > 3 && `#${player.rank}`}
                            </motion.p>
                            {getRankChange(player.rank, player.previousRank)}
                          </div>

                          {/* Avatar */}
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback>{player.username[0]}</AvatarFallback>
                          </Avatar>

                          {/* Player Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">{player.username}</p>
                              {player.isCurrentUser && <Badge variant="default">You</Badge>}
                              <TierIcon
                                className="h-4 w-4"
                                style={{ color: TIER_COLORS[player.tier] }}
                              />
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                              <span>Level {player.level}</span>
                              <Separator orientation="vertical" className="h-3" />
                              <span className="capitalize">{player.tier}</span>
                              <Separator orientation="vertical" className="h-3" />
                              <span>{player.winRate}% WR</span>
                              {player.currentStreak > 0 && (
                                <>
                                  <Separator orientation="vertical" className="h-3" />
                                  <span className="flex items-center gap-1 text-emerald-500">
                                    <Flame className="h-3 w-3" />
                                    {player.currentStreak}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Score */}
                          <div className="text-right">
                            <motion.p
                              key={Math.floor(player.score / 100)}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-xl font-bold text-foreground"
                            >
                              {formatNumber(player.score)}
                            </motion.p>
                            <p className="text-xs text-muted-foreground">points</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Current User Stats */}
          {currentUser && (
            <Card className="glass border-primary shadow-lg shadow-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">{currentUser.username}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          style={{ borderColor: TIER_COLORS[currentUser.tier] }}
                          className="capitalize"
                        >
                          {currentUser.tier}
                        </Badge>
                        <Badge variant="secondary">Rank #{currentUser.rank}</Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Score</p>
                      <p className="font-semibold text-lg">{formatNumber(currentUser.score)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Level</p>
                      <p className="font-semibold text-lg">{currentUser.level}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold text-emerald-500">{currentUser.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Streak</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        {currentUser.currentStreak}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Record</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-500">{currentUser.wins}W</span>
                      <span className="text-red-500">{currentUser.losses}L</span>
                      <span className="text-muted-foreground">{currentUser.draws}D</span>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Achievements</p>
                    <Progress value={(currentUser.achievementsUnlocked / 150) * 100} />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {currentUser.achievementsUnlocked}/150 unlocked
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Matches */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Live Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {liveMatches.map((match) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-lg border border-border bg-background/50 p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="capitalize">
                          {match.mode}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(match.timeElapsed)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={match.player1Avatar} />
                            <AvatarFallback>{match.player1[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold">{match.player1}</p>
                            <motion.p
                              key={match.player1Score}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="text-xs text-muted-foreground"
                            >
                              {formatNumber(match.player1Score)}
                            </motion.p>
                          </div>
                        </div>
                        <Swords className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-sm font-semibold">{match.player2}</p>
                            <motion.p
                              key={match.player2Score}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="text-xs text-muted-foreground"
                            >
                              {formatNumber(match.player2Score)}
                            </motion.p>
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={match.player2Avatar} />
                            <AvatarFallback>{match.player2[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
                        <Eye className="h-3 w-3" />
                        Spectate
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ACHIEVEMENTS.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-lg border p-3 ${
                      achievement.unlocked
                        ? "border-border"
                        : "border-muted opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{achievement.name}</p>
                          {achievement.unlocked && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {achievement.rarity}% rarity
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatNumber(achievement.unlockedBy)} players
                          </span>
                        </div>
                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <Progress
                              value={(achievement.progress / (achievement.requirement || 1)) * 100}
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatNumber(achievement.progress)} / {formatNumber(achievement.requirement || 0)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Season Progress */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Season Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SEASON_REWARDS.map((reward) => (
                  <div
                    key={reward.tier}
                    className={`rounded-lg border p-3 ${
                      reward.unlocked
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : currentUser && currentUser.score >= reward.requirement * 0.8
                          ? "border-amber-500/30 bg-amber-500/10"
                          : "border-muted opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            reward.unlocked ? "bg-emerald-500" : "bg-muted"
                          }`}
                        >
                          {reward.unlocked ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{reward.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Tier {reward.tier} • {formatNumber(reward.requirement)} points
                          </p>
                        </div>
                      </div>
                      {reward.unlocked && (
                        <Badge variant="default">Unlocked</Badge>
                      )}
                    </div>
                    {!reward.unlocked && currentUser && (
                      <div className="mt-2">
                        <Progress
                          value={(currentUser.score / reward.requirement) * 100}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatNumber(reward.requirement - currentUser.score)} points to go
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Match History */}
      <Card className="glass border-border mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {matchHistory.slice(0, 8).map((match) => (
              <div
                key={match.id}
                className={`rounded-lg border p-3 ${
                  match.result === "win"
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : match.result === "loss"
                      ? "border-red-500/30 bg-red-500/10"
                      : "border-border bg-muted/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={
                      match.result === "win"
                        ? "default"
                        : match.result === "loss"
                          ? "destructive"
                          : "secondary"
                    }
                    className="uppercase"
                  >
                    {match.result}
                  </Badge>
                  <Badge variant="outline" className="capitalize text-xs">
                    {match.mode}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={match.opponentAvatar} />
                    <AvatarFallback>{match.opponent[0]}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-semibold">{match.opponent}</p>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-semibold">
                      {formatNumber(match.score)} - {formatNumber(match.opponentScore)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{formatTime(match.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rewards</span>
                    <span className="text-emerald-500">+{match.rewardsEarned} XP</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">{timeAgo(match.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
