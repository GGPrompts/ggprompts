import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { or, ilike, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({ products: [], count: 0 }, { status: 200 });
    }

    // Search products by name, description, brand (case-insensitive)
    const searchPattern = `%${query}%`;

    const results = await db
      .select()
      .from(products)
      .where(
        or(
          ilike(products.name, searchPattern),
          ilike(products.description, searchPattern),
          ilike(products.brand, searchPattern)
        )
      )
      .limit(20);

    return NextResponse.json(
      {
        products: results,
        count: results.length,
        query,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search products", products: [], count: 0 },
      { status: 500 }
    );
  }
}
