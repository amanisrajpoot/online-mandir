CREATE TABLE IF NOT EXISTS public.otp_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    otp TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 minutes')
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_otp_phone ON public.otp_verifications(phone);

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
