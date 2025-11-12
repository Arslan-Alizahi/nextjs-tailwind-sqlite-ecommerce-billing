import { NextRequest, NextResponse } from 'next/server'
import { getDb, runQuery, runInsert } from '@/lib/db'
import { Product, ProductFilter } from '@/types/product'
import { apiResponse, apiError, generateSKU, slugify } from '@/lib/utils'

// GET /api/products - Get all products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filters
    const filters: ProductFilter = {
      category_id: searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      is_featured: searchParams.get('is_featured') === 'true' ? true : searchParams.get('is_featured') === 'false' ? false : undefined,
      is_active: searchParams.get('is_active') === 'false' ? false : true,
      search: searchParams.get('search') || undefined,
      sort_by: (searchParams.get('sort_by') as any) || 'created_at',
      sort_order: (searchParams.get('sort_order') as any) || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
    }

    // Build SQL query
    let sql = `
      SELECT
        p.*,
        c.name as category_name,
        (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) as image_count,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `

    const params: any[] = []

    if (filters.is_active !== undefined) {
      sql += ' AND p.is_active = ?'
      params.push(filters.is_active ? 1 : 0)
    }

    if (filters.category_id !== undefined) {
      sql += ' AND p.category_id = ?'
      params.push(filters.category_id)
    }

    if (filters.min_price !== undefined) {
      sql += ' AND p.price >= ?'
      params.push(filters.min_price)
    }

    if (filters.max_price !== undefined) {
      sql += ' AND p.price <= ?'
      params.push(filters.max_price)
    }

    if (filters.is_featured !== undefined) {
      sql += ' AND p.is_featured = ?'
      params.push(filters.is_featured ? 1 : 0)
    }

    if (filters.search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)'
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    // Add sorting
    const sortColumn = filters.sort_by === 'name' ? 'p.name' :
                      filters.sort_by === 'price' ? 'p.price' :
                      filters.sort_by === 'stock' ? 'p.stock_quantity' :
                      'p.created_at'
    sql += ` ORDER BY ${sortColumn} ${filters.sort_order?.toUpperCase()}`

    // Add pagination
    const offset = (filters.page! - 1) * filters.limit!
    sql += ' LIMIT ? OFFSET ?'
    params.push(filters.limit, offset)

    const products = runQuery<Product>(sql, params)

    // Get total count
    let countSql = `
      SELECT COUNT(*) as total
      FROM products p
      WHERE 1=1
    `
    const countParams: any[] = []

    if (filters.is_active !== undefined) {
      countSql += ' AND p.is_active = ?'
      countParams.push(filters.is_active ? 1 : 0)
    }

    if (filters.category_id !== undefined) {
      countSql += ' AND p.category_id = ?'
      countParams.push(filters.category_id)
    }

    if (filters.min_price !== undefined) {
      countSql += ' AND p.price >= ?'
      countParams.push(filters.min_price)
    }

    if (filters.max_price !== undefined) {
      countSql += ' AND p.price <= ?'
      countParams.push(filters.max_price)
    }

    if (filters.is_featured !== undefined) {
      countSql += ' AND p.is_featured = ?'
      countParams.push(filters.is_featured ? 1 : 0)
    }

    if (filters.search) {
      countSql += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)'
      const searchTerm = `%${filters.search}%`
      countParams.push(searchTerm, searchTerm, searchTerm)
    }

    const countResult = runQuery<{ total: number }>(countSql, countParams)
    const total = countResult[0]?.total || 0

    // Get images for each product
    const productsWithImages = products.map(product => {
      const images = runQuery<any>(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
        [product.id]
      )
      return {
        ...product,
        images
      }
    })

    return NextResponse.json(
      apiResponse({
        products: productsWithImages,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          totalPages: Math.ceil(total / filters.limit!)
        }
      })
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      apiError('Failed to fetch products'),
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = getDb()

    // Validate required fields
    if (!body.name || !body.price || !body.category_id) {
      return NextResponse.json(
        apiError('Missing required fields'),
        { status: 400 }
      )
    }

    // Generate slug and SKU if not provided
    const slug = body.slug || slugify(body.name)
    const sku = body.sku || generateSKU(body.name)

    // Check if slug or SKU already exists
    const existing = db.prepare(
      'SELECT id FROM products WHERE slug = ? OR sku = ?'
    ).get(slug, sku)

    if (existing) {
      return NextResponse.json(
        apiError('Product with this slug or SKU already exists'),
        { status: 400 }
      )
    }

    // Insert product
    const sql = `
      INSERT INTO products (
        name, slug, description, long_description, sku, category_id,
        price, compare_at_price, cost_price, stock_quantity,
        low_stock_threshold, is_featured, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const stmt = db.prepare(sql)
    const result = stmt.run(
      body.name,
      slug,
      body.description || null,
      body.long_description || null,
      sku,
      body.category_id,
      body.price,
      body.compare_at_price || null,
      body.cost_price || null,
      body.stock_quantity || 0,
      body.low_stock_threshold || 5,
      body.is_featured ? 1 : 0,
      body.is_active !== false ? 1 : 0
    )

    const productId = result.lastInsertRowid

    // Add images if provided
    if (body.images && Array.isArray(body.images)) {
      const insertImage = db.prepare(`
        INSERT INTO product_images (
          product_id, image_url, alt_text, display_order, is_primary
        ) VALUES (?, ?, ?, ?, ?)
      `)

      body.images.forEach((image: any, index: number) => {
        insertImage.run(
          productId,
          image.image_url,
          image.alt_text || body.name,
          image.display_order || index,
          index === 0 ? 1 : 0
        )
      })
    }

    // Fetch the created product
    const product = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(productId)

    return NextResponse.json(
      apiResponse(product),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      apiError('Failed to create product'),
      { status: 500 }
    )
  }
}