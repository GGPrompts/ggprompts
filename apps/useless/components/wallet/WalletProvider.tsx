"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";

interface WalletContextType {
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  claimDailyBonus: () => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    hoursRemaining?: number;
    minutesRemaining?: number;
    nextClaimAt?: string;
  }>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    // Don't fetch if user is not logged in
    if (!session?.user) {
      setBalance(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/wallet", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setBalance(null);
          return;
        }
        throw new Error(`Failed to fetch wallet: ${response.status}`);
      }

      const data = await response.json();
      setBalance(data.balance);
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  // Fetch balance when user logs in
  useEffect(() => {
    if (session?.user) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [session?.user, fetchBalance]);

  const claimDailyBonus = useCallback(async () => {
    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to claim the daily bonus",
      };
    }

    try {
      const response = await fetch("/api/wallet/claim", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Failed to claim bonus",
          hoursRemaining: data.hoursRemaining,
          minutesRemaining: data.minutesRemaining,
          nextClaimAt: data.nextClaimAt,
        };
      }

      // Update balance with new value
      setBalance(data.balance);

      return {
        success: true,
        message: data.message,
      };
    } catch (err) {
      console.error("Error claiming daily bonus:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to claim bonus",
      };
    }
  }, [session?.user]);

  const value: WalletContextType = {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
    claimDailyBonus,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
