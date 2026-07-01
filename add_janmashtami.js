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

async function addFestival() {
  // Janmashtami target date
  const targetDate = new Date('2026-09-04T00:00:00Z').toISOString();
  
  const { error: insertError } = await supabase
    .from('festival_countdown')
    .insert({ 
      name: 'Krishna Janmashtami',
      target_date: targetDate,
      description: 'Celebrate the divine birth of Lord Krishna. Pre-book your Janmashtami pujas and offerings for a prosperous year ahead.',
      image_url: '/images/festival_janmashtami.png',
      is_active: true,
      sort_order: 1,
      position: 'after_pujas',
      display_style: 'full-width'
    });
    
  if (insertError) {
    console.error('Error inserting festival:', insertError);
  } else {
    console.log('Successfully inserted Krishna Janmashtami countdown');
  }
}

addFestival();
