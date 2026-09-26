-- ==========================================
-- SUPABASE SCHEMAS & POLICIES FOR TACO TRUCK
-- Place this inside your Supabase SQL Editor
-- ==========================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create TRUCK LOCATION Table
CREATE TABLE public.truck_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spot_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    hours VARCHAR(100) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Setting Up', 'Live', 'Sold Out', 'Off Duty')) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Create MENU ITEMS Table
CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Tacos', 'Sides', 'Drinks', 'Specials')) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    ingredients TEXT[] NOT NULL DEFAULT '{}',
    spicy_level INTEGER CHECK (spicy_level BETWEEN 0 AND 3) NOT NULL DEFAULT 0,
    tags TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Create CATERING LEADS Table
CREATE TABLE public.catering_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    guest_count INTEGER NOT NULL,
    budget_range VARCHAR(50) CHECK (budget_range IN ('under_2k', '2k_5k', '5k_10k', 'over_10k')) NOT NULL,
    details TEXT,
    status VARCHAR(50) CHECK (status IN ('New', 'Contacted', 'Approved', 'Archived')) DEFAULT 'New' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.truck_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_leads ENABLE ROW LEVEL SECURITY;

-- 5. TRUCK LOCATION Policies
CREATE POLICY "Allow public read access to truck location" 
ON public.truck_locations FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated admins full access to truck location" 
ON public.truck_locations FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. MENU ITEMS Policies
CREATE POLICY "Allow public read access to menu items" 
ON public.menu_items FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated admins full access to menu items" 
ON public.menu_items FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. CATERING LEADS Policies
CREATE POLICY "Allow anyone to submit a catering lead" 
ON public.catering_leads FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated admins full access to catering leads" 
ON public.catering_leads FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- ==========================================
-- SUPABASE REALTIME CONFIGURATION
-- ==========================================
-- Add tables to the supabase_realtime publication to enable instant UI synchronization

begin;
  -- remove the tables if they are already in the publication
  alter publication supabase_realtime drop table if exists public.truck_locations;
  alter publication supabase_realtime drop table if exists public.menu_items;
  
  -- add the tables to the publication
  alter publication supabase_realtime add table public.truck_locations;
  alter publication supabase_realtime add table public.menu_items;
commit;

-- ==========================================
-- INITIAL MOCK SEED DATA
-- ==========================================

-- Seed location (single row representing the current active truck)
INSERT INTO public.truck_locations (spot_name, address, hours, status, latitude, longitude)
VALUES (
    'Arts District Co-Op', 
    '828 E 3rd St, Los Angeles, CA 90013', 
    '6:00 PM - 11:30 PM', 
    'Live', 
    34.0452, 
    -118.2356
);

-- Seed premium menu items
INSERT INTO public.menu_items (name, category, description, price, ingredients, spicy_level, tags, image_url, available)
VALUES 
(
    'Chipotle Birria de Res', 
    'Tacos', 
    '12-hour slow-braised beef brisket folded in heirloom blue corn tortilla, melted Oaxacan cheese, consommé dip.', 
    6.50, 
    ARRAY['beef brisket', 'Oaxacan cheese', 'consommé', 'cilantro', 'pickled onions'], 
    1, 
    ARRAY['Chef Special', 'Award Winner'], 
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600', 
    true
),
(
    'Smoked Jackfruit Carnitas', 
    'Tacos', 
    'Hickory-smoked green jackfruit shredded and crisped, charred pineapple salsa, cilantro stem emulsion.', 
    5.50, 
    ARRAY['jackfruit', 'charred pineapple', 'cilantro emulsion', 'avocado'], 
    0, 
    ARRAY['Vegan', 'Gluten-Free'], 
    'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=600', 
    true
),
(
    'Agave-Lime Charcoal Shrimp', 
    'Tacos', 
    'Mesquite-grilled jumbo prawns glaze with agave-lime syrup, purple cabbage slaw, chipotle crema.', 
    7.00, 
    ARRAY['jumbo prawns', 'agave lime glaze', 'purple cabbage', 'chipotle crema'], 
    2, 
    ARRAY['Spicy', 'Seafood'], 
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=600', 
    true
),
(
    'Truffle Elote Street Corn', 
    'Sides', 
    'Charred organic sweet corn off the cob, white truffle aioli, cotija dust, smoked chipotle powder, lime wedge.', 
    8.50, 
    ARRAY['organic corn', 'truffle aioli', 'cotija cheese', 'lime'], 
    1, 
    ARRAY['Gluten-Free', 'Vegetarian'], 
    'https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&q=80&w=600', 
    true
),
(
    'Hibiscus Agave Agua Fresca', 
    'Drinks', 
    'Cold-brewed organic hibiscus flowers infused with fresh mint and sweetened with organic blue agave nectar.', 
    4.50, 
    ARRAY['hibiscus flowers', 'fresh mint', 'blue agave'], 
    0, 
    ARRAY['Vegan', 'Refreshed'], 
    'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600', 
    true
);
