'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, Package, Truck, MapPin, CreditCard, Calendar,
  Download, Printer, Share2, Mail, MessageSquare, Star, ArrowRight,
  Clock, Shield, Gift, Heart, ShoppingBag, Home, Bell, CheckCheck,
  Box, PackageCheck, User, Phone, Copy, Check, Twitter, Facebook,
  ShoppingCart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const orderDetails = {
  orderNumber: 'ORD-2024-7891234',
  orderDate: 'January 22, 2025',
  estimatedDelivery: 'January 26-28, 2025',
  trackingNumber: 'TRK1Z9999W99999999',
  status: 'confirmed',
  shippingMethod: 'Express Shipping',
  items: [
    {
      id: 1,
      name: 'Self-Aware Toaster 3000™',
      brand: 'JudgyAppliances',
      price: 499.99,
      quantity: 1,
      image: '/products/toaster-1.webp',
    },
    {
      id: 2,
      name: 'Telepathic TV Remote',
      brand: 'MindControl Inc',
      price: 299.99,
      quantity: 1,
      image: '/products/remote-1.webp',
    },
    {
      id: 3,
      name: 'Invisible Socks™',
      brand: 'GhostWear',
      price: 19.99,
      quantity: 2,
      image: '/products/socks-1.webp',
    },
  ],
  shippingAddress: {
    name: 'John Doe',
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
    phone: '+1 (555) 123-4567',
  },
  billingAddress: {
    name: 'John Doe',
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
  },
  payment: {
    method: 'Credit Card',
    last4: '4242',
    brand: 'Visa',
  },
  subtotal: 619.97,
  shipping: 15.99,
  tax: 50.88,
  discount: 0,
  total: 686.84,
}

const relatedProducts = [
  { id: 10, name: 'Self-Folding Laundry Basket', price: 149.99, image: '/products/basket-1.webp', rating: 2.9 },
  { id: 11, name: 'Procrastination Timer™', price: 59.99, image: '/products/timer-1.webp', rating: 4.9 },
  { id: 12, name: 'Toaster 3000™ (Black)', price: 499.99, image: '/products/toaster-2.webp', rating: 4.2 },
  { id: 13, name: 'Telepathic Remote (Deluxe)', price: 349.99, image: '/products/remote-2.webp', rating: 3.8 },
]

const timeline = [
  { status: 'confirmed', label: 'Order Confirmed', date: 'Jan 22, 2:34 PM', completed: true },
  { status: 'processing', label: 'Processing', date: 'Jan 22-23', completed: true },
  { status: 'shipped', label: 'Shipped', date: 'Jan 24', completed: false },
  { status: 'in-transit', label: 'In Transit', date: 'Jan 24-26', completed: false },
  { status: 'delivered', label: 'Delivered', date: 'Jan 26-28', completed: false },
]

export default function OrderConfirmationPage() {
  const [showConfetti, setShowConfetti] = useState(true)
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [createAccount, setCreateAccount] = useState(false)
  const [newsletter, setNewsletter] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderDetails.orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const currentStep = timeline.findIndex(t => !t.completed)

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">

      {/* Animated Background Elements */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: -20,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 1080) + 20,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 3,
                ease: 'linear',
              }}
              className="absolute w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-overlay rounded-2xl p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow mb-4"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-6"
          >
            Thank you for your purchase. Your order has been received and is being processed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <div className="flex items-center gap-3 glass px-6 py-3 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Order Number</p>
                <p className="font-mono font-bold">{orderDetails.orderNumber}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyOrderNumber}
                className="ml-2"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Invoice
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass-overlay">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Order Status
                  </CardTitle>
                  <CardDescription>
                    Estimated delivery: {orderDetails.estimatedDelivery}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={(currentStep / timeline.length) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      Step {currentStep} of {timeline.length}
                    </p>
                  </div>

                  {/* Timeline Steps */}
                  <div className="space-y-4">
                    {timeline.map((step, index) => (
                      <motion.div
                        key={step.status}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={cn(
                          "flex items-start gap-4 relative",
                          index < timeline.length - 1 && "pb-4"
                        )}
                      >
                        {/* Connector Line */}
                        {index < timeline.length - 1 && (
                          <div
                            className={cn(
                              "absolute left-[15px] top-8 w-0.5 h-full",
                              step.completed ? "bg-primary" : "bg-muted"
                            )}
                          />
                        )}

                        {/* Status Icon */}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all",
                            step.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {step.completed ? (
                            <CheckCheck className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>

                        {/* Status Info */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <p
                              className={cn(
                                "font-semibold",
                                step.completed ? "text-foreground" : "text-muted-foreground"
                              )}
                            >
                              {step.label}
                            </p>
                            <p className="text-sm text-muted-foreground">{step.date}</p>
                          </div>
                          {step.completed && index === currentStep - 1 && (
                            <Badge className="bg-green-500/20 text-green-500">
                              <Check className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tracking Info */}
                  {orderDetails.trackingNumber && (
                    <div className="glass p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                        <p className="font-mono font-semibold">{orderDetails.trackingNumber}</p>
                      </div>
                      <Button variant="outline">
                        Track Package
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="glass-overlay">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Order Items ({orderDetails.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-lg object-cover glass"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">{item.brand}</p>
                        <h4 className="font-semibold mb-2">{item.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          <span>${item.price.toFixed(2)} each</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold terminal-glow">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Addresses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Shipping Address */}
              <Card className="glass-overlay">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{orderDetails.shippingAddress.name}</p>
                    <p className="text-muted-foreground">{orderDetails.shippingAddress.street}</p>
                    <p className="text-muted-foreground">
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{' '}
                      {orderDetails.shippingAddress.zip}
                    </p>
                    <p className="text-muted-foreground">{orderDetails.shippingAddress.country}</p>
                    <p className="text-muted-foreground flex items-center gap-2 pt-2">
                      <Phone className="w-3 h-3" />
                      {orderDetails.shippingAddress.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="glass-overlay">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="w-4 h-4" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{orderDetails.payment.method}</span>
                      <Badge variant="secondary">{orderDetails.payment.brand}</Badge>
                    </div>
                    <p className="font-mono">•••• •••• •••• {orderDetails.payment.last4}</p>
                    <div className="flex items-center gap-2 pt-2 text-green-500">
                      <Shield className="w-4 h-4" />
                      <span className="text-xs">Payment Verified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="glass-overlay">
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass p-4 rounded-lg flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Check your email</p>
                        <p className="text-sm text-muted-foreground">
                          We've sent order confirmation and receipt to your email address
                        </p>
                      </div>
                    </div>

                    <div className="glass p-4 rounded-lg flex items-start gap-3">
                      <Bell className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Get updates</p>
                        <p className="text-sm text-muted-foreground">
                          We'll notify you when your order ships and when it's delivered
                        </p>
                      </div>
                    </div>

                    <div className="glass p-4 rounded-lg flex items-start gap-3">
                      <Truck className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Track your order</p>
                        <p className="text-sm text-muted-foreground">
                          Use the tracking number to monitor your package in real-time
                        </p>
                      </div>
                    </div>

                    <div className="glass p-4 rounded-lg flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Need help?</p>
                        <p className="text-sm text-muted-foreground">
                          Our support team is available 24/7 to assist you
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Create Account CTA */}
            {!createAccount && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Card className="glass border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Create an Account</h3>
                        <p className="text-muted-foreground mb-4">
                          Save your information for faster checkout, track orders, and get exclusive offers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glass"
                          />
                          <Button className="border-glow">
                            Create Account
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox
                            id="newsletter"
                            checked={newsletter}
                            onCheckedChange={(checked) => setNewsletter(checked as boolean)}
                          />
                          <Label htmlFor="newsletter" className="text-sm cursor-pointer">
                            Subscribe to our newsletter for exclusive deals
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="sticky top-8"
            >
              <Card className="glass-overlay border-glow">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${orderDetails.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping ({orderDetails.shippingMethod})</span>
                      <span className="font-medium">${orderDetails.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">${orderDetails.tax.toFixed(2)}</span>
                    </div>
                    {orderDetails.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Discount</span>
                        <span>-${orderDetails.discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Paid</span>
                    <span className="terminal-glow text-2xl">
                      ${orderDetails.total.toFixed(2)}
                    </span>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-semibold mb-3">Share your purchase</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="glass">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Need Help?</p>
                      <p className="text-sm text-muted-foreground">We're here 24/7</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Live Chat
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="glass">
                <CardContent className="p-6 space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    View All Orders
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    View Wishlist
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold terminal-glow">Complete Your Setup</h2>
            <Button variant="outline">View All</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="glass overflow-hidden cursor-pointer group">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold line-clamp-2 text-sm">{product.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span>{product.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold terminal-glow">${product.price}</p>
                      <Button size="sm" variant="outline">
                        <ShoppingCart className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
