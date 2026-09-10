import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function reorderAndUpdate() {
  console.log("Starting Seva reordering & image updates...");

  const updates = [
    {
      category: "nepal-flood-relief",
      display_order: 1,
      suggested_amounts: [101, 251, 501, 1001, 2001, 5001, 11000, 21000],
      min_amount: 10,
      is_active: true
    },
    {
      category: "wayanad-relief",
      display_order: 2,
      image_url: "/images/donations/wayanad-relief.jpg",
      suggested_amounts: [101, 251, 501, 1001, 2001, 5001, 11000, 21000],
      min_amount: 10,
      is_active: true
    },
    {
      category: "assam-flood-relief",
      display_order: 3,
      image_url: "/images/donations/assam-flood-relief.jpg",
      suggested_amounts: [101, 251, 501, 1001, 2001, 5001, 11000, 21000],
      min_amount: 10,
      is_active: true
    },
    {
      category: "bhandara",
      display_order: 4,
      image_url: "/images/donations/bhandara-annadanam.jpg",
      suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000],
      is_active: true
    },
    {
      category: "gau-seva",
      display_order: 5,
      image_url: "/images/donations/gau-seva.png",
      suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000],
      is_active: true
    },
    {
      category: "vriddha-seva",
      display_order: 6,
      image_url: "/images/donations/vriddha-seva.png",
      suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000],
      is_active: true
    },
    {
      category: "mandir-seva",
      display_order: 7,
      image_url: "/images/donations/mandir-seva.jpg",
      suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000],
      is_active: true
    },
    {
      category: "nadi-seva",
      display_order: 8,
      image_url: "/images/donations/nadi-seva.jpg",
      suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000],
      is_active: true
    }
  ];

  for (const item of updates) {
    const { data, error } = await supabase
      .from("donations")
      .update({
        display_order: item.display_order,
        ...(item.image_url ? { image_url: item.image_url } : {}),
        suggested_amounts: item.suggested_amounts,
        ...(item.min_amount ? { min_amount: item.min_amount } : {}),
        is_active: item.is_active
      })
      .eq("category", item.category)
      .select();

    if (error) {
      console.error(`Error updating ${item.category}:`, error.message);
    } else {
      console.log(`Updated ${item.category} -> order: ${item.display_order}, image: ${item.image_url || '(kept)'}`);
    }
  }

  console.log("Database update completed!");
}

reorderAndUpdate();
