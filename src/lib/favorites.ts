import { FavoriteItem } from '@/types/favorites'

const FAVORITES_KEY = 'wishlist_favorites'

/**
 * Get all favorites from localStorage
 */
export const getFavorites = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error)
    return []
  }
}

/**
 * Save favorites to localStorage
 */
export const saveFavorites = (favorites: FavoriteItem[]): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))

    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(new Event('storage'))

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('favorites-updated'))
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error)
  }
}

/**
 * Check if a product is in favorites
 */
export const isFavorite = (productId: number): boolean => {
  const favorites = getFavorites()
  return favorites.some(item => item.product_id === productId)
}

/**
 * Add a product to favorites
 */
export const addToFavorites = (item: Omit<FavoriteItem, 'added_at'>): void => {
  const favorites = getFavorites()

  // Check if already in favorites
  if (favorites.some(fav => fav.product_id === item.product_id)) {
    return
  }

  const newItem: FavoriteItem = {
    ...item,
    added_at: new Date().toISOString(),
  }

  favorites.push(newItem)
  saveFavorites(favorites)
}

/**
 * Remove a product from favorites
 */
export const removeFromFavorites = (productId: number): void => {
  const favorites = getFavorites()
  const filtered = favorites.filter(item => item.product_id !== productId)
  saveFavorites(filtered)
}

/**
 * Toggle a product in favorites
 */
export const toggleFavorite = (item: Omit<FavoriteItem, 'added_at'>): boolean => {
  if (isFavorite(item.product_id)) {
    removeFromFavorites(item.product_id)
    return false
  } else {
    addToFavorites(item)
    return true
  }
}

/**
 * Clear all favorites
 */
export const clearFavorites = (): void => {
  saveFavorites([])
}

/**
 * Get favorites count
 */
export const getFavoritesCount = (): number => {
  return getFavorites().length
}

/**
 * Get a single favorite item
 */
export const getFavoriteItem = (productId: number): FavoriteItem | undefined => {
  const favorites = getFavorites()
  return favorites.find(item => item.product_id === productId)
}
