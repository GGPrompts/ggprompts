'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Search, Filter, Eye, ShoppingBag,
  Wallet, CreditCard, Clock, ChevronLeft, ChevronRight,
  AlertCircle, TrendingDown, Award, Calendar,
  Loader2, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import { Button } from '@ggprompts/ui'
import { Input } from '@ggprompts/ui'
import { Separator } from '@ggprompts/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ggprompts/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ggprompts/ui'
import { cn } from '@ggprompts/ui'
import { useSession } from '@/lib/auth-client'

// Types
interface OrderItem {
  id: string
  orderId: string
  productId: string
  name: string
  price: string
  quantity: number
  color: string | null
  size: string | null
}

interface Order {
  id: string
  userId: string
  status: string
  subtotal: string
  shipping: string
  tax: string
  discount: string
  total: string
  paymentMethod: string
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  } | null
  createdAt: string
  items: OrderItem[]
}

// Satirical status mappings
const statusConfig: Record<string, { label: string; emoji: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  pending: { label: 'Contemplating Your Choices', emoji: '', variant: 'secondary', color: 'text-yellow-500' },
  confirmed: { label: 'Regret Locked In', emoji: '', variant: 'default', color: 'text-blue-500' },
  processing: { label: 'Assembling Your Disappointment', emoji: '', variant: 'secondary', color: 'text-orange-500' },
  shipped: { label: 'Traveling Through the Void', emoji: '', variant: 'outline', color: 'text-purple-500' },
  delivered: { label: 'Arrived (Condolences)', emoji: '', variant: 'default', color: 'text-green-500' },
  cancelled: { label: 'Bullet Dodged', emoji: '', variant: 'destructive', color: 'text-red-500' },
}

// Payment method display
const paymentMethodConfig: Record<string, { label: string; emoji: string; icon: typeof Wallet }> = {
  useless_bucks: { label: 'Monopoly Money', emoji: '', icon: Wallet },
  stripe: { label: 'Actual Human Currency (why?!)', emoji: '', icon: CreditCard },
}

const ITEMS_PER_PAGE = 5

export default function OrdersPage() {
  const router = useRouter()
  const { data: session, isPending: sessionLoading } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/orders')
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchOrders()
    } else if (!sessionLoading) {
      router.push('/login')
    }
  }, [session, sessionLoading, router])

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOrders, currentPage])

  // Stats calculations
  const stats = useMemo(() => {
    const totalWasted = orders.reduce((sum, order) => sum + parseFloat(order.total), 0)
    const categoryCount: Record<string, number> = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        // Extract category from product name (simplified)
        const category = item.name.split(' ').pop() || 'Unknown'
        categoryCount[category] = (categoryCount[category] || 0) + 1
      })
    })

    const favoriteCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nothing yet'

    return {
      totalOrders: orders.length,
      totalWasted,
      favoriteCategory,
    }
  }, [orders])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="glass-overlay rounded-2xl p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your hall of shame...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="glass-overlay rounded-2xl p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Oops! Something broke.</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shopping (for more regrets)
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold terminal-glow flex items-center gap-3">
                <Package className="h-8 w-8" />
                Hall of Shame
              </h1>
              <p className="text-muted-foreground mt-1">
                A comprehensive record of your questionable life choices
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="glass border-glow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Mistakes</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-glow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Wasted</p>
                  <p className="text-2xl font-bold text-primary terminal-glow">
                    ${stats.totalWasted.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-glow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Favorite Waste</p>
                  <p className="text-2xl font-bold truncate">{stats.favoriteCategory}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[220px] glass">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Contemplating</SelectItem>
              <SelectItem value="confirmed">Regret Locked</SelectItem>
              <SelectItem value="processing">Assembling</SelectItem>
              <SelectItem value="shipped">In Transit</SelectItem>
              <SelectItem value="delivered">Arrived</SelectItem>
              <SelectItem value="cancelled">Dodged</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredOrders.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="glass-overlay">
                  <CardContent className="p-12 text-center">
                    <Package className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-50" />
                    <h2 className="text-2xl font-semibold mb-2">
                      {orders.length === 0
                        ? 'No orders yet'
                        : 'No matching orders'}
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {orders.length === 0
                        ? "No orders yet. Your wallet thanks you, but we're disappointed. Go make some questionable purchases!"
                        : "No orders match your search. Try different filters or search terms."}
                    </p>
                    {orders.length === 0 && (
                      <Button asChild className="border-glow">
                        <Link href="/products">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Start Wasting Money
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {paginatedOrders.map((order, index) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    index={index}
                    onViewDetails={() => setSelectedOrder(order)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Details
                  </DialogTitle>
                  <DialogDescription className="font-mono text-xs">
                    {selectedOrder.id}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={statusConfig[selectedOrder.status]?.variant || 'secondary'}
                          className={statusConfig[selectedOrder.status]?.color}
                        >
                          {statusConfig[selectedOrder.status]?.emoji}{' '}
                          {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Items */}
                  <div>
                    <h3 className="font-semibold mb-3">Items Purchased (Regrets)</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start p-3 rounded-lg glass"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <div className="text-sm text-muted-foreground mt-1 flex gap-3">
                              <span>Qty: {item.quantity}</span>
                              {item.color && <span>Color: {item.color}</span>}
                              {item.size && <span>Size: {item.size}</span>}
                            </div>
                          </div>
                          <p className="font-semibold">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold mb-3">The Damage Report</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Shipping <span className="text-xs">(nothing is truly free)</span>
                        </span>
                        <span>
                          {parseFloat(selectedOrder.shipping) === 0 ? (
                            <span className="text-green-500">FREE*</span>
                          ) : (
                            `$${parseFloat(selectedOrder.shipping).toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Tax <span className="text-xs">(government's cut of your bad decisions)</span>
                        </span>
                        <span>${parseFloat(selectedOrder.tax).toFixed(2)}</span>
                      </div>
                      {parseFloat(selectedOrder.discount) > 0 && (
                        <div className="flex justify-between text-green-500">
                          <span>Discount (pity discount)</span>
                          <span>-${parseFloat(selectedOrder.discount).toFixed(2)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Damage</span>
                        <span className="terminal-glow text-primary">
                          ${parseFloat(selectedOrder.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div className="flex items-center gap-3 p-3 rounded-lg glass">
                    {selectedOrder.paymentMethod === 'useless_bucks' ? (
                      <Wallet className="h-5 w-5 text-primary" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium">
                        {paymentMethodConfig[selectedOrder.paymentMethod]?.emoji}{' '}
                        {paymentMethodConfig[selectedOrder.paymentMethod]?.label ||
                          selectedOrder.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {selectedOrder.shippingAddress && (
                    <div className="p-3 rounded-lg glass">
                      <p className="text-sm text-muted-foreground mb-2">Shipping Address</p>
                      <div className="text-sm">
                        <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                        <p className="text-muted-foreground">
                          {selectedOrder.shippingAddress.street}
                        </p>
                        <p className="text-muted-foreground">
                          {selectedOrder.shippingAddress.city},{' '}
                          {selectedOrder.shippingAddress.state}{' '}
                          {selectedOrder.shippingAddress.zip}
                        </p>
                        <p className="text-muted-foreground">
                          {selectedOrder.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Order Card Component
function OrderCard({
  order,
  index,
  onViewDetails,
}: {
  order: Order
  index: number
  onViewDetails: () => void
}) {
  const status = statusConfig[order.status] || statusConfig.pending
  const paymentMethod = paymentMethodConfig[order.paymentMethod] || paymentMethodConfig.stripe
  const PaymentIcon = paymentMethod.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="glass-overlay hover:border-primary/50 transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Order Info */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant={status.variant}
                  className={cn('transition-all', status.color)}
                >
                  {status.emoji} {status.label}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <PaymentIcon className="h-3 w-3" />
                  {paymentMethod.label}
                </div>
              </div>

              <div>
                <p className="font-mono text-xs text-muted-foreground mb-1">
                  Order #{order.id.slice(0, 8)}...
                </p>
                <p className="text-sm">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}:{' '}
                  <span className="text-muted-foreground">
                    {order.items
                      .slice(0, 2)
                      .map((item) => item.name)
                      .join(', ')}
                    {order.items.length > 2 && ` +${order.items.length - 2} more`}
                  </span>
                </p>
              </div>
            </div>

            {/* Total and Action */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Damage</p>
                <p className="text-xl font-bold terminal-glow text-primary">
                  ${parseFloat(order.total).toFixed(2)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
                className="group-hover:border-primary group-hover:text-primary transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
