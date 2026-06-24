import { createClient } from '@supabase/supabase-js'
import * as shortUUID from 'short-uuid'

const translator = shortUUID.createTranslator ? shortUUID.createTranslator() : (shortUUID.default ? shortUUID.default() : shortUUID())

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  // 1. Get Mahakaleshwar Temple
  const { data: temples, error: templeErr } = await supabase
    .from('temples')
    .select('id, name')
    .ilike('name', '%Mahakaleshwar%')
    
  if (templeErr || !temples || temples.length === 0) {
    console.error("Could not find Mahakaleshwar temple", templeErr)
    return
  }
  
  const templeId = temples[0].id
  
  // 2. Create Maha Shivratri Puja
  const { data: newPuja, error: pujaErr } = await supabase
    .from('pujas')
    .insert({
      temple_id: templeId,
      title: 'Maha Shivratri Special Rudrabhishek',
      category: 'Festival Special',
      problem_statement: 'Seeking spiritual awakening, overcoming deeply rooted fears, and receiving the ultimate grace of Mahadev.',
      benefits: [
        'Destroys negative karma and past sins',
        'Brings peace, prosperity, and spiritual growth',
        'Special Sankalp taken during the 4 Prahars of Shivratri',
      ],
      whats_included: [
        'Live Sankalp Video',
        'Bhasma from Mahakaleshwar',
        'Rudraksha Mala',
        'Prasad Thali'
      ],
      ritual_process: [
        'Sankalp by Pandit ji',
        'Ganesh Pujan',
        'Shiv Lingam Abhishek with Milk, Ghee, Honey',
        'Maha Aarti'
      ],
      base_price: 3100,
      sale_price: 2100,
      image_url: '/images/hero_banner_shivratri.png',
      booking_deadline: '2026-03-08T00:00:00Z'
    })
    .select()
    .single()
    
  if (pujaErr) {
    console.error("Error creating puja:", pujaErr)
    return
  }
  console.log("Created Maha Shivratri Puja:", newPuja.id)
  
  const shortPujaId = translator.fromUUID(newPuja.id)
  
  // 3. Update the existing Maha Shivratri banner to link to it
  const { error: bannerUpdateErr } = await supabase
    .from('hero_banners')
    .update({ link: `/pujas/${shortPujaId}` })
    .eq('link', '/pujas') // we previously changed it to /pujas
    .ilike('image_url', '%shivratri%')
    
  if (bannerUpdateErr) {
    console.error("Error updating banner:", bannerUpdateErr)
  } else {
    console.log("Updated Maha Shivratri banner link to", `/pujas/${shortPujaId}`)
  }

  // 4. Find another puja (e.g. Mahalakshmi)
  const { data: otherPujas, error: otherPujaErr } = await supabase
    .from('pujas')
    .select('id, title, image_url')
    .ilike('title', '%Mahalakshmi%')
    
  if (otherPujaErr || !otherPujas || otherPujas.length === 0) {
    console.error("Could not find another puja", otherPujaErr)
    return
  }
  
  const otherPuja = otherPujas[0]
  const otherShortId = translator.fromUUID(otherPuja.id)
  
  // 5. Create a new banner for it
  const { error: newBannerErr } = await supabase
    .from('hero_banners')
    .insert({
      image_url: otherPuja.image_url || '/images/puja_mahalakshmi.png',
      link: `/pujas/${otherShortId}`,
      cta_text: 'धन और समृद्धि प्राप्त करें',
      is_active: true
    })
    
  if (newBannerErr) {
    console.error("Error creating new banner:", newBannerErr)
  } else {
    console.log("Created new banner for", otherPuja.title)
  }
}

run()
