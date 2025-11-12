export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent_id?: number
  parent_name?: string
  image_url?: string
  display_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
  children?: Category[]
  product_count?: number
}

export interface CategoryTree {
  id: number
  name: string
  slug: string
  children: CategoryTree[]
}

export interface CategoryFilter {
  parent_id?: number
  is_active?: boolean
  include_children?: boolean
}