-- Migration for Festival Countdowns and Promo Banners

-- 1. Create festival_countdown table
CREATE TABLE IF NOT EXISTS public.festival_countdown (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    position TEXT DEFAULT 'after_hero', -- 'after_hero', 'after_temples', 'after_pujas', 'above_footer'
    display_style TEXT DEFAULT 'full-width', -- 'full-width', 'compact'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.festival_countdown ENABLE ROW LEVEL SECURITY;

-- Policies for festival_countdown
CREATE POLICY "Public can view active countdowns" 
ON public.festival_countdown FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage countdowns" 
ON public.festival_countdown 
USING (public.is_admin());

-- Insert initial data
INSERT INTO public.festival_countdown (name, target_date, description, image_url, is_active, sort_order, position, display_style)
VALUES (
    'Maha Shivratri', 
    NOW() + INTERVAL '14 days', 
    'The Great Night of Shiva. Book your Rudrabhishek now to ensure your Sankalp is included.', 
    '/images/festival_mahashivratri.png', 
    true, 
    0, 
    'after_hero', 
    'full-width'
);


-- 2. Create promo_banners table
CREATE TABLE IF NOT EXISTS public.promo_banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    position TEXT DEFAULT 'after_temples', -- 'after_hero', 'after_temples', 'after_pujas', 'above_footer'
    display_style TEXT DEFAULT 'half-width', -- 'full-width', 'half-width', 'grid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.promo_banners ENABLE ROW LEVEL SECURITY;

-- Policies for promo_banners
CREATE POLICY "Public can view promo banners" 
ON public.promo_banners FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage promo banners" 
ON public.promo_banners 
USING (public.is_admin());

-- Insert initial data
INSERT INTO public.promo_banners (title, image_url, link, is_active, sort_order, position, display_style)
VALUES (
    'Book Kashi Vishwanath Pujas', 
    '/images/kashi_vishwanath_temple.png', 
    '/temples', 
    true, 
    0, 
    'after_temples', 
    'half-width'
);
