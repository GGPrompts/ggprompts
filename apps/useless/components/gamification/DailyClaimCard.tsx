"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@ggprompts/ui";
import { Button } from "@ggprompts/ui";
import { Progress } from "@ggprompts/ui";
import { Flame, Gift, Clock, Sparkles, Star, Zap } from "lucide-react";
import {
  getStreakStatus,
  calculateStreakReward,
  getMilestoneProgress,
  formatTimeUntilClaim,
  getStreakMultiplier,
} from "@/lib/gamification/streaks";

interface DailyClaimCardProps {
  wallet: {
    balance: string;
    lastClaimAt: Date | null;
    streak?: number;
  };
  onClaim: () => Promise<{
    success: boolean;
    amount: number;
    newStreak: number;
    message?: string;
    milestoneHit?: {
      name: string;
      description: string;
      bonusReward: number;
    };
  }>;
}

// Confetti particle component
const ConfettiParticle = ({
  delay,
  x,
  color,
}: {
  delay: number;
  x: number;
  color: string;
}) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{ backgroundColor: color, left: `${x}%` }}
    initial={{ y: 0, opacity: 1, scale: 1 }}
    animate={{
      y: [0, -100, 200],
      opacity: [1, 1, 0],
      scale: [1, 1.2, 0.5],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 1.5,
      delay,
      ease: "easeOut",
    }}
  />
);

// Sparkle effect component
const SparkleEffect = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.8,
          delay: i * 0.05,
          repeat: 2,
        }}
      >
        <Sparkles className="w-4 h-4 text-primary" />
      </motion.div>
    ))}
  </motion.div>
);

export function DailyClaimCard({ wallet, onClaim }: DailyClaimCardProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [claimResult, setClaimResult] = useState<{
    amount: number;
    message: string;
    milestoneHit?: {
      name: string;
      description: string;
      bonusReward: number;
    };
  } | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [currentStreak, setCurrentStreak] = useState(wallet.streak || 0);

  // Calculate streak status
  const streakStatus = getStreakStatus(wallet.lastClaimAt, currentStreak);
  const multiplier = getStreakMultiplier(streakStatus.currentStreak);
  const milestoneInfo = getMilestoneProgress(streakStatus.currentStreak);
  const potentialReward = calculateStreakReward(
    streakStatus.currentStreak + (streakStatus.canClaim ? 1 : 0)
  );

  // Update countdown timer
  useEffect(() => {
    if (!streakStatus.nextClaimAt) {
      setCountdown("");
      return;
    }

    const updateCountdown = () => {
      if (streakStatus.nextClaimAt) {
        setCountdown(formatTimeUntilClaim(streakStatus.nextClaimAt));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [streakStatus.nextClaimAt]);

  const handleClaim = useCallback(async () => {
    if (isClaiming || !streakStatus.canClaim) return;

    setIsClaiming(true);
    setClaimResult(null);

    try {
      const result = await onClaim();

      if (result.success) {
        setCurrentStreak(result.newStreak);
        setClaimResult({
          amount: result.amount,
          message: result.message || "Claimed!",
          milestoneHit: result.milestoneHit,
        });
        setShowCelebration(true);

        // Hide celebration after 3 seconds
        setTimeout(() => {
          setShowCelebration(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Claim failed:", error);
    } finally {
      setIsClaiming(false);
    }
  }, [isClaiming, streakStatus.canClaim, onClaim]);

  const confettiColors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
  ];

  return (
    <Card className="glass border-glow relative overflow-hidden">
      {/* Celebration effects */}
      <AnimatePresence>
        {showCelebration && (
          <>
            <SparkleEffect />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <ConfettiParticle
                  key={i}
                  delay={i * 0.03}
                  x={Math.random() * 100}
                  color={confettiColors[i % confettiColors.length]}
                />
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Gift className="w-5 h-5 text-primary" />
            Daily Claim
          </span>

          {/* Streak counter */}
          <motion.div
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/30"
            animate={
              showCelebration
                ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-primary">
              {streakStatus.currentStreak}
            </span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </motion.div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Multiplier badge */}
        {multiplier > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30"
          >
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-primary">{multiplier}x</span>
            <span className="text-sm text-muted-foreground">
              Streak Multiplier Active!
            </span>
          </motion.div>
        )}

        {/* Reward preview */}
        <div className="text-center py-4">
          <AnimatePresence mode="wait">
            {claimResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-2"
              >
                <motion.div
                  className="text-4xl font-bold text-primary terminal-glow"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  +${claimResult.amount}
                </motion.div>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {claimResult.message}
                </p>
                {claimResult.milestoneHit && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-primary/20 border border-primary/40"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-primary">
                        {claimResult.milestoneHit.name}
                      </span>
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {claimResult.milestoneHit.description}
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      +${claimResult.milestoneHit.bonusReward} milestone bonus!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-1"
              >
                <div className="text-3xl font-bold text-foreground">
                  ${potentialReward.totalReward}
                </div>
                <p className="text-sm text-muted-foreground">
                  {streakStatus.canClaim
                    ? "Ready to claim!"
                    : `Next claim in ${countdown}`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Claim button */}
        <Button
          onClick={handleClaim}
          disabled={!streakStatus.canClaim || isClaiming}
          className="w-full h-12 text-lg font-bold relative overflow-hidden"
          variant={streakStatus.canClaim ? "default" : "outline"}
        >
          <AnimatePresence mode="wait">
            {isClaiming ? (
              <motion.div
                key="claiming"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span>Claiming...</span>
              </motion.div>
            ) : streakStatus.canClaim ? (
              <motion.div
                key="claim"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                <span>CLAIM NOW</span>
              </motion.div>
            ) : (
              <motion.div
                key="wait"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Clock className="w-5 h-5" />
                <span>{countdown || "Loading..."}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button glow effect when available */}
          {streakStatus.canClaim && !isClaiming && (
            <motion.div
              className="absolute inset-0 bg-primary/20"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </Button>

        {/* Milestone progress */}
        {milestoneInfo.nextMilestone && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Next: {milestoneInfo.nextMilestone.name}
              </span>
              <span className="text-primary font-medium">
                {milestoneInfo.daysToNext} days to go
              </span>
            </div>
            <Progress value={milestoneInfo.progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground italic">
              &quot;{milestoneInfo.nextMilestone.description}&quot;
            </p>
          </div>
        )}

        {/* Streak reset warning */}
        {!streakStatus.canClaim && streakStatus.hoursUntilReset < 12 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-xs text-yellow-500 bg-yellow-500/10 py-2 px-3 rounded-lg"
          >
            <Clock className="w-3 h-3" />
            <span>
              Streak expires in {Math.round(streakStatus.hoursUntilReset)} hours!
            </span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default DailyClaimCard;
