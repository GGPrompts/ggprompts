import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  reviews,
  products,
  users,
  orderItems,
  orders,
  wallets,
  walletTransactions,
} from "@/lib/db/schema";
import { eq, desc, sql, and, count } from "drizzle-orm";
import { headers } from "next/headers";

// Review bonus amount in UselessBucks
const REVIEW_BONUS = 25;

/**
 * GET /api/products/[slug]/reviews
 * Fetch reviews for a product with pagination and sorting
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const sort = searchParams.get("sort") || "recent";
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 1),
      50
    );
    const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0);

    // Find product by slug or ID (support both for backwards compatibility)
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(sql`${products.slug} = ${slug} OR ${products.id} = ${slug}`)
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const productId = product.id;

    // Determine sort order
    let orderByClause;
    switch (sort) {
      case "rating":
        orderByClause = desc(reviews.rating);
        break;
      case "helpful":
        orderByClause = desc(reviews.helpful);
        break;
      case "recent":
      default:
        orderByClause = desc(reviews.createdAt);
    }

    // Fetch reviews with user info
    const reviewsData = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        helpful: reviews.helpful,
        verified: reviews.verified,
        createdAt: reviews.createdAt,
        userName: users.name,
        userImage: users.image,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    const total = totalResult?.count || 0;
    const hasMore = offset + reviewsData.length < total;

    // Format response
    const formattedReviews = reviewsData.map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      helpful: review.helpful,
      verified: review.verified,
      createdAt: review.createdAt.toISOString(),
      user: {
        name: review.userName || "Anonymous",
        image: review.userImage,
      },
    }));

    return NextResponse.json({
      reviews: formattedReviews,
      total,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/[slug]/reviews
 * Create a new review for a product (requires authentication)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Parse and validate request body
    const body = await request.json();
    const { rating, title, content } = body;

    // Validate rating
    if (typeof rating !== "number" || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate content
    if (typeof content !== "string" || content.length < 10 || content.length > 2000) {
      return NextResponse.json(
        { error: "Content must be between 10 and 2000 characters" },
        { status: 400 }
      );
    }

    // Validate title (optional)
    if (title !== undefined && title !== null) {
      if (typeof title !== "string" || title.length > 100) {
        return NextResponse.json(
          { error: "Title must be 100 characters or less" },
          { status: 400 }
        );
      }
    }

    // Find product by slug or ID (support both for backwards compatibility)
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(sql`${products.slug} = ${slug} OR ${products.id} = ${slug}`)
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const productId = product.id;

    // Check if user already reviewed this product
    const [existingReview] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.userId, userId)))
      .limit(1);

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }

    // Check if user has purchased this product (for verified badge)
    const purchaseCheck = await db
      .select({ orderId: orderItems.orderId })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orderItems.productId, productId),
          eq(orders.userId, userId),
          eq(orders.status, "delivered")
        )
      )
      .limit(1);

    const isVerified = purchaseCheck.length > 0;

    // Create the review
    const reviewId = crypto.randomUUID();
    const newReview = {
      id: reviewId,
      productId,
      userId,
      rating,
      title: title || null,
      content,
      helpful: 0,
      verified: isVerified,
    };

    await db.insert(reviews).values(newReview);

    // Update product's average rating and review count
    const ratingResult = await db
      .select({
        avgRating: sql<string>`ROUND(AVG(${reviews.rating})::numeric, 1)`,
        reviewCount: count(),
      })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    const { avgRating, reviewCount } = ratingResult[0];

    await db
      .update(products)
      .set({
        rating: avgRating || "0",
        reviewCount: reviewCount,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    // Give user review bonus in UselessBucks
    const [wallet] = await db
      .select({ id: wallets.id, balance: wallets.balance })
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (wallet) {
      const newBalance = (parseFloat(wallet.balance) + REVIEW_BONUS).toFixed(2);

      await db
        .update(wallets)
        .set({
          balance: newBalance,
          updatedAt: new Date(),
        })
        .where(eq(wallets.id, wallet.id));

      // Record the transaction
      await db.insert(walletTransactions).values({
        id: crypto.randomUUID(),
        userId,
        amount: REVIEW_BONUS.toFixed(2),
        type: "review_bonus",
        description: `Bonus for reviewing a product`,
      });
    }

    // Fetch the created review with user info for response
    const [createdReview] = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        helpful: reviews.helpful,
        verified: reviews.verified,
        createdAt: reviews.createdAt,
        userName: users.name,
        userImage: users.image,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.id, reviewId))
      .limit(1);

    return NextResponse.json(
      {
        review: {
          id: createdReview.id,
          rating: createdReview.rating,
          title: createdReview.title,
          content: createdReview.content,
          helpful: createdReview.helpful,
          verified: createdReview.verified,
          createdAt: createdReview.createdAt.toISOString(),
          user: {
            name: createdReview.userName || "Anonymous",
            image: createdReview.userImage,
          },
        },
        bonusAwarded: REVIEW_BONUS,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
