"use client"

import * as React from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  Wallet,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Search,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Target,
  Building2,
  Users,
  TrendingDownIcon
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

// Types
type Invoice = {
  id: string
  client: string
  amount: number
  status: "paid" | "pending" | "overdue" | "cancelled"
  dueDate: string
  issuedDate: string
}

type Expense = {
  id: string
  category: string
  description: string
  amount: number
  date: string
  vendor: string
}

// Mock Data
const generateRevenueExpenseData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 300000) + 500000,
    expenses: Math.floor(Math.random() * 200000) + 300000,
    profit: 0,
  })).map(d => ({ ...d, profit: d.revenue - d.expenses }))
}

const generateProfitMarginData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map(month => ({
    month,
    margin: (Math.random() * 15 + 20).toFixed(1),
    revenue: Math.floor(Math.random() * 300000) + 500000,
  }))
}

const generateCashFlowData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map(month => ({
    month,
    operating: Math.floor(Math.random() * 200000) + 300000,
    investing: Math.floor(Math.random() * 100000) - 50000,
    financing: Math.floor(Math.random() * 50000) - 25000,
  }))
}

const generateInvoices = (): Invoice[] => [
  { id: "INV-2024-001", client: "Acme Corp", amount: 45000, status: "paid", dueDate: "2024-01-15", issuedDate: "2024-01-01" },
  { id: "INV-2024-002", client: "TechStart Inc", amount: 28500, status: "pending", dueDate: "2024-02-01", issuedDate: "2024-01-15" },
  { id: "INV-2024-003", client: "Global Solutions", amount: 67000, status: "overdue", dueDate: "2024-01-20", issuedDate: "2024-01-05" },
  { id: "INV-2024-004", client: "Innovation Labs", amount: 18900, status: "paid", dueDate: "2024-01-25", issuedDate: "2024-01-10" },
  { id: "INV-2024-005", client: "Enterprise Co", amount: 52000, status: "pending", dueDate: "2024-02-05", issuedDate: "2024-01-20" },
  { id: "INV-2024-006", client: "StartupX", amount: 15200, status: "overdue", dueDate: "2024-01-18", issuedDate: "2024-01-03" },
  { id: "INV-2024-007", client: "MegaCorp", amount: 89000, status: "pending", dueDate: "2024-02-10", issuedDate: "2024-01-25" },
  { id: "INV-2024-008", client: "CloudTech", amount: 31500, status: "paid", dueDate: "2024-01-30", issuedDate: "2024-01-15" },
]

const generateExpenseCategories = () => [
  { category: "Salaries & Wages", amount: 450000, percentage: 45, fill: "hsl(var(--primary))" },
  { category: "Marketing", amount: 120000, percentage: 12, fill: "hsl(var(--primary) / 0.8)" },
  { category: "Infrastructure", amount: 80000, percentage: 8, fill: "hsl(var(--primary) / 0.7)" },
  { category: "Office & Utilities", amount: 60000, percentage: 6, fill: "hsl(var(--primary) / 0.6)" },
  { category: "Software & Tools", amount: 45000, percentage: 4.5, fill: "hsl(var(--primary) / 0.5)" },
  { category: "Travel & Entertainment", amount: 35000, percentage: 3.5, fill: "hsl(var(--primary) / 0.4)" },
  { category: "Legal & Accounting", amount: 50000, percentage: 5, fill: "hsl(var(--primary) / 0.35)" },
  { category: "Other", amount: 160000, percentage: 16, fill: "hsl(var(--primary) / 0.3)" },
]

const generateRevenueBySegment = () => [
  { segment: "Enterprise Clients", revenue: 2400000, percentage: 48, growth: 18.5, fill: "hsl(var(--primary))" },
  { segment: "Mid-Market", revenue: 1600000, percentage: 32, growth: 12.3, fill: "hsl(var(--primary) / 0.7)" },
  { segment: "Small Business", revenue: 800000, percentage: 16, growth: 24.7, fill: "hsl(var(--primary) / 0.5)" },
  { segment: "Consulting", revenue: 200000, percentage: 4, growth: -5.2, fill: "hsl(var(--primary) / 0.3)" },
]

const generateARAgingData = () => [
  { range: "Current (0-30 days)", amount: 245000, count: 28, percentage: 62 },
  { range: "31-60 days", amount: 89000, count: 12, percentage: 22 },
  { range: "61-90 days", amount: 42000, count: 6, percentage: 11 },
  { range: "90+ days", amount: 20000, count: 4, percentage: 5 },
]

const generateBudgetVsActual = () => [
  { category: "Revenue", budget: 6000000, actual: 6450000, variance: 7.5 },
  { category: "Cost of Sales", budget: 2400000, actual: 2280000, variance: -5.0 },
  { category: "Operating Expenses", budget: 2000000, actual: 2150000, variance: 7.5 },
  { category: "Marketing", budget: 600000, actual: 580000, variance: -3.3 },
  { category: "R&D", budget: 800000, actual: 890000, variance: 11.3 },
  { category: "G&A", budget: 400000, actual: 385000, variance: -3.8 },
]

const generatePaymentCollectionData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map(month => ({
    month,
    invoiced: Math.floor(Math.random() * 200000) + 400000,
    collected: Math.floor(Math.random() * 180000) + 380000,
    collectionRate: (Math.random() * 10 + 90).toFixed(1),
  }))
}

const generateFinancialProjections = () => {
  const quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025"]
  let revenue = 1500000
  return quarters.map(quarter => {
    revenue = revenue * (1 + (Math.random() * 0.15 + 0.05))
    return {
      quarter,
      projected: Math.floor(revenue),
      conservative: Math.floor(revenue * 0.85),
      optimistic: Math.floor(revenue * 1.15),
    }
  })
}

const generateTaxLiability = () => [
  { type: "Federal Income Tax", estimated: 450000, paid: 350000, remaining: 100000, dueDate: "Q1 2024" },
  { type: "State Income Tax", estimated: 120000, paid: 90000, remaining: 30000, dueDate: "Q1 2024" },
  { type: "Payroll Tax", estimated: 85000, paid: 85000, remaining: 0, dueDate: "Monthly" },
  { type: "Sales Tax", estimated: 35000, paid: 25000, remaining: 10000, dueDate: "Monthly" },
]

export default function FinanceDashboard() {
  const [timeRange, setTimeRange] = React.useState("ytd")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")

  // Data
  const revenueExpenseData = generateRevenueExpenseData()
  const profitMarginData = generateProfitMarginData()
  const cashFlowData = generateCashFlowData()
  const invoices = generateInvoices()
  const expenseCategories = generateExpenseCategories()
  const revenueBySegment = generateRevenueBySegment()
  const arAgingData = generateARAgingData()
  const budgetVsActual = generateBudgetVsActual()
  const paymentCollectionData = generatePaymentCollectionData()
  const financialProjections = generateFinancialProjections()
  const taxLiability = generateTaxLiability()

  // Calculations
  const totalRevenue = revenueExpenseData.reduce((sum, d) => sum + d.revenue, 0)
  const totalExpenses = revenueExpenseData.reduce((sum, d) => sum + d.expenses, 0)
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1)
  const outstandingInvoices = invoices.filter(i => i.status === "pending" || i.status === "overdue")
  const outstandingAmount = outstandingInvoices.reduce((sum, i) => sum + i.amount, 0)
  const overdueInvoices = invoices.filter(i => i.status === "overdue")
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.amount, 0)
  const avgCollectionRate = paymentCollectionData.reduce((sum, d) => sum + parseFloat(d.collectionRate), 0) / paymentCollectionData.length

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleExport = () => {
    console.log("Exporting financial data...")
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Finance Dashboard</h1>
          <p className="text-secondary/70 text-sm sm:text-base">Financial performance, cash flow, and revenue tracking</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px] sm:w-[180px] glass-dark border/20 text-sm">
              <Calendar className="mr-2 h-4 w-4 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-dark border/20">
              <SelectItem value="mtd">Month to Date</SelectItem>
              <SelectItem value="qtd">Quarter to Date</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="glass border/20" disabled={isRefreshing}>
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
              <span className="text-secondary/70 text-sm font-medium">Total Revenue</span>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">${(totalRevenue / 1000000).toFixed(1)}M</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                12.5%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Total Expenses</span>
              <Receipt className="h-4 w-4 text-red-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">${(totalExpenses / 1000000).toFixed(1)}M</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingDown className="h-3 w-3 mr-1" />
                3.2%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Net Profit</span>
              <Wallet className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">${(netProfit / 1000000).toFixed(1)}M</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                18.7%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Profit Margin</span>
              <Percent className="h-4 w-4 text-green-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{profitMargin}%</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                2.3%
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Outstanding AR</span>
              <CreditCard className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">${(outstandingAmount / 1000).toFixed(0)}K</span>
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">
                {outstandingInvoices.length} invoices
              </Badge>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass border/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary/70 text-sm font-medium">Collection Rate</span>
              <Target className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{avgCollectionRate.toFixed(1)}%</span>
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                1.5%
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Revenue vs Expenses */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Revenue vs Expenses</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={revenueExpenseData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
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
            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
            <Area type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} name="Expenses" />
            <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-2))" strokeWidth={3} name="Profit" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Profit Margin & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Profit Margin Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={profitMarginData}>
              <defs>
                <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" unit="%" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Area type="monotone" dataKey="margin" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorMargin)" strokeWidth={2} name="Profit Margin %" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Cash Flow Statement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend />
              <Bar dataKey="operating" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Operating" />
              <Bar dataKey="investing" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} name="Investing" />
              <Bar dataKey="financing" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} name="Financing" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Outstanding Invoices */}
      <Card className="glass border/20 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Outstanding Invoices</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50" />
              <Input
                placeholder="Search..."
                className="pl-10 glass-dark border/20 w-full sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[130px] glass-dark border/20">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-dark border/20">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="border-b border-border/20">
                <TableHead className="text-secondary whitespace-nowrap">Invoice ID</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Client</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Amount</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Status</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Issued</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Due</TableHead>
                <TableHead className="text-secondary whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices
                .filter(invoice =>
                  (selectedCategory === "all" || invoice.status === selectedCategory) &&
                  (invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   invoice.id.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((invoice) => (
                  <TableRow key={invoice.id} className="border-b border-border/20 hover:bg-secondary/10">
                    <TableCell className="font-mono text-primary">{invoice.id}</TableCell>
                    <TableCell className="font-semibold text-foreground">{invoice.client}</TableCell>
                    <TableCell className="text-primary font-semibold">${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        invoice.status === "paid" ? "border-primary/30 text-primary" :
                        invoice.status === "pending" ? "border-yellow-500/30 text-yellow-400" :
                        invoice.status === "overdue" ? "border-red-500/30 text-red-400" :
                        "border-gray-500/30 text-gray-400"
                      }>
                        {invoice.status === "paid" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {invoice.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                        {invoice.status === "overdue" && <AlertCircle className="mr-1 h-3 w-3" />}
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-secondary/70">{invoice.issuedDate}</TableCell>
                    <TableCell className="text-secondary/70">{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="hover:bg-secondary/20">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Expense Categories & Revenue by Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Expense Categories</h3>
          <div className="flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ category, percentage }) => `${percentage}%`}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {expenseCategories.map((expense) => (
              <div key={expense.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: expense.fill }} />
                  <span className="text-foreground">{expense.category}</span>
                </div>
                <span className="text-secondary/70 font-semibold">${expense.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass border/20 p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6">Revenue by Customer Segment</h3>
          <div className="space-y-4">
            {revenueBySegment.map((segment, index) => (
              <div key={segment.segment} className="glass-dark border/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-foreground font-semibold">{segment.segment}</h4>
                  <div className={`flex items-center text-sm ${segment.growth > 0 ? 'text-primary' : 'text-red-400'}`}>
                    {segment.growth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(segment.growth)}%
                  </div>
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold text-primary">${(segment.revenue / 1000000).toFixed(1)}M</span>
                  <span className="text-sm text-secondary/70">{segment.percentage}% of total</span>
                </div>
                <Progress value={segment.percentage * 2} className="h-2 bg-secondary/20" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AR Aging Analysis */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Accounts Receivable Aging</h3>
        <div className="space-y-4">
          {arAgingData.map((aging, index) => (
            <div key={aging.range} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{aging.range}</span>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="border-secondary/30 text-secondary">
                    {aging.count} invoices
                  </Badge>
                  <span className="text-foreground font-semibold">${aging.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="relative h-3 bg-secondary/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${aging.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    index === 0 ? "bg-emerald-500" :
                    index === 1 ? "bg-yellow-500" :
                    index === 2 ? "bg-orange-500" :
                    "bg-red-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Budget vs Actual */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Budget vs Actual Comparison</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/20">
                <TableHead className="text-secondary">Category</TableHead>
                <TableHead className="text-secondary text-right">Budget</TableHead>
                <TableHead className="text-secondary text-right">Actual</TableHead>
                <TableHead className="text-secondary text-right">Variance</TableHead>
                <TableHead className="text-secondary text-right">% Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetVsActual.map((item) => (
                <TableRow key={item.category} className="border-b border-border/20 hover:bg-secondary/10">
                  <TableCell className="font-semibold text-foreground">{item.category}</TableCell>
                  <TableCell className="text-right text-secondary/70">${item.budget.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-foreground font-semibold">${item.actual.toLocaleString()}</TableCell>
                  <TableCell className={`text-right font-semibold ${
                    item.category === "Revenue"
                      ? (item.variance > 0 ? "text-primary" : "text-red-400")
                      : (item.variance < 0 ? "text-primary" : "text-red-400")
                  }`}>
                    ${Math.abs(item.actual - item.budget).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={
                      item.category === "Revenue"
                        ? (item.variance > 0 ? "border-primary/30 text-primary" : "border-red-500/30 text-red-400")
                        : (item.variance < 0 ? "border-primary/30 text-primary" : "border-red-500/30 text-red-400")
                    }>
                      {item.variance > 0 ? "+" : ""}{item.variance.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Payment Collection Rate */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Payment Collection Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={paymentCollectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" stroke="hsl(var(--primary))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" unit="%" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="invoiced" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Invoiced" />
            <Bar yAxisId="left" dataKey="collected" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} name="Collected" />
            <Line yAxisId="right" type="monotone" dataKey="collectionRate" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Collection Rate %" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Financial Projections */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Financial Projections</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={financialProjections}>
            <defs>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Legend />
            <Area type="monotone" dataKey="conservative" stroke="hsl(var(--destructive))" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Conservative" />
            <Area type="monotone" dataKey="projected" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorProjected)" strokeWidth={3} name="Projected" />
            <Area type="monotone" dataKey="optimistic" stroke="hsl(var(--accent))" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Optimistic" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Tax Liability */}
      <Card className="glass border/20 p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Tax Liability Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {taxLiability.map((tax, index) => (
            <motion.div
              key={tax.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-dark border/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-foreground font-semibold">{tax.type}</h4>
                <Badge variant="outline" className="border-secondary/30 text-secondary">
                  Due: {tax.dueDate}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary/70">Estimated</span>
                  <span className="text-foreground font-semibold">${tax.estimated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary/70">Paid</span>
                  <span className="text-primary font-semibold">${tax.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border/20">
                  <span className="text-foreground font-semibold">Remaining</span>
                  <span className={`font-bold ${tax.remaining > 0 ? 'text-yellow-400' : 'text-primary'}`}>
                    ${tax.remaining.toLocaleString()}
                  </span>
                </div>
                <Progress value={(tax.paid / tax.estimated) * 100} className="h-2 mt-2 bg-secondary/20" />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
