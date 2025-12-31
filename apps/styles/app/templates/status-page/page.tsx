"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Database,
  Globe,
  HardDrive,
  Mail,
  Server,
  Shield,
  TrendingUp,
  Wifi,
  XCircle,
  Bell,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"

// Status types
type ServiceStatus = "operational" | "degraded" | "down" | "maintenance"

interface Service {
  id: string
  name: string
  description: string
  status: ServiceStatus
  uptime: number
  responseTime: number
  icon: React.ElementType
  lastIncident?: string
  incidents: number
}

interface Incident {
  id: string
  title: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  severity: "critical" | "major" | "minor"
  timestamp: string
  updates: {
    time: string
    message: string
    status: string
  }[]
  affectedServices: string[]
}

// Mock data
const services: Service[] = [
  {
    id: "api",
    name: "API Service",
    description: "Core API endpoints",
    status: "operational",
    uptime: 99.98,
    responseTime: 142,
    icon: Server,
    incidents: 0,
  },
  {
    id: "web",
    name: "Web Application",
    description: "Main website and dashboard",
    status: "operational",
    uptime: 99.99,
    responseTime: 98,
    icon: Globe,
    incidents: 0,
  },
  {
    id: "database",
    name: "Database Cluster",
    description: "Primary and replica databases",
    status: "operational",
    uptime: 99.95,
    responseTime: 45,
    icon: Database,
    incidents: 1,
    lastIncident: "2 days ago",
  },
  {
    id: "cdn",
    name: "CDN Network",
    description: "Content delivery network",
    status: "degraded",
    uptime: 98.5,
    responseTime: 215,
    icon: Wifi,
    incidents: 3,
    lastIncident: "12 hours ago",
  },
  {
    id: "storage",
    name: "Object Storage",
    description: "File and media storage",
    status: "operational",
    uptime: 99.92,
    responseTime: 156,
    icon: HardDrive,
    incidents: 0,
  },
  {
    id: "email",
    name: "Email Service",
    description: "Transactional emails",
    status: "operational",
    uptime: 99.88,
    responseTime: 412,
    icon: Mail,
    incidents: 2,
    lastIncident: "5 days ago",
  },
  {
    id: "auth",
    name: "Authentication",
    description: "User authentication service",
    status: "operational",
    uptime: 99.97,
    responseTime: 89,
    icon: Shield,
    incidents: 0,
  },
  {
    id: "queue",
    name: "Message Queue",
    description: "Background job processing",
    status: "operational",
    uptime: 99.94,
    responseTime: 67,
    icon: Activity,
    incidents: 1,
    lastIncident: "8 days ago",
  },
  {
    id: "search",
    name: "Search Service",
    description: "Full-text search engine",
    status: "operational",
    uptime: 99.91,
    responseTime: 178,
    icon: TrendingUp,
    incidents: 0,
  },
  {
    id: "monitoring",
    name: "Monitoring System",
    description: "Health checks and alerts",
    status: "operational",
    uptime: 99.96,
    responseTime: 234,
    icon: Activity,
    incidents: 0,
  },
]

const incidents: Incident[] = [
  {
    id: "inc-001",
    title: "CDN performance degradation in EU region",
    status: "monitoring",
    severity: "major",
    timestamp: "2025-11-22T09:30:00Z",
    affectedServices: ["cdn", "web"],
    updates: [
      {
        time: "2025-11-22T09:30:00Z",
        message: "We are investigating reports of slow response times in the EU region.",
        status: "investigating",
      },
      {
        time: "2025-11-22T10:15:00Z",
        message: "Issue identified with a specific edge server. Traffic is being rerouted.",
        status: "identified",
      },
      {
        time: "2025-11-22T10:45:00Z",
        message: "Fix has been deployed. Monitoring performance metrics.",
        status: "monitoring",
      },
    ],
  },
  {
    id: "inc-002",
    title: "Database replica lag detected",
    status: "resolved",
    severity: "minor",
    timestamp: "2025-11-20T14:20:00Z",
    affectedServices: ["database"],
    updates: [
      {
        time: "2025-11-20T14:20:00Z",
        message: "Elevated replication lag detected on read replica.",
        status: "investigating",
      },
      {
        time: "2025-11-20T14:45:00Z",
        message: "Replication has caught up. No data loss occurred.",
        status: "resolved",
      },
    ],
  },
]

// Generate uptime history data (90 days)
const generateUptimeHistory = () => {
  const data = []
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split("T")[0],
      uptime: 99 + Math.random() * 1,
      incidents: Math.random() > 0.9 ? 1 : 0,
    })
  }
  return data
}

// Generate response time data (24 hours)
const generateResponseTimeData = () => {
  const data = []
  for (let i = 23; i >= 0; i--) {
    const hour = new Date()
    hour.setHours(hour.getHours() - i)
    data.push({
      hour: hour.getHours(),
      api: 100 + Math.random() * 100,
      web: 50 + Math.random() * 100,
      database: 20 + Math.random() * 50,
    })
  }
  return data
}

const uptimeHistory = generateUptimeHistory()
const responseTimeData = generateResponseTimeData()

// Status badge component
const StatusBadge = ({ status }: { status: ServiceStatus }) => {
  const configs = {
    operational: {
      label: "Operational",
      variant: "default" as const,
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
    },
    degraded: {
      label: "Degraded Performance",
      variant: "secondary" as const,
      className: "bg-amber-500/20 text-amber-400 border-amber-500/50",
    },
    down: {
      label: "Major Outage",
      variant: "destructive" as const,
      className: "bg-red-500/20 text-red-400 border-red-500/50",
    },
    maintenance: {
      label: "Maintenance",
      variant: "outline" as const,
      className: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    },
  }

  const config = configs[status]

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}

// Status icon component
const StatusIcon = ({ status, className = "" }: { status: ServiceStatus; className?: string }) => {
  const icons = {
    operational: CheckCircle2,
    degraded: AlertCircle,
    down: XCircle,
    maintenance: Clock,
  }

  const colors = {
    operational: "text-emerald-400",
    degraded: "text-amber-400",
    down: "text-red-400",
    maintenance: "text-blue-400",
  }

  const Icon = icons[status]

  return <Icon className={`${colors[status]} ${className}`} />
}

export default function StatusPage() {
  const [filter, setFilter] = useState<ServiceStatus | "all">("all")
  const [lastChecked, setLastChecked] = useState(new Date())
  const [email, setEmail] = useState("")
  const [expandedIncident, setExpandedIncident] = useState<string | null>(incidents[0]?.id || null)

  useEffect(() => {
    const interval = setInterval(() => {
      setLastChecked(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Calculate overall status
  const overallStatus: ServiceStatus =
    services.some((s) => s.status === "down")
      ? "down"
      : services.some((s) => s.status === "degraded")
        ? "degraded"
        : services.some((s) => s.status === "maintenance")
          ? "maintenance"
          : "operational"

  // Filter services
  const filteredServices = filter === "all" ? services : services.filter((s) => s.status === filter)

  // Calculate stats
  const operationalCount = services.filter((s) => s.status === "operational").length
  const averageUptime = services.reduce((acc, s) => acc + s.uptime, 0) / services.length
  const totalIncidents = services.reduce((acc, s) => acc + s.incidents, 0)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">System Status</h1>
          <p className="text-muted-foreground text-lg">
            Real-time monitoring of all services and infrastructure
          </p>
        </motion.div>

        {/* Overall Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass border-glow">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <motion.div
                    animate={{
                      scale: overallStatus === "operational" ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: overallStatus === "operational" ? Infinity : 0,
                      repeatType: "loop",
                    }}
                  >
                    <StatusIcon status={overallStatus} className="w-16 h-16" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {overallStatus === "operational"
                        ? "All Systems Operational"
                        : overallStatus === "degraded"
                          ? "Partial System Outage"
                          : overallStatus === "down"
                            ? "Major Service Disruption"
                            : "Scheduled Maintenance"}
                    </h2>
                    <p className="text-muted-foreground">
                      {operationalCount} of {services.length} services operational
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={overallStatus} />
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Updated {lastChecked.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Average Uptime",
              value: `${averageUptime.toFixed(2)}%`,
              icon: TrendingUp,
              color: "text-primary",
            },
            {
              label: "Total Incidents",
              value: totalIncidents.toString(),
              icon: AlertCircle,
              color: "text-amber-400",
            },
            {
              label: "Services Monitored",
              value: services.length.toString(),
              icon: Server,
              color: "text-secondary",
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                      <p className="text-3xl font-bold">{metric.value}</p>
                    </div>
                    <metric.icon className={`w-10 h-10 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Active Incidents */}
        {incidents.some((i) => i.status !== "resolved") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="glass-dark border-amber-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                  Active Incidents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {incidents
                  .filter((i) => i.status !== "resolved")
                  .map((incident, index) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() =>
                          setExpandedIncident(expandedIncident === incident.id ? null : incident.id)
                        }
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {expandedIncident === incident.id ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            <h4 className="font-semibold">{incident.title}</h4>
                            <Badge
                              variant={incident.severity === "critical" ? "destructive" : "secondary"}
                              className={
                                incident.severity === "critical"
                                  ? "bg-red-500/20 text-red-400 border-red-500/50"
                                  : incident.severity === "major"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                                    : "bg-blue-500/20 text-blue-400 border-blue-500/50"
                              }
                            >
                              {incident.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground ml-7">
                            {new Date(incident.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {incident.status}
                        </Badge>
                      </div>

                      <AnimatePresence>
                        {expandedIncident === incident.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="ml-7 space-y-3 border-l-2 border-amber-500/30 pl-4"
                          >
                            {incident.updates.map((update, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(update.time).toLocaleTimeString()}
                                  </span>
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {update.status}
                                  </Badge>
                                </div>
                                <p className="text-sm">{update.message}</p>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Services Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Service Status</CardTitle>
                  <CardDescription>Individual service health and performance metrics</CardDescription>
                </div>
                <div className="flex gap-2">
                  {(["all", "operational", "degraded", "down", "maintenance"] as const).map((status) => (
                    <Button
                      key={status}
                      variant={filter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-dark p-6 rounded-lg space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{
                          scale: service.status === "operational" ? [1, 1.05, 1] : 1,
                        }}
                        transition={{
                          duration: 2,
                          repeat: service.status === "operational" ? Infinity : 0,
                          repeatType: "loop",
                        }}
                      >
                        <StatusIcon status={service.status} className="w-6 h-6" />
                      </motion.div>
                      <div className="flex items-center gap-3">
                        <service.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Uptime</p>
                        <p className="font-semibold">{service.uptime}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Response Time</p>
                        <p className="font-semibold">{service.responseTime}ms</p>
                      </div>
                      <StatusBadge status={service.status} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last 30 days uptime</span>
                      <span className="font-medium">{service.uptime}%</span>
                    </div>
                    <Progress value={service.uptime} className="h-2" />
                  </div>

                  {service.lastIncident && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Last incident: {service.lastIncident} ({service.incidents} total incidents)
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Uptime History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle>90-Day Uptime History</CardTitle>
                <CardDescription>Overall system availability over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={uptimeHistory}>
                    <defs>
                      <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[98, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))",
                      }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [`${value.toFixed(2)}%`, "Uptime"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="uptime"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#uptimeGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Response Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle>Response Time (24h)</CardTitle>
                <CardDescription>Average response time by service</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `${value}:00`}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `${value}ms`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))",
                      }}
                      labelFormatter={(value) => `${value}:00`}
                      formatter={(value: number) => `${Math.round(value)}ms`}
                    />
                    <Line
                      type="monotone"
                      dataKey="api"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      name="API"
                    />
                    <Line
                      type="monotone"
                      dataKey="web"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      dot={false}
                      name="Web"
                    />
                    <Line
                      type="monotone"
                      dataKey="database"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      dot={false}
                      name="Database"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Incident History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Incident History</CardTitle>
              <CardDescription>Past incidents and resolutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {incidents.map((incident, index) => (
                <div
                  key={incident.id}
                  className="glass-dark p-4 rounded-lg space-y-3 border-l-4"
                  style={{
                    borderLeftColor:
                      incident.severity === "critical"
                        ? "hsl(var(--destructive))"
                        : incident.severity === "major"
                          ? "hsl(var(--accent))"
                          : "hsl(var(--primary))",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold mb-1">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(incident.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={incident.status === "resolved" ? "default" : "secondary"}
                      className={
                        incident.status === "resolved"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/50"
                      }
                    >
                      {incident.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {incident.affectedServices.map((serviceId) => {
                      const service = services.find((s) => s.id === serviceId)
                      return service ? (
                        <Badge key={serviceId} variant="outline">
                          {service.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscribe to Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Card className="glass border-glow">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Bell className="w-10 h-10 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Subscribe to Status Updates</h3>
                    <p className="text-muted-foreground">
                      Get notified about incidents and maintenance windows
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-dark min-w-[280px]"
                  />
                  <Button className="whitespace-nowrap">
                    <Bell className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="text-center space-y-4 pb-8"
        >
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh Status
            </button>
            <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
              <ExternalLink className="w-4 h-4" />
              Status API
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Clock className="w-4 h-4" />
              Historical Data
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Uptime calculated based on 1-minute intervals. Last 90 days shown.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
