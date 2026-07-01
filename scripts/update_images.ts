import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const imageMappings = [
  { keyword: 'Suktam Havan', newImage: '/images/puja_mahalakshmi.png' }, // Mahalakshmi
  { keyword: 'Bhaat Puja', newImage: '/images/puja_mangalnath.png' }, // Mangalnath
  { keyword: 'Baglamukhi', newImage: '/images/puja_pitambara.png' }, // Pitambara
  { keyword: 'Karya Siddhi Hanuman Homa', newImage: '/images/puja_karya_siddhi.png' }, // Karya Siddhi
  { keyword: 'Saraswati Vidyaprada', newImage: '/images/puja_mookambika.png' }, // Mookambika
  { keyword: 'Rahu-Ketu', newImage: '/images/puja_srikalahasti.png' }, // Srikalahasti
  { keyword: 'Dhanvantari', newImage: '/images/puja_vaitheeswaran.png' }, // Vaitheeswaran
  { keyword: 'Pretraj Sarkar', newImage: '/images/puja_mehandipur.png' }, // Mehandipur Balaji
  { keyword: 'Narayan Nagbali', newImage: '/images/puja_trimbakeshwar.png' } // Trimbakeshwar
];

async function run() {
  console.log("Updating Puja Images...");

  for (const mapping of imageMappings) {
    const { error } = await supabase
      .from('pujas')
      .update({ image_url: mapping.newImage })
      .ilike('title', `%${mapping.keyword}%`);

    if (error) {
      console.error(`Failed to update ${mapping.keyword}:`, error.message);
    } else {
      console.log(`Updated image for ${mapping.keyword} to ${mapping.newImage}`);
    }
  }

  // Also update temples table if we want them to match the puja images
  const templeMappings = [
    { name: 'Mahalakshmi Temple', newImage: '/images/puja_mahalakshmi.png' },
    { name: 'Mangalnath Temple', newImage: '/images/puja_mangalnath.png' },
    { name: 'Pitambara Peeth', newImage: '/images/puja_pitambara.png' },
    { name: 'Karya Siddhi Hanuman Temple', newImage: '/images/puja_karya_siddhi.png' },
    { name: 'Mookambika Temple', newImage: '/images/puja_mookambika.png' },
    { name: 'Srikalahasti Temple', newImage: '/images/puja_srikalahasti.png' },
    { name: 'Vaitheeswaran Koil', newImage: '/images/puja_vaitheeswaran.png' },
    { name: 'Mehandipur Balaji', newImage: '/images/puja_mehandipur.png' },
    { name: 'Trimbakeshwar', newImage: '/images/puja_trimbakeshwar.png' }
  ];

  for (const mapping of templeMappings) {
    const { error } = await supabase
      .from('temples')
      .update({ image_url: mapping.newImage })
      .eq('name', mapping.name);

    if (error) {
      console.error(`Failed to update temple ${mapping.name}:`, error.message);
    } else {
      console.log(`Updated temple image for ${mapping.name} to ${mapping.newImage}`);
    }
  }

  console.log("\nImage updating complete!");
}

run();
