import { getDb } from '../index'

/**
 * Migration: Add Stripe-related columns to orders table
 */
export function addStripeColumns() {
  const db = getDb()

  try {
    // Check if columns already exist
    const tableInfo = db.prepare("PRAGMA table_info(orders)").all() as any[]
    const columnNames = tableInfo.map((col: any) => col.name)

    const columnsToAdd = [
      { name: 'stripe_product_id', type: 'TEXT' },
      { name: 'stripe_price_id', type: 'TEXT' },
      { name: 'stripe_payment_link_id', type: 'TEXT' },
      { name: 'stripe_payment_link_url', type: 'TEXT' },
      { name: 'stripe_payment_intent_id', type: 'TEXT' }
    ]

    for (const column of columnsToAdd) {
      if (!columnNames.includes(column.name)) {
        console.log(`Adding column ${column.name} to orders table...`)
        db.prepare(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`).run()
        console.log(`✓ Column ${column.name} added successfully`)
      } else {
        console.log(`Column ${column.name} already exists, skipping...`)
      }
    }

    console.log('✓ Stripe columns migration completed')
    return true
  } catch (error) {
    console.error('Error adding Stripe columns:', error)
    return false
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  addStripeColumns()
}

