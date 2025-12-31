"use client"

import * as React from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  Calendar,
  Clock,
  Download,
  RefreshCw,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Percent,
  CreditCard,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Trophy,
  Star,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  BarChart3
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  FunnelChart,
  Funnel,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"

// Types
type Deal = {
  id: string
  company: string
  contact: string
  value: number
  stage: string
  probability: number
  closeDate: string
  owner: string
  status: "active" | "won" | "lost"
}

type SalesRep = {
  id: string
  name: string
  avatar: string
  deals: number
  revenue: number
  quota: number
  winRate: number
  avgDealSize: number
  rank: number
}

// Mock Data
const generateRevenueData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((month, i) => ({
    month,
    revenue: Math.floor(Math.random() * 500000) + 1000000,
    target: 1200000,
    deals: Math.floor(Math.random() * 50) + 80,
    forecast: Math.floor(Math.random() * 600000) + 1100000,
  }))
}

const generatePipelineData = () => [
  { stage: "Prospecting", deals: 145, value: 2450000, probability: 10 },
  { stage: "Qualification", deals: 98, value: 1960000, probability: 25 },
  { stage: "Proposal", deals: 67, value: 1675000, probability: 50 },
  { stage: "Negotiation", deals: 45, value: 1350000, probability: 75 },
  { stage: "Closing", deals: 28, value: 980000, probability: 90 },
]

const generateWinLossData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map(month => ({
    month,
    won: Math.floor(Math.random() * 30) + 40,
    lost: Math.floor(Math.random() * 15) + 10,
  }))
}

const generateSalesReps = (): SalesRep[] => [
  { id: "1", name: "Sarah Chen", avatar: "/images/avatars/sc-40x40.png", deals: 28, revenue: 1450000, quota: 1200000, winRate: 68, avgDealSize: 51786, rank: 1 },
  { id: "2", name: "Michael Torres", avatar: "/images/avatars/mt-40x40.png", deals: 24, revenue: 1280000, quota: 1200000, winRate: 62, avgDealSize: 53333, rank: 2 },
  { id: "3", name: "Emily Rodriguez", avatar: "/images/avatars/er-40x40.png", deals: 31, revenue: 1190000, quota: 1200000, winRate: 58, avgDealSize: 38387, rank: 3 },
  { id: "4", name: "James Wilson", avatar: "/images/avatars/jw-40x40.png", deals: 19, revenue: 1050000, quota: 1200000, winRate: 72, avgDealSize: 55263, rank: 4 },
  { id: "5", name: "Lisa Anderson", avatar: "/images/avatars/la-40x40.png", deals: 26, revenue: 980000, quota: 1200000, winRate: 65, avgDealSize: 37692, rank: 5 },
  { id: "6", name: "David Kim", avatar: "/images/avatars/dc-40x40.png", deals: 22, revenue: 890000, quota: 1200000, winRate: 59, avgDealSize: 40455, rank: 6 },
]

const generateDeals = (): Deal[] => [
  { id: "D001", company: "Acme Corp", contact: "John Smith", value: 125000, stage: "Negotiation", probability: 75, closeDate: "2025-02-15", owner: "Sarah Chen", status: "active" },
  { id: "D002", company: "TechStart Inc", contact: "Emily Davis", value: 89000, stage: "Proposal", probability: 50, closeDate: "2025-02-28", owner: "Michael Torres", status: "active" },
  { id: "D003", company: "Global Solutions", contact: "Robert Johnson", value: 245000, stage: "Closing", probability: 90, closeDate: "2025-02-10", owner: "Sarah Chen", status: "active" },
  { id: "D004", company: "Innovation Labs", contact: "Maria Garcia", value: 67000, stage: "Qualification", probability: 25, closeDate: "2025-03-15", owner: "Emily Rodriguez", status: "active" },
  { id: "D005", company: "Enterprise Co", contact: "David Lee", value: 198000, stage: "Negotiation", probability: 75, closeDate: "2025-02-20", owner: "James Wilson", status: "active" },
  { id: "D006", company: "StartupX", contact: "Lisa Brown", value: 45000, stage: "Prospecting", probability: 10, closeDate: "2025-04-01", owner: "Lisa Anderson", status: "active" },
  { id: "D007", company: "MegaCorp", contact: "Thomas Wilson", value: 320000, stage: "Proposal", probability: 50, closeDate: "2025-03-01", owner: "Sarah Chen", status: "active" },
  { id: "D008", company: "CloudTech", contact: "Jennifer Martinez", value: 78000, stage: "Qualification", probability: 25, closeDate: "2025-03-20", owner: "David Kim", status: "active" },
]

const generateDealValueDistribution = () => [
  { range: "$0-25K", count: 45, fill: "hsl(var(--primary))" },
  { range: "$25-50K", count: 38, fill: "hsl(var(--primary) / 0.8)" },
  { range: "$50-100K", count: 52, fill: "hsl(var(--primary) / 0.6)" },
  { range: "$100-250K", count: 28, fill: "hsl(var(--primary) / 0.4)" },
  { range: "$250K+", count: 12, fill: "hsl(var(--primary) / 0.3)" },
]

const generateProductPerformance = () => [
  { product: "Enterprise Suite", revenue: 3450000, deals: 42, avgDealSize: 82143, growth: 24.5 },
  { product: "Professional Plan", revenue: 2890000, deals: 156, avgDealSize: 18526, growth: 18.2 },
  { product: "Starter Package", revenue: 1240000, deals: 284, avgDealSize: 4366, growth: 32.1 },
  { product: "Custom Solutions", revenue: 2120000, deals: 28, avgDealSize: 75714, growth: -5.4 },
  { product: "Add-ons & Services", revenue: 890000, deals: 198, avgDealSize: 4495, growth: 15.8 },
]

const generateCustomerSegments = () => [
  { segment: "Enterprise", value: 45, revenue: 5200000, color: "hsl(var(--primary))" },
  { segment: "Mid-Market", value: 32, revenue: 3800000, color: "hsl(var(--primary) / 0.7)" },
  { segment: "Small Business", value: 23, revenue: 1900000, color: "hsl(var(--primary) / 0.5)" },
]

const generateCommissionData = () => {
  const reps = generateSalesReps()
  return reps.map(rep => ({
    name: rep.name,
    commission: Math.floor(rep.revenue * 0.08),
    bonus: rep.revenue > rep.quota ? 5000 : 0,
    total: Math.floor(rep.revenue * 0.08) + (rep.revenue > rep.quota ? 5000 : 0),
  }))
}

export default function SalesDashboard() {
  const [timeRange, setTimeRange] = React.useState("30d")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStage, setSelectedStage] = React.useState("all")

  // Data
  const revenueData = generateRevenueData()
  const pipelineData = generatePipelineData()
  const winLossData = generateWinLossData()
  const salesReps = generateSalesReps()
  const deals = generateDeals()
  const dealValueDistribution = generateDealValueDistribution()
  const productPerformance = generateProductPerformance()
  const customerSegments = generateCustomerSegments()
  const commissionData = generateCommissionData()

  // Calculations
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const totalDeals = deals.length
  const avgDealSize = totalRevenue / totalDeals
  const totalPipelineValue = pipelineData.reduce((sum, stage) => sum + stage.value, 0)
  const wonDeals = winLossData.reduce((sum, d) => sum + d.won, 0)
  const lostDeals = winLossData.reduce((sum, d) => sum + d.lost, 0)
  const winRate = (wonDeals / (wonDeals + lostDeals)) * 100

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleExport = () => {
    console.log("Exporting sales data...")
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Sales Dashboard</h1>
          <p className="text-secondary/70">Revenue tracking, pipeline management, and sales performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px] glass-dark border/20">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-dark border/20">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last Quarter</SelectItem>
              <SelectItem value="1y">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" className="glass border/20" disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport} className="glass border/20 text-foreground">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Total Revenue</span>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">$12.4M</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                18.2%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">MRR</span>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">$1.03M</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                12.5%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">ARR</span>
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">$12.4M</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                24.8%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Win Rate</span>
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{winRate.toFixed(1)}%</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                5.4%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Avg Deal Size</span>
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">${(avgDealSize / 1000).toFixed(0)}K</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                8.7%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Pipeline Value</span>
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">${(totalPipelineValue / 1000000).toFixed(1)}M</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                15.2%
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Revenue Performance</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: '8px',
                padding: '12px',
                color: "hsl(var(--popover-foreground))"
              }}
            labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
            <Line type="monotone" dataKey="target" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
            <Line type="monotone" dataKey="forecast" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Forecast" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Sales Pipeline & Win/Loss */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Pipeline */}
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Sales Pipeline by Stage</h3>
          <div className="space-y-4">
            {pipelineData.map((stage, index) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{stage.stage}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-secondary/30 text-secondary">
                      {stage.deals} deals
                    </Badge>
                    <span className="text-foreground font-semibold">${(stage.value / 1000000).toFixed(2)}M</span>
                  </div>
                </div>
                <div className="relative h-3 bg-secondary/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stage.value / pipelineData[0].value) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    style={{ opacity: 1 - (index * 0.15) }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-secondary/70">
                  <span>Win Probability: {stage.probability}%</span>
                  <span>Weighted Value: ${((stage.value * stage.probability) / 100000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Win/Loss Rate */}
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Win/Loss Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={winLossData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              />
              <Legend />
              <Bar dataKey="won" fill="hsl(var(--primary))" name="Won Deals" radius={[8, 8, 0, 0]} />
              <Bar dataKey="lost" fill="hsl(var(--destructive))" name="Lost Deals" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Sales Leaderboard */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Top Performing Sales Reps
        </h3>
        <div className="space-y-4">
          {salesReps.map((rep, index) => (
            <motion.div
              key={rep.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-dark border/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between gap-3 sm:gap-4 mb-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <Badge
                    variant="outline"
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shrink-0 text-xs sm:text-sm ${
                      rep.rank === 1 ? 'border-yellow-500 text-yellow-400' :
                      rep.rank === 2 ? 'border-gray-400 text-gray-400' :
                      rep.rank === 3 ? 'border-orange-500 text-orange-400' :
                      'border-secondary/30 text-secondary'
                    }`}
                  >
                    #{rep.rank}
                  </Badge>
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                    <AvatarImage src={rep.avatar} />
                    <AvatarFallback className="bg-secondary/20 text-secondary text-xs sm:text-sm">
                      {rep.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm sm:text-base truncate">{rep.name}</p>
                    <p className="text-xs text-secondary/70">{rep.deals} deals</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg sm:text-2xl font-bold text-primary">${(rep.revenue / 1000000).toFixed(2)}M</p>
                  <p className="text-xs text-secondary/70">
                    {((rep.revenue / rep.quota) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border/20">
                <div>
                  <p className="text-xs text-secondary/70">Win Rate</p>
                  <p className="text-foreground font-semibold">{rep.winRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-secondary/70">Avg Deal Size</p>
                  <p className="text-foreground font-semibold">${(rep.avgDealSize / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-secondary/70">Quota Achievement</p>
                  <Progress value={(rep.revenue / rep.quota) * 100} className="h-2 mt-1 bg-secondary/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recent Deals */}
      <Card className="glass border/20 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Active Deals</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50" />
              <Input
                placeholder="Search..."
                className="pl-10 glass-dark border/20 w-full sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-full sm:w-[150px] glass-dark border/20">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-dark border/20">
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="prospecting">Prospecting</SelectItem>
                <SelectItem value="qualification">Qualification</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closing">Closing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="border-b border-border/20">
                <TableHead className="text-secondary whitespace-nowrap">Deal ID</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Company</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Contact</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Value</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Stage</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Probability</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Close Date</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Owner</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals
                .filter(deal =>
                  (selectedStage === "all" || deal.stage.toLowerCase() === selectedStage) &&
                  (deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   deal.contact.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((deal) => (
                  <TableRow key={deal.id} className="border-b border-border/20 hover:bg-secondary/10">
                    <TableCell className="font-mono text-primary">{deal.id}</TableCell>
                    <TableCell className="font-semibold text-foreground">{deal.company}</TableCell>
                    <TableCell className="text-secondary/70">{deal.contact}</TableCell>
                    <TableCell className="text-primary font-semibold">${deal.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {deal.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={deal.probability} className="h-2 w-20 bg-secondary/20" />
                        <span className="text-xs text-secondary/70">{deal.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-secondary/70">{deal.closeDate}</TableCell>
                    <TableCell className="text-foreground">{deal.owner}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-dark border/20">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                          <DropdownMenuItem>Send Proposal</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Deal Value Distribution & Customer Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Deal Value Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dealValueDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="range" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {dealValueDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Revenue by Customer Segment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ segment, value }) => `${segment}: ${value}%`}
              >
                {customerSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Product Performance */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Product/Category Performance</h3>
        <div className="space-y-4">
          {productPerformance.map((product, index) => (
            <div key={product.product} className="glass-dark border/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-foreground font-semibold">{product.product}</h4>
                <div className={`flex items-center text-sm ${product.growth > 0 ? 'text-primary' : 'text-red-400'}`}>
                  {product.growth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(product.growth)}%
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-secondary/70">Revenue</p>
                  <p className="text-foreground font-semibold text-lg">${(product.revenue / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-secondary/70">Deals Closed</p>
                  <p className="text-foreground font-semibold text-lg">{product.deals}</p>
                </div>
                <div>
                  <p className="text-secondary/70">Avg Deal Size</p>
                  <p className="text-foreground font-semibold text-lg">${(product.avgDealSize / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Commission Calculations */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Commission & Earnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commissionData.map((rep, index) => (
            <motion.div
              key={rep.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-dark border/20 rounded-lg p-4"
            >
              <h4 className="text-foreground font-semibold mb-3">{rep.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-secondary/70 text-sm">Base Commission (8%)</span>
                  <span className="text-foreground font-semibold">${rep.commission.toLocaleString()}</span>
                </div>
                {rep.bonus > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-secondary/70 text-sm">Quota Bonus</span>
                    <span className="text-primary font-semibold">+${rep.bonus.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-border/20">
                  <span className="text-foreground font-semibold">Total Earnings</span>
                  <span className="text-2xl font-bold text-primary">${rep.total.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* CAC & LTV */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Customer Acquisition Cost (CAC)</h3>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-foreground mb-2">$1,245</p>
              <p className="text-secondary/70">Average CAC</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">$890</p>
                <p className="text-xs text-secondary/70 mt-1">Enterprise CAC</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">$1,580</p>
                <p className="text-xs text-secondary/70 mt-1">SMB CAC</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Lifetime Value (LTV)</h3>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-foreground mb-2">$8,420</p>
              <p className="text-secondary/70">Average LTV</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">6.76x</p>
                <p className="text-xs text-secondary/70 mt-1">LTV:CAC Ratio</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">18 mo</p>
                <p className="text-xs text-secondary/70 mt-1">Payback Period</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
