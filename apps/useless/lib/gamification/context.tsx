"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { showAchievementToast, showMultipleAchievementsToast, type AchievementToastData } from "@/components/gamification/AchievementUnlockedToast";

// Types for the gamification context
export interface UserProgress {
  totalXp: number;
  currentLevel: number;
  xpToNextLevel: number;
  currentLevelXp: number;
  title: string;
  nextTitle: string;
}

export interface WalletInfo {
  balance: string;
  lastClaimAt: Date | null;
  currentStreak: number;
  canClaim: boolean;
}

export interface UnlockedAchievement {
  achievementType: string;
  unlockedAt: Date;
}

interface GamificationContextType {
  // User progress
  progress: UserProgress | null;
  setProgress: (progress: UserProgress) => void;

  // Wallet & streaks
  wallet: WalletInfo | null;
  setWallet: (wallet: WalletInfo) => void;

  // Achievements
  unlockedAchievements: UnlockedAchievement[];
  setUnlockedAchievements: (achievements: UnlockedAchievement[]) => void;

  // Actions
  addXp: (amount: number, source: string) => void;
  unlockAchievement: (achievement: AchievementToastData) => void;
  unlockMultipleAchievements: (achievements: AchievementToastData[]) => void;
  claimDailyReward: () => Promise<{ success: boolean; amount: number; newStreak: number } | null>;

  // Level up state
  showLevelUp: boolean;
  levelUpData: { newLevel: number; newTitle: string } | null;
  dismissLevelUp: () => void;

  // Loading state
  isLoading: boolean;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number; newTitle: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // XP gain handler with level up detection
  const addXp = useCallback((amount: number, source: string) => {
    if (!progress) return;

    const newTotalXp = progress.totalXp + amount;
    // This would normally recalculate level from XP
    // For now, simplified logic
    const xpForNextLevel = progress.xpToNextLevel;
    const newCurrentLevelXp = progress.currentLevelXp + amount;

    if (newCurrentLevelXp >= xpForNextLevel) {
      // Level up!
      const newLevel = progress.currentLevel + 1;
      // Would fetch new title from LEVEL_NAMES
      const newTitle = `Level ${newLevel} Title`;

      setLevelUpData({ newLevel, newTitle });
      setShowLevelUp(true);

      setProgress({
        ...progress,
        totalXp: newTotalXp,
        currentLevel: newLevel,
        currentLevelXp: newCurrentLevelXp - xpForNextLevel,
        title: newTitle,
      });
    } else {
      setProgress({
        ...progress,
        totalXp: newTotalXp,
        currentLevelXp: newCurrentLevelXp,
      });
    }
  }, [progress]);

  // Achievement unlock handler
  const unlockAchievement = useCallback((achievement: AchievementToastData) => {
    showAchievementToast(achievement);

    // Add to local state
    setUnlockedAchievements(prev => [
      ...prev,
      { achievementType: achievement.id, unlockedAt: new Date() }
    ]);

    // Add XP if reward exists
    if (achievement.xpReward) {
      addXp(achievement.xpReward, `Achievement: ${achievement.title}`);
    }
  }, [addXp]);

  // Multiple achievements unlock
  const unlockMultipleAchievements = useCallback((achievements: AchievementToastData[]) => {
    showMultipleAchievementsToast(achievements);

    // Add all to local state
    const newAchievements = achievements.map(a => ({
      achievementType: a.id,
      unlockedAt: new Date()
    }));
    setUnlockedAchievements(prev => [...prev, ...newAchievements]);

    // Add total XP
    const totalXp = achievements.reduce((sum, a) => sum + (a.xpReward || 0), 0);
    if (totalXp > 0) {
      addXp(totalXp, "Multiple achievements unlocked");
    }
  }, [addXp]);

  // Daily reward claim
  const claimDailyReward = useCallback(async () => {
    try {
      const response = await fetch("/api/wallet/claim-daily", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to claim daily reward");
      }

      const data = await response.json();

      if (data.success && wallet) {
        setWallet({
          ...wallet,
          balance: data.newBalance,
          lastClaimAt: new Date(),
          currentStreak: data.streak,
          canClaim: false,
        });

        // Add XP for daily claim
        addXp(15, "Daily claim");
      }

      return data;
    } catch (error) {
      console.error("Failed to claim daily reward:", error);
      return null;
    }
  }, [wallet, addXp]);

  // Dismiss level up celebration
  const dismissLevelUp = useCallback(() => {
    setShowLevelUp(false);
    setLevelUpData(null);
  }, []);

  // Initial load effect would go here
  useEffect(() => {
    // This would fetch user's gamification data on mount
    // For now, just set loading to false
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        progress,
        setProgress,
        wallet,
        setWallet,
        unlockedAchievements,
        setUnlockedAchievements,
        addXp,
        unlockAchievement,
        unlockMultipleAchievements,
        claimDailyReward,
        showLevelUp,
        levelUpData,
        dismissLevelUp,
        isLoading,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
}
