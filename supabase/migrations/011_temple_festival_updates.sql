-- 1. Add end_date to festival_countdown
ALTER TABLE public.festival_countdown ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;
UPDATE public.festival_countdown SET end_date = target_date + INTERVAL '3 days' WHERE end_date IS NULL;

-- 2. Insert new temples
INSERT INTO public.temples (id, name, location, deity, description, image_url)
VALUES 
  ('88888888-8888-8888-8888-888888888888', 'Shri Jagannath Temple', 'Puri, Odisha', 'Lord Jagannath', 'One of the Char Dham pilgrimage sites, famous for the annual Rath Yatra.', '/images/temples/jagannath_puri.png'),
  ('99999999-9999-9999-9999-999999999999', 'Shri Banke Bihari Temple', 'Vrindavan, Uttar Pradesh', 'Lord Krishna', 'One of the holiest and most famous temples of Krishna in India.', '/images/temples/banke_bihari.png'),
  ('77777777-7777-7777-7777-777777777777', 'Deo Surya Mandir', 'Aurangabad, Bihar', 'Surya Dev (Sun God)', 'An ancient Sun temple renowned for Chhath Puja celebrations.', '/images/temples/deo_surya.png')
ON CONFLICT (id) DO NOTHING;

-- 3. Remap Pujas to the correct Temples

-- Rath Yatra to Jagannath Puri
UPDATE public.pujas SET temple_id = '88888888-8888-8888-8888-888888888888' WHERE festival_id = 'e9887742-4ba0-405e-a412-915ecfd04b08';

-- Janmashtami to Banke Bihari
UPDATE public.pujas SET temple_id = '99999999-9999-9999-9999-999999999999' WHERE festival_id = '2ef7aff1-9621-49e0-ad95-915185039403';

-- Holi to Banke Bihari
UPDATE public.pujas SET temple_id = '99999999-9999-9999-9999-999999999999' WHERE festival_id = 'fa4cf62c-1473-436c-9f37-eea6ea57fa4b';

-- Chhath Puja to Deo Surya Mandir
UPDATE public.pujas SET temple_id = '77777777-7777-7777-7777-777777777777' WHERE festival_id = 'd868a688-351e-4ebf-a3f9-214efd74dceb';

-- Makar Sankranti to Deo Surya Mandir
UPDATE public.pujas SET temple_id = '77777777-7777-7777-7777-777777777777' WHERE festival_id = '541bf4e0-3f22-4e78-8afa-7d4ce31a2f08';

-- Diwali to Mahalakshmi Kolhapur
UPDATE public.pujas SET temple_id = '76f6875a-af02-4466-a2aa-7ea3e07d7897' WHERE festival_id = 'c0c428fa-0744-46b6-8d26-b84b8f9648f1';

-- Vasant Panchami to Saraswati Basara
UPDATE public.pujas SET temple_id = '505cd47c-1d29-454f-8704-3ad33bb7b59b' WHERE festival_id = 'c0e06796-787e-4fcd-b43f-c27e164e80d2';
