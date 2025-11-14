'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { PrintReceipt } from '@/components/ui/PrintReceipt'
import { Search, Plus, Minus, Trash2, Receipt, DollarSign, Package } from 'lucide-react'
import { formatCurrency, generateReceiptNumber, calculateTax, calculateTotal } from '@/lib/utils'
import { Product } from '@/types/product'
import { BillingCartItem } from '@/types/billing'

export default function BillingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<BillingCartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [paymentModal, setPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [amountPaid, setAmountPaid] = useState('')
  const [currentReceipt, setCurrentReceipt] = useState<any>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const { addToast } = useToast()

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = calculateTax(subtotal)
  const total = calculateTotal(subtotal, tax, 0, 0)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/products?limit=100')
      const data = await res.json()
      if (data.success) {
        setProducts(data.data.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      addToast('Failed to load products', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const addProductToCart = (productId: string) => {
    const product = products.find(p => p.id.toString() === productId)
    if (!product) return

    if (product.stock_quantity <= 0) {
      addToast('Product is out of stock', 'error')
      return
    }

    const existingItem = cart.find(item => item.product_id === product.id)
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      const newItem: BillingCartItem = {
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        product_image: product.primary_image || product.images?.[0]?.image_url,
        quantity: 1,
        unit_price: product.price,
        subtotal: product.price,
        stock_quantity: product.stock_quantity,
      }
      setCart([...cart, newItem])
    }
    setSelectedProduct('')
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map(item => {
      if (item.product_id === productId) {
        const quantity = Math.min(newQuantity, item.stock_quantity)
        return {
          ...item,
          quantity,
          subtotal: quantity * item.unit_price,
        }
      }
      return item
    }))
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product_id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setAmountPaid('')
  }

  const processBilling = async () => {
    if (cart.length === 0) {
      addToast('Cart is empty', 'error')
      return
    }

    const paid = parseFloat(amountPaid) || total
    if (paid < total) {
      addToast('Insufficient payment amount', 'error')
      return
    }

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          payment_method: paymentMethod,
          amount_paid: paid,
          tax,
          discount: 0,
        }),
      })

      const data = await res.json()

      if (data.success) {
        addToast('Receipt created successfully!', 'success')
        // Show print receipt modal
        setCurrentReceipt(data.data)
        setShowReceipt(true)
        clearCart()
        setPaymentModal(false)
        // Refresh products to update stock
        fetchProducts()
      } else {
        addToast(data.message || 'Failed to create receipt', 'error')
      }
    } catch (error) {
      console.error('Error processing billing:', error)
      addToast('Failed to process billing', 'error')
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const changeAmount = (parseFloat(amountPaid) || total) - total

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600">Process billing and manage receipts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Selection */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Add Products</h2>

            {/* Search */}
            <div className="mb-4">
              <Input
                placeholder="Search products by name or SKU..."
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Product Dropdown */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  placeholder="Select a product"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  options={filteredProducts.map(p => ({
                    value: p.id.toString(),
                    label: `${p.name} - ${formatCurrency(p.price)} (Stock: ${p.stock_quantity})`,
                    disabled: p.stock_quantity <= 0,
                  }))}
                />
              </div>
              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => addProductToCart(selectedProduct)}
                disabled={!selectedProduct}
              >
                Add
              </Button>
            </div>

            {/* Quick Add Grid */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Add</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {filteredProducts.slice(0, 12).map(product => (
                  <button
                    key={product.id}
                    onClick={() => addProductToCart(product.id.toString())}
                    disabled={product.stock_quantity <= 0}
                    className="p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Package className="h-8 w-8 mx-auto mb-1 text-gray-400" />
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                    <p className="text-xs text-gray-400">Stock: {product.stock_quantity}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Cart & Totals */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Cart Items</h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items in cart</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.product_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.product_image || '/placeholder.svg'}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product_name}</p>
                        <p className="text-xs text-gray-500">{item.product_sku}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock_quantity}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Totals */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                  fullWidth
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<Receipt className="h-4 w-4" />}
                  onClick={() => setPaymentModal(true)}
                  disabled={cart.length === 0}
                  fullWidth
                >
                  Process Payment
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
        title="Process Payment"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'card', label: 'Card' },
              { value: 'upi', label: 'UPI' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
            ]}
          />

          <Input
            label="Amount Paid"
            type="number"
            step="0.01"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder={total.toFixed(2)}
            leftIcon={<DollarSign className="h-5 w-5 text-gray-400" />}
          />

          {amountPaid && parseFloat(amountPaid) >= total && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Change: <span className="font-bold">{formatCurrency(changeAmount)}</span>
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Due</p>
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(total)}</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPaymentModal(false)} fullWidth>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={processBilling}
              disabled={cart.length === 0}
              fullWidth
            >
              Complete Transaction
            </Button>
          </div>
        </div>
      </Modal>

      {/* Print Receipt Modal */}
      {showReceipt && currentReceipt && (
        <PrintReceipt
          receipt={currentReceipt}
          onClose={() => {
            setShowReceipt(false)
            setCurrentReceipt(null)
          }}
        />
      )}
    </div>
  )
}