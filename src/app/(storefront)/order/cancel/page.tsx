'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { XCircle, AlertTriangle, ShoppingCart, Home } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function OrderCancelPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    // Fetch order details
    fetch(`/api/stripe/check-payment?orderId=${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrder(data.data)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching order:', error)
        setLoading(false)
      })
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Cancel Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-xl text-gray-600">Your payment was not completed</p>
        </div>

        {/* Information Card */}
        <Card className="p-8 mb-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Order is Saved</h2>
              <p className="text-gray-600 mb-4">
                Don't worry! Your order has been saved and is waiting for payment. 
                You can complete the payment anytime.
              </p>
            </div>
          </div>

          {order && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Order Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order Number:</span>
                  <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="text-sm font-medium text-gray-900">${order.total?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Status:</span>
                  <span className="text-sm font-medium text-amber-600">Pending</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">What can you do?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Complete the payment by contacting our support team</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Continue shopping and place a new order</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Check your email for order details and payment instructions</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cart">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Go to Home
            </Button>
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@modernstore.com" className="text-primary-600 hover:text-primary-700 font-medium">
              support@modernstore.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

