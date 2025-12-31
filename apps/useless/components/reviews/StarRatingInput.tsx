"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@ggprompts/ui";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-9 w-9",
};

const starLabels = [
  "Absolutely Useless",
  "Mostly Useless",
  "Somewhat Useless",
  "Surprisingly Useless",
  "Perfectly Useless",
];

export function StarRatingInput({
  value,
  onChange,
  maxStars = 5,
  size = "md",
  disabled = false,
  className,
  id,
  "aria-label": ariaLabel = "Rate this product",
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  const handleClick = useCallback(
    (rating: number) => {
      if (!disabled) {
        onChange(rating);
      }
    },
    [disabled, onChange]
  );

  const handleMouseEnter = useCallback(
    (rating: number) => {
      if (!disabled) {
        setHoverValue(rating);
      }
    },
    [disabled]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverValue(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          onChange(Math.min(value + 1, maxStars));
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          onChange(Math.max(value - 1, 0));
          break;
        case "Home":
          e.preventDefault();
          onChange(1);
          break;
        case "End":
          e.preventDefault();
          onChange(maxStars);
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
          e.preventDefault();
          const num = parseInt(e.key);
          if (num <= maxStars) {
            onChange(num);
          }
          break;
      }
    },
    [disabled, onChange, value, maxStars]
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        id={id}
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={maxStars}
        aria-valuenow={value}
        aria-valuetext={value > 0 ? `${value} out of ${maxStars} stars: ${starLabels[value - 1]}` : "No rating selected"}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "flex gap-1 outline-none rounded-sm",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
      >
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayValue;
          const isActive = starValue === displayValue;

          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              disabled={disabled}
              whileHover={!disabled ? { scale: 1.15 } : undefined}
              whileTap={!disabled ? { scale: 0.95 } : undefined}
              animate={isActive && !disabled ? { scale: [1, 1.2, 1] } : undefined}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative cursor-pointer transition-colors focus:outline-none",
                disabled && "cursor-not-allowed"
              )}
              aria-hidden="true"
              tabIndex={-1}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-all duration-150",
                  isFilled
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
                    : "text-muted-foreground/40 hover:text-muted-foreground/60"
                )}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Rating Label */}
      <motion.p
        key={displayValue}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "text-sm font-medium h-5",
          displayValue > 0 ? "text-primary terminal-glow" : "text-muted-foreground"
        )}
      >
        {displayValue > 0 ? starLabels[displayValue - 1] : "Select a rating"}
      </motion.p>
    </div>
  );
}
