export const createTables = `
  -- Categories table
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
  );

  -- Products table
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,
    sku TEXT UNIQUE NOT NULL,
    category_id INTEGER,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    is_featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  );

  -- Product images table
  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  -- Orders table
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    shipping_address TEXT,
    billing_address TEXT,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Order items table
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    product_image TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
  );

  -- Billing receipts table
  CREATE TABLE IF NOT EXISTS billing_receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_number TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    payment_method TEXT DEFAULT 'cash',
    amount_paid DECIMAL(10, 2) NOT NULL,
    change_amount DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Billing items table
  CREATE TABLE IF NOT EXISTS billing_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receipt_id) REFERENCES billing_receipts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
  );

  -- Navigation items table
  CREATE TABLE IF NOT EXISTS nav_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    parent_id INTEGER,
    type TEXT DEFAULT 'link',
    target TEXT DEFAULT '_self',
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    location TEXT DEFAULT 'header',
    meta TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES nav_items(id) ON DELETE CASCADE
  );

  -- Social media links table
  CREATE TABLE IF NOT EXISTS social_media_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Revenue transactions table (tracks all revenue from store and billing)
  CREATE TABLE IF NOT EXISTS revenue_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_type TEXT NOT NULL, -- 'store' or 'billing'
    reference_id INTEGER NOT NULL, -- order_id or receipt_id
    reference_number TEXT NOT NULL, -- order_number or receipt_number
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

  -- Indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
  CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
  CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
  CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
  CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
  CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
  CREATE INDEX IF NOT EXISTS idx_receipts_number ON billing_receipts(receipt_number);
  CREATE INDEX IF NOT EXISTS idx_nav_items_parent ON nav_items(parent_id);
  CREATE INDEX IF NOT EXISTS idx_nav_items_location ON nav_items(location);
  CREATE INDEX IF NOT EXISTS idx_social_media_display_order ON social_media_links(display_order);
  CREATE INDEX IF NOT EXISTS idx_revenue_transaction_type ON revenue_transactions(transaction_type);
  CREATE INDEX IF NOT EXISTS idx_revenue_transaction_date ON revenue_transactions(transaction_date);
  CREATE INDEX IF NOT EXISTS idx_revenue_reference ON revenue_transactions(transaction_type, reference_id);
`;

export const createTriggers = `
  -- Update timestamp trigger for categories
  CREATE TRIGGER IF NOT EXISTS update_categories_timestamp
  AFTER UPDATE ON categories
  BEGIN
    UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  -- Update timestamp trigger for products
  CREATE TRIGGER IF NOT EXISTS update_products_timestamp
  AFTER UPDATE ON products
  BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  -- Update timestamp trigger for orders
  CREATE TRIGGER IF NOT EXISTS update_orders_timestamp
  AFTER UPDATE ON orders
  BEGIN
    UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  -- Update timestamp trigger for nav_items
  CREATE TRIGGER IF NOT EXISTS update_nav_items_timestamp
  AFTER UPDATE ON nav_items
  BEGIN
    UPDATE nav_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  -- Update timestamp trigger for social_media_links
  CREATE TRIGGER IF NOT EXISTS update_social_media_timestamp
  AFTER UPDATE ON social_media_links
  BEGIN
    UPDATE social_media_links SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

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
`;