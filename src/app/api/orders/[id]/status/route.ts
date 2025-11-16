import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { apiResponse, apiError } from '@/lib/utils'

// PUT /api/orders/[id]/status - Update order payment status (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { paymentStatus, paymentMethod } = body
    const orderId = params.id

    if (!orderId) {
      return NextResponse.json(
        apiError('Order ID is required'),
        { status: 400 }
      )
    }

    if (!paymentStatus) {
      return NextResponse.json(
        apiError('Payment status is required'),
        { status: 400 }
      )
    }

    // Validate payment status
    const validStatuses = ['pending', 'paid', 'completed', 'failed', 'refunded']
    if (!validStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        apiError('Invalid payment status'),
        { status: 400 }
      )
    }

    const db = getDb()

    // Check if order exists
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any

    if (!order) {
      return NextResponse.json(
        apiError('Order not found'),
        { status: 404 }
      )
    }

    // Update order payment status
    const updateSql = paymentMethod
      ? 'UPDATE orders SET payment_status = ?, payment_method = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      : 'UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'

    const params_array = paymentMethod
      ? [paymentStatus, paymentMethod, orderId]
      : [paymentStatus, orderId]

    db.prepare(updateSql).run(...params_array)

    // Fetch updated order
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId)

    return NextResponse.json(
      apiResponse({
        ...updatedOrder,
        message: 'Order payment status updated successfully'
      })
    )
  } catch (error: any) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      apiError(error.message || 'Failed to update order status'),
      { status: 500 }
    )
  }
}

// GET /api/orders/[id]/status - Get order payment status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id

    if (!orderId) {
      return NextResponse.json(
        apiError('Order ID is required'),
        { status: 400 }
      )
    }

    const db = getDb()

    // Fetch order
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any

    if (!order) {
      return NextResponse.json(
        apiError('Order not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(
      apiResponse({
        orderId: order.id,
        orderNumber: order.order_number,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        total: order.total
      })
    )
  } catch (error: any) {
    console.error('Error fetching order status:', error)
    return NextResponse.json(
      apiError(error.message || 'Failed to fetch order status'),
      { status: 500 }
    )
  }
}

