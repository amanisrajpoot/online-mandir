import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('='))
    .filter(parts => parts.length >= 2)
    .map(([key, ...values]) => [key.trim(), values.join('=').trim()])
)

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function check() {
  const { data, error } = await supabase.from('pujas').select('id, title, packages').limit(2)
  console.log(JSON.stringify(data, null, 2))
}

check()
