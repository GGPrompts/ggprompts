"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Download,
  ExternalLink,
  Filter,
  Globe,
  Hash,
  Link2,
  MoreVertical,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Server,
  Settings,
  Terminal,
  Trash2,
  X,
  Zap,
} from "lucide-react"
import { Card, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Input, Label, Separator, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Collapsible, CollapsibleContent, CollapsibleTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea, Switch } from "@ggprompts/ui"

// TypeScript Interfaces
interface ResponseConfig {
  status: number
  headers: Record<string, string>
  body: string
  delay: number
}

interface WebhookEndpoint {
  id: string
  url: string
  name?: string
  createdAt: string
  requestCount: number
  responseConfig: ResponseConfig
  forwardUrl?: string
}

interface WebhookRequest {
  id: string
  endpointId: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  headers: Record<string, string>
  queryParams: Record<string, string>
  body?: any
  bodyRaw: string
  contentType: string
  sourceIp: string
  timestamp: string
  responseStatus: number
  responseTime: number
}

// Mock data
const mockEndpoint: WebhookEndpoint = {
  id: "ep_a1b2c3d4e5f6",
  url: "https://hooks.webhookinspector.dev/ep_a1b2c3d4e5f6",
  name: "Payment Webhooks",
  createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  requestCount: 47,
  responseConfig: {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: '{"success": true, "message": "Webhook received"}',
    delay: 0,
  },
  forwardUrl: "",
}

const mockRequests: WebhookRequest[] = [
  {
    id: "req_001",
    endpointId: "ep_a1b2c3d4e5f6",
    method: "POST",
    path: "/ep_a1b2c3d4e5f6",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Stripe/1.0 (+https://stripe.com)",
      "Stripe-Signature": "t=1687456789,v1=abc123...",
      "X-Request-Id": "req_xK8jHmP2qN",
      Accept: "*/*",
      Host: "hooks.webhookinspector.dev",
    },
    queryParams: {},
    body: {
      id: "evt_1NqP2mLkdIwHu7ixZiNBGHjY",
      object: "event",
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_3NqP2mLkdIwHu7ix0uZiNBGH",
          amount: 2000,
          currency: "usd",
          status: "succeeded",
          customer: "cus_OjK2LmNp3qR",
          metadata: {
            order_id: "order_12345",
          },
        },
      },
    },
    bodyRaw:
      '{"id":"evt_1NqP2mLkdIwHu7ixZiNBGHjY","object":"event","type":"payment_intent.succeeded","data":{"object":{"id":"pi_3NqP2mLkdIwHu7ix0uZiNBGH","amount":2000,"currency":"usd","status":"succeeded","customer":"cus_OjK2LmNp3qR","metadata":{"order_id":"order_12345"}}}}',
    contentType: "application/json",
    sourceIp: "54.187.174.169",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    responseStatus: 200,
    responseTime: 45,
  },
  {
    id: "req_002",
    endpointId: "ep_a1b2c3d4e5f6",
    method: "POST",
    path: "/ep_a1b2c3d4e5f6",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "GitHub-Hookshot/abc1234",
      "X-GitHub-Event": "push",
      "X-GitHub-Delivery": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      Accept: "*/*",
    },
    queryParams: {},
    body: {
      ref: "refs/heads/main",
      repository: {
        id: 123456789,
        name: "my-project",
        full_name: "user/my-project",
      },
      pusher: {
        name: "developer",
        email: "dev@example.com",
      },
      commits: [
        {
          id: "abc123def456",
          message: "feat: add new feature",
          author: { name: "Developer", email: "dev@example.com" },
        },
      ],
    },
    bodyRaw:
      '{"ref":"refs/heads/main","repository":{"id":123456789,"name":"my-project","full_name":"user/my-project"},"pusher":{"name":"developer","email":"dev@example.com"},"commits":[{"id":"abc123def456","message":"feat: add new feature","author":{"name":"Developer","email":"dev@example.com"}}]}',
    contentType: "application/json",
    sourceIp: "140.82.115.105",
    timestamp: new Date(Date.now() - 180000).toISOString(),
    responseStatus: 200,
    responseTime: 32,
  },
  {
    id: "req_003",
    endpointId: "ep_a1b2c3d4e5f6",
    method: "PUT",
    path: "/ep_a1b2c3d4e5f6?action=update",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk_live_xxx",
      "X-Webhook-Secret": "whsec_abc123",
    },
    queryParams: { action: "update" },
    body: {
      event: "subscription.updated",
      subscription: {
        id: "sub_1234",
        status: "active",
        plan: "pro",
        current_period_end: "2024-02-01",
      },
    },
    bodyRaw:
      '{"event":"subscription.updated","subscription":{"id":"sub_1234","status":"active","plan":"pro","current_period_end":"2024-02-01"}}',
    contentType: "application/json",
    sourceIp: "104.18.12.68",
    timestamp: new Date(Date.now() - 420000).toISOString(),
    responseStatus: 200,
    responseTime: 28,
  },
  {
    id: "req_004",
    endpointId: "ep_a1b2c3d4e5f6",
    method: "POST",
    path: "/ep_a1b2c3d4e5f6",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Twilio/2023.10.16",
      "X-Twilio-Signature": "abc123signature",
    },
    queryParams: {},
    body: null,
    bodyRaw: "From=%2B15551234567&To=%2B15559876543&Body=Hello%20World",
    contentType: "application/x-www-form-urlencoded",
    sourceIp: "54.243.31.50",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    responseStatus: 200,
    responseTime: 52,
  },
  {
    id: "req_005",
    endpointId: "ep_a1b2c3d4e5f6",
    method: "DELETE",
    path: "/ep_a1b2c3d4e5f6?id=resource_789",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer token123",
    },
    queryParams: { id: "resource_789" },
    body: null,
    bodyRaw: "",
    contentType: "application/json",
    sourceIp: "192.168.1.100",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    responseStatus: 200,
    responseTime: 18,
  },
  {
    id: "req_006",
    endpointId: "ep_a1b2c3d4e5f6",
    method: "PATCH",
    path: "/ep_a1b2c3d4e5f6",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "api_key_abc123",
    },
    queryParams: {},
    body: {
      operation: "partial_update",
      fields: ["name", "email"],
      data: {
        name: "John Updated",
        email: "john.updated@example.com",
      },
    },
    bodyRaw:
      '{"operation":"partial_update","fields":["name","email"],"data":{"name":"John Updated","email":"john.updated@example.com"}}',
    contentType: "application/json",
    sourceIp: "172.16.0.50",
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    responseStatus: 200,
    responseTime: 41,
  },
]

// Helper Components
function JsonViewer({
  data,
  searchTerm = "",
}: {
  data: any
  searchTerm?: string
}) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(["root"])
  )

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const highlightText = (text: string, search: string) => {
    if (!search) return text
    const parts = text.split(new RegExp(`(${search})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} className="bg-primary/30 text-primary rounded px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  const renderValue = (
    value: any,
    path: string,
    depth: number = 0
  ): React.ReactNode => {
    if (value === null)
      return <span className="text-slate-500 italic">null</span>
    if (value === undefined)
      return <span className="text-slate-500 italic">undefined</span>

    if (typeof value === "string") {
      return (
        <span className="text-primary">
          &quot;{highlightText(value, searchTerm)}&quot;
        </span>
      )
    }
    if (typeof value === "number") {
      return <span className="text-secondary">{value}</span>
    }
    if (typeof value === "boolean") {
      return <span className="text-accent">{value.toString()}</span>
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedPaths.has(path)
      return (
        <span>
          <button
            onClick={() => togglePath(path)}
            className="inline-flex items-center hover:text-primary transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span className="text-slate-400">[</span>
            {!isExpanded && (
              <span className="text-slate-500 text-xs mx-1">
                {value.length} items
              </span>
            )}
          </button>
          {isExpanded && (
            <div className="ml-4 border-l border-border/30 pl-2">
              {value.map((item, i) => (
                <div key={i} className="flex">
                  <span className="text-slate-500 mr-2">{i}:</span>
                  {renderValue(item, `${path}[${i}]`, depth + 1)}
                  {i < value.length - 1 && (
                    <span className="text-slate-500">,</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <span className="text-slate-400">]</span>
        </span>
      )
    }

    if (typeof value === "object") {
      const isExpanded = expandedPaths.has(path)
      const keys = Object.keys(value)
      return (
        <span>
          <button
            onClick={() => togglePath(path)}
            className="inline-flex items-center hover:text-primary transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span className="text-slate-400">{"{"}</span>
            {!isExpanded && (
              <span className="text-slate-500 text-xs mx-1">
                {keys.length} keys
              </span>
            )}
          </button>
          {isExpanded && (
            <div className="ml-4 border-l border-border/30 pl-2">
              {keys.map((key, i) => (
                <div key={key} className="flex flex-wrap">
                  <span className="text-blue-400">
                    &quot;{highlightText(key, searchTerm)}&quot;
                  </span>
                  <span className="text-slate-400 mx-1">:</span>
                  {renderValue(value[key], `${path}.${key}`, depth + 1)}
                  {i < keys.length - 1 && (
                    <span className="text-slate-500">,</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <span className="text-slate-400">{"}"}</span>
        </span>
      )
    }

    return <span>{String(value)}</span>
  }

  return (
    <div className="font-mono text-sm whitespace-pre-wrap">
      {renderValue(data, "root")}
    </div>
  )
}

export default function WebhookInspector() {
  const [endpoint] = useState<WebhookEndpoint>(mockEndpoint)
  const [requests, setRequests] = useState<WebhookRequest[]>(mockRequests)
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(
    mockRequests[0]
  )
  const [copied, setCopied] = useState(false)
  const [isLive, setIsLive] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [payloadSearch, setPayloadSearch] = useState("")

  // Filters
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Response Config
  const [responseConfig, setResponseConfig] = useState<ResponseConfig>(
    endpoint.responseConfig
  )
  const [forwardUrl, setForwardUrl] = useState(endpoint.forwardUrl || "")
  const [forwardEnabled, setForwardEnabled] = useState(false)

  // Real-time simulation
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const methods: WebhookRequest["method"][] = [
          "GET",
          "POST",
          "PUT",
          "PATCH",
          "DELETE",
        ]
        const sources = [
          "Stripe",
          "GitHub",
          "Shopify",
          "Twilio",
          "SendGrid",
          "Slack",
        ]
        const randomMethod = methods[Math.floor(Math.random() * methods.length)]
        const randomSource = sources[Math.floor(Math.random() * sources.length)]

        const newRequest: WebhookRequest = {
          id: `req_${Date.now()}`,
          endpointId: endpoint.id,
          method: randomMethod,
          path: `/ep_a1b2c3d4e5f6`,
          headers: {
            "Content-Type": "application/json",
            "User-Agent": `${randomSource}/1.0`,
            "X-Request-Id": `req_${Math.random().toString(36).slice(2, 10)}`,
          },
          queryParams: {},
          body: {
            event: `${randomSource.toLowerCase()}.event`,
            timestamp: new Date().toISOString(),
            data: { id: Math.random().toString(36).slice(2, 10) },
          },
          bodyRaw: JSON.stringify({
            event: `${randomSource.toLowerCase()}.event`,
            timestamp: new Date().toISOString(),
            data: { id: Math.random().toString(36).slice(2, 10) },
          }),
          contentType: "application/json",
          sourceIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          timestamp: new Date().toISOString(),
          responseStatus: 200,
          responseTime: Math.floor(Math.random() * 80) + 10,
        }

        setRequests((prev) => [newRequest, ...prev.slice(0, 49)])
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isLive, endpoint.id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getMethodColor = (method: string): string => {
    switch (method) {
      case "GET":
        return "bg-primary/20 text-primary border-primary/30"
      case "POST":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "PUT":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "PATCH":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "DELETE":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) {
      return `${Math.floor(diff / 1000)}s ago`
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`
    }
    return date.toLocaleDateString()
  }

  const filteredRequests = requests.filter((req) => {
    if (methodFilter !== "all" && req.method !== methodFilter) return false
    if (statusFilter !== "all") {
      if (statusFilter === "success" && req.responseStatus >= 400) return false
      if (statusFilter === "error" && req.responseStatus < 400) return false
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        req.method.toLowerCase().includes(searchLower) ||
        req.path.toLowerCase().includes(searchLower) ||
        req.bodyRaw.toLowerCase().includes(searchLower) ||
        req.sourceIp.includes(searchTerm)
      )
    }
    return true
  })

  const handleReplay = (request: WebhookRequest) => {
    const replayedRequest: WebhookRequest = {
      ...request,
      id: `req_replay_${Date.now()}`,
      timestamp: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 50) + 20,
    }
    setRequests((prev) => [replayedRequest, ...prev])
    setSelectedRequest(replayedRequest)
  }

  const exportRequests = () => {
    const data = JSON.stringify(requests, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `webhook-requests-${endpoint.id}.json`
    a.click()
    URL.revokeObjectURL(url)
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
              Webhook Inspector
            </h1>
            <p className="text-foreground/60 mt-2">
              Capture, inspect, and debug webhooks in real-time
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={`border-primary/30 ${isLive ? "text-primary" : "text-foreground/60"}`}
            >
              {isLive ? (
                <Pause className="h-4 w-4 sm:mr-2" />
              ) : (
                <Play className="h-4 w-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">{isLive ? "Pause" : "Resume"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportRequests}
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </motion.div>

        {/* Endpoint URL Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass border-primary/30 p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground/60 text-sm">Your Webhook URL</p>
                  <p className="text-foreground/40 text-xs">
                    {endpoint.name || "Unnamed Endpoint"}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 glass-dark border-border/30 rounded-lg p-3 font-mono text-sm text-foreground overflow-x-auto">
                  {endpoint.url}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(endpoint.url)}
                  className="border-primary/30 shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary font-mono">
                    {requests.length}
                  </p>
                  <p className="text-foreground/60 text-xs">Requests</p>
                </div>
                <Separator orientation="vertical" className="h-10 bg-border/30" />
                <div className="flex items-center gap-2">
                  {isLive && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                  <span className={isLive ? "text-primary" : "text-foreground/60"}>
                    {isLive ? "Live" : "Paused"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Request List */}
          <div className="lg:col-span-5">
            <Card className="glass border-primary/30 p-5 h-[700px] flex flex-col">
              {/* Filters */}
              <div className="space-y-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 glass-dark border-border/30"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-border/30 shrink-0"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-[120px] glass-dark border-border/30">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px] glass-dark border-border/30">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>

                  {(methodFilter !== "all" ||
                    statusFilter !== "all" ||
                    searchTerm) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMethodFilter("all")
                        setStatusFilter("all")
                        setSearchTerm("")
                      }}
                      className="text-foreground/60"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="bg-border/30 mb-4" />

              {/* Request List */}
              <ScrollArea className="flex-1">
                <div className="space-y-2 pr-4">
                  <AnimatePresence mode="popLayout">
                    {filteredRequests.map((request, idx) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedRequest(request)}
                        className={`glass-dark rounded-lg p-4 cursor-pointer transition-all ${
                          selectedRequest?.id === request.id
                            ? "border-primary/50 ring-1 ring-primary/30"
                            : "border-border/20 hover:border-border/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getMethodColor(request.method)}>
                            {request.method}
                          </Badge>
                          <span className="text-foreground/50 text-xs">
                            {formatTimestamp(request.timestamp)}
                          </span>
                        </div>

                        <p className="text-foreground text-sm font-mono truncate mb-2">
                          {request.path}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-foreground/50">{request.sourceIp}</span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                request.responseStatus < 400
                                  ? "border-primary/30 text-primary"
                                  : "border-red-500/30 text-red-400"
                              }`}
                            >
                              {request.responseStatus}
                            </Badge>
                            <span className="text-foreground/50">
                              {request.responseTime}ms
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredRequests.length === 0 && (
                    <div className="text-center py-12 text-foreground/50">
                      <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No requests match your filters</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Request Detail */}
          <div className="lg:col-span-7">
            {selectedRequest ? (
              <Card className="glass border-secondary/30 p-5 h-[700px] flex flex-col">
                {/* Request Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getMethodColor(selectedRequest.method)}>
                      {selectedRequest.method}
                    </Badge>
                    <span className="text-foreground font-mono text-sm truncate">
                      {selectedRequest.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReplay(selectedRequest)}
                      className="border-primary/30"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Replay
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(JSON.stringify(selectedRequest, null, 2))
                      }
                      className="border-border/30"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Request Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="glass-dark rounded-lg p-3">
                    <p className="text-foreground/50 text-xs mb-1">Source IP</p>
                    <p className="text-foreground font-mono text-sm">
                      {selectedRequest.sourceIp}
                    </p>
                  </div>
                  <div className="glass-dark rounded-lg p-3">
                    <p className="text-foreground/50 text-xs mb-1">Response Time</p>
                    <p className="text-secondary font-mono text-sm">
                      {selectedRequest.responseTime}ms
                    </p>
                  </div>
                  <div className="glass-dark rounded-lg p-3">
                    <p className="text-foreground/50 text-xs mb-1">Status</p>
                    <p
                      className={`font-mono text-sm ${
                        selectedRequest.responseStatus < 400
                          ? "text-primary"
                          : "text-red-400"
                      }`}
                    >
                      {selectedRequest.responseStatus}
                    </p>
                  </div>
                  <div className="glass-dark rounded-lg p-3">
                    <p className="text-foreground/50 text-xs mb-1">Content-Type</p>
                    <p className="text-foreground font-mono text-sm truncate">
                      {selectedRequest.contentType}
                    </p>
                  </div>
                </div>

                <Separator className="bg-border/30 mb-4" />

                {/* Tabs */}
                <Tabs defaultValue="body" className="flex-1 flex flex-col">
                  <TabsList className="glass-dark border-border/30 w-max mb-4">
                    <TabsTrigger value="body" className="text-sm">
                      Body
                    </TabsTrigger>
                    <TabsTrigger value="headers" className="text-sm">
                      Headers
                    </TabsTrigger>
                    <TabsTrigger value="query" className="text-sm">
                      Query Params
                    </TabsTrigger>
                    <TabsTrigger value="raw" className="text-sm">
                      Raw
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="body" className="h-full m-0">
                      <div className="h-full flex flex-col">
                        {/* Payload Search */}
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                          <Input
                            placeholder="Search in payload..."
                            value={payloadSearch}
                            onChange={(e) => setPayloadSearch(e.target.value)}
                            className="pl-9 glass-dark border-border/30"
                          />
                        </div>

                        <ScrollArea className="flex-1 glass-dark rounded-lg p-4 border border-border/20">
                          {selectedRequest.body ? (
                            <JsonViewer
                              data={selectedRequest.body}
                              searchTerm={payloadSearch}
                            />
                          ) : (
                            <p className="text-foreground/50 text-sm italic">
                              No JSON body
                            </p>
                          )}
                        </ScrollArea>
                      </div>
                    </TabsContent>

                    <TabsContent value="headers" className="h-full m-0">
                      <ScrollArea className="h-full">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border/30">
                              <TableHead className="text-foreground/60">Header</TableHead>
                              <TableHead className="text-foreground/60">Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(selectedRequest.headers).map(
                              ([key, value]) => (
                                <TableRow key={key} className="border-border/20">
                                  <TableCell className="font-mono text-blue-400 text-sm">
                                    {key}
                                  </TableCell>
                                  <TableCell className="font-mono text-foreground text-sm break-all">
                                    {value}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="query" className="h-full m-0">
                      <ScrollArea className="h-full">
                        {Object.keys(selectedRequest.queryParams).length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border/30">
                                <TableHead className="text-foreground/60">
                                  Parameter
                                </TableHead>
                                <TableHead className="text-foreground/60">Value</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Object.entries(selectedRequest.queryParams).map(
                                ([key, value]) => (
                                  <TableRow key={key} className="border-border/20">
                                    <TableCell className="font-mono text-blue-400 text-sm">
                                      {key}
                                    </TableCell>
                                    <TableCell className="font-mono text-foreground text-sm">
                                      {value}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-12 text-foreground/50">
                            <Hash className="h-8 w-8 mx-auto mb-3 opacity-50" />
                            <p>No query parameters</p>
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="raw" className="h-full m-0">
                      <ScrollArea className="h-full">
                        <div className="glass-dark rounded-lg p-4 border border-border/20">
                          <pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all">
                            {selectedRequest.bodyRaw || "(empty body)"}
                          </pre>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            ) : (
              <Card className="glass border-border/30 p-5 h-[700px] flex items-center justify-center">
                <div className="text-center text-foreground/50">
                  <Terminal className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">Select a request to inspect</p>
                  <p className="text-sm">
                    Click on any request from the list to view details
                  </p>
                </div>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Response Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass border-accent/30 p-5">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold text-accent">
                    Response Configuration
                  </h3>
                </div>
                <ChevronDown className="h-5 w-5 text-foreground/60" />
              </CollapsibleTrigger>

              <CollapsibleContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Response Settings */}
                  <div className="space-y-4">
                    <h4 className="text-foreground font-medium flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      Custom Response
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-foreground/60">Status Code</Label>
                        <Select
                          value={responseConfig.status.toString()}
                          onValueChange={(val) =>
                            setResponseConfig((prev) => ({
                              ...prev,
                              status: parseInt(val),
                            }))
                          }
                        >
                          <SelectTrigger className="glass-dark border-border/30 mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="200">200 OK</SelectItem>
                            <SelectItem value="201">201 Created</SelectItem>
                            <SelectItem value="204">204 No Content</SelectItem>
                            <SelectItem value="400">400 Bad Request</SelectItem>
                            <SelectItem value="401">401 Unauthorized</SelectItem>
                            <SelectItem value="404">404 Not Found</SelectItem>
                            <SelectItem value="500">500 Server Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-foreground/60">Delay (ms)</Label>
                        <Input
                          type="number"
                          value={responseConfig.delay}
                          onChange={(e) =>
                            setResponseConfig((prev) => ({
                              ...prev,
                              delay: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="glass-dark border-border/30 mt-1"
                          min={0}
                          max={30000}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-foreground/60">Response Body</Label>
                      <Textarea
                        value={responseConfig.body}
                        onChange={(e) =>
                          setResponseConfig((prev) => ({
                            ...prev,
                            body: e.target.value,
                          }))
                        }
                        className="glass-dark border-border/30 mt-1 font-mono text-sm min-h-[100px]"
                        placeholder='{"success": true}'
                      />
                    </div>
                  </div>

                  {/* Forward Settings */}
                  <div className="space-y-4">
                    <h4 className="text-foreground font-medium flex items-center gap-2">
                      <Send className="h-4 w-4 text-secondary" />
                      Request Forwarding
                    </h4>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground text-sm">Enable Forwarding</p>
                        <p className="text-foreground/50 text-xs">
                          Auto-forward requests to another endpoint
                        </p>
                      </div>
                      <Switch
                        checked={forwardEnabled}
                        onCheckedChange={setForwardEnabled}
                      />
                    </div>

                    <div>
                      <Label className="text-foreground/60">Forward URL</Label>
                      <Input
                        value={forwardUrl}
                        onChange={(e) => setForwardUrl(e.target.value)}
                        className="glass-dark border-border/30 mt-1"
                        placeholder="https://api.example.com/webhooks"
                        disabled={!forwardEnabled}
                      />
                    </div>

                    <div className="glass-dark border-border/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground/80 text-sm font-medium">
                            Forwarding Mode
                          </p>
                          <p className="text-foreground/50 text-xs mt-1">
                            When enabled, all incoming requests will be forwarded to the
                            specified URL while still being logged here.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border/30 my-6" />

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="border-border/30 text-foreground/60"
                  >
                    Reset to Defaults
                  </Button>
                  <Button className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
                    <Check className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </motion.div>

        {/* Live Indicator */}
        {isLive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-8 right-8 glass border-primary/30 rounded-full px-4 py-2 flex items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <span className="text-primary text-sm font-mono">Listening</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
