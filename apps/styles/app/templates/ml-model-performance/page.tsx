"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  Award,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  Gauge,
  GitCompare,
  LineChart,
  Percent,
  PieChart,
  Target,
  TrendingUp,
  Zap,
  AlertCircle,
  Info,
  XCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { Card, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress, Separator } from "@ggprompts/ui"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ggprompts/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ggprompts/ui"

// TypeScript Interfaces
interface ModelConfig {
  id: string
  name: string
  version: string
  deployedDate: string
  trafficSplit: number
  color: string
}

interface PerformanceMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  auc: number
  latencyP50: number
  latencyP95: number
  latencyP99: number
  costPer1K: number
}

interface ConfusionMatrixData {
  predicted: string
  actual: string
  count: number
}

interface ROCPoint {
  fpr: number
  tpr: number
  threshold: number
}

interface FeatureImportance {
  feature: string
  importance: number
  shap: number
}

interface ErrorSample {
  id: string
  text: string
  trueLabel: string
  predictedLabel: string
  confidence: number
}

interface ABTestResult {
  metric: string
  modelA: number
  modelB: number
  pValue: number
  winner: string | null
}

export default function MLModelPerformanceDashboard() {
  // Model Selection
  const [models] = useState<ModelConfig[]>([
    {
      id: "model-a",
      name: "sentiment-classifier-v3.2",
      version: "3.2.0",
      deployedDate: "2024-01-15",
      trafficSplit: 80,
      color: "hsl(var(--primary))",
    },
    {
      id: "model-b",
      name: "sentiment-classifier-v4.0",
      version: "4.0.0",
      deployedDate: "2024-02-20",
      trafficSplit: 20,
      color: "hsl(var(--secondary))",
    },
  ])

  const [selectedModel, setSelectedModel] = useState<string>("model-a")
  const [compareMode, setCompareMode] = useState(true)

  // Performance Metrics
  const [metricsA] = useState<PerformanceMetrics>({
    accuracy: 0.924,
    precision: 0.918,
    recall: 0.912,
    f1Score: 0.915,
    auc: 0.956,
    latencyP50: 12,
    latencyP95: 28,
    latencyP99: 45,
    costPer1K: 0.002,
  })

  const [metricsB] = useState<PerformanceMetrics>({
    accuracy: 0.931,
    precision: 0.927,
    recall: 0.919,
    f1Score: 0.923,
    auc: 0.961,
    latencyP50: 15,
    latencyP95: 32,
    latencyP99: 51,
    costPer1K: 0.003,
  })

  // Confusion Matrix Data
  const [confusionMatrix] = useState<ConfusionMatrixData[]>([
    { actual: "Positive", predicted: "Positive", count: 18500 },
    { actual: "Positive", predicted: "Negative", count: 720 },
    { actual: "Positive", predicted: "Neutral", count: 580 },
    { actual: "Negative", predicted: "Positive", count: 640 },
    { actual: "Negative", predicted: "Negative", count: 14200 },
    { actual: "Negative", predicted: "Neutral", count: 890 },
    { actual: "Neutral", predicted: "Positive", count: 520 },
    { actual: "Neutral", predicted: "Negative", count: 780 },
    { actual: "Neutral", predicted: "Neutral", count: 12900 },
  ])

  // ROC Curve Data
  const [rocData] = useState<ROCPoint[]>(() => {
    const points: ROCPoint[] = []
    for (let i = 0; i <= 100; i++) {
      const fpr = i / 100
      // ROC curve for AUC ≈ 0.956
      const tpr = Math.sqrt(fpr) * 0.95 + fpr * 0.05
      points.push({
        fpr,
        tpr: Math.min(tpr, 1),
        threshold: 1 - i / 100,
      })
    }
    return points
  })

  // Precision-Recall Curve Data
  const [prData] = useState(() => {
    const points: { recall: number; precision: number }[] = []
    for (let i = 0; i <= 100; i++) {
      const recall = i / 100
      // Precision decreases as recall increases
      const precision = 0.95 - recall * 0.15 + Math.sin(recall * Math.PI) * 0.05
      points.push({
        recall,
        precision: Math.max(0.7, Math.min(precision, 1)),
      })
    }
    return points
  })

  // Feature Importance
  const [featureImportance] = useState<FeatureImportance[]>([
    { feature: "sentiment_score", importance: 0.32, shap: 0.28 },
    { feature: "word_count", importance: 0.18, shap: 0.21 },
    { feature: "exclamation_count", importance: 0.15, shap: 0.17 },
    { feature: "capitalization_ratio", importance: 0.12, shap: 0.14 },
    { feature: "emoji_count", importance: 0.09, shap: 0.11 },
    { feature: "question_marks", importance: 0.08, shap: 0.09 },
    { feature: "sentence_length_avg", importance: 0.06, shap: 0.07 },
    { feature: "punctuation_density", importance: 0.05, shap: 0.06 },
    { feature: "unique_words_ratio", importance: 0.04, shap: 0.05 },
    { feature: "readability_score", importance: 0.03, shap: 0.04 },
  ])

  // Error Samples
  const [errorSamples] = useState<ErrorSample[]>([
    {
      id: "err-001",
      text: "This is okay I guess, nothing special really...",
      trueLabel: "Neutral",
      predictedLabel: "Negative",
      confidence: 0.73,
    },
    {
      id: "err-002",
      text: "Not bad at all! Could be better though.",
      trueLabel: "Positive",
      predictedLabel: "Neutral",
      confidence: 0.68,
    },
    {
      id: "err-003",
      text: "Terrible service but the product is amazing!!!",
      trueLabel: "Positive",
      predictedLabel: "Negative",
      confidence: 0.81,
    },
    {
      id: "err-004",
      text: "Meh... it's whatever, doesn't really matter.",
      trueLabel: "Neutral",
      predictedLabel: "Negative",
      confidence: 0.65,
    },
  ])

  // Confidence Distribution
  const [confidenceDistribution] = useState(() => {
    const bins: { range: string; count: number; accuracy: number }[] = []
    const ranges = [
      "0.0-0.1",
      "0.1-0.2",
      "0.2-0.3",
      "0.3-0.4",
      "0.4-0.5",
      "0.5-0.6",
      "0.6-0.7",
      "0.7-0.8",
      "0.8-0.9",
      "0.9-1.0",
    ]
    ranges.forEach((range, idx) => {
      bins.push({
        range,
        count: Math.floor(Math.random() * 3000 + 2000 * (idx / 10)),
        accuracy: 0.5 + (idx / 10) * 0.45 + Math.random() * 0.05,
      })
    })
    return bins
  })

  // A/B Test Results
  const [abTestResults] = useState<ABTestResult[]>([
    {
      metric: "Accuracy",
      modelA: 0.924,
      modelB: 0.931,
      pValue: 0.023,
      winner: "Model B",
    },
    {
      metric: "F1-Score",
      modelA: 0.915,
      modelB: 0.923,
      pValue: 0.019,
      winner: "Model B",
    },
    {
      metric: "Latency (p95)",
      modelA: 28,
      modelB: 32,
      pValue: 0.041,
      winner: "Model A",
    },
    {
      metric: "Cost/1K",
      modelA: 0.002,
      modelB: 0.003,
      pValue: 0.001,
      winner: "Model A",
    },
  ])

  // Class-level metrics
  const [classMetrics] = useState([
    {
      class: "Positive",
      precision: 0.932,
      recall: 0.925,
      f1: 0.928,
      support: 19800,
    },
    {
      class: "Negative",
      precision: 0.918,
      recall: 0.901,
      f1: 0.909,
      support: 15730,
    },
    {
      class: "Neutral",
      precision: 0.909,
      recall: 0.913,
      f1: 0.911,
      support: 14200,
    },
  ])

  // Get confusion matrix value
  const getConfusionValue = (actual: string, predicted: string): number => {
    const cell = confusionMatrix.find(
      (c) => c.actual === actual && c.predicted === predicted
    )
    return cell?.count || 0
  }

  // Get confusion matrix color
  const getConfusionColor = (count: number, maxCount: number): string => {
    const intensity = count / maxCount
    if (intensity > 0.8) return "bg-primary"
    if (intensity > 0.6) return "bg-primary/80"
    if (intensity > 0.4) return "bg-accent/80"
    if (intensity > 0.2) return "bg-secondary/60"
    return "bg-slate-700"
  }

  const maxConfusionCount = Math.max(...confusionMatrix.map((c) => c.count))
  const classes = ["Positive", "Negative", "Neutral"]

  // Format percentage
  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`
  }

  // Statistical significance badge
  const getSignificanceBadge = (pValue: number) => {
    if (pValue < 0.01)
      return <Badge className="bg-primary/20 text-primary border-primary/30">p &lt; 0.01</Badge>
    if (pValue < 0.05)
      return <Badge className="bg-secondary/20 text-secondary border-secondary/30">p &lt; 0.05</Badge>
    return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Not Significant</Badge>
  }

  // Winner badge
  const getWinnerBadge = (winner: string | null) => {
    if (!winner) return null
    const isModelA = winner === "Model A"
    return (
      <Badge
        className={`${
          isModelA
            ? "bg-primary/20 text-primary border-primary/30"
            : "bg-secondary/20 text-secondary border-secondary/30"
        }`}
      >
        <Award className="h-3 w-3 mr-1" />
        {winner}
      </Badge>
    )
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
              ML Model Performance
            </h1>
            <p className="text-muted-foreground mt-2">
              A/B testing, evaluation metrics, and error analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className={`border-primary/30 ${
                compareMode
                  ? "bg-primary/20 text-primary"
                  : "text-slate-400"
              }`}
              onClick={() => setCompareMode(!compareMode)}
            >
              <GitCompare className="h-4 w-4 mr-2" />
              Compare Models
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Model Selection & Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Model A */}
          <Card className="glass border-primary/30 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
                  Model A
                </Badge>
                <h3 className="text-lg font-bold text-primary font-mono">
                  {models[0].name}
                </h3>
                <p className="text-muted-foreground text-sm mt-1 opacity-70">
                  Version {models[0].version} • Deployed {models[0].deployedDate}
                </p>
              </div>
              <Brain className="h-8 w-8 text-primary/50" />
            </div>
            <Separator className="my-4 bg-primary/20" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-primary font-mono">
                  {formatPercent(metricsA.accuracy)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">AUC</p>
                <p className="text-2xl font-bold text-secondary font-mono">
                  {metricsA.auc.toFixed(3)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Latency (p95)</p>
                <p className="text-xl font-bold text-accent font-mono">
                  {metricsA.latencyP95}ms
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Cost/1K</p>
                <p className="text-xl font-bold text-amber-400 font-mono">
                  ${metricsA.costPer1K.toFixed(3)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-xs">Traffic Split</span>
                <span className="text-primary text-sm font-mono">
                  {models[0].trafficSplit}%
                </span>
              </div>
              <Progress value={models[0].trafficSplit} className="h-2" />
            </div>
          </Card>

          {/* Model B */}
          <Card className="glass border-secondary/30 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-2">
                  Model B
                </Badge>
                <h3 className="text-lg font-bold text-secondary font-mono">
                  {models[1].name}
                </h3>
                <p className="text-muted-foreground text-sm mt-1 opacity-70">
                  Version {models[1].version} • Deployed {models[1].deployedDate}
                </p>
              </div>
              <Brain className="h-8 w-8 text-secondary/50" />
            </div>
            <Separator className="my-4 bg-secondary/20" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-primary font-mono">
                  {formatPercent(metricsB.accuracy)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">AUC</p>
                <p className="text-2xl font-bold text-secondary font-mono">
                  {metricsB.auc.toFixed(3)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Latency (p95)</p>
                <p className="text-xl font-bold text-accent font-mono">
                  {metricsB.latencyP95}ms
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Cost/1K</p>
                <p className="text-xl font-bold text-amber-400 font-mono">
                  ${metricsB.costPer1K.toFixed(3)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-xs">Traffic Split</span>
                <span className="text-secondary text-sm font-mono">
                  {models[1].trafficSplit}%
                </span>
              </div>
              <Progress value={models[1].trafficSplit} className="h-2" />
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
                <TabsTrigger value="metrics" className="text-xs sm:text-sm whitespace-nowrap">Metrics</TabsTrigger>
                <TabsTrigger value="confusion" className="text-xs sm:text-sm whitespace-nowrap">Confusion</TabsTrigger>
                <TabsTrigger value="roc" className="text-xs sm:text-sm whitespace-nowrap">ROC & PR</TabsTrigger>
                <TabsTrigger value="features" className="text-xs sm:text-sm whitespace-nowrap">Features</TabsTrigger>
                <TabsTrigger value="errors" className="text-xs sm:text-sm whitespace-nowrap">Errors</TabsTrigger>
                <TabsTrigger value="abtest" className="text-xs sm:text-sm whitespace-nowrap">A/B Test</TabsTrigger>
              </TabsList>
            </div>

            {/* Performance Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass border-primary/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Accuracy</p>
                    <Target className="h-5 w-5 text-primary/50" />
                  </div>
                  <p className="text-3xl font-bold text-primary font-mono">
                    {formatPercent(metricsA.accuracy)}
                  </p>
                  {compareMode && (
                    <p className="text-secondary text-sm mt-2">
                      vs {formatPercent(metricsB.accuracy)}
                    </p>
                  )}
                </Card>

                <Card className="glass border-secondary/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Precision</p>
                    <Percent className="h-5 w-5 text-secondary/50" />
                  </div>
                  <p className="text-3xl font-bold text-secondary font-mono">
                    {formatPercent(metricsA.precision)}
                  </p>
                  {compareMode && (
                    <p className="text-primary text-sm mt-2">
                      vs {formatPercent(metricsB.precision)}
                    </p>
                  )}
                </Card>

                <Card className="glass border-accent/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">Recall</p>
                    <Activity className="h-5 w-5 text-accent/50" />
                  </div>
                  <p className="text-3xl font-bold text-accent font-mono">
                    {formatPercent(metricsA.recall)}
                  </p>
                  {compareMode && (
                    <p className="text-primary text-sm mt-2">
                      vs {formatPercent(metricsB.recall)}
                    </p>
                  )}
                </Card>

                <Card className="glass border-blue-500/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-muted-foreground text-sm">F1-Score</p>
                    <BarChart3 className="h-5 w-5 text-blue-400/50" />
                  </div>
                  <p className="text-3xl font-bold text-blue-400 font-mono">
                    {formatPercent(metricsA.f1Score)}
                  </p>
                  {compareMode && (
                    <p className="text-primary text-sm mt-2">
                      vs {formatPercent(metricsB.f1Score)}
                    </p>
                  )}
                </Card>
              </div>

              {/* Class-level Metrics */}
              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-6">
                  Class-level Performance
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary/30">
                        <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">
                          Class
                        </th>
                        <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">
                          Precision
                        </th>
                        <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">
                          Recall
                        </th>
                        <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">
                          F1-Score
                        </th>
                        <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">
                          Support
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classMetrics.map((metric, idx) => (
                        <tr
                          key={metric.class}
                          className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <Badge
                              className={`${
                                idx === 0
                                  ? "bg-primary/20 text-primary border-primary/30"
                                  : idx === 1
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                              }`}
                            >
                              {metric.class}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right text-secondary font-mono">
                            {formatPercent(metric.precision)}
                          </td>
                          <td className="py-3 px-4 text-right text-accent font-mono">
                            {formatPercent(metric.recall)}
                          </td>
                          <td className="py-3 px-4 text-right text-blue-400 font-mono">
                            {formatPercent(metric.f1)}
                          </td>
                          <td className="py-3 px-4 text-right text-muted-foreground font-mono">
                            {metric.support.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Latency Distribution */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">
                    Latency Percentiles
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "p50 (Median)", valueA: metricsA.latencyP50, valueB: metricsB.latencyP50 },
                      { label: "p95", valueA: metricsA.latencyP95, valueB: metricsB.latencyP95 },
                      { label: "p99", valueA: metricsA.latencyP99, valueB: metricsB.latencyP99 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted-foreground text-sm">{item.label}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-primary text-sm font-mono">
                              {item.valueA}ms
                            </span>
                            {compareMode && (
                              <span className="text-secondary text-sm font-mono">
                                {item.valueB}ms
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Progress value={(item.valueA / 60) * 100} className="h-2 flex-1" />
                          {compareMode && (
                            <Progress value={(item.valueB / 60) * 100} className="h-2 flex-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass border-amber-500/30 p-6">
                  <h3 className="text-lg font-semibold text-amber-400 mb-6">
                    Cost Analysis
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Cost per 1K Inferences</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-primary font-mono mb-1">
                            ${metricsA.costPer1K.toFixed(3)}
                          </p>
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                            Model A
                          </Badge>
                        </div>
                        {compareMode && (
                          <div className="flex-1">
                            <p className="text-2xl font-bold text-secondary font-mono mb-1">
                              ${metricsB.costPer1K.toFixed(3)}
                            </p>
                            <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                              Model B
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator className="bg-amber-500/20" />
                    <div>
                      <p className="text-muted-foreground text-sm mb-3">
                        Estimated Monthly Cost (1M inferences)
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 glass border-primary/30 rounded-lg p-3">
                          <p className="text-xl font-bold text-primary font-mono">
                            ${(metricsA.costPer1K * 1000).toFixed(2)}
                          </p>
                        </div>
                        {compareMode && (
                          <div className="flex-1 glass border-secondary/30 rounded-lg p-3">
                            <p className="text-xl font-bold text-secondary font-mono">
                              ${(metricsB.costPer1K * 1000).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Confusion Matrix Tab */}
            <TabsContent value="confusion" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Confusion Matrix
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Model A • 50,000 test samples
                    </p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    3-Class Classification
                  </Badge>
                </div>

                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    {/* Predicted Label Header */}
                    <div className="flex items-center mb-4">
                      <div className="w-32" />
                      <div className="flex-1 text-center">
                        <p className="text-secondary text-sm font-semibold mb-2">
                          Predicted Label
                        </p>
                        <div className="flex gap-2 justify-center">
                          {classes.map((cls) => (
                            <div key={cls} className="w-32 text-center">
                              <Badge
                                className={`${
                                  cls === "Positive"
                                    ? "bg-primary/20 text-primary border-primary/30"
                                    : cls === "Negative"
                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                    : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                                } text-xs`}
                              >
                                {cls}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Matrix */}
                    <div className="flex">
                      {/* Actual Label */}
                      <div className="w-32 flex flex-col justify-center">
                        <p className="text-accent text-sm font-semibold mb-2 -rotate-90 origin-center">
                          Actual Label
                        </p>
                      </div>

                      {/* Matrix Grid */}
                      <div className="flex-1">
                        {classes.map((actualClass) => (
                          <div key={actualClass} className="flex gap-2 mb-2">
                            {classes.map((predictedClass) => {
                              const count = getConfusionValue(actualClass, predictedClass)
                              const isCorrect = actualClass === predictedClass
                              return (
                                <motion.div
                                  key={`${actualClass}-${predictedClass}`}
                                  whileHover={{ scale: 1.05 }}
                                  className={`w-32 h-32 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                                    isCorrect
                                      ? "glass border-primary/50 border-2"
                                      : "glass-dark border-red-500/30"
                                  }`}
                                >
                                  <p className="text-2xl font-bold text-primary font-mono">
                                    {count.toLocaleString()}
                                  </p>
                                  <p className="text-muted-foreground text-xs mt-1 opacity-70">
                                    {((count / 50000) * 100).toFixed(1)}%
                                  </p>
                                  {isCorrect && (
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-2" />
                                  )}
                                </motion.div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6 bg-primary/20" />

                {/* Insights */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="glass border-primary/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <p className="text-muted-foreground text-sm">True Positives</p>
                    </div>
                    <p className="text-2xl font-bold text-primary font-mono">
                      45,600
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 opacity-70">91.2% of total</p>
                  </div>

                  <div className="glass border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <p className="text-muted-foreground text-sm">False Positives</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-400 font-mono">
                      1,880
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 opacity-70">3.8% of total</p>
                  </div>

                  <div className="glass border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-400" />
                      <p className="text-muted-foreground text-sm">False Negatives</p>
                    </div>
                    <p className="text-2xl font-bold text-red-400 font-mono">
                      2,520
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 opacity-70">5.0% of total</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* ROC & PR Curves Tab */}
            <TabsContent value="roc" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* ROC Curve */}
                <Card className="glass border-primary/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-primary">
                      ROC Curve
                    </h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
                      AUC = {metricsA.auc.toFixed(3)}
                    </Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={rocData}>
                      <defs>
                        <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 84% 39% / 0.1)" />
                      <XAxis
                        dataKey="fpr"
                        label={{
                          value: "False Positive Rate",
                          position: "insideBottom",
                          offset: -5,
                          style: { fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 },
                        }}
                        stroke="hsl(160 84% 39% / 0.5)"
                        tick={{ fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 }}
                      />
                      <YAxis
                        dataKey="tpr"
                        label={{
                          value: "True Positive Rate",
                          angle: -90,
                          position: "insideLeft",
                          style: { fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 },
                        }}
                        stroke="hsl(160 84% 39% / 0.5)"
                        tick={{ fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        formatter={(value: any) => value.toFixed(3)}
                      labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                      {/* Diagonal reference line */}
                      <Line
                        type="linear"
                        data={[
                          { fpr: 0, tpr: 0 },
                          { fpr: 1, tpr: 1 },
                        ]}
                        dataKey="tpr"
                        stroke="hsl(0 0% 50%)"
                        strokeDasharray="5 5"
                        dot={false}
                        strokeWidth={1}
                      />
                      {/* ROC Curve */}
                      <Area
                        type="monotone"
                        dataKey="tpr"
                        stroke="hsl(160 84% 39%)"
                        fill="url(#rocGradient)"
                        strokeWidth={3}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                  <p className="text-muted-foreground text-xs mt-4 text-center">
                    Higher AUC indicates better classification performance
                  </p>
                </Card>

                {/* Precision-Recall Curve */}
                <Card className="glass border-secondary/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-secondary">
                      Precision-Recall Curve
                    </h3>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-mono">
                      AP = 0.942
                    </Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={prData}>
                      <defs>
                        <linearGradient id="prGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(186 77% 47%)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(186 77% 47%)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(186 77% 47% / 0.1)" />
                      <XAxis
                        dataKey="recall"
                        label={{
                          value: "Recall",
                          position: "insideBottom",
                          offset: -5,
                          style: { fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 },
                        }}
                        stroke="hsl(186 77% 47% / 0.5)"
                        tick={{ fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 }}
                      />
                      <YAxis
                        dataKey="precision"
                        label={{
                          value: "Precision",
                          angle: -90,
                          position: "insideLeft",
                          style: { fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 },
                        }}
                        stroke="hsl(186 77% 47% / 0.5)"
                        tick={{ fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(186 77% 47% / 0.3)",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        formatter={(value: any) => value.toFixed(3)}
                      labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
                      <Area
                        type="monotone"
                        dataKey="precision"
                        stroke="hsl(186 77% 47%)"
                        fill="url(#prGradient)"
                        strokeWidth={3}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                  <p className="text-muted-foreground text-xs mt-4 text-center">
                    Shows precision-recall tradeoff across thresholds
                  </p>
                </Card>
              </div>

              {/* Threshold Optimization */}
              <Card className="glass border-accent/30 p-6">
                <h3 className="text-lg font-semibold text-accent mb-6">
                  Optimal Threshold Selection
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="glass border-primary/30 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-5 w-5 text-primary" />
                      <p className="text-muted-foreground text-sm">Balanced</p>
                    </div>
                    <p className="text-2xl font-bold text-primary font-mono mb-2">
                      0.50
                    </p>
                    <p className="text-muted-foreground text-xs opacity-70">
                      Maximizes F1-Score: {formatPercent(metricsA.f1Score)}
                    </p>
                  </div>

                  <div className="glass border-secondary/30 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Gauge className="h-5 w-5 text-secondary" />
                      <p className="text-muted-foreground text-sm">High Precision</p>
                    </div>
                    <p className="text-2xl font-bold text-secondary font-mono mb-2">
                      0.75
                    </p>
                    <p className="text-muted-foreground text-xs opacity-70">
                      Reduces false positives by 65%
                    </p>
                  </div>

                  <div className="glass border-blue-500/30 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-5 w-5 text-blue-400" />
                      <p className="text-muted-foreground text-sm">High Recall</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-400 font-mono mb-2">
                      0.25
                    </p>
                    <p className="text-muted-foreground text-xs opacity-70">
                      Reduces false negatives by 72%
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Feature Importance Tab */}
            <TabsContent value="features" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Feature Importance (SHAP Values)
                  </h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Top 10 Features
                  </Badge>
                </div>

                <div className="space-y-4">
                  {featureImportance.map((feature, idx) => (
                    <motion.div
                      key={feature.feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-primary/20 text-primary border-primary/30 w-8 h-8 flex items-center justify-center rounded-full">
                            {idx + 1}
                          </Badge>
                          <p className="text-foreground font-mono text-sm">
                            {feature.feature}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-secondary text-sm font-mono">
                            {feature.importance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Progress
                            value={feature.importance * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Feature Importance Comparison */}
              <Card className="glass border-secondary/30 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-6">
                  Importance vs SHAP Values
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={featureImportance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 84% 39% / 0.1)" />
                    <XAxis type="number" stroke="hsl(160 84% 39% / 0.5)" tick={{ fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      width={150}
                      stroke="hsl(160 84% 39% / 0.5)"
                      tick={{ fill: "hsl(160 84% 95% / 0.6)", fontSize: 11 }}
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
                      cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                    />
                    <Legend />
                    <Bar dataKey="importance" fill="hsl(160 84% 39%)" name="Permutation Importance" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="shap" fill="hsl(186 77% 47%)" name="SHAP Value" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Error Analysis Tab */}
            <TabsContent value="errors" className="space-y-6">
              {/* Confidence Distribution */}
              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-6">
                  Prediction Confidence Distribution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={confidenceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 84% 39% / 0.1)" />
                    <XAxis
                      dataKey="range"
                      stroke="hsl(160 84% 39% / 0.5)"
                      tick={{ fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 }}
                      label={{
                        value: "Confidence Score",
                        position: "insideBottom",
                        offset: -5,
                        style: { fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 },
                      }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="hsl(160 84% 39% / 0.5)"
                      tick={{ fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 }}
                      label={{
                        value: "Count",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 },
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(186 77% 47% / 0.5)"
                      tick={{ fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 }}
                      label={{
                        value: "Accuracy",
                        angle: 90,
                        position: "insideRight",
                        style: { fill: "hsl(160 84% 95% / 0.6)", fontSize: 12 },
                      }}
                      domain={[0, 1]}
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
                    <Bar yAxisId="left" dataKey="count" fill="hsl(160 84% 39%)" name="Predictions" radius={[4, 4, 0, 0]} />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="accuracy"
                      stroke="hsl(186 77% 47%)"
                      strokeWidth={2}
                      name="Accuracy"
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                <p className="text-slate-400 text-xs mt-4 text-center">
                  Well-calibrated models show increasing accuracy with higher confidence
                </p>
              </Card>

              {/* Error Samples */}
              <Card className="glass border-red-500/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-red-400">
                    Misclassification Examples
                  </h3>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {errorSamples.length} Errors
                  </Badge>
                </div>

                <div className="space-y-4">
                  {errorSamples.map((sample, idx) => (
                    <motion.div
                      key={sample.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass-dark border-red-500/30 rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-foreground text-sm flex-1">
                          &quot;{sample.text}&quot;
                        </p>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 ml-4">
                          {(sample.confidence * 100).toFixed(0)}% conf
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground text-xs">True:</span>
                          <Badge
                            className={`${
                              sample.trueLabel === "Positive"
                                ? "bg-primary/20 text-primary border-primary/30"
                                : sample.trueLabel === "Negative"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                            } text-xs`}
                          >
                            {sample.trueLabel}
                          </Badge>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-60" />
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-400" />
                          <span className="text-muted-foreground text-xs">Predicted:</span>
                          <Badge
                            className={`${
                              sample.predictedLabel === "Positive"
                                ? "bg-primary/20 text-primary border-primary/30"
                                : sample.predictedLabel === "Negative"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                            } text-xs`}
                          >
                            {sample.predictedLabel}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* A/B Test Results Tab */}
            <TabsContent value="abtest" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      A/B Test Summary
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      50,000 samples per model • 7-day test period
                    </p>
                  </div>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                    Model B Winner (3/4 metrics)
                  </Badge>
                </div>

                <div className="space-y-4">
                  {abTestResults.map((result, idx) => (
                    <motion.div
                      key={result.metric}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass border-primary/30 rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-primary font-semibold mb-1">
                            {result.metric}
                          </h4>
                          <div className="flex items-center gap-3">
                            {getSignificanceBadge(result.pValue)}
                            {getWinnerBadge(result.winner)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="glass-dark border-primary/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                              Model A
                            </Badge>
                            {result.winner === "Model A" && (
                              <ThumbsUp className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-2xl font-bold text-primary font-mono">
                            {typeof result.modelA === "number" && result.modelA < 1
                              ? formatPercent(result.modelA)
                              : result.modelA}
                          </p>
                        </div>

                        <div className="glass-dark border-secondary/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                              Model B
                            </Badge>
                            {result.winner === "Model B" && (
                              <ThumbsUp className="h-4 w-4 text-secondary" />
                            )}
                          </div>
                          <p className="text-2xl font-bold text-secondary font-mono">
                            {typeof result.modelB === "number" && result.modelB < 1
                              ? formatPercent(result.modelB)
                              : result.modelB}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">
                          Improvement:{" "}
                          {result.winner === "Model B"
                            ? `+${(
                                ((result.modelB - result.modelA) / result.modelA) *
                                100
                              ).toFixed(1)}%`
                            : result.winner === "Model A"
                            ? `+${(
                                ((result.modelA - result.modelB) / result.modelB) *
                                100
                              ).toFixed(1)}%`
                            : "N/A"}
                        </span>
                        <span className="text-muted-foreground text-xs font-mono opacity-70">
                          p = {result.pValue.toFixed(3)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-6 bg-primary/20" />

                {/* Recommendation */}
                <div className="glass border-secondary/50 border-2 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="glass bg-secondary/20 rounded-full p-3">
                      <Award className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-secondary mb-2">
                        Recommendation
                      </h4>
                      <p className="text-foreground text-sm mb-4">
                        <strong className="text-secondary">Model B (v4.0)</strong> shows
                        statistically significant improvements in accuracy (p &lt; 0.05)
                        and F1-score (p &lt; 0.05). Despite slightly higher latency and
                        cost, the 0.7% accuracy gain justifies full rollout for
                        quality-critical applications.
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/80 text-white border-0"
                        >
                          <ChevronRight className="h-4 w-4 mr-1" />
                          Promote to 100% Traffic
                        </Button>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          Expected ROI: +15% user satisfaction
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
