import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { apiResponse, apiError } from '@/lib/utils'
import {
  isStripeConfigured,
  createStripeProduct,
  createStripePrice,
  createStripePaymentLink
} from '@/lib/stripe'

// POST /api/stripe/create-payment - Create Stripe payment link for order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        apiError('Order ID is required'),
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return NextResponse.json(
        apiError('Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.'),
        { status: 500 }
      )
    }

    const db = getDb()

    // Fetch order details
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any

    if (!order) {
      return NextResponse.json(
        apiError('Order not found'),
        { status: 404 }
      )
    }

    // Check if order is already paid
    if (order.payment_status === 'paid' || order.payment_status === 'completed') {
      return NextResponse.json(
        apiError('Order is already paid'),
        { status: 400 }
      )
    }

    // Check if payment link already exists for this order
    if (order.stripe_payment_link_url) {
      // Return existing payment link
      return NextResponse.json(
        apiResponse({
          orderId: order.id,
          orderNumber: order.order_number,
          amount: order.total,
          currency: 'usd',
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          paymentUrl: order.stripe_payment_link_url,
          message: 'Payment link already exists'
        })
      )
    }

    // Create Stripe payment link
    console.log('Creating Stripe payment for order:', order.order_number)

    // Step 1: Create Product in Stripe
    const productName = `Order ${order.order_number}`
    const productDescription = `Payment for order ${order.order_number} - ${order.customer_name}`

    const stripeProduct = await createStripeProduct(productName, productDescription)
    console.log('✓ Stripe product created:', stripeProduct.id)

    // Step 2: Create Price in Stripe (amount in cents)
    const amountInCents = Math.round(order.total * 100)
    const stripePrice = await createStripePrice(stripeProduct.id, amountInCents, 'usd')
    console.log('✓ Stripe price created:', stripePrice.id)

    // Step 3: Create Payment Link in Stripe
    const stripePaymentLink = await createStripePaymentLink(
      stripePrice.id,
      1,
      {
        order_id: order.id.toString(),
        order_number: order.order_number
      }
    )
    console.log('✓ Stripe payment link created:', stripePaymentLink.url)

    // Step 4: Save Stripe details to database
    db.prepare(`
      UPDATE orders
      SET stripe_product_id = ?,
          stripe_price_id = ?,
          stripe_payment_link_id = ?,
          stripe_payment_link_url = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      stripeProduct.id,
      stripePrice.id,
      stripePaymentLink.id,
      stripePaymentLink.url,
      orderId
    )

    console.log('✓ Stripe details saved to database')

    return NextResponse.json(
      apiResponse({
        orderId: order.id,
        orderNumber: order.order_number,
        amount: order.total,
        currency: 'usd',
        customerEmail: order.customer_email,
        customerName: order.customer_name,
        paymentUrl: stripePaymentLink.url,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
        stripePaymentLinkId: stripePaymentLink.id,
        message: 'Stripe payment link created successfully'
      })
    )
  } catch (error: any) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      apiError(error.message || 'Failed to create payment'),
      { status: 500 }
    )
  }
}

