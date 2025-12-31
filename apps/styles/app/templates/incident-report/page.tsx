"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Search,
  Server,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  XCircle,
  Zap,
  Database,
  Globe,
  Shield,
  Mail,
  ChevronDown,
  ChevronRight,
  Calendar,
  Link as LinkIcon,
  Download,
  Eye,
  EyeOff,
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger, Avatar, Progress, Separator } from "@ggprompts/ui"

// Types
interface TimelineUpdate {
  id: string
  timestamp: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  author: string
  authorRole: string
  message: string
  visibility: "public" | "internal"
}

interface AffectedService {
  id: string
  name: string
  icon: React.ElementType
  impact: "critical" | "major" | "minor"
  status: "down" | "degraded" | "operational"
}

interface TeamMember {
  id: string
  name: string
  role: string
  contribution: string
}

interface RelatedIncident {
  id: string
  title: string
  date: string
  similarity: number
}

// Mock data
const incident = {
  id: "INC-2025-001",
  title: "Database Connection Pool Exhaustion Causing API Timeouts",
  severity: "critical" as const,
  status: "resolved" as const,
  startTime: "2025-11-22T14:30:00Z",
  detectedTime: "2025-11-22T14:32:00Z",
  resolvedTime: "2025-11-22T16:45:00Z",
  duration: 135, // minutes
  affectedUsers: 12543,
  requestsAffected: 45678,
  downtime: "2h 15m",
}

const affectedServices: AffectedService[] = [
  {
    id: "api",
    name: "API Service",
    icon: Server,
    impact: "critical",
    status: "down",
  },
  {
    id: "web",
    name: "Web Application",
    icon: Globe,
    impact: "major",
    status: "degraded",
  },
  {
    id: "database",
    name: "Database Cluster",
    icon: Database,
    impact: "critical",
    status: "down",
  },
  {
    id: "auth",
    name: "Authentication",
    icon: Shield,
    impact: "major",
    status: "degraded",
  },
  {
    id: "email",
    name: "Email Service",
    icon: Mail,
    impact: "minor",
    status: "operational",
  },
]

const timeline: TimelineUpdate[] = [
  {
    id: "1",
    timestamp: "2025-11-22T14:30:00Z",
    status: "investigating",
    author: "Sarah Chen",
    authorRole: "DevOps Engineer",
    message:
      "We are receiving reports of elevated error rates and timeouts across our API endpoints. Our monitoring systems show a spike in 503 errors starting at 14:30 UTC. The team is investigating the root cause.",
    visibility: "public",
  },
  {
    id: "2",
    timestamp: "2025-11-22T14:45:00Z",
    status: "investigating",
    author: "Marcus Johnson",
    authorRole: "Backend Lead",
    message:
      "Initial investigation shows database connection pool exhaustion. Current active connections: 500/500 (max limit). Query performance has degraded significantly with average response times exceeding 5 seconds.",
    visibility: "internal",
  },
  {
    id: "3",
    timestamp: "2025-11-22T15:00:00Z",
    status: "identified",
    author: "Sarah Chen",
    authorRole: "DevOps Engineer",
    message:
      "Root cause identified: A recent deployment introduced a database connection leak in the user authentication module. Connections are not being properly released back to the pool after authentication requests.",
    visibility: "public",
  },
  {
    id: "4",
    timestamp: "2025-11-22T15:15:00Z",
    status: "identified",
    author: "Emily Rodriguez",
    authorRole: "SRE Lead",
    message:
      "We have identified the problematic code in commit a1b2c3d. The connection pool is being exhausted due to missing .finally() blocks in async database operations. Preparing rollback and hotfix.",
    visibility: "internal",
  },
  {
    id: "5",
    timestamp: "2025-11-22T15:30:00Z",
    status: "monitoring",
    author: "Marcus Johnson",
    authorRole: "Backend Lead",
    message:
      "Hotfix deployed to production. We have rolled back the problematic deployment and applied a patch that ensures proper connection cleanup. Monitoring connection pool metrics closely.",
    visibility: "public",
  },
  {
    id: "6",
    timestamp: "2025-11-22T15:45:00Z",
    status: "monitoring",
    author: "Sarah Chen",
    authorRole: "DevOps Engineer",
    message:
      "Connection pool health improving. Active connections dropped from 500/500 to 180/500. API error rates decreased from 45% to 8%. Response times improving but still elevated.",
    visibility: "internal",
  },
  {
    id: "7",
    timestamp: "2025-11-22T16:15:00Z",
    status: "monitoring",
    author: "Emily Rodriguez",
    authorRole: "SRE Lead",
    message:
      "All metrics returning to normal levels. Error rate now below 1%, average response time at 145ms (baseline: 120ms). Connection pool stable at 150/500. Continuing to monitor for any anomalies.",
    visibility: "public",
  },
  {
    id: "8",
    timestamp: "2025-11-22T16:45:00Z",
    status: "resolved",
    author: "Marcus Johnson",
    authorRole: "Backend Lead",
    message:
      "Incident resolved. All services have returned to normal operation. Error rates and response times are within acceptable thresholds. We will publish a detailed postmortem within 48 hours.",
    visibility: "public",
  },
]

const rootCauseAnalysis = {
  summary:
    "A database connection leak was introduced in commit a1b2c3d during the user authentication refactoring. The code failed to properly release connections back to the pool in error scenarios, leading to pool exhaustion.",
  technicalDetails: [
    "Async database operations in the auth module lacked proper error handling",
    "Missing .finally() blocks meant connections were not released on exceptions",
    "Connection pool was configured with a maximum of 500 connections",
    "Under normal load, the leak manifested slowly over 2 hours",
    "Peak traffic at 14:30 UTC accelerated the pool exhaustion",
  ],
  contributing: [
    "Insufficient integration testing for error scenarios",
    "Code review missed the missing cleanup logic",
    "Connection pool monitoring alerts were not configured",
  ],
}

const resolutionSteps = [
  {
    step: 1,
    time: "14:32 UTC",
    action: "Incident detected via automated monitoring",
    completed: true,
  },
  {
    step: 2,
    time: "14:35 UTC",
    action: "On-call team paged and incident response initiated",
    completed: true,
  },
  {
    step: 3,
    time: "14:45 UTC",
    action: "Database metrics analyzed, connection pool exhaustion identified",
    completed: true,
  },
  {
    step: 4,
    time: "15:00 UTC",
    action: "Code review performed, identified problematic commit",
    completed: true,
  },
  {
    step: 5,
    time: "15:15 UTC",
    action: "Hotfix prepared with proper connection cleanup",
    completed: true,
  },
  {
    step: 6,
    time: "15:30 UTC",
    action: "Hotfix deployed to production, rollback executed",
    completed: true,
  },
  {
    step: 7,
    time: "15:45 UTC",
    action: "Metrics monitored, gradual improvement observed",
    completed: true,
  },
  {
    step: 8,
    time: "16:45 UTC",
    action: "All systems operational, incident declared resolved",
    completed: true,
  },
]

const preventionMeasures = [
  {
    category: "Code Quality",
    measures: [
      "Implement mandatory error handling checks in code review guidelines",
      "Add linting rules to detect missing cleanup logic in async operations",
      "Expand integration test suite to cover error scenarios",
    ],
  },
  {
    category: "Monitoring & Alerting",
    measures: [
      "Add alerts for database connection pool utilization (threshold: 80%)",
      "Implement connection leak detection monitoring",
      "Create dashboard for real-time connection pool metrics",
    ],
  },
  {
    category: "Deployment Process",
    measures: [
      "Add database connection pool health checks to deployment pipeline",
      "Implement gradual rollout for backend changes (10% → 50% → 100%)",
      "Require load testing for database-intensive changes",
    ],
  },
  {
    category: "Team & Process",
    measures: [
      "Conduct team training on proper resource management in async code",
      "Document best practices for database connection handling",
      "Schedule postmortem review meeting with engineering team",
    ],
  },
]

const teamInvolved: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "DevOps Engineer",
    contribution: "First responder, deployed hotfix, coordinated incident response",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Backend Lead",
    contribution: "Root cause analysis, code review, hotfix development",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "SRE Lead",
    contribution: "Incident commander, monitoring coordination, stakeholder communication",
  },
  {
    id: "4",
    name: "David Park",
    role: "Database Administrator",
    contribution: "Database metrics analysis, connection pool optimization",
  },
  {
    id: "5",
    name: "Lisa Wang",
    role: "QA Lead",
    contribution: "Post-incident testing, validation of hotfix",
  },
]

const relatedIncidents: RelatedIncident[] = [
  {
    id: "INC-2024-089",
    title: "Database connection timeout in payment processing",
    date: "2024-10-15",
    similarity: 75,
  },
  {
    id: "INC-2024-067",
    title: "API service degradation due to resource exhaustion",
    date: "2024-08-22",
    similarity: 60,
  },
  {
    id: "INC-2024-034",
    title: "Connection pool leak in background job processor",
    date: "2024-05-10",
    similarity: 85,
  },
]

// Generate impact data
const generateImpactData = () => {
  const data = []
  const startHour = 14.5 // 14:30
  const endHour = 16.75 // 16:45
  for (let i = 0; i <= 27; i++) {
    // 5-minute intervals
    const hour = startHour + i / 12
    const mins = Math.floor((hour - Math.floor(hour)) * 60)
    const errorRate = i < 6 ? i * 8 : i < 12 ? 45 : i < 18 ? 45 - (i - 12) * 6 : Math.max(0, 10 - (i - 18) * 1.5)
    const responseTime = i < 6 ? 500 + i * 500 : i < 12 ? 3500 : i < 18 ? 3500 - (i - 12) * 400 : 200
    data.push({
      time: `${Math.floor(hour)}:${mins.toString().padStart(2, "0")}`,
      errorRate,
      responseTime,
    })
  }
  return data
}

const impactData = generateImpactData()

export default function IncidentReport() {
  const [showInternal, setShowInternal] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>("timeline")

  const visibleTimeline = showInternal ? timeline : timeline.filter((t) => t.visibility === "public")

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-sm">
                  {incident.id}
                </Badge>
                <Badge
                  variant="destructive"
                  className="bg-red-500/20 text-red-400 border-red-500/50"
                >
                  {incident.severity}
                </Badge>
                <Badge
                  variant="default"
                  className="bg-primary/20 text-primary border-primary/50"
                >
                  {incident.status}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{incident.title}</h1>
              <p className="text-muted-foreground text-lg">
                Occurred on {new Date(incident.startTime).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })} • Duration: {incident.downtime}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <LinkIcon className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Time to Detect",
              value: "2 minutes",
              icon: Search,
              color: "text-secondary",
            },
            {
              label: "Time to Resolve",
              value: incident.downtime,
              icon: Clock,
              color: "text-amber-400",
            },
            {
              label: "Users Affected",
              value: incident.affectedUsers.toLocaleString(),
              icon: Users,
              color: "text-red-400",
            },
            {
              label: "Requests Impacted",
              value: incident.requestsAffected.toLocaleString(),
              icon: Activity,
              color: "text-purple-400",
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
            >
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Impact Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass border-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                Impact Assessment
              </CardTitle>
              <CardDescription>Error rate and response time during the incident window</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: "Error Rate (%)", angle: -90, position: "insideLeft" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: "Response Time (ms)", angle: 90, position: "insideRight" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="errorRate"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={false}
                    name="Error Rate (%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="responseTime"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={false}
                    name="Response Time (ms)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Affected Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Affected Services
              </CardTitle>
              <CardDescription>Services impacted by this incident</CardDescription>
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
                      {service.status === "down" ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : service.status === "degraded" ? (
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={
                          service.impact === "critical"
                            ? "bg-red-500/20 text-red-400 border-red-500/50"
                            : service.impact === "major"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/50"
                        }
                      >
                        {service.impact} impact
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass border-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Incident Timeline
                  </CardTitle>
                  <CardDescription>Chronological updates and actions taken</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInternal(!showInternal)}
                  className="gap-2"
                >
                  {showInternal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showInternal ? "Hide Internal" : "Show Internal"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {visibleTimeline.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          update.status === "resolved"
                            ? "bg-primary/20 text-primary"
                            : update.status === "monitoring"
                              ? "bg-blue-500/20 text-blue-400"
                              : update.status === "identified"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {update.status === "resolved" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : update.status === "monitoring" ? (
                          <Activity className="w-5 h-5" />
                        ) : update.status === "identified" ? (
                          <Zap className="w-5 h-5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                      </div>
                      {index < visibleTimeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border flex-1 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 glass-dark p-4 rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{update.author}</span>
                            <Badge variant="outline" className="text-xs">
                              {update.authorRole}
                            </Badge>
                            {update.visibility === "internal" && (
                              <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400">
                                Internal
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(update.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            update.status === "resolved"
                              ? "bg-primary/20 text-primary border-primary/50"
                              : update.status === "monitoring"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                                : update.status === "identified"
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                                  : "bg-red-500/20 text-red-400 border-red-500/50"
                          }
                        >
                          {update.status}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed">{update.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Root Cause Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleSection("rootcause")}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Root Cause Analysis
                </div>
                {expandedSection === "rootcause" ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </CardTitle>
            </CardHeader>
            <AnimatePresence>
              {expandedSection === "rootcause" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="space-y-6">
                    <div className="glass-dark p-6 rounded-lg space-y-4">
                      <h4 className="font-semibold text-lg">Summary</h4>
                      <p className="text-muted-foreground leading-relaxed">{rootCauseAnalysis.summary}</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Technical Details</h4>
                      <ul className="space-y-2">
                        {rootCauseAnalysis.technicalDetails.map((detail, index) => (
                          <li key={index} className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Contributing Factors</h4>
                      <ul className="space-y-2">
                        {rootCauseAnalysis.contributing.map((factor, index) => (
                          <li key={index} className="flex gap-3">
                            <TrendingDown className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Resolution Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="glass">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleSection("resolution")}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Resolution Steps
                </div>
                {expandedSection === "resolution" ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </CardTitle>
            </CardHeader>
            <AnimatePresence>
              {expandedSection === "resolution" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent>
                    <div className="space-y-3">
                      {resolutionSteps.map((step, index) => (
                        <div key={step.step} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                step.completed
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.step}
                            </div>
                            {index < resolutionSteps.length - 1 && (
                              <div className="w-0.5 h-full bg-border flex-1 my-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <p className="font-medium">{step.action}</p>
                              <Badge variant="outline" className="text-xs">
                                {step.time}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Prevention Measures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="glass border-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Prevention Measures
              </CardTitle>
              <CardDescription>Actions taken to prevent similar incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {preventionMeasures.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glass-dark p-6 rounded-lg space-y-4"
                  >
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {category.category}
                    </h4>
                    <ul className="space-y-3">
                      {category.measures.map((measure, idx) => (
                        <li key={idx} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{measure}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Involved */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Team Involved
              </CardTitle>
              <CardDescription>Contributors to incident resolution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamInvolved.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="glass-dark p-4 rounded-lg flex items-start gap-4"
                  >
                    <Avatar className="w-12 h-12 bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{member.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.contribution}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Related Incidents
              </CardTitle>
              <CardDescription>Similar past incidents for reference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {relatedIncidents.map((incident, index) => (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="glass-dark p-4 rounded-lg flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {incident.id}
                        </Badge>
                        <h4 className="font-semibold">{incident.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(incident.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={incident.similarity} className="w-24" />
                      <span className="text-sm font-semibold">{incident.similarity}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
