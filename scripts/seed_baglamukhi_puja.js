const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log("Upserting Maa Baglamukhi Mandir, Nalkheda...");

  const templeData = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Maa Baglamukhi Mandir, Nalkheda',
    location: 'Nalkheda, Agar Malwa (near Ujjain), MP',
    deity: 'Maa Baglamukhi (Pitambara)',
    description: 'Located on the sacred banks of the Lakhundar River in Nalkheda, this ancient Shakti Peeth is renowned across India for paralyzing enemy conspiracies, clearing court cases, and destroying black magic.',
    image_url: 'https://images.unsplash.com/photo-1593361036080-60b642ec67fc?q=80&w=1000&auto=format&fit=crop',
    history: 'As mentioned in the Kalika Purana, the sacred idol dates back to the Dvapara Yuga. During their exile, the Pandavas were instructed by Lord Krishna to worship Maa Baglamukhi here to secure total victory in the Mahabharata war.',
    architecture: 'The temple houses three consecrated deities (Pindis): Maa Baglamukhi in the center, Goddess Mahalakshmi on the right, and Goddess Saraswati on the left. The sanctum features an eternal Akhand Dhuni that has been burning for centuries.',
    timings: { open: "05:00", close: "22:00" },
    how_to_reach: 'Air: Devi Ahilyabai Holkar Airport, Indore (approx. 140 km).\nRail: Ujjain Junction Railway Station (approx. 100 km) or Kota Junction.\nRoad: Well connected by road from Ujjain, Indore, and Bhopal.'
  };

  const { data: temple, error: templeErr } = await supabase
    .from('temples')
    .upsert(templeData)
    .select();

  if (templeErr) {
    console.error("Temple upsert error:", templeErr);
  } else {
    console.log("Temple inserted/updated successfully:", temple);
  }

  const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const pujaData = {
    id: 'f0e1d2c3-b4a5-6789-0123-456789abcdef',
    temple_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: 'Maa Baglamukhi Mirchi Havan & Puja',
    category: 'Protection',
    problem_statement: 'Struggling with court cases, legal disputes, malicious enemies, evil eye (Kaali Nazar), or unexplainable financial/career blocks?',
    base_price: 1001,
    sale_price: 501,
    benefits: [
      'Shatru Mukti: Paralyzes hostility, ill-intent, and hidden competitors',
      'Relief From False Allegations: Silences slander, gossip, and vicious defamation',
      'Triumph in Legal Battles: Grants decisive victory in court hearings and property disputes',
      'Tantra & Evil Eye Shield: Neutralizes black magic, negative energies, and fear',
      'Career & Business Breakthrough: Restores fearlessness, authority, and confidence'
    ],
    whats_included: [
      'Personalized Sankalp with Devotee Name & Gotra',
      'Recorded Video Proof of Havan with Sankalp Chanting',
      'Abhimantrit Baglamukhi Raksha Sutra & Peetambar Prasad'
    ],
    ritual_process: [
      'Vedic Pandits initiate Name & Gotra Sankalp',
      'Baglamukhi Mool Mantra & Stotram Jaap',
      'Fiery Mirchi & Peetambar Samidha Havan',
      'Maha Aarti & Consecration of Protection Thread'
    ],
    faqs: [
      {
        question: "What is the significance of Mirchi Havan?",
        answer: "The Red Chilli (Mirchi) Havan dedicated to Maa Baglamukhi is a specialized Vedic-Tantric ritual known for its swift and decisive effect in paralyzing enemy aggression, resolving legal disputes, and destroying negative energies."
      },
      {
        question: "Do I need to be physically present at the temple?",
        answer: "No. The temple priests perform the personalized Sankalp taking your full name and Gotra on your behalf. A personalized video recording of the ritual and Sankalp will be shared with you."
      },
      {
        question: "When will I receive the video of the Puja?",
        answer: "You will receive the video proof along with your name/gotra sankalp darshan on WhatsApp and your profile within 3-4 days after the puja completion."
      }
    ],
    image_url: 'https://images.unsplash.com/photo-1593361036080-60b642ec67fc?q=80&w=1000&auto=format&fit=crop',
    booking_deadline: deadline,
    packages: [
      {
        id: '11111111-aaaa-bbbb-cccc-000000000001',
        name: 'अकेले के लिए (Single Devotee)',
        members_text: 'For 1 Member',
        max_members: 1,
        base_price: 1001,
        sale_price: 501
      },
      {
        id: '11111111-aaaa-bbbb-cccc-000000000002',
        name: 'दंपति के लिए (Couple Sankalp)',
        members_text: 'For 2 Members',
        max_members: 2,
        base_price: 1801,
        sale_price: 851
      },
      {
        id: '11111111-aaaa-bbbb-cccc-000000000003',
        name: 'परिवार के लिए (Family Sankalp)',
        members_text: 'For 6 Members',
        max_members: 6,
        base_price: 3001,
        sale_price: 1501
      },
      {
        id: '11111111-aaaa-bbbb-cccc-000000000004',
        name: 'विशेष शत्रु विजय महा हवन (VIP Puja)',
        members_text: 'For Upto 8 Members',
        max_members: 8,
        base_price: 11001,
        sale_price: 5101
      }
    ]
  };

  console.log("Upserting Maa Baglamukhi Mirchi Havan & Puja...");
  const { data: puja, error: pujaErr } = await supabase
    .from('pujas')
    .upsert(pujaData)
    .select();

  if (pujaErr) {
    console.error("Puja upsert error:", pujaErr);
  } else {
    console.log("Puja inserted/updated successfully:", puja);
  }
}

run();
