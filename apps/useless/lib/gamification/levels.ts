// ============================================================================
// LEVEL & XP PROGRESSION SYSTEM
// ============================================================================

export const LEVEL_CONFIG = {
  maxLevel: 100,

  /**
   * Returns the XP required to complete a specific level
   * - Level 1-10: 100 XP each
   * - Level 11-25: 250 XP each
   * - Level 26-50: 500 XP each
   * - Level 51-100: 1000 XP each
   */
  xpPerLevel: (level: number): number => {
    if (level <= 10) return 100;
    if (level <= 25) return 250;
    if (level <= 50) return 500;
    return 1000;
  },
};

/**
 * Ridiculous level title names mapped to level ranges
 */
export const LEVEL_NAMES: Record<string, string> = {
  "1-5": "Useless Novice",
  "6-10": "Aspiring Hoarder",
  "11-15": "Certified Spender",
  "16-20": "Impulse Champion",
  "21-30": "Master of Bad Decisions",
  "31-40": "Grand Waster of Resources",
  "41-50": "Legendary Consumer",
  "51-60": "Mythical Money Pit",
  "61-75": "Transcendent Shopper",
  "76-90": "Cosmic Collector",
  "91-99": "Interdimensional Impulse Buyer",
  "100": "The Useless One",
};

/**
 * Get the title for a specific level
 */
export function getLevelTitle(level: number): string {
  if (level >= 100) return LEVEL_NAMES["100"];
  if (level >= 91) return LEVEL_NAMES["91-99"];
  if (level >= 76) return LEVEL_NAMES["76-90"];
  if (level >= 61) return LEVEL_NAMES["61-75"];
  if (level >= 51) return LEVEL_NAMES["51-60"];
  if (level >= 41) return LEVEL_NAMES["41-50"];
  if (level >= 31) return LEVEL_NAMES["31-40"];
  if (level >= 21) return LEVEL_NAMES["21-30"];
  if (level >= 16) return LEVEL_NAMES["16-20"];
  if (level >= 11) return LEVEL_NAMES["11-15"];
  if (level >= 6) return LEVEL_NAMES["6-10"];
  return LEVEL_NAMES["1-5"];
}

/**
 * Calculate the total XP required to reach a specific level from level 1
 */
export function getTotalXpForLevel(level: number): number {
  if (level <= 1) return 0;

  let totalXp = 0;
  for (let i = 1; i < level; i++) {
    totalXp += LEVEL_CONFIG.xpPerLevel(i);
  }
  return totalXp;
}

/**
 * Calculate the level from total XP
 */
export function getLevelFromXp(totalXp: number): number {
  let level = 1;
  let xpRemaining = totalXp;

  while (level < LEVEL_CONFIG.maxLevel) {
    const xpNeeded = LEVEL_CONFIG.xpPerLevel(level);
    if (xpRemaining < xpNeeded) break;
    xpRemaining -= xpNeeded;
    level++;
  }

  return Math.min(level, LEVEL_CONFIG.maxLevel);
}

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  xpToNextLevel: number;
  progress: number; // 0-100 percentage
  title: string;
  nextTitle: string | null;
}

/**
 * Get comprehensive level information from total XP
 */
export function getLevelInfo(totalXp: number): LevelInfo {
  const level = getLevelFromXp(totalXp);
  const xpAtLevelStart = getTotalXpForLevel(level);
  const currentLevelXp = totalXp - xpAtLevelStart;

  const isMaxLevel = level >= LEVEL_CONFIG.maxLevel;
  const xpToNextLevel = isMaxLevel ? 0 : LEVEL_CONFIG.xpPerLevel(level);
  const progress = isMaxLevel
    ? 100
    : Math.min(100, (currentLevelXp / xpToNextLevel) * 100);

  const title = getLevelTitle(level);
  const nextTitle = isMaxLevel ? null : getLevelTitle(level + 1);

  return {
    level,
    currentLevelXp,
    xpToNextLevel,
    progress,
    title,
    nextTitle,
  };
}

export interface XpSource {
  id: string;
  name: string;
  description: string;
  amount: number | string; // number or description like "10 per $1"
}

/**
 * Get all XP sources with their amounts
 */
export function getXpSources(): XpSource[] {
  return [
    {
      id: "purchase",
      name: "Purchase",
      description: "Earn XP for every dollar spent on useless products",
      amount: "10 XP per $1 spent",
    },
    {
      id: "review",
      name: "Write a Review",
      description: "Share your thoughts on your useless purchases",
      amount: 25,
    },
    {
      id: "daily_claim",
      name: "Daily Claim",
      description: "Log in daily to claim your free UselessBucks",
      amount: 15,
    },
    {
      id: "achievement",
      name: "Achievement Unlock",
      description: "Unlock achievements for bonus XP",
      amount: "10-500 XP (varies)",
    },
    {
      id: "referral",
      name: "Referral",
      description: "Invite a friend to join the uselessness",
      amount: 100,
    },
    {
      id: "profile_completion",
      name: "Profile Completion",
      description: "Complete your profile to earn bonus XP",
      amount: 50,
    },
  ];
}

/**
 * Calculate XP from a purchase amount
 */
export function calculatePurchaseXp(amountSpent: number): number {
  return Math.floor(amountSpent * 10);
}

/**
 * Milestone levels that get special visual treatment
 */
export const MILESTONE_LEVELS = [10, 25, 50, 75, 100] as const;

/**
 * Check if a level is a milestone level
 */
export function isMilestonelevel(level: number): boolean {
  return (MILESTONE_LEVELS as readonly number[]).includes(level);
}

/**
 * Get the color/gradient class for a level badge
 */
export function getLevelBadgeStyle(level: number): {
  gradient: string;
  glow: string;
  border: string;
} {
  if (level >= 100) {
    // The Useless One - Rainbow/prismatic
    return {
      gradient: "from-amber-400 via-rose-400 to-violet-400",
      glow: "shadow-[0_0_30px_rgba(251,191,36,0.6)]",
      border: "border-amber-400/60",
    };
  }
  if (level >= 75) {
    // Cosmic - Purple/pink
    return {
      gradient: "from-violet-400 via-fuchsia-400 to-pink-400",
      glow: "shadow-[0_0_20px_rgba(167,139,250,0.5)]",
      border: "border-violet-400/50",
    };
  }
  if (level >= 50) {
    // Legendary - Gold
    return {
      gradient: "from-amber-300 via-yellow-400 to-orange-400",
      glow: "shadow-[0_0_20px_rgba(251,191,36,0.5)]",
      border: "border-amber-400/50",
    };
  }
  if (level >= 25) {
    // Epic - Blue
    return {
      gradient: "from-blue-400 via-cyan-400 to-teal-400",
      glow: "shadow-[0_0_15px_rgba(56,189,248,0.4)]",
      border: "border-cyan-400/40",
    };
  }
  if (level >= 10) {
    // Rare - Green
    return {
      gradient: "from-emerald-400 via-green-400 to-teal-400",
      glow: "shadow-[0_0_12px_rgba(52,211,153,0.4)]",
      border: "border-emerald-400/40",
    };
  }
  // Common - Default primary
  return {
    gradient: "from-primary/80 to-primary",
    glow: "shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]",
    border: "border-primary/30",
  };
}

/**
 * Ridiculous congratulation messages for leveling up
 */
export const LEVEL_UP_MESSAGES = [
  "You've achieved a new level of uselessness!",
  "Your commitment to wasting money is inspiring!",
  "Another step on your journey to financial ruin!",
  "Your shopping addiction is truly legendary!",
  "You've unlocked new heights of consumerism!",
  "Your wallet weeps, but your XP bar rejoices!",
  "Peak uselessness achieved! Or is there more?",
  "You're making progress! Progress towards what? We don't know!",
  "Your dedication to buying things you don't need is unmatched!",
  "Level up! Your bank account levels down!",
  "Congratulations! You've gotten better at being worse with money!",
  "New level unlocked! New regrets incoming!",
] as const;

/**
 * Get a random level up message
 */
export function getRandomLevelUpMessage(): string {
  return LEVEL_UP_MESSAGES[Math.floor(Math.random() * LEVEL_UP_MESSAGES.length)];
}
