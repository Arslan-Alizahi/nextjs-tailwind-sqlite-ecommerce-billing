// Formatting utilities
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
  return `${symbol}${amount.toFixed(2)}`
}

export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// String utilities
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const truncate = (text: string, length: number = 100): string => {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

// Number utilities
export const calculateTax = (amount: number, taxRate?: number): number => {
  const rate = taxRate || parseFloat(process.env.NEXT_PUBLIC_TAX_RATE || '0.18')
  return amount * rate
}

export const calculateTotal = (
  subtotal: number,
  tax: number = 0,
  shipping: number = 0,
  discount: number = 0
): number => {
  return subtotal + tax + shipping - discount
}

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export const generateReceiptNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `RCP-${timestamp}-${random}`
}

export const generateSKU = (productName: string): string => {
  const prefix = productName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 3)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${random}`
}

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return re.test(phone)
}

// Image utilities
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.png'
  if (path.startsWith('http')) return path
  return path.startsWith('/') ? path : `/${path}`
}

export const getProductImageUrl = (product: any): string => {
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find((img: any) => img.is_primary)
    return getImageUrl(primaryImage?.image_url || product.images[0].image_url)
  }
  return '/placeholder.png'
}

// Stock utilities
export const getStockStatus = (quantity: number, threshold?: number): string => {
  const lowStockThreshold = threshold || parseInt(process.env.NEXT_PUBLIC_LOW_STOCK_THRESHOLD || '5')

  if (quantity <= 0) return 'Out of Stock'
  if (quantity <= lowStockThreshold) return 'Low Stock'
  return 'In Stock'
}

export const getStockStatusColor = (quantity: number, threshold?: number): string => {
  const status = getStockStatus(quantity, threshold)

  switch (status) {
    case 'Out of Stock':
      return 'text-red-600 bg-red-50'
    case 'Low Stock':
      return 'text-yellow-600 bg-yellow-50'
    case 'In Stock':
      return 'text-green-600 bg-green-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// Pagination utilities
export const calculatePagination = (
  totalItems: number,
  currentPage: number = 1,
  itemsPerPage: number = 12
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const offset = (currentPage - 1) * itemsPerPage

  return {
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    offset,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
}

// API response helpers
export const apiResponse = <T>(
  data: T,
  success: boolean = true,
  message?: string
) => {
  return {
    success,
    message,
    data,
  }
}

export const apiError = (message: string, statusCode: number = 400) => {
  return {
    success: false,
    message,
    statusCode,
  }
}

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Category tree builder
export const buildCategoryTree = (categories: any[]): any[] => {
  const categoryMap = new Map()
  const tree: any[] = []

  // First pass: create a map of all categories
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] })
  })

  // Second pass: build the tree
  categories.forEach(category => {
    if (category.parent_id) {
      const parent = categoryMap.get(category.parent_id)
      if (parent) {
        parent.children.push(categoryMap.get(category.id))
      }
    } else {
      tree.push(categoryMap.get(category.id))
    }
  })

  return tree
}

// Search and filter utilities
export const searchProducts = (products: any[], query: string): any[] => {
  const searchTerm = query.toLowerCase()
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description?.toLowerCase().includes(searchTerm) ||
    product.sku.toLowerCase().includes(searchTerm)
  )
}

export const filterProducts = (products: any[], filters: any): any[] => {
  let filtered = [...products]

  if (filters.category_id) {
    filtered = filtered.filter(p => p.category_id === filters.category_id)
  }

  if (filters.min_price !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.min_price)
  }

  if (filters.max_price !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.max_price)
  }

  if (filters.is_featured !== undefined) {
    filtered = filtered.filter(p => p.is_featured === filters.is_featured)
  }

  if (filters.in_stock) {
    filtered = filtered.filter(p => p.stock_quantity > 0)
  }

  return filtered
}

export const sortProducts = (products: any[], sortBy: string, order: 'asc' | 'desc' = 'asc'): any[] => {
  const sorted = [...products]

  sorted.sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (order === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })

  return sorted
}