"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useWallet } from "./WalletProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export function WalletBalance() {
  const { data: session } = useSession();
  const { balance, isLoading } = useWallet();

  // Don't show wallet if user is not logged in
  if (!session?.user) {
    return null;
  }

  // Format balance as currency
  const formatBalance = (value: string | null) => {
    if (!value) return "$0.00";
    const num = parseFloat(value);
    return `$${num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-2 text-sm font-medium text-muted-foreground"
          >
            Loading...
          </motion.div>
        ) : (
          <motion.div
            key={balance || "0"}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-primary">
              {formatBalance(balance)} UB
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
