-- 1. Add is_admin to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Create hero_banners table
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial banners
INSERT INTO public.hero_banners (title, subtitle, image_url, link, cta_text, sort_order) VALUES
('महा शिवरात्रि • Maha Shivratri', 'रुद्राभिषेक बुक करें | Book your Rudrabhishek now', '/images/hero_banner_shivratri.png', '/pujas/11111111-1111-1111-1111-111111111111', 'अभी बुक करें | Book Now', 1),
('नवरात्रि देवी दर्शन • Navratri Devi Darshan', '9 शक्तिपीठों पर चढ़ावा अर्पित करें | Offer Chadhava at 9 Shaktipeeths', '/images/hero_banner_navratri.png', '/chadhava', 'चढ़ावा चढ़ाएं | Offer Chadhava', 2),
('आज का पंचांग • Daily Panchang', 'आज का शुभ मुहूर्त देखें | Check today''s auspicious timings', '/images/hero_banner_panchang.png', '#panchang', 'पंचांग देखें | View Panchang', 3);


-- 3. Set up RLS for Admins
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Banners are viewable by everyone." ON public.hero_banners FOR SELECT USING (true);

-- Admin full access policies for all tables
CREATE POLICY "Admins can manage temples" ON public.temples
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));
  
CREATE POLICY "Admins can manage pujas" ON public.pujas
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));
  
CREATE POLICY "Admins can manage chadhava_items" ON public.chadhava_items
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));
  
CREATE POLICY "Admins can manage hero_banners" ON public.hero_banners
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can manage orders" ON public.orders
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can manage users" ON public.users
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admins can manage sankalp" ON public.sankalp_details
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Note: Storage policies need to be created via the Storage API or manually in the Supabase Dashboard,
-- but here is the SQL equivalent for the `storage.objects` table.
-- Assuming bucket 'media' exists.

-- Create policies for storage.objects if you want to execute it from SQL Editor:
-- (Uncomment if needed, but easier to do via Dashboard if unfamiliar)
/*
CREATE POLICY "Public media access" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admin media access" ON storage.objects 
  USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));
*/
