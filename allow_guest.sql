CREATE TABLE IF NOT EXISTS public.delivery_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE IF EXISTS public.orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE IF EXISTS public.donation_orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE IF EXISTS public.delivery_addresses ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;

ALTER TABLE public.donation_orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
