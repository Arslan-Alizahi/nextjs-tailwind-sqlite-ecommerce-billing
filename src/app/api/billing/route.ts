import { NextRequest, NextResponse } from 'next/server'
import { getDb, runTransaction } from '@/lib/db'
import { apiResponse, apiError, generateReceiptNumber, calculateTax, calculateTotal } from '@/lib/utils'

// POST /api/billing - Create billing receipt and update stock
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = getDb()

    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        apiError('Receipt must have at least one item'),
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
      const discount = body.discount || 0
      const total = calculateTotal(subtotal, tax, 0, discount)
      const changeAmount = (body.amount_paid || total) - total

      // Create receipt
      const receiptNumber = generateReceiptNumber()
      const receiptResult = db.prepare(`
        INSERT INTO billing_receipts (
          receipt_number, customer_name, customer_phone, subtotal,
          tax, discount, total, payment_method, amount_paid, change_amount, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        receiptNumber,
        body.customer_name || null,
        body.customer_phone || null,
        subtotal,
        tax,
        discount,
        total,
        body.payment_method || 'cash',
        body.amount_paid || total,
        changeAmount,
        body.notes || null
      )

      const receiptId = receiptResult.lastInsertRowid

      // Add billing items and update stock
      const insertItem = db.prepare(`
        INSERT INTO billing_items (
          receipt_id, product_id, product_name, product_sku,
          quantity, unit_price, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)

      const updateStock = db.prepare(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?'
      )

      for (const item of body.items) {
        // Insert billing item
        insertItem.run(
          receiptId,
          item.product_id,
          item.product_name,
          item.product_sku || null,
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

      // Fetch created receipt
      const receipt = db.prepare('SELECT * FROM billing_receipts WHERE id = ?').get(receiptId)
      const items = db.prepare('SELECT * FROM billing_items WHERE receipt_id = ?').all(receiptId)

      return NextResponse.json(
        apiResponse({ ...receipt, items }),
        { status: 201 }
      )
    })
  } catch (error: any) {
    console.error('Error creating receipt:', error)
    return NextResponse.json(
      apiError(error.message || 'Failed to create receipt'),
      { status: 500 }
    )
  }
}

// GET /api/billing - Get all receipts
export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    const { searchParams } = new URL(request.url)

    let sql = 'SELECT * FROM billing_receipts WHERE 1=1'
    const params: any[] = []

    if (searchParams.get('receipt_number')) {
      sql += ' AND receipt_number = ?'
      params.push(searchParams.get('receipt_number'))
    }

    sql += ' ORDER BY created_at DESC LIMIT 100'

    const receipts = db.prepare(sql).all(...params)

    return NextResponse.json(apiResponse(receipts))
  } catch (error) {
    console.error('Error fetching receipts:', error)
    return NextResponse.json(
      apiError('Failed to fetch receipts'),
      { status: 500 }
    )
  }
}