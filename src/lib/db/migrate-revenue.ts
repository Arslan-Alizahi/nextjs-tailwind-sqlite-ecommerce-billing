import { getDb } from './index'

/**
 * Migration to add revenue_transactions table and triggers
 * Run this script to migrate existing database
 */
export const migrateRevenue = () => {
  const db = getDb()

  console.log('Starting revenue migration...')

  try {
    // Check if table already exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name='revenue_transactions'
    `).get()

    if (tableExists) {
      console.log('revenue_transactions table already exists, skipping...')
      return
    }

    // Create revenue_transactions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS revenue_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_type TEXT NOT NULL,
        reference_id INTEGER NOT NULL,
        reference_number TEXT NOT NULL,
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        subtotal DECIMAL(10, 2) NOT NULL,
        tax DECIMAL(10, 2) DEFAULT 0,
        discount DECIMAL(10, 2) DEFAULT 0,
        shipping_cost DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        payment_method TEXT,
        payment_status TEXT DEFAULT 'completed',
        notes TEXT,
        transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('✓ revenue_transactions table created')

    // Create indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_revenue_transaction_type ON revenue_transactions(transaction_type);
      CREATE INDEX IF NOT EXISTS idx_revenue_transaction_date ON revenue_transactions(transaction_date);
      CREATE INDEX IF NOT EXISTS idx_revenue_reference ON revenue_transactions(transaction_type, reference_id);
    `)
    console.log('✓ Indexes created')

    // Create triggers
    db.exec(`
      -- Auto-create revenue transaction when billing receipt is created
      CREATE TRIGGER IF NOT EXISTS create_revenue_from_billing
      AFTER INSERT ON billing_receipts
      BEGIN
        INSERT INTO revenue_transactions (
          transaction_type,
          reference_id,
          reference_number,
          customer_name,
          customer_phone,
          subtotal,
          tax,
          discount,
          total,
          payment_method,
          payment_status,
          notes,
          transaction_date
        ) VALUES (
          'billing',
          NEW.id,
          NEW.receipt_number,
          NEW.customer_name,
          NEW.customer_phone,
          NEW.subtotal,
          NEW.tax,
          NEW.discount,
          NEW.total,
          NEW.payment_method,
          'completed',
          NEW.notes,
          NEW.created_at
        );
      END;

      -- Auto-create revenue transaction when order is created (only if paid)
      CREATE TRIGGER IF NOT EXISTS create_revenue_from_order
      AFTER INSERT ON orders
      WHEN NEW.payment_status = 'completed' OR NEW.payment_status = 'paid'
      BEGIN
        INSERT INTO revenue_transactions (
          transaction_type,
          reference_id,
          reference_number,
          customer_name,
          customer_email,
          customer_phone,
          subtotal,
          tax,
          discount,
          shipping_cost,
          total,
          payment_method,
          payment_status,
          notes,
          transaction_date
        ) VALUES (
          'store',
          NEW.id,
          NEW.order_number,
          NEW.customer_name,
          NEW.customer_email,
          NEW.customer_phone,
          NEW.subtotal,
          NEW.tax,
          NEW.discount,
          NEW.shipping_cost,
          NEW.total,
          NEW.payment_method,
          NEW.payment_status,
          NEW.notes,
          NEW.created_at
        );
      END;

      -- Update revenue transaction when order payment status changes to completed
      CREATE TRIGGER IF NOT EXISTS update_revenue_on_order_payment
      AFTER UPDATE ON orders
      WHEN (OLD.payment_status != 'completed' AND OLD.payment_status != 'paid')
        AND (NEW.payment_status = 'completed' OR NEW.payment_status = 'paid')
      BEGIN
        INSERT INTO revenue_transactions (
          transaction_type,
          reference_id,
          reference_number,
          customer_name,
          customer_email,
          customer_phone,
          subtotal,
          tax,
          discount,
          shipping_cost,
          total,
          payment_method,
          payment_status,
          notes,
          transaction_date
        ) VALUES (
          'store',
          NEW.id,
          NEW.order_number,
          NEW.customer_name,
          NEW.customer_email,
          NEW.customer_phone,
          NEW.subtotal,
          NEW.tax,
          NEW.discount,
          NEW.shipping_cost,
          NEW.total,
          NEW.payment_method,
          NEW.payment_status,
          NEW.notes,
          NEW.updated_at
        );
      END;
    `)
    console.log('✓ Triggers created')

    // Migrate existing data - import historical billing receipts
    const existingReceipts = db.prepare(`
      SELECT * FROM billing_receipts ORDER BY created_at ASC
    `).all()

    if (existingReceipts.length > 0) {
      const insertStmt = db.prepare(`
        INSERT INTO revenue_transactions (
          transaction_type,
          reference_id,
          reference_number,
          customer_name,
          customer_phone,
          subtotal,
          tax,
          discount,
          total,
          payment_method,
          payment_status,
          notes,
          transaction_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const insertMany = db.transaction((receipts: any[]) => {
        for (const receipt of receipts) {
          insertStmt.run(
            'billing',
            receipt.id,
            receipt.receipt_number,
            receipt.customer_name,
            receipt.customer_phone,
            receipt.subtotal,
            receipt.tax,
            receipt.discount,
            receipt.total,
            receipt.payment_method,
            'completed',
            receipt.notes,
            receipt.created_at
          )
        }
      })

      insertMany(existingReceipts)
      console.log(`✓ Migrated ${existingReceipts.length} existing billing receipts`)
    }

    // Migrate existing orders (only completed/paid ones)
    const existingOrders = db.prepare(`
      SELECT * FROM orders
      WHERE payment_status = 'completed' OR payment_status = 'paid'
      ORDER BY created_at ASC
    `).all()

    if (existingOrders.length > 0) {
      const insertStmt = db.prepare(`
        INSERT INTO revenue_transactions (
          transaction_type,
          reference_id,
          reference_number,
          customer_name,
          customer_email,
          customer_phone,
          subtotal,
          tax,
          discount,
          shipping_cost,
          total,
          payment_method,
          payment_status,
          notes,
          transaction_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const insertMany = db.transaction((orders: any[]) => {
        for (const order of orders) {
          insertStmt.run(
            'store',
            order.id,
            order.order_number,
            order.customer_name,
            order.customer_email,
            order.customer_phone,
            order.subtotal,
            order.tax,
            order.discount,
            order.shipping_cost,
            order.total,
            order.payment_method,
            order.payment_status,
            order.notes,
            order.created_at
          )
        }
      })

      insertMany(existingOrders)
      console.log(`✓ Migrated ${existingOrders.length} existing store orders`)
    }

    console.log('✅ Revenue migration completed successfully!')
  } catch (error) {
    console.error('❌ Revenue migration failed:', error)
    throw error
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateRevenue()
}
