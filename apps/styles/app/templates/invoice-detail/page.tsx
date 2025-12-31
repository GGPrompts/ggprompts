'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download, Printer, Mail, Share2, FileText, Calendar, CreditCard,
  MapPin, Phone, Globe, Building2, CheckCircle2, Clock, AlertCircle,
  ArrowLeft, ExternalLink, Copy, MessageSquare, MoreVertical, Eye,
  Receipt, DollarSign, Percent, Tag, ChevronRight, Info, Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Separator, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, cn } from "@ggprompts/ui"
import { toast } from 'sonner'

const invoice = {
  id: 'INV-2025-0042',
  number: '#000042',
  issueDate: '2025-11-01',
  dueDate: '2025-12-01',
  paidDate: '2025-11-05',
  status: 'paid',
  subtotal: 599.00,
  tax: 47.92,
  discount: 59.90,
  total: 587.02,
  currency: 'USD',

  company: {
    name: 'Acme Corporation',
    logo: '/api/placeholder/120/40',
    address: '123 Business Street',
    city: 'San Francisco, CA 94102',
    country: 'United States',
    email: 'billing@acmecorp.com',
    phone: '+1 (555) 123-4567',
    website: 'www.acmecorp.com',
    taxId: 'US-TAX-123456',
  },

  customer: {
    name: 'John Doe',
    company: 'Tech Innovations Inc.',
    email: 'john.doe@techinnovations.com',
    phone: '+1 (555) 987-6543',
    billingAddress: {
      street: '456 Innovation Drive',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'United States',
    },
    shippingAddress: {
      street: '789 Delivery Lane',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'United States',
    },
  },

  lineItems: [
    {
      id: 1,
      description: 'Pro Plan Subscription',
      details: 'Monthly subscription to Pro tier',
      quantity: 1,
      unitPrice: 99.00,
      total: 99.00,
      tax: 7.92,
    },
    {
      id: 2,
      description: 'Additional Storage (100GB)',
      details: 'Extra cloud storage allocation',
      quantity: 2,
      unitPrice: 50.00,
      total: 100.00,
      tax: 8.00,
    },
    {
      id: 3,
      description: 'API Call Package',
      details: '500,000 additional API calls',
      quantity: 5,
      unitPrice: 20.00,
      total: 100.00,
      tax: 8.00,
    },
    {
      id: 4,
      description: 'Priority Support',
      details: '24/7 dedicated support line',
      quantity: 1,
      unitPrice: 150.00,
      total: 150.00,
      tax: 12.00,
    },
    {
      id: 5,
      description: 'Team Member Licenses',
      details: 'Additional user seats',
      quantity: 10,
      unitPrice: 15.00,
      total: 150.00,
      tax: 12.00,
    },
  ],

  paymentMethod: {
    type: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2026',
    cardholderName: 'John Doe',
  },

  discounts: [
    { code: 'ANNUAL10', description: '10% Annual Discount', amount: 59.90 },
  ],

  notes: 'Thank you for your business! This invoice includes your monthly subscription and selected add-ons. Payment was processed successfully on 2025-11-05.',

  terms: 'Payment is due within 30 days. Late payments may be subject to fees. Please contact billing@acmecorp.com for questions.',
}

const paymentHistory = [
  { date: '2025-11-05', amount: 587.02, method: 'Visa •••• 4242', status: 'completed', transactionId: 'TXN-456789' },
]

const relatedInvoices = [
  { id: 'INV-2025-0041', date: '2025-10-01', amount: 587.02, status: 'paid' },
  { id: 'INV-2025-0040', date: '2025-09-01', amount: 587.02, status: 'paid' },
  { id: 'INV-2025-0039', date: '2025-08-01', amount: 587.02, status: 'paid' },
]

export default function InvoiceDetailPage() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)

  const handleDownloadPDF = () => {
    setIsDownloading(true)
    setTimeout(() => {
      toast.success('Invoice PDF downloaded successfully')
      setIsDownloading(false)
    }, 1500)
  }

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 500)
  }

  const handleEmail = () => {
    toast.success(`Invoice sent to ${invoice.customer.email}`)
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const handleDispute = () => {
    toast.info('Dispute form opened. Our team will contact you within 24 hours.')
  }

  const getStatusIcon = () => {
    switch (invoice.status) {
      case 'paid': return CheckCircle2
      case 'pending': return Clock
      case 'overdue': return AlertCircle
      default: return FileText
    }
  }

  const getStatusColor = () => {
    switch (invoice.status) {
      case 'paid': return 'text-green-500'
      case 'pending': return 'text-yellow-500'
      case 'overdue': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  const StatusIcon = getStatusIcon()
  const statusColor = getStatusColor()

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <Button variant="ghost" className="w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Billing
          </Button>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="glass"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download PDF
            </Button>

            <Button
              variant="outline"
              className="glass"
              onClick={handlePrint}
              disabled={isPrinting}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>

            <Button
              variant="outline"
              className="glass"
              onClick={handleEmail}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="glass">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-overlay">
                <DropdownMenuItem onClick={() => handleCopy(invoice.id, 'Invoice ID')}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Invoice ID
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDispute}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Dispute Invoice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Invoice Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-overlay border-glow">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                {/* Company Info */}
                <div>
                  <h1 className="text-3xl font-bold terminal-glow mb-2 font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">INVOICE</h1>
                  <p className="text-2xl font-mono text-muted-foreground mb-6">{invoice.number}</p>

                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-lg">{invoice.company.name}</p>
                    <p className="text-muted-foreground">{invoice.company.address}</p>
                    <p className="text-muted-foreground">{invoice.company.city}</p>
                    <p className="text-muted-foreground">{invoice.company.country}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Mail className="w-3 h-3" />
                      <span className="text-muted-foreground">{invoice.company.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span className="text-muted-foreground">{invoice.company.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="text-right space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
                    <StatusIcon className={cn("w-5 h-5", statusColor)} />
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                      {invoice.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-end gap-2">
                      <span className="text-muted-foreground">Issue Date:</span>
                      <span className="font-medium">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-medium">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {invoice.paidDate && (
                      <div className="flex justify-end gap-2">
                        <span className="text-muted-foreground">Paid Date:</span>
                        <span className="font-medium text-green-500">
                          {new Date(invoice.paidDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Customer & Address Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground mb-3 block">BILL TO</Label>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-base">{invoice.customer.name}</p>
                    <p className="text-muted-foreground">{invoice.customer.company}</p>
                    <p className="text-muted-foreground">{invoice.customer.billingAddress.street}</p>
                    <p className="text-muted-foreground">
                      {invoice.customer.billingAddress.city}, {invoice.customer.billingAddress.state} {invoice.customer.billingAddress.zip}
                    </p>
                    <p className="text-muted-foreground">{invoice.customer.billingAddress.country}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Mail className="w-3 h-3" />
                      <span className="text-muted-foreground">{invoice.customer.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-muted-foreground mb-3 block">SHIP TO</Label>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-base">{invoice.customer.name}</p>
                    <p className="text-muted-foreground">{invoice.customer.shippingAddress.street}</p>
                    <p className="text-muted-foreground">
                      {invoice.customer.shippingAddress.city}, {invoice.customer.shippingAddress.state} {invoice.customer.shippingAddress.zip}
                    </p>
                    <p className="text-muted-foreground">{invoice.customer.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Line Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">DESCRIPTION</th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">QTY</th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">UNIT PRICE</th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">TAX</th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="border-b border-border/50"
                      >
                        <td className="py-4 px-2">
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-muted-foreground">{item.details}</p>
                        </td>
                        <td className="text-right py-4 px-2">{item.quantity}</td>
                        <td className="text-right py-4 px-2">${item.unitPrice.toFixed(2)}</td>
                        <td className="text-right py-4 px-2 text-muted-foreground">${item.tax.toFixed(2)}</td>
                        <td className="text-right py-4 px-2 font-semibold">${item.total.toFixed(2)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex flex-col md:flex-row justify-between gap-8">
                {/* Payment Method */}
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-muted-foreground mb-3 block">PAYMENT METHOD</Label>
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.paymentMethod.type} •••• {invoice.paymentMethod.last4}</p>
                        <p className="text-sm text-muted-foreground">
                          Expires {invoice.paymentMethod.expiryMonth}/{invoice.paymentMethod.expiryYear}
                        </p>
                        <p className="text-sm text-muted-foreground">{invoice.paymentMethod.cardholderName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="w-full md:w-80">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                    </div>

                    {invoice.discounts.map((discount, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Tag className="w-3 h-3" />
                          {discount.description}:
                        </span>
                        <span className="font-medium text-green-500">-${discount.amount.toFixed(2)}</span>
                      </div>
                    ))}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%):</span>
                      <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-2xl terminal-glow">${invoice.total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span className="font-medium text-green-500">${invoice.total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Balance Due:</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notes and Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-overlay h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-overlay h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{invoice.terms}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Payment History
              </CardTitle>
              <CardDescription>Transaction records for this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 glass rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.method}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{new Date(payment.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{payment.transactionId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${payment.amount.toFixed(2)}</p>
                      <Badge className="bg-green-500 text-white">{payment.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Related Invoices
              </CardTitle>
              <CardDescription>Previous invoices from this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {relatedInvoices.map((relInv, index) => (
                  <div key={index} className="flex items-center justify-between p-4 glass rounded-lg hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{relInv.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(relInv.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold">${relInv.amount.toFixed(2)}</p>
                        <Badge variant={relInv.status === 'paid' ? 'default' : 'secondary'}>
                          {relInv.status}
                        </Badge>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
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

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
