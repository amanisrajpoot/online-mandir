-- Migration 012: Add Maa Baglamukhi Mandir, Nalkheda and Maa Baglamukhi Mirchi Havan & Puja

-- 1. Insert/Upsert Temple: Maa Baglamukhi Mandir, Nalkheda (Ujjain)
INSERT INTO public.temples (
  id, 
  name, 
  location, 
  deity, 
  description, 
  image_url, 
  history, 
  architecture, 
  timings, 
  how_to_reach
) 
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 
  'Maa Baglamukhi Mandir, Nalkheda', 
  'Nalkheda, Agar Malwa (near Ujjain), MP', 
  'Maa Baglamukhi (Pitambara)', 
  'Located on the sacred banks of the Lakhundar River in Nalkheda, this ancient Shakti Peeth is renowned across India for paralyzing enemy conspiracies, clearing court cases, and destroying black magic.', 
  'https://images.unsplash.com/photo-1593361036080-60b642ec67fc?q=80&w=1000&auto=format&fit=crop',
  'As mentioned in the Kalika Purana, the sacred idol dates back to the Dvapara Yuga. During their exile, the Pandavas were instructed by Lord Krishna to worship Maa Baglamukhi here to secure total victory in the Mahabharata war.',
  'The temple houses three consecrated deities (Pindis): Maa Baglamukhi in the center, Goddess Mahalakshmi on the right, and Goddess Saraswati on the left. The sanctum features eternal Akhand Dhuni that has been burning for centuries.',
  '{"open": "05:00", "close": "22:00"}'::jsonb,
  'Air: Devi Ahilyabai Holkar Airport, Indore (approx. 140 km).\nRail: Ujjain Junction Railway Station (approx. 100 km) or Kota Junction.\nRoad: Well connected by road from Ujjain, Indore, and Bhopal.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  deity = EXCLUDED.deity,
  description = EXCLUDED.description,
  history = EXCLUDED.history,
  architecture = EXCLUDED.architecture,
  timings = EXCLUDED.timings,
  how_to_reach = EXCLUDED.how_to_reach;

-- 2. Insert/Upsert Puja: Maa Baglamukhi Mirchi Havan & Puja
INSERT INTO public.pujas (
  id,
  temple_id,
  title,
  category,
  problem_statement,
  base_price,
  sale_price,
  benefits,
  whats_included,
  ritual_process,
  faqs,
  image_url,
  booking_deadline,
  packages
)
VALUES (
  'f0e1d2c3-b4a5-6789-0123-456789abcdef',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Maa Baglamukhi Mirchi Havan & Puja',
  'Protection',
  'Struggling with court cases, legal disputes, malicious enemies, evil eye (Kaali Nazar), or unexplainable financial/career blocks?',
  1001,
  501,
  ARRAY[
    'Shatru Mukti: Paralyzes hostility, ill-intent, and hidden competitors',
    'Relief From False Allegations: Silences slander, gossip, and vicious defamation',
    'Triumph in Legal Battles: Grants decisive victory in court hearings and property disputes',
    'Tantra & Evil Eye Shield: Neutralizes black magic, negative energies, and fear',
    'Career & Business Breakthrough: Restores fearlessness, authority, and confidence'
  ],
  ARRAY[
    'Personalized Sankalp with Devotee Name & Gotra',
    'Recorded Video Proof of Havan with Sankalp Chanting',
    'Abhimantrit Baglamukhi Raksha Sutra & Peetambar Prasad'
  ],
  ARRAY[
    'Vedic Pandits initiate Name & Gotra Sankalp',
    'Baglamukhi Mool Mantra & Stotram Jaap',
    'Fiery Mirchi & Peetambar Samidha Havan',
    'Maha Aarti & Consecration of Protection Thread'
  ],
  ARRAY[
    '{"question": "What is the significance of Mirchi Havan?", "answer": "The Red Chilli (Mirchi) Havan dedicated to Maa Baglamukhi is a specialized Vedic-Tantric ritual known for its swift and decisive effect in paralyzing enemy aggression, resolving legal disputes, and destroying negative energies."}'::jsonb,
    '{"question": "Do I need to be physically present at the temple?", "answer": "No. The temple priests perform the personalized Sankalp taking your full name and Gotra on your behalf. A personalized video recording of the ritual and Sankalp will be shared with you."}'::jsonb,
    '{"question": "When will I receive the video of the Puja?", "answer": "You will receive the video proof along with your name/gotra sankalp darshan on WhatsApp and your profile within 3-4 days after the puja completion."}'::jsonb
  ],
  'https://images.unsplash.com/photo-1593361036080-60b642ec67fc?q=80&w=1000&auto=format&fit=crop',
  NOW() + INTERVAL '7 days',
  jsonb_build_array(
    jsonb_build_object(
      'id', '11111111-aaaa-bbbb-cccc-000000000001',
      'name', 'अकेले के लिए (Single Devotee)',
      'members_text', 'For 1 Member',
      'max_members', 1,
      'base_price', 1001,
      'sale_price', 501
    ),
    jsonb_build_object(
      'id', '11111111-aaaa-bbbb-cccc-000000000002',
      'name', 'दंपति के लिए (Couple Sankalp)',
      'members_text', 'For 2 Members',
      'max_members', 2,
      'base_price', 1801,
      'sale_price', 851
    ),
    jsonb_build_object(
      'id', '11111111-aaaa-bbbb-cccc-000000000003',
      'name', 'परिवार के लिए (Family Sankalp)',
      'members_text', 'For 6 Members',
      'max_members', 6,
      'base_price', 3001,
      'sale_price', 1501
    ),
    jsonb_build_object(
      'id', '11111111-aaaa-bbbb-cccc-000000000004',
      'name', 'विशेष शत्रु विजय महा हवन (VIP Puja)',
      'members_text', 'For Upto 8 Members',
      'max_members', 8,
      'base_price', 11001,
      'sale_price', 5101
    )
  )
)
ON CONFLICT (id) DO UPDATE SET
  temple_id = EXCLUDED.temple_id,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  problem_statement = EXCLUDED.problem_statement,
  base_price = EXCLUDED.base_price,
  sale_price = EXCLUDED.sale_price,
  benefits = EXCLUDED.benefits,
  whats_included = EXCLUDED.whats_included,
  ritual_process = EXCLUDED.ritual_process,
  faqs = EXCLUDED.faqs,
  image_url = EXCLUDED.image_url,
  booking_deadline = EXCLUDED.booking_deadline,
  packages = EXCLUDED.packages;
