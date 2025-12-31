"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  Edit,
  Trash2,
  Copy,
  ZoomIn,
  ZoomOut,
  Target,
  Activity,
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Progress, Tabs, TabsContent, TabsList, TabsTrigger, Avatar, AvatarFallback, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ggprompts/ui"

// ===== TYPES =====

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  color: string
  capacity: number // hours per week
  allocated: number // hours allocated
}

interface Task {
  id: string
  name: string
  phase: string
  startDate: Date
  endDate: Date
  progress: number
  status: "completed" | "in-progress" | "pending" | "at-risk"
  priority: "high" | "medium" | "low"
  assignee: TeamMember
  dependencies?: string[]
  subtasks?: Task[]
  estimatedHours: number
}

interface Milestone {
  id: string
  name: string
  date: Date
  status: "completed" | "at-risk" | "upcoming"
  phase: string
  description: string
}

interface Activity {
  id: string
  user: TeamMember
  action: string
  task: string
  time: string
}

// ===== MOCK DATA =====

const teamMembers: TeamMember[] = [
  { id: "1", name: "Sarah Chen", role: "Product Designer", avatar: "SC", color: "bg-blue-500", capacity: 40, allocated: 38 },
  { id: "2", name: "Marcus Rodriguez", role: "Frontend Developer", avatar: "MR", color: "bg-purple-500", capacity: 40, allocated: 42 },
  { id: "3", name: "Emily Watson", role: "Backend Developer", avatar: "EW", color: "bg-green-500", capacity: 40, allocated: 35 },
  { id: "4", name: "David Kim", role: "UX Researcher", avatar: "DK", color: "bg-amber-500", capacity: 40, allocated: 28 },
  { id: "5", name: "Lisa Thompson", role: "QA Engineer", avatar: "LT", color: "bg-pink-500", capacity: 40, allocated: 32 },
  { id: "6", name: "Alex Novak", role: "DevOps Engineer", avatar: "AN", color: "bg-cyan-500", capacity: 40, allocated: 30 },
  { id: "7", name: "Rachel Green", role: "Project Manager", avatar: "RG", color: "bg-rose-500", capacity: 40, allocated: 36 },
  { id: "8", name: "Tom Anderson", role: "UI Developer", avatar: "TA", color: "bg-indigo-500", capacity: 40, allocated: 40 },
]

const mockTasks: Task[] = [
  // Discovery Phase (completed)
  {
    id: "t1",
    name: "User Research & Interviews",
    phase: "Discovery",
    startDate: new Date(2025, 10, 1),
    endDate: new Date(2025, 10, 8),
    progress: 100,
    status: "completed",
    priority: "high",
    assignee: teamMembers[3],
    estimatedHours: 40,
  },
  {
    id: "t2",
    name: "Competitive Analysis",
    phase: "Discovery",
    startDate: new Date(2025, 10, 5),
    endDate: new Date(2025, 10, 12),
    progress: 100,
    status: "completed",
    priority: "medium",
    assignee: teamMembers[0],
    dependencies: ["t1"],
    estimatedHours: 32,
  },
  {
    id: "t3",
    name: "Requirements Documentation",
    phase: "Discovery",
    startDate: new Date(2025, 10, 10),
    endDate: new Date(2025, 10, 15),
    progress: 100,
    status: "completed",
    priority: "high",
    assignee: teamMembers[6],
    dependencies: ["t1", "t2"],
    estimatedHours: 24,
  },

  // Design Phase (in progress)
  {
    id: "t4",
    name: "Information Architecture",
    phase: "Design",
    startDate: new Date(2025, 10, 13),
    endDate: new Date(2025, 10, 20),
    progress: 100,
    status: "completed",
    priority: "high",
    assignee: teamMembers[0],
    dependencies: ["t3"],
    estimatedHours: 40,
  },
  {
    id: "t5",
    name: "Wireframes & Mockups",
    phase: "Design",
    startDate: new Date(2025, 10, 18),
    endDate: new Date(2025, 10, 27),
    progress: 85,
    status: "in-progress",
    priority: "high",
    assignee: teamMembers[0],
    dependencies: ["t4"],
    estimatedHours: 60,
    subtasks: [
      {
        id: "t5a",
        name: "Home page wireframe",
        phase: "Design",
        startDate: new Date(2025, 10, 18),
        endDate: new Date(2025, 10, 20),
        progress: 100,
        status: "completed",
        priority: "high",
        assignee: teamMembers[0],
        estimatedHours: 12,
      },
      {
        id: "t5b",
        name: "Dashboard wireframe",
        phase: "Design",
        startDate: new Date(2025, 10, 21),
        endDate: new Date(2025, 10, 24),
        progress: 100,
        status: "completed",
        priority: "high",
        assignee: teamMembers[0],
        estimatedHours: 16,
      },
      {
        id: "t5c",
        name: "Settings page wireframe",
        phase: "Design",
        startDate: new Date(2025, 10, 25),
        endDate: new Date(2025, 10, 27),
        progress: 60,
        status: "in-progress",
        priority: "medium",
        assignee: teamMembers[0],
        estimatedHours: 12,
      },
    ],
  },
  {
    id: "t6",
    name: "Design System & Components",
    phase: "Design",
    startDate: new Date(2025, 10, 22),
    endDate: new Date(2025, 11, 2),
    progress: 70,
    status: "in-progress",
    priority: "high",
    assignee: teamMembers[7],
    dependencies: ["t5"],
    estimatedHours: 48,
  },
  {
    id: "t7",
    name: "Prototype & User Testing",
    phase: "Design",
    startDate: new Date(2025, 10, 28),
    endDate: new Date(2025, 11, 6),
    progress: 30,
    status: "in-progress",
    priority: "high",
    assignee: teamMembers[3],
    dependencies: ["t5"],
    estimatedHours: 40,
  },

  // Development Phase (starting)
  {
    id: "t8",
    name: "Database Schema Design",
    phase: "Development",
    startDate: new Date(2025, 11, 1),
    endDate: new Date(2025, 11, 8),
    progress: 50,
    status: "in-progress",
    priority: "high",
    assignee: teamMembers[2],
    dependencies: ["t3"],
    estimatedHours: 32,
  },
  {
    id: "t9",
    name: "API Development",
    phase: "Development",
    startDate: new Date(2025, 11, 5),
    endDate: new Date(2025, 11, 20),
    progress: 25,
    status: "in-progress",
    priority: "high",
    assignee: teamMembers[2],
    dependencies: ["t8"],
    estimatedHours: 80,
  },
  {
    id: "t10",
    name: "Frontend Component Library",
    phase: "Development",
    startDate: new Date(2025, 11, 8),
    endDate: new Date(2025, 11, 18),
    progress: 40,
    status: "in-progress",
    priority: "high",
    assignee: teamMembers[1],
    dependencies: ["t6"],
    estimatedHours: 60,
  },
  {
    id: "t11",
    name: "Authentication System",
    phase: "Development",
    startDate: new Date(2025, 11, 12),
    endDate: new Date(2025, 11, 22),
    progress: 15,
    status: "at-risk",
    priority: "high",
    assignee: teamMembers[2],
    dependencies: ["t9"],
    estimatedHours: 48,
  },
  {
    id: "t12",
    name: "Dashboard Implementation",
    phase: "Development",
    startDate: new Date(2025, 11, 15),
    endDate: new Date(2025, 11, 28),
    progress: 0,
    status: "pending",
    priority: "high",
    assignee: teamMembers[1],
    dependencies: ["t10"],
    estimatedHours: 72,
  },
  {
    id: "t13",
    name: "Settings & Profile Pages",
    phase: "Development",
    startDate: new Date(2025, 11, 20),
    endDate: new Date(2026, 0, 3),
    progress: 0,
    status: "pending",
    priority: "medium",
    assignee: teamMembers[7],
    dependencies: ["t10"],
    estimatedHours: 56,
  },
  {
    id: "t14",
    name: "Integration Testing",
    phase: "Development",
    startDate: new Date(2025, 11, 25),
    endDate: new Date(2026, 0, 8),
    progress: 0,
    status: "pending",
    priority: "high",
    assignee: teamMembers[4],
    dependencies: ["t9", "t12"],
    estimatedHours: 40,
  },
  {
    id: "t15",
    name: "Performance Optimization",
    phase: "Development",
    startDate: new Date(2026, 0, 2),
    endDate: new Date(2026, 0, 10),
    progress: 0,
    status: "pending",
    priority: "medium",
    assignee: teamMembers[5],
    dependencies: ["t12", "t13"],
    estimatedHours: 32,
  },

  // Launch Phase (upcoming)
  {
    id: "t16",
    name: "Security Audit",
    phase: "Launch",
    startDate: new Date(2026, 0, 6),
    endDate: new Date(2026, 0, 13),
    progress: 0,
    status: "pending",
    priority: "high",
    assignee: teamMembers[5],
    dependencies: ["t11"],
    estimatedHours: 40,
  },
  {
    id: "t17",
    name: "User Acceptance Testing",
    phase: "Launch",
    startDate: new Date(2026, 0, 10),
    endDate: new Date(2026, 0, 17),
    progress: 0,
    status: "pending",
    priority: "high",
    assignee: teamMembers[4],
    dependencies: ["t14"],
    estimatedHours: 48,
  },
  {
    id: "t18",
    name: "Documentation & Training",
    phase: "Launch",
    startDate: new Date(2026, 0, 12),
    endDate: new Date(2026, 0, 20),
    progress: 0,
    status: "pending",
    priority: "medium",
    assignee: teamMembers[6],
    dependencies: ["t12", "t13"],
    estimatedHours: 40,
  },
  {
    id: "t19",
    name: "Deployment Setup",
    phase: "Launch",
    startDate: new Date(2026, 0, 15),
    endDate: new Date(2026, 0, 22),
    progress: 0,
    status: "pending",
    priority: "high",
    assignee: teamMembers[5],
    dependencies: ["t16"],
    estimatedHours: 32,
  },
  {
    id: "t20",
    name: "Beta Release",
    phase: "Launch",
    startDate: new Date(2026, 0, 20),
    endDate: new Date(2026, 0, 24),
    progress: 0,
    status: "pending",
    priority: "high",
    assignee: teamMembers[6],
    dependencies: ["t17", "t19"],
    estimatedHours: 24,
  },
  {
    id: "t21",
    name: "Production Launch",
    phase: "Launch",
    startDate: new Date(2026, 0, 27),
    endDate: new Date(2026, 0, 27),
    progress: 0,
    status: "pending",
    priority: "high",
    assignee: teamMembers[6],
    dependencies: ["t20"],
    estimatedHours: 8,
  },
]

const milestones: Milestone[] = [
  {
    id: "m1",
    name: "Discovery Complete",
    date: new Date(2025, 10, 15),
    status: "completed",
    phase: "Discovery",
    description: "All research and requirements documented",
  },
  {
    id: "m2",
    name: "Design Approval",
    date: new Date(2025, 11, 6),
    status: "at-risk",
    phase: "Design",
    description: "Final designs approved by stakeholders",
  },
  {
    id: "m3",
    name: "Alpha Release",
    date: new Date(2025, 11, 28),
    status: "upcoming",
    phase: "Development",
    description: "Internal alpha version ready for testing",
  },
  {
    id: "m4",
    name: "Feature Complete",
    date: new Date(2026, 0, 10),
    status: "upcoming",
    phase: "Development",
    description: "All core features implemented",
  },
  {
    id: "m5",
    name: "Beta Launch",
    date: new Date(2026, 0, 24),
    status: "upcoming",
    phase: "Launch",
    description: "Beta version live for select users",
  },
  {
    id: "m6",
    name: "Production Launch",
    date: new Date(2026, 0, 27),
    status: "upcoming",
    phase: "Launch",
    description: "Public launch of platform redesign",
  },
]

const recentActivities: Activity[] = [
  {
    id: "a1",
    user: teamMembers[1],
    action: "completed",
    task: "Frontend Component Library",
    time: "2 hours ago",
  },
  {
    id: "a2",
    user: teamMembers[0],
    action: "updated progress on",
    task: "Wireframes & Mockups",
    time: "4 hours ago",
  },
  {
    id: "a3",
    user: teamMembers[2],
    action: "started",
    task: "API Development",
    time: "5 hours ago",
  },
  {
    id: "a4",
    user: teamMembers[4],
    action: "commented on",
    task: "Integration Testing",
    time: "6 hours ago",
  },
  {
    id: "a5",
    user: teamMembers[6],
    action: "created",
    task: "Production Launch",
    time: "1 day ago",
  },
]

// ===== HELPER FUNCTIONS =====

const getStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "emerald"
    case "in-progress":
      return "blue"
    case "at-risk":
      return "amber"
    case "pending":
      return "slate"
    default:
      return "slate"
  }
}

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "red"
    case "medium":
      return "amber"
    case "low":
      return "slate"
    default:
      return "slate"
  }
}

const getMilestoneIcon = (status: Milestone["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-primary" />
    case "at-risk":
      return <AlertCircle className="h-5 w-5 text-amber-500" />
    case "upcoming":
      return <Circle className="h-5 w-5 text-slate-400" />
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const getDaysUntil = (date: Date) => {
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// ===== MAIN COMPONENT =====

export default function ProjectDashboard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [selectedTimeRange, setSelectedTimeRange] = useState<"week" | "month" | "quarter">("month")
  const [ganttZoom, setGanttZoom] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Task; direction: "asc" | "desc" } | null>(null)

  // Calculate project stats
  const projectStats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === "completed").length
    const overallProgress = Math.round((completedTasks / totalTasks) * 100)
    const projectStatus = overallProgress > 75 ? "on-track" : overallProgress > 50 ? "at-risk" : "delayed"

    const endDate = new Date(2026, 0, 27)
    const daysRemaining = getDaysUntil(endDate)

    const totalBudget = 500000
    const usedBudget = 300000
    const budgetUsed = Math.round((usedBudget / totalBudget) * 100)

    return {
      totalTasks,
      completedTasks,
      overallProgress,
      projectStatus,
      teamMembers: teamMembers.length,
      daysRemaining,
      budgetUsed,
    }
  }, [tasks])

  // Toggle task expansion
  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  // Sort tasks
  const handleSort = (key: keyof Task) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedTasks = useMemo(() => {
    if (!sortConfig) return tasks

    const sorted = [...tasks].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === undefined || bValue === undefined) return 0
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [tasks, sortConfig])

  // Gantt chart calculations
  const ganttData = useMemo(() => {
    const allDates = tasks.flatMap((t) => [t.startDate, t.endDate])
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))

    // Add padding
    minDate.setDate(minDate.getDate() - 7)
    maxDate.setDate(maxDate.getDate() + 7)

    const daySpan = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))

    return { minDate, maxDate, daySpan }
  }, [tasks])

  const getTaskPosition = (task: Task) => {
    const { minDate, daySpan } = ganttData
    const taskStart = Math.floor((task.startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
    const taskDuration = Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24))

    const left = (taskStart / daySpan) * 100
    const width = (taskDuration / daySpan) * 100

    return { left: `${left}%`, width: `${width}%` }
  }

  const getTodayPosition = () => {
    const { minDate, daySpan } = ganttData
    const today = new Date()
    const daysFromStart = Math.floor((today.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
    return (daysFromStart / daySpan) * 100
  }

  // Get upcoming deadlines (next 7 days)
  const upcomingDeadlines = useMemo(() => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    return tasks
      .filter((t) => t.endDate >= today && t.endDate <= nextWeek && t.status !== "completed")
      .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
      .slice(0, 5)
  }, [tasks])

  // Get blockers/at-risk tasks
  const blockers = useMemo(() => {
    return tasks.filter((t) => t.status === "at-risk")
  }, [tasks])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-[1800px] space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-glow">
            <CardHeader>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                {/* Project Title & Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-3xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Platform Redesign</CardTitle>
                    <Badge
                      variant="outline"
                      className={`
                        ${projectStats.projectStatus === "on-track" ? "border-primary/50 bg-primary/10 text-primary" : ""}
                        ${projectStats.projectStatus === "at-risk" ? "border-amber-500/50 bg-amber-500/10 text-amber-500" : ""}
                        ${projectStats.projectStatus === "delayed" ? "border-red-500/50 bg-red-500/10 text-red-500" : ""}
                      `}
                    >
                      {projectStats.projectStatus === "on-track" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {projectStats.projectStatus === "at-risk" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {projectStats.projectStatus === "delayed" && <XCircle className="mr-1 h-3 w-3" />}
                      {projectStats.projectStatus === "on-track" ? "On Track" : projectStats.projectStatus === "at-risk" ? "At Risk" : "Delayed"}
                    </Badge>
                  </div>
                  <CardDescription>Complete platform redesign with new architecture and UX</CardDescription>
                </div>

                {/* Progress Ring */}
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24">
                    <svg className="h-24 w-24 -rotate-90 transform">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                        opacity="0.2"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - projectStats.overallProgress / 100)}`}
                        className="transition-all duration-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold terminal-glow">{projectStats.overallProgress}%</span>
                    </div>
                  </div>

                  {/* Timeline Selector */}
                  <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
                    <SelectTrigger className="w-[160px] glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <motion.div
                  className="glass-dark flex items-center gap-3 rounded-lg p-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-full bg-primary/10 p-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold terminal-glow">
                      {projectStats.completedTasks}/{projectStats.totalTasks}
                    </p>
                    <p className="text-sm text-muted-foreground">Tasks Complete</p>
                  </div>
                </motion.div>

                <motion.div
                  className="glass-dark flex items-center gap-3 rounded-lg p-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold terminal-glow">{projectStats.teamMembers}</p>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                  </div>
                </motion.div>

                <motion.div
                  className="glass-dark flex items-center gap-3 rounded-lg p-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-full bg-amber-500/10 p-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold terminal-glow">{projectStats.daysRemaining}</p>
                    <p className="text-sm text-muted-foreground">Days Remaining</p>
                  </div>
                </motion.div>

                <motion.div
                  className="glass-dark flex items-center gap-3 rounded-lg p-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-full bg-green-500/10 p-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold terminal-glow">{projectStats.budgetUsed}%</p>
                    <p className="text-sm text-muted-foreground">Budget Used</p>
                  </div>
                </motion.div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left Column - Gantt & Tasks */}
          <div className="space-y-6">
            {/* Gantt Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="glass border-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="terminal-glow">Timeline View</CardTitle>
                      <CardDescription>Gantt chart with task dependencies and milestones</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="glass h-8 w-8"
                        onClick={() => setGanttZoom(Math.max(0.5, ganttZoom - 0.25))}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="glass h-8 w-8"
                        onClick={() => setGanttZoom(Math.min(2, ganttZoom + 0.25))}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="glass">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]" style={{ transform: `scale(${ganttZoom})`, transformOrigin: "top left" }}>
                      {/* Timeline Header */}
                      <div className="mb-4 flex items-center border-b border-border pb-2">
                        <div className="w-48 text-sm font-medium">Task</div>
                        <div className="relative flex-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const date = new Date(ganttData.minDate)
                              date.setDate(date.getDate() + (ganttData.daySpan / 4) * i)
                              return (
                                <span key={i}>
                                  {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Gantt Bars */}
                      <div className="space-y-3">
                        {tasks.map((task, index) => {
                          const position = getTaskPosition(task)
                          const phaseColors = {
                            Discovery: "from-purple-500/60 to-purple-600/60",
                            Design: "from-blue-500/60 to-blue-600/60",
                            Development: "from-emerald-500/60 to-emerald-600/60",
                            Launch: "from-amber-500/60 to-amber-600/60",
                          }

                          return (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className="flex items-center"
                            >
                              <div className="w-48 truncate text-sm">{task.name}</div>
                              <div className="relative flex-1">
                                {/* Dependency Lines (simplified - only show for some tasks) */}
                                {task.dependencies?.map((depId) => {
                                  const depTask = tasks.find((t) => t.id === depId)
                                  if (!depTask) return null

                                  const depPos = getTaskPosition(depTask)
                                  const currentPos = getTaskPosition(task)

                                  return (
                                    <div
                                      key={depId}
                                      className="absolute h-px bg-primary/30"
                                      style={{
                                        left: `calc(${depPos.left} + ${depPos.width})`,
                                        width: `calc(${currentPos.left} - ${depPos.left} - ${depPos.width})`,
                                        top: "-12px",
                                      }}
                                    />
                                  )
                                })}

                                {/* Task Bar */}
                                <motion.div
                                  className={`group relative h-8 rounded-md bg-gradient-to-r ${
                                    phaseColors[task.phase as keyof typeof phaseColors]
                                  } backdrop-blur-sm border border-white/10 shadow-lg cursor-pointer`}
                                  style={{
                                    position: "absolute",
                                    left: position.left,
                                    width: position.width,
                                  }}
                                  whileHover={{ scale: 1.05, zIndex: 10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {/* Progress Fill */}
                                  <div
                                    className="h-full rounded-md bg-white/20"
                                    style={{ width: `${task.progress}%` }}
                                  />

                                  {/* Task Info Tooltip */}
                                  <div className="absolute bottom-full left-0 mb-2 hidden w-48 rounded-lg bg-background/95 p-3 shadow-xl backdrop-blur-sm group-hover:block z-50">
                                    <p className="text-sm font-medium">{task.name}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {formatDate(task.startDate)} - {formatDate(task.endDate)}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                      <Progress value={task.progress} className="h-1" />
                                      <span className="text-xs">{task.progress}%</span>
                                    </div>
                                    <p className="mt-2 text-xs">
                                      <span className="text-muted-foreground">Assignee:</span> {task.assignee.name}
                                    </p>
                                  </div>
                                </motion.div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>

                      {/* Today Marker */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-primary/50"
                        style={{ left: `calc(48px + ${getTodayPosition()}%)` }}
                      >
                        <div className="absolute -top-6 -left-8 rounded bg-primary px-2 py-1 text-xs font-medium">
                          Today
                        </div>
                      </div>

                      {/* Milestone Markers */}
                      {milestones.map((milestone) => {
                        const { minDate, daySpan } = ganttData
                        const daysFromStart = Math.floor(
                          (milestone.date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
                        )
                        const position = (daysFromStart / daySpan) * 100

                        return (
                          <div
                            key={milestone.id}
                            className="absolute top-0 bottom-0"
                            style={{ left: `calc(192px + ${position}%)` }}
                          >
                            <div className="relative">
                              <div
                                className={`h-4 w-4 rotate-45 ${
                                  milestone.status === "completed"
                                    ? "bg-primary"
                                    : milestone.status === "at-risk"
                                    ? "bg-amber-500"
                                    : "bg-slate-500"
                                } shadow-lg`}
                              />
                              <div className="absolute top-6 -left-16 w-32 text-center text-xs text-muted-foreground">
                                {milestone.name}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Task List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass border-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="terminal-glow">Task List</CardTitle>
                      <CardDescription>All tasks with progress and assignees</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="glass">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                      <Button size="sm" className="bg-primary/20 hover:bg-primary/30">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/50">
                          <TableHead className="w-12"></TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSort("name")}
                              className="h-8 px-2 hover:bg-primary/10"
                            >
                              Task
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead>Assignee</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedTasks.map((task) => (
                          <React.Fragment key={task.id}>
                            <TableRow className="hover:bg-muted/50 border-border/30">
                              <TableCell>
                                {task.subtasks && task.subtasks.length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => toggleTaskExpansion(task.id)}
                                  >
                                    {expandedTasks.has(task.id) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{task.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className={`h-7 w-7 ${task.assignee.color}`}>
                                    <AvatarFallback className="text-xs text-white">
                                      {task.assignee.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{task.assignee.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`border-${getStatusColor(task.status)}-500/50 bg-${getStatusColor(
                                    task.status
                                  )}-500/10 text-${getStatusColor(task.status)}-500`}
                                >
                                  {task.status === "in-progress" && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                  {task.status === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
                                  {task.status === "at-risk" && <AlertTriangle className="mr-1 h-3 w-3" />}
                                  {task.status.replace("-", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`border-${getPriorityColor(task.priority)}-500/50 bg-${getPriorityColor(
                                    task.priority
                                  )}-500/10 text-${getPriorityColor(task.priority)}-500`}
                                >
                                  {task.priority}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(task.endDate)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={task.progress} className="h-2 w-24" />
                                  <span className="text-sm text-muted-foreground">{task.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>

                            {/* Subtasks */}
                            <AnimatePresence>
                              {expandedTasks.has(task.id) &&
                                task.subtasks?.map((subtask) => (
                                  <motion.tr
                                    key={subtask.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="hover:bg-muted/50 border-border/30 bg-muted/20"
                                  >
                                    <TableCell></TableCell>
                                    <TableCell className="pl-8 font-medium text-sm">
                                      <span className="text-muted-foreground">↳</span> {subtask.name}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Avatar className={`h-6 w-6 ${subtask.assignee.color}`}>
                                          <AvatarFallback className="text-xs text-white">
                                            {subtask.assignee.avatar}
                                          </AvatarFallback>
                                        </Avatar>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs border-${getStatusColor(
                                          subtask.status
                                        )}-500/50 bg-${getStatusColor(subtask.status)}-500/10 text-${getStatusColor(
                                          subtask.status
                                        )}-500`}
                                      >
                                        {subtask.status.replace("-", " ")}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs border-${getPriorityColor(
                                          subtask.priority
                                        )}-500/50 bg-${getPriorityColor(
                                          subtask.priority
                                        )}-500/10 text-${getPriorityColor(subtask.priority)}-500`}
                                      >
                                        {subtask.priority}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {formatDate(subtask.endDate)}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Progress value={subtask.progress} className="h-2 w-20" />
                                        <span className="text-xs text-muted-foreground">{subtask.progress}%</span>
                                      </div>
                                    </TableCell>
                                    <TableCell></TableCell>
                                  </motion.tr>
                                ))}
                            </AnimatePresence>
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="glass border-glow">
                <CardHeader>
                  <CardTitle className="terminal-glow">Team Overview</CardTitle>
                  <CardDescription>Team members and their workload</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {teamMembers.map((member, index) => {
                      const utilization = Math.round((member.allocated / member.capacity) * 100)
                      const isOverloaded = utilization > 100
                      const tasksAssigned = tasks.filter((t) => t.assignee.id === member.id).length
                      const tasksCompleted = tasks.filter(
                        (t) => t.assignee.id === member.id && t.status === "completed"
                      ).length
                      const onTimeRate = tasksCompleted > 0 ? Math.round((tasksCompleted / tasksAssigned) * 100) : 0

                      return (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass-dark rounded-lg p-4 space-y-3"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className={`h-12 w-12 ${member.color}`}>
                              <AvatarFallback className="text-white font-medium">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{member.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Capacity</span>
                              <span className={isOverloaded ? "text-red-500 font-medium" : ""}>
                                {member.allocated}/{member.capacity}h
                              </span>
                            </div>
                            <Progress
                              value={utilization}
                              className={`h-2 ${isOverloaded ? "[&>div]:bg-red-500" : ""}`}
                            />
                          </div>

                          <div className="flex gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Tasks</p>
                              <p className="font-medium terminal-glow">{tasksAssigned}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Complete</p>
                              <p className="font-medium text-primary">{tasksCompleted}</p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Milestones Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="glass border-glow">
                <CardHeader>
                  <CardTitle className="terminal-glow">Milestones</CardTitle>
                  <CardDescription>Key project milestones and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-6">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

                    {milestones.map((milestone, index) => {
                      const daysUntil = getDaysUntil(milestone.date)
                      const isPast = daysUntil < 0

                      return (
                        <motion.div
                          key={milestone.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative flex gap-4"
                        >
                          {/* Icon */}
                          <div className="relative z-10 flex-shrink-0">{getMilestoneIcon(milestone.status)}</div>

                          {/* Content */}
                          <div className="glass-dark flex-1 rounded-lg p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{milestone.name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {milestone.phase}
                                  </Badge>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
                                <p className="mt-2 text-sm font-medium">
                                  {formatDate(milestone.date)}
                                  <span className="ml-2 text-muted-foreground">
                                    {isPast
                                      ? `(${Math.abs(daysUntil)} days ago)`
                                      : daysUntil === 0
                                      ? "(Today)"
                                      : `(in ${daysUntil} days)`}
                                  </span>
                                </p>
                              </div>
                              {milestone.status === "at-risk" && (
                                <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-500">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  At Risk
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass border-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg terminal-glow">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3"
                    >
                      <Avatar className={`h-8 w-8 ${activity.user.color}`}>
                        <AvatarFallback className="text-xs text-white">{activity.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.name}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>{" "}
                          <span className="font-medium">{activity.task}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Deadlines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="glass border-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg terminal-glow">
                    <Bell className="h-5 w-5" />
                    Upcoming Deadlines
                  </CardTitle>
                  <CardDescription>Next 7 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingDeadlines.length > 0 ? (
                    upcomingDeadlines.map((task, index) => {
                      const daysUntil = getDaysUntil(task.endDate)
                      const isUrgent = daysUntil <= 2

                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`glass-dark rounded-lg p-3 ${isUrgent ? "border-l-4 border-red-500" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{task.name}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <Avatar className={`h-5 w-5 ${task.assignee.color}`}>
                                  <AvatarFallback className="text-[10px] text-white">
                                    {task.assignee.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-xs font-medium ${isUrgent ? "text-red-500" : ""}`}>
                                {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                              </p>
                            </div>
                          </div>
                          <Progress value={task.progress} className="mt-2 h-1" />
                        </motion.div>
                      )
                    })
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">No upcoming deadlines</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Blockers / At Risk */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="glass border-glow border-amber-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg terminal-glow text-amber-500">
                    <AlertTriangle className="h-5 w-5" />
                    Blockers & Issues
                  </CardTitle>
                  <CardDescription>Tasks requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {blockers.length > 0 ? (
                    blockers.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-dark rounded-lg p-3 border-l-4 border-amber-500"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{task.name}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <Avatar className={`h-5 w-5 ${task.assignee.color}`}>
                                <AvatarFallback className="text-[10px] text-white">
                                  {task.assignee.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Due: {formatDate(task.endDate)}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-500 text-xs">
                            {task.priority}
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle className="mx-auto h-8 w-8 text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">No blockers!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="glass border-glow">
                <CardHeader>
                  <CardTitle className="text-lg terminal-glow">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-primary/20 hover:bg-primary/30">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                  <Button variant="outline" className="w-full justify-start glass">
                    <Target className="mr-2 h-4 w-4" />
                    Add Milestone
                  </Button>
                  <Button variant="outline" className="w-full justify-start glass">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
