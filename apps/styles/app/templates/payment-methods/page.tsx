'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, Plus, Trash2, CheckCircle2, AlertCircle, Lock,
  Shield, Star, MoreVertical, Calendar, MapPin, Building2,
  Wallet, Smartphone, Globe, Clock, History, Edit, Eye,
  EyeOff, Copy, ExternalLink, Info, Settings, Bell, XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const paymentMethods = [
  {
    id: '1',
    type: 'visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2026',
    cardholderName: 'John Doe',
    isDefault: true,
    isExpired: false,
    isVerified: true,
    addedDate: '2024-01-15',
    billingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States',
    },
  },
  {
    id: '2',
    type: 'mastercard',
    last4: '5555',
    expiryMonth: '08',
    expiryYear: '2025',
    cardholderName: 'John Doe',
    isDefault: false,
    isExpired: false,
    isVerified: true,
    addedDate: '2024-03-20',
    billingAddress: {
      street: '456 Oak Ave',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'United States',
    },
  },
  {
    id: '3',
    type: 'amex',
    last4: '3782',
    expiryMonth: '11',
    expiryYear: '2024',
    cardholderName: 'John Doe',
    isDefault: false,
    isExpired: true,
    isVerified: true,
    addedDate: '2023-06-10',
    billingAddress: {
      street: '789 Pine Rd',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States',
    },
  },
  {
    id: '4',
    type: 'discover',
    last4: '6011',
    expiryMonth: '04',
    expiryYear: '2027',
    cardholderName: 'John Doe',
    isDefault: false,
    isExpired: false,
    isVerified: false,
    addedDate: '2024-10-05',
    billingAddress: {
      street: '321 Elm St',
      city: 'Boston',
      state: 'MA',
      zip: '02101',
      country: 'United States',
    },
  },
]

const paymentHistory = [
  { id: 1, date: '2025-11-15', amount: 149.99, status: 'success', method: 'Visa •••• 4242', invoice: 'INV-2025-0042' },
  { id: 2, date: '2025-10-15', amount: 149.99, status: 'success', method: 'Visa •••• 4242', invoice: 'INV-2025-0041' },
  { id: 3, date: '2025-09-15', amount: 149.99, status: 'success', method: 'Mastercard •••• 5555', invoice: 'INV-2025-0040' },
  { id: 4, date: '2025-08-15', amount: 149.99, status: 'failed', method: 'Amex •••• 3782', invoice: 'INV-2025-0039' },
  { id: 5, date: '2025-07-15', amount: 149.99, status: 'success', method: 'Visa •••• 4242', invoice: 'INV-2025-0038' },
]

const failedPayments = [
  {
    id: 1,
    date: '2025-08-15',
    amount: 149.99,
    reason: 'Card expired',
    method: 'Amex •••• 3782',
    retryDate: '2025-08-18',
    status: 'resolved',
  },
]

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Other'
]

const getCardIcon = (type: string) => {
  return CreditCard
}

const getCardColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'visa': return 'from-blue-500 to-blue-600'
    case 'mastercard': return 'from-orange-500 to-red-500'
    case 'amex': return 'from-blue-400 to-blue-500'
    case 'discover': return 'from-orange-400 to-orange-500'
    default: return 'from-gray-500 to-gray-600'
  }
}

export default function PaymentMethodsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showCVV, setShowCVV] = useState(false)
  const [autoPayEnabled, setAutoPayEnabled] = useState(true)
  const [saveForFuture, setSaveForFuture] = useState(true)
  const [selectedCard, setSelectedCard] = useState<any>(null)

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  })

  const handleAddCard = () => {
    toast.success('Payment method added successfully')
    setShowAddDialog(false)
    setNewCard({
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
    })
  }

  const handleSetDefault = (id: string) => {
    toast.success('Default payment method updated')
  }

  const handleRemoveCard = (id: string) => {
    toast.success('Payment method removed')
  }

  const handleVerifyCard = (id: string) => {
    toast.info('Verification email sent. Please check your inbox.')
  }

  const handleUpdateExpiry = (id: string) => {
    toast.success('Card expiration updated')
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-2">Payment Methods</h1>
            <p className="text-muted-foreground">Manage your cards and billing information</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="border-glow">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-overlay max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>Enter your card details and billing address</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 p-3 glass rounded-lg">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    Your payment information is encrypted and secure
                  </span>
                </div>

                {/* Card Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Card Information</h3>

                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={newCard.cardNumber}
                      onChange={(e) => setNewCard({ ...newCard, cardNumber: formatCardNumber(e.target.value) })}
                      className="glass"
                      maxLength={19}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cardholder Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={newCard.cardName}
                      onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
                      className="glass"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Expiry Month</Label>
                      <Select value={newCard.expiryMonth} onValueChange={(v) => setNewCard({ ...newCard, expiryMonth: v })}>
                        <SelectTrigger className="glass">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent className="glass-overlay">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <SelectItem key={month} value={String(month).padStart(2, '0')}>
                              {String(month).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Expiry Year</Label>
                      <Select value={newCard.expiryYear} onValueChange={(v) => setNewCard({ ...newCard, expiryYear: v })}>
                        <SelectTrigger className="glass">
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent className="glass-overlay">
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <div className="relative">
                        <Input
                          type={showCVV ? 'text' : 'password'}
                          placeholder="123"
                          value={newCard.cvv}
                          onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          className="glass pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowCVV(!showCVV)}
                        >
                          {showCVV ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Billing Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Billing Address</h3>

                  <div className="space-y-2">
                    <Label>Street Address</Label>
                    <Input
                      placeholder="123 Main Street"
                      value={newCard.street}
                      onChange={(e) => setNewCard({ ...newCard, street: e.target.value })}
                      className="glass"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        placeholder="San Francisco"
                        value={newCard.city}
                        onChange={(e) => setNewCard({ ...newCard, city: e.target.value })}
                        className="glass"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        placeholder="CA"
                        value={newCard.state}
                        onChange={(e) => setNewCard({ ...newCard, state: e.target.value })}
                        className="glass"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ZIP Code</Label>
                      <Input
                        placeholder="94102"
                        value={newCard.zip}
                        onChange={(e) => setNewCard({ ...newCard, zip: e.target.value })}
                        className="glass"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select value={newCard.country} onValueChange={(v) => setNewCard({ ...newCard, country: v })}>
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-overlay">
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Save for future payments</Label>
                      <p className="text-sm text-muted-foreground">
                        Securely save this card for faster checkout
                      </p>
                    </div>
                    <Switch checked={saveForFuture} onCheckedChange={setSaveForFuture} />
                  </div>
                </div>

                {/* Security Features */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 glass rounded-lg">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-xs">PCI DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 glass rounded-lg">
                    <Lock className="w-5 h-5 text-green-500" />
                    <span className="text-xs">256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 glass rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-xs">3D Secure</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 glass rounded-lg">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-xs">Fraud Protection</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCard}>
                  Add Card
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Auto-Pay Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-overlay border-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Auto-Pay</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically charge your default payment method when invoices are due
                    </p>
                  </div>
                </div>
                <Switch checked={autoPayEnabled} onCheckedChange={setAutoPayEnabled} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Saved Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Saved Cards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method, index) => {
              const CardIcon = getCardIcon(method.type)
              const cardGradient = getCardColor(method.type)

              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className={cn(
                    "glass-overlay transition-all hover:border-primary/50 relative overflow-hidden",
                    method.isDefault && "border-primary border-2 border-glow"
                  )}>
                    <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", cardGradient)} />

                    <CardContent className="p-6 relative">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br", cardGradient)}>
                            <CardIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold capitalize">{method.type}</p>
                            <p className="text-sm text-muted-foreground">•••• {method.last4}</p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="glass-overlay">
                            {!method.isDefault && (
                              <DropdownMenuItem onClick={() => handleSetDefault(method.id)}>
                                <Star className="w-4 h-4 mr-2" />
                                Set as Default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => setSelectedCard(method)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            {method.isExpired && (
                              <DropdownMenuItem onClick={() => handleUpdateExpiry(method.id)}>
                                <Calendar className="w-4 h-4 mr-2" />
                                Update Expiry
                              </DropdownMenuItem>
                            )}
                            {!method.isVerified && (
                              <DropdownMenuItem onClick={() => handleVerifyCard(method.id)}>
                                <Shield className="w-4 h-4 mr-2" />
                                Verify Card
                              </DropdownMenuItem>
                            )}
                            <Separator className="my-1" />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove Card
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="glass-overlay">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Payment Method?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will remove {method.type} ending in {method.last4} from your account.
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveCard(method.id)}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Remove Card
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Card Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{method.cardholderName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </span>
                          {method.isExpired && (
                            <Badge variant="destructive" className="ml-2">Expired</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {method.billingAddress.city}, {method.billingAddress.state}
                          </span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Card Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {method.isDefault && (
                            <Badge className="bg-primary text-primary-foreground">
                              <Star className="w-3 h-3 mr-1" />
                              Default
                            </Badge>
                          )}
                          {method.isVerified ? (
                            <Badge variant="outline" className="border-green-500 text-green-500">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Unverified
                            </Badge>
                          )}
                        </div>

                        <span className="text-xs text-muted-foreground">
                          Added {new Date(method.addedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
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
                <History className="w-5 h-5" />
                Payment History
              </CardTitle>
              <CardDescription>Recent transactions and payment attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-center justify-between p-4 glass rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        payment.status === 'success' ? "bg-green-500/20" : "bg-red-500/20"
                      )}>
                        {payment.status === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-medium">{payment.method}</p>
                          <Badge variant={payment.status === 'success' ? 'default' : 'destructive'}>
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span>{new Date(payment.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{payment.invoice}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-bold">${payment.amount.toFixed(2)}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Failed Payments */}
        {failedPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass-overlay border-yellow-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-500">
                  <AlertCircle className="w-5 h-5" />
                  Failed Payments
                </CardTitle>
                <CardDescription>Payments that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {failedPayments.map((payment, index) => (
                    <div key={payment.id} className="p-4 glass rounded-lg border border-yellow-500/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-yellow-500">Payment Failed</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={payment.status === 'resolved' ? 'default' : 'destructive'}>
                          {payment.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">${payment.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Method:</span>
                          <span>{payment.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reason:</span>
                          <span className="text-red-500">{payment.reason}</span>
                        </div>
                        {payment.status !== 'resolved' && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Retry Date:</span>
                            <span>{new Date(payment.retryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {payment.status !== 'resolved' && (
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1">
                            Update Payment Method
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Retry Payment
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="glass-overlay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Features
              </CardTitle>
              <CardDescription>Your payment information is protected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 glass rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">256-bit SSL Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      All payment data is encrypted using industry-standard SSL technology
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 glass rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">PCI DSS Compliant</h4>
                    <p className="text-sm text-muted-foreground">
                      We meet the highest standards for payment card security
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 glass rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">3D Secure Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Additional layer of security for online card transactions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 glass rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Fraud Detection</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time monitoring to detect and prevent fraudulent activity
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}
