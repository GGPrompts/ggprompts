"use client";

import { cn } from "@ggprompts/ui";
import { getLevelBadgeStyle, LEVEL_CONFIG } from "@/lib/gamification/levels";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface XpProgressBarProps {
  currentXp: number;
  xpToNextLevel: number;
  level: number;
  title: string;
  nextTitle?: string | null;
  className?: string;
  showLabels?: boolean;
  animate?: boolean;
}

export function XpProgressBar({
  currentXp,
  xpToNextLevel,
  level,
  title,
  nextTitle,
  className,
  showLabels = true,
  animate = true,
}: XpProgressBarProps) {
  const isMaxLevel = level >= LEVEL_CONFIG.maxLevel;
  const progress = isMaxLevel ? 100 : Math.min(100, (currentXp / xpToNextLevel) * 100);
  const { gradient, glow } = getLevelBadgeStyle(level);

  // Animated XP counter
  const [displayXp, setDisplayXp] = useState(currentXp);
  const springXp = useSpring(currentXp, { stiffness: 100, damping: 20 });

  useEffect(() => {
    springXp.set(currentXp);
  }, [currentXp, springXp]);

  useEffect(() => {
    const unsubscribe = springXp.on("change", (latest) => {
      setDisplayXp(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springXp]);

  // Animated progress
  const springProgress = useSpring(0, { stiffness: 60, damping: 15 });
  const progressWidth = useTransform(springProgress, (v) => `${v}%`);

  useEffect(() => {
    if (animate) {
      springProgress.set(progress);
    } else {
      springProgress.jump(progress);
    }
  }, [progress, springProgress, animate]);

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Header with level info */}
      {showLabels && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Level {level}</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-muted-foreground">{title}</span>
          </div>
          {!isMaxLevel && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="font-medium">{displayXp}</span>
              <span>/</span>
              <span>{xpToNextLevel} XP</span>
            </div>
          )}
          {isMaxLevel && (
            <span className="text-primary font-medium terminal-glow">
              MAX LEVEL
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div className="relative h-4 w-full overflow-hidden rounded-full glass">
        {/* Background glow */}
        <div
          className={cn(
            "absolute inset-0 opacity-20 bg-gradient-to-r",
            gradient
          )}
        />

        {/* Animated progress fill */}
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            "bg-gradient-to-r",
            gradient,
            glow
          )}
          style={{ width: progressWidth }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Pulse effect on progress edge */}
        <motion.div
          className={cn(
            "absolute top-0 bottom-0 w-2 rounded-full blur-sm bg-gradient-to-r",
            gradient
          )}
          style={{ left: progressWidth }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Next level preview */}
      {showLabels && !isMaxLevel && nextTitle && (
        <motion.div
          className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span>Level {level}</span>
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {">"}
          </motion.span>
          <span className="text-primary/80">Level {level + 1}</span>
          <span className="text-muted-foreground/60">({nextTitle})</span>
        </motion.div>
      )}

      {/* Max level celebration text */}
      {isMaxLevel && showLabels && (
        <motion.p
          className="text-center text-xs text-primary terminal-glow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          You have achieved peak uselessness!
        </motion.p>
      )}
    </div>
  );
}

interface CompactXpProgressBarProps {
  currentXp: number;
  xpToNextLevel: number;
  level: number;
  className?: string;
}

/**
 * A compact version of the XP progress bar for use in headers/navbars
 */
export function CompactXpProgressBar({
  currentXp,
  xpToNextLevel,
  level,
  className,
}: CompactXpProgressBarProps) {
  const isMaxLevel = level >= LEVEL_CONFIG.maxLevel;
  const progress = isMaxLevel ? 100 : Math.min(100, (currentXp / xpToNextLevel) * 100);
  const { gradient } = getLevelBadgeStyle(level);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs font-medium text-muted-foreground">Lv.{level}</span>
      <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r", gradient)}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-muted-foreground">
        {isMaxLevel ? "MAX" : `${currentXp}/${xpToNextLevel}`}
      </span>
    </div>
  );
}
