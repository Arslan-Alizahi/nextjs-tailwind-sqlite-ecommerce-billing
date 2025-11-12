import { NextRequest, NextResponse } from 'next/server'
import { getDb, runQuery, runInsert } from '@/lib/db'
import { Category } from '@/types/category'
import { apiResponse, apiError, slugify, buildCategoryTree } from '@/lib/utils'

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tree = searchParams.get('tree') === 'true'
    const parent_id = searchParams.get('parent_id')
    const is_active = searchParams.get('is_active')

    let sql = `
      SELECT
        c.*,
        p.name as parent_name,
        (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
      FROM categories c
      LEFT JOIN categories p ON c.parent_id = p.id
      WHERE 1=1
    `
    const params: any[] = []

    if (parent_id !== null) {
      sql += ' AND c.parent_id = ?'
      params.push(parent_id === 'null' ? null : parseInt(parent_id))
    }

    if (is_active !== null) {
      sql += ' AND c.is_active = ?'
      params.push(is_active === 'true' ? 1 : 0)
    }

    sql += ' ORDER BY c.display_order, c.name'

    const categories = runQuery<Category>(sql, params)

    if (tree) {
      const categoryTree = buildCategoryTree(categories)
      return NextResponse.json(apiResponse(categoryTree))
    }

    return NextResponse.json(apiResponse(categories))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      apiError('Failed to fetch categories'),
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = getDb()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        apiError('Category name is required'),
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const slug = body.slug || slugify(body.name)

    // Check if slug already exists
    const existing = db.prepare(
      'SELECT id FROM categories WHERE slug = ?'
    ).get(slug)

    if (existing) {
      return NextResponse.json(
        apiError('Category with this slug already exists'),
        { status: 400 }
      )
    }

    // Insert category
    const sql = `
      INSERT INTO categories (
        name, slug, description, parent_id, image_url,
        display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    const stmt = db.prepare(sql)
    const result = stmt.run(
      body.name,
      slug,
      body.description || null,
      body.parent_id || null,
      body.image_url || null,
      body.display_order || 0,
      body.is_active !== false ? 1 : 0
    )

    const categoryId = result.lastInsertRowid

    // Fetch the created category
    const category = db.prepare(`
      SELECT c.*, p.name as parent_name
      FROM categories c
      LEFT JOIN categories p ON c.parent_id = p.id
      WHERE c.id = ?
    `).get(categoryId)

    return NextResponse.json(
      apiResponse(category),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      apiError('Failed to create category'),
      { status: 500 }
    )
  }
}