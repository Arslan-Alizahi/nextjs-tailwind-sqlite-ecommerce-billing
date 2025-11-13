import Database from 'better-sqlite3'

export const seedDatabase = (db: Database.Database) => {
  // Check if data already exists
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number }
  if (productCount.count > 0) {
    console.log('Database already seeded')
    return
  }

  console.log('Seeding database...')

  // Seed categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories' },
    { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Home decor and garden supplies' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sporting goods and outdoor equipment' },
    { name: 'Books & Media', slug: 'books-media', description: 'Books, music, and digital media' },
  ]

  const insertCategory = db.prepare(`
    INSERT INTO categories (name, slug, description, display_order, is_active)
    VALUES (?, ?, ?, ?, 1)
  `)

  const categoryIds: Record<string, number> = {}
  categories.forEach((cat, index) => {
    const result = insertCategory.run(cat.name, cat.slug, cat.description, index)
    categoryIds[cat.slug] = result.lastInsertRowid as number
  })

  // Add subcategories
  const subcategories = [
    { name: 'Smartphones', slug: 'smartphones', parent_id: categoryIds['electronics'], description: 'Mobile phones and accessories' },
    { name: 'Laptops', slug: 'laptops', parent_id: categoryIds['electronics'], description: 'Laptops and computers' },
    { name: 'Men\'s Clothing', slug: 'mens-clothing', parent_id: categoryIds['clothing'], description: 'Men\'s fashion' },
    { name: 'Women\'s Clothing', slug: 'womens-clothing', parent_id: categoryIds['clothing'], description: 'Women\'s fashion' },
    { name: 'Furniture', slug: 'furniture', parent_id: categoryIds['home-garden'], description: 'Home furniture' },
  ]

  const insertSubcategory = db.prepare(`
    INSERT INTO categories (name, slug, parent_id, description, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `)

  subcategories.forEach((subcat, index) => {
    const result = insertSubcategory.run(subcat.name, subcat.slug, subcat.parent_id, subcat.description, index)
    categoryIds[subcat.slug] = result.lastInsertRowid as number
  })

  // Seed products
  const products = [
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Latest Apple smartphone with advanced features',
      long_description: 'The iPhone 15 Pro features a stunning titanium design, A17 Pro chip, and advanced camera system. Experience the best of Apple innovation.',
      sku: 'IPH15P001',
      category_id: categoryIds['smartphones'],
      price: 999.99,
      compare_at_price: 1099.99,
      cost_price: 750.00,
      stock_quantity: 50,
      is_featured: 1,
    },
    {
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Premium Android smartphone with AI features',
      long_description: 'The Galaxy S24 brings cutting-edge AI capabilities, superior display technology, and exceptional camera performance.',
      sku: 'SGS24001',
      category_id: categoryIds['smartphones'],
      price: 899.99,
      compare_at_price: 999.99,
      cost_price: 680.00,
      stock_quantity: 45,
      is_featured: 1,
    },
    {
      name: 'MacBook Pro 14"',
      slug: 'macbook-pro-14',
      description: 'Professional laptop with M3 chip',
      long_description: 'The MacBook Pro 14" delivers unprecedented performance with the M3 chip, stunning Liquid Retina XDR display, and all-day battery life.',
      sku: 'MBP14001',
      category_id: categoryIds['laptops'],
      price: 1999.99,
      compare_at_price: 2199.99,
      cost_price: 1500.00,
      stock_quantity: 25,
      is_featured: 1,
    },
    {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'High-performance Windows laptop',
      long_description: 'The Dell XPS 15 combines powerful performance, stunning 4K display, and premium build quality for professionals and creators.',
      sku: 'DXP15001',
      category_id: categoryIds['laptops'],
      price: 1599.99,
      compare_at_price: 1799.99,
      cost_price: 1200.00,
      stock_quantity: 30,
      is_featured: 0,
    },
    {
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-tshirt',
      description: 'Comfortable everyday cotton t-shirt',
      long_description: '100% premium cotton t-shirt, perfect for everyday wear. Available in multiple colors and sizes.',
      sku: 'TSH001',
      category_id: categoryIds['mens-clothing'],
      price: 24.99,
      compare_at_price: 34.99,
      cost_price: 12.00,
      stock_quantity: 100,
      is_featured: 0,
    },
    {
      name: 'Denim Jeans - Slim Fit',
      slug: 'denim-jeans-slim',
      description: 'Modern slim fit denim jeans',
      long_description: 'Premium denim jeans with a modern slim fit. Durable construction with stretch fabric for comfort.',
      sku: 'JNS001',
      category_id: categoryIds['mens-clothing'],
      price: 59.99,
      compare_at_price: 79.99,
      cost_price: 35.00,
      stock_quantity: 75,
      is_featured: 0,
    },
    {
      name: 'Summer Dress - Floral',
      slug: 'summer-dress-floral',
      description: 'Light and breezy summer dress',
      long_description: 'Beautiful floral pattern summer dress made from breathable fabric. Perfect for warm weather occasions.',
      sku: 'DRS001',
      category_id: categoryIds['womens-clothing'],
      price: 49.99,
      compare_at_price: 69.99,
      cost_price: 25.00,
      stock_quantity: 60,
      is_featured: 1,
    },
    {
      name: 'Professional Blazer',
      slug: 'professional-blazer',
      description: 'Elegant blazer for business wear',
      long_description: 'Tailored blazer perfect for professional settings. Made from high-quality fabric with attention to detail.',
      sku: 'BLZ001',
      category_id: categoryIds['womens-clothing'],
      price: 89.99,
      compare_at_price: 119.99,
      cost_price: 55.00,
      stock_quantity: 40,
      is_featured: 0,
    },
    {
      name: 'Modern Office Desk',
      slug: 'modern-office-desk',
      description: 'Spacious desk with cable management',
      long_description: 'Contemporary office desk with built-in cable management, storage drawers, and ergonomic design.',
      sku: 'DSK001',
      category_id: categoryIds['furniture'],
      price: 399.99,
      compare_at_price: 499.99,
      cost_price: 250.00,
      stock_quantity: 20,
      is_featured: 1,
    },
    {
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description: 'Comfortable chair with lumbar support',
      long_description: 'High-quality ergonomic office chair with adjustable height, lumbar support, and breathable mesh back.',
      sku: 'CHR001',
      category_id: categoryIds['furniture'],
      price: 299.99,
      compare_at_price: 399.99,
      cost_price: 180.00,
      stock_quantity: 35,
      is_featured: 0,
    },
    {
      name: 'Bookshelf - 5 Tier',
      slug: 'bookshelf-5-tier',
      description: 'Wooden bookshelf with 5 shelves',
      long_description: 'Sturdy wooden bookshelf with 5 spacious tiers. Perfect for organizing books, decor, and more.',
      sku: 'BSH001',
      category_id: categoryIds['furniture'],
      price: 149.99,
      compare_at_price: 199.99,
      cost_price: 90.00,
      stock_quantity: 25,
      is_featured: 0,
    },
    {
      name: 'Yoga Mat - Premium',
      slug: 'yoga-mat-premium',
      description: 'Non-slip yoga mat with extra cushioning',
      long_description: 'Premium quality yoga mat with excellent grip and 6mm thickness for maximum comfort during practice.',
      sku: 'YGM001',
      category_id: categoryIds['sports-outdoors'],
      price: 39.99,
      compare_at_price: 49.99,
      cost_price: 20.00,
      stock_quantity: 80,
      is_featured: 0,
    },
    {
      name: 'Running Shoes - Pro',
      slug: 'running-shoes-pro',
      description: 'Professional running shoes with cushioning',
      long_description: 'High-performance running shoes with advanced cushioning technology and breathable upper mesh.',
      sku: 'RSH001',
      category_id: categoryIds['sports-outdoors'],
      price: 129.99,
      compare_at_price: 159.99,
      cost_price: 75.00,
      stock_quantity: 55,
      is_featured: 1,
    },
    {
      name: 'Camping Tent - 4 Person',
      slug: 'camping-tent-4person',
      description: 'Waterproof camping tent for 4 people',
      long_description: 'Durable and waterproof camping tent with easy setup. Spacious interior fits up to 4 people comfortably.',
      sku: 'TNT001',
      category_id: categoryIds['sports-outdoors'],
      price: 199.99,
      compare_at_price: 249.99,
      cost_price: 120.00,
      stock_quantity: 15,
      is_featured: 0,
    },
    {
      name: 'Bestseller Novel Collection',
      slug: 'bestseller-novel-collection',
      description: 'Collection of top 10 bestselling novels',
      long_description: 'Curated collection of the year\'s top 10 bestselling novels. Perfect for book lovers and gift giving.',
      sku: 'BKC001',
      category_id: categoryIds['books-media'],
      price: 99.99,
      compare_at_price: 149.99,
      cost_price: 60.00,
      stock_quantity: 40,
      is_featured: 1,
    },
    {
      name: 'Programming Guide Bundle',
      slug: 'programming-guide-bundle',
      description: 'Complete programming books bundle',
      long_description: 'Comprehensive collection of programming books covering web development, algorithms, and best practices.',
      sku: 'BKP001',
      category_id: categoryIds['books-media'],
      price: 149.99,
      compare_at_price: 199.99,
      cost_price: 90.00,
      stock_quantity: 30,
      is_featured: 0,
    },
    {
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'Noise-canceling Bluetooth headphones',
      long_description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
      sku: 'WHP001',
      category_id: categoryIds['electronics'],
      price: 249.99,
      compare_at_price: 299.99,
      cost_price: 150.00,
      stock_quantity: 65,
      is_featured: 1,
    },
    {
      name: 'Smart Watch Pro',
      slug: 'smart-watch-pro',
      description: 'Fitness and health tracking smartwatch',
      long_description: 'Advanced smartwatch with health monitoring, fitness tracking, GPS, and smartphone integration.',
      sku: 'SWT001',
      category_id: categoryIds['electronics'],
      price: 299.99,
      compare_at_price: 349.99,
      cost_price: 180.00,
      stock_quantity: 45,
      is_featured: 1,
    },
    {
      name: 'Garden Tool Set',
      slug: 'garden-tool-set',
      description: 'Complete 10-piece garden tool set',
      long_description: 'Professional garden tool set including all essential tools for gardening. Durable stainless steel construction.',
      sku: 'GTS001',
      category_id: categoryIds['home-garden'],
      price: 79.99,
      compare_at_price: 99.99,
      cost_price: 45.00,
      stock_quantity: 35,
      is_featured: 0,
    },
    {
      name: 'Indoor Plant Collection',
      slug: 'indoor-plant-collection',
      description: 'Set of 5 popular indoor plants',
      long_description: 'Carefully selected collection of 5 easy-to-care-for indoor plants. Perfect for home or office decoration.',
      sku: 'PLT001',
      category_id: categoryIds['home-garden'],
      price: 59.99,
      compare_at_price: 79.99,
      cost_price: 30.00,
      stock_quantity: 25,
      is_featured: 0,
    },
  ]

  const insertProduct = db.prepare(`
    INSERT INTO products (
      name, slug, description, long_description, sku, category_id,
      price, compare_at_price, cost_price, stock_quantity,
      low_stock_threshold, is_featured, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5, ?, 1)
  `)

  const productIds: number[] = []
  products.forEach((product) => {
    const result = insertProduct.run(
      product.name,
      product.slug,
      product.description,
      product.long_description,
      product.sku,
      product.category_id,
      product.price,
      product.compare_at_price,
      product.cost_price,
      product.stock_quantity,
      product.is_featured
    )
    productIds.push(result.lastInsertRowid as number)
  })

  // Seed product images
  const insertImage = db.prepare(`
    INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
    VALUES (?, ?, ?, ?, ?)
  `)

  productIds.forEach((productId, index) => {
    // Add primary image
    insertImage.run(
      productId,
      `/uploads/products/product-${index + 1}-main.jpg`,
      products[index].name,
      0,
      1
    )
    // Add secondary image
    insertImage.run(
      productId,
      `/uploads/products/product-${index + 1}-alt.jpg`,
      products[index].name + ' - Alternative view',
      1,
      0
    )
  })

  // Seed navigation items
  const navItems = [
    { label: 'Home', href: '/', display_order: 0 },
    { label: 'Shop', href: '/products', display_order: 1 },
    { label: 'Categories', href: '#', display_order: 2 },
    { label: 'About', href: '/about', display_order: 3 },
    { label: 'Billing', href: '/billing', display_order: 4 },
    { label: 'Admin', href: '/admin', display_order: 5 },
  ]

  const insertNav = db.prepare(`
    INSERT INTO nav_items (label, href, display_order, is_active, location)
    VALUES (?, ?, ?, 1, 'header')
  `)

  navItems.forEach((item) => {
    const result = insertNav.run(item.label, item.href, item.display_order)

    // Add dropdown items for Categories
    if (item.label === 'Categories') {
      const parentId = result.lastInsertRowid as number
      const insertSubNav = db.prepare(`
        INSERT INTO nav_items (label, href, parent_id, display_order, is_active, location)
        VALUES (?, ?, ?, ?, 1, 'header')
      `)

      categories.forEach((cat, index) => {
        insertSubNav.run(cat.name, `/categories/${cat.slug}`, parentId, index)
      })
    }
  })

  // Add footer navigation items
  const footerNavItems = [
    { label: 'Terms of Service', href: '/policies/terms', display_order: 0 },
    { label: 'Privacy Policy', href: '/policies/privacy', display_order: 1 },
    { label: 'Return Policy', href: '/policies/returns', display_order: 2 },
    { label: 'Contact Us', href: '/contact', display_order: 3 },
  ]

  const insertFooterNav = db.prepare(`
    INSERT INTO nav_items (label, href, display_order, is_active, location)
    VALUES (?, ?, ?, 1, 'footer')
  `)

  footerNavItems.forEach((item) => {
    insertFooterNav.run(item.label, item.href, item.display_order)
  })

  // Add social media links
  const socialMediaLinks = [
    { platform: 'Facebook', url: 'https://facebook.com/modernstore', icon: 'facebook', display_order: 0 },
    { platform: 'Instagram', url: 'https://instagram.com/modernstore', icon: 'instagram', display_order: 1 },
    { platform: 'Twitter', url: 'https://twitter.com/modernstore', icon: 'twitter', display_order: 2 },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/modernstore', icon: 'linkedin', display_order: 3 },
    { platform: 'YouTube', url: 'https://youtube.com/@modernstore', icon: 'youtube', display_order: 4 },
  ]

  const insertSocialMedia = db.prepare(`
    INSERT INTO social_media_links (platform, url, icon, display_order, is_active)
    VALUES (?, ?, ?, ?, 1)
  `)

  socialMediaLinks.forEach((item) => {
    insertSocialMedia.run(item.platform, item.url, item.icon, item.display_order)
  })

  console.log('Database seeded successfully!')
}