import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * POST /api/reviews/[id]/helpful
 * Increment the helpful count for a review
 * No authentication required - anyone can upvote
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;

    // Check if review exists and increment helpful count atomically
    const result = await db
      .update(reviews)
      .set({
        helpful: sql`${reviews.helpful} + 1`,
      })
      .where(eq(reviews.id, reviewId))
      .returning({ helpful: reviews.helpful });

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      helpful: result[0].helpful,
    });
  } catch (error) {
    console.error("Error updating helpful count:", error);
    return NextResponse.json(
      { error: "Failed to update helpful count" },
      { status: 500 }
    );
  }
}
