'use client'

import { useState, useEffect, useCallback } from 'react'
import { CartItem } from '@/types/order'
import {
  getCart,
  saveCart,
  addToCart as addToCartLib,
  updateCartItemQuantity as updateQuantityLib,
  removeFromCart as removeFromCartLib,
  clearCart as clearCartLib,
  getCartTotal,
  validateCart,
} from '@/lib/cart'

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [itemCount, setItemCount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)

  // Load cart from localStorage
  const loadCart = useCallback(() => {
    const cartData = getCart()
    setCart(cartData)

    const { itemCount, subtotal } = getCartTotal()
    setItemCount(itemCount)
    setSubtotal(subtotal)
    setIsLoading(false)
  }, [])

  // Initialize cart
  useEffect(() => {
    loadCart()

    // Listen for cart updates from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'shopping_cart') {
        loadCart()
      }
    }

    // Listen for custom cart update event
    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cart-updated', handleCartUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cart-updated', handleCartUpdate)
    }
  }, [loadCart])

  // Add item to cart
  const addToCart = useCallback((item: CartItem) => {
    addToCartLib(item)
    loadCart()
  }, [loadCart])

  // Update item quantity
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    updateQuantityLib(productId, quantity)
    loadCart()
  }, [loadCart])

  // Remove item from cart
  const removeFromCart = useCallback((productId: number) => {
    removeFromCartLib(productId)
    loadCart()
  }, [loadCart])

  // Clear cart
  const clearCart = useCallback(() => {
    clearCartLib()
    loadCart()
  }, [loadCart])

  // Validate and update cart
  const validateAndUpdateCart = useCallback(async () => {
    setIsLoading(true)
    const result = await validateCart()

    if (!result.valid && result.updatedCart) {
      saveCart(result.updatedCart)
      loadCart()
    }

    setIsLoading(false)
    return result
  }, [loadCart])

  return {
    cart,
    itemCount,
    subtotal,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    validateAndUpdateCart,
  }
}