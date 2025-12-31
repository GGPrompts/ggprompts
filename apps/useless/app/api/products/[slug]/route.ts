import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, ne, sql } from "drizzle-orm";

// GET /api/products/[slug]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch the product by slug
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch related products (same category, excluding current product, limit 4)
    const relatedProducts = await db
      .select()
      .from(products)
      .where(
        sql`${products.category} = ${product.category} AND ${products.id} != ${product.id}`
      )
      .limit(4);

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
