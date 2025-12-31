"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  AlertTriangle,
  Bug,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Filter,
  Info,
  Pause,
  Play,
  RefreshCw,
  Save,
  Search,
  Server,
  Settings,
  Skull,
  Terminal,
  Trash2,
  X,
} from "lucide-react"
import { Card, Button, Badge, Input, Checkbox, ScrollArea, Separator, Popover, PopoverContent, PopoverTrigger, Collapsible, CollapsibleContent, CollapsibleTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from "@ggprompts/ui"

// TypeScript Interfaces
interface LogEntry {
  id: string
  timestamp: string
  level: "debug" | "info" | "warn" | "error" | "fatal"
  message: string
  service: string
  host: string
  container?: string
  traceId?: string
  metadata?: Record<string, unknown>
  stack?: string
}

interface LogFilter {
  levels: string[]
  services: string[]
  hosts: string[]
  search: string
  timeRange: { start: string; end: string }
  regex: boolean
}

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: LogFilter
}

// Mock data generators
const services = ["api-gateway", "auth-service", "user-service", "payment-service", "notification-service", "analytics-service"]
const hosts = ["prod-server-01", "prod-server-02", "prod-server-03", "staging-server-01"]
const containers = ["container-a1b2c3", "container-d4e5f6", "container-g7h8i9", "container-j0k1l2"]

const logMessages: Record<string, string[]> = {
  debug: [
    "Cache miss for key: user_session_12345",
    "Database query executed in 12ms",
    "WebSocket connection established",
    "Request payload validated successfully",
    "Memory usage: 456MB / 1024MB",
    "Thread pool size adjusted to 16",
  ],
  info: [
    "User authentication successful: user_id=12345",
    "Order processed successfully: order_id=ORD-789",
    "Email notification sent to customer",
    "API rate limit reset for client_id=abc123",
    "Scheduled job completed: daily_cleanup",
    "Health check passed: all services operational",
  ],
  warn: [
    "High memory usage detected: 85% utilized",
    "Slow database query: 2.3s execution time",
    "Deprecated API endpoint accessed: /v1/users",
    "Rate limit approaching: 90% of quota used",
    "Certificate expires in 7 days",
    "Retry attempt 2/3 for external API call",
  ],
  error: [
    "Failed to connect to database: connection timeout",
    "Payment processing failed: insufficient funds",
    "Authentication failed: invalid token",
    "File upload failed: storage quota exceeded",
    "External API returned 503: service unavailable",
    "Message queue connection lost",
  ],
  fatal: [
    "CRITICAL: Database cluster unavailable",
    "FATAL: Out of memory - service terminating",
    "CRITICAL: Security breach detected",
    "FATAL: Configuration file corrupted",
    "CRITICAL: Data integrity check failed",
  ],
}

const generateLogEntry = (id: number): LogEntry => {
  const levels: Array<"debug" | "info" | "warn" | "error" | "fatal"> = ["debug", "info", "warn", "error", "fatal"]
  const weights = [0.15, 0.45, 0.25, 0.12, 0.03]
  const random = Math.random()
  let cumulative = 0
  let level: "debug" | "info" | "warn" | "error" | "fatal" = "info"

  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i]
    if (random < cumulative) {
      level = levels[i]
      break
    }
  }

  const messages = logMessages[level]
  const message = messages[Math.floor(Math.random() * messages.length)]
  const service = services[Math.floor(Math.random() * services.length)]
  const host = hosts[Math.floor(Math.random() * hosts.length)]

  const entry: LogEntry = {
    id: `log-${id}-${Date.now()}`,
    timestamp: new Date(Date.now() - Math.random() * 60000).toISOString(),
    level,
    message,
    service,
    host,
    container: Math.random() > 0.3 ? containers[Math.floor(Math.random() * containers.length)] : undefined,
    traceId: Math.random() > 0.4 ? `trace-${Math.random().toString(36).substr(2, 16)}` : undefined,
    metadata: Math.random() > 0.5 ? {
      requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
      userId: Math.floor(Math.random() * 100000),
      duration: Math.floor(Math.random() * 5000),
      statusCode: [200, 201, 400, 404, 500][Math.floor(Math.random() * 5)],
    } : undefined,
  }

  if (level === "error" || level === "fatal") {
    entry.stack = `Error: ${message}
    at processRequest (/app/src/handlers/request.ts:45:12)
    at async handleRoute (/app/src/router/index.ts:123:8)
    at async Server.handleRequest (/app/src/server.ts:89:5)
    at async processTicksAndRejections (node:internal/process/task_queues:95:5)`
  }

  return entry
}

const generateInitialLogs = (count: number): LogEntry[] => {
  return Array.from({ length: count }, (_, i) => generateLogEntry(i))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLive, setIsLive] = useState(true)
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [contextLines, setContextLines] = useState(3)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Filters
  const [filters, setFilters] = useState<LogFilter>({
    levels: ["debug", "info", "warn", "error", "fatal"],
    services: [],
    hosts: [],
    search: "",
    timeRange: { start: "", end: "" },
    regex: false,
  })

  // Saved searches
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: "1",
      name: "Errors Today",
      query: "error OR fatal",
      filters: { ...filters, levels: ["error", "fatal"] },
    },
    {
      id: "2",
      name: "Auth Issues",
      query: "authentication",
      filters: { ...filters, services: ["auth-service"] },
    },
  ])
  const [newSearchName, setNewSearchName] = useState("")

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    debug: 0,
    info: 0,
    warn: 0,
    error: 0,
    fatal: 0,
  })

  // Initialize logs
  useEffect(() => {
    const initialLogs = generateInitialLogs(100)
    setLogs(initialLogs)
    updateStats(initialLogs)
  }, [])

  // Real-time log simulation
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const newLog = generateLogEntry(logs.length)
      newLog.timestamp = new Date().toISOString()

      setLogs(prev => {
        const updated = [newLog, ...prev.slice(0, 499)]
        updateStats(updated)
        return updated
      })
    }, Math.random() * 2000 + 500)

    return () => clearInterval(interval)
  }, [isLive, logs.length])

  const updateStats = (logList: LogEntry[]) => {
    const newStats = {
      total: logList.length,
      debug: logList.filter(l => l.level === "debug").length,
      info: logList.filter(l => l.level === "info").length,
      warn: logList.filter(l => l.level === "warn").length,
      error: logList.filter(l => l.level === "error").length,
      fatal: logList.filter(l => l.level === "fatal").length,
    }
    setStats(newStats)
  }

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Level filter
      if (!filters.levels.includes(log.level)) return false

      // Service filter
      if (filters.services.length > 0 && !filters.services.includes(log.service)) return false

      // Host filter
      if (filters.hosts.length > 0 && !filters.hosts.includes(log.host)) return false

      // Search filter
      if (filters.search) {
        if (filters.regex) {
          try {
            const regex = new RegExp(filters.search, "i")
            if (!regex.test(log.message) && !regex.test(log.service)) return false
          } catch {
            return false
          }
        } else {
          const searchLower = filters.search.toLowerCase()
          if (!log.message.toLowerCase().includes(searchLower) &&
              !log.service.toLowerCase().includes(searchLower)) return false
        }
      }

      // Time range filter
      if (filters.timeRange.start) {
        const logTime = new Date(log.timestamp).getTime()
        const startTime = new Date(filters.timeRange.start).getTime()
        if (logTime < startTime) return false
      }
      if (filters.timeRange.end) {
        const logTime = new Date(log.timestamp).getTime()
        const endTime = new Date(filters.timeRange.end).getTime()
        if (logTime > endTime) return false
      }

      return true
    })
  }, [logs, filters])

  const toggleLevel = (level: string) => {
    setFilters(prev => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level],
    }))
  }

  const toggleService = (service: string) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }))
  }

  const toggleHost = (host: string) => {
    setFilters(prev => ({
      ...prev,
      hosts: prev.hosts.includes(host)
        ? prev.hosts.filter(h => h !== host)
        : [...prev.hosts, host],
    }))
  }

  const toggleLogExpanded = (logId: string) => {
    setExpandedLogs(prev => {
      const next = new Set(prev)
      if (next.has(logId)) {
        next.delete(logId)
      } else {
        next.add(logId)
      }
      return next
    })
  }

  const saveSearch = () => {
    if (!newSearchName.trim()) return
    const newSaved: SavedSearch = {
      id: Date.now().toString(),
      name: newSearchName,
      query: filters.search,
      filters: { ...filters },
    }
    setSavedSearches(prev => [...prev, newSaved])
    setNewSearchName("")
  }

  const loadSavedSearch = (saved: SavedSearch) => {
    setFilters(saved.filters)
  }

  const deleteSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id))
  }

  const exportLogs = (format: "json" | "csv") => {
    let content: string
    let filename: string
    let mimeType: string

    if (format === "json") {
      content = JSON.stringify(filteredLogs, null, 2)
      filename = `logs-export-${Date.now()}.json`
      mimeType = "application/json"
    } else {
      const headers = ["timestamp", "level", "service", "host", "message"]
      const rows = filteredLogs.map(log =>
        headers.map(h => `"${String(log[h as keyof LogEntry] || "").replace(/"/g, '""')}"`).join(",")
      )
      content = [headers.join(","), ...rows].join("\n")
      filename = `logs-export-${Date.now()}.csv`
      mimeType = "text/csv"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyLogToClipboard = (log: LogEntry) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2))
  }

  const clearFilters = () => {
    setFilters({
      levels: ["debug", "info", "warn", "error", "fatal"],
      services: [],
      hosts: [],
      search: "",
      timeRange: { start: "", end: "" },
      regex: false,
    })
  }

  const getLevelConfig = (level: string) => {
    switch (level) {
      case "debug":
        return {
          icon: Bug,
          color: "text-slate-400",
          bg: "bg-slate-500/20",
          border: "border-slate-500/30",
        }
      case "info":
        return {
          icon: Info,
          color: "text-primary",
          bg: "bg-primary/20",
          border: "border-primary/30",
        }
      case "warn":
        return {
          icon: AlertTriangle,
          color: "text-amber-400",
          bg: "bg-amber-500/20",
          border: "border-amber-500/30",
        }
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
        }
      case "fatal":
        return {
          icon: Skull,
          color: "text-red-500",
          bg: "bg-red-600/30",
          border: "border-red-600/50",
        }
      default:
        return {
          icon: Info,
          color: "text-foreground",
          bg: "bg-muted",
          border: "border-border",
        }
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    })
  }

  const getContextLogs = (logId: string) => {
    const index = filteredLogs.findIndex(l => l.id === logId)
    if (index === -1) return { before: [], after: [] }

    const before = filteredLogs.slice(Math.max(0, index - contextLines), index)
    const after = filteredLogs.slice(index + 1, index + 1 + contextLines)

    return { before, after }
  }

  return (
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
              Log Viewer
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time log streaming and analysis
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge className={`${isLive ? "bg-primary/20 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"} text-sm px-3 py-1`}>
              <motion.div
                animate={isLive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-2 h-2 rounded-full mr-2 ${isLive ? "bg-primary" : "bg-muted-foreground"}`}
              />
              {isLive ? "Live" : "Paused"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              {isLive ? <Pause className="h-4 w-4 sm:mr-2" /> : <Play className="h-4 w-4 sm:mr-2" />}
              <span className="hidden sm:inline">{isLive ? "Pause" : "Resume"}</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Download className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="glass border-border w-48">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => exportLogs("json")}
                  >
                    Export as JSON
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => exportLogs("csv")}
                  >
                    Export as CSV
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
        >
          <Card className="glass border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs">Total</p>
              <Terminal className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground font-mono mt-1">
              {stats.total.toLocaleString()}
            </p>
          </Card>
          {(["debug", "info", "warn", "error", "fatal"] as const).map(level => {
            const config = getLevelConfig(level)
            const Icon = config.icon
            return (
              <Card key={level} className={`glass ${config.border} p-4`}>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-xs capitalize">{level}</p>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <p className={`text-2xl font-bold ${config.color} font-mono mt-1`}>
                  {stats[level].toLocaleString()}
                </p>
              </Card>
            )
          })}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Search */}
            <Card className="glass border-primary/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-primary">Search</h3>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Search logs..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="bg-background/50 border-border"
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="regex"
                    checked={filters.regex}
                    onCheckedChange={(checked) =>
                      setFilters(prev => ({ ...prev, regex: checked === true }))
                    }
                  />
                  <Label htmlFor="regex" className="text-xs text-muted-foreground">
                    Use regex
                  </Label>
                </div>
              </div>
            </Card>

            {/* Level Filters */}
            <Card className="glass border-secondary/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-secondary" />
                <h3 className="text-sm font-semibold text-secondary">Log Levels</h3>
              </div>
              <div className="space-y-2">
                {(["debug", "info", "warn", "error", "fatal"] as const).map(level => {
                  const config = getLevelConfig(level)
                  const Icon = config.icon
                  return (
                    <div key={level} className="flex items-center gap-2">
                      <Checkbox
                        id={`level-${level}`}
                        checked={filters.levels.includes(level)}
                        onCheckedChange={() => toggleLevel(level)}
                      />
                      <Label
                        htmlFor={`level-${level}`}
                        className={`flex items-center gap-2 text-sm capitalize cursor-pointer ${config.color}`}
                      >
                        <Icon className="h-3 w-3" />
                        {level}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Source Filters */}
            <Card className="glass border-border p-4">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 w-full">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground flex-1 text-left">Services</h3>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="space-y-2">
                    {services.map(service => (
                      <div key={service} className="flex items-center gap-2">
                        <Checkbox
                          id={`service-${service}`}
                          checked={filters.services.includes(service)}
                          onCheckedChange={() => toggleService(service)}
                        />
                        <Label
                          htmlFor={`service-${service}`}
                          className="text-xs text-muted-foreground cursor-pointer truncate"
                        >
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            <Card className="glass border-border p-4">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 w-full">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground flex-1 text-left">Hosts</h3>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="space-y-2">
                    {hosts.map(host => (
                      <div key={host} className="flex items-center gap-2">
                        <Checkbox
                          id={`host-${host}`}
                          checked={filters.hosts.includes(host)}
                          onCheckedChange={() => toggleHost(host)}
                        />
                        <Label
                          htmlFor={`host-${host}`}
                          className="text-xs text-muted-foreground cursor-pointer truncate"
                        >
                          {host}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Time Range */}
            <Card className="glass border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Time Range</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Input
                    type="datetime-local"
                    value={filters.timeRange.start}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      timeRange: { ...prev.timeRange, start: e.target.value },
                    }))}
                    className="bg-background/50 border-border text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Input
                    type="datetime-local"
                    value={filters.timeRange.end}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      timeRange: { ...prev.timeRange, end: e.target.value },
                    }))}
                    className="bg-background/50 border-border text-xs"
                  />
                </div>
              </div>
            </Card>

            {/* Context Lines */}
            <Card className="glass border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Context Lines</h3>
              </div>
              <Select
                value={contextLines.toString()}
                onValueChange={(v) => setContextLines(parseInt(v))}
              >
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-border">
                  {[1, 3, 5, 10].map(n => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {n === 1 ? "line" : "lines"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {/* Saved Searches */}
            <Card className="glass border-primary/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Save className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-primary">Saved Searches</h3>
              </div>
              <div className="space-y-2 mb-3">
                {savedSearches.map(saved => (
                  <div
                    key={saved.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-background/30 hover:bg-background/50 transition-colors group"
                  >
                    <button
                      onClick={() => loadSavedSearch(saved)}
                      className="flex-1 text-left text-xs text-muted-foreground hover:text-foreground truncate"
                    >
                      {saved.name}
                    </button>
                    <button
                      onClick={() => deleteSavedSearch(saved.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3 text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Save search as..."
                  value={newSearchName}
                  onChange={(e) => setNewSearchName(e.target.value)}
                  className="bg-background/50 border-border text-xs"
                />
                <Button size="sm" variant="outline" onClick={saveSearch} className="border-primary/30">
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </Card>

            {/* Clear Filters */}
            <Button
              variant="outline"
              className="w-full border-border text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </motion.div>

          {/* Log Stream */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Card className="glass border-primary/30 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-primary">Log Stream</h3>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-mono text-xs">
                    {filteredLogs.length.toLocaleString()} entries
                  </Badge>
                </div>
                {filters.search || filters.services.length > 0 || filters.hosts.length > 0 ? (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                    Filtered
                  </Badge>
                ) : null}
              </div>

              <ScrollArea className="h-[700px]" ref={scrollRef}>
                <div className="space-y-1 font-mono text-sm">
                  <AnimatePresence mode="popLayout">
                    {filteredLogs.map((log, index) => {
                      const config = getLevelConfig(log.level)
                      const Icon = config.icon
                      const isExpanded = expandedLogs.has(log.id)

                      return (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className={`group rounded-md ${config.bg} ${config.border} border hover:border-opacity-60 transition-colors`}
                        >
                          <div
                            className="flex items-start gap-2 p-2 cursor-pointer"
                            onClick={() => toggleLogExpanded(log.id)}
                          >
                            <button className="mt-0.5 shrink-0">
                              {isExpanded ? (
                                <ChevronDown className={`h-4 w-4 ${config.color}`} />
                              ) : (
                                <ChevronRight className={`h-4 w-4 ${config.color}`} />
                              )}
                            </button>
                            <Icon className={`h-4 w-4 ${config.color} shrink-0 mt-0.5`} />
                            <span className="text-muted-foreground text-xs shrink-0 w-24">
                              {formatTimestamp(log.timestamp)}
                            </span>
                            <Badge className={`${config.bg} ${config.color} ${config.border} text-xs uppercase shrink-0`}>
                              {log.level}
                            </Badge>
                            <span className="text-secondary text-xs shrink-0 hidden sm:inline">
                              [{log.service}]
                            </span>
                            <span className={`${config.color} flex-1 truncate`}>
                              {log.message}
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyLogToClipboard(log)
                                }}
                                className="p-1 hover:bg-background/50 rounded"
                              >
                                <Copy className="h-3 w-3 text-muted-foreground" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 pt-0 space-y-3">
                                  <Separator className="bg-border" />

                                  {/* Metadata Grid */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                    <div>
                                      <p className="text-muted-foreground">Service</p>
                                      <p className="text-foreground">{log.service}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Host</p>
                                      <p className="text-foreground">{log.host}</p>
                                    </div>
                                    {log.container && (
                                      <div>
                                        <p className="text-muted-foreground">Container</p>
                                        <p className="text-foreground">{log.container}</p>
                                      </div>
                                    )}
                                    {log.traceId && (
                                      <div>
                                        <p className="text-muted-foreground">Trace ID</p>
                                        <p className="text-secondary">{log.traceId}</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Full Message */}
                                  <div>
                                    <p className="text-muted-foreground text-xs mb-1">Message</p>
                                    <p className={`${config.color} bg-background/30 p-2 rounded text-xs`}>
                                      {log.message}
                                    </p>
                                  </div>

                                  {/* Metadata JSON */}
                                  {log.metadata && (
                                    <div>
                                      <p className="text-muted-foreground text-xs mb-1">Metadata</p>
                                      <pre className="text-xs text-muted-foreground bg-background/30 p-2 rounded overflow-x-auto">
                                        {JSON.stringify(log.metadata, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                  {/* Stack Trace */}
                                  {log.stack && (
                                    <div>
                                      <p className="text-red-400 text-xs mb-1">Stack Trace</p>
                                      <pre className="text-xs text-red-300/80 bg-red-950/30 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                                        {log.stack}
                                      </pre>
                                    </div>
                                  )}

                                  {/* Context Lines */}
                                  <div>
                                    <p className="text-muted-foreground text-xs mb-1">Context ({contextLines} lines)</p>
                                    <div className="space-y-1">
                                      {getContextLogs(log.id).before.map(contextLog => {
                                        const ctxConfig = getLevelConfig(contextLog.level)
                                        return (
                                          <div
                                            key={contextLog.id}
                                            className="flex items-center gap-2 text-xs opacity-50 pl-2 border-l-2 border-muted"
                                          >
                                            <span className="text-muted-foreground w-20">
                                              {formatTimestamp(contextLog.timestamp)}
                                            </span>
                                            <Badge className={`${ctxConfig.bg} ${ctxConfig.color} text-xs scale-75`}>
                                              {contextLog.level}
                                            </Badge>
                                            <span className="truncate text-muted-foreground">
                                              {contextLog.message}
                                            </span>
                                          </div>
                                        )
                                      })}
                                      <div className="flex items-center gap-2 text-xs pl-2 border-l-2 border-primary">
                                        <span className="text-muted-foreground w-20">
                                          {formatTimestamp(log.timestamp)}
                                        </span>
                                        <Badge className={`${config.bg} ${config.color} text-xs scale-75`}>
                                          {log.level}
                                        </Badge>
                                        <span className={`truncate ${config.color}`}>
                                          {log.message}
                                        </span>
                                        <span className="text-primary text-xs">&larr; current</span>
                                      </div>
                                      {getContextLogs(log.id).after.map(contextLog => {
                                        const ctxConfig = getLevelConfig(contextLog.level)
                                        return (
                                          <div
                                            key={contextLog.id}
                                            className="flex items-center gap-2 text-xs opacity-50 pl-2 border-l-2 border-muted"
                                          >
                                            <span className="text-muted-foreground w-20">
                                              {formatTimestamp(contextLog.timestamp)}
                                            </span>
                                            <Badge className={`${ctxConfig.bg} ${ctxConfig.color} text-xs scale-75`}>
                                              {contextLog.level}
                                            </Badge>
                                            <span className="truncate text-muted-foreground">
                                              {contextLog.message}
                                            </span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  {filteredLogs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Search className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg">No logs match your filters</p>
                      <p className="text-sm mt-1">Try adjusting your search criteria</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>
        </div>

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 right-8 glass border-primary/30 rounded-full px-4 py-2 flex items-center gap-2"
        >
          <motion.div
            animate={isLive ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-2 h-2 rounded-full ${isLive ? "bg-primary" : "bg-muted-foreground"}`}
          />
          <span className={`text-sm font-mono ${isLive ? "text-primary" : "text-muted-foreground"}`}>
            {isLive ? "Streaming" : "Paused"}
          </span>
          <Clock className={`h-4 w-4 ${isLive ? "text-primary" : "text-muted-foreground"}`} />
        </motion.div>
      </div>
    </div>
  )
}
