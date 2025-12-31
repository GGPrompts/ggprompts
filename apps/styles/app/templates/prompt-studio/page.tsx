"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code,
  Copy,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  GitCompare,
  Hash,
  History,
  Layers,
  LineChart,
  Percent,
  Play,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Sparkles,
  Target,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Wand2,
  Zap,
  FileCode,
  MessageSquare,
  Lightbulb,
  XCircle,
} from "lucide-react"
import { Card, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress, Separator, Textarea, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Slider, ScrollArea } from "@ggprompts/ui"
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
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
interface ModelConfig {
  id: string
  name: string
  provider: string
  maxTokens: number
  costPerInputToken: number
  costPerOutputToken: number
}

interface PromptVersion {
  id: string
  content: string
  timestamp: number
  metrics?: ResponseMetrics
}

interface ResponseMetrics {
  length: number
  words: number
  tokens: number
  sentiment: "positive" | "neutral" | "negative"
  readability: number
  latency: number
  cost: number
}

interface TestResponse {
  id: string
  content: string
  metrics: ResponseMetrics
  rating?: number
  feedback?: string
}

interface EvaluationCriterion {
  name: string
  weight: number
  score: number
  maxScore: number
}

interface ABTestVariant {
  id: string
  name: string
  prompt: string
  responses: number
  avgScore: number
  avgCost: number
  avgLatency: number
}

interface PromptTemplate {
  id: string
  name: string
  category: string
  prompt: string
  description: string
}

export default function PromptStudio() {
  // Prompt State
  const [prompt, setPrompt] = useState(
    `You are a helpful AI assistant with expertise in software development and technical writing.

Task: Analyze the provided code and suggest improvements for:
- Performance optimization
- Code readability
- Best practices
- Error handling

Provide concrete examples with explanations.`
  )

  const [selectedModel, setSelectedModel] = useState("gpt-4-turbo")

  // Model Configurations
  const [models] = useState<ModelConfig[]>([
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      provider: "OpenAI",
      maxTokens: 4096,
      costPerInputToken: 0.01 / 1000,
      costPerOutputToken: 0.03 / 1000,
    },
    {
      id: "claude-3-opus",
      name: "Claude 3 Opus",
      provider: "Anthropic",
      maxTokens: 4096,
      costPerInputToken: 0.015 / 1000,
      costPerOutputToken: 0.075 / 1000,
    },
    {
      id: "claude-3-sonnet",
      name: "Claude 3 Sonnet",
      provider: "Anthropic",
      maxTokens: 4096,
      costPerInputToken: 0.003 / 1000,
      costPerOutputToken: 0.015 / 1000,
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      provider: "Google",
      maxTokens: 2048,
      costPerInputToken: 0.00025 / 1000,
      costPerOutputToken: 0.0005 / 1000,
    },
  ])

  // Model Parameters
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [topP, setTopP] = useState(1.0)
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0)
  const [presencePenalty, setPresencePenalty] = useState(0.0)

  // Test Responses
  const [responses, setResponses] = useState<TestResponse[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [numResponses, setNumResponses] = useState(3)

  // Prompt History
  const [promptHistory, setPromptHistory] = useState<PromptVersion[]>([
    {
      id: "v1",
      content: "Write a function to sort an array",
      timestamp: Date.now() - 7200000,
    },
    {
      id: "v2",
      content:
        "Write an efficient sorting function with O(n log n) complexity",
      timestamp: Date.now() - 3600000,
    },
    {
      id: "v3",
      content: prompt,
      timestamp: Date.now(),
    },
  ])

  // Evaluation Criteria
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>([
    { name: "Accuracy", weight: 0.3, score: 8.5, maxScore: 10 },
    { name: "Clarity", weight: 0.25, score: 9.0, maxScore: 10 },
    { name: "Completeness", weight: 0.2, score: 7.8, maxScore: 10 },
    { name: "Format", weight: 0.15, score: 9.2, maxScore: 10 },
    { name: "Tone", weight: 0.1, score: 8.7, maxScore: 10 },
  ])

  // A/B Test Variants
  const [abVariants, setABVariants] = useState<ABTestVariant[]>([
    {
      id: "variant-a",
      name: "Direct Instruction",
      prompt: "Analyze this code and provide improvements.",
      responses: 50,
      avgScore: 7.8,
      avgCost: 0.042,
      avgLatency: 3.2,
    },
    {
      id: "variant-b",
      name: "Chain-of-Thought",
      prompt:
        "Let's analyze this code step by step:\n1. First, identify issues\n2. Then, suggest improvements\n3. Finally, provide examples",
      responses: 50,
      avgScore: 8.4,
      avgCost: 0.051,
      avgLatency: 4.1,
    },
  ])

  // Prompt Templates
  const [templates] = useState<PromptTemplate[]>([
    {
      id: "code-review",
      name: "Code Review",
      category: "Development",
      prompt:
        "Review the following code and provide feedback on:\n- Code quality\n- Performance\n- Security\n- Best practices",
      description: "Comprehensive code review template",
    },
    {
      id: "summarization",
      name: "Text Summarization",
      category: "Content",
      prompt:
        "Summarize the following text in {{length}} sentences. Focus on key points and maintain factual accuracy.",
      description: "Structured summarization with length control",
    },
    {
      id: "translation",
      name: "Translation",
      category: "Language",
      prompt:
        "Translate the following text from {{source_lang}} to {{target_lang}}. Maintain tone and context.",
      description: "Language translation with context preservation",
    },
  ])

  // Metrics Summary
  const [metricsSummary, setMetricsSummary] = useState({
    totalTests: 147,
    avgScore: 8.4,
    avgCost: 0.046,
    avgLatency: 3.7,
    totalSpent: 6.76,
  })

  // Performance History
  const [performanceHistory] = useState([
    { version: "v1", score: 6.2, cost: 0.038, latency: 2.8 },
    { version: "v2", score: 7.5, cost: 0.044, latency: 3.4 },
    { version: "v3", score: 8.1, cost: 0.048, latency: 3.9 },
    { version: "v4", score: 8.4, cost: 0.046, latency: 3.7 },
  ])

  // Generate test responses
  const generateResponses = () => {
    setIsGenerating(true)

    setTimeout(() => {
      const newResponses: TestResponse[] = []

      for (let i = 0; i < numResponses; i++) {
        const responseLength = Math.floor(Math.random() * 300 + 200)
        const words = Math.floor(responseLength / 5)
        const tokens = Math.floor(words * 1.3)

        const inputTokens = Math.floor(prompt.length / 4)
        const outputTokens = tokens

        const currentModel = models.find((m) => m.id === selectedModel)!
        const cost =
          inputTokens * currentModel.costPerInputToken +
          outputTokens * currentModel.costPerOutputToken

        newResponses.push({
          id: `resp-${Date.now()}-${i}`,
          content: `This is a simulated response ${i + 1} with analysis and recommendations. The response would contain detailed feedback on code quality, performance optimization suggestions, and best practice recommendations...`,
          metrics: {
            length: responseLength,
            words,
            tokens,
            sentiment: ["positive", "neutral", "negative"][
              Math.floor(Math.random() * 3)
            ] as any,
            readability: Math.random() * 30 + 60,
            latency: Math.random() * 3 + 2,
            cost,
          },
          rating: Math.floor(Math.random() * 3 + 7),
        })
      }

      setResponses(newResponses)
      setIsGenerating(false)

      // Update metrics
      setMetricsSummary((prev) => ({
        totalTests: prev.totalTests + numResponses,
        avgScore:
          (prev.avgScore * prev.totalTests +
            newResponses.reduce((sum, r) => sum + (r.rating || 0), 0)) /
          (prev.totalTests + numResponses),
        avgCost:
          (prev.avgCost * prev.totalTests +
            newResponses.reduce((sum, r) => sum + r.metrics.cost, 0)) /
          (prev.totalTests + numResponses),
        avgLatency:
          (prev.avgLatency * prev.totalTests +
            newResponses.reduce((sum, r) => sum + r.metrics.latency, 0)) /
          (prev.totalTests + numResponses),
        totalSpent:
          prev.totalSpent +
          newResponses.reduce((sum, r) => sum + r.metrics.cost, 0),
      }))
    }, 2000)
  }

  // Save prompt version
  const savePromptVersion = () => {
    const newVersion: PromptVersion = {
      id: `v${promptHistory.length + 1}`,
      content: prompt,
      timestamp: Date.now(),
    }
    setPromptHistory([...promptHistory, newVersion])
  }

  // Calculate weighted score
  const calculateWeightedScore = (): number => {
    return criteria.reduce(
      (sum, criterion) =>
        sum + (criterion.score / criterion.maxScore) * criterion.weight * 100,
      0
    )
  }

  // Export code snippets
  const exportCode = (lang: "python" | "javascript" | "curl") => {
    const currentModel = models.find((m) => m.id === selectedModel)!

    switch (lang) {
      case "python":
        return `import openai\n\nresponse = openai.ChatCompletion.create(\n  model="${currentModel.id}",\n  messages=[\n    {"role": "system", "content": "${prompt.replace(/\n/g, "\\n")}"},\n    {"role": "user", "content": "Your input here"}\n  ],\n  temperature=${temperature},\n  max_tokens=${maxTokens}\n)`

      case "javascript":
        return `const response = await fetch('https://api.openai.com/v1/chat/completions', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_API_KEY',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    model: '${currentModel.id}',\n    messages: [\n      { role: 'system', content: '${prompt.replace(/\n/g, "\\n")}' },\n      { role: 'user', content: 'Your input here' }\n    ],\n    temperature: ${temperature},\n    max_tokens: ${maxTokens}\n  })\n});`

      case "curl":
        return `curl https://api.openai.com/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d '{\n    "model": "${currentModel.id}",\n    "messages": [\n      {"role": "system", "content": "${prompt.replace(/\n/g, "\\n")}"},\n      {"role": "user", "content": "Your input here"}\n    ],\n    "temperature": ${temperature},\n    "max_tokens": ${maxTokens}\n  }'`
    }
  }

  const currentModel = models.find((m) => m.id === selectedModel)!
  const weightedScore = calculateWeightedScore()

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
            <h1 className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Prompt Engineering Studio
            </h1>
            <p className="text-muted-foreground mt-2">
              Test, optimize, and evaluate prompts across models
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
              onClick={savePromptVersion}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Version
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </motion.div>

        {/* Metrics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <Card className="glass border-primary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Total Tests</p>
              <Hash className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-3xl font-bold text-primary font-mono">
              {metricsSummary.totalTests}
            </p>
          </Card>

          <Card className="glass border-secondary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Avg Score</p>
              <Award className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">
              {metricsSummary.avgScore.toFixed(1)}
            </p>
          </Card>

          <Card className="glass border-accent/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Avg Latency</p>
              <Clock className="h-5 w-5 text-accent/50" />
            </div>
            <p className="text-3xl font-bold text-accent font-mono">
              {metricsSummary.avgLatency.toFixed(1)}s
            </p>
          </Card>

          <Card className="glass border-blue-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Avg Cost</p>
              <DollarSign className="h-5 w-5 text-blue-400/50" />
            </div>
            <p className="text-3xl font-bold text-blue-400 font-mono">
              ${metricsSummary.avgCost.toFixed(3)}
            </p>
          </Card>

          <Card className="glass border-amber-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Total Spent</p>
              <DollarSign className="h-5 w-5 text-amber-400/50" />
            </div>
            <p className="text-3xl font-bold text-amber-400 font-mono">
              ${metricsSummary.totalSpent.toFixed(2)}
            </p>
          </Card>
        </motion.div>

        {/* Main Studio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Left Panel: Prompt Editor */}
          <div className="space-y-6">
            {/* Prompt Editor */}
            <Card className="glass border-primary/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">
                  Prompt Editor
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30 font-mono text-xs">
                    v{promptHistory.length}
                  </Badge>
                </div>
              </div>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[300px] font-mono text-sm glass-dark border-primary/30 resize-none"
                placeholder="Enter your prompt here..."
              />

              <div className="flex items-center gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/30 text-primary"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Optimize
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-secondary/30 text-secondary"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Suggestions
                </Button>
              </div>
            </Card>

            {/* Model Configuration */}
            <Card className="glass border-secondary/30 p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">
                Model Configuration
              </h3>

              <div className="space-y-4">
                {/* Model Selection */}
                <div>
                  <Label className="text-muted-foreground text-sm mb-2 block">
                    Model
                  </Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="glass-dark border-secondary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name} ({model.provider})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-muted-foreground/70">Max: {currentModel.maxTokens} tokens</span>
                    <span className="text-amber-400 font-mono">
                      In: ${(currentModel.costPerInputToken * 1000).toFixed(3)}/1K
                      • Out: ${(currentModel.costPerOutputToken * 1000).toFixed(3)}/1K
                    </span>
                  </div>
                </div>

                {/* Temperature */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-muted-foreground text-sm">Temperature</Label>
                    <span className="text-primary font-mono text-sm">
                      {temperature.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[temperature]}
                    onValueChange={(val) => setTemperature(val[0])}
                    min={0}
                    max={2}
                    step={0.1}
                    className="my-2"
                  />
                  <p className="text-muted-foreground/70 text-xs">
                    Higher = more creative, Lower = more focused
                  </p>
                </div>

                {/* Max Tokens */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-muted-foreground text-sm">Max Tokens</Label>
                    <span className="text-secondary font-mono text-sm">
                      {maxTokens}
                    </span>
                  </div>
                  <Slider
                    value={[maxTokens]}
                    onValueChange={(val) => setMaxTokens(val[0])}
                    min={256}
                    max={4096}
                    step={256}
                    className="my-2"
                  />
                </div>

                {/* Top P */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-muted-foreground text-sm">Top P</Label>
                    <span className="text-accent font-mono text-sm">
                      {topP.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[topP]}
                    onValueChange={(val) => setTopP(val[0])}
                    min={0}
                    max={1}
                    step={0.05}
                    className="my-2"
                  />
                </div>

                {/* Number of Responses */}
                <div>
                  <Label className="text-muted-foreground text-sm mb-2 block">
                    Number of Responses
                  </Label>
                  <Select
                    value={numResponses.toString()}
                    onValueChange={(val) => setNumResponses(parseInt(val))}
                  >
                    <SelectTrigger className="glass-dark border-secondary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 10].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} Response{n > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={generateResponses}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Generate Responses
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* Right Panel: Results & Analytics */}
          <div className="space-y-6">
            {/* Test Responses */}
            <Card className="glass border-primary/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">
                  Test Responses
                </h3>
                {responses.length > 0 && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {responses.length} Generated
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-[540px]">
                {responses.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No responses yet</p>
                    <p className="text-muted-foreground/70 text-sm mt-1">
                      Click "Generate Responses" to test your prompt
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pr-4">
                    {responses.map((response, idx) => (
                      <motion.div
                        key={response.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="glass-dark border-primary/30 rounded-lg p-5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                            Response #{idx + 1}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                            >
                              <ThumbsUp className="h-4 w-4 text-primary" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                            >
                              <ThumbsDown className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-foreground/90 text-sm mb-4">
                          {response.content}
                        </p>

                        <Separator className="my-3 bg-primary/20" />

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-muted-foreground text-xs">Length</p>
                            <p className="text-primary font-mono text-sm">
                              {response.metrics.words} words
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Tokens</p>
                            <p className="text-secondary font-mono text-sm">
                              {response.metrics.tokens}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Latency</p>
                            <p className="text-accent font-mono text-sm">
                              {response.metrics.latency.toFixed(1)}s
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Cost</p>
                            <p className="text-amber-400 font-mono text-sm">
                              ${response.metrics.cost.toFixed(4)}
                            </p>
                          </div>
                        </div>

                        {response.rating && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-muted-foreground text-xs">Rating</span>
                              <span className="text-primary font-mono text-sm">
                                {response.rating}/10
                              </span>
                            </div>
                            <Progress value={response.rating * 10} className="h-1.5" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </motion.div>

        {/* Advanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="evaluation" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="w-max md:w-auto glass border-primary/30">
                <TabsTrigger value="evaluation" className="text-xs sm:text-sm whitespace-nowrap">Evaluation</TabsTrigger>
                <TabsTrigger value="abtest" className="text-xs sm:text-sm whitespace-nowrap">A/B Testing</TabsTrigger>
                <TabsTrigger value="history" className="text-xs sm:text-sm whitespace-nowrap">Version History</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs sm:text-sm whitespace-nowrap">Templates</TabsTrigger>
                <TabsTrigger value="export" className="text-xs sm:text-sm whitespace-nowrap">Export</TabsTrigger>
              </TabsList>
            </div>

            {/* Evaluation Tab */}
            <TabsContent value="evaluation" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Evaluation Criteria */}
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-primary mb-6">
                    Evaluation Criteria
                  </h3>
                  <div className="space-y-4">
                    {criteria.map((criterion, idx) => (
                      <div key={criterion.name}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-300 text-sm">
                              {criterion.name}
                            </span>
                            <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                              {(criterion.weight * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <span className="text-primary font-mono text-sm">
                            {criterion.score}/{criterion.maxScore}
                          </span>
                        </div>
                        <Progress
                          value={(criterion.score / criterion.maxScore) * 100}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6 bg-primary/20" />

                  <div className="glass-dark border-primary/50 border-2 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">
                          Weighted Score
                        </p>
                        <p className="text-3xl font-bold text-primary font-mono">
                          {weightedScore.toFixed(1)}%
                        </p>
                      </div>
                      <Award className="h-12 w-12 text-primary/50" />
                    </div>
                  </div>
                </Card>

                {/* Criteria Radar Chart */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">
                    Performance Radar
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={criteria}>
                      <PolarGrid stroke="hsl(160 84% 39% / 0.2)" />
                      <PolarAngleAxis
                        dataKey="name"
                        stroke="hsl(160 84% 39% / 0.5)"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        stroke="hsl(160 84% 39% / 0.5)"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        strokeWidth={2}
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
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            {/* A/B Testing Tab */}
            <TabsContent value="abtest" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    A/B Test Results
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/30 text-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Variant
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {abVariants.map((variant, idx) => (
                    <motion.div
                      key={variant.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className={`glass-dark rounded-lg p-6 ${
                        idx === 0
                          ? "border-primary/30"
                          : "border-secondary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge
                            className={`${
                              idx === 0
                                ? "bg-primary/20 text-primary border-primary/30"
                                : "bg-secondary/20 text-secondary border-secondary/30"
                            } mb-2`}
                          >
                            Variant {String.fromCharCode(65 + idx)}
                          </Badge>
                          <h4 className="text-lg font-bold text-foreground">
                            {variant.name}
                          </h4>
                        </div>
                        {variant.avgScore > abVariants[(idx + 1) % 2].avgScore && (
                          <Award className="h-6 w-6 text-amber-400" />
                        )}
                      </div>

                      <div className="glass border-border rounded-lg p-3 mb-4">
                        <p className="text-muted-foreground text-xs font-mono">
                          {variant.prompt}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground text-xs">Avg Score</p>
                          <p className="text-primary font-mono text-lg">
                            {variant.avgScore.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Responses</p>
                          <p className="text-secondary font-mono text-lg">
                            {variant.responses}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Avg Latency</p>
                          <p className="text-accent font-mono text-lg">
                            {variant.avgLatency.toFixed(1)}s
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Avg Cost</p>
                          <p className="text-amber-400 font-mono text-lg">
                            ${variant.avgCost.toFixed(3)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-6 bg-primary/20" />

                {/* Statistical Significance */}
                <div className="glass border-secondary/50 border-2 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="glass bg-secondary/20 rounded-full p-3">
                      <Award className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-secondary mb-2">
                        Winner: Variant B
                      </h4>
                      <p className="text-slate-300 text-sm mb-3">
                        Variant B (Chain-of-Thought) shows 7.7% improvement in
                        average score with statistical significance (p &lt; 0.05).
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          +7.7% quality
                        </Badge>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          +21% cost
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          +28% latency
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Version History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Prompt Version History
                  </h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {promptHistory.length} Versions
                  </Badge>
                </div>

                <div className="space-y-4">
                  {promptHistory.map((version, idx) => (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`glass-dark rounded-lg p-5 ${
                        idx === promptHistory.length - 1
                          ? "border-primary/50 border-2"
                          : "border-primary/20"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-mono">
                            {version.id}
                          </Badge>
                          {idx === promptHistory.length - 1 && (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="h-4 w-4 text-secondary" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                          >
                            <Copy className="h-4 w-4 text-primary" />
                          </Button>
                        </div>
                      </div>

                      <div className="glass border-border rounded-lg p-3 mb-3">
                        <p className="text-foreground/90 text-sm font-mono line-clamp-3">
                          {version.content}
                        </p>
                      </div>

                      <p className="text-muted-foreground text-xs">
                        {new Date(version.timestamp).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Performance Chart */}
                <Separator className="my-6 bg-primary/20" />

                <div>
                  <h4 className="text-md font-semibold text-secondary mb-4">
                    Performance Trends
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsLineChart data={performanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 84% 39% / 0.1)" />
                      <XAxis
                        dataKey="version"
                        stroke="hsl(160 84% 39% / 0.5)"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="hsl(160 84% 39% / 0.5)"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
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
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Quality Score"
                      />
                      <Line
                        type="monotone"
                        dataKey="latency"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        name="Latency (s)"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Prompt Templates
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/30 text-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {templates.map((template, idx) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass-dark border-primary/30 rounded-lg p-5 cursor-pointer hover:border-primary/50 transition-all"
                      onClick={() => setPrompt(template.prompt)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <h4 className="text-md font-bold text-primary mb-2">
                        {template.name}
                      </h4>
                      <p className="text-muted-foreground text-xs mb-3">
                        {template.description}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-primary/30 text-primary text-xs"
                      >
                        Use Template
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Python */}
                <Card className="glass border-primary/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-primary">
                      Python
                    </h3>
                    <Terminal className="h-6 w-6 text-primary/50" />
                  </div>
                  <div className="glass-dark border-primary/20 rounded-lg p-4 mb-4">
                    <code className="text-xs text-foreground/90 font-mono block overflow-x-auto">
                      {exportCode("python")}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-primary/30 text-primary"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </Card>

                {/* JavaScript */}
                <Card className="glass border-secondary/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary">
                      JavaScript
                    </h3>
                    <Code className="h-6 w-6 text-secondary/50" />
                  </div>
                  <div className="glass-dark border-secondary/20 rounded-lg p-4 mb-4">
                    <code className="text-xs text-foreground/90 font-mono block overflow-x-auto">
                      {exportCode("javascript")}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-secondary/30 text-secondary"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </Card>

                {/* cURL */}
                <Card className="glass border-accent/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-accent">cURL</h3>
                    <FileCode className="h-6 w-6 text-accent/50" />
                  </div>
                  <div className="glass-dark border-accent/20 rounded-lg p-4 mb-4">
                    <code className="text-xs text-foreground/90 font-mono block overflow-x-auto">
                      {exportCode("curl")}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-accent/30 text-accent"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
