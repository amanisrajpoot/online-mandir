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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const packages = [
  {
    id: "pkg_" + Date.now() + "_1",
    name: "अकेले के लिए*",
    members_text: "For 1 Member",
    max_members: 1,
    base_price: 501, 
    sale_price: 301
  },
  {
    id: "pkg_" + Date.now() + "_2",
    name: "जोड़े के लिए*",
    members_text: "For 2 Members",
    max_members: 2,
    base_price: 701,
    sale_price: 501
  },
  {
    id: "pkg_" + Date.now() + "_3",
    name: "परिवार के लिए*",
    members_text: "For 6 Members",
    max_members: 6,
    base_price: 1501,
    sale_price: 901
  },
  {
    id: "pkg_" + Date.now() + "_4",
    name: "VIP पूजा",
    members_text: "For 6 Members",
    max_members: 6,
    base_price: 15001,
    sale_price: 11001
  }
]

async function updatePujas() {
  console.log("Fetching existing pujas...")
  const { data: pujas, error: fetchError } = await supabase.from('pujas').select('id, title')
  
  if (fetchError) {
    console.error("Error fetching pujas:", fetchError)
    return
  }

  if (!pujas || pujas.length === 0) {
    console.log("No pujas found in the database.")
    return
  }

  console.log(`Found ${pujas.length} pujas. Updating packages...`)

  let successCount = 0
  let errorCount = 0

  for (const puja of pujas) {
    // Generate new unique IDs for each package for each puja
    const newPackages = packages.map(p => ({ ...p, id: "pkg_" + Date.now() + "_" + Math.floor(Math.random() * 1000) }))
    const { error: updateError } = await supabase
      .from('pujas')
      .update({
        packages: newPackages,
        base_price: newPackages[0].base_price,
        sale_price: newPackages[0].sale_price
      })
      .eq('id', puja.id)

    if (updateError) {
      console.error(`Failed to update puja ${puja.title} (${puja.id}):`, updateError)
      errorCount++
    } else {
      console.log(`Successfully updated ${puja.title}`)
      successCount++
    }
  }

  console.log(`\nDone! Updated ${successCount} pujas. Failed: ${errorCount}`)
}

updatePujas()
