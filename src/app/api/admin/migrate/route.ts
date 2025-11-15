import { NextResponse } from 'next/server'
import { migrateRevenue } from '@/lib/db/migrate-revenue'

export async function POST() {
  try {
    migrateRevenue()
    return NextResponse.json({
      success: true,
      message: 'Revenue migration completed successfully',
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Migration failed',
      },
      { status: 500 }
    )
  }
}
