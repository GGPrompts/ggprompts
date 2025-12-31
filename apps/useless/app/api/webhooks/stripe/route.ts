import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
  })
}

function getWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET!
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  const stripe = getStripe()

  try {
    event = stripe.webhooks.constructEvent(body, signature, getWebhookSecret())
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId

  if (!orderId) {
    console.error('No orderId in session metadata')
    return
  }

  // Update order status to confirmed
  await db
    .update(schema.orders)
    .set({
      status: 'confirmed',
      stripePaymentIntentId: session.payment_intent as string,
      updatedAt: new Date(),
    })
    .where(eq(schema.orders.id, orderId))

  console.log(`Order ${orderId} confirmed via Stripe checkout`)
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId

  if (!orderId) {
    // Payment might not be from our checkout flow
    return
  }

  // Update order status to confirmed
  await db
    .update(schema.orders)
    .set({
      status: 'confirmed',
      stripePaymentIntentId: paymentIntent.id,
      updatedAt: new Date(),
    })
    .where(eq(schema.orders.id, orderId))

  console.log(`Order ${orderId} payment succeeded`)
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId

  if (!orderId) {
    return
  }

  // Update order status to cancelled
  await db
    .update(schema.orders)
    .set({
      status: 'cancelled',
      updatedAt: new Date(),
    })
    .where(eq(schema.orders.id, orderId))

  console.log(`Order ${orderId} payment failed`)
}
