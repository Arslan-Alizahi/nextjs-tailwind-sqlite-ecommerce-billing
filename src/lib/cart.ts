import { CartItem } from '@/types/order'

const CART_STORAGE_KEY = 'shopping_cart'

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return []

  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY)
    return cartData ? JSON.parse(cartData) : []
  } catch (error) {
    console.error('Error loading cart:', error)
    return []
  }
}

export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))

    // Dispatch custom event for cart sync across tabs
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

export const addToCart = (item: CartItem): void => {
  const cart = getCart()
  const existingItemIndex = cart.findIndex(i => i.product_id === item.product_id)

  if (existingItemIndex > -1) {
    // Update quantity if item exists
    const maxQuantity = Math.min(
      cart[existingItemIndex].quantity + item.quantity,
      item.stock_quantity
    )
    cart[existingItemIndex].quantity = maxQuantity
  } else {
    // Add new item
    const maxQuantity = Math.min(item.quantity, item.stock_quantity)
    cart.push({ ...item, quantity: maxQuantity })
  }

  saveCart(cart)
}

export const updateCartItemQuantity = (productId: number, quantity: number): void => {
  const cart = getCart()
  const itemIndex = cart.findIndex(i => i.product_id === productId)

  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1)
    } else {
      // Update quantity (max: stock quantity)
      const maxQuantity = Math.min(quantity, cart[itemIndex].stock_quantity)
      cart[itemIndex].quantity = maxQuantity
    }

    saveCart(cart)
  }
}

export const removeFromCart = (productId: number): void => {
  const cart = getCart()
  const filteredCart = cart.filter(i => i.product_id !== productId)
  saveCart(filteredCart)
}

export const clearCart = (): void => {
  saveCart([])
}

export const getCartTotal = (): { itemCount: number; subtotal: number } => {
  const cart = getCart()

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0
  )

  return { itemCount, subtotal }
}

export const getCartItemCount = (): number => {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

export const isInCart = (productId: number): boolean => {
  const cart = getCart()
  return cart.some(item => item.product_id === productId)
}

export const getCartItem = (productId: number): CartItem | undefined => {
  const cart = getCart()
  return cart.find(item => item.product_id === productId)
}

// Validate cart items against current stock
export const validateCart = async (): Promise<{
  valid: boolean
  errors: string[]
  updatedCart?: CartItem[]
}> => {
  const cart = getCart()
  const errors: string[] = []
  const updatedCart: CartItem[] = []

  try {
    // Fetch current product data
    const response = await fetch('/api/products')
    const data = await response.json()
    const products = data.data || []

    for (const item of cart) {
      const product = products.find((p: any) => p.id === item.product_id)

      if (!product) {
        errors.push(`${item.product_name} is no longer available`)
        continue
      }

      if (!product.is_active) {
        errors.push(`${item.product_name} is currently unavailable`)
        continue
      }

      if (product.stock_quantity <= 0) {
        errors.push(`${item.product_name} is out of stock`)
        continue
      }

      if (item.quantity > product.stock_quantity) {
        errors.push(
          `${item.product_name} only has ${product.stock_quantity} units available`
        )
        updatedCart.push({
          ...item,
          quantity: product.stock_quantity,
          stock_quantity: product.stock_quantity,
        })
      } else {
        updatedCart.push({
          ...item,
          stock_quantity: product.stock_quantity,
        })
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors, updatedCart }
    }

    return { valid: true, errors: [], updatedCart }
  } catch (error) {
    console.error('Error validating cart:', error)
    return {
      valid: false,
      errors: ['Unable to validate cart. Please try again.'],
    }
  }
}

// Convert cart to order items format
export const cartToOrderItems = (): any[] => {
  const cart = getCart()

  return cart.map(item => ({
    product_id: item.product_id,
    product_name: item.product_name,
    product_sku: item.product_sku,
    product_image: item.product_image,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.unit_price * item.quantity,
  }))
}