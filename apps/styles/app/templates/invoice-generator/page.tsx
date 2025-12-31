"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Trash2,
  Send,
  Download,
  Eye,
  FileText,
  DollarSign,
  Calendar,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Copy,
  Printer,
  MoreHorizontal,
  Search,
  Filter,
  ChevronDown,
  Receipt,
  TrendingUp,
  Percent,
  Hash,
  Edit3,
  X,
  Check,
  RefreshCw,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// TypeScript Interfaces
interface Client {
  id: string
  name: string
  email: string
  address: string
  phone?: string
  company?: string
}

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  taxable: boolean
  total: number
}

interface Payment {
  id: string
  date: string
  amount: number
  method: string
  reference?: string
}

interface Invoice {
  id: string
  number: string
  client: Client
  issueDate: string
  dueDate: string
  lineItems: LineItem[]
  subtotal: number
  discount?: { type: "percentage" | "fixed"; value: number }
  tax: { rate: number; amount: number }
  total: number
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
  notes?: string
  terms?: string
  payments: Payment[]
  recurring?: boolean
}

interface BusinessInfo {
  name: string
  address: string
  email: string
  phone: string
  website?: string
  logo?: string
}

export default function InvoiceGenerator() {
  // Business Info
  const [businessInfo] = useState<BusinessInfo>({
    name: "Acme Digital Studio",
    address: "123 Innovation Way, Tech City, TC 12345",
    email: "billing@acmedigital.io",
    phone: "+1 (555) 123-4567",
    website: "www.acmedigital.io",
  })

  // Clients Database
  const [clients] = useState<Client[]>([
    {
      id: "client-1",
      name: "Sarah Johnson",
      email: "sarah@techstartup.io",
      address: "456 Startup Lane, San Francisco, CA 94102",
      phone: "+1 (555) 234-5678",
      company: "TechStartup Inc.",
    },
    {
      id: "client-2",
      name: "Michael Chen",
      email: "mchen@globalcorp.com",
      address: "789 Corporate Blvd, New York, NY 10001",
      phone: "+1 (555) 345-6789",
      company: "GlobalCorp",
    },
    {
      id: "client-3",
      name: "Emily Rodriguez",
      email: "emily@designhub.co",
      address: "321 Creative Ave, Austin, TX 78701",
      phone: "+1 (555) 456-7890",
      company: "DesignHub Co.",
    },
    {
      id: "client-4",
      name: "David Kim",
      email: "david@innovatetech.io",
      address: "654 Innovation Dr, Seattle, WA 98101",
      company: "InnovateTech",
    },
  ])

  // Sample Invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv-001",
      number: "INV-2024-001",
      client: clients[0],
      issueDate: "2024-12-15",
      dueDate: "2025-01-15",
      lineItems: [
        { id: "li-1", description: "Website Redesign - Phase 1", quantity: 1, rate: 5000, taxable: true, total: 5000 },
        { id: "li-2", description: "UI/UX Consultation (hours)", quantity: 20, rate: 150, taxable: true, total: 3000 },
        { id: "li-3", description: "Hosting Setup (annual)", quantity: 1, rate: 500, taxable: false, total: 500 },
      ],
      subtotal: 8500,
      discount: { type: "percentage", value: 10 },
      tax: { rate: 8.5, amount: 680 },
      total: 8330,
      status: "sent",
      notes: "Thank you for your business!",
      terms: "Payment due within 30 days. Late payments subject to 1.5% monthly interest.",
      payments: [],
    },
    {
      id: "inv-002",
      number: "INV-2024-002",
      client: clients[1],
      issueDate: "2024-12-01",
      dueDate: "2024-12-31",
      lineItems: [
        { id: "li-4", description: "Mobile App Development", quantity: 1, rate: 15000, taxable: true, total: 15000 },
        { id: "li-5", description: "API Integration", quantity: 40, rate: 175, taxable: true, total: 7000 },
      ],
      subtotal: 22000,
      tax: { rate: 8.5, amount: 1870 },
      total: 23870,
      status: "paid",
      payments: [
        { id: "pay-1", date: "2024-12-20", amount: 23870, method: "Bank Transfer", reference: "TXN-456789" },
      ],
    },
    {
      id: "inv-003",
      number: "INV-2024-003",
      client: clients[2],
      issueDate: "2024-11-15",
      dueDate: "2024-12-15",
      lineItems: [
        { id: "li-6", description: "Brand Identity Package", quantity: 1, rate: 3500, taxable: true, total: 3500 },
        { id: "li-7", description: "Logo Design Revisions", quantity: 5, rate: 200, taxable: true, total: 1000 },
      ],
      subtotal: 4500,
      tax: { rate: 8.5, amount: 382.5 },
      total: 4882.5,
      status: "overdue",
      payments: [],
    },
    {
      id: "inv-004",
      number: "INV-2024-004",
      client: clients[3],
      issueDate: "2024-12-20",
      dueDate: "2025-01-20",
      lineItems: [
        { id: "li-8", description: "Technical Consultation", quantity: 10, rate: 200, taxable: true, total: 2000 },
      ],
      subtotal: 2000,
      tax: { rate: 8.5, amount: 170 },
      total: 2170,
      status: "draft",
      payments: [],
    },
  ])

  // Current Invoice Being Created/Edited
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({
    number: `INV-2024-${String(invoices.length + 1).padStart(3, "0")}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    lineItems: [],
    discount: undefined,
    tax: { rate: 8.5, amount: 0 },
    notes: "Thank you for your business!",
    terms: "Payment due within 30 days. Late payments subject to 1.5% monthly interest.",
    status: "draft",
    payments: [],
  })

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [activeTab, setActiveTab] = useState("create")
  const [showPreview, setShowPreview] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showNewClientDialog, setShowNewClientDialog] = useState(false)

  // Calculate totals
  const calculatedTotals = useMemo(() => {
    const items = currentInvoice.lineItems || []
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const taxableAmount = items.filter(item => item.taxable).reduce((sum, item) => sum + item.total, 0)

    let discountAmount = 0
    if (currentInvoice.discount) {
      if (currentInvoice.discount.type === "percentage") {
        discountAmount = subtotal * (currentInvoice.discount.value / 100)
      } else {
        discountAmount = currentInvoice.discount.value
      }
    }

    const afterDiscount = subtotal - discountAmount
    const taxRate = currentInvoice.tax?.rate || 8.5
    const taxAmount = (taxableAmount - (taxableAmount / subtotal * discountAmount || 0)) * (taxRate / 100)
    const total = afterDiscount + taxAmount

    return { subtotal, discountAmount, taxAmount, total, taxableAmount }
  }, [currentInvoice.lineItems, currentInvoice.discount, currentInvoice.tax?.rate])

  // Add line item
  const addLineItem = () => {
    const newItem: LineItem = {
      id: `li-${Date.now()}`,
      description: "",
      quantity: 1,
      rate: 0,
      taxable: true,
      total: 0,
    }
    setCurrentInvoice(prev => ({
      ...prev,
      lineItems: [...(prev.lineItems || []), newItem],
    }))
  }

  // Update line item
  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setCurrentInvoice(prev => ({
      ...prev,
      lineItems: (prev.lineItems || []).map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updated.total = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      }),
    }))
  }

  // Remove line item
  const removeLineItem = (id: string) => {
    setCurrentInvoice(prev => ({
      ...prev,
      lineItems: (prev.lineItems || []).filter(item => item.id !== id),
    }))
  }

  // Save invoice
  const saveInvoice = (status: Invoice["status"] = "draft") => {
    if (!selectedClient) return

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      number: currentInvoice.number || "",
      client: selectedClient,
      issueDate: currentInvoice.issueDate || new Date().toISOString().split("T")[0],
      dueDate: currentInvoice.dueDate || "",
      lineItems: currentInvoice.lineItems || [],
      subtotal: calculatedTotals.subtotal,
      discount: currentInvoice.discount,
      tax: { rate: currentInvoice.tax?.rate || 8.5, amount: calculatedTotals.taxAmount },
      total: calculatedTotals.total,
      status,
      notes: currentInvoice.notes,
      terms: currentInvoice.terms,
      payments: [],
    }

    setInvoices(prev => [newInvoice, ...prev])
    resetForm()
    setActiveTab("invoices")
  }

  // Reset form
  const resetForm = () => {
    setCurrentInvoice({
      number: `INV-2024-${String(invoices.length + 2).padStart(3, "0")}`,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      lineItems: [],
      discount: undefined,
      tax: { rate: 8.5, amount: 0 },
      notes: "Thank you for your business!",
      terms: "Payment due within 30 days. Late payments subject to 1.5% monthly interest.",
      status: "draft",
      payments: [],
    })
    setSelectedClient(null)
  }

  // Get status badge
  const getStatusBadge = (status: Invoice["status"]) => {
    const styles = {
      draft: "bg-muted/50 text-muted-foreground border-border",
      sent: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      viewed: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      paid: "bg-primary/20 text-primary border-primary/30",
      overdue: "bg-red-500/20 text-red-400 border-red-500/30",
      cancelled: "bg-muted/30 text-muted-foreground border-border line-through",
    }
    const icons = {
      draft: <Edit3 className="h-3 w-3" />,
      sent: <Send className="h-3 w-3" />,
      viewed: <Eye className="h-3 w-3" />,
      paid: <CheckCircle2 className="h-3 w-3" />,
      overdue: <AlertCircle className="h-3 w-3" />,
      cancelled: <XCircle className="h-3 w-3" />,
    }
    return (
      <Badge className={`${styles[status]} flex items-center gap-1`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch =
        inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.client.company?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [invoices, searchQuery, statusFilter])

  // Stats
  const stats = useMemo(() => {
    const paid = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.total, 0)
    const pending = invoices.filter(i => ["sent", "viewed"].includes(i.status)).reduce((sum, i) => sum + i.total, 0)
    const overdue = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.total, 0)
    const draft = invoices.filter(i => i.status === "draft").length
    return { paid, pending, overdue, draft }
  }, [invoices])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
              Invoice Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Create, manage, and track professional invoices
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
              {invoices.length} Invoices
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
              onClick={() => setActiveTab("create")}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Invoice</span>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="glass border-primary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Paid</p>
              <CheckCircle2 className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary font-mono">
              ${stats.paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              {invoices.filter(i => i.status === "paid").length} invoices
            </p>
          </Card>

          <Card className="glass border-blue-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Pending</p>
              <Clock className="h-5 w-5 text-blue-400/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-400 font-mono">
              ${stats.pending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              {invoices.filter(i => ["sent", "viewed"].includes(i.status)).length} invoices
            </p>
          </Card>

          <Card className="glass border-red-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Overdue</p>
              <AlertCircle className="h-5 w-5 text-red-400/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-red-400 font-mono">
              ${stats.overdue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              {invoices.filter(i => i.status === "overdue").length} invoices
            </p>
          </Card>

          <Card className="glass border-secondary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Drafts</p>
              <Edit3 className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-secondary font-mono">
              {stats.draft}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              awaiting completion
            </p>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger value="create" className="text-xs sm:text-sm whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                  Create
                </TabsTrigger>
                <TabsTrigger value="invoices" className="text-xs sm:text-sm whitespace-nowrap">
                  <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                  Invoices
                </TabsTrigger>
                <TabsTrigger value="clients" className="text-xs sm:text-sm whitespace-nowrap">
                  <User className="h-4 w-4 mr-1 sm:mr-2" />
                  Clients
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Create Invoice Tab */}
            <TabsContent value="create" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Invoice Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Header Info */}
                  <Card className="glass border-primary/30 p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Invoice Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoice-number" className="text-muted-foreground">Invoice Number</Label>
                        <Input
                          id="invoice-number"
                          value={currentInvoice.number}
                          onChange={(e) => setCurrentInvoice(prev => ({ ...prev, number: e.target.value }))}
                          className="glass-dark border-primary/20 font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issue-date" className="text-muted-foreground">Issue Date</Label>
                        <Input
                          id="issue-date"
                          type="date"
                          value={currentInvoice.issueDate}
                          onChange={(e) => setCurrentInvoice(prev => ({ ...prev, issueDate: e.target.value }))}
                          className="glass-dark border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="due-date" className="text-muted-foreground">Due Date</Label>
                        <Input
                          id="due-date"
                          type="date"
                          value={currentInvoice.dueDate}
                          onChange={(e) => setCurrentInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="glass-dark border-primary/20"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Client Selection */}
                  <Card className="glass border-secondary/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Bill To
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-secondary hover:bg-secondary/10"
                        onClick={() => setShowNewClientDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        New Client
                      </Button>
                    </div>
                    <Select
                      value={selectedClient?.id || ""}
                      onValueChange={(id) => setSelectedClient(clients.find(c => c.id === id) || null)}
                    >
                      <SelectTrigger className="glass-dark border-secondary/20 mb-4">
                        <SelectValue placeholder="Select a client..." />
                      </SelectTrigger>
                      <SelectContent className="glass border-border">
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            <span className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {client.company || client.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedClient && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-dark border-secondary/20 rounded-lg p-4 space-y-2"
                      >
                        <p className="font-medium text-foreground">{selectedClient.name}</p>
                        {selectedClient.company && (
                          <p className="text-sm text-muted-foreground">{selectedClient.company}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {selectedClient.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {selectedClient.address}
                        </div>
                        {selectedClient.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {selectedClient.phone}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </Card>

                  {/* Line Items */}
                  <Card className="glass border-primary/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        Line Items
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-primary/10"
                        onClick={addLineItem}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {(currentInvoice.lineItems || []).length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-dark border-primary/20 rounded-lg p-8 text-center"
                          >
                            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No items added yet</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-3 text-primary hover:bg-primary/10"
                              onClick={addLineItem}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add your first item
                            </Button>
                          </motion.div>
                        ) : (
                          (currentInvoice.lineItems || []).map((item, idx) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.2 }}
                              className="glass-dark border-primary/20 rounded-lg p-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                <div className="md:col-span-5 space-y-1">
                                  <Label className="text-xs text-muted-foreground">Description</Label>
                                  <Input
                                    placeholder="Service or product description"
                                    value={item.description}
                                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                                    className="glass border-border/30"
                                  />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                  <Label className="text-xs text-muted-foreground">Qty</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.quantity}
                                    onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                                    className="glass border-border/30 font-mono"
                                  />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                  <Label className="text-xs text-muted-foreground">Rate ($)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.rate}
                                    onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                                    className="glass border-border/30 font-mono"
                                  />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                  <Label className="text-xs text-muted-foreground">Total</Label>
                                  <div className="glass border-border/30 rounded-md px-3 py-2 font-mono text-primary">
                                    ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </div>
                                </div>
                                <div className="md:col-span-1 flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Checkbox
                                      id={`tax-${item.id}`}
                                      checked={item.taxable}
                                      onCheckedChange={(checked) => updateLineItem(item.id, "taxable", checked)}
                                    />
                                    <Label htmlFor={`tax-${item.id}`} className="text-xs text-muted-foreground">Tax</Label>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-400 hover:bg-red-500/10"
                                    onClick={() => removeLineItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>

                  {/* Notes & Terms */}
                  <Card className="glass border-secondary/30 p-6">
                    <h3 className="text-lg font-semibold text-secondary mb-4">Notes & Terms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Notes</Label>
                        <Textarea
                          placeholder="Additional notes for the client..."
                          value={currentInvoice.notes || ""}
                          onChange={(e) => setCurrentInvoice(prev => ({ ...prev, notes: e.target.value }))}
                          className="glass-dark border-secondary/20 min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Payment Terms</Label>
                        <Textarea
                          placeholder="Payment terms and conditions..."
                          value={currentInvoice.terms || ""}
                          onChange={(e) => setCurrentInvoice(prev => ({ ...prev, terms: e.target.value }))}
                          className="glass-dark border-secondary/20 min-h-[100px]"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-6">
                  {/* Totals */}
                  <Card className="glass border-primary/30 p-6 sticky top-6">
                    <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Summary
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="font-mono">
                          ${calculatedTotals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Discount */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Percent className="h-3 w-3" />
                            Discount
                          </span>
                          <div className="flex items-center gap-2">
                            <Select
                              value={currentInvoice.discount?.type || "none"}
                              onValueChange={(value) => {
                                if (value === "none") {
                                  setCurrentInvoice(prev => ({ ...prev, discount: undefined }))
                                } else {
                                  setCurrentInvoice(prev => ({
                                    ...prev,
                                    discount: { type: value as "percentage" | "fixed", value: 0 }
                                  }))
                                }
                              }}
                            >
                              <SelectTrigger className="w-24 h-8 text-xs glass-dark border-border/30">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass border-border">
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="percentage">%</SelectItem>
                                <SelectItem value="fixed">$</SelectItem>
                              </SelectContent>
                            </Select>
                            {currentInvoice.discount && (
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={currentInvoice.discount.value}
                                onChange={(e) => setCurrentInvoice(prev => ({
                                  ...prev,
                                  discount: { ...prev.discount!, value: parseFloat(e.target.value) || 0 }
                                }))}
                                className="w-20 h-8 text-xs glass-dark border-border/30 font-mono"
                              />
                            )}
                          </div>
                        </div>
                        {calculatedTotals.discountAmount > 0 && (
                          <div className="flex justify-end text-red-400 text-sm font-mono">
                            -${calculatedTotals.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                        )}
                      </div>

                      {/* Tax */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Tax Rate (%)</span>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={currentInvoice.tax?.rate || 0}
                            onChange={(e) => setCurrentInvoice(prev => ({
                              ...prev,
                              tax: { ...prev.tax!, rate: parseFloat(e.target.value) || 0, amount: 0 }
                            }))}
                            className="w-20 h-8 text-xs glass-dark border-border/30 font-mono text-right"
                          />
                        </div>
                        <div className="flex justify-between text-muted-foreground text-sm">
                          <span>Tax Amount</span>
                          <span className="font-mono">
                            ${calculatedTotals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <Separator className="bg-primary/20" />

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-foreground">Total Due</span>
                        <span className="text-2xl font-bold text-primary font-mono">
                          ${calculatedTotals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-6 bg-primary/20" />

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                        onClick={() => setShowPreview(true)}
                        disabled={!selectedClient || (currentInvoice.lineItems || []).length === 0}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Invoice
                      </Button>
                      <Button
                        className="w-full bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/30"
                        onClick={() => saveInvoice("draft")}
                        disabled={!selectedClient || (currentInvoice.lineItems || []).length === 0}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Save as Draft
                      </Button>
                      <Button
                        className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                        onClick={() => saveInvoice("sent")}
                        disabled={!selectedClient || (currentInvoice.lineItems || []).length === 0}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Invoice
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Invoices List Tab */}
            <TabsContent value="invoices" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-dark border-primary/20"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48 glass-dark border-primary/20">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="viewed">Viewed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Invoice Table */}
                <div className="rounded-lg overflow-hidden border border-primary/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="glass-dark border-primary/20 hover:bg-primary/5">
                        <TableHead className="text-muted-foreground">Invoice</TableHead>
                        <TableHead className="text-muted-foreground hidden sm:table-cell">Client</TableHead>
                        <TableHead className="text-muted-foreground hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-muted-foreground hidden lg:table-cell">Due</TableHead>
                        <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence mode="popLayout">
                        {filteredInvoices.map((invoice, idx) => (
                          <motion.tr
                            key={invoice.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: idx * 0.02 }}
                            className="glass-dark border-primary/10 hover:bg-primary/5 cursor-pointer"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <TableCell className="font-mono text-primary">
                              {invoice.number}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div>
                                <p className="text-foreground text-sm">{invoice.client.name}</p>
                                {invoice.client.company && (
                                  <p className="text-muted-foreground text-xs">{invoice.client.company}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                              {new Date(invoice.issueDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-muted-foreground">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right font-mono text-foreground">
                              ${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(invoice.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedInvoice(invoice)
                                    setShowPreview(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedInvoice(invoice)
                                      setShowPaymentDialog(true)
                                    }}
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>

                {filteredInvoices.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No invoices found</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-6">
              <Card className="glass border-secondary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Client Directory
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-secondary/30 text-secondary hover:bg-secondary/10"
                    onClick={() => setShowNewClientDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((client, idx) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                    >
                      <Card className="glass-dark border-secondary/20 p-5 hover:border-secondary/40 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                            <User className="h-6 w-6 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">{client.name}</h4>
                            {client.company && (
                              <p className="text-sm text-muted-foreground truncate">{client.company}</p>
                            )}
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{client.email}</span>
                              </div>
                              {client.phone && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  <span>{client.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Separator className="my-4 bg-secondary/20" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {invoices.filter(i => i.client.id === client.id).length} invoices
                          </span>
                          <span className="text-secondary font-mono">
                            ${invoices
                              .filter(i => i.client.id === client.id)
                              .reduce((sum, i) => sum + i.total, 0)
                              .toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Invoice Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="glass border-primary/30 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Invoice Preview
              </DialogTitle>
            </DialogHeader>

            {/* PDF-like Preview */}
            <div className="bg-white text-gray-900 rounded-lg p-8 shadow-lg">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{businessInfo.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{businessInfo.address}</p>
                  <p className="text-gray-600 text-sm">{businessInfo.email}</p>
                  <p className="text-gray-600 text-sm">{businessInfo.phone}</p>
                </div>
                <div className="text-right">
                  <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Invoice #:</span> {selectedInvoice?.number || currentInvoice.number}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(selectedInvoice?.issueDate || currentInvoice.issueDate || "").toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Due:</span> {new Date(selectedInvoice?.dueDate || currentInvoice.dueDate || "").toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
                <div className="text-gray-900">
                  <p className="font-medium">{selectedInvoice?.client.name || selectedClient?.name}</p>
                  <p className="text-gray-600">{selectedInvoice?.client.company || selectedClient?.company}</p>
                  <p className="text-gray-600">{selectedInvoice?.client.address || selectedClient?.address}</p>
                  <p className="text-gray-600">{selectedInvoice?.client.email || selectedClient?.email}</p>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 text-gray-600 font-medium">Description</th>
                    <th className="text-center py-3 text-gray-600 font-medium w-20">Qty</th>
                    <th className="text-right py-3 text-gray-600 font-medium w-24">Rate</th>
                    <th className="text-right py-3 text-gray-600 font-medium w-28">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedInvoice?.lineItems || currentInvoice.lineItems || []).map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{item.description}</td>
                      <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-700">${item.rate.toFixed(2)}</td>
                      <td className="py-3 text-right text-gray-900 font-medium">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${(selectedInvoice?.subtotal || calculatedTotals.subtotal).toFixed(2)}</span>
                  </div>
                  {(selectedInvoice?.discount || calculatedTotals.discountAmount > 0) && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount</span>
                      <span>-${(selectedInvoice?.discount?.type === "percentage"
                        ? (selectedInvoice.subtotal * selectedInvoice.discount.value / 100)
                        : calculatedTotals.discountAmount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({selectedInvoice?.tax.rate || currentInvoice.tax?.rate}%)</span>
                    <span>${(selectedInvoice?.tax.amount || calculatedTotals.taxAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t-2 border-gray-200">
                    <span>Total</span>
                    <span>${(selectedInvoice?.total || calculatedTotals.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                {(selectedInvoice?.notes || currentInvoice.notes) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">Notes</h4>
                    <p className="text-gray-600 text-sm">{selectedInvoice?.notes || currentInvoice.notes}</p>
                  </div>
                )}
                {(selectedInvoice?.terms || currentInvoice.terms) && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">Terms & Conditions</h4>
                    <p className="text-gray-600 text-sm">{selectedInvoice?.terms || currentInvoice.terms}</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="border-secondary/30 text-secondary hover:bg-secondary/10"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                onClick={() => setShowSendDialog(true)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Record Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="glass border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Record Payment
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Record a payment for invoice {selectedInvoice?.number}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Payment Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  defaultValue={selectedInvoice?.total}
                  className="glass-dark border-primary/20 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Payment Date</Label>
                <Input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="glass-dark border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Payment Method</Label>
                <Select defaultValue="bank">
                  <SelectTrigger className="glass-dark border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-border">
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="card">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Reference (Optional)</Label>
                <Input
                  placeholder="Transaction ID or reference number"
                  className="glass-dark border-primary/20"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="border-border text-muted-foreground"
                onClick={() => setShowPaymentDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                onClick={() => {
                  if (selectedInvoice) {
                    setInvoices(prev => prev.map(inv =>
                      inv.id === selectedInvoice.id
                        ? { ...inv, status: "paid" as const }
                        : inv
                    ))
                  }
                  setShowPaymentDialog(false)
                }}
              >
                <Check className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Invoice Dialog */}
        <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
          <DialogContent className="glass border-blue-500/30">
            <DialogHeader>
              <DialogTitle className="text-blue-400 flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Invoice
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Send this invoice to your client via email
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">To</Label>
                <Input
                  defaultValue={selectedInvoice?.client.email || selectedClient?.email}
                  className="glass-dark border-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Subject</Label>
                <Input
                  defaultValue={`Invoice ${selectedInvoice?.number || currentInvoice.number} from ${businessInfo.name}`}
                  className="glass-dark border-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Message</Label>
                <Textarea
                  className="glass-dark border-blue-500/20 min-h-[120px]"
                  defaultValue={`Dear ${selectedInvoice?.client.name || selectedClient?.name},

Please find attached invoice ${selectedInvoice?.number || currentInvoice.number} for $${(selectedInvoice?.total || calculatedTotals.total).toFixed(2)}.

Payment is due by ${new Date(selectedInvoice?.dueDate || currentInvoice.dueDate || "").toLocaleDateString()}.

Thank you for your business!

Best regards,
${businessInfo.name}`}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox id="attach-pdf" defaultChecked />
                <Label htmlFor="attach-pdf">Attach PDF invoice</Label>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="border-border text-muted-foreground flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              <Button
                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                onClick={() => {
                  setShowSendDialog(false)
                  setShowPreview(false)
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Client Dialog */}
        <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
          <DialogContent className="glass border-secondary/30">
            <DialogHeader>
              <DialogTitle className="text-secondary flex items-center gap-2">
                <User className="h-5 w-5" />
                Add New Client
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Full Name *</Label>
                  <Input
                    placeholder="John Doe"
                    className="glass-dark border-secondary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Company</Label>
                  <Input
                    placeholder="Company Name"
                    className="glass-dark border-secondary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email *</Label>
                <Input
                  type="email"
                  placeholder="client@company.com"
                  className="glass-dark border-secondary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Phone</Label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="glass-dark border-secondary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Address *</Label>
                <Textarea
                  placeholder="123 Main St, City, State 12345"
                  className="glass-dark border-secondary/20"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="border-border text-muted-foreground"
                onClick={() => setShowNewClientDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/30"
                onClick={() => setShowNewClientDialog(false)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
