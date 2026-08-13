import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testQuery() {
  const formattedPhone = "+919662597967";
  const searchPhone = formattedPhone.replace('+', '');
  
  console.log("Searching for:", searchPhone, formattedPhone);
  
  const { data: authUser, error } = await supabaseAdmin
      .schema('auth')
      .from('users')
      .select('id, phone')
      .or(`phone.eq.${searchPhone},phone.eq.${formattedPhone}`)
      .maybeSingle();
      
  console.log("Result:", authUser);
  console.log("Error:", error);
}

testQuery();
