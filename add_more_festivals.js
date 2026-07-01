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

async function addFestivals() {
  const festivals = [
    {
      name: 'Guru Purnima',
      target_date: new Date('2026-07-29T00:00:00Z').toISOString(),
      description: 'Honor your spiritual guides and teachers on this auspicious day. Book special pujas for blessings and wisdom.',
      image_url: '/images/festival_guru_purnima.png',
      is_active: true,
      sort_order: 2,
      position: 'after_temples',
      display_style: 'full-width'
    },
    {
      name: 'Raksha Bandhan',
      target_date: new Date('2026-08-28T00:00:00Z').toISOString(),
      description: 'Celebrate the eternal bond of protection and love. Dedicate offerings for the well-being of your siblings.',
      image_url: '/images/festival_raksha_bandhan.png',
      is_active: true,
      sort_order: 3,
      position: 'above_footer',
      display_style: 'compact'
    },
    {
      name: 'Ganesh Chaturthi',
      target_date: new Date('2026-09-14T00:00:00Z').toISOString(),
      description: 'Welcome Lord Ganesha, the remover of obstacles. Pre-book your Ganesh Chaturthi pujas and modak offerings.',
      image_url: '/images/festival_ganesh_chaturthi.png',
      is_active: true,
      sort_order: 4,
      position: 'after_hero',
      display_style: 'compact'
    }
  ];
  
  for (const festival of festivals) {
    const { error: insertError } = await supabase
      .from('festival_countdown')
      .insert(festival);
      
    if (insertError) {
      console.error(`Error inserting ${festival.name}:`, insertError);
    } else {
      console.log(`Successfully inserted ${festival.name}`);
    }
  }
}

addFestivals();
