'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { AdminAuth } from '@/components/ui/AdminAuth'
import {
  ArrowLeft, Download, Filter, Search,
  Store, Receipt, ChevronLeft, ChevronRight, Eye
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Transaction {
  id: number
  transaction_type: string
  reference_id: number
  reference_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  subtotal: number
  tax: number
  discount: number
  shipping_cost: number
  total: number
  payment_method: string
  payment_status: string
  notes: string
  transaction_date: string
  created_at: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [detailsModal, setDetailsModal] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasMore: false,
  })
  const [filters, setFilters] = useState({
    type: 'all',
    startDate: '',
    endDate: '',
    paymentMethod: 'all',
    search: '',
  })

  useEffect(() => {
    fetchTransactions()
  }, [pagination.page, filters])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.paymentMethod !== 'all' && { paymentMethod: filters.paymentMethod }),
        ...(filters.search && { search: filters.search }),
      })

      const res = await fetch(`/api/admin/revenue/transactions?${params}`)
      const data = await res.json()

      if (data.success) {
        setTransactions(data.data.transactions)
        setPagination(data.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        type: filters.type,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      })

      const res = await fetch(`/api/admin/revenue/export?${params}`)

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `revenue-transactions-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting transactions:', error)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
    setPagination({ ...pagination, page: 1 })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination({ ...pagination, page: 1 })
    fetchTransactions()
  }

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDetailsModal(true)
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/admin/revenue"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Revenue Dashboard
            </Link>

            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
                <p className="text-gray-600">
                  {pagination.total} total transactions
                </p>
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

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Search */}
                <div className="lg:col-span-3">
                  <Input
                    type="text"
                    placeholder="Search by customer or reference..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>

                {/* Type Filter */}
                <div className="lg:col-span-2">
                  <Select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    options={[
                      { value: 'all', label: 'All Sources' },
                      { value: 'store', label: 'Online Store' },
                      { value: 'billing', label: 'Local Billing' },
                    ]}
                  />
                </div>

                {/* Payment Method Filter */}
                <div className="lg:col-span-2">
                  <Select
                    value={filters.paymentMethod}
                    onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                    options={[
                      { value: 'all', label: 'All Payments' },
                      { value: 'cash', label: 'Cash' },
                      { value: 'card', label: 'Card' },
                      { value: 'credit_card', label: 'Credit Card' },
                      { value: 'debit_card', label: 'Debit Card' },
                      { value: 'mobile_money', label: 'Mobile Money' },
                    ]}
                  />
                </div>

                {/* Start Date */}
                <div className="lg:col-span-2">
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    placeholder="Start Date"
                  />
                </div>

                {/* End Date */}
                <div className="lg:col-span-2">
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    placeholder="End Date"
                  />
                </div>

                {/* Filter Button */}
                <div className="lg:col-span-1">
                  <Button
                    variant="primary"
                    onClick={() => fetchTransactions()}
                    fullWidth
                    leftIcon={<Filter className="h-4 w-4" />}
                  >
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.reference_number}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {transaction.customer_name || 'Guest'}
                          </div>
                          {transaction.customer_email && (
                            <div className="text-xs text-gray-500">
                              {transaction.customer_email}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(transaction.subtotal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(transaction.tax)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(transaction.total)}
                          </div>
                          {transaction.discount > 0 && (
                            <div className="text-xs text-green-600">
                              -{formatCurrency(transaction.discount)} discount
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {transaction.payment_method?.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.transaction_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(transaction)}
                            className="text-primary-600 hover:text-primary-900 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex items-center gap-2"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">View</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && transactions.length > 0 && (
              <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="outline"
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={!pagination.hasMore}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page === 1}
                        leftIcon={<ChevronLeft className="h-4 w-4" />}
                      >
                        Previous
                      </Button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={!pagination.hasMore}
                        rightIcon={<ChevronRight className="h-4 w-4" />}
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <Modal
            isOpen={detailsModal}
            onClose={() => setDetailsModal(false)}
            title="Transaction Details"
            size="lg"
          >
            <div className="space-y-6">
              {/* Transaction Type & Status */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTransaction.transaction_type === 'store'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {selectedTransaction.transaction_type === 'store' ? (
                      <>
                        <Store className="h-4 w-4 mr-2" />
                        Online Store
                      </>
                    ) : (
                      <>
                        <Receipt className="h-4 w-4 mr-2" />
                        Local Billing
                      </>
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Reference Number</p>
                  <p className="font-semibold text-gray-900">{selectedTransaction.reference_number}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">
                      {selectedTransaction.customer_name || 'Guest'}
                    </span>
                  </div>
                  {selectedTransaction.customer_email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">
                        {selectedTransaction.customer_email}
                      </span>
                    </div>
                  )}
                  {selectedTransaction.customer_phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium text-gray-900">
                        {selectedTransaction.customer_phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(selectedTransaction.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(selectedTransaction.tax)}
                    </span>
                  </div>
                  {selectedTransaction.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(selectedTransaction.discount)}
                      </span>
                    </div>
                  )}
                  {selectedTransaction.shipping_cost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedTransaction.shipping_cost)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-primary-600">
                      {formatCurrency(selectedTransaction.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {selectedTransaction.payment_method?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {selectedTransaction.payment_status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Date:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(selectedTransaction.transaction_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedTransaction.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedTransaction.notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setDetailsModal(false)}
                  fullWidth
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => window.print()}
                  fullWidth
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Print Receipt
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminAuth>
  )
}
