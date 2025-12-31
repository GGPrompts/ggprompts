import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
  })
}

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CheckoutBody {
  items: CheckoutItem[]
  shippingAddress?: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

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

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        fallback: true,
        message: 'Stripe integration pending - use UselessBucks for now!',
      })
    }

    const body: CheckoutBody = await request.json()
    const { items, shippingAddress } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = 0 // Free shipping for useless products
    const tax = 0 // No tax on imaginary goods
    const total = subtotal + shipping + tax

    // Create pending order in database
    const orderId = crypto.randomUUID()
    await db.insert(schema.orders).values({
      id: orderId,
      userId: session.user.id,
      status: 'pending',
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      discount: '0.00',
      total: total.toFixed(2),
      shippingAddress: shippingAddress || null,
      paymentMethod: 'stripe',
    })

    // Create order items
    await db.insert(schema.orderItems).values(
      items.map((item) => ({
        id: crypto.randomUUID(),
        orderId,
        productId: item.id,
        name: item.name,
        price: item.price.toFixed(2),
        quantity: item.quantity,
      }))
    )

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const stripe = getStripe()

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId,
        userId: session.user.id,
      },
      success_url: `${baseUrl}/order-confirmation/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?cancelled=true`,
    })

    return NextResponse.json({
      url: checkoutSession.url,
      orderId,
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
