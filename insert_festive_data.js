const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0 && !key.startsWith('#')) {
    env[key.trim()] = values.join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function insertData() {
  const festivals = {
    rathYatra: 'e9887742-4ba0-405e-a412-915ecfd04b08',
    janmashtami: '2ef7aff1-9621-49e0-ad95-915185039403',
    guruPurnima: '155704e2-b977-4011-aa48-a0bc5176c383'
  };

  const temples = {
    tirupati: '33333333-3333-3333-3333-333333333333',
    kashi: '11111111-1111-1111-1111-111111111111',
    mahakaleshwar: '55555555-5555-5555-5555-555555555555'
  };

  const pujas = [
    // RATH YATRA
    {
      temple_id: temples.tirupati,
      title: 'Special Rath Yatra Sankalp Puja',
      category: 'Festival',
      problem_statement: 'Receive blessings of Lord Jagannath on the auspicious day of Rath Yatra.',
      base_price: 1500, sale_price: 1100,
      festival_id: festivals.rathYatra,
      benefits: ['Blessings of Lord Jagannath', 'Spiritual Upliftment']
    },
    {
      temple_id: temples.tirupati,
      title: 'Jagannath Darshan & Aarti',
      category: 'Festival',
      problem_statement: 'Participate virtually in the divine Aarti during the Rath Yatra festival.',
      base_price: 1200, sale_price: 800,
      festival_id: festivals.rathYatra,
      benefits: ['Divine Grace', 'Peace of Mind']
    },
    {
      temple_id: temples.tirupati,
      title: 'Balabhadra & Subhadra Puja',
      category: 'Festival',
      problem_statement: 'Seek blessings of Lord Balabhadra and Devi Subhadra for family harmony.',
      base_price: 2000, sale_price: 1500,
      festival_id: festivals.rathYatra,
      benefits: ['Family Unity', 'Protection']
    },
    
    // JANMASHTAMI
    {
      temple_id: temples.kashi,
      title: 'Midnight Krishna Janmotsav Puja',
      category: 'Festival',
      problem_statement: 'Celebrate the exact moment of Lord Krishna\'s birth with a grand midnight puja.',
      base_price: 2500, sale_price: 2100,
      festival_id: festivals.janmashtami,
      benefits: ['Fulfillment of Desires', 'Divine Protection']
    },
    {
      temple_id: temples.tirupati,
      title: 'Makhan Mishri Bhog & Aarti',
      category: 'Festival',
      problem_statement: 'Offer Lord Krishna\'s favorite Makhan Mishri and seek his playful blessings.',
      base_price: 900, sale_price: 500,
      festival_id: festivals.janmashtami,
      benefits: ['Joy & Happiness', 'Removal of Obstacles']
    },
    {
      temple_id: temples.mahakaleshwar,
      title: 'Santan Gopal Mantra Jaap',
      category: 'Festival',
      problem_statement: 'A powerful puja performed on Janmashtami for couples seeking the blessing of a child.',
      base_price: 3500, sale_price: 3100,
      festival_id: festivals.janmashtami,
      benefits: ['Blessing of a Child', 'Healthy Pregnancy']
    },

    // GURU PURNIMA
    {
      temple_id: temples.kashi,
      title: 'Vyas Puja & Guru Archana',
      category: 'Festival',
      problem_statement: 'Honor the divine gurus and seek guidance and wisdom on Guru Purnima.',
      base_price: 1100, sale_price: 750,
      festival_id: festivals.guruPurnima,
      benefits: ['Wisdom', 'Spiritual Guidance']
    },
    {
      temple_id: temples.mahakaleshwar,
      title: 'Dakshinamurthy Puja for Knowledge',
      category: 'Festival',
      problem_statement: 'Worship Lord Shiva in his Guru aspect (Dakshinamurthy) for academic excellence.',
      base_price: 1800, sale_price: 1200,
      festival_id: festivals.guruPurnima,
      benefits: ['Success in Education', 'Clarity of Mind']
    },
    {
      temple_id: temples.tirupati,
      title: 'Special Navgraha Shanti Puja',
      category: 'Festival',
      problem_statement: 'Pacify planetary doshas with the blessings of the Guru on this auspicious day.',
      base_price: 3200, sale_price: 2500,
      festival_id: festivals.guruPurnima,
      benefits: ['Removal of Doshas', 'Career Growth']
    }
  ];

  const chadhavas = [
    // RATH YATRA
    { temple_id: temples.tirupati, title: 'Chappan Bhog Offering', description: 'Offer 56 varieties of food to Lord Jagannath.', price: 501, festival_id: festivals.rathYatra },
    { temple_id: temples.tirupati, title: 'Tulsi Mala Offering', description: 'Offer a sacred garland of Tulsi leaves.', price: 151, festival_id: festivals.rathYatra },
    { temple_id: temples.tirupati, title: 'Pata Vastra (Silk Cloth)', description: 'Offer beautiful silk clothing to the deities.', price: 1100, festival_id: festivals.rathYatra },
    { temple_id: temples.tirupati, title: 'Deep Daan', description: 'Light a lamp for spiritual illumination during Rath Yatra.', price: 101, festival_id: festivals.rathYatra },
    { temple_id: temples.tirupati, title: 'Pushpanjali', description: 'Offer a grand floral tribute to Lord Jagannath\'s chariot.', price: 251, festival_id: festivals.rathYatra },

    // JANMASHTAMI
    { temple_id: temples.kashi, title: 'Makhan Mishri Handi', description: 'Offer a pot of fresh butter and rock sugar.', price: 201, festival_id: festivals.janmashtami },
    { temple_id: temples.kashi, title: 'Flute (Bansuri) Offering', description: 'Offer a beautiful silver-plated flute to Lord Krishna.', price: 551, festival_id: festivals.janmashtami },
    { temple_id: temples.kashi, title: 'Mor Pankh (Peacock Feather)', description: 'Offer sacred peacock feathers to adorn the deity.', price: 101, festival_id: festivals.janmashtami },
    { temple_id: temples.kashi, title: 'Yellow Silk Vastra', description: 'Offer traditional yellow silk clothing to Kanha.', price: 1500, festival_id: festivals.janmashtami },
    { temple_id: temples.kashi, title: 'Special Janmashtami Panjiri', description: 'Offer the traditional coriander panjiri prasad.', price: 151, festival_id: festivals.janmashtami },

    // GURU PURNIMA
    { temple_id: temples.mahakaleshwar, title: 'Guru Paduka Pujan', description: 'Offer worship to the divine sandals of the Guru.', price: 301, festival_id: festivals.guruPurnima },
    { temple_id: temples.mahakaleshwar, title: 'Yellow Flowers (Pushp)', description: 'Offer a garland of fresh yellow flowers, symbolizing wisdom.', price: 101, festival_id: festivals.guruPurnima },
    { temple_id: temples.mahakaleshwar, title: 'Gita Text Offering', description: 'Donate a copy of the Bhagavad Gita on your behalf.', price: 251, festival_id: festivals.guruPurnima },
    { temple_id: temples.mahakaleshwar, title: 'Fruits & Sweets Bhog', description: 'Offer a basket of seasonal fruits and sweets.', price: 351, festival_id: festivals.guruPurnima },
    { temple_id: temples.mahakaleshwar, title: 'Deep Daan for Enlightenment', description: 'Light a special lamp to seek the light of knowledge.', price: 101, festival_id: festivals.guruPurnima },
  ];

  const { error: pError } = await supabase.from('pujas').insert(pujas);
  if (pError) console.error("Puja insert error:", pError);
  else console.log("Pujas inserted successfully!");

  const { error: cError } = await supabase.from('chadhava_items').insert(chadhavas);
  if (cError) console.error("Chadhava insert error:", cError);
  else console.log("Chadhavas inserted successfully!");
}

insertData();
