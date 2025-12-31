'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle2, Package, Truck, MapPin, CreditCard,
  Download, Printer, ArrowRight, Clock, CheckCheck,
  Copy, Check, ShoppingBag, Home, Coins, Wallet as WalletIcon,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import { Button } from '@ggprompts/ui'
import { Separator } from '@ggprompts/ui'
import { Progress } from '@ggprompts/ui'
import { cn } from '@ggprompts/ui'
import { useSession } from '@/lib/auth-client'

const timeline = [
  { status: 'confirmed', label: 'Order Confirmed', completed: true },
  { status: 'processing', label: 'Processing', completed: false },
  { status: 'shipped', label: 'Shipped', completed: false },
  { status: 'delivered', label: 'Delivered', completed: false },
]

const funMessages = [
  "Your useless items are on their way to being completely useless!",
  "Congratulations on this monumentally pointless purchase!",
  "Your wallet is lighter and your life is... exactly the same!",
  "Achievement unlocked: Professional Time Waster",
  "These items will look great collecting dust!",
]

export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(true)
  const [copied, setCopied] = useState(false)
  const [funMessage] = useState(funMessages[Math.floor(Math.random() * funMessages.length)])

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }
        const data = await response.json()
        setOrder(data.order)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchOrder()
    }
  }, [params.orderId, session])

  if (!session?.user) {
    router.push('/login')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="glass-overlay rounded-2xl p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="glass-overlay rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find this order. Please check your order history.
          </p>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const currentStep = timeline.findIndex(t => t.status === order.status)
  const isPaidWithUselessBucks = order.paymentMethod === 'useless_bucks'

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
            className="text-4xl md:text-5xl font-bold terminal-glow mb-4"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-2"
          >
            Thank you for your useless purchase!
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-sm text-muted-foreground mb-6 italic"
          >
            {funMessage}
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
                <p className="font-mono font-bold text-sm">{order.id.slice(0, 13)}...</p>
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

          {/* UselessBucks Payment Badge */}
          {isPaidWithUselessBucks && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2 text-sm">
                <Coins className="w-4 h-4 mr-2" />
                Paid with UselessBucks
              </Badge>
            </motion.div>
          )}
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
                    Your useless items are being prepared
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={(currentStep / timeline.length) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      Step {currentStep + 1} of {timeline.length}
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
                          <p
                            className={cn(
                              "font-semibold",
                              step.completed ? "text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {step.label}
                          </p>
                          {step.completed && index === currentStep && (
                            <Badge className="bg-green-500/20 text-green-500 mt-1">
                              <Check className="w-3 h-3 mr-1" />
                              Current
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
                    Order Items ({order.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{item.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          <span>${parseFloat(item.price).toFixed(2)} each</span>
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold terminal-glow">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="glass-overlay">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{order.shippingAddress.name}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zip}
                    </p>
                    <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
                      <span className="font-medium">${parseFloat(order.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {parseFloat(order.shipping) === 0 ? (
                          <span className="text-green-500">FREE</span>
                        ) : (
                          `$${parseFloat(order.shipping).toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">${parseFloat(order.tax).toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Paid</span>
                    <span className="terminal-glow text-2xl">
                      ${parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Payment Method</p>
                    <div className="flex items-center gap-2 glass p-3 rounded-lg">
                      {isPaidWithUselessBucks ? (
                        <>
                          <WalletIcon className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm">UselessBucks</p>
                            <p className="text-xs text-muted-foreground">Play money payment</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 text-primary" />
                          <p className="font-medium text-sm">Credit Card</p>
                        </>
                      )}
                    </div>
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
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/products')}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/account/orders')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    View All Orders
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Fun Achievement */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="glass border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h3 className="font-bold">Achievement Unlocked!</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You've successfully wasted your UselessBucks on completely pointless items. Well done!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
