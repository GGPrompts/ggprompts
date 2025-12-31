"use client"

import * as React from "react"
import {
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Search,
  Award,
  Target,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  Zap,
  Globe,
  Smartphone,
  Headphones,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  BookOpen,
  Share2
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
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

// Types
type Ticket = {
  id: string
  subject: string
  customer: string
  priority: "critical" | "high" | "medium" | "low"
  status: "open" | "pending" | "resolved" | "closed"
  assignedTo: string
  createdAt: string
  responseTime: string
  resolutionTime?: string
  channel: string
}

type Agent = {
  id: string
  name: string
  avatar: string
  ticketsResolved: number
  avgResponseTime: number
  avgResolutionTime: number
  csat: number
  activeTickets: number
}

// Mock Data
const generateTicketVolumeData = () => {
  const days = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: Math.floor(Math.random() * 150) + 200,
      resolved: Math.floor(Math.random() * 120) + 150,
      open: Math.floor(Math.random() * 30) + 20,
    })
  }
  return days
}

const generateResponseTimeData = () => {
  const hours = []
  for (let i = 24; i >= 0; i--) {
    hours.push({
      hour: `${24 - i}:00`,
      avgResponseTime: Math.floor(Math.random() * 30) + 15,
      slaTarget: 30,
    })
  }
  return hours
}

const generateResolutionTimeByPriority = () => [
  { priority: "Critical", avgTime: 45, sla: 60, count: 28, fill: "#ef4444" },
  { priority: "High", avgTime: 120, sla: 180, count: 67, fill: "#f59e0b" },
  { priority: "Medium", avgTime: 240, sla: 360, count: 145, fill: "hsl(var(--primary))" },
  { priority: "Low", avgTime: 480, sla: 720, count: 89, fill: "hsl(var(--accent))" },
]

const generateCSATData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map(month => ({
    month,
    score: (Math.random() * 10 + 85).toFixed(1),
    responses: Math.floor(Math.random() * 200) + 300,
  }))
}

const generateAgents = (): Agent[] => [
  { id: "1", name: "Sarah Mitchell", avatar: "/images/avatars/sm-40x40.png", ticketsResolved: 248, avgResponseTime: 12, avgResolutionTime: 145, csat: 94.5, activeTickets: 8 },
  { id: "2", name: "David Chen", avatar: "/images/avatars/dc-40x40.png", ticketsResolved: 234, avgResponseTime: 15, avgResolutionTime: 168, csat: 92.3, activeTickets: 12 },
  { id: "3", name: "Emily Rodriguez", avatar: "/images/avatars/er-40x40.png", ticketsResolved: 212, avgResponseTime: 18, avgResolutionTime: 189, csat: 91.8, activeTickets: 6 },
  { id: "4", name: "Michael Torres", avatar: "/images/avatars/mt-40x40.png", ticketsResolved: 198, avgResponseTime: 22, avgResolutionTime: 201, csat: 89.7, activeTickets: 15 },
  { id: "5", name: "Lisa Anderson", avatar: "/images/avatars/la-40x40.png", ticketsResolved: 189, avgResponseTime: 25, avgResolutionTime: 215, csat: 88.4, activeTickets: 10 },
  { id: "6", name: "James Wilson", avatar: "/images/avatars/jw-40x40.png", ticketsResolved: 167, avgResponseTime: 28, avgResolutionTime: 234, csat: 87.2, activeTickets: 9 },
]

const generateTickets = (): Ticket[] => [
  { id: "TKT-10234", subject: "Unable to login to account", customer: "John Smith", priority: "high", status: "open", assignedTo: "Sarah Mitchell", createdAt: "2 min ago", responseTime: "-", channel: "Email" },
  { id: "TKT-10233", subject: "Payment processing error", customer: "Emily Davis", priority: "critical", status: "pending", assignedTo: "David Chen", createdAt: "15 min ago", responseTime: "8 min", channel: "Chat" },
  { id: "TKT-10232", subject: "Feature request: Dark mode", customer: "Robert Johnson", priority: "low", status: "open", assignedTo: "Emily Rodriguez", createdAt: "1 hour ago", responseTime: "12 min", channel: "Portal" },
  { id: "TKT-10231", subject: "Data export not working", customer: "Maria Garcia", priority: "medium", status: "pending", assignedTo: "Sarah Mitchell", createdAt: "3 hours ago", responseTime: "25 min", channel: "Email" },
  { id: "TKT-10230", subject: "API integration help needed", customer: "David Lee", priority: "medium", status: "resolved", assignedTo: "Michael Torres", createdAt: "Yesterday", responseTime: "18 min", resolutionTime: "2h 45m", channel: "Phone" },
  { id: "TKT-10229", subject: "Billing inquiry", customer: "Lisa Brown", priority: "low", status: "closed", assignedTo: "Lisa Anderson", createdAt: "2 days ago", responseTime: "15 min", resolutionTime: "1h 30m", channel: "Chat" },
  { id: "TKT-10228", subject: "Account upgrade question", customer: "Thomas Wilson", priority: "low", status: "resolved", assignedTo: "James Wilson", createdAt: "2 days ago", responseTime: "22 min", resolutionTime: "45m", channel: "Email" },
  { id: "TKT-10227", subject: "Critical bug in production", customer: "Jennifer Martinez", priority: "critical", status: "resolved", assignedTo: "Sarah Mitchell", createdAt: "3 days ago", responseTime: "5 min", resolutionTime: "1h 15m", channel: "Phone" },
]

const generateTicketStatusBreakdown = () => [
  { status: "Open", count: 45, percentage: 22, fill: "#f59e0b" },
  { status: "Pending", count: 38, percentage: 19, fill: "hsl(var(--accent))" },
  { status: "Resolved", count: 89, percentage: 44, fill: "hsl(var(--primary))" },
  { status: "Closed", count: 31, percentage: 15, fill: "#6b7280" },
]

const generateTopIssuesCategories = () => [
  { category: "Login/Authentication", count: 156, percentage: 28, trend: 12.5 },
  { category: "Payment Processing", count: 134, percentage: 24, trend: -5.2 },
  { category: "Feature Requests", count: 98, percentage: 18, trend: 8.3 },
  { category: "Bug Reports", count: 78, percentage: 14, trend: -3.1 },
  { category: "Account Management", count: 45, percentage: 8, trend: 15.7 },
  { category: "API/Integration", count: 44, percentage: 8, trend: 6.4 },
]

const generateSelfServiceArticleViews = () => {
  const days = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: Math.floor(Math.random() * 2000) + 3000,
      helpful: Math.floor(Math.random() * 1500) + 2200,
    })
  }
  return days
}

const generateEscalationRate = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map(month => ({
    month,
    totalTickets: Math.floor(Math.random() * 500) + 1000,
    escalated: Math.floor(Math.random() * 50) + 80,
    escalationRate: 0,
  })).map(d => ({
    ...d,
    escalationRate: parseFloat(((d.escalated / d.totalTickets) * 100).toFixed(1)),
  }))
}

const generateSupportChannelDistribution = () => [
  { channel: "Email", tickets: 456, avgResolutionTime: 245, csat: 89.5, fill: "hsl(var(--primary))" },
  { channel: "Chat", tickets: 389, avgResolutionTime: 125, csat: 92.3, fill: "hsl(var(--secondary))" },
  { channel: "Phone", tickets: 234, avgResolutionTime: 180, csat: 91.2, fill: "hsl(var(--accent))" },
  { channel: "Portal", tickets: 178, avgResolutionTime: 280, csat: 87.8, fill: "hsl(var(--muted-foreground))" },
  { channel: "Social Media", tickets: 89, avgResolutionTime: 156, csat: 85.4, fill: "hsl(var(--primary) / 0.7)" },
]

const generateFirstResponseTimeSLA = () => {
  const days = []
  for (let i = 7; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      withinSLA: Math.floor(Math.random() * 20) + 80,
      outsideSLA: Math.floor(Math.random() * 10) + 5,
    })
  }
  return days
}

export default function SupportDashboard() {
  const [timeRange, setTimeRange] = React.useState("30d")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState("all")

  // Data
  const ticketVolumeData = generateTicketVolumeData()
  const responseTimeData = generateResponseTimeData()
  const resolutionTimeByPriority = generateResolutionTimeByPriority()
  const csatData = generateCSATData()
  const agents = generateAgents()
  const tickets = generateTickets()
  const ticketStatusBreakdown = generateTicketStatusBreakdown()
  const topIssuesCategories = generateTopIssuesCategories()
  const selfServiceArticleViews = generateSelfServiceArticleViews()
  const escalationRate = generateEscalationRate()
  const supportChannelDistribution = generateSupportChannelDistribution()
  const firstResponseTimeSLA = generateFirstResponseTimeSLA()

  // Calculations
  const totalTickets = ticketVolumeData.reduce((sum, d) => sum + d.total, 0)
  const resolvedTickets = ticketVolumeData.reduce((sum, d) => sum + d.resolved, 0)
  const openTickets = ticketVolumeData.reduce((sum, d) => sum + d.open, 0)
  const avgResponseTime = responseTimeData.reduce((sum, d) => sum + d.avgResponseTime, 0) / responseTimeData.length
  const avgCSAT = csatData.reduce((sum, d) => sum + parseFloat(d.score), 0) / csatData.length

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleExport = () => {
    console.log("Exporting support data...")
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-foreground terminal-glow mb-2">Support Dashboard</h1>
          <p className="text-secondary/70">Customer support metrics, ticket tracking, and team performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] sm:w-[180px] glass-dark border/20">
              <Calendar className="sm:mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-dark border/20">
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last Quarter</SelectItem>
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
              <span className="text-secondary/70 text-sm font-medium">Total Tickets</span>
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{totalTickets}</span>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                8.5%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Resolved</span>
              <CheckCircle className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{resolvedTickets}</span>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                12.3%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Avg Response</span>
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{avgResponseTime.toFixed(0)}m</span>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingDown className="h-3 w-3 mr-1" />
                15.2%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">CSAT Score</span>
              <Star className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{avgCSAT.toFixed(1)}%</span>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                3.4%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Open Tickets</span>
              <AlertCircle className="h-4 w-4 text-orange-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{openTickets}</span>
              <div className="flex items-center text-sm text-red-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                5.7%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">SLA Compliance</span>
              <Target className="h-4 w-4 text-green-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">94.2%</span>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                2.1%
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Ticket Volume Over Time */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Ticket Volume Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={ticketVolumeData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="total" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} name="Total Tickets" />
            <Bar dataKey="resolved" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Resolved" />
            <Bar dataKey="open" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Open" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Response Time Distribution & CSAT Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Response Time Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={responseTimeData}>
              <defs>
                <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" unit="m" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Area type="monotone" dataKey="avgResponseTime" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorResponseTime)" strokeWidth={2} name="Avg Response Time" />
              <Line type="monotone" dataKey="slaTarget" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="SLA Target" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Customer Satisfaction (CSAT) Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={csatData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[80, 100]} unit="%" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', r: 5 }} name="CSAT Score" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Resolution Time by Priority */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Resolution Time by Priority</h3>
        <div className="space-y-4">
          {resolutionTimeByPriority.map((priority, index) => (
            <div key={priority.priority} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-medium">{priority.priority}</span>
                  <Badge variant="outline" className="border-secondary/30 text-secondary">
                    {priority.count} tickets
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-secondary/70">Avg: {priority.avgTime}m</span>
                  <span className="text-foreground font-semibold">SLA: {priority.sla}m</span>
                </div>
              </div>
              <div className="relative h-3 bg-secondary/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(priority.avgTime / priority.sla) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: priority.fill }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Agent Performance */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-400" />
          Support Agent Performance
        </h3>
        <div className="space-y-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-dark border/20 rounded-lg p-4"
            >
              <div className="flex items-center gap-4 mb-3">
                <Badge
                  variant="outline"
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    index === 0 ? 'border-yellow-500 text-yellow-400' :
                    index === 1 ? 'border-gray-400 text-gray-400' :
                    index === 2 ? 'border-orange-500 text-orange-400' :
                    'border-secondary/30 text-secondary'
                  }`}
                >
                  #{index + 1}
                </Badge>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={agent.avatar} />
                  <AvatarFallback className="bg-secondary/20 text-secondary">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{agent.name}</p>
                  <p className="text-xs text-secondary/70">{agent.ticketsResolved} tickets resolved • {agent.activeTickets} active</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">{agent.csat}%</span>
                  </div>
                  <p className="text-xs text-secondary/70">CSAT</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-secondary/70">Avg Response</p>
                  <p className="text-foreground font-semibold">{agent.avgResponseTime}m</p>
                </div>
                <div>
                  <p className="text-secondary/70">Avg Resolution</p>
                  <p className="text-foreground font-semibold">{agent.avgResolutionTime}m</p>
                </div>
                <div>
                  <p className="text-secondary/70">Efficiency</p>
                  <Progress value={(agent.ticketsResolved / 250) * 100} className="h-2 mt-1 bg-secondary/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recent Tickets */}
      <Card className="glass border/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Recent Tickets</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50" />
              <Input
                placeholder="Search tickets..."
                className="pl-10 glass-dark border/20 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[150px] glass-dark border/20">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-dark border/20">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/20">
                <TableHead className="text-secondary">Ticket ID</TableHead>
                <TableHead className="text-secondary">Subject</TableHead>
                <TableHead className="text-secondary">Customer</TableHead>
                <TableHead className="text-secondary">Priority</TableHead>
                <TableHead className="text-secondary">Status</TableHead>
                <TableHead className="text-secondary">Assigned To</TableHead>
                <TableHead className="text-secondary">Channel</TableHead>
                <TableHead className="text-secondary">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets
                .filter(ticket =>
                  (selectedStatus === "all" || ticket.status === selectedStatus) &&
                  (ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   ticket.id.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((ticket) => (
                  <TableRow key={ticket.id} className="border-b border-border/20 hover:bg-secondary/10">
                    <TableCell className="font-mono text-primary">{ticket.id}</TableCell>
                    <TableCell className="font-semibold text-foreground">{ticket.subject}</TableCell>
                    <TableCell className="text-secondary/70">{ticket.customer}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        ticket.priority === "critical" ? "border-red-500/30 text-red-400" :
                        ticket.priority === "high" ? "border-orange-500/30 text-orange-400" :
                        ticket.priority === "medium" ? "border-yellow-500/30 text-yellow-400" :
                        "border-green-500/30 text-green-400"
                      }>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        ticket.status === "open" ? "border-yellow-500/30 text-yellow-400" :
                        ticket.status === "pending" ? "border-cyan-500/30 text-cyan-400" :
                        ticket.status === "resolved" ? "border-emerald-500/30 text-emerald-400" :
                        "border-gray-500/30 text-gray-400"
                      }>
                        {ticket.status === "open" && <AlertCircle className="mr-1 h-3 w-3" />}
                        {ticket.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                        {ticket.status === "resolved" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">{ticket.assignedTo}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-secondary/30 text-secondary text-xs">
                        {ticket.channel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-secondary/70">{ticket.createdAt}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Ticket Status Breakdown & Top Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Ticket Status Breakdown</h3>
          <div className="flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ticketStatusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ status, percentage }) => `${status}: ${percentage}%`}
                >
                  {ticketStatusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {ticketStatusBreakdown.map((status) => (
              <div key={status.status} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.fill }} />
                  <span className="text-foreground">{status.status}</span>
                </div>
                <span className="text-secondary/70 font-semibold">{status.count} tickets</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Top Issues/Categories</h3>
          <div className="space-y-4">
            {topIssuesCategories.map((category, index) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{category.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-secondary/70">{category.count} tickets</span>
                    <div className={`flex items-center text-xs ${category.trend > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {category.trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(category.trend)}%
                    </div>
                  </div>
                </div>
                <Progress value={category.percentage * 3} className="h-2 bg-secondary/20" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Self-Service Article Views */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-secondary" />
          Self-Service Article Views
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={selfServiceArticleViews}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHelpful" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            />
            <Legend />
            <Area type="monotone" dataKey="views" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} name="Article Views" />
            <Area type="monotone" dataKey="helpful" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorHelpful)" strokeWidth={2} name="Marked Helpful" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Escalation Rate & Support Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Escalation Rate Tracking</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={escalationRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" unit="%" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="totalTickets" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} name="Total Tickets" />
              <Bar yAxisId="left" dataKey="escalated" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Escalated" />
              <Line yAxisId="right" type="monotone" dataKey="escalationRate" stroke="#ef4444" strokeWidth={3} name="Escalation Rate %" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Support Channel Distribution</h3>
          <div className="space-y-4">
            {supportChannelDistribution.map((channel, index) => (
              <div key={channel.channel} className="glass-dark border/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {channel.channel === "Email" && <Mail className="h-4 w-4 text-primary" />}
                    {channel.channel === "Chat" && <MessageSquare className="h-4 w-4 text-primary" />}
                    {channel.channel === "Phone" && <Phone className="h-4 w-4 text-primary" />}
                    {channel.channel === "Portal" && <Globe className="h-4 w-4 text-primary" />}
                    {channel.channel === "Social Media" && <Share2 className="h-4 w-4 text-primary" />}
                    <span className="text-foreground font-semibold">{channel.channel}</span>
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {channel.tickets} tickets
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-secondary/70">Avg Resolution</p>
                    <p className="text-foreground font-semibold">{channel.avgResolutionTime}m</p>
                  </div>
                  <div>
                    <p className="text-secondary/70">CSAT</p>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="font-semibold">{channel.csat}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* First Response Time SLA */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">First Response Time (SLA Tracking)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={firstResponseTimeSLA}>
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
            />
            <Legend />
            <Bar dataKey="withinSLA" stackId="a" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Within SLA" />
            <Bar dataKey="outsideSLA" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} name="Outside SLA" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
