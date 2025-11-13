import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { apiResponse, apiError } from '@/lib/utils'
import type { UpdateSocialMediaLinkInput } from '@/types/social-media'

// GET /api/social-media/[id] - Get single social media link
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb()
    const link = db
      .prepare('SELECT * FROM social_media_links WHERE id = ?')
      .get(params.id)

    if (!link) {
      return NextResponse.json(apiError('Social media link not found'), {
        status: 404,
      })
    }

    return NextResponse.json(apiResponse(link))
  } catch (error) {
    console.error('Error fetching social media link:', error)
    return NextResponse.json(apiError('Failed to fetch social media link'), {
      status: 500,
    })
  }
}

// PUT /api/social-media/[id] - Update social media link
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateSocialMediaLinkInput = await request.json()
    const db = getDb()

    // Check if link exists
    const existing = db
      .prepare('SELECT * FROM social_media_links WHERE id = ?')
      .get(params.id)

    if (!existing) {
      return NextResponse.json(apiError('Social media link not found'), {
        status: 404,
      })
    }

    // Build update query
    const updates: string[] = []
    const values: any[] = []

    if (body.platform !== undefined) {
      updates.push('platform = ?')
      values.push(body.platform)
    }
    if (body.url !== undefined) {
      updates.push('url = ?')
      values.push(body.url)
    }
    if (body.icon !== undefined) {
      updates.push('icon = ?')
      values.push(body.icon)
    }
    if (body.display_order !== undefined) {
      updates.push('display_order = ?')
      values.push(body.display_order)
    }
    if (body.is_active !== undefined) {
      updates.push('is_active = ?')
      values.push(body.is_active)
    }

    if (updates.length === 0) {
      return NextResponse.json(apiError('No fields to update'), { status: 400 })
    }

    values.push(params.id)

    db.prepare(
      `UPDATE social_media_links SET ${updates.join(', ')} WHERE id = ?`
    ).run(...values)

    const updatedLink = db
      .prepare('SELECT * FROM social_media_links WHERE id = ?')
      .get(params.id)

    return NextResponse.json(apiResponse(updatedLink, 'Social media link updated successfully'))
  } catch (error) {
    console.error('Error updating social media link:', error)
    return NextResponse.json(apiError('Failed to update social media link'), {
      status: 500,
    })
  }
}

// DELETE /api/social-media/[id] - Delete social media link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb()

    // Check if link exists
    const existing = db
      .prepare('SELECT * FROM social_media_links WHERE id = ?')
      .get(params.id)

    if (!existing) {
      return NextResponse.json(apiError('Social media link not found'), {
        status: 404,
      })
    }

    db.prepare('DELETE FROM social_media_links WHERE id = ?').run(params.id)

    return NextResponse.json(apiResponse(null, 'Social media link deleted successfully'))
  } catch (error) {
    console.error('Error deleting social media link:', error)
    return NextResponse.json(apiError('Failed to delete social media link'), {
      status: 500,
    })
  }
}
