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

async function seedNepalRelief() {
  console.log('Seeding Nepal Flood Relief into donations table...');
  
  const reliefData = {
    category: 'nepal-flood-relief',
    title: 'नेपाल बाढ़ राहत • Nepal Flood Relief',
    subtitle: 'Emergency Disaster Relief & Humanitarian Aid',
    description: 'Catastrophic flash floods swept through the Nepal-China border region along the Trishuli and Bhotekoshi river systems. Hundreds dead, thousands missing, and whole villages washed away overnight. Families in Rasuwa, Nuwakot, Timure, and Syabrubesi are stranded in relief camps with nothing left. In partnership with on-ground teams (Dreamer Trust, Uday Foundation Mumbai, and KindKarma), your contribution delivers emergency cooked meals, clean drinking water, emergency medical supplies, and temporary shelter kits.',
    emoji: '🚨',
    image_url: '/images/nepal-flood/nepal-flood-hero.jpg',
    suggested_amounts: [251, 501, 1001, 2001, 5001, 11000, 21000, 51000],
    min_amount: 10,
    impact_statement: '₹251 feeds a family for 2 days • ₹1,001 sends an emergency medical kit • ₹2,001 provides shelter essentials',
    donors_count: 1840,
    total_raised: 924500,
    is_active: true,
    display_order: 0,
  };

  const { data, error } = await supabase
    .from('donations')
    .upsert(reliefData, { onConflict: 'category' })
    .select();

  if (error) {
    console.error('Error inserting Nepal Flood Relief:', error);
  } else {
    console.log('Successfully upserted Nepal Flood Relief:', data);
  }
}

seedNepalRelief();
