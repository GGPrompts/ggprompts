"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, SortAsc } from "lucide-react";
import { ReviewCard, ReviewCardData } from "./ReviewCard";
import { Button } from "@ggprompts/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ggprompts/ui";
import { cn } from "@ggprompts/ui";

type SortOption = "recent" | "highest" | "lowest" | "helpful";

interface ReviewsListProps {
  reviews: ReviewCardData[];
  onHelpful?: (reviewId: string) => Promise<void>;
  votedReviewIds?: Set<string>;
  pageSize?: number;
  className?: string;
}

export function ReviewsList({
  reviews,
  onHelpful,
  votedReviewIds = new Set(),
  pageSize = 5,
  className,
}: ReviewsListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [displayCount, setDisplayCount] = useState(pageSize);

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];

    switch (sortBy) {
      case "recent":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "highest":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        sorted.sort((a, b) => b.helpful - a.helpful);
        break;
    }

    return sorted;
  }, [reviews, sortBy]);

  const displayedReviews = sortedReviews.slice(0, displayCount);
  const hasMore = displayCount < reviews.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + pageSize, reviews.length));
  };

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "glass rounded-lg p-8 text-center",
          className
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 terminal-glow">
              No reviews yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Be the first to share your useless experience! Your completely unbiased opinion matters to absolutely no one.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>

        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value as SortOption);
              setDisplayCount(pageSize);
            }}
          >
            <SelectTrigger className="w-[160px] h-9 text-sm glass">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="glass-overlay">
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews List */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <ReviewCard
                review={review}
                onHelpful={onHelpful}
                hasVoted={votedReviewIds.has(review.id)}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Load More Button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-4"
        >
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="min-w-[200px]"
          >
            Load More Reviews ({reviews.length - displayCount} remaining)
          </Button>
        </motion.div>
      )}
    </div>
  );
}
