"use client"

import * as React from "react"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Mail,
  Share2,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  PieChart as PieChartIcon,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Heart,
  Play,
  FileText,
  Image,
  Video,
  Percent,
  ArrowUpRight,
  ThumbsUp,
  Star,
  Radio
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button, Input, Badge, Card, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ggprompts/ui"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel,
} from "recharts"

// Types
type Campaign = {
  id: string
  name: string
  channel: string
  status: "active" | "paused" | "completed"
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  startDate: string
  endDate: string
}

// Mock Data
const generateCampaignPerformanceData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map(month => ({
    month,
    impressions: Math.floor(Math.random() * 500000) + 1000000,
    clicks: Math.floor(Math.random() * 25000) + 50000,
    conversions: Math.floor(Math.random() * 1500) + 3000,
    spend: Math.floor(Math.random() * 30000) + 60000,
  }))
}

const generateConversionFunnelData = () => [
  { stage: "Ad Impressions", value: 1000000, fill: "hsl(var(--primary))" },
  { stage: "Landing Page Views", value: 125000, fill: "hsl(var(--secondary))" },
  { stage: "Sign Ups", value: 45000, fill: "hsl(var(--accent))" },
  { stage: "Product Interest", value: 18000, fill: "hsl(var(--muted-foreground))" },
  { stage: "Conversions", value: 8500, fill: "hsl(var(--primary) / 0.7)" },
]

const generateROIByChannel = () => [
  { channel: "Google Ads", spend: 45000, revenue: 180000, roi: 300, conversions: 892, color: "hsl(var(--primary))" },
  { channel: "Facebook Ads", spend: 38000, revenue: 142500, roi: 275, conversions: 756, color: "hsl(var(--secondary))" },
  { channel: "LinkedIn Ads", spend: 28000, revenue: 98000, roi: 250, conversions: 423, color: "hsl(var(--accent))" },
  { channel: "Instagram Ads", spend: 22000, revenue: 77000, roi: 250, conversions: 334, color: "hsl(var(--muted-foreground))" },
  { channel: "Twitter Ads", spend: 15000, revenue: 45000, roi: 200, conversions: 189, color: "hsl(var(--primary) / 0.7)" },
  { channel: "Email Marketing", spend: 8000, revenue: 56000, roi: 600, conversions: 445, color: "hsl(var(--primary))" },
]

const generateEmailCampaignMetrics = () => [
  { campaign: "Product Launch Newsletter", sent: 45000, opened: 18900, clicked: 5670, conversions: 892, openRate: 42, ctr: 12.6 },
  { campaign: "Weekly Digest #47", sent: 38000, opened: 14820, clicked: 4446, conversions: 556, openRate: 39, ctr: 11.7 },
  { campaign: "Flash Sale Alert", sent: 52000, opened: 26000, clicked: 10400, conversions: 1872, openRate: 50, ctr: 20.0 },
  { campaign: "Customer Success Stories", sent: 28000, opened: 9520, clicked: 2380, conversions: 334, openRate: 34, ctr: 8.5 },
  { campaign: "Feature Update Announcement", sent: 35000, opened: 14000, clicked: 4200, conversions: 630, openRate: 40, ctr: 12.0 },
]

const generateSocialMediaEngagement = () => {
  const days = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      facebook: Math.floor(Math.random() * 5000) + 8000,
      twitter: Math.floor(Math.random() * 3000) + 4000,
      instagram: Math.floor(Math.random() * 6000) + 10000,
      linkedin: Math.floor(Math.random() * 2000) + 3000,
    })
  }
  return days
}

const generateContentPerformance = () => [
  { title: "10 Tips for Productivity", type: "Blog Post", views: 45230, shares: 1234, comments: 456, engagement: 8.2 },
  { title: "Product Demo Video", type: "Video", views: 89450, shares: 2345, comments: 892, engagement: 12.5 },
  { title: "Customer Success Story: Acme Corp", type: "Case Study", views: 23450, shares: 567, comments: 234, engagement: 6.8 },
  { title: "Industry Trends Report 2024", type: "Whitepaper", views: 34560, shares: 890, comments: 345, engagement: 7.9 },
  { title: "How to Guide: Getting Started", type: "Tutorial", views: 56780, shares: 1567, comments: 678, engagement: 9.4 },
  { title: "Infographic: Stats & Facts", type: "Infographic", views: 67890, shares: 2890, comments: 456, engagement: 11.2 },
]

const generateLeadGenerationBySource = () => [
  { source: "Organic Search", leads: 4500, percentage: 35, cost: 12000, cpl: 2.67, fill: "hsl(var(--primary))" },
  { source: "Paid Search", leads: 3200, percentage: 25, cost: 28000, cpl: 8.75, fill: "hsl(var(--secondary))" },
  { source: "Social Media", leads: 2400, percentage: 19, cost: 18000, cpl: 7.50, fill: "hsl(var(--accent))" },
  { source: "Email", leads: 1800, percentage: 14, cost: 8000, cpl: 4.44, fill: "hsl(var(--muted-foreground))" },
  { source: "Referral", leads: 900, percentage: 7, cost: 3000, cpl: 3.33, fill: "hsl(var(--primary) / 0.7)" },
]

const generateCustomerJourneyHeatmap = () => {
  const stages = ["Awareness", "Consideration", "Decision", "Purchase", "Retention"]
  const channels = ["Organic", "Paid Ads", "Social", "Email", "Referral"]

  return stages.map(stage => {
    const data: any = { stage }
    channels.forEach(channel => {
      data[channel] = Math.floor(Math.random() * 100) + 20
    })
    return data
  })
}

const generateAttributionModel = () => [
  { model: "First Touch", conversions: 2840, revenue: 284000 },
  { model: "Last Touch", conversions: 3120, revenue: 312000 },
  { model: "Linear", conversions: 2980, revenue: 298000 },
  { model: "Time Decay", conversions: 3050, revenue: 305000 },
  { model: "Position Based", conversions: 2920, revenue: 292000 },
]

const generateAdSpendVsRevenue = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map(month => ({
    month,
    adSpend: Math.floor(Math.random() * 30000) + 60000,
    revenue: Math.floor(Math.random() * 150000) + 250000,
    roas: 0,
  })).map(d => ({ ...d, roas: (d.revenue / d.adSpend).toFixed(2) }))
}

const generateInfluencerCampaigns = () => [
  { influencer: "@techreview_mike", platform: "YouTube", followers: 245000, engagement: 8.5, posts: 3, reach: 567000, conversions: 234, cost: 5000 },
  { influencer: "@sarah_lifestyle", platform: "Instagram", followers: 189000, engagement: 12.3, posts: 5, reach: 890000, conversions: 445, cost: 3500 },
  { influencer: "@business_insights", platform: "LinkedIn", followers: 92000, engagement: 6.7, posts: 4, reach: 234000, conversions: 156, cost: 2500 },
  { influencer: "@daily_tech", platform: "Twitter", followers: 156000, engagement: 5.2, posts: 8, reach: 456000, conversions: 189, cost: 2000 },
]

const generateCampaigns = (): Campaign[] => [
  { id: "CMP-001", name: "Summer Sale 2024", channel: "Google Ads", status: "active", budget: 50000, spent: 32450, impressions: 1245000, clicks: 24560, conversions: 892, startDate: "2024-06-01", endDate: "2024-08-31" },
  { id: "CMP-002", name: "Brand Awareness Q2", channel: "Facebook", status: "active", budget: 35000, spent: 28900, impressions: 2340000, clicks: 18900, conversions: 556, startDate: "2024-04-01", endDate: "2024-06-30" },
  { id: "CMP-003", name: "Product Launch Campaign", channel: "LinkedIn", status: "completed", budget: 25000, spent: 24800, impressions: 567000, clicks: 12340, conversions: 445, startDate: "2024-01-15", endDate: "2024-03-15" },
  { id: "CMP-004", name: "Email Nurture Series", channel: "Email", status: "active", budget: 8000, spent: 5600, impressions: 0, clicks: 8900, conversions: 334, startDate: "2024-01-01", endDate: "2024-12-31" },
  { id: "CMP-005", name: "Retargeting Campaign", channel: "Instagram", status: "active", budget: 20000, spent: 12300, impressions: 890000, clicks: 15600, conversions: 378, startDate: "2024-05-01", endDate: "2024-07-31" },
]

export default function MarketingDashboard() {
  const [timeRange, setTimeRange] = React.useState("30d")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedChannel, setSelectedChannel] = React.useState("all")

  // Data
  const campaignPerformanceData = generateCampaignPerformanceData()
  const conversionFunnelData = generateConversionFunnelData()
  const roiByChannel = generateROIByChannel()
  const emailCampaignMetrics = generateEmailCampaignMetrics()
  const socialMediaEngagement = generateSocialMediaEngagement()
  const contentPerformance = generateContentPerformance()
  const leadGenerationBySource = generateLeadGenerationBySource()
  const customerJourneyHeatmap = generateCustomerJourneyHeatmap()
  const attributionModel = generateAttributionModel()
  const adSpendVsRevenue = generateAdSpendVsRevenue()
  const influencerCampaigns = generateInfluencerCampaigns()
  const campaigns = generateCampaigns()

  // Calculations
  const totalImpressions = campaignPerformanceData.reduce((sum, d) => sum + d.impressions, 0)
  const totalClicks = campaignPerformanceData.reduce((sum, d) => sum + d.clicks, 0)
  const totalConversions = campaignPerformanceData.reduce((sum, d) => sum + d.conversions, 0)
  const totalSpend = campaignPerformanceData.reduce((sum, d) => sum + d.spend, 0)
  const avgCTR = ((totalClicks / totalImpressions) * 100).toFixed(2)
  const avgConversionRate = ((totalConversions / totalClicks) * 100).toFixed(2)
  const avgCPC = (totalSpend / totalClicks).toFixed(2)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleExport = () => {
    console.log("Exporting marketing data...")
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">Marketing Dashboard</h1>
          <p className="text-secondary/70">Campaign performance, ROI tracking, and marketing analytics</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] sm:w-[180px] glass-dark border/20">
              <Calendar className="sm:mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-dark border/20">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last Quarter</SelectItem>
              <SelectItem value="1y">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} size="sm" variant="outline" className="glass border/20" disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 sm:mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button onClick={handleExport} size="sm" className="glass border/20 text-foreground">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Impressions</span>
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{(totalImpressions / 1000000).toFixed(1)}M</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                24.5%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Clicks</span>
              <MousePointer className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{(totalClicks / 1000).toFixed(0)}K</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                18.2%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">CTR</span>
              <Percent className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{avgCTR}%</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                3.1%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Conversions</span>
              <Target className="h-4 w-4 text-green-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{(totalConversions / 1000).toFixed(1)}K</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                15.8%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Conv. Rate</span>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{avgConversionRate}%</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                2.4%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Avg CPC</span>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">${avgCPC}</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingDown className="h-3 w-3 mr-1" />
                8.5%
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Campaign Performance */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Campaign Performance Overview</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={campaignPerformanceData}>
            <defs>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: '8px',
                padding: '12px',
                color: "hsl(var(--popover-foreground))"
              }}
            labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorImpressions)" strokeWidth={2} name="Impressions" />
            <Bar yAxisId="right" dataKey="clicks" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} name="Clicks" />
            <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#f59e0b" strokeWidth={3} name="Conversions" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Conversion Funnel & ROI by Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Conversion Funnel by Channel</h3>
          <div className="space-y-4">
            {conversionFunnelData.map((stage, index) => {
              const percentage = (stage.value / conversionFunnelData[0].value) * 100
              const conversionRate = index > 0 ? ((stage.value / conversionFunnelData[index - 1].value) * 100).toFixed(1) : '100.0'
              return (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-secondary/70">{stage.value.toLocaleString()}</span>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {conversionRate}%
                      </Badge>
                    </div>
                  </div>
                  <div className="relative h-3 bg-secondary/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: stage.fill }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">ROI by Marketing Channel</h3>
          <div className="space-y-4">
            {roiByChannel.map((channel, index) => (
              <div key={channel.channel} className="glass-dark border/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-foreground font-semibold">{channel.channel}</span>
                  <Badge variant="outline" className="border-primary/30 text-primary text-lg px-3">
                    {channel.roi}% ROI
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-secondary/70">Spend</p>
                    <p className="text-foreground font-semibold">${channel.spend.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-secondary/70">Revenue</p>
                    <p className="text-primary font-semibold">${channel.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-secondary/70">Conversions</p>
                    <p className="text-foreground font-semibold">{channel.conversions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Email Campaign Metrics */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Mail className="h-5 w-5 text-secondary" />
          Email Campaign Performance
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/20">
                <TableHead className="text-secondary">Campaign</TableHead>
                <TableHead className="text-secondary text-right">Sent</TableHead>
                <TableHead className="text-secondary text-right">Opened</TableHead>
                <TableHead className="text-secondary text-right">Clicked</TableHead>
                <TableHead className="text-secondary text-right">Conversions</TableHead>
                <TableHead className="text-secondary text-right">Open Rate</TableHead>
                <TableHead className="text-secondary text-right">CTR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emailCampaignMetrics.map((campaign) => (
                <TableRow key={campaign.campaign} className="border-b border-border/20 hover:bg-secondary/10">
                  <TableCell className="font-semibold text-foreground">{campaign.campaign}</TableCell>
                  <TableCell className="text-right text-secondary/70">{campaign.sent.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-foreground">{campaign.opened.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-secondary">{campaign.clicked.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-primary font-semibold">{campaign.conversions}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={
                      campaign.openRate > 40 ? "border-primary/30 text-primary" :
                      campaign.openRate > 30 ? "border-yellow-500/30 text-yellow-400" :
                      "border-red-500/30 text-red-400"
                    }>
                      {campaign.openRate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={
                      campaign.ctr > 15 ? "border-primary/30 text-primary" :
                      campaign.ctr > 10 ? "border-yellow-500/30 text-yellow-400" :
                      "border-red-500/30 text-red-400"
                    }>
                      {campaign.ctr}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Social Media Engagement */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Social Media Engagement</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={socialMediaEngagement}>
            <defs>
              <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b5998" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b5998" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTwitter" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1da1f2" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1da1f2" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e1306c" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#e1306c" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLinkedIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0077b5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0077b5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
            labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Legend />
            <Area type="monotone" dataKey="facebook" stroke="#3b5998" fillOpacity={1} fill="url(#colorFacebook)" strokeWidth={2} name="Facebook" />
            <Area type="monotone" dataKey="twitter" stroke="#1da1f2" fillOpacity={1} fill="url(#colorTwitter)" strokeWidth={2} name="Twitter" />
            <Area type="monotone" dataKey="instagram" stroke="#e1306c" fillOpacity={1} fill="url(#colorInstagram)" strokeWidth={2} name="Instagram" />
            <Area type="monotone" dataKey="linkedin" stroke="#0077b5" fillOpacity={1} fill="url(#colorLinkedIn)" strokeWidth={2} name="LinkedIn" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Content Performance */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Content Performance</h3>
        <div className="space-y-4">
          {contentPerformance.map((content, index) => (
            <div key={index} className="glass-dark border/20 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-foreground font-semibold">{content.title}</h4>
                    <Badge variant="outline" className="border-secondary/30 text-secondary text-xs">
                      {content.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {content.type === "Blog Post" && <FileText className="h-3 w-3 text-primary" />}
                    {content.type === "Video" && <Video className="h-3 w-3 text-primary" />}
                    {content.type === "Infographic" && <Image className="h-3 w-3 text-primary" />}
                    {(content.type === "Case Study" || content.type === "Whitepaper" || content.type === "Tutorial") && <FileText className="h-3 w-3 text-primary" />}
                  </div>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {content.engagement}% engagement
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-secondary/70">Views</p>
                  <p className="text-foreground font-semibold">{content.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-secondary/70">Shares</p>
                  <p className="text-secondary font-semibold">{content.shares.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-secondary/70">Comments</p>
                  <p className="text-purple-400 font-semibold">{content.comments.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Lead Generation & Customer Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Lead Generation by Source</h3>
          <div className="flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={leadGenerationBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="leads"
                  label={({ source, percentage }) => `${source}: ${percentage}%`}
                >
                  {leadGenerationBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {leadGenerationBySource.map((source) => (
              <div key={source.source} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.fill }} />
                  <span className="text-foreground">{source.source}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-secondary/70">{source.leads} leads</span>
                  <span className="text-foreground font-semibold">${source.cpl.toFixed(2)} CPL</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Customer Journey Heatmap</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 text-secondary/70 text-sm">Stage</th>
                  <th className="text-center p-2 text-secondary/70 text-sm">Organic</th>
                  <th className="text-center p-2 text-secondary/70 text-sm">Paid Ads</th>
                  <th className="text-center p-2 text-secondary/70 text-sm">Social</th>
                  <th className="text-center p-2 text-secondary/70 text-sm">Email</th>
                  <th className="text-center p-2 text-secondary/70 text-sm">Referral</th>
                </tr>
              </thead>
              <tbody>
                {customerJourneyHeatmap.map((row, rowIndex) => (
                  <tr key={row.stage}>
                    <td className="p-2 text-foreground font-medium text-sm">{row.stage}</td>
                    {["Organic", "Paid Ads", "Social", "Email", "Referral"].map((channel) => {
                      const value = row[channel]
                      const opacity = value / 120
                      return (
                        <td key={channel} className="p-1">
                          <div
                            className="h-10 flex items-center justify-center rounded text-sm font-semibold"
                            style={{
                              backgroundColor: `hsl(var(--primary) / ${opacity * 0.8})`,
                              color: opacity > 0.5 ? 'hsl(var(--background))' : 'hsl(var(--primary))'
                            }}
                          >
                            {value}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Attribution Model Comparison */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Attribution Model Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attributionModel} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="category" dataKey="model" stroke="hsl(var(--muted-foreground))" />
            <YAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
            labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
            />
            <Legend />
            <Bar dataKey="conversions" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Conversions" />
            <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} name="Revenue ($)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Ad Spend vs Revenue */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Ad Spend vs Revenue</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={adSpendVsRevenue}>
            <defs>
              <linearGradient id="colorAdSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
            labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="adSpend" stroke="#ef4444" fillOpacity={1} fill="url(#colorAdSpend)" strokeWidth={2} name="Ad Spend" />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
            <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#f59e0b" strokeWidth={3} name="ROAS" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Influencer Campaign Tracking */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Influencer Campaign Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {influencerCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.influencer}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-dark border/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-foreground font-semibold">{campaign.influencer}</h4>
                  <p className="text-xs text-secondary/70">{campaign.platform} • {campaign.followers.toLocaleString()} followers</p>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {campaign.engagement}% eng.
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-secondary/70">Posts</p>
                  <p className="text-foreground font-semibold">{campaign.posts}</p>
                </div>
                <div>
                  <p className="text-secondary/70">Reach</p>
                  <p className="text-foreground font-semibold">{campaign.reach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-secondary/70">Conversions</p>
                  <p className="text-primary font-semibold">{campaign.conversions}</p>
                </div>
                <div>
                  <p className="text-secondary/70">Cost</p>
                  <p className="text-foreground font-semibold">${campaign.cost.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Active Campaigns */}
      <Card className="glass border/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Active Campaigns</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50" />
              <Input
                placeholder="Search campaigns..."
                className="pl-10 glass-dark border/20 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/20">
                <TableHead className="text-secondary">Campaign</TableHead>
                <TableHead className="text-secondary">Channel</TableHead>
                <TableHead className="text-secondary">Status</TableHead>
                <TableHead className="text-secondary text-right">Budget</TableHead>
                <TableHead className="text-secondary text-right">Spent</TableHead>
                <TableHead className="text-secondary text-right">Impressions</TableHead>
                <TableHead className="text-secondary text-right">Clicks</TableHead>
                <TableHead className="text-secondary text-right">Conversions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns
                .filter(campaign => campaign.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((campaign) => (
                  <TableRow key={campaign.id} className="border-b border-border/20 hover:bg-secondary/10">
                    <TableCell className="font-semibold text-foreground">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-secondary/30 text-secondary">
                        {campaign.channel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        campaign.status === "active" ? "border-primary/30 text-primary" :
                        campaign.status === "paused" ? "border-yellow-500/30 text-yellow-400" :
                        "border-gray-500/30 text-gray-400"
                      }>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-secondary/70">${campaign.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <p className="text-foreground font-semibold">${campaign.spent.toLocaleString()}</p>
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1 bg-secondary/20" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-foreground">{campaign.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-secondary">{campaign.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-primary font-semibold">{campaign.conversions}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
