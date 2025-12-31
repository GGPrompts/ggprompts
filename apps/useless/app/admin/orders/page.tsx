import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { OrdersTable } from "./OrdersTable";
import {
  ShoppingCart,
  Clock,
  Truck,
  Package,
} from "lucide-react";

// Fetch orders with user info and item counts
async function getOrdersWithDetails() {
  const ordersData = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      user: true,
      items: true,
    },
  });

  return ordersData.map((order) => ({
    id: order.id,
    userId: order.userId,
    userName: order.user.name || "Anonymous Spender",
    userEmail: order.user.email,
    status: order.status as
      | "pending"
      | "confirmed"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled",
    total: order.total,
    paymentMethod: order.paymentMethod as "useless_bucks" | "stripe",
    itemCount: order.items.length,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    createdAt: order.createdAt,
  }));
}

// Calculate stats
async function getOrderStats() {
  const allOrders = await db.query.orders.findMany();

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
  const shippedOrders = allOrders.filter((o) => o.status === "shipped").length;
  const totalRevenue = allOrders.reduce(
    (sum, o) => sum + parseFloat(o.total),
    0
  );

  return {
    totalOrders,
    pendingOrders,
    shippedOrders,
    totalRevenue,
  };
}

export default async function AdminOrdersPage() {
  await requireAdmin();

  const [ordersData, stats] = await Promise.all([
    getOrdersWithDetails(),
    getOrderStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold terminal-glow">Order Management</h1>
        <p className="text-muted-foreground mt-1">
          Track orders that will absolutely, definitely ship (narrator: they
          won&apos;t)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass border border-border/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2 italic">
            People who trusted us with fake money
          </p>
        </div>

        <div className="glass border border-border/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">
                {stats.pendingOrders}
              </p>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2 italic">
            Patiently waiting for nothing
          </p>
        </div>

        <div className="glass border border-border/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Truck className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">
                &quot;{stats.shippedOrders}&quot;
              </p>
              <p className="text-sm text-muted-foreground">
                &quot;Shipped&quot; Orders
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2 italic">
            Air quotes intentional
          </p>
        </div>

        <div className="glass border border-border/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Package className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                U${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2 italic">
            In completely worthless currency
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass border border-border/20 rounded-lg p-4">
        <OrdersTable orders={ordersData} />
      </div>
    </div>
  );
}
