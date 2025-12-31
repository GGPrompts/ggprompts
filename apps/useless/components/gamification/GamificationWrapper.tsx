"use client";

import { GamificationProvider, useGamification } from "@/lib/gamification/context";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Star, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@ggprompts/ui";
import { cn } from "@ggprompts/ui";

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const randomX = Math.random() * 100;
  const randomRotation = Math.random() * 720 - 360;
  const randomDuration = 2 + Math.random() * 2;

  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{
        backgroundColor: color,
        left: `${randomX}%`,
        top: "-10px",
      }}
      initial={{ y: 0, rotate: 0, opacity: 1 }}
      animate={{
        y: "120vh",
        rotate: randomRotation,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: randomDuration,
        delay: delay,
        ease: "easeIn",
      }}
    />
  );
}

// Level Up Celebration Modal
function LevelUpCelebration({
  level,
  title,
  onClose,
}: {
  level: number;
  title: string;
  onClose: () => void;
}) {
  const [showContent, setShowContent] = useState(false);
  const confettiColors = [
    "hsl(var(--primary))",
    "#fbbf24",
    "#22d3ee",
    "#a855f7",
    "#f43f5e",
    "#10b981",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    const autoClose = setTimeout(onClose, 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(autoClose);
    };
  }, [onClose]);

  const congratsMessages = [
    "You've achieved a new level of uselessness!",
    "Your commitment to wasting money is truly inspiring!",
    "Another step on your journey to financial ruin!",
    "Your wallet is crying tears of joy... or just tears.",
    "Achievement unlocked: Questionable Life Choices!",
    "You're now an even bigger contributor to the economy of nothing!",
  ];

  const message = congratsMessages[level % congratsMessages.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <ConfettiParticle
            key={i}
            delay={i * 0.05}
            color={confettiColors[i % confettiColors.length]}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative glass-overlay rounded-3xl p-8 max-w-md mx-4 text-center border-2 border-primary/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Sparkles decoration */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-6 left-1/2 -translate-x-1/2"
        >
          <Sparkles className="w-12 h-12 text-yellow-400" />
        </motion.div>

        {/* Level badge */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="relative mx-auto mb-6 mt-4"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-cyan-400 to-primary flex items-center justify-center shadow-[0_0_60px_rgba(var(--primary-rgb),0.5)]">
                <div className="w-28 h-28 rounded-full bg-background flex items-center justify-center">
                  <span className="text-5xl font-black text-primary terminal-glow">
                    {level}
                  </span>
                </div>
              </div>
              {/* Stars around level */}
              {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-70px)`,
                  }}
                >
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text content */}
        <AnimatePresence>
          {showContent && (
            <>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">
                    Level Up!
                  </span>
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-3xl font-black text-foreground mb-2">
                  You reached{" "}
                  <span className="text-primary terminal-glow">Level {level}</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-6"
              >
                <p className="text-xl font-bold text-cyan-400 mb-2">{title}</p>
                <p className="text-sm text-muted-foreground italic">&quot;{message}&quot;</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Button onClick={onClose} className="border-glow">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Keep Being Useless
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// Inner wrapper that uses the context
function GamificationContent({ children }: { children: React.ReactNode }) {
  const { showLevelUp, levelUpData, dismissLevelUp } = useGamification();

  return (
    <>
      {children}
      <AnimatePresence>
        {showLevelUp && levelUpData && (
          <LevelUpCelebration
            level={levelUpData.newLevel}
            title={levelUpData.newTitle}
            onClose={dismissLevelUp}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Main wrapper component
export function GamificationWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GamificationProvider>
      <GamificationContent>{children}</GamificationContent>
    </GamificationProvider>
  );
}
