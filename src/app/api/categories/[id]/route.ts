import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { apiResponse, apiError, slugify } from '@/lib/utils'

// GET /api/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb()
    const identifier = params.id
    const isNumeric = /^\d+$/.test(identifier)

    const category = db.prepare(`
      SELECT c.*, p.name as parent_name
      FROM categories c
      LEFT JOIN categories p ON c.parent_id = p.id
      WHERE ${isNumeric ? 'c.id' : 'c.slug'} = ?
    `).get(isNumeric ? parseInt(identifier) : identifier)

    if (!category) {
      return NextResponse.json(
        apiError('Category not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(apiResponse(category))
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      apiError('Failed to fetch category'),
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const db = getDb()
    const categoryId = parseInt(params.id)

    const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(categoryId)
    if (!existing) {
      return NextResponse.json(
        apiError('Category not found'),
        { status: 404 }
      )
    }

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

    if (body.parent_id !== undefined) {
      updates.push('parent_id = ?')
      values.push(body.parent_id)
    }

    if (body.image_url !== undefined) {
      updates.push('image_url = ?')
      values.push(body.image_url)
    }

    if (body.display_order !== undefined) {
      updates.push('display_order = ?')
      values.push(body.display_order)
    }

    if (body.is_active !== undefined) {
      updates.push('is_active = ?')
      values.push(body.is_active ? 1 : 0)
    }

    if (updates.length > 0) {
      const sql = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`
      values.push(categoryId)
      db.prepare(sql).run(values)
    }

    const category = db.prepare(`
      SELECT c.*, p.name as parent_name
      FROM categories c
      LEFT JOIN categories p ON c.parent_id = p.id
      WHERE c.id = ?
    `).get(categoryId)

    return NextResponse.json(apiResponse(category))
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      apiError('Failed to update category'),
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb()
    const categoryId = parseInt(params.id)

    const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(categoryId)
    if (!existing) {
      return NextResponse.json(
        apiError('Category not found'),
        { status: 404 }
      )
    }

    // Update products to remove category
    db.prepare('UPDATE products SET category_id = NULL WHERE category_id = ?').run(categoryId)

    // Update child categories to remove parent
    db.prepare('UPDATE categories SET parent_id = NULL WHERE parent_id = ?').run(categoryId)

    // Delete category
    db.prepare('DELETE FROM categories WHERE id = ?').run(categoryId)

    return NextResponse.json(apiResponse({ message: 'Category deleted successfully' }))
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      apiError('Failed to delete category'),
      { status: 500 }
    )
  }
}