'use client'

import { useState, useEffect, useCallback } from 'react'
import { FavoriteItem } from '@/types/favorites'
import {
  getFavorites,
  addToFavorites as addToFavoritesLib,
  removeFromFavorites as removeFromFavoritesLib,
  clearFavorites as clearFavoritesLib,
  isFavorite as isFavoriteLib,
  toggleFavorite as toggleFavoriteLib,
} from '@/lib/favorites'

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [count, setCount] = useState(0)

  // Load favorites from localStorage
  const loadFavorites = useCallback(() => {
    const favoritesData = getFavorites()
    setFavorites(favoritesData)
    setCount(favoritesData.length)
    setIsLoading(false)
  }, [])

  // Initialize favorites
  useEffect(() => {
    loadFavorites()

    // Listen for favorites updates from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wishlist_favorites') {
        loadFavorites()
      }
    }

    // Listen for custom favorites update event
    const handleFavoritesUpdate = () => {
      loadFavorites()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('favorites-updated', handleFavoritesUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favorites-updated', handleFavoritesUpdate)
    }
  }, [loadFavorites])

  // Add item to favorites
  const addToFavorites = useCallback((item: Omit<FavoriteItem, 'added_at'>) => {
    addToFavoritesLib(item)
    loadFavorites()
  }, [loadFavorites])

  // Remove item from favorites
  const removeFromFavorites = useCallback((productId: number) => {
    removeFromFavoritesLib(productId)
    loadFavorites()
  }, [loadFavorites])

  // Toggle favorite status
  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'added_at'>) => {
    const isNowFavorite = toggleFavoriteLib(item)
    loadFavorites()
    return isNowFavorite
  }, [loadFavorites])

  // Check if item is favorite
  const isFavorite = useCallback((productId: number) => {
    return isFavoriteLib(productId)
  }, [])

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    clearFavoritesLib()
    loadFavorites()
  }, [loadFavorites])

  return {
    favorites,
    count,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  }
}
