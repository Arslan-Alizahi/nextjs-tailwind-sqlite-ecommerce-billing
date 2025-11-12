export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  long_description?: string
  sku: string
  category_id: number
  category_name?: string
  price: number
  compare_at_price?: number
  cost_price?: number
  stock_quantity: number
  low_stock_threshold?: number
  is_featured?: boolean
  is_active?: boolean
  created_at?: string
  updated_at?: string
  images?: ProductImage[]
}

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  alt_text?: string
  display_order?: number
  is_primary?: boolean
  created_at?: string
}

export interface ProductVariant {
  id?: number
  product_id: number
  name: string
  options: string
  price_adjustment?: number
  stock_quantity?: number
}

export interface ProductFilter {
  category_id?: number
  min_price?: number
  max_price?: number
  is_featured?: boolean
  is_active?: boolean
  search?: string
  sort_by?: 'name' | 'price' | 'created_at' | 'stock'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}