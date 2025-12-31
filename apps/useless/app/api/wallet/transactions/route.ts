import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { walletTransactions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * GET /api/wallet/transactions
 * Get user's wallet transaction history (last 50 transactions)
 */
export async function GET(request: NextRequest) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query transactions for current user
    const transactions = await db
      .select({
        id: walletTransactions.id,
        amount: walletTransactions.amount,
        type: walletTransactions.type,
        description: walletTransactions.description,
        orderId: walletTransactions.orderId,
        createdAt: walletTransactions.createdAt,
      })
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, session.user.id))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(50);

    // Format the response
    const formattedTransactions = transactions.map((tx) => ({
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      description: tx.description || null,
      orderId: tx.orderId || null,
      createdAt: tx.createdAt.toISOString(),
    }));

    return NextResponse.json({
      transactions: formattedTransactions,
      count: formattedTransactions.length,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
