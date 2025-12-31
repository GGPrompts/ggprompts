"use client";

import { cn } from "@ggprompts/ui";
import {
  getLevelBadgeStyle,
  getRandomLevelUpMessage,
  isMilestonelevel,
} from "@/lib/gamification/levels";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { X, Sparkles, Star, Zap } from "lucide-react";

interface LevelUpCelebrationProps {
  newLevel: number;
  newTitle: string;
  onClose: () => void;
  autoCloseDelay?: number;
}

// Confetti particle component
function Particle({ index }: { index: number }) {
  const colors = [
    "bg-amber-400",
    "bg-rose-400",
    "bg-violet-400",
    "bg-cyan-400",
    "bg-emerald-400",
    "bg-pink-400",
  ];

  const randomColor = colors[index % colors.length];
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 0.5;
  const randomDuration = 2 + Math.random() * 2;
  const randomRotation = Math.random() * 360;
  const randomSize = 4 + Math.random() * 8;

  return (
    <motion.div
      className={cn("absolute rounded-full", randomColor)}
      style={{
        left: `${randomX}%`,
        top: "-10%",
        width: randomSize,
        height: randomSize,
      }}
      initial={{
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
      }}
      animate={{
        opacity: [1, 1, 0],
        y: "120vh",
        rotate: randomRotation + 720,
        scale: [1, 0.8, 0.5],
        x: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 100],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        ease: "easeOut",
      }}
    />
  );
}

// Sparkle burst component
function SparkleBurst() {
  const sparkles = Array.from({ length: 12 });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {sparkles.map((_, i) => {
        const angle = (i / 12) * 360;
        const distance = 150 + Math.random() * 100;
        const delay = i * 0.05;

        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: Math.cos((angle * Math.PI) / 180) * distance,
              y: Math.sin((angle * Math.PI) / 180) * distance,
            }}
            transition={{
              duration: 1,
              delay: delay + 0.3,
              ease: "easeOut",
            }}
          >
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          </motion.div>
        );
      })}
    </div>
  );
}

export function LevelUpCelebration({
  newLevel,
  newTitle,
  onClose,
  autoCloseDelay = 5000,
}: LevelUpCelebrationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { gradient, glow } = getLevelBadgeStyle(newLevel);
  const isMilestone = isMilestonelevel(newLevel);
  const message = useMemo(() => getRandomLevelUpMessage(), []);

  // Create particles array
  const particles = useMemo(
    () => Array.from({ length: isMilestone ? 60 : 30 }),
    [isMilestone]
  );

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  }, [onClose]);

  // Auto-close timer
  useEffect(() => {
    const timer = setTimeout(handleClose, autoCloseDelay);
    return () => clearTimeout(timer);
  }, [autoCloseDelay, handleClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((_, i) => (
              <Particle key={i} index={i} />
            ))}
          </div>

          {/* Sparkle burst for milestones */}
          {isMilestone && <SparkleBurst />}

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6 p-8 glass-overlay rounded-2xl border-glow max-w-md mx-4"
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Level up header */}
            <motion.div
              className="flex items-center gap-2 text-primary"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Zap className="h-6 w-6 fill-current" />
              <span className="text-xl font-bold uppercase tracking-wider terminal-glow">
                Level Up!
              </span>
              <Zap className="h-6 w-6 fill-current" />
            </motion.div>

            {/* Animated level number */}
            <motion.div
              className={cn(
                "relative flex items-center justify-center",
                "h-32 w-32 rounded-full glass border-2",
                glow
              )}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                delay: 0.3,
              }}
            >
              {/* Gradient background */}
              <div
                className={cn(
                  "absolute inset-0 rounded-full opacity-40 bg-gradient-to-br",
                  gradient
                )}
              />

              {/* Spinning ring for milestones */}
              {isMilestone && (
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/50"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}

              {/* Level number */}
              <motion.span
                className={cn(
                  "relative z-10 text-5xl font-bold bg-gradient-to-br bg-clip-text text-transparent",
                  gradient
                )}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {newLevel}
              </motion.span>
            </motion.div>

            {/* New title reveal */}
            <motion.div
              className="text-center space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  New Title Unlocked
                </span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <motion.h2
                className={cn(
                  "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                  gradient
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                {newTitle}
              </motion.h2>
            </motion.div>

            {/* Congratulation message */}
            <motion.p
              className="text-center text-muted-foreground text-sm max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {message}
            </motion.p>

            {/* Tap to dismiss hint */}
            <motion.p
              className="text-xs text-muted-foreground/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Tap anywhere to dismiss
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
