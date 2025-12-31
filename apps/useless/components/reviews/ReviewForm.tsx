"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { StarRatingInput } from "./StarRatingInput";
import { Button } from "@ggprompts/ui";
import { Input } from "@ggprompts/ui";
import { Textarea } from "@ggprompts/ui";
import { Label } from "@ggprompts/ui";
import { cn } from "@ggprompts/ui";

interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
}

interface ReviewFormProps {
  productId: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onSuccess?: () => void;
  className?: string;
}

interface FormErrors {
  rating?: string;
  title?: string;
  content?: string;
}

const ABSURD_VALIDATION_MESSAGES = {
  rating: {
    required: "Please rate this product 1-5 stars. Even useless products deserve star ratings.",
  },
  content: {
    required: "Your review needs some content. Share your profound useless thoughts!",
    minLength: "Your review must be at least 10 characters. We know it's useless, but elaborate!",
  },
  title: {
    maxLength: "Your title is too long. Keep it short, like the product's usefulness.",
  },
};

const SUCCESS_MESSAGES = [
  "Thanks for your useless feedback!",
  "Your review has been submitted to the void!",
  "Another useless opinion recorded for posterity!",
  "Congratulations! Your review is now as useless as this product!",
];

export function ReviewForm({
  productId,
  onSubmit,
  onSuccess,
  className,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (rating === 0) {
      newErrors.rating = ABSURD_VALIDATION_MESSAGES.rating.required;
    }

    if (!content.trim()) {
      newErrors.content = ABSURD_VALIDATION_MESSAGES.content.required;
    } else if (content.trim().length < 10) {
      newErrors.content = ABSURD_VALIDATION_MESSAGES.content.minLength;
    }

    if (title.length > 100) {
      newErrors.title = ABSURD_VALIDATION_MESSAGES.title.maxLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit({
        rating,
        title: title.trim(),
        content: content.trim(),
      });

      // Show success state
      setIsSuccess(true);
      setSuccessMessage(SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]);

      // Reset form
      setRating(0);
      setTitle("");
      setContent("");

      // Call onSuccess callback
      onSuccess?.();

      // Hide success message after delay
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to submit review:", error);
      setErrors({
        content: "Failed to submit review. Please try again (if you really want to).",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass rounded-lg p-6", className)}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4 terminal-glow">
        Write a Review
      </h3>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
            >
              <Send className="h-8 w-8 text-primary" />
            </motion.div>
            <p className="text-primary font-medium terminal-glow">{successMessage}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Star Rating */}
            <div className="space-y-2">
              <Label htmlFor="rating" className="text-sm font-medium">
                Your Rating <span className="text-destructive">*</span>
              </Label>
              <StarRatingInput
                id="rating"
                value={rating}
                onChange={setRating}
                size="lg"
                disabled={isSubmitting}
                aria-label="Rate this product"
              />
              {errors.rating && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.rating}
                </motion.p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="review-title" className="text-sm font-medium">
                Review Title <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="review-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your useless experience..."
                maxLength={100}
                disabled={isSubmitting}
                className="glass-dark"
              />
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.title}
                </motion.p>
              )}
              <p className="text-xs text-muted-foreground text-right">
                {title.length}/100
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="review-content" className="text-sm font-medium">
                Your Review <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="review-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell us about your completely useless experience with this product. Don't hold back - we already know it's worthless!"
                rows={4}
                disabled={isSubmitting}
                className="glass-dark resize-none"
              />
              {errors.content && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.content}
                </motion.p>
              )}
              <p className="text-xs text-muted-foreground text-right">
                {content.length} characters {content.length < 10 && "(minimum 10)"}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Useless Opinion...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Review
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
