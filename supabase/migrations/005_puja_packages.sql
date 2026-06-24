-- Add packages column to pujas
ALTER TABLE public.pujas ADD COLUMN IF NOT EXISTS packages JSONB;

-- Backfill packages for existing pujas
UPDATE public.pujas 
SET packages = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid(),
    'name', 'अकेले के लिए*',
    'members_text', 'For 1 Member',
    'max_members', 1,
    'base_price', base_price,
    'sale_price', sale_price
  )
)
WHERE packages IS NULL;

-- Add package_details to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS package_details JSONB;

-- Add additional_members to sankalp_details
ALTER TABLE public.sankalp_details ADD COLUMN IF NOT EXISTS additional_members JSONB;
