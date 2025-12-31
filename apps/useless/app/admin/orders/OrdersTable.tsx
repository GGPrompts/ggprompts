"use client";

import * as React from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Package,
  CreditCard,
  Coins,
  ArrowUpDown,
} from "lucide-react";

import { Input } from "@ggprompts/ui";
import { Button } from "@ggprompts/ui";
import { Badge } from "@ggprompts/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ggprompts/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ggprompts/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@ggprompts/ui";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@ggprompts/ui";

// Types
type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type PaymentMethod = "useless_bucks" | "stripe";

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: OrderStatus;
  total: string;
  paymentMethod: PaymentMethod;
  itemCount: number;
  items: OrderItem[];
  createdAt: Date;
}

interface OrdersTableProps {
  orders: Order[];
}

// Satirical status labels
const statusLabels: Record<OrderStatus, string> = {
  pending: "Pretending to Process",
  confirmed: "Acknowledged Existence",
  processing: "Thinking About It",
  shipped: "Pretending to Ship",
  delivered: "Claimed Delivery (lol)",
  cancelled: "Reality Check",
};

// Status badge colors for more visual distinction
const statusColors: Record<OrderStatus, string> = {
  pending: "border-yellow-500/50 text-yellow-500 bg-yellow-500/10",
  confirmed: "border-blue-500/50 text-blue-500 bg-blue-500/10",
  processing: "border-purple-500/50 text-purple-500 bg-purple-500/10",
  shipped: "border-cyan-500/50 text-cyan-500 bg-cyan-500/10",
  delivered: "border-green-500/50 text-green-500 bg-green-500/10",
  cancelled: "border-red-500/50 text-red-500 bg-red-500/10",
};

type SortField = "date" | "total";
type SortDirection = "asc" | "desc";

export function OrdersTable({ orders }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = React.useState<PaymentMethod | "all">("all");
  const [sortField, setSortField] = React.useState<SortField>("date");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // Filter and sort orders
  const filteredOrders = React.useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.userEmail.toLowerCase().includes(query) ||
          order.userName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Payment method filter
    if (paymentFilter !== "all") {
      result = result.filter((order) => order.paymentMethod === paymentFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === "total") {
        comparison = parseFloat(a.total) - parseFloat(b.total);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [orders, searchQuery, statusFilter, paymentFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    // TODO: Implement server action for status update
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // This would call a server action in production
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 glass border-border/20"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}
        >
          <SelectTrigger className="w-full sm:w-[200px] glass border-border/20">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pretending to Process</SelectItem>
            <SelectItem value="confirmed">Acknowledged Existence</SelectItem>
            <SelectItem value="processing">Thinking About It</SelectItem>
            <SelectItem value="shipped">Pretending to Ship</SelectItem>
            <SelectItem value="delivered">Claimed Delivery (lol)</SelectItem>
            <SelectItem value="cancelled">Reality Check</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={paymentFilter}
          onValueChange={(value) => setPaymentFilter(value as PaymentMethod | "all")}
        >
          <SelectTrigger className="w-full sm:w-[180px] glass border-border/20">
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="useless_bucks">UselessBucks</SelectItem>
            <SelectItem value="stripe">Stripe (Real Money?!)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredOrders.length} of {orders.length} orders
        {filteredOrders.length === 0 && orders.length > 0 && (
          <span className="ml-2 text-yellow-500">
            - No matches found. Try being less specific, like our product descriptions.
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/20">
              <TableHead className="w-[140px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 hover:bg-transparent"
                  onClick={() => handleSort("total")}
                >
                  Total
                  <SortIcon field="total" />
                </Button>
              </TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 hover:bg-transparent"
                  onClick={() => handleSort("date")}
                >
                  Date
                  <SortIcon field="date" />
                </Button>
              </TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Package className="h-8 w-8" />
                    <p>No orders found</p>
                    <p className="text-sm">
                      Either everyone realized our products don&apos;t exist, or try adjusting
                      your filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-border/20">
                  <TableCell className="font-mono text-xs">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.userEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="border-border/20">
                      {order.itemCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-semibold text-primary">
                      U${parseFloat(order.total).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {order.paymentMethod === "useless_bucks" ? (
                      <div className="flex items-center gap-1.5">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">UselessBucks</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Stripe</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]} variant="outline">
                      {statusLabels[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order.id, "pending")}
                            >
                              Pretending to Process
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order.id, "confirmed")}
                            >
                              Acknowledged Existence
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order.id, "processing")}
                            >
                              Thinking About It
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order.id, "shipped")}
                            >
                              Pretending to Ship
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order.id, "delivered")}
                            >
                              Claimed Delivery (lol)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order.id, "cancelled")}
                              className="text-destructive"
                            >
                              Reality Check (Cancel)
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="glass-dark border-l-border/20 w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="terminal-glow">Order Details</SheetTitle>
            <SheetDescription>
              A detailed look at this completely legitimate order
            </SheetDescription>
          </SheetHeader>

          {selectedOrder && (
            <div className="mt-6 space-y-6">
              {/* Order Info */}
              <div className="glass border border-border/20 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Order ID</span>
                  <span className="font-mono text-sm">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={statusColors[selectedOrder.status]} variant="outline">
                    {statusLabels[selectedOrder.status]}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payment</span>
                  <div className="flex items-center gap-1.5">
                    {selectedOrder.paymentMethod === "useless_bucks" ? (
                      <>
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">UselessBucks</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Stripe</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="glass border border-border/20 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">Customer</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm">{selectedOrder.userName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm">{selectedOrder.userEmail}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="glass border border-border/20 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">
                  Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start py-2 border-b border-border/10 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} x U${parseFloat(item.price).toLocaleString()}
                        </p>
                      </div>
                      <p className="font-mono text-sm text-primary">
                        U$
                        {(parseFloat(item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="glass border border-border/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary terminal-glow">
                    U${parseFloat(selectedOrder.total).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/60 mt-2 text-right italic">
                  Worth absolutely nothing in the real world
                </p>
              </div>

              {/* Disclaimer */}
              <div className="text-center text-xs text-muted-foreground/60 italic pt-4 border-t border-border/20">
                This order contains products that do not exist and will never be
                delivered. Any resemblance to actual commerce is purely coincidental.
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
