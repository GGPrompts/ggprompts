"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Scatter,
  ScatterChart,
  ZAxis,
  Funnel,
  FunnelChart,
} from "recharts"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  Download,
  TrendingUpIcon,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  Eye,
  Clock,
  Globe,
  ShoppingCart,
  CreditCard,
  Percent,
  FileText,
  MousePointerClick,
  Zap,
  Settings,
  Plus,
  GripVertical,
  RefreshCw,
  Share2,
  FileJson,
  FileSpreadsheet,
} from "lucide-react"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Button, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ggprompts/ui"

// Mock data generation
const generateTimeSeriesData = (days: number) => {
  const data = []
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)

    data.push({
      date: date.toISOString().split("T")[0],
      month: date.toLocaleDateString("en-US", { month: "short" }),
      day: date.getDate(),
      revenue: Math.floor(Math.random() * 5000) + 3000,
      users: Math.floor(Math.random() * 200) + 100,
      sessions: Math.floor(Math.random() * 500) + 300,
      conversions: Math.floor(Math.random() * 50) + 20,
    })
  }
  return data
}

const timeSeriesData = generateTimeSeriesData(30)

// Bar chart data
const barChartData = [
  { name: "Jan", desktop: 186, mobile: 80, tablet: 45 },
  { name: "Feb", desktop: 305, mobile: 200, tablet: 120 },
  { name: "Mar", desktop: 237, mobile: 120, tablet: 80 },
  { name: "Apr", desktop: 273, mobile: 190, tablet: 112 },
  { name: "May", desktop: 209, mobile: 130, tablet: 85 },
  { name: "Jun", desktop: 214, mobile: 140, tablet: 92 },
]

// Pie chart data for traffic sources
const trafficData = [
  { name: "Direct", value: 35, fill: "hsl(160, 84%, 39%)" },
  { name: "Organic", value: 30, fill: "hsl(173, 80%, 40%)" },
  { name: "Referral", value: 20, fill: "hsl(180, 70%, 35%)" },
  { name: "Social", value: 15, fill: "hsl(160, 60%, 25%)" },
]

// Radial chart data for goals
const goalsData = [
  { name: "Revenue", value: 85, fill: "hsl(160, 84%, 39%)" },
  { name: "Users", value: 72, fill: "hsl(173, 80%, 40%)" },
  { name: "Retention", value: 91, fill: "hsl(180, 70%, 35%)" },
  { name: "Satisfaction", value: 88, fill: "hsl(160, 60%, 45%)" },
]

// Performance metrics table data
const performanceData = [
  { page: "/dashboard", views: 12543, uniqueVisitors: 8721, avgTime: "3:24", bounceRate: "24.3%" },
  { page: "/analytics", views: 8921, uniqueVisitors: 6234, avgTime: "2:56", bounceRate: "31.2%" },
  { page: "/projects", views: 7632, uniqueVisitors: 5123, avgTime: "4:12", bounceRate: "18.7%" },
  { page: "/settings", views: 4521, uniqueVisitors: 3421, avgTime: "1:45", bounceRate: "42.1%" },
  { page: "/profile", views: 3214, uniqueVisitors: 2156, avgTime: "2:34", bounceRate: "28.9%" },
]

// Funnel chart data (conversion funnel)
const funnelData = [
  { name: "Visitors", value: 10000, fill: "hsl(160, 84%, 39%)" },
  { name: "Sign Ups", value: 3500, fill: "hsl(173, 80%, 40%)" },
  { name: "Active Users", value: 2100, fill: "hsl(180, 70%, 35%)" },
  { name: "Paying Customers", value: 850, fill: "hsl(160, 60%, 25%)" },
  { name: "Advocates", value: 250, fill: "hsl(160, 84%, 45%)" },
]

// Scatter chart data (user engagement)
const scatterData = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
  { x: 180, y: 350, z: 450 },
  { x: 130, y: 180, z: 300 },
  { x: 160, y: 320, z: 380 },
  { x: 190, y: 420, z: 550 },
]

// Heatmap data (activity by day/hour)
const generateHeatmapData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const data: Array<{ day: string; hour: number; value: number; dayIndex: number }> = []

  days.forEach((day, dayIndex) => {
    hours.forEach(hour => {
      data.push({
        day,
        hour,
        value: Math.floor(Math.random() * 100),
        dayIndex,
      })
    })
  })

  return data
}

const heatmapData = generateHeatmapData()

// Chart configurations with terminal theme colors
const areaChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(160, 84%, 39%)",
  },
  users: {
    label: "Users",
    color: "hsl(173, 80%, 40%)",
  },
} satisfies ChartConfig

const barChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(160, 84%, 39%)",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(173, 80%, 40%)",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(180, 70%, 35%)",
  },
} satisfies ChartConfig

const lineChartConfig = {
  sessions: {
    label: "Sessions",
    color: "hsl(160, 84%, 39%)",
  },
  conversions: {
    label: "Conversions",
    color: "hsl(173, 80%, 40%)",
  },
} satisfies ChartConfig

// Metric card component
const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend
}: {
  title: string
  value: string
  change: string
  icon: React.ElementType
  trend: "up" | "down"
}) => {
  const isPositive = trend === "up"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass border-white/20 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="glass-dark rounded-lg p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold terminal-glow">{value}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            {isPositive ? (
              <ArrowUpIcon className="mr-1 h-3 w-3 text-foreground0" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={isPositive ? "text-foreground0" : "text-red-500"}>
              {change}
            </span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = React.useState("30d")
  const [realTimeData, setRealTimeData] = React.useState<{ users?: number; serverLoad?: number; responseTime?: number }>()

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your application performance and user engagement
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="glass border-white/20 w-[180px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="glass-overlay border-white/20">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="glass border-white/20">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Revenue"
          value="$124,592"
          change="+12.5%"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Active Users"
          value="8,429"
          change="+23.1%"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Page Views"
          value="142.5K"
          change="-5.3%"
          icon={Eye}
          trend="down"
        />
        <MetricCard
          title="Avg. Session"
          value="3m 42s"
          change="+8.2%"
          icon={Clock}
          trend="up"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Revenue & Users Area Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-primary" />
                Revenue & Users Trend
              </CardTitle>
              <CardDescription>Daily revenue and user growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={areaChartConfig} className="h-[300px]">
                <AreaChart
                  data={timeSeriesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 60%, 25%)" opacity={0.2} />
                  <XAxis
                    dataKey="day"
                    stroke="hsl(160, 20%, 50%)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(160, 20%, 50%)"
                    fontSize={12}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(160, 84%, 39%)"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(173, 80%, 40%)"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Device Usage Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Device Analytics
              </CardTitle>
              <CardDescription>User distribution across devices</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="h-[300px]">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 60%, 25%)" opacity={0.2} />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(160, 20%, 50%)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(160, 20%, 50%)"
                    fontSize={12}
                  />
                  <ChartTooltip cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tablet" fill="var(--color-tablet)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Traffic Sources Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Traffic Sources
              </CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))"
                      }}
                      labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Goals Progress Radial Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Goals Progress
              </CardTitle>
              <CardDescription>Monthly goal completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="90%"
                    data={goalsData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      fill="hsl(160, 84%, 39%)"
                      background={{ fill: "hsl(160, 60%, 25%)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))"
                      }}
                      labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {goalsData.map((goal) => (
                  <div key={goal.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: goal.fill }}
                    />
                    <span className="text-muted-foreground">{goal.name}</span>
                    <span className="ml-auto font-medium">{goal.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sessions & Conversions Line Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Engagement Metrics
              </CardTitle>
              <CardDescription>Sessions and conversion tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={lineChartConfig} className="h-[250px]">
                <LineChart
                  data={timeSeriesData.slice(-7)}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 60%, 25%)" opacity={0.2} />
                  <XAxis
                    dataKey="day"
                    stroke="hsl(160, 20%, 50%)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(160, 20%, 50%)"
                    fontSize={12}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="var(--color-sessions)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-sessions)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="var(--color-conversions)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-conversions)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle>Page Performance Analytics</CardTitle>
            <CardDescription>Detailed breakdown of page-level metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="glass-dark border-white/20">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="conversions">Conversions</TabsTrigger>
              </TabsList>
              <TabsContent value="performance" className="mt-4">
                <div className="rounded-lg overflow-hidden border border-white/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="glass-dark border-white/20 hover:bg-transparent">
                        <TableHead className="text-primary">Page</TableHead>
                        <TableHead className="text-primary text-right">Views</TableHead>
                        <TableHead className="text-primary text-right">Unique Visitors</TableHead>
                        <TableHead className="text-primary text-right">Avg. Time</TableHead>
                        <TableHead className="text-primary text-right">Bounce Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performanceData.map((row) => (
                        <TableRow key={row.page} className="border-white/10 hover:bg-white/5">
                          <TableCell className="font-mono text-sm">{row.page}</TableCell>
                          <TableCell className="text-right">{row.views.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{row.uniqueVisitors.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{row.avgTime}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={parseFloat(row.bounceRate) > 30 ? "destructive" : "secondary"}
                              className="glass-dark"
                            >
                              {row.bounceRate}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="engagement" className="mt-4">
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  <p>Engagement metrics coming soon...</p>
                </div>
              </TabsContent>
              <TabsContent value="conversions" className="mt-4">
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  <p>Conversion funnel visualization coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Extended Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <MetricCard
          title="Conversion Rate"
          value="8.5%"
          change="+2.1%"
          icon={Percent}
          trend="up"
        />
        <MetricCard
          title="Orders"
          value="1,249"
          change="+18.2%"
          icon={ShoppingCart}
          trend="up"
        />
        <MetricCard
          title="Revenue per User"
          value="$14.78"
          change="+5.7%"
          icon={CreditCard}
          trend="up"
        />
        <MetricCard
          title="Bounce Rate"
          value="28.4%"
          change="-3.2%"
          icon={MousePointerClick}
          trend="down"
        />
        <MetricCard
          title="API Requests"
          value="842K"
          change="+45.1%"
          icon={Zap}
          trend="up"
        />
        <MetricCard
          title="Reports Generated"
          value="532"
          change="+12.3%"
          icon={FileText}
          trend="up"
        />
      </div>

      {/* Advanced Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Funnel Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-primary" />
                Conversion Funnel
              </CardTitle>
              <CardDescription>User journey through the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Funnel
                      data={funnelData}
                      dataKey="value"
                      nameKey="name"
                      labelLine
                    >
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Funnel>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))"
                      }}
                      labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {funnelData.map((stage, index) => {
                  const conversionRate = index > 0
                    ? ((stage.value / funnelData[index - 1].value) * 100).toFixed(1)
                    : "100.0"
                  return (
                    <div key={stage.name} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{stage.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{stage.value.toLocaleString()}</span>
                        <Badge variant="outline" className="glass-dark text-secondary border-secondary/30 text-xs">
                          {conversionRate}%
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scatter Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                User Engagement
              </CardTitle>
              <CardDescription>Time vs sessions scatter plot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 60%, 25%)" opacity={0.2} />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="time"
                      stroke="hsl(160, 20%, 50%)"
                      fontSize={12}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="sessions"
                      stroke="hsl(160, 20%, 50%)"
                      fontSize={12}
                    />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Scatter
                      name="Users"
                      data={scatterData}
                      fill="hsl(160, 84%, 39%)"
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Activity Heatmap
              </CardTitle>
              <CardDescription>Peak usage times by day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] overflow-auto">
                <div className="grid grid-cols-7 gap-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-xs text-center text-muted-foreground mb-2">
                      {day}
                    </div>
                  ))}
                  {heatmapData.filter((_, i) => i % 4 === 0).map((cell, index) => {
                    const opacity = cell.value / 100
                    return (
                      <div
                        key={index}
                        className="aspect-square rounded-sm cursor-pointer transition-transform hover:scale-110"
                        style={{
                          backgroundColor: `hsla(160, 84%, 39%, ${opacity})`,
                        }}
                        title={`${cell.day} ${cell.hour}:00 - ${cell.value} events`}
                      />
                    )
                  })}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs">
                <span className="text-muted-foreground">Less</span>
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity) => (
                  <div
                    key={opacity}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: `hsla(160, 84%, 39%, ${opacity})` }}
                  />
                ))}
                <span className="text-muted-foreground">More</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Real-time Stats with Live Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8"
      >
        <Card className="glass border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Real-time Activity
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </CardTitle>
              <Badge className="glass-dark animate-pulse">
                <span className="mr-2 h-2 w-2 bg-primary rounded-full inline-block animate-pulse" />
                Live
              </Badge>
            </div>
            <CardDescription>Current active users and system health • Updates every 3s</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`users-${realTimeData?.users || 247}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Users</span>
                    <span className="text-2xl font-bold terminal-glow">
                      {realTimeData?.users || 247}
                    </span>
                  </div>
                  <Progress value={(realTimeData?.users || 247) / 4} className="h-2" />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`load-${realTimeData?.serverLoad || 42}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Server Load</span>
                    <span className="text-2xl font-bold terminal-glow">
                      {realTimeData?.serverLoad || 42}%
                    </span>
                  </div>
                  <Progress value={realTimeData?.serverLoad || 42} className="h-2" />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`response-${realTimeData?.responseTime || 89}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-2xl font-bold terminal-glow">
                      {realTimeData?.responseTime || 89}ms
                    </span>
                  </div>
                  <Progress
                    value={100 - (realTimeData?.responseTime || 89) / 1.5}
                    className="h-2"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}