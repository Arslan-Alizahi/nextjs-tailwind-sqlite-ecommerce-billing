'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import { StatusBadge, StockBadge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import {
  Package, ShoppingCart, DollarSign, TrendingUp,
  Plus, Edit2, Trash2, Eye, Settings
} from 'lucide-react'
import { formatCurrency, slugify, generateSKU } from '@/lib/utils'
import { Product } from '@/types/product'
import { Category } from '@/types/category'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [receipts, setReceipts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [productModal, setProductModal] = useState(false)
  const [categoryModal, setCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { addToast } = useToast()

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    sku: '',
    category_id: '',
    price: '',
    stock_quantity: '',
    is_featured: false,
  })

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    parent_id: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Fetch products
    fetch('/api/products?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data.products || [])
      })
      .catch(error => console.error('Error fetching products:', error))

    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data || [])
      })
      .catch(error => console.error('Error fetching categories:', error))

    // Fetch orders
    fetch('/api/orders?limit=10')
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.data || [])
      })
      .catch(error => console.error('Error fetching orders:', error))

    // Fetch receipts
    fetch('/api/billing')
      .then(res => res.json())
      .then(data => {
        if (data.success) setReceipts(data.data || [])
      })
      .catch(error => console.error('Error fetching receipts:', error))
  }

  const saveProduct = async () => {
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'

      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock_quantity: parseInt(productForm.stock_quantity),
          category_id: parseInt(productForm.category_id),
          sku: productForm.sku || generateSKU(productForm.name),
          slug: slugify(productForm.name),
        }),
      })

      const data = await res.json()

      if (data.success) {
        addToast(editingProduct ? 'Product updated' : 'Product created', 'success')
        setProductModal(false)
        setEditingProduct(null)
        setProductForm({
          name: '',
          description: '',
          sku: '',
          category_id: '',
          price: '',
          stock_quantity: '',
          is_featured: false,
        })
        fetchData()
      } else {
        addToast(data.message || 'Failed to save product', 'error')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      addToast('Failed to save product', 'error')
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        addToast('Product deleted', 'success')
        fetchData()
      } else {
        addToast('Failed to delete product', 'error')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      addToast('Failed to delete product', 'error')
    }
  }

  const saveCategory = async () => {
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'

      const method = editingCategory ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...categoryForm,
          parent_id: categoryForm.parent_id ? parseInt(categoryForm.parent_id) : null,
          slug: slugify(categoryForm.name),
        }),
      })

      const data = await res.json()

      if (data.success) {
        addToast(editingCategory ? 'Category updated' : 'Category created', 'success')
        setCategoryModal(false)
        setEditingCategory(null)
        setCategoryForm({
          name: '',
          description: '',
          parent_id: '',
        })
        fetchData()
      } else {
        addToast(data.message || 'Failed to save category', 'error')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      addToast('Failed to save category', 'error')
    }
  }

  // Calculate stats
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const lowStockProducts = products.filter(p => p.stock_quantity <= 5).length

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Settings },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary-600">{totalProducts}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{totalOrders}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(totalRevenue)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">{lowStockProducts}</p>
                <p className="text-sm text-gray-500">Products need restocking</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Products</h2>
              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => {
                  setEditingProduct(null)
                  setProductForm({
                    name: '',
                    description: '',
                    sku: '',
                    category_id: '',
                    price: '',
                    stock_quantity: '',
                    is_featured: false,
                  })
                  setProductModal(true)
                }}
              >
                Add Product
              </Button>
            </div>

            <Card noPadding>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SKU</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.primary_image || '/placeholder.svg'}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-xs text-gray-500 truncate max-w-xs">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{product.sku}</td>
                        <td className="px-4 py-3 text-sm">{product.category_name}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-3">
                          <StockBadge quantity={product.stock_quantity} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product)
                                setProductForm({
                                  name: product.name,
                                  description: product.description || '',
                                  sku: product.sku,
                                  category_id: product.category_id.toString(),
                                  price: product.price.toString(),
                                  stock_quantity: product.stock_quantity.toString(),
                                  is_featured: Boolean(product.is_featured),
                                })
                                setProductModal(true)
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Categories */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Categories</h2>
              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => {
                  setEditingCategory(null)
                  setCategoryForm({
                    name: '',
                    description: '',
                    parent_id: '',
                  })
                  setCategoryModal(true)
                }}
              >
                Add Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => (
                <Card key={category.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {category.product_count || 0} products
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingCategory(category)
                          setCategoryForm({
                            name: category.name,
                            description: category.description || '',
                            parent_id: category.parent_id?.toString() || '',
                          })
                          setCategoryModal(true)
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order #</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{order.order_number}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p>{order.customer_name || 'Guest'}</p>
                          <p className="text-xs text-gray-500">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={productModal}
        onClose={() => setProductModal(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Product Name"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            required
          />

          <Input
            label="Description"
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU"
              value={productForm.sku}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
              placeholder="Auto-generated if empty"
            />

            <Select
              label="Category"
              value={productForm.category_id}
              onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
              options={categories.map(cat => ({
                value: cat.id.toString(),
                label: cat.name,
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              required
            />

            <Input
              label="Stock Quantity"
              type="number"
              value={productForm.stock_quantity}
              onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setProductModal(false)} fullWidth>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveProduct} fullWidth>
              {editingProduct ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={categoryModal}
        onClose={() => setCategoryModal(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            required
          />

          <Input
            label="Description"
            value={categoryForm.description}
            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
          />

          <Select
            label="Parent Category (Optional)"
            value={categoryForm.parent_id}
            onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value })}
            options={[
              { value: '', label: 'None (Top Level)' },
              ...categories
                .filter(cat => cat.id !== editingCategory?.id)
                .map(cat => ({
                  value: cat.id.toString(),
                  label: cat.name,
                }))
            ]}
          />

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCategoryModal(false)} fullWidth>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveCategory} fullWidth>
              {editingCategory ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}