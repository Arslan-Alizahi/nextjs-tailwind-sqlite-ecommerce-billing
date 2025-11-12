export interface Order {
  id: number
  order_number: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  shipping_address?: string
  billing_address?: string
  subtotal: number
  tax?: number
  shipping_cost?: number
  discount?: number
  total: number
  status?: OrderStatus
  payment_method?: string
  payment_status?: PaymentStatus
  notes?: string
  created_at?: string
  updated_at?: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_name: string
  product_sku?: string
  product_image?: string
  quantity: number
  unit_price: number
  subtotal: number
  created_at?: string
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderFilter {
  status?: OrderStatus
  payment_status?: PaymentStatus
  customer_email?: string
  customer_phone?: string
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  limit?: number
}

export interface CartItem {
  product_id: number
  product_name: string
  product_slug: string
  product_image?: string
  product_sku?: string
  quantity: number
  unit_price: number
  stock_quantity: number
}