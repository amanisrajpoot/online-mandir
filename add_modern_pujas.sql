-- Add Sankat Mochan Temple if not exists (using a known UUID to avoid duplication issues later)
INSERT INTO public.temples (id, name, location, deity, description, image_url) 
VALUES ('66666666-6666-6666-6666-666666666666', 'Sankat Mochan Hanuman Temple', 'Varanasi, UP', 'Lord Hanuman', 'Dedicated to Lord Hanuman, the reliever of troubles.', 'https://images.unsplash.com/photo-1621508670868-b715690b213b?q=80&w=1000&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- Insert 5 New Modern Pujas
INSERT INTO public.pujas (temple_id, title, category, problem_statement, base_price, sale_price, benefits, whats_included, ritual_process, booking_deadline, image_url) VALUES
-- Career Growth (Sankat Mochan)
('66666666-6666-6666-6666-666666666666', 'Karya Siddhi Hanuman Puja', 'Career', 'Struggling to find a job, facing hurdles in career growth, or wanting success in a new business venture?', 1100, 2100, ARRAY['Removes obstacles in career', 'Brings success in interviews', 'Provides courage and confidence'], ARRAY['Personalized Sankalp', 'Video Proof', 'Sindoor & Prasad'], ARRAY['Sankalp', 'Hanuman Chalisa Path', 'Sundarkand Path', 'Aarti'], NOW() + INTERVAL '7 days', 'https://images.unsplash.com/photo-1542458428-21d1b32d2077?q=80&w=1000&auto=format&fit=crop'),

-- Academics (Vaishno Devi used as generic Goddess temple)
('22222222-2222-2222-2222-222222222222', 'Saraswati Vidyaprada Puja', 'Education', 'Students facing lack of concentration, exam anxiety, or seeking blessings for competitive exams?', 1501, 3001, ARRAY['Improves focus and memory', 'Reduces exam stress', 'Blessings for academic excellence'], ARRAY['Personalized Sankalp', 'Video Proof', 'Saraswati Yantra & Prasad'], ARRAY['Sankalp', 'Saraswati Vandana', 'Medha Suktam Path', 'Havan'], NOW() + INTERVAL '3 days', 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=1000&auto=format&fit=crop'),

-- Mental Peace (Mahakaleshwar)
('55555555-5555-5555-5555-555555555555', 'Chandra Shanti & Rudrabhishek', 'Health', 'Suffering from severe anxiety, depression, restlessness, or sleepless nights?', 2100, 4100, ARRAY['Calms the mind and reduces anxiety', 'Brings emotional stability', 'Promotes peaceful sleep'], ARRAY['Personalized Sankalp', 'Video Proof', 'Bhasm Prasad'], ARRAY['Sankalp', 'Chandra Graha Shanti', 'Rudrabhishek with Milk/Water', 'Aarti'], NOW() + INTERVAL '4 days', 'https://images.unsplash.com/photo-1593361036080-60b642ec67fc?q=80&w=1000&auto=format&fit=crop'),

-- Love & Relationships (Kashi Vishwanath)
('11111111-1111-1111-1111-111111111111', 'Gauri Shankar Puja', 'Marriage', 'Facing relationship issues, continuous misunderstandings with your partner, or delays in finding the right match?', 2500, 5100, ARRAY['Resolves misunderstandings', 'Attracts a suitable life partner', 'Brings harmony in relationships'], ARRAY['Personalized Sankalp for couples', 'Video Proof', 'Gauri Shankar Rudraksha'], ARRAY['Sankalp', 'Gauri Shankar Mantra Jaap', 'Parvati Swayamvara Stotram', 'Havan'], NOW() + INTERVAL '14 days', 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=1000&auto=format&fit=crop'),

-- Debt Relief (Tirupati Balaji)
('33333333-3333-3333-3333-333333333333', 'Kanakadhara Stotram Path', 'Wealth', 'Trapped in heavy debts, facing sudden financial losses, or business downturns?', 2100, 5100, ARRAY['Clears accumulated debts', 'Opens new avenues of income', 'Attracts Goddess Lakshmi'], ARRAY['Personalized Sankalp', 'Video Proof', 'Prasad with silver coin'], ARRAY['Sankalp', 'Kanakadhara Stotram chanting 21 times', 'Lakshmi Havan', 'Aarti'], NOW() + INTERVAL '2 days', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop');
