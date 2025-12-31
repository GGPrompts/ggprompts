"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Database,
  Download,
  Eye,
  Filter,
  Gauge,
  HardDrive,
  Hash,
  Layers,
  LineChart,
  Network,
  Percent,
  RefreshCw,
  Search,
  Server,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Boxes,
  FileSearch,
  GitBranch,
  Cpu,
  DollarSign,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Cell,
} from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"

// TypeScript Interfaces
interface VectorDBStats {
  totalVectors: number
  dimensions: number
  indexSize: number // GB
  lastUpdated: number
  dbType: string
}

interface EmbeddingModel {
  name: string
  dimensions: number
  maxTokens: number
  costPer1K: number
  speed: number // vectors/sec
}

interface SearchMetrics {
  avgLatency: number
  queriesPerSecond: number
  recallAt10: number
  cacheHitRate: number
  indexRefreshRate: number // minutes
}

interface SimilarityDistribution {
  range: string
  count: number
  avgScore: number
}

interface Namespace {
  name: string
  vectorCount: number
  queryVolume: number
  avgLatency: number
  color: string
}

interface QueryPattern {
  query: string
  frequency: number
  avgLatency: number
  avgSimilarity: number
}

interface IndexHealth {
  fragmentation: number
  replicationFactor: number
  shardCount: number
  lastOptimized: number
  status: "healthy" | "degraded" | "critical"
}

export default function VectorDBDashboard() {
  // Database Stats
  const [dbStats] = useState<VectorDBStats>({
    totalVectors: 2400000,
    dimensions: 1536,
    indexSize: 18.7,
    lastUpdated: Date.now() - 3600000,
    dbType: "Pinecone (Serverless)",
  })

  // Embedding Model
  const [embeddingModel] = useState<EmbeddingModel>({
    name: "text-embedding-3-small",
    dimensions: 1536,
    maxTokens: 8192,
    costPer1K: 0.00002,
    speed: 2450,
  })

  // Search Performance
  const [searchMetrics, setSearchMetrics] = useState<SearchMetrics>({
    avgLatency: 42,
    queriesPerSecond: 127,
    recallAt10: 0.94,
    cacheHitRate: 0.68,
    indexRefreshRate: 15,
  })

  // Similarity Distribution
  const [similarityDist] = useState<SimilarityDistribution[]>([
    { range: "0.0-0.1", count: 45000, avgScore: 0.05 },
    { range: "0.1-0.2", count: 82000, avgScore: 0.15 },
    { range: "0.2-0.3", count: 134000, avgScore: 0.25 },
    { range: "0.3-0.4", count: 189000, avgScore: 0.35 },
    { range: "0.4-0.5", count: 245000, avgScore: 0.45 },
    { range: "0.5-0.6", count: 298000, avgScore: 0.55 },
    { range: "0.6-0.7", count: 356000, avgScore: 0.65 },
    { range: "0.7-0.8", count: 421000, avgScore: 0.75 },
    { range: "0.8-0.9", count: 387000, avgScore: 0.85 },
    { range: "0.9-1.0", count: 243000, avgScore: 0.95 },
  ])

  // Namespaces
  const [namespaces, setNamespaces] = useState<Namespace[]>([
    {
      name: "documentation",
      vectorCount: 1200000,
      queryVolume: 1847,
      avgLatency: 38,
      color: "hsl(var(--primary))",
    },
    {
      name: "codebase",
      vectorCount: 800000,
      queryVolume: 1234,
      avgLatency: 45,
      color: "hsl(var(--secondary))",
    },
    {
      name: "chat-history",
      vectorCount: 400000,
      queryVolume: 892,
      avgLatency: 51,
      color: "hsl(var(--accent))",
    },
  ])

  // Top Queries
  const [topQueries] = useState<QueryPattern[]>([
    {
      query: "authentication implementation",
      frequency: 234,
      avgLatency: 39,
      avgSimilarity: 0.87,
    },
    {
      query: "API endpoint documentation",
      frequency: 187,
      avgLatency: 41,
      avgSimilarity: 0.91,
    },
    {
      query: "database schema design",
      frequency: 156,
      avgLatency: 43,
      avgSimilarity: 0.85,
    },
    {
      query: "error handling best practices",
      frequency: 134,
      avgLatency: 37,
      avgSimilarity: 0.88,
    },
    {
      query: "performance optimization",
      frequency: 121,
      avgLatency: 44,
      avgSimilarity: 0.82,
    },
  ])

  // Index Health
  const [indexHealth] = useState<IndexHealth>({
    fragmentation: 12,
    replicationFactor: 3,
    shardCount: 8,
    lastOptimized: Date.now() - 7200000,
    status: "healthy",
  })

  // Performance history (24 hours)
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([])

  // Latency heatmap data
  const [latencyHeatmap] = useState(() => {
    const hours = [
      "00",
      "03",
      "06",
      "09",
      "12",
      "15",
      "18",
      "21",
    ]
    return hours.map((hour) => ({
      hour: `${hour}:00`,
      avgLatency: 35 + Math.random() * 20,
      p95Latency: 50 + Math.random() * 30,
      qps: 80 + Math.random() * 80,
    }))
  })

  // Embedding quality metrics
  const [embeddingQuality] = useState({
    coverage: 0.987,
    duplicates: 0.003,
    drift: 0.012,
    coherence: 0.923,
  })

  // Initialize performance history
  useEffect(() => {
    const history = []
    for (let i = 59; i >= 0; i--) {
      history.push({
        minute: i,
        label: i % 10 === 0 ? `-${i}m` : "",
        qps: 100 + Math.random() * 50,
        latency: 35 + Math.random() * 15,
        cacheHit: 0.6 + Math.random() * 0.15,
      })
    }
    setPerformanceHistory(history)
  }, [])

  // Real-time simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Update search metrics
      setSearchMetrics((prev) => ({
        ...prev,
        avgLatency: Math.max(
          25,
          Math.min(60, prev.avgLatency + (Math.random() - 0.5) * 5)
        ),
        queriesPerSecond: Math.max(
          80,
          Math.min(200, prev.queriesPerSecond + (Math.random() - 0.5) * 20)
        ),
        cacheHitRate: Math.max(
          0.5,
          Math.min(0.85, prev.cacheHitRate + (Math.random() - 0.5) * 0.05)
        ),
      }))

      // Update performance history
      setPerformanceHistory((prev) => {
        const newPoint = {
          minute: 0,
          label: "now",
          qps: searchMetrics.queriesPerSecond,
          latency: searchMetrics.avgLatency,
          cacheHit: searchMetrics.cacheHitRate,
        }
        return [
          ...prev.slice(1).map((p, idx) => ({ ...p, minute: idx + 1 })),
          newPoint,
        ]
      })

      // Update namespace query volumes
      setNamespaces((prev) =>
        prev.map((ns) => ({
          ...ns,
          queryVolume:
            ns.queryVolume + Math.floor(Math.random() * 10 - 3),
          avgLatency: Math.max(
            25,
            Math.min(70, ns.avgLatency + (Math.random() - 0.5) * 3)
          ),
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [searchMetrics])

  // Format number
  const formatNumber = (num: number): string => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toString()
  }

  // Get health status
  const getHealthStatus = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            Healthy
          </Badge>
        )
      case "degraded":
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            Degraded
          </Badge>
        )
      case "critical":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Critical
          </Badge>
        )
    }
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
              Vector Database Monitor
            </h1>
            <p className="text-muted-foreground mt-2">
              Embedding quality, search performance, and index health
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {getHealthStatus(indexHealth.status)}
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              <RefreshCw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Optimize Index</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export Data</span>
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
          {/* Total Vectors */}
          <Card className="glass border-primary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Total Vectors</p>
              <Database className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-3xl font-bold text-primary font-mono">
              {formatNumber(dbStats.totalVectors)}
            </p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              {dbStats.dimensions} dimensions
            </p>
          </Card>

          {/* Avg Latency */}
          <Card className="glass border-secondary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Avg Latency</p>
              <Gauge className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">
              {Math.floor(searchMetrics.avgLatency)}ms
            </p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              {searchMetrics.queriesPerSecond.toFixed(0)} QPS
            </p>
          </Card>

          {/* Recall@10 */}
          <Card className="glass border-accent/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Recall@10</p>
              <Target className="h-5 w-5 text-accent-foreground/50" />
            </div>
            <p className="text-3xl font-bold text-accent-foreground font-mono">
              {(searchMetrics.recallAt10 * 100).toFixed(1)}%
            </p>
            <Progress value={searchMetrics.recallAt10 * 100} className="h-1.5 mt-2" />
          </Card>

          {/* Index Size */}
          <Card className="glass border-chart-4/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Index Size</p>
              <HardDrive className="h-5 w-5 text-chart-4/50" />
            </div>
            <p className="text-3xl font-bold text-chart-4 font-mono">
              {dbStats.indexSize}GB
            </p>
            <p className="text-muted-foreground/70 text-xs mt-1">{dbStats.dbType}</p>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="performance" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger value="performance" className="text-xs sm:text-sm whitespace-nowrap">Performance</TabsTrigger>
                <TabsTrigger value="embeddings" className="text-xs sm:text-sm whitespace-nowrap">Embeddings</TabsTrigger>
                <TabsTrigger value="namespaces" className="text-xs sm:text-sm whitespace-nowrap">Namespaces</TabsTrigger>
                <TabsTrigger value="queries" className="text-xs sm:text-sm whitespace-nowrap">Queries</TabsTrigger>
                <TabsTrigger value="index" className="text-xs sm:text-sm whitespace-nowrap">Index</TabsTrigger>
              </TabsList>
            </div>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              {/* Real-time metrics */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="glass border-primary/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">QPS</p>
                    <Activity className="h-5 w-5 text-primary/50" />
                  </div>
                  <p className="text-3xl font-bold text-primary font-mono">
                    {Math.floor(searchMetrics.queriesPerSecond)}
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-2">queries per second</p>
                </Card>

                <Card className="glass border-secondary/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Cache Hit Rate</p>
                    <Zap className="h-5 w-5 text-secondary/50" />
                  </div>
                  <p className="text-3xl font-bold text-secondary font-mono">
                    {(searchMetrics.cacheHitRate * 100).toFixed(1)}%
                  </p>
                  <Progress
                    value={searchMetrics.cacheHitRate * 100}
                    className="h-1.5 mt-2"
                  />
                </Card>

                <Card className="glass border-accent/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Index Refresh</p>
                    <RefreshCw className="h-5 w-5 text-accent-foreground/50" />
                  </div>
                  <p className="text-3xl font-bold text-accent-foreground font-mono">
                    {searchMetrics.indexRefreshRate}m
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-2">refresh interval</p>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-6">
                  Real-time Performance (Last 60 Minutes)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={performanceHistory}>
                    <defs>
                      <linearGradient id="qpsGradient" x1="0" y1="0" x2="0" y2="1">
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
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                      dataKey="label"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      label={{
                        value: "QPS",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: "hsl(var(--muted-foreground))" },
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--secondary) / 0.5)"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      label={{
                        value: "Latency (ms)",
                        angle: 90,
                        position: "insideRight",
                        style: { fill: "hsl(var(--muted-foreground))" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="qps"
                      stroke="hsl(var(--primary))"
                      fill="url(#qpsGradient)"
                      name="QPS"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="latency"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      name="Latency (ms)"
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>

              {/* Latency Heatmap */}
              <Card className="glass border-secondary/30 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-6">
                  Latency Heatmap (24 Hours)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={latencyHeatmap}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="avgLatency"
                      fill="hsl(var(--accent))"
                      name="Avg Latency (ms)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="p95Latency"
                      fill="hsl(var(--chart-4))"
                      name="p95 Latency (ms)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Similarity Distribution */}
              <Card className="glass border-accent/30 p-6">
                <h3 className="text-lg font-semibold text-accent-foreground mb-6">
                  Similarity Score Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={similarityDist}>
                    <defs>
                      <linearGradient id="simGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--accent))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--accent))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                      dataKey="range"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      label={{
                        value: "Similarity Score Range",
                        position: "insideBottom",
                        offset: -5,
                        style: { fill: "hsl(var(--muted-foreground))" },
                      }}
                    />
                    <YAxis
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      label={{
                        value: "Vector Count",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: "hsl(var(--muted-foreground))" },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--accent))"
                      fill="url(#simGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-muted-foreground text-xs mt-4 text-center">
                  Recommended threshold: 0.7-0.8 for high-quality matches
                </p>
              </Card>
            </TabsContent>

            {/* Embeddings Tab */}
            <TabsContent value="embeddings" className="space-y-6">
              {/* Model Info */}
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Embedding Model
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      OpenAI {embeddingModel.name}
                    </p>
                  </div>
                  <Sparkles className="h-8 w-8 text-primary/50" />
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="glass-dark border-primary/30 rounded-lg p-4">
                    <p className="text-muted-foreground text-xs mb-2">Dimensions</p>
                    <p className="text-2xl font-bold text-primary font-mono">
                      {embeddingModel.dimensions}
                    </p>
                  </div>

                  <div className="glass-dark border-secondary/30 rounded-lg p-4">
                    <p className="text-muted-foreground text-xs mb-2">Max Tokens</p>
                    <p className="text-2xl font-bold text-secondary font-mono">
                      {embeddingModel.maxTokens.toLocaleString()}
                    </p>
                  </div>

                  <div className="glass-dark border-accent/30 rounded-lg p-4">
                    <p className="text-muted-foreground text-xs mb-2">Cost/1K Tokens</p>
                    <p className="text-2xl font-bold text-accent-foreground font-mono">
                      ${embeddingModel.costPer1K.toFixed(5)}
                    </p>
                  </div>

                  <div className="glass-dark border-chart-4/30 rounded-lg p-4">
                    <p className="text-muted-foreground text-xs mb-2">Speed</p>
                    <p className="text-2xl font-bold text-chart-4 font-mono">
                      {embeddingModel.speed}
                    </p>
                    <p className="text-muted-foreground/70 text-xs mt-1">vec/sec</p>
                  </div>
                </div>
              </Card>

              {/* Quality Metrics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass border-primary/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Coverage</p>
                    <CheckCircle2 className="h-5 w-5 text-primary/50" />
                  </div>
                  <p className="text-3xl font-bold text-primary font-mono">
                    {(embeddingQuality.coverage * 100).toFixed(1)}%
                  </p>
                  <Progress
                    value={embeddingQuality.coverage * 100}
                    className="h-1.5 mt-2"
                  />
                </Card>

                <Card className="glass border-secondary/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Duplicates</p>
                    <AlertCircle className="h-5 w-5 text-secondary/50" />
                  </div>
                  <p className="text-3xl font-bold text-secondary font-mono">
                    {(embeddingQuality.duplicates * 100).toFixed(2)}%
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-2">Near-duplicates detected</p>
                </Card>

                <Card className="glass border-accent/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Embedding Drift</p>
                    <TrendingUp className="h-5 w-5 text-accent-foreground/50" />
                  </div>
                  <p className="text-3xl font-bold text-accent-foreground font-mono">
                    {(embeddingQuality.drift * 100).toFixed(1)}%
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-2">Over last 30 days</p>
                </Card>

                <Card className="glass border-chart-4/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Coherence</p>
                    <Target className="h-5 w-5 text-chart-4/50" />
                  </div>
                  <p className="text-3xl font-bold text-chart-4 font-mono">
                    {(embeddingQuality.coherence * 100).toFixed(1)}%
                  </p>
                  <Progress
                    value={embeddingQuality.coherence * 100}
                    className="h-1.5 mt-2"
                  />
                </Card>
              </div>

              {/* Quality Insights */}
              <Card className="glass border-secondary/30 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-6">
                  Quality Insights
                </h3>
                <div className="space-y-4">
                  <div className="glass-dark border-primary/30 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-primary font-medium text-sm mb-1">
                          Excellent Coverage
                        </p>
                        <p className="text-muted-foreground text-xs">
                          98.7% of documents have embeddings. Only 31,200 documents
                          pending.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-dark border-amber-500/30 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                      <div>
                        <p className="text-amber-400 font-medium text-sm mb-1">
                          Low Duplicate Rate
                        </p>
                        <p className="text-muted-foreground text-xs">
                          7,200 near-duplicate vectors detected. Consider
                          deduplication for storage optimization.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-dark border-secondary/30 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <p className="text-secondary font-medium text-sm mb-1">
                          Stable Embeddings
                        </p>
                        <p className="text-muted-foreground text-xs">
                          1.2% drift is within normal range. No model retraining
                          required.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Namespaces Tab */}
            <TabsContent value="namespaces" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {namespaces.map((ns, idx) => (
                  <motion.div
                    key={ns.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <Card
                      className="glass p-6 border-l-4"
                      style={{ borderLeftColor: ns.color }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold mb-1" style={{ color: ns.color }}>
                            {ns.name}
                          </h3>
                          <p className="text-muted-foreground/70 text-xs">Namespace</p>
                        </div>
                        <Boxes className="h-6 w-6" style={{ color: ns.color }} />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-muted-foreground text-sm">Vector Count</span>
                            <span
                              className="font-mono text-sm"
                              style={{ color: ns.color }}
                            >
                              {formatNumber(ns.vectorCount)}
                            </span>
                          </div>
                          <Progress
                            value={(ns.vectorCount / dbStats.totalVectors) * 100}
                            className="h-1.5"
                          />
                        </div>

                        <Separator style={{ backgroundColor: `${ns.color}20` }} />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-muted-foreground/70 text-xs">Queries (24h)</p>
                            <p className="text-primary font-mono text-lg">
                              {ns.queryVolume.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground/70 text-xs">Avg Latency</p>
                            <p className="text-secondary font-mono text-lg">
                              {Math.floor(ns.avgLatency)}ms
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Namespace Distribution */}
              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-6">
                  Namespace Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={namespaces}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickFormatter={formatNumber}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) => formatNumber(value)}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                    <Bar dataKey="vectorCount" radius={[4, 4, 0, 0]}>
                      {namespaces.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Query Analytics Tab */}
            <TabsContent value="queries" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Top 20 Search Queries
                  </h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Last 24 Hours
                  </Badge>
                </div>

                <div className="space-y-3">
                  {topQueries.map((query, idx) => (
                    <motion.div
                      key={query.query}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass-dark border-primary/20 rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
                            #{idx + 1}
                          </Badge>
                          <p className="text-foreground text-sm">{query.query}</p>
                        </div>
                        <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-mono ml-4">
                          {query.frequency}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-muted-foreground/70 text-xs">Avg Latency</p>
                          <p className="text-secondary font-mono text-sm">
                            {query.avgLatency}ms
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground/70 text-xs">Avg Similarity</p>
                          <p className="text-primary font-mono text-sm">
                            {query.avgSimilarity.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground/70 text-xs">Quality</p>
                          <Progress
                            value={query.avgSimilarity * 100}
                            className="h-1.5 mt-1"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Index Health Tab */}
            <TabsContent value="index" className="space-y-6">
              {/* Health Overview */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="glass border-primary/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Fragmentation</p>
                    <Activity className="h-5 w-5 text-primary/50" />
                  </div>
                  <p className="text-3xl font-bold text-primary font-mono">
                    {indexHealth.fragmentation}%
                  </p>
                  <Progress value={indexHealth.fragmentation} className="h-1.5 mt-2" />
                </Card>

                <Card className="glass border-secondary/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Replication</p>
                    <Network className="h-5 w-5 text-secondary/50" />
                  </div>
                  <p className="text-3xl font-bold text-secondary font-mono">
                    {indexHealth.replicationFactor}x
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-2">factor</p>
                </Card>

                <Card className="glass border-accent/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Shards</p>
                    <GitBranch className="h-5 w-5 text-accent-foreground/50" />
                  </div>
                  <p className="text-3xl font-bold text-accent-foreground font-mono">
                    {indexHealth.shardCount}
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-2">distributed</p>
                </Card>

                <Card className="glass border-chart-4/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Last Optimized</p>
                    <Clock className="h-5 w-5 text-chart-4/50" />
                  </div>
                  <p className="text-2xl font-bold text-chart-4 font-mono">
                    2h
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-2">ago</p>
                </Card>
              </div>

              {/* Index Status */}
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Index Status
                  </h3>
                  {getHealthStatus(indexHealth.status)}
                </div>

                <div className="space-y-4">
                  <div className="glass-dark border-primary/30 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-primary font-medium text-sm mb-1">
                          Low Fragmentation
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Index fragmentation at {indexHealth.fragmentation}% is well
                          below 25% threshold. No optimization needed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-dark border-secondary/30 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-secondary font-medium text-sm mb-1">
                          Proper Replication
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {indexHealth.replicationFactor}x replication ensures high
                          availability and fault tolerance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-dark border-accent/30 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-accent-foreground font-medium text-sm mb-1">
                          Balanced Sharding
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {indexHealth.shardCount} shards evenly distributed across
                          cluster for optimal performance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Maintenance Schedule */}
              <Card className="glass border-secondary/30 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-6">
                  Maintenance Schedule
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between glass-dark border-primary/30 rounded-lg p-4">
                    <div>
                      <p className="text-foreground font-medium text-sm">
                        Index Optimization
                      </p>
                      <p className="text-muted-foreground/70 text-xs mt-1">Next run: 4 hours</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Scheduled
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between glass-dark border-secondary/30 rounded-lg p-4">
                    <div>
                      <p className="text-foreground font-medium text-sm">
                        Consistency Check
                      </p>
                      <p className="text-muted-foreground/70 text-xs mt-1">Next run: 12 hours</p>
                    </div>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                      Scheduled
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between glass-dark border-accent/30 rounded-lg p-4">
                    <div>
                      <p className="text-foreground font-medium text-sm">
                        Backup & Snapshot
                      </p>
                      <p className="text-muted-foreground/70 text-xs mt-1">Next run: 18 hours</p>
                    </div>
                    <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
                      Scheduled
                    </Badge>
                  </div>
                </div>
              </Card>
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
