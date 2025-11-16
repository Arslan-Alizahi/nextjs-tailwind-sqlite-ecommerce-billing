import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { apiResponse, apiError } from '@/lib/utils'

/**
 * Stripe Webhook Handler
 * This endpoint will be called by Stripe when payment events occur
 * For now, it's a placeholder for future webhook integration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    console.log('Stripe webhook received:', type)

    const db = getDb()

    // Handle different webhook events
    switch (type) {
      case 'checkout.session.completed':
        // Payment Link checkout session completed
        const session = data.object
        const sessionOrderId = session.metadata?.order_id

        if (sessionOrderId && session.payment_status === 'paid') {
          // Update order status
          db.prepare(`
            UPDATE orders
            SET payment_status = 'paid',
                payment_method = 'stripe',
                stripe_session_id = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(session.id, sessionOrderId)

          console.log(`✓ Order ${sessionOrderId} marked as paid via checkout.session.completed webhook`)
          console.log(`✓ Revenue transaction created by database trigger`)
        }
        break

      case 'payment_intent.succeeded':
        // Direct Payment Intent succeeded
        const paymentIntent = data.object
        const orderId = paymentIntent.metadata?.order_id

        if (orderId) {
          // Update order status
          db.prepare(`
            UPDATE orders
            SET payment_status = 'paid',
                payment_method = 'stripe',
                stripe_payment_intent_id = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(paymentIntent.id, orderId)

          console.log(`✓ Order ${orderId} marked as paid via payment_intent.succeeded webhook`)
          console.log(`✓ Revenue transaction created by database trigger`)
        }
        break

      case 'payment_intent.payment_failed':
        // Payment failed
        const failedPayment = data.object
        const failedOrderId = failedPayment.metadata?.order_id

        if (failedOrderId) {
          db.prepare(`
            UPDATE orders 
            SET payment_status = 'failed',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(failedOrderId)

          console.log(`Order ${failedOrderId} marked as failed via webhook`)
        }
        break

      default:
        console.log(`Unhandled webhook event: ${type}`)
    }

    return NextResponse.json(apiResponse({ received: true }))
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      apiError(error.message || 'Webhook processing failed'),
      { status: 500 }
    )
  }
}

