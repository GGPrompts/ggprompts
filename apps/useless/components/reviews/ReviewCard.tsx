"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ggprompts/ui";
import { Badge } from "@ggprompts/ui";
import { Button } from "@ggprompts/ui";
import { cn } from "@ggprompts/ui";

export interface ReviewCardData {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string | null;
  content: string | null;
  helpful: number;
  verified: boolean;
  createdAt: Date;
  user?: {
    name: string | null;
    image: string | null;
  };
}

interface ReviewCardProps {
  review: ReviewCardData;
  onHelpful?: (reviewId: string) => Promise<void>;
  hasVoted?: boolean;
  className?: string;
}

export function ReviewCard({
  review,
  onHelpful,
  hasVoted = false,
  className,
}: ReviewCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [localHelpful, setLocalHelpful] = useState(review.helpful);
  const [localHasVoted, setLocalHasVoted] = useState(hasVoted);

  const handleHelpfulClick = async () => {
    if (localHasVoted || isVoting || !onHelpful) return;

    setIsVoting(true);
    try {
      await onHelpful(review.id);
      setLocalHelpful((prev) => prev + 1);
      setLocalHasVoted(true);
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      className={cn("glass rounded-lg p-5", className)}
    >
      {/* Header: User info and date */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            {review.user?.image ? (
              <AvatarImage src={review.user.image} alt={review.user.name || "User"} />
            ) : null}
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
              {getInitials(review.user?.name ?? null)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {review.user?.name || "Anonymous Buyer"}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        {review.verified && (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/30 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Verified Purchase
          </Badge>
        )}
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex" aria-label={`Rating: ${review.rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-foreground mb-2 terminal-glow">
          {review.title}
        </h4>
      )}

      {/* Content */}
      {review.content && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {review.content}
        </p>
      )}

      {/* Footer: Helpful voting */}
      <div className="flex items-center gap-3 pt-3 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHelpfulClick}
          disabled={localHasVoted || isVoting}
          className={cn(
            "text-xs gap-1.5 h-8",
            localHasVoted && "text-primary"
          )}
        >
          <ThumbsUp
            className={cn(
              "h-3.5 w-3.5",
              localHasVoted && "fill-primary"
            )}
          />
          {localHasVoted ? "Helpful" : "Was this helpful?"}
        </Button>
        {localHelpful > 0 && (
          <span className="text-xs text-muted-foreground">
            {localHelpful} {localHelpful === 1 ? "person" : "people"} found this useless... er, helpful
          </span>
        )}
      </div>
    </motion.div>
  );
}
