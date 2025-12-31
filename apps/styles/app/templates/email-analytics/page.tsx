"use client"

import * as React from "react"
import {
  Mail,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  UserCheck,
  UserX,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Users,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Check,
  CheckCircle,
  X,
  MapPin,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  RefreshCw,
  Settings,
  ChevronRight,
  ExternalLink,
  Share2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button, Input, Badge, Card, Tabs, TabsContent, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, ScrollArea, Progress, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ggprompts/ui"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

// Campaign performance data
const campaigns = [
  {
    id: "1",
    name: "November Newsletter",
    subject: "Your Monthly Update",
    sent: "2025-11-15",
    recipients: 45230,
    delivered: 44892,
    opened: 14365,
    clicked: 1894,
    converted: 289,
    unsubscribed: 56,
    bounced: 338,
    status: "completed"
  },
  {
    id: "2",
    name: "Black Friday Sale",
    subject: "50% Off Everything - Today Only!",
    sent: "2025-11-20",
    recipients: 52100,
    delivered: 51780,
    opened: 20712,
    clicked: 4142,
    converted: 1242,
    unsubscribed: 104,
    bounced: 320,
    status: "completed"
  },
  {
    id: "3",
    name: "Product Launch",
    subject: "Introducing: Our Newest Feature",
    sent: "2025-11-18",
    recipients: 38400,
    delivered: 38016,
    opened: 12165,
    clicked: 2281,
    converted: 456,
    unsubscribed: 76,
    bounced: 384,
    status: "completed"
  },
  {
    id: "4",
    name: "Welcome Series - Day 1",
    subject: "Welcome to Acme Inc!",
    sent: "2025-11-21",
    recipients: 1240,
    delivered: 1228,
    opened: 614,
    clicked: 184,
    converted: 74,
    unsubscribed: 6,
    bounced: 12,
    status: "active"
  },
  {
    id: "5",
    name: "Cart Abandonment",
    subject: "You left something behind...",
    sent: "2025-11-21",
    recipients: 2840,
    delivered: 2812,
    opened: 1125,
    clicked: 450,
    converted: 180,
    unsubscribed: 14,
    bounced: 28,
    status: "active"
  }
]

// Open rate over time data
const openRateData = [
  { date: "Nov 1", opens: 28, clicks: 4.2 },
  { date: "Nov 5", opens: 32, clicks: 5.1 },
  { date: "Nov 10", opens: 30, clicks: 4.8 },
  { date: "Nov 15", opens: 35, clicks: 6.2 },
  { date: "Nov 20", opens: 42, clicks: 8.5 },
  { date: "Nov 22", opens: 38, clicks: 7.1 }
]

// Geographic data
const geographicData = [
  { country: "United States", opens: 12450, percentage: 42 },
  { country: "United Kingdom", opens: 5230, percentage: 18 },
  { country: "Canada", opens: 3890, percentage: 13 },
  { country: "Australia", opens: 2340, percentage: 8 },
  { country: "Germany", opens: 1890, percentage: 6 },
  { country: "Others", opens: 3835, percentage: 13 }
]

// Device/client breakdown
const deviceData = [
  { name: "Mobile", value: 58, color: "hsl(var(--primary))" },
  { name: "Desktop", value: 35, color: "hsl(var(--chart-2))" },
  { name: "Tablet", value: 7, color: "hsl(var(--chart-3))" }
]

const clientData = [
  { name: "Gmail", value: 42, count: 12450 },
  { name: "Apple Mail", value: 28, count: 8300 },
  { name: "Outlook", value: 18, count: 5340 },
  { name: "Yahoo", value: 8, count: 2370 },
  { name: "Others", value: 4, count: 1185 }
]

// Time of day performance
const timeOfDayData = [
  { hour: "12 AM", opens: 120 },
  { hour: "3 AM", opens: 80 },
  { hour: "6 AM", opens: 450 },
  { hour: "9 AM", opens: 1240 },
  { hour: "12 PM", opens: 890 },
  { hour: "3 PM", opens: 780 },
  { hour: "6 PM", opens: 1120 },
  { hour: "9 PM", opens: 560 }
]

// Subscriber growth
const subscriberGrowthData = [
  { month: "Jun", subscribers: 38200, growth: 1240 },
  { month: "Jul", subscribers: 40100, growth: 1900 },
  { month: "Aug", subscribers: 42300, growth: 2200 },
  { month: "Sep", subscribers: 43800, growth: 1500 },
  { month: "Oct", subscribers: 44600, growth: 800 },
  { month: "Nov", subscribers: 45230, growth: 630 }
]

// Top clicked links
const topLinks = [
  { url: "https://acme.com/products/new-feature", clicks: 2340, ctr: 8.2 },
  { url: "https://acme.com/blog/announcement", clicks: 1890, ctr: 6.6 },
  { url: "https://acme.com/pricing", clicks: 1450, ctr: 5.1 },
  { url: "https://acme.com/signup", clicks: 1120, ctr: 3.9 },
  { url: "https://acme.com/docs/getting-started", clicks: 890, ctr: 3.1 }
]

export default function EmailAnalyticsPage() {
  const [selectedCampaign, setSelectedCampaign] = React.useState<string | null>(null)
  const [dateRange, setDateRange] = React.useState("30d")
  const [sortBy, setSortBy] = React.useState("sent")

  const calculateMetrics = (campaign: typeof campaigns[0]) => {
    const openRate = ((campaign.opened / campaign.delivered) * 100).toFixed(1)
    const clickRate = ((campaign.clicked / campaign.delivered) * 100).toFixed(1)
    const conversionRate = ((campaign.converted / campaign.delivered) * 100).toFixed(1)
    const unsubscribeRate = ((campaign.unsubscribed / campaign.delivered) * 100).toFixed(2)
    const bounceRate = ((campaign.bounced / campaign.recipients) * 100).toFixed(1)

    return { openRate, clickRate, conversionRate, unsubscribeRate, bounceRate }
  }

  const overallMetrics = React.useMemo(() => {
    const total = campaigns.reduce(
      (acc, c) => ({
        recipients: acc.recipients + c.recipients,
        delivered: acc.delivered + c.delivered,
        opened: acc.opened + c.opened,
        clicked: acc.clicked + c.clicked,
        converted: acc.converted + c.converted,
        unsubscribed: acc.unsubscribed + c.unsubscribed,
        bounced: acc.bounced + c.bounced
      }),
      { recipients: 0, delivered: 0, opened: 0, clicked: 0, converted: 0, unsubscribed: 0, bounced: 0 }
    )

    return {
      openRate: ((total.opened / total.delivered) * 100).toFixed(1),
      clickRate: ((total.clicked / total.delivered) * 100).toFixed(1),
      conversionRate: ((total.converted / total.delivered) * 100).toFixed(1),
      unsubscribeRate: ((total.unsubscribed / total.delivered) * 100).toFixed(2),
      bounceRate: ((total.bounced / total.recipients) * 100).toFixed(1),
      engagementScore: 78
    }
  }, [])

  const MetricCard = ({
    icon: Icon,
    label,
    value,
    change,
    trend,
    suffix = "%"
  }: {
    icon: any
    label: string
    value: string | number
    change?: number
    trend?: "up" | "down" | "neutral"
    suffix?: string
  }) => (
    <Card className="glass p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {change !== undefined && (
          <Badge
            variant={trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary"}
            className="text-xs"
          >
            {trend === "up" ? <ArrowUp className="h-3 w-3 mr-1" /> : trend === "down" ? <ArrowDown className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
            {Math.abs(change)}%
          </Badge>
        )}
      </div>
      <div className="text-2xl font-bold">
        {value}
        {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Card>
  )

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="glass p-3 rounded-xl">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Email Analytics Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Performance metrics and insights for your email campaigns
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <MetricCard
              icon={Eye}
              label="Open Rate"
              value={overallMetrics.openRate}
              change={2.3}
              trend="up"
            />
            <MetricCard
              icon={MousePointer}
              label="Click Rate"
              value={overallMetrics.clickRate}
              change={0.8}
              trend="up"
            />
            <MetricCard
              icon={Target}
              label="Conversion Rate"
              value={overallMetrics.conversionRate}
              change={-0.3}
              trend="down"
            />
            <MetricCard
              icon={UserX}
              label="Unsubscribe Rate"
              value={overallMetrics.unsubscribeRate}
              change={0.1}
              trend="down"
            />
            <MetricCard
              icon={AlertCircle}
              label="Bounce Rate"
              value={overallMetrics.bounceRate}
              change={0}
              trend="neutral"
            />
            <MetricCard
              icon={Activity}
              label="Engagement Score"
              value={overallMetrics.engagementScore}
              suffix="/100"
              change={3}
              trend="up"
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-8 space-y-6">
            {/* Open & Click Rates Over Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Over Time
                  </h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      Opens
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <div className="h-2 w-2 rounded-full bg-cyan-500" />
                      Clicks
                    </Badge>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={openRateData}>
                    <defs>
                      <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="opens"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorOpens)"
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorClicks)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Campaign Performance Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Campaign Performance
                  </h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search campaigns..." className="pl-9 w-64" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead className="text-right">Recipients</TableHead>
                        <TableHead className="text-right">Open Rate</TableHead>
                        <TableHead className="text-right">Click Rate</TableHead>
                        <TableHead className="text-right">Conversion</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign) => {
                        const metrics = calculateMetrics(campaign)
                        return (
                          <TableRow
                            key={campaign.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedCampaign(campaign.id)}
                          >
                            <TableCell>
                              <div>
                                <div className="font-medium">{campaign.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {campaign.subject}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {campaign.sent}
                            </TableCell>
                            <TableCell className="text-right">
                              {campaign.recipients.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Progress
                                  value={parseFloat(metrics.openRate)}
                                  className="w-16 h-2"
                                />
                                <span className="text-sm font-medium w-12">
                                  {metrics.openRate}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Progress
                                  value={parseFloat(metrics.clickRate)}
                                  className="w-16 h-2"
                                />
                                <span className="text-sm font-medium w-12">
                                  {metrics.clickRate}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline">{metrics.conversionRate}%</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={campaign.status === "completed" ? "secondary" : "default"}
                              >
                                {campaign.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </motion.div>

            {/* Time of Day Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Best Time to Send
                </h3>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={timeOfDayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="opens" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 p-4 glass-dark rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-medium">Best time to send:</span>
                    <span className="text-muted-foreground">9:00 AM - 10:00 AM</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Top Clicked Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <MousePointer className="h-5 w-5" />
                  Top Clicked Links
                </h3>

                <div className="space-y-3">
                  {topLinks.map((link, i) => (
                    <div key={i} className="glass-dark p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-primary">#{i + 1}</span>
                            <a
                              href={link.url}
                              className="text-sm font-medium hover:underline truncate"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.url}
                            </a>
                            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{link.clicks.toLocaleString()} clicks</span>
                            <span>CTR: {link.ctr}%</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={link.ctr * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Additional Metrics */}
          <div className="lg:col-span-4 space-y-6">
            {/* Device Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Device Breakdown
                </h3>

                <ResponsiveContainer width="100%" height={200}>
                  <RechartPieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartPieChart>
                </ResponsiveContainer>

                <div className="space-y-2 mt-4">
                  {deviceData.map((device) => (
                    <div key={device.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: device.color }}
                        />
                        <span>{device.name}</span>
                      </div>
                      <span className="font-semibold">{device.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Email Client Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Client Usage
                </h3>

                <div className="space-y-4">
                  {clientData.map((client) => (
                    <div key={client.name}>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="font-medium">{client.name}</span>
                        <span className="text-muted-foreground">
                          {client.count.toLocaleString()} ({client.value}%)
                        </span>
                      </div>
                      <Progress value={client.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Geographic Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Geographic Opens
                </h3>

                <div className="space-y-3">
                  {geographicData.map((location) => (
                    <div key={location.country} className="glass-dark p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium">{location.country}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {location.opens.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={location.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Subscriber Growth */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Subscriber Growth
                </h3>

                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={subscriberGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="subscribers"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="glass-dark p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Total</div>
                    <div className="text-xl font-bold">45,230</div>
                  </div>
                  <div className="glass-dark p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">This Month</div>
                    <div className="text-xl font-bold text-green-500">+630</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* List Health */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  List Health
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Engagement Score</span>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                    <Progress value={78} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">78/100</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Active Subscribers</span>
                      </div>
                      <span className="font-semibold">32,145</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>Inactive (30d)</span>
                      </div>
                      <span className="font-semibold">8,920</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span>Never Opened</span>
                      </div>
                      <span className="font-semibold">4,165</span>
                    </div>
                  </div>

                  <Separator />

                  <Button variant="outline" size="sm" className="w-full">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Clean List
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </h3>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Tracking
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
