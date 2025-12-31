"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code,
  Database,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Globe,
  Hammer,
  Hash,
  Layers,
  LineChart,
  MessageSquare,
  Network,
  Pause,
  Play,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Users,
  Wrench,
  XCircle,
  Zap,
  Languages,
  ScanSearch,
} from "lucide-react"
import { Card, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress, Separator, ScrollArea } from "@ggprompts/ui"
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

// TypeScript Interfaces
interface Agent {
  id: string
  name: string
  type: string
  status: "idle" | "busy" | "error" | "offline"
  tasksQueued: number
  tasksCompleted: number
  successRate: number
  avgDuration: number
  health: number
  color: string
  icon: any
}

interface Task {
  id: string
  type: string
  agentId: string
  agentName: string
  status: "pending" | "running" | "completed" | "failed"
  startTime: number
  duration?: number
  result?: string
  error?: string
}

interface ToolUsage {
  name: string
  category: string
  calls: number
  successRate: number
  avgDuration: number
  cost: number
}

interface AgentConnection {
  from: string
  to: string
  messages: number
  strength: number
}

interface ConversationContext {
  agentId: string
  conversationId: string
  totalMessages: number
  tokensUsed: number
  contextLimit: number
  memoryHits: number
}

interface CostBreakdown {
  agentId: string
  agentName: string
  totalCost: number
  apiCalls: number
  avgCostPerTask: number
}

interface ErrorLog {
  id: string
  timestamp: number
  agentId: string
  agentName: string
  error: string
  category: string
  severity: "low" | "medium" | "high"
}

export default function AIAgentDashboard() {
  // Agent Fleet
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "agent-research",
      name: "Research",
      type: "Information Gathering",
      status: "busy",
      tasksQueued: 3,
      tasksCompleted: 142,
      successRate: 0.956,
      avgDuration: 8.3,
      health: 95,
      color: "hsl(var(--primary))",
      icon: Search,
    },
    {
      id: "agent-code",
      name: "Code",
      type: "Software Development",
      status: "busy",
      tasksQueued: 2,
      tasksCompleted: 89,
      successRate: 0.923,
      avgDuration: 12.7,
      health: 92,
      color: "hsl(var(--secondary))",
      icon: Code,
    },
    {
      id: "agent-writer",
      name: "Writer",
      type: "Content Creation",
      status: "idle",
      tasksQueued: 0,
      tasksCompleted: 234,
      successRate: 0.981,
      avgDuration: 6.1,
      health: 98,
      color: "hsl(var(--accent))",
      icon: FileText,
    },
    {
      id: "agent-analyst",
      name: "Analyst",
      type: "Data Analysis",
      status: "busy",
      tasksQueued: 5,
      tasksCompleted: 178,
      successRate: 0.934,
      avgDuration: 15.2,
      health: 88,
      color: "hsl(199 89% 48%)",
      icon: BarChart3,
    },
    {
      id: "agent-qa",
      name: "QA",
      type: "Quality Assurance",
      status: "idle",
      tasksQueued: 1,
      tasksCompleted: 156,
      successRate: 0.972,
      avgDuration: 5.8,
      health: 96,
      color: "hsl(212 90% 52%)",
      icon: Shield,
    },
    {
      id: "agent-summarizer",
      name: "Summarizer",
      type: "Text Summarization",
      status: "busy",
      tasksQueued: 4,
      tasksCompleted: 298,
      successRate: 0.988,
      avgDuration: 4.2,
      health: 99,
      color: "hsl(225 73% 57%)",
      icon: Hash,
    },
    {
      id: "agent-translator",
      name: "Translator",
      type: "Language Translation",
      status: "idle",
      tasksQueued: 0,
      tasksCompleted: 112,
      successRate: 0.945,
      avgDuration: 7.5,
      health: 94,
      color: "hsl(238 70% 62%)",
      icon: Languages,
    },
    {
      id: "agent-moderator",
      name: "Moderator",
      type: "Content Moderation",
      status: "busy",
      tasksQueued: 8,
      tasksCompleted: 238,
      successRate: 0.967,
      avgDuration: 3.1,
      health: 97,
      color: "hsl(251 91% 67%)",
      icon: ScanSearch,
    },
  ])

  // Live Task Stream
  const [tasks, setTasks] = useState<Task[]>([])
  const [totalTasksToday, setTotalTasksToday] = useState(1247)

  // Tool Usage
  const [toolUsage] = useState<ToolUsage[]>([
    {
      name: "Web Search",
      category: "Information",
      calls: 1729,
      successRate: 0.965,
      avgDuration: 2.3,
      cost: 0.15,
    },
    {
      name: "Code Execution",
      category: "Development",
      calls: 1152,
      successRate: 0.891,
      avgDuration: 4.7,
      cost: 0.08,
    },
    {
      name: "Database Query",
      category: "Data",
      calls: 576,
      successRate: 0.978,
      avgDuration: 1.8,
      cost: 0.05,
    },
    {
      name: "File Read",
      category: "Storage",
      calls: 432,
      successRate: 0.995,
      avgDuration: 0.9,
      cost: 0.02,
    },
    {
      name: "API Call",
      category: "Integration",
      calls: 298,
      successRate: 0.923,
      avgDuration: 3.2,
      cost: 0.12,
    },
    {
      name: "Image Generation",
      category: "Creative",
      calls: 145,
      successRate: 0.887,
      avgDuration: 8.5,
      cost: 0.35,
    },
  ])

  // Agent Connections
  const [connections] = useState<AgentConnection[]>([
    { from: "agent-research", to: "agent-writer", messages: 45, strength: 0.8 },
    { from: "agent-research", to: "agent-analyst", messages: 38, strength: 0.7 },
    { from: "agent-code", to: "agent-qa", messages: 52, strength: 0.9 },
    { from: "agent-analyst", to: "agent-writer", messages: 28, strength: 0.6 },
    { from: "agent-writer", to: "agent-summarizer", messages: 67, strength: 1.0 },
    { from: "agent-qa", to: "agent-code", messages: 31, strength: 0.7 },
    {
      from: "agent-moderator",
      to: "agent-writer",
      messages: 19,
      strength: 0.5,
    },
    {
      from: "agent-translator",
      to: "agent-summarizer",
      messages: 23,
      strength: 0.6,
    },
  ])

  // Cost Tracking
  const [costData, setCostData] = useState<CostBreakdown[]>([
    {
      agentId: "agent-research",
      agentName: "Research",
      totalCost: 12.45,
      apiCalls: 142,
      avgCostPerTask: 0.088,
    },
    {
      agentId: "agent-code",
      agentName: "Code",
      totalCost: 8.92,
      apiCalls: 89,
      avgCostPerTask: 0.1,
    },
    {
      agentId: "agent-writer",
      agentName: "Writer",
      totalCost: 9.87,
      apiCalls: 234,
      avgCostPerTask: 0.042,
    },
    {
      agentId: "agent-analyst",
      agentName: "Analyst",
      totalCost: 11.23,
      apiCalls: 178,
      avgCostPerTask: 0.063,
    },
    {
      agentId: "agent-qa",
      agentName: "QA",
      totalCost: 3.76,
      apiCalls: 156,
      avgCostPerTask: 0.024,
    },
  ])

  const [totalCost, setTotalCost] = useState(47.23)

  // Error Logs
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([
    {
      id: "err-001",
      timestamp: Date.now() - 300000,
      agentId: "agent-code",
      agentName: "Code",
      error: "Timeout executing code in sandbox",
      category: "timeout",
      severity: "medium",
    },
    {
      id: "err-002",
      timestamp: Date.now() - 180000,
      agentId: "agent-research",
      agentName: "Research",
      error: "Rate limit exceeded on web search API",
      category: "rate_limit",
      severity: "low",
    },
  ])

  // Performance Metrics
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([])

  // Initialize performance history
  useEffect(() => {
    const history = []
    for (let i = 23; i >= 0; i--) {
      history.push({
        hour: `${23 - i}:00`,
        tasksCompleted: Math.floor(Math.random() * 50 + 30),
        avgDuration: Math.random() * 3 + 6,
        successRate: 0.9 + Math.random() * 0.08,
      })
    }
    setPerformanceHistory(history)
  }, [])

  // Real-time simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Update agent statuses randomly
      setAgents((prev) =>
        prev.map((agent) => {
          const rand = Math.random()
          let newStatus = agent.status

          if (agent.status === "busy" && rand < 0.1) {
            newStatus = "idle"
          } else if (agent.status === "idle" && rand < 0.2) {
            newStatus = "busy"
          }

          return {
            ...agent,
            status: newStatus,
            tasksQueued:
              newStatus === "busy"
                ? agent.tasksQueued
                : Math.max(0, agent.tasksQueued - 1),
            tasksCompleted:
              rand < 0.15 ? agent.tasksCompleted + 1 : agent.tasksCompleted,
          }
        })
      )

      // Add new tasks to stream
      if (Math.random() < 0.7) {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)]
        const taskTypes = [
          "Web Search",
          "Code Generation",
          "Text Analysis",
          "Data Query",
          "Content Creation",
          "Translation",
          "Summarization",
        ]

        const newTask: Task = {
          id: `task-${Date.now()}`,
          type: taskTypes[Math.floor(Math.random() * taskTypes.length)],
          agentId: randomAgent.id,
          agentName: randomAgent.name,
          status: "running",
          startTime: Date.now(),
        }

        setTasks((prev) => [newTask, ...prev.slice(0, 49)])
        setTotalTasksToday((prev) => prev + 1)

        // Complete task after random duration
        setTimeout(() => {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === newTask.id
                ? {
                    ...t,
                    status: Math.random() < 0.94 ? "completed" : "failed",
                    duration: Math.random() * 10 + 2,
                  }
                : t
            )
          )
        }, Math.random() * 5000 + 2000)
      }

      // Update costs
      setTotalCost((prev) => prev + Math.random() * 0.05)
    }, 3000)

    return () => clearInterval(interval)
  }, [agents])

  // Get status color
  const getStatusColor = (
    status: "idle" | "busy" | "error" | "offline"
  ): string => {
    switch (status) {
      case "idle":
        return "text-primary bg-primary/20 border-primary/30"
      case "busy":
        return "text-blue-400 bg-blue-500/20 border-blue-500/30"
      case "error":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      case "offline":
        return "text-slate-400 bg-slate-500/20 border-slate-500/30"
    }
  }

  // Get task status badge
  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-xs">
            Pending
          </Badge>
        )
      case "running":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
            Running
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
            Completed
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
            Failed
          </Badge>
        )
    }
  }

  // Tool usage by category
  const toolsByCategory = toolUsage.reduce((acc, tool) => {
    const existing = acc.find((item) => item.name === tool.category)
    if (existing) {
      existing.value += tool.calls
    } else {
      acc.push({ name: tool.category, value: tool.calls })
    }
    return acc
  }, [] as { name: string; value: number }[])

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(199 89% 48%)",
    "hsl(212 90% 52%)",
    "hsl(225 73% 57%)",
  ]

  // Total queue depth
  const totalQueued = agents.reduce((sum, agent) => sum + agent.tasksQueued, 0)

  // Agent utilization
  const busyAgents = agents.filter((a) => a.status === "busy").length
  const utilizationRate = (busyAgents / agents.length) * 100

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
              AI Agent Orchestration
            </h1>
            <p className="text-slate-400 mt-2">
              Multi-agent system monitoring and analytics
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
              {busyAgents} / {agents.length} Agents Active
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export Logs</span>
            </Button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {/* Tasks Completed Today */}
          <Card className="glass border-primary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Tasks Today</p>
              <CheckCircle2 className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-3xl font-bold text-primary font-mono">
              {totalTasksToday.toLocaleString()}
            </p>
            <p className="text-slate-500 text-xs mt-1">+127 from yesterday</p>
          </Card>

          {/* Queue Depth */}
          <Card className="glass border-secondary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Queue Depth</p>
              <Layers className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">
              {totalQueued}
            </p>
            <p className="text-slate-500 text-xs mt-1">tasks pending</p>
          </Card>

          {/* Utilization Rate */}
          <Card className="glass border-blue-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Utilization</p>
              <Activity className="h-5 w-5 text-blue-400/50" />
            </div>
            <p className="text-3xl font-bold text-blue-400 font-mono">
              {utilizationRate.toFixed(0)}%
            </p>
            <Progress value={utilizationRate} className="h-1.5 mt-2" />
          </Card>

          {/* Total Cost */}
          <Card className="glass border-amber-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm">Cost Today</p>
              <DollarSign className="h-5 w-5 text-amber-400/50" />
            </div>
            <p className="text-3xl font-bold text-amber-400 font-mono">
              ${totalCost.toFixed(2)}
            </p>
            <p className="text-slate-500 text-xs mt-1">$0.038/task avg</p>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="agents" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger value="agents" className="text-xs sm:text-sm whitespace-nowrap">Agent Fleet</TabsTrigger>
                <TabsTrigger value="tasks" className="text-xs sm:text-sm whitespace-nowrap">Live Tasks</TabsTrigger>
                <TabsTrigger value="tools" className="text-xs sm:text-sm whitespace-nowrap">Tool Usage</TabsTrigger>
                <TabsTrigger value="network" className="text-xs sm:text-sm whitespace-nowrap">Agent Network</TabsTrigger>
                <TabsTrigger value="performance" className="text-xs sm:text-sm whitespace-nowrap">Performance</TabsTrigger>
                <TabsTrigger value="costs" className="text-xs sm:text-sm whitespace-nowrap">Costs</TabsTrigger>
              </TabsList>
            </div>

            {/* Agent Fleet Tab */}
            <TabsContent value="agents" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {agents.map((agent, idx) => {
                  const Icon = agent.icon
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Card
                        className={`glass p-5 border-l-4`}
                        style={{ borderLeftColor: agent.color }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-primary mb-1">
                              {agent.name}
                            </h3>
                            <p className="text-slate-500 text-xs">{agent.type}</p>
                          </div>
                          <Icon className="h-6 w-6" style={{ color: agent.color }} />
                        </div>

                        <Badge className={`${getStatusColor(agent.status)} mb-4`}>
                          {agent.status.toUpperCase()}
                        </Badge>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-slate-400 text-xs">Health</span>
                              <span className="text-primary text-xs font-mono">
                                {agent.health}%
                              </span>
                            </div>
                            <Progress value={agent.health} className="h-1.5" />
                          </div>

                          <Separator className="bg-primary/20" />

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-slate-500 text-xs">Queued</p>
                              <p className="text-secondary font-mono text-sm">
                                {agent.tasksQueued}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs">Completed</p>
                              <p className="text-primary font-mono text-sm">
                                {agent.tasksCompleted}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-slate-500 text-xs">Success Rate</p>
                              <p className="text-accent font-mono text-sm">
                                {(agent.successRate * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs">Avg Time</p>
                              <p className="text-blue-400 font-mono text-sm">
                                {agent.avgDuration.toFixed(1)}s
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </TabsContent>

            {/* Live Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Live Task Stream
                  </h3>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {tasks.filter((t) => t.status === "running").length} Running
                  </Badge>
                </div>

                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {tasks.map((task, idx) => {
                        const agent = agents.find((a) => a.id === task.agentId)
                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="glass-dark border-primary/20 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {agent && <agent.icon className="h-5 w-5" style={{ color: agent.color }} />}
                                <div>
                                  <p className="text-slate-300 text-sm font-medium">
                                    {task.type}
                                  </p>
                                  <p className="text-slate-500 text-xs">
                                    Agent: {task.agentName}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getTaskStatusBadge(task.status)}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">
                                {new Date(task.startTime).toLocaleTimeString()}
                              </span>
                              {task.duration && (
                                <span className="text-secondary font-mono">
                                  {task.duration.toFixed(1)}s
                                </span>
                              )}
                              {task.status === "running" && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="w-2 h-2 bg-blue-400 rounded-full"
                                />
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>

            {/* Tool Usage Tab */}
            <TabsContent value="tools" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tool Usage Table */}
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-primary mb-6">
                    Tool Call Analytics
                  </h3>
                  <div className="space-y-4">
                    {toolUsage.map((tool, idx) => (
                      <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-dark border-primary/20 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-slate-300 font-medium text-sm">
                              {tool.name}
                            </p>
                            <p className="text-slate-500 text-xs">{tool.category}</p>
                          </div>
                          <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-mono">
                            {tool.calls}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-slate-500 text-xs">Success</p>
                            <p className="text-primary text-sm font-mono">
                              {(tool.successRate * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Avg Time</p>
                            <p className="text-secondary text-sm font-mono">
                              {tool.avgDuration.toFixed(1)}s
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Cost</p>
                            <p className="text-amber-400 text-sm font-mono">
                              ${tool.cost.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Tool Usage Pie Chart */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">
                    Usage by Category
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={toolsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {toolsByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
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
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="mt-6 space-y-2">
                    {toolsByCategory.map((category, idx) => (
                      <div
                        key={category.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="text-slate-400 text-sm">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-slate-300 font-mono text-sm">
                          {category.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Agent Network Tab */}
            <TabsContent value="network" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Agent Communication Network
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Message flows and handoffs between agents
                    </p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {connections.length} Connections
                  </Badge>
                </div>

                <div className="space-y-3">
                  {connections.map((conn, idx) => {
                    const fromAgent = agents.find((a) => a.id === conn.from)
                    const toAgent = agents.find((a) => a.id === conn.to)
                    if (!fromAgent || !toAgent) return null

                    return (
                      <motion.div
                        key={`${conn.from}-${conn.to}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-dark border-primary/20 rounded-lg p-5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <fromAgent.icon
                                className="h-5 w-5"
                                style={{ color: fromAgent.color }}
                              />
                              <span className="text-slate-300 font-medium text-sm">
                                {fromAgent.name}
                              </span>
                            </div>

                            <div className="flex-1 flex items-center gap-2">
                              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-secondary/50" />
                              <ChevronRight className="h-4 w-4 text-secondary" />
                              <div className="flex-1 h-px bg-gradient-to-r from-secondary/50 to-blue-500/50" />
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-slate-300 font-medium text-sm">
                                {toAgent.name}
                              </span>
                              <toAgent.icon
                                className="h-5 w-5"
                                style={{ color: toAgent.color }}
                              />
                            </div>
                          </div>

                          <div className="ml-6 text-right">
                            <p className="text-secondary font-mono text-sm">
                              {conn.messages} msgs
                            </p>
                            <Progress
                              value={conn.strength * 100}
                              className="h-1.5 w-24 mt-1"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-6">
                  24-Hour Performance Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--secondary) / 0.5)"
                      tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
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
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="tasksCompleted"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Tasks Completed"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgDuration"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      name="Avg Duration (s)"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </Card>

              {/* Error Logs */}
              <Card className="glass border-red-500/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-red-400">
                    Recent Errors & Anomalies
                  </h3>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {errorLogs.length} Errors
                  </Badge>
                </div>

                <div className="space-y-3">
                  {errorLogs.map((error, idx) => (
                    <motion.div
                      key={error.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass-dark border-red-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                          <p className="text-red-400 font-medium text-sm">
                            {error.agentName} Agent
                          </p>
                        </div>
                        <Badge
                          className={`${
                            error.severity === "high"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : error.severity === "medium"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          } text-xs`}
                        >
                          {error.severity}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{error.error}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(error.timestamp).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Costs Tab */}
            <TabsContent value="costs" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-6">
                  Cost Breakdown by Agent
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                      dataKey="agentName"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))",
                      }}
                      formatter={(value: any) => `$${value.toFixed(2)}`}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                    />
                    <Bar
                      dataKey="totalCost"
                      fill="hsl(251 91% 67%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Cost Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass border-amber-500/30 p-6">
                  <h3 className="text-lg font-semibold text-amber-400 mb-6">
                    Cost Efficiency
                  </h3>
                  <div className="space-y-4">
                    {costData.map((agent, idx) => (
                      <div key={agent.agentId}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">
                            {agent.agentName}
                          </span>
                          <span className="text-amber-400 font-mono text-sm">
                            ${agent.avgCostPerTask.toFixed(3)}/task
                          </span>
                        </div>
                        <Progress
                          value={(agent.avgCostPerTask / 0.1) * 100}
                          className="h-1.5"
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">
                    Optimization Recommendations
                  </h3>
                  <div className="space-y-3">
                    <div className="glass-dark border-primary/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-primary font-medium text-sm mb-1">
                            Reduce Code Agent Cost
                          </p>
                          <p className="text-slate-400 text-xs">
                            Switch to Claude-3-Haiku for simple code tasks (-40%
                            cost)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-dark border-secondary/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-secondary font-medium text-sm mb-1">
                            Cache Frequent Queries
                          </p>
                          <p className="text-slate-400 text-xs">
                            Enable caching for Research agent (-25% API calls)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-dark border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-blue-400 font-medium text-sm mb-1">
                            Batch Similar Tasks
                          </p>
                          <p className="text-slate-400 text-xs">
                            Combine Summarizer requests for better efficiency
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

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
