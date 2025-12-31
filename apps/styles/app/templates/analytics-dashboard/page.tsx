"use client"

import * as React from "react"
import {
  Activity,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Calendar,
  Filter,
  Search,
  MapPin,
  Target,
  Zap,
  Share2,
  ShoppingCart,
  DollarSign,
  Percent,
  AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button, Input, Badge, Card, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ggprompts/ui"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Funnel,
  FunnelChart,
} from "recharts"

// Types
type KPIData = {
  label: string
  value: string
  change: number
  trend: "up" | "down"
  icon: React.ReactNode
  color: string
}

type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y"

// Mock Data Generation
const generatePageViewsData = () => {
  const data = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pageViews: Math.floor(Math.random() * 5000) + 15000,
      uniqueVisitors: Math.floor(Math.random() * 3000) + 8000,
      sessions: Math.floor(Math.random() * 3500) + 9000,
      bounceRate: Math.floor(Math.random() * 20) + 30,
    })
  }
  return data
}

const generateFunnelData = () => [
  { name: "Landing Page Visitors", value: 10000, fill: "hsl(var(--primary))" },
  { name: "Product Page Views", value: 7500, fill: "hsl(var(--primary) / 0.8)" },
  { name: "Add to Cart", value: 4200, fill: "hsl(var(--primary) / 0.7)" },
  { name: "Checkout Started", value: 2800, fill: "hsl(var(--primary) / 0.6)" },
  { name: "Purchase Completed", value: 1850, fill: "hsl(var(--primary) / 0.5)" },
]

const generateCohortData = () => {
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"]
  return weeks.map((week, weekIndex) => {
    const data: any = { week }
    for (let day = 0; day <= weekIndex; day++) {
      data[`day${day}`] = Math.max(100 - (day * 15) - Math.random() * 10, 10)
    }
    return data
  })
}

const generateTrafficSourcesData = () => [
  { name: "Organic Search", value: 42, visitors: 21000, fill: "hsl(var(--primary))" },
  { name: "Direct", value: 28, visitors: 14000, fill: "hsl(var(--primary) / 0.8)" },
  { name: "Social Media", value: 18, visitors: 9000, fill: "hsl(var(--primary) / 0.7)" },
  { name: "Referral", value: 8, visitors: 4000, fill: "hsl(var(--primary) / 0.6)" },
  { name: "Email", value: 4, visitors: 2000, fill: "hsl(var(--primary) / 0.5)" },
]

const generateTopPagesData = () => [
  { page: "/home", views: 45234, uniqueVisitors: 32145, avgDuration: "3:24", bounceRate: 32, exitRate: 28, conversions: 892 },
  { page: "/products", views: 38721, uniqueVisitors: 28934, avgDuration: "4:12", bounceRate: 28, exitRate: 24, conversions: 1245 },
  { page: "/blog/getting-started", views: 29834, uniqueVisitors: 24521, avgDuration: "5:43", bounceRate: 22, exitRate: 18, conversions: 234 },
  { page: "/pricing", views: 24567, uniqueVisitors: 19823, avgDuration: "2:56", bounceRate: 45, exitRate: 38, conversions: 678 },
  { page: "/features", views: 21345, uniqueVisitors: 17234, avgDuration: "3:48", bounceRate: 35, exitRate: 30, conversions: 456 },
  { page: "/about", views: 18234, uniqueVisitors: 15123, avgDuration: "2:18", bounceRate: 52, exitRate: 48, conversions: 89 },
  { page: "/contact", views: 15678, uniqueVisitors: 13456, avgDuration: "1:42", bounceRate: 38, exitRate: 35, conversions: 234 },
  { page: "/blog/advanced-tips", views: 13234, uniqueVisitors: 11234, avgDuration: "6:12", bounceRate: 18, exitRate: 15, conversions: 167 },
]

const generateGeographicData = () => [
  { country: "United States", visitors: 125000, sessions: 178000, bounceRate: 35, avgDuration: "3:42" },
  { country: "United Kingdom", visitors: 78000, sessions: 112000, bounceRate: 32, avgDuration: "3:56" },
  { country: "Germany", visitors: 56000, sessions: 82000, bounceRate: 38, avgDuration: "3:18" },
  { country: "Canada", visitors: 45000, sessions: 67000, bounceRate: 33, avgDuration: "3:48" },
  { country: "France", visitors: 42000, sessions: 61000, bounceRate: 36, avgDuration: "3:24" },
  { country: "Australia", visitors: 38000, sessions: 55000, bounceRate: 31, avgDuration: "4:02" },
  { country: "Japan", visitors: 34000, sessions: 49000, bounceRate: 42, avgDuration: "2:54" },
  { country: "India", visitors: 32000, sessions: 48000, bounceRate: 45, avgDuration: "2:38" },
]

const generateDeviceData = () => [
  { device: "Desktop", sessions: 245000, percentage: 52, avgDuration: "4:23", bounceRate: 28 },
  { device: "Mobile", sessions: 185000, percentage: 39, avgDuration: "2:45", bounceRate: 42 },
  { device: "Tablet", sessions: 42000, percentage: 9, avgDuration: "3:18", bounceRate: 35 },
]

const generateHourlyTrafficData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    traffic: Math.floor(Math.random() * 3000) + (i >= 9 && i <= 17 ? 5000 : 1000),
    conversions: Math.floor(Math.random() * 100) + (i >= 9 && i <= 17 ? 150 : 30),
  }))
}

const generateGoalCompletionsData = () => [
  { goal: "Newsletter Signup", completions: 3245, conversionRate: 12.4, value: "$32,450" },
  { goal: "Product Purchase", completions: 1850, conversionRate: 7.1, value: "$185,000" },
  { goal: "Free Trial Started", completions: 2134, conversionRate: 8.2, value: "$42,680" },
  { goal: "Contact Form Submit", completions: 1456, conversionRate: 5.6, value: "$14,560" },
  { goal: "Download Resource", completions: 4567, conversionRate: 17.5, value: "$22,835" },
]

const generateUserBehaviorData = () => [
  { metric: "Pages per Session", value: 4.2, previous: 3.8, change: 10.5 },
  { metric: "Avg Session Duration", value: 3.45, previous: 3.12, change: 10.6 },
  { metric: "New vs Returning", value: 62, previous: 58, change: 6.9 },
]

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("30d")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [selectedMetric, setSelectedMetric] = React.useState("pageViews")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Data
  const pageViewsData = generatePageViewsData()
  const funnelData = generateFunnelData()
  const cohortData = generateCohortData()
  const trafficSourcesData = generateTrafficSourcesData()
  const topPagesData = generateTopPagesData()
  const geographicData = generateGeographicData()
  const deviceData = generateDeviceData()
  const hourlyTrafficData = generateHourlyTrafficData()
  const goalCompletionsData = generateGoalCompletionsData()

  // KPI Data
  const kpiData: KPIData[] = [
    {
      label: "Total Users",
      value: "524.3K",
      change: 12.5,
      trend: "up",
      icon: <Users className="h-4 w-4" />,
      color: "text-primary"
    },
    {
      label: "Sessions",
      value: "782.1K",
      change: 8.3,
      trend: "up",
      icon: <Activity className="h-4 w-4" />,
      color: "text-secondary"
    },
    {
      label: "Bounce Rate",
      value: "32.4%",
      change: -4.2,
      trend: "down",
      icon: <ArrowDownRight className="h-4 w-4" />,
      color: "text-green-400"
    },
    {
      label: "Avg Duration",
      value: "3:42",
      change: 15.8,
      trend: "up",
      icon: <Clock className="h-4 w-4" />,
      color: "text-blue-400"
    },
    {
      label: "Page Views",
      value: "2.4M",
      change: 18.7,
      trend: "up",
      icon: <Eye className="h-4 w-4" />,
      color: "text-primary"
    },
    {
      label: "Unique Visitors",
      value: "456.2K",
      change: 22.1,
      trend: "up",
      icon: <Users className="h-4 w-4" />,
      color: "text-accent"
    },
    {
      label: "Pages/Session",
      value: "4.2",
      change: 10.5,
      trend: "up",
      icon: <BarChart2 className="h-4 w-4" />,
      color: "text-secondary"
    },
    {
      label: "Conversion Rate",
      value: "3.8%",
      change: 5.4,
      trend: "up",
      icon: <Target className="h-4 w-4" />,
      color: "text-green-400"
    },
    {
      label: "Real-time Visitors",
      value: "1,234",
      change: 8.2,
      trend: "up",
      icon: <Zap className="h-4 w-4" />,
      color: "text-yellow-400"
    },
    {
      label: "Mobile Traffic",
      value: "39%",
      change: 3.1,
      trend: "up",
      icon: <Smartphone className="h-4 w-4" />,
      color: "text-purple-400"
    },
    {
      label: "Desktop Traffic",
      value: "52%",
      change: -2.4,
      trend: "down",
      icon: <Monitor className="h-4 w-4" />,
      color: "text-blue-400"
    },
    {
      label: "Tablet Traffic",
      value: "9%",
      change: -0.7,
      trend: "down",
      icon: <Tablet className="h-4 w-4" />,
      color: "text-indigo-400"
    },
    {
      label: "Social Referrals",
      value: "18.2K",
      change: 24.8,
      trend: "up",
      icon: <Share2 className="h-4 w-4" />,
      color: "text-pink-400"
    },
    {
      label: "Direct Traffic",
      value: "28%",
      change: -1.2,
      trend: "down",
      icon: <Globe className="h-4 w-4" />,
      color: "text-secondary"
    },
    {
      label: "Goal Completions",
      value: "13.2K",
      change: 16.3,
      trend: "up",
      icon: <Target className="h-4 w-4" />,
      color: "text-primary"
    },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleExport = () => {
    console.log("Exporting analytics data...")
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">Analytics Dashboard</h1>
          <p className="text-secondary/70 text-sm sm:text-base">Comprehensive analytics and user insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select value={timeRange} onValueChange={(val) => setTimeRange(val as TimeRange)}>
            <SelectTrigger className="w-[140px] sm:w-[180px] glass-dark border/20 text-sm">
              <Calendar className="mr-2 h-4 w-4 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-dark border/20">
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="glass border/20"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 sm:mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button onClick={handleExport} size="sm" className="glass border/20 text-foreground">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
      >
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass border/20 p-4 hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-secondary/70 text-sm font-medium">{kpi.label}</span>
                <span className={`${kpi.color}`}>{kpi.icon}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                <div className={`flex items-center text-sm ${kpi.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Page Views Over Time */}
      <Card className="glass border/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold text-foreground">Traffic Overview</h3>
          <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full sm:w-auto">
            <TabsList className="glass-dark border/20 w-full sm:w-auto">
              <TabsTrigger value="pageViews" className="flex-1 sm:flex-none text-xs sm:text-sm">Page Views</TabsTrigger>
              <TabsTrigger value="sessions" className="flex-1 sm:flex-none text-xs sm:text-sm">Sessions</TabsTrigger>
              <TabsTrigger value="uniqueVisitors" className="flex-1 sm:flex-none text-xs sm:text-sm">Visitors</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="overflow-x-auto -mx-6 px-6">
          <div className="min-w-[500px]">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={pageViewsData}>
            <defs>
              <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
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
            {selectedMetric === "pageViews" && (
              <Area type="monotone" dataKey="pageViews" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPageViews)" strokeWidth={2} />
            )}
            {selectedMetric === "sessions" && (
              <Area type="monotone" dataKey="sessions" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorSessions)" strokeWidth={2} />
            )}
            {selectedMetric === "uniqueVisitors" && (
              <Area type="monotone" dataKey="uniqueVisitors" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPageViews)" strokeWidth={2} />
            )}
          </AreaChart>
        </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Conversion Funnel & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">User Acquisition Funnel</h3>
          <div className="space-y-4">
            {funnelData.map((stage, index) => {
              const percentage = index === 0 ? 100 : (stage.value / funnelData[0].value) * 100
              const conversionRate = index > 0 ? ((stage.value / funnelData[index - 1].value) * 100).toFixed(1) : '100.0'
              return (
                <div key={stage.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium">{stage.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-secondary/70">{stage.value.toLocaleString()} users</span>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {conversionRate}%
                      </Badge>
                    </div>
                  </div>
                  <div className="relative h-3 bg-secondary/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: stage.fill }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Traffic Sources</h3>
          <div className="flex items-center justify-center mb-6 overflow-x-auto">
            <div className="min-w-[280px] w-full">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                <Pie
                  data={trafficSourcesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {trafficSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
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
            </div>
          </div>
          <div className="space-y-3">
            {trafficSourcesData.map((source) => (
              <div key={source.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.fill }} />
                  <span className="text-foreground">{source.name}</span>
                </div>
                <span className="text-secondary/70">{source.visitors.toLocaleString()} visitors</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Cohort Retention Heatmap */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Cohort Retention Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2 text-secondary/70 text-sm">Cohort</th>
                {Array.from({ length: 7 }, (_, i) => (
                  <th key={i} className="text-center p-2 text-secondary/70 text-sm">Day {i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortData.map((row, rowIndex) => (
                <tr key={row.week}>
                  <td className="p-2 text-foreground font-medium text-sm">{row.week}</td>
                  {Array.from({ length: 7 }, (_, colIndex) => {
                    const value = row[`day${colIndex}`]
                    const opacity = value ? value / 100 : 0
                    return (
                      <td key={colIndex} className="p-1">
                        {value !== undefined && (
                          <div
                            className="h-10 flex items-center justify-center rounded text-sm font-semibold"
                            style={{
                              backgroundColor: `rgba(16, 185, 129, ${opacity * 0.8})`,
                              color: opacity > 0.5 ? '#000' : '#10b981'
                            }}
                          >
                            {value.toFixed(0)}%
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top Pages Table */}
      <Card className="glass border/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Top Pages</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50" />
            <Input
              placeholder="Search pages..."
              className="pl-10 glass-dark border/20 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/20">
                <TableHead className="text-secondary">Page</TableHead>
                <TableHead className="text-secondary text-right">Views</TableHead>
                <TableHead className="text-secondary text-right">Unique Visitors</TableHead>
                <TableHead className="text-secondary text-right">Avg Duration</TableHead>
                <TableHead className="text-secondary text-right">Bounce Rate</TableHead>
                <TableHead className="text-secondary text-right">Exit Rate</TableHead>
                <TableHead className="text-secondary text-right">Conversions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPagesData
                .filter(page => page.page.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((page, index) => (
                  <TableRow key={index} className="border-b border-border/20 hover:bg-secondary/10">
                    <TableCell className="font-mono text-primary">{page.page}</TableCell>
                    <TableCell className="text-right text-foreground font-semibold">{page.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-secondary/70">{page.uniqueVisitors.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-secondary/70">{page.avgDuration}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={page.bounceRate > 40 ? 'border-red-500/30 text-red-400' : 'border-green-500/30 text-green-400'}>
                        {page.bounceRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-secondary/70">{page.exitRate}%</TableCell>
                    <TableCell className="text-right text-primary font-semibold">{page.conversions}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Geographic Distribution & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Geographic Distribution</h3>
          <div className="space-y-4">
            {geographicData.map((country, index) => (
              <div key={country.country} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-foreground font-medium">{country.country}</span>
                  </div>
                  <span className="text-secondary/70">{country.visitors.toLocaleString()} visitors</span>
                </div>
                <Progress value={(country.visitors / geographicData[0].visitors) * 100} className="h-2 bg-secondary/20" />
              </div>
            ))}
          </div>
        </Card>

        {/* Device Breakdown */}
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Device Breakdown</h3>
          <div className="space-y-6">
            {deviceData.map((device) => {
              const Icon = device.device === 'Desktop' ? Monitor : device.device === 'Mobile' ? Smartphone : Tablet
              return (
                <div key={device.device} className="glass-dark border/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-foreground font-semibold">{device.device}</span>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary text-lg px-3">
                      {device.percentage}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-secondary/70">Sessions</p>
                      <p className="text-foreground font-semibold">{device.sessions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-secondary/70">Avg Duration</p>
                      <p className="text-foreground font-semibold">{device.avgDuration}</p>
                    </div>
                    <div>
                      <p className="text-secondary/70">Bounce Rate</p>
                      <p className={device.bounceRate > 40 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                        {device.bounceRate}%
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Hourly Traffic Pattern */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">24-Hour Traffic Pattern</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <div className="min-w-[600px]">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={hourlyTrafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" stroke="hsl(var(--primary))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="traffic" fill="hsl(var(--primary))" name="Traffic" />
            <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="hsl(var(--accent))" strokeWidth={2} name="Conversions" />
          </ComposedChart>
        </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Goal Completions */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Goal Completions & Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goalCompletionsData.map((goal, index) => (
            <motion.div
              key={goal.goal}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-dark border/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-foreground font-semibold">{goal.goal}</h4>
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-secondary/70 text-sm">Completions</span>
                  <span className="text-2xl font-bold text-foreground">{goal.completions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-secondary/70 text-sm">Conversion Rate</span>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {goal.conversionRate}%
                  </Badge>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-secondary/70 text-sm">Est. Value</span>
                  <span className="text-primary font-semibold">{goal.value}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Real-time Activity */}
      <Card className="glass border/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
            Real-time Activity
          </h3>
          <Badge variant="outline" className="border-primary/30 text-primary text-lg px-3">
            1,234 active users
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-dark border/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-secondary" />
              <span className="text-secondary/70 text-sm">Active Pages</span>
            </div>
            <p className="text-3xl font-bold text-foreground">48</p>
          </div>
          <div className="glass-dark border/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="h-4 w-4 text-primary" />
              <span className="text-secondary/70 text-sm">Clicks/min</span>
            </div>
            <p className="text-3xl font-bold text-foreground">2,834</p>
          </div>
          <div className="glass-dark border/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-purple-400" />
              <span className="text-secondary/70 text-sm">Events/min</span>
            </div>
            <p className="text-3xl font-bold text-foreground">1,456</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
