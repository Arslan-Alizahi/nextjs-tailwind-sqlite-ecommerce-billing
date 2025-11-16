'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { ProductCardSkeleton } from '@/components/ui/Spinner'
import { ShoppingCart, Search, Filter } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Product, ProductFilter } from '@/types/product'
import { Category } from '@/types/category'
import { useCart } from '@/hooks/useCart'
import { useDebounce } from '@/hooks/useDebounce'
import { StockBadge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize filters from URL params immediately
  const categoryParam = searchParams.get('category')
  const initialCategoryId = categoryParam ? parseInt(categoryParam) : undefined

  const [filters, setFilters] = useState<ProductFilter>({
    category_id: initialCategoryId,
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
  })
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useDebounce(filters.search || '', 500)
  const { addToCart } = useCart()
  const { addToast } = useToast()

  // Update filters when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const newCategoryId = categoryParam ? parseInt(categoryParam) : undefined

    setFilters(prev => ({
      ...prev,
      category_id: newCategoryId
    }))
    setCurrentPage(1) // Reset to first page when category changes
  }, [searchParams])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [debouncedSearch, filters.category_id, filters.sort_by, filters.sort_order, currentPage])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (filters.category_id) params.append('category_id', filters.category_id.toString())
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)
      params.append('page', currentPage.toString())
      params.append('limit', '12')

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()

      if (data.success) {
        setProducts(data.data.products || [])
        setTotalPages(data.data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    if (product.stock_quantity <= 0) {
      addToast('Product is out of stock', 'error')
      return
    }

    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: product.primary_image || product.images?.[0]?.image_url,
      product_sku: product.sku,
      quantity: 1,
      unit_price: product.price,
      stock_quantity: product.stock_quantity,
    })

    addToast(`${product.name} added to cart!`, 'success')
  }

  const sortOptions = [
    { value: 'created_at:desc', label: 'Newest First' },
    { value: 'created_at:asc', label: 'Oldest First' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'name:asc', label: 'Name: A to Z' },
    { value: 'name:desc', label: 'Name: Z to A' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Browse our complete collection</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Input
                placeholder="Search products..."
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Category Filter */}
            <Select
              placeholder="All Categories"
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map(cat => ({
                  value: cat.id.toString(),
                  label: cat.name,
                }))
              ]}
              value={filters.category_id?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value
                // Update URL to match the selection
                if (value) {
                  router.push(`${pathname}?category=${value}`)
                } else {
                  router.push(pathname)
                }
              }}
            />

            {/* Sort */}
            <Select
              options={sortOptions}
              value={`${filters.sort_by}:${filters.sort_order}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(':')
                setFilters({
                  ...filters,
                  sort_by: sortBy as any,
                  sort_order: sortOrder as any,
                })
              }}
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover3D noPadding className="h-full flex flex-col">
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative">
                      <img
                        src={product.primary_image || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <StockBadge quantity={product.stock_quantity} />
                      </div>
                    </div>
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-primary-600">
                          {formatCurrency(product.price)}
                        </span>
                        {product.compare_at_price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatCurrency(product.compare_at_price)}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<ShoppingCart className="h-4 w-4" />}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity <= 0}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}