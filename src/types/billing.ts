export interface BillingReceipt {
  id: number
  receipt_number: string
  customer_name?: string
  customer_phone?: string
  subtotal: number
  tax?: number
  discount?: number
  total: number
  payment_method?: PaymentMethod
  amount_paid: number
  change_amount?: number
  notes?: string
  created_at?: string
  items?: BillingItem[]
}

export interface BillingItem {
  id: number
  receipt_id: number
  product_id: number
  product_name: string
  product_sku?: string
  quantity: number
  unit_price: number
  subtotal: number
  created_at?: string
}

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other'

export interface BillingCart {
  items: BillingCartItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
}

export interface BillingCartItem {
  product_id: number
  product_name: string
  product_sku?: string
  product_image?: string
  quantity: number
  unit_price: number
  subtotal: number
  stock_quantity: number
}

export interface ReceiptFilter {
  receipt_number?: string
  customer_name?: string
  customer_phone?: string
  payment_method?: PaymentMethod
  date_from?: string
  date_to?: string
  page?: number
  limit?: number
}