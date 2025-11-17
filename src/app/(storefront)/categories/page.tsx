'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import { ChevronRight, Package } from 'lucide-react'
import { Category } from '@/types/category'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Build category tree
  const buildCategoryTree = () => {
    const parentCategories = categories.filter(cat => !cat.parent_id)
    return parentCategories.map(parent => ({
      ...parent,
      children: categories.filter(cat => cat.parent_id === parent.id)
    }))
  }

  const categoryTree = buildCategoryTree()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Browse our wide selection of products organized by category
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categoryTree.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 h-full">
                {/* Parent Category */}
                <Link
                  href={`/products?category=${category.id}`}
                  className="group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-3 bg-primary-100 rounded-lg">
                          <Package className="w-6 h-6 text-primary-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {category.name}
                        </h2>
                      </div>
                      {category.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                {/* Subcategories */}
                {category.children && category.children.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Subcategories:</p>
                    <div className="space-y-2">
                      {category.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/products?category=${child.id}`}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <span className="text-gray-700 group-hover:text-primary-600 transition-colors">
                            {child.name}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Count */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href={`/products?category=${category.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    View all products
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {categoryTree.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No categories available</p>
          </div>
        )}
      </div>
    </div>
  )
}

