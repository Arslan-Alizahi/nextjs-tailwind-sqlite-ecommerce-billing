import { NextRequest, NextResponse } from 'next/server'
import { getDb, runQuery } from '@/lib/db'
import { apiResponse, apiError, slugify } from '@/lib/utils'

// GET /api/products/[id] - Get single product by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb()
    const identifier = params.id

    // Check if identifier is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(identifier)

    const sql = `
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${isNumeric ? 'p.id' : 'p.slug'} = ?
    `

    const product = db.prepare(sql).get(isNumeric ? parseInt(identifier) : identifier)

    if (!product) {
      return NextResponse.json(
        apiError('Product not found'),
        { status: 404 }
      )
    }

    // Get product images
    const images = runQuery<any>(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
      [product.id]
    )

    // Get related products (same category, different product)
    const relatedProducts = runQuery<any>(
      `SELECT p.*,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM products p
       WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
       ORDER BY RANDOM()
       LIMIT 4`,
      [product.category_id, product.id]
    )

    return NextResponse.json(
      apiResponse({
        ...product,
        images,
        related_products: relatedProducts
      })
    )
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      apiError('Failed to fetch product'),
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const db = getDb()
    const productId = parseInt(params.id)

    // Check if product exists
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(productId)
    if (!existing) {
      return NextResponse.json(
        apiError('Product not found'),
        { status: 404 }
      )
    }

    // Build update query
    const updates: string[] = []
    const values: any[] = []

    if (body.name !== undefined) {
      updates.push('name = ?')
      values.push(body.name)
      if (!body.slug) {
        updates.push('slug = ?')
        values.push(slugify(body.name))
      }
    }

    if (body.slug !== undefined) {
      updates.push('slug = ?')
      values.push(body.slug)
    }

    if (body.description !== undefined) {
      updates.push('description = ?')
      values.push(body.description)
    }

    if (body.long_description !== undefined) {
      updates.push('long_description = ?')
      values.push(body.long_description)
    }

    if (body.sku !== undefined) {
      updates.push('sku = ?')
      values.push(body.sku)
    }

    if (body.category_id !== undefined) {
      updates.push('category_id = ?')
      values.push(body.category_id)
    }

    if (body.price !== undefined) {
      updates.push('price = ?')
      values.push(body.price)
    }

    if (body.compare_at_price !== undefined) {
      updates.push('compare_at_price = ?')
      values.push(body.compare_at_price)
    }

    if (body.cost_price !== undefined) {
      updates.push('cost_price = ?')
      values.push(body.cost_price)
    }

    if (body.stock_quantity !== undefined) {
      updates.push('stock_quantity = ?')
      values.push(body.stock_quantity)
    }

    if (body.low_stock_threshold !== undefined) {
      updates.push('low_stock_threshold = ?')
      values.push(body.low_stock_threshold)
    }

    if (body.is_featured !== undefined) {
      updates.push('is_featured = ?')
      values.push(body.is_featured ? 1 : 0)
    }

    if (body.is_active !== undefined) {
      updates.push('is_active = ?')
      values.push(body.is_active ? 1 : 0)
    }

    if (updates.length > 0) {
      const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`
      values.push(productId)
      db.prepare(sql).run(values)
    }

    // Update images if provided
    if (body.images && Array.isArray(body.images)) {
      // Delete existing images
      db.prepare('DELETE FROM product_images WHERE product_id = ?').run(productId)

      // Insert new images
      const insertImage = db.prepare(`
        INSERT INTO product_images (
          product_id, image_url, alt_text, display_order, is_primary
        ) VALUES (?, ?, ?, ?, ?)
      `)

      body.images.forEach((image: any, index: number) => {
        insertImage.run(
          productId,
          image.image_url,
          image.alt_text || body.name || 'Product image',
          image.display_order || index,
          index === 0 ? 1 : 0
        )
      })
    }

    // Fetch updated product
    const product = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(productId)

    return NextResponse.json(apiResponse(product))
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      apiError('Failed to update product'),
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb()
    const productId = parseInt(params.id)

    // Check if product exists
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(productId)
    if (!existing) {
      return NextResponse.json(
        apiError('Product not found'),
        { status: 404 }
      )
    }

    // Delete product (images will be cascade deleted)
    db.prepare('DELETE FROM products WHERE id = ?').run(productId)

    return NextResponse.json(apiResponse({ message: 'Product deleted successfully' }))
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      apiError('Failed to delete product'),
      { status: 500 }
    )
  }
}