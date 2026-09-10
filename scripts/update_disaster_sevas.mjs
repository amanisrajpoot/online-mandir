import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).replace(/["']/g, '').trim()];
    })
);

const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
);

async function updateDonations() {
  console.log('Updating donations in Supabase...');

  // 1. Deactivate redundant sevas
  const redundantCategories = [
    'janwar-seva',
    'gav-seva',
    'vidya-daan',
    'vriksha-seva',
    'swasthya-seva'
  ];

  const { error: deactivateError } = await supabase
    .from('donations')
    .update({ is_active: false })
    .in('category', redundantCategories);

  if (deactivateError) {
    console.error('Error deactivating redundant sevas:', deactivateError);
  } else {
    console.log('Successfully deactivated redundant sevas:', redundantCategories);
  }

  // 2. Upsert new disaster relief funds
  const newDisasterReliefs = [
    {
      category: 'wayanad-relief',
      title: 'वायनाड भूस्खलन एवं बाढ़ राहत • Wayanad Disaster Relief',
      subtitle: 'Emergency Landslide & Flood Relief in Kerala',
      description: 'Devastating landslides and flash floods buried Chooralmala, Mundakkai, and Meppadi in Wayanad, Kerala. Thousands of survivors are living in emergency relief camps having lost their homes and livelihoods. Your donation directly funds community kitchen meals, grocery rations, warm blankets, and long-term family rehabilitation assistance.',
      emoji: '⛰️',
      image_url: '/images/donations/wayanad-relief.jpg',
      suggested_amounts: [251, 501, 1001, 2001, 5001, 11000, 21000],
      min_amount: 10,
      impact_statement: '₹251 provides 2 days hot meals • ₹1,001 sends emergency essentials • ₹5,001 aids family rehabilitation',
      donors_count: 1420,
      total_raised: 745000,
      is_active: true,
      display_order: 1,
    },
    {
      category: 'assam-flood-relief',
      title: 'असम ब्रह्मपुत्र बाढ़ राहत • Assam Flood Relief',
      subtitle: 'Urgent Monsoon Flood Relief & Boat Rescue Rations',
      description: 'Massive monsoon flooding across the Brahmaputra and Dikhow river basins has submerged hundreds of villages in Assam (Sivasagar, Jorhat, Dibrugarh, Morigaon). Thousands of families are cut off on river embankments without drinking water or dry food. Your contribution powers emergency boat rescue rations, water purification kits, infant formula, and mosquito nets.',
      emoji: '🌊',
      image_url: '/images/donations/assam-flood-relief.jpg',
      suggested_amounts: [251, 501, 1001, 2001, 5001, 11000, 21000],
      min_amount: 10,
      impact_statement: '₹251 supplies clean water & dry food • ₹1,001 sends flood medical kit • ₹5,001 fuels a rescue boat mission',
      donors_count: 1180,
      total_raised: 590000,
      is_active: true,
      display_order: 2,
    }
  ];

  for (const relief of newDisasterReliefs) {
    const { data, error } = await supabase
      .from('donations')
      .upsert(relief, { onConflict: 'category' })
      .select();

    if (error) {
      console.error(`Error inserting ${relief.category}:`, error);
    } else {
      console.log(`Successfully upserted ${relief.category}:`, data);
    }
  }
}

updateDonations();
