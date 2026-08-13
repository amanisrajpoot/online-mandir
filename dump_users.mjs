import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data.users.map(u => ({ id: u.id, email: u.email, phone: u.phone, identities: u.identities?.map(i => i.identity_data) })), null, 2));
  }
}

check();
