-- 1. Create Maha Shivratri Puja at Mahakaleshwar
INSERT INTO public.pujas (
  id, temple_id, title, category, problem_statement, benefits, whats_included, ritual_process, base_price, sale_price, image_url, booking_deadline
) VALUES (
  '12345678-1234-1234-1234-1234567890ab',
  (SELECT id FROM public.temples WHERE name ILIKE '%Mahakaleshwar%' LIMIT 1),
  'Maha Shivratri Special Rudrabhishek',
  'Festival Special',
  'Seeking spiritual awakening, overcoming deeply rooted fears, and receiving the ultimate grace of Mahadev.',
  ARRAY['Destroys negative karma and past sins', 'Brings peace, prosperity, and spiritual growth', 'Special Sankalp taken during the 4 Prahars of Shivratri'],
  ARRAY['Live Sankalp Video', 'Bhasma from Mahakaleshwar', 'Rudraksha Mala', 'Prasad Thali'],
  ARRAY['Sankalp by Pandit ji', 'Ganesh Pujan', 'Shiv Lingam Abhishek with Milk, Ghee, Honey', 'Maha Aarti'],
  3100,
  2100,
  '/images/hero_banner_shivratri.png',
  '2026-03-08T00:00:00Z'
);

-- 2. Update the Shivratri Hero Banner to point to the newly created Puja
UPDATE public.hero_banners 
SET link = '/pujas/3fo9rzfo7QEqsJ4gm9XSYt'
WHERE link LIKE '%pujas%' AND image_url LIKE '%shivratri%';

-- 3. Insert Mahalakshmi Puja into Banners
INSERT INTO public.hero_banners (title, subtitle, image_url, link, cta_text, is_active, sort_order)
VALUES (
  'महा लक्ष्मी पूजा • Maha Lakshmi Puja',
  'धन और समृद्धि प्राप्त करें | Attain Wealth & Prosperity',
  '/images/puja_mahalakshmi.png',
  '/pujas/vkuDJJd36JRcnG6G1ZVip5',
  'अभी बुक करें | Book Now',
  true,
  2
);
