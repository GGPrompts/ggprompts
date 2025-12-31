"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Cpu,
  Database,
  Download,
  Gauge,
  Play,
  Pause,
  Save,
  Settings,
  TrendingUp,
  Zap,
  ThermometerSun,
  HardDrive,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  FileText,
  ChevronRight,
  Layers,
  GitBranch,
} from "lucide-react"
import { Card, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress, Separator } from "@ggprompts/ui"
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
  ComposedChart,
  Cell,
} from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ggprompts/ui"
import { Input, Label } from "@ggprompts/ui"

// TypeScript Interfaces
interface TrainingMetrics {
  epoch: number
  step: number
  trainingLoss: number
  validationLoss: number
  perplexity: number
  learningRate: number
  gradientNorm: number
  timestamp: number
}

interface GPUStats {
  id: number
  name: string
  utilization: number
  memoryUsed: number
  memoryTotal: number
  temperature: number
  powerUsage: number
  efficiency: number
}

interface Checkpoint {
  id: string
  step: number
  epoch: number
  loss: number
  timestamp: number
  size: string
  isBest: boolean
}

interface Alert {
  id: string
  type: "warning" | "error" | "info"
  message: string
  timestamp: number
  severity: "low" | "medium" | "high"
}

interface HyperParameters {
  learningRate: number
  batchSize: number
  contextLength: number
  warmupSteps: number
  weightDecay: number
  gradientClipping: number
  optimizer: string
}

interface DatasetInfo {
  trainingSamples: number
  validationSamples: number
  domains: { name: string; percentage: number; color: string }[]
  tokenDistribution: { range: string; count: number }[]
}

export default function LLMTrainingDashboard() {
  // Training State
  const [trainingStatus, setTrainingStatus] = useState<
    "initializing" | "running" | "paused" | "completed" | "failed"
  >("running")
  const [currentEpoch, setCurrentEpoch] = useState(4)
  const [totalEpochs] = useState(10)
  const [epochProgress, setEpochProgress] = useState(62)
  const [totalSteps] = useState(50000)
  const [currentStep, setCurrentStep] = useState(31000)

  // Metrics History
  const [metricsHistory, setMetricsHistory] = useState<TrainingMetrics[]>([])
  const [gpuStats, setGpuStats] = useState<GPUStats[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])

  // Hyperparameters
  const [hyperParams, setHyperParams] = useState<HyperParameters>({
    learningRate: 0.00005,
    batchSize: 512,
    contextLength: 8192,
    warmupSteps: 2000,
    weightDecay: 0.01,
    gradientClipping: 1.0,
    optimizer: "AdamW",
  })

  // Dataset Info
  const [datasetInfo] = useState<DatasetInfo>({
    trainingSamples: 1200000,
    validationSamples: 50000,
    domains: [
      { name: "Legal", percentage: 45, color: "hsl(var(--primary))" },
      { name: "Technical", percentage: 30, color: "hsl(var(--accent))" },
      { name: "Academic", percentage: 15, color: "hsl(var(--secondary))" },
      { name: "General", percentage: 10, color: "hsl(var(--muted-foreground))" },
    ],
    tokenDistribution: [
      { range: "0-2K", count: 450000 },
      { range: "2K-4K", count: 380000 },
      { range: "4K-6K", count: 220000 },
      { range: "6K-8K", count: 150000 },
    ],
  })

  // Training Performance
  const [throughput, setThroughput] = useState(3842)
  const [timeElapsed, setTimeElapsed] = useState(145800) // seconds
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(66180) // seconds
  const [totalTokens, setTotalTokens] = useState(253440000000)
  const [totalCost, setTotalCost] = useState(4723.45)

  // Dialog states
  const [showHyperparamsDialog, setShowHyperparamsDialog] = useState(false)
  const [showCheckpointDialog, setShowCheckpointDialog] = useState(false)

  // Initialize data
  useEffect(() => {
    // Initialize metrics history
    const initialMetrics: TrainingMetrics[] = []
    for (let i = 0; i <= 310; i++) {
      initialMetrics.push({
        epoch: Math.floor(i / 77.5),
        step: i * 100,
        trainingLoss: 2.341 - (i * 0.0015) + Math.random() * 0.05,
        validationLoss: 2.523 - (i * 0.00135) + Math.random() * 0.06,
        perplexity: Math.exp(2.341 - (i * 0.0015) + Math.random() * 0.05),
        learningRate: calculateLearningRate(i * 100),
        gradientNorm: 0.8 + Math.random() * 0.4,
        timestamp: Date.now() - (310 - i) * 60000,
      })
    }
    setMetricsHistory(initialMetrics)

    // Initialize GPU stats
    const initialGPUs: GPUStats[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      name: `A100-80GB-${i}`,
      utilization: 85 + Math.random() * 7,
      memoryUsed: 68 + Math.random() * 4,
      memoryTotal: 80,
      temperature: 72 + Math.random() * 8,
      powerUsage: 320 + Math.random() * 40,
      efficiency: 0.92 + Math.random() * 0.06,
    }))
    setGpuStats(initialGPUs)

    // Initialize checkpoints
    const initialCheckpoints: Checkpoint[] = [
      {
        id: "ckpt-001",
        step: 5000,
        epoch: 0,
        loss: 2.287,
        timestamp: Date.now() - 140 * 3600000,
        size: "26.8 GB",
        isBest: false,
      },
      {
        id: "ckpt-002",
        step: 10000,
        epoch: 1,
        loss: 2.156,
        timestamp: Date.now() - 110 * 3600000,
        size: "26.8 GB",
        isBest: false,
      },
      {
        id: "ckpt-003",
        step: 15000,
        epoch: 2,
        loss: 2.043,
        timestamp: Date.now() - 75 * 3600000,
        size: "26.8 GB",
        isBest: false,
      },
      {
        id: "ckpt-004",
        step: 20000,
        epoch: 2,
        loss: 1.967,
        timestamp: Date.now() - 50 * 3600000,
        size: "26.8 GB",
        isBest: true,
      },
      {
        id: "ckpt-005",
        step: 25000,
        epoch: 3,
        loss: 1.921,
        timestamp: Date.now() - 25 * 3600000,
        size: "26.8 GB",
        isBest: false,
      },
      {
        id: "ckpt-006",
        step: 30000,
        epoch: 3,
        loss: 1.889,
        timestamp: Date.now() - 3600000,
        size: "26.8 GB",
        isBest: false,
      },
    ]
    setCheckpoints(initialCheckpoints)

    // Initialize alerts
    const initialAlerts: Alert[] = [
      {
        id: "alert-001",
        type: "info",
        message: "Training resumed from checkpoint ckpt-005",
        timestamp: Date.now() - 3600000,
        severity: "low",
      },
      {
        id: "alert-002",
        type: "warning",
        message: "GPU-3 temperature reached 79°C",
        timestamp: Date.now() - 1800000,
        severity: "medium",
      },
      {
        id: "alert-003",
        type: "info",
        message: "Checkpoint ckpt-006 saved successfully",
        timestamp: Date.now() - 900000,
        severity: "low",
      },
    ]
    setAlerts(initialAlerts)
  }, [])

  // Learning rate schedule calculation
  const calculateLearningRate = (step: number): number => {
    const warmupSteps = 2000
    const maxLR = 0.00005
    if (step < warmupSteps) {
      return (maxLR * step) / warmupSteps
    }
    // Cosine decay
    const progress = (step - warmupSteps) / (totalSteps - warmupSteps)
    return maxLR * 0.5 * (1 + Math.cos(Math.PI * progress))
  }

  // Real-time simulation
  useEffect(() => {
    if (trainingStatus !== "running") return

    const interval = setInterval(() => {
      // Update current step
      setCurrentStep((prev) => {
        const next = prev + 10
        if (next >= totalSteps) {
          setTrainingStatus("completed")
          return totalSteps
        }
        return next
      })

      // Update epoch progress
      setEpochProgress((prev) => {
        const stepsPerEpoch = totalSteps / totalEpochs
        const progressInEpoch =
          ((currentStep % stepsPerEpoch) / stepsPerEpoch) * 100
        return Math.min(progressInEpoch, 99)
      })

      // Update current epoch
      setCurrentEpoch(Math.floor(currentStep / (totalSteps / totalEpochs)))

      // Update metrics history
      setMetricsHistory((prev) => {
        const lastMetric = prev[prev.length - 1]
        const newMetric: TrainingMetrics = {
          epoch: currentEpoch,
          step: currentStep,
          trainingLoss: Math.max(
            0.5,
            lastMetric.trainingLoss - 0.00015 + (Math.random() - 0.5) * 0.01
          ),
          validationLoss: Math.max(
            0.6,
            lastMetric.validationLoss - 0.000135 + (Math.random() - 0.5) * 0.012
          ),
          perplexity: Math.exp(
            Math.max(
              0.5,
              lastMetric.trainingLoss - 0.00015 + (Math.random() - 0.5) * 0.01
            )
          ),
          learningRate: calculateLearningRate(currentStep),
          gradientNorm: 0.8 + Math.random() * 0.4,
          timestamp: Date.now(),
        }
        // Keep last 500 points
        return [...prev.slice(-499), newMetric]
      })

      // Update GPU stats
      setGpuStats((prev) =>
        prev.map((gpu) => ({
          ...gpu,
          utilization: Math.max(
            70,
            Math.min(98, gpu.utilization + (Math.random() - 0.5) * 3)
          ),
          memoryUsed: Math.max(
            60,
            Math.min(78, gpu.memoryUsed + (Math.random() - 0.5) * 1)
          ),
          temperature: Math.max(
            65,
            Math.min(82, gpu.temperature + (Math.random() - 0.5) * 2)
          ),
          powerUsage: Math.max(
            280,
            Math.min(380, gpu.powerUsage + (Math.random() - 0.5) * 10)
          ),
        }))
      )

      // Update throughput
      setThroughput((prev) =>
        Math.max(3500, Math.min(4200, prev + (Math.random() - 0.5) * 100))
      )

      // Update time
      setTimeElapsed((prev) => prev + 2)
      setEstimatedTimeRemaining((prev) => Math.max(0, prev - 2))

      // Update total tokens
      setTotalTokens((prev) => prev + throughput * 2)

      // Update cost (assuming $8.50/GPU-hour for A100)
      setTotalCost((prev) => prev + (8.5 * 8 * 2) / 3600)

      // Random alerts (low probability)
      if (Math.random() < 0.01) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: Math.random() < 0.7 ? "info" : "warning",
          message:
            Math.random() < 0.5
              ? `Gradient norm spike detected: ${(Math.random() * 2 + 1).toFixed(2)}`
              : `GPU-${Math.floor(Math.random() * 8)} utilization: ${Math.floor(Math.random() * 10 + 90)}%`,
          timestamp: Date.now(),
          severity: Math.random() < 0.7 ? "low" : "medium",
        }
        setAlerts((prev) => [...prev.slice(-9), newAlert])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [trainingStatus, currentStep, currentEpoch, throughput])

  // Format time
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  // Format tokens
  const formatTokens = (tokens: number): string => {
    if (tokens >= 1e12) return `${(tokens / 1e12).toFixed(2)}T`
    if (tokens >= 1e9) return `${(tokens / 1e9).toFixed(2)}B`
    if (tokens >= 1e6) return `${(tokens / 1e6).toFixed(2)}M`
    return tokens.toLocaleString()
  }

  // Status badge
  const getStatusBadge = () => {
    const statusConfig = {
      initializing: { color: "bg-blue-500", text: "Initializing" },
      running: { color: "bg-primary", text: "Running" },
      paused: { color: "bg-amber-500", text: "Paused" },
      completed: { color: "bg-secondary", text: "Completed" },
      failed: { color: "bg-red-500", text: "Failed" },
    }
    const config = statusConfig[trainingStatus]
    return (
      <Badge className={`${config.color} text-white border-0`}>
        {config.text}
      </Badge>
    )
  }

  // Latest metrics
  const latestMetrics = metricsHistory[metricsHistory.length - 1] || {
    trainingLoss: 0,
    validationLoss: 0,
    perplexity: 0,
    learningRate: 0,
    gradientNorm: 0,
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
            <h1 className="text-3xl md:text-4xl font-bold text-primary terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LLM Training Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time monitoring for large language model training
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => {
                setTrainingStatus(
                  trainingStatus === "running" ? "paused" : "running"
                )
              }}
            >
              {trainingStatus === "running" ? (
                <>
                  <Pause className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Resume</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
              onClick={() => setShowCheckpointDialog(true)}
            >
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Save Checkpoint</span>
            </Button>
          </div>
        </motion.div>

        {/* Training Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Model Info */}
          <Card className="glass border-primary/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Model</p>
                <h3 className="text-xl font-bold text-primary font-mono">
                  Claude-3-Finetune
                </h3>
                <p className="text-muted-foreground text-xs mt-1 opacity-70">Legal-v1 (7B params)</p>
              </div>
              <Layers className="h-8 w-8 text-primary/50" />
            </div>
            <div className="mt-4">
              {getStatusBadge()}
            </div>
          </Card>

          {/* Epoch Progress */}
          <Card className="glass border-secondary/30 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-muted-foreground text-sm mb-1">Epoch Progress</p>
                <h3 className="text-xl font-bold text-secondary">
                  {currentEpoch}/{totalEpochs}
                </h3>
                <p className="text-muted-foreground text-xs mt-1 opacity-70">
                  Step {currentStep.toLocaleString()}/{totalSteps.toLocaleString()}
                </p>
              </div>
              <Activity className="h-8 w-8 text-secondary/50" />
            </div>
            <Progress value={epochProgress} className="mt-4 h-2" />
            <p className="text-secondary text-sm mt-2 text-right">
              {epochProgress.toFixed(1)}%
            </p>
          </Card>

          {/* Time Stats */}
          <Card className="glass border-accent/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Time</p>
                <h3 className="text-xl font-bold text-accent">
                  {formatTime(timeElapsed)}
                </h3>
                <p className="text-muted-foreground text-xs mt-1 opacity-70">Elapsed</p>
              </div>
              <Clock className="h-8 w-8 text-accent/50" />
            </div>
            <Separator className="my-3 bg-accent/20" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">ETA:</span>
              <span className="text-accent text-sm font-mono">
                {formatTime(estimatedTimeRemaining)}
              </span>
            </div>
          </Card>

          {/* Cost & Tokens */}
          <Card className="glass border-amber-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Cost</p>
                <h3 className="text-xl font-bold text-amber-400">
                  ${totalCost.toFixed(2)}
                </h3>
                <p className="text-muted-foreground text-xs mt-1 opacity-70">
                  {formatTokens(totalTokens)} tokens
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-400/50" />
            </div>
            <Separator className="my-3 bg-amber-500/20" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Rate:</span>
              <span className="text-amber-400 text-sm font-mono">
                ${((totalCost / timeElapsed) * 3600).toFixed(2)}/hr
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="metrics" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger value="metrics" className="text-xs sm:text-sm whitespace-nowrap">Loss & Metrics</TabsTrigger>
                <TabsTrigger value="gpus" className="text-xs sm:text-sm whitespace-nowrap">GPU Cluster</TabsTrigger>
                <TabsTrigger value="hyperparams" className="text-xs sm:text-sm whitespace-nowrap">Hyperparams</TabsTrigger>
                <TabsTrigger value="checkpoints" className="text-xs sm:text-sm whitespace-nowrap">Checkpoints</TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs sm:text-sm whitespace-nowrap">Alerts</TabsTrigger>
              </TabsList>
            </div>

            {/* Loss & Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6">
              {/* Training Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass border-primary/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">Training Loss</p>
                      <p className="text-2xl font-bold text-primary font-mono mt-1">
                        {latestMetrics.trainingLoss.toFixed(3)}
                      </p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-primary/50" />
                  </div>
                </Card>

                <Card className="glass border-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">Validation Loss</p>
                      <p className="text-2xl font-bold text-secondary font-mono mt-1">
                        {latestMetrics.validationLoss.toFixed(3)}
                      </p>
                    </div>
                    <BarChart3 className="h-6 w-6 text-secondary/50" />
                  </div>
                </Card>

                <Card className="glass border-accent/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">Perplexity</p>
                      <p className="text-2xl font-bold text-accent font-mono mt-1">
                        {latestMetrics.perplexity.toFixed(2)}
                      </p>
                    </div>
                    <Activity className="h-6 w-6 text-accent/50" />
                  </div>
                </Card>

                <Card className="glass border-blue-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">Throughput</p>
                      <p className="text-2xl font-bold text-blue-400 font-mono mt-1">
                        {Math.floor(throughput)}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5 opacity-70">tok/sec</p>
                    </div>
                    <Zap className="h-6 w-6 text-blue-400/50" />
                  </div>
                </Card>
              </div>

              {/* Loss Curves */}
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Loss Curves
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-xs text-muted-foreground">Training</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary" />
                      <span className="text-xs text-muted-foreground">Validation</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={metricsHistory.slice(-100)}>
                    <defs>
                      <linearGradient id="trainGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="valGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--secondary))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--secondary))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                      dataKey="step"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="trainingLoss"
                      stroke="hsl(var(--primary))"
                      fill="url(#trainGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="validationLoss"
                      stroke="hsl(var(--secondary))"
                      fill="url(#valGradient)"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>

              {/* Learning Rate & Gradient Norm */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Learning Rate */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">
                    Learning Rate Schedule
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={metricsHistory.slice(-100)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--secondary) / 0.1)" />
                      <XAxis
                        dataKey="step"
                        stroke="hsl(var(--secondary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="hsl(var(--secondary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                        tickFormatter={(value) => value.toExponential(1)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--secondary) / 0.3)",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        formatter={(value: any) => value.toExponential(2)}
                      labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                      <Line
                        type="monotone"
                        dataKey="learningRate"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Gradient Norm */}
                <Card className="glass border-accent/30 p-6">
                  <h3 className="text-lg font-semibold text-accent mb-6">
                    Gradient Norm
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={metricsHistory.slice(-100)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--accent) / 0.1)" />
                      <XAxis
                        dataKey="step"
                        stroke="hsl(var(--accent) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="hsl(var(--accent) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--accent) / 0.3)",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                      labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                      <Line
                        type="monotone"
                        dataKey="gradientNorm"
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            {/* GPU Cluster Tab */}
            <TabsContent value="gpus" className="space-y-6">
              {/* GPU Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass border-primary/30 p-4">
                  <p className="text-muted-foreground text-xs mb-2">Avg Utilization</p>
                  <p className="text-2xl font-bold text-primary font-mono">
                    {(
                      gpuStats.reduce((sum, gpu) => sum + gpu.utilization, 0) /
                      gpuStats.length
                    ).toFixed(1)}
                    %
                  </p>
                </Card>
                <Card className="glass border-secondary/30 p-4">
                  <p className="text-muted-foreground text-xs mb-2">Avg Memory</p>
                  <p className="text-2xl font-bold text-secondary font-mono">
                    {(
                      gpuStats.reduce((sum, gpu) => sum + gpu.memoryUsed, 0) /
                      gpuStats.length
                    ).toFixed(1)}
                    GB
                  </p>
                </Card>
                <Card className="glass border-amber-500/30 p-4">
                  <p className="text-muted-foreground text-xs mb-2">Avg Temp</p>
                  <p className="text-2xl font-bold text-amber-400 font-mono">
                    {(
                      gpuStats.reduce((sum, gpu) => sum + gpu.temperature, 0) /
                      gpuStats.length
                    ).toFixed(1)}
                    °C
                  </p>
                </Card>
                <Card className="glass border-blue-500/30 p-4">
                  <p className="text-muted-foreground text-xs mb-2">Total Power</p>
                  <p className="text-2xl font-bold text-blue-400 font-mono">
                    {(
                      gpuStats.reduce((sum, gpu) => sum + gpu.powerUsage, 0) / 1000
                    ).toFixed(2)}
                    kW
                  </p>
                </Card>
              </div>

              {/* Individual GPU Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {gpuStats.map((gpu) => (
                  <motion.div
                    key={gpu.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: gpu.id * 0.05 }}
                  >
                    <Card
                      className={`glass p-5 ${
                        gpu.temperature > 80
                          ? "border-red-500/50 border-glow"
                          : "border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-primary font-mono text-sm font-semibold">
                            GPU-{gpu.id}
                          </p>
                          <p className="text-muted-foreground text-xs opacity-70">{gpu.name}</p>
                        </div>
                        <Cpu className="h-6 w-6 text-primary/50" />
                      </div>

                      {/* Utilization */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground text-xs">Utilization</span>
                          <span className="text-primary text-xs font-mono">
                            {gpu.utilization.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={gpu.utilization} className="h-1.5" />
                      </div>

                      {/* Memory */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground text-xs">Memory</span>
                          <span className="text-secondary text-xs font-mono">
                            {gpu.memoryUsed.toFixed(1)}/{gpu.memoryTotal} GB
                          </span>
                        </div>
                        <Progress
                          value={(gpu.memoryUsed / gpu.memoryTotal) * 100}
                          className="h-1.5"
                        />
                      </div>

                      {/* Temperature */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground text-xs flex items-center gap-1">
                            <ThermometerSun className="h-3 w-3" />
                            Temp
                          </span>
                          <span
                            className={`text-xs font-mono ${
                              gpu.temperature > 80
                                ? "text-red-400"
                                : gpu.temperature > 75
                                ? "text-amber-400"
                                : "text-accent"
                            }`}
                          >
                            {gpu.temperature.toFixed(1)}°C
                          </span>
                        </div>
                        <Progress
                          value={(gpu.temperature / 100) * 100}
                          className="h-1.5"
                        />
                      </div>

                      {/* Power */}
                      <div className="flex items-center justify-between pt-2 border-t border-primary/20">
                        <span className="text-muted-foreground text-xs flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Power
                        </span>
                        <span className="text-blue-400 text-xs font-mono">
                          {Math.floor(gpu.powerUsage)}W
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Hyperparameters Tab */}
            <TabsContent value="hyperparams" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Training Configuration
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/30 text-primary"
                    onClick={() => setShowHyperparamsDialog(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Learning Rate */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Learning Rate</Label>
                    <div className="glass border-primary/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-primary font-mono">
                        {hyperParams.learningRate.toExponential(2)}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1 opacity-70">
                        AdamW optimizer with cosine decay
                      </p>
                    </div>
                  </div>

                  {/* Batch Size */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Batch Size</Label>
                    <div className="glass border-secondary/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-secondary font-mono">
                        {hyperParams.batchSize}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1 opacity-70">
                        Effective (with gradient accumulation)
                      </p>
                    </div>
                  </div>

                  {/* Context Length */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Context Length</Label>
                    <div className="glass border-accent/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-accent font-mono">
                        {hyperParams.contextLength.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1 opacity-70">tokens</p>
                    </div>
                  </div>

                  {/* Warmup Steps */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Warmup Steps</Label>
                    <div className="glass border-blue-500/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-blue-400 font-mono">
                        {hyperParams.warmupSteps.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1 opacity-70">Linear warmup</p>
                    </div>
                  </div>

                  {/* Weight Decay */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Weight Decay</Label>
                    <div className="glass border-purple-500/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-purple-400 font-mono">
                        {hyperParams.weightDecay}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1 opacity-70">L2 regularization</p>
                    </div>
                  </div>

                  {/* Gradient Clipping */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Gradient Clipping</Label>
                    <div className="glass border-pink-500/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-pink-400 font-mono">
                        {hyperParams.gradientClipping}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1 opacity-70">Max norm</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6 bg-primary/20" />

                {/* Dataset Info */}
                <div>
                  <h4 className="text-md font-semibold text-secondary mb-4">
                    Dataset Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Sample Counts */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Training Samples</span>
                        <span className="text-primary font-mono text-sm">
                          {datasetInfo.trainingSamples.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Validation Samples
                        </span>
                        <span className="text-secondary font-mono text-sm">
                          {datasetInfo.validationSamples.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Domain Distribution */}
                    <div className="space-y-3">
                      {datasetInfo.domains.map((domain) => (
                        <div key={domain.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-muted-foreground text-sm">
                              {domain.name}
                            </span>
                            <span className="text-foreground text-sm font-mono">
                              {domain.percentage}%
                            </span>
                          </div>
                          <Progress value={domain.percentage} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Token Distribution */}
                  <div className="mt-6">
                    <h5 className="text-sm font-semibold text-accent mb-3">
                      Token Distribution
                    </h5>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={datasetInfo.tokenDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                        <XAxis
                          dataKey="range"
                          stroke="hsl(var(--primary) / 0.5)"
                          tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                        />
                        <YAxis
                          stroke="hsl(var(--primary) / 0.5)"
                          tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--popover-foreground))",
                          }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                        <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Checkpoints Tab */}
            <TabsContent value="checkpoints" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Training Checkpoints
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                      Auto-save every 5K steps
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {checkpoints.map((checkpoint, index) => (
                    <motion.div
                      key={checkpoint.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`glass rounded-lg p-5 ${
                        checkpoint.isBest
                          ? "border-amber-500/50 border-2"
                          : "border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-primary font-mono text-sm font-semibold">
                              {checkpoint.id}
                            </h4>
                            {checkpoint.isBest && (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                                Best
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-muted-foreground text-xs opacity-70">Step</p>
                              <p className="text-foreground font-mono text-sm">
                                {checkpoint.step.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs opacity-70">Epoch</p>
                              <p className="text-foreground font-mono text-sm">
                                {checkpoint.epoch}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs opacity-70">Loss</p>
                              <p className="text-secondary font-mono text-sm">
                                {checkpoint.loss.toFixed(3)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs opacity-70">Size</p>
                              <p className="text-foreground font-mono text-sm">
                                {checkpoint.size}
                              </p>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-xs mt-3 opacity-70">
                            {new Date(checkpoint.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary/30 text-primary hover:bg-primary/10"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-secondary/30 text-secondary hover:bg-secondary/10"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Alerts & Anomalies
                  </h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {alerts.length} alerts
                  </Badge>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {alerts.map((alert, index) => {
                      const icon =
                        alert.type === "error"
                          ? XCircle
                          : alert.type === "warning"
                          ? AlertTriangle
                          : CheckCircle2
                      const Icon = icon
                      const colorClass =
                        alert.type === "error"
                          ? "border-red-500/50 text-red-400"
                          : alert.type === "warning"
                          ? "border-amber-500/50 text-amber-400"
                          : "border-primary/30 text-primary"

                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`glass rounded-lg p-4 ${colorClass}`}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-foreground">
                                {alert.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 opacity-70">
                                {new Date(alert.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Badge
                              className={`${
                                alert.severity === "high"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : alert.severity === "medium"
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              } text-xs`}
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  {alerts.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle2 className="h-12 w-12 text-primary/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">No alerts</p>
                      <p className="text-muted-foreground text-sm mt-1 opacity-70">
                        Training is running smoothly
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Live Update Indicator */}
        {trainingStatus === "running" && (
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
        )}
      </div>
    </div>
  )
}
