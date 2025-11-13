import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { apiResponse, apiError } from '@/lib/utils'
import type { CreateSocialMediaLinkInput } from '@/types/social-media'

// GET /api/social-media - Get all social media links
export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active_only') === 'true'

    let query = `
      SELECT *
      FROM social_media_links
    `

    const conditions = []
    if (activeOnly) {
      conditions.push('is_active = 1')
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' ORDER BY display_order ASC'

    const links = db.prepare(query).all()

    return NextResponse.json(
      apiResponse({
        links,
        total: links.length,
      })
    )
  } catch (error) {
    console.error('Error fetching social media links:', error)
    return NextResponse.json(apiError('Failed to fetch social media links'), {
      status: 500,
    })
  }
}

// POST /api/social-media - Create new social media link
export async function POST(request: NextRequest) {
  try {
    const body: CreateSocialMediaLinkInput = await request.json()

    // Validation
    if (!body.platform || !body.url || !body.icon) {
      return NextResponse.json(
        apiError('Platform, URL, and icon are required'),
        { status: 400 }
      )
    }

    const db = getDb()

    const result = db
      .prepare(
        `
      INSERT INTO social_media_links (platform, url, icon, display_order, is_active)
      VALUES (?, ?, ?, ?, ?)
    `
      )
      .run(
        body.platform,
        body.url,
        body.icon,
        body.display_order ?? 0,
        body.is_active ?? 1
      )

    const newLink = db
      .prepare('SELECT * FROM social_media_links WHERE id = ?')
      .get(result.lastInsertRowid)

    return NextResponse.json(apiResponse(newLink, 'Social media link created successfully'), {
      status: 201,
    })
  } catch (error) {
    console.error('Error creating social media link:', error)
    return NextResponse.json(apiError('Failed to create social media link'), {
      status: 500,
    })
  }
}
