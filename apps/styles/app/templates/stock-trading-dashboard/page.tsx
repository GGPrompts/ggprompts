"use client"

import React, { useState, useEffect, useMemo } from "react"
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
  Bell,
  Settings,
  ChevronDown,
  ChevronUp,
  Wifi,
  AlertCircle,
  CheckCircle2,
  Newspaper,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

// ============================================================================
// TYPES
// ============================================================================

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: string
  pe: number
  sparkline: number[]
}

interface OrderBookEntry {
  price: number
  size: number
  total: number
}

interface Trade {
  id: string
  time: Date
  price: number
  size: number
  type: "buy" | "sell"
}

interface PortfolioData {
  totalValue: number
  dayChange: number
  dayChangePercent: number
  cash: number
  buyingPower: number
}

interface ChartDataPoint {
  time: string
  price: number
  volume: number
  open?: number
  high?: number
  low?: number
  close?: number
}

interface Alert {
  id: string
  symbol: string
  type: "price" | "news" | "earnings"
  message: string
  time: Date
  severity: "info" | "warning" | "critical"
}

interface NewsItem {
  id: string
  title: string
  source: string
  time: Date
  sentiment: "positive" | "neutral" | "negative"
}

// ============================================================================
// MOCK DATA & GENERATORS
// ============================================================================

const INITIAL_STOCKS: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.43,
    change: 2.34,
    changePercent: 1.35,
    volume: 52340000,
    marketCap: "2.71T",
    pe: 28.5,
    sparkline: [],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 378.91,
    change: -1.23,
    changePercent: -0.32,
    volume: 23450000,
    marketCap: "2.82T",
    pe: 35.2,
    sparkline: [],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.65,
    change: 3.45,
    changePercent: 2.48,
    volume: 18230000,
    marketCap: "1.79T",
    pe: 26.8,
    sparkline: [],
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.32,
    change: -0.87,
    changePercent: -0.49,
    volume: 41200000,
    marketCap: "1.84T",
    pe: 68.9,
    sparkline: [],
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 242.84,
    change: 8.92,
    changePercent: 3.81,
    volume: 95600000,
    marketCap: "771.2B",
    pe: 72.4,
    sparkline: [],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 495.22,
    change: 12.45,
    changePercent: 2.58,
    volume: 48900000,
    marketCap: "1.22T",
    pe: 115.3,
    sparkline: [],
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 485.33,
    change: -3.21,
    changePercent: -0.66,
    volume: 14560000,
    marketCap: "1.24T",
    pe: 31.7,
    sparkline: [],
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 487.23,
    change: 5.67,
    changePercent: 1.18,
    volume: 3840000,
    marketCap: "210.5B",
    pe: 43.2,
    sparkline: [],
  },
]

// Initialize sparklines with 24 data points
INITIAL_STOCKS.forEach((stock) => {
  stock.sparkline = Array.from({ length: 24 }, (_, i) => {
    const basePrice = stock.price - stock.change
    const variance = basePrice * 0.02
    return basePrice + (Math.random() - 0.5) * variance
  })
  stock.sparkline.push(stock.price)
})

const generateChartData = (basePrice: number, points: number = 100): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const now = new Date()

  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000) // 1 minute intervals
    const variance = basePrice * 0.015
    const price = basePrice + (Math.random() - 0.5) * variance
    const open = price + (Math.random() - 0.5) * (basePrice * 0.005)
    const close = price + (Math.random() - 0.5) * (basePrice * 0.005)
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.003)
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.003)

    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      price: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    })
  }

  return data
}

const generateOrderBook = (currentPrice: number): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } => {
  const bids: OrderBookEntry[] = []
  const asks: OrderBookEntry[] = []

  for (let i = 0; i < 15; i++) {
    const bidPrice = currentPrice - (i + 1) * 0.01
    const askPrice = currentPrice + (i + 1) * 0.01
    const bidSize = Math.floor(Math.random() * 500) + 100
    const askSize = Math.floor(Math.random() * 500) + 100

    bids.push({
      price: Number(bidPrice.toFixed(2)),
      size: bidSize,
      total: bidSize * bidPrice,
    })

    asks.push({
      price: Number(askPrice.toFixed(2)),
      size: askSize,
      total: askSize * askPrice,
    })
  }

  return { bids, asks }
}

const generateTrade = (currentPrice: number): Trade => {
  const variance = currentPrice * 0.001
  const price = currentPrice + (Math.random() - 0.5) * variance
  const size = Math.floor(Math.random() * 100) + 1

  return {
    id: Math.random().toString(36).substr(2, 9),
    time: new Date(),
    price: Number(price.toFixed(2)),
    size,
    type: Math.random() > 0.5 ? "buy" : "sell",
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function StockTradingDashboard() {
  const [isLive, setIsLive] = useState(true)
  const [selectedStock, setSelectedStock] = useState<Stock>(INITIAL_STOCKS[0])
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS)
  const [chartTimeframe, setChartTimeframe] = useState<"1D" | "5D" | "1M" | "6M" | "1Y" | "5Y">("1D")
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] }>({
    bids: [],
    asks: [],
  })
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    totalValue: 142384.23,
    dayChange: 2843.11,
    dayChangePercent: 2.04,
    cash: 12543.87,
    buyingPower: 25087.74,
  })
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      symbol: "AAPL",
      type: "price",
      message: "AAPL reached target price of $175.00",
      time: new Date(Date.now() - 300000),
      severity: "info",
    },
    {
      id: "2",
      symbol: "TSLA",
      type: "news",
      message: "Breaking: TSLA announces new factory",
      time: new Date(Date.now() - 600000),
      severity: "warning",
    },
  ])
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: "1",
      title: "Tech stocks rally on positive earnings",
      source: "Reuters",
      time: new Date(Date.now() - 1800000),
      sentiment: "positive",
    },
    {
      id: "2",
      title: "Federal Reserve signals rate hold",
      source: "Bloomberg",
      time: new Date(Date.now() - 3600000),
      sentiment: "neutral",
    },
  ])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market")
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy")
  const [quantity, setQuantity] = useState<string>("10")
  const [limitPrice, setLimitPrice] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"symbol" | "change" | "volume">("symbol")

  // Initialize chart data
  useEffect(() => {
    setChartData(generateChartData(selectedStock.price, 100))
    setOrderBook(generateOrderBook(selectedStock.price))
    setRecentTrades(
      Array.from({ length: 20 }, () => generateTrade(selectedStock.price)).sort(
        (a, b) => b.time.getTime() - a.time.getTime()
      )
    )
  }, [selectedStock])

  // Real-time price updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Update stock prices
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          const variance = stock.price * 0.002
          const newPrice = stock.price + (Math.random() - 0.5) * variance
          const change = newPrice - (stock.price - stock.change)
          const changePercent = (change / (stock.price - stock.change)) * 100

          // Update sparkline
          const newSparkline = [...stock.sparkline.slice(-23), newPrice]

          return {
            ...stock,
            price: Number(newPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            sparkline: newSparkline,
          }
        })
      )

      // Update selected stock
      setSelectedStock((prev) => {
        const variance = prev.price * 0.002
        const newPrice = prev.price + (Math.random() - 0.5) * variance
        const change = newPrice - (prev.price - prev.change)
        const changePercent = (change / (prev.price - prev.change)) * 100

        return {
          ...prev,
          price: Number(newPrice.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
        }
      })

      // Update chart data
      setChartData((prevData) => {
        const newPoint: ChartDataPoint = {
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          price: Number((selectedStock.price + (Math.random() - 0.5) * (selectedStock.price * 0.002)).toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 100000,
        }
        return [...prevData.slice(-99), newPoint]
      })

      // Update order book
      setOrderBook(generateOrderBook(selectedStock.price))

      // Add new trade occasionally
      if (Math.random() > 0.7) {
        const newTrade = generateTrade(selectedStock.price)
        setRecentTrades((prev) => [newTrade, ...prev.slice(0, 49)])
      }

      // Update portfolio
      setPortfolio((prev) => ({
        ...prev,
        totalValue: prev.totalValue + (Math.random() - 0.5) * 100,
        dayChange: prev.dayChange + (Math.random() - 0.5) * 10,
        dayChangePercent: prev.dayChangePercent + (Math.random() - 0.5) * 0.05,
      }))

      setLastUpdate(new Date())
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isLive, selectedStock.price])

  // Sorted and filtered stocks
  const filteredStocks = useMemo(() => {
    let filtered = stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    switch (sortBy) {
      case "change":
        return [...filtered].sort((a, b) => b.changePercent - a.changePercent)
      case "volume":
        return [...filtered].sort((a, b) => b.volume - a.volume)
      default:
        return filtered
    }
  }, [stocks, searchQuery, sortBy])

  // Time ago helper
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  // Format large number
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toString()
  }

  // Market status
  const now = new Date()
  const marketOpen = now.getHours() >= 9 && now.getHours() < 16
  const marketStatus = marketOpen ? "Market Open" : "Market Closed"

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-foreground terminal-glow">Stock Trading Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time market data and trading</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge variant={marketOpen ? "default" : "secondary"} className="gap-1">
            <Activity className="h-3 w-3" />
            {marketStatus}
          </Badge>
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
            {isLive ? <Pause className="h-4 w-4 sm:mr-2" /> : <Play className="h-4 w-4 sm:mr-2" />}
            <span className="hidden sm:inline">{isLive ? "Live" : "Paused"}</span>
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                <motion.p
                  key={Math.floor(portfolio.totalValue)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-3xl font-bold text-foreground"
                >
                  ${formatNumber(portfolio.totalValue)}
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
                <p className="text-sm text-muted-foreground">Day's Gain/Loss</p>
                <motion.div
                  key={Math.floor(portfolio.dayChange)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor:
                      portfolio.dayChange >= 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 rounded-md p-1"
                >
                  <p
                    className={`text-2xl font-bold ${
                      portfolio.dayChange >= 0 ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {portfolio.dayChange >= 0 ? "+" : ""}${formatNumber(portfolio.dayChange)}
                  </p>
                  <p
                    className={`text-sm ${portfolio.dayChangePercent >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {portfolio.dayChangePercent >= 0 ? "+" : ""}
                    {formatNumber(portfolio.dayChangePercent)}%
                  </p>
                </motion.div>
              </div>
              {portfolio.dayChange >= 0 ? (
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
                <p className="mt-2 text-2xl font-bold text-foreground">${formatNumber(portfolio.cash)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-secondary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Buying Power</p>
                <p className="mt-2 text-2xl font-bold text-foreground">${formatNumber(portfolio.buyingPower)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/50" />
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
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
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
                  variant={sortBy === "volume" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("volume")}
                >
                  Volume
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 px-1">
                  {filteredStocks.map((stock) => (
                    <motion.div
                      key={stock.symbol}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedStock(stock)}
                      className={`cursor-pointer rounded-lg border p-3 transition-all ${
                        selectedStock.symbol === stock.symbol
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
                          </div>
                          <p className="text-xs text-muted-foreground">{stock.name}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <motion.p
                              key={stock.price}
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                color: stock.change >= 0 ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)",
                              }}
                              className="text-lg font-bold"
                            >
                              ${stock.price.toFixed(2)}
                            </motion.p>
                            <p
                              className={`text-sm ${stock.change >= 0 ? "text-emerald-500" : "text-red-500"}`}
                            >
                              {stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="h-12 w-24">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stock.sparkline.map((price, i) => ({ price, index: i }))}>
                              <Line
                                type="monotone"
                                dataKey="price"
                                stroke={stock.change >= 0 ? "#10b981" : "#ef4444"}
                                strokeWidth={1.5}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Trading Panel */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Trade {selectedStock.symbol}</CardTitle>
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
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {(["market", "limit", "stop"] as const).map((type) => (
                        <Button
                          key={type}
                          variant={orderType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setOrderType(type)}
                          className="capitalize"
                        >
                          {type}
                        </Button>
                      ))}
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

                  {orderType !== "market" && (
                    <div>
                      <Label>Limit Price</Label>
                      <Input
                        type="number"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        placeholder={selectedStock.price.toFixed(2)}
                        className="mt-2"
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Price</span>
                      <span className="font-semibold">${selectedStock.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-semibold">{quantity || 0} shares</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-lg font-bold text-foreground">
                        ${formatNumber(selectedStock.price * Number(quantity || 0))}
                      </span>
                    </div>
                  </div>

                  <Button className={`w-full ${orderSide === "buy" ? "" : "bg-red-600 hover:bg-red-700"}`}>
                    {orderSide === "buy" ? "Place Buy Order" : "Place Sell Order"}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Chart & Market Stats */}
        <div className="space-y-6 lg:col-span-1">
          {/* Price Chart */}
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {selectedStock.symbol} - {selectedStock.name}
                  </CardTitle>
                  <div className="mt-2 flex items-baseline gap-3">
                    <motion.p
                      key={Math.floor(selectedStock.price * 100)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-3xl font-bold text-foreground"
                    >
                      ${selectedStock.price.toFixed(2)}
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
                        {selectedStock.change >= 0 ? "+" : ""}${selectedStock.change.toFixed(2)} (
                        {selectedStock.changePercent.toFixed(2)}%)
                      </span>
                    </motion.div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {(["1D", "5D", "1M", "6M", "1Y", "5Y"] as const).map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={chartTimeframe === timeframe ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartTimeframe(timeframe)}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={selectedStock.change >= 0 ? "#10b981" : "#ef4444"}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={selectedStock.change >= 0 ? "#10b981" : "#ef4444"}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value, index) => (index % 10 === 0 ? value : "")}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      domain={["auto", "auto"]}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))"
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={selectedStock.change >= 0 ? "#10b981" : "#ef4444"}
                      strokeWidth={2}
                      fill="url(#priceGradient)"
                      animationDuration={300}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Volume Chart */}
              <div className="mt-4 h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="time" hide />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))"
                      }}
                      formatter={(value: number) => [formatLargeNumber(value), "Volume"]}
                    />
                    <Bar dataKey="volume" fill="#10b981" opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Market Stats */}
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
                  <p className="mt-1 text-lg font-semibold">{selectedStock.pe.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <p className="mt-1 text-lg font-semibold">{formatLargeNumber(selectedStock.volume)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Volume</p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatLargeNumber(selectedStock.volume * 0.9)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">52W High</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-500">
                    ${(selectedStock.price * 1.23).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">52W Low</p>
                  <p className="mt-1 text-lg font-semibold text-red-500">
                    ${(selectedStock.price * 0.67).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prev Close</p>
                  <p className="mt-1 text-lg font-semibold">
                    ${(selectedStock.price - selectedStock.change).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="mt-1 text-lg font-semibold">
                    ${(selectedStock.price - selectedStock.change * 0.5).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Book & Trades */}
        <div className="space-y-6 lg:col-span-1">
          {/* Order Book */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Order Book</CardTitle>
              <p className="text-sm text-muted-foreground">Live bid/ask spread</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Asks (Sell Orders) */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Asks (Sell)</p>
                  <ScrollArea className="h-[180px]">
                    <div className="space-y-1">
                      {orderBook.asks.slice(0, 10).reverse().map((ask, idx) => (
                        <motion.div
                          key={`ask-${idx}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className="relative flex justify-between rounded px-2 py-1 text-sm"
                        >
                          <div
                            className="absolute inset-y-0 left-0 bg-red-500/10"
                            style={{ width: `${(ask.size / 500) * 100}%` }}
                          />
                          <span className="relative z-10 font-mono text-red-500">${ask.price.toFixed(2)}</span>
                          <span className="relative z-10 text-muted-foreground">{ask.size}</span>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Spread */}
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Bid</p>
                    <p className="font-mono text-sm font-semibold text-emerald-500">
                      ${orderBook.bids[0]?.price.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Spread</p>
                    <p className="font-mono text-sm font-semibold">
                      ${((orderBook.asks[0]?.price || 0) - (orderBook.bids[0]?.price || 0)).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Ask</p>
                    <p className="font-mono text-sm font-semibold text-red-500">
                      ${orderBook.asks[0]?.price.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>

                {/* Bids (Buy Orders) */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Bids (Buy)</p>
                  <ScrollArea className="h-[180px]">
                    <div className="space-y-1">
                      {orderBook.bids.slice(0, 10).map((bid, idx) => (
                        <motion.div
                          key={`bid-${idx}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className="relative flex justify-between rounded px-2 py-1 text-sm"
                        >
                          <div
                            className="absolute inset-y-0 left-0 bg-emerald-500/10"
                            style={{ width: `${(bid.size / 500) * 100}%` }}
                          />
                          <span className="relative z-10 font-mono text-emerald-500">${bid.price.toFixed(2)}</span>
                          <span className="relative z-10 text-muted-foreground">{bid.size}</span>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Recent Trades</CardTitle>
              <p className="text-sm text-muted-foreground">Live trade execution</p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <AnimatePresence mode="popLayout">
                  {recentTrades.slice(0, 50).map((trade) => (
                    <motion.div
                      key={trade.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-2 flex items-center justify-between rounded border border-border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant={trade.type === "buy" ? "default" : "destructive"} className="w-12">
                          {trade.type === "buy" ? "BUY" : "SELL"}
                        </Badge>
                        <div>
                          <p className="font-mono text-sm font-semibold">${trade.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{trade.size} shares</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{timeAgo(trade.time)}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts & News */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Alerts */}
        <Card className="glass border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Alerts</CardTitle>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg border p-3 ${
                    alert.severity === "critical"
                      ? "border-red-500/50 bg-red-500/10"
                      : alert.severity === "warning"
                        ? "border-amber-500/50 bg-amber-500/10"
                        : "border-cyan-500/50 bg-cyan-500/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {alert.severity === "critical" ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : alert.severity === "warning" ? (
                      <Bell className="h-5 w-5 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-cyan-500" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{alert.symbol}</Badge>
                        <Badge variant="outline" className="capitalize">
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm">{alert.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{timeAgo(alert.time)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* News */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-lg">Market News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {news.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start gap-3">
                    <Newspaper className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.source}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.sentiment === "positive"
                              ? "text-emerald-500"
                              : item.sentiment === "negative"
                                ? "text-red-500"
                                : ""
                          }`}
                        >
                          {item.sentiment}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{timeAgo(item.time)}</p>
                      </div>
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
