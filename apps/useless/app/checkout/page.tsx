'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, MapPin, Package, CheckCircle2, ArrowRight, ArrowLeft,
  Lock, Truck, AlertCircle, Check, Wallet as WalletIcon, Info, Coins
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import { Button } from '@ggprompts/ui'
import { Separator } from '@ggprompts/ui'
import { Input } from '@ggprompts/ui'
import { Label } from '@ggprompts/ui'
import { Checkbox } from '@ggprompts/ui'
import { RadioGroup, RadioGroupItem } from '@ggprompts/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ggprompts/ui"
import { cn } from '@ggprompts/ui'
import { useCart } from '@/components/cart/CartProvider'
import { useSession } from '@/lib/auth-client'
import { toast } from 'sonner'

const steps = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Review', icon: Package },
]

const shippingMethods = [
  { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: 0 },
  { id: 'express', name: 'Express Shipping', time: '2-3 business days', price: 15.99 },
  { id: 'overnight', name: 'Overnight Shipping', time: 'Next business day', price: 29.99 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, subtotal, clearCart } = useCart()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [loadingWallet, setLoadingWallet] = useState(true)

  const [shippingMethod, setShippingMethod] = useState(shippingMethods[0])
  const [paymentMethod, setPaymentMethod] = useState<'useless_bucks' | 'stripe'>('useless_bucks')
  const [sameAsBilling, setSameAsBilling] = useState(true)
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

  const tax = subtotal * 0.08
  const total = subtotal + tax + shippingMethod.price

  // Fetch wallet balance when component mounts
  useEffect(() => {
    if (session?.user) {
      fetch('/api/wallet')
        .then(res => res.json())
        .then(data => {
          setWalletBalance(parseFloat(data.balance))
          setLoadingWallet(false)
        })
        .catch(() => {
          setLoadingWallet(false)
        })
    } else {
      setLoadingWallet(false)
    }
  }, [session?.user])

  // Redirect if not logged in
  if (!session?.user) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-overlay rounded-2xl p-12 text-center"
          >
            <Lock className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-3xl font-bold terminal-glow mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-8">
              Please log in to continue with checkout
            </p>
            <Button
              size="lg"
              className="border-glow"
              onClick={() => router.push(`/login?redirect=/checkout`)}
            >
              Go to Login
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-overlay rounded-2xl p-12 text-center"
          >
            <Package className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold terminal-glow mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some useless products before checking out!
            </p>
            <Button
              size="lg"
              className="border-glow"
              onClick={() => router.push('/products')}
            >
              Continue Shopping
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!shippingForm.firstName) newErrors.firstName = 'First name is required'
      if (!shippingForm.lastName) newErrors.lastName = 'Last name is required'
      if (!shippingForm.email) newErrors.email = 'Email is required'
      if (!shippingForm.street) newErrors.street = 'Street address is required'
      if (!shippingForm.city) newErrors.city = 'City is required'
      if (!shippingForm.zip) newErrors.zip = 'ZIP code is required'
    }

    if (step === 2 && paymentMethod === 'stripe') {
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

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return

    setIsLoading(true)

    try {
      const shippingAddress = {
        name: `${shippingForm.firstName} ${shippingForm.lastName}`,
        street: shippingForm.apartment
          ? `${shippingForm.street}, ${shippingForm.apartment}`
          : shippingForm.street,
        city: shippingForm.city,
        state: shippingForm.state,
        zip: shippingForm.zip,
        country: shippingForm.country,
      }

      if (paymentMethod === 'useless_bucks') {
        // UselessBucks payment
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.items,
            shippingAddress,
            billingAddress: sameAsBilling ? shippingAddress : shippingAddress,
            paymentMethod: 'useless_bucks',
            shipping: shippingMethod.price,
            tax,
            total,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create order')
        }

        toast.success('Order placed successfully!')
        clearCart()
        router.push(`/order-confirmation/${data.orderId}`)
      } else {
        // Stripe payment
        const response = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.items,
            shippingAddress,
            billingAddress: sameAsBilling ? shippingAddress : shippingAddress,
            shipping: shippingMethod.price,
            tax,
            total,
          }),
        })

        const data = await response.json()

        if (data.fallback) {
          toast.info(data.message)
          // Suggest using UselessBucks instead
          setPaymentMethod('useless_bucks')
        } else if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error('Invalid response from payment processor')
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  const hasSufficientBalance = walletBalance !== null && walletBalance >= total

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold terminal-glow mb-2">Checkout</h1>
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

            {steps.map((step) => {
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
                      <CardDescription>Where should we send your useless products?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                        Payment Method
                      </CardTitle>
                      <CardDescription>Choose how you would like to pay</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                      {/* Wallet Balance Display */}
                      {!loadingWallet && walletBalance !== null && (
                        <div className="glass p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Coins className="w-5 h-5 text-primary" />
                              <span className="font-semibold">Your UselessBucks Balance</span>
                            </div>
                            <span className="text-2xl font-bold terminal-glow">
                              ${walletBalance.toFixed(2)}
                            </span>
                          </div>
                          {walletBalance < total && (
                            <div className="flex items-center gap-2 text-sm text-amber-500 mt-2">
                              <AlertCircle className="w-4 h-4" />
                              <span>Insufficient balance. Consider using a card instead.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Payment Method Selection */}
                      <div className="space-y-3">
                        <Label>Select Payment Method</Label>
                        <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                          {/* UselessBucks */}
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="useless_bucks" id="payment-useless_bucks" />
                            <Label
                              htmlFor="payment-useless_bucks"
                              className="flex-1 glass p-4 rounded-lg cursor-pointer hover:border-glow transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <WalletIcon className="w-5 h-5 text-primary" />
                                  <div>
                                    <span className="font-medium">UselessBucks</span>
                                    <Badge variant="secondary" className="ml-2">Recommended</Badge>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Pay with your play money balance
                                    </p>
                                  </div>
                                </div>
                                {hasSufficientBalance && (
                                  <Check className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                            </Label>
                          </div>

                          {/* Stripe */}
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="stripe" id="payment-stripe" />
                            <Label
                              htmlFor="payment-stripe"
                              className="flex-1 glass p-4 rounded-lg cursor-pointer hover:border-glow transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5" />
                                <div>
                                  <span className="font-medium">Credit/Debit Card</span>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Pay with Stripe (test mode)
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* UselessBucks Info */}
                      {paymentMethod === 'useless_bucks' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="glass p-6 rounded-lg"
                        >
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-semibold mb-2">Pay with UselessBucks</p>
                              <p className="text-sm text-muted-foreground mb-3">
                                You'll use your play money balance to complete this purchase. No real money will be charged!
                              </p>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Order Total:</span>
                                <span className="font-bold">${total.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm mt-1">
                                <span className="text-muted-foreground">Your Balance:</span>
                                <span className="font-bold">${walletBalance?.toFixed(2)}</span>
                              </div>
                              <Separator className="my-3" />
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">Balance After Purchase:</span>
                                <span className={cn(
                                  "text-lg font-bold terminal-glow",
                                  hasSufficientBalance ? "text-green-500" : "text-destructive"
                                )}>
                                  ${((walletBalance || 0) - total).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Stripe Placeholder */}
                      {paymentMethod === 'stripe' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="glass p-8 rounded-lg text-center"
                        >
                          <CreditCard className="w-12 h-12 mx-auto mb-4 text-primary" />
                          <p className="text-muted-foreground mb-4">
                            Stripe integration is in test mode. For now, please use UselessBucks!
                          </p>
                          <p className="text-sm text-muted-foreground">
                            This will redirect to Stripe Checkout when configured.
                          </p>
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
                            All transactions are secure and encrypted. Your UselessBucks are completely useless but totally safe!
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
                          <p className="font-medium text-foreground mb-1">
                            {shippingForm.firstName} {shippingForm.lastName}
                          </p>
                          <p>{shippingForm.street}</p>
                          {shippingForm.apartment && <p>{shippingForm.apartment}</p>}
                          <p>{shippingForm.city}, {shippingForm.state} {shippingForm.zip}</p>
                          <p>{shippingForm.country}</p>
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
                          <div className="flex items-center gap-2">
                            {paymentMethod === 'useless_bucks' ? (
                              <>
                                <WalletIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="font-medium">UselessBucks</p>
                                  <p className="text-sm text-muted-foreground">
                                    ${total.toFixed(2)} will be deducted from your balance
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-5 h-5 text-primary" />
                                <p className="font-medium">Credit/Debit Card (Stripe)</p>
                              </>
                            )}
                          </div>
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
                disabled={currentStep === 1 || isLoading}
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
                <Button
                  size="lg"
                  className="border-glow text-lg px-8"
                  onClick={handlePlaceOrder}
                  disabled={isLoading || (paymentMethod === 'useless_bucks' && !hasSufficientBalance)}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  {isLoading ? 'Processing...' : 'Place Order'}
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
                    {cart.items.map((item) => (
                      <div key={item.productId} className="flex gap-3">
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
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="terminal-glow text-2xl">
                      ${total.toFixed(2)}
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
