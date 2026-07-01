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

async function deactivateCountdowns() {
  const names = ['Raksha Bandhan', 'Ganesh Chaturthi'];
  
  for (const name of names) {
    const { error: updateError } = await supabase
      .from('festival_countdown')
      .update({ is_active: false })
      .eq('name', name);
      
    if (updateError) {
      console.error(`Error updating ${name}:`, updateError);
    } else {
      console.log(`Successfully deactivated ${name}`);
    }
  }
}

deactivateCountdowns();
