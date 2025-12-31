import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { users, products, orders, wallets, userAchievements } from "@/lib/db/schema";
import { count, sum, desc, sql } from "drizzle-orm";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Brain,
  AlertTriangle,
  Activity,
  Server,
  Database,
  Cpu,
  Wifi,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@ggprompts/ui";
import { Badge } from "@ggprompts/ui";
import { AdminOrdersChart } from "./AdminOrdersChart";
import { CrisisButton } from "./CrisisButton";

// Fetch all stats from database
async function getAdminStats() {
  const [
    usersResult,
    productsResult,
    ordersResult,
    revenueResult,
    achievementsResult,
    recentOrders,
  ] = await Promise.all([
    // Total users
    db.select({ count: count() }).from(users),
    // Total products
    db.select({ count: count() }).from(products),
    // Total orders
    db.select({ count: count() }).from(orders),
    // Total "revenue" (sum of order totals)
    db.select({ total: sum(orders.total) }).from(orders),
    // Total achievements unlocked
    db.select({ count: count() }).from(userAchievements),
    // Recent 5 orders with user info
    db.query.orders.findMany({
      limit: 5,
      orderBy: [desc(orders.createdAt)],
      with: {
        user: true,
      },
    }),
  ]);

  return {
    totalUsers: usersResult[0]?.count ?? 0,
    totalProducts: productsResult[0]?.count ?? 0,
    totalOrders: ordersResult[0]?.count ?? 0,
    totalRevenue: revenueResult[0]?.total ?? "0",
    totalAchievements: achievementsResult[0]?.count ?? 0,
    recentOrders,
  };
}

export default async function AdminDashboardPage() {
  await requireAdmin();

  const stats = await getAdminStats();

  // Satirical AI insights
  const aiInsights = [
    {
      prediction: "Our AI predicts 0% chance of any product being real",
      confidence: "100% confident (the AI is also imaginary)",
      icon: Brain,
    },
    {
      prediction: "Customer satisfaction: Immeasurable (we didn't measure it)",
      confidence: "Error: Satisfaction.exe not found",
      icon: TrendingUp,
    },
    {
      prediction: "Probability of shipping: undefined",
      confidence: "NaN% certainty",
      icon: Package,
    },
    {
      prediction: "Estimated delivery time: Heat death of the universe",
      confidence: "Give or take a few billion years",
      icon: Clock,
    },
  ];

  // Fake system health metrics (all perfect because nothing runs)
  const systemHealth = [
    { name: "Server Uptime", value: "100%", status: "optimal", icon: Server, note: "No servers to crash" },
    { name: "Database Load", value: "0%", status: "optimal", icon: Database, note: "Nobody queries fake data" },
    { name: "CPU Usage", value: "0.001%", status: "optimal", icon: Cpu, note: "Running on hopes and dreams" },
    { name: "Network Traffic", value: "Perfect", status: "optimal", icon: Wifi, note: "Vibes are strong" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold terminal-glow">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, Supreme Overlord. Here are your useless metrics.
          </p>
        </div>
        <CrisisButton />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border border-border/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gullible Customers
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              People who trust us with fake money
            </p>
          </CardContent>
        </Card>

        <Card className="glass border border-border/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Useless Products Sold
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              None shipped, obviously
            </p>
          </CardContent>
        </Card>

        <Card className="glass border border-border/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fake Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(stats.totalRevenue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              UselessBucks (worth nothing)
            </p>
          </CardContent>
        </Card>

        <Card className="glass border border-border/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products We'll Never Make
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Imaginary inventory status: Full
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders Chart */}
        <Card className="glass border border-border/20 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Order Activity
            </CardTitle>
            <CardDescription>
              Tracking purchases that will never be fulfilled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminOrdersChart />
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        <Card className="glass border border-border/20 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                AI Insights
              </CardTitle>
              <Badge variant="outline" className="border-purple-400/30 text-purple-400">
                <Zap className="h-3 w-3 mr-1" />
                Powered by Nothing
              </Badge>
            </div>
            <CardDescription>
              Our non-existent AI has analyzed your non-existent data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div
                  key={index}
                  className="glass border border-border/20 rounded-lg p-3 space-y-1"
                >
                  <div className="flex items-start gap-2">
                    <Icon className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{insight.prediction}</p>
                      <p className="text-xs text-muted-foreground">{insight.confidence}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="glass border border-border/20 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              The last 5 orders we definitely won't fulfill
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No orders yet. The scam hasn't started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between glass border border-border/20 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {order.user?.name || order.user?.email || "Anonymous Sucker"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Order #{order.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-yellow-400">
                        ${parseFloat(order.total).toFixed(2)}
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          order.status === "pending"
                            ? "border-yellow-400/30 text-yellow-400"
                            : order.status === "confirmed"
                            ? "border-blue-400/30 text-blue-400"
                            : "border-primary/30 text-primary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="glass border border-border/20 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-green-400" />
                System Health
              </CardTitle>
              <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                All Systems Nominal
              </Badge>
            </div>
            <CardDescription>
              Everything works perfectly because nothing actually runs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {systemHealth.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.name}
                    className="glass border border-border/20 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-muted-foreground">{metric.name}</span>
                    </div>
                    <p className="text-lg font-bold text-green-400">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{metric.note}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Warning Banner */}
      <Card className="glass border border-yellow-400/30 bg-yellow-400/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-400">Serious Business Alert</p>
              <p className="text-sm text-muted-foreground">
                Remember: We're running a completely legitimate business selling products that definitely exist.
                Any resemblance to an elaborate joke is purely coincidental.
                Achievements unlocked so far: {stats.totalAchievements}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
