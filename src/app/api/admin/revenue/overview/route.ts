import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const db = getDb()

    // Get total revenue (all time)
    const totalRevenue = db
      .prepare(
        `
        SELECT
          COALESCE(SUM(total), 0) as total,
          COALESCE(SUM(subtotal), 0) as subtotal,
          COALESCE(SUM(tax), 0) as tax,
          COALESCE(SUM(discount), 0) as discount,
          COUNT(*) as transaction_count
        FROM revenue_transactions
      `
      )
      .get() as any

    // Get revenue by source
    const revenueBySource = db
      .prepare(
        `
        SELECT
          transaction_type,
          COALESCE(SUM(total), 0) as total,
          COUNT(*) as transaction_count
        FROM revenue_transactions
        GROUP BY transaction_type
      `
      )
      .all() as any[]

    // Get today's revenue
    const todayRevenue = db
      .prepare(
        `
        SELECT
          COALESCE(SUM(total), 0) as total,
          COUNT(*) as transaction_count
        FROM revenue_transactions
        WHERE DATE(transaction_date) = DATE('now')
      `
      )
      .get() as any

    // Get this month's revenue
    const monthRevenue = db
      .prepare(
        `
        SELECT
          COALESCE(SUM(total), 0) as total,
          COUNT(*) as transaction_count
        FROM revenue_transactions
        WHERE strftime('%Y-%m', transaction_date) = strftime('%Y-%m', 'now')
      `
      )
      .get() as any

    // Get this year's revenue
    const yearRevenue = db
      .prepare(
        `
        SELECT
          COALESCE(SUM(total), 0) as total,
          COUNT(*) as transaction_count
        FROM revenue_transactions
        WHERE strftime('%Y', transaction_date) = strftime('%Y', 'now')
      `
      )
      .get() as any

    // Get yesterday's revenue for comparison
    const yesterdayRevenue = db
      .prepare(
        `
        SELECT
          COALESCE(SUM(total), 0) as total
        FROM revenue_transactions
        WHERE DATE(transaction_date) = DATE('now', '-1 day')
      `
      )
      .get() as any

    // Get last month's revenue for comparison
    const lastMonthRevenue = db
      .prepare(
        `
        SELECT
          COALESCE(SUM(total), 0) as total
        FROM revenue_transactions
        WHERE strftime('%Y-%m', transaction_date) = strftime('%Y-%m', 'now', '-1 month')
      `
      )
      .get() as any

    // Calculate growth percentages
    const todayGrowth = yesterdayRevenue.total > 0
      ? ((todayRevenue.total - yesterdayRevenue.total) / yesterdayRevenue.total) * 100
      : 0

    const monthGrowth = lastMonthRevenue.total > 0
      ? ((monthRevenue.total - lastMonthRevenue.total) / lastMonthRevenue.total) * 100
      : 0

    // Get average transaction value
    const avgTransactionValue = totalRevenue.transaction_count > 0
      ? totalRevenue.total / totalRevenue.transaction_count
      : 0

    // Get payment method breakdown
    const paymentMethods = db
      .prepare(
        `
        SELECT
          payment_method,
          COALESCE(SUM(total), 0) as total,
          COUNT(*) as count
        FROM revenue_transactions
        GROUP BY payment_method
        ORDER BY total DESC
      `
      )
      .all() as any[]

    // Get recent transactions (last 10)
    const recentTransactions = db
      .prepare(
        `
        SELECT
          id,
          transaction_type,
          reference_number,
          customer_name,
          total,
          payment_method,
          transaction_date
        FROM revenue_transactions
        ORDER BY transaction_date DESC
        LIMIT 10
      `
      )
      .all() as any[]

    return NextResponse.json({
      success: true,
      data: {
        total: {
          revenue: totalRevenue.total,
          subtotal: totalRevenue.subtotal,
          tax: totalRevenue.tax,
          discount: totalRevenue.discount,
          transactions: totalRevenue.transaction_count,
          averageValue: avgTransactionValue,
        },
        today: {
          revenue: todayRevenue.total,
          transactions: todayRevenue.transaction_count,
          growth: todayGrowth,
        },
        month: {
          revenue: monthRevenue.total,
          transactions: monthRevenue.transaction_count,
          growth: monthGrowth,
        },
        year: {
          revenue: yearRevenue.total,
          transactions: yearRevenue.transaction_count,
        },
        bySource: revenueBySource.reduce((acc, item) => {
          acc[item.transaction_type] = {
            total: item.total,
            count: item.transaction_count,
          }
          return acc
        }, {} as any),
        paymentMethods,
        recentTransactions,
      },
    })
  } catch (error) {
    console.error('Error fetching revenue overview:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch revenue overview',
      },
      { status: 500 }
    )
  }
}
