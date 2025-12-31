"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  Copy,
  Check,
  Calendar,
  Zap,
  Settings2,
  Download,
  Code2,
  PlayCircle,
  Info,
  Sparkles,
  FileCode,
  Globe,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Types
interface CronConfig {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

interface CronPreset {
  name: string
  expression: string
  description: string
  category: string
}

interface ExecutionTime {
  date: Date
  relative: string
}

// Cron presets
const CRON_PRESETS: CronPreset[] = [
  {
    name: "Every Minute",
    expression: "* * * * *",
    description: "Runs every minute",
    category: "Common",
  },
  {
    name: "Every Hour",
    expression: "0 * * * *",
    description: "Runs at the start of every hour",
    category: "Common",
  },
  {
    name: "Daily at Midnight",
    expression: "0 0 * * *",
    description: "Runs once a day at 00:00",
    category: "Daily",
  },
  {
    name: "Daily at 9 AM",
    expression: "0 9 * * *",
    description: "Runs once a day at 09:00",
    category: "Daily",
  },
  {
    name: "Daily at 6 PM",
    expression: "0 18 * * *",
    description: "Runs once a day at 18:00",
    category: "Daily",
  },
  {
    name: "Every 15 Minutes",
    expression: "*/15 * * * *",
    description: "Runs every 15 minutes",
    category: "Intervals",
  },
  {
    name: "Every 30 Minutes",
    expression: "*/30 * * * *",
    description: "Runs every 30 minutes",
    category: "Intervals",
  },
  {
    name: "Every 6 Hours",
    expression: "0 */6 * * *",
    description: "Runs every 6 hours",
    category: "Intervals",
  },
  {
    name: "Weekly on Monday",
    expression: "0 9 * * 1",
    description: "Runs every Monday at 09:00",
    category: "Weekly",
  },
  {
    name: "Weekly on Friday",
    expression: "0 17 * * 5",
    description: "Runs every Friday at 17:00",
    category: "Weekly",
  },
  {
    name: "Weekdays at 9 AM",
    expression: "0 9 * * 1-5",
    description: "Runs Monday through Friday at 09:00",
    category: "Weekly",
  },
  {
    name: "Weekends at 10 AM",
    expression: "0 10 * * 0,6",
    description: "Runs Saturday and Sunday at 10:00",
    category: "Weekly",
  },
  {
    name: "Monthly on 1st",
    expression: "0 0 1 * *",
    description: "Runs on the first day of every month at 00:00",
    category: "Monthly",
  },
  {
    name: "Monthly on 15th",
    expression: "0 12 15 * *",
    description: "Runs on the 15th of every month at 12:00",
    category: "Monthly",
  },
  {
    name: "First Monday of Month",
    expression: "0 9 1-7 * 1",
    description: "Runs on the first Monday of every month at 09:00",
    category: "Monthly",
  },
  {
    name: "Quarterly",
    expression: "0 0 1 1,4,7,10 *",
    description: "Runs on the first day of Jan, Apr, Jul, Oct at 00:00",
    category: "Yearly",
  },
  {
    name: "Annually on Jan 1st",
    expression: "0 0 1 1 *",
    description: "Runs once a year on January 1st at 00:00",
    category: "Yearly",
  },
]

// Month names
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

// Day names
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function CronBuilder() {
  // State
  const [config, setConfig] = useState<CronConfig>({
    minute: "0",
    hour: "9",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "1-5",
  })
  const [advancedMode, setAdvancedMode] = useState(false)
  const [rawExpression, setRawExpression] = useState("0 9 * * 1-5")
  const [copied, setCopied] = useState(false)
  const [timezone, setTimezone] = useState("UTC")
  const [platform, setPlatform] = useState<"crontab" | "github" | "aws" | "k8s">("crontab")
  const [selectedMinutes, setSelectedMinutes] = useState<number[]>([])
  const [selectedHours, setSelectedHours] = useState<number[]>([])
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [selectedMonths, setSelectedMonths] = useState<number[]>([])

  // Build cron expression
  const cronExpression = useMemo(() => {
    if (advancedMode) {
      return rawExpression
    }
    return `${config.minute} ${config.hour} ${config.dayOfMonth} ${config.month} ${config.dayOfWeek}`
  }, [config, advancedMode, rawExpression])

  // Parse and validate
  const { isValid, error } = useMemo(() => {
    const parts = cronExpression.trim().split(/\s+/)
    if (parts.length !== 5) {
      return { isValid: false, error: "Cron expression must have 5 fields" }
    }

    // Basic validation (simplified)
    const validPattern = /^[\d\*\-\,\/]+$/
    for (const part of parts) {
      if (!validPattern.test(part)) {
        return { isValid: false, error: "Invalid characters in cron expression" }
      }
    }

    return { isValid: true, error: null }
  }, [cronExpression])

  // Generate human-readable description
  const description = useMemo(() => {
    if (!isValid) return "Invalid expression"

    try {
      const [min, hour, day, month, dow] = cronExpression.split(" ")

      let desc = "Runs "

      // Frequency
      if (min === "*" && hour === "*" && day === "*" && month === "*" && dow === "*") {
        return "Runs every minute"
      }

      if (min.startsWith("*/")) {
        const interval = min.substring(2)
        desc += `every ${interval} minute${interval !== "1" ? "s" : ""}`
      } else if (min === "*") {
        desc += "every minute"
      } else if (min.includes(",")) {
        desc += `at minute${min.split(",").length > 1 ? "s" : ""} ${min}`
      } else {
        desc += `at minute ${min}`
      }

      // Hour
      if (hour !== "*") {
        if (hour.startsWith("*/")) {
          const interval = hour.substring(2)
          desc += ` of every ${interval} hour${interval !== "1" ? "s" : ""}`
        } else if (hour.includes(",")) {
          const hours = hour.split(",").map(h => `${h}:00`).join(", ")
          desc += ` past ${hours}`
        } else if (hour.includes("-")) {
          desc += ` between ${hour.split("-")[0]}:00 and ${hour.split("-")[1]}:00`
        } else {
          desc += ` past ${hour}:00`
        }
      }

      // Day of month
      if (day !== "*") {
        if (day.includes(",")) {
          desc += ` on day${day.split(",").length > 1 ? "s" : ""} ${day} of the month`
        } else if (day.includes("-")) {
          desc += ` on days ${day} of the month`
        } else {
          desc += ` on day ${day} of the month`
        }
      }

      // Month
      if (month !== "*") {
        if (month.includes(",")) {
          const monthNames = month.split(",").map(m => MONTHS[parseInt(m) - 1] || m).join(", ")
          desc += ` in ${monthNames}`
        } else if (month.includes("-")) {
          const [start, end] = month.split("-")
          desc += ` from ${MONTHS[parseInt(start) - 1]} to ${MONTHS[parseInt(end) - 1]}`
        } else {
          desc += ` in ${MONTHS[parseInt(month) - 1]}`
        }
      }

      // Day of week
      if (dow !== "*") {
        if (dow.includes(",")) {
          const dayNames = dow.split(",").map(d => DAYS[parseInt(d)] || d).join(", ")
          desc += ` on ${dayNames}`
        } else if (dow.includes("-")) {
          const [start, end] = dow.split("-")
          desc += ` on ${DAYS[parseInt(start)]} through ${DAYS[parseInt(end)]}`
        } else {
          desc += ` on ${DAYS[parseInt(dow)]}`
        }
      }

      return desc
    } catch {
      return "Invalid expression"
    }
  }, [cronExpression, isValid])

  // Calculate next execution times
  const nextExecutions = useMemo((): ExecutionTime[] => {
    if (!isValid) return []

    const executions: ExecutionTime[] = []
    const now = new Date()
    let currentDate = new Date(now)

    // Simplified calculation (for demo purposes)
    // In production, use a library like cron-parser or cronstrue
    try {
      const [min, hour, day, month, dow] = cronExpression.split(" ")

      // Generate next 10 potential execution times
      for (let i = 0; i < 100; i++) {
        currentDate = new Date(currentDate.getTime() + 60000) // Add 1 minute

        const matchesMinute = min === "*" ||
          min === currentDate.getMinutes().toString() ||
          (min.includes(",") && min.split(",").includes(currentDate.getMinutes().toString())) ||
          (min.startsWith("*/") && currentDate.getMinutes() % parseInt(min.substring(2)) === 0)

        const matchesHour = hour === "*" ||
          hour === currentDate.getHours().toString() ||
          (hour.includes(",") && hour.split(",").includes(currentDate.getHours().toString()))

        const matchesDay = day === "*" ||
          day === currentDate.getDate().toString() ||
          (day.includes(",") && day.split(",").includes(currentDate.getDate().toString()))

        const matchesMonth = month === "*" ||
          month === (currentDate.getMonth() + 1).toString() ||
          (month.includes(",") && month.split(",").includes((currentDate.getMonth() + 1).toString()))

        const matchesDow = dow === "*" ||
          dow === currentDate.getDay().toString() ||
          (dow.includes(",") && dow.split(",").includes(currentDate.getDay().toString())) ||
          (dow.includes("-") && (() => {
            const [start, end] = dow.split("-").map(Number)
            const currentDow = currentDate.getDay()
            return currentDow >= start && currentDow <= end
          })())

        if (matchesMinute && matchesHour && matchesDay && matchesMonth && matchesDow) {
          const diffMs = currentDate.getTime() - now.getTime()
          const diffMins = Math.floor(diffMs / 60000)
          const diffHours = Math.floor(diffMins / 60)
          const diffDays = Math.floor(diffHours / 24)

          let relative = ""
          if (diffDays > 0) {
            relative = `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`
          } else if (diffHours > 0) {
            relative = `in ${diffHours} hour${diffHours !== 1 ? "s" : ""}`
          } else if (diffMins > 0) {
            relative = `in ${diffMins} minute${diffMins !== 1 ? "s" : ""}`
          } else {
            relative = "now"
          }

          executions.push({
            date: new Date(currentDate),
            relative,
          })

          if (executions.length >= 10) break
        }
      }
    } catch {
      // Ignore calculation errors
    }

    return executions
  }, [cronExpression, isValid])

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Load preset
  const loadPreset = (preset: CronPreset) => {
    setRawExpression(preset.expression)
    const [min, hour, day, month, dow] = preset.expression.split(" ")
    setConfig({ minute: min, hour, dayOfMonth: day, month, dayOfWeek: dow })
    setAdvancedMode(false)
  }

  // Generate platform-specific code
  const generatePlatformCode = (): string => {
    if (platform === "crontab") {
      return `# Add to crontab (crontab -e)
${cronExpression} /path/to/command

# Example with logging
${cronExpression} /usr/bin/backup.sh >> /var/log/backup.log 2>&1`
    }

    if (platform === "github") {
      return `# GitHub Actions workflow (.github/workflows/schedule.yml)
name: Scheduled Task
on:
  schedule:
    - cron: '${cronExpression}'
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run task
        run: ./scripts/task.sh`
    }

    if (platform === "aws") {
      return `# AWS CloudWatch Events (EventBridge) rule
{
  "ScheduleExpression": "cron(${cronExpression})",
  "State": "ENABLED",
  "Targets": [
    {
      "Arn": "arn:aws:lambda:region:account-id:function:function-name",
      "Id": "1"
    }
  ]
}

# Note: AWS uses a 6-field format (add year field)`
    }

    if (platform === "k8s") {
      return `# Kubernetes CronJob
apiVersion: batch/v1
kind: CronJob
metadata:
  name: scheduled-task
spec:
  schedule: "${cronExpression}"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: task
            image: your-image:latest
            command: ["/bin/sh", "-c", "date; echo Running task"]
          restartPolicy: OnFailure`
    }

    return ""
  }

  const categories = [...new Set(CRON_PRESETS.map(p => p.category))]

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
              <Clock className="w-12 h-12 text-primary" />
              <motion.div
                className="absolute inset-0 bg-primary/20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h1 className="text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Cron Expression Builder</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Build and visualize cron schedules with ease
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge
              variant="outline"
              className={isValid ? "border-primary/30 text-primary" : "border-red-500/30 text-red-400"}
            >
              {isValid ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Valid
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Invalid
                </>
              )}
            </Badge>
            <Badge variant="outline" className="border-secondary/30 text-secondary">
              {nextExecutions.length} executions scheduled
            </Badge>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
              {timezone}
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Presets */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card className="glass border-white/10 p-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Preset Templates
              </h3>

              <div className="space-y-4 max-h-[700px] overflow-y-auto">
                {categories.map(category => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {category}
                    </h4>
                    {CRON_PRESETS.filter(p => p.category === category).map(preset => (
                      <Button
                        key={preset.name}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => loadPreset(preset)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{preset.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{preset.description}</div>
                          <div className="font-mono text-xs text-secondary mt-1">
                            {preset.expression}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Center & Right - Builder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Cron Expression Display */}
            <Card className="glass border-white/10 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-bold">Cron Expression</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Advanced Mode</Label>
                      <Switch checked={advancedMode} onCheckedChange={setAdvancedMode} />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(cronExpression)}
                    >
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy
                    </Button>
                  </div>
                </div>

                {advancedMode ? (
                  <div>
                    <Input
                      value={rawExpression}
                      onChange={(e) => setRawExpression(e.target.value)}
                      className={`font-mono text-xl ${error ? "border-red-500/50" : "border-primary/50"}`}
                      placeholder="0 9 * * 1-5"
                    />
                    {error && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-card/50 border border-primary/30 rounded-lg">
                    <div className="flex-1 grid grid-cols-5 gap-2">
                      <div className="text-center">
                        <div className="text-2xl font-mono text-primary">{config.minute}</div>
                        <div className="text-xs text-muted-foreground mt-1">minute</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-mono text-primary">{config.hour}</div>
                        <div className="text-xs text-muted-foreground mt-1">hour</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-mono text-primary">{config.dayOfMonth}</div>
                        <div className="text-xs text-muted-foreground mt-1">day</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-mono text-primary">{config.month}</div>
                        <div className="text-xs text-muted-foreground mt-1">month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-mono text-primary">{config.dayOfWeek}</div>
                        <div className="text-xs text-muted-foreground mt-1">weekday</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                {isValid && (
                  <div className="flex items-start gap-3 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                    <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-secondary font-medium">{description}</p>
                      {nextExecutions.length > 0 && (
                        <p className="text-xs text-secondary mt-1">
                          Next run: {nextExecutions[0].date.toLocaleString()} ({nextExecutions[0].relative})
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Visual Builder */}
            {!advancedMode && (
              <Card className="glass border-white/10 p-6">
                <Tabs defaultValue="time">
                  <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
                    <TabsList className="grid w-max md:w-auto grid-cols-5">
                      <TabsTrigger value="time" className="text-xs sm:text-sm whitespace-nowrap">
                        <Clock className="w-4 h-4 mr-2" />
                        Time
                      </TabsTrigger>
                      <TabsTrigger value="day" className="text-xs sm:text-sm whitespace-nowrap">Day</TabsTrigger>
                      <TabsTrigger value="month" className="text-xs sm:text-sm whitespace-nowrap">Month</TabsTrigger>
                      <TabsTrigger value="weekday" className="text-xs sm:text-sm whitespace-nowrap">Weekday</TabsTrigger>
                      <TabsTrigger value="quick" className="text-xs sm:text-sm whitespace-nowrap">Quick</TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Time Tab */}
                  <TabsContent value="time" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Minute</Label>
                        <Select
                          value={config.minute}
                          onValueChange={(value) => setConfig(prev => ({ ...prev, minute: value }))}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="*">Every minute</SelectItem>
                            <SelectItem value="0">:00</SelectItem>
                            <SelectItem value="15">:15</SelectItem>
                            <SelectItem value="30">:30</SelectItem>
                            <SelectItem value="45">:45</SelectItem>
                            <SelectItem value="*/5">Every 5 minutes</SelectItem>
                            <SelectItem value="*/10">Every 10 minutes</SelectItem>
                            <SelectItem value="*/15">Every 15 minutes</SelectItem>
                            <SelectItem value="*/30">Every 30 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Hour</Label>
                        <Select
                          value={config.hour}
                          onValueChange={(value) => setConfig(prev => ({ ...prev, hour: value }))}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="*">Every hour</SelectItem>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i.toString().padStart(2, "0")}:00
                              </SelectItem>
                            ))}
                            <SelectItem value="*/2">Every 2 hours</SelectItem>
                            <SelectItem value="*/6">Every 6 hours</SelectItem>
                            <SelectItem value="*/12">Every 12 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Custom Minute Pattern</Label>
                      <Input
                        value={config.minute}
                        onChange={(e) => setConfig(prev => ({ ...prev, minute: e.target.value }))}
                        className="mt-2 font-mono"
                        placeholder="0,15,30,45 or */15"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Use * for all, comma-separated values (0,15,30), ranges (0-30), or intervals (*/15)
                      </p>
                    </div>
                  </TabsContent>

                  {/* Day Tab */}
                  <TabsContent value="day" className="space-y-4">
                    <div>
                      <Label>Day of Month</Label>
                      <Select
                        value={config.dayOfMonth}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, dayOfMonth: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="*">Every day</SelectItem>
                          <SelectItem value="1">1st of month</SelectItem>
                          <SelectItem value="15">15th of month</SelectItem>
                          <SelectItem value="1,15">1st and 15th</SelectItem>
                          <SelectItem value="*/2">Every 2 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Day Selector</Label>
                      <div className="grid grid-cols-7 gap-2 mt-2">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                          <Button
                            key={day}
                            variant={selectedDays.includes(day) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (selectedDays.includes(day)) {
                                const newDays = selectedDays.filter(d => d !== day)
                                setSelectedDays(newDays)
                                setConfig(prev => ({
                                  ...prev,
                                  dayOfMonth: newDays.length === 0 ? "*" : newDays.join(",")
                                }))
                              } else {
                                const newDays = [...selectedDays, day].sort((a, b) => a - b)
                                setSelectedDays(newDays)
                                setConfig(prev => ({ ...prev, dayOfMonth: newDays.join(",") }))
                              }
                            }}
                            className="h-8 text-xs"
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Month Tab */}
                  <TabsContent value="month" className="space-y-4">
                    <div>
                      <Label>Month</Label>
                      <Select
                        value={config.month}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, month: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="*">Every month</SelectItem>
                          {MONTHS.map((month, i) => (
                            <SelectItem key={i} value={(i + 1).toString()}>
                              {month}
                            </SelectItem>
                          ))}
                          <SelectItem value="1,4,7,10">Quarterly</SelectItem>
                          <SelectItem value="1,7">Bi-annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Month Selector</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {MONTHS.map((month, i) => {
                          const monthNum = i + 1
                          return (
                            <Button
                              key={i}
                              variant={selectedMonths.includes(monthNum) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                if (selectedMonths.includes(monthNum)) {
                                  const newMonths = selectedMonths.filter(m => m !== monthNum)
                                  setSelectedMonths(newMonths)
                                  setConfig(prev => ({
                                    ...prev,
                                    month: newMonths.length === 0 ? "*" : newMonths.join(",")
                                  }))
                                } else {
                                  const newMonths = [...selectedMonths, monthNum].sort((a, b) => a - b)
                                  setSelectedMonths(newMonths)
                                  setConfig(prev => ({ ...prev, month: newMonths.join(",") }))
                                }
                              }}
                              className="h-9 text-xs"
                            >
                              {month.substring(0, 3)}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Weekday Tab */}
                  <TabsContent value="weekday" className="space-y-4">
                    <div>
                      <Label>Day of Week</Label>
                      <Select
                        value={config.dayOfWeek}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, dayOfWeek: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="*">Every day</SelectItem>
                          <SelectItem value="1-5">Monday - Friday (Weekdays)</SelectItem>
                          <SelectItem value="0,6">Saturday & Sunday (Weekends)</SelectItem>
                          {DAYS.map((day, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Weekday Selector</Label>
                      <div className="grid grid-cols-7 gap-2 mt-2">
                        {DAYS.map((day, i) => (
                          <Button
                            key={i}
                            variant={selectedDays.includes(i) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (selectedDays.includes(i)) {
                                const newDays = selectedDays.filter(d => d !== i)
                                setSelectedDays(newDays)
                                setConfig(prev => ({
                                  ...prev,
                                  dayOfWeek: newDays.length === 0 ? "*" : newDays.join(",")
                                }))
                              } else {
                                const newDays = [...selectedDays, i].sort((a, b) => a - b)
                                setSelectedDays(newDays)
                                setConfig(prev => ({ ...prev, dayOfWeek: newDays.join(",") }))
                              }
                            }}
                            className="h-auto py-2 flex-col"
                          >
                            <div className="text-xs font-medium">{day.substring(0, 3)}</div>
                            <div className="text-xs text-muted-foreground">{i}</div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDays([1, 2, 3, 4, 5])
                          setConfig(prev => ({ ...prev, dayOfWeek: "1-5" }))
                        }}
                      >
                        Weekdays
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDays([0, 6])
                          setConfig(prev => ({ ...prev, dayOfWeek: "0,6" }))
                        }}
                      >
                        Weekends
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDays([])
                          setConfig(prev => ({ ...prev, dayOfWeek: "*" }))
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Quick Tab */}
                  <TabsContent value="quick" className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Quick presets to get you started
                    </p>
                    {CRON_PRESETS.slice(0, 8).map(preset => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => loadPreset(preset)}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {preset.name}
                      </Button>
                    ))}
                  </TabsContent>
                </Tabs>
              </Card>
            )}

            {/* Next Executions */}
            {isValid && nextExecutions.length > 0 && (
              <Card className="glass border-white/10 p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Next 10 Executions
                </h3>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {nextExecutions.map((exec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          #{i + 1}
                        </Badge>
                        <div>
                          <p className="font-mono text-sm">
                            {exec.date.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400">{exec.relative}</p>
                        </div>
                      </div>
                      <PlayCircle className="w-4 h-4 text-secondary" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Platform Code */}
            <Card className="glass border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Platform Code
                </h3>
                <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crontab">Linux Crontab</SelectItem>
                    <SelectItem value="github">GitHub Actions</SelectItem>
                    <SelectItem value="aws">AWS CloudWatch</SelectItem>
                    <SelectItem value="k8s">Kubernetes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto max-h-80">
                  <code className="text-primary text-sm font-mono">
                    {generatePlatformCode()}
                  </code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generatePlatformCode())}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
