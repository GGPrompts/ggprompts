import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc, sql, sum, count } from "drizzle-orm";

/**
 * GET /api/account/profile
 * Get current user's profile with satirical stats
 */
export async function GET(request: NextRequest) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user details
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch wallet
    const [wallet] = await db
      .select()
      .from(schema.wallets)
      .where(eq(schema.wallets.userId, userId))
      .limit(1);

    // Fetch achievements
    const achievements = await db
      .select()
      .from(schema.userAchievements)
      .where(eq(schema.userAchievements.userId, userId));

    // Fetch order stats
    const orders = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.userId, userId));

    // Calculate total spent (money wasted)
    const totalSpent = orders.reduce(
      (acc, order) => acc + parseFloat(order.total),
      0
    );

    // Count total items purchased
    const orderIds = orders.map((o) => o.id);
    let totalItemsPurchased = 0;
    if (orderIds.length > 0) {
      const itemCounts = await db
        .select({ totalQty: sum(schema.orderItems.quantity) })
        .from(schema.orderItems)
        .where(
          sql`${schema.orderItems.orderId} IN ${orderIds.length > 0 ? sql`(${sql.join(orderIds.map(id => sql`${id}`), sql`, `)})` : sql`(NULL)`}`
        );
      totalItemsPurchased = Number(itemCounts[0]?.totalQty) || 0;
    }

    // Fetch review count
    const [reviewCount] = await db
      .select({ count: count() })
      .from(schema.reviews)
      .where(eq(schema.reviews.userId, userId));

    // Fetch recent orders (last 5)
    const recentOrders = await db.query.orders.findMany({
      where: eq(schema.orders.userId, userId),
      orderBy: [desc(schema.orders.createdAt)],
      limit: 5,
      with: {
        items: true,
      },
    });

    // Calculate "time wasted" based on account age and orders
    const accountAgeMs = Date.now() - new Date(user.createdAt).getTime();
    const accountAgeDays = Math.floor(accountAgeMs / (1000 * 60 * 60 * 24));
    const estimatedBrowsingHours = Math.floor(
      accountAgeDays * 0.5 + orders.length * 2
    );

    // Calculate regret level (satirical formula)
    const regretLevel = Math.min(
      100,
      Math.floor((totalSpent / 10) + (totalItemsPurchased * 5) + (accountAgeDays * 0.1))
    );

    // Buyer's remorse score (based on multiple factors)
    const buyersRemorseScore = Math.min(
      999,
      Math.floor(
        totalSpent * 0.5 +
        totalItemsPurchased * 10 +
        (reviewCount.count || 0) * 3 +
        accountAgeDays * 0.2
      )
    );

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt.toISOString(),
      },
      wallet: wallet
        ? {
            balance: wallet.balance,
            lastClaimAt: wallet.lastClaimAt?.toISOString() || null,
          }
        : null,
      stats: {
        totalMoneyWasted: totalSpent.toFixed(2),
        itemsRegretted: totalItemsPurchased,
        ordersPlaced: orders.length,
        reviewsWritten: reviewCount.count || 0,
        timeWastedHours: estimatedBrowsingHours,
        regretLevel: regretLevel,
        buyersRemorseScore: buyersRemorseScore,
        accountAgeDays: accountAgeDays,
      },
      achievements: achievements.map((a) => ({
        type: a.achievementType,
        unlockedAt: a.unlockedAt.toISOString(),
      })),
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        total: order.total,
        status: order.status,
        itemCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
        createdAt: order.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
