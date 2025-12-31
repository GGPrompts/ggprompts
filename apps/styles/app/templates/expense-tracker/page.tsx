"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit2,
  FileText,
  Filter,
  FolderOpen,
  Image,
  LayoutGrid,
  List,
  MoreHorizontal,
  Palette,
  PieChart,
  Plus,
  Receipt,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Split,
  Tag,
  TrendingDown,
  TrendingUp,
  Trash2,
  Upload,
  Users,
  Wallet,
  X,
  Utensils,
  Car,
  Home,
  Briefcase,
  Plane,
  Gamepad2,
  Heart,
  GraduationCap,
  Zap,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"

// TypeScript Interfaces
interface Category {
  id: string
  name: string
  icon: React.ElementType
  budget?: number
  spent: number
}

interface Expense {
  id: string
  amount: number
  currency: string
  merchant: string
  category: string
  date: string
  notes?: string
  receipt?: string
  status: "pending" | "approved" | "reimbursed" | "rejected"
  paymentMethod: "cash" | "credit" | "debit" | "corporate"
  tags: string[]
}

interface Budget {
  category: string
  limit: number
  spent: number
  period: "monthly" | "weekly" | "yearly"
}

interface MonthlyData {
  month: string
  spent: number
  budget: number
}

// Category icons map
const categoryIcons: Record<string, React.ElementType> = {
  "Food & Dining": Utensils,
  Transportation: Car,
  Housing: Home,
  Business: Briefcase,
  Travel: Plane,
  Entertainment: Gamepad2,
  Healthcare: Heart,
  Education: GraduationCap,
  Shopping: ShoppingBag,
  Utilities: Zap,
}

export default function ExpenseTrackerDashboard() {
  // Categories
  const [categories, setCategories] = useState<Category[]>([
    { id: "cat-1", name: "Food & Dining", icon: Utensils, budget: 600, spent: 423 },
    { id: "cat-2", name: "Transportation", icon: Car, budget: 400, spent: 287 },
    { id: "cat-3", name: "Housing", icon: Home, budget: 1500, spent: 1500 },
    { id: "cat-4", name: "Business", icon: Briefcase, budget: 500, spent: 342 },
    { id: "cat-5", name: "Travel", icon: Plane, budget: 800, spent: 156 },
    { id: "cat-6", name: "Entertainment", icon: Gamepad2, budget: 200, spent: 178 },
    { id: "cat-7", name: "Healthcare", icon: Heart, budget: 300, spent: 89 },
    { id: "cat-8", name: "Education", icon: GraduationCap, budget: 250, spent: 125 },
    { id: "cat-9", name: "Shopping", icon: ShoppingBag, budget: 350, spent: 298 },
    { id: "cat-10", name: "Utilities", icon: Zap, budget: 250, spent: 187 },
  ])

  // Expenses
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "exp-1",
      amount: 45.99,
      currency: "USD",
      merchant: "Whole Foods Market",
      category: "Food & Dining",
      date: "2024-12-27",
      notes: "Weekly groceries",
      receipt: "receipt-001.jpg",
      status: "approved",
      paymentMethod: "credit",
      tags: ["groceries", "organic"],
    },
    {
      id: "exp-2",
      amount: 32.50,
      currency: "USD",
      merchant: "Shell Gas Station",
      category: "Transportation",
      date: "2024-12-26",
      notes: "Full tank",
      status: "approved",
      paymentMethod: "debit",
      tags: ["fuel"],
    },
    {
      id: "exp-3",
      amount: 1500.00,
      currency: "USD",
      merchant: "Apartment Rent",
      category: "Housing",
      date: "2024-12-01",
      notes: "January rent",
      status: "approved",
      paymentMethod: "corporate",
      tags: ["rent", "monthly"],
    },
    {
      id: "exp-4",
      amount: 89.99,
      currency: "USD",
      merchant: "Office Supplies Co",
      category: "Business",
      date: "2024-12-25",
      notes: "Printer cartridges and paper",
      receipt: "receipt-002.jpg",
      status: "pending",
      paymentMethod: "corporate",
      tags: ["office", "supplies"],
    },
    {
      id: "exp-5",
      amount: 156.00,
      currency: "USD",
      merchant: "Delta Airlines",
      category: "Travel",
      date: "2024-12-20",
      notes: "Flight to NYC",
      receipt: "receipt-003.jpg",
      status: "reimbursed",
      paymentMethod: "credit",
      tags: ["flight", "business-trip"],
    },
    {
      id: "exp-6",
      amount: 15.99,
      currency: "USD",
      merchant: "Netflix",
      category: "Entertainment",
      date: "2024-12-24",
      notes: "Monthly subscription",
      status: "approved",
      paymentMethod: "credit",
      tags: ["subscription", "streaming"],
    },
    {
      id: "exp-7",
      amount: 75.00,
      currency: "USD",
      merchant: "CVS Pharmacy",
      category: "Healthcare",
      date: "2024-12-23",
      notes: "Prescription refill",
      receipt: "receipt-004.jpg",
      status: "approved",
      paymentMethod: "debit",
      tags: ["pharmacy", "prescription"],
    },
    {
      id: "exp-8",
      amount: 49.99,
      currency: "USD",
      merchant: "Udemy",
      category: "Education",
      date: "2024-12-22",
      notes: "React course",
      status: "approved",
      paymentMethod: "credit",
      tags: ["course", "online"],
    },
    {
      id: "exp-9",
      amount: 128.50,
      currency: "USD",
      merchant: "Amazon",
      category: "Shopping",
      date: "2024-12-21",
      notes: "Household items",
      receipt: "receipt-005.jpg",
      status: "pending",
      paymentMethod: "credit",
      tags: ["online", "household"],
    },
    {
      id: "exp-10",
      amount: 187.00,
      currency: "USD",
      merchant: "Electric Company",
      category: "Utilities",
      date: "2024-12-19",
      notes: "December bill",
      status: "approved",
      paymentMethod: "debit",
      tags: ["electricity", "monthly"],
    },
    {
      id: "exp-11",
      amount: 67.25,
      currency: "USD",
      merchant: "Italian Bistro",
      category: "Food & Dining",
      date: "2024-12-18",
      notes: "Team lunch",
      receipt: "receipt-006.jpg",
      status: "pending",
      paymentMethod: "corporate",
      tags: ["restaurant", "team"],
    },
    {
      id: "exp-12",
      amount: 42.00,
      currency: "USD",
      merchant: "Uber",
      category: "Transportation",
      date: "2024-12-17",
      notes: "Airport transfer",
      status: "reimbursed",
      paymentMethod: "credit",
      tags: ["rideshare", "airport"],
    },
  ])

  // Monthly trend data
  const [monthlyData] = useState<MonthlyData[]>([
    { month: "Jul", spent: 2890, budget: 4500 },
    { month: "Aug", spent: 3245, budget: 4500 },
    { month: "Sep", spent: 2756, budget: 4500 },
    { month: "Oct", spent: 3890, budget: 4500 },
    { month: "Nov", spent: 3456, budget: 4500 },
    { month: "Dec", spent: 3585, budget: 4500 },
  ])

  // State for dialogs
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isSplitExpenseOpen, setIsSplitExpenseOpen] = useState(false)
  const [isCategoryManageOpen, setIsCategoryManageOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  // New expense form state
  const [newExpense, setNewExpense] = useState({
    amount: "",
    merchant: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    paymentMethod: "credit" as const,
    tags: "",
  })

  // Calculations
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalBudget = categories.reduce((sum, cat) => sum + (cat.budget || 0), 0)
  const budgetRemaining = totalBudget - totalSpent
  const pendingReimbursements = expenses
    .filter((exp) => exp.status === "pending")
    .reduce((sum, exp) => sum + exp.amount, 0)

  // Category data for pie chart
  const categoryData = categories.map((cat) => ({
    name: cat.name,
    value: cat.spent,
  }))

  // Filter expenses
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || exp.category === filterCategory
    const matchesStatus = filterStatus === "all" || exp.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Status badge styling
  const getStatusBadge = (status: Expense["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "reimbursed":
        return (
          <Badge className="bg-secondary/20 text-secondary border-secondary/30">
            <DollarSign className="h-3 w-3 mr-1" />
            Reimbursed
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
    }
  }

  // Payment method styling
  const getPaymentMethodBadge = (method: Expense["paymentMethod"]) => {
    const methods = {
      cash: { label: "Cash", icon: Wallet },
      credit: { label: "Credit", icon: CreditCard },
      debit: { label: "Debit", icon: CreditCard },
      corporate: { label: "Corporate", icon: Briefcase },
    }
    const { label, icon: Icon } = methods[method]
    return (
      <Badge variant="outline" className="text-muted-foreground border-border">
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  // Chart colors using CSS variables
  const CHART_COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(199 89% 48%)",
    "hsl(212 90% 52%)",
    "hsl(225 73% 57%)",
    "hsl(238 70% 62%)",
    "hsl(251 91% 67%)",
    "hsl(280 80% 60%)",
    "hsl(320 70% 55%)",
  ]

  // Add expense handler
  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.merchant || !newExpense.category) return

    const expense: Expense = {
      id: `exp-${Date.now()}`,
      amount: parseFloat(newExpense.amount),
      currency: "USD",
      merchant: newExpense.merchant,
      category: newExpense.category,
      date: newExpense.date,
      notes: newExpense.notes,
      status: "pending",
      paymentMethod: newExpense.paymentMethod,
      tags: newExpense.tags.split(",").map((t) => t.trim()).filter(Boolean),
    }

    setExpenses([expense, ...expenses])
    setNewExpense({
      amount: "",
      merchant: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      paymentMethod: "credit",
      tags: "",
    })
    setIsAddExpenseOpen(false)

    // Update category spent
    setCategories(
      categories.map((cat) =>
        cat.name === newExpense.category
          ? { ...cat, spent: cat.spent + parseFloat(newExpense.amount) }
          : cat
      )
    )
  }

  // Delete expense handler
  const handleDeleteExpense = (id: string) => {
    const expense = expenses.find((e) => e.id === id)
    if (expense) {
      setExpenses(expenses.filter((e) => e.id !== id))
      setCategories(
        categories.map((cat) =>
          cat.name === expense.category
            ? { ...cat, spent: cat.spent - expense.amount }
            : cat
        )
      )
    }
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
              Expense Tracker
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal and business expenses
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
              December 2024
            </Badge>
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Expense</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-primary/30 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add New Expense</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Enter the details of your expense below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-foreground">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-9 bg-background border-border text-foreground"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-foreground">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        className="bg-background border-border text-foreground"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="merchant" className="text-foreground">Merchant</Label>
                    <Input
                      id="merchant"
                      placeholder="Where did you spend?"
                      className="bg-background border-border text-foreground"
                      value={newExpense.merchant}
                      onChange={(e) => setNewExpense({ ...newExpense, merchant: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">Category</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                    >
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {categories.map((cat) => {
                          const Icon = cat.icon
                          return (
                            <SelectItem key={cat.id} value={cat.name} className="text-foreground">
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {cat.name}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod" className="text-foreground">Payment Method</Label>
                    <Select
                      value={newExpense.paymentMethod}
                      onValueChange={(value: any) => setNewExpense({ ...newExpense, paymentMethod: value })}
                    >
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="cash" className="text-foreground">Cash</SelectItem>
                        <SelectItem value="credit" className="text-foreground">Credit Card</SelectItem>
                        <SelectItem value="debit" className="text-foreground">Debit Card</SelectItem>
                        <SelectItem value="corporate" className="text-foreground">Corporate Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-foreground">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes..."
                      className="bg-background border-border text-foreground resize-none"
                      value={newExpense.notes}
                      onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-foreground">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      placeholder="groceries, personal"
                      className="bg-background border-border text-foreground"
                      value={newExpense.tags}
                      onChange={(e) => setNewExpense({ ...newExpense, tags: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Receipt</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)} className="border-border text-foreground">
                    Cancel
                  </Button>
                  <Button onClick={handleAddExpense} className="bg-primary text-primary-foreground">
                    Add Expense
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {/* Total Spent */}
          <Card className="glass border-primary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Total Spent</p>
              <TrendingUp className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-3xl font-bold text-primary font-mono">
              ${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              <span className="text-red-400">+12.3%</span> from last month
            </p>
          </Card>

          {/* Budget Remaining */}
          <Card className="glass border-secondary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Budget Left</p>
              <Wallet className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">
              ${budgetRemaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              of ${totalBudget.toLocaleString()} budget
            </p>
          </Card>

          {/* Pending Reimbursements */}
          <Card className="glass border-amber-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Pending</p>
              <Clock className="h-5 w-5 text-amber-400/50" />
            </div>
            <p className="text-3xl font-bold text-amber-400 font-mono">
              ${pendingReimbursements.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              {expenses.filter((e) => e.status === "pending").length} expenses awaiting
            </p>
          </Card>

          {/* Transactions This Month */}
          <Card className="glass border-blue-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Transactions</p>
              <Receipt className="h-5 w-5 text-blue-400/50" />
            </div>
            <p className="text-3xl font-bold text-blue-400 font-mono">
              {expenses.length}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              this month
            </p>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="transactions" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger value="transactions" className="text-xs sm:text-sm whitespace-nowrap">
                  <Receipt className="h-4 w-4 mr-1 sm:mr-2" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm whitespace-nowrap">
                  <PieChart className="h-4 w-4 mr-1 sm:mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="budgets" className="text-xs sm:text-sm whitespace-nowrap">
                  <TrendingDown className="h-4 w-4 mr-1 sm:mr-2" />
                  Budgets
                </TabsTrigger>
                <TabsTrigger value="receipts" className="text-xs sm:text-sm whitespace-nowrap">
                  <Image className="h-4 w-4 mr-1 sm:mr-2" />
                  Receipts
                </TabsTrigger>
                <TabsTrigger value="categories" className="text-xs sm:text-sm whitespace-nowrap">
                  <Tag className="h-4 w-4 mr-1 sm:mr-2" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="reports" className="text-xs sm:text-sm whitespace-nowrap">
                  <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                  Reports
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              {/* Filters */}
              <Card className="glass border-primary/30 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search expenses..."
                      className="pl-9 bg-background border-border text-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[160px] bg-background border-border text-foreground">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="all" className="text-foreground">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name} className="text-foreground">
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[140px] bg-background border-border text-foreground">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="all" className="text-foreground">All Status</SelectItem>
                        <SelectItem value="pending" className="text-foreground">Pending</SelectItem>
                        <SelectItem value="approved" className="text-foreground">Approved</SelectItem>
                        <SelectItem value="reimbursed" className="text-foreground">Reimbursed</SelectItem>
                        <SelectItem value="rejected" className="text-foreground">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center border border-border rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-3 ${viewMode === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-3 ${viewMode === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
                        onClick={() => setViewMode("grid")}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Transaction List/Grid */}
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Recent Transactions
                  </h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {filteredExpenses.length} expenses
                  </Badge>
                </div>

                {viewMode === "list" ? (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {filteredExpenses.map((expense, idx) => {
                          const CategoryIcon = categoryIcons[expense.category] || Receipt
                          return (
                            <motion.div
                              key={expense.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3, delay: idx * 0.02 }}
                              className="glass-dark border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <CategoryIcon className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-foreground font-medium truncate">
                                      {expense.merchant}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{expense.category}</span>
                                      <span>•</span>
                                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(expense.status)}
                                    {getPaymentMethodBadge(expense.paymentMethod)}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-foreground font-mono">
                                      ${expense.amount.toFixed(2)}
                                    </p>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-background border-border">
                                      <DropdownMenuItem className="text-foreground cursor-pointer">
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-foreground cursor-pointer">
                                        <Split className="h-4 w-4 mr-2" />
                                        Split
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-foreground cursor-pointer">
                                        <Receipt className="h-4 w-4 mr-2" />
                                        View Receipt
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator className="bg-border" />
                                      <DropdownMenuItem
                                        className="text-red-400 cursor-pointer"
                                        onClick={() => handleDeleteExpense(expense.id)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              {expense.notes && (
                                <p className="mt-2 text-sm text-muted-foreground pl-13">
                                  {expense.notes}
                                </p>
                              )}
                              {expense.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1 pl-13">
                                  {expense.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="text-xs text-muted-foreground border-border"
                                    >
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                      {filteredExpenses.map((expense, idx) => {
                        const CategoryIcon = categoryIcons[expense.category] || Receipt
                        return (
                          <motion.div
                            key={expense.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: idx * 0.02 }}
                          >
                            <Card className="glass-dark border-primary/20 p-4 hover:border-primary/40 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <CategoryIcon className="h-5 w-5 text-primary" />
                                </div>
                                {getStatusBadge(expense.status)}
                              </div>
                              <h4 className="text-foreground font-medium mb-1">{expense.merchant}</h4>
                              <p className="text-muted-foreground text-sm mb-3">{expense.category}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm">
                                  {new Date(expense.date).toLocaleDateString()}
                                </span>
                                <span className="text-xl font-bold text-foreground font-mono">
                                  ${expense.amount.toFixed(2)}
                                </span>
                              </div>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Category Breakdown Pie Chart */}
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Spending by Category
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                        itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Card>

                {/* Monthly Trend */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Monthly Spending Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                      <XAxis
                        dataKey="month"
                        stroke="hsl(var(--primary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="hsl(var(--primary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                        itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="spent"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.2)"
                        strokeWidth={2}
                        name="Spent"
                      />
                      <Area
                        type="monotone"
                        dataKey="budget"
                        stroke="hsl(var(--secondary))"
                        fill="hsl(var(--secondary) / 0.1)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Budget"
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Spending Bar Chart */}
              <Card className="glass border-blue-500/30 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Category Comparison
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categories.filter((c) => c.budget)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      tickFormatter={(value) => value.split(" ")[0]}
                    />
                    <YAxis
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--popover-foreground))",
                      }}
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                      labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                      cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                    />
                    <Legend />
                    <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="budget" fill="hsl(var(--secondary) / 0.5)" name="Budget" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Budgets Tab */}
            <TabsContent value="budgets" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Budget Progress
                  </h3>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                    Monthly
                  </Badge>
                </div>

                <div className="space-y-6">
                  {categories
                    .filter((cat) => cat.budget)
                    .map((category, idx) => {
                      const Icon = category.icon
                      const percentage = Math.min((category.spent / (category.budget || 1)) * 100, 100)
                      const isOverBudget = category.spent > (category.budget || 0)
                      const isNearLimit = percentage > 80 && !isOverBudget

                      return (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="glass-dark border-primary/20 rounded-lg p-5"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-foreground font-medium">{category.name}</p>
                                <p className="text-muted-foreground text-sm">
                                  ${category.spent.toFixed(2)} of ${category.budget?.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-2xl font-bold font-mono ${
                                  isOverBudget
                                    ? "text-red-400"
                                    : isNearLimit
                                    ? "text-amber-400"
                                    : "text-primary"
                                }`}
                              >
                                {percentage.toFixed(0)}%
                              </p>
                              {isOverBudget && (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                                  Over budget
                                </Badge>
                              )}
                              {isNearLimit && (
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                                  Near limit
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Progress
                            value={percentage}
                            className={`h-2 ${
                              isOverBudget
                                ? "[&>div]:bg-red-400"
                                : isNearLimit
                                ? "[&>div]:bg-amber-400"
                                : ""
                            }`}
                          />
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>
                              ${((category.budget || 0) - category.spent).toFixed(2)} remaining
                            </span>
                            <span>Budget: ${category.budget?.toFixed(2)}/month</span>
                          </div>
                        </motion.div>
                      )
                    })}
                </div>
              </Card>
            </TabsContent>

            {/* Receipts Tab */}
            <TabsContent value="receipts" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Receipt Gallery</h3>
                  <Button variant="outline" className="border-primary/30 text-primary">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Receipt
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {expenses
                    .filter((exp) => exp.receipt)
                    .map((expense, idx) => (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-dark border-primary/20 rounded-lg overflow-hidden group cursor-pointer"
                      >
                        <div className="aspect-square bg-muted flex items-center justify-center relative">
                          <Receipt className="h-12 w-12 text-muted-foreground" />
                          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="sm" variant="secondary">
                              View
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-foreground text-sm font-medium truncate">
                            {expense.merchant}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            ${expense.amount.toFixed(2)} • {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Manage Categories</h3>
                  <Button className="bg-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category, idx) => {
                    const Icon = category.icon
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                      >
                        <Card className="glass-dark border-primary/20 p-5 hover:border-primary/40 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background border-border">
                                <DropdownMenuItem className="text-foreground cursor-pointer">
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-foreground cursor-pointer">
                                  <Palette className="h-4 w-4 mr-2" />
                                  Change Icon
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem className="text-red-400 cursor-pointer">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <h4 className="text-foreground font-semibold mb-1">{category.name}</h4>
                          <p className="text-muted-foreground text-sm mb-3">
                            {category.budget
                              ? `$${category.budget}/month budget`
                              : "No budget set"}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total spent</span>
                            <span className="text-primary font-mono font-medium">
                              ${category.spent.toFixed(2)}
                            </span>
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Monthly Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="glass-dark border-primary/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">Total Expenses</span>
                        <span className="text-foreground font-mono font-bold">
                          ${totalSpent.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">Transactions</span>
                        <span className="text-foreground font-mono">{expenses.length}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">Average per Transaction</span>
                        <span className="text-foreground font-mono">
                          ${(totalSpent / expenses.length).toFixed(2)}
                        </span>
                      </div>
                      <Separator className="my-3 bg-border" />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Budget Utilization</span>
                        <span className="text-primary font-mono font-bold">
                          {((totalSpent / totalBudget) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-foreground font-medium">Top Categories</h4>
                      {categories
                        .sort((a, b) => b.spent - a.spent)
                        .slice(0, 5)
                        .map((cat, idx) => {
                          const Icon = cat.icon
                          return (
                            <div
                              key={cat.id}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-sm">{idx + 1}.</span>
                                <Icon className="h-4 w-4 text-primary" />
                                <span className="text-foreground text-sm">{cat.name}</span>
                              </div>
                              <span className="text-foreground font-mono text-sm">
                                ${cat.spent.toFixed(2)}
                              </span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </Card>

                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Export Reports
                  </h3>
                  <div className="space-y-4">
                    <div className="glass-dark border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground font-medium">Monthly Report (PDF)</p>
                          <p className="text-muted-foreground text-sm">
                            Full breakdown with charts
                          </p>
                        </div>
                        <Download className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="glass-dark border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <FolderOpen className="h-5 w-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground font-medium">Transaction Export (CSV)</p>
                          <p className="text-muted-foreground text-sm">
                            Raw data for spreadsheets
                          </p>
                        </div>
                        <Download className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="glass-dark border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground font-medium">Receipts Archive (ZIP)</p>
                          <p className="text-muted-foreground text-sm">
                            All uploaded receipts
                          </p>
                        </div>
                        <Download className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    <div className="space-y-2">
                      <Label className="text-foreground">Custom Date Range</Label>
                      <div className="flex gap-2">
                        <Input type="date" className="bg-background border-border text-foreground" />
                        <span className="text-muted-foreground self-center">to</span>
                        <Input type="date" className="bg-background border-border text-foreground" />
                      </div>
                      <Button className="w-full bg-primary text-primary-foreground mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Generate Custom Report
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Split Expense Dialog */}
        <Dialog open={isSplitExpenseOpen} onOpenChange={setIsSplitExpenseOpen}>
          <DialogContent className="glass border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-foreground">Split Expense</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Divide this expense across categories or people.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-foreground">Split Type</Label>
                <Select defaultValue="categories">
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="categories" className="text-foreground">Split by Categories</SelectItem>
                    <SelectItem value="people" className="text-foreground">Split with People</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 glass-dark border-primary/20 rounded-lg p-3">
                  <div className="flex-1">
                    <Input placeholder="Category or Person" className="bg-background border-border text-foreground" />
                  </div>
                  <Input type="number" placeholder="Amount" className="w-24 bg-background border-border text-foreground" />
                </div>
                <Button variant="outline" className="w-full border-dashed border-border text-muted-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Split
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSplitExpenseOpen(false)} className="border-border text-foreground">
                Cancel
              </Button>
              <Button className="bg-primary text-primary-foreground">Save Split</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Floating Add Button (Mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 md:hidden z-50"
        >
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg"
            onClick={() => setIsAddExpenseOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 left-8 glass border-primary/30 rounded-full px-4 py-2 hidden md:flex items-center gap-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <span className="text-primary text-sm font-mono">Synced</span>
        </motion.div>
      </div>
    </div>
  )
}
