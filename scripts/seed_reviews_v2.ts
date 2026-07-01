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

const INDIAN_NAMES = [
  "Amit Patel", "Priya Sharma", "Rahul Desai", "Sneha Iyer", "Vikram Singh",
  "Anjali Gupta", "Rohit Verma", "Neha Joshi", "Karan Malhotra", "Pooja Kumar",
  "Suresh Rao", "Meera Reddy", "Arjun Nair", "Kavita Menon", "Sanjay Kapoor",
  "Deepa Chawla", "Rajesh Pillai", "Aarti Bhatt", "Vishal Mehta", "Swati Kulkarni",
  "Ganesh Hegde", "Priyanka Das", "Manoj Tiwari", "Rekha Bose", "Nitin Aggarwal",
  "Shilpa Shetty", "Pradeep Nambiar", "Sunita Patil", "Ravi Shankar", "Geeta Phogat",
  "Ashok Kumar", "Sushma Swaraj", "Prakash Raj", "Lata Mangeshkar", "Vijay Mallya",
  "Ramesh Babu", "Radha Krishna", "Santosh Yadav", "Manju Warrier", "Dinesh Karthik",
  "Kamal Haasan", "Vidya Balan", "Hariharan", "Kishore Kumar", "Asha Bhosle",
  "Siddharth Malhotra", "Alia Bhatt", "Varun Dhawan", "Kareena Kapoor", "Ranbir Kapoor"
];

const REVIEW_TEMPLATES = [
  "Very divine experience. The pandit ji explained every step perfectly.",
  "Highly recommended. My long-standing financial issues are slowly resolving after this.",
  "The streaming quality was excellent. Felt like I was sitting right inside the temple.",
  "Very professional service. The prasad reached my home in Bangalore within 3 days.",
  "Our whole family watched the sankalp. It brought us immense peace of mind.",
  "I was skeptical about online pujas, but Vandanam changed my mind completely.",
  "The chanting of mantras was so powerful. Genuine and authentic experience.",
  "Booking was seamless. Got regular updates on WhatsApp.",
  "The best spiritual platform. I have booked 3 pujas so far.",
  "They arranged everything perfectly. I didn't have to worry about a thing.",
  "The Pandit ji was very knowledgeable and answered all our questions.",
  "A truly spiritual journey. The positive energy in my house has increased.",
  "I booked this for my parents' anniversary. They loved it!",
  "The customer support team was very helpful in selecting the right package.",
  "Authentic rituals, zero compromises. Highly satisfied.",
  "The video recording provided later was a very nice touch.",
  "My business was facing continuous losses. This puja brought a huge turnaround.",
  "I was struggling with health issues. Feeling much better now.",
  "The prasad packaging was very secure and pure.",
  "Will definitely book again for Diwali."
];

function getRandomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Fisher-Yates shuffle
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function run() {
  console.log("Seeding realistic, non-repeating reviews...");

  // 1. Delete all existing reviews to start fresh
  console.log("Deleting old reviews...");
  const { error: delError } = await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) {
    console.error("Error deleting old reviews:", delError.message);
    return;
  }

  // 2. Fetch all pujas
  const { data: pujas, error: pujasError } = await supabase.from('pujas').select('id');
  if (pujasError) {
    console.error("Failed to fetch pujas:", pujasError.message);
    return;
  }

  // 3. Generate unique reviews for each puja
  const newReviews = [];
  
  for (const puja of pujas) {
    // Determine a random number of reviews for this puja (e.g., 3 to 7)
    const numReviews = Math.floor(Math.random() * 5) + 3;
    
    // Shuffle names and templates for this puja to ensure uniqueness
    const shuffledNames = shuffleArray([...INDIAN_NAMES]);
    const shuffledTemplates = shuffleArray([...REVIEW_TEMPLATES]);

    for (let i = 0; i < numReviews; i++) {
      // Pick a random date within the last 6 months
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 180));

      // Bias ratings towards 4 and 5
      const rating = Math.random() > 0.1 ? 5 : 4; 

      newReviews.push({
        puja_id: puja.id,
        user_name: shuffledNames[i],
        rating: rating,
        comment: shuffledTemplates[i],
        created_at: date.toISOString()
      });
    }
  }

  console.log(`Inserting ${newReviews.length} new reviews...`);
  
  const { error: insertError } = await supabase.from('reviews').insert(newReviews);
  
  if (insertError) {
    console.error("Failed to insert reviews:", insertError.message);
  } else {
    console.log("Successfully seeded completely unique reviews!");
  }
}

run();
