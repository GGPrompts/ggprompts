"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ScatterChart as ScatterChartIcon,
  Activity,
  Download,
  Upload,
  Copy,
  Code2,
  Palette,
  Settings2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  FolderOpen,
  Share2,
  Database,
  FileJson,
  FileCode,
  Check,
  Eye,
  EyeOff,
  AreaChart as AreaChartIcon,
  Plus,
  Sparkles,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, Button, Input, Label, Textarea, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Switch, Slider, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ggprompts/ui"

// Types
interface DataPoint {
  [key: string]: string | number
}

interface ChartConfig {
  type: ChartType
  xAxis: string
  yAxis: string[]
  title: string
  xLabel: string
  yLabel: string
  showLegend: boolean
  showGrid: boolean
  showDataLabels: boolean
  colorScheme: string
  fillOpacity: number
  lineStyle: "solid" | "dashed" | "dotted"
  pointShape: "circle" | "square" | "triangle"
  fontSize: number
  animated: boolean
}

type ChartType = "line" | "bar" | "area" | "pie" | "scatter" | "radar" | "composed"

interface SavedTemplate {
  id: string
  name: string
  config: ChartConfig
  data: DataPoint[]
  category: string
}

// Sample datasets
const SAMPLE_DATASETS = {
  sales: {
    name: "Monthly Sales Data",
    data: [
      { month: "Jan", productA: 4000, productB: 2400, productC: 2400 },
      { month: "Feb", productA: 3000, productB: 1398, productC: 2210 },
      { month: "Mar", productA: 2000, productB: 9800, productC: 2290 },
      { month: "Apr", productA: 2780, productB: 3908, productC: 2000 },
      { month: "May", productA: 1890, productB: 4800, productC: 2181 },
      { month: "Jun", productA: 2390, productB: 3800, productC: 2500 },
      { month: "Jul", productA: 3490, productB: 4300, productC: 2100 },
      { month: "Aug", productA: 4000, productB: 2400, productC: 2400 },
      { month: "Sep", productA: 3000, productB: 1398, productC: 2210 },
      { month: "Oct", productA: 2000, productB: 9800, productC: 2290 },
      { month: "Nov", productA: 2780, productB: 3908, productC: 2000 },
      { month: "Dec", productA: 3490, productB: 4300, productC: 2100 },
    ],
  },
  weather: {
    name: "Weather Data",
    data: [
      { day: "Mon", temperature: 22, humidity: 65, rainfall: 0 },
      { day: "Tue", temperature: 24, humidity: 62, rainfall: 0 },
      { day: "Wed", temperature: 20, humidity: 78, rainfall: 12 },
      { day: "Thu", temperature: 18, humidity: 82, rainfall: 25 },
      { day: "Fri", temperature: 21, humidity: 70, rainfall: 5 },
      { day: "Sat", temperature: 25, humidity: 58, rainfall: 0 },
      { day: "Sun", temperature: 27, humidity: 55, rainfall: 0 },
    ],
  },
  stocks: {
    name: "Stock Prices",
    data: [
      { date: "2024-01", apple: 180, google: 140, microsoft: 420 },
      { date: "2024-02", apple: 185, google: 145, microsoft: 425 },
      { date: "2024-03", apple: 175, google: 142, microsoft: 415 },
      { date: "2024-04", apple: 190, google: 150, microsoft: 430 },
      { date: "2024-05", apple: 195, google: 155, microsoft: 435 },
      { date: "2024-06", apple: 188, google: 148, microsoft: 428 },
    ],
  },
  revenue: {
    name: "Revenue by Region",
    data: [
      { region: "North America", revenue: 45000, customers: 1200 },
      { region: "Europe", revenue: 38000, customers: 980 },
      { region: "Asia Pacific", revenue: 52000, customers: 1450 },
      { region: "Latin America", revenue: 22000, customers: 650 },
      { region: "Middle East", revenue: 18000, customers: 420 },
      { region: "Africa", revenue: 12000, customers: 280 },
    ],
  },
  performance: {
    name: "Performance Metrics",
    data: [
      { metric: "Speed", value: 85, target: 90 },
      { metric: "Reliability", value: 92, target: 95 },
      { metric: "Scalability", value: 78, target: 85 },
      { metric: "Security", value: 95, target: 98 },
      { metric: "Usability", value: 88, target: 90 },
      { metric: "Cost Efficiency", value: 75, target: 80 },
    ],
  },
}

// Color schemes
const COLOR_SCHEMES = {
  terminal: ["#10b981", "#06b6d4", "#f59e0b"],
  ocean: ["#0ea5e9", "#06b6d4", "#22d3ee"],
  sunset: ["#f59e0b", "#f97316", "#ef4444"],
  forest: ["#10b981", "#22c55e", "#84cc16"],
  purple: ["#a855f7", "#c084fc", "#e879f9"],
  monochrome: ["#64748b", "#94a3b8", "#cbd5e1"],
  rainbow: ["#ef4444", "#f59e0b", "#22c55e", "#06b6d4", "#a855f7", "#ec4899"],
  professional: ["#3b82f6", "#8b5cf6", "#ec4899"],
}

export default function DataVizStudio() {
  // State
  const [data, setData] = useState<DataPoint[]>(SAMPLE_DATASETS.sales.data)
  const [rawData, setRawData] = useState(JSON.stringify(SAMPLE_DATASETS.sales.data, null, 2))
  const [config, setConfig] = useState<ChartConfig>({
    type: "line",
    xAxis: "month",
    yAxis: ["productA", "productB", "productC"],
    title: "Q4 Sales Performance",
    xLabel: "Month",
    yLabel: "Sales ($)",
    showLegend: true,
    showGrid: true,
    showDataLabels: false,
    colorScheme: "terminal",
    fillOpacity: 20,
    lineStyle: "solid",
    pointShape: "circle",
    fontSize: 12,
    animated: true,
  })
  const [activeTab, setActiveTab] = useState("data")
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [showCode, setShowCode] = useState(false)
  const [codeLanguage, setCodeLanguage] = useState("react")
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])
  const [dataError, setDataError] = useState("")
  const chartRef = useRef<HTMLDivElement>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("viz-studio-templates")
    if (saved) {
      try {
        setSavedTemplates(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load templates", e)
      }
    }
  }, [])

  // Parse data input
  const handleDataChange = (value: string) => {
    setRawData(value)
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        setData(parsed)
        setDataError("")

        // Auto-detect columns
        if (parsed.length > 0) {
          const firstRow = parsed[0]
          const columns = Object.keys(firstRow)
          if (!config.xAxis || !columns.includes(config.xAxis)) {
            setConfig(prev => ({ ...prev, xAxis: columns[0] }))
          }
        }
      } else {
        setDataError("Data must be an array of objects")
      }
    } catch (e) {
      setDataError("Invalid JSON format")
    }
  }

  // Load sample dataset
  const loadSample = (key: keyof typeof SAMPLE_DATASETS) => {
    const sample = SAMPLE_DATASETS[key]
    setData(sample.data)
    setRawData(JSON.stringify(sample.data, null, 2))
    setDataError("")

    // Auto-configure based on sample
    const firstRow = sample.data[0] as Record<string, any>
    const columns = Object.keys(firstRow)
    const numericColumns = columns.filter(col => typeof firstRow[col] === "number")

    setConfig(prev => ({
      ...prev,
      xAxis: columns[0],
      yAxis: numericColumns.slice(0, 3),
      title: sample.name,
    }))
  }

  // Get columns from data
  const getColumns = (): string[] => {
    if (data.length === 0) return []
    return Object.keys(data[0])
  }

  // Get numeric columns
  const getNumericColumns = (): string[] => {
    if (data.length === 0) return []
    const firstRow = data[0]
    return Object.keys(firstRow).filter(key => typeof firstRow[key] === "number")
  }

  // Get color palette
  const getColors = (): string[] => {
    return COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.terminal
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate code
  const generateCode = (language: string): string => {
    const colors = getColors()

    if (language === "react") {
      return `import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = ${JSON.stringify(data, null, 2)}

export default function Chart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        ${config.showGrid ? '<CartesianGrid strokeDasharray="3 3" />' : ''}
        <XAxis dataKey="${config.xAxis}" label={{ value: '${config.xLabel}', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: '${config.yLabel}', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        ${config.showLegend ? '<Legend />' : ''}
        ${config.yAxis.map((key, i) => `<Line type="monotone" dataKey="${key}" stroke="${colors[i % colors.length]}" />`).join('\n        ')}
      </LineChart>
    </ResponsiveContainer>
  )
}`
    } else if (language === "html") {
      return `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <canvas id="myChart"></canvas>
  <script>
    const data = ${JSON.stringify(data, null, 2)}

    new Chart(document.getElementById('myChart'), {
      type: '${config.type}',
      data: {
        labels: data.map(d => d.${config.xAxis}),
        datasets: [
          ${config.yAxis.map((key, i) => `{
            label: '${key}',
            data: data.map(d => d.${key}),
            borderColor: '${colors[i % colors.length]}',
            backgroundColor: '${colors[i % colors.length]}33'
          }`).join(',\n          ')}
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: '${config.title}' },
          legend: { display: ${config.showLegend} }
        }
      }
    })
  </script>
</body>
</html>`
    }

    return "// Select a language"
  }

  // Save template
  const saveTemplate = () => {
    const template: SavedTemplate = {
      id: Date.now().toString(),
      name: config.title || "Untitled",
      config,
      data,
      category: "Custom",
    }
    const updated = [...savedTemplates, template]
    setSavedTemplates(updated)
    localStorage.setItem("viz-studio-templates", JSON.stringify(updated))
  }

  // Load template
  const loadTemplate = (template: SavedTemplate) => {
    setConfig(template.config)
    setData(template.data)
    setRawData(JSON.stringify(template.data, null, 2))
  }

  // Render chart
  const renderChart = () => {
    const colors = getColors()
    const commonProps = {
      width: "100%",
      height: 400,
    }

    if (config.type === "line") {
      return (
        <ResponsiveContainer {...commonProps}>
          <LineChart data={data}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis
              dataKey={config.xAxis}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: config.fontSize }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: config.fontSize }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background) / 0.9)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
            />
            {config.showLegend && <Legend />}
            {config.yAxis.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                strokeDasharray={config.lineStyle === "dashed" ? "5 5" : config.lineStyle === "dotted" ? "2 2" : "0"}
                dot={config.pointShape === "circle" ? { r: 4 } : { r: 4 }}
                isAnimationActive={config.animated}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )
    }

    if (config.type === "bar") {
      return (
        <ResponsiveContainer {...commonProps}>
          <BarChart data={data}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis
              dataKey={config.xAxis}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: config.fontSize }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: config.fontSize }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background) / 0.9)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
            />
            {config.showLegend && <Legend />}
            {config.yAxis.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[i % colors.length]}
                fillOpacity={config.fillOpacity / 100}
                isAnimationActive={config.animated}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (config.type === "area") {
      return (
        <ResponsiveContainer {...commonProps}>
          <AreaChart data={data}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis
              dataKey={config.xAxis}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: config.fontSize }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: config.fontSize }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background) / 0.9)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
            />
            {config.showLegend && <Legend />}
            {config.yAxis.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
                fillOpacity={config.fillOpacity / 100}
                isAnimationActive={config.animated}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    if (config.type === "pie") {
      // For pie chart, use first numeric column
      const pieData = data.map(d => ({
        name: d[config.xAxis],
        value: d[config.yAxis[0]] as number,
      }))

      return (
        <ResponsiveContainer {...commonProps}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={config.showDataLabels}
              label={config.showDataLabels ? (entry) => entry.name : false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={config.animated}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background) / 0.9)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
            />
            {config.showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      )
    }

    if (config.type === "scatter") {
      return (
        <ResponsiveContainer {...commonProps}>
          <ScatterChart>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis
              dataKey={config.xAxis}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: config.fontSize }}
            />
            <YAxis
              dataKey={config.yAxis[0]}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: config.fontSize }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background) / 0.9)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
            />
            {config.showLegend && <Legend />}
            <Scatter
              name={config.yAxis[0]}
              data={data}
              fill={colors[0]}
              isAnimationActive={config.animated}
            />
          </ScatterChart>
        </ResponsiveContainer>
      )
    }

    if (config.type === "radar") {
      return (
        <ResponsiveContainer {...commonProps}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey={config.xAxis} stroke="hsl(var(--muted-foreground))" />
            <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
            {config.yAxis.map((key, i) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
                fillOpacity={config.fillOpacity / 100}
                isAnimationActive={config.animated}
              />
            ))}
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background) / 0.9)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
            />
            {config.showLegend && <Legend />}
          </RadarChart>
        </ResponsiveContainer>
      )
    }

    if (config.type === "composed") {
      return (
        <ResponsiveContainer {...commonProps}>
          <ComposedChart data={data}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis
              dataKey={config.xAxis}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: config.fontSize }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: config.fontSize }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background) / 0.9)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
            />
            {config.showLegend && <Legend />}
            {config.yAxis.map((key, i) => {
              if (i % 2 === 0) {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[i % colors.length]}
                    fillOpacity={config.fillOpacity / 100}
                    isAnimationActive={config.animated}
                  />
                )
              } else {
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[i % colors.length]}
                    strokeWidth={2}
                    isAnimationActive={config.animated}
                  />
                )
              }
            })}
          </ComposedChart>
        </ResponsiveContainer>
      )
    }

    return null
  }

  const columns = getColumns()
  const numericColumns = getNumericColumns()

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <BarChart3 className="w-12 h-12 text-primary" />
              <motion.div
                className="absolute inset-0 bg-primary/20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h1 className="text-5xl font-bold terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Data Visualization Studio</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create beautiful, interactive charts with live preview and code generation
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary">
              {data.length} rows
            </Badge>
            <Badge variant="outline" className="border-secondary/30 text-secondary">
              {columns.length} columns
            </Badge>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
              {config.type} chart
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <Card className="glass border-white/10 p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="data">
                    <Database className="w-4 h-4 mr-2" />
                    Data
                  </TabsTrigger>
                  <TabsTrigger value="chart">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Chart
                  </TabsTrigger>
                  <TabsTrigger value="style">
                    <Palette className="w-4 h-4 mr-2" />
                    Style
                  </TabsTrigger>
                </TabsList>

                {/* Data Tab */}
                <TabsContent value="data" className="space-y-4">
                  <div>
                    <Label>Sample Datasets</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.entries(SAMPLE_DATASETS).map(([key, value]) => (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          onClick={() => loadSample(key as keyof typeof SAMPLE_DATASETS)}
                          className="text-xs"
                        >
                          {value.name.split(" ")[0]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>JSON Data</Label>
                    <Textarea
                      value={rawData}
                      onChange={(e) => handleDataChange(e.target.value)}
                      className="mt-2 font-mono text-xs h-64 bg-muted text-foreground"
                      placeholder="Paste JSON array..."
                    />
                    {dataError && (
                      <p className="text-red-500 text-xs mt-1">{dataError}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Upload className="w-4 h-4 mr-2" />
                      Import CSV
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  {/* Data Preview */}
                  {data.length > 0 && (
                    <div>
                      <Label>Preview (first 5 rows)</Label>
                      <div className="mt-2 border border-white/10 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto max-h-48">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {columns.map(col => (
                                  <TableHead key={col} className="text-xs">{col}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.slice(0, 5).map((row, i) => (
                                <TableRow key={i}>
                                  {columns.map(col => (
                                    <TableCell key={col} className="text-xs">
                                      {String(row[col])}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Chart Tab */}
                <TabsContent value="chart" className="space-y-4">
                  <div>
                    <Label>Chart Type</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        { type: "line", icon: LineChartIcon, label: "Line" },
                        { type: "bar", icon: BarChart3, label: "Bar" },
                        { type: "area", icon: AreaChartIcon, label: "Area" },
                        { type: "pie", icon: PieChartIcon, label: "Pie" },
                        { type: "scatter", icon: ScatterChartIcon, label: "Scatter" },
                        { type: "radar", icon: Activity, label: "Radar" },
                        { type: "composed", icon: Sparkles, label: "Composed" },
                      ].map(({ type, icon: Icon, label }) => (
                        <Button
                          key={type}
                          variant={config.type === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setConfig(prev => ({ ...prev, type: type as ChartType }))}
                          className="h-auto py-3"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Chart Title</Label>
                    <Input
                      value={config.title}
                      onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-2"
                      placeholder="Enter title..."
                    />
                  </div>

                  <div>
                    <Label>X-Axis (Category)</Label>
                    <Select
                      value={config.xAxis}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, xAxis: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map(col => (
                          <SelectItem key={col} value={col}>{col}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Y-Axis (Values)</Label>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                      {numericColumns.map(col => (
                        <label key={col} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.yAxis.includes(col)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setConfig(prev => ({ ...prev, yAxis: [...prev.yAxis, col] }))
                              } else {
                                setConfig(prev => ({ ...prev, yAxis: prev.yAxis.filter(y => y !== col) }))
                              }
                            }}
                            className="rounded border-white/20"
                          />
                          <span className="text-sm">{col}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Show Legend</Label>
                      <Switch
                        checked={config.showLegend}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, showLegend: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Show Grid</Label>
                      <Switch
                        checked={config.showGrid}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, showGrid: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Animations</Label>
                      <Switch
                        checked={config.animated}
                        onCheckedChange={(checked) => setConfig(prev => ({ ...prev, animated: checked }))}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Style Tab */}
                <TabsContent value="style" className="space-y-4">
                  <div>
                    <Label>Color Scheme</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.entries(COLOR_SCHEMES).map(([name, colors]) => (
                        <Button
                          key={name}
                          variant={config.colorScheme === name ? "default" : "outline"}
                          size="sm"
                          onClick={() => setConfig(prev => ({ ...prev, colorScheme: name }))}
                          className="h-auto py-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {colors.slice(0, 3).map((color, i) => (
                                <div
                                  key={i}
                                  className="w-3 h-3 rounded-sm"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <span className="text-xs capitalize">{name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Fill Opacity: {config.fillOpacity}%</Label>
                    <Slider
                      value={[config.fillOpacity]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, fillOpacity: value }))}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Font Size: {config.fontSize}px</Label>
                    <Slider
                      value={[config.fontSize]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, fontSize: value }))}
                      min={8}
                      max={20}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  {(config.type === "line" || config.type === "area") && (
                    <div>
                      <Label>Line Style</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {["solid", "dashed", "dotted"].map(style => (
                          <Button
                            key={style}
                            variant={config.lineStyle === style ? "default" : "outline"}
                            size="sm"
                            onClick={() => setConfig(prev => ({ ...prev, lineStyle: style as any }))}
                            className="capitalize"
                          >
                            {style}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>

            {/* Actions */}
            <Card className="glass border-white/10 p-4">
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={saveTemplate}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Load Template ({savedTemplates.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass border-white/10">
                    <DialogHeader>
                      <DialogTitle>Saved Templates</DialogTitle>
                      <DialogDescription>
                        Load a previously saved chart configuration
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {savedTemplates.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No saved templates yet
                        </p>
                      ) : (
                        savedTemplates.map(template => (
                          <Button
                            key={template.id}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => loadTemplate(template)}
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            <div className="text-left">
                              <div className="font-medium">{template.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {template.config.type} • {template.data.length} rows
                              </div>
                            </div>
                          </Button>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCode(!showCode)}
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  {showCode ? "Hide Code" : "Generate Code"}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Right Panel - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            <Card className="glass border-white/10 p-6">
              {/* Chart Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold terminal-glow">{config.title}</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-slate-400 w-16 text-center">{zoom}%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setZoom(Math.min(150, zoom + 10))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setZoom(100)}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFullscreen(!fullscreen)}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Chart Canvas */}
              <div
                ref={chartRef}
                className="border border-border rounded-lg p-4 bg-card/30"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
              >
                {data.length > 0 ? renderChart() : (
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-2">
                      <BarChart3 className="w-16 h-16 mx-auto opacity-20" />
                      <p>No data to display</p>
                      <p className="text-sm">Load a sample dataset or paste JSON data</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Export Options */}
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  PNG
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  SVG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(config, null, 2))}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  Config
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>

            {/* Code Generation */}
            <AnimatePresence>
              {showCode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Card className="glass border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Generated Code</h3>
                      <div className="flex items-center gap-2">
                        <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="react">React</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(generateCode(codeLanguage))}
                        >
                          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                          Copy
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-background border border-white/10 rounded-lg p-4 overflow-x-auto">
                      <code className="text-primary text-sm font-mono">
                        {generateCode(codeLanguage)}
                      </code>
                    </pre>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
