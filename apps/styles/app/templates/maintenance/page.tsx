"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Code,
  Coffee,
  Database,
  FileText,
  Globe,
  HardDrive,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Server,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface MaintenancePhase {
  id: string
  title: string
  status: "completed" | "in-progress" | "pending" | "failed"
  startTime?: string
  endTime?: string
  duration?: number
  progress?: number
}

interface AffectedService {
  id: string
  name: string
  icon: React.ElementType
  status: "down" | "limited" | "operational"
  impact: string
}

interface Update {
  id: string
  timestamp: string
  message: string
  type: "info" | "warning" | "success" | "error"
}

// Mock data
const maintenanceInfo = {
  title: "Scheduled System Upgrade & Performance Optimization",
  type: "Planned Maintenance",
  startTime: "2025-11-22T22:00:00Z",
  endTime: "2025-11-23T02:00:00Z",
  estimatedDuration: 240, // minutes
  currentPhase: 2,
  overallProgress: 65,
}

const phases: MaintenancePhase[] = [
  {
    id: "phase1",
    title: "Database Backup & Replication",
    status: "completed",
    startTime: "2025-11-22T22:00:00Z",
    endTime: "2025-11-22T22:45:00Z",
    duration: 45,
    progress: 100,
  },
  {
    id: "phase2",
    title: "Backend Infrastructure Update",
    status: "completed",
    startTime: "2025-11-22T22:45:00Z",
    endTime: "2025-11-22T23:30:00Z",
    duration: 45,
    progress: 100,
  },
  {
    id: "phase3",
    title: "Database Schema Migration",
    status: "in-progress",
    startTime: "2025-11-22T23:30:00Z",
    duration: 60,
    progress: 65,
  },
  {
    id: "phase4",
    title: "API Service Deployment",
    status: "pending",
    duration: 45,
    progress: 0,
  },
  {
    id: "phase5",
    title: "Health Checks & Validation",
    status: "pending",
    duration: 30,
    progress: 0,
  },
  {
    id: "phase6",
    title: "Traffic Restoration & Monitoring",
    status: "pending",
    duration: 15,
    progress: 0,
  },
]

const affectedServices: AffectedService[] = [
  {
    id: "api",
    name: "API Service",
    icon: Server,
    status: "down",
    impact: "All API endpoints unavailable during maintenance",
  },
  {
    id: "web",
    name: "Web Application",
    icon: Globe,
    status: "limited",
    impact: "Read-only mode, no user actions available",
  },
  {
    id: "database",
    name: "Database Cluster",
    icon: Database,
    status: "down",
    impact: "Undergoing schema migration and optimization",
  },
  {
    id: "auth",
    name: "Authentication",
    icon: Shield,
    status: "limited",
    impact: "Login available, but sessions may be interrupted",
  },
  {
    id: "search",
    name: "Search Service",
    icon: TrendingUp,
    status: "operational",
    impact: "Available with cached data",
  },
  {
    id: "cdn",
    name: "CDN Network",
    icon: Globe,
    status: "operational",
    impact: "Static content delivery fully functional",
  },
]

const updates: Update[] = [
  {
    id: "u1",
    timestamp: "2025-11-22T23:35:00Z",
    message: "Database schema migration is 65% complete. Expected completion in 20 minutes.",
    type: "info",
  },
  {
    id: "u2",
    timestamp: "2025-11-22T23:15:00Z",
    message: "Backend infrastructure update completed successfully. All services responding normally.",
    type: "success",
  },
  {
    id: "u3",
    timestamp: "2025-11-22T22:30:00Z",
    message: "Database backup completed. 1.2TB of data replicated to backup servers.",
    type: "success",
  },
  {
    id: "u4",
    timestamp: "2025-11-22T22:00:00Z",
    message: "Maintenance window started. User traffic has been gracefully redirected.",
    type: "info",
  },
]

const improvements = [
  {
    category: "Performance",
    icon: Zap,
    items: [
      "Database query optimization - 40% faster response times",
      "Upgraded server hardware for improved throughput",
      "Enhanced caching layer for frequently accessed data",
      "Optimized API response payloads",
    ],
  },
  {
    category: "Security",
    icon: Shield,
    items: [
      "Latest security patches applied to all systems",
      "SSL/TLS certificate renewal and upgrade",
      "Enhanced authentication mechanisms",
      "Vulnerability scanning and remediation",
    ],
  },
  {
    category: "Features",
    icon: Code,
    items: [
      "New API endpoints for advanced filtering",
      "Improved error handling and logging",
      "Enhanced monitoring and alerting capabilities",
      "Database indexes for better query performance",
    ],
  },
  {
    category: "Infrastructure",
    icon: Server,
    items: [
      "Kubernetes cluster upgrade to v1.28",
      "Database engine upgrade (PostgreSQL 15 → 16)",
      "Redis cache cluster expansion",
      "Load balancer configuration optimization",
    ],
  },
]

const alternatives = [
  {
    title: "Status Page",
    description: "Check real-time updates on maintenance progress",
    icon: Activity,
    link: "/templates/status-page",
  },
  {
    title: "Documentation",
    description: "Browse our comprehensive API documentation",
    icon: FileText,
    link: "/templates/api-docs",
  },
  {
    title: "Contact Support",
    description: "Reach out to our team for assistance",
    icon: MessageSquare,
    link: "/templates/contact-hub",
  },
]

export default function MaintenancePage() {
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [email, setEmail] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Calculate time remaining
    const calculateTimeRemaining = () => {
      const end = new Date(maintenanceInfo.endTime)
      const now = new Date()
      const diff = Math.max(0, end.getTime() - now.getTime())
      setTimeRemaining(diff)
    }

    calculateTimeRemaining()
    const interval = setInterval(() => {
      calculateTimeRemaining()
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format time remaining
  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return { hours, minutes, seconds }
  }

  const { hours, minutes, seconds } = formatTimeRemaining(timeRemaining)

  // Get current phase
  const currentPhaseData = phases.find((p) => p.status === "in-progress")

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Settings className="w-20 h-20 text-primary mx-auto" />
          </motion.div>
          <h1 className="text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">We'll Be Right Back</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {maintenanceInfo.title}
          </p>
          <Badge variant="outline" className="text-sm bg-blue-500/20 text-blue-400 border-blue-500/50">
            {maintenanceInfo.type}
          </Badge>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass border-glow">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">Estimated Time Remaining</span>
                </div>
                <div className="flex items-center justify-center gap-6">
                  {[
                    { value: hours, label: "Hours" },
                    { value: minutes, label: "Minutes" },
                    { value: seconds, label: "Seconds" },
                  ].map((unit, index) => (
                    <React.Fragment key={unit.label}>
                      <motion.div
                        className="text-center"
                        animate={{ scale: unit.value !== 0 ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <div className="glass-dark rounded-lg p-6 min-w-[120px]">
                          <div className="text-6xl font-bold terminal-glow mb-2">
                            {unit.value.toString().padStart(2, "0")}
                          </div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wider">
                            {unit.label}
                          </div>
                        </div>
                      </motion.div>
                      {index < 2 && <div className="text-4xl font-bold text-muted-foreground">:</div>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="space-y-2">
                  <Progress value={maintenanceInfo.overallProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Overall Progress: {maintenanceInfo.overallProgress}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Maintenance Window */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass h-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Maintenance Window</h3>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Start Time</span>
                    <span className="font-semibold">
                      {new Date(maintenanceInfo.startTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Expected End</span>
                    <span className="font-semibold">
                      {new Date(maintenanceInfo.endTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">{maintenanceInfo.estimatedDuration} minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Phase</span>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                      {maintenanceInfo.currentPhase} of {phases.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass h-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Current Phase</h3>
                </div>
                <Separator />
                {currentPhaseData ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{currentPhaseData.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Started at {new Date(currentPhaseData.startTime || "").toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{currentPhaseData.progress}%</span>
                      </div>
                      <Progress value={currentPhaseData.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>In progress...</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No active phase</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress Phases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                Maintenance Phases
              </CardTitle>
              <CardDescription>Detailed breakdown of all maintenance steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-dark p-4 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          phase.status === "completed"
                            ? "bg-primary/20 text-primary"
                            : phase.status === "in-progress"
                              ? "bg-blue-500/20 text-blue-400"
                              : phase.status === "failed"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {phase.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : phase.status === "in-progress" ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : phase.status === "failed" ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{phase.title}</h4>
                        {phase.startTime && (
                          <p className="text-sm text-muted-foreground">
                            {phase.endTime
                              ? `${new Date(phase.startTime).toLocaleTimeString()} - ${new Date(phase.endTime).toLocaleTimeString()}`
                              : `Started at ${new Date(phase.startTime).toLocaleTimeString()}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {phase.duration && (
                        <Badge variant="outline" className="text-xs">
                          ~{phase.duration}m
                        </Badge>
                      )}
                      <Badge
                        variant={
                          phase.status === "completed"
                            ? "default"
                            : phase.status === "in-progress"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          phase.status === "completed"
                            ? "bg-primary/20 text-primary border-primary/50"
                            : phase.status === "in-progress"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                              : phase.status === "failed"
                                ? "bg-red-500/20 text-red-400 border-red-500/50"
                                : ""
                        }
                      >
                        {phase.status}
                      </Badge>
                    </div>
                  </div>
                  {phase.status === "in-progress" && phase.progress !== undefined && (
                    <div className="space-y-1">
                      <Progress value={phase.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">{phase.progress}%</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Affected Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Affected Services
              </CardTitle>
              <CardDescription>Service availability during maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {affectedServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="glass-dark p-4 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <service.icon className="w-5 h-5 text-muted-foreground" />
                        <h4 className="font-semibold">{service.name}</h4>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          service.status === "operational"
                            ? "bg-primary/20 text-primary border-primary/50"
                            : service.status === "limited"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                              : "bg-red-500/20 text-red-400 border-red-500/50"
                        }
                      >
                        {service.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{service.impact}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What's Being Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass border-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                What We're Improving
              </CardTitle>
              <CardDescription>Major changes and enhancements being deployed</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="performance" className="w-full">
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                  <TabsList className="grid w-max md:w-auto grid-cols-4">
                    <TabsTrigger value="performance" className="text-xs sm:text-sm whitespace-nowrap">Performance</TabsTrigger>
                    <TabsTrigger value="security" className="text-xs sm:text-sm whitespace-nowrap">Security</TabsTrigger>
                    <TabsTrigger value="features" className="text-xs sm:text-sm whitespace-nowrap">Features</TabsTrigger>
                    <TabsTrigger value="infrastructure" className="text-xs sm:text-sm whitespace-nowrap">Infrastructure</TabsTrigger>
                  </TabsList>
                </div>
                {improvements.map((category) => (
                  <TabsContent key={category.category.toLowerCase()} value={category.category.toLowerCase()} className="space-y-4 mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <category.icon className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-semibold">{category.category} Improvements</h3>
                    </div>
                    <ul className="space-y-3">
                      {category.items.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex gap-3 glass-dark p-3 rounded-lg"
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Live Updates
              </CardTitle>
              <CardDescription>Real-time status updates from our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {updates.map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      update.type === "success"
                        ? "bg-primary/20 text-primary"
                        : update.type === "error"
                          ? "bg-red-500/20 text-red-400"
                          : update.type === "warning"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {update.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : update.type === "error" ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <Activity className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 glass-dark p-4 rounded-lg">
                    <p className="text-sm mb-2">{update.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(update.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Alternative Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-primary" />
                While You Wait
              </CardTitle>
              <CardDescription>Resources and alternatives available during maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {alternatives.map((item, index) => (
                  <motion.a
                    key={item.title}
                    href={item.link}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="glass-dark p-6 rounded-lg space-y-3 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <item.icon className="w-8 h-8 text-primary" />
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscribe to Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="glass border-glow">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Bell className="w-10 h-10 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Get Notified When We're Back</h3>
                    <p className="text-muted-foreground">
                      We'll send you an email as soon as maintenance is complete
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
                    Notify Me
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
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center space-y-4 pb-8"
        >
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh Status
            </button>
            <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
              <MessageSquare className="w-4 h-4" />
              Contact Support
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
              <FileText className="w-4 h-4" />
              View Schedule
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Thank you for your patience. We appreciate your understanding!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
