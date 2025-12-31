import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { CartPageClient } from './CartPageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cart | Useless.io',
  description: 'Review your cart of wonderfully useless products.',
}

export default async function CartPage() {
  // Fetch random products for recommendations
  const recommendedProducts = await db
    .select()
    .from(products)
    .where(eq(products.inStock, true))
    .orderBy(sql`RANDOM()`)
    .limit(6)

  return <CartPageClient recommendedProducts={recommendedProducts} />
}
