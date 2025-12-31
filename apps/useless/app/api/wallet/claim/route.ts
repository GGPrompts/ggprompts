import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { wallets, walletTransactions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

const DAILY_BONUS = "100.00";
const CLAIM_COOLDOWN_HOURS = 24;

const funMessages = [
  "Here's your daily dose of fake money!",
  "Ka-ching! Another $100 of absolutely nothing!",
  "Congratulations! You're $100 richer in imaginary currency!",
  "Free money! (That you can't actually spend anywhere else)",
  "Your daily allowance of pure, unadulterated nonsense has arrived!",
  "100 UselessBucks deposited! Still completely worthless!",
];

/**
 * POST /api/wallet/claim
 * Claim daily $100 UselessBucks bonus
 */
export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use transaction to ensure atomicity
    const result = await db.transaction(async (tx) => {
      // Get current wallet
      const [wallet] = await tx
        .select()
        .from(wallets)
        .where(eq(wallets.userId, session.user.id))
        .limit(1);

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      // Check if user can claim (24 hours since last claim)
      if (wallet.lastClaimAt) {
        const hoursSinceLastClaim =
          (Date.now() - wallet.lastClaimAt.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastClaim < CLAIM_COOLDOWN_HOURS) {
          const hoursRemaining = Math.ceil(
            CLAIM_COOLDOWN_HOURS - hoursSinceLastClaim
          );
          const minutesRemaining = Math.ceil(
            (CLAIM_COOLDOWN_HOURS - hoursSinceLastClaim) * 60
          );

          return {
            success: false,
            error: "Already claimed within 24 hours",
            hoursRemaining,
            minutesRemaining,
            nextClaimAt: new Date(
              wallet.lastClaimAt.getTime() + CLAIM_COOLDOWN_HOURS * 60 * 60 * 1000
            ).toISOString(),
          };
        }
      }

      // Add bonus to balance
      const newBalance = (parseFloat(wallet.balance) + parseFloat(DAILY_BONUS))
        .toFixed(2);

      // Update wallet
      await tx
        .update(wallets)
        .set({
          balance: newBalance,
          lastClaimAt: sql`CURRENT_TIMESTAMP`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(wallets.userId, session.user.id));

      // Create transaction record
      await tx.insert(walletTransactions).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        amount: DAILY_BONUS,
        type: "daily_claim",
        description: "Daily claim bonus",
      });

      return {
        success: true,
        newBalance,
        bonus: DAILY_BONUS,
      };
    });

    // Handle cooldown error
    if ("error" in result) {
      return NextResponse.json(
        {
          error: result.error,
          hoursRemaining: result.hoursRemaining,
          minutesRemaining: result.minutesRemaining,
          nextClaimAt: result.nextClaimAt,
        },
        { status: 400 }
      );
    }

    // Return success with fun message
    const randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];

    return NextResponse.json({
      success: true,
      balance: result.newBalance,
      bonus: result.bonus,
      message: randomMessage,
    });
  } catch (error) {
    console.error("Error claiming daily bonus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
