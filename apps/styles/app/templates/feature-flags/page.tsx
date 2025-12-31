"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Eye,
  EyeOff,
  Filter,
  Flag,
  Hash,
  History,
  Key,
  Layers,
  MoreVertical,
  Percent,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Tag,
  Target,
  ToggleLeft,
  ToggleRight,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"

// TypeScript Interfaces
interface Variation {
  id: string
  name: string
  value: string | boolean | number
  description?: string
}

interface TargetingRule {
  id: string
  attribute: string
  operator: "equals" | "contains" | "in" | "greater" | "less" | "startsWith" | "endsWith"
  values: string[]
  variation: number
  priority: number
}

interface EnvironmentConfig {
  enabled: boolean
  defaultVariation: number
  rules: TargetingRule[]
  rolloutPercentage: number
}

interface FeatureFlag {
  id: string
  key: string
  name: string
  description: string
  type: "boolean" | "string" | "number" | "json"
  variations: Variation[]
  environments: Record<string, EnvironmentConfig>
  tags: string[]
  createdAt: string
  updatedAt: string
  evaluations24h: number
  archived: boolean
}

interface AuditEntry {
  id: string
  flagKey: string
  flagName: string
  action: "created" | "updated" | "toggled" | "deleted" | "rule_added" | "rule_removed"
  user: { name: string; avatar: string }
  environment?: string
  changes: { field: string; old: any; new: any }[]
  timestamp: string
}

interface SDKKey {
  id: string
  environment: string
  key: string
  type: "client" | "server"
  createdAt: string
}

interface EvaluationData {
  hour: string
  development: number
  staging: number
  production: number
}

// Mock Data
const mockFlags: FeatureFlag[] = [
  {
    id: "flag-1",
    key: "dark-mode-v2",
    name: "Dark Mode V2",
    description: "New dark mode with improved contrast and WCAG compliance",
    type: "boolean",
    variations: [
      { id: "v1", name: "Off", value: false },
      { id: "v2", name: "On", value: true },
    ],
    environments: {
      development: { enabled: true, defaultVariation: 1, rules: [], rolloutPercentage: 100 },
      staging: { enabled: true, defaultVariation: 1, rules: [], rolloutPercentage: 100 },
      production: { enabled: true, defaultVariation: 0, rules: [
        { id: "r1", attribute: "user.plan", operator: "equals", values: ["premium"], variation: 1, priority: 1 },
        { id: "r2", attribute: "user.betaTester", operator: "equals", values: ["true"], variation: 1, priority: 2 },
      ], rolloutPercentage: 25 },
    },
    tags: ["ui", "frontend", "experiment"],
    createdAt: "2024-10-15T10:30:00Z",
    updatedAt: "2024-12-20T14:22:00Z",
    evaluations24h: 145892,
    archived: false,
  },
  {
    id: "flag-2",
    key: "new-checkout-flow",
    name: "New Checkout Flow",
    description: "Streamlined checkout with fewer steps and better conversion",
    type: "boolean",
    variations: [
      { id: "v1", name: "Legacy", value: false },
      { id: "v2", name: "New Flow", value: true },
    ],
    environments: {
      development: { enabled: true, defaultVariation: 1, rules: [], rolloutPercentage: 100 },
      staging: { enabled: true, defaultVariation: 1, rules: [], rolloutPercentage: 100 },
      production: { enabled: true, defaultVariation: 0, rules: [], rolloutPercentage: 50 },
    },
    tags: ["checkout", "conversion", "a/b-test"],
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-12-18T11:45:00Z",
    evaluations24h: 89234,
    archived: false,
  },
  {
    id: "flag-3",
    key: "ai-recommendations",
    name: "AI Recommendations",
    description: "ML-powered product recommendations on homepage",
    type: "string",
    variations: [
      { id: "v1", name: "Off", value: "disabled" },
      { id: "v2", name: "Basic", value: "basic" },
      { id: "v3", name: "Advanced", value: "advanced" },
    ],
    environments: {
      development: { enabled: true, defaultVariation: 2, rules: [], rolloutPercentage: 100 },
      staging: { enabled: true, defaultVariation: 2, rules: [], rolloutPercentage: 100 },
      production: { enabled: false, defaultVariation: 0, rules: [], rolloutPercentage: 0 },
    },
    tags: ["ml", "recommendations", "homepage"],
    createdAt: "2024-11-20T14:15:00Z",
    updatedAt: "2024-12-15T09:30:00Z",
    evaluations24h: 0,
    archived: false,
  },
  {
    id: "flag-4",
    key: "rate-limit-tier",
    name: "Rate Limit Tier",
    description: "API rate limiting based on user tier",
    type: "number",
    variations: [
      { id: "v1", name: "Free", value: 100, description: "100 requests/hour" },
      { id: "v2", name: "Pro", value: 1000, description: "1000 requests/hour" },
      { id: "v3", name: "Enterprise", value: 10000, description: "10000 requests/hour" },
    ],
    environments: {
      development: { enabled: true, defaultVariation: 2, rules: [], rolloutPercentage: 100 },
      staging: { enabled: true, defaultVariation: 1, rules: [], rolloutPercentage: 100 },
      production: { enabled: true, defaultVariation: 0, rules: [
        { id: "r1", attribute: "user.tier", operator: "equals", values: ["pro"], variation: 1, priority: 1 },
        { id: "r2", attribute: "user.tier", operator: "equals", values: ["enterprise"], variation: 2, priority: 2 },
      ], rolloutPercentage: 100 },
    },
    tags: ["api", "rate-limiting", "tiers"],
    createdAt: "2024-09-01T08:00:00Z",
    updatedAt: "2024-12-10T16:00:00Z",
    evaluations24h: 523891,
    archived: false,
  },
  {
    id: "flag-5",
    key: "maintenance-mode",
    name: "Maintenance Mode",
    description: "Toggle maintenance page for scheduled downtime",
    type: "boolean",
    variations: [
      { id: "v1", name: "Off", value: false },
      { id: "v2", name: "On", value: true },
    ],
    environments: {
      development: { enabled: false, defaultVariation: 0, rules: [], rolloutPercentage: 0 },
      staging: { enabled: false, defaultVariation: 0, rules: [], rolloutPercentage: 0 },
      production: { enabled: false, defaultVariation: 0, rules: [], rolloutPercentage: 0 },
    },
    tags: ["operations", "maintenance"],
    createdAt: "2024-06-15T12:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
    evaluations24h: 12567,
    archived: false,
  },
  {
    id: "flag-6",
    key: "beta-features-bundle",
    name: "Beta Features Bundle",
    description: "Collection of upcoming features for beta testers",
    type: "json",
    variations: [
      { id: "v1", name: "None", value: "{}" },
      { id: "v2", name: "Basic Beta", value: JSON.stringify({ newDashboard: true, darkMode: true }) },
      { id: "v3", name: "Full Beta", value: JSON.stringify({ newDashboard: true, darkMode: true, aiChat: true, advancedAnalytics: true }) },
    ],
    environments: {
      development: { enabled: true, defaultVariation: 2, rules: [], rolloutPercentage: 100 },
      staging: { enabled: true, defaultVariation: 1, rules: [], rolloutPercentage: 100 },
      production: { enabled: true, defaultVariation: 0, rules: [
        { id: "r1", attribute: "user.email", operator: "endsWith", values: ["@company.com"], variation: 2, priority: 1 },
      ], rolloutPercentage: 0 },
    },
    tags: ["beta", "internal", "bundle"],
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-22T08:30:00Z",
    evaluations24h: 3421,
    archived: false,
  },
]

const mockAuditLogs: AuditEntry[] = [
  {
    id: "audit-1",
    flagKey: "dark-mode-v2",
    flagName: "Dark Mode V2",
    action: "toggled",
    user: { name: "Sarah Chen", avatar: "SC" },
    environment: "production",
    changes: [{ field: "rolloutPercentage", old: 20, new: 25 }],
    timestamp: "2024-12-27T10:30:00Z",
  },
  {
    id: "audit-2",
    flagKey: "new-checkout-flow",
    flagName: "New Checkout Flow",
    action: "updated",
    user: { name: "Mike Johnson", avatar: "MJ" },
    environment: "production",
    changes: [{ field: "rolloutPercentage", old: 40, new: 50 }],
    timestamp: "2024-12-27T09:15:00Z",
  },
  {
    id: "audit-3",
    flagKey: "beta-features-bundle",
    flagName: "Beta Features Bundle",
    action: "rule_added",
    user: { name: "Alex Kim", avatar: "AK" },
    environment: "production",
    changes: [{ field: "rules", old: null, new: "user.email endsWith @company.com" }],
    timestamp: "2024-12-26T16:45:00Z",
  },
  {
    id: "audit-4",
    flagKey: "rate-limit-tier",
    flagName: "Rate Limit Tier",
    action: "updated",
    user: { name: "Emma Davis", avatar: "ED" },
    environment: "staging",
    changes: [{ field: "defaultVariation", old: 0, new: 1 }],
    timestamp: "2024-12-26T14:20:00Z",
  },
  {
    id: "audit-5",
    flagKey: "ai-recommendations",
    flagName: "AI Recommendations",
    action: "toggled",
    user: { name: "James Wilson", avatar: "JW" },
    environment: "production",
    changes: [{ field: "enabled", old: true, new: false }],
    timestamp: "2024-12-26T11:00:00Z",
  },
  {
    id: "audit-6",
    flagKey: "dark-mode-v2",
    flagName: "Dark Mode V2",
    action: "rule_added",
    user: { name: "Sarah Chen", avatar: "SC" },
    environment: "production",
    changes: [{ field: "rules", old: null, new: "user.betaTester equals true" }],
    timestamp: "2024-12-25T15:30:00Z",
  },
]

const mockSDKKeys: SDKKey[] = [
  { id: "sdk-1", environment: "development", key: "sdk-dev-a1b2c3d4e5f6g7h8i9j0", type: "client", createdAt: "2024-01-15T10:00:00Z" },
  { id: "sdk-2", environment: "development", key: "sdk-dev-server-x9y8z7w6v5u4t3s2r1q0", type: "server", createdAt: "2024-01-15T10:00:00Z" },
  { id: "sdk-3", environment: "staging", key: "sdk-stg-m1n2o3p4q5r6s7t8u9v0", type: "client", createdAt: "2024-01-15T10:00:00Z" },
  { id: "sdk-4", environment: "staging", key: "sdk-stg-server-z0a9b8c7d6e5f4g3h2i1", type: "server", createdAt: "2024-01-15T10:00:00Z" },
  { id: "sdk-5", environment: "production", key: "sdk-prd-j9k8l7m6n5o4p3q2r1s0", type: "client", createdAt: "2024-01-15T10:00:00Z" },
  { id: "sdk-6", environment: "production", key: "sdk-prd-server-t0u9v8w7x6y5z4a3b2c1", type: "server", createdAt: "2024-01-15T10:00:00Z" },
]

const mockEvaluationData: EvaluationData[] = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  development: Math.floor(Math.random() * 5000 + 1000),
  staging: Math.floor(Math.random() * 8000 + 2000),
  production: Math.floor(Math.random() * 50000 + 20000),
}))

export default function FeatureFlagsDashboard() {
  const [flags, setFlags] = useState<FeatureFlag[]>(mockFlags)
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("all")
  const [showArchived, setShowArchived] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [confirmToggle, setConfirmToggle] = useState<{ flag: FeatureFlag; env: string } | null>(null)

  // New flag form state
  const [newFlag, setNewFlag] = useState({
    name: "",
    key: "",
    description: "",
    type: "boolean" as FeatureFlag["type"],
    tags: "",
  })

  // Get all unique tags
  const allTags = Array.from(new Set(flags.flatMap((f) => f.tags)))

  // Filter flags
  const filteredFlags = flags.filter((flag) => {
    const matchesSearch =
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some((t) => flag.tags.includes(t))
    const matchesArchived = showArchived || !flag.archived
    const matchesEnv =
      selectedEnvironment === "all" ||
      flag.environments[selectedEnvironment]?.enabled
    return matchesSearch && matchesTags && matchesArchived && matchesEnv
  })

  // Get environment status badge
  const getEnvBadge = (env: string, config: EnvironmentConfig) => {
    const colors: Record<string, string> = {
      development: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      staging: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      production: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    const envNames: Record<string, string> = {
      development: "Dev",
      staging: "Stg",
      production: "Prod",
    }
    return (
      <Badge
        className={`${colors[env]} text-xs ${!config.enabled && "opacity-50"}`}
      >
        {config.enabled ? (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {envNames[env]}
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
            {envNames[env]}
          </span>
        )}
      </Badge>
    )
  }

  // Get action badge for audit log
  const getActionBadge = (action: AuditEntry["action"]) => {
    const config: Record<string, { color: string; label: string }> = {
      created: { color: "bg-primary/20 text-primary border-primary/30", label: "Created" },
      updated: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Updated" },
      toggled: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Toggled" },
      deleted: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Deleted" },
      rule_added: { color: "bg-secondary/20 text-secondary border-secondary/30", label: "Rule Added" },
      rule_removed: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "Rule Removed" },
    }
    return <Badge className={`${config[action].color} text-xs`}>{config[action].label}</Badge>
  }

  // Toggle environment
  const toggleEnvironment = (flagId: string, env: string) => {
    setFlags((prev) =>
      prev.map((f) =>
        f.id === flagId
          ? {
              ...f,
              environments: {
                ...f.environments,
                [env]: { ...f.environments[env], enabled: !f.environments[env].enabled },
              },
              updatedAt: new Date().toISOString(),
            }
          : f
      )
    )
    setConfirmToggle(null)
  }

  // Update rollout percentage
  const updateRollout = (flagId: string, env: string, percentage: number) => {
    setFlags((prev) =>
      prev.map((f) =>
        f.id === flagId
          ? {
              ...f,
              environments: {
                ...f.environments,
                [env]: { ...f.environments[env], rolloutPercentage: percentage },
              },
              updatedAt: new Date().toISOString(),
            }
          : f
      )
    )
  }

  // Copy SDK key
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Create new flag
  const createFlag = () => {
    const flag: FeatureFlag = {
      id: `flag-${Date.now()}`,
      key: newFlag.key,
      name: newFlag.name,
      description: newFlag.description,
      type: newFlag.type,
      variations:
        newFlag.type === "boolean"
          ? [
              { id: "v1", name: "Off", value: false },
              { id: "v2", name: "On", value: true },
            ]
          : [
              { id: "v1", name: "Default", value: newFlag.type === "number" ? 0 : "" },
            ],
      environments: {
        development: { enabled: true, defaultVariation: 0, rules: [], rolloutPercentage: 100 },
        staging: { enabled: false, defaultVariation: 0, rules: [], rolloutPercentage: 0 },
        production: { enabled: false, defaultVariation: 0, rules: [], rolloutPercentage: 0 },
      },
      tags: newFlag.tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evaluations24h: 0,
      archived: false,
    }
    setFlags((prev) => [flag, ...prev])
    setIsCreateModalOpen(false)
    setNewFlag({ name: "", key: "", description: "", type: "boolean", tags: "" })
  }

  // Aggregate stats
  const totalFlags = flags.filter((f) => !f.archived).length
  const activeInProd = flags.filter((f) => f.environments.production?.enabled && !f.archived).length
  const totalEvaluations = flags.reduce((sum, f) => sum + f.evaluations24h, 0)
  const avgRollout = Math.round(
    flags.filter((f) => f.environments.production?.enabled).reduce((sum, f) => sum + f.environments.production.rolloutPercentage, 0) /
      (activeInProd || 1)
  )

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
              Feature Flags
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage feature rollouts and targeting across environments
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
              {activeInProd} / {totalFlags} Active in Prod
            </Badge>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Create Flag</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-border sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Create New Feature Flag</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Create a new flag to control feature rollout
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Name</Label>
                    <Input
                      id="name"
                      placeholder="Dark Mode V2"
                      className="glass-dark border-border"
                      value={newFlag.name}
                      onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key" className="text-foreground">Key</Label>
                    <Input
                      id="key"
                      placeholder="dark-mode-v2"
                      className="glass-dark border-border font-mono"
                      value={newFlag.key}
                      onChange={(e) =>
                        setNewFlag({
                          ...newFlag,
                          key: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      This key will be used in your code to reference this flag
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this flag controls..."
                      className="glass-dark border-border"
                      value={newFlag.description}
                      onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-foreground">Type</Label>
                    <Select
                      value={newFlag.type}
                      onValueChange={(v) => setNewFlag({ ...newFlag, type: v as FeatureFlag["type"] })}
                    >
                      <SelectTrigger className="glass-dark border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-border">
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-foreground">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="frontend, experiment, ui"
                      className="glass-dark border-border"
                      value={newFlag.tags}
                      onChange={(e) => setNewFlag({ ...newFlag, tags: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated list of tags</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="border-border"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createFlag}
                    disabled={!newFlag.name || !newFlag.key}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Create Flag
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="glass border-primary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Total Flags</p>
              <Flag className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-3xl font-bold text-primary font-mono">{totalFlags}</p>
            <p className="text-muted-foreground text-xs mt-1">
              {flags.filter((f) => f.archived).length} archived
            </p>
          </Card>

          <Card className="glass border-secondary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Active in Prod</p>
              <Zap className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">{activeInProd}</p>
            <p className="text-muted-foreground text-xs mt-1">
              {Math.round((activeInProd / totalFlags) * 100)}% of total
            </p>
          </Card>

          <Card className="glass border-blue-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Evaluations (24h)</p>
              <Activity className="h-5 w-5 text-blue-400/50" />
            </div>
            <p className="text-3xl font-bold text-blue-400 font-mono">
              {(totalEvaluations / 1000000).toFixed(2)}M
            </p>
            <p className="text-muted-foreground text-xs mt-1">+12.3% from yesterday</p>
          </Card>

          <Card className="glass border-amber-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Avg Rollout</p>
              <Percent className="h-5 w-5 text-amber-400/50" />
            </div>
            <p className="text-3xl font-bold text-amber-400 font-mono">{avgRollout}%</p>
            <Progress value={avgRollout} className="h-1.5 mt-2" />
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="flags" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger value="flags" className="text-xs sm:text-sm whitespace-nowrap">
                  <Flag className="h-4 w-4 mr-2" />
                  Flags
                </TabsTrigger>
                <TabsTrigger value="audit" className="text-xs sm:text-sm whitespace-nowrap">
                  <History className="h-4 w-4 mr-2" />
                  Audit Log
                </TabsTrigger>
                <TabsTrigger value="sdk" className="text-xs sm:text-sm whitespace-nowrap">
                  <Key className="h-4 w-4 mr-2" />
                  SDK Keys
                </TabsTrigger>
                <TabsTrigger value="metrics" className="text-xs sm:text-sm whitespace-nowrap">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Metrics
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Flags Tab */}
            <TabsContent value="flags" className="space-y-6">
              {/* Search and Filters */}
              <Card className="glass border-border p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search flags by name, key, or description..."
                      className="pl-10 glass-dark border-border"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                      <SelectTrigger className="w-[140px] glass-dark border-border">
                        <SelectValue placeholder="Environment" />
                      </SelectTrigger>
                      <SelectContent className="glass border-border">
                        <SelectItem value="all">All Environments</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-border">
                          <Tag className="h-4 w-4 mr-2" />
                          Tags
                          {selectedTags.length > 0 && (
                            <Badge className="ml-2 bg-primary/20 text-primary">
                              {selectedTags.length}
                            </Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass border-border w-48">
                        {allTags.map((tag) => (
                          <DropdownMenuItem
                            key={tag}
                            onClick={() =>
                              setSelectedTags((prev) =>
                                prev.includes(tag)
                                  ? prev.filter((t) => t !== tag)
                                  : [...prev, tag]
                              )
                            }
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded border ${
                                  selectedTags.includes(tag)
                                    ? "bg-primary border-primary"
                                    : "border-border"
                                }`}
                              >
                                {selectedTags.includes(tag) && (
                                  <Check className="h-3 w-3 text-primary-foreground m-0.5" />
                                )}
                              </div>
                              {tag}
                            </div>
                          </DropdownMenuItem>
                        ))}
                        {selectedTags.length > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setSelectedTags([])}
                              className="text-muted-foreground cursor-pointer"
                            >
                              Clear all
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={showArchived}
                        onCheckedChange={setShowArchived}
                        id="show-archived"
                      />
                      <Label htmlFor="show-archived" className="text-sm text-muted-foreground">
                        Archived
                      </Label>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Flags Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFlags.map((flag, idx) => (
                  <motion.div
                    key={flag.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Card
                      className={`glass border-border p-5 cursor-pointer hover:border-primary/50 transition-colors ${
                        selectedFlag?.id === flag.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedFlag(flag)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-foreground font-semibold truncate">
                              {flag.name}
                            </h3>
                            {flag.archived && (
                              <Badge className="bg-muted text-muted-foreground text-xs">
                                Archived
                              </Badge>
                            )}
                          </div>
                          <code className="text-xs text-muted-foreground font-mono">
                            {flag.key}
                          </code>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="glass border-border" align="end">
                            <DropdownMenuItem onClick={() => setSelectedFlag(flag)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Key
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-400">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {flag.description}
                      </p>

                      {/* Environment Status */}
                      <div className="flex items-center gap-2 mb-4">
                        {Object.entries(flag.environments).map(([env, config]) =>
                          getEnvBadge(env, config)
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {flag.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-border text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {flag.tags.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-border text-muted-foreground"
                          >
                            +{flag.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <Separator className="bg-border/50 mb-4" />

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Activity className="h-3 w-3" />
                          <span>{(flag.evaluations24h / 1000).toFixed(1)}k evals</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                            {flag.type}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Flag Detail Panel */}
              <AnimatePresence>
                {selectedFlag && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="glass border-primary/30 p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-foreground">
                              {selectedFlag.name}
                            </h2>
                            <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                              {selectedFlag.type}
                            </Badge>
                          </div>
                          <code className="text-sm text-muted-foreground font-mono">
                            {selectedFlag.key}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFlag(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-muted-foreground mb-6">{selectedFlag.description}</p>

                      {/* Environment Controls */}
                      <div className="space-y-4 mb-6">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Layers className="h-4 w-4" />
                          Environment Configuration
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          {Object.entries(selectedFlag.environments).map(([env, config]) => {
                            const envColors: Record<string, string> = {
                              development: "border-blue-500/30",
                              staging: "border-amber-500/30",
                              production: "border-red-500/30",
                            }
                            const envLabels: Record<string, string> = {
                              development: "Development",
                              staging: "Staging",
                              production: "Production",
                            }
                            return (
                              <Card
                                key={env}
                                className={`glass-dark ${envColors[env]} p-4`}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <span className="font-medium text-foreground">
                                    {envLabels[env]}
                                  </span>
                                  <Switch
                                    checked={config.enabled}
                                    onCheckedChange={() => {
                                      if (env === "production" && !config.enabled) {
                                        setConfirmToggle({ flag: selectedFlag, env })
                                      } else {
                                        toggleEnvironment(selectedFlag.id, env)
                                      }
                                    }}
                                  />
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-xs text-muted-foreground">
                                      Rollout
                                    </Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Progress
                                        value={config.rolloutPercentage}
                                        className="h-2 flex-1"
                                      />
                                      <span className="text-sm font-mono text-foreground w-12 text-right">
                                        {config.rolloutPercentage}%
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">
                                      Default Variation
                                    </Label>
                                    <p className="text-sm text-foreground">
                                      {selectedFlag.variations[config.defaultVariation]?.name}
                                    </p>
                                  </div>
                                  {config.rules.length > 0 && (
                                    <div>
                                      <Label className="text-xs text-muted-foreground">
                                        Rules
                                      </Label>
                                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs mt-1">
                                        {config.rules.length} active
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            )
                          })}
                        </div>
                      </div>

                      {/* Variations */}
                      <div className="space-y-4 mb-6">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Variations
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {selectedFlag.variations.map((variation, idx) => (
                            <Card
                              key={variation.id}
                              className="glass-dark border-border p-4"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-foreground">
                                    {variation.name}
                                  </p>
                                  {variation.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {variation.description}
                                    </p>
                                  )}
                                </div>
                                <code className="text-sm bg-background/50 px-2 py-1 rounded font-mono text-secondary">
                                  {typeof variation.value === "boolean"
                                    ? variation.value.toString()
                                    : typeof variation.value === "object"
                                    ? JSON.stringify(variation.value)
                                    : variation.value}
                                </code>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Targeting Rules */}
                      {Object.values(selectedFlag.environments).some(
                        (e) => e.rules.length > 0
                      ) && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Targeting Rules (Production)
                          </h3>
                          <Accordion type="single" collapsible className="space-y-2">
                            {selectedFlag.environments.production?.rules.map(
                              (rule, idx) => (
                                <AccordionItem
                                  key={rule.id}
                                  value={rule.id}
                                  className="glass-dark border-border rounded-lg px-4"
                                >
                                  <AccordionTrigger className="hover:no-underline py-3">
                                    <div className="flex items-center gap-3">
                                      <Badge className="bg-primary/20 text-primary border-primary/30">
                                        Rule {idx + 1}
                                      </Badge>
                                      <code className="text-sm text-muted-foreground">
                                        {rule.attribute} {rule.operator}{" "}
                                        {rule.values.join(", ")}
                                      </code>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pb-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Attribute
                                        </Label>
                                        <p className="text-sm font-mono text-foreground">
                                          {rule.attribute}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Operator
                                        </Label>
                                        <p className="text-sm font-mono text-foreground">
                                          {rule.operator}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Values
                                        </Label>
                                        <p className="text-sm font-mono text-foreground">
                                          {rule.values.join(", ")}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">
                                          Serve
                                        </Label>
                                        <p className="text-sm text-foreground">
                                          {selectedFlag.variations[rule.variation]?.name}
                                        </p>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )
                            )}
                          </Accordion>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* Audit Log Tab */}
            <TabsContent value="audit" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Change History
                  </h3>
                  <Button variant="outline" size="sm" className="border-border">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {mockAuditLogs.map((entry, idx) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-dark border-border rounded-lg p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                              {entry.user.avatar}
                            </div>
                            <div>
                              <p className="text-foreground font-medium">
                                {entry.user.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(entry.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getActionBadge(entry.action)}
                            {entry.environment && (
                              <Badge
                                className={`text-xs ${
                                  entry.environment === "production"
                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                    : entry.environment === "staging"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                }`}
                              >
                                {entry.environment}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          <code className="text-sm font-mono text-secondary">
                            {entry.flagKey}
                          </code>
                          <span className="text-muted-foreground">-</span>
                          <span className="text-foreground">{entry.flagName}</span>
                        </div>

                        {entry.changes.length > 0 && (
                          <div className="mt-3 p-3 bg-background/30 rounded-lg">
                            {entry.changes.map((change, cIdx) => (
                              <div
                                key={cIdx}
                                className="flex items-center gap-2 text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {change.field}:
                                </span>
                                {change.old !== null && (
                                  <span className="text-red-400 line-through">
                                    {JSON.stringify(change.old)}
                                  </span>
                                )}
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                <span className="text-primary">
                                  {JSON.stringify(change.new)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>

            {/* SDK Keys Tab */}
            <TabsContent value="sdk" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {["development", "staging", "production"].map((env) => {
                  const envColors: Record<string, string> = {
                    development: "border-blue-500/30",
                    staging: "border-amber-500/30",
                    production: "border-red-500/30",
                  }
                  const envLabels: Record<string, string> = {
                    development: "Development",
                    staging: "Staging",
                    production: "Production",
                  }
                  const keys = mockSDKKeys.filter((k) => k.environment === env)

                  return (
                    <Card key={env} className={`glass ${envColors[env]} p-6`}>
                      <div className="flex items-center gap-2 mb-6">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            env === "production"
                              ? "bg-red-400"
                              : env === "staging"
                              ? "bg-amber-400"
                              : "bg-blue-400"
                          }`}
                        />
                        <h3 className="text-lg font-semibold text-foreground">
                          {envLabels[env]}
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {keys.map((sdkKey) => (
                          <div
                            key={sdkKey.id}
                            className="glass-dark border-border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge
                                className={`${
                                  sdkKey.type === "client"
                                    ? "bg-primary/20 text-primary border-primary/30"
                                    : "bg-secondary/20 text-secondary border-secondary/30"
                                } text-xs`}
                              >
                                {sdkKey.type === "client" ? "Client SDK" : "Server SDK"}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => copyKey(sdkKey.key)}
                              >
                                {copiedKey === sdkKey.key ? (
                                  <Check className="h-4 w-4 text-primary" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <code className="text-xs font-mono text-muted-foreground break-all">
                              {sdkKey.key}
                            </code>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-border"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Rotate Keys
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* SDK Integration Example */}
              <Card className="glass border-secondary/30 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Quick Start
                </h3>
                <div className="glass-dark border-border rounded-lg p-4">
                  <pre className="text-sm font-mono text-muted-foreground overflow-x-auto">
                    <code>{`import { FeatureFlags } from '@acme/feature-flags';

const client = new FeatureFlags({
  sdkKey: 'sdk-dev-a1b2c3d4e5f6g7h8i9j0',
});

// Check a flag
const showDarkMode = await client.variation('dark-mode-v2', user, false);

if (showDarkMode) {
  enableDarkMode();
}`}</code>
                  </pre>
                </div>
              </Card>
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Evaluations Over Time (24h)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockEvaluationData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border) / 0.3)"
                    />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))",
                      }}
                      labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="production"
                      stackId="1"
                      stroke="hsl(0 72% 51%)"
                      fill="hsl(0 72% 51% / 0.3)"
                      name="Production"
                    />
                    <Area
                      type="monotone"
                      dataKey="staging"
                      stackId="1"
                      stroke="hsl(38 92% 50%)"
                      fill="hsl(38 92% 50% / 0.3)"
                      name="Staging"
                    />
                    <Area
                      type="monotone"
                      dataKey="development"
                      stackId="1"
                      stroke="hsl(217 91% 60%)"
                      fill="hsl(217 91% 60% / 0.3)"
                      name="Development"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Top Flags */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Most Evaluated Flags
                  </h3>
                  <div className="space-y-4">
                    {[...flags]
                      .sort((a, b) => b.evaluations24h - a.evaluations24h)
                      .slice(0, 5)
                      .map((flag, idx) => (
                        <div
                          key={flag.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground text-sm font-mono w-6">
                              {idx + 1}.
                            </span>
                            <div>
                              <p className="text-foreground text-sm font-medium">
                                {flag.name}
                              </p>
                              <code className="text-xs text-muted-foreground">
                                {flag.key}
                              </code>
                            </div>
                          </div>
                          <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
                            {(flag.evaluations24h / 1000).toFixed(1)}k
                          </Badge>
                        </div>
                      ))}
                  </div>
                </Card>

                <Card className="glass border-amber-500/30 p-6">
                  <h3 className="text-lg font-semibold text-amber-400 mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Flags Needing Attention
                  </h3>
                  <div className="space-y-4">
                    {flags
                      .filter(
                        (f) =>
                          !f.environments.production?.enabled ||
                          (f.environments.production?.rolloutPercentage > 0 &&
                            f.environments.production?.rolloutPercentage < 100)
                      )
                      .slice(0, 5)
                      .map((flag) => (
                        <div
                          key={flag.id}
                          className="glass-dark border-border rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-foreground text-sm font-medium">
                              {flag.name}
                            </p>
                            {!flag.environments.production?.enabled ? (
                              <Badge className="bg-muted text-muted-foreground text-xs">
                                Not in prod
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                                {flag.environments.production?.rolloutPercentage}%
                                rollout
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {!flag.environments.production?.enabled
                              ? "Consider enabling in production or archiving"
                              : "Partial rollout - consider completing or reverting"}
                          </p>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Production Toggle Confirmation Dialog */}
        <Dialog
          open={!!confirmToggle}
          onOpenChange={() => setConfirmToggle(null)}
        >
          <DialogContent className="glass border-red-500/30 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Enable in Production?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                You are about to enable{" "}
                <strong className="text-foreground">
                  {confirmToggle?.flag.name}
                </strong>{" "}
                in production. This will affect live users.
              </DialogDescription>
            </DialogHeader>
            <div className="glass-dark border-border rounded-lg p-4 my-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-amber-400" />
                <span className="text-muted-foreground">
                  Current rollout:{" "}
                  <strong className="text-foreground">
                    {confirmToggle?.flag.environments.production?.rolloutPercentage}%
                  </strong>
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmToggle(null)}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (confirmToggle) {
                    toggleEnvironment(confirmToggle.flag.id, confirmToggle.env)
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Enable in Production
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Live Indicator */}
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
          <span className="text-primary text-sm font-mono">Live</span>
        </motion.div>
      </div>
    </div>
  )
}
