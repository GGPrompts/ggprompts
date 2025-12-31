"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  CalendarClock,
  ChevronDown,
  Clock,
  DollarSign,
  Filter,
  GripVertical,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Target,
  TrendingUp,
  User,
  Users,
  Video,
  X,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  Activity,
} from "lucide-react"
import { Card, Button, Badge, Input, Avatar, AvatarFallback, AvatarImage, Progress, Separator, ScrollArea, Sheet, SheetContent, SheetHeader, SheetTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger } from "@ggprompts/ui"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
  PieChart,
  Pie,
} from "recharts"

// TypeScript Interfaces
interface User {
  id: string
  name: string
  avatar?: string
  role: string
}

interface Company {
  id: string
  name: string
  industry: string
  size: string
  website: string
}

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  title: string
  avatar?: string
}

interface Activity {
  id: string
  type: "call" | "email" | "meeting" | "note" | "task"
  subject: string
  description: string
  date: string
  user: User
}

interface Deal {
  id: string
  name: string
  company: Company
  contact: Contact
  value: number
  stage: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  probability: number
  expectedClose: string
  owner: User
  tags: string[]
  createdAt: string
  lastActivity: Activity
  activities: Activity[]
  lostReason?: string
  notes?: string
}

interface PipelineMetrics {
  totalDeals: number
  totalValue: number
  avgDealSize: number
  winRate: number
  avgCycleTime: number
  stageConversion: Record<string, number>
}

interface StageConfig {
  id: Deal["stage"]
  name: string
  color: string
}

// Stage configuration
const stages: StageConfig[] = [
  { id: "lead", name: "Lead", color: "hsl(var(--muted-foreground))" },
  { id: "qualified", name: "Qualified", color: "hsl(var(--primary))" },
  { id: "proposal", name: "Proposal", color: "hsl(var(--secondary))" },
  { id: "negotiation", name: "Negotiation", color: "hsl(199 89% 48%)" },
  { id: "won", name: "Closed Won", color: "hsl(142 76% 36%)" },
  { id: "lost", name: "Closed Lost", color: "hsl(0 84% 60%)" },
]

// Mock data
const mockUsers: User[] = [
  { id: "u1", name: "Sarah Chen", role: "Account Executive", avatar: "" },
  { id: "u2", name: "Mike Johnson", role: "Sales Rep", avatar: "" },
  { id: "u3", name: "Emily Davis", role: "SDR", avatar: "" },
  { id: "u4", name: "Alex Rivera", role: "Account Executive", avatar: "" },
]

const mockDeals: Deal[] = [
  {
    id: "d1",
    name: "Enterprise License Deal",
    company: {
      id: "c1",
      name: "TechCorp Inc",
      industry: "Technology",
      size: "500-1000",
      website: "techcorp.com",
    },
    contact: {
      id: "ct1",
      name: "John Smith",
      email: "john@techcorp.com",
      phone: "+1 555-0123",
      title: "VP of Engineering",
    },
    value: 125000,
    stage: "negotiation",
    probability: 75,
    expectedClose: "2025-01-15",
    owner: mockUsers[0],
    tags: ["Enterprise", "Hot"],
    createdAt: "2024-11-01",
    lastActivity: {
      id: "a1",
      type: "call",
      subject: "Contract discussion",
      description: "Discussed pricing terms and timeline",
      date: "2024-12-26",
      user: mockUsers[0],
    },
    activities: [
      {
        id: "a1",
        type: "call",
        subject: "Contract discussion",
        description: "Discussed pricing terms and timeline",
        date: "2024-12-26",
        user: mockUsers[0],
      },
      {
        id: "a2",
        type: "email",
        subject: "Proposal sent",
        description: "Sent final proposal with updated pricing",
        date: "2024-12-24",
        user: mockUsers[0],
      },
      {
        id: "a3",
        type: "meeting",
        subject: "Demo presentation",
        description: "Product demo with engineering team",
        date: "2024-12-20",
        user: mockUsers[0],
      },
    ],
    notes: "Strong interest in our enterprise features. Budget approved.",
  },
  {
    id: "d2",
    name: "Annual Subscription",
    company: {
      id: "c2",
      name: "DataFlow Systems",
      industry: "Data Analytics",
      size: "100-500",
      website: "dataflow.io",
    },
    contact: {
      id: "ct2",
      name: "Lisa Wang",
      email: "lisa@dataflow.io",
      phone: "+1 555-0124",
      title: "CTO",
    },
    value: 48000,
    stage: "proposal",
    probability: 50,
    expectedClose: "2025-01-30",
    owner: mockUsers[1],
    tags: ["Mid-Market"],
    createdAt: "2024-11-15",
    lastActivity: {
      id: "a4",
      type: "email",
      subject: "Proposal follow-up",
      description: "Following up on the proposal sent last week",
      date: "2024-12-25",
      user: mockUsers[1],
    },
    activities: [
      {
        id: "a4",
        type: "email",
        subject: "Proposal follow-up",
        description: "Following up on the proposal sent last week",
        date: "2024-12-25",
        user: mockUsers[1],
      },
      {
        id: "a5",
        type: "meeting",
        subject: "Requirements gathering",
        description: "Discussed integration requirements",
        date: "2024-12-18",
        user: mockUsers[1],
      },
    ],
  },
  {
    id: "d3",
    name: "Pilot Program",
    company: {
      id: "c3",
      name: "HealthTech Pro",
      industry: "Healthcare",
      size: "50-100",
      website: "healthtechpro.com",
    },
    contact: {
      id: "ct3",
      name: "Dr. Sarah Miller",
      email: "sarah@healthtechpro.com",
      phone: "+1 555-0125",
      title: "Director of IT",
    },
    value: 25000,
    stage: "qualified",
    probability: 30,
    expectedClose: "2025-02-15",
    owner: mockUsers[2],
    tags: ["Healthcare", "Pilot"],
    createdAt: "2024-12-01",
    lastActivity: {
      id: "a6",
      type: "call",
      subject: "Discovery call",
      description: "Initial discovery and needs assessment",
      date: "2024-12-23",
      user: mockUsers[2],
    },
    activities: [
      {
        id: "a6",
        type: "call",
        subject: "Discovery call",
        description: "Initial discovery and needs assessment",
        date: "2024-12-23",
        user: mockUsers[2],
      },
    ],
  },
  {
    id: "d4",
    name: "Platform Migration",
    company: {
      id: "c4",
      name: "FinanceHub",
      industry: "Finance",
      size: "1000+",
      website: "financehub.com",
    },
    contact: {
      id: "ct4",
      name: "Robert Chen",
      email: "robert@financehub.com",
      phone: "+1 555-0126",
      title: "Head of Infrastructure",
    },
    value: 250000,
    stage: "lead",
    probability: 10,
    expectedClose: "2025-03-30",
    owner: mockUsers[3],
    tags: ["Enterprise", "Strategic"],
    createdAt: "2024-12-15",
    lastActivity: {
      id: "a7",
      type: "email",
      subject: "Intro email",
      description: "Initial outreach email",
      date: "2024-12-22",
      user: mockUsers[3],
    },
    activities: [
      {
        id: "a7",
        type: "email",
        subject: "Intro email",
        description: "Initial outreach email",
        date: "2024-12-22",
        user: mockUsers[3],
      },
    ],
  },
  {
    id: "d5",
    name: "Team Expansion",
    company: {
      id: "c5",
      name: "CloudScale",
      industry: "Cloud Services",
      size: "100-500",
      website: "cloudscale.io",
    },
    contact: {
      id: "ct5",
      name: "Amanda Foster",
      email: "amanda@cloudscale.io",
      phone: "+1 555-0127",
      title: "VP Operations",
    },
    value: 72000,
    stage: "won",
    probability: 100,
    expectedClose: "2024-12-20",
    owner: mockUsers[0],
    tags: ["Upsell"],
    createdAt: "2024-10-15",
    lastActivity: {
      id: "a8",
      type: "meeting",
      subject: "Contract signed",
      description: "Deal closed, onboarding scheduled",
      date: "2024-12-20",
      user: mockUsers[0],
    },
    activities: [
      {
        id: "a8",
        type: "meeting",
        subject: "Contract signed",
        description: "Deal closed, onboarding scheduled",
        date: "2024-12-20",
        user: mockUsers[0],
      },
    ],
  },
  {
    id: "d6",
    name: "Startup Package",
    company: {
      id: "c6",
      name: "InnovateLabs",
      industry: "Technology",
      size: "10-50",
      website: "innovatelabs.co",
    },
    contact: {
      id: "ct6",
      name: "James Wilson",
      email: "james@innovatelabs.co",
      phone: "+1 555-0128",
      title: "Founder",
    },
    value: 15000,
    stage: "lost",
    probability: 0,
    expectedClose: "2024-12-15",
    owner: mockUsers[2],
    tags: ["Startup"],
    createdAt: "2024-11-01",
    lastActivity: {
      id: "a9",
      type: "note",
      subject: "Deal lost",
      description: "Went with competitor due to pricing",
      date: "2024-12-15",
      user: mockUsers[2],
    },
    activities: [
      {
        id: "a9",
        type: "note",
        subject: "Deal lost",
        description: "Went with competitor due to pricing",
        date: "2024-12-15",
        user: mockUsers[2],
      },
    ],
    lostReason: "Price",
  },
  {
    id: "d7",
    name: "Security Upgrade",
    company: {
      id: "c7",
      name: "SecureBank",
      industry: "Finance",
      size: "1000+",
      website: "securebank.com",
    },
    contact: {
      id: "ct7",
      name: "Michael Torres",
      email: "mtorres@securebank.com",
      phone: "+1 555-0129",
      title: "CISO",
    },
    value: 180000,
    stage: "proposal",
    probability: 60,
    expectedClose: "2025-02-28",
    owner: mockUsers[0],
    tags: ["Enterprise", "Security"],
    createdAt: "2024-11-20",
    lastActivity: {
      id: "a10",
      type: "meeting",
      subject: "Security review",
      description: "Technical security assessment meeting",
      date: "2024-12-24",
      user: mockUsers[0],
    },
    activities: [
      {
        id: "a10",
        type: "meeting",
        subject: "Security review",
        description: "Technical security assessment meeting",
        date: "2024-12-24",
        user: mockUsers[0],
      },
    ],
  },
  {
    id: "d8",
    name: "API Integration",
    company: {
      id: "c8",
      name: "RetailMax",
      industry: "Retail",
      size: "500-1000",
      website: "retailmax.com",
    },
    contact: {
      id: "ct8",
      name: "Jennifer Lee",
      email: "jlee@retailmax.com",
      phone: "+1 555-0130",
      title: "Tech Lead",
    },
    value: 55000,
    stage: "qualified",
    probability: 40,
    expectedClose: "2025-02-15",
    owner: mockUsers[1],
    tags: ["Integration"],
    createdAt: "2024-12-05",
    lastActivity: {
      id: "a11",
      type: "call",
      subject: "Technical discussion",
      description: "Reviewed API documentation",
      date: "2024-12-23",
      user: mockUsers[1],
    },
    activities: [
      {
        id: "a11",
        type: "call",
        subject: "Technical discussion",
        description: "Reviewed API documentation",
        date: "2024-12-23",
        user: mockUsers[1],
      },
    ],
  },
  {
    id: "d9",
    name: "Analytics Suite",
    company: {
      id: "c9",
      name: "MediaPro",
      industry: "Media",
      size: "100-500",
      website: "mediapro.net",
    },
    contact: {
      id: "ct9",
      name: "David Kim",
      email: "dkim@mediapro.net",
      phone: "+1 555-0131",
      title: "Head of Analytics",
    },
    value: 38000,
    stage: "lead",
    probability: 15,
    expectedClose: "2025-03-15",
    owner: mockUsers[3],
    tags: ["Analytics"],
    createdAt: "2024-12-18",
    lastActivity: {
      id: "a12",
      type: "email",
      subject: "Follow-up",
      description: "Sent product overview deck",
      date: "2024-12-26",
      user: mockUsers[3],
    },
    activities: [
      {
        id: "a12",
        type: "email",
        subject: "Follow-up",
        description: "Sent product overview deck",
        date: "2024-12-26",
        user: mockUsers[3],
      },
    ],
  },
  {
    id: "d10",
    name: "Global Rollout",
    company: {
      id: "c10",
      name: "LogiTech Global",
      industry: "Logistics",
      size: "1000+",
      website: "logitechglobal.com",
    },
    contact: {
      id: "ct10",
      name: "Patricia Anderson",
      email: "panderson@logitechglobal.com",
      phone: "+1 555-0132",
      title: "Global IT Director",
    },
    value: 320000,
    stage: "negotiation",
    probability: 80,
    expectedClose: "2025-01-31",
    owner: mockUsers[0],
    tags: ["Enterprise", "Global", "Hot"],
    createdAt: "2024-10-01",
    lastActivity: {
      id: "a13",
      type: "meeting",
      subject: "Final negotiations",
      description: "Discussing final terms with legal",
      date: "2024-12-27",
      user: mockUsers[0],
    },
    activities: [
      {
        id: "a13",
        type: "meeting",
        subject: "Final negotiations",
        description: "Discussing final terms with legal",
        date: "2024-12-27",
        user: mockUsers[0],
      },
    ],
  },
]

// Forecast data
const forecastData = [
  { month: "Jan", projected: 445000, closed: 0 },
  { month: "Feb", projected: 318000, closed: 0 },
  { month: "Mar", projected: 608000, closed: 0 },
]

// Funnel data
const funnelData = [
  { name: "Lead", value: 288000, fill: "hsl(var(--muted-foreground))" },
  { name: "Qualified", value: 80000, fill: "hsl(var(--primary))" },
  { name: "Proposal", value: 228000, fill: "hsl(var(--secondary))" },
  { name: "Negotiation", value: 445000, fill: "hsl(199 89% 48%)" },
]

// Lost reasons data
const lostReasonsData = [
  { name: "Price", value: 35 },
  { name: "Competition", value: 28 },
  { name: "Timing", value: 18 },
  { name: "No Budget", value: 12 },
  { name: "Other", value: 7 },
]

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(199 89% 48%)",
  "hsl(var(--accent))",
  "hsl(var(--muted-foreground))",
]

export default function DealPipeline() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOwner, setFilterOwner] = useState<string>("all")
  const [filterTag, setFilterTag] = useState<string>("all")
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null)

  // Calculate metrics
  const activeDeals = deals.filter(
    (d) => d.stage !== "won" && d.stage !== "lost"
  )
  const wonDeals = deals.filter((d) => d.stage === "won")
  const lostDeals = deals.filter((d) => d.stage === "lost")

  const metrics: PipelineMetrics = {
    totalDeals: activeDeals.length,
    totalValue: activeDeals.reduce((sum, d) => sum + d.value, 0),
    avgDealSize:
      activeDeals.length > 0
        ? activeDeals.reduce((sum, d) => sum + d.value, 0) / activeDeals.length
        : 0,
    winRate:
      wonDeals.length + lostDeals.length > 0
        ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100
        : 0,
    avgCycleTime: 45,
    stageConversion: {
      lead_qualified: 65,
      qualified_proposal: 55,
      proposal_negotiation: 70,
      negotiation_won: 60,
    },
  }

  // Filter deals
  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesOwner =
      filterOwner === "all" || deal.owner.id === filterOwner
    const matchesTag =
      filterTag === "all" || deal.tags.includes(filterTag)
    return matchesSearch && matchesOwner && matchesTag
  })

  // Get deals by stage
  const getDealsByStage = (stage: Deal["stage"]) =>
    filteredDeals.filter((d) => d.stage === stage)

  // Stage value totals
  const getStageValue = (stage: Deal["stage"]) =>
    getDealsByStage(stage).reduce((sum, d) => sum + d.value, 0)

  // Handle deal click
  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsSheetOpen(true)
  }

  // Handle drag start
  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId)
  }

  // Handle drop
  const handleDrop = (stage: Deal["stage"]) => {
    if (draggedDeal) {
      setDeals((prev) =>
        prev.map((d) =>
          d.id === draggedDeal
            ? {
                ...d,
                stage,
                probability:
                  stage === "won"
                    ? 100
                    : stage === "lost"
                    ? 0
                    : stage === "negotiation"
                    ? 75
                    : stage === "proposal"
                    ? 50
                    : stage === "qualified"
                    ? 30
                    : 10,
              }
            : d
        )
      )
      setDraggedDeal(null)
    }
  }

  // Get activity icon
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "meeting":
        return <Video className="h-4 w-4" />
      case "note":
        return <FileText className="h-4 w-4" />
      case "task":
        return <CheckCircle2 className="h-4 w-4" />
    }
  }

  // Format currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  // Check if deal is overdue
  const isOverdue = (expectedClose: string) => {
    return new Date(expectedClose) < new Date()
  }

  // All unique tags
  const allTags = Array.from(new Set(deals.flatMap((d) => d.tags)))

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
                Deal Pipeline
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Sales CRM Pipeline Management
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deal
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-secondary/30 text-secondary hover:bg-secondary/10"
              >
                <Activity className="h-4 w-4 mr-2" />
                Log Activity
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="glass border-primary/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-xs md:text-sm">Pipeline Value</p>
                <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-primary/50" />
              </div>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary font-mono">
                {formatCurrency(metrics.totalValue)}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                {metrics.totalDeals} active deals
              </p>
            </Card>

            <Card className="glass border-secondary/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-xs md:text-sm">Avg Deal Size</p>
                <Target className="h-4 w-4 md:h-5 md:w-5 text-secondary/50" />
              </div>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary font-mono">
                {formatCurrency(metrics.avgDealSize)}
              </p>
              <p className="text-muted-foreground text-xs mt-1">per deal</p>
            </Card>

            <Card className="glass border-green-500/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-xs md:text-sm">Win Rate</p>
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-500/50" />
              </div>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-500 font-mono">
                {metrics.winRate.toFixed(0)}%
              </p>
              <Progress value={metrics.winRate} className="h-1.5 mt-2" />
            </Card>

            <Card className="glass border-blue-500/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-xs md:text-sm">Avg Cycle</p>
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-400/50" />
              </div>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-400 font-mono">
                {metrics.avgCycleTime}
              </p>
              <p className="text-muted-foreground text-xs mt-1">days</p>
            </Card>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass border-primary/30 p-4">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background/50 border-border/50"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={filterOwner} onValueChange={setFilterOwner}>
                  <SelectTrigger className="w-full md:w-[150px] bg-background/50 border-border/50">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="w-full md:w-[140px] bg-background/50 border-border/50">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="pipeline" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger value="pipeline" className="text-xs sm:text-sm whitespace-nowrap">
                  Pipeline
                </TabsTrigger>
                <TabsTrigger value="forecast" className="text-xs sm:text-sm whitespace-nowrap">
                  Forecast
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm whitespace-nowrap">
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Pipeline Tab - Kanban Board */}
            <TabsContent value="pipeline" className="space-y-4">
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-4">
                <div className="flex gap-4 min-w-max">
                  {stages.map((stage) => (
                    <div
                      key={stage.id}
                      className="w-[280px] md:w-[300px] flex-shrink-0"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(stage.id)}
                    >
                      {/* Stage Header */}
                      <Card
                        className="glass p-3 mb-3"
                        style={{ borderColor: `${stage.color}40` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                            <span className="font-medium text-foreground text-sm">
                              {stage.name}
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-muted/50 text-muted-foreground text-xs"
                            >
                              {getDealsByStage(stage.id).length}
                            </Badge>
                          </div>
                          <span
                            className="font-mono text-xs"
                            style={{ color: stage.color }}
                          >
                            {formatCurrency(getStageValue(stage.id))}
                          </span>
                        </div>
                      </Card>

                      {/* Deal Cards */}
                      <ScrollArea className="h-[calc(100vh-420px)] pr-2">
                        <div className="space-y-3">
                          <AnimatePresence mode="popLayout">
                            {getDealsByStage(stage.id).map((deal) => (
                              <motion.div
                                key={deal.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                draggable
                                onDragStart={() => handleDragStart(deal.id)}
                                className={`cursor-grab active:cursor-grabbing ${
                                  draggedDeal === deal.id ? "opacity-50" : ""
                                }`}
                              >
                                <Card
                                  className={`glass-dark p-4 hover:border-primary/40 transition-colors cursor-pointer ${
                                    isOverdue(deal.expectedClose) &&
                                    stage.id !== "won" &&
                                    stage.id !== "lost"
                                      ? "border-red-500/40"
                                      : "border-border/30"
                                  }`}
                                  onClick={() => handleDealClick(deal)}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-foreground text-sm truncate">
                                        {deal.name}
                                      </p>
                                      <div className="flex items-center gap-1 mt-1">
                                        <Building2 className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground text-xs truncate">
                                          {deal.company.name}
                                        </span>
                                      </div>
                                    </div>
                                    <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                                  </div>

                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-lg font-bold text-primary font-mono">
                                      {formatCurrency(deal.value)}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs border-secondary/30 text-secondary"
                                    >
                                      {deal.probability}%
                                    </Badge>
                                  </div>

                                  <div className="flex items-center gap-2 mb-3">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                        {deal.contact.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-foreground truncate">
                                        {deal.contact.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {deal.contact.title}
                                      </p>
                                    </div>
                                  </div>

                                  <Separator className="my-3 bg-border/30" />

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <CalendarClock
                                        className={`h-3 w-3 ${
                                          isOverdue(deal.expectedClose) &&
                                          stage.id !== "won" &&
                                          stage.id !== "lost"
                                            ? "text-red-400"
                                            : "text-muted-foreground"
                                        }`}
                                      />
                                      <span
                                        className={`text-xs ${
                                          isOverdue(deal.expectedClose) &&
                                          stage.id !== "won" &&
                                          stage.id !== "lost"
                                            ? "text-red-400"
                                            : "text-muted-foreground"
                                        }`}
                                      >
                                        {new Date(
                                          deal.expectedClose
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex gap-1">
                                      {deal.tags.slice(0, 2).map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="secondary"
                                          className={`text-xs px-1.5 py-0 ${
                                            tag === "Hot"
                                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                                              : tag === "Enterprise"
                                              ? "bg-primary/20 text-primary border-primary/30"
                                              : "bg-muted/50 text-muted-foreground"
                                          }`}
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </Card>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </ScrollArea>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Forecast Tab */}
            <TabsContent value="forecast" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Revenue Forecast */}
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-primary mb-6">
                    Quarterly Revenue Forecast
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={forecastData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--primary) / 0.1)"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="hsl(var(--primary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="hsl(var(--primary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                      <Bar
                        dataKey="projected"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                        name="Projected"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Pipeline Funnel */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">
                    Pipeline Funnel
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <FunnelChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                      <Funnel dataKey="value" data={funnelData} isAnimationActive>
                        <LabelList
                          position="center"
                          fill="hsl(var(--foreground))"
                          stroke="none"
                          dataKey="name"
                          fontSize={12}
                        />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Stage Metrics */}
              <Card className="glass border-blue-500/30 p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-6">
                  Stage Conversion Rates
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(metrics.stageConversion).map(
                    ([key, value]) => {
                      const [from, to] = key.split("_")
                      return (
                        <div key={key} className="glass-dark border-border/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground capitalize">
                              {from}
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground capitalize">
                              {to}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-blue-400 font-mono">
                            {value}%
                          </p>
                          <Progress value={value} className="h-1.5 mt-2" />
                        </div>
                      )
                    }
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Won/Lost Analysis */}
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-primary mb-6">
                    Won vs Lost Deals
                  </h3>
                  <div className="flex items-center justify-center gap-8 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-muted-foreground text-sm">Won</span>
                      </div>
                      <p className="text-3xl font-bold text-green-500 font-mono">
                        {wonDeals.length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(
                          wonDeals.reduce((sum, d) => sum + d.value, 0)
                        )}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-16 bg-border/30" />
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <XCircle className="h-5 w-5 text-red-400" />
                        <span className="text-muted-foreground text-sm">Lost</span>
                      </div>
                      <p className="text-3xl font-bold text-red-400 font-mono">
                        {lostDeals.length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(
                          lostDeals.reduce((sum, d) => sum + d.value, 0)
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                      Overall Win Rate
                    </p>
                    <p className="text-4xl font-bold text-primary font-mono">
                      {metrics.winRate.toFixed(0)}%
                    </p>
                  </div>
                </Card>

                {/* Lost Reasons */}
                <Card className="glass border-red-500/30 p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-6">
                    Lost Deal Reasons
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={lostReasonsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {lostReasonsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Owner Performance */}
              <Card className="glass border-secondary/30 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-6">
                  Sales Rep Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockUsers.map((user) => {
                    const userDeals = deals.filter((d) => d.owner.id === user.id)
                    const userWon = userDeals.filter((d) => d.stage === "won")
                    const userActive = userDeals.filter(
                      (d) => d.stage !== "won" && d.stage !== "lost"
                    )
                    const userValue = userActive.reduce(
                      (sum, d) => sum + d.value,
                      0
                    )

                    return (
                      <div
                        key={user.id}
                        className="glass-dark border-border/30 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.role}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Pipeline
                            </p>
                            <p className="text-sm font-mono text-primary">
                              {formatCurrency(userValue)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Deals</p>
                            <p className="text-sm font-mono text-secondary">
                              {userActive.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Won</p>
                            <p className="text-sm font-mono text-green-500">
                              {userWon.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Value</p>
                            <p className="text-sm font-mono text-blue-400">
                              {formatCurrency(
                                userWon.reduce((sum, d) => sum + d.value, 0)
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Deal Detail Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-lg glass border-l border-primary/30 overflow-y-auto">
            {selectedDeal && (
              <>
                <SheetHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <SheetTitle className="text-xl text-foreground">
                        {selectedDeal.name}
                      </SheetTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedDeal.company.name}
                      </p>
                    </div>
                    <Badge
                      className={`${
                        selectedDeal.stage === "won"
                          ? "bg-green-500/20 text-green-500 border-green-500/30"
                          : selectedDeal.stage === "lost"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-primary/20 text-primary border-primary/30"
                      }`}
                    >
                      {stages.find((s) => s.id === selectedDeal.stage)?.name}
                    </Badge>
                  </div>
                </SheetHeader>

                <Tabs defaultValue="details" className="mt-4">
                  <TabsList className="glass border-primary/30 w-full">
                    <TabsTrigger value="details" className="flex-1 text-xs">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex-1 text-xs">
                      Activity
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="flex-1 text-xs">
                      Contact
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4 mt-4">
                    {/* Deal Value */}
                    <Card className="glass-dark border-primary/30 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Deal Value
                        </span>
                        <span className="text-2xl font-bold text-primary font-mono">
                          {formatCurrency(selectedDeal.value)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-muted-foreground text-sm">
                          Probability
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={selectedDeal.probability}
                            className="w-20 h-1.5"
                          />
                          <span className="text-sm font-mono text-secondary">
                            {selectedDeal.probability}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-muted-foreground text-sm">
                          Weighted Value
                        </span>
                        <span className="text-sm font-mono text-secondary">
                          {formatCurrency(
                            selectedDeal.value * (selectedDeal.probability / 100)
                          )}
                        </span>
                      </div>
                    </Card>

                    {/* Timeline */}
                    <Card className="glass-dark border-secondary/30 p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Timeline
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">
                            Created
                          </span>
                          <span className="text-xs text-foreground">
                            {new Date(selectedDeal.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">
                            Expected Close
                          </span>
                          <span
                            className={`text-xs ${
                              isOverdue(selectedDeal.expectedClose) &&
                              selectedDeal.stage !== "won" &&
                              selectedDeal.stage !== "lost"
                                ? "text-red-400"
                                : "text-foreground"
                            }`}
                          >
                            {new Date(
                              selectedDeal.expectedClose
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Card>

                    {/* Owner */}
                    <Card className="glass-dark border-blue-500/30 p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Owner
                      </h4>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-500/20 text-blue-400">
                            {selectedDeal.owner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {selectedDeal.owner.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedDeal.owner.role}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Tags */}
                    {selectedDeal.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedDeal.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-muted/50 text-muted-foreground"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedDeal.notes && (
                      <Card className="glass-dark border-border/30 p-4">
                        <h4 className="text-sm font-medium text-foreground mb-2">
                          Notes
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedDeal.notes}
                        </p>
                      </Card>
                    )}

                    {/* Lost Reason */}
                    {selectedDeal.lostReason && (
                      <Card className="glass-dark border-red-500/30 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <h4 className="text-sm font-medium text-red-400">
                            Lost Reason
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedDeal.lostReason}
                        </p>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="activity" className="mt-4">
                    <div className="space-y-4">
                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-secondary/30 text-secondary hover:bg-secondary/10"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Meet
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border/30 text-foreground hover:bg-muted/20"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Note
                        </Button>
                      </div>

                      {/* Activity Timeline */}
                      <Card className="glass-dark border-primary/30 p-4">
                        <h4 className="text-sm font-medium text-foreground mb-4">
                          Activity Timeline
                        </h4>
                        <div className="space-y-4">
                          {selectedDeal.activities.map((activity, idx) => (
                            <div key={activity.id} className="flex gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  activity.type === "call"
                                    ? "bg-primary/20 text-primary"
                                    : activity.type === "email"
                                    ? "bg-secondary/20 text-secondary"
                                    : activity.type === "meeting"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-muted/30 text-muted-foreground"
                                }`}
                              >
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {activity.subject}
                                  </p>
                                  <span className="text-xs text-muted-foreground flex-shrink-0">
                                    {new Date(activity.date).toLocaleDateString(
                                      "en-US",
                                      { month: "short", day: "numeric" }
                                    )}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {activity.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  by {activity.user.name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="mt-4">
                    <div className="space-y-4">
                      {/* Primary Contact */}
                      <Card className="glass-dark border-primary/30 p-4">
                        <h4 className="text-sm font-medium text-foreground mb-4">
                          Primary Contact
                        </h4>
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {selectedDeal.contact.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {selectedDeal.contact.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedDeal.contact.title}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {selectedDeal.contact.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {selectedDeal.contact.phone}
                            </span>
                          </div>
                        </div>
                      </Card>

                      {/* Company Info */}
                      <Card className="glass-dark border-secondary/30 p-4">
                        <h4 className="text-sm font-medium text-foreground mb-4">
                          Company
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {selectedDeal.company.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {selectedDeal.company.industry}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {selectedDeal.company.size} employees
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-secondary">
                              {selectedDeal.company.website}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 glass border-primary/30 rounded-full px-4 py-2 flex items-center gap-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <span className="text-primary text-sm font-mono">Pipeline</span>
        </motion.div>
      </div>
    </div>
  )
}
