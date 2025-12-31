"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Activity,
  WifiOff,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Settings,
  Download,
  Filter,
  MapPin,
  Battery,
  Signal,
  Zap,
  Cloud,
  Eye,
  Bell,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Cpu,
  Radio,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, ScrollArea, Progress, Separator, Input, Label } from "@ggprompts/ui"
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
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

// ============================================================================
// TYPES
// ============================================================================

type SensorType = "temperature" | "humidity" | "pressure" | "motion" | "light" | "air_quality" | "power" | "vibration"
type SensorStatus = "online" | "offline" | "warning" | "critical"
type AlertSeverity = "critical" | "warning" | "info"
type Zone = "Zone A" | "Zone B" | "Zone C"

interface Sensor {
  id: string
  name: string
  type: SensorType
  zone: Zone
  value: number
  unit: string
  status: SensorStatus
  lastUpdated: Date
  battery?: number
  signal?: number
  threshold: {
    min: number
    max: number
  }
  trend: number[]
}

interface TimeSeriesData {
  time: string
  [key: string]: string | number
}

interface Alert {
  id: string
  sensorId: string
  sensorName: string
  severity: AlertSeverity
  message: string
  time: Date
  acknowledged: boolean
}

interface EnvironmentalControl {
  id: string
  name: string
  type: "hvac" | "fan" | "humidity"
  status: "on" | "off" | "auto"
  target: number
  current: number
  power: number
}

interface Anomaly {
  sensorId: string
  sensorName: string
  score: number
  deviation: number
  detected: Date
}

// ============================================================================
// MOCK DATA & GENERATORS
// ============================================================================

const SENSOR_CONFIGS: Omit<Sensor, "value" | "lastUpdated" | "trend">[] = [
  {
    id: "temp-01",
    name: "Room 101 Temperature",
    type: "temperature",
    zone: "Zone A",
    unit: "°C",
    status: "online",
    battery: 87,
    signal: 92,
    threshold: { min: 18, max: 24 },
  },
  {
    id: "temp-02",
    name: "Room 102 Temperature",
    type: "temperature",
    zone: "Zone A",
    unit: "°C",
    status: "online",
    battery: 65,
    signal: 88,
    threshold: { min: 18, max: 24 },
  },
  {
    id: "temp-03",
    name: "Server Room Temperature",
    type: "temperature",
    zone: "Zone B",
    unit: "°C",
    status: "warning",
    battery: 92,
    signal: 95,
    threshold: { min: 16, max: 20 },
  },
  {
    id: "humid-01",
    name: "Room 101 Humidity",
    type: "humidity",
    zone: "Zone A",
    unit: "%",
    status: "online",
    battery: 78,
    signal: 85,
    threshold: { min: 40, max: 60 },
  },
  {
    id: "humid-02",
    name: "Room 102 Humidity",
    type: "humidity",
    zone: "Zone A",
    unit: "%",
    status: "online",
    battery: 81,
    signal: 90,
    threshold: { min: 40, max: 60 },
  },
  {
    id: "humid-03",
    name: "Server Room Humidity",
    type: "humidity",
    zone: "Zone B",
    unit: "%",
    status: "online",
    battery: 88,
    signal: 93,
    threshold: { min: 35, max: 55 },
  },
  {
    id: "press-01",
    name: "Atmospheric Pressure",
    type: "pressure",
    zone: "Zone A",
    unit: "hPa",
    status: "online",
    signal: 96,
    threshold: { min: 1000, max: 1020 },
  },
  {
    id: "press-02",
    name: "HVAC Pressure",
    type: "pressure",
    zone: "Zone B",
    unit: "kPa",
    status: "online",
    signal: 94,
    threshold: { min: 98, max: 105 },
  },
  {
    id: "motion-01",
    name: "Entrance Motion",
    type: "motion",
    zone: "Zone A",
    unit: "",
    status: "online",
    battery: 92,
    signal: 87,
    threshold: { min: 0, max: 1 },
  },
  {
    id: "motion-02",
    name: "Hallway Motion",
    type: "motion",
    zone: "Zone A",
    unit: "",
    status: "online",
    battery: 75,
    signal: 82,
    threshold: { min: 0, max: 1 },
  },
  {
    id: "light-01",
    name: "Ambient Light",
    type: "light",
    zone: "Zone A",
    unit: "lux",
    status: "online",
    battery: 84,
    signal: 89,
    threshold: { min: 300, max: 800 },
  },
  {
    id: "light-02",
    name: "Server Room Light",
    type: "light",
    zone: "Zone B",
    unit: "lux",
    status: "online",
    battery: 79,
    signal: 91,
    threshold: { min: 200, max: 600 },
  },
  {
    id: "air-01",
    name: "Air Quality (PM2.5)",
    type: "air_quality",
    zone: "Zone A",
    unit: "µg/m³",
    status: "online",
    battery: 68,
    signal: 86,
    threshold: { min: 0, max: 35 },
  },
  {
    id: "air-02",
    name: "CO2 Levels",
    type: "air_quality",
    zone: "Zone B",
    unit: "ppm",
    status: "critical",
    battery: 72,
    signal: 88,
    threshold: { min: 400, max: 1000 },
  },
  {
    id: "power-01",
    name: "Main Power Draw",
    type: "power",
    zone: "Zone A",
    unit: "kW",
    status: "online",
    threshold: { min: 0, max: 50 },
  },
  {
    id: "power-02",
    name: "Server Power",
    type: "power",
    zone: "Zone B",
    unit: "kW",
    status: "online",
    threshold: { min: 0, max: 20 },
  },
  {
    id: "vib-01",
    name: "HVAC Vibration",
    type: "vibration",
    zone: "Zone B",
    unit: "mm/s",
    status: "online",
    battery: 91,
    signal: 94,
    threshold: { min: 0, max: 10 },
  },
  {
    id: "vib-02",
    name: "Pump Vibration",
    type: "vibration",
    zone: "Zone C",
    unit: "mm/s",
    status: "warning",
    battery: 45,
    signal: 78,
    threshold: { min: 0, max: 8 },
  },
]

const generateSensorValue = (type: SensorType, config: { min: number; max: number }): number => {
  const { min, max } = config
  const range = max - min
  const baseValue = min + range / 2

  switch (type) {
    case "temperature":
      return baseValue + (Math.random() - 0.5) * range * 0.3
    case "humidity":
      return baseValue + (Math.random() - 0.5) * range * 0.4
    case "pressure":
      return baseValue + (Math.random() - 0.5) * range * 0.2
    case "motion":
      return Math.random() > 0.9 ? 1 : 0
    case "light":
      return baseValue + (Math.random() - 0.5) * range * 0.5
    case "air_quality":
      return min + Math.random() * range * 0.6
    case "power":
      return min + Math.random() * range * 0.7
    case "vibration":
      return min + Math.random() * range * 0.4
    default:
      return baseValue
  }
}

const getSensorIcon = (type: SensorType) => {
  switch (type) {
    case "temperature":
      return Thermometer
    case "humidity":
      return Droplets
    case "pressure":
      return Gauge
    case "motion":
      return Activity
    case "light":
      return Lightbulb
    case "air_quality":
      return Wind
    case "power":
      return Zap
    case "vibration":
      return Radio
    default:
      return Cpu
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function IoTSensorDashboard() {
  const [isLive, setIsLive] = useState(true)
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [selectedSensors, setSelectedSensors] = useState<Set<string>>(new Set(["temp-01", "humid-01", "press-01"]))
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "alert-1",
      sensorId: "temp-03",
      sensorName: "Server Room Temperature",
      severity: "warning",
      message: "Temperature approaching upper threshold (23.8°C)",
      time: new Date(Date.now() - 180000),
      acknowledged: false,
    },
    {
      id: "alert-2",
      sensorId: "air-02",
      sensorName: "CO2 Levels",
      severity: "critical",
      message: "CO2 levels critically high (1,247 ppm)",
      time: new Date(Date.now() - 420000),
      acknowledged: false,
    },
    {
      id: "alert-3",
      sensorId: "vib-02",
      sensorName: "Pump Vibration",
      severity: "warning",
      message: "Vibration levels elevated, maintenance recommended",
      time: new Date(Date.now() - 600000),
      acknowledged: true,
    },
  ])
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      sensorId: "temp-03",
      sensorName: "Server Room Temperature",
      score: 87,
      deviation: 2.3,
      detected: new Date(Date.now() - 300000),
    },
    {
      sensorId: "air-02",
      sensorName: "CO2 Levels",
      score: 94,
      deviation: 3.8,
      detected: new Date(Date.now() - 480000),
    },
  ])
  const [controls, setControls] = useState<EnvironmentalControl[]>([
    {
      id: "hvac-01",
      name: "Main HVAC",
      type: "hvac",
      status: "auto",
      target: 22,
      current: 21.5,
      power: 12.4,
    },
    {
      id: "fan-01",
      name: "Circulation Fan",
      type: "fan",
      status: "on",
      target: 75,
      current: 72,
      power: 0.8,
    },
    {
      id: "humid-ctrl-01",
      name: "Humidity Control",
      type: "humidity",
      status: "auto",
      target: 50,
      current: 52,
      power: 2.3,
    },
  ])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [filterZone, setFilterZone] = useState<Zone | "All">("All")
  const [filterStatus, setFilterStatus] = useState<SensorStatus | "All">("All")
  const [selectedView, setSelectedView] = useState<"grid" | "map" | "chart">("grid")

  // Initialize sensors
  useEffect(() => {
    const initialSensors: Sensor[] = SENSOR_CONFIGS.map((config) => ({
      ...config,
      value: generateSensorValue(config.type, config.threshold),
      lastUpdated: new Date(),
      trend: Array.from({ length: 20 }, () => generateSensorValue(config.type, config.threshold)),
    }))
    setSensors(initialSensors)

    // Initialize time series
    const initialTimeSeries: TimeSeriesData[] = Array.from({ length: 100 }, (_, i) => {
      const time = new Date(Date.now() - (100 - i) * 5000)
      const data: TimeSeriesData = {
        time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      }
      initialSensors.forEach((sensor) => {
        data[sensor.id] = Number(generateSensorValue(sensor.type, sensor.threshold).toFixed(2))
      })
      return data
    })
    setTimeSeriesData(initialTimeSeries)
  }, [])

  // Real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Update sensor values
      setSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          const newValue = generateSensorValue(sensor.type, sensor.threshold)
          const newTrend = [...sensor.trend.slice(-19), newValue]

          // Check for threshold violations
          let newStatus = sensor.status
          if (newValue > sensor.threshold.max || newValue < sensor.threshold.min) {
            newStatus = Math.abs(newValue - sensor.threshold.max) > 5 || Math.abs(newValue - sensor.threshold.min) > 5 ? "critical" : "warning"
          } else {
            newStatus = "online"
          }

          // Random offline sensors
          if (Math.random() > 0.99) {
            newStatus = "offline"
          }

          return {
            ...sensor,
            value: Number(newValue.toFixed(2)),
            status: newStatus,
            lastUpdated: new Date(),
            trend: newTrend,
          }
        })
      )

      // Update time series
      setTimeSeriesData((prevData) => {
        const newPoint: TimeSeriesData = {
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        }
        sensors.forEach((sensor) => {
          newPoint[sensor.id] = Number(generateSensorValue(sensor.type, sensor.threshold).toFixed(2))
        })
        return [...prevData.slice(-99), newPoint]
      })

      // Update controls
      setControls((prevControls) =>
        prevControls.map((control) => ({
          ...control,
          current: control.current + (Math.random() - 0.5) * 0.5,
          power: control.power + (Math.random() - 0.5) * 0.2,
        }))
      )

      setLastUpdate(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isLive, sensors])

  // Filtered sensors
  const filteredSensors = useMemo(() => {
    return sensors.filter((sensor) => {
      if (filterZone !== "All" && sensor.zone !== filterZone) return false
      if (filterStatus !== "All" && sensor.status !== filterStatus) return false
      return true
    })
  }, [sensors, filterZone, filterStatus])

  // Status counts
  const statusCounts = useMemo(() => {
    return sensors.reduce(
      (acc, sensor) => {
        acc[sensor.status] = (acc[sensor.status] || 0) + 1
        return acc
      },
      {} as Record<SensorStatus, number>
    )
  }, [sensors])

  // Time ago helper
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  // Toggle sensor in chart
  const toggleSensor = (sensorId: string) => {
    setSelectedSensors((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(sensorId)) {
        newSet.delete(sensorId)
      } else {
        newSet.add(sensorId)
      }
      return newSet
    })
  }

  // Acknowledge alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const activeAlerts = alerts.filter((a) => !a.acknowledged)

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">IoT Sensor Monitoring</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time environmental and device monitoring</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge variant={isLive ? "default" : "secondary"} className="gap-1">
            {isLive ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isLive ? "Live" : "Disconnected"}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Updated {timeAgo(lastUpdate)}
          </Badge>
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-2"
          >
            {isLive ? <Pause className="h-4 w-4 sm:mr-2" /> : <Play className="h-4 w-4 sm:mr-2" />}
            <span className="hidden sm:inline">{isLive ? "Pause" : "Resume"}</span>
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sensors</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{sensors.length}</p>
              </div>
              <Cpu className="h-8 w-8 text-secondary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="mt-2 text-3xl font-bold text-emerald-500">{statusCounts.online || 0}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="mt-2 text-3xl font-bold text-amber-500">{statusCounts.warning || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="mt-2 text-3xl font-bold text-red-500">{statusCounts.critical || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <motion.p
                  key={activeAlerts.length}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-2 text-3xl font-bold text-foreground"
                >
                  {activeAlerts.length}
                </motion.p>
              </div>
              <Bell className="h-8 w-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts Banner */}
      {activeAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div className="flex-1">
                  <p className="font-semibold text-red-500">
                    {activeAlerts.length} Active Alert{activeAlerts.length > 1 ? "s" : ""}
                  </p>
                  <div className="mt-2 space-y-1">
                    {activeAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between text-sm">
                        <span>
                          <Badge variant="outline" className="mr-2">
                            {alert.sensorName}
                          </Badge>
                          {alert.message}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* View Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <Button
            variant={selectedView === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("grid")}
          >
            Grid View
          </Button>
          <Button
            variant={selectedView === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("map")}
          >
            Map View
          </Button>
          <Button
            variant={selectedView === "chart" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("chart")}
          >
            Chart View
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value as Zone | "All")}
            className="rounded-md border border-border bg-background px-3 py-1 text-sm"
          >
            <option value="All">All Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as SensorStatus | "All")}
            className="rounded-md border border-border bg-background px-3 py-1 text-sm"
          >
            <option value="All">All Status</option>
            <option value="online">Online</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Sensor Grid View */}
      {selectedView === "grid" && (
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSensors.map((sensor) => {
            const Icon = getSensorIcon(sensor.type)
            const isOutOfRange =
              sensor.value > sensor.threshold.max || sensor.value < sensor.threshold.min

            return (
              <motion.div
                key={sensor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  className={`glass border-border transition-all ${
                    sensor.status === "critical"
                      ? "border-red-500/50 shadow-lg shadow-red-500/20"
                      : sensor.status === "warning"
                        ? "border-amber-500/50 shadow-lg shadow-amber-500/20"
                        : sensor.status === "offline"
                          ? "border-muted opacity-60"
                          : ""
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={`h-5 w-5 ${
                              sensor.status === "critical"
                                ? "text-red-500"
                                : sensor.status === "warning"
                                  ? "text-amber-500"
                                  : sensor.status === "offline"
                                    ? "text-muted-foreground"
                                    : "text-emerald-500"
                            }`}
                          />
                          <Badge variant="outline" className="text-xs">
                            {sensor.zone}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm font-medium text-muted-foreground">{sensor.name}</p>
                        <motion.div
                          key={sensor.value}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            backgroundColor: isOutOfRange
                              ? "rgba(239, 68, 68, 0.1)"
                              : "transparent",
                          }}
                          className="mt-2 rounded p-1"
                        >
                          <p
                            className={`text-3xl font-bold ${
                              sensor.status === "critical"
                                ? "text-red-500"
                                : sensor.status === "warning"
                                  ? "text-amber-500"
                                  : "text-foreground"
                            }`}
                          >
                            {sensor.type === "motion"
                              ? sensor.value === 1
                                ? "DETECTED"
                                : "CLEAR"
                              : sensor.value.toFixed(1)}
                            <span className="ml-1 text-base text-muted-foreground">{sensor.unit}</span>
                          </p>
                        </motion.div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {sensor.battery !== undefined && (
                          <div className="flex items-center gap-1">
                            <Battery
                              className={`h-4 w-4 ${
                                sensor.battery > 50
                                  ? "text-emerald-500"
                                  : sensor.battery > 20
                                    ? "text-amber-500"
                                    : "text-red-500"
                              }`}
                            />
                            <span className="text-xs text-muted-foreground">{sensor.battery}%</span>
                          </div>
                        )}
                        {sensor.signal !== undefined && (
                          <div className="flex items-center gap-1">
                            <Signal className="h-4 w-4 text-secondary" />
                            <span className="text-xs text-muted-foreground">{sensor.signal}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sensor.trend.map((val, i) => ({ value: val, index: i }))}>
                          <defs>
                            <linearGradient id={`gradient-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor={
                                  sensor.status === "critical"
                                    ? "#ef4444"
                                    : sensor.status === "warning"
                                      ? "#f59e0b"
                                      : "#10b981"
                                }
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor={
                                  sensor.status === "critical"
                                    ? "#ef4444"
                                    : sensor.status === "warning"
                                      ? "#f59e0b"
                                      : "#10b981"
                                }
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={
                              sensor.status === "critical"
                                ? "#ef4444"
                                : sensor.status === "warning"
                                  ? "#f59e0b"
                                  : "#10b981"
                            }
                            strokeWidth={2}
                            fill={`url(#gradient-${sensor.id})`}
                            animationDuration={300}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Updated {timeAgo(sensor.lastUpdated)}</span>
                      <Badge
                        variant={
                          sensor.status === "online"
                            ? "default"
                            : sensor.status === "offline"
                              ? "secondary"
                              : "destructive"
                        }
                        className="h-5"
                      >
                        {sensor.status}
                      </Badge>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      Range: {sensor.threshold.min}
                      {sensor.unit} - {sensor.threshold.max}
                      {sensor.unit}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Map View */}
      {selectedView === "map" && (
        <div className="mb-6">
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle>Sensor Location Map</CardTitle>
              <p className="text-sm text-muted-foreground">Interactive facility layout with sensor positions</p>
            </CardHeader>
            <CardContent>
              <div className="relative h-[600px] rounded-lg border border-border bg-muted/20">
                {/* Simplified facility map */}
                <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8">
                  {["Zone A", "Zone B", "Zone C"].map((zone) => (
                    <div
                      key={zone}
                      className="rounded-lg border-2 border-dashed border-border bg-background/50 p-4"
                    >
                      <h3 className="mb-4 text-center font-semibold">{zone}</h3>
                      <div className="space-y-3">
                        {filteredSensors
                          .filter((s) => s.zone === zone)
                          .map((sensor) => {
                            const Icon = getSensorIcon(sensor.type)
                            return (
                              <motion.div
                                key={sensor.id}
                                whileHover={{ scale: 1.05 }}
                                className={`flex items-center gap-2 rounded-lg border p-2 ${
                                  sensor.status === "critical"
                                    ? "border-red-500 bg-red-500/10"
                                    : sensor.status === "warning"
                                      ? "border-amber-500 bg-amber-500/10"
                                      : "border-border bg-background"
                                }`}
                              >
                                <Icon
                                  className={`h-4 w-4 ${
                                    sensor.status === "critical"
                                      ? "text-red-500"
                                      : sensor.status === "warning"
                                        ? "text-amber-500"
                                        : "text-emerald-500"
                                  }`}
                                />
                                <div className="flex-1">
                                  <p className="text-xs font-medium">{sensor.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {sensor.value.toFixed(1)}
                                    {sensor.unit}
                                  </p>
                                </div>
                                <Badge
                                  variant={sensor.status === "online" ? "default" : "destructive"}
                                  className="h-4 text-xs"
                                >
                                  {sensor.status}
                                </Badge>
                              </motion.div>
                            )
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart View - Live Time Series */}
      {selectedView === "chart" && (
        <div className="mb-6">
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Live Time Series Data</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Real-time sensor readings (last 100 data points)
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sensors.slice(0, 10).map((sensor) => (
                    <Button
                      key={sensor.id}
                      variant={selectedSensors.has(sensor.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSensor(sensor.id)}
                      className="gap-2"
                    >
                      {React.createElement(getSensorIcon(sensor.type), { className: "h-3 w-3" })}
                      {sensor.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value, index) => (index % 20 === 0 ? value : "")}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Legend />
                    {Array.from(selectedSensors).map((sensorId, index) => {
                      const sensor = sensors.find((s) => s.id === sensorId)
                      if (!sensor) return null

                      const colors = [
                        "#10b981",
                        "#06b6d4",
                        "#8b5cf6",
                        "#f59e0b",
                        "#ef4444",
                        "#ec4899",
                        "#14b8a6",
                        "#6366f1",
                      ]
                      const color = colors[index % colors.length]

                      return (
                        <Line
                          key={sensorId}
                          type="monotone"
                          dataKey={sensorId}
                          stroke={color}
                          strokeWidth={2}
                          dot={false}
                          name={sensor.name}
                          animationDuration={300}
                        />
                      )
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Section - Alerts, Anomalies, Controls */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alerts */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-lg">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border p-3 ${
                      alert.acknowledged
                        ? "border-border opacity-60"
                        : alert.severity === "critical"
                          ? "border-red-500/50 bg-red-500/10"
                          : alert.severity === "warning"
                            ? "border-amber-500/50 bg-amber-500/10"
                            : "border-secondary/50 bg-secondary/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{alert.sensorName}</Badge>
                          <Badge
                            variant={
                              alert.severity === "critical"
                                ? "destructive"
                                : alert.severity === "warning"
                                  ? "default"
                                  : "secondary"
                            }
                            className="capitalize"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm">{alert.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{timeAgo(alert.time)}</p>
                      </div>
                      {!alert.acknowledged && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Anomaly Detection */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-lg">Anomaly Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <div key={anomaly.sensorId} className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                        <p className="font-semibold">{anomaly.sensorName}</p>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Anomaly detected {timeAgo(anomaly.detected)}
                      </p>
                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Anomaly Score</span>
                            <span className="font-semibold">{anomaly.score}/100</span>
                          </div>
                          <Progress value={anomaly.score} className="mt-1" />
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Deviation: </span>
                          <span className="font-semibold text-amber-500">{anomaly.deviation}σ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {anomalies.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No anomalies detected
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Controls */}
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-lg">Environmental Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {controls.map((control) => (
                <div key={control.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {control.type === "hvac" ? (
                        <Thermometer className="h-4 w-4 text-secondary" />
                      ) : control.type === "fan" ? (
                        <Wind className="h-4 w-4 text-primary" />
                      ) : (
                        <Droplets className="h-4 w-4 text-blue-500" />
                      )}
                      <p className="font-semibold">{control.name}</p>
                    </div>
                    <Badge
                      variant={control.status === "on" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {control.status}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Target</span>
                      <span className="font-semibold">
                        {control.target}
                        {control.type === "hvac" ? "°C" : "%"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current</span>
                      <motion.span
                        key={Math.floor(control.current * 10)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-semibold"
                      >
                        {control.current.toFixed(1)}
                        {control.type === "hvac" ? "°C" : "%"}
                      </motion.span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Power Draw</span>
                      <span className="font-semibold text-primary">{control.power.toFixed(1)} kW</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
