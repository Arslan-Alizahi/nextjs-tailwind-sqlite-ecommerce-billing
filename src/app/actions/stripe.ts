'use server'

import { getDb } from '@/lib/db'

/**
 * Server action to create Stripe payment for an order
 * This will be called from the frontend and will use Stripe MCP tools
 */
export async function createStripePayment(orderId: number) {
  try {
    const db = getDb()

    // Fetch order details
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    // Check if order is already paid
    if (order.payment_status === 'paid' || order.payment_status === 'completed') {
      return {
        success: false,
        error: 'Order is already paid'
      }
    }

    // Check if payment link already exists
    const existingLink = db.prepare(
      'SELECT stripe_payment_link_url FROM orders WHERE id = ? AND stripe_payment_link_url IS NOT NULL'
    ).get(orderId) as any

    if (existingLink && existingLink.stripe_payment_link_url) {
      return {
        success: true,
        paymentUrl: existingLink.stripe_payment_link_url,
        orderId: order.id,
        orderNumber: order.order_number
      }
    }

    // In a real implementation, this is where we would call Stripe MCP tools
    // Since MCP tools are only available in the AI context, we'll need to
    // make an API call to a special endpoint that has MCP access
    
    // For now, return order details and indicate that Stripe integration is pending
    return {
      success: true,
      needsStripeIntegration: true,
      orderId: order.id,
      orderNumber: order.order_number,
      amount: order.total,
      customerEmail: order.customer_email,
      customerName: order.customer_name
    }
  } catch (error: any) {
    console.error('Error in createStripePayment:', error)
    return {
      success: false,
      error: error.message || 'Failed to create payment'
    }
  }
}

/**
 * Server action to verify Stripe payment status
 */
export async function verifyStripePayment(orderId: number, paymentIntentId?: string) {
  try {
    const db = getDb()

    // Fetch order
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    // In a real implementation, we would check Stripe payment status using MCP tools
    // For now, return current order status
    return {
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      paymentStatus: order.payment_status,
      isPaid: order.payment_status === 'paid' || order.payment_status === 'completed'
    }
  } catch (error: any) {
    console.error('Error in verifyStripePayment:', error)
    return {
      success: false,
      error: error.message || 'Failed to verify payment'
    }
  }
}

