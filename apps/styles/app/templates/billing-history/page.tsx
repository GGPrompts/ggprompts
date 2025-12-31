'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, FileText, Search, Filter, Calendar, CreditCard,
  ChevronLeft, ChevronRight, TrendingUp, DollarSign, Clock,
  CheckCircle2, XCircle, AlertCircle, ArrowUpRight, Bell,
  Settings, Mail, Eye, MoreVertical, RefreshCcw, Receipt
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Separator, Input, Label, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, cn } from "@ggprompts/ui"
import { toast } from 'sonner'

// Mock invoice data
const generateInvoices = () => {
  const statuses = ['paid', 'pending', 'overdue', 'refunded']
  const paymentMethods = [
    { type: 'Visa', last4: '4242', icon: CreditCard },
    { type: 'Mastercard', last4: '5555', icon: CreditCard },
    { type: 'Amex', last4: '3782', icon: CreditCard },
    { type: 'PayPal', last4: 'user@email.com', icon: CreditCard },
  ]

  const invoices = []
  const startDate = new Date('2023-01-01')

  for (let i = 0; i < 36; i++) {
    const date = new Date(startDate)
    date.setMonth(startDate.getMonth() + i)

    const status = i === 0 ? 'pending' : i === 1 ? 'overdue' : i === 35 ? 'refunded' : 'paid'
    const amount = Math.floor(Math.random() * 400) + 100
    const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]

    invoices.push({
      id: `INV-${2023 + Math.floor(i / 12)}-${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      dueDate: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: amount,
      status: status,
      paymentMethod: method,
      description: `Monthly Subscription - ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
      items: [
        { name: 'Pro Plan', quantity: 1, price: amount * 0.7 },
        { name: 'Additional Storage', quantity: Math.floor(Math.random() * 3) + 1, price: amount * 0.2 },
        { name: 'API Calls', quantity: Math.floor(Math.random() * 5000), price: amount * 0.1 },
      ]
    })
  }

  return invoices.reverse()
}

const invoices = generateInvoices()

// Monthly spending data for chart
const monthlySpending = [
  { month: 'Jan', amount: 450 },
  { month: 'Feb', amount: 520 },
  { month: 'Mar', amount: 380 },
  { month: 'Apr', amount: 640 },
  { month: 'May', amount: 590 },
  { month: 'Jun', amount: 720 },
  { month: 'Jul', amount: 680 },
  { month: 'Aug', amount: 550 },
  { month: 'Sep', amount: 490 },
  { month: 'Oct', amount: 620 },
  { month: 'Nov', amount: 580 },
  { month: 'Dec', amount: 710 },
]

const upcomingCharges = [
  { date: '2025-12-01', amount: 149.99, description: 'Pro Plan Monthly Subscription' },
  { date: '2025-12-15', amount: 49.99, description: 'Additional Storage (50GB)' },
  { date: '2026-01-01', amount: 149.99, description: 'Pro Plan Monthly Subscription' },
]

export default function BillingHistoryPage() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [autoPayEnabled, setAutoPayEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const itemsPerPage = 10

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const statusMatch = selectedStatus === 'all' || invoice.status === selectedStatus
    const searchMatch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       invoice.description.toLowerCase().includes(searchQuery.toLowerCase())

    let dateMatch = true
    if (dateRange !== 'all') {
      const invoiceDate = new Date(invoice.date)
      const now = new Date()

      if (dateRange === '30days') {
        dateMatch = (now.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24) <= 30
      } else if (dateRange === '90days') {
        dateMatch = (now.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24) <= 90
      } else if (dateRange === 'year') {
        dateMatch = invoiceDate.getFullYear() === now.getFullYear()
      }
    }

    return statusMatch && searchMatch && dateMatch
  })

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Calculate totals
  const totalSpent = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle2
      case 'pending': return Clock
      case 'overdue': return AlertCircle
      case 'refunded': return RefreshCcw
      default: return FileText
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-500'
      case 'pending': return 'text-yellow-500'
      case 'overdue': return 'text-red-500'
      case 'refunded': return 'text-blue-500'
      default: return 'text-muted-foreground'
    }
  }

  const handleDownloadPDF = (invoiceId: string) => {
    toast.success(`Downloading ${invoiceId}.pdf`)
  }

  const handleEmailInvoice = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} sent to your email`)
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
            <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">Billing History</h1>
            <p className="text-muted-foreground">Manage your invoices and payment history</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="glass">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="glass">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-overlay">
                <DialogHeader>
                  <DialogTitle>Billing Settings</DialogTitle>
                  <DialogDescription>Configure your billing preferences</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Pay</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically pay invoices when due
                      </p>
                    </div>
                    <Switch checked={autoPayEnabled} onCheckedChange={setAutoPayEnabled} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive invoice and payment updates
                      </p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Billing Alerts</Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">7 days before payment due</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Payment successful</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Payment failed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending</p>
                    <p className="text-2xl font-bold">${pendingAmount.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                    <p className="text-2xl font-bold">${overdueAmount.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg/Month</p>
                    <p className="text-2xl font-bold">${(totalSpent / invoices.length).toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Spending Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle>Monthly Spending</CardTitle>
              <CardDescription>Your spending trend over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {monthlySpending.map((data, index) => {
                  const maxAmount = Math.max(...monthlySpending.map(d => d.amount))
                  const height = (data.amount / maxAmount) * 100

                  return (
                    <motion.div
                      key={data.month}
                      className="flex-1 flex flex-col items-center gap-2"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                    >
                      <div className="w-full group relative">
                        <motion.div
                          className="w-full bg-primary/40 hover:bg-primary/60 rounded-t-lg transition-colors cursor-pointer"
                          style={{ height: `${height}%`, minHeight: '20px' }}
                          whileHover={{ scale: 1.05 }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          ${data.amount}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{data.month}</span>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-overlay rounded-2xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass"
              />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="glass">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-overlay">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="glass">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-overlay">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>

        {/* Invoices List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {paginatedInvoices.map((invoice, index) => {
              const StatusIcon = getStatusIcon(invoice.status)
              const statusColor = getStatusColor(invoice.status)

              return (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-overlay hover:border-primary/50 transition-colors group">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", statusColor.replace('text', 'bg').replace('500', '500/20'))}>
                            <StatusIcon className={cn("w-6 h-6", statusColor)} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold">{invoice.id}</h3>
                              <Badge variant={
                                invoice.status === 'paid' ? 'default' :
                                invoice.status === 'pending' ? 'secondary' :
                                invoice.status === 'overdue' ? 'destructive' :
                                'outline'
                              }>
                                {invoice.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{invoice.description}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(invoice.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                {invoice.paymentMethod.type} •••• {invoice.paymentMethod.last4}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold">${invoice.amount.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                          </div>

                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="glass"
                                  onClick={() => setSelectedInvoice(invoice)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="glass-overlay max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Invoice Details</DialogTitle>
                                  <DialogDescription>{invoice.id}</DialogDescription>
                                </DialogHeader>
                                {selectedInvoice && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Invoice Date</Label>
                                        <p className="font-medium">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Due Date</Label>
                                        <p className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                    <Separator />
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Line Items</Label>
                                      <div className="space-y-2">
                                        {selectedInvoice.items.map((item: any, i: number) => (
                                          <div key={i} className="flex justify-between text-sm">
                                            <span>{item.name} {item.quantity > 1 && `(×${item.quantity})`}</span>
                                            <span className="font-medium">${item.price.toFixed(2)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                      <span>Total</span>
                                      <span>${selectedInvoice.amount.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="outline"
                              size="icon"
                              className="glass"
                              onClick={() => handleDownloadPDF(invoice.id)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              className="glass"
                              onClick={() => handleEmailInvoice(invoice.id)}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-2"
          >
            <Button
              variant="outline"
              size="icon"
              className="glass"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                className={currentPage === page ? '' : 'glass'}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              className="glass"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Upcoming Charges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Upcoming Charges
              </CardTitle>
              <CardDescription>Scheduled payments for the next billing period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingCharges.map((charge, index) => (
                  <div key={index} className="flex items-center justify-between p-4 glass rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{charge.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(charge.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-bold">${charge.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}
