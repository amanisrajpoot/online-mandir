-- Migration to switch from Razorpay to Cashfree
ALTER TABLE public.orders 
DROP COLUMN IF EXISTS razorpay_order_id,
DROP COLUMN IF EXISTS razorpay_payment_id;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS cashfree_order_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS cashfree_session_id TEXT;
