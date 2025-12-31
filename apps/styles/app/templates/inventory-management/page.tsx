"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Box,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Download,
  Edit2,
  Filter,
  Grid3X3,
  History,
  Layers,
  MapPin,
  Minus,
  Package,
  PackageCheck,
  PackageMinus,
  PackagePlus,
  Plus,
  Printer,
  RefreshCw,
  ScanBarcode,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Upload,
  Warehouse,
  XCircle,
} from "lucide-react"
import { Card, Button, Badge, Input, Tabs, TabsContent, TabsList, TabsTrigger, Progress, Separator, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ggprompts/ui"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ScrollArea, Label, Textarea } from "@ggprompts/ui"

// TypeScript Interfaces
interface Product {
  id: string
  sku: string
  name: string
  category: string
  quantity: number
  reservedQty: number
  availableQty: number
  reorderPoint: number
  unitCost: number
  location: string
  lastUpdated: string
  status: "critical" | "low" | "adequate" | "overstock"
}

interface StockMovement {
  id: string
  sku: string
  productName: string
  type: "inbound" | "outbound" | "adjustment" | "transfer"
  quantity: number
  reason: string
  reference?: string
  timestamp: string
  user: string
}

interface Location {
  id: string
  zone: string
  aisle: string
  bin: string
  capacity: number
  utilization: number
  productCount: number
}

interface InventoryMetrics {
  totalSkus: number
  totalValue: number
  lowStockCount: number
  turnoverRate: number
  avgDaysOnHand: number
}

// Mock Data
const initialProducts: Product[] = [
  {
    id: "PRD-001",
    sku: "WH-ELC-001",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    quantity: 12,
    reservedQty: 3,
    availableQty: 9,
    reorderPoint: 25,
    unitCost: 45.99,
    location: "A-01-03",
    lastUpdated: "2025-01-15T10:30:00Z",
    status: "critical",
  },
  {
    id: "PRD-002",
    sku: "WH-ELC-002",
    name: 'LED Monitor 27"',
    category: "Electronics",
    quantity: 45,
    reservedQty: 8,
    availableQty: 37,
    reorderPoint: 20,
    unitCost: 299.99,
    location: "A-02-01",
    lastUpdated: "2025-01-14T14:22:00Z",
    status: "adequate",
  },
  {
    id: "PRD-003",
    sku: "WH-OFF-001",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    quantity: 18,
    reservedQty: 5,
    availableQty: 13,
    reorderPoint: 15,
    unitCost: 189.99,
    location: "B-03-02",
    lastUpdated: "2025-01-15T09:15:00Z",
    status: "low",
  },
  {
    id: "PRD-004",
    sku: "WH-OFF-002",
    name: "Standing Desk Converter",
    category: "Furniture",
    quantity: 8,
    reservedQty: 2,
    availableQty: 6,
    reorderPoint: 10,
    unitCost: 249.99,
    location: "B-03-04",
    lastUpdated: "2025-01-13T16:45:00Z",
    status: "critical",
  },
  {
    id: "PRD-005",
    sku: "WH-ACC-001",
    name: "USB-C Hub 7-in-1",
    category: "Accessories",
    quantity: 156,
    reservedQty: 24,
    availableQty: 132,
    reorderPoint: 50,
    unitCost: 34.99,
    location: "C-01-01",
    lastUpdated: "2025-01-15T11:00:00Z",
    status: "overstock",
  },
  {
    id: "PRD-006",
    sku: "WH-ACC-002",
    name: "Mechanical Keyboard",
    category: "Accessories",
    quantity: 67,
    reservedQty: 12,
    availableQty: 55,
    reorderPoint: 30,
    unitCost: 79.99,
    location: "C-01-03",
    lastUpdated: "2025-01-14T08:30:00Z",
    status: "adequate",
  },
  {
    id: "PRD-007",
    sku: "WH-ELC-003",
    name: "Portable Power Bank 20000mAh",
    category: "Electronics",
    quantity: 23,
    reservedQty: 7,
    availableQty: 16,
    reorderPoint: 25,
    unitCost: 29.99,
    location: "A-01-05",
    lastUpdated: "2025-01-15T13:20:00Z",
    status: "low",
  },
  {
    id: "PRD-008",
    sku: "WH-OFF-003",
    name: "Filing Cabinet 3-Drawer",
    category: "Furniture",
    quantity: 34,
    reservedQty: 4,
    availableQty: 30,
    reorderPoint: 15,
    unitCost: 149.99,
    location: "B-04-01",
    lastUpdated: "2025-01-12T10:45:00Z",
    status: "adequate",
  },
  {
    id: "PRD-009",
    sku: "WH-SUP-001",
    name: "Printer Paper A4 (500 sheets)",
    category: "Supplies",
    quantity: 245,
    reservedQty: 50,
    availableQty: 195,
    reorderPoint: 100,
    unitCost: 8.99,
    location: "D-01-01",
    lastUpdated: "2025-01-15T07:00:00Z",
    status: "overstock",
  },
  {
    id: "PRD-010",
    sku: "WH-SUP-002",
    name: "Ink Cartridge (Black)",
    category: "Supplies",
    quantity: 52,
    reservedQty: 10,
    availableQty: 42,
    reorderPoint: 30,
    unitCost: 24.99,
    location: "D-01-03",
    lastUpdated: "2025-01-14T15:30:00Z",
    status: "adequate",
  },
  {
    id: "PRD-011",
    sku: "WH-ELC-004",
    name: "Webcam HD 1080p",
    category: "Electronics",
    quantity: 5,
    reservedQty: 2,
    availableQty: 3,
    reorderPoint: 15,
    unitCost: 59.99,
    location: "A-02-04",
    lastUpdated: "2025-01-15T14:00:00Z",
    status: "critical",
  },
  {
    id: "PRD-012",
    sku: "WH-ACC-003",
    name: "Mouse Pad XL",
    category: "Accessories",
    quantity: 89,
    reservedQty: 15,
    availableQty: 74,
    reorderPoint: 40,
    unitCost: 14.99,
    location: "C-02-02",
    lastUpdated: "2025-01-13T11:15:00Z",
    status: "adequate",
  },
]

const stockMovements: StockMovement[] = [
  {
    id: "MOV-001",
    sku: "WH-ELC-001",
    productName: "Wireless Bluetooth Headphones",
    type: "outbound",
    quantity: 15,
    reason: "Customer Order",
    reference: "ORD-2025-1234",
    timestamp: "2025-01-15T10:30:00Z",
    user: "John Smith",
  },
  {
    id: "MOV-002",
    sku: "WH-ACC-001",
    productName: "USB-C Hub 7-in-1",
    type: "inbound",
    quantity: 100,
    reason: "Purchase Order",
    reference: "PO-2025-0089",
    timestamp: "2025-01-15T09:15:00Z",
    user: "Sarah Johnson",
  },
  {
    id: "MOV-003",
    sku: "WH-OFF-002",
    productName: "Standing Desk Converter",
    type: "outbound",
    quantity: 5,
    reason: "Customer Order",
    reference: "ORD-2025-1231",
    timestamp: "2025-01-15T08:45:00Z",
    user: "Mike Davis",
  },
  {
    id: "MOV-004",
    sku: "WH-ELC-004",
    productName: "Webcam HD 1080p",
    type: "adjustment",
    quantity: -2,
    reason: "Damaged Goods",
    timestamp: "2025-01-14T16:30:00Z",
    user: "Emily Chen",
  },
  {
    id: "MOV-005",
    sku: "WH-SUP-001",
    productName: "Printer Paper A4 (500 sheets)",
    type: "transfer",
    quantity: 50,
    reason: "Zone Transfer",
    reference: "TRF-2025-0023",
    timestamp: "2025-01-14T14:00:00Z",
    user: "John Smith",
  },
  {
    id: "MOV-006",
    sku: "WH-OFF-001",
    productName: "Ergonomic Office Chair",
    type: "outbound",
    quantity: 8,
    reason: "Customer Order",
    reference: "ORD-2025-1228",
    timestamp: "2025-01-14T11:20:00Z",
    user: "Sarah Johnson",
  },
  {
    id: "MOV-007",
    sku: "WH-ACC-002",
    productName: "Mechanical Keyboard",
    type: "inbound",
    quantity: 50,
    reason: "Purchase Order",
    reference: "PO-2025-0088",
    timestamp: "2025-01-14T09:00:00Z",
    user: "Mike Davis",
  },
  {
    id: "MOV-008",
    sku: "WH-ELC-003",
    productName: "Portable Power Bank 20000mAh",
    type: "outbound",
    quantity: 12,
    reason: "Customer Order",
    reference: "ORD-2025-1225",
    timestamp: "2025-01-13T15:45:00Z",
    user: "Emily Chen",
  },
]

const locations: Location[] = [
  { id: "LOC-001", zone: "A", aisle: "01", bin: "01-05", capacity: 500, utilization: 78, productCount: 45 },
  { id: "LOC-002", zone: "A", aisle: "02", bin: "01-04", capacity: 400, utilization: 62, productCount: 32 },
  { id: "LOC-003", zone: "B", aisle: "03", bin: "01-06", capacity: 300, utilization: 85, productCount: 28 },
  { id: "LOC-004", zone: "B", aisle: "04", bin: "01-03", capacity: 350, utilization: 45, productCount: 18 },
  { id: "LOC-005", zone: "C", aisle: "01", bin: "01-05", capacity: 600, utilization: 92, productCount: 67 },
  { id: "LOC-006", zone: "C", aisle: "02", bin: "01-04", capacity: 450, utilization: 38, productCount: 22 },
  { id: "LOC-007", zone: "D", aisle: "01", bin: "01-06", capacity: 800, utilization: 71, productCount: 89 },
  { id: "LOC-008", zone: "D", aisle: "02", bin: "01-03", capacity: 250, utilization: 56, productCount: 15 },
]

const categoryData = [
  { name: "Electronics", value: 4, totalStock: 85, totalValue: 12540 },
  { name: "Furniture", value: 3, totalStock: 60, totalValue: 9870 },
  { name: "Accessories", value: 3, totalStock: 312, totalValue: 8450 },
  { name: "Supplies", value: 2, totalStock: 297, totalValue: 3520 },
]

const stockLevelData = [
  { name: "Critical", count: 3, color: "hsl(0 84% 60%)" },
  { name: "Low", count: 2, color: "hsl(38 92% 50%)" },
  { name: "Adequate", count: 5, color: "hsl(var(--primary))" },
  { name: "Overstock", count: 2, color: "hsl(199 89% 48%)" },
]

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(199 89% 48%)",
  "hsl(38 92% 50%)",
]

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<keyof Product>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add")
  const [adjustmentQty, setAdjustmentQty] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")
  const [scanMode, setScanMode] = useState(false)
  const [scannedSku, setScannedSku] = useState("")

  // Metrics calculation
  const metrics: InventoryMetrics = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + p.quantity * p.unitCost, 0)
    const lowStockCount = products.filter(p => p.status === "critical" || p.status === "low").length
    return {
      totalSkus: products.length,
      totalValue,
      lowStockCount,
      turnoverRate: 4.2,
      avgDaysOnHand: 28,
    }
  }, [products])

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query)
      )
    }

    if (categoryFilter !== "all") {
      result = result.filter(p => p.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter)
    }

    result.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }
      return 0
    })

    return result
  }, [products, searchQuery, categoryFilter, statusFilter, sortField, sortDirection])

  // Low stock alerts
  const lowStockProducts = products.filter(p => p.status === "critical" || p.status === "low")

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "critical":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>
      case "low":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Low</Badge>
      case "adequate":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Adequate</Badge>
      case "overstock":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Overstock</Badge>
    }
  }

  const getMovementIcon = (type: StockMovement["type"]) => {
    switch (type) {
      case "inbound":
        return <PackagePlus className="h-4 w-4 text-primary" />
      case "outbound":
        return <PackageMinus className="h-4 w-4 text-red-400" />
      case "adjustment":
        return <Edit2 className="h-4 w-4 text-amber-400" />
      case "transfer":
        return <ArrowUpDown className="h-4 w-4 text-blue-400" />
    }
  }

  const getMovementBadge = (type: StockMovement["type"]) => {
    switch (type) {
      case "inbound":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Inbound</Badge>
      case "outbound":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Outbound</Badge>
      case "adjustment":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Adjustment</Badge>
      case "transfer":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Transfer</Badge>
    }
  }

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleAdjustStock = () => {
    if (!selectedProduct || !adjustmentQty || !adjustmentReason) return

    const qty = parseInt(adjustmentQty)
    if (isNaN(qty) || qty <= 0) return

    setProducts(prev =>
      prev.map(p => {
        if (p.id === selectedProduct.id) {
          const newQty = adjustmentType === "add" ? p.quantity + qty : Math.max(0, p.quantity - qty)
          const newAvailable = newQty - p.reservedQty
          let newStatus: Product["status"] = "adequate"
          if (newQty <= p.reorderPoint * 0.5) newStatus = "critical"
          else if (newQty <= p.reorderPoint) newStatus = "low"
          else if (newQty > p.reorderPoint * 3) newStatus = "overstock"
          return {
            ...p,
            quantity: newQty,
            availableQty: newAvailable,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
          }
        }
        return p
      })
    )

    setAdjustmentDialogOpen(false)
    setSelectedProduct(null)
    setAdjustmentQty("")
    setAdjustmentReason("")
  }

  const handleScan = () => {
    if (!scannedSku) return
    const found = products.find(p => p.sku.toLowerCase() === scannedSku.toLowerCase())
    if (found) {
      setSearchQuery(found.sku)
      setScanMode(false)
      setScannedSku("")
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-400"
    if (utilization >= 70) return "text-amber-400"
    return "text-primary"
  }

  const categories = [...new Set(products.map(p => p.category))]

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
              Inventory Management
            </h1>
            <p className="text-foreground/60 mt-2">Warehouse stock control and operations</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className={`border-primary/30 ${scanMode ? "bg-primary/20 text-primary" : "text-foreground/70"} hover:bg-primary/10`}
              onClick={() => setScanMode(!scanMode)}
            >
              <ScanBarcode className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Scan</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-foreground/70 hover:bg-secondary/10"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 text-foreground/70 hover:bg-primary/10"
            >
              <Printer className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </div>
        </motion.div>

        {/* Scan Mode */}
        <AnimatePresence>
          {scanMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass border-primary/30 p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <ScanBarcode className="h-8 w-8 text-primary" />
                  <div className="flex-1 w-full">
                    <Input
                      placeholder="Scan or enter SKU..."
                      value={scannedSku}
                      onChange={e => setScannedSku(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleScan()}
                      className="font-mono bg-background/50"
                      autoFocus
                    />
                  </div>
                  <Button onClick={handleScan} className="bg-primary/20 text-primary hover:bg-primary/30">
                    Search
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <Card className="glass border-primary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-foreground/60 text-sm">Total SKUs</p>
              <Package className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-3xl font-bold text-primary font-mono">{metrics.totalSkus}</p>
            <p className="text-foreground/40 text-xs mt-1">Active products</p>
          </Card>

          <Card className="glass border-secondary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-foreground/60 text-sm">Stock Value</p>
              <Layers className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">
              ${metrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <p className="text-foreground/40 text-xs mt-1">Total inventory</p>
          </Card>

          <Card className="glass border-red-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-foreground/60 text-sm">Low Stock</p>
              <AlertTriangle className="h-5 w-5 text-red-400/50" />
            </div>
            <p className="text-3xl font-bold text-red-400 font-mono">{metrics.lowStockCount}</p>
            <p className="text-foreground/40 text-xs mt-1">Need reorder</p>
          </Card>

          <Card className="glass border-blue-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-foreground/60 text-sm">Turnover Rate</p>
              <RefreshCw className="h-5 w-5 text-blue-400/50" />
            </div>
            <p className="text-3xl font-bold text-blue-400 font-mono">{metrics.turnoverRate}x</p>
            <p className="text-foreground/40 text-xs mt-1">Monthly average</p>
          </Card>

          <Card className="glass border-amber-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-foreground/60 text-sm">Days on Hand</p>
              <Calendar className="h-5 w-5 text-amber-400/50" />
            </div>
            <p className="text-3xl font-bold text-amber-400 font-mono">{metrics.avgDaysOnHand}</p>
            <p className="text-foreground/40 text-xs mt-1">Average DOH</p>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="inventory" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger value="inventory" className="text-xs sm:text-sm whitespace-nowrap">
                  <Package className="h-4 w-4 mr-2" />
                  Inventory
                </TabsTrigger>
                <TabsTrigger value="movements" className="text-xs sm:text-sm whitespace-nowrap">
                  <History className="h-4 w-4 mr-2" />
                  Movements
                </TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs sm:text-sm whitespace-nowrap">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="locations" className="text-xs sm:text-sm whitespace-nowrap">
                  <Warehouse className="h-4 w-4 mr-2" />
                  Locations
                </TabsTrigger>
                <TabsTrigger value="reports" className="text-xs sm:text-sm whitespace-nowrap">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              {/* Filters */}
              <Card className="glass border-primary/30 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                      <Input
                        placeholder="Search by SKU, name, or location..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[140px] bg-background/50">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px] bg-background/50">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="adequate">Adequate</SelectItem>
                        <SelectItem value="overstock">Overstock</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-primary/30"
                      onClick={() => {
                        setSearchQuery("")
                        setCategoryFilter("all")
                        setStatusFilter("all")
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Product Table */}
              <Card className="glass border-primary/30">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-primary/20 hover:bg-transparent">
                        <TableHead
                          className="text-foreground/60 cursor-pointer hover:text-foreground"
                          onClick={() => handleSort("sku")}
                        >
                          <div className="flex items-center gap-2">
                            SKU
                            {sortField === "sku" && (
                              sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="text-foreground/60 cursor-pointer hover:text-foreground"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center gap-2">
                            Product
                            {sortField === "name" && (
                              sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground/60">Category</TableHead>
                        <TableHead
                          className="text-foreground/60 cursor-pointer hover:text-foreground text-right"
                          onClick={() => handleSort("quantity")}
                        >
                          <div className="flex items-center justify-end gap-2">
                            Qty
                            {sortField === "quantity" && (
                              sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-foreground/60 text-right">Available</TableHead>
                        <TableHead className="text-foreground/60 text-right">Reorder Pt</TableHead>
                        <TableHead className="text-foreground/60">Location</TableHead>
                        <TableHead className="text-foreground/60">Status</TableHead>
                        <TableHead className="text-foreground/60 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product, idx) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.02 }}
                          className="border-primary/10 hover:bg-primary/5"
                        >
                          <TableCell className="font-mono text-sm text-secondary">{product.sku}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-xs text-foreground/40">${product.unitCost.toFixed(2)} ea</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-primary/30 text-foreground/60">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">{product.quantity}</TableCell>
                          <TableCell className="text-right font-mono text-foreground/60">{product.availableQty}</TableCell>
                          <TableCell className="text-right font-mono text-foreground/40">{product.reorderPoint}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-foreground/40" />
                              <span className="font-mono text-sm">{product.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product)
                                setAdjustmentDialogOpen(true)
                              }}
                              className="text-foreground/60 hover:text-primary"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>

            {/* Movements Tab */}
            <TabsContent value="movements" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">Stock Movement History</h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {stockMovements.length} Movements
                  </Badge>
                </div>

                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {stockMovements.map((movement, idx) => (
                      <motion.div
                        key={movement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-dark border-primary/20 rounded-lg p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-background/50">
                              {getMovementIcon(movement.type)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{movement.productName}</p>
                              <p className="text-sm text-foreground/40 font-mono">{movement.sku}</p>
                              <p className="text-xs text-foreground/60 mt-1">{movement.reason}</p>
                              {movement.reference && (
                                <p className="text-xs text-secondary font-mono mt-1">{movement.reference}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
                            {getMovementBadge(movement.type)}
                            <div className={`font-mono font-bold ${movement.type === "inbound" ? "text-primary" : movement.type === "outbound" ? "text-red-400" : "text-amber-400"}`}>
                              {movement.type === "inbound" ? "+" : movement.type === "outbound" ? "-" : ""}
                              {Math.abs(movement.quantity)}
                            </div>
                          </div>
                        </div>
                        <Separator className="my-3 bg-primary/10" />
                        <div className="flex items-center justify-between text-xs text-foreground/40">
                          <span>{movement.user}</span>
                          <span>{new Date(movement.timestamp).toLocaleString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass border-red-500/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-red-400">Critical Stock Alerts</h3>
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="space-y-3">
                    {lowStockProducts
                      .filter(p => p.status === "critical")
                      .map((product, idx) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="glass-dark border-red-500/30 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-sm text-foreground/40 font-mono">{product.sku}</p>
                            </div>
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              {product.quantity} left
                            </Badge>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="text-foreground/40">Reorder Point: {product.reorderPoint}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Reorder
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    {lowStockProducts.filter(p => p.status === "critical").length === 0 && (
                      <div className="text-center py-8 text-foreground/40">
                        <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p>No critical stock alerts</p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="glass border-amber-500/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-amber-400">Low Stock Warnings</h3>
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="space-y-3">
                    {lowStockProducts
                      .filter(p => p.status === "low")
                      .map((product, idx) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="glass-dark border-amber-500/30 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-sm text-foreground/40 font-mono">{product.sku}</p>
                            </div>
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                              {product.quantity} left
                            </Badge>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-foreground/40">Stock Level</span>
                              <span className="text-amber-400">
                                {((product.quantity / product.reorderPoint) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Progress
                              value={(product.quantity / product.reorderPoint) * 100}
                              className="h-1.5"
                            />
                          </div>
                        </motion.div>
                      ))}
                    {lowStockProducts.filter(p => p.status === "low").length === 0 && (
                      <div className="text-center py-8 text-foreground/40">
                        <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p>No low stock warnings</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {["A", "B", "C", "D"].map(zone => {
                  const zoneLocations = locations.filter(l => l.zone === zone)
                  const avgUtilization = zoneLocations.reduce((sum, l) => sum + l.utilization, 0) / zoneLocations.length
                  const totalProducts = zoneLocations.reduce((sum, l) => sum + l.productCount, 0)
                  return (
                    <motion.div
                      key={zone}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="glass border-primary/30 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <span className="text-xl font-bold text-primary">{zone}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Zone {zone}</p>
                              <p className="text-xs text-foreground/40">{zoneLocations.length} aisles</p>
                            </div>
                          </div>
                          <Warehouse className="h-5 w-5 text-foreground/40" />
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-foreground/40">Utilization</span>
                              <span className={`text-xs font-mono ${getUtilizationColor(avgUtilization)}`}>
                                {avgUtilization.toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={avgUtilization} className="h-1.5" />
                          </div>

                          <Separator className="bg-primary/20" />

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-foreground/40">Products</span>
                            <span className="font-mono text-sm text-secondary">{totalProducts}</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-6">Bin Locations</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {locations.map((location, idx) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass-dark border-primary/20 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Grid3X3 className="h-4 w-4 text-primary" />
                          <span className="font-mono text-sm">
                            {location.zone}-{location.aisle}-{location.bin}
                          </span>
                        </div>
                        <Badge
                          className={`text-xs ${
                            location.utilization >= 90
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : location.utilization >= 70
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-primary/20 text-primary border-primary/30"
                          }`}
                        >
                          {location.utilization}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={location.utilization} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-foreground/40">
                          <span>Capacity: {location.capacity}</span>
                          <span>{location.productCount} products</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-primary mb-6">Stock Levels by Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stockLevelData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--primary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="hsl(var(--primary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
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
                        cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {stockLevelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">Inventory by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="totalStock"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
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
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="mt-4 space-y-2">
                    {categoryData.map((category, idx) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="text-foreground/60 text-sm">{category.name}</span>
                        </div>
                        <span className="text-foreground font-mono text-sm">
                          ${category.totalValue.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">Inventory Valuation Report</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-primary/30">
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary/30">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categoryData.map((category, idx) => (
                    <div key={category.name} className="glass-dark border-primary/20 rounded-lg p-4">
                      <p className="text-foreground/40 text-xs mb-1">{category.name}</p>
                      <p className="text-2xl font-bold font-mono" style={{ color: COLORS[idx % COLORS.length] }}>
                        ${category.totalValue.toLocaleString()}
                      </p>
                      <p className="text-foreground/40 text-xs mt-1">{category.totalStock} units</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Stock Adjustment Dialog */}
        <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
          <DialogContent className="glass border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-primary">Stock Adjustment</DialogTitle>
              <DialogDescription className="text-foreground/60">
                {selectedProduct && `Adjust stock for ${selectedProduct.name}`}
              </DialogDescription>
            </DialogHeader>

            {selectedProduct && (
              <div className="space-y-4 py-4">
                <div className="glass-dark border-primary/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground/60 text-sm">Current Stock</span>
                    <span className="font-mono text-lg text-primary">{selectedProduct.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/60 text-sm">SKU</span>
                    <span className="font-mono text-sm text-secondary">{selectedProduct.sku}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={adjustmentType === "add" ? "default" : "outline"}
                    onClick={() => setAdjustmentType("add")}
                    className={adjustmentType === "add" ? "bg-primary/20 text-primary border-primary/30" : ""}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stock
                  </Button>
                  <Button
                    variant={adjustmentType === "remove" ? "default" : "outline"}
                    onClick={() => setAdjustmentType("remove")}
                    className={adjustmentType === "remove" ? "bg-red-500/20 text-red-400 border-red-500/30" : ""}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Remove Stock
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={adjustmentQty}
                    onChange={e => setAdjustmentQty(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase_order">Purchase Order</SelectItem>
                      <SelectItem value="customer_return">Customer Return</SelectItem>
                      <SelectItem value="damaged">Damaged Goods</SelectItem>
                      <SelectItem value="inventory_count">Inventory Count</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setAdjustmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdjustStock}
                className={adjustmentType === "add" ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}
              >
                Confirm Adjustment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 right-8 glass border-primary/30 rounded-full px-4 py-2 flex items-center gap-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <span className="text-primary text-sm font-mono">Live</span>
        </motion.div>
      </div>
    </div>
  )
}
