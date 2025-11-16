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
import { ImageUpload } from '@/components/ui/ImageUpload'
import { AdminAuth } from '@/components/ui/AdminAuth'
import {
  Package, ShoppingCart, DollarSign, TrendingUp,
  Plus, Edit2, Trash2, Eye, Settings, Share2, Menu
} from 'lucide-react'
import { formatCurrency, slugify, generateSKU } from '@/lib/utils'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { SocialMediaLink } from '@/types/social-media'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [receipts, setReceipts] = useState<any[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([])
  const [navItems, setNavItems] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [productModal, setProductModal] = useState(false)
  const [categoryModal, setCategoryModal] = useState(false)
  const [socialModal, setSocialModal] = useState(false)
  const [navModal, setNavModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSocial, setEditingSocial] = useState<SocialMediaLink | null>(null)
  const [editingNav, setEditingNav] = useState<any | null>(null)
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
    image_url: '',
  })

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    parent_id: '',
  })

  const [socialForm, setSocialForm] = useState({
    platform: '',
    url: '',
    icon: '',
    display_order: 0,
    is_active: true,
  })

  const [navForm, setNavForm] = useState({
    label: '',
    href: '',
    parent_id: '',
    type: 'link',
    target: '_self',
    icon: '',
    display_order: 0,
    is_active: true,
    location: 'header',
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

    // Fetch social media links
    fetch('/api/social-media')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSocialLinks(data.data.links || [])
      })
      .catch(error => console.error('Error fetching social links:', error))

    // Fetch navigation items
    fetch('/api/nav')
      .then(res => res.json())
      .then(data => {
        if (data.success) setNavItems(data.data || [])
      })
      .catch(error => console.error('Error fetching nav items:', error))
  }

  const saveProduct = async () => {
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'

      const method = editingProduct ? 'PUT' : 'POST'

      const payload: any = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock_quantity: parseInt(productForm.stock_quantity),
        category_id: parseInt(productForm.category_id),
        sku: productForm.sku || generateSKU(productForm.name),
        slug: slugify(productForm.name),
      }

      // Add image if provided
      if (productForm.image_url) {
        payload.images = [{
          image_url: productForm.image_url,
          is_primary: true,
          display_order: 1,
        }]
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
          image_url: '',
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

  const saveSocial = async () => {
    try {
      const url = editingSocial
        ? `/api/social-media/${editingSocial.id}`
        : '/api/social-media'

      const method = editingSocial ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...socialForm,
          is_active: socialForm.is_active ? 1 : 0,
        }),
      })

      const data = await res.json()

      if (data.success) {
        addToast(editingSocial ? 'Social link updated' : 'Social link created', 'success')
        setSocialModal(false)
        setEditingSocial(null)
        setSocialForm({
          platform: '',
          url: '',
          icon: '',
          display_order: 0,
          is_active: true,
        })
        fetchData()
      } else {
        addToast(data.message || 'Failed to save social link', 'error')
      }
    } catch (error) {
      console.error('Error saving social link:', error)
      addToast('Failed to save social link', 'error')
    }
  }

  const deleteSocial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this social media link?')) return

    try {
      const res = await fetch(`/api/social-media/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        addToast('Social link deleted', 'success')
        fetchData()
      } else {
        addToast('Failed to delete social link', 'error')
      }
    } catch (error) {
      console.error('Error deleting social link:', error)
      addToast('Failed to delete social link', 'error')
    }
  }

  const saveNav = async () => {
    try {
      const url = editingNav
        ? `/api/nav/${editingNav.id}`
        : '/api/nav'

      const method = editingNav ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...navForm,
          parent_id: navForm.parent_id || null,
          is_active: navForm.is_active ? 1 : 0,
        }),
      })

      const data = await res.json()

      if (data.success) {
        addToast(editingNav ? 'Nav item updated' : 'Nav item created', 'success')
        setNavModal(false)
        setEditingNav(null)
        setNavForm({
          label: '',
          href: '',
          parent_id: '',
          type: 'link',
          target: '_self',
          icon: '',
          display_order: 0,
          is_active: true,
          location: 'header',
        })
        fetchData()
      } else {
        addToast(data.message || 'Failed to save nav item', 'error')
      }
    } catch (error) {
      console.error('Error saving nav item:', error)
      addToast('Failed to save nav item', 'error')
    }
  }

  const deleteNav = async (id: number) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return

    try {
      const res = await fetch(`/api/nav/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        addToast('Nav item deleted', 'success')
        fetchData()
      } else {
        addToast('Failed to delete nav item', 'error')
      }
    } catch (error) {
      console.error('Error deleting nav item:', error)
      addToast('Failed to delete nav item', 'error')
    }
  }

  const handleMarkAsPaid = async (orderId: number) => {
    if (!confirm('Mark this order as paid? This will record the revenue.')) return

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: 'paid',
          paymentMethod: 'manual', // Admin manually marked as paid
        }),
      })

      const data = await res.json()

      if (data.success) {
        addToast('Order marked as paid successfully!', 'success')
        fetchData() // Refresh orders list
      } else {
        addToast(data.message || 'Failed to update order', 'error')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      addToast('Failed to update order', 'error')
    }
  }

  const toggleNavActive = async (item: any) => {
    try {
      const res = await fetch(`/api/nav/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          is_active: item.is_active === 1 ? 0 : 1,
        }),
      })

      const data = await res.json()

      if (data.success) {
        addToast(`Nav item ${item.is_active === 1 ? 'deactivated' : 'activated'}`, 'success')
        fetchData()
      } else {
        addToast('Failed to update nav item', 'error')
      }
    } catch (error) {
      console.error('Error updating nav item:', error)
      addToast('Failed to update nav item', 'error')
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
    { id: 'navigation', label: 'Navigation', icon: Menu },
    { id: 'social', label: 'Social Media', icon: Share2 },
  ]

  return (
    <AdminAuth>
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
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                  <CardTitle>Store Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-sm text-gray-500">From online orders</p>
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

            {/* Revenue Management Card */}
            <Card hover3D className="bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Revenue Management
                    </h3>
                    <p className="text-gray-600">
                      Track and analyze revenue from both online store and local billing
                    </p>
                  </div>
                  <div className="p-4 bg-primary-100 rounded-lg">
                    <DollarSign className="h-10 w-10 text-primary-600" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-lg font-bold text-gray-900">View Details</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Store vs Billing</p>
                    <p className="text-lg font-bold text-gray-900">Compare</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Export Data</p>
                    <p className="text-lg font-bold text-gray-900">CSV</p>
                  </div>
                </div>

                <Link href="/admin/revenue">
                  <Button variant="primary" size="lg" fullWidth>
                    <DollarSign className="h-5 w-5 mr-2" />
                    Open Revenue Dashboard
                  </Button>
                </Link>
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
                                  image_url: product.images?.[0]?.image_url || '',
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Payment Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
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
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.payment_status === 'paid' || order.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.payment_status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.payment_status || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {(order.payment_status === 'pending') && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleMarkAsPaid(order.id)}
                          >
                            Mark as Paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Social Media */}
        {activeTab === 'social' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Social Media Links</h2>
              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => {
                  setEditingSocial(null)
                  setSocialForm({
                    platform: '',
                    url: '',
                    icon: '',
                    display_order: 0,
                    is_active: true,
                  })
                  setSocialModal(true)
                }}
              >
                Add Social Link
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialLinks.map((link) => (
                <Card key={link.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-3 rounded-lg">
                          <Share2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{link.platform}</h3>
                          <p className="text-sm text-gray-500">Order: {link.display_order}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingSocial(link)
                            setSocialForm({
                              platform: link.platform,
                              url: link.url,
                              icon: link.icon,
                              display_order: link.display_order,
                              is_active: link.is_active === 1,
                            })
                            setSocialModal(true)
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => deleteSocial(link.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-16">Icon:</span>
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                          {link.icon}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-16">URL:</span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline truncate flex-1"
                        >
                          {link.url}
                        </a>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-16">Status:</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            link.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {link.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {socialLinks.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Share2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No social media links yet.</p>
                  <p className="text-sm mt-2">Click "Add Social Link" to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Tab */}
        {activeTab === 'navigation' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Navigation Items</h2>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingNav(null)
                  setNavForm({
                    label: '',
                    href: '',
                    parent_id: '',
                    type: 'link',
                    target: '_self',
                    icon: '',
                    display_order: 0,
                    is_active: true,
                    location: 'header',
                  })
                  setNavModal(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Nav Item
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {navItems.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{item.label}</h3>
                        <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNav(item)
                            setNavForm({
                              label: item.label,
                              href: item.href,
                              parent_id: item.parent_id?.toString() || '',
                              type: item.type,
                              target: item.target,
                              icon: item.icon || '',
                              display_order: item.display_order,
                              is_active: item.is_active === 1,
                              location: item.location,
                            })
                            setNavModal(true)
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteNav(item.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-20">Href:</span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded truncate flex-1">
                          {item.href}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-20">Order:</span>
                        <span className="font-medium">{item.display_order}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-20">Status:</span>
                        <button
                          type="button"
                          onClick={() => toggleNavActive(item)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-80 ${
                            item.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {navItems.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Menu className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No navigation items yet.</p>
                  <p className="text-sm mt-2">Click "Add Nav Item" to get started.</p>
                </div>
              )}
            </div>
          </div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <ImageUpload
              value={productForm.image_url}
              onChange={(url) => setProductForm({ ...productForm, image_url: url })}
              onRemove={() => setProductForm({ ...productForm, image_url: '' })}
            />
          </div>

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

      {/* Social Media Modal */}
      <Modal
        isOpen={socialModal}
        onClose={() => setSocialModal(false)}
        title={editingSocial ? 'Edit Social Link' : 'Add Social Link'}
      >
        <div className="space-y-4">
          <Input
            label="Platform Name"
            value={socialForm.platform}
            onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
            placeholder="e.g., Facebook, Instagram, Twitter"
            required
          />

          <Input
            label="URL"
            value={socialForm.url}
            onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
            placeholder="https://facebook.com/yourpage"
            required
          />

          <Select
            label="Icon"
            value={socialForm.icon}
            onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
            options={[
              { value: '', label: 'Select an icon' },
              { value: 'facebook', label: 'Facebook' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'twitter', label: 'Twitter / X' },
              { value: 'linkedin', label: 'LinkedIn' },
              { value: 'youtube', label: 'YouTube' },
            ]}
            required
          />

          <Input
            label="Display Order"
            type="number"
            value={socialForm.display_order.toString()}
            onChange={(e) => setSocialForm({ ...socialForm, display_order: parseInt(e.target.value) || 0 })}
            helperText="Lower numbers appear first"
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="social-active"
              checked={socialForm.is_active}
              onChange={(e) => setSocialForm({ ...socialForm, is_active: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="social-active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setSocialModal(false)} fullWidth>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveSocial} fullWidth>
              {editingSocial ? 'Update' : 'Create'} Link
            </Button>
          </div>
        </div>
      </Modal>

      {/* Navigation Modal */}
      <Modal
        isOpen={navModal}
        onClose={() => setNavModal(false)}
        title={editingNav ? 'Edit Navigation Item' : 'Add Navigation Item'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Label"
            value={navForm.label}
            onChange={(e) => setNavForm({ ...navForm, label: e.target.value })}
            required
          />

          <Input
            label="Href / URL"
            value={navForm.href}
            onChange={(e) => setNavForm({ ...navForm, href: e.target.value })}
            placeholder="/products or https://example.com"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              value={navForm.type}
              onChange={(e) => setNavForm({ ...navForm, type: e.target.value })}
              options={[
                { value: 'link', label: 'Link' },
                { value: 'button', label: 'Button' },
                { value: 'dropdown', label: 'Dropdown' },
                { value: 'group', label: 'Group' },
              ]}
              required
            />

            <Select
              label="Target"
              value={navForm.target}
              onChange={(e) => setNavForm({ ...navForm, target: e.target.value })}
              options={[
                { value: '_self', label: 'Same Tab' },
                { value: '_blank', label: 'New Tab' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Location"
              value={navForm.location}
              onChange={(e) => setNavForm({ ...navForm, location: e.target.value })}
              options={[
                { value: 'header', label: 'Header' },
                { value: 'footer', label: 'Footer' },
              ]}
            />

            <Input
              label="Display Order"
              type="number"
              value={navForm.display_order.toString()}
              onChange={(e) => setNavForm({ ...navForm, display_order: parseInt(e.target.value) || 0 })}
              helperText="Lower numbers appear first"
            />
          </div>

          <Input
            label="Icon (optional)"
            value={navForm.icon}
            onChange={(e) => setNavForm({ ...navForm, icon: e.target.value })}
            placeholder="lucide-react icon name"
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="nav-active"
              checked={navForm.is_active}
              onChange={(e) => setNavForm({ ...navForm, is_active: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="nav-active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setNavModal(false)} fullWidth>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveNav} fullWidth>
              {editingNav ? 'Update' : 'Create'} Nav Item
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </AdminAuth>
  )
}