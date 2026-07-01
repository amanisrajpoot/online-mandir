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

async function updateFestival() {
  // Update festival_countdown record
  const targetDate = new Date('2026-07-16T00:00:00Z').toISOString();
  
  const { error: updateError } = await supabase
    .from('festival_countdown')
    .update({ 
      name: 'Jagannath Rath Yatra',
      target_date: targetDate,
      description: 'The grand chariot festival of Lord Jagannath in Puri. Book your pujas and offerings to receive blessings during this auspicious time.',
      image_url: '/images/festival_jagannath.png'
    })
    .eq('name', 'Maha Shivratri');
    
  if (updateError) {
    console.error('Error updating festival:', updateError);
  } else {
    console.log('Successfully updated festival countdown to Jagannath Rath Yatra');
  }
}

updateFestival();
