"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Star, PenLine } from "lucide-react";
import { Button } from "@ggprompts/ui";
import { Progress } from "@ggprompts/ui";
import { cn } from "@ggprompts/ui";

interface ReviewsSummaryProps {
  reviews: Array<{ rating: number }>;
  averageRating?: number;
  onWriteReview?: () => void;
  className?: string;
}

export function ReviewsSummary({
  reviews,
  averageRating,
  onWriteReview,
  className,
}: ReviewsSummaryProps) {
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: [0, 0, 0, 0, 0],
        percentages: [0, 0, 0, 0, 0],
      };
    }

    // Count reviews by rating (index 0 = 5 stars, index 4 = 1 star for display)
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[5 - review.rating]++;
      }
    });

    // Calculate percentages
    const percentages = distribution.map((count) =>
      reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
    );

    // Calculate average if not provided
    const calculatedAverage =
      averageRating ??
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    return {
      average: calculatedAverage,
      total: reviews.length,
      distribution,
      percentages,
    };
  }, [reviews, averageRating]);

  const ratingLabels = ["5", "4", "3", "2", "1"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass rounded-lg p-6", className)}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Average Rating Display */}
        <div className="flex flex-col items-center text-center lg:min-w-[160px]">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="text-5xl font-bold text-foreground terminal-glow mb-2"
          >
            {stats.average > 0 ? stats.average.toFixed(1) : "-"}
          </motion.div>

          {/* Star Display */}
          <div className="flex gap-0.5 mb-2" aria-label={`Average rating: ${stats.average.toFixed(1)} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.round(stats.average)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Based on {stats.total} {stats.total === 1 ? "review" : "reviews"}
          </p>

          {stats.total === 0 && (
            <p className="text-xs text-muted-foreground mt-1 italic">
              (No useless opinions yet)
            </p>
          )}
        </div>

        {/* Rating Distribution Bars */}
        <div className="flex-1 space-y-2.5">
          {ratingLabels.map((label, index) => {
            const count = stats.distribution[index];
            const percentage = stats.percentages[index];

            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                {/* Star Label */}
                <div className="flex items-center gap-1 min-w-[50px]">
                  <span className="text-sm font-medium text-foreground w-3">
                    {label}
                  </span>
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                </div>

                {/* Progress Bar */}
                <div className="flex-1">
                  <Progress
                    value={percentage}
                    className="h-2.5 bg-muted/50"
                  />
                </div>

                {/* Count and Percentage */}
                <div className="min-w-[80px] text-right">
                  <span className="text-sm text-muted-foreground">
                    {count} ({percentage}%)
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Write Review CTA */}
      {onWriteReview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-border/50"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-medium text-foreground">
                Share your useless experience
              </h4>
              <p className="text-sm text-muted-foreground">
                Your opinion matters... to absolutely no one, but write it anyway!
              </p>
            </div>
            <Button onClick={onWriteReview} className="shrink-0">
              <PenLine className="h-4 w-4" />
              Write a Review
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
