import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, and, gte, lte, ilike, desc, asc, or, sql } from "drizzle-orm";

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const inStock = searchParams.get("inStock") === "true";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const featured = searchParams.get("featured") === "true";
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build WHERE conditions dynamically
    const conditions = [];

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (brand) {
      conditions.push(eq(products.brand, brand));
    }

    if (inStock) {
      conditions.push(eq(products.inStock, true));
    }

    if (featured) {
      conditions.push(eq(products.featured, true));
    }

    if (minPrice) {
      conditions.push(gte(products.price, minPrice));
    }

    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice));
    }

    if (minRating) {
      conditions.push(gte(products.rating, minRating));
    }

    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      );
    }

    // Build ORDER BY clause
    let orderBy;
    switch (sort) {
      case "price-asc":
        orderBy = asc(products.price);
        break;
      case "price-desc":
        orderBy = desc(products.price);
        break;
      case "rating":
        orderBy = desc(products.rating);
        break;
      case "newest":
        orderBy = desc(products.createdAt);
        break;
      case "popular":
        orderBy = desc(products.reviewCount);
        break;
      case "featured":
        orderBy = desc(products.featured);
        break;
      default:
        orderBy = desc(products.createdAt);
    }

    // Execute query
    const query = db
      .select()
      .from(products)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const results = await query;

    // Get total count for pagination
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const [{ count }] = await countQuery;

    return NextResponse.json({
      products: results,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
