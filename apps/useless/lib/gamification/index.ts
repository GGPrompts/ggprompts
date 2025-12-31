// Gamification module - central exports
// This module provides all gamification-related utilities, types, and components

// Re-export context and hooks
export { GamificationProvider, useGamification } from "./context";
export type { UserProgress, WalletInfo, UnlockedAchievement } from "./context";

// Achievement definitions
export {
  ACHIEVEMENT_DEFINITIONS,
  ACHIEVEMENT_CATEGORIES,
  getAchievementById,
  getAchievementsByCategory,
  getAchievementsByRarity,
  getTotalPossibleXP,
  getTotalPossibleUselessBucks,
} from "./achievements";
export type { AchievementType, AchievementCategory, AchievementDefinition } from "./achievements";

// Streak utilities
export {
  STREAK_CONFIG,
  getStreakStatus,
  calculateStreakReward,
  getStreakMultiplier,
  getNextMilestone,
  getMilestoneProgress,
  formatTimeUntilClaim,
} from "./streaks";
export type { StreakStatus, StreakReward } from "./streaks";

// Level utilities
export {
  LEVEL_CONFIG,
  LEVEL_NAMES,
  LEVEL_UP_MESSAGES,
  getLevelInfo,
  getXpSources,
  getLevelBadgeStyle,
} from "./levels";
export type { LevelInfo, XpSource } from "./levels";
