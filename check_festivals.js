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

async function check() {
  const { data: festivals } = await supabase.from('festival_countdown').select('*');
  const { data: banners } = await supabase.from('promo_banners').select('*');
  
  console.log('Festivals:', JSON.stringify(festivals, null, 2));
  console.log('Promo Banners:', JSON.stringify(banners, null, 2));
}

check();
