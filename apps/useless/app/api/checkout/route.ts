import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items, shippingAddress, billingAddress, paymentMethod, shipping, tax, total } = body

    // Validate request
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    if (paymentMethod !== 'useless_bucks') {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Calculate subtotal from items
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    // Use transaction to ensure atomic operations
    const result = await db.transaction(async (tx) => {
      // 1. Get user's wallet
      const [wallet] = await tx
        .select()
        .from(schema.wallets)
        .where(eq(schema.wallets.userId, session.user.id))
        .limit(1)

      if (!wallet) {
        throw new Error('Wallet not found')
      }

      const currentBalance = parseFloat(wallet.balance)

      // 2. Check sufficient balance
      if (currentBalance < total) {
        throw new Error(
          `Insufficient balance. You have $${currentBalance.toFixed(2)} but need $${total.toFixed(2)}`
        )
      }

      // 3. Create order
      const orderId = crypto.randomUUID()
      const [order] = await tx
        .insert(schema.orders)
        .values({
          id: orderId,
          userId: session.user.id,
          status: 'confirmed',
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          tax: tax.toFixed(2),
          discount: '0.00',
          total: total.toFixed(2),
          shippingAddress,
          billingAddress,
          paymentMethod: 'useless_bucks',
        })
        .returning()

      // 4. Create order items
      for (const item of items) {
        await tx.insert(schema.orderItems).values({
          id: crypto.randomUUID(),
          orderId,
          productId: item.productId,
          name: item.name,
          price: item.price.toFixed(2),
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })
      }

      // 5. Deduct from wallet balance
      const newBalance = (currentBalance - total).toFixed(2)
      await tx
        .update(schema.wallets)
        .set({
          balance: newBalance,
          updatedAt: new Date(),
        })
        .where(eq(schema.wallets.userId, session.user.id))

      // 6. Create wallet transaction record
      await tx.insert(schema.walletTransactions).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        amount: `-${total.toFixed(2)}`,
        type: 'purchase',
        description: `Purchase - Order ${orderId.slice(0, 8)}`,
        orderId,
      })

      // 7. Check for first purchase achievement
      const [existingOrders] = await tx
        .select()
        .from(schema.orders)
        .where(eq(schema.orders.userId, session.user.id))

      if (!existingOrders || existingOrders === order) {
        // This is their first order - award achievement
        const [existingAchievement] = await tx
          .select()
          .from(schema.userAchievements)
          .where(eq(schema.userAchievements.userId, session.user.id))
          .limit(1)

        if (!existingAchievement) {
          await tx.insert(schema.userAchievements).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            achievementType: 'first_purchase',
          })
        }
      }

      return { orderId, newBalance }
    })

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      newBalance: result.newBalance,
      message: 'Order placed successfully!',
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process order' },
      { status: 500 }
    )
  }
}
