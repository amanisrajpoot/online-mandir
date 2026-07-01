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
    // We only update if packages is missing or has less than 4 packages
    if (!puja.packages || puja.packages.length < 4) {
      console.log(`Updating packages for puja: ${puja.title}`);
      
      const newPackages = [
        {
          id: crypto.randomUUID(),
          name: 'अकेले के लिए (Individual)*',
          members_text: 'For 1 Member',
          max_members: 1,
          base_price: puja.base_price,
          sale_price: puja.sale_price
        },
        {
          id: crypto.randomUUID(),
          name: 'जोड़े के लिए (Couple)*',
          members_text: 'For 2 Members',
          max_members: 2,
          base_price: puja.base_price + 1000,
          sale_price: puja.sale_price + 500
        },
        {
          id: crypto.randomUUID(),
          name: 'परिवार के लिए (Family)*',
          members_text: 'For 4 Members',
          max_members: 4,
          base_price: puja.base_price + 2500,
          sale_price: puja.sale_price + 1500
        },
        {
          id: crypto.randomUUID(),
          name: 'संयुक्त परिवार (Joint Family)*',
          members_text: 'For 6 Members',
          max_members: 6,
          base_price: puja.base_price + 4000,
          sale_price: puja.sale_price + 2500
        }
      ];
      
      const { error: updateError } = await supabase
        .from('pujas')
        .update({ packages: newPackages })
        .eq('id', puja.id);
        
      if (updateError) {
        console.error(`Error updating puja ${puja.title}:`, updateError);
      } else {
        console.log(`Successfully updated ${puja.title}`);
      }
    } else {
      console.log(`Skipping ${puja.title} (already has ${puja.packages.length} packages)`);
    }
  }
  console.log("Finished updating pujas.");
}

updatePujas();
