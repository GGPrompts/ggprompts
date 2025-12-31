"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock,
  Globe,
  LineChart,
  Plus,
  Settings,
  TrendingDown,
  TrendingUp,
  XCircle,
  Zap,
  Eye,
  EyeOff,
  Pause,
  Play,
  Trash2,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Progress, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Input, Label, Switch } from "@ggprompts/ui"

type MonitorStatus = "up" | "down" | "degraded" | "paused"

interface Monitor {
  id: string
  name: string
  url: string
  type: "http" | "https" | "tcp" | "ping"
  status: MonitorStatus
  uptime: number
  avgResponseTime: number
  lastCheck: string
  interval: number
  incidents: number
  region: string
  enabled: boolean
}

interface Incident {
  id: string
  monitorId: string
  monitorName: string
  startTime: string
  endTime?: string
  duration?: number
  type: "downtime" | "slowness" | "timeout"
  responseTime?: number
}

interface UptimeDay {
  date: string
  status: "up" | "down" | "partial"
  uptime: number
}

// Generate mock monitors
const monitors: Monitor[] = [
  {
    id: "m1",
    name: "Main Website",
    url: "https://example.com",
    type: "https",
    status: "up",
    uptime: 99.98,
    avgResponseTime: 245,
    lastCheck: new Date(Date.now() - 30000).toISOString(),
    interval: 60,
    incidents: 1,
    region: "us-east-1",
    enabled: true,
  },
  {
    id: "m2",
    name: "API Endpoint",
    url: "https://api.example.com/health",
    type: "https",
    status: "up",
    uptime: 99.95,
    avgResponseTime: 156,
    lastCheck: new Date(Date.now() - 25000).toISOString(),
    interval: 30,
    incidents: 2,
    region: "us-west-2",
    enabled: true,
  },
  {
    id: "m3",
    name: "Database Server",
    url: "db.example.com:5432",
    type: "tcp",
    status: "up",
    uptime: 99.92,
    avgResponseTime: 45,
    lastCheck: new Date(Date.now() - 15000).toISOString(),
    interval: 60,
    incidents: 3,
    region: "eu-west-1",
    enabled: true,
  },
  {
    id: "m4",
    name: "CDN Edge Server",
    url: "https://cdn.example.com",
    type: "https",
    status: "degraded",
    uptime: 98.5,
    avgResponseTime: 892,
    lastCheck: new Date(Date.now() - 20000).toISOString(),
    interval: 60,
    incidents: 8,
    region: "eu-central-1",
    enabled: true,
  },
  {
    id: "m5",
    name: "Admin Dashboard",
    url: "https://admin.example.com",
    type: "https",
    status: "up",
    uptime: 99.88,
    avgResponseTime: 312,
    lastCheck: new Date(Date.now() - 40000).toISOString(),
    interval: 120,
    incidents: 4,
    region: "us-east-1",
    enabled: true,
  },
  {
    id: "m6",
    name: "Email Service",
    url: "smtp.example.com:587",
    type: "tcp",
    status: "up",
    uptime: 99.85,
    avgResponseTime: 234,
    lastCheck: new Date(Date.now() - 10000).toISOString(),
    interval: 60,
    incidents: 5,
    region: "us-west-1",
    enabled: true,
  },
  {
    id: "m7",
    name: "Search Service",
    url: "https://search.example.com",
    type: "https",
    status: "up",
    uptime: 99.91,
    avgResponseTime: 178,
    lastCheck: new Date(Date.now() - 35000).toISOString(),
    interval: 60,
    incidents: 2,
    region: "ap-southeast-1",
    enabled: true,
  },
  {
    id: "m8",
    name: "Payment Gateway",
    url: "https://payments.example.com",
    type: "https",
    status: "up",
    uptime: 99.97,
    avgResponseTime: 198,
    lastCheck: new Date(Date.now() - 22000).toISOString(),
    interval: 30,
    incidents: 1,
    region: "us-east-1",
    enabled: true,
  },
  {
    id: "m9",
    name: "Staging Environment",
    url: "https://staging.example.com",
    type: "https",
    status: "paused",
    uptime: 99.45,
    avgResponseTime: 456,
    lastCheck: new Date(Date.now() - 3600000).toISOString(),
    interval: 300,
    incidents: 12,
    region: "us-west-2",
    enabled: false,
  },
  {
    id: "m10",
    name: "Mobile API",
    url: "https://mobile-api.example.com",
    type: "https",
    status: "up",
    uptime: 99.94,
    avgResponseTime: 145,
    lastCheck: new Date(Date.now() - 18000).toISOString(),
    interval: 60,
    incidents: 2,
    region: "us-east-1",
    enabled: true,
  },
  {
    id: "m11",
    name: "WebSocket Server",
    url: "wss://ws.example.com",
    type: "https",
    status: "up",
    uptime: 99.89,
    avgResponseTime: 89,
    lastCheck: new Date(Date.now() - 12000).toISOString(),
    interval: 30,
    incidents: 3,
    region: "eu-west-1",
    enabled: true,
  },
  {
    id: "m12",
    name: "Cache Server",
    url: "cache.example.com:6379",
    type: "tcp",
    status: "up",
    uptime: 99.96,
    avgResponseTime: 12,
    lastCheck: new Date(Date.now() - 28000).toISOString(),
    interval: 60,
    incidents: 1,
    region: "us-east-1",
    enabled: true,
  },
  {
    id: "m13",
    name: "Analytics Dashboard",
    url: "https://analytics.example.com",
    type: "https",
    status: "up",
    uptime: 99.82,
    avgResponseTime: 534,
    lastCheck: new Date(Date.now() - 45000).toISOString(),
    interval: 120,
    incidents: 6,
    region: "us-west-2",
    enabled: true,
  },
  {
    id: "m14",
    name: "Documentation Site",
    url: "https://docs.example.com",
    type: "https",
    status: "up",
    uptime: 99.99,
    avgResponseTime: 123,
    lastCheck: new Date(Date.now() - 32000).toISOString(),
    interval: 120,
    incidents: 0,
    region: "global",
    enabled: true,
  },
  {
    id: "m15",
    name: "Status Page",
    url: "https://status.example.com",
    type: "https",
    status: "up",
    uptime: 99.98,
    avgResponseTime: 167,
    lastCheck: new Date(Date.now() - 27000).toISOString(),
    interval: 60,
    incidents: 1,
    region: "global",
    enabled: true,
  },
]

// Generate uptime history (90 days)
const generateUptimeHistory = (monitorId: string): UptimeDay[] => {
  const days: UptimeDay[] = []
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const random = Math.random()
    const status: "up" | "down" | "partial" = random > 0.95 ? "down" : random > 0.90 ? "partial" : "up"
    days.push({
      date: date.toISOString().split("T")[0],
      status,
      uptime: random > 0.95 ? 0 : random > 0.90 ? 50 + Math.random() * 50 : 95 + Math.random() * 5,
    })
  }
  return days
}

// Generate response time data (24 hours)
const generateResponseTimeData = () => {
  const data = []
  for (let i = 23; i >= 0; i--) {
    const hour = new Date()
    hour.setHours(hour.getHours() - i)
    data.push({
      hour: hour.getHours(),
      time: 100 + Math.random() * 200,
      threshold: 500,
    })
  }
  return data
}

// Generate recent incidents
const generateIncidents = (): Incident[] => {
  return [
    {
      id: "inc1",
      monitorId: "m4",
      monitorName: "CDN Edge Server",
      startTime: new Date(Date.now() - 7200000).toISOString(),
      endTime: new Date(Date.now() - 3600000).toISOString(),
      duration: 60,
      type: "slowness",
      responseTime: 1245,
    },
    {
      id: "inc2",
      monitorId: "m3",
      monitorName: "Database Server",
      startTime: new Date(Date.now() - 86400000).toISOString(),
      endTime: new Date(Date.now() - 86100000).toISOString(),
      duration: 5,
      type: "timeout",
    },
    {
      id: "inc3",
      monitorId: "m1",
      monitorName: "Main Website",
      startTime: new Date(Date.now() - 172800000).toISOString(),
      endTime: new Date(Date.now() - 172500000).toISOString(),
      duration: 5,
      type: "downtime",
    },
    {
      id: "inc4",
      monitorId: "m2",
      monitorName: "API Endpoint",
      startTime: new Date(Date.now() - 259200000).toISOString(),
      endTime: new Date(Date.now() - 258900000).toISOString(),
      duration: 5,
      type: "downtime",
    },
  ]
}

export default function UptimeMonitor() {
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor>(monitors[0])
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily")
  const [showAddMonitor, setShowAddMonitor] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const uptimeHistory = generateUptimeHistory(selectedMonitor.id)
  const responseTimeData = generateResponseTimeData()
  const incidents = generateIncidents()

  // Calculate statistics
  const activeMonitors = monitors.filter((m) => m.enabled && m.status !== "paused").length
  const upMonitors = monitors.filter((m) => m.status === "up").length
  const downMonitors = monitors.filter((m) => m.status === "down").length
  const degradedMonitors = monitors.filter((m) => m.status === "degraded").length
  const averageUptime = monitors.reduce((acc, m) => acc + m.uptime, 0) / monitors.length

  // Status distribution for pie chart
  const statusDistribution = [
    { name: "Up", value: upMonitors, color: "hsl(var(--primary))" },
    { name: "Down", value: downMonitors, color: "hsl(var(--destructive))" },
    { name: "Degraded", value: degradedMonitors, color: "hsl(var(--accent))" },
  ].filter((item) => item.value > 0)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-5xl font-bold terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Uptime Monitor</h1>
            <p className="text-muted-foreground text-lg">
              Real-time monitoring and performance tracking for {monitors.length} endpoints
            </p>
          </div>
          <Button className="gap-2" onClick={() => setShowAddMonitor(!showAddMonitor)}>
            <Plus className="w-4 h-4" />
            Add Monitor
          </Button>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Active Monitors",
              value: activeMonitors,
              total: monitors.length,
              icon: Activity,
              color: "text-secondary",
            },
            {
              label: "Operational",
              value: upMonitors,
              total: monitors.length,
              icon: CheckCircle2,
              color: "text-primary",
            },
            {
              label: "Average Uptime",
              value: `${averageUptime.toFixed(2)}%`,
              icon: TrendingUp,
              color: "text-blue-400",
            },
            {
              label: "Total Incidents",
              value: incidents.length,
              subtitle: "Last 7 days",
              icon: AlertCircle,
              color: "text-amber-400",
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
            >
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    {metric.total && (
                      <Badge variant="outline">
                        {metric.value}/{metric.total}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold">
                    {typeof metric.value === "number" && !metric.total ? metric.value : metric.value}
                  </p>
                  {metric.subtitle && <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Current monitor health overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))",
                      }}
                      itemStyle={{
                        color: "hsl(var(--popover-foreground))",
                      }}
                      labelStyle={{
                        color: "hsl(var(--popover-foreground))",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {statusDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Average response time over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={responseTimeData}>
                    <defs>
                      <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `${value}:00`}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))",
                      }}
                      labelFormatter={(value) => `${value}:00`}
                      formatter={(value: number) => [`${Math.round(value)}ms`, "Response Time"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="time"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#responseGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Monitor Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Monitor Overview</CardTitle>
                  <CardDescription>All monitored endpoints and their current status</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] glass-dark">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Monitors</SelectItem>
                      <SelectItem value="up">Operational</SelectItem>
                      <SelectItem value="degraded">Degraded</SelectItem>
                      <SelectItem value="down">Down</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monitors.map((monitor, index) => {
                  const timeSinceCheck = Math.floor((Date.now() - new Date(monitor.lastCheck).getTime()) / 1000)

                  return (
                    <motion.div
                      key={monitor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="glass-dark p-4 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => setSelectedMonitor(monitor)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <motion.div
                              animate={{
                                scale: monitor.status === "up" ? [1, 1.2, 1] : 1,
                              }}
                              transition={{
                                duration: 2,
                                repeat: monitor.status === "up" ? Infinity : 0,
                                repeatType: "loop",
                              }}
                            >
                              {monitor.status === "up" ? (
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                              ) : monitor.status === "down" ? (
                                <XCircle className="w-6 h-6 text-red-400" />
                              ) : monitor.status === "degraded" ? (
                                <AlertCircle className="w-6 h-6 text-amber-400" />
                              ) : (
                                <Pause className="w-6 h-6 text-muted-foreground" />
                              )}
                            </motion.div>
                            {monitor.status === "up" && (
                              <motion.div
                                className="absolute inset-0 rounded-full bg-emerald-400"
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{monitor.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {monitor.type.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {monitor.region}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">{monitor.url}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                            <p className="font-semibold text-sm">{monitor.uptime}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">Avg Response</p>
                            <p className="font-semibold text-sm">{monitor.avgResponseTime}ms</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">Incidents</p>
                            <p className="font-semibold text-sm">{monitor.incidents}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">Last Check</p>
                            <p className="font-semibold text-sm">{timeSinceCheck}s ago</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Monitor View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass border-glow">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    {selectedMonitor.name}
                  </CardTitle>
                  <CardDescription className="font-mono mt-1">{selectedMonitor.url}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Alerts
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tabs for different time ranges */}
              <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>

                <TabsContent value={timeRange} className="space-y-6">
                  {/* Uptime visualization (90 days) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">90-Day Uptime History</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                          <span className="text-muted-foreground">Up</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-amber-500" />
                          <span className="text-muted-foreground">Partial</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-red-500" />
                          <span className="text-muted-foreground">Down</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-1">
                      {uptimeHistory.slice(-90).map((day, index) => (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.005 }}
                          className={`aspect-square rounded-sm ${
                            day.status === "up"
                              ? "bg-emerald-500"
                              : day.status === "partial"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                          title={`${day.date}: ${day.uptime.toFixed(1)}% uptime`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Response time chart */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Response Time Trend</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsLineChart data={responseTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis
                          dataKey="hour"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => `${value}:00`}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--popover-foreground))",
                          }}
                          labelFormatter={(value) => `${value}:00`}
                          formatter={(value: number) => [`${Math.round(value)}ms`, "Response Time"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="time"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="threshold"
                          stroke="hsl(var(--destructive))"
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Recent Incidents
              </CardTitle>
              <CardDescription>Downtime and performance issues in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Monitor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{incident.monitorName}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            incident.type === "downtime"
                              ? "bg-red-500/20 text-red-400 border-red-500/50"
                              : incident.type === "slowness"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                                : "bg-orange-500/20 text-orange-400 border-orange-500/50"
                          }
                        >
                          {incident.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(incident.startTime).toLocaleString()}
                      </TableCell>
                      <TableCell>{incident.duration} min</TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                        >
                          Resolved
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Alert Settings
              </CardTitle>
              <CardDescription>Configure notifications for downtime and performance issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch id="email-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="slack-alerts">Slack Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send alerts to Slack channel</p>
                    </div>
                    <Switch id="slack-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-alerts">SMS Alerts</Label>
                      <p className="text-sm text-muted-foreground">Critical issues via SMS</p>
                    </div>
                    <Switch id="sms-alerts" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="response-threshold">Response Time Threshold</Label>
                    <Input
                      id="response-threshold"
                      type="number"
                      defaultValue="500"
                      className="glass-dark"
                      placeholder="milliseconds"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-cooldown">Alert Cooldown</Label>
                    <Select defaultValue="15">
                      <SelectTrigger className="glass-dark">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Alert Settings</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
