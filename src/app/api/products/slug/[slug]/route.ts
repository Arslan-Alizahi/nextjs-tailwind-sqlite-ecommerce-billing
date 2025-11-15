import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const db = getDb()
    const { slug } = params

    // Get product with category name
    const product = db
      .prepare(
        `
        SELECT
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          c.parent_id as parent_category_id,
          pc.name as parent_category_name,
          pc.slug as parent_category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN categories pc ON c.parent_id = pc.id
        WHERE p.slug = ? AND p.is_active = 1
      `
      )
      .get(slug)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get product images
    const images = db
      .prepare(
        `
        SELECT * FROM product_images 
        WHERE product_id = ? 
        ORDER BY display_order ASC, is_primary DESC
      `
      )
      .all(product.id)

    // Get related products (same category, excluding current product)
    const relatedProducts = db
      .prepare(
        `
        SELECT 
          p.*,
          c.name as category_name,
          (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ? 
        AND p.id != ? 
        AND p.is_active = 1
        ORDER BY p.is_featured DESC, p.created_at DESC
        LIMIT 4
      `
      )
      .all(product.category_id, product.id)

    return NextResponse.json({
      ...product,
      images,
      relatedProducts,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

