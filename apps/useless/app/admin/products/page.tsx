import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { ProductsTable } from "./ProductsTable";
import { Package, Plus } from "lucide-react";
import { Button } from "@ggprompts/ui";
import Link from "next/link";

export default async function AdminProductsPage() {
  // Ensure user is admin
  await requireAdmin();

  // Fetch all products from database
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  // Get unique categories for the filter
  const categories = [...new Set(allProducts.map((p) => p.category))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 glass border border-border/20 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground terminal-glow">
              Products
            </h1>
            <p className="text-sm text-muted-foreground">
              Managing {allProducts.length} imaginary item{allProducts.length !== 1 ? "s" : ""} that will never ship
            </p>
          </div>
        </div>

        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      <ProductsTable products={allProducts} categories={categories} />
    </div>
  );
}
