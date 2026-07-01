const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

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

async function updatePujas() {
  const { data: pujas, error: fetchError } = await supabase.from('pujas').select('id, title, base_price, sale_price, packages');
  if (fetchError) {
    console.error('Error fetching pujas:', fetchError);
    return;
  }
  
  for (const puja of pujas) {
    console.log(`Updating packages for puja: ${puja.title}`);
    
    const newPackages = [
      {
        id: crypto.randomUUID(),
        name: 'अकेले के लिए*',
        members_text: 'For 1 Member',
        max_members: 1,
        base_price: 1001,
        sale_price: 301
      },
      {
        id: crypto.randomUUID(),
        name: 'जोड़े के लिए*',
        members_text: 'For 2 Members',
        max_members: 2,
        base_price: 5001,
        sale_price: 501
      },
      {
        id: crypto.randomUUID(),
        name: 'परिवार के लिए*',
        members_text: 'For Upto 10 Members',
        max_members: 6,
        base_price: 10001,
        sale_price: 1001
      },
      {
        id: crypto.randomUUID(),
        name: 'VIP पूजा',
        members_text: 'For Upto 50 Members',
        max_members: 6,
        base_price: 50001,
        sale_price: 11001
      }
    ];
    
    const { error: updateError } = await supabase
      .from('pujas')
      .update({ packages: newPackages, base_price: 1001, sale_price: 301 })
      .eq('id', puja.id);
      
    if (updateError) {
      console.error(`Error updating puja ${puja.title}:`, updateError);
    } else {
      console.log(`Successfully updated ${puja.title}`);
    }
  }
  console.log("Finished updating pujas.");
}

updatePujas();
