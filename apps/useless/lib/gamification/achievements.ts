import { achievementTypes } from "@/lib/db/schema";

// Achievement type derived from schema
export type AchievementType = (typeof achievementTypes)[number];

// Achievement category types
export type AchievementCategory = "shopping" | "engagement" | "social" | "special";

// Achievement definition interface
export interface AchievementDefinition {
  id: AchievementType;
  title: string;
  description: string;
  emoji: string;
  icon: string; // Lucide icon name
  rarity: number; // percentage (1-100) of users who typically have this
  requirement: string;
  xpReward: number; // 10-500 based on difficulty
  uselessBucksReward: number; // 0-100
  category: AchievementCategory;
}

/**
 * ACHIEVEMENT_DEFINITIONS
 *
 * A comprehensive collection of ridiculous, satirical achievements
 * that mock the very concept of gamification in e-commerce.
 *
 * Each achievement is designed to be absurd while still being technically
 * trackable and achievable within the Useless.io ecosystem.
 */
export const ACHIEVEMENT_DEFINITIONS: Record<AchievementType, AchievementDefinition> = {
  // ============================================================================
  // ORIGINAL ACHIEVEMENTS (with enhanced definitions)
  // ============================================================================

  first_purchase: {
    id: "first_purchase",
    title: "Impulse Control Issues",
    description: "Congratulations on your first regrettable purchase! Your wallet's journey of suffering has officially begun. There's no turning back now.",
    emoji: "🛒",
    icon: "ShoppingCart",
    rarity: 78,
    requirement: "Make your first purchase",
    xpReward: 50,
    uselessBucksReward: 10,
    category: "shopping",
  },

  big_spender: {
    id: "big_spender",
    title: "Money Pit Pioneer",
    description: "You've spent over $500 on useless items. Your financial advisor would weep. Your therapist is taking notes. We're impressed.",
    emoji: "💸",
    icon: "Banknote",
    rarity: 23,
    requirement: "Spend $500+ total on UselessBucks",
    xpReward: 200,
    uselessBucksReward: 50,
    category: "shopping",
  },

  review_king: {
    id: "review_king",
    title: "Professional Complainer",
    description: "Left 10+ reviews. The world desperately needed your hot takes on products that literally do nothing. Thank you for your service.",
    emoji: "⭐",
    icon: "MessageSquare",
    rarity: 12,
    requirement: "Write 10+ product reviews",
    xpReward: 150,
    uselessBucksReward: 30,
    category: "engagement",
  },

  early_adopter: {
    id: "early_adopter",
    title: "Beta Tester of Regret",
    description: "You bought something within the first week of launch. Brave, foolish, or just really bad at waiting for reviews? We'll never tell.",
    emoji: "🧪",
    icon: "FlaskConical",
    rarity: 5,
    requirement: "Purchase a product within launch week",
    xpReward: 100,
    uselessBucksReward: 25,
    category: "special",
  },

  collector: {
    id: "collector",
    title: "Hoarder's Delight",
    description: "You own 20+ different useless items. Your closet is crying. Your storage unit is at capacity. Marie Kondo has given up on you.",
    emoji: "📦",
    icon: "Package",
    rarity: 8,
    requirement: "Purchase 20+ unique products",
    xpReward: 250,
    uselessBucksReward: 40,
    category: "shopping",
  },

  loyal_customer: {
    id: "loyal_customer",
    title: "Stockholm Syndrome",
    description: "You keep coming back for more. Month after month. You know this is a problem, right? Help is available. Just not here.",
    emoji: "🔄",
    icon: "RefreshCw",
    rarity: 15,
    requirement: "Make purchases in 3+ different months",
    xpReward: 175,
    uselessBucksReward: 35,
    category: "engagement",
  },

  // ============================================================================
  // NEW RIDICULOUS ACHIEVEMENTS
  // ============================================================================

  commitment_issues: {
    id: "commitment_issues",
    title: "Commitment Issues",
    description: "You added things to your cart but couldn't seal the deal. Classic commitment-phobe behavior. The items are still waiting, growing cold and lonely.",
    emoji: "💔",
    icon: "HeartCrack",
    rarity: 65,
    requirement: "Add an item to cart but never complete the purchase",
    xpReward: 25,
    uselessBucksReward: 5,
    category: "shopping",
  },

  window_shopper: {
    id: "window_shopper",
    title: "Professional Window Shopper",
    description: "50 products viewed, 0 bought. Are you just here for the vibes? The aesthetic? The existential dread of unfulfilled consumerism?",
    emoji: "👀",
    icon: "Eye",
    rarity: 45,
    requirement: "View 50+ products without making a purchase",
    xpReward: 30,
    uselessBucksReward: 0,
    category: "engagement",
  },

  impulse_control: {
    id: "impulse_control",
    title: "Zero Impulse Control",
    description: "You bought something within 10 seconds of seeing it. We're both impressed and deeply concerned. This is speed shopping at its finest.",
    emoji: "⚡",
    icon: "Zap",
    rarity: 18,
    requirement: "Complete a purchase within 10 seconds of viewing the product",
    xpReward: 75,
    uselessBucksReward: 15,
    category: "special",
  },

  professional_procrastinator: {
    id: "professional_procrastinator",
    title: "Professional Procrastinator",
    description: "You ghosted us for 30 days then came crawling back. We missed you. Actually, no we didn't. But your wallet sure did miss us.",
    emoji: "🦥",
    icon: "Clock",
    rarity: 35,
    requirement: "Return after 30+ days of inactivity",
    xpReward: 40,
    uselessBucksReward: 20,
    category: "engagement",
  },

  whale_watcher: {
    id: "whale_watcher",
    title: "Whale Status Achieved",
    description: "Over $10,000 in UselessBucks spent. You're not a customer anymore, you're a marine mammal. We've named a conference room after you.",
    emoji: "🐋",
    icon: "Fish",
    rarity: 2,
    requirement: "Spend over $10,000 total in UselessBucks",
    xpReward: 500,
    uselessBucksReward: 100,
    category: "shopping",
  },

  midnight_shopper: {
    id: "midnight_shopper",
    title: "3am Life Decisions",
    description: "You made a purchase between 2-4am. Bad decisions don't sleep, and neither do you apparently. Are you okay? (Rhetorical question)",
    emoji: "🌙",
    icon: "Moon",
    rarity: 28,
    requirement: "Complete a purchase between 2:00 AM and 4:00 AM",
    xpReward: 60,
    uselessBucksReward: 15,
    category: "special",
  },

  serial_returner: {
    id: "serial_returner",
    title: "Serial Refunder",
    description: "5+ refund requests. You're the reason we can't have nice things. Actually, we never had nice things. That's our whole brand.",
    emoji: "↩️",
    icon: "Undo2",
    rarity: 10,
    requirement: "Request 5+ refunds",
    xpReward: 35,
    uselessBucksReward: 0,
    category: "shopping",
  },

  review_novelist: {
    id: "review_novelist",
    title: "The Great American Reviewer",
    description: "You wrote a review over 500 words. For a useless product. Someone had feelings, and that someone was you. We're touched, genuinely.",
    emoji: "📝",
    icon: "FileText",
    rarity: 6,
    requirement: "Write a single review with 500+ words",
    xpReward: 125,
    uselessBucksReward: 25,
    category: "engagement",
  },

  nitpicker: {
    id: "nitpicker",
    title: "Chaotic Agent of Disagreement",
    description: "You gave a 1-star review to a 5-star rated product. You just want to watch the world burn, don't you? Respect.",
    emoji: "🔥",
    icon: "Flame",
    rarity: 8,
    requirement: "Give a 1-star review to a product with 5-star average rating",
    xpReward: 45,
    uselessBucksReward: 10,
    category: "engagement",
  },

  hype_beast: {
    id: "hype_beast",
    title: "Day One Victim",
    description: "You bought something the exact day it launched. Before reviews. Before sanity. Your FOMO is our revenue. Thank you for your sacrifice.",
    emoji: "🔥",
    icon: "Rocket",
    rarity: 7,
    requirement: "Purchase a product on its launch day",
    xpReward: 85,
    uselessBucksReward: 20,
    category: "special",
  },

  indecisive: {
    id: "indecisive",
    title: "Analysis Paralysis",
    description: "You modified your cart 10+ times before checking out. Add, remove, add, remove... The cart is dizzy. YOU are dizzy. Just buy it already.",
    emoji: "🤔",
    icon: "Shuffle",
    rarity: 22,
    requirement: "Modify cart contents 10+ times before checkout",
    xpReward: 55,
    uselessBucksReward: 10,
    category: "shopping",
  },

  completionist: {
    id: "completionist",
    title: "Achievement Hunter",
    description: "You've unlocked 20+ achievements. You're not shopping anymore, you're playing a meta-game. We see you. We fear you. We respect you.",
    emoji: "🏆",
    icon: "Award",
    rarity: 3,
    requirement: "Unlock 20+ achievements",
    xpReward: 300,
    uselessBucksReward: 75,
    category: "special",
  },

  ghost: {
    id: "ghost",
    title: "The Phantom Account",
    description: "Created an account, then vanished into the void for 60 days. You're a digital ghost. A legend. A cautionary tale about email marketing.",
    emoji: "👻",
    icon: "Ghost",
    rarity: 40,
    requirement: "Create account but don't log back in for 60+ days",
    xpReward: 20,
    uselessBucksReward: 5,
    category: "engagement",
  },

  social_butterfly: {
    id: "social_butterfly",
    title: "Enabler-in-Chief",
    description: "You've referred 3+ friends. You're not just making bad decisions, you're recruiting others to join you. That's either friendship or a pyramid scheme.",
    emoji: "🦋",
    icon: "Users",
    rarity: 12,
    requirement: "Successfully refer 3+ friends who make purchases",
    xpReward: 200,
    uselessBucksReward: 50,
    category: "social",
  },

  bargain_hunter: {
    id: "bargain_hunter",
    title: "Discount Goblin",
    description: "You've only ever bought items on sale. Never full price. Not once. Your frugality with useless items is... actually kind of admirable?",
    emoji: "🏷️",
    icon: "Tag",
    rarity: 15,
    requirement: "Only purchase items that are on sale (minimum 5 purchases)",
    xpReward: 80,
    uselessBucksReward: 20,
    category: "shopping",
  },
};

// Helper function to get achievement by ID
export function getAchievementById(id: AchievementType): AchievementDefinition {
  return ACHIEVEMENT_DEFINITIONS[id];
}

// Helper function to get all achievements by category
export function getAchievementsByCategory(category: AchievementCategory): AchievementDefinition[] {
  return Object.values(ACHIEVEMENT_DEFINITIONS).filter(a => a.category === category);
}

// Helper function to get achievements sorted by rarity (rarest first)
export function getAchievementsByRarity(): AchievementDefinition[] {
  return Object.values(ACHIEVEMENT_DEFINITIONS).sort((a, b) => a.rarity - b.rarity);
}

// Helper function to calculate total possible XP
export function getTotalPossibleXP(): number {
  return Object.values(ACHIEVEMENT_DEFINITIONS).reduce((sum, a) => sum + a.xpReward, 0);
}

// Helper function to calculate total possible UselessBucks rewards
export function getTotalPossibleUselessBucks(): number {
  return Object.values(ACHIEVEMENT_DEFINITIONS).reduce((sum, a) => sum + a.uselessBucksReward, 0);
}

// Export achievement count for reference
export const TOTAL_ACHIEVEMENTS = Object.keys(ACHIEVEMENT_DEFINITIONS).length;

// Category metadata for UI display
export const ACHIEVEMENT_CATEGORIES: Record<AchievementCategory, { label: string; emoji: string; description: string }> = {
  shopping: {
    label: "Shopping Sins",
    emoji: "🛍️",
    description: "Achievements earned through questionable purchasing decisions",
  },
  engagement: {
    label: "Time Wasters",
    emoji: "⏰",
    description: "Achievements for spending way too much time on our site",
  },
  social: {
    label: "Social Sabotage",
    emoji: "👥",
    description: "Achievements for dragging others into this mess",
  },
  special: {
    label: "Certified Unhinged",
    emoji: "🎭",
    description: "Special achievements for truly bizarre behavior",
  },
};
