"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  ExternalLink,
  Flame,
  Fuel,
  Globe,
  ImageIcon,
  Layers,
  Lock,
  Plus,
  QrCode,
  RefreshCw,
  Repeat,
  Search,
  Send,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"

// TypeScript Interfaces
interface WalletAsset {
  id: string
  symbol: string
  name: string
  logo: string
  balance: number
  price: number
  change24h: number
  value: number
  sparkline: number[]
}

interface Transaction {
  id: string
  hash: string
  type: "send" | "receive" | "swap" | "stake" | "unstake" | "approve"
  status: "pending" | "confirmed" | "failed"
  asset: string
  amount: number
  to?: string
  from?: string
  timestamp: number
  gasFee: number
}

interface StakingPosition {
  id: string
  asset: string
  symbol: string
  stakedAmount: number
  apy: number
  rewardsEarned: number
  unlockDate?: number
}

interface DeFiPosition {
  id: string
  protocol: string
  type: "liquidity" | "lending" | "borrowing"
  assets: string[]
  value: number
  apy: number
  health?: number
}

interface NFT {
  id: string
  name: string
  collection: string
  image: string
  floorPrice: number
  lastSale?: number
}

interface Network {
  id: string
  name: string
  symbol: string
  icon: string
  color: string
}

interface GasPrice {
  slow: number
  standard: number
  fast: number
  instant: number
}

export default function WalletDashboard() {
  // Networks
  const [networks] = useState<Network[]>([
    { id: "eth", name: "Ethereum", symbol: "ETH", icon: "⟠", color: "hsl(var(--primary))" },
    { id: "polygon", name: "Polygon", symbol: "MATIC", icon: "⬡", color: "hsl(238 70% 62%)" },
    { id: "arbitrum", name: "Arbitrum", symbol: "ARB", icon: "◆", color: "hsl(199 89% 48%)" },
    { id: "optimism", name: "Optimism", symbol: "OP", icon: "○", color: "hsl(0 72% 51%)" },
    { id: "base", name: "Base", symbol: "BASE", icon: "◯", color: "hsl(212 90% 52%)" },
  ])
  const [selectedNetwork, setSelectedNetwork] = useState("eth")

  // Wallet Assets
  const [assets, setAssets] = useState<WalletAsset[]>([
    {
      id: "eth",
      symbol: "ETH",
      name: "Ethereum",
      logo: "⟠",
      balance: 2.4521,
      price: 2347.82,
      change24h: 3.24,
      value: 5758.14,
      sparkline: [2280, 2310, 2290, 2340, 2320, 2360, 2347],
    },
    {
      id: "usdc",
      symbol: "USDC",
      name: "USD Coin",
      logo: "$",
      balance: 3500.0,
      price: 1.0,
      change24h: 0.01,
      value: 3500.0,
      sparkline: [1, 1, 1, 1, 1, 1, 1],
    },
    {
      id: "link",
      symbol: "LINK",
      name: "Chainlink",
      logo: "⬡",
      balance: 125.5,
      price: 14.23,
      change24h: -1.87,
      value: 1785.87,
      sparkline: [14.8, 14.5, 14.2, 14.4, 14.1, 14.3, 14.23],
    },
    {
      id: "uni",
      symbol: "UNI",
      name: "Uniswap",
      logo: "🦄",
      balance: 89.2,
      price: 7.45,
      change24h: 5.12,
      value: 664.54,
      sparkline: [7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.45],
    },
    {
      id: "aave",
      symbol: "AAVE",
      name: "Aave",
      logo: "👻",
      balance: 12.8,
      price: 92.56,
      change24h: 2.34,
      value: 1184.77,
      sparkline: [88, 89, 90, 91, 92, 93, 92.56],
    },
  ])

  // Portfolio totals
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)
  const [previousValue] = useState(totalValue * 0.975)
  const totalChange = ((totalValue - previousValue) / previousValue) * 100

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx1",
      hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      type: "receive",
      status: "confirmed",
      asset: "ETH",
      amount: 0.5,
      from: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3a",
      timestamp: Date.now() - 3600000,
      gasFee: 0.002,
    },
    {
      id: "tx2",
      hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
      type: "swap",
      status: "confirmed",
      asset: "USDC → ETH",
      amount: 500,
      timestamp: Date.now() - 7200000,
      gasFee: 0.004,
    },
    {
      id: "tx3",
      hash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
      type: "send",
      status: "confirmed",
      asset: "LINK",
      amount: 25.5,
      to: "0x8ba1f109551bD432803012645Hc136b7f48f56d7",
      timestamp: Date.now() - 86400000,
      gasFee: 0.003,
    },
    {
      id: "tx4",
      hash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
      type: "stake",
      status: "confirmed",
      asset: "ETH",
      amount: 1.0,
      timestamp: Date.now() - 172800000,
      gasFee: 0.005,
    },
    {
      id: "tx5",
      hash: "0x5e6f7890abcdef1234567890abcdef1234567890",
      type: "approve",
      status: "pending",
      asset: "UNI",
      amount: 0,
      timestamp: Date.now() - 300000,
      gasFee: 0.001,
    },
  ])

  // Staking
  const [stakingPositions] = useState<StakingPosition[]>([
    {
      id: "stake1",
      asset: "Ethereum",
      symbol: "ETH",
      stakedAmount: 2.5,
      apy: 4.2,
      rewardsEarned: 0.0875,
      unlockDate: Date.now() + 86400000 * 14,
    },
    {
      id: "stake2",
      asset: "Chainlink",
      symbol: "LINK",
      stakedAmount: 150,
      apy: 5.8,
      rewardsEarned: 7.25,
    },
    {
      id: "stake3",
      asset: "Aave",
      symbol: "AAVE",
      stakedAmount: 25,
      apy: 6.5,
      rewardsEarned: 1.35,
    },
  ])

  // DeFi Positions
  const [defiPositions] = useState<DeFiPosition[]>([
    {
      id: "defi1",
      protocol: "Uniswap V3",
      type: "liquidity",
      assets: ["ETH", "USDC"],
      value: 2500,
      apy: 12.5,
    },
    {
      id: "defi2",
      protocol: "Aave",
      type: "lending",
      assets: ["USDC"],
      value: 5000,
      apy: 3.2,
    },
    {
      id: "defi3",
      protocol: "Aave",
      type: "borrowing",
      assets: ["ETH"],
      value: 1500,
      apy: 2.8,
      health: 1.85,
    },
  ])

  // NFTs
  const [nfts] = useState<NFT[]>([
    { id: "nft1", name: "Bored Ape #4521", collection: "BAYC", image: "🦍", floorPrice: 28.5, lastSale: 32.1 },
    { id: "nft2", name: "Punk #7892", collection: "CryptoPunks", image: "👾", floorPrice: 52.3 },
    { id: "nft3", name: "Azuki #1234", collection: "Azuki", image: "⛩️", floorPrice: 8.2, lastSale: 9.1 },
    { id: "nft4", name: "Doodle #5678", collection: "Doodles", image: "🎨", floorPrice: 3.8 },
    { id: "nft5", name: "Clone X #9012", collection: "Clone X", image: "🤖", floorPrice: 4.2, lastSale: 5.0 },
    { id: "nft6", name: "Moonbird #3456", collection: "Moonbirds", image: "🦉", floorPrice: 2.1 },
  ])

  // Gas prices
  const [gasPrices, setGasPrices] = useState<GasPrice>({
    slow: 15,
    standard: 22,
    fast: 35,
    instant: 50,
  })

  // Price chart data
  const [priceHistory] = useState([
    { time: "00:00", price: 2280 },
    { time: "04:00", price: 2310 },
    { time: "08:00", price: 2290 },
    { time: "12:00", price: 2340 },
    { time: "16:00", price: 2320 },
    { time: "20:00", price: 2360 },
    { time: "Now", price: 2347 },
  ])

  // Send/Receive dialog states
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)
  const [sendAmount, setSendAmount] = useState("")
  const [sendAddress, setSendAddress] = useState("")
  const [sendAsset, setSendAsset] = useState("ETH")

  // Clipboard state
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  // Simulated real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update asset prices slightly
      setAssets((prev) =>
        prev.map((asset) => {
          const change = (Math.random() - 0.5) * 0.01
          const newPrice = asset.price * (1 + change)
          return {
            ...asset,
            price: newPrice,
            value: asset.balance * newPrice,
            change24h: asset.change24h + (Math.random() - 0.5) * 0.1,
          }
        })
      )

      // Update gas prices
      setGasPrices((prev) => ({
        slow: Math.max(10, prev.slow + Math.floor((Math.random() - 0.5) * 3)),
        standard: Math.max(15, prev.standard + Math.floor((Math.random() - 0.5) * 4)),
        fast: Math.max(25, prev.fast + Math.floor((Math.random() - 0.5) * 5)),
        instant: Math.max(40, prev.instant + Math.floor((Math.random() - 0.5) * 6)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Helper functions
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(text)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return <ArrowUp className="h-4 w-4" />
      case "receive":
        return <ArrowDown className="h-4 w-4" />
      case "swap":
        return <Repeat className="h-4 w-4" />
      case "stake":
        return <Lock className="h-4 w-4" />
      case "unstake":
        return <Zap className="h-4 w-4" />
      case "approve":
        return <Check className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "confirmed":
        return "bg-primary/20 text-primary border-primary/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
    }
  }

  // Portfolio allocation for pie chart
  const portfolioAllocation = assets.map((asset) => ({
    name: asset.symbol,
    value: asset.value,
    percentage: ((asset.value / totalValue) * 100).toFixed(1),
  }))

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(199 89% 48%)",
    "hsl(238 70% 62%)",
    "hsl(251 91% 67%)",
  ]

  return (
    <TooltipProvider>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-[1800px] mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
                Wallet Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Crypto portfolio & asset management
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Network Selector */}
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger className="w-[140px] glass border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {networks.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      <span className="flex items-center gap-2">
                        <span>{network.icon}</span>
                        <span>{network.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Gas Tracker Badge */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-sm px-3 py-1 cursor-help">
                    <Fuel className="h-3 w-3 mr-1" />
                    {gasPrices.standard} Gwei
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 text-xs">
                    <p>Slow: {gasPrices.slow} Gwei</p>
                    <p>Standard: {gasPrices.standard} Gwei</p>
                    <p>Fast: {gasPrices.fast} Gwei</p>
                    <p>Instant: {gasPrices.instant} Gwei</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Wallet className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">0x742d...bD3a</span>
              </Button>
            </div>
          </motion.div>

          {/* Portfolio Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Total Balance */}
            <Card className="glass border-primary/30 p-5 col-span-2 md:col-span-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-sm">Total Balance</p>
                <DollarSign className="h-5 w-5 text-primary/50" />
              </div>
              <motion.p
                key={totalValue}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                className="text-2xl md:text-3xl font-bold text-primary font-mono"
              >
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
              <div className="flex items-center gap-1 mt-1">
                {totalChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-primary" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span className={`text-xs ${totalChange >= 0 ? "text-primary" : "text-red-400"}`}>
                  {totalChange >= 0 ? "+" : ""}{totalChange.toFixed(2)}% (24h)
                </span>
              </div>
            </Card>

            {/* Assets Count */}
            <Card className="glass border-secondary/30 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-sm">Assets</p>
                <Layers className="h-5 w-5 text-secondary/50" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-secondary font-mono">
                {assets.length}
              </p>
              <p className="text-muted-foreground text-xs mt-1">tokens held</p>
            </Card>

            {/* NFTs */}
            <Card className="glass border-accent/30 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-sm">NFTs</p>
                <ImageIcon className="h-5 w-5 text-accent/50" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-accent font-mono">
                {nfts.length}
              </p>
              <p className="text-muted-foreground text-xs mt-1">collectibles</p>
            </Card>

            {/* Staking Rewards */}
            <Card className="glass border-amber-500/30 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-sm">Staking Rewards</p>
                <Sparkles className="h-5 w-5 text-amber-400/50" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-amber-400 font-mono">
                ${stakingPositions.reduce((sum, s) => sum + s.rewardsEarned * (assets.find(a => a.symbol === s.symbol)?.price || 0), 0).toFixed(2)}
              </p>
              <p className="text-muted-foreground text-xs mt-1">earned</p>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-2"
          >
            <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-primary/30">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Send Crypto</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Transfer tokens to another address
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Asset</Label>
                    <Select value={sendAsset} onValueChange={setSendAsset}>
                      <SelectTrigger className="glass-dark border-border/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.symbol}>
                            <span className="flex items-center gap-2">
                              <span>{asset.logo}</span>
                              <span>{asset.symbol}</span>
                              <span className="text-muted-foreground">({asset.balance.toFixed(4)})</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Recipient Address</Label>
                    <Input
                      placeholder="0x..."
                      value={sendAddress}
                      onChange={(e) => setSendAddress(e.target.value)}
                      className="glass-dark border-border/30 text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      className="glass-dark border-border/30 text-foreground"
                    />
                  </div>
                  <div className="glass-dark border-border/20 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gas Fee (est.)</span>
                      <span className="text-foreground font-mono">{(gasPrices.standard * 21000 / 1e9).toFixed(6)} ETH</span>
                    </div>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Shield className="h-4 w-4 mr-2" />
                    Confirm & Send
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-secondary/30 text-secondary hover:bg-secondary/10">
                  <QrCode className="h-4 w-4 mr-2" />
                  Receive
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-secondary/30">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Receive Crypto</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Share your address to receive tokens
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="glass-dark border-border/20 rounded-lg p-6 flex items-center justify-center">
                    <div className="w-32 h-32 bg-foreground/10 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-foreground/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Your Address</Label>
                    <div className="flex gap-2">
                      <Input
                        value="0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3a"
                        readOnly
                        className="glass-dark border-border/30 text-foreground font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border/30 text-foreground"
                        onClick={() => copyToClipboard("0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3a")}
                      >
                        {copiedAddress === "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3a" ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="border-border/30 text-foreground hover:bg-muted/50">
              <Repeat className="h-4 w-4 mr-2" />
              Swap
            </Button>
            <Button variant="outline" className="border-border/30 text-foreground hover:bg-muted/50">
              <CreditCard className="h-4 w-4 mr-2" />
              Buy
            </Button>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="assets" className="space-y-6">
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <TabsList className="glass border-primary/30 w-max md:w-auto">
                  <TabsTrigger value="assets" className="text-xs sm:text-sm whitespace-nowrap">Assets</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs sm:text-sm whitespace-nowrap">Activity</TabsTrigger>
                  <TabsTrigger value="staking" className="text-xs sm:text-sm whitespace-nowrap">Staking</TabsTrigger>
                  <TabsTrigger value="defi" className="text-xs sm:text-sm whitespace-nowrap">DeFi</TabsTrigger>
                  <TabsTrigger value="nfts" className="text-xs sm:text-sm whitespace-nowrap">NFTs</TabsTrigger>
                </TabsList>
              </div>

              {/* Assets Tab */}
              <TabsContent value="assets" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Asset List */}
                  <div className="lg:col-span-2">
                    <Card className="glass border-primary/30 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-foreground">Your Assets</h3>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {assets.map((asset, idx) => (
                          <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="glass-dark border-border/20 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                                  {asset.logo}
                                </div>
                                <div>
                                  <p className="text-foreground font-medium">{asset.name}</p>
                                  <p className="text-muted-foreground text-sm">
                                    {asset.balance.toFixed(4)} {asset.symbol}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {/* Mini sparkline */}
                                <div className="hidden sm:block w-20 h-8">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={asset.sparkline.map((v, i) => ({ v }))}>
                                      <Line
                                        type="monotone"
                                        dataKey="v"
                                        stroke={asset.change24h >= 0 ? "hsl(var(--primary))" : "hsl(0 72% 51%)"}
                                        strokeWidth={1.5}
                                        dot={false}
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                                <div className="text-right">
                                  <p className="text-foreground font-mono font-medium">
                                    ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                  <p className={`text-sm font-mono ${asset.change24h >= 0 ? "text-primary" : "text-red-400"}`}>
                                    {asset.change24h >= 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Portfolio Allocation */}
                  <div className="space-y-6">
                    <Card className="glass border-secondary/30 p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-6">Allocation</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={portfolioAllocation}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {portfolioAllocation.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--popover))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              color: "hsl(var(--popover-foreground))",
                            }}
                            formatter={(value: number) => `$${value.toFixed(2)}`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 mt-4">
                        {portfolioAllocation.map((item, idx) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                              />
                              <span className="text-muted-foreground text-sm">{item.name}</span>
                            </div>
                            <span className="text-foreground font-mono text-sm">{item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Price Chart */}
                    <Card className="glass border-accent/30 p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">ETH Price (24h)</h3>
                      <ResponsiveContainer width="100%" height={150}>
                        <AreaChart data={priceHistory}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="time"
                            stroke="hsl(var(--muted-foreground) / 0.5)"
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          />
                          <YAxis
                            domain={["dataMin - 50", "dataMax + 50"]}
                            stroke="hsl(var(--muted-foreground) / 0.5)"
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--popover))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              color: "hsl(var(--popover-foreground))",
                            }}
                            formatter={(value: number) => [`$${value}`, "Price"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(var(--primary))"
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card className="glass border-primary/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {transactions.length} transactions
                    </Badge>
                  </div>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {transactions.map((tx, idx) => (
                        <motion.div
                          key={tx.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="glass-dark border-border/20 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                tx.type === "receive" ? "bg-primary/20 text-primary" :
                                tx.type === "send" ? "bg-secondary/20 text-secondary" :
                                "bg-accent/20 text-accent"
                              }`}>
                                {getTransactionIcon(tx.type)}
                              </div>
                              <div>
                                <p className="text-foreground font-medium capitalize">{tx.type}</p>
                                <p className="text-muted-foreground text-xs">
                                  {new Date(tx.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(tx.status)}>
                              {tx.status}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <p className="text-foreground font-mono">
                                {tx.amount > 0 && (tx.type === "receive" ? "+" : "-")}{tx.amount} {tx.asset}
                              </p>
                              {tx.to && (
                                <p className="text-muted-foreground text-xs flex items-center gap-1">
                                  To: {truncateAddress(tx.to)}
                                  <button onClick={() => copyToClipboard(tx.to!)}>
                                    {copiedAddress === tx.to ? (
                                      <Check className="h-3 w-3 text-primary" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </button>
                                </p>
                              )}
                              {tx.from && (
                                <p className="text-muted-foreground text-xs flex items-center gap-1">
                                  From: {truncateAddress(tx.from)}
                                  <button onClick={() => copyToClipboard(tx.from!)}>
                                    {copiedAddress === tx.from ? (
                                      <Check className="h-3 w-3 text-primary" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </button>
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">
                                Gas: {tx.gasFee} ETH
                              </span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View on Etherscan</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>

              {/* Staking Tab */}
              <TabsContent value="staking" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stakingPositions.map((position, idx) => (
                    <motion.div
                      key={position.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Card className="glass border-primary/30 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{position.asset}</h3>
                            <p className="text-muted-foreground text-xs">{position.symbol} Staking</p>
                          </div>
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            {position.apy}% APY
                          </Badge>
                        </div>

                        <Separator className="bg-border/30 my-4" />

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Staked</span>
                            <span className="text-foreground font-mono">
                              {position.stakedAmount} {position.symbol}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Rewards</span>
                            <span className="text-primary font-mono">
                              +{position.rewardsEarned.toFixed(4)} {position.symbol}
                            </span>
                          </div>
                          {position.unlockDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">Unlocks</span>
                              <span className="text-secondary font-mono text-sm">
                                {Math.ceil((position.unlockDate - Date.now()) / 86400000)}d left
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Stake More
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-border/30 text-foreground"
                            disabled={!!(position.unlockDate && position.unlockDate > Date.now())}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Unstake
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Total Staking Stats */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Staking Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-dark border-border/20 rounded-lg p-4 text-center">
                      <p className="text-muted-foreground text-sm">Total Staked Value</p>
                      <p className="text-2xl font-bold text-primary font-mono">
                        ${stakingPositions.reduce((sum, s) => {
                          const asset = assets.find(a => a.symbol === s.symbol)
                          return sum + (asset ? s.stakedAmount * asset.price : 0)
                        }, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="glass-dark border-border/20 rounded-lg p-4 text-center">
                      <p className="text-muted-foreground text-sm">Total Rewards</p>
                      <p className="text-2xl font-bold text-secondary font-mono">
                        ${stakingPositions.reduce((sum, s) => {
                          const asset = assets.find(a => a.symbol === s.symbol)
                          return sum + (asset ? s.rewardsEarned * asset.price : 0)
                        }, 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="glass-dark border-border/20 rounded-lg p-4 text-center">
                      <p className="text-muted-foreground text-sm">Avg APY</p>
                      <p className="text-2xl font-bold text-accent font-mono">
                        {(stakingPositions.reduce((sum, s) => sum + s.apy, 0) / stakingPositions.length).toFixed(1)}%
                      </p>
                    </div>
                    <div className="glass-dark border-border/20 rounded-lg p-4 text-center">
                      <p className="text-muted-foreground text-sm">Active Positions</p>
                      <p className="text-2xl font-bold text-foreground font-mono">
                        {stakingPositions.length}
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* DeFi Tab */}
              <TabsContent value="defi" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {defiPositions.map((position, idx) => (
                    <motion.div
                      key={position.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Card className={`glass p-5 border-l-4 ${
                        position.type === "liquidity" ? "border-l-primary" :
                        position.type === "lending" ? "border-l-secondary" :
                        "border-l-amber-500"
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-foreground font-bold">{position.protocol}</h3>
                            <p className="text-muted-foreground text-xs capitalize">{position.type}</p>
                          </div>
                          <Badge className={`${
                            position.type === "liquidity" ? "bg-primary/20 text-primary border-primary/30" :
                            position.type === "lending" ? "bg-secondary/20 text-secondary border-secondary/30" :
                            "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          }`}>
                            {position.apy}% APY
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Assets</span>
                            <span className="text-foreground font-mono text-sm">
                              {position.assets.join(" / ")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Value</span>
                            <span className="text-foreground font-mono">
                              ${position.value.toLocaleString()}
                            </span>
                          </div>
                          {position.health && (
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-muted-foreground text-sm">Health Factor</span>
                                <span className={`font-mono text-sm ${
                                  position.health > 1.5 ? "text-primary" :
                                  position.health > 1.2 ? "text-amber-400" :
                                  "text-red-400"
                                }`}>
                                  {position.health.toFixed(2)}
                                </span>
                              </div>
                              <Progress
                                value={Math.min((position.health / 2) * 100, 100)}
                                className="h-1.5"
                              />
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-4 border-border/30 text-foreground"
                        >
                          Manage Position
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* DeFi Summary */}
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">DeFi Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="glass-dark border-border/20 rounded-lg p-4">
                      <p className="text-muted-foreground text-sm mb-1">Net Position</p>
                      <p className="text-2xl font-bold text-primary font-mono">
                        ${(defiPositions.filter(p => p.type !== "borrowing").reduce((s, p) => s + p.value, 0) -
                          defiPositions.filter(p => p.type === "borrowing").reduce((s, p) => s + p.value, 0)).toLocaleString()}
                      </p>
                    </div>
                    <div className="glass-dark border-border/20 rounded-lg p-4">
                      <p className="text-muted-foreground text-sm mb-1">Supplied</p>
                      <p className="text-2xl font-bold text-secondary font-mono">
                        ${defiPositions.filter(p => p.type === "lending").reduce((s, p) => s + p.value, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="glass-dark border-border/20 rounded-lg p-4">
                      <p className="text-muted-foreground text-sm mb-1">Borrowed</p>
                      <p className="text-2xl font-bold text-amber-400 font-mono">
                        ${defiPositions.filter(p => p.type === "borrowing").reduce((s, p) => s + p.value, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* NFTs Tab */}
              <TabsContent value="nfts" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {nfts.map((nft, idx) => (
                    <motion.div
                      key={nft.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Card className="glass border-primary/30 p-3 cursor-pointer">
                        <div className="aspect-square bg-muted/50 rounded-lg mb-3 flex items-center justify-center text-4xl">
                          {nft.image}
                        </div>
                        <div>
                          <p className="text-foreground font-medium text-sm truncate">{nft.name}</p>
                          <p className="text-muted-foreground text-xs truncate">{nft.collection}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-muted-foreground text-xs">Floor</span>
                            <span className="text-primary font-mono text-xs">{nft.floorPrice} ETH</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* NFT Summary */}
                <Card className="glass border-secondary/30 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">NFT Collection</h3>
                      <p className="text-muted-foreground text-sm">{nfts.length} items owned</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="text-center">
                        <p className="text-muted-foreground text-xs">Est. Floor Value</p>
                        <p className="text-xl font-bold text-primary font-mono">
                          {nfts.reduce((s, n) => s + n.floorPrice, 0).toFixed(2)} ETH
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground text-xs">USD Value</p>
                        <p className="text-xl font-bold text-secondary font-mono">
                          ${(nfts.reduce((s, n) => s + n.floorPrice, 0) * (assets.find(a => a.symbol === "ETH")?.price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Gas Tracker Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-auto"
          >
            <Card className="glass border-primary/30 p-3 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                <span className="text-foreground text-sm font-medium">Gas</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Tooltip>
                  <TooltipTrigger className="px-2 py-1 rounded bg-muted/50 text-muted-foreground">
                    🐢 {gasPrices.slow}
                  </TooltipTrigger>
                  <TooltipContent>Slow (~10 min)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="px-2 py-1 rounded bg-primary/20 text-primary">
                    ⚡ {gasPrices.standard}
                  </TooltipTrigger>
                  <TooltipContent>Standard (~3 min)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="px-2 py-1 rounded bg-secondary/20 text-secondary">
                    🚀 {gasPrices.fast}
                  </TooltipTrigger>
                  <TooltipContent>Fast (~1 min)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="px-2 py-1 rounded bg-accent/20 text-accent">
                    ⚡⚡ {gasPrices.instant}
                  </TooltipTrigger>
                  <TooltipContent>Instant (~15 sec)</TooltipContent>
                </Tooltip>
              </div>
              <span className="text-muted-foreground text-xs">Gwei</span>
            </Card>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  )
}
