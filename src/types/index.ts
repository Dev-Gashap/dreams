// ============================================================
// DREAMS - Type Definitions
// Rapid Rescue, Sourcing & Dispatch Platform
// ============================================================

// ---- User & Auth ----
export type UserRole = 'customer' | 'business' | 'vendor' | 'driver' | 'admin';
export type AccountMode = 'personal' | 'business' | 'vendor';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  role: UserRole;
  account_mode: AccountMode;
  company_id?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  industry: string;
  size: 'solo' | 'small' | 'medium' | 'large' | 'enterprise';
  address: Address;
  billing_email: string;
  tax_id?: string;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

export type SubscriptionTier = 'starter' | 'professional' | 'enterprise' | 'unlimited';

// ---- Address & Location ----
export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

// ---- Products & Marketplace ----
export type ProductCategory =
  | 'power_tools'
  | 'hand_tools'
  | 'safety_equipment'
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'fasteners'
  | 'lumber'
  | 'concrete'
  | 'roofing'
  | 'flooring'
  | 'paint'
  | 'adhesives'
  | 'measuring'
  | 'welding'
  | 'automotive'
  | 'heavy_equipment'
  | 'landscaping'
  | 'telecom'
  | 'networking'
  | 'replacement_parts'
  | 'consumables'
  | 'other';

export type FulfillmentType = 'buy' | 'rent';
export type RentalPeriod = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  brand: string;
  category: ProductCategory;
  subcategory?: string;
  images: string[];
  price: number;
  compare_at_price?: number;
  currency: string;
  is_rentable: boolean;
  rental_prices?: RentalPrice[];
  weight_lbs?: number;
  dimensions?: { length: number; width: number; height: number };
  specifications: Record<string, string>;
  tags: string[];
  vendor_id: string;
  vendor_name: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  stock_quantity: number;
  min_order_quantity: number;
  max_order_quantity?: number;
  is_urgent_eligible: boolean;
  estimated_delivery_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface RentalPrice {
  period: RentalPeriod;
  price: number;
  deposit: number;
}

export interface ProductSearchFilters {
  query?: string;
  category?: ProductCategory;
  fulfillment_type?: FulfillmentType;
  min_price?: number;
  max_price?: number;
  brand?: string;
  in_stock_only?: boolean;
  urgent_only?: boolean;
  rental_available?: boolean;
  sort_by?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'delivery_speed' | 'newest';
  vendor_id?: string;
  radius_miles?: number;
  lat?: number;
  lng?: number;
  page?: number;
  per_page?: number;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
  facets: SearchFacets;
}

export interface SearchFacets {
  categories: { name: string; count: number }[];
  brands: { name: string; count: number }[];
  price_ranges: { label: string; min: number; max: number; count: number }[];
  vendors: { id: string; name: string; count: number }[];
}

// ---- Vendor ----
export interface Vendor {
  id: string;
  user_id: string;
  company_name: string;
  logo_url?: string;
  description: string;
  business_type: 'retailer' | 'distributor' | 'wholesaler' | 'rental_house' | 'manufacturer' | 'warehouse';
  categories: ProductCategory[];
  address: Address;
  service_radius_miles: number;
  operating_hours: OperatingHours[];
  rating: number;
  total_orders: number;
  fulfillment_speed_avg_minutes: number;
  is_verified: boolean;
  is_active: boolean;
  commission_rate: number;
  bank_account_connected: boolean;
  created_at: string;
}

export interface OperatingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;
  close: string;
  is_closed: boolean;
}

// ---- Orders ----
export type OrderStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'dispatched'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'returned';

export type OrderPriority = 'standard' | 'urgent' | 'critical';
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';
export type PaymentMethod = 'card' | 'invoice' | 'po_number' | 'company_account' | 'wallet';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  company_id?: string;
  vendor_id: string;
  vendor_name: string;
  status: OrderStatus;
  priority: OrderPriority;
  fulfillment_type: FulfillmentType;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  delivery_fee: number;
  urgent_fee: number;
  total: number;
  currency: string;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  delivery_address: Address;
  delivery_method: DeliveryMethod;
  estimated_delivery_at?: string;
  actual_delivery_at?: string;
  dispatch_id?: string;
  driver_id?: string;
  approval_required: boolean;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  job_site_name?: string;
  project_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  fulfillment_type: FulfillmentType;
  rental_period?: RentalPeriod;
  rental_start?: string;
  rental_end?: string;
  rental_deposit?: number;
}

// ---- Delivery & Dispatch ----
export type DeliveryMethod =
  | 'customer_pickup'
  | 'internal_driver'
  | 'third_party_courier'
  | 'warehouse_runner'
  | 'shipping_carrier'
  | 'drone_delivery';

export type DispatchStatus =
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'en_route_to_pickup'
  | 'arrived_at_pickup'
  | 'picked_up'
  | 'en_route_to_delivery'
  | 'arrived_at_delivery'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export interface Dispatch {
  id: string;
  order_id: string;
  driver_id?: string;
  driver_name?: string;
  driver_phone?: string;
  driver_avatar?: string;
  vehicle_type?: string;
  vehicle_plate?: string;
  status: DispatchStatus;
  delivery_method: DeliveryMethod;
  pickup_address: Address;
  delivery_address: Address;
  pickup_eta_minutes?: number;
  delivery_eta_minutes?: number;
  distance_miles?: number;
  current_location?: GeoLocation;
  route_polyline?: string;
  assigned_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  proof_of_delivery_url?: string;
  signature_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  vehicle_type: 'car' | 'van' | 'truck' | 'motorcycle' | 'bicycle' | 'drone';
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_plate: string;
  license_number: string;
  is_active: boolean;
  is_available: boolean;
  current_location?: GeoLocation;
  rating: number;
  total_deliveries: number;
  company_id?: string;
  service_area_miles: number;
  max_weight_lbs: number;
  created_at: string;
}

// ---- Team & Approvals ----
export type TeamRole = 'owner' | 'admin' | 'manager' | 'dispatcher' | 'technician' | 'viewer';

export interface TeamMember {
  id: string;
  user_id: string;
  company_id: string;
  full_name: string;
  email: string;
  role: TeamRole;
  department?: string;
  spending_limit?: number;
  requires_approval: boolean;
  approved_by_role: TeamRole[];
  is_active: boolean;
  invited_at: string;
  joined_at?: string;
}

export interface ApprovalRequest {
  id: string;
  order_id: string;
  requested_by: string;
  requested_by_name: string;
  assigned_to: string;
  assigned_to_name: string;
  company_id: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  reason: string;
  items_summary: string;
  priority: OrderPriority;
  responded_at?: string;
  response_note?: string;
  created_at: string;
}

// ---- Notifications ----
export type NotificationType =
  | 'order_placed'
  | 'order_approved'
  | 'order_rejected'
  | 'order_confirmed'
  | 'order_dispatched'
  | 'order_delivered'
  | 'driver_assigned'
  | 'driver_nearby'
  | 'approval_requested'
  | 'rental_due'
  | 'rental_overdue'
  | 'payment_received'
  | 'payment_failed'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// ---- Analytics & Dashboard ----
export interface DashboardStats {
  total_orders: number;
  active_orders: number;
  completed_today: number;
  pending_approvals: number;
  total_spent: number;
  avg_delivery_time_minutes: number;
  active_rentals: number;
  active_drivers: number;
  orders_trend: TrendData[];
  spending_trend: TrendData[];
  top_categories: { category: string; count: number; amount: number }[];
  delivery_performance: { method: string; avg_minutes: number; count: number }[];
}

export interface TrendData {
  date: string;
  value: number;
}

// ---- Cart ----
export interface CartItem {
  product: Product;
  quantity: number;
  fulfillment_type: FulfillmentType;
  rental_period?: RentalPeriod;
  rental_start?: string;
  rental_end?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  delivery_fee: number;
  urgent_fee: number;
  total: number;
}
