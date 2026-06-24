-- Seed Temples
INSERT INTO public.temples (id, name, location, deity, description, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Kashi Vishwanath', 'Varanasi, UP', 'Lord Shiva', 'One of the twelve Jyotirlingas, the holiest of Shiva temples.', '/images/kashi_vishwanath_temple.png'),
('22222222-2222-2222-2222-222222222222', 'Maa Vaishno Devi', 'Katra, J&K', 'Maa Durga', 'A manifestation of the Hindu Mother Goddess Durga.', '/images/temple_vaishnodevi.png'),
('33333333-3333-3333-3333-333333333333', 'Tirupati Balaji', 'Tirumala, AP', 'Lord Venkateswara', 'The richest and most visited temple in the world.', '/images/temple_tirupati.png'),
('44444444-4444-4444-4444-444444444444', 'Siddhivinayak', 'Mumbai, MH', 'Lord Ganesha', 'A Hindu temple dedicated to Lord Shri Ganesh.', '/images/temple_siddhivinayak.png'),
('55555555-5555-5555-5555-555555555555', 'Mahakaleshwar', 'Ujjain, MP', 'Lord Shiva', 'A Jyotirlinga, famous for the Bhasma Aarti.', '/images/temple_mahakaleshwar.png'),
('66666666-6666-6666-6666-666666666666', 'Sankat Mochan Hanuman Temple', 'Varanasi, UP', 'Lord Hanuman', 'Dedicated to Lord Hanuman, the reliever of troubles.', 'https://images.unsplash.com/photo-1621508670868-b715690b213b?q=80&w=1000&auto=format&fit=crop')
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Seed Pujas
INSERT INTO public.pujas (temple_id, title, category, problem_statement, base_price, sale_price, benefits, whats_included, ritual_process, booking_deadline) VALUES
('11111111-1111-1111-1111-111111111111', 'Sarva Rog Nivaran Puja', 'Health', 'Are you or your loved ones suffering from chronic illnesses or facing sudden health complications?', 1500, 3100, ARRAY['Speedy recovery from chronic illnesses', 'Protection from future health complications', 'Boost in immunity and vitality'], ARRAY['Personalized Sankalp with your Name & Gotra', 'Video of the puja performed by head priest', 'Prasad delivered to your home (Bhasm, Rudraksha)'], ARRAY['Sankalp is taken in your name', 'Ganesh Puja and Kalash Sthapana', '1008 Mahamrityunjaya Mantra Jaap', 'Havan and Purnahuti'], NOW() + INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111111', 'Mangal Dosh Shanti', 'Marriage', 'Facing delays in marriage or discord in married life due to Manglik Dosh?', 2100, 5100, ARRAY['Removes obstacles in marriage', 'Brings harmony in married life', 'Pacifies the negative effects of Mars'], ARRAY['Personalized Sankalp', 'Video Proof', 'Prasad'], ARRAY['Sankalp', 'Navgraha Shanti', 'Mangal Jaap', 'Havan'], NOW() + INTERVAL '5 days'),
('33333333-3333-3333-3333-333333333333', 'Maha Lakshmi Puja', 'Wealth', 'Struggling with financial instability or heavy debts?', 1501, 3001, ARRAY['Attracts wealth and prosperity', 'Helps clear debts', 'Success in business ventures'], ARRAY['Personalized Sankalp', 'Video Proof', 'Prasad with silver coin'], ARRAY['Sankalp', 'Sri Suktam Path', 'Lakshmi Sahasranama Archana', 'Aarti'], NOW() + INTERVAL '1 day'),
('44444444-4444-4444-4444-444444444444', 'Ganesh Chaturthi Special', 'Wealth', 'Want to start a new venture with the blessings of Vighnaharta?', 501, 1001, ARRAY['Removes all obstacles', 'Brings success in new beginnings', 'Improves focus and intellect'], ARRAY['Personalized Sankalp', 'Video Proof', 'Modak Prasad'], ARRAY['Sankalp', 'Ganapati Atharvashirsha Path', 'Modak Bhog', 'Aarti'], NOW() + INTERVAL '10 days'),
('66666666-6666-6666-6666-666666666666', 'Karya Siddhi Hanuman Puja', 'Career', 'Struggling to find a job, facing hurdles in career growth, or wanting success in a new business venture?', 1100, 2100, ARRAY['Removes obstacles in career', 'Brings success in interviews', 'Provides courage and confidence'], ARRAY['Personalized Sankalp', 'Video Proof', 'Sindoor & Prasad'], ARRAY['Sankalp', 'Hanuman Chalisa Path', 'Sundarkand Path', 'Aarti'], NOW() + INTERVAL '7 days'),
('22222222-2222-2222-2222-222222222222', 'Saraswati Vidyaprada Puja', 'Education', 'Students facing lack of concentration, exam anxiety, or seeking blessings for competitive exams?', 1501, 3001, ARRAY['Improves focus and memory', 'Reduces exam stress', 'Blessings for academic excellence'], ARRAY['Personalized Sankalp', 'Video Proof', 'Saraswati Yantra & Prasad'], ARRAY['Sankalp', 'Saraswati Vandana', 'Medha Suktam Path', 'Havan'], NOW() + INTERVAL '3 days'),
('55555555-5555-5555-5555-555555555555', 'Chandra Shanti & Rudrabhishek', 'Health', 'Suffering from severe anxiety, depression, restlessness, or sleepless nights?', 2100, 4100, ARRAY['Calms the mind and reduces anxiety', 'Brings emotional stability', 'Promotes peaceful sleep'], ARRAY['Personalized Sankalp', 'Video Proof', 'Bhasm Prasad'], ARRAY['Sankalp', 'Chandra Graha Shanti', 'Rudrabhishek with Milk/Water', 'Aarti'], NOW() + INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111111', 'Gauri Shankar Puja', 'Marriage', 'Facing relationship issues, continuous misunderstandings with your partner, or delays in finding the right match?', 2500, 5100, ARRAY['Resolves misunderstandings', 'Attracts a suitable life partner', 'Brings harmony in relationships'], ARRAY['Personalized Sankalp for couples', 'Video Proof', 'Gauri Shankar Rudraksha'], ARRAY['Sankalp', 'Gauri Shankar Mantra Jaap', 'Parvati Swayamvara Stotram', 'Havan'], NOW() + INTERVAL '14 days'),
('33333333-3333-3333-3333-333333333333', 'Kanakadhara Stotram Path', 'Wealth', 'Trapped in heavy debts, facing sudden financial losses, or business downturns?', 2100, 5100, ARRAY['Clears accumulated debts', 'Opens new avenues of income', 'Attracts Goddess Lakshmi'], ARRAY['Personalized Sankalp', 'Video Proof', 'Prasad with silver coin'], ARRAY['Sankalp', 'Kanakadhara Stotram chanting 21 times', 'Lakshmi Havan', 'Aarti'], NOW() + INTERVAL '2 days');

-- Update Puja images directly since they use auto-generated UUIDs or existing ones
UPDATE public.pujas SET image_url = '/images/rudrabhishek_puja.png' WHERE title = 'Sarva Rog Nivaran Puja';
UPDATE public.pujas SET image_url = '/images/puja_mangal_dosh.png' WHERE title = 'Mangal Dosh Shanti';
UPDATE public.pujas SET image_url = '/images/puja_mahalakshmi.png' WHERE title = 'Maha Lakshmi Puja';
UPDATE public.pujas SET image_url = '/images/puja_ganesh.png' WHERE title = 'Ganesh Chaturthi Special';
UPDATE public.pujas SET image_url = 'https://images.unsplash.com/photo-1542458428-21d1b32d2077?q=80&w=1000&auto=format&fit=crop' WHERE title = 'Karya Siddhi Hanuman Puja';
UPDATE public.pujas SET image_url = 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=1000&auto=format&fit=crop' WHERE title = 'Saraswati Vidyaprada Puja';
UPDATE public.pujas SET image_url = 'https://images.unsplash.com/photo-1593361036080-60b642ec67fc?q=80&w=1000&auto=format&fit=crop' WHERE title = 'Chandra Shanti & Rudrabhishek';
UPDATE public.pujas SET image_url = 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=1000&auto=format&fit=crop' WHERE title = 'Gauri Shankar Puja';
UPDATE public.pujas SET image_url = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop' WHERE title = 'Kanakadhara Stotram Path';

-- Seed Chadhava
INSERT INTO public.chadhava_items (temple_id, title, description, price, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Deep Daan', 'Light a sacred lamp at the temple', 51, '/images/chadhava_deepdaan.png'),
('11111111-1111-1111-1111-111111111111', 'Pushp Arpan', 'Offer fresh flowers to the deity', 101, '/images/chadhava_pushp.png'),
('11111111-1111-1111-1111-111111111111', 'Milk Abhishek', 'Sacred milk abhishek on Shivling', 151, '/images/chadhava_abhishek.png'),
('33333333-3333-3333-3333-333333333333', 'Vastra Daan', 'Offer sacred cloth to the deity', 151, '/images/chadhava_vastra.png'),
('44444444-4444-4444-4444-444444444444', 'Bhog Prasad', 'Offer Bhog and receive blessed Prasad', 201, '/images/prasad_thali.png');
