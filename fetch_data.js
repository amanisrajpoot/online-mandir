const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: temples } = await supabase.from('temples').select('*');
  const { data: festivals } = await supabase.from('festival_countdown').select('*');
  const { data: pujas } = await supabase.from('pujas').select('id, title, temple_id, festival_id');
  
  console.log('--- TEMPLES ---');
  console.log(JSON.stringify(temples, null, 2));
  
  console.log('--- FESTIVALS ---');
  console.log(JSON.stringify(festivals, null, 2));
  
  console.log('--- PUJAS ---');
  console.log(JSON.stringify(pujas, null, 2));
}

main();
