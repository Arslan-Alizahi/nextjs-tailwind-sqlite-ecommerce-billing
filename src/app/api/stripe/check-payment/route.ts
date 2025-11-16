import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { apiResponse, apiError } from '@/lib/utils'

// GET /api/stripe/check-payment?orderId=123 - Check payment status for order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        apiError('Order ID is required'),
        { status: 400 }
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

    // Return payment status
    return NextResponse.json(
      apiResponse({
        orderId: order.id,
        orderNumber: order.order_number,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        total: order.total,
        isPaid: order.payment_status === 'paid' || order.payment_status === 'completed'
      })
    )
  } catch (error: any) {
    console.error('Error checking payment:', error)
    return NextResponse.json(
      apiError(error.message || 'Failed to check payment'),
      { status: 500 }
    )
  }
}

