import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { error } = await supabase.rpc('exec_sql', {
    query: "ALTER TABLE donation_orders ADD COLUMN IF NOT EXISTS customer_email TEXT;"
  });
  if (error) console.error("RPC failed:", error.message);
  else console.log("Added column successfully using RPC (if available)");
}

run()
