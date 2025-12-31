"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart2,
  RefreshCw,
  AlertCircle,
  Briefcase,
  Award,
  Target,
  Activity,
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

// ============================================================================
// TYPES
// ============================================================================

interface OccupationData {
  id: string
  code: string
  name: string
  currentSalary: number
  previousSalary: number
  change: number
  changePercent: number
  trend: "up" | "down" | "flat"
  history: Array<{ year: string; salary: number }>
}

interface BLSResponse {
  occupations: OccupationData[]
  fetchedAt: string
  source: string
  note: string
}

interface KPIData {
  label: string
  value: string
  change: number
  trend: "up" | "down"
  icon: React.ReactNode
  color: string
}

interface MarketPulseSectionProps {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatSalary(salary: number): string {
  if (salary >= 1000) {
    return `$${(salary / 1000).toFixed(0)}K`
  }
  return `$${salary.toLocaleString()}`
}

function formatFullSalary(salary: number): string {
  return `$${salary.toLocaleString()}`
}

// Color palette for charts
const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(160, 84%, 39%)", // emerald
  "hsl(199, 89%, 48%)", // cyan
  "hsl(271, 91%, 65%)", // purple
  "hsl(24, 94%, 50%)",  // orange
  "hsl(340, 82%, 52%)", // pink
]

// ============================================================================
// COMPONENT
// ============================================================================

export default function MarketPulseSection({ activeSubItem, onSubItemHandled }: MarketPulseSectionProps) {
  const [selectedView, setSelectedView] = React.useState<"salaries" | "trends">("salaries")

  // Handle sub-item navigation
  React.useEffect(() => {
    if (activeSubItem) {
      if (activeSubItem === "salaries" || activeSubItem === "trends") {
        setSelectedView(activeSubItem)
      }
      onSubItemHandled?.()
    }
  }, [activeSubItem, onSubItemHandled])

  // Fetch BLS data
  const { data, isLoading, error, refetch, isFetching } = useQuery<BLSResponse>({
    queryKey: ["bls-wages"],
    queryFn: async () => {
      const response = await fetch("/api/bls")
      if (!response.ok) throw new Error("Failed to fetch BLS data")
      return response.json()
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  // Calculate KPI metrics
  const kpiData: KPIData[] = React.useMemo(() => {
    if (!data?.occupations?.length) return []

    const occupations = data.occupations
    const avgSalary = Math.round(occupations.reduce((sum, o) => sum + o.currentSalary, 0) / occupations.length)
    const avgChange = occupations.reduce((sum, o) => sum + o.changePercent, 0) / occupations.length
    const topGrower = occupations.reduce((top, o) => o.changePercent > top.changePercent ? o : top, occupations[0])
    const highestPaid = occupations.reduce((top, o) => o.currentSalary > top.currentSalary ? o : top, occupations[0])

    return [
      {
        label: "Avg Tech Salary",
        value: formatSalary(avgSalary),
        change: Math.round(avgChange * 10) / 10,
        trend: avgChange >= 0 ? "up" : "down",
        icon: <DollarSign className="h-4 w-4" />,
        color: "text-emerald-400",
      },
      {
        label: "Highest Paid",
        value: highestPaid.name.split(" ")[0],
        change: highestPaid.changePercent,
        trend: highestPaid.trend === "up" ? "up" : "down",
        icon: <Award className="h-4 w-4" />,
        color: "text-cyan-400",
      },
      {
        label: "Fastest Growing",
        value: topGrower.name.split(" ")[0],
        change: topGrower.changePercent,
        trend: topGrower.trend === "up" ? "up" : "down",
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-purple-400",
      },
      {
        label: "Roles Tracked",
        value: occupations.length.toString(),
        change: 0,
        trend: "up",
        icon: <Briefcase className="h-4 w-4" />,
        color: "text-blue-400",
      },
    ]
  }, [data])

  // Prepare chart data
  const salaryBarData = React.useMemo(() => {
    if (!data?.occupations) return []
    return data.occupations.map((o) => ({
      name: o.name.length > 20 ? o.name.substring(0, 18) + "..." : o.name,
      fullName: o.name,
      salary: o.currentSalary,
      change: o.changePercent,
      trend: o.trend,
    }))
  }, [data])

  const salaryTrendData = React.useMemo(() => {
    if (!data?.occupations?.length) return []

    // Get all unique years
    const allYears = new Set<string>()
    data.occupations.forEach((o) => o.history.forEach((h) => allYears.add(h.year)))
    const sortedYears = Array.from(allYears).sort()

    // Build trend data
    return sortedYears.map((year) => {
      const yearData: Record<string, string | number> = { year }
      data.occupations.forEach((o) => {
        const historyEntry = o.history.find((h) => h.year === year)
        if (historyEntry) {
          yearData[o.id] = historyEntry.salary
        }
      })
      return yearData
    })
  }, [data])

  if (error) {
    return (
      <div className="p-6">
        <Card className="glass border/20 p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Failed to Load Data</h3>
          <p className="text-secondary/70 mb-4">Unable to fetch salary data from BLS API</p>
          <Button onClick={() => refetch()} variant="outline" className="glass border/20">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground terminal-glow mb-1">Market Pulse</h1>
          <p className="text-secondary/70">Tech salary trends from Bureau of Labor Statistics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="glass border/20"
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass border/20 p-4 animate-pulse">
              <div className="h-4 bg-secondary/20 rounded w-24 mb-3" />
              <div className="h-8 bg-secondary/20 rounded w-16" />
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass border/20 p-4 hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-secondary/70 text-sm font-medium">{kpi.label}</span>
                  <span className={kpi.color}>{kpi.icon}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                  {kpi.change !== 0 && (
                    <div className={`flex items-center text-sm ${kpi.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                      {kpi.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(kpi.change)}%
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as "salaries" | "trends")} className="space-y-6">
        <TabsList className="glass-dark border/20">
          <TabsTrigger value="salaries" className="data-[state=active]:bg-primary/20">
            <BarChart2 className="h-4 w-4 mr-2" />
            Salaries
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-primary/20">
            <Activity className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="salaries" className="space-y-6">
          {/* Salary Bar Chart */}
          <Card className="glass border/20 p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Annual Mean Wages by Occupation</h3>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salaryBarData} layout="vertical" margin={{ left: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => formatSalary(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                    itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    formatter={(value: number) => formatFullSalary(value)}
                  />
                  <Bar dataKey="salary" radius={[0, 4, 4, 0]}>
                    {salaryBarData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Salary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.occupations.map((occupation, index) => (
              <motion.div
                key={occupation.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass border/20 p-4 hover:border-primary/40 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{occupation.name}</h4>
                      <p className="text-xs text-secondary/50 font-mono">{occupation.code}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${occupation.trend === "up" ? "border-emerald-500/30 text-emerald-400" : "border-red-500/30 text-red-400"}`}
                    >
                      {occupation.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {occupation.changePercent > 0 ? "+" : ""}{occupation.changePercent}%
                    </Badge>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-foreground">{formatFullSalary(occupation.currentSalary)}</span>
                    <span className="text-sm text-secondary/50">annual mean</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Salary Trends Over Time */}
          <Card className="glass border/20 p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Salary Trends Over Time</h3>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={salaryTrendData}>
                  <defs>
                    {data?.occupations.map((o, i) => (
                      <linearGradient key={o.id} id={`gradient-${o.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => formatSalary(value)}
                    domain={['auto', 'auto']}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                    itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    formatter={(value: number) => formatFullSalary(value)}
                  />
                  <Legend />
                  {data?.occupations.map((o, i) => (
                    <Area
                      key={o.id}
                      type="monotone"
                      dataKey={o.id}
                      name={o.name}
                      stroke={CHART_COLORS[i % CHART_COLORS.length]}
                      fill={`url(#gradient-${o.id})`}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Year-over-Year Changes */}
          <Card className="glass border/20 p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Year-over-Year Salary Changes</h3>
            <div className="space-y-4">
              {data?.occupations
                .sort((a, b) => b.changePercent - a.changePercent)
                .map((occupation, index) => {
                  const percentage = Math.abs(occupation.changePercent)
                  const maxPercent = Math.max(...(data?.occupations.map(o => Math.abs(o.changePercent)) || [10]))
                  const width = (percentage / maxPercent) * 100

                  return (
                    <div key={occupation.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">{occupation.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-secondary/70">{formatFullSalary(occupation.currentSalary)}</span>
                          <Badge
                            variant="outline"
                            className={occupation.trend === "up" ? "border-emerald-500/30 text-emerald-400" : "border-red-500/30 text-red-400"}
                          >
                            {occupation.changePercent > 0 ? "+" : ""}{occupation.changePercent}%
                          </Badge>
                        </div>
                      </div>
                      <div className="relative h-2 bg-secondary/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className={`absolute inset-y-0 left-0 rounded-full ${occupation.trend === "up" ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Source Footer */}
      {data && (
        <Card className="glass border/20 p-4">
          <div className="flex items-start gap-3 text-sm text-secondary/70">
            <Target className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium text-foreground mb-1">Data Source</p>
              <p>{data.source}</p>
              <p className="text-xs mt-1">{data.note}</p>
              <p className="text-xs mt-1">Last updated: {new Date(data.fetchedAt).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
