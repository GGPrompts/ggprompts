"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@ggprompts/ui";
import { Progress } from "@ggprompts/ui";
import {
  Trophy,
  Lock,
  Check,
  Flame,
  Star,
  Crown,
  Skull,
  Leaf,
} from "lucide-react";
import {
  STREAK_CONFIG,
  getMilestoneProgress,
} from "@/lib/gamification/streaks";

interface StreakMilestonesProps {
  currentStreak: number;
  className?: string;
}

// Icon mapping for milestones
const milestoneIcons: Record<number, React.ReactNode> = {
  7: <Flame className="w-5 h-5" />,
  30: <Star className="w-5 h-5" />,
  60: <Trophy className="w-5 h-5" />,
  100: <Crown className="w-5 h-5" />,
  365: <Skull className="w-5 h-5" />,
};

// Fun descriptions that show on hover/focus
const extendedDescriptions: Record<number, string> = {
  7: "Seven whole days! You've officially proven you can do something pointless consistently.",
  30: "A month! That's 30 opportunities you've had to do something productive. And yet...",
  60: "Two months of daily visits. Your F5 key is wearing out. Your soul? Already gone.",
  100: "ONE HUNDRED DAYS. This isn't dedication. This is a cry for help. We're proud of you.",
  365: "365 days. One full orbit around the sun, and you spent it clicking a button. Legendary.",
};

export function StreakMilestones({
  currentStreak,
  className,
}: StreakMilestonesProps) {
  const progressInfo = getMilestoneProgress(currentStreak);

  return (
    <Card className={`glass border-glow ${className || ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Streak Milestones
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall progress indicator */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center gap-1">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-2xl text-primary">
              {currentStreak}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {currentStreak === 0
                ? "Start your streak today!"
                : currentStreak >= 365
                  ? "Maximum streak achieved. You absolute legend."
                  : `${progressInfo.daysToNext} days until ${progressInfo.nextMilestone?.name}`}
            </p>
          </div>
        </div>

        {/* Milestones list */}
        <div className="space-y-3">
          {STREAK_CONFIG.streakMilestones.map((milestone, index) => {
            const isUnlocked = currentStreak >= milestone.days;
            const isNext = progressInfo.nextMilestone?.days === milestone.days;
            const progressToThis =
              isNext && progressInfo.progress
                ? progressInfo.progress
                : isUnlocked
                  ? 100
                  : 0;

            return (
              <motion.div
                key={milestone.days}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-lg border transition-all ${
                  isUnlocked
                    ? "bg-primary/10 border-primary/40"
                    : isNext
                      ? "bg-muted/40 border-primary/30 ring-1 ring-primary/20"
                      : "bg-muted/20 border-border/30 opacity-60"
                }`}
              >
                {/* Progress bar for current target */}
                {isNext && (
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary/10"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToThis}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                )}

                <div className="relative flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isUnlocked
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isUnlocked ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      milestoneIcons[milestone.days] || (
                        <Lock className="w-5 h-5" />
                      )
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`font-semibold ${isUnlocked ? "text-primary" : "text-foreground"}`}
                      >
                        {milestone.name}
                      </h4>
                      <span
                        className={`text-sm font-medium ${isUnlocked ? "text-primary" : "text-muted-foreground"}`}
                      >
                        Day {milestone.days}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {milestone.description}
                    </p>

                    {/* Reward info */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isUnlocked
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        +${milestone.bonusReward} bonus
                      </span>

                      {isNext && (
                        <span className="text-xs text-primary animate-pulse">
                          {progressInfo.daysToNext} days to go!
                        </span>
                      )}

                      {isUnlocked && (
                        <span className="text-xs text-primary flex items-center gap-1">
                          <Check className="w-3 h-3" /> Unlocked!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Extended description tooltip for unlocked */}
                {isUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-primary/20"
                  >
                    <p className="text-xs text-muted-foreground italic">
                      {extendedDescriptions[milestone.days]}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Fun footer message */}
        <div className="pt-3 border-t border-border/30">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Leaf className="w-4 h-4 text-green-500" />
            <span className="italic">
              {currentStreak === 0
                ? "Your journey into madness begins with a single claim."
                : currentStreak >= 365
                  ? "You've done it. There's nothing left to prove. Maybe go outside?"
                  : "Every day is a chance to add to your monument of dedication."}
            </span>
          </div>
        </div>

        {/* Progress to next milestone */}
        {progressInfo.nextMilestone && currentStreak > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {progressInfo.previousMilestone?.name || "Start"} (Day{" "}
                {progressInfo.previousMilestone?.days || 0})
              </span>
              <span>
                {progressInfo.nextMilestone.name} (Day{" "}
                {progressInfo.nextMilestone.days})
              </span>
            </div>
            <Progress value={progressInfo.progress} className="h-2" />
            <p className="text-center text-xs text-muted-foreground">
              {progressInfo.progress}% complete to next milestone
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StreakMilestones;
