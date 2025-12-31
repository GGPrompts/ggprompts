'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import { Progress } from '@ggprompts/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@ggprompts/ui'
import { ScrollArea } from '@ggprompts/ui'
import { Input } from '@ggprompts/ui'
import { Separator } from '@ggprompts/ui'
import {
  Crown,
  Flame,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Percent,
  Search,
  Medal,
  Skull,
  Sparkles,
  Activity,
  Calendar,
  Trophy,
  Target,
} from 'lucide-react'

// Mock data for leaderboard users
const mockUsernames = [
  'ImpulseKing_99',
  'WalletDestroyer',
  'RegretMaster',
  'BrokeAndProud',
  'MoneyBurner3000',
  'CashIncinerator',
  'SpendingSpree',
  'BudgetNightmare',
  'FiscallyReckless',
  'WasteWizard',
  'CoinCremator',
  'FinanceFlop',
  'PennyPitcher',
  'DollarDumper',
  'CashCrusher',
  'MoneyMuncher',
  'BillBurner',
  'SavingsSlayer',
  'WealthWaster',
  'FundsFlinger',
  'SpendaholicMax',
  'NoSaveNovember',
  'CartCrasher',
  'CheckoutChamp',
  'PaymentPanic',
  'SwipeRight2Debt',
  'BuyNowCryLater',
  'InstantRegrets',
  'OopsIBoughtIt',
  'AddToCartAholic',
  'UselessUncle',
  'PurposelessPete',
]

const generateMockUsers = () => {
  return mockUsernames.map((username, index) => ({
    id: `user-${index + 1}`,
    username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    uselessBucksBurned: Math.floor(Math.random() * 49950) + 50,
    purchases: Math.floor(Math.random() * 150) + 1,
    regretLevel: Math.floor(Math.random() * 40) + 60,
    rankChange: Math.floor(Math.random() * 10) - 5,
  })).sort((a, b) => b.uselessBucksBurned - a.uselessBucksBurned)
}

const mockUsers = generateMockUsers()

// Recent regret feed items
const recentRegrets = [
  { user: 'MoneyBurner3000', item: 'Self-Aware Toaster 3000', price: 499.99 },
  { user: 'CartCrasher', item: 'WiFi-Enabled Rock', price: 149.99 },
  { user: 'BuyNowCryLater', item: 'Procrastination Timer', price: 79.99 },
  { user: 'ImpulseKing_99', item: 'Invisible Umbrella', price: 199.99 },
  { user: 'RegretMaster', item: 'Existential Crisis Alarm', price: 299.99 },
  { user: 'WalletDestroyer', item: 'Premium Nothing Box', price: 999.99 },
  { user: 'SpendaholicMax', item: 'Disappointment Subscription', price: 49.99 },
]

// Season tiers
const seasonTiers = [
  { name: 'Starter Regretter', color: 'text-amber-600', threshold: 10, icon: Medal },
  { name: 'Committed Waster', color: 'text-slate-400', threshold: 25, icon: Target },
  { name: 'Professional Burner', color: 'text-yellow-400', threshold: 50, icon: Flame },
  { name: 'Money Incinerator', color: 'text-cyan-400', threshold: 100, icon: Skull },
]

// Current user mock data (for "Your Stats" section)
const currentUser = {
  rank: 7,
  username: 'YourUsername',
  uselessBucksBurned: 12450,
  purchases: 34,
  daysSinceResponsible: 847,
}

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [animatedCounter, setAnimatedCounter] = useState(0)
  const [visibleRegrets, setVisibleRegrets] = useState<typeof recentRegrets>([])

  // Animate the global counter
  useEffect(() => {
    const target = 2847293
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setAnimatedCounter(target)
        clearInterval(timer)
      } else {
        setAnimatedCounter(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  // Animate recent regrets feed
  useEffect(() => {
    const interval = setInterval(() => {
      const randomRegret = recentRegrets[Math.floor(Math.random() * recentRegrets.length)]
      setVisibleRegrets((prev) => [randomRegret, ...prev].slice(0, 5))
    }, 3000)

    // Initial population
    setVisibleRegrets(recentRegrets.slice(0, 5))

    return () => clearInterval(interval)
  }, [])

  const filteredUsers = mockUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const topThree = mockUsers.slice(0, 3)

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <Skull className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight terminal-glow sm:text-5xl">
              <span className="gradient-text-theme">
                Hall of Regret
              </span>
            </h1>
            <Skull className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Celebrating the most enthusiastic burners of imaginary currency
          </p>
        </motion.div>

        {/* Global Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="glass border-glow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/20 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Money Wasted Globally</p>
                <p className="text-2xl font-bold text-primary">
                  ${animatedCounter.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-glow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/20 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Regretters Online</p>
                <p className="text-2xl font-bold text-primary">1,247</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-glow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-secondary/20 p-3">
                <ShoppingCart className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items Purchased Today</p>
                <p className="text-2xl font-bold text-secondary">4,829</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-glow">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-rose-500/20 p-3">
                <Percent className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Regret Level</p>
                <p className="text-2xl font-bold text-rose-400">87%</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Podium Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Top Regretters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-end justify-center gap-4 sm:flex-row sm:items-end sm:gap-8">
                {/* Second Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="order-1 flex flex-col items-center sm:order-none"
                >
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-slate-400 shadow-lg">
                      <AvatarImage src={topThree[1]?.avatar} alt={topThree[1]?.username} />
                      <AvatarFallback>{topThree[1]?.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-slate-900">
                      #2
                    </Badge>
                  </div>
                  <p className="mt-4 font-semibold">{topThree[1]?.username}</p>
                  <p className="text-sm text-slate-400">
                    ${topThree[1]?.uselessBucksBurned.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topThree[1]?.purchases} purchases
                  </p>
                </motion.div>

                {/* First Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="order-0 flex flex-col items-center sm:order-none"
                >
                  <div className="relative">
                    <Crown className="absolute -top-8 left-1/2 h-8 w-8 -translate-x-1/2 text-yellow-400" />
                    <Avatar className="h-28 w-28 border-4 border-yellow-400 shadow-xl ring-4 ring-yellow-400/30">
                      <AvatarImage src={topThree[0]?.avatar} alt={topThree[0]?.username} />
                      <AvatarFallback>{topThree[0]?.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900">
                      <Crown className="mr-1 h-3 w-3" />
                      #1
                    </Badge>
                  </div>
                  <p className="mt-4 text-lg font-bold text-yellow-400">{topThree[0]?.username}</p>
                  <p className="text-lg font-semibold text-yellow-400">
                    ${topThree[0]?.uselessBucksBurned.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {topThree[0]?.purchases} purchases
                  </p>
                </motion.div>

                {/* Third Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="order-2 flex flex-col items-center sm:order-none"
                >
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-4 border-amber-600 shadow-lg">
                      <AvatarImage src={topThree[2]?.avatar} alt={topThree[2]?.username} />
                      <AvatarFallback>{topThree[2]?.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-600 text-amber-100">
                      #3
                    </Badge>
                  </div>
                  <p className="mt-4 font-semibold">{topThree[2]?.username}</p>
                  <p className="text-sm text-amber-600">
                    ${topThree[2]?.uselessBucksBurned.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topThree[2]?.purchases} purchases
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Leaderboard Table (2 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="glass-overlay">
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-primary" />
                    Regret Rankings
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search regretters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 px-4 py-2 text-sm font-medium text-muted-foreground">
                      <div className="col-span-1">Rank</div>
                      <div className="col-span-5">User</div>
                      <div className="col-span-3 text-right">Burned</div>
                      <div className="col-span-1 text-center">Buys</div>
                      <div className="col-span-2 text-right">Regret</div>
                    </div>
                    <Separator />

                    {/* Table Rows */}
                    <AnimatePresence>
                      {filteredUsers.map((user, index) => {
                        const isCurrentUser = user.username === 'YourUsername'
                        return (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className={`grid grid-cols-12 items-center gap-2 rounded-lg px-4 py-3 transition-colors hover:bg-muted/50 ${
                              isCurrentUser ? 'border-2 border-primary bg-primary/10' : ''
                            }`}
                          >
                            {/* Rank */}
                            <div className="col-span-1 flex items-center gap-1">
                              <span className="font-bold">{index + 1}</span>
                              {user.rankChange > 0 && (
                                <Badge
                                  variant="outline"
                                  className="h-5 border-primary px-1 text-xs text-primary"
                                >
                                  <TrendingUp className="h-3 w-3" />
                                </Badge>
                              )}
                              {user.rankChange < 0 && (
                                <Badge
                                  variant="outline"
                                  className="h-5 border-rose-500 px-1 text-xs text-rose-400"
                                >
                                  <TrendingDown className="h-3 w-3" />
                                </Badge>
                              )}
                            </div>

                            {/* User */}
                            <div className="col-span-5 flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.username} />
                                <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="truncate font-medium">{user.username}</span>
                            </div>

                            {/* Burned */}
                            <div className="col-span-3 text-right font-semibold text-primary">
                              ${user.uselessBucksBurned.toLocaleString()}
                            </div>

                            {/* Purchases */}
                            <div className="col-span-1 text-center text-muted-foreground">
                              {user.purchases}
                            </div>

                            {/* Regret Level */}
                            <div className="col-span-2 flex items-center justify-end gap-2">
                              <div className="w-16">
                                <Progress value={user.regretLevel} className="h-2" />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {user.regretLevel}%
                              </span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Your Regret Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass border-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Your Regret Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Rank</span>
                    <Badge variant="outline" className="border-primary text-primary">
                      #{currentUser.rank}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">UselessBucks Burned</span>
                    <span className="font-bold text-primary">
                      ${currentUser.uselessBucksBurned.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Purchases</span>
                    <span className="font-semibold">{currentUser.purchases}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Days Since Responsible</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-rose-400" />
                      <span className="font-bold text-rose-400">
                        {currentUser.daysSinceResponsible}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Regrets Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="glass border-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Regrets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <AnimatePresence mode="popLayout">
                      {visibleRegrets.map((regret, index) => (
                        <motion.div
                          key={`${regret.user}-${regret.item}-${index}`}
                          initial={{ opacity: 0, x: 20, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: 'auto' }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="mb-3 rounded-lg bg-muted/30 p-3"
                        >
                          <p className="text-sm">
                            <span className="font-semibold text-primary">{regret.user}</span>
                            <span className="text-muted-foreground"> just bought </span>
                            <span className="font-medium">{regret.item}</span>
                            <span className="text-muted-foreground"> for </span>
                            <span className="font-semibold text-primary">
                              ${regret.price}
                            </span>
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Season Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="glass border-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    Season Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {seasonTiers.map((tier, index) => {
                    const IconComponent = tier.icon
                    const isAchieved = currentUser.purchases >= tier.threshold
                    const progress = Math.min(
                      (currentUser.purchases / tier.threshold) * 100,
                      100
                    )
                    return (
                      <div key={tier.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent
                              className={`h-4 w-4 ${isAchieved ? tier.color : 'text-muted-foreground'}`}
                            />
                            <span
                              className={`text-sm ${isAchieved ? tier.color : 'text-muted-foreground'}`}
                            >
                              {tier.name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {tier.threshold} purchases
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          className={`h-2 ${isAchieved ? '' : 'opacity-50'}`}
                        />
                        {isAchieved && (
                          <Badge variant="outline" className={`text-xs ${tier.color}`}>
                            Achieved!
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
