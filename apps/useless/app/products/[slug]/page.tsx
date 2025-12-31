import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { products, reviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) {
    return {
      title: "Product Not Found | Useless.io",
    };
  }

  return {
    title: `${product.name} | Useless.io`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  // Fetch product
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) {
    notFound();
  }

  // Fetch product reviews
  const productReviews = await db.query.reviews.findMany({
    where: eq(reviews.productId, product.id),
    with: {
      user: {
        columns: {
          name: true,
          image: true,
        },
      },
    },
    limit: 10,
  });

  // Fetch related products (same category, excluding current product)
  const relatedProducts = await db.query.products.findMany({
    where: eq(products.category, product.category),
    limit: 5,
  });

  const filteredRelatedProducts = relatedProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      reviews={productReviews}
      relatedProducts={filteredRelatedProducts}
    />
  );
}
