-- ============================================================
-- DREAMS - Database Schema
-- Rapid Rescue, Sourcing & Dispatch Platform
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- USERS & AUTH
-- ============================================================

CREATE TYPE user_role AS ENUM ('customer', 'business', 'vendor', 'driver', 'admin');
CREATE TYPE account_mode AS ENUM ('personal', 'business', 'vendor');
CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise', 'unlimited');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'customer',
  account_mode account_mode DEFAULT 'personal',
  company_id UUID,
  is_verified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT,
  size TEXT CHECK (size IN ('solo', 'small', 'medium', 'large', 'enterprise')),
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  billing_email TEXT,
  tax_id TEXT,
  subscription_tier subscription_tier DEFAULT 'starter',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ADD CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id);

-- ============================================================
-- VENDORS
-- ============================================================

CREATE TYPE business_type AS ENUM ('retailer', 'distributor', 'wholesaler', 'rental_house', 'manufacturer', 'warehouse');

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  company_name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  business_type business_type NOT NULL,
  categories TEXT[] DEFAULT '{}',
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  location GEOMETRY(Point, 4326),
  service_radius_miles INTEGER DEFAULT 25,
  operating_hours JSONB DEFAULT '[]',
  rating DECIMAL(3,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  fulfillment_speed_avg_minutes INTEGER DEFAULT 60,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  commission_rate DECIMAL(5,2) DEFAULT 15,
  stripe_account_id TEXT,
  bank_account_connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS & MARKETPLACE
-- ============================================================

CREATE TYPE product_category AS ENUM (
  'power_tools', 'hand_tools', 'safety_equipment', 'electrical', 'plumbing',
  'hvac', 'fasteners', 'lumber', 'concrete', 'roofing', 'flooring',
  'paint', 'adhesives', 'measuring', 'welding', 'automotive',
  'heavy_equipment', 'landscaping', 'telecom', 'networking',
  'replacement_parts', 'consumables', 'other'
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  short_description TEXT,
  sku TEXT NOT NULL,
  brand TEXT,
  category product_category NOT NULL,
  subcategory TEXT,
  images TEXT[] DEFAULT '{}',
  price DECIMAL(12,2) NOT NULL,
  compare_at_price DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  is_rentable BOOLEAN DEFAULT FALSE,
  rental_prices JSONB DEFAULT '[]',
  weight_lbs DECIMAL(8,2),
  dimensions JSONB,
  specifications JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER,
  is_urgent_eligible BOOLEAN DEFAULT FALSE,
  estimated_delivery_minutes INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_urgent ON products(is_urgent_eligible) WHERE is_urgent_eligible = TRUE;

-- Auto-update search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.brand, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.sku, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_search
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TYPE order_status AS ENUM (
  'draft', 'pending_approval', 'approved', 'confirmed', 'preparing',
  'ready_for_pickup', 'dispatched', 'in_transit', 'delivered',
  'completed', 'cancelled', 'returned'
);
CREATE TYPE order_priority AS ENUM ('standard', 'urgent', 'critical');
CREATE TYPE fulfillment_type AS ENUM ('buy', 'rent');
CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'refunded', 'failed');
CREATE TYPE payment_method AS ENUM ('card', 'invoice', 'po_number', 'company_account', 'wallet');
CREATE TYPE delivery_method AS ENUM (
  'customer_pickup', 'internal_driver', 'third_party_courier',
  'warehouse_runner', 'shipping_carrier', 'drone_delivery'
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  company_id UUID REFERENCES companies(id),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  status order_status DEFAULT 'draft',
  priority order_priority DEFAULT 'standard',
  fulfillment_type fulfillment_type DEFAULT 'buy',
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax DECIMAL(12,2) DEFAULT 0,
  delivery_fee DECIMAL(12,2) DEFAULT 0,
  urgent_fee DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  payment_status payment_status DEFAULT 'pending',
  payment_method payment_method,
  delivery_street TEXT,
  delivery_city TEXT,
  delivery_state TEXT,
  delivery_zip TEXT,
  delivery_country TEXT DEFAULT 'US',
  delivery_lat DOUBLE PRECISION,
  delivery_lng DOUBLE PRECISION,
  delivery_method delivery_method,
  estimated_delivery_at TIMESTAMPTZ,
  actual_delivery_at TIMESTAMPTZ,
  dispatch_id UUID,
  driver_id UUID,
  approval_required BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  job_site_name TEXT,
  project_reference TEXT,
  stripe_payment_intent_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_company ON orders(company_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  sku TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  fulfillment_type fulfillment_type DEFAULT 'buy',
  rental_period TEXT,
  rental_start TIMESTAMPTZ,
  rental_end TIMESTAMPTZ,
  rental_deposit DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DISPATCH & DELIVERY
-- ============================================================

CREATE TYPE dispatch_status AS ENUM (
  'pending', 'assigned', 'accepted', 'en_route_to_pickup',
  'arrived_at_pickup', 'picked_up', 'en_route_to_delivery',
  'arrived_at_delivery', 'delivered', 'failed', 'cancelled'
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  vehicle_type TEXT CHECK (vehicle_type IN ('car', 'van', 'truck', 'motorcycle', 'bicycle', 'drone')),
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_plate TEXT,
  license_number TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT FALSE,
  current_location GEOMETRY(Point, 4326),
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  current_heading DOUBLE PRECISION,
  current_speed DOUBLE PRECISION,
  location_updated_at TIMESTAMPTZ,
  rating DECIMAL(3,2) DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  company_id UUID REFERENCES companies(id),
  service_area_miles INTEGER DEFAULT 25,
  max_weight_lbs INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drivers_location ON drivers USING GIST(current_location);
CREATE INDEX idx_drivers_available ON drivers(is_available) WHERE is_available = TRUE;

CREATE TABLE dispatches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  driver_id UUID REFERENCES drivers(id),
  status dispatch_status DEFAULT 'pending',
  delivery_method delivery_method NOT NULL,
  pickup_street TEXT,
  pickup_city TEXT,
  pickup_state TEXT,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  delivery_street TEXT,
  delivery_city TEXT,
  delivery_state TEXT,
  delivery_lat DOUBLE PRECISION,
  delivery_lng DOUBLE PRECISION,
  pickup_eta_minutes INTEGER,
  delivery_eta_minutes INTEGER,
  distance_miles DECIMAL(8,2),
  route_polyline TEXT,
  assigned_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  proof_of_delivery_url TEXT,
  signature_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location history for route tracking
CREATE TABLE driver_locations (
  id BIGSERIAL PRIMARY KEY,
  driver_id UUID NOT NULL REFERENCES drivers(id),
  dispatch_id UUID REFERENCES dispatches(id),
  location GEOMETRY(Point, 4326),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  heading DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_driver_locations_driver ON driver_locations(driver_id, recorded_at DESC);

-- ============================================================
-- TEAM & APPROVALS
-- ============================================================

CREATE TYPE team_role AS ENUM ('owner', 'admin', 'manager', 'dispatcher', 'technician', 'viewer');

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  role team_role DEFAULT 'technician',
  department TEXT,
  spending_limit DECIMAL(12,2),
  requires_approval BOOLEAN DEFAULT TRUE,
  approved_by_role team_role[] DEFAULT '{manager,owner}',
  is_active BOOLEAN DEFAULT TRUE,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  UNIQUE(user_id, company_id)
);

CREATE TABLE approval_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  requested_by UUID NOT NULL REFERENCES profiles(id),
  assigned_to UUID NOT NULL REFERENCES profiles(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  amount DECIMAL(12,2) NOT NULL,
  reason TEXT,
  items_summary TEXT,
  priority order_priority DEFAULT 'standard',
  responded_at TIMESTAMPTZ,
  response_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_approvals_assigned ON approval_requests(assigned_to, status);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id, order_id)
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile
CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: users can see their own orders
CREATE POLICY orders_select ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY orders_insert ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: users can see their own notifications
CREATE POLICY notifications_select ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Products are publicly readable
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY products_select ON products FOR SELECT USING (TRUE);

-- Vendors are publicly readable
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY vendors_select ON vendors FOR SELECT USING (TRUE);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON dispatches FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT := 'DRM';
  ts TEXT;
  rand TEXT;
BEGIN
  ts := UPPER(ENCODE(INT8SEND(EXTRACT(EPOCH FROM NOW())::BIGINT), 'hex'));
  rand := UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 4));
  RETURN prefix || '-' || SUBSTR(ts, LENGTH(ts) - 4) || '-' || rand;
END;
$$ LANGUAGE plpgsql;
