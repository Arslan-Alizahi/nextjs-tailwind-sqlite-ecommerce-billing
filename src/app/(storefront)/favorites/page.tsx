'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useFavorites } from '@/hooks/useFavorites'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/components/ui/Toast'
import { formatCurrency } from '@/lib/utils'
import { StockBadge } from '@/components/ui/Badge'

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, clearFavorites, isLoading } = useFavorites()
  const { addToCart } = useCart()
  const { addToast } = useToast()

  const handleRemove = (productId: number, productName: string) => {
    removeFromFavorites(productId)
    addToast(`${productName} removed from favorites`, 'info')
  }

  const handleAddToCart = (item: any) => {
    if (item.stock_quantity <= 0) {
      addToast('Product is out of stock', 'error')
      return
    }

    addToCart({
      product_id: item.product_id,
      product_name: item.product_name,
      product_slug: item.product_slug,
      product_image: item.product_image,
      product_sku: item.product_sku,
      quantity: 1,
      unit_price: item.price,
      stock_quantity: item.stock_quantity,
    })

    addToast(`${item.product_name} added to cart!`, 'success')
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      clearFavorites()
      addToast('All favorites cleared', 'info')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center">
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-red-500 fill-current" />
                My Favorites
              </h1>
              <p className="text-gray-600">
                {favorites.length === 0
                  ? 'No favorites yet. Start adding products you love!'
                  : `${favorites.length} ${favorites.length === 1 ? 'item' : 'items'} in your wishlist`}
              </p>
            </div>

            {favorites.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAll}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Card className="max-w-md mx-auto p-12">
              <Heart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Browse our products and add your favorites to keep track of items you love!
              </p>
              <Link href="/products">
                <Button size="lg">Browse Products</Button>
              </Link>
            </Card>
          </motion.div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {favorites.map((item, index) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card hover3D noPadding className="h-full flex flex-col relative group">
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.product_id, item.product_name)}
                      className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Product Image */}
                    <Link href={`/products/${item.product_slug}`}>
                      <div className="relative aspect-square bg-white overflow-hidden">
                        <Image
                          src={item.product_image || '/placeholder.png'}
                          alt={item.product_name}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <StockBadge quantity={item.stock_quantity} />
                        </div>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <Link href={`/products/${item.product_slug}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                          {item.product_name}
                        </h3>
                      </Link>

                      {item.product_sku && (
                        <p className="text-xs text-gray-500 mb-2">SKU: {item.product_sku}</p>
                      )}

                      <div className="flex items-baseline space-x-2 mb-4">
                        <span className="text-xl font-bold text-primary-600">
                          {formatCurrency(item.price)}
                        </span>
                        {item.compare_at_price && item.compare_at_price > item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(item.compare_at_price)}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto space-y-2">
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock_quantity <= 0}
                          leftIcon={<ShoppingCart className="w-4 h-4" />}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-red-500 border-red-500 hover:bg-red-50"
                          onClick={() => handleRemove(item.product_id, item.product_name)}
                          leftIcon={<Heart className="w-4 h-4 fill-current" />}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
