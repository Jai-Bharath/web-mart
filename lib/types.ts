// Product Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  category: string;
  subcategory?: string;
  brand: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  specifications: Record<string, string | number>;
  features: string[];
  tags: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  shippingTime: string;
  freeShipping: boolean;
  status: "active" | "draft" | "sold" | "inactive";
  createdAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "buyer" | "seller" | "admin";
  createdAt: string;
}

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  rating: number;
  totalSales: number;
  responseTime: string;
  shippingLocations: string[];
  verified: boolean;
  createdAt: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order Types
export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentIntentId?: string;
  shippingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  price: number;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Tracking Types
export interface TrackingEvent {
  id: string;
  orderId: string;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
}

// Comparison Types
export interface Comparison {
  id: string;
  userId?: string;
  productIds: string[];
  name?: string;
  shared: boolean;
  shareToken?: string;
  createdAt: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpfulCount: number;
  createdAt: string;
}

// Filter Types
export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  brands?: string[];
  priceRange?: [number, number];
  rating?: number;
  freeShipping?: boolean;
  inStock?: boolean;
  sortBy?: "relevance" | "price-low" | "price-high" | "rating" | "newest" | "bestselling";
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: Subcategory[];
  productCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: "order" | "shipping" | "review" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
