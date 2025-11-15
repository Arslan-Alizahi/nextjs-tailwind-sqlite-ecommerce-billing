export interface FavoriteItem {
  product_id: number
  product_name: string
  product_slug: string
  product_image?: string
  product_sku?: string
  price: number
  compare_at_price?: number
  stock_quantity: number
  added_at: string
}

export interface FavoritesState {
  items: FavoriteItem[]
  count: number
}
