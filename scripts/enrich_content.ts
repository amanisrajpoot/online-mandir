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

const TEMPLE_ENRICHMENT_DATA: Record<string, any> = {
  'Mahalakshmi Temple': {
    history: "Built in the 7th century by the Chalukya empire, this temple is one of the 108 Shakti Peethas where Sati's right hand is believed to have fallen. The temple gained immense prominence during the Silahara and Yadava dynasties.",
    architecture: "The temple showcases magnificent Hemadpanthi architectural style. The main structure is carved out of black stone, featuring an intricately carved Shikara and a mandapam adorned with exquisite sculptures of deities, dancers, and musicians.",
    how_to_reach: "By Air: Nearest airport is Kolhapur (CSMIA) (9 km).\nBy Train: Kolhapur Railway Station (CSMT) is just 5 km away.\nBy Road: Well connected by state transport buses from Pune and Mumbai.",
    translations: {
      hi: {
        name: "महालक्ष्मी मंदिर",
        location: "कोल्हापुर, महाराष्ट्र",
        description: "महालक्ष्मी मंदिर एक प्रमुख हिंदू मंदिर है जो देवी महालक्ष्मी को समर्पित है।",
        history: "7वीं शताब्दी में चालुक्य साम्राज्य द्वारा निर्मित, यह 108 शक्ति पीठों में से एक है।",
        architecture: "यह मंदिर शानदार हेमाडपंथी वास्तुकला शैली को दर्शाता है।",
        how_to_reach: "हवाई मार्ग: निकटतम हवाई अड्डा कोल्हापुर है।\nट्रेन: कोल्हापुर रेलवे स्टेशन केवल 5 किमी दूर है।"
      },
      mr: {
        name: "महालक्ष्मी मंदिर (अंबाबाई)",
        location: "कोल्हापूर, महाराष्ट्र",
        description: "महालक्ष्मी (अंबाबाई) मंदिर हे महाराष्ट्रातील साडेतीन शक्तीपीठांपैकी एक महत्त्वाचे तीर्थक्षेत्र आहे.",
        history: "सातव्या शतकात चालुक्य राजांनी हे मंदिर बांधले. हे १०८ शक्तीपीठांपैकी एक आहे.",
        architecture: "हे मंदिर काळ्या पाषाणात बांधलेले असून यात उत्कृष्ट हेमाडपंती वास्तुकला दिसते.",
        how_to_reach: "विमान: कोल्हापूर विमानतळ (९ किमी).\nरेल्वे: कोल्हापूर रेल्वे स्टेशन (५ किमी)."
      },
      bn: {
        name: "মহালক্ষ্মী মন্দির",
        location: "কোলহাপুর, মহারাষ্ট্র",
        description: "মহালক্ষ্মী মন্দির হল দেবী মহালক্ষ্মীর উদ্দেশ্যে নিবেদিত একটি বিখ্যাত হিন্দু মন্দির।",
        history: "৭ম শতাব্দীতে চালুক্য সাম্রাজ্যের দ্বারা নির্মিত, এটি ১০৮ শক্তিপীঠের একটি।",
        architecture: "মন্দিরটি চমৎকার হেমাদপনথী স্থাপত্য শৈলী প্রদর্শন করে।",
        how_to_reach: "বিমান: নিকটতম বিমানবন্দর কোলহাপুর।\nট্রেন: কোলহাপুর রেলওয়ে স্টেশন মাত্র ৫ কিমি দূরে।"
      }
    }
  },
  'Trimbakeshwar': {
    history: "Constructed by Peshwa Balaji Baji Rao in the mid-18th century on the site of an older temple. It is one of the 12 Jyotirlingas and the source of the sacred Godavari river.",
    architecture: "Built entirely of black stone in the classic Nagara style of architecture, the temple is enclosed in a spacious courtyard. The crowning glory is a golden kalash and a majestic flag.",
    how_to_reach: "By Air: Ozar Airport (Nashik) (30 km).\nBy Train: Nashik Road Railway Station is 39 km away.\nBy Road: Frequent buses available from Nashik.",
    translations: {
      hi: {
        name: "त्र्यंबकेश्वर शिव मंदिर",
        location: "नासिक, महाराष्ट्र",
        description: "त्र्यंबकेश्वर 12 ज्योतिर्लिंगों में से एक है और गोदावरी नदी का उद्गम स्थल है।",
        history: "18वीं शताब्दी के मध्य में पेशवा बाजीराव द्वारा निर्मित।",
        architecture: "यह पूरी तरह से काले पत्थर से क्लासिक नागर शैली में बनाया गया है।",
        how_to_reach: "हवाई मार्ग: ओझर हवाई अड्डा (नासिक)।\nट्रेन: नासिक रोड रेलवे स्टेशन 39 किमी दूर है।"
      },
      mr: {
        name: "त्र्यंबकेश्वर ज्योतिर्लिंग",
        location: "नाशिक, महाराष्ट्र",
        description: "त्र्यंबकेश्वर हे भारतातील बारा ज्योतिर्लिंगांपैकी एक आहे आणि गोदावरी नदीचे उगमस्थान आहे.",
        history: "१८ व्या शतकाच्या मध्यात पेशवा नानासाहेब यांनी हे मंदिर बांधले.",
        architecture: "संपूर्ण काळ्या पाषाणात बांधलेले हे मंदिर उत्कृष्ट वास्तुकलेचा नमुना आहे.",
        how_to_reach: "विमान: ओझर विमानतळ.\nरेल्वे: नाशिक रोड रेल्वे स्टेशन ३९ किमी अंतरावर आहे."
      }
    }
  }
};

const PUJA_ENRICHMENT_DATA: Record<string, any> = {
  'Suktam Havan': {
    translations: {
      hi: {
        title: "श्री सूक्त हवन",
        problem_statement: "क्या आप वित्तीय अस्थिरता या कर्ज से जूझ रहे हैं?",
        benefits: ["वित्तीय बाधाओं को दूर करना", "व्यापार में वृद्धि", "शांति और समृद्धि"],
        whats_included: ["पंडित जी द्वारा संकल्प", "हवन सामग्री", "ऑनलाइन दर्शन"]
      },
      mr: {
        title: "श्री सूक्त हवन",
        problem_statement: "तुम्ही आर्थिक अस्थिरता किंवा कर्जाचा सामना करत आहात का?",
        benefits: ["आर्थिक अडथळे दूर करणे", "व्यवसायात वाढ", "शांती आणि समृद्धी"],
        whats_included: ["पंडितजींद्वारे संकल्प", "हवन सामग्री", "ऑनलाइन दर्शन"]
      }
    }
  },
  'Narayan Nagbali': {
    translations: {
      hi: {
        title: "नारायण नागबली",
        problem_statement: "पितृ दोष, अप्रत्याशित बाधाएं, या स्वास्थ्य समस्याएं?",
        benefits: ["पितृ दोष से मुक्ति", "करियर में सफलता", "स्वास्थ्य में सुधार"],
        whats_included: ["तीन दिवसीय अनुष्ठान", "आवास", "सभी सामग्री"]
      },
      mr: {
        title: "नारायण नागबळी",
        problem_statement: "पितृ दोष, अचानक येणाऱ्या अडचणी किंवा आरोग्य समस्या?",
        benefits: ["पितृ दोषातून मुक्ती", "करिअरमध्ये यश", "आरोग्यात सुधारणा"],
        whats_included: ["तीन दिवसांचा विधी", "राहण्याची व्यवस्था", "सर्व पूजा साहित्य"]
      }
    }
  }
};

async function run() {
  console.log("Enriching Temple and Puja Data with Multilingual Content...");

  // Update Temples
  for (const [templeName, data] of Object.entries(TEMPLE_ENRICHMENT_DATA)) {
    const { error } = await supabase
      .from('temples')
      .update({
        history: data.history,
        architecture: data.architecture,
        how_to_reach: data.how_to_reach,
        translations: data.translations
      })
      .eq('name', templeName);

    if (error) {
      console.error(`Error updating temple ${templeName}:`, error.message);
    } else {
      console.log(`Successfully enriched ${templeName}`);
    }
  }

  // Update Pujas
  for (const [pujaKeyword, data] of Object.entries(PUJA_ENRICHMENT_DATA)) {
    const { error } = await supabase
      .from('pujas')
      .update({
        translations: data.translations
      })
      .ilike('title', `%${pujaKeyword}%`);

    if (error) {
      console.error(`Error updating puja ${pujaKeyword}:`, error.message);
    } else {
      console.log(`Successfully enriched ${pujaKeyword}`);
    }
  }

  console.log("Content enrichment complete!");
}

run();
