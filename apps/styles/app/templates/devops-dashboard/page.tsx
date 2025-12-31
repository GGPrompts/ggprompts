"use client"

import * as React from "react"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  Database,
  HardDrive,
  Server,
  Zap,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  TrendingUp,
  TrendingDown,
  Terminal,
  Code,
  Package,
  Shield,
  Users,
  FileCode,
  Globe,
  Wifi,
  WifiOff,
  Gauge,
  MemoryStick,
  Network,
  Cloud,
  Container,
  AlertCircle,
  Target
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
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"

// Types
type ServerStatus = {
  id: string
  name: string
  status: "healthy" | "warning" | "critical" | "offline"
  cpu: number
  memory: number
  disk: number
  uptime: string
  location: string
  responseTime: number
}

type Deployment = {
  id: string
  service: string
  version: string
  environment: string
  status: "success" | "failed" | "in-progress" | "rolled-back"
  timestamp: string
  duration: string
  triggeredBy: string
}

type Incident = {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  status: "active" | "investigating" | "resolved"
  startTime: string
  affectedServices: string[]
}

// Mock Data
const generateDeploymentFrequencyData = () => {
  const days = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      deployments: Math.floor(Math.random() * 15) + 5,
      successful: Math.floor(Math.random() * 12) + 4,
      failed: Math.floor(Math.random() * 3),
    })
  }
  return days
}

const generateErrorRateData = () => {
  const hours = []
  for (let i = 24; i >= 0; i--) {
    hours.push({
      time: `${24 - i}:00`,
      errors: Math.floor(Math.random() * 100) + 20,
      requests: Math.floor(Math.random() * 10000) + 50000,
      errorRate: ((Math.random() * 2) + 0.5).toFixed(2),
    })
  }
  return hours
}

const generateServerStatus = (): ServerStatus[] => [
  { id: "srv-001", name: "api-prod-1", status: "healthy", cpu: 45, memory: 62, disk: 48, uptime: "45d 12h", location: "us-east-1", responseTime: 23 },
  { id: "srv-002", name: "api-prod-2", status: "healthy", cpu: 52, memory: 58, disk: 51, uptime: "45d 12h", location: "us-east-1", responseTime: 28 },
  { id: "srv-003", name: "api-prod-3", status: "warning", cpu: 78, memory: 85, disk: 45, uptime: "23d 8h", location: "us-west-2", responseTime: 156 },
  { id: "srv-004", name: "web-prod-1", status: "healthy", cpu: 38, memory: 42, disk: 35, uptime: "45d 12h", location: "us-east-1", responseTime: 18 },
  { id: "srv-005", name: "web-prod-2", status: "healthy", cpu: 41, memory: 45, disk: 38, uptime: "45d 12h", location: "us-west-2", responseTime: 21 },
  { id: "srv-006", name: "db-primary", status: "healthy", cpu: 65, memory: 78, disk: 62, uptime: "120d 5h", location: "us-east-1", responseTime: 12 },
  { id: "srv-007", name: "db-replica-1", status: "healthy", cpu: 48, memory: 72, disk: 58, uptime: "120d 5h", location: "us-west-2", responseTime: 15 },
  { id: "srv-008", name: "cache-1", status: "healthy", cpu: 25, memory: 55, disk: 22, uptime: "90d 15h", location: "us-east-1", responseTime: 8 },
  { id: "srv-009", name: "cache-2", status: "critical", cpu: 92, memory: 95, disk: 28, uptime: "12d 3h", location: "us-west-2", responseTime: 248 },
  { id: "srv-010", name: "worker-1", status: "healthy", cpu: 58, memory: 68, disk: 45, uptime: "30d 8h", location: "us-east-1", responseTime: 34 },
  { id: "srv-011", name: "worker-2", status: "warning", cpu: 82, memory: 78, disk: 48, uptime: "15d 2h", location: "us-west-2", responseTime: 89 },
  { id: "srv-012", name: "lb-1", status: "healthy", cpu: 18, memory: 32, disk: 15, uptime: "180d 22h", location: "us-east-1", responseTime: 5 },
]

const generateDeployments = (): Deployment[] => [
  { id: "dep-001", service: "api-gateway", version: "v2.4.1", environment: "production", status: "success", timestamp: "2 min ago", duration: "3m 24s", triggeredBy: "sarah.chen" },
  { id: "dep-002", service: "auth-service", version: "v1.8.2", environment: "production", status: "success", timestamp: "15 min ago", duration: "2m 56s", triggeredBy: "mike.torres" },
  { id: "dep-003", service: "notification-service", version: "v3.1.0", environment: "staging", status: "in-progress", timestamp: "Just now", duration: "1m 12s", triggeredBy: "emily.rodriguez" },
  { id: "dep-004", service: "payment-processor", version: "v2.0.5", environment: "production", status: "failed", timestamp: "1 hour ago", duration: "4m 45s", triggeredBy: "james.wilson" },
  { id: "dep-005", service: "user-service", version: "v1.9.3", environment: "production", status: "success", timestamp: "3 hours ago", duration: "2m 18s", triggeredBy: "lisa.anderson" },
  { id: "dep-006", service: "analytics-engine", version: "v4.2.1", environment: "production", status: "rolled-back", timestamp: "6 hours ago", duration: "5m 32s", triggeredBy: "david.kim" },
]

const generateResponseTimeData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    index: i,
    p50: Math.floor(Math.random() * 50) + 20,
    p95: Math.floor(Math.random() * 100) + 80,
    p99: Math.floor(Math.random() * 150) + 150,
  }))
}

const generateBuildSuccessData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map(day => ({
    day,
    success: Math.floor(Math.random() * 30) + 50,
    failed: Math.floor(Math.random() * 10) + 2,
  }))
}

const generateInfrastructureCosts = () => [
  { category: "Compute", cost: 12450, percentage: 42, fill: "hsl(var(--primary))" },
  { category: "Storage", cost: 5680, percentage: 19, fill: "hsl(var(--primary) / 0.8)" },
  { category: "Network", cost: 4230, percentage: 14, fill: "hsl(var(--primary) / 0.6)" },
  { category: "Database", cost: 6890, percentage: 23, fill: "hsl(var(--primary) / 0.4)" },
  { category: "Other", cost: 620, percentage: 2, fill: "hsl(var(--primary) / 0.3)" },
]

const generateContainerStatus = () => [
  { name: "api-gateway", running: 8, stopped: 0, failed: 0, cpu: 45, memory: 62 },
  { name: "auth-service", running: 4, stopped: 0, failed: 0, cpu: 38, memory: 48 },
  { name: "user-service", running: 6, stopped: 0, failed: 1, cpu: 52, memory: 65 },
  { name: "payment-service", running: 4, stopped: 0, failed: 0, cpu: 42, memory: 55 },
  { name: "notification", running: 3, stopped: 1, failed: 0, cpu: 28, memory: 35 },
  { name: "analytics", running: 2, stopped: 0, failed: 0, cpu: 68, memory: 78 },
]

const generateGitActivity = () => {
  const days = []
  for (let i = 7; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      commits: Math.floor(Math.random() * 50) + 20,
      prs: Math.floor(Math.random() * 15) + 5,
      reviews: Math.floor(Math.random() * 20) + 10,
    })
  }
  return days
}

const generateIncidents = (): Incident[] => [
  { id: "inc-001", title: "High error rate on API Gateway", severity: "critical", status: "investigating", startTime: "5 min ago", affectedServices: ["API Gateway", "Auth Service"] },
  { id: "inc-002", title: "Database replica lag", severity: "high", status: "active", startTime: "2 hours ago", affectedServices: ["Database Replica"] },
  { id: "inc-003", title: "Slow response times in EU region", severity: "medium", status: "resolved", startTime: "Yesterday", affectedServices: ["CDN", "Load Balancer"] },
]

const generateApiEndpointPerformance = () => [
  { endpoint: "/api/v1/users", requests: 245000, avgResponseTime: 45, errorRate: 0.2, p95: 89 },
  { endpoint: "/api/v1/auth/login", requests: 189000, avgResponseTime: 78, errorRate: 0.5, p95: 156 },
  { endpoint: "/api/v1/payments", requests: 98000, avgResponseTime: 234, errorRate: 1.2, p95: 456 },
  { endpoint: "/api/v1/products", requests: 156000, avgResponseTime: 67, errorRate: 0.3, p95: 123 },
  { endpoint: "/api/v1/orders", requests: 134000, avgResponseTime: 156, errorRate: 0.8, p95: 298 },
]

const generateDatabaseQueryPerformance = () => [
  { query: "SELECT users", avgTime: 12, calls: 450000, impact: "low" },
  { query: "JOIN orders users", avgTime: 156, calls: 89000, impact: "high" },
  { query: "UPDATE inventory", avgTime: 45, calls: 234000, impact: "medium" },
  { query: "INSERT INTO logs", avgTime: 8, calls: 890000, impact: "low" },
  { query: "SELECT analytics", avgTime: 234, calls: 12000, impact: "critical" },
]

export default function DevOpsDashboard() {
  const [timeRange, setTimeRange] = React.useState("24h")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [selectedEnvironment, setSelectedEnvironment] = React.useState("production")
  const [mounted, setMounted] = React.useState(false)

  // Generate data only on client to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Data - use stable values for SSR, random values after mount
  const deploymentFrequencyData = React.useMemo(() => mounted ? generateDeploymentFrequencyData() : [], [mounted])
  const errorRateData = React.useMemo(() => mounted ? generateErrorRateData() : [], [mounted])
  const serverStatus = React.useMemo(() => mounted ? generateServerStatus() : [], [mounted])
  const deployments = React.useMemo(() => mounted ? generateDeployments() : [], [mounted])
  const responseTimeData = React.useMemo(() => mounted ? generateResponseTimeData() : [], [mounted])
  const buildSuccessData = React.useMemo(() => mounted ? generateBuildSuccessData() : [], [mounted])
  const infrastructureCosts = React.useMemo(() => mounted ? generateInfrastructureCosts() : [], [mounted])
  const containerStatus = React.useMemo(() => mounted ? generateContainerStatus() : [], [mounted])
  const gitActivity = React.useMemo(() => mounted ? generateGitActivity() : [], [mounted])
  const incidents = React.useMemo(() => mounted ? generateIncidents() : [], [mounted])
  const apiEndpointPerformance = React.useMemo(() => mounted ? generateApiEndpointPerformance() : [], [mounted])
  const databaseQueryPerformance = React.useMemo(() => mounted ? generateDatabaseQueryPerformance() : [], [mounted])

  // Calculations (handle empty arrays during SSR)
  const healthyServers = serverStatus.filter(s => s.status === "healthy").length
  const warningServers = serverStatus.filter(s => s.status === "warning").length
  const criticalServers = serverStatus.filter(s => s.status === "critical").length
  const totalDeployments = deploymentFrequencyData.reduce((sum, d) => sum + d.deployments, 0)
  const successfulDeployments = deploymentFrequencyData.reduce((sum, d) => sum + d.successful, 0)
  const deploymentSuccessRate = totalDeployments > 0 ? ((successfulDeployments / totalDeployments) * 100).toFixed(1) : "0.0"

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleExport = () => {
    console.log("Exporting DevOps data...")
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DevOps Dashboard</h1>
          <p className="text-secondary/70 text-sm sm:text-base">Infrastructure monitoring, deployments, and system health</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] sm:w-[180px] glass-dark border/20 text-sm">
              <Calendar className="mr-2 h-4 w-4 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-dark border/20">
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="glass border/20" disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 sm:mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button onClick={handleExport} size="sm" className="glass border/20 text-foreground">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Uptime</span>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">99.98%</span>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
                Excellent
              </Badge>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Deployments</span>
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{totalDeployments}</span>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                24%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Success Rate</span>
              <Target className="h-4 w-4 text-green-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{deploymentSuccessRate}%</span>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                2.1%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Error Rate</span>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">0.42%</span>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingDown className="h-3 w-3 mr-1" />
                0.15%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Avg Response</span>
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">124ms</span>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingDown className="h-3 w-3 mr-1" />
                8ms
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Active Incidents</span>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">2</span>
              <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs">
                Critical
              </Badge>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Deployment Frequency */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Deployment Frequency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={deploymentFrequencyData}>
            <defs>
              <linearGradient id="colorDeployments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
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
            <Area type="monotone" dataKey="deployments" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorDeployments)" strokeWidth={2} name="Total Deployments" />
            <Bar dataKey="successful" fill="hsl(var(--primary))" name="Successful" radius={[8, 8, 0, 0]} />
            <Bar dataKey="failed" fill="hsl(var(--destructive))" name="Failed" radius={[8, 8, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Server Health Grid */}
      <Card className="glass border/20 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Server Health Status</h3>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-secondary/70">Healthy ({healthyServers})</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 shrink-0" />
              <span className="text-secondary/70">Warning ({warningServers})</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shrink-0" />
              <span className="text-secondary/70">Critical ({criticalServers})</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {serverStatus.map((server, index) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`glass-dark border/20 rounded-lg p-4 cursor-pointer hover:border-primary/40 transition-all ${
                server.status === "critical" ? "border-red-500/50" :
                server.status === "warning" ? "border-yellow-500/50" :
                "border-border/20"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Server className={`h-5 w-5 ${
                  server.status === "healthy" ? "text-emerald-400" :
                  server.status === "warning" ? "text-yellow-400" :
                  "text-red-400"
                }`} />
                <div className={`w-2 h-2 rounded-full ${
                  server.status === "healthy" ? "bg-emerald-500 animate-pulse" :
                  server.status === "warning" ? "bg-yellow-500" :
                  "bg-red-500 animate-pulse"
                }`} />
              </div>
              <h4 className="text-foreground font-mono text-sm font-semibold mb-1">{server.name}</h4>
              <p className="text-xs text-secondary/70 mb-3">{server.location}</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary/70">CPU</span>
                    <span className="text-foreground">{server.cpu}%</span>
                  </div>
                  <Progress value={server.cpu} className="h-1 bg-secondary/20" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary/70">Memory</span>
                    <span className="text-foreground">{server.memory}%</span>
                  </div>
                  <Progress value={server.memory} className="h-1 bg-secondary/20" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/20 text-xs text-secondary/70">
                Uptime: {server.uptime}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Error Rate Monitoring */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Real-time Error Rate Monitoring</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={errorRateData}>
            <defs>
              <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: "hsl(var(--popover-foreground))"
              }}
            labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
            <Area type="monotone" dataKey="errors" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorErrors)" strokeWidth={2} name="Errors" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Response Time Percentiles & Build Success */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Response Time Percentiles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="index" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
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
              <Line type="monotone" dataKey="p50" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="p50" />
              <Line type="monotone" dataKey="p95" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="p95" />
              <Line type="monotone" dataKey="p99" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} name="p99" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Build Success/Failure Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={buildSuccessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
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
              <Bar dataKey="success" stackId="a" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Successful" />
              <Bar dataKey="failed" stackId="a" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} name="Failed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Deployments */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Recent Deployments</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/20">
                <TableHead className="text-secondary">Deploy ID</TableHead>
                <TableHead className="text-secondary">Service</TableHead>
                <TableHead className="text-secondary">Version</TableHead>
                <TableHead className="text-secondary">Environment</TableHead>
                <TableHead className="text-secondary">Status</TableHead>
                <TableHead className="text-secondary">Duration</TableHead>
                <TableHead className="text-secondary">Triggered By</TableHead>
                <TableHead className="text-secondary">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.map((deployment) => (
                <TableRow key={deployment.id} className="border-b border-border/20 hover:bg-secondary/10">
                  <TableCell className="font-mono text-primary">{deployment.id}</TableCell>
                  <TableCell className="font-semibold text-foreground">{deployment.service}</TableCell>
                  <TableCell className="font-mono text-secondary/70">{deployment.version}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-secondary/30 text-secondary">
                      {deployment.environment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      deployment.status === "success" ? "border-emerald-500/30 text-emerald-400" :
                      deployment.status === "failed" ? "border-red-500/30 text-red-400" :
                      deployment.status === "in-progress" ? "border-yellow-500/30 text-yellow-400" :
                      "border-orange-500/30 text-orange-400"
                    }>
                      {deployment.status === "success" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {deployment.status === "failed" && <XCircle className="mr-1 h-3 w-3" />}
                      {deployment.status === "in-progress" && <RefreshCw className="mr-1 h-3 w-3 animate-spin" />}
                      {deployment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-secondary/70">{deployment.duration}</TableCell>
                  <TableCell className="text-foreground">{deployment.triggeredBy}</TableCell>
                  <TableCell className="text-secondary/70">{deployment.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Infrastructure Costs & Container Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Infrastructure Costs Breakdown</h3>
          <div className="flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={infrastructureCosts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="cost"
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                >
                  {infrastructureCosts.map((entry, index) => (
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
          <div className="space-y-2">
            {infrastructureCosts.map((cost) => (
              <div key={cost.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cost.fill }} />
                  <span className="text-foreground">{cost.category}</span>
                </div>
                <span className="text-secondary/70 font-semibold">${cost.cost.toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-border/20 flex justify-between text-lg font-bold">
              <span className="text-foreground">Total Monthly Cost</span>
              <span className="text-primary">${infrastructureCosts.reduce((sum, c) => sum + c.cost, 0).toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Container/Pod Status</h3>
          <div className="space-y-4">
            {containerStatus.map((container, index) => (
              <div key={container.name} className="glass-dark border/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Container className="h-4 w-4 text-primary" />
                    <span className="text-foreground font-semibold">{container.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      {container.running} running
                    </Badge>
                    {container.failed > 0 && (
                      <Badge variant="outline" className="border-red-500/30 text-red-400">
                        {container.failed} failed
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-secondary/70">CPU</span>
                      <span className="text-foreground">{container.cpu}%</span>
                    </div>
                    <Progress value={container.cpu} className="h-1 bg-secondary/20" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-secondary/70">Memory</span>
                      <span className="text-foreground">{container.memory}%</span>
                    </div>
                    <Progress value={container.memory} className="h-1 bg-secondary/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Git Activity */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Git Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gitActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
            />
            <Legend />
            <Bar dataKey="commits" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} name="Commits" />
            <Bar dataKey="prs" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} name="Pull Requests" />
            <Bar dataKey="reviews" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} name="Reviews" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Active Incidents */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          Active Incidents
        </h3>
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className={`glass-dark border/20 rounded-lg p-4 ${
              incident.severity === "critical" ? "border-red-500/50" :
              incident.severity === "high" ? "border-orange-500/50" :
              "border-yellow-500/50"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-foreground font-semibold">{incident.title}</h4>
                    <Badge variant="outline" className={
                      incident.severity === "critical" ? "border-red-500/30 text-red-400" :
                      incident.severity === "high" ? "border-orange-500/30 text-orange-400" :
                      "border-yellow-500/30 text-yellow-400"
                    }>
                      {incident.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-secondary/70">Started {incident.startTime}</p>
                </div>
                <Badge variant="outline" className={
                  incident.status === "resolved" ? "border-emerald-500/30 text-emerald-400" :
                  "border-yellow-500/30 text-yellow-400"
                }>
                  {incident.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-secondary/70">Affected:</span>
                {incident.affectedServices.map((service) => (
                  <Badge key={service} variant="outline" className="border-secondary/30 text-secondary text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* API Endpoint Performance */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">API Endpoint Performance</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/20">
                <TableHead className="text-secondary">Endpoint</TableHead>
                <TableHead className="text-secondary text-right">Requests</TableHead>
                <TableHead className="text-secondary text-right">Avg Response</TableHead>
                <TableHead className="text-secondary text-right">Error Rate</TableHead>
                <TableHead className="text-secondary text-right">p95</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiEndpointPerformance.map((endpoint) => (
                <TableRow key={endpoint.endpoint} className="border-b border-border/20 hover:bg-secondary/10">
                  <TableCell className="font-mono text-primary">{endpoint.endpoint}</TableCell>
                  <TableCell className="text-right text-foreground font-semibold">{endpoint.requests.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-secondary/70">{endpoint.avgResponseTime}ms</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={
                      endpoint.errorRate > 1 ? "border-red-500/30 text-red-400" :
                      endpoint.errorRate > 0.5 ? "border-yellow-500/30 text-yellow-400" :
                      "border-emerald-500/30 text-emerald-400"
                    }>
                      {endpoint.errorRate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-foreground">{endpoint.p95}ms</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Database Query Performance */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Database Query Performance</h3>
        <div className="space-y-3">
          {databaseQueryPerformance.map((query, index) => (
            <div key={index} className="glass-dark border/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <code className="text-sm text-foreground font-mono">{query.query}</code>
                <Badge variant="outline" className={
                  query.impact === "critical" ? "border-red-500/30 text-red-400" :
                  query.impact === "high" ? "border-orange-500/30 text-orange-400" :
                  query.impact === "medium" ? "border-yellow-500/30 text-yellow-400" :
                  "border-emerald-500/30 text-emerald-400"
                }>
                  {query.impact} impact
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-secondary/70">Avg Execution Time: </span>
                  <span className="text-foreground font-semibold">{query.avgTime}ms</span>
                </div>
                <div>
                  <span className="text-secondary/70">Total Calls: </span>
                  <span className="text-foreground font-semibold">{query.calls.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
