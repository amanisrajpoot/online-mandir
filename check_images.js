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

async function checkImages() {
  const { data: pujas } = await supabase.from('pujas').select('id, title, image_url').ilike('image_url', '%unsplash%');
  const { data: temples } = await supabase.from('temples').select('id, name, image_url').ilike('image_url', '%unsplash%');
  
  console.log('Pujas with unsplash images:', JSON.stringify(pujas, null, 2));
  console.log('Temples with unsplash images:', JSON.stringify(temples, null, 2));
}

checkImages();
