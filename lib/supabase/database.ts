import { supabase } from './client';

// Helper to check if supabase is available
function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  }
  return supabase;
}

// ==================== TYPE DEFINITIONS ====================
export interface DBUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'buyer' | 'seller' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface DBSeller {
  id: string;
  user_id: string;
  business_name: string;
  description?: string;
  rating: number;
  total_sales: number;
  response_time?: string;
  shipping_locations: string[];
  policies: Record<string, any>;
  verified: boolean;
  created_at: string;
}

export interface DBProduct {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  images: string[];
  videos: string[];
  specifications: Record<string, string>;
  features: string[];
  tags: string[];
  status: 'draft' | 'active' | 'sold' | 'inactive';
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface DBOrder {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_intent_id?: string;
  shipping_address: {
    full_name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface DBOrderTracking {
  id: string;
  order_id: string;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
  created_at: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  images: string[];
  specifications: Record<string, string>;
  features: string[];
  tags: string[];
}

// ==================== AUTH FUNCTIONS ====================
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });
  
  if (error) throw error;
  
  // Create user profile
  if (data.user) {
    await getSupabase().from('users').insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role: 'buyer'
    });
  }
  
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await getSupabase().auth.getUser();
  if (error) throw error;
  
  if (!user) return null;
  
  // Get user profile
  const { data: profile } = await getSupabase()
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return profile as DBUser | null;
}

export function onAuthStateChange(callback: (user: any) => void) {
  return getSupabase().auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}

// ==================== SELLER FUNCTIONS ====================
export async function becomeSeller(userId: string, businessName: string, description: string) {
  // Update user role
  await getSupabase()
    .from('users')
    .update({ role: 'seller' })
    .eq('id', userId);
    
  // Create seller profile
  const { data, error } = await getSupabase()
    .from('sellers')
    .insert({
      user_id: userId,
      business_name: businessName,
      description
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as DBSeller;
}

export async function getSellerProfile(userId: string) {
  const { data, error } = await getSupabase()
    .from('sellers')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data as DBSeller | null;
}

export async function updateSellerProfile(sellerId: string, updates: Partial<DBSeller>) {
  const { data, error } = await getSupabase()
    .from('sellers')
    .update(updates)
    .eq('id', sellerId)
    .select()
    .single();
    
  if (error) throw error;
  return data as DBSeller;
}

// ==================== PRODUCT FUNCTIONS ====================
export async function createProduct(sellerId: string | null, product: CreateProductInput) {
  const { data, error } = await getSupabase()
    .from('products')
    .insert({
      seller_id: sellerId || null,
      ...product,
      status: 'active',
      view_count: 0
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as DBProduct;
}

export async function updateProduct(productId: string, updates: Partial<CreateProductInput>) {
  const { data, error } = await getSupabase()
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', productId)
    .select()
    .single();
    
  if (error) throw error;
  return data as DBProduct;
}

export async function deleteProduct(productId: string) {
  const { error } = await getSupabase()
    .from('products')
    .delete()
    .eq('id', productId);
    
  if (error) throw error;
}

export async function getProduct(productId: string) {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
    
  if (error) throw error;
  
  // Increment view count
  await getSupabase()
    .from('products')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', productId);
    
  return data as DBProduct;
}

export async function getProducts(filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  let query = getSupabase().from('products').select('*');
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }
  
  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  
  if (filters?.sellerId) {
    query = query.eq('seller_id', filters.sellerId);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  
  if (filters?.offset) {
    query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as DBProduct[];
}

export async function getSellerProducts(sellerId: string) {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as DBProduct[];
}

// ==================== ORDER FUNCTIONS ====================
export async function createOrder(order: {
  buyerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  shippingAddress: DBOrder['shipping_address'];
}) {
  const { data, error } = await getSupabase()
    .from('orders')
    .insert({
      buyer_id: order.buyerId,
      seller_id: order.sellerId,
      product_id: order.productId,
      quantity: order.quantity,
      total_amount: order.totalAmount,
      shipping_address: order.shippingAddress,
      status: 'pending'
    })
    .select()
    .single();
    
  if (error) throw error;
  
  // Create initial tracking
  await createOrderTracking(data.id, 'Order Placed', 'Your order has been received and is being processed.');
  
  return data as DBOrder;
}

export async function updateOrderStatus(orderId: string, status: DBOrder['status'], trackingNumber?: string) {
  const updates: any = { status, updated_at: new Date().toISOString() };
  if (trackingNumber) updates.tracking_number = trackingNumber;
  
  const { data, error } = await getSupabase()
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();
    
  if (error) throw error;
  
  // Add tracking event
  const statusMessages: Record<string, string> = {
    paid: 'Payment confirmed',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Order has been cancelled'
  };
  
  if (statusMessages[status]) {
    await createOrderTracking(orderId, status.charAt(0).toUpperCase() + status.slice(1), statusMessages[status]);
  }
  
  return data as DBOrder;
}

export async function getOrder(orderId: string) {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*, product:products(*)')
    .eq('id', orderId)
    .single();
    
  if (error) throw error;
  return data;
}

export async function getBuyerOrders(buyerId: string) {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*, product:products(*)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function getSellerOrders(sellerId: string) {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*, product:products(*), buyer:users!buyer_id(full_name, email)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

// ==================== ORDER TRACKING FUNCTIONS ====================
export async function createOrderTracking(orderId: string, status: string, description: string, location?: string) {
  const { data, error } = await getSupabase()
    .from('order_tracking')
    .insert({
      order_id: orderId,
      status,
      description,
      location,
      timestamp: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as DBOrderTracking;
}

export async function getOrderTracking(orderId: string) {
  const { data, error } = await getSupabase()
    .from('order_tracking')
    .select('*')
    .eq('order_id', orderId)
    .order('timestamp', { ascending: false });
    
  if (error) throw error;
  return data as DBOrderTracking[];
}

// ==================== WISHLIST FUNCTIONS ====================
export async function addToWishlist(userId: string, productId: string) {
  const { data, error } = await getSupabase()
    .from('wishlists')
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function removeFromWishlist(userId: string, productId: string) {
  const { error } = await getSupabase()
    .from('wishlists')
    .delete()
    .match({ user_id: userId, product_id: productId });
    
  if (error) throw error;
}

export async function getWishlist(userId: string) {
  const { data, error } = await getSupabase()
    .from('wishlists')
    .select('*, product:products(*)')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data;
}

// ==================== REVIEW FUNCTIONS ====================
export async function createReview(review: {
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
}) {
  const { data, error } = await getSupabase()
    .from('reviews')
    .insert({
      product_id: review.productId,
      user_id: review.userId,
      rating: review.rating,
      title: review.title,
      content: review.content
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getProductReviews(productId: string) {
  const { data, error } = await getSupabase()
    .from('reviews')
    .select('*, user:users(full_name, avatar_url)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

// ==================== IMAGE UPLOAD ====================
export async function uploadProductImage(file: File, productId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await getSupabase().storage
    .from('product-images')
    .upload(fileName, file);
    
  if (error) throw error;
  
  const { data: { publicUrl } } = getSupabase().storage
    .from('product-images')
    .getPublicUrl(fileName);
    
  return publicUrl;
}

export async function deleteProductImage(imageUrl: string) {
  const path = imageUrl.split('/product-images/')[1];
  if (!path) return;
  
  const { error } = await getSupabase().storage
    .from('product-images')
    .remove([path]);
    
  if (error) throw error;
}
