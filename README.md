# ModernStore - eCommerce & Billing System

A complete, production-ready eCommerce web application with an integrated Point-of-Sale (POS) billing system. Built with modern web technologies and featuring automatic database initialization, real-time synchronization, and a beautiful, animated user interface.

## Features

### 🛍️ Storefront
- **Product Catalog**: Browse products with advanced filtering, search, and sorting
- **Shopping Cart**: Persistent cart with cross-tab synchronization
- **Checkout System**: Complete order flow with customer information collection
- **Responsive Design**: Mobile-first design that works on all devices
- **Smooth Animations**: Framer Motion animations throughout the user experience

### 🎯 Admin Panel
- **Product Management**: Full CRUD operations for products with images
- **Category Management**: Hierarchical category system with parent-child relationships
- **Order Management**: View and manage customer orders with status tracking
- **Dashboard**: Real-time statistics and overview of store performance
- **Navigation Management**: Customize site navigation dynamically

### 💳 Billing/POS System
- **Fast Product Search**: Quick product lookup with real-time search
- **Visual Product Grid**: Product thumbnails for easy selection
- **Receipt Generation**: Professional receipt creation with order details
- **Automatic Stock Management**: Stock reduces automatically on sale
- **Multiple Payment Methods**: Cash, card, and other payment options
- **Change Calculator**: Automatic change calculation for cash payments

### 🔄 Real-Time Synchronization
- Changes in admin panel instantly reflect in the storefront and billing system
- No manual sync required - all systems share the same SQLite database
- Atomic transactions ensure data consistency

### 🚀 Auto-Initialization
- **Zero Manual Setup**: Database creates and seeds automatically on first run
- No migration commands needed
- Comes with sample products, categories, and navigation items

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom theme and animations
- **Database**: SQLite with better-sqlite3 (synchronous operations)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks with localStorage persistence
- **API**: Next.js API Routes (RESTful)

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nextjs-tailwind-sqlite-ecommerce-billing.git
cd nextjs-tailwind-sqlite-ecommerce-billing
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

**That's it!** The database will automatically create and seed itself on the first API call.

## Environment Variables

The application comes with sensible defaults in [.env.local](.env.local):

```env
DATABASE_PATH=./data/ecommerce.db
NEXT_PUBLIC_TAX_RATE=0.18
NEXT_PUBLIC_CURRENCY_SYMBOL=$
```

You can modify these values to customize:
- Database location
- Tax rate (18% default)
- Currency symbol

## Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (storefront)/         # Customer-facing pages
│   │   │   ├── products/         # Product listing
│   │   │   └── cart/             # Shopping cart & checkout
│   │   ├── admin/                # Admin panel
│   │   ├── billing/              # POS system
│   │   └── api/                  # API routes
│   │       ├── products/         # Product CRUD
│   │       ├── categories/       # Category CRUD
│   │       ├── orders/           # Order management
│   │       └── billing/          # Receipt creation
│   ├── components/
│   │   ├── layout/               # Layout components (Navbar, Footer)
│   │   └── ui/                   # Reusable UI components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/
│   │   ├── db/                   # Database initialization & seeding
│   │   ├── cart.ts               # Cart management logic
│   │   └── utils.ts              # Utility functions
│   └── types/                    # TypeScript type definitions
├── public/                       # Static assets
├── data/                         # SQLite database (auto-created)
└── .env.local                    # Environment variables
```

## Database Schema

The application uses 8 tables:

- **categories**: Product categories with hierarchical support
- **products**: Product information with SKU, pricing, and stock
- **product_images**: Multiple images per product
- **orders**: Customer orders with status tracking
- **order_items**: Individual items in orders
- **billing_receipts**: POS receipts with payment information
- **billing_items**: Items in receipts
- **nav_items**: Dynamic navigation menu items

## Usage

### Customer Shopping Flow
1. Browse products at `/products`
2. Add items to cart
3. Proceed to `/cart` for checkout
4. Enter customer information
5. Place order

### Admin Management
1. Navigate to `/admin`
2. Manage products, categories, and orders through tabs
3. View dashboard statistics
4. Changes sync automatically to storefront

### POS Billing
1. Go to `/billing`
2. Search or select products from grid
3. Add to cart with quantity
4. Click "Process Payment"
5. Enter payment details
6. Generate receipt

## API Endpoints

### Products
- `GET /api/products` - List products (with filters, search, pagination)
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `GET /api/categories/[id]` - Get single category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Orders
- `GET /api/orders` - List orders (with filters)
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order status

### Billing
- `GET /api/billing` - List receipts
- `POST /api/billing` - Create receipt

## Key Features Explained

### Auto-Initialization
The database automatically initializes on first run thanks to the [src/lib/db/index.ts](src/lib/db/index.ts) module. It:
1. Checks if database file exists
2. Creates database if missing
3. Runs schema migrations
4. Seeds with sample data
5. Configures SQLite pragmas (foreign keys, WAL mode)

### Stock Management
All stock updates use database transactions to ensure consistency:
- Orders reduce stock atomically
- Receipts reduce stock atomically
- Insufficient stock throws error and rolls back transaction
- No overselling possible

### Cart Synchronization
The cart uses localStorage with custom event dispatching:
- Changes in one tab sync to all open tabs
- Uses `storage` event for cross-tab sync
- Uses custom events for same-tab sync
- Validates stock before checkout

### Real-Time Sync
Admin, billing, and storefront share the same SQLite database:
- No additional sync mechanism needed
- Changes are immediately queryable
- Transaction-based updates ensure consistency

## Build for Production

```bash
npm run build
npm start
```

The application will run in production mode at [http://localhost:3000](http://localhost:3000)

## Customization

### Changing Theme Colors
Edit [tailwind.config.ts](tailwind.config.ts) to modify the color palette:
```typescript
colors: {
  primary: {
    50: '#f0f9ff',
    // ... customize colors
  }
}
```

### Adding Products
Use the admin panel at `/admin` or directly insert into the database:
```typescript
const db = getDb();
db.prepare('INSERT INTO products ...').run(...);
```

### Modifying Tax Rate
Update `NEXT_PUBLIC_TAX_RATE` in [.env.local](.env.local)

## Performance Optimization

- **SQLite WAL Mode**: Write-Ahead Logging for better concurrency
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic with Next.js App Router
- **Debounced Search**: Search input debounced to reduce API calls
- **Indexed Queries**: Database indexes on frequently queried columns

## Security Considerations

- **SQL Injection Prevention**: Using prepared statements throughout
- **Input Validation**: Server-side validation on all API routes
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Comprehensive try-catch blocks with proper error messages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide](https://lucide.dev/)

---

**Note**: This is a demonstration project. For production deployment, consider adding:
- User authentication and authorization
- Image upload functionality
- Payment gateway integration
- Email notifications
- Advanced reporting and analytics
- Backup and disaster recovery
- SSL/TLS configuration
- Rate limiting and security headers
