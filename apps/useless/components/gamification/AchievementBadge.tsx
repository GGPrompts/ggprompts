"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Banknote,
  MessageSquare,
  FlaskConical,
  Package,
  RefreshCw,
  HeartCrack,
  Eye,
  Zap,
  Clock,
  Fish,
  Moon,
  Undo2,
  FileText,
  Flame,
  Rocket,
  Shuffle,
  Award,
  Ghost,
  Users,
  Tag,
  Lock,
  LucideIcon,
} from "lucide-react";
import { Badge } from "@ggprompts/ui";
import { Progress } from "@ggprompts/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ggprompts/ui";
import { cn } from "@ggprompts/ui";
import type { AchievementDefinition } from "@/lib/gamification/achievements";

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  ShoppingCart,
  Banknote,
  MessageSquare,
  FlaskConical,
  Package,
  RefreshCw,
  HeartCrack,
  Eye,
  Zap,
  Clock,
  Fish,
  Moon,
  Undo2,
  FileText,
  Flame,
  Rocket,
  Shuffle,
  Award,
  Ghost,
  Users,
  Tag,
};

interface AchievementBadgeProps {
  achievement: AchievementDefinition;
  unlocked: boolean;
  unlockedAt?: Date;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  progress?: {
    current: number;
    target: number;
  };
}

// Size configurations
const sizeConfig = {
  sm: {
    container: "w-16 h-16",
    icon: "w-6 h-6",
    emoji: "text-2xl",
    lockIcon: "w-4 h-4",
  },
  md: {
    container: "w-24 h-24",
    icon: "w-8 h-8",
    emoji: "text-4xl",
    lockIcon: "w-5 h-5",
  },
  lg: {
    container: "w-32 h-32",
    icon: "w-10 h-10",
    emoji: "text-5xl",
    lockIcon: "w-6 h-6",
  },
};

// Rarity color configurations
function getRarityConfig(rarity: number) {
  if (rarity <= 5) {
    return {
      label: "Legendary",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/50",
      glowColor: "shadow-yellow-500/30",
    };
  }
  if (rarity <= 15) {
    return {
      label: "Epic",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/50",
      glowColor: "shadow-purple-500/30",
    };
  }
  if (rarity <= 30) {
    return {
      label: "Rare",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/50",
      glowColor: "shadow-blue-500/30",
    };
  }
  return {
    label: "Common",
    color: "text-muted-foreground",
    bgColor: "bg-muted/20",
    borderColor: "border-muted/50",
    glowColor: "shadow-muted/20",
  };
}

export function AchievementBadge({
  achievement,
  unlocked,
  unlockedAt,
  size = "md",
  showProgress = false,
  progress,
}: AchievementBadgeProps) {
  const IconComponent = iconMap[achievement.icon];
  const config = sizeConfig[size];
  const rarityConfig = getRarityConfig(achievement.rarity);

  const progressPercent = useMemo(() => {
    if (!progress) return 0;
    return Math.min(100, Math.round((progress.current / progress.target) * 100));
  }, [progress]);

  const formattedDate = useMemo(() => {
    if (!unlockedAt) return null;
    return new Date(unlockedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [unlockedAt]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.div
            className="relative inline-flex flex-col items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {/* Main Badge Container */}
            <div
              className={cn(
                "relative flex items-center justify-center rounded-2xl transition-all duration-300",
                config.container,
                unlocked
                  ? [
                      "glass-overlay",
                      "border-2",
                      rarityConfig.borderColor,
                      "border-glow",
                    ]
                  : ["glass", "border border-muted/30", "grayscale", "opacity-60"]
              )}
            >
              {/* Glow effect for unlocked achievements */}
              {unlocked && (
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-2xl",
                    rarityConfig.bgColor
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Badge Content */}
              <div className="relative z-10 flex items-center justify-center">
                {unlocked ? (
                  <motion.span
                    className={cn(config.emoji, "select-none")}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {achievement.emoji}
                  </motion.span>
                ) : (
                  <Lock
                    className={cn(
                      config.lockIcon,
                      "text-muted-foreground/50"
                    )}
                  />
                )}
              </div>

              {/* Rarity indicator dot */}
              <div
                className={cn(
                  "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                  unlocked ? rarityConfig.bgColor : "bg-muted/50",
                  unlocked && rarityConfig.color
                )}
              />
            </div>

            {/* Status Badge */}
            <Badge
              variant={unlocked ? "default" : "secondary"}
              className={cn(
                "text-[10px] px-2 py-0.5",
                unlocked
                  ? [
                      "bg-primary/20",
                      "text-primary",
                      "border-primary/50",
                      "terminal-glow",
                    ]
                  : "bg-muted/50"
              )}
            >
              {unlocked ? "Unlocked" : "Locked"}
            </Badge>

            {/* Progress bar for locked achievements */}
            {showProgress && !unlocked && progress && (
              <div className="w-full space-y-1">
                <Progress value={progressPercent} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground text-center">
                  {progress.current}/{progress.target}
                </p>
              </div>
            )}
          </motion.div>
        </TooltipTrigger>

        {/* Tooltip Content */}
        <TooltipContent
          side="top"
          className={cn(
            "max-w-xs p-4 glass-overlay rounded-xl",
            "border",
            unlocked ? rarityConfig.borderColor : "border-muted/50"
          )}
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{achievement.emoji}</span>
                <div>
                  <h4
                    className={cn(
                      "font-semibold text-sm",
                      unlocked && "text-primary terminal-glow"
                    )}
                  >
                    {achievement.title}
                  </h4>
                  <p className={cn("text-xs", rarityConfig.color)}>
                    {rarityConfig.label} - {achievement.rarity}% have this
                  </p>
                </div>
              </div>
              {IconComponent && (
                <IconComponent
                  className={cn(
                    "w-5 h-5",
                    unlocked ? "text-primary" : "text-muted-foreground"
                  )}
                />
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {achievement.description}
            </p>

            {/* Requirement */}
            <div className="pt-2 border-t border-muted/30">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Requirement: </span>
                {achievement.requirement}
              </p>
            </div>

            {/* Rewards */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1">
                <span className="text-xs text-primary font-medium">
                  +{achievement.xpReward} XP
                </span>
              </div>
              {achievement.uselessBucksReward > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-yellow-500 font-medium">
                    +${achievement.uselessBucksReward} UselessBucks
                  </span>
                </div>
              )}
            </div>

            {/* Unlocked date */}
            {unlocked && formattedDate && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-muted/30">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  Unlocked {formattedDate}
                </span>
              </div>
            )}

            {/* Progress for locked */}
            {!unlocked && progress && (
              <div className="pt-2 border-t border-muted/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {progress.current}/{progress.target} ({progressPercent}%)
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Compact version for lists/grids
export function AchievementBadgeCompact({
  achievement,
  unlocked,
  unlockedAt,
}: Omit<AchievementBadgeProps, "size" | "showProgress" | "progress">) {
  const rarityConfig = getRarityConfig(achievement.rarity);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
              unlocked
                ? ["glass", "border", rarityConfig.borderColor]
                : ["bg-muted/20", "border border-muted/30", "grayscale", "opacity-50"]
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {unlocked ? (
              <span className="text-lg">{achievement.emoji}</span>
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground/50" />
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="glass-overlay rounded-lg border border-muted/50"
        >
          <div className="text-center">
            <p className="font-semibold text-sm">{achievement.title}</p>
            <p className={cn("text-xs", rarityConfig.color)}>
              {rarityConfig.label}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default AchievementBadge;
