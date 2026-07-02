-- Migration to patch PII leakage vulnerability on users table

-- 1. Drop the excessively permissive select policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.users;

-- 2. Create a restrictive policy ensuring users can only read their own data
CREATE POLICY "Users can view their own profile." ON public.users FOR SELECT USING (auth.uid() = id);
