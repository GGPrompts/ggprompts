"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@ggprompts/ui";
import { cn } from "@ggprompts/ui";

const STORAGE_KEY = "useless-cookie-consent";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Small delay before showing banner for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = (choice: "accept" | "reject") => {
    setIsExiting(true);
    // Store the choice (both do the same thing)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        choice,
        timestamp: new Date().toISOString(),
        message:
          choice === "accept"
            ? "User accepted their fate"
            : "User rejected hope (same result)",
      })
    );

    // Wait for exit animation
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-4xl">
            <div className="glass-dark rounded-lg p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Cookie icon */}
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20"
                  >
                    <span className="text-2xl" role="img" aria-label="cookie">
                      {"\u{1F36A}"}
                    </span>
                  </motion.div>
                </div>

                {/* Text content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    This site uses cookies
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Not the good kind. These cookies track absolutely nothing
                    useful, just like our products. They exist purely to annoy
                    you with this banner.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => handleDismiss("accept")}
                    className="w-full sm:w-auto"
                    variant="default"
                  >
                    Accept Sadness
                  </Button>
                  <Button
                    onClick={() => handleDismiss("reject")}
                    className="w-full sm:w-auto"
                    variant="outline"
                  >
                    Reject Hope
                  </Button>
                </div>

                {/* Close button (mobile) */}
                <button
                  onClick={() => handleDismiss("accept")}
                  className="absolute top-2 right-2 sm:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close cookie banner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Fine print */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs text-muted-foreground/60 mt-4 text-center"
              >
                Disclaimer: Both buttons do exactly the same thing. Free will is
                an illusion.
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
