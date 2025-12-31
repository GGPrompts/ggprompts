"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@ggprompts/ui";

const CELEBRATION_MESSAGES = [
  "CONGRATULATIONS! You've successfully wasted money!",
  "Achievement Unlocked: Impulsive Buyer",
  "Your useless item is on its way to do nothing!",
  "The economy thanks you for your contribution to uselessness.",
  "You did it! We're not sure what, but you did it!",
  "Transaction complete! Regret pending...",
  "Money well... spent? Sure, let's go with that.",
  "Your credit card weeps, but we're celebrating!",
  "One small purchase for you, one giant leap for uselessness!",
  "Welcome to the club of questionable decisions!",
];

const CONFETTI_COLORS = [
  "#ff6b6b", // coral red
  "#4ecdc4", // teal
  "#45b7d1", // sky blue
  "#96ceb4", // sage green
  "#ffeaa7", // pale yellow
  "#dfe6e9", // light gray
  "#a29bfe", // lavender
  "#fd79a8", // pink
  "#00cec9", // cyan
  "#fab1a0", // peach
];

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
  shape: "square" | "circle" | "triangle";
}

interface CelebrationContextType {
  celebrate: () => void;
  isActive: boolean;
}

const CelebrationContext = createContext<CelebrationContextType | null>(null);

export function useCelebration() {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error(
      "useCelebration must be used within a PurchaseCelebrationProvider"
    );
  }
  return context;
}

interface PurchaseCelebrationProviderProps {
  children: React.ReactNode;
}

export function PurchaseCelebrationProvider({
  children,
}: PurchaseCelebrationProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState("");
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateConfetti = useCallback((): ConfettiPiece[] => {
    const pieces: ConfettiPiece[] = [];
    const shapes: ("square" | "circle" | "triangle")[] = [
      "square",
      "circle",
      "triangle",
    ];

    for (let i = 0; i < 150; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100, // percentage across screen
        delay: Math.random() * 0.5, // staggered start
        duration: 2 + Math.random() * 2, // 2-4 seconds to fall
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 8 + Math.random() * 8, // 8-16px
        rotation: Math.random() * 360,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    return pieces;
  }, []);

  const celebrate = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Pick a random message
    const randomMessage =
      CELEBRATION_MESSAGES[
        Math.floor(Math.random() * CELEBRATION_MESSAGES.length)
      ];

    setMessage(randomMessage);
    setConfetti(generateConfetti());
    setIsActive(true);

    // Auto-dismiss after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, 5000);
  }, [generateConfetti]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDismiss = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsActive(false);
  };

  return (
    <CelebrationContext.Provider value={{ celebrate, isActive }}>
      {children}

      {/* Celebration overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          >
            {/* Confetti layer */}
            <div className="absolute inset-0">
              {confetti.map((piece) => (
                <motion.div
                  key={piece.id}
                  initial={{
                    x: `${piece.x}vw`,
                    y: -20,
                    rotate: piece.rotation,
                    opacity: 1,
                  }}
                  animate={{
                    y: "110vh",
                    rotate: piece.rotation + 720,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: piece.duration,
                    delay: piece.delay,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    width: piece.size,
                    height: piece.size,
                    backgroundColor:
                      piece.shape !== "triangle" ? piece.color : "transparent",
                    borderRadius: piece.shape === "circle" ? "50%" : 0,
                    borderLeft:
                      piece.shape === "triangle"
                        ? `${piece.size / 2}px solid transparent`
                        : undefined,
                    borderRight:
                      piece.shape === "triangle"
                        ? `${piece.size / 2}px solid transparent`
                        : undefined,
                    borderBottom:
                      piece.shape === "triangle"
                        ? `${piece.size}px solid ${piece.color}`
                        : undefined,
                  }}
                />
              ))}
            </div>

            {/* Message modal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 10 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                onClick={handleDismiss}
                className="cursor-pointer"
              >
                <div className="glass-overlay rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
                  {/* Trophy/Party emoji */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    className="text-6xl mb-4"
                    role="img"
                    aria-label="celebration"
                  >
                    {"\u{1F389}"}
                  </motion.div>

                  {/* Message */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-foreground mb-2"
                  >
                    {message}
                  </motion.h2>

                  {/* Subtext */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground text-sm mb-4"
                  >
                    Click anywhere to dismiss (or wait 5 seconds)
                  </motion.p>

                  {/* Fun badges */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-2"
                  >
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      <span role="img" aria-label="money">
                        {"\u{1F4B8}"}
                      </span>
                      Money: Gone
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-medium">
                      <span role="img" aria-label="broken heart">
                        {"\u{1F494}"}
                      </span>
                      Regret: Pending
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-medium">
                      <span role="img" aria-label="box">
                        {"\u{1F4E6}"}
                      </span>
                      Usefulness: 0%
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CelebrationContext.Provider>
  );
}

// Standalone component that can be triggered externally
interface PurchaseCelebrationProps {
  show: boolean;
  onComplete?: () => void;
}

export function PurchaseCelebration({
  show,
  onComplete,
}: PurchaseCelebrationProps) {
  const [internalShow, setInternalShow] = useState(false);
  const [message, setMessage] = useState("");
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show && !internalShow) {
      const randomMessage =
        CELEBRATION_MESSAGES[
          Math.floor(Math.random() * CELEBRATION_MESSAGES.length)
        ];
      setMessage(randomMessage);

      // Generate confetti
      const pieces: ConfettiPiece[] = [];
      const shapes: ("square" | "circle" | "triangle")[] = [
        "square",
        "circle",
        "triangle",
      ];
      for (let i = 0; i < 150; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
          color:
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: 8 + Math.random() * 8,
          rotation: Math.random() * 360,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }
      setConfetti(pieces);
      setInternalShow(true);

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setInternalShow(false);
        onComplete?.();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, internalShow, onComplete]);

  const handleDismiss = () => {
    setInternalShow(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {internalShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
        >
          {/* Confetti */}
          <div className="absolute inset-0">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{
                  x: `${piece.x}vw`,
                  y: -20,
                  rotate: piece.rotation,
                  opacity: 1,
                }}
                animate={{
                  y: "110vh",
                  rotate: piece.rotation + 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: "linear",
                }}
                style={{
                  position: "absolute",
                  width: piece.size,
                  height: piece.size,
                  backgroundColor:
                    piece.shape !== "triangle" ? piece.color : "transparent",
                  borderRadius: piece.shape === "circle" ? "50%" : 0,
                  borderLeft:
                    piece.shape === "triangle"
                      ? `${piece.size / 2}px solid transparent`
                      : undefined,
                  borderRight:
                    piece.shape === "triangle"
                      ? `${piece.size / 2}px solid transparent`
                      : undefined,
                  borderBottom:
                    piece.shape === "triangle"
                      ? `${piece.size}px solid ${piece.color}`
                      : undefined,
                }}
              />
            ))}
          </div>

          {/* Message modal */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-auto"
            onClick={handleDismiss}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="cursor-pointer"
            >
              <div
                className="glass-overlay rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl"
                onClick={handleDismiss}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="text-6xl mb-4"
                  role="img"
                  aria-label="celebration"
                >
                  {"\u{1F389}"}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  {message}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-sm mb-4"
                >
                  Click anywhere to dismiss (or wait 5 seconds)
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-2"
                >
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    <span role="img" aria-label="money">
                      {"\u{1F4B8}"}
                    </span>
                    Money: Gone
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-medium">
                    <span role="img" aria-label="broken heart">
                      {"\u{1F494}"}
                    </span>
                    Regret: Pending
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-medium">
                    <span role="img" aria-label="box">
                      {"\u{1F4E6}"}
                    </span>
                    Usefulness: 0%
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export messages for testing
export { CELEBRATION_MESSAGES };
