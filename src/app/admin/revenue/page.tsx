'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { AdminAuth } from '@/components/ui/AdminAuth'
import {
  DollarSign, TrendingUp, TrendingDown, ShoppingBag,
  Download, Calendar, Store, Receipt, ArrowLeft,
  BarChart3, Filter
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface RevenueOverview {
  total: {
    revenue: number
    subtotal: number
    tax: number
    discount: number
    transactions: number
    averageValue: number
  }
  today: {
    revenue: number
    transactions: number
    growth: number
  }
  month: {
    revenue: number
    transactions: number
    growth: number
  }
  year: {
    revenue: number
    transactions: number
  }
  bySource: {
    store?: { total: number; count: number }
    billing?: { total: number; count: number }
  }
  paymentMethods: Array<{
    payment_method: string
    total: number
    count: number
  }>
  recentTransactions: Array<{
    id: number
    transaction_type: string
    reference_number: string
    customer_name: string
    total: number
    payment_method: string
    transaction_date: string
  }>
}

export default function RevenuePage() {
  const [overview, setOverview] = useState<RevenueOverview | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  })
  const [filter, setFilter] = useState({
    type: 'all',
    period: 'month',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOverview()
  }, [])

  const fetchOverview = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/revenue/overview')
      const data = await res.json()

      if (data.success) {
        setOverview(data.data)
      }
    } catch (error) {
      console.error('Error fetching revenue overview:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        type: filter.type,
        ...(dateRange.startDate && { startDate: dateRange.startDate }),
        ...(dateRange.endDate && { endDate: dateRange.endDate }),
      })

      const res = await fetch(`/api/admin/revenue/export?${params}`)

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `revenue-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting revenue data:', error)
    }
  }

  if (loading) {
    return (
      <AdminAuth>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </AdminAuth>
    )
  }

  if (!overview) {
    return null
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ]

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/admin"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>

            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Revenue Management</h1>
                <p className="text-gray-600">Track revenue from store and local billing</p>
              </div>

              <Button
                variant="primary"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleExport}
              >
                Export CSV
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(overview.total.revenue)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {overview.total.transactions} transactions
                    </p>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <DollarSign className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Revenue */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(overview.today.revenue)}
                    </p>
                    <div className="flex items-center mt-1">
                      {overview.today.growth >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs font-medium ${
                        overview.today.growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(overview.today.growth).toFixed(1)}% vs yesterday
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* This Month */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(overview.month.revenue)}
                    </p>
                    <div className="flex items-center mt-1">
                      {overview.month.growth >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs font-medium ${
                        overview.month.growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(overview.month.growth).toFixed(1)}% vs last month
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Transaction */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Transaction</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(overview.total.averageValue)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Per transaction
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ShoppingBag className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue by Source */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Store Revenue */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Store className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Online Store</p>
                        <p className="text-sm text-gray-500">
                          {overview.bySource.store?.count || 0} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(overview.bySource.store?.total || 0)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {overview.total.revenue > 0
                          ? ((overview.bySource.store?.total || 0) / overview.total.revenue * 100).toFixed(1)
                          : 0}%
                      </p>
                    </div>
                  </div>

                  {/* Billing Revenue */}
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Receipt className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Local Shop Billing</p>
                        <p className="text-sm text-gray-500">
                          {overview.bySource.billing?.count || 0} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(overview.bySource.billing?.total || 0)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {overview.total.revenue > 0
                          ? ((overview.bySource.billing?.total || 0) / overview.total.revenue * 100).toFixed(1)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overview.paymentMethods.slice(0, 5).map((method) => (
                    <div key={method.payment_method} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {method.payment_method?.replace('_', ' ') || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">{method.count} transactions</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(method.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <Link href="/admin/revenue/transactions">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent noPadding>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {overview.recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.transaction_type === 'store'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {transaction.transaction_type === 'store' ? (
                              <>
                                <Store className="h-3 w-3 mr-1" />
                                Store
                              </>
                            ) : (
                              <>
                                <Receipt className="h-3 w-3 mr-1" />
                                Billing
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.reference_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {transaction.customer_name || 'Guest'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(transaction.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {transaction.payment_method?.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.transaction_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAuth>
  )
}
