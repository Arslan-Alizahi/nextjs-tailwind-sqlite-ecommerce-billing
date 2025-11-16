import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { stripe } from '@/lib/stripe'

/**
 * Verify Payment and Update Order Status
 * This endpoint is called after successful Stripe payment
 * It retrieves the checkout session, updates the order status, and redirects to success page
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      // Redirect to home if no session ID
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (!stripe) {
      throw new Error('Stripe is not configured')
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items']
    })

    console.log('✓ Retrieved Stripe session:', sessionId)

    // Get orderId from metadata
    const orderId = session.metadata?.order_id

    if (!orderId) {
      console.error('No orderId found in session metadata')
      return NextResponse.redirect(new URL('/', request.url))
    }

    const db = getDb()

    // Check current order status
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any

    if (!order) {
      console.error('Order not found:', orderId)
      return NextResponse.redirect(new URL('/', request.url))
    }

    console.log('Order before update:', {
      id: order.id,
      order_number: order.order_number,
      payment_status: order.payment_status
    })

    // Update order status to 'paid' if payment was successful
    if (session.payment_status === 'paid' && order.payment_status !== 'paid') {
      db.prepare(`
        UPDATE orders
        SET payment_status = 'paid',
            payment_method = 'stripe',
            stripe_session_id = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(sessionId, orderId)

      console.log('✓ Order marked as paid:', orderId)
      console.log('✓ Revenue transaction will be created by database trigger')
    } else if (order.payment_status === 'paid') {
      console.log('Order already marked as paid:', orderId)
    } else {
      console.log('Payment not completed. Session status:', session.payment_status)
    }

    // Redirect to success page with orderId
    const successUrl = new URL('/order/success', request.url)
    successUrl.searchParams.set('orderId', orderId)

    return NextResponse.redirect(successUrl)
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    // Redirect to home on error
    return NextResponse.redirect(new URL('/', request.url))
  }
}
