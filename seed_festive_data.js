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

async function seedData() {
  const { data: festivals, error: festError } = await supabase
    .from('festival_countdown')
    .select('id, name')
    .eq('is_active', true)
    .limit(3);

  if (festError) {
    console.error("Error fetching festivals:", festError);
    return;
  }

  const { data: temples, error: templeError } = await supabase
    .from('temples')
    .select('id, name');

  console.log("Festivals:");
  console.table(festivals);
  
  console.log("Temples:");
  console.table(temples);
}

seedData();
