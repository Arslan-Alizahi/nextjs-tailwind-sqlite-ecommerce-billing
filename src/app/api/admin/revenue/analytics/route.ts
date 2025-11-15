import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'month' // day, week, month, year
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type') // 'store' or 'billing' or 'all'

    const db = getDb()

    // Build date filter
    let dateFilter = ''
    if (startDate && endDate) {
      dateFilter = `WHERE DATE(transaction_date) BETWEEN DATE('${startDate}') AND DATE('${endDate}')`
    } else {
      // Default date ranges based on period
      switch (period) {
        case 'day':
          dateFilter = `WHERE DATE(transaction_date) >= DATE('now', '-30 days')`
          break
        case 'week':
          dateFilter = `WHERE DATE(transaction_date) >= DATE('now', '-12 weeks')`
          break
        case 'month':
          dateFilter = `WHERE DATE(transaction_date) >= DATE('now', '-12 months')`
          break
        case 'year':
          dateFilter = `WHERE DATE(transaction_date) >= DATE('now', '-5 years')`
          break
        default:
          dateFilter = `WHERE DATE(transaction_date) >= DATE('now', '-12 months')`
      }
    }

    // Add type filter if specified
    if (type && type !== 'all') {
      dateFilter += dateFilter.includes('WHERE') ? ' AND' : ' WHERE'
      dateFilter += ` transaction_type = '${type}'`
    }

    // Get revenue over time based on period
    let groupByFormat = ''
    switch (period) {
      case 'day':
        groupByFormat = '%Y-%m-%d'
        break
      case 'week':
        groupByFormat = '%Y-W%W'
        break
      case 'month':
        groupByFormat = '%Y-%m'
        break
      case 'year':
        groupByFormat = '%Y'
        break
      default:
        groupByFormat = '%Y-%m'
    }

    const revenueOverTime = db
      .prepare(
        `
        SELECT
          strftime('${groupByFormat}', transaction_date) as period,
          COALESCE(SUM(total), 0) as revenue,
          COALESCE(SUM(subtotal), 0) as subtotal,
          COALESCE(SUM(tax), 0) as tax,
          COALESCE(SUM(discount), 0) as discount,
          COUNT(*) as transactions
        FROM revenue_transactions
        ${dateFilter}
        GROUP BY period
        ORDER BY period ASC
      `
      )
      .all() as any[]

    // Get revenue by source over time
    const revenueBySource = db
      .prepare(
        `
        SELECT
          strftime('${groupByFormat}', transaction_date) as period,
          transaction_type,
          COALESCE(SUM(total), 0) as revenue,
          COUNT(*) as transactions
        FROM revenue_transactions
        ${dateFilter}
        GROUP BY period, transaction_type
        ORDER BY period ASC, transaction_type
      `
      )
      .all() as any[]

    // Get top performing days
    const topDays = db
      .prepare(
        `
        SELECT
          DATE(transaction_date) as date,
          COALESCE(SUM(total), 0) as revenue,
          COUNT(*) as transactions
        FROM revenue_transactions
        ${dateFilter}
        GROUP BY date
        ORDER BY revenue DESC
        LIMIT 10
      `
      )
      .all() as any[]

    // Get revenue by payment method over period
    const paymentMethodTrends = db
      .prepare(
        `
        SELECT
          payment_method,
          COALESCE(SUM(total), 0) as revenue,
          COUNT(*) as transactions
        FROM revenue_transactions
        ${dateFilter}
        GROUP BY payment_method
        ORDER BY revenue DESC
      `
      )
      .all() as any[]

    // Get daily averages
    const avgDaily = db
      .prepare(
        `
        SELECT
          AVG(daily_revenue) as avg_revenue,
          AVG(daily_transactions) as avg_transactions
        FROM (
          SELECT
            DATE(transaction_date) as date,
            SUM(total) as daily_revenue,
            COUNT(*) as daily_transactions
          FROM revenue_transactions
          ${dateFilter}
          GROUP BY date
        )
      `
      )
      .get() as any

    return NextResponse.json({
      success: true,
      data: {
        period,
        revenueOverTime,
        revenueBySource,
        topDays,
        paymentMethodTrends,
        averages: {
          dailyRevenue: avgDaily?.avg_revenue || 0,
          dailyTransactions: avgDaily?.avg_transactions || 0,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching revenue analytics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch revenue analytics',
      },
      { status: 500 }
    )
  }
}
