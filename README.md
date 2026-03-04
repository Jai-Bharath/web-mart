<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
</div>

<br />

<div align="center">
  <h1>🛒 WebMart</h1>
  <p><strong>A World-Class Global Marketplace</strong></p>
  <p>Buy and sell anything, anywhere in the world</p>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Products-1200+-blue?style=flat-square" alt="Products" />
  <img src="https://img.shields.io/badge/Categories-15+-green?style=flat-square" alt="Categories" />
  <img src="https://img.shields.io/badge/Dark_Mode-Enabled-purple?style=flat-square" alt="Dark Mode" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
</div>

---

## ✨ Features

### 🛍️ For Buyers
- **Browse 1200+ Products** across 15+ categories
- **Smart Product Comparison** - Compare up to 4 products side-by-side
- **Advanced Filtering** - Filter by category, brand, price range, rating
- **Real-time Search** - Find products instantly
- **Wishlist & Cart** - Save favorites and manage purchases
- **Order Tracking** - Track your orders in real-time
- **Secure Checkout** - Multiple payment options

### 🏪 For Sellers
- **Beautiful Seller Dashboard** - Track sales, orders, and analytics
- **Easy Product Listing** - 4-step wizard to add products
- **Order Management** - Process and ship orders efficiently
- **Performance Analytics** - Sales charts and insights
- **Inventory Management** - Real-time stock tracking

### 🎨 Design & UX
- **Dark Mode by Default** - Easy on the eyes
- **Sky Blue Accent Colors** - Modern and professional
- **Glassmorphism UI** - Premium glass-like effects
- **Smooth Animations** - Powered by Framer Motion
- **Fully Responsive** - Mobile-first design
- **Accessible** - WCAG compliant components

---

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 |
| **Animations** | Framer Motion 12 |
| **State Management** | Zustand |
| **Backend** | Supabase (PostgreSQL) |
| **Data Fetching** | TanStack Query |
| **UI Components** | Custom components with CVA |
| **Notifications** | Sonner |

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account (for backend features)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/webmart.git
cd webmart

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Stripe for payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

---

## 🗂️ Project Structure

```
webmart/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── products/          # Product listing & details
│   ├── compare/           # Product comparison
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── track/             # Order tracking
│   └── seller/            # Seller dashboard & add product
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── product/          # Product-specific components
├── lib/                   # Utilities & data
│   ├── data.ts           # Product data (1200+ products)
│   ├── store.ts          # Zustand stores
│   ├── utils.ts          # Helper functions
│   └── supabase/         # Supabase client & functions
├── public/               # Static assets
└── supabase/            # Database schema
```

---

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, categories, featured products |
| Products | `/products` | Browse & filter all products |
| Product Detail | `/products/[id]` | Full product information |
| Compare | `/compare` | Side-by-side product comparison |
| Cart | `/cart` | Shopping cart management |
| Checkout | `/checkout` | Secure checkout process |
| Order Tracking | `/track` | Real-time order tracking |
| Seller Dashboard | `/seller/dashboard` | Seller analytics & management |
| Add Product | `/seller/add-product` | Product listing wizard |

---

## 🎯 Key Features Explained

### Product Comparison Engine
Compare up to 4 products with:
- Side-by-side specifications
- Feature comparison checkmarks
- Price & rating comparison
- One-click add to comparison from any product

### Advanced Filtering
- **Category**: 15+ categories with icons
- **Price Range**: Dual-handle slider ($0 - $10,000)
- **Brands**: Multi-select filter
- **Rating**: Minimum star rating
- **Availability**: In-stock filtering
- **Sorting**: Price, rating, newest, bestselling

### Seller Dashboard
- Revenue & order statistics
- Sales performance charts
- Product inventory management
- Recent orders table
- Quick action buttons

---

## 🗄️ Database Schema

The app uses Supabase with the following tables:

- **users** - User accounts with roles
- **sellers** - Seller profiles & verification
- **products** - Product listings with specifications
- **orders** - Purchase orders
- **order_tracking** - Shipment tracking events
- **wishlists** - User wishlists
- **reviews** - Product reviews & ratings
- **comparisons** - Saved product comparisons

Run the schema:
```bash
# In Supabase SQL Editor
-- Run the contents of supabase/schema.sql
```

---

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/webmart)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
- **Netlify**: Full support with Next.js adapter
- **AWS Amplify**: Enterprise-grade hosting
- **Docker**: Containerized deployment ready

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Unsplash](https://unsplash.com/) - Product images

---

<div align="center">
  <p>Built with ❤️ by WebMart Team</p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-deployment">Deployment</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>
