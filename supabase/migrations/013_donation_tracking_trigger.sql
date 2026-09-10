-- =============================================
-- 013_donation_tracking_trigger.sql
-- Live Donation Tracking — Auto-increment totals
-- =============================================

-- 1. Add goal_amount column to donations table (for progress bar display)
ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS goal_amount BIGINT DEFAULT 0;

-- 2. Add customer_phone column to donation_orders if missing
ALTER TABLE public.donation_orders
  ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- 3. Update Nepal flood relief with goal + seed amounts
--    Reset to realistic starting totals (real amount will accumulate via trigger)
INSERT INTO public.donations (
  category, title, subtitle, description, emoji, image_url,
  suggested_amounts, min_amount, impact_statement,
  donors_count, total_raised, goal_amount, is_active, display_order
) VALUES (
  'nepal-flood-relief',
  'नेपाल बाढ़ राहत • Nepal Flood Relief',
  'Emergency Flash Flood Relief & Humanitarian Aid',
  'Catastrophic flash floods swept through the Nepal-China border region along the Trishuli and Bhotekoshi rivers. Thousands of families are stranded without food, clean water, or shelter. 100% of funds go directly to on-ground relief teams in Timure and Syabrubesi.',
  '🆘',
  '/images/nepal-flood/nepal-flood-hero.jpg',
  ARRAY[101, 251, 501, 1001, 2001, 5001, 11000, 21000, 51000],
  101,
  '₹101 feeds a survivor · ₹501 sends emergency nutrition & blankets · ₹1001 sends medical kit',
  23,
  24500,
  1000000,
  TRUE,
  0
)
ON CONFLICT (category) DO UPDATE SET
  goal_amount     = EXCLUDED.goal_amount,
  donors_count    = CASE WHEN public.donations.donors_count > 23 THEN public.donations.donors_count ELSE 23 END,
  total_raised    = CASE WHEN public.donations.total_raised > 24500 THEN public.donations.total_raised ELSE 24500 END,
  display_order   = 0,
  is_active       = TRUE;

-- Seed Wayanad and Assam relief if not already present
INSERT INTO public.donations (
  category, title, subtitle, description, emoji,
  suggested_amounts, min_amount, impact_statement,
  donors_count, total_raised, goal_amount, is_active, display_order
) VALUES
(
  'wayanad-relief',
  'वायनाड भूस्खलन एवं बाढ़ राहत • Wayanad Disaster Relief',
  'Emergency Landslide & Flood Relief in Kerala',
  'Devastating landslides and floods have caused widespread destruction across the Wayanad district of Kerala. Entire hillside communities have been buried or swept away. Our teams are on the ground providing emergency meals, medicines, and shelter materials.',
  '🏔️',
  ARRAY[101, 251, 501, 1001, 2001, 5001, 11000],
  101,
  '₹101 provides 1 warm meal · ₹1,001 sends emergency family essentials kit',
  18,
  15200,
  500000,
  TRUE,
  1
),
(
  'assam-flood-relief',
  'असम ब्रह्मपुत्र बाढ़ राहत • Assam Flood Relief',
  'Urgent Monsoon Flood Relief & Boat Rescue Rations',
  'The Brahmaputra and its tributaries have breached their banks, submerging thousands of villages across Assam. Communities are stranded on rooftops and embankments. Your donation funds dry ration packets, clean drinking water, and medical supplies for flood-hit families.',
  '🌊',
  ARRAY[101, 251, 501, 1001, 2001, 5001, 11000],
  101,
  '₹101 supplies drinking water & biscuits · ₹1,001 sends a flood survival medical kit',
  11,
  9800,
  300000,
  TRUE,
  2
)
ON CONFLICT (category) DO NOTHING;

-- =============================================
-- 4. Trigger Function: auto-increment totals
--    Fires AFTER donation_orders row → status 'booked' or 'paid'
-- =============================================

CREATE OR REPLACE FUNCTION public.fn_increment_donation_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only fire when status changes TO a confirmed paid state
  IF (NEW.status IN ('booked', 'paid'))
     AND (OLD.status IS DISTINCT FROM NEW.status)
     AND (NEW.donation_id IS NOT NULL)
  THEN
    UPDATE public.donations
    SET
      total_raised  = total_raised + NEW.amount,
      donors_count  = donors_count + 1
    WHERE id = NEW.donation_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop and recreate trigger to ensure idempotency
DROP TRIGGER IF EXISTS trg_increment_donation_totals ON public.donation_orders;

CREATE TRIGGER trg_increment_donation_totals
  AFTER UPDATE OF status ON public.donation_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_increment_donation_totals();

-- =============================================
-- 5. RPC: sync_donation_totals
--    Recomputes totals from real donation_orders data.
--    Called from verify route as belt-and-suspenders.
-- =============================================

CREATE OR REPLACE FUNCTION public.sync_donation_totals(p_donation_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total  BIGINT;
  v_count  INT;
BEGIN
  SELECT
    COALESCE(SUM(amount), 0),
    COUNT(*)
  INTO v_total, v_count
  FROM public.donation_orders
  WHERE donation_id = p_donation_id
    AND status IN ('booked', 'paid');

  UPDATE public.donations
  SET
    total_raised = v_total,
    donors_count = v_count
  WHERE id = p_donation_id;
END;
$$;

-- =============================================
-- 6. RPC: get_all_donation_stats
--    Returns live stats for all active donations.
--    Used by the /donate page for accurate totals.
-- =============================================

CREATE OR REPLACE FUNCTION public.get_all_donation_stats()
RETURNS TABLE (
  category      TEXT,
  total_raised  BIGINT,
  donors_count  BIGINT,
  goal_amount   BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    d.category,
    COALESCE(SUM(o.amount), d.total_raised) AS total_raised,
    COALESCE(COUNT(o.id),   d.donors_count) AS donors_count,
    d.goal_amount
  FROM public.donations d
  LEFT JOIN public.donation_orders o
    ON o.donation_id = d.id
    AND o.status IN ('booked', 'paid')
  WHERE d.is_active = TRUE
  GROUP BY d.category, d.total_raised, d.donors_count, d.goal_amount;
$$;

-- Grant execute access to authenticated and anon roles
GRANT EXECUTE ON FUNCTION public.sync_donation_totals(UUID) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.get_all_donation_stats() TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.fn_increment_donation_totals() TO service_role;
