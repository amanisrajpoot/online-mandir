import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log("Fixing dummy links in hero_banners...")
  const { data, error } = await supabase
    .from('hero_banners')
    .update({ link: '/pujas' })
    .eq('link', '/pujas/11111111-1111-1111-1111-111111111111')
    .select()
    
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Updated successfully:", data)
  }
}

run()
