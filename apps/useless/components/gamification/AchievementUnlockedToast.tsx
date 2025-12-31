"use client";

import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Star } from "lucide-react";
import { cn } from "@ggprompts/ui";

export interface AchievementToastData {
  id: string;
  title: string;
  description: string;
  emoji: string;
  rarity: number;
  xpReward?: number;
  uselessBucksReward?: number;
}

// Custom toast content component
function AchievementToastContent({ achievement }: { achievement: AchievementToastData }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-start gap-4 w-full"
    >
      {/* Achievement Icon */}
      <div className="relative flex-shrink-0">
        <motion.div
          initial={{ rotate: -10, scale: 0.5 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center text-3xl relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative z-10">{achievement.emoji}</span>
        </motion.div>

        {/* Sparkle decorations */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header with Trophy */}
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wide">
            Achievement Unlocked!
          </span>
        </div>

        {/* Title */}
        <motion.h4
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-bold text-foreground terminal-glow text-base leading-tight"
        >
          {achievement.title}
        </motion.h4>

        {/* Description */}
        <motion.p
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground mt-0.5 line-clamp-2"
        >
          {achievement.description}
        </motion.p>

        {/* Rewards Row */}
        {(achievement.xpReward || achievement.uselessBucksReward) && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mt-2"
          >
            {achievement.xpReward && achievement.xpReward > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400 font-semibold">+{achievement.xpReward} XP</span>
              </div>
            )}
            {achievement.uselessBucksReward && achievement.uselessBucksReward > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-yellow-400">$</span>
                <span className="text-yellow-400 font-semibold">
                  +{achievement.uselessBucksReward} UselessBucks
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Rarity indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 flex items-center gap-1.5"
        >
          <div className={cn(
            "w-2 h-2 rounded-full",
            achievement.rarity <= 5 ? "bg-yellow-400" :
            achievement.rarity <= 15 ? "bg-purple-400" :
            achievement.rarity <= 30 ? "bg-blue-400" :
            "bg-gray-400"
          )} />
          <span className="text-xs text-muted-foreground">
            {achievement.rarity <= 5 ? "Legendary" :
             achievement.rarity <= 15 ? "Epic" :
             achievement.rarity <= 30 ? "Rare" :
             "Common"} - {achievement.rarity}% of users have this
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Show an achievement unlocked toast notification
 */
export function showAchievementToast(achievement: AchievementToastData) {
  toast.custom(
    (t) => (
      <div
        className={cn(
          "w-full max-w-md p-4 rounded-xl",
          "glass-overlay border border-primary/50 border-glow",
          "shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
        )}
      >
        <AchievementToastContent achievement={achievement} />
      </div>
    ),
    {
      duration: 6000,
      position: "bottom-right",
      id: `achievement-${achievement.id}`,
    }
  );
}

/**
 * Show multiple achievements unlocked at once
 */
export function showMultipleAchievementsToast(achievements: AchievementToastData[]) {
  if (achievements.length === 0) return;

  if (achievements.length === 1) {
    showAchievementToast(achievements[0]);
    return;
  }

  // Show a summary toast for multiple achievements
  toast.custom(
    (t) => (
      <div
        className={cn(
          "w-full max-w-md p-4 rounded-xl",
          "glass-overlay border border-primary/50 border-glow",
          "shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
        )}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-3"
        >
          {/* Header */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Trophy className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h4 className="font-bold text-primary terminal-glow">
                {achievements.length} Achievements Unlocked!
              </h4>
              <p className="text-xs text-muted-foreground">
                You&apos;re on fire today!
              </p>
            </div>
          </div>

          {/* Achievement List */}
          <div className="space-y-2">
            {achievements.slice(0, 3).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3 p-2 rounded-lg bg-primary/10"
              >
                <span className="text-xl">{achievement.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{achievement.title}</p>
                </div>
                {achievement.xpReward && (
                  <span className="text-xs text-cyan-400 font-semibold">
                    +{achievement.xpReward} XP
                  </span>
                )}
              </motion.div>
            ))}
            {achievements.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                ...and {achievements.length - 3} more!
              </p>
            )}
          </div>

          {/* Total Rewards */}
          <div className="flex items-center justify-center gap-4 pt-2 border-t border-primary/20">
            <div className="text-center">
              <p className="text-lg font-bold text-cyan-400">
                +{achievements.reduce((sum, a) => sum + (a.xpReward || 0), 0)} XP
              </p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
            {achievements.some(a => a.uselessBucksReward) && (
              <div className="text-center">
                <p className="text-lg font-bold text-yellow-400">
                  +${achievements.reduce((sum, a) => sum + (a.uselessBucksReward || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">UselessBucks</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    ),
    {
      duration: 8000,
      position: "bottom-right",
      id: `achievements-batch-${Date.now()}`,
    }
  );
}

// Export component for direct use if needed
export { AchievementToastContent };
