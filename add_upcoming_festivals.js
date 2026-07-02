const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually
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

const festivals = [
  {
    name: 'Jagannath Rath Yatra',
    description: 'The grand chariot festival of Lord Jagannath, Balabhadra, and Subhadra.',
    target_date: '2026-07-16T00:00:00Z',
    is_active: true,
    display_style: 'standard'
  },
  {
    name: 'Guru Purnima',
    description: 'A day to honor spiritual and academic gurus. Seek divine guidance and wisdom.',
    target_date: '2026-07-29T00:00:00Z',
    is_active: true,
    display_style: 'compact'
  },
  {
    name: 'Raksha Bandhan',
    description: 'Celebrate the eternal bond of love and protection between siblings.',
    target_date: '2026-08-28T00:00:00Z',
    is_active: true,
    display_style: 'standard'
  },
  {
    name: 'Krishna Janmashtami',
    description: 'The joyous celebration of Lord Krishna\'s divine appearance.',
    target_date: '2026-09-04T00:00:00Z',
    is_active: true,
    display_style: 'featured'
  },
  {
    name: 'Ganesh Chaturthi',
    description: 'Welcome Lord Ganesha, the remover of obstacles, with grand devotion.',
    target_date: '2026-09-14T00:00:00Z',
    is_active: true,
    display_style: 'standard'
  },
  {
    name: 'Navratri Begins',
    description: 'Nine nights of devotion to Goddess Durga. Awaken your inner strength.',
    target_date: '2026-10-11T00:00:00Z',
    is_active: true,
    display_style: 'featured'
  },
  {
    name: 'Durga Puja',
    description: 'The spectacular celebration of Goddess Durga\'s victory over Mahishasura.',
    target_date: '2026-10-12T00:00:00Z',
    is_active: true,
    display_style: 'standard'
  },
  {
    name: 'Dussehra (Vijayadashami)',
    description: 'Celebrate the triumph of good over evil with Lord Rama\'s victory.',
    target_date: '2026-10-17T00:00:00Z',
    is_active: true,
    display_style: 'compact'
  },
  {
    name: 'Dhanteras',
    description: 'The auspicious day of wealth, prosperity, and buying precious metals.',
    target_date: '2026-11-06T00:00:00Z',
    is_active: true,
    display_style: 'standard'
  },
  {
    name: 'Diwali',
    description: 'The festival of lights. Celebrate prosperity, joy, and the victory of light over darkness.',
    target_date: '2026-11-08T00:00:00Z',
    is_active: true,
    display_style: 'featured'
  },
  {
    name: 'Chhath Puja',
    description: 'An ancient Vedic festival dedicated to the Sun God (Surya) and Chhathi Maiya.',
    target_date: '2026-11-14T00:00:00Z',
    is_active: true,
    display_style: 'compact'
  },
  {
    name: 'Makar Sankranti',
    description: 'The harvest festival marking the sun\'s transit into Capricorn.',
    target_date: '2027-01-14T00:00:00Z',
    is_active: true,
    display_style: 'standard'
  },
  {
    name: 'Vasant Panchami',
    description: 'Honor Goddess Saraswati and celebrate the arrival of spring and knowledge.',
    target_date: '2027-02-11T00:00:00Z',
    is_active: true,
    display_style: 'compact'
  },
  {
    name: 'Maha Shivaratri',
    description: 'The great night of Shiva. A powerful time for spiritual awakening.',
    target_date: '2027-03-06T00:00:00Z',
    is_active: true,
    display_style: 'featured'
  },
  {
    name: 'Holi',
    description: 'The vibrant festival of colors, love, and the victory of good over evil.',
    target_date: '2027-03-22T00:00:00Z',
    is_active: true,
    display_style: 'standard'
  }
];

async function seedFestivals() {
  console.log("Upserting upcoming festivals...");
  await Promise.all(festivals.map(async (festival) => {
    // Check if exists
    const { data: existing, error: fetchError } = await supabase
      .from('festival_countdown')
      .select('id')
      .eq('name', festival.name)
      .single();

    if (existing) {
      const { error: updateError } = await supabase
        .from('festival_countdown')
        .update({
          target_date: festival.target_date,
          description: festival.description,
          is_active: festival.is_active,
          display_style: festival.display_style
        })
        .eq('id', existing.id);
      
      if (updateError) console.error(`Error updating ${festival.name}:`, updateError);
      else console.log(`Updated ${festival.name}`);
    } else {
      const { error: insertError } = await supabase
        .from('festival_countdown')
        .insert([festival]);
      
      if (insertError) console.error(`Error inserting ${festival.name}:`, insertError);
      else console.log(`Inserted ${festival.name}`);
    }
  }));
  console.log("Done!");
}

seedFestivals();
