const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0 && !key.startsWith('#')) {
    env[key.trim()] = values.join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedFallbackData() {
  console.log("Seeding Pujas and Chadhavas with existing images...");

  // Mapping logic for Chadhavas based on title keywords
  const getChadhavaImage = (title) => {
    const t = title.toLowerCase();
    if (t.includes('vastra') || t.includes('silk') || t.includes('cloth')) return '/images/chadhava_vastra.png';
    if (t.includes('deep') || t.includes('lamp') || t.includes('diya')) return '/images/chadhava_deepdaan.png';
    if (t.includes('pushp') || t.includes('flower') || t.includes('mala') || t.includes('tulsi') || t.includes('pankh')) return '/images/chadhava_pushp.png';
    if (t.includes('bhog') || t.includes('sweets') || t.includes('panjiri') || t.includes('makhan') || t.includes('fruit')) return '/images/prasad_thali.png';
    return '/images/chadhava_abhishek.png'; // Default fallback
  };

  // Mapping logic for Pujas based on title keywords
  const getPujaImage = (title) => {
    const t = title.toLowerCase();
    if (t.includes('ganesh') || t.includes('vinayak')) return '/images/puja_ganesh.png';
    if (t.includes('shiva') || t.includes('rudrabhishek') || t.includes('mahakal')) return '/images/rudrabhishek_puja.png';
    if (t.includes('lakshmi') || t.includes('dhan')) return '/images/puja_mahalakshmi.png';
    if (t.includes('navratri') || t.includes('durga') || t.includes('chandi')) return '/images/hero_banner_navratri.png';
    return '/images/puja_mangal_dosh.png'; // Default fallback
  };

  // 1. Update Existing Festivals' Items
  const { data: chadhavas } = await supabase.from('chadhava_items').select('id, title').not('festival_id', 'is', null);
  if (chadhavas) {
    for (const c of chadhavas) {
      await supabase.from('chadhava_items').update({ image_url: getChadhavaImage(c.title) }).eq('id', c.id);
    }
    console.log("Updated images for existing chadhavas");
  }

  const { data: pujas } = await supabase.from('pujas').select('id, title').not('festival_id', 'is', null);
  if (pujas) {
    for (const p of pujas) {
      await supabase.from('pujas').update({ image_url: getPujaImage(p.title) }).eq('id', p.id);
    }
    console.log("Updated images for existing pujas");
  }

  // 2. Insert new Pujas and Chadhavas for the remaining 12 festivals
  const { data: festivals } = await supabase.from('festival_countdown').select('id, name');
  const { data: temples } = await supabase.from('temples').select('id, name').limit(1);
  const defaultTempleId = temples[0].id;

  const newPujas = [];
  const newChadhavas = [];

  const festivalsToSeed = [
    { name: 'Ganesh Chaturthi', 
      p: ['Siddhivinayak Ashtavinayak Puja', 'Ganesh Mahayagya', 'Riddhi Siddhi Archana'], 
      c: ['Modak Bhog', 'Durva Grass Mala', 'Red Hibiscus Garland', 'Yellow Silk Vastra', 'Deep Daan'] 
    },
    { name: 'Navratri Begins', 
      p: ['Navchandi Havan', 'Durga Saptashati Paath', 'Mata Rani Shringar Puja'], 
      c: ['Mata Ki Chunri', 'Red Rose Garland', 'Sweets Bhog', 'Akhand Jyoti Diya', 'Coconut Offering'] 
    },
    { name: 'Durga Puja', 
      p: ['Maha Ashtami Pushpanjali', 'Sandhi Puja', 'Maha Navami Havan'], 
      c: ['Sandesh Sweets Bhog', 'Red Lotus Offering', 'Dhunuchi Diya', 'Silk Saree Vastra', 'Kumkum Box'] 
    },
    { name: 'Dussehra (Vijayadashami)', 
      p: ['Ayodhya Rama Archana', 'Astra Yastra Puja', 'Shami Tree Pujan'], 
      c: ['Shami Leaves', 'Jalebi Bhog', 'Marigold Garland', 'Deep Daan', 'Vastra for Rama'] 
    },
    { name: 'Dhanteras', 
      p: ['Dhanvantari Health Puja', 'Kuber Dhan Varsha Puja', 'Maha Lakshmi Pujan'], 
      c: ['Silver Coin Offering', 'Panchamrit Abhishek', 'Lotus Flowers', 'Deep Daan', 'Sweets Bhog'] 
    },
    { name: 'Diwali', 
      p: ['Maha Lakshmi & Ganesh Pujan', 'Deepavali Special Aarti', 'Saraswati Puja'], 
      c: ['Kheel Batasha', 'Grand 51 Diya Deep Daan', 'Red Silk Vastra', 'Rose Garland', 'Premium Mithai Box'] 
    },
    { name: 'Chhath Puja', 
      p: ['Surya Arghya Sankalp', 'Chhathi Maiya Archana', 'Surya Narayan Puja'], 
      c: ['Thekua Prasad', 'Sugarcane Offering', 'Fruits Basket', 'Deep Daan in River', 'Yellow Vastra'] 
    },
    { name: 'Makar Sankranti', 
      p: ['Surya Narayan Archana', 'Gayatri Mantra Jaap', 'Navgraha Shanti'], 
      c: ['Til Gud (Sesame Sweets)', 'Khichdi Prasad', 'Yellow Flowers', 'Deep Daan', 'Silk Vastra'] 
    },
    { name: 'Vasant Panchami', 
      p: ['Saraswati Vidya Puja', 'Vidyarambham Ceremony', 'Vasant Ritu Archana'], 
      c: ['Yellow Flowers (Pushp)', 'Yellow Sweets Bhog', 'Books & Pen Offering', 'Deep Daan', 'Yellow Silk Vastra'] 
    },
    { name: 'Maha Shivaratri', 
      p: ['Midnight Rudrabhishek', 'Maha Mrityunjaya Jaap', 'Pahar Puja (4 phases)'], 
      c: ['Bel Patra & Bhaang', 'Milk Abhishek', 'White Flower Garland', 'Deep Daan', 'Rudraaksha Mala'] 
    },
    { name: 'Holi', 
      p: ['Radha Krishna Phoolon Ki Holi', 'Holika Dahan Sankalp', 'Krishna Aarti'], 
      c: ['Herbal Gulal (Colors)', 'Gujiya Prasad', 'Flower Garland', 'Deep Daan', 'Yellow Vastra'] 
    },
    { name: 'Raksha Bandhan', 
      p: ['Sibling Protection Sankalp', 'Santan Gopal Jaap', 'Ganesh Archana'], 
      c: ['Premium Rakhi Offering', 'Sweets Box', 'Coconut Offering', 'Deep Daan', 'Silk Vastra'] 
    }
  ];

  for (const festObj of festivalsToSeed) {
    const festDB = festivals.find(f => f.name === festObj.name);
    if (!festDB) continue;

    // Push 3 Pujas
    festObj.p.forEach((title, i) => {
      newPujas.push({
        temple_id: defaultTempleId,
        festival_id: festDB.id,
        title: title,
        category: 'Festival',
        problem_statement: `Special ${title} performed auspiciously on ${festObj.name}.`,
        base_price: 2000 + (i * 500),
        sale_price: 1500 + (i * 400),
        image_url: getPujaImage(title),
        benefits: ['Divine Grace', 'Obstacle Removal', 'Prosperity']
      });
    });

    // Push 5 Chadhavas
    festObj.c.forEach((title, i) => {
      newChadhavas.push({
        temple_id: defaultTempleId,
        festival_id: festDB.id,
        title: title,
        description: `Sacred offering of ${title} during ${festObj.name}.`,
        price: 251 + (i * 100),
        image_url: getChadhavaImage(title)
      });
    });
  }

  if (newPujas.length > 0) {
    await supabase.from('pujas').insert(newPujas);
    console.log(`Inserted ${newPujas.length} new pujas`);
  }

  if (newChadhavas.length > 0) {
    await supabase.from('chadhava_items').insert(newChadhavas);
    console.log(`Inserted ${newChadhavas.length} new chadhavas`);
  }

  console.log("Seeding complete!");
}

seedFallbackData();
