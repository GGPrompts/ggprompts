"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@ggprompts/ui";

const ABSURD_MESSAGES = [
  "Calculating the meaning of life...",
  "Consulting our pet hamster...",
  "Pretending to work...",
  "Bribing the servers...",
  "Loading uselessness...",
  "Reticulating splines...",
  "Generating random excuse...",
  "Warming up the toaster...",
  "Asking ChatGPT for help...",
  "Converting caffeine to code...",
  "Downloading more RAM...",
  "Questioning existence...",
  "Buffering... forever...",
  "Untangling the internet...",
  "Feeding the code monkeys...",
  "Dividing by zero...",
  "Compiling excuses...",
  "Negotiating with pixels...",
  "Summoning dark mode...",
  "Counting to infinity...",
  "Rebooting the matrix...",
  "Polishing invisible buttons...",
  "Calibrating nonsense...",
  "Spinning the hamster wheel...",
  "Defragmenting reality...",
];

interface AbsurdLoaderProps {
  className?: string;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AbsurdLoader({
  className,
  showProgress = true,
  size = "md",
}: AbsurdLoaderProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isGoingBackwards, setIsGoingBackwards] = useState(false);

  // Rotate through messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % ABSURD_MESSAGES.length);
    }, 2500);

    return () => clearInterval(messageInterval);
  }, []);

  // Progress bar that sometimes goes backwards
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Randomly decide to go backwards (10% chance)
        if (Math.random() < 0.1 && prev > 20) {
          setIsGoingBackwards(true);
          return prev - Math.random() * 15;
        }

        setIsGoingBackwards(false);

        // Normal forward progress
        if (prev >= 95) {
          // Reset back to somewhere between 20-40 (never actually complete)
          return 20 + Math.random() * 20;
        }

        return prev + Math.random() * 8;
      });
    }, 300);

    return () => clearInterval(progressInterval);
  }, []);

  const getRandomMessage = useCallback(() => {
    return ABSURD_MESSAGES[currentMessage];
  }, [currentMessage]);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const spinnerSizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-6 p-8",
        className
      )}
    >
      {/* Animated spinner */}
      <div className="relative">
        <motion.div
          className={cn(
            "rounded-full border-2 border-primary/30",
            spinnerSizes[size]
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute inset-0 rounded-full border-t-2 border-primary" />
        </motion.div>

        {/* Inner pulsing dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="h-2 w-2 rounded-full bg-primary" />
        </motion.div>
      </div>

      {/* Message display */}
      <div className="h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "text-muted-foreground font-mono",
              sizeClasses[size]
            )}
          >
            {getRandomMessage()}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar that goes backwards sometimes */}
      {showProgress && (
        <div className="w-full max-w-xs space-y-2">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
            <motion.div
              className={cn(
                "h-full rounded-full transition-colors duration-300",
                isGoingBackwards ? "bg-destructive" : "bg-primary"
              )}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Progress percentage with backwards indicator */}
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>
              {isGoingBackwards ? "Oops, going backwards..." : "Progress"}
            </span>
            <motion.span
              animate={{ color: isGoingBackwards ? "#ef4444" : undefined }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
        </div>
      )}

      {/* Fun fact / additional message */}
      <motion.p
        className="text-xs text-muted-foreground/60 text-center max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Fun fact: This loader will never actually complete. Much like our
        products, it serves no real purpose.
      </motion.p>
    </div>
  );
}

// Export messages for testing or custom implementations
export { ABSURD_MESSAGES };
