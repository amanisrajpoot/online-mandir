-- Run this script in your Supabase SQL Editor to update your existing data with the newly generated static images.

-- Update Temples
UPDATE public.temples SET image_url = '/images/kashi_vishwanath_temple.png' WHERE name = 'Kashi Vishwanath';
UPDATE public.temples SET image_url = '/images/temple_vaishnodevi.png' WHERE name = 'Maa Vaishno Devi';
UPDATE public.temples SET image_url = '/images/temple_tirupati.png' WHERE name = 'Tirupati Balaji';
UPDATE public.temples SET image_url = '/images/temple_siddhivinayak.png' WHERE name = 'Siddhivinayak';
UPDATE public.temples SET image_url = '/images/temple_mahakaleshwar.png' WHERE name = 'Mahakaleshwar';

-- Update Pujas
UPDATE public.pujas SET image_url = '/images/rudrabhishek_puja.png' WHERE title = 'Sarva Rog Nivaran Puja';
UPDATE public.pujas SET image_url = '/images/puja_mangal_dosh.png' WHERE title = 'Mangal Dosh Shanti';
UPDATE public.pujas SET image_url = '/images/puja_mahalakshmi.png' WHERE title = 'Maha Lakshmi Puja';
UPDATE public.pujas SET image_url = '/images/puja_ganesh.png' WHERE title = 'Ganesh Chaturthi Special';

-- Update Chadhava Items
UPDATE public.chadhava_items SET image_url = '/images/chadhava_deepdaan.png' WHERE title = 'Deep Daan';
UPDATE public.chadhava_items SET image_url = '/images/chadhava_pushp.png' WHERE title = 'Pushp Arpan';
UPDATE public.chadhava_items SET image_url = '/images/chadhava_abhishek.png' WHERE title = 'Milk Abhishek';
UPDATE public.chadhava_items SET image_url = '/images/chadhava_vastra.png' WHERE title = 'Vastra Daan';
UPDATE public.chadhava_items SET image_url = '/images/prasad_thali.png' WHERE title = 'Bhog Prasad';
