'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { formatCurrency, calculateTax, calculateTotal } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/components/ui/Toast'
import { motion } from 'framer-motion'

export default function CartPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal } = useCart()
  const { addToast } = useToast()

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const tax = calculateTax(subtotal)
  const shipping = 0 // Free shipping for now
  const total = calculateTotal(subtotal, tax, shipping, 0)

  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (cart.length === 0) {
      addToast('Your cart is empty', 'error')
      return
    }

    if (!customerInfo.name || !customerInfo.email) {
      addToast('Please fill in your name and email', 'error')
      return
    }

    setIsProcessing(true)

    try {
      // Step 1: Create order with pending payment status
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          shipping_address: customerInfo.address,
          items: cart.map(item => ({
            product_id: item.product_id,
            product_name: item.product_name,
            product_sku: item.product_sku,
            product_image: item.product_image,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
          tax,
          shipping_cost: shipping,
          payment_method: 'stripe', // Stripe payment
        }),
      })

      const orderData = await orderRes.json()

      if (!orderData.success) {
        addToast(orderData.message || 'Failed to create order', 'error')
        setIsProcessing(false)
        return
      }

      const order = orderData.data

      // Step 2: Create Stripe payment link
      addToast('Order created! Creating payment link...', 'success')

      const paymentRes = await fetch('/api/stripe/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id
        }),
      })

      const paymentData = await paymentRes.json()

      if (!paymentData.success) {
        addToast(paymentData.message || 'Failed to create payment link', 'error')
        setIsProcessing(false)
        return
      }

      // Clear cart before redirecting to payment
      clearCart()

      // Step 3: Redirect to Stripe payment page
      if (paymentData.data.paymentUrl) {
        addToast('Redirecting to Stripe payment...', 'success')
        // Redirect to Stripe payment link
        window.location.href = paymentData.data.paymentUrl
      } else {
        // Fallback: redirect to success page if no payment URL
        addToast('Payment link not available, redirecting...', 'info')
        setTimeout(() => {
          router.push(`/order/success?orderId=${order.id}`)
        }, 1500)
      }

    } catch (error) {
      console.error('Error placing order:', error)
      addToast('Failed to place order', 'error')
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started</p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{cart.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.product_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex gap-3 sm:gap-4">
                    <img
                      src={item.product_image || '/placeholder.svg'}
                      alt={item.product_name}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{item.product_name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">SKU: {item.product_sku}</p>
                      <p className="text-base sm:text-lg font-bold text-primary-600">
                        {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors touch-manipulation"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors touch-manipulation"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 sm:w-12 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock_quantity}
                          className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 touch-manipulation"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Subtotal: <span className="font-semibold">{formatCurrency(item.unit_price * item.quantity)}</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            <div className="flex justify-between pt-4">
              <Link href="/products">
                <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Continue Shopping
                </Button>
              </Link>
              <Button variant="ghost" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 pb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-4">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="space-y-3">
                <Input
                  label="Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                />
                <Input
                  label="Shipping Address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="mt-6"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order & Pay'}
              </Button>
              <p className="text-xs text-center text-gray-500 mt-3">
                By placing this order, you agree to our terms and conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}