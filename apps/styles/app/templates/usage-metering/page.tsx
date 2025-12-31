'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Database, Globe, Clock, TrendingUp, TrendingDown, Activity,
  Download, AlertTriangle, Bell, Settings, Calendar, BarChart3,
  DollarSign, ArrowUpRight, ArrowDownRight, RefreshCcw, ChevronRight,
  Server, Cloud, Cpu, HardDrive, NetworkIcon, FileText, Filter,
  CheckCircle2, XCircle, Minus, Info, Gauge, Target, Flame
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Separator, Progress, Switch, Label, Input, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, cn } from "@ggprompts/ui"
import { toast } from 'sonner'

// Generate 30 days of usage data
const generateUsageData = () => {
  const data = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split('T')[0],
      apiCalls: Math.floor(Math.random() * 50000) + 20000,
      storage: Math.floor(Math.random() * 30) + 40,
      bandwidth: Math.floor(Math.random() * 200) + 100,
      compute: Math.floor(Math.random() * 1000) + 500,
    })
  }

  return data
}

const usageData = generateUsageData()

const currentUsage = {
  apiCalls: { used: 456789, limit: 1000000, unit: 'calls', cost: 0.0001 },
  storage: { used: 68.5, limit: 100, unit: 'GB', cost: 0.10 },
  bandwidth: { used: 4.2, limit: 10, unit: 'TB', cost: 0.05 },
  compute: { used: 18500, limit: 50000, unit: 'hours', cost: 0.01 },
  users: { used: 8, limit: 10, unit: 'seats', cost: 15.00 },
  projects: { used: 24, limit: 100, unit: 'projects', cost: 0 },
}

const usageByFeature = [
  { name: 'API Authentication', calls: 125000, cost: 12.50, percentage: 27 },
  { name: 'Data Processing', calls: 98000, cost: 9.80, percentage: 21 },
  { name: 'Image Processing', calls: 87000, cost: 8.70, percentage: 19 },
  { name: 'Database Queries', calls: 76000, cost: 7.60, percentage: 17 },
  { name: 'File Operations', calls: 45000, cost: 4.50, percentage: 10 },
  { name: 'Analytics', calls: 25789, cost: 2.58, percentage: 6 },
]

const peakUsageHours = [
  { hour: '00:00', value: 20 },
  { hour: '01:00', value: 15 },
  { hour: '02:00', value: 10 },
  { hour: '03:00', value: 12 },
  { hour: '04:00', value: 18 },
  { hour: '05:00', value: 25 },
  { hour: '06:00', value: 40 },
  { hour: '07:00', value: 55 },
  { hour: '08:00', value: 70 },
  { hour: '09:00', value: 85 },
  { hour: '10:00', value: 95 },
  { hour: '11:00', value: 90 },
  { hour: '12:00', value: 75 },
  { hour: '13:00', value: 80 },
  { hour: '14:00', value: 85 },
  { hour: '15:00', value: 92 },
  { hour: '16:00', value: 88 },
  { hour: '17:00', value: 70 },
  { hour: '18:00', value: 50 },
  { hour: '19:00', value: 35 },
  { hour: '20:00', value: 30 },
  { hour: '21:00', value: 28 },
  { hour: '22:00', value: 25 },
  { hour: '23:00', value: 22 },
]

const alerts = [
  { id: 1, metric: 'API Calls', threshold: 80, current: 45.6, enabled: true },
  { id: 2, metric: 'Storage', threshold: 90, current: 68.5, enabled: true },
  { id: 3, metric: 'Bandwidth', threshold: 75, current: 42.0, enabled: false },
  { id: 4, metric: 'Compute Hours', threshold: 85, current: 37.0, enabled: true },
]

export default function UsageMeteringPage() {
  const [timeRange, setTimeRange] = useState('30days')
  const [selectedMetric, setSelectedMetric] = useState<'apiCalls' | 'storage' | 'bandwidth' | 'compute'>('apiCalls')
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [newAlertMetric, setNewAlertMetric] = useState('')
  const [newAlertThreshold, setNewAlertThreshold] = useState(80)

  // Calculate current period usage
  const totalApiCalls = usageData.reduce((sum, day) => sum + day.apiCalls, 0)
  const avgApiCalls = totalApiCalls / usageData.length
  const projectedApiCalls = (avgApiCalls * 30)
  const projectedCost = Object.entries(currentUsage).reduce((sum, [key, data]) => {
    return sum + (data.used * data.cost)
  }, 0)

  // Compare with previous period
  const previousPeriodCalls = totalApiCalls * 0.85 // Mock 15% increase
  const percentageChange = ((totalApiCalls - previousPeriodCalls) / previousPeriodCalls) * 100

  const handleExportUsage = () => {
    toast.success('Usage data exported to CSV')
  }

  const handleSetAlert = () => {
    toast.success(`Alert set for ${newAlertMetric} at ${newAlertThreshold}%`)
    setShowAlertDialog(false)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500'
    if (percentage >= 75) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getUsageIcon = (key: string) => {
    switch (key) {
      case 'apiCalls': return Zap
      case 'storage': return Database
      case 'bandwidth': return Globe
      case 'compute': return Cpu
      case 'users': return Activity
      case 'projects': return FileText
      default: return Activity
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Usage & Metering</h1>
            <p className="text-muted-foreground">Monitor your resource consumption and costs</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="glass w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-overlay">
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="glass" onClick={handleExportUsage}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="glass">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-overlay">
                <DialogHeader>
                  <DialogTitle>Set Usage Alert</DialogTitle>
                  <DialogDescription>
                    Get notified when usage exceeds threshold
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Metric</Label>
                    <Select value={newAlertMetric} onValueChange={setNewAlertMetric}>
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent className="glass-overlay">
                        <SelectItem value="apiCalls">API Calls</SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                        <SelectItem value="bandwidth">Bandwidth</SelectItem>
                        <SelectItem value="compute">Compute Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Threshold (%)</Label>
                    <Input
                      type="number"
                      value={newAlertThreshold}
                      onChange={(e) => setNewAlertThreshold(Number(e.target.value))}
                      className="glass"
                      min={1}
                      max={100}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAlertDialog(false)}>Cancel</Button>
                  <Button onClick={handleSetAlert}>Set Alert</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Real-time Usage Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-overlay border-glow">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Gauge */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted/20"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        strokeDashoffset={`${2 * Math.PI * 80 * (1 - (currentUsage.apiCalls.used / currentUsage.apiCalls.limit))}`}
                        className="text-primary"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - (currentUsage.apiCalls.used / currentUsage.apiCalls.limit)) }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Gauge className="w-8 h-8 text-primary mb-2" />
                      <p className="text-3xl font-bold">
                        {((currentUsage.apiCalls.used / currentUsage.apiCalls.limit) * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Current Usage</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="md:col-span-2 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Current Period</p>
                    <p className="text-2xl font-bold">
                      {currentUsage.apiCalls.used.toLocaleString()}
                      <span className="text-sm text-muted-foreground ml-2">calls</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      of {currentUsage.apiCalls.limit.toLocaleString()} limit
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Projected (30d)</p>
                    <p className="text-2xl font-bold">
                      {projectedApiCalls.toLocaleString()}
                      <span className="text-sm text-muted-foreground ml-2">calls</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {percentageChange >= 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">+{percentageChange.toFixed(1)}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">{percentageChange.toFixed(1)}%</span>
                        </>
                      )}
                      <span className="text-sm text-muted-foreground">vs last period</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Estimated Cost</p>
                    <p className="text-2xl font-bold terminal-glow">
                      ${projectedCost.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">this month</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Cost per 1k calls</p>
                    <p className="text-2xl font-bold">
                      ${(currentUsage.apiCalls.cost * 1000).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">current rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(currentUsage).map(([key, data], index) => {
            const percentage = (data.used / data.limit) * 100
            const Icon = getUsageIcon(key)
            const color = getUsageColor(percentage)

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Card className="glass-overlay hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${data.cost.toFixed(4)} per {data.unit}
                          </p>
                        </div>
                      </div>
                      <Badge variant={percentage >= 90 ? 'destructive' : percentage >= 75 ? 'secondary' : 'default'}>
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {data.used.toLocaleString()} / {data.limit.toLocaleString()} {data.unit}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between items-center text-xs">
                        <span className={color}>
                          {percentage >= 90 && '⚠️ High usage'}
                          {percentage >= 75 && percentage < 90 && '⚡ Approaching limit'}
                          {percentage < 75 && '✓ Normal'}
                        </span>
                        <span className="text-muted-foreground">
                          {(data.limit - data.used).toLocaleString()} remaining
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Usage Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Usage Trend</CardTitle>
                  <CardDescription>Daily usage over the selected period</CardDescription>
                </div>
                <Tabs value={selectedMetric} onValueChange={(v: any) => setSelectedMetric(v)} className="w-auto">
                  <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <TabsList className="glass w-max md:w-auto">
                      <TabsTrigger value="apiCalls" className="text-xs sm:text-sm whitespace-nowrap">API Calls</TabsTrigger>
                      <TabsTrigger value="storage" className="text-xs sm:text-sm whitespace-nowrap">Storage</TabsTrigger>
                      <TabsTrigger value="bandwidth" className="text-xs sm:text-sm whitespace-nowrap">Bandwidth</TabsTrigger>
                      <TabsTrigger value="compute" className="text-xs sm:text-sm whitespace-nowrap">Compute</TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <div className="h-full flex items-end justify-between gap-1">
                  {usageData.map((day, index) => {
                    const value = day[selectedMetric]
                    const maxValue = Math.max(...usageData.map(d => d[selectedMetric]))
                    const height = (value / maxValue) * 100

                    return (
                      <motion.div
                        key={day.date}
                        className="flex-1 group relative"
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        transition={{ delay: 0.5 + index * 0.01 }}
                      >
                        <div
                          className="w-full bg-primary/40 hover:bg-primary/60 rounded-t transition-colors cursor-pointer"
                          style={{ height: `${height}%`, minHeight: '8px' }}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <p className="font-semibold">{value.toLocaleString()}</p>
                          <p className="text-muted-foreground">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage by Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle>Usage by Feature</CardTitle>
              <CardDescription>Breakdown of API calls across different features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageByFeature.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{feature.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {feature.calls.toLocaleString()} calls
                        </span>
                        <span className="text-sm font-semibold min-w-[60px] text-right">
                          ${feature.cost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={feature.percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground min-w-[45px] text-right">
                        {feature.percentage}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Peak Usage Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Peak Usage Times
              </CardTitle>
              <CardDescription>24-hour usage pattern heatmap</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-2">
                {peakUsageHours.map((hour, index) => {
                  const intensity = hour.value / 100

                  return (
                    <motion.div
                      key={hour.hour}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.02 }}
                      className="group relative"
                    >
                      <div
                        className={cn(
                          "aspect-square rounded transition-all cursor-pointer",
                          intensity >= 0.8 ? "bg-red-500" :
                          intensity >= 0.6 ? "bg-orange-500" :
                          intensity >= 0.4 ? "bg-yellow-500" :
                          intensity >= 0.2 ? "bg-green-500" :
                          "bg-blue-500"
                        )}
                        style={{ opacity: 0.3 + (intensity * 0.7) }}
                      />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <p className="font-semibold">{hour.hour}</p>
                        <p className="text-muted-foreground">{hour.value}% load</p>
                      </div>
                      <p className="text-[10px] text-center text-muted-foreground mt-1">
                        {hour.hour.split(':')[0]}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500 opacity-50" />
                  <span className="text-xs text-muted-foreground">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500 opacity-70" />
                  <span className="text-xs text-muted-foreground">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500 opacity-90" />
                  <span className="text-xs text-muted-foreground">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Usage Alerts
              </CardTitle>
              <CardDescription>Configured thresholds and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.05 }}
                    className="flex items-center justify-between p-4 glass rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        alert.current >= alert.threshold ? "bg-red-500/20" :
                        alert.current >= alert.threshold * 0.8 ? "bg-yellow-500/20" :
                        "bg-green-500/20"
                      )}>
                        {alert.current >= alert.threshold ? (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium">{alert.metric}</p>
                          {alert.current >= alert.threshold && (
                            <Badge variant="destructive">Threshold exceeded</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Threshold: {alert.threshold}%</span>
                          <span>•</span>
                          <span>Current: {alert.current.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <Switch checked={alert.enabled} />
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
