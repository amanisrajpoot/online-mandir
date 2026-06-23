-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TEMPLES TABLE
CREATE TABLE IF NOT EXISTS public.temples (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  deity TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  gallery_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PUJAS TABLE
CREATE TABLE IF NOT EXISTS public.pujas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'Wealth', 'Health', 'Marriage', 'Protection'
  problem_statement TEXT,
  base_price INTEGER NOT NULL,
  sale_price INTEGER NOT NULL,
  benefits TEXT[],
  whats_included TEXT[],
  ritual_process TEXT[],
  faqs JSONB,
  image_url TEXT,
  booking_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHADHAVA ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.chadhava_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDERS TABLE
CREATE TYPE order_status AS ENUM ('booked', 'assigned', 'in_progress', 'completed', 'video_uploaded', 'prasad_shipped', 'delivered', 'cancelled');
CREATE TYPE order_type AS ENUM ('puja', 'chadhava');

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL,
  status order_status DEFAULT 'booked',
  order_type order_type NOT NULL,
  item_id UUID NOT NULL, -- References either pujas.id or chadhava_items.id
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SANKALP DETAILS TABLE (Linked to order)
CREATE TABLE IF NOT EXISTS public.sankalp_details (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gotra TEXT NOT NULL,
  nakshatra TEXT,
  relation TEXT,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRASAD SHIPMENTS TABLE (Linked to order)
CREATE TABLE IF NOT EXISTS public.prasad_shipments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  tracking_number TEXT,
  courier_partner TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PUJA VIDEOS TABLE (Linked to order)
CREATE TABLE IF NOT EXISTS public.puja_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pujas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chadhava_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sankalp_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prasad_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puja_videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog tables
CREATE POLICY "Public profiles are viewable by everyone." ON public.users FOR SELECT USING (true);
CREATE POLICY "Temples are viewable by everyone." ON public.temples FOR SELECT USING (true);
CREATE POLICY "Pujas are viewable by everyone." ON public.pujas FOR SELECT USING (true);
CREATE POLICY "Chadhava items are viewable by everyone." ON public.chadhava_items FOR SELECT USING (true);

-- Allow users to see their own orders
CREATE POLICY "Users can view their own orders." ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders." ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders." ON public.orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sankalp." ON public.sankalp_details FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = sankalp_details.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own sankalp." ON public.sankalp_details FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = sankalp_details.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can view their own shipments." ON public.prasad_shipments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = prasad_shipments.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own shipments." ON public.prasad_shipments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = prasad_shipments.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can view their own videos." ON public.puja_videos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = puja_videos.order_id AND orders.user_id = auth.uid())
);

-- Note: Admin RLS policies omitted for brevity, assuming admins have bypass_rls role or similar setup
