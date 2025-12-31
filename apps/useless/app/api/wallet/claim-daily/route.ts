import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { wallets, walletTransactions, userAchievements } from "@/lib/db/schema";
import { eq, sql, desc, and } from "drizzle-orm";
import { headers } from "next/headers";
import {
  getStreakStatus,
  calculateStreakReward,
  STREAK_CONFIG,
} from "@/lib/gamification/streaks";

/**
 * Calculate the current streak by looking at consecutive daily_claim transactions
 */
async function calculateCurrentStreak(userId: string): Promise<number> {
  // Get the last 365 daily_claim transactions ordered by date descending
  const recentClaims = await db
    .select({ createdAt: walletTransactions.createdAt })
    .from(walletTransactions)
    .where(
      and(
        eq(walletTransactions.userId, userId),
        eq(walletTransactions.type, "daily_claim")
      )
    )
    .orderBy(desc(walletTransactions.createdAt))
    .limit(STREAK_CONFIG.maxStreak);

  if (recentClaims.length === 0) {
    return 0;
  }

  // Calculate streak by checking consecutive days
  let streak = 0;
  const now = new Date();
  let expectedDate = new Date(now);
  expectedDate.setHours(0, 0, 0, 0);

  for (const claim of recentClaims) {
    const claimDate = new Date(claim.createdAt);
    claimDate.setHours(0, 0, 0, 0);

    // For the first claim, check if it's today or yesterday
    if (streak === 0) {
      const daysDiff = Math.floor(
        (expectedDate.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // If last claim was more than 1 day ago, streak is broken
      if (daysDiff > 1) {
        return 0;
      }

      streak = 1;
      expectedDate = new Date(claimDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
      continue;
    }

    // Check if this claim is on the expected date (previous day)
    const daysDiff = Math.floor(
      (expectedDate.getTime() - claimDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Allow for same day (multiple pageloads) or exactly previous day
    if (daysDiff === 0) {
      // Same day, continue checking
      continue;
    } else if (daysDiff === 1 || (expectedDate.getTime() === claimDate.getTime())) {
      // Consecutive day
      streak++;
      expectedDate = new Date(claimDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      // Gap in streak, stop counting
      break;
    }
  }

  return Math.min(streak, STREAK_CONFIG.maxStreak);
}

/**
 * POST /api/wallet/claim-daily
 * Claim daily UselessBucks bonus with streak system
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

      // Calculate current streak from transaction history
      const currentStreak = await calculateCurrentStreak(session.user.id);

      // Get streak status
      const streakStatus = getStreakStatus(wallet.lastClaimAt, currentStreak);

      // Check if user can claim
      if (!streakStatus.canClaim) {
        const nextClaimAt = streakStatus.nextClaimAt;
        const hoursRemaining = nextClaimAt
          ? Math.ceil(
              (nextClaimAt.getTime() - Date.now()) / (1000 * 60 * 60)
            )
          : 0;
        const minutesRemaining = nextClaimAt
          ? Math.ceil(
              (nextClaimAt.getTime() - Date.now()) / (1000 * 60)
            )
          : 0;

        return {
          success: false,
          error: "Already claimed today! Come back tomorrow.",
          hoursRemaining,
          minutesRemaining,
          nextClaimAt: nextClaimAt?.toISOString(),
          streak: currentStreak,
        };
      }

      // Calculate the new streak (increment if continuing, or 1 if starting fresh)
      const newStreak =
        streakStatus.currentStreak > 0 ? streakStatus.currentStreak + 1 : 1;

      // Calculate reward based on new streak
      const reward = calculateStreakReward(newStreak);
      const claimAmount = reward.totalReward.toFixed(2);

      // Add bonus to balance
      const newBalance = (
        parseFloat(wallet.balance) + reward.totalReward
      ).toFixed(2);

      // Update wallet
      await tx
        .update(wallets)
        .set({
          balance: newBalance,
          lastClaimAt: sql`CURRENT_TIMESTAMP`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(wallets.userId, session.user.id));

      // Create transaction record with streak info in description
      await tx.insert(walletTransactions).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        amount: claimAmount,
        type: "daily_claim",
        description: `Day ${newStreak} streak claim${reward.multiplier > 1 ? ` (${reward.multiplier}x bonus)` : ""}${reward.milestoneHit ? ` - ${reward.milestoneHit.name} milestone!` : ""}`,
      });

      // Check for streak achievement unlocks
      const achievementsToUnlock: string[] = [];
      for (const milestone of STREAK_CONFIG.streakMilestones) {
        if (newStreak === milestone.days) {
          achievementsToUnlock.push(milestone.achievementType);
        }
      }

      // Unlock achievements if any
      if (achievementsToUnlock.length > 0) {
        for (const achievementType of achievementsToUnlock) {
          // Check if already unlocked
          const existing = await tx
            .select()
            .from(userAchievements)
            .where(
              and(
                eq(userAchievements.userId, session.user.id),
                eq(userAchievements.achievementType, achievementType)
              )
            )
            .limit(1);

          if (existing.length === 0) {
            await tx.insert(userAchievements).values({
              id: crypto.randomUUID(),
              userId: session.user.id,
              achievementType,
            });
          }
        }
      }

      return {
        success: true,
        newBalance,
        amount: reward.totalReward,
        streak: newStreak,
        multiplier: reward.multiplier,
        message: reward.bonusMessage,
        milestoneHit: reward.milestoneHit,
      };
    });

    // Handle cooldown error
    if ("error" in result && !result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          hoursRemaining: result.hoursRemaining,
          minutesRemaining: result.minutesRemaining,
          nextClaimAt: result.nextClaimAt,
          streak: result.streak,
        },
        { status: 400 }
      );
    }

    // Return success
    return NextResponse.json({
      success: true,
      newBalance: result.newBalance,
      amount: result.amount,
      streak: result.streak,
      multiplier: result.multiplier,
      message: result.message,
      milestoneHit: result.milestoneHit,
    });
  } catch (error) {
    console.error("Error claiming daily bonus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/wallet/claim-daily
 * Get current streak status without claiming
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

    // Get current wallet
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, session.user.id))
      .limit(1);

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    // Calculate current streak
    const currentStreak = await calculateCurrentStreak(session.user.id);

    // Get streak status
    const streakStatus = getStreakStatus(wallet.lastClaimAt, currentStreak);

    // Calculate potential reward
    const potentialReward = calculateStreakReward(
      streakStatus.canClaim ? currentStreak + 1 : currentStreak
    );

    return NextResponse.json({
      currentStreak,
      canClaim: streakStatus.canClaim,
      nextClaimAt: streakStatus.nextClaimAt?.toISOString() || null,
      hoursUntilReset: streakStatus.hoursUntilReset,
      potentialReward: potentialReward.totalReward,
      multiplier: potentialReward.multiplier,
      lastClaimAt: wallet.lastClaimAt?.toISOString() || null,
    });
  } catch (error) {
    console.error("Error getting streak status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
