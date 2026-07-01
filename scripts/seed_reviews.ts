import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const reviewTemplates = [
  "I booked this puja when I was going through a very tough phase. The video recording gave me immense peace, and within weeks I saw positive changes in my life. Highly recommended!",
  "Very professional and authentic. The panditji pronounced our gotra perfectly and the entire sankalp was visible on camera. Feeling truly blessed.",
  "We received the prasad via courier within 5 days. It felt exactly like visiting the temple in person. Will book again for Diwali.",
  "Excellent platform. Solved our problems and brought a lot of positivity to our home. Thank you Vandanam team.",
  "I was struggling with my career for a long time. After booking this homa, I finally cleared my interviews. Jai Shri Ram!"
];

const names = ["Aman Sharma", "Rohan Gupta", "Priya Patel", "Vikram Singh", "Anjali Desai", "Neha Verma", "Siddharth Rao", "Kavita Iyer", "Amitabh Joshi", "Suresh Menon"];

async function run() {
  console.log("Seeding Reviews...");

  // Fetch all active pujas
  const { data: pujas, error: pujasError } = await supabase.from('pujas').select('id');
  
  if (pujasError || !pujas) {
    console.error("Error fetching pujas:", pujasError);
    return;
  }

  const reviewsToInsert = [];

  for (const puja of pujas) {
    // Generate 3-5 reviews per puja
    const numReviews = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < numReviews; i++) {
      reviewsToInsert.push({
        puja_id: puja.id,
        user_name: names[Math.floor(Math.random() * names.length)],
        rating: Math.random() > 0.8 ? 4 : 5, // Mostly 5s, some 4s
        comment: reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)],
        is_verified: true
      });
    }
  }

  // Check if reviews table exists
  const { error: insertError } = await supabase.from('reviews').insert(reviewsToInsert);

  if (insertError) {
    console.error("Failed to insert reviews. Ensure you have run the 005_reviews_system.sql migration in Supabase! Error:", insertError.message);
  } else {
    console.log(`Successfully seeded ${reviewsToInsert.length} realistic reviews across ${pujas.length} pujas!`);
  }
}

run();
