import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// GET /api/nav - Get all navigation items
export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') || 'header'
    const activeOnly = searchParams.get('active_only') === 'true'

    let sql = `
      SELECT * FROM nav_items 
      WHERE location = ?
    `
    const params: any[] = [location]

    if (activeOnly) {
      sql += ' AND is_active = 1'
    }

    sql += ' ORDER BY display_order ASC, id ASC'

    const items = db.prepare(sql).all(...params)

    return NextResponse.json({
      success: true,
      data: items,
    })
  } catch (error) {
    console.error('Error fetching nav items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch navigation items' },
      { status: 500 }
    )
  }
}

// POST /api/nav - Create new navigation item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = getDb()

    // Validate required fields
    if (!body.label || !body.href) {
      return NextResponse.json(
        { success: false, error: 'Label and href are required' },
        { status: 400 }
      )
    }

    const sql = `
      INSERT INTO nav_items (
        label, href, parent_id, type, target, icon,
        display_order, is_active, location, meta
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const stmt = db.prepare(sql)
    const result = stmt.run(
      body.label,
      body.href,
      body.parent_id || null,
      body.type || 'link',
      body.target || '_self',
      body.icon || null,
      body.display_order || 0,
      body.is_active !== false ? 1 : 0,
      body.location || 'header',
      body.meta ? JSON.stringify(body.meta) : null
    )

    const newItem = db
      .prepare('SELECT * FROM nav_items WHERE id = ?')
      .get(result.lastInsertRowid)

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Navigation item created successfully',
    })
  } catch (error) {
    console.error('Error creating nav item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create navigation item' },
      { status: 500 }
    )
  }
}

