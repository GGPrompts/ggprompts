"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Pause,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Coins,
  DollarSign,
  Percent,
  Flame,
  Star,
  StarOff,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface CryptoDashboardProps {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
}

interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  sparkline_in_7d?: {
    price: number[]
  }
  high_24h: number
  low_24h: number
  ath: number
  ath_change_percentage: number
  atl: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
}

type SortField = "market_cap_rank" | "price_change_percentage_24h" | "current_price" | "total_volume"

const FAVORITES_KEY = "crypto-favorites"

// ============================================================================
// HOOKS
// ============================================================================

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY)
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch {
        setFavorites([])
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const toggleFavorite = useCallback((coinId: string) => {
    setFavorites((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    )
  }, [])

  const isFavorite = useCallback(
    (coinId: string) => favorites.includes(coinId),
    [favorites]
  )

  return { favorites, toggleFavorite, isFavorite, isLoaded }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

function formatCurrency(num: number, decimals = 2): string {
  // Handle very small numbers (like SHIB)
  if (num < 0.01 && num > 0) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumSignificantDigits: 2,
      maximumSignificantDigits: 4,
    }).format(num)
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
  return `$${num.toFixed(0)}`
}

function formatSupply(num: number | null): string {
  if (!num) return "N/A"
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toFixed(0)
}

// ============================================================================
// SPARKLINE COMPONENT
// ============================================================================

function SparklineChart({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  // Normalize data for mini chart
  const chartData = data.map((price, index) => ({ index, price }))

  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={1.5}
            dot={false}
            animationDuration={0}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CryptoDashboard({ activeSubItem, onSubItemHandled }: CryptoDashboardProps) {
  const queryClient = useQueryClient()
  const { favorites, toggleFavorite, isFavorite, isLoaded } = useFavorites()

  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null)
  const [isLive, setIsLive] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortField>("market_cap_rank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Handle sub-item navigation
  useEffect(() => {
    if (activeSubItem) {
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Fetch top 20 cryptocurrencies
  const { data: coinsData, isLoading: coinsLoading, refetch: refetchCoins } = useQuery<CoinData[]>({
    queryKey: ["crypto-markets"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d"
      )
      if (!res.ok) throw new Error("Failed to fetch crypto data")
      return res.json()
    },
    refetchInterval: isLive ? 60000 : false, // Refetch every 60 seconds when live
    staleTime: 30000,
  })

  // Set default selected coin when data loads
  useEffect(() => {
    if (coinsData && coinsData.length > 0 && !selectedCoin) {
      setSelectedCoin(coinsData[0])
    }
  }, [coinsData, selectedCoin])

  // Update selected coin data when new data arrives
  useEffect(() => {
    if (coinsData && selectedCoin) {
      const updated = coinsData.find((c) => c.id === selectedCoin.id)
      if (updated) {
        setSelectedCoin(updated)
      }
    }
  }, [coinsData, selectedCoin])

  // Calculate market stats
  const marketStats = useMemo(() => {
    if (!coinsData || coinsData.length === 0) {
      return { totalMarketCap: 0, totalVolume: 0, avgChange: 0, topGainer: null, topLoser: null }
    }

    const totalMarketCap = coinsData.reduce((sum, coin) => sum + coin.market_cap, 0)
    const totalVolume = coinsData.reduce((sum, coin) => sum + coin.total_volume, 0)
    const avgChange = coinsData.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / coinsData.length

    const sorted = [...coinsData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    const topGainer = sorted[0]
    const topLoser = sorted[sorted.length - 1]

    return { totalMarketCap, totalVolume, avgChange, topGainer, topLoser }
  }, [coinsData])

  // Filtered and sorted coins
  const filteredCoins = useMemo(() => {
    if (!coinsData) return []

    let filtered = [...coinsData]

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter((coin) => favorites.includes(coin.id))
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "market_cap_rank":
          comparison = a.market_cap_rank - b.market_cap_rank
          break
        case "price_change_percentage_24h":
          comparison = b.price_change_percentage_24h - a.price_change_percentage_24h
          break
        case "current_price":
          comparison = b.current_price - a.current_price
          break
        case "total_volume":
          comparison = b.total_volume - a.total_volume
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [coinsData, searchQuery, sortBy, sortDirection, showFavoritesOnly, favorites])

  // Handle sort change
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(field)
      setSortDirection(field === "market_cap_rank" ? "asc" : "desc")
    }
  }

  // Chart data for selected coin
  const chartData = useMemo(() => {
    if (!selectedCoin?.sparkline_in_7d?.price) return []

    const prices = selectedCoin.sparkline_in_7d.price
    const dataPoints = prices.length
    const step = Math.max(1, Math.floor(dataPoints / 168)) // ~168 hours in 7 days

    return prices
      .filter((_, index) => index % step === 0)
      .map((price, index) => {
        const hoursAgo = Math.floor((prices.length - index * step) / (prices.length / 168))
        const date = new Date(Date.now() - hoursAgo * 60 * 60 * 1000)
        return {
          time: date.toLocaleDateString("en-US", { weekday: "short", hour: "numeric" }),
          price,
        }
      })
  }, [selectedCoin])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground terminal-glow">Crypto Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track top cryptocurrencies in real-time</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="default" className="gap-1">
            <Activity className="h-3 w-3" />
            24/7 Market
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            CoinGecko API
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
            onClick={() => refetchCoins()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Market Cap</p>
                <motion.p
                  key={Math.floor(marketStats.totalMarketCap / 1e9)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-2xl font-bold text-foreground"
                >
                  {formatLargeNumber(marketStats.totalMarketCap)}
                </motion.p>
              </div>
              <DollarSign className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <motion.p
                  key={Math.floor(marketStats.totalVolume / 1e9)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-2xl font-bold text-foreground"
                >
                  {formatLargeNumber(marketStats.totalVolume)}
                </motion.p>
              </div>
              <BarChart3 className="h-8 w-8 text-cyan-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Gainer (24h)</p>
                {marketStats.topGainer && (
                  <motion.div
                    key={marketStats.topGainer.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <p className="text-lg font-bold text-emerald-500">
                      {marketStats.topGainer.symbol.toUpperCase()}
                    </p>
                    <p className="text-sm text-emerald-500">
                      +{formatNumber(marketStats.topGainer.price_change_percentage_24h)}%
                    </p>
                  </motion.div>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Loser (24h)</p>
                {marketStats.topLoser && (
                  <motion.div
                    key={marketStats.topLoser.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <p className="text-lg font-bold text-red-500">
                      {marketStats.topLoser.symbol.toUpperCase()}
                    </p>
                    <p className="text-sm text-red-500">
                      {formatNumber(marketStats.topLoser.price_change_percentage_24h)}%
                    </p>
                  </motion.div>
                )}
              </div>
              <TrendingDown className="h-8 w-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Coin List */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Top Cryptocurrencies</CardTitle>
                <Badge variant="outline">{filteredCoins.length} coins</Badge>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                <Button
                  variant={sortBy === "market_cap_rank" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSort("market_cap_rank")}
                >
                  Rank
                </Button>
                <Button
                  variant={sortBy === "price_change_percentage_24h" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSort("price_change_percentage_24h")}
                >
                  Change
                </Button>
                <Button
                  variant={sortBy === "current_price" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSort("current_price")}
                >
                  Price
                </Button>
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className="gap-1"
                >
                  <Star className="h-3 w-3" />
                  Favorites
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {coinsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredCoins.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Coins className="h-8 w-8 mb-2" />
                    <p>No coins found</p>
                  </div>
                ) : (
                  <div className="space-y-2 px-3 py-2">
                    {filteredCoins.map((coin) => (
                      <motion.div
                        key={coin.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedCoin(coin)}
                        className={`cursor-pointer rounded-lg border p-3 transition-all ${
                          selectedCoin?.id === coin.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="h-8 w-8 rounded-full"
                              />
                              <span className="absolute -top-1 -right-1 text-[10px] text-muted-foreground">
                                #{coin.market_cap_rank}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">
                                  {coin.symbol.toUpperCase()}
                                </p>
                                <Badge
                                  variant={coin.price_change_percentage_24h >= 0 ? "default" : "destructive"}
                                  className="h-5 text-xs"
                                >
                                  {coin.price_change_percentage_24h >= 0 ? (
                                    <ChevronUp className="h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )}
                                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                {coin.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <motion.p
                              key={coin.current_price}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className={`text-sm font-bold ${
                                coin.price_change_percentage_24h >= 0 ? "text-emerald-500" : "text-red-500"
                              }`}
                            >
                              {formatCurrency(coin.current_price)}
                            </motion.p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(coin.id)
                              }}
                              className="text-muted-foreground hover:text-primary"
                            >
                              {isFavorite(coin.id) ? (
                                <Star className="h-4 w-4 fill-primary text-primary" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        {coin.sparkline_in_7d?.price && (
                          <div className="mt-2 flex justify-end">
                            <SparklineChart
                              data={coin.sparkline_in_7d.price}
                              isPositive={(coin.price_change_percentage_7d_in_currency ?? coin.price_change_percentage_24h) >= 0}
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Columns - Chart & Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Price Chart */}
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  {selectedCoin && (
                    <>
                      <img
                        src={selectedCoin.image}
                        alt={selectedCoin.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <CardTitle className="text-xl">
                          {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
                        </CardTitle>
                        <div className="mt-1 flex items-baseline gap-3">
                          <motion.p
                            key={Math.floor(selectedCoin.current_price * 100)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-3xl font-bold text-foreground"
                          >
                            {formatCurrency(selectedCoin.current_price)}
                          </motion.p>
                          <motion.div
                            animate={{
                              backgroundColor:
                                selectedCoin.price_change_percentage_24h >= 0
                                  ? "rgba(16, 185, 129, 0.2)"
                                  : "rgba(239, 68, 68, 0.2)",
                            }}
                            className="flex items-center gap-1 rounded px-2 py-1"
                          >
                            {selectedCoin.price_change_percentage_24h >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={`text-sm font-semibold ${
                                selectedCoin.price_change_percentage_24h >= 0
                                  ? "text-emerald-500"
                                  : "text-red-500"
                              }`}
                            >
                              {selectedCoin.price_change_percentage_24h >= 0 ? "+" : ""}
                              {formatCurrency(selectedCoin.price_change_24h)} (
                              {selectedCoin.price_change_percentage_24h.toFixed(2)}%)
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  7-Day Chart
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {!selectedCoin ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a coin to view chart
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="cryptoPriceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={
                              (selectedCoin.price_change_percentage_7d_in_currency ?? selectedCoin.price_change_percentage_24h) >= 0
                                ? "#10b981"
                                : "#ef4444"
                            }
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={
                              (selectedCoin.price_change_percentage_7d_in_currency ?? selectedCoin.price_change_percentage_24h) >= 0
                                ? "#10b981"
                                : "#ef4444"
                            }
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis
                        dataKey="time"
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value, index) => (index % Math.ceil(chartData.length / 7) === 0 ? value : "")}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        domain={["auto", "auto"]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => formatCurrency(value, 0)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [formatCurrency(value), "Price"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={
                          (selectedCoin.price_change_percentage_7d_in_currency ?? selectedCoin.price_change_percentage_24h) >= 0
                            ? "#10b981"
                            : "#ef4444"
                        }
                        strokeWidth={2}
                        fill="url(#cryptoPriceGradient)"
                        animationDuration={300}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No chart data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Coin Details Grid */}
          {selectedCoin && (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Market Statistics */}
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Market Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Market Cap</p>
                      <p className="mt-1 text-lg font-semibold">{formatLargeNumber(selectedCoin.market_cap)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">24h Volume</p>
                      <p className="mt-1 text-lg font-semibold">{formatLargeNumber(selectedCoin.total_volume)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">24h High</p>
                      <p className="mt-1 text-lg font-semibold text-emerald-500">
                        {formatCurrency(selectedCoin.high_24h)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">24h Low</p>
                      <p className="mt-1 text-lg font-semibold text-red-500">
                        {formatCurrency(selectedCoin.low_24h)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">All-Time High</p>
                      <p className="mt-1 text-lg font-semibold text-emerald-500">
                        {formatCurrency(selectedCoin.ath)}
                      </p>
                      <p className="text-xs text-red-500">
                        {selectedCoin.ath_change_percentage.toFixed(1)}% from ATH
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">All-Time Low</p>
                      <p className="mt-1 text-lg font-semibold text-red-500">
                        {formatCurrency(selectedCoin.atl)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Supply Information */}
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Supply Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Circulating Supply</p>
                      <p className="mt-1 text-lg font-semibold">
                        {formatSupply(selectedCoin.circulating_supply)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Supply</p>
                      <p className="mt-1 text-lg font-semibold">
                        {formatSupply(selectedCoin.total_supply)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Max Supply</p>
                      <p className="mt-1 text-lg font-semibold">
                        {formatSupply(selectedCoin.max_supply)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Market Cap Rank</p>
                      <p className="mt-1 text-lg font-semibold">#{selectedCoin.market_cap_rank}</p>
                    </div>
                    {selectedCoin.max_supply && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground mb-2">Supply Progress</p>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{
                              width: `${Math.min(
                                100,
                                (selectedCoin.circulating_supply / selectedCoin.max_supply) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {((selectedCoin.circulating_supply / selectedCoin.max_supply) * 100).toFixed(1)}% of max supply in circulation
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
