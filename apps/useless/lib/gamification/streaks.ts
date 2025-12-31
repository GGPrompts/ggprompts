/**
 * Daily Login Streak System
 *
 * A gloriously absurd system for rewarding users who return daily
 * to claim their worthless virtual currency.
 */

// Streak configuration
export const STREAK_CONFIG = {
  /** Base UselessBucks awarded per daily claim */
  baseReward: 10,

  /** Multipliers applied at different streak thresholds */
  streakMultipliers: {
    3: 1.5, // 3+ days = 1.5x
    7: 2, // 7+ days = 2x
    14: 2.5, // 14+ days = 2.5x
    30: 3, // 30+ days = 3x
    60: 4, // 60+ days = 4x
    100: 5, // 100+ days = 5x
  } as Record<number, number>,

  /** Maximum streak count (one full year of dedication to nothing) */
  maxStreak: 365,

  /** Milestone rewards and achievements */
  streakMilestones: [
    {
      days: 7,
      name: "Week Warrior",
      description: "You've wasted a whole week!",
      bonusReward: 50,
      achievementType: "streak_7",
    },
    {
      days: 30,
      name: "Monthly Menace",
      description: "A month of mayhem",
      bonusReward: 200,
      achievementType: "streak_30",
    },
    {
      days: 60,
      name: "Bi-Monthly Beast",
      description: "Two months of dedication to nothing",
      bonusReward: 500,
      achievementType: "streak_60",
    },
    {
      days: 100,
      name: "Centurion of Chaos",
      description: "100 days. No turning back.",
      bonusReward: 1000,
      achievementType: "streak_100",
    },
    {
      days: 365,
      name: "Annual Anomaly",
      description: "A full year?! Touch grass.",
      bonusReward: 5000,
      achievementType: "streak_365",
    },
  ],
} as const;

// Ridiculous streak messages by day count
const STREAK_MESSAGES: Record<number, string> = {
  1: "Showing up is half the battle. The other half is spending money.",
  2: "Back for more? Your dedication to uselessness is admirable.",
  3: "Three days! You're building habits. Bad ones, but habits nonetheless.",
  4: "Four days of commitment. Your future therapist will hear about this.",
  5: "Five days! Almost a work week of pure nonsense.",
  6: "Six days strong. Tomorrow is the big one!",
  7: "A week of dedication! Your wallet weeps.",
  14: "Two weeks! You could have learned a new skill. Instead, you're here.",
  21: "Three weeks! Science says habits form in 21 days. You're officially addicted.",
  30: "30 days?! You might have a problem. Here's more fake money.",
  45: "45 days. Your commitment to nothing is genuinely impressive.",
  60: "Two months! You've outlasted most New Year's resolutions.",
  75: "75 days! You're three-quarters of the way to absolute madness.",
  90: "90 days! A full quarter of the year spent clicking a button.",
  100: "100 days. You're officially obsessed. Seek help. But first, here's a bonus.",
  150: "150 days! You've spent almost half a year doing this. Incredible.",
  200: "200 days! Your persistence is both impressive and concerning.",
  250: "250 days! You can see the finish line. It's just as meaningless as the start.",
  300: "300 days! 65 more days until you've achieved absolutely nothing for a year.",
  365: "365 DAYS! A FULL YEAR! You've peaked. It's all downhill from here. Touch grass.",
};

// Fallback messages for days without specific messages
const FALLBACK_MESSAGES = [
  "Another day, another fake dollar. Living the dream!",
  "You came back! The void acknowledges your presence.",
  "Consistency is key. Key to what? Who knows!",
  "Your streak grows stronger. Your bank account? Not so much.",
  "The UselessBucks flow through you. Feel their worthlessness.",
  "Impressive! Your commitment to meaninglessness is unmatched.",
  "Day after day, you return. The algorithm is pleased.",
  "Your streak is your legacy. A legacy of clicking buttons.",
  "The more you claim, the more meaningless it becomes. Keep going!",
  "You're not just a user. You're a streak machine.",
];

export interface StreakStatus {
  /** Current streak count (consecutive days) */
  currentStreak: number;
  /** Whether the user can claim today */
  canClaim: boolean;
  /** When the next claim becomes available (null if can claim now) */
  nextClaimAt: Date | null;
  /** Hours until streak resets if user doesn't claim */
  hoursUntilReset: number;
}

export interface StreakReward {
  /** Base reward amount */
  baseReward: number;
  /** Multiplier applied based on streak */
  multiplier: number;
  /** Total reward (base * multiplier) */
  totalReward: number;
  /** Fun message for the user */
  bonusMessage: string;
  /** Whether a milestone was hit */
  milestoneHit?: {
    name: string;
    description: string;
    bonusReward: number;
  };
}

/**
 * Calculate the current streak status based on last claim time
 *
 * Streak rules:
 * - Users must claim within 24-48 hours of their last claim to maintain streak
 * - If they claim within 24 hours, they're told to wait
 * - If they wait more than 48 hours, streak resets
 */
export function getStreakStatus(
  lastClaimAt: Date | null,
  currentStreak: number = 0
): StreakStatus {
  const now = new Date();

  // First-time claimer
  if (!lastClaimAt) {
    return {
      currentStreak: 0,
      canClaim: true,
      nextClaimAt: null,
      hoursUntilReset: 48, // They have 48 hours to start their streak
    };
  }

  const hoursSinceLastClaim =
    (now.getTime() - lastClaimAt.getTime()) / (1000 * 60 * 60);

  // Too early - must wait 24 hours between claims
  if (hoursSinceLastClaim < 24) {
    const nextClaimTime = new Date(lastClaimAt.getTime() + 24 * 60 * 60 * 1000);
    return {
      currentStreak,
      canClaim: false,
      nextClaimAt: nextClaimTime,
      hoursUntilReset: Math.max(0, 48 - hoursSinceLastClaim),
    };
  }

  // Within the valid claim window (24-48 hours)
  if (hoursSinceLastClaim <= 48) {
    return {
      currentStreak,
      canClaim: true,
      nextClaimAt: null,
      hoursUntilReset: Math.max(0, 48 - hoursSinceLastClaim),
    };
  }

  // Too late - streak has reset
  return {
    currentStreak: 0, // Streak resets
    canClaim: true,
    nextClaimAt: null,
    hoursUntilReset: 48,
  };
}

/**
 * Get the streak multiplier for a given streak count
 */
export function getStreakMultiplier(streak: number): number {
  const thresholds = Object.keys(STREAK_CONFIG.streakMultipliers)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of thresholds) {
    if (streak >= threshold) {
      return STREAK_CONFIG.streakMultipliers[threshold];
    }
  }

  return 1; // No multiplier for streaks below 3
}

/**
 * Calculate the reward for a daily claim based on current streak
 */
export function calculateStreakReward(streak: number): StreakReward {
  const multiplier = getStreakMultiplier(streak);
  const baseReward = STREAK_CONFIG.baseReward;
  const totalReward = Math.round(baseReward * multiplier);

  // Get the appropriate message
  let bonusMessage =
    STREAK_MESSAGES[streak] ||
    FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];

  // Add multiplier info to message if applicable
  if (multiplier > 1) {
    bonusMessage += ` (${multiplier}x streak bonus!)`;
  }

  // Check for milestone
  const milestone = STREAK_CONFIG.streakMilestones.find(
    (m) => m.days === streak
  );

  return {
    baseReward,
    multiplier,
    totalReward: milestone ? totalReward + milestone.bonusReward : totalReward,
    bonusMessage,
    milestoneHit: milestone
      ? {
          name: milestone.name,
          description: milestone.description,
          bonusReward: milestone.bonusReward,
        }
      : undefined,
  };
}

/**
 * Get the next milestone for a given streak count
 */
export function getNextMilestone(
  currentStreak: number
): (typeof STREAK_CONFIG.streakMilestones)[number] | null {
  return (
    STREAK_CONFIG.streakMilestones.find((m) => m.days > currentStreak) || null
  );
}

/**
 * Calculate progress to the next milestone (0-100)
 */
export function getMilestoneProgress(currentStreak: number): {
  progress: number;
  daysToNext: number;
  nextMilestone: (typeof STREAK_CONFIG.streakMilestones)[number] | null;
  previousMilestone: (typeof STREAK_CONFIG.streakMilestones)[number] | null;
} {
  const nextMilestone = getNextMilestone(currentStreak);

  if (!nextMilestone) {
    // Already at max milestone
    return {
      progress: 100,
      daysToNext: 0,
      nextMilestone: null,
      previousMilestone:
        STREAK_CONFIG.streakMilestones[
          STREAK_CONFIG.streakMilestones.length - 1
        ],
    };
  }

  // Find the previous milestone
  const previousMilestoneIndex =
    STREAK_CONFIG.streakMilestones.indexOf(nextMilestone) - 1;
  const previousMilestone =
    previousMilestoneIndex >= 0
      ? STREAK_CONFIG.streakMilestones[previousMilestoneIndex]
      : null;

  const startDays = previousMilestone?.days || 0;
  const endDays = nextMilestone.days;
  const daysInRange = endDays - startDays;
  const progressDays = currentStreak - startDays;

  return {
    progress: Math.min(100, Math.round((progressDays / daysInRange) * 100)),
    daysToNext: endDays - currentStreak,
    nextMilestone,
    previousMilestone,
  };
}

/**
 * Format time remaining until next claim
 */
export function formatTimeUntilClaim(nextClaimAt: Date): string {
  const now = new Date();
  const diffMs = nextClaimAt.getTime() - now.getTime();

  if (diffMs <= 0) return "Available now!";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
