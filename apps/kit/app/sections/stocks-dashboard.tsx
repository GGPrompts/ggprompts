"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Pause,
  Plus,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  History,
  Wallet,
  PieChart,
  RefreshCw,
  Key,
  ExternalLink,
  Settings,
  Copy,
  Check,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  StockQuote,
  QuoteResponse,
  HistoryResponse,
  Portfolio,
  Position,
  Transaction,
  DEFAULT_PORTFOLIO,
} from "@/app/api/stocks/types"
import { StatusResponse } from "@/app/api/status/route"

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface StocksDashboardProps {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
  onNavigateToSettings?: () => void
}

type Timeframe = "1D" | "5D" | "1M" | "6M" | "1Y" | "5Y"

const STORAGE_KEY = "stocks-portfolio"

// ============================================================================
// HOOKS
// ============================================================================

function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio>(DEFAULT_PORTFOLIO)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved))
      } catch {
        setPortfolio(DEFAULT_PORTFOLIO)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio))
    }
  }, [portfolio, isLoaded])

  const updatePortfolio = useCallback((updates: Partial<Portfolio>) => {
    setPortfolio((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const executeTrade = useCallback(
    (type: "buy" | "sell", symbol: string, shares: number, price: number) => {
      const total = shares * price

      setPortfolio((prev) => {
        // Check if we can execute the trade
        if (type === "buy" && total > prev.cash) {
          throw new Error("Insufficient funds")
        }

        const existingPosition = prev.positions.find((p) => p.symbol === symbol)

        if (type === "sell") {
          if (!existingPosition || existingPosition.shares < shares) {
            throw new Error("Insufficient shares")
          }
        }

        // Calculate new positions
        let newPositions: Position[]
        if (type === "buy") {
          if (existingPosition) {
            // Average down/up
            const newShares = existingPosition.shares + shares
            const newAvgCost =
              (existingPosition.avgCost * existingPosition.shares + total) / newShares
            newPositions = prev.positions.map((p) =>
              p.symbol === symbol
                ? { ...p, shares: newShares, avgCost: newAvgCost }
                : p
            )
          } else {
            // New position
            newPositions = [
              ...prev.positions,
              { symbol, shares, avgCost: price },
            ]
          }
        } else {
          // Sell
          const newShares = existingPosition!.shares - shares
          if (newShares === 0) {
            newPositions = prev.positions.filter((p) => p.symbol !== symbol)
          } else {
            newPositions = prev.positions.map((p) =>
              p.symbol === symbol ? { ...p, shares: newShares } : p
            )
          }
        }

        // Create transaction
        const transaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          symbol,
          shares,
          price,
          total,
          timestamp: new Date().toISOString(),
        }

        return {
          ...prev,
          cash: type === "buy" ? prev.cash - total : prev.cash + total,
          positions: newPositions,
          transactions: [transaction, ...prev.transactions].slice(0, 100), // Keep last 100
          updatedAt: new Date().toISOString(),
        }
      })
    },
    []
  )

  const addToWatchlist = useCallback((symbol: string) => {
    setPortfolio((prev) => ({
      ...prev,
      watchlist: prev.watchlist.includes(symbol)
        ? prev.watchlist
        : [...prev.watchlist, symbol],
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const removeFromWatchlist = useCallback((symbol: string) => {
    setPortfolio((prev) => ({
      ...prev,
      watchlist: prev.watchlist.filter((s) => s !== symbol),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const resetPortfolio = useCallback(() => {
    setPortfolio({ ...DEFAULT_PORTFOLIO, createdAt: new Date().toISOString() })
  }, [])

  return {
    portfolio,
    isLoaded,
    updatePortfolio,
    executeTrade,
    addToWatchlist,
    removeFromWatchlist,
    resetPortfolio,
  }
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

function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

function formatLargeNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toFixed(0)
}

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function isMarketOpen(): boolean {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const time = hour * 60 + minute

  // Market hours: Mon-Fri, 9:30 AM - 4:00 PM ET
  // Note: This is simplified and doesn't account for holidays
  if (day === 0 || day === 6) return false
  if (time < 9 * 60 + 30 || time >= 16 * 60) return false
  return true
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function StocksDashboard({ activeSubItem, onSubItemHandled, onNavigateToSettings }: StocksDashboardProps) {
  const queryClient = useQueryClient()
  const { portfolio, isLoaded, executeTrade, addToWatchlist, removeFromWatchlist, resetPortfolio } = usePortfolio()

  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL")
  const [copied, setCopied] = useState(false)
  const [chartTimeframe, setChartTimeframe] = useState<Timeframe>("1D")
  const [isLive, setIsLive] = useState(true)
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [quantity, setQuantity] = useState<string>("10")
  const [limitPrice, setLimitPrice] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"symbol" | "change" | "value">("symbol")
  const [tradeError, setTradeError] = useState<string | null>(null)
  const [tradeSuccess, setTradeSuccess] = useState<string | null>(null)

  // Handle sub-item navigation
  useEffect(() => {
    if (activeSubItem) {
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Check API status
  const { data: apiStatus } = useQuery<StatusResponse>({
    queryKey: ["api-status"],
    queryFn: async () => {
      const res = await fetch("/api/status")
      if (!res.ok) throw new Error("Failed to fetch status")
      return res.json()
    },
    staleTime: 60000, // Check once per minute
  })

  const isApiConfigured = apiStatus?.apis.finnhub ?? false

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fetch quotes for watchlist
  const { data: quotesData, isLoading: quotesLoading, refetch: refetchQuotes } = useQuery<QuoteResponse>({
    queryKey: ["stocks-quotes", portfolio.watchlist],
    queryFn: async () => {
      const symbols = portfolio.watchlist.join(",")
      const res = await fetch(`/api/stocks?symbols=${symbols}`)
      if (!res.ok) throw new Error("Failed to fetch quotes")
      return res.json()
    },
    enabled: isLoaded && portfolio.watchlist.length > 0 && isApiConfigured,
    refetchInterval: isLive ? 60000 : false, // Refetch every minute when live
    staleTime: 30000,
  })

  // Fetch historical data for selected stock
  const { data: historyData, isLoading: historyLoading } = useQuery<HistoryResponse>({
    queryKey: ["stocks-history", selectedSymbol, chartTimeframe],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/history?symbol=${selectedSymbol}&timeframe=${chartTimeframe}`)
      if (!res.ok) throw new Error("Failed to fetch history")
      return res.json()
    },
    enabled: !!selectedSymbol && isApiConfigured,
    staleTime: chartTimeframe === "1D" ? 60000 : 300000,
  })

  // Get quotes map for easy lookup
  const quotesMap = useMemo(() => {
    const map = new Map<string, StockQuote>()
    quotesData?.quotes.forEach((q) => map.set(q.symbol, q))
    return map
  }, [quotesData])

  // Selected stock data
  const selectedStock = quotesMap.get(selectedSymbol)

  // Calculate portfolio value
  const portfolioValue = useMemo(() => {
    let positionsValue = 0
    portfolio.positions.forEach((pos) => {
      const quote = quotesMap.get(pos.symbol)
      if (quote) {
        positionsValue += pos.shares * quote.price
      } else {
        // Use avg cost as fallback
        positionsValue += pos.shares * pos.avgCost
      }
    })
    return portfolio.cash + positionsValue
  }, [portfolio, quotesMap])

  // Calculate day's gain/loss (simplified - based on position changes)
  const dayChange = useMemo(() => {
    let change = 0
    portfolio.positions.forEach((pos) => {
      const quote = quotesMap.get(pos.symbol)
      if (quote) {
        change += pos.shares * quote.change
      }
    })
    return change
  }, [portfolio.positions, quotesMap])

  // Filtered and sorted watchlist
  const filteredWatchlist = useMemo(() => {
    let list = portfolio.watchlist
      .map((symbol) => quotesMap.get(symbol))
      .filter((q): q is StockQuote => !!q)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      list = list.filter(
        (q) =>
          q.symbol.toLowerCase().includes(query) ||
          q.name.toLowerCase().includes(query)
      )
    }

    switch (sortBy) {
      case "change":
        return [...list].sort((a, b) => b.changePercent - a.changePercent)
      case "value":
        return [...list].sort((a, b) => {
          const posA = portfolio.positions.find((p) => p.symbol === a.symbol)
          const posB = portfolio.positions.find((p) => p.symbol === b.symbol)
          const valA = posA ? posA.shares * a.price : 0
          const valB = posB ? posB.shares * b.price : 0
          return valB - valA
        })
      default:
        return list
    }
  }, [portfolio.watchlist, portfolio.positions, quotesMap, searchQuery, sortBy])

  // Handle trade execution
  const handleTrade = () => {
    setTradeError(null)
    setTradeSuccess(null)

    const shares = parseInt(quantity)
    if (!shares || shares <= 0) {
      setTradeError("Invalid quantity")
      return
    }

    const price = orderType === "limit" && limitPrice
      ? parseFloat(limitPrice)
      : selectedStock?.price

    if (!price) {
      setTradeError("Price not available")
      return
    }

    try {
      executeTrade(orderSide, selectedSymbol, shares, price)
      setTradeSuccess(`${orderSide === "buy" ? "Bought" : "Sold"} ${shares} ${selectedSymbol} @ ${formatCurrency(price)}`)
      setQuantity("10")
      setLimitPrice("")
    } catch (e) {
      setTradeError(e instanceof Error ? e.message : "Trade failed")
    }
  }

  // Market status
  const marketOpen = isMarketOpen()

  // Chart data for price chart
  const chartData = historyData?.candles.map((c) => ({
    time: c.time,
    price: c.close,
    volume: c.volume,
  })) || []

  return (
    <div className="space-y-6" data-tabz-section="stocks">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground terminal-glow">Paper Trading</h1>
          <p className="mt-1 text-sm text-muted-foreground">Practice trading with $100K virtual money</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={marketOpen ? "default" : "secondary"} className="gap-1">
            <Activity className="h-3 w-3" />
            {marketOpen ? "Market Open" : "Market Closed"}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            15-min delayed
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
            onClick={() => refetchQuotes()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* API Setup Instructions - Show when not configured */}
      {!isApiConfigured && (
        <Card className="glass border-amber-500/50 bg-amber-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Key className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-lg">API Key Required</CardTitle>
                <p className="text-sm text-muted-foreground">Set up Finnhub to get real stock data</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">1</div>
                <div>
                  <p className="font-medium">Get a free API key from Finnhub</p>
                  <a
                    href="https://finnhub.io/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    finnhub.io/register <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">2</div>
                <div className="flex-1">
                  <p className="font-medium">Add to your environment file</p>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="flex-1 bg-muted/50 px-3 py-2 rounded text-sm font-mono">
                      FINNHUB_API_KEY=your_key_here
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard("FINNHUB_API_KEY=")}
                      className="flex-shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add this to <code className="bg-muted/50 px-1 rounded">.env.local</code> in your project root
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">3</div>
                <div>
                  <p className="font-medium">Restart your dev server</p>
                  <code className="text-sm bg-muted/50 px-2 py-1 rounded font-mono mt-1 inline-block">npm run dev</code>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Free tier: 60 API calls/minute
              </p>
              {onNavigateToSettings && (
                <Button variant="outline" size="sm" onClick={onNavigateToSettings} className="gap-2">
                  <Settings className="h-4 w-4" />
                  API Keys Settings
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <motion.p
                  key={Math.floor(portfolioValue)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-foreground"
                >
                  {formatCurrency(portfolioValue)}
                </motion.p>
              </div>
              <PieChart className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Day's Change</p>
                <motion.div
                  key={Math.floor(dayChange)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2"
                >
                  <p className={`text-2xl font-bold ${dayChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {dayChange >= 0 ? "+" : ""}{formatCurrency(dayChange)}
                  </p>
                  <p className={`text-sm ${dayChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {dayChange >= 0 ? "+" : ""}{formatNumber((dayChange / (portfolioValue - dayChange)) * 100)}%
                  </p>
                </motion.div>
              </div>
              {dayChange >= 0 ? (
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Cash</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(portfolio.cash)}</p>
              </div>
              <Wallet className="h-8 w-8 text-cyan-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positions</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{portfolio.positions.length}</p>
                <p className="text-sm text-muted-foreground">{portfolio.transactions.length} trades</p>
              </div>
              <BarChart3 className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Watchlist & Trading */}
        <div className="space-y-6 lg:col-span-1">
          {/* Watchlist */}
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Watchlist</CardTitle>
                <Badge variant="outline">{portfolio.watchlist.length} stocks</Badge>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                  data-tabz-input="stock-search"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  variant={sortBy === "symbol" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("symbol")}
                >
                  Symbol
                </Button>
                <Button
                  variant={sortBy === "change" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("change")}
                >
                  Change
                </Button>
                <Button
                  variant={sortBy === "value" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("value")}
                >
                  Value
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {quotesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2 px-3 py-2">
                    {filteredWatchlist.map((stock) => {
                      const position = portfolio.positions.find((p) => p.symbol === stock.symbol)
                      return (
                        <motion.div
                          key={stock.symbol}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedSymbol(stock.symbol)}
                          className={`cursor-pointer rounded-lg border p-3 transition-all ${
                            selectedSymbol === stock.symbol
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">{stock.symbol}</p>
                                <Badge
                                  variant={stock.change >= 0 ? "default" : "destructive"}
                                  className="h-5 text-xs"
                                >
                                  {stock.change >= 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                  {Math.abs(stock.changePercent).toFixed(2)}%
                                </Badge>
                                {position && (
                                  <Badge variant="outline" className="h-5 text-xs">
                                    {position.shares} shares
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">{stock.name}</p>
                              <div className="mt-2 flex items-center gap-3">
                                <motion.p
                                  key={stock.price}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className={`text-lg font-bold ${stock.change >= 0 ? "text-emerald-500" : "text-red-500"}`}
                                >
                                  {formatCurrency(stock.price)}
                                </motion.p>
                                <p className={`text-sm ${stock.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                  {stock.change >= 0 ? "+" : ""}{formatCurrency(stock.change)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Trading Panel */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Trade {selectedSymbol}</CardTitle>
              {selectedStock && (
                <p className="text-sm text-muted-foreground">
                  Current: {formatCurrency(selectedStock.price)}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <Tabs value={orderSide} onValueChange={(v) => setOrderSide(v as "buy" | "sell")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
                <TabsContent value={orderSide} className="space-y-4">
                  <div>
                    <Label>Order Type</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Button
                        variant={orderType === "market" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setOrderType("market")}
                      >
                        Market
                      </Button>
                      <Button
                        variant={orderType === "limit" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setOrderType("limit")}
                      >
                        Limit
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="10"
                      className="mt-2"
                    />
                  </div>

                  {orderType === "limit" && (
                    <div>
                      <Label>Limit Price</Label>
                      <Input
                        type="number"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        placeholder={selectedStock?.price.toFixed(2) || "0.00"}
                        className="mt-2"
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold">
                        {orderType === "limit" && limitPrice
                          ? formatCurrency(parseFloat(limitPrice))
                          : selectedStock
                            ? formatCurrency(selectedStock.price)
                            : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-semibold">{quantity || 0} shares</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-lg font-bold text-foreground">
                        {formatCurrency(
                          (orderType === "limit" && limitPrice
                            ? parseFloat(limitPrice)
                            : selectedStock?.price || 0) * (parseInt(quantity) || 0)
                        )}
                      </span>
                    </div>
                  </div>

                  {tradeError && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-2 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {tradeError}
                    </div>
                  )}

                  {tradeSuccess && (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2 text-sm text-emerald-500">
                      <TrendingUp className="h-4 w-4" />
                      {tradeSuccess}
                    </div>
                  )}

                  <Button
                    className={`w-full ${orderSide === "sell" ? "bg-red-600 hover:bg-red-700" : ""}`}
                    onClick={handleTrade}
                    disabled={!selectedStock}
                    data-tabz-action={orderSide}
                  >
                    {orderSide === "buy" ? "Buy" : "Sell"} {selectedSymbol}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Chart & Stats */}
        <div className="space-y-6 lg:col-span-1">
          {/* Price Chart */}
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {selectedSymbol} {selectedStock && `- ${selectedStock.name}`}
                  </CardTitle>
                  {selectedStock && (
                    <div className="mt-2 flex items-baseline gap-3">
                      <motion.p
                        key={Math.floor(selectedStock.price * 100)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl font-bold text-foreground"
                      >
                        {formatCurrency(selectedStock.price)}
                      </motion.p>
                      <motion.div
                        animate={{
                          backgroundColor:
                            selectedStock.change >= 0 ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                        }}
                        className="flex items-center gap-1 rounded px-2 py-1"
                      >
                        {selectedStock.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-semibold ${
                            selectedStock.change >= 0 ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {selectedStock.change >= 0 ? "+" : ""}{formatCurrency(selectedStock.change)} (
                          {selectedStock.changePercent.toFixed(2)}%)
                        </span>
                      </motion.div>
                    </div>
                  )}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {(["1D", "5D", "1M", "6M", "1Y", "5Y"] as Timeframe[]).map((tf) => (
                    <Button
                      key={tf}
                      variant={chartTimeframe === tf ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartTimeframe(tf)}
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                {historyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ left: -10, right: 10 }}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={selectedStock && selectedStock.change >= 0 ? "#10b981" : "#ef4444"}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={selectedStock && selectedStock.change >= 0 ? "#10b981" : "#ef4444"}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis
                        dataKey="time"
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value, index) => (index % Math.ceil(chartData.length / 4) === 0 ? value : "")}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        domain={["auto", "auto"]}
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => `$${value}`}
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                        formatter={(value: number) => [formatCurrency(value), "Price"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={selectedStock && selectedStock.change >= 0 ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        fill="url(#priceGradient)"
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

              {/* Volume Chart - using normalized scale for better visibility */}
              {chartData.length > 0 && (() => {
                // Normalize volume using square root to reduce impact of outliers
                const volumes = chartData.map((d) => d.volume).filter((v) => v > 0)
                const maxVolume = Math.max(...volumes, 1)
                const normalizedData = chartData.map((d) => ({
                  ...d,
                  volumeNormalized: Math.sqrt(d.volume / maxVolume) * maxVolume,
                }))

                return (
                  <div className="mt-4 h-[60px] sm:h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={normalizedData} margin={{ left: -10, right: 10 }}>
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "hsl(var(--foreground))" }}
                          itemStyle={{ color: "hsl(var(--foreground))" }}
                          formatter={(value: number, name: string) => {
                            // Show original volume in tooltip
                            const idx = normalizedData.findIndex((d) => d.volumeNormalized === value)
                            const originalVolume = idx >= 0 ? normalizedData[idx].volume : value
                            return [formatLargeNumber(originalVolume), "Volume"]
                          }}
                        />
                        <Bar dataKey="volumeNormalized" fill="#10b981" opacity={0.6} radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* Market Stats */}
          {selectedStock && (
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle className="text-lg">Market Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="mt-1 text-lg font-semibold">{selectedStock.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">P/E Ratio</p>
                    <p className="mt-1 text-lg font-semibold">
                      {selectedStock.pe ? selectedStock.pe.toFixed(2) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">52W High</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-500">
                      {selectedStock.week52High ? formatCurrency(selectedStock.week52High) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">52W Low</p>
                    <p className="mt-1 text-lg font-semibold text-red-500">
                      {selectedStock.week52Low ? formatCurrency(selectedStock.week52Low) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Open</p>
                    <p className="mt-1 text-lg font-semibold">{formatCurrency(selectedStock.open)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prev Close</p>
                    <p className="mt-1 text-lg font-semibold">{formatCurrency(selectedStock.previousClose)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Day High</p>
                    <p className="mt-1 text-lg font-semibold">{formatCurrency(selectedStock.high)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Day Low</p>
                    <p className="mt-1 text-lg font-semibold">{formatCurrency(selectedStock.low)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Positions & History */}
        <div className="space-y-6 lg:col-span-1">
          {/* Positions */}
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Positions</CardTitle>
                <Badge variant="outline">{portfolio.positions.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                {portfolio.positions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Wallet className="h-8 w-8 mb-2" />
                    <p>No positions yet</p>
                    <p className="text-xs">Buy some stocks to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-2 pr-2">
                    {portfolio.positions.map((pos) => {
                      const quote = quotesMap.get(pos.symbol)
                      const currentValue = quote ? pos.shares * quote.price : pos.shares * pos.avgCost
                      const costBasis = pos.shares * pos.avgCost
                      const gainLoss = currentValue - costBasis
                      const gainLossPercent = (gainLoss / costBasis) * 100

                      return (
                        <div
                          key={pos.symbol}
                          className="rounded-lg border border-border p-3 cursor-pointer hover:border-primary/50"
                          onClick={() => setSelectedSymbol(pos.symbol)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{pos.symbol}</p>
                              <p className="text-xs text-muted-foreground">{pos.shares} shares @ {formatCurrency(pos.avgCost)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(currentValue)}</p>
                              <p className={`text-xs ${gainLoss >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {gainLoss >= 0 ? "+" : ""}{formatCurrency(gainLoss)} ({gainLossPercent.toFixed(2)}%)
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Trade History</CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                {portfolio.transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <History className="h-8 w-8 mb-2" />
                    <p>No trades yet</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {portfolio.transactions.slice(0, 20).map((tx) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-2 flex items-center justify-between rounded border border-border p-2"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant={tx.type === "buy" ? "default" : "destructive"} className="w-12 justify-center">
                            {tx.type.toUpperCase()}
                          </Badge>
                          <div>
                            <p className="font-semibold">{tx.symbol}</p>
                            <p className="text-xs text-muted-foreground">
                              {tx.shares} @ {formatCurrency(tx.price)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(tx.total)}</p>
                          <p className="text-xs text-muted-foreground">{timeAgo(tx.timestamp)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full text-muted-foreground"
            onClick={() => {
              if (confirm("Reset portfolio to $100,000? This will clear all positions and history.")) {
                resetPortfolio()
              }
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Portfolio
          </Button>
        </div>
      </div>
    </div>
  )
}
