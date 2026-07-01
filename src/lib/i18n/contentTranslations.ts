export const TEMPLE_TRANSLATIONS: Record<string, any> = {
  'Mahalakshmi Temple': {
    hi: {
      name: "महालक्ष्मी मंदिर",
      location: "कोल्हापुर, महाराष्ट्र",
      description: "महालक्ष्मी मंदिर (अंबाबाई मंदिर) एक महत्वपूर्ण शक्तिपीठ है।",
      history: "7वीं शताब्दी में चालुक्य साम्राज्य द्वारा निर्मित, यह 108 शक्ति पीठों में से एक है।",
      architecture: "यह मंदिर शानदार हेमाडपंथी वास्तुकला शैली को दर्शाता है।",
      how_to_reach: "हवाई मार्ग: निकटतम हवाई अड्डा कोल्हापुर है।\nट्रेन: कोल्हापुर रेलवे स्टेशन 5 किमी दूर है।"
    },
    mr: {
      name: "महालक्ष्मी मंदिर (अंबाबाई)",
      location: "कोल्हापूर, महाराष्ट्र",
      description: "महालक्ष्मी (अंबाबाई) मंदिर हे महाराष्ट्रातील साडेतीन शक्तीपीठांपैकी एक आहे.",
      history: "सातव्या शतकात चालुक्य राजांनी हे मंदिर बांधले.",
      architecture: "हे मंदिर काळ्या पाषाणात बांधलेले असून यात उत्कृष्ट हेमाडपंती वास्तुकला दिसते.",
      how_to_reach: "विमान: कोल्हापूर विमानतळ (९ किमी).\nरेल्वे: कोल्हापूर रेल्वे स्टेशन (५ किमी)."
    },
    bn: {
      name: "মহালক্ষ্মী মন্দির",
      location: "কোলহাপুর, মহারাষ্ট্র",
      description: "মহালক্ষ্মী মন্দির একটি বিখ্যাত হিন্দু মন্দির।",
      history: "৭ম শতাব্দীতে চালুক্য সাম্রাজ্যের দ্বারা নির্মিত।",
      architecture: "মন্দিরটি চমৎকার হেমাদপনথী স্থাপত্য শৈলী প্রদর্শন করে।",
      how_to_reach: "বিমান: নিকটতম বিমানবন্দর কোলহাপুর।"
    }
  },
  'Trimbakeshwar': {
    hi: {
      name: "त्र्यंबकेश्वर ज्योतिर्लिंग",
      location: "नासिक, महाराष्ट्र",
      description: "त्र्यंबकेश्वर 12 ज्योतिर्लिंगों में से एक है।",
      history: "18वीं शताब्दी के मध्य में पेशवा बाजीराव द्वारा निर्मित।",
      architecture: "यह पूरी तरह से काले पत्थर से क्लासिक नागर शैली में बनाया गया है।",
      how_to_reach: "हवाई मार्ग: ओझर हवाई अड्डा (नासिक)।"
    },
    mr: {
      name: "त्र्यंबकेश्वर ज्योतिर्लिंग",
      location: "नाशिक, महाराष्ट्र",
      description: "त्र्यंबकेश्वर हे बारा ज्योतिर्लिंगांपैकी एक आहे.",
      history: "१८ व्या शतकाच्या मध्यात पेशवा नानासाहेब यांनी हे मंदिर बांधले.",
      architecture: "संपूर्ण काळ्या पाषाणात बांधलेले हे मंदिर उत्कृष्ट वास्तुकलेचा नमुना आहे.",
      how_to_reach: "विमान: ओझर विमानतळ."
    }
  },
  'Mangalnath Temple': {
    hi: {
      name: "मंगलनाथ मंदिर",
      location: "उज्जैन, मध्य प्रदेश",
      description: "मंगलनाथ मंदिर को मंगल ग्रह का जन्मस्थान माना जाता है।"
    }
  }
};

export const PUJA_TRANSLATIONS: Record<string, any> = {
  'Suktam Havan': {
    hi: {
      title: "श्री सूक्त हवन",
      problem_statement: "क्या आप वित्तीय अस्थिरता या कर्ज से जूझ रहे हैं?",
    },
    mr: {
      title: "श्री सूक्त हवन",
      problem_statement: "तुम्ही आर्थिक अस्थिरता किंवा कर्जाचा सामना करत आहात का?",
    }
  },
  'Bhaat Puja': {
    hi: {
      title: "भात पूजा",
      problem_statement: "मांगलिक दोष या विवाह में देरी?",
    },
    mr: {
      title: "भात पूजा",
      problem_statement: "मांगलिक दोष किंवा विवाहात विलंब?",
    }
  },
  'Narayan Nagbali': {
    hi: {
      title: "नारायण नागबली",
      problem_statement: "पितृ दोष, अप्रत्याशित बाधाएं, या स्वास्थ्य समस्याएं?",
    },
    mr: {
      title: "नारायण नागबळी",
      problem_statement: "पितृ दोष, अचानक येणाऱ्या अडचणी किंवा आरोग्य समस्या?",
    }
  }
};

// Fallback logic for any title not explicitly translated
export function getTranslatedTitle(title: string, lang: string, type: 'temple' | 'puja'): string | null {
  if (!title) return null;
  const translations = type === 'temple' ? TEMPLE_TRANSLATIONS : PUJA_TRANSLATIONS;
  
  // Find by partial match
  const matchKey = Object.keys(translations).find(key => title.includes(key));
  if (matchKey && translations[matchKey][lang]) {
    return translations[matchKey][lang].name || translations[matchKey][lang].title;
  }
  
  // If not found in specific language, try Hindi as fallback for regional languages
  if (matchKey && translations[matchKey]['hi']) {
    return translations[matchKey]['hi'].name || translations[matchKey]['hi'].title;
  }
  
  return null;
}

export function getTranslatedField(title: string, field: string, lang: string, type: 'temple' | 'puja'): string | null {
  if (!title) return null;
  const translations = type === 'temple' ? TEMPLE_TRANSLATIONS : PUJA_TRANSLATIONS;
  
  const matchKey = Object.keys(translations).find(key => title.includes(key));
  if (matchKey && translations[matchKey][lang] && translations[matchKey][lang][field]) {
    return translations[matchKey][lang][field];
  }
  
  if (matchKey && translations[matchKey]['hi'] && translations[matchKey]['hi'][field]) {
    return translations[matchKey]['hi'][field];
  }
  
  return null;
}
