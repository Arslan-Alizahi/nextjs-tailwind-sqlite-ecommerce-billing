'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Share2, ChevronRight, Minus, Plus, Check, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { useCart } from '@/hooks/useCart'
import { useFavorites } from '@/hooks/useFavorites'
import { useToast } from '@/components/ui/Toast'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavorites()
  const { addToast } = useToast()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/slug/${params.slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/products')
            return
          }
          throw new Error('Failed to fetch product')
        }
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error:', error)
        addToast('Failed to load product', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug, router, addToast])

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: product.images?.[0]?.image_url || '/placeholder.png',
      product_sku: product.sku,
      quantity: quantity,
      unit_price: product.price,
      stock_quantity: product.stock_quantity,
    })

    addToast(`${product.name} added to cart!`, 'success')
  }

  const handleToggleFavorite = () => {
    if (!product) return

    const isNowFavorite = toggleFavorite({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: product.images?.[0]?.image_url || '/placeholder.png',
      product_sku: product.sku,
      price: product.price,
      compare_at_price: product.compare_at_price,
      stock_quantity: product.stock_quantity,
    })

    if (isNowFavorite) {
      addToast(`${product.name} added to favorites!`, 'success')
    } else {
      addToast(`${product.name} removed from favorites`, 'info')
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href,
    }

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        addToast('Product shared successfully!', 'success')
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        addToast('Link copied to clipboard!', 'success')
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        addToast('Failed to copy link', 'error')
      }
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const inStock = product.stock_quantity > 0
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= (product.low_stock_threshold || 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8 overflow-x-auto pb-2">
          <Link href="/" className="hover:text-primary-600 transition-colors whitespace-nowrap">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <Link href="/products" className="hover:text-primary-600 transition-colors whitespace-nowrap">
            Products
          </Link>
          {product.parent_category_name && product.parent_category_id && (
            <>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link
                href={`/products?category=${product.parent_category_id}`}
                className="hover:text-primary-600 transition-colors max-w-[100px] sm:max-w-none truncate"
              >
                {product.parent_category_name}
              </Link>
            </>
          )}
          {product.category_name && product.category_id && (
            <>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link
                href={`/products?category=${product.category_id}`}
                className="hover:text-primary-600 transition-colors max-w-[100px] sm:max-w-none truncate"
              >
                {product.category_name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-gray-900 font-medium max-w-[150px] sm:max-w-none truncate">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-square relative bg-white">
                <Image
                  src={product.images?.[selectedImage]?.image_url || '/placeholder.png'}
                  alt={product.images?.[selectedImage]?.alt_text || product.name}
                  fill
                  className="object-contain p-8"
                  priority
                />
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-600 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 text-sm sm:text-base">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-2xl text-gray-400 line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-3">
              {inStock ? (
                <>
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-2" />
                    <span className="font-medium">In Stock</span>
                  </div>
                  {lowStock && (
                    <Badge variant="warning">Only {product.stock_quantity} left!</Badge>
                  )}
                </>
              ) : (
                <div className="flex items-center text-red-600">
                  <X className="w-5 h-5 mr-2" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* SKU */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">SKU:</span> {product.sku}
            </div>

            {/* Quantity Selector */}
            {inStock && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      type="button"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock_quantity}
                      aria-label="Increase quantity"
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleToggleFavorite}
                    className={product && checkIsFavorite(product.id) ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}
                  >
                    <Heart className={`w-5 h-5 ${product && checkIsFavorite(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Long Description */}
            {product.long_description && (
              <Card className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                <p className="text-gray-700 whitespace-pre-line">{product.long_description}</p>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((relatedProduct: any) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.slug}`}>
                  <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square relative bg-white overflow-hidden">
                      <Image
                        src={relatedProduct.primary_image || '/placeholder.png'}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-bold text-primary-600">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                        {relatedProduct.compare_at_price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${relatedProduct.compare_at_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

