-- Table 1837 Bar Management System Database Schema
-- Performance Optimized with Indexes and RLS Policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users and Roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Ingredients
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  abv NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cocktails
CREATE TABLE cocktails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  glass_type TEXT,
  method TEXT,
  abv_estimate NUMERIC,
  instructions TEXT[],
  garnish TEXT,
  is_custom BOOLEAN DEFAULT false,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cocktail Ingredients Junction Table
CREATE TABLE cocktail_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cocktail_id UUID REFERENCES cocktails(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  amount TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cocktail_id, ingredient_id)
);

-- Signature Cocktails (User Created)
CREATE TABLE signature_cocktails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instructions TEXT,
  glassware TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wines
CREATE TABLE wines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  vintage TEXT,
  varietal TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('red', 'white', 'sparkling')),
  region TEXT,
  code TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Happy Hour Specials
CREATE TABLE happy_hour_specials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME,
  end_time TIME,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 86'd Items
CREATE TABLE items_86 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  added_by UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist Items
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL DEFAULT 'daily',
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist Logs
CREATE TABLE checklist_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checklist_item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Liquor Inventory
CREATE TABLE liquor_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  bottles NUMERIC DEFAULT 0,
  ounces NUMERIC DEFAULT 0,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name)
);

-- Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX idx_cocktails_name ON cocktails USING gin(to_tsvector('english', name));
CREATE INDEX idx_cocktails_category ON cocktails(category);
CREATE INDEX idx_cocktails_custom ON cocktails(is_custom, owner_id);
CREATE INDEX idx_ingredients_name ON ingredients USING gin(to_tsvector('english', name));
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_cocktail_ingredients_cocktail ON cocktail_ingredients(cocktail_id);
CREATE INDEX idx_cocktail_ingredients_ingredient ON cocktail_ingredients(ingredient_id);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_wines_category ON wines(category);
CREATE INDEX idx_wines_price ON wines(price);
CREATE INDEX idx_items_86_created ON items_86(created_at DESC);
CREATE INDEX idx_checklist_logs_date ON checklist_logs(DATE(completed_at));
CREATE INDEX idx_liquor_inventory_category ON liquor_inventory(category);
CREATE INDEX idx_liquor_inventory_updated ON liquor_inventory(updated_at DESC);
CREATE INDEX idx_happy_hour_day ON happy_hour_specials(day_of_week, active);

-- Row Level Security Policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cocktails ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_cocktails ENABLE ROW LEVEL SECURITY;
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_86 ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE liquor_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- RLS Policies for cocktails
CREATE POLICY "Everyone can view cocktails" ON cocktails
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all cocktails" ON cocktails
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- RLS Policies for signature_cocktails
CREATE POLICY "Users can manage their own signatures" ON signature_cocktails
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view signatures" ON signature_cocktails
  FOR SELECT USING (true);

-- RLS Policies for wines
CREATE POLICY "Everyone can view wines" ON wines
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage wines" ON wines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- RLS Policies for items_86
CREATE POLICY "Authenticated users can view 86d items" ON items_86
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage 86d items" ON items_86
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'staff')
    )
  );

-- RLS Policies for checklist_logs
CREATE POLICY "Users can view checklist logs" ON checklist_logs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can add their own logs" ON checklist_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all logs" ON checklist_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- RLS Policies for liquor_inventory
CREATE POLICY "Authenticated users can view inventory" ON liquor_inventory
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can update inventory" ON liquor_inventory
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins can manage inventory" ON liquor_inventory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Functions for real-time subscriptions
CREATE OR REPLACE FUNCTION notify_inventory_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'inventory_change',
    json_build_object(
      'operation', TG_OP,
      'record', row_to_json(NEW),
      'old_record', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_change_trigger
  AFTER INSERT OR UPDATE OR DELETE ON liquor_inventory
  FOR EACH ROW EXECUTE FUNCTION notify_inventory_change();

CREATE OR REPLACE FUNCTION notify_86_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    '86_change',
    json_build_object(
      'operation', TG_OP,
      'record', row_to_json(NEW),
      'old_record', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_86_change_trigger
  AFTER INSERT OR UPDATE OR DELETE ON items_86
  FOR EACH ROW EXECUTE FUNCTION notify_86_change();