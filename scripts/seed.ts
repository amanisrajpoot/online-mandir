import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Starting Problem-Oriented Pujas Seed...");

  // PHASE 1: CLEANUP
  console.log("--- PHASE 1: Cleaning up low-relevance pujas ---");
  const pujasToDelete = [
    'Ganesh Chaturthi Special',
    'Maha Lakshmi Puja',
    'Mangal Dosh Shanti',
    'Saraswati Vidyaprada Puja',
    'Karya Siddhi Hanuman Puja',
    'Sarva Rog Nivaran Puja',
    'Gauri Shankar Puja',
    'Chandra Shanti & Rudrabhishek',
    'Kanakadhara Stotram Path'
  ];

  for (const p of pujasToDelete) {
    const { error } = await supabase.from('pujas').delete().eq('title', p);
    if (error) {
      console.error(`Failed to delete ${p}:`, error.message);
    } else {
      console.log(`Deleted: ${p}`);
    }
  }

  // PHASE 2: INSERT NEW DATA
  console.log("\n--- PHASE 2: Seeding Problem-Oriented Temples & Pujas ---");

  const temples = [
    {
      id: crypto.randomUUID(),
      name: 'Mahalakshmi Temple',
      location: 'Kolhapur, MH',
      deity: 'Goddess Mahalakshmi',
      description: 'One of the 18 Maha Shakti Peethas, known for granting wealth and clearing debts.',
      image_url: 'https://images.unsplash.com/photo-1621508670868-b715690b213b?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      name: 'Mangalnath Temple',
      location: 'Ujjain, MP',
      deity: 'Lord Mangal (Mars)',
      description: 'The birthplace of Mars according to Matsya Purana, ultimate destination for Mangal Dosh Shanti.',
      image_url: 'https://images.unsplash.com/photo-1542458428-21d1b32d2077?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      name: 'Pitambara Peeth',
      location: 'Datia, MP',
      deity: 'Maa Baglamukhi',
      description: 'A famous Shakti Peeth known for paralyzing enemies and granting victory in legal battles.',
      image_url: 'https://images.unsplash.com/photo-1593361036080-60b642ec67fc?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      name: 'Karya Siddhi Hanuman Temple',
      location: 'Bengaluru, KA',
      deity: 'Lord Hanuman',
      description: 'Known for fulfilling wishes (Karya Siddhi), especially regarding career and employment.',
      image_url: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      name: 'Mookambika Temple',
      location: 'Kollur, KA',
      deity: 'Goddess Mookambika (Saraswati)',
      description: 'The ultimate destination for students seeking focus, intellect, and excellence in arts & education.',
      image_url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      name: 'Srikalahasti Temple',
      location: 'Srikalahasti, AP',
      deity: 'Lord Shiva',
      description: 'The Kailash of the South, renowned worldwide for Rahu-Ketu and Kaal Sarp Dosh pujas.',
      image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      name: 'Vaitheeswaran Koil',
      location: 'Tamil Nadu',
      deity: 'Lord Shiva (Vaidyanatha)',
      description: 'The God of Healing. Devotees visit to cure severe and chronic ailments.',
      image_url: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      name: 'Mehandipur Balaji',
      location: 'Rajasthan',
      deity: 'Lord Hanuman',
      description: 'Famous for ritualistic healing and exorcism from evil spirits, black magic, and heavy negativity.',
      image_url: 'https://images.unsplash.com/photo-1602980068989-cb21ea54caeb?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      name: 'Trimbakeshwar',
      location: 'Nashik, MH',
      deity: 'Lord Shiva',
      description: 'One of the 12 Jyotirlingas, exclusively known for Narayan Nagbali and Pitra Dosh Nivaran.',
      image_url: 'https://images.unsplash.com/photo-1570535384661-0d32bb574d6c?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  // Insert Temples
  const { error: templeError } = await supabase.from('temples').insert(temples);
  if (templeError) {
    console.error("Error inserting temples:", templeError);
    return;
  }
  console.log(`Inserted 9 highly-specific Temples successfully.`);

  const now = new Date();
  const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now

  const pujas = [
    {
      id: crypto.randomUUID(),
      temple_id: temples[0].id,
      title: 'Sri Suktam Havan & Kamal Gatta Archana',
      category: 'Wealth',
      problem_statement: 'Drowning in debt, continuous business losses, or struggling to save money?',
      base_price: 2100,
      sale_price: 4100,
      benefits: ['Clears accumulated debts', 'Opens new income sources', 'Attracts financial stability'],
      whats_included: ['Personalized Sankalp Video', 'Prasad with Silver Coin', 'Sri Suktam Yantra'],
      ritual_process: ['Sankalp', 'Sri Suktam Path', 'Kamal Gatta Archana', 'Havan'],
      booking_deadline: deadline,
      image_url: 'https://images.unsplash.com/photo-1621508670868-b715690b213b?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      temple_id: temples[1].id,
      title: 'Bhaat Puja for Mangal Dosh Shanti',
      category: 'Marriage',
      problem_statement: 'Facing continuous rejections, delays in marriage, or relationship discord due to Manglik Dosh?',
      base_price: 3100,
      sale_price: 7100,
      benefits: ['Pacifies Mars (Mangal)', 'Removes obstacles in marriage', 'Ensures a harmonious marital life'],
      whats_included: ['Live Video of Bhaat Puja', 'Bhasm Prasad', 'Mangal Yantra'],
      ritual_process: ['Sankalp', 'Shivling Abhishek with Curd/Rice', 'Mangal Jaap', 'Aarti'],
      booking_deadline: deadline,
      image_url: 'https://images.unsplash.com/photo-1542458428-21d1b32d2077?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      temple_id: temples[2].id,
      title: 'Maa Baglamukhi Shatru Nashak Anushthan',
      category: 'Protection',
      problem_statement: 'Facing prolonged court cases, property disputes, or harassment from hidden enemies?',
      base_price: 5100,
      sale_price: 11000,
      benefits: ['Victory in legal battles', 'Silencing opponents', 'Protection from conspiracy'],
      whats_included: ['Personalized Sankalp', 'Video Proof', 'Haldi Mala & Prasad'],
      ritual_process: ['Sankalp', 'Baglamukhi Mantra Jaap', 'Peetambar Havan', 'Aarti'],
      booking_deadline: deadline,
      image_url: 'https://images.unsplash.com/photo-1593361036080-60b642ec67fc?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      temple_id: temples[3].id,
      title: 'Karya Siddhi Hanuman Homa',
      category: 'Career',
      problem_statement: 'Unemployed, stuck in the same position for years, or fearing sudden job loss?',
      base_price: 1500,
      sale_price: 3100,
      benefits: ['Ensures career stability', 'Success in interviews', 'Removes professional hurdles'],
      whats_included: ['Personalized Sankalp', 'Sindoor & Prasad', 'Hanuman Raksha Sutra'],
      ritual_process: ['Sankalp', 'Hanuman Chalisa 108 Times', 'Havan', 'Aarti'],
      booking_deadline: deadline,
      image_url: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      temple_id: temples[4].id,
      title: 'Saraswati Vidyaprada Puja & Medha Suktam Path',
      category: 'Education',
      problem_statement: 'Is your child struggling with concentration, mobile addiction, or exam anxiety?',
      base_price: 1100,
      sale_price: 2100,
      benefits: ['Enhances memory', 'Removes distractions', 'Brings blessings for competitive exams'],
      whats_included: ['Sankalp Video', 'Saraswati Yantra', 'Prasad'],
      ritual_process: ['Sankalp', 'Medha Suktam Path', 'Saraswati Archana', 'Aarti'],
      booking_deadline: deadline,
      image_url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      temple_id: temples[5].id,
      title: 'Rahu-Ketu Shanti & Kaal Sarp Dosh Nivaran',
      category: 'Astrology',
      problem_statement: 'Facing sudden unexplained failures, financial blocks, or delays in every work you start?',
      base_price: 2500,
      sale_price: 5100,
      benefits: ['Neutralizes Rahu-Ketu malefic effects', 'Clears hidden blocks', 'Brings sudden positive shifts'],
      whats_included: ['Video of Puja', 'Silver Nag-Nagin', 'Prasad'],
      ritual_process: ['Sankalp', 'Rahu-Ketu Jaap', 'Abhishek', 'Aarti'],
      booking_deadline: deadline,
      image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      temple_id: temples[6].id,
      title: 'Dhanvantari Maha Mrityunjaya Homa',
      category: 'Health',
      problem_statement: 'Suffering from chronic illnesses, frequent hospitalization, or draining savings on medical bills?',
      base_price: 3100,
      sale_price: 6100,
      benefits: ['Speedy recovery', 'Boosts immunity', 'Divine protection from severe diseases'],
      whats_included: ['Live Sankalp Video', 'Bhasm from Havan', 'Rudraksha Mala'],
      ritual_process: ['Sankalp', 'Dhanvantari Jaap', 'Maha Mrityunjaya Havan', 'Aarti'],
      booking_deadline: deadline,
      image_url: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      temple_id: temples[7].id,
      title: 'Sankat Mochan Pretraj Sarkar Havan',
      category: 'Protection',
      problem_statement: 'Feeling heavy negativity, constant fights at home, depression, or fear of black magic?',
      base_price: 2100,
      sale_price: 5100,
      benefits: ['Destroys negative energies', 'Removes evil eye (Nazar)', 'Brings absolute mental peace'],
      whats_included: ['Sankalp', 'Mehandipur Balaji Prasad', 'Raksha Sutra'],
      ritual_process: ['Sankalp', 'Pretraj Sarkar Ardas', 'Havan', 'Aarti'],
      booking_deadline: deadline,
      image_url: 'https://images.unsplash.com/photo-1602980068989-cb21ea54caeb?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: crypto.randomUUID(),
      temple_id: temples[8].id,
      title: 'Narayan Nagbali & Pitra Dosh Nivaran',
      category: 'Astrology',
      problem_statement: 'Facing endless family disputes, lack of progress, or financial instability due to Pitra Dosh?',
      base_price: 4100,
      sale_price: 9100,
      benefits: ['Pacifies ancestors', 'Resolves family discord', 'Brings generation-wide prosperity'],
      whats_included: ['Sankalp Video', 'Pitra Dosh Yantra', 'Prasad'],
      ritual_process: ['Sankalp', 'Narayan Nagbali Vidhi', 'Pind Daan', 'Havan'],
      booking_deadline: deadline,
      image_url: 'https://images.unsplash.com/photo-1570535384661-0d32bb574d6c?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  // Insert Pujas
  const { error: pujaError } = await supabase.from('pujas').insert(pujas);
  if (pujaError) {
    console.error("Error inserting pujas:", pujaError);
    return;
  }
  console.log(`Inserted 9 problem-solving Pujas successfully.`);
  
  console.log("\nDatabase completely updated with the new strategy!");
}

run();
