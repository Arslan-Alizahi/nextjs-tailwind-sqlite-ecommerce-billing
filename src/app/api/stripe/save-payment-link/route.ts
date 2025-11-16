import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { apiResponse, apiError } from '@/lib/utils'

/**
 * POST /api/stripe/save-payment-link
 * Save Stripe payment link details to database
 * This endpoint is called after Stripe resources are created via MCP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      orderId,
      stripeProductId,
      stripePriceId,
      stripePaymentLinkId,
      stripePaymentLinkUrl
    } = body

    if (!orderId || !stripePaymentLinkUrl) {
      return NextResponse.json(
        apiError('Order ID and payment link URL are required'),
        { status: 400 }
      )
    }

    const db = getDb()

    // Update order with Stripe details
    db.prepare(`
      UPDATE orders 
      SET stripe_product_id = ?,
          stripe_price_id = ?,
          stripe_payment_link_id = ?,
          stripe_payment_link_url = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      stripeProductId || null,
      stripePriceId || null,
      stripePaymentLinkId || null,
      stripePaymentLinkUrl,
      orderId
    )

    // Fetch updated order
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any

    return NextResponse.json(
      apiResponse({
        orderId: order.id,
        orderNumber: order.order_number,
        paymentUrl: order.stripe_payment_link_url,
        message: 'Stripe payment link saved successfully'
      })
    )
  } catch (error: any) {
    console.error('Error saving payment link:', error)
    return NextResponse.json(
      apiError(error.message || 'Failed to save payment link'),
      { status: 500 }
    )
  }
}

