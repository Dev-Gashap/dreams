import { create } from 'zustand';
import type {
  User,
  AccountMode,
  CartItem,
  Product,
  FulfillmentType,
  RentalPeriod,
  Notification,
  ProductSearchFilters,
} from '@/types';
import { mockNotifications } from '@/lib/mock-data';

// ---- Auth Store ----
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accountMode: AccountMode;
  setUser: (user: User | null) => void;
  setAccountMode: (mode: AccountMode) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'user_001',
    email: 'demo@dreams.app',
    full_name: 'Alex Morgan',
    phone: '+1-713-555-0100',
    role: 'business',
    account_mode: 'business',
    company_id: 'comp_001',
    is_verified: true,
    created_at: '2025-06-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
  },
  isLoading: false,
  isAuthenticated: true,
  accountMode: 'business',
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAccountMode: (mode) => set({ accountMode: mode }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// ---- Cart Store ----
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity: number, fulfillmentType: FulfillmentType, rentalPeriod?: RentalPeriod) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (product, quantity, fulfillment_type, rental_period) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id && i.fulfillment_type === fulfillment_type);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id && i.fulfillment_type === fulfillment_type
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { product, quantity, fulfillment_type, rental_period }],
        isOpen: true,
      };
    });
  },
  removeItem: (productId) => set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((i) => i.product.id !== productId)
        : state.items.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
    })),
  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  setCartOpen: (isOpen) => set({ isOpen }),
  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => {
      if (item.fulfillment_type === 'rent' && item.rental_period) {
        const rental = item.product.rental_prices?.find((r) => r.period === item.rental_period);
        return sum + (rental?.price || 0) * item.quantity;
      }
      return sum + item.product.price * item.quantity;
    }, 0);
  },
  getTax: () => get().getSubtotal() * 0.0825,
  getDeliveryFee: () => (get().items.length > 0 ? 12.99 : 0),
  getTotal: () => get().getSubtotal() + get().getTax() + get().getDeliveryFee(),
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

// ---- Search Store ----
interface SearchState {
  query: string;
  filters: ProductSearchFilters;
  isUrgent: boolean;
  showFilters: boolean;
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<ProductSearchFilters>) => void;
  setUrgent: (urgent: boolean) => void;
  toggleFilters: () => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  filters: { sort_by: 'relevance', in_stock_only: true },
  isUrgent: false,
  showFilters: false,
  setQuery: (query) => set({ query }),
  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  setUrgent: (isUrgent) => set({ isUrgent }),
  toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
  resetFilters: () => set({ filters: { sort_by: 'relevance', in_stock_only: true }, isUrgent: false }),
}));

// ---- Notification Store ----
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  toggleNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.is_read).length,
  isOpen: false,
  toggleNotifications: () => set((state) => ({ isOpen: !state.isOpen })),
  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n));
      return { notifications: updated, unreadCount: updated.filter((n) => !n.is_read).length };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),
}));

// ---- UI Store ----
interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (theme) => set({ theme }),
}));
