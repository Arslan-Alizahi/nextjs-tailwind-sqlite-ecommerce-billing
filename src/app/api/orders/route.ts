import { NextRequest, NextResponse } from 'next/server'
import { getDb, runQuery, runTransaction } from '@/lib/db'
import { Order } from '@/types/order'
import { apiResponse, apiError, generateOrderNumber, calculateTax, calculateTotal } from '@/lib/utils'

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    let sql = `
      SELECT * FROM orders
      WHERE 1=1
    `
    const params: any[] = []

    if (searchParams.get('status')) {
      sql += ' AND status = ?'
      params.push(searchParams.get('status'))
    }

    if (searchParams.get('customer_email')) {
      sql += ' AND customer_email = ?'
      params.push(searchParams.get('customer_email'))
    }

    sql += ' ORDER BY created_at DESC'

    if (searchParams.get('limit')) {
      sql += ' LIMIT ?'
      params.push(parseInt(searchParams.get('limit')!))
    }

    const orders = runQuery<Order>(sql, params)

    // Get order items for each order
    const ordersWithItems = orders.map(order => {
      const items = runQuery<any>(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      )
      return { ...order, items }
    })

    return NextResponse.json(apiResponse(ordersWithItems))
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      apiError('Failed to fetch orders'),
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = getDb()

    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        apiError('Order must have at least one item'),
        { status: 400 }
      )
    }

    return runTransaction(db => {
      // Calculate totals
      let subtotal = 0
      for (const item of body.items) {
        subtotal += item.unit_price * item.quantity
      }

      const tax = body.tax || calculateTax(subtotal)
      const shipping = body.shipping_cost || 0
      const discount = body.discount || 0
      const total = calculateTotal(subtotal, tax, shipping, discount)

      // Create order
      const orderNumber = generateOrderNumber()
      const orderResult = db.prepare(`
        INSERT INTO orders (
          order_number, customer_name, customer_email, customer_phone,
          shipping_address, billing_address, subtotal, tax, shipping_cost,
          discount, total, status, payment_method, payment_status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderNumber,
        body.customer_name || null,
        body.customer_email || null,
        body.customer_phone || null,
        body.shipping_address || null,
        body.billing_address || null,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        'pending',
        body.payment_method || 'stripe', // Default to stripe for online orders
        'pending', // Start with pending, will be updated after successful payment
        body.notes || null
      )

      const orderId = orderResult.lastInsertRowid

      // Add order items and update stock
      const insertItem = db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_sku, product_image,
          quantity, unit_price, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const updateStock = db.prepare(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?'
      )

      for (const item of body.items) {
        // Insert order item
        insertItem.run(
          orderId,
          item.product_id,
          item.product_name,
          item.product_sku || null,
          item.product_image || null,
          item.quantity,
          item.unit_price,
          item.unit_price * item.quantity
        )

        // Update stock
        const stockResult = updateStock.run(item.quantity, item.product_id, item.quantity)
        if (stockResult.changes === 0) {
          throw new Error(`Insufficient stock for product ${item.product_name}`)
        }
      }

      // Fetch created order
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId)
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId)

      return NextResponse.json(
        apiResponse({ ...order, items }),
        { status: 201 }
      )
    })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      apiError(error.message || 'Failed to create order'),
      { status: 500 }
    )
  }
}