-- Add content enrichment columns to temples
ALTER TABLE public.temples
ADD COLUMN IF NOT EXISTS history TEXT,
ADD COLUMN IF NOT EXISTS architecture TEXT,
ADD COLUMN IF NOT EXISTS timings JSONB DEFAULT '{"open": "05:00", "close": "21:00"}',
ADD COLUMN IF NOT EXISTS how_to_reach TEXT;

-- Add translations column to temples (JSONB)
-- Structure: { "hi": { "name": "...", "description": "...", "history": "..." }, "mr": { ... } }
ALTER TABLE public.temples
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Add translations column to pujas (JSONB)
-- Structure: { "hi": { "title": "...", "problem_statement": "...", "benefits": ["..."], "ritual_process": "..." }, "mr": { ... } }
ALTER TABLE public.pujas
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;
