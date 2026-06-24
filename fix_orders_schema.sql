-- Add chadhava_item_id if it doesn't exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS chadhava_item_id UUID REFERENCES public.chadhava_items(id) ON DELETE SET NULL;

-- Also ensure the other columns from recent migrations exist just in case
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS package_details JSONB;
ALTER TABLE public.pujas ADD COLUMN IF NOT EXISTS packages JSONB;
ALTER TABLE public.sankalp_details ADD COLUMN IF NOT EXISTS additional_members JSONB;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
