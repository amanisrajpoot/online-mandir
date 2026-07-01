-- Add festival_id to pujas and chadhava tables to link them to festival countdowns

-- 1. Add column to pujas
ALTER TABLE public.pujas 
ADD COLUMN IF NOT EXISTS festival_id UUID REFERENCES public.festival_countdown(id) ON DELETE SET NULL;

-- 2. Add column to chadhava_items
ALTER TABLE public.chadhava_items
ADD COLUMN IF NOT EXISTS festival_id UUID REFERENCES public.festival_countdown(id) ON DELETE SET NULL;
