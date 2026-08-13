import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  const { data, error } = await supabase
    .from('orders')
    .select('customer_email')
    .limit(1)
  
  if (error) {
    console.error("Orders Error:", error.message)
  } else {
    console.log("Orders Email Column exists!")
  }
}

checkSchema()
