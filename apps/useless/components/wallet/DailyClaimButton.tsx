"use client";

import React, { useState } from "react";
import { useWallet } from "./WalletProvider";
import { useSession } from "@/lib/auth-client";
import { Button } from "@ggprompts/ui";
import { Gift, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ggprompts/ui";

export function DailyClaimButton() {
  const { data: session } = useSession();
  const { claimDailyBonus } = useWallet();
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);
  const [cooldownInfo, setCooldownInfo] = useState<{
    hoursRemaining?: number;
    minutesRemaining?: number;
    nextClaimAt?: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Don't show button if user is not logged in
  if (!session?.user) {
    return null;
  }

  const handleClaim = async () => {
    setIsClaimingBonus(true);
    setSuccessMessage(null);
    setCooldownInfo(null);

    try {
      const result = await claimDailyBonus();

      if (result.success) {
        setSuccessMessage(result.message || "Daily bonus claimed!");

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        // Handle cooldown error
        if (result.hoursRemaining !== undefined) {
          setCooldownInfo({
            hoursRemaining: result.hoursRemaining,
            minutesRemaining: result.minutesRemaining,
            nextClaimAt: result.nextClaimAt,
          });
        }
      }
    } catch (error) {
      console.error("Error claiming bonus:", error);
    } finally {
      setIsClaimingBonus(false);
    }
  };

  // Format cooldown time
  const formatCooldown = () => {
    if (!cooldownInfo) return "";

    const { hoursRemaining, minutesRemaining } = cooldownInfo;

    if (hoursRemaining === undefined || minutesRemaining === undefined) {
      return "";
    }

    if (hoursRemaining > 0) {
      return `${hoursRemaining}h remaining`;
    } else if (minutesRemaining > 0) {
      return `${minutesRemaining}m remaining`;
    }

    return "Available soon!";
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClaim}
              disabled={isClaimingBonus || !!cooldownInfo}
              variant={cooldownInfo ? "outline" : "default"}
              size="sm"
              className="relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isClaimingBonus ? (
                  <motion.div
                    key="claiming"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Claiming...</span>
                  </motion.div>
                ) : cooldownInfo ? (
                  <motion.div
                    key="cooldown"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    <span>{formatCooldown()}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="available"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Gift className="h-4 w-4" />
                    <span>Claim Daily $100</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {cooldownInfo
              ? `Come back in ${formatCooldown()}`
              : "Claim your daily $100 UselessBucks!"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Success message overlay */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg backdrop-blur-sm">
              {successMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
