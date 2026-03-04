import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, User, Address } from "./types";

// ========== CART STORE ==========
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }

          return {
            items: [...state.items, { product, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "webmart-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ========== COMPARISON STORE ==========
interface ComparisonState {
  productIds: string[];
  isOpen: boolean;
  addProduct: (productId: string) => boolean;
  removeProduct: (productId: string) => void;
  clearComparison: () => void;
  clearAll: () => void;
  toggleComparison: () => void;
  isInComparison: (productId: string) => boolean;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      productIds: [],
      isOpen: false,

      addProduct: (productId) => {
        const currentIds = get().productIds;
        if (currentIds.length >= 4) {
          return false; // Max 4 products for comparison
        }
        if (currentIds.includes(productId)) {
          return true; // Already in comparison
        }
        set({ productIds: [...currentIds, productId] });
        return true;
      },

      removeProduct: (productId) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        }));
      },

      clearComparison: () => set({ productIds: [] }),
      clearAll: () => set({ productIds: [] }),
      toggleComparison: () => set((state) => ({ isOpen: !state.isOpen })),

      isInComparison: (productId) => {
        return get().productIds.includes(productId);
      },
    }),
    {
      name: "webmart-comparison",
    }
  )
);

// ========== WISHLIST STORE ==========
interface WishlistState {
  productIds: string[];
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  toggleProduct: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addProduct: (productId) => {
        if (!get().productIds.includes(productId)) {
          set((state) => ({ productIds: [...state.productIds, productId] }));
        }
      },

      removeProduct: (productId) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        }));
      },

      toggleProduct: (productId) => {
        if (get().isInWishlist(productId)) {
          get().removeProduct(productId);
        } else {
          get().addProduct(productId);
        }
      },

      isInWishlist: (productId) => {
        return get().productIds.includes(productId);
      },

      clearWishlist: () => set({ productIds: [] }),
    }),
    {
      name: "webmart-wishlist",
    }
  )
);

// ========== AUTH STORE ==========
interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}));

// ========== FILTER STORE ==========
interface FilterState {
  search: string;
  category: string;
  subcategory: string;
  brands: string[];
  priceRange: [number, number];
  rating: number;
  freeShipping: boolean;
  inStock: boolean;
  sortBy: "relevance" | "price-low" | "price-high" | "rating" | "newest" | "bestselling";
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSubcategory: (subcategory: string) => void;
  setBrands: (brands: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setRating: (rating: number) => void;
  setFreeShipping: (freeShipping: boolean) => void;
  setInStock: (inStock: boolean) => void;
  setSortBy: (sortBy: FilterState["sortBy"]) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  search: "",
  category: "",
  subcategory: "",
  brands: [],
  priceRange: [0, 10000] as [number, number],
  rating: 0,
  freeShipping: false,
  inStock: false,
  sortBy: "relevance" as const,
};

export const useFilterStore = create<FilterState>()((set) => ({
  ...defaultFilters,

  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category, subcategory: "" }),
  setSubcategory: (subcategory) => set({ subcategory }),
  setBrands: (brands) => set({ brands }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setRating: (rating) => set({ rating }),
  setFreeShipping: (freeShipping) => set({ freeShipping }),
  setInStock: (inStock) => set({ inStock }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(defaultFilters),
}));

// ========== UI STORE ==========
interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchModalOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  toggleSearchModal: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  searchModalOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  toggleSearchModal: () =>
    set((state) => ({ searchModalOpen: !state.searchModalOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));

// ========== CHECKOUT STORE ==========
interface CheckoutAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface PaymentMethod {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

interface CheckoutState {
  step: number;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  sameAsShipping: boolean;
  paymentMethod: PaymentMethod;
  setStep: (step: number) => void;
  setShippingAddress: (address: Partial<CheckoutAddress>) => void;
  setBillingAddress: (address: Partial<CheckoutAddress>) => void;
  setSameAsShipping: (same: boolean) => void;
  setPaymentMethod: (method: Partial<PaymentMethod>) => void;
  reset: () => void;
}

const defaultAddress: CheckoutAddress = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
  phone: "",
};

const defaultPayment: PaymentMethod = {
  cardNumber: "",
  cardHolder: "",
  expiry: "",
  cvv: "",
};

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  step: 1,
  shippingAddress: { ...defaultAddress },
  billingAddress: { ...defaultAddress },
  sameAsShipping: true,
  paymentMethod: { ...defaultPayment },

  setStep: (step) => set({ step }),
  setShippingAddress: (address) => set((state) => ({ 
    shippingAddress: { ...state.shippingAddress, ...address } 
  })),
  setBillingAddress: (address) => set((state) => ({ 
    billingAddress: { ...state.billingAddress, ...address } 
  })),
  setSameAsShipping: (sameAsShipping) => set({ sameAsShipping }),
  setPaymentMethod: (method) => set((state) => ({ 
    paymentMethod: { ...state.paymentMethod, ...method } 
  })),
  reset: () =>
    set({
      step: 1,
      shippingAddress: { ...defaultAddress },
      billingAddress: { ...defaultAddress },
      sameAsShipping: true,
      paymentMethod: { ...defaultPayment },
    }),
}));
