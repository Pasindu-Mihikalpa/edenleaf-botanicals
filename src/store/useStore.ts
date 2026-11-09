import { create } from 'zustand';
import { Product, CartItem, CustomerInfo, MatchmakerAnswers, TaxonomyId, OrderRecord, OrderStatus } from '../types';
import { ALL_PRODUCTS } from '../data/products';
import { SEED_ORDERS } from '../data/seedOrders';

interface StoreState {
  // Navigation / View Router
  currentView: 'storefront' | 'admin';
  setCurrentView: (view: 'storefront' | 'admin') => void;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  isPasskeyModalOpen: boolean;
  setIsPasskeyModalOpen: (open: boolean) => void;
  adminPasskey: string;
  loginAdmin: (enteredPasskey: string) => boolean;
  logoutAdmin: () => void;

  // Dynamic Product Inventory (Persisted in localStorage)
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductStockPrice: (id: string, price: number, stockCount: number) => void;
  deleteProduct: (id: string) => void;
  resetCatalog: () => void;

  // Order Management Center
  orders: OrderRecord[];
  addOrder: (order: Omit<OrderRecord, 'id' | 'date' | 'status'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, potVariant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Order Dispatch
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  dispatchPhone: string;
  setDispatchPhone: (phone: string) => void;
  dispatchEmail: string;
  setDispatchEmail: (email: string) => void;

  // Catalog Filters & Search
  activeCategory: TaxonomyId | 'all';
  setActiveCategory: (cat: TaxonomyId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLight: string;
  setSelectedLight: (light: string) => void;
  selectedMaintenance: string;
  setSelectedMaintenance: (maint: string) => void;
  petFriendlyOnly: boolean;
  setPetFriendlyOnly: (val: boolean) => void;
  selectedSort: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';
  setSelectedSort: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc') => void;
  resetFilters: () => void;

  // Plant Matchmaker
  isMatchmakerOpen: boolean;
  setIsMatchmakerOpen: (open: boolean) => void;
  matchmakerStep: number;
  setMatchmakerStep: (step: number) => void;
  matchmakerAnswers: MatchmakerAnswers;
  setMatchmakerAnswer: (key: keyof MatchmakerAnswers, value: string) => void;
  resetMatchmaker: () => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
}

// LocalStorage helpers
const STORAGE_PRODUCTS_KEY = 'edenleaf_products_hayleys_v1';

const loadSavedProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load saved products', e);
  }
  return ALL_PRODUCTS.map((p) => ({
    ...p,
    stockCount: p.stockCount !== undefined ? p.stockCount : 24,
    inStock: true
  }));
};

const loadSavedOrders = (): OrderRecord[] => {
  try {
    const saved = localStorage.getItem('edenleaf_orders_v2');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load saved orders', e);
  }
  return SEED_ORDERS;
};

const initialCustomerInfo: CustomerInfo = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: ''
};

const initialMatchmakerAnswers: MatchmakerAnswers = {
  light: '',
  maintenance: '',
  environment: '',
  petSafe: '',
  purpose: ''
};

export const useStore = create<StoreState>((set, get) => ({
  // Navigation / View Router
  currentView: (() => {
    if (typeof window === 'undefined') return 'storefront';
    const isSavedAdmin = sessionStorage.getItem('edenleaf_initial_route') === 'admin';
    if (isSavedAdmin) sessionStorage.removeItem('edenleaf_initial_route');
    return window.location.pathname.endsWith('/admin') || window.location.pathname === '/admin' || isSavedAdmin
      ? 'admin'
      : 'storefront';
  })(),
  setCurrentView: (view) => {
    if (typeof window !== 'undefined') {
      const path = view === 'admin' ? '/admin' : '/';
      window.history.pushState(null, '', path);
    }
    set({ currentView: view });
  },

  // Admin Authentication
  isAdminAuthenticated: typeof sessionStorage !== 'undefined' && sessionStorage.getItem('edenleaf_admin_auth') === 'true',
  isPasskeyModalOpen: false,
  setIsPasskeyModalOpen: (open) => set({ isPasskeyModalOpen: open }),
  adminPasskey: 'eden2026',
  loginAdmin: (enteredPasskey) => {
    if (enteredPasskey === get().adminPasskey) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('edenleaf_admin_auth', 'true');
      }
      set({ isAdminAuthenticated: true, isPasskeyModalOpen: false, currentView: 'admin' });
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/admin');
      }
      return true;
    }
    return false;
  },
  logoutAdmin: () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('edenleaf_admin_auth');
    }
    set({ isAdminAuthenticated: false, currentView: 'storefront' });
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
  },

  // Dynamic Product Inventory
  products: loadSavedProducts(),
  addProduct: (newProd) => {
    const id = `el-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      inStock: (newProd.stockCount || 0) > 0
    };
    const updated = [product, ...get().products];
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
    } catch {}
    set({ products: updated });
  },
  updateProduct: (id, updates) => {
    const updated = get().products.map((p) => {
      if (p.id === id) {
        const merged = { ...p, ...updates };
        if (updates.stockCount !== undefined) {
          merged.inStock = updates.stockCount > 0;
        }
        return merged;
      }
      return p;
    });
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
    } catch {}
    set({ products: updated });
  },
  updateProductStockPrice: (id, price, stockCount) => {
    const updated = get().products.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          price: Math.max(0.5, price),
          stockCount: Math.max(0, stockCount),
          inStock: stockCount > 0
        };
      }
      return p;
    });
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
    } catch {}
    set({ products: updated });
  },
  deleteProduct: (id) => {
    const updated = get().products.filter((p) => p.id !== id);
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
    } catch {}
    set({ products: updated });
  },
  resetCatalog: () => {
    const fresh = ALL_PRODUCTS.map((p) => ({
      ...p,
      stockCount: 24,
      inStock: true
    }));
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(fresh));
    } catch {}
    set({ products: fresh });
  },

  // Order Management Center
  orders: loadSavedOrders(),
  addOrder: (orderData) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString(),
      status: 'Pending'
    };
    const updated = [newOrder, ...get().orders];
    try {
      localStorage.setItem('edenleaf_orders_v2', JSON.stringify(updated));
    } catch {}
    set({ orders: updated });
    return orderId;
  },
  updateOrderStatus: (orderId, status) => {
    const updated = get().orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    try {
      localStorage.setItem('edenleaf_orders_v2', JSON.stringify(updated));
    } catch {}
    set({ orders: updated });
  },
  deleteOrder: (orderId) => {
    const updated = get().orders.filter((o) => o.id !== orderId);
    try {
      localStorage.setItem('edenleaf_orders_v2', JSON.stringify(updated));
    } catch {}
    set({ orders: updated });
  },

  // Cart
  cart: [],
  isCartOpen: false,
  setIsCartOpen: (open) => set({ isCartOpen: open }),
  addToCart: (product, quantity = 1, potVariant) => {
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity, potVariant: potVariant || item.potVariant }
              : item
          ),
          isCartOpen: true
        };
      }
      return {
        cart: [...state.cart, { product, quantity, potVariant }],
        isCartOpen: true
      };
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId)
    }));
  },
  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    }));
  },
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
  getCartCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Order Dispatch
  isOrderModalOpen: false,
  setIsOrderModalOpen: (open) => set({ isOrderModalOpen: open }),
  customerInfo: initialCustomerInfo,
  setCustomerInfo: (info) => set((state) => ({ customerInfo: { ...state.customerInfo, ...info } })),
  dispatchPhone: '+1 (555) 019-2834',
  setDispatchPhone: (phone) => set({ dispatchPhone: phone }),
  dispatchEmail: 'orders@edenleaf.com',
  setDispatchEmail: (email) => set({ dispatchEmail: email }),

  // Catalog
  activeCategory: 'all',
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedLight: 'all',
  setSelectedLight: (light) => set({ selectedLight: light }),
  selectedMaintenance: 'all',
  setSelectedMaintenance: (maint) => set({ selectedMaintenance: maint }),
  petFriendlyOnly: false,
  setPetFriendlyOnly: (val) => set({ petFriendlyOnly: val }),
  selectedSort: 'featured',
  setSelectedSort: (sort) => set({ selectedSort: sort }),
  resetFilters: () => set({
    activeCategory: 'all',
    searchQuery: '',
    selectedLight: 'all',
    selectedMaintenance: 'all',
    petFriendlyOnly: false,
    selectedSort: 'featured'
  }),

  // Matchmaker
  isMatchmakerOpen: false,
  setIsMatchmakerOpen: (open) => set({ isMatchmakerOpen: open }),
  matchmakerStep: 1,
  setMatchmakerStep: (step) => set({ matchmakerStep: step }),
  matchmakerAnswers: initialMatchmakerAnswers,
  setMatchmakerAnswer: (key, value) =>
    set((state) => ({
      matchmakerAnswers: { ...state.matchmakerAnswers, [key]: value }
    })),
  resetMatchmaker: () =>
    set({
      matchmakerStep: 1,
      matchmakerAnswers: initialMatchmakerAnswers
    }),

  // Quick View
  quickViewProduct: null,
  setQuickViewProduct: (product) => set({ quickViewProduct: product })
}));
