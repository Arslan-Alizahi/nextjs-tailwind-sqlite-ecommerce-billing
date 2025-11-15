import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type') // 'store', 'billing', or 'all'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const paymentMethod = searchParams.get('paymentMethod')
    const search = searchParams.get('search') // Search by customer name or reference number

    const db = getDb()
    const offset = (page - 1) * limit

    // Build WHERE clause
    const conditions: string[] = []
    const params: any[] = []

    if (type && type !== 'all') {
      conditions.push('transaction_type = ?')
      params.push(type)
    }

    if (startDate && endDate) {
      conditions.push('DATE(transaction_date) BETWEEN DATE(?) AND DATE(?)')
      params.push(startDate, endDate)
    }

    if (paymentMethod && paymentMethod !== 'all') {
      conditions.push('payment_method = ?')
      params.push(paymentMethod)
    }

    if (search) {
      conditions.push('(customer_name LIKE ? OR reference_number LIKE ?)')
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count
    const countResult = db
      .prepare(
        `
        SELECT COUNT(*) as total
        FROM revenue_transactions
        ${whereClause}
      `
      )
      .get(...params) as { total: number }

    // Get transactions
    const transactions = db
      .prepare(
        `
        SELECT
          id,
          transaction_type,
          reference_id,
          reference_number,
          customer_name,
          customer_email,
          customer_phone,
          subtotal,
          tax,
          discount,
          shipping_cost,
          total,
          payment_method,
          payment_status,
          notes,
          transaction_date,
          created_at
        FROM revenue_transactions
        ${whereClause}
        ORDER BY transaction_date DESC
        LIMIT ? OFFSET ?
      `
      )
      .all(...params, limit, offset) as any[]

    const totalPages = Math.ceil(countResult.total / limit)

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total: countResult.total,
          totalPages,
          hasMore: page < totalPages,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching revenue transactions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch revenue transactions',
      },
      { status: 500 }
    )
  }
}
