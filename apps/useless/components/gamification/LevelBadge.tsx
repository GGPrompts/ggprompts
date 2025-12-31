"use client";

import { cn } from "@ggprompts/ui";
import { getLevelBadgeStyle, isMilestonelevel } from "@/lib/gamification/levels";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ggprompts/ui";

interface LevelBadgeProps {
  level: number;
  title: string;
  size?: "sm" | "md" | "lg";
  showTitle?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "h-8 w-8",
    text: "text-xs font-bold",
    titleText: "text-[10px]",
  },
  md: {
    container: "h-12 w-12",
    text: "text-base font-bold",
    titleText: "text-xs",
  },
  lg: {
    container: "h-16 w-16",
    text: "text-xl font-bold",
    titleText: "text-sm",
  },
};

export function LevelBadge({
  level,
  title,
  size = "md",
  showTitle = false,
  className,
}: LevelBadgeProps) {
  const { gradient, glow, border } = getLevelBadgeStyle(level);
  const isMilestone = isMilestonelevel(level);
  const sizes = sizeClasses[size];

  const badge = (
    <motion.div
      className={cn("flex flex-col items-center gap-1", className)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.div
        className={cn(
          "relative flex items-center justify-center rounded-full",
          "glass border",
          border,
          glow,
          sizes.container,
          isMilestone && "ring-2 ring-offset-2 ring-offset-background ring-primary/50"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Gradient background overlay */}
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-30",
            "bg-gradient-to-br",
            gradient
          )}
        />

        {/* Level number */}
        <span
          className={cn(
            "relative z-10 bg-gradient-to-br bg-clip-text text-transparent",
            gradient,
            sizes.text,
            isMilestone && "animate-gradient-pulse"
          )}
        >
          {level}
        </span>

        {/* Milestone sparkle effect */}
        {isMilestone && (
          <motion.div
            className="absolute -inset-1 rounded-full opacity-50"
            style={{
              background: `conic-gradient(from 0deg, transparent, rgba(var(--primary-rgb), 0.3), transparent)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.div>

      {/* Title display */}
      {showTitle && (
        <motion.span
          className={cn(
            "text-muted-foreground text-center max-w-[120px] truncate",
            sizes.titleText
          )}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.span>
      )}
    </motion.div>
  );

  // Wrap with tooltip if title is not shown
  if (!showTitle) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="glass-overlay border-glow"
          >
            <div className="text-center">
              <p className="font-semibold text-foreground">Level {level}</p>
              <p className="text-xs text-muted-foreground">{title}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}
