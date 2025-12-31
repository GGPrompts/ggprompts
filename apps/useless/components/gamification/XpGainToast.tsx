"use client";

import { toast } from "sonner";
import { cn } from "@ggprompts/ui";
import { Sparkles, Star, TrendingUp } from "lucide-react";

interface XpGainToastOptions {
  amount: number;
  source: string;
  icon?: "sparkles" | "star" | "trending";
}

/**
 * Show an XP gain toast notification
 * Uses the sonner toast library already configured in the app
 */
export function showXpGainToast({ amount, source, icon = "sparkles" }: XpGainToastOptions) {
  const IconComponent = {
    sparkles: Sparkles,
    star: Star,
    trending: TrendingUp,
  }[icon];

  toast.custom(
    (t) => (
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg",
          "glass border border-primary/40",
          "shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]",
          "animate-in slide-in-from-bottom-5 fade-in duration-300"
        )}
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20">
          <IconComponent className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-primary terminal-glow">
            +{amount} XP
          </span>
          <span className="text-xs text-muted-foreground">{source}</span>
        </div>
      </div>
    ),
    {
      duration: 3000,
      position: "bottom-right",
    }
  );
}

/**
 * Show multiple XP gains at once (e.g., purchase + bonus)
 */
export function showMultipleXpGains(
  gains: Array<{ amount: number; source: string }>
) {
  const totalXp = gains.reduce((sum, g) => sum + g.amount, 0);

  toast.custom(
    (t) => (
      <div
        className={cn(
          "flex flex-col gap-2 px-4 py-3 rounded-lg",
          "glass border border-primary/40",
          "shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]",
          "animate-in slide-in-from-bottom-5 fade-in duration-300"
        )}
      >
        {/* Individual gains */}
        {gains.map((gain, index) => (
          <div key={index} className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-primary/70" />
            <span className="text-sm text-primary/80">+{gain.amount} XP</span>
            <span className="text-xs text-muted-foreground">- {gain.source}</span>
          </div>
        ))}

        {/* Total divider */}
        {gains.length > 1 && (
          <>
            <div className="h-px bg-border/50 my-1" />
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-primary terminal-glow">
                +{totalXp} XP Total
              </span>
            </div>
          </>
        )}
      </div>
    ),
    {
      duration: 4000,
      position: "bottom-right",
    }
  );
}

/**
 * XP source constants for consistent naming
 */
export const XP_SOURCES = {
  PURCHASE: "Purchase reward",
  REVIEW: "Review submitted",
  DAILY_CLAIM: "Daily claim bonus",
  ACHIEVEMENT: "Achievement unlocked",
  REFERRAL: "Referral bonus",
  PROFILE_COMPLETION: "Profile completed",
  FIRST_PURCHASE: "First purchase bonus",
  STREAK_BONUS: "Streak bonus",
} as const;

export type XpSourceType = (typeof XP_SOURCES)[keyof typeof XP_SOURCES];
