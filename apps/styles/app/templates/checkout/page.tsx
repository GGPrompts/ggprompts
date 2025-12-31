'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, MapPin, Package, CheckCircle2, ArrowRight, ArrowLeft,
  Lock, Truck, Calendar, Gift, AlertCircle, Check, Building,
  Wallet, Smartphone, ChevronDown, Info, ShoppingBag, X
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const steps = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Review', icon: Package },
]

const cartItems = [
  { id: 1, name: 'Self-Aware Toaster 3000™', price: 499.99, quantity: 1, image: '/products/toaster-1.webp' },
  { id: 2, name: 'Telepathic TV Remote', price: 299.99, quantity: 1, image: '/products/remote-1.webp' },
  { id: 3, name: 'Invisible Socks™', price: 19.99, quantity: 2, image: '/products/socks-1.webp' },
]

const shippingMethods = [
  { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: 0 },
  { id: 'express', name: 'Express Shipping', time: '2-3 business days', price: 15.99 },
  { id: 'overnight', name: 'Overnight Shipping', time: 'Next business day', price: 29.99 },
]

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'paypal', name: 'PayPal', icon: Wallet },
  { id: 'apple', name: 'Apple Pay', icon: Smartphone },
]

const savedAddresses = [
  {
    id: 1,
    name: 'Home',
    fullName: 'John Doe',
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
    phone: '+1 (555) 123-4567',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Work',
    fullName: 'John Doe',
    street: '456 Market Street, Suite 800',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
    phone: '+1 (555) 987-6543',
    isDefault: false,
  },
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0])
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [shippingMethod, setShippingMethod] = useState(shippingMethods[0])
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [saveInfo, setSaveInfo] = useState(true)
  const [isGift, setIsGift] = useState(false)
  const [guestCheckout, setGuestCheckout] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  })

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax + shippingMethod.price

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (useNewAddress) {
        if (!shippingForm.firstName) newErrors.firstName = 'First name is required'
        if (!shippingForm.lastName) newErrors.lastName = 'Last name is required'
        if (!shippingForm.email) newErrors.email = 'Email is required'
        if (!shippingForm.street) newErrors.street = 'Street address is required'
        if (!shippingForm.city) newErrors.city = 'City is required'
        if (!shippingForm.zip) newErrors.zip = 'ZIP code is required'
      }
    }

    if (step === 2 && paymentMethod === 'card') {
      if (!paymentForm.cardNumber) newErrors.cardNumber = 'Card number is required'
      if (!paymentForm.cardName) newErrors.cardName = 'Cardholder name is required'
      if (!paymentForm.expiry) newErrors.expiry = 'Expiry date is required'
      if (!paymentForm.cvv) newErrors.cvv = 'CVV is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(3, currentStep + 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1))
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-mono font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase in 3 easy steps</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-overlay rounded-2xl p-6"
        >
          <div className="flex justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-muted -translate-y-1/2 hidden md:block">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div
                  key={step.id}
                  className="flex-1 flex flex-col items-center gap-3 relative z-10"
                >
                  <motion.div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center transition-all border-2",
                      isCompleted && "bg-primary border-primary",
                      isCurrent && "border-primary bg-primary/20",
                      !isCompleted && !isCurrent && "border-muted bg-muted/20"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                    ) : (
                      <Icon className={cn(
                        "w-8 h-8",
                        isCurrent && "text-primary",
                        !isCurrent && "text-muted-foreground"
                      )} />
                    )}
                  </motion.div>
                  <div className="text-center">
                    <p className={cn(
                      "font-semibold",
                      isCurrent && "text-foreground",
                      !isCurrent && "text-muted-foreground"
                    )}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Step {step.id} of 3</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <Card className="glass-overlay">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Shipping Information
                      </CardTitle>
                      <CardDescription>Where should we send your order?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                      {/* Guest Checkout Toggle */}
                      <div className="glass p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Info className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Guest Checkout</p>
                            <p className="text-sm text-muted-foreground">
                              Checkout without creating an account
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={guestCheckout}
                          onCheckedChange={(checked) => setGuestCheckout(checked as boolean)}
                        />
                      </div>

                      {/* Saved Addresses */}
                      {!guestCheckout && (
                        <div className="space-y-3">
                          <Label>Select Shipping Address</Label>
                          <RadioGroup
                            value={useNewAddress ? 'new' : selectedAddress.id.toString()}
                            onValueChange={(value) => {
                              if (value === 'new') {
                                setUseNewAddress(true)
                              } else {
                                setUseNewAddress(false)
                                const address = savedAddresses.find(a => a.id.toString() === value)
                                if (address) setSelectedAddress(address)
                              }
                            }}
                          >
                            {savedAddresses.map((address) => (
                              <div key={address.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} />
                                <Label
                                  htmlFor={`address-${address.id}`}
                                  className="flex-1 glass p-4 rounded-lg cursor-pointer hover:border-glow transition-all"
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold">{address.name}</span>
                                        {address.isDefault && (
                                          <Badge variant="secondary">Default</Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {address.fullName}<br />
                                        {address.street}<br />
                                        {address.city}, {address.state} {address.zip}<br />
                                        {address.phone}
                                      </p>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="new" id="new-address" />
                              <Label htmlFor="new-address" className="cursor-pointer">
                                Use a new address
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}

                      {/* New Address Form */}
                      {(useNewAddress || guestCheckout) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name *</Label>
                              <Input
                                id="firstName"
                                value={shippingForm.firstName}
                                onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                                className={cn("glass", errors.firstName && "border-destructive")}
                              />
                              {errors.firstName && (
                                <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name *</Label>
                              <Input
                                id="lastName"
                                value={shippingForm.lastName}
                                onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                                className={cn("glass", errors.lastName && "border-destructive")}
                              />
                              {errors.lastName && (
                                <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={shippingForm.email}
                              onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                              className={cn("glass", errors.email && "border-destructive")}
                            />
                            {errors.email && (
                              <p className="text-xs text-destructive mt-1">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={shippingForm.phone}
                              onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                              className="glass"
                            />
                          </div>

                          <div>
                            <Label htmlFor="street">Street Address *</Label>
                            <Input
                              id="street"
                              value={shippingForm.street}
                              onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                              className={cn("glass", errors.street && "border-destructive")}
                            />
                            {errors.street && (
                              <p className="text-xs text-destructive mt-1">{errors.street}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="apartment">Apartment, Suite, etc. (optional)</Label>
                            <Input
                              id="apartment"
                              value={shippingForm.apartment}
                              onChange={(e) => setShippingForm({ ...shippingForm, apartment: e.target.value })}
                              className="glass"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                value={shippingForm.city}
                                onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                                className={cn("glass", errors.city && "border-destructive")}
                              />
                              {errors.city && (
                                <p className="text-xs text-destructive mt-1">{errors.city}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="state">State</Label>
                              <Select
                                value={shippingForm.state}
                                onValueChange={(value) => setShippingForm({ ...shippingForm, state: value })}
                              >
                                <SelectTrigger className="glass">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CA">California</SelectItem>
                                  <SelectItem value="NY">New York</SelectItem>
                                  <SelectItem value="TX">Texas</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="zip">ZIP Code *</Label>
                              <Input
                                id="zip"
                                value={shippingForm.zip}
                                onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                                className={cn("glass", errors.zip && "border-destructive")}
                              />
                              {errors.zip && (
                                <p className="text-xs text-destructive mt-1">{errors.zip}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Select
                                value={shippingForm.country}
                                onValueChange={(value) => setShippingForm({ ...shippingForm, country: value })}
                              >
                                <SelectTrigger className="glass">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="United States">United States</SelectItem>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="Mexico">Mexico</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="save-address"
                              checked={saveInfo}
                              onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                            />
                            <Label htmlFor="save-address">Save this address for future orders</Label>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Shipping Method */}
                  <Card className="glass-overlay">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        Shipping Method
                      </CardTitle>
                      <CardDescription>Choose how you want to receive your order</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={shippingMethod.id}
                        onValueChange={(value) => {
                          const method = shippingMethods.find(m => m.id === value)
                          if (method) setShippingMethod(method)
                        }}
                        className="space-y-3"
                      >
                        {shippingMethods.map((method) => (
                          <div key={method.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Label
                              htmlFor={method.id}
                              className="flex-1 glass p-4 rounded-lg cursor-pointer hover:border-glow transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold mb-1">{method.name}</p>
                                  <p className="text-sm text-muted-foreground">{method.time}</p>
                                </div>
                                <p className="text-lg font-bold terminal-glow">
                                  {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                                </p>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  {/* Gift Options */}
                  <Card className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Gift className="w-5 h-5 text-primary" />
                          <Label htmlFor="is-gift">This is a gift</Label>
                        </div>
                        <Checkbox
                          id="is-gift"
                          checked={isGift}
                          onCheckedChange={(checked) => setIsGift(checked as boolean)}
                        />
                      </div>
                      {isGift && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3"
                        >
                          <div>
                            <Label htmlFor="gift-message">Gift Message</Label>
                            <Textarea
                              id="gift-message"
                              placeholder="Write your gift message here..."
                              className="glass"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            + $5.99 for gift wrapping and card
                          </p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <Card className="glass-overlay">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Payment Information
                      </CardTitle>
                      <CardDescription>Your payment is secure and encrypted</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                      {/* Payment Method Selection */}
                      <div className="space-y-3">
                        <Label>Payment Method</Label>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                          {paymentMethods.map((method) => {
                            const Icon = method.icon
                            return (
                              <div key={method.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                                <Label
                                  htmlFor={`payment-${method.id}`}
                                  className="flex-1 glass p-4 rounded-lg cursor-pointer hover:border-glow transition-all"
                                >
                                  <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{method.name}</span>
                                  </div>
                                </Label>
                              </div>
                            )
                          })}
                        </RadioGroup>
                      </div>

                      {/* Card Payment Form */}
                      {paymentMethod === 'card' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4"
                        >
                          <div>
                            <Label htmlFor="cardNumber">Card Number *</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={paymentForm.cardNumber}
                              onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                              className={cn("glass", errors.cardNumber && "border-destructive")}
                            />
                            {errors.cardNumber && (
                              <p className="text-xs text-destructive mt-1">{errors.cardNumber}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="cardName">Cardholder Name *</Label>
                            <Input
                              id="cardName"
                              placeholder="John Doe"
                              value={paymentForm.cardName}
                              onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                              className={cn("glass", errors.cardName && "border-destructive")}
                            />
                            {errors.cardName && (
                              <p className="text-xs text-destructive mt-1">{errors.cardName}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date *</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={paymentForm.expiry}
                                onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                                className={cn("glass", errors.expiry && "border-destructive")}
                              />
                              {errors.expiry && (
                                <p className="text-xs text-destructive mt-1">{errors.expiry}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={paymentForm.cvv}
                                onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                                className={cn("glass", errors.cvv && "border-destructive")}
                              />
                              {errors.cvv && (
                                <p className="text-xs text-destructive mt-1">{errors.cvv}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* PayPal */}
                      {paymentMethod === 'paypal' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="glass p-8 rounded-lg text-center"
                        >
                          <Wallet className="w-12 h-12 mx-auto mb-4 text-primary" />
                          <p className="text-muted-foreground mb-4">
                            You will be redirected to PayPal to complete your payment
                          </p>
                          <Button className="border-glow">
                            Continue with PayPal
                          </Button>
                        </motion.div>
                      )}

                      {/* Apple Pay */}
                      {paymentMethod === 'apple' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="glass p-8 rounded-lg text-center"
                        >
                          <Smartphone className="w-12 h-12 mx-auto mb-4 text-primary" />
                          <p className="text-muted-foreground mb-4">
                            Use your Apple device to complete the payment
                          </p>
                          <Button className="border-glow">
                            Pay with Apple Pay
                          </Button>
                        </motion.div>
                      )}

                      {/* Billing Address */}
                      <div className="space-y-3">
                        <Label>Billing Address</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="same-as-shipping"
                            checked={sameAsBilling}
                            onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                          />
                          <Label htmlFor="same-as-shipping">Same as shipping address</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Badge */}
                  <Card className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <Lock className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-semibold mb-1">Secure Payment</p>
                          <p className="text-sm text-muted-foreground">
                            Your payment information is encrypted and secure. We never store your card details.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <Card className="glass-overlay">
                    <CardHeader>
                      <CardTitle>Review Your Order</CardTitle>
                      <CardDescription>Please verify all information before placing your order</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                      {/* Shipping Info */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Shipping Address
                          </h3>
                          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                            Edit
                          </Button>
                        </div>
                        <div className="glass p-4 rounded-lg text-sm text-muted-foreground">
                          <p className="font-medium text-foreground mb-1">{selectedAddress.fullName}</p>
                          <p>{selectedAddress.street}</p>
                          <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}</p>
                          <p>{selectedAddress.phone}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Shipping Method */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Shipping Method
                          </h3>
                          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                            Edit
                          </Button>
                        </div>
                        <div className="glass p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{shippingMethod.name}</p>
                              <p className="text-sm text-muted-foreground">{shippingMethod.time}</p>
                            </div>
                            <p className="font-bold">
                              {shippingMethod.price === 0 ? 'FREE' : `$${shippingMethod.price.toFixed(2)}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Payment Method */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Payment Method
                          </h3>
                          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                            Edit
                          </Button>
                        </div>
                        <div className="glass p-4 rounded-lg">
                          <p className="font-medium">
                            {paymentMethods.find(m => m.id === paymentMethod)?.name}
                          </p>
                          {paymentMethod === 'card' && paymentForm.cardNumber && (
                            <p className="text-sm text-muted-foreground">
                              •••• •••• •••• {paymentForm.cardNumber.slice(-4)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="glass p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Checkbox id="terms" />
                          <Label htmlFor="terms" className="text-sm cursor-pointer">
                            I agree to the{' '}
                            <a href="#" className="text-primary hover:underline">Terms and Conditions</a>
                            {' '}and{' '}
                            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="lg"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button size="lg" onClick={nextStep} className="border-glow">
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button size="lg" className="border-glow text-lg px-8">
                  <Lock className="w-5 h-5 mr-2" />
                  Place Order
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="sticky top-8">
              <Card className="glass-overlay border-glow">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shippingMethod.price === 0 ? (
                          <span className="text-green-500">FREE</span>
                        ) : (
                          `$${shippingMethod.price.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    {isGift && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gift Wrapping</span>
                        <span className="font-medium">$5.99</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="terminal-glow text-2xl">
                      ${(total + (isGift ? 5.99 : 0)).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
