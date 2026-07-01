"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTranslatedTitle, getTranslatedField } from './contentTranslations';

// Common Indian languages mapped to state names
const STATE_LANGUAGE_MAP: Record<string, string> = {
  'Maharashtra': 'mr',
  'West Bengal': 'bn',
  'Gujarat': 'gu',
  'Karnataka': 'kn',
  'Tamil Nadu': 'ta',
  'Andhra Pradesh': 'te',
  'Telangana': 'te',
  'Odisha': 'or',
  'Kerala': 'ml',
  'Punjab': 'pa',
};

// Language display names
export const LANGUAGES: Record<string, { name: string, native: string }> = {
  'hi': { name: 'Hindi', native: 'हिन्दी' },
  'mr': { name: 'Marathi', native: 'मराठी' },
  'bn': { name: 'Bengali', native: 'বাংলা' },
  'gu': { name: 'Gujarati', native: 'ગુજરાતી' },
  'kn': { name: 'Kannada', native: 'ಕನ್ನಡ' },
  'ta': { name: 'Tamil', native: 'தமிழ்' },
  'te': { name: 'Telugu', native: 'తెలుగు' },
  'or': { name: 'Odia', native: 'ଓଡ଼ିଆ' },
  'ml': { name: 'Malayalam', native: 'മലയാളം' },
  'pa': { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
};

const STORAGE_KEY = 'vandanam-language';
const MANUAL_CHOICE_KEY = 'vandanam-language-manual';

// Static UI dictionary for common phrases (Fallback mechanism)
const UI_DICTIONARY: Record<string, Record<string, string>> = {
  'hi': {
    'Benefits': 'लाभ',
    'How it works': 'यह कैसे काम करता है',
    'Select Package': 'पैकेज चुनें',
    'Devotee Experiences': 'भक्त अनुभव',
    'About the Temple': 'मंदिर के बारे में',
    'Book Now': 'बुक करें',
    'Search': 'खोजें',
    'History': 'इतिहास',
    'Architecture': 'वास्तुकला',
    'Travel': 'कैसे पहुंचें',
    'Verified Booking': 'सत्यापित बुकिंग',
    "Today's Panchang": 'आज का पंचांग',
    'Tithi': 'तिथि',
    'Nakshatra': 'नक्षत्र',
    'Yoga': 'योग',
    'Karana': 'करण',
    'Trending Pujas': 'प्रमुख पूजा',
    'Maha Shivratri': 'महा शिवरात्रि',
    'Book your Rudrabhishek now': 'अपना रुद्राभिषेक अभी बुक करें',
    'View All': 'सभी देखें',
    "Book authentic pujas performed by verified pandits at India's most sacred temples.": 'भारत के सबसे पवित्र मंदिरों में सत्यापित पंडितों द्वारा प्रमाणित पूजा बुक करें।',
    'Offer Chadhava': 'चढ़ावा चढ़ाएं',
    'Offer sacred items to the deity from the comfort of your home.': 'अपने घर के आराम से देवता को पवित्र वस्तुएं चढ़ाएं।',
    'Offer': 'चढ़ाएं',
    'No offerings found': 'कोई चढ़ावा नहीं मिला',
    'Try a different search term': 'कोई दूसरा शब्द खोजें',
    'Is this Puja for you?': 'क्या यह पूजा आपके लिए है?',
    "What's Included": 'इसमें क्या शामिल है',
    'Sankalp Details': 'संकल्प विवरण',
    'Prasad Delivery': 'प्रसाद डिलीवरी',
    'Review & Pay': 'समीक्षा और भुगतान',
    'Complete Your Booking': 'अपनी बुकिंग पूरी करें',
    'Available Pujas': 'उपलब्ध पूजाएं',
    'Sun Details': 'सूर्य विवरण',
    'Sunrise': 'सूर्योदय',
    'Sunset': 'सूर्यास्त',
    'Moon Details': 'चंद्र विवरण',
    'Moonrise': 'चंद्रोदय',
    'Moonset': 'चंद्रास्त',
  },
  'mr': {
    'Benefits': 'फायदे',
    'How it works': 'हे कसे काम करते',
    'Select Package': 'पॅकेज निवडा',
    'Devotee Experiences': 'भक्त अनुभव',
    'About the Temple': 'मंदिराविषयी',
    'Book Now': 'बुक करा',
    'Search': 'शोधा',
    'History': 'इतिहास',
    'Architecture': 'वास्तुकला',
    'Travel': 'कसे पोहोचावे',
    'Verified Booking': 'सत्यापित बुकिंग',
    "Today's Panchang": 'आजचे पंचांग',
    'Tithi': 'तिथी',
    'Nakshatra': 'नक्षत्र',
    'Yoga': 'योग',
    'Karana': 'करण',
    'Trending Pujas': 'प्रमुख पूजा',
    'Maha Shivratri': 'महा शिवरात्री',
    'Book your Rudrabhishek now': 'तुमचा रुद्राभिषेक आता बुक करा',
    'View All': 'सर्व पहा',
    "Book authentic pujas performed by verified pandits at India's most sacred temples.": 'भारतातील सर्वात पवित्र मंदिरांमध्ये प्रमाणित पंडितांद्वारे पूजा बुक करा.',
    'Offer Chadhava': 'चढावा अर्पण करा',
    'Offer sacred items to the deity from the comfort of your home.': 'तुमच्या घरच्या आरामात देवाला पवित्र वस्तू अर्पण करा.',
    'Offer': 'अर्पण करा',
    'No offerings found': 'कोणतेही चढावा सापडले नाही',
    'Try a different search term': 'वेगळा शब्द शोधा',
    'Is this Puja for you?': 'ही पूजा तुमच्यासाठी आहे का?',
    "What's Included": 'यात काय समाविष्ट आहे',
    'Sankalp Details': 'संकल्प तपशील',
    'Prasad Delivery': 'प्रसाद वितरण',
    'Review & Pay': 'पुनरावलोकन आणि पैसे भरा',
    'Complete Your Booking': 'तुमचे बुकिंग पूर्ण करा',
    'Available Pujas': 'उपलब्ध पूजा',
  },
  'bn': {
    'Benefits': 'উপকারিতা',
    'How it works': 'এটি কিভাবে কাজ করে',
    'Select Package': 'প্যাকেজ নির্বাচন করুন',
    'Devotee Experiences': 'ভক্তদের অভিজ্ঞতা',
    'About the Temple': 'মন্দির সম্পর্কে',
    'Book Now': 'বুক করুন',
    'Search': 'অনুসন্ধান',
    'History': 'ইতিহাস',
    'Architecture': 'স্থাপত্য',
    'Travel': 'কিভাবে যাবেন',
    'Verified Booking': 'যাচাইকৃত বুকিং',
    "Today's Panchang": 'আজকের পঞ্চাঙ্গ',
    'Tithi': 'তিথি',
    'Nakshatra': 'নক্ষত্র',
    'Yoga': 'যোগ',
    'Karana': 'করণ',
    'Trending Pujas': 'জনপ্রিয় পূজা',
    'Maha Shivratri': 'মহা শিবরাত্রি',
    'Book your Rudrabhishek now': 'আপনার রুদ্রাভিষেক এখনই বুক করুন',
    'View All': 'সব দেখুন',
    "Book authentic pujas performed by verified pandits at India's most sacred temples.": 'ভারতের সবচেয়ে পবিত্র মন্দিরগুলোতে যাচাইকৃত পুরোহিতদের দ্বারা পূজা বুক করুন।',
    'Offer Chadhava': 'চড়াওয়া অর্পণ করুন',
    'Offer sacred items to the deity from the comfort of your home.': 'আপনার ঘরে বসেই দেবতাকে পবিত্র জিনিস অর্পণ করুন।',
    'Offer': 'অর্পণ করুন',
    'No offerings found': 'কোনো অফার পাওয়া যায়নি',
    'Try a different search term': 'একটি ভিন্ন অনুসন্ধান শব্দ চেষ্টা করুন',
    'Is this Puja for you?': 'এই পূজা কি আপনার জন্য?',
    "What's Included": 'কি কি অন্তর্ভুক্ত',
    'Sankalp Details': 'সংকল্প বিবরণ',
    'Prasad Delivery': 'প্রসাদ ডেলিভারি',
    'Review & Pay': 'পর্যালোচনা ও অর্থপ্রদান',
    'Complete Your Booking': 'আপনার বুকিং সম্পূর্ণ করুন',
    'Available Pujas': 'উপলব্ধ পূজা',
  },
  
  'gu': {
    'Benefits': 'ફાયદા',
    'How it works': 'તે કેવી રીતે કામ કરે છે',
    'Select Package': 'પેકેજ પસંદ કરો',
    'Devotee Experiences': 'ભક્ત અનુભવો',
    'About the Temple': 'મંદિર વિશે',
    'Book Now': 'હમણાં બુક કરો',
    'Search': 'શોધો',
    'History': 'ઇતિહાસ',
    'Architecture': 'વાસ્તુકલા',
    'Travel': 'કેવી રીતે પહોંચવું',
    'Verified Booking': 'ચકાસાયેલ બુકિંગ',
    "Today's Panchang": 'આજનું પંચાંગ',
    'Tithi': 'તિથિ',
    'Nakshatra': 'નક્ષત્ર',
    'Yoga': 'યોગ',
    'Karana': 'કરણ',
    'Trending Pujas': 'લોકપ્રિય પૂજા',
    'Maha Shivratri': 'મહા શિવરાત્રી',
    'Book your Rudrabhishek now': 'તમારો રુદ્રાભિષેક હમણાં બુક કરો',
    'View All': 'બધા જુઓ',
    "Book authentic pujas performed by verified pandits at India's most sacred temples.": 'ભારતના સૌથી પવિત્ર મંદિરોમાં ચકાસાયેલ પંડિતો દ્વારા અધિકૃત પૂજા બુક કરો.',
    'Offer Chadhava': 'ચઢાવો અર્પણ કરો',
    'Offer sacred items to the deity from the comfort of your home.': 'તમારા ઘરની આરામથી દેવતાને પવિત્ર વસ્તુઓ અર્પણ કરો.',
    'Offer': 'અર્પણ કરો',
    'No offerings found': 'કોઈ ચઢાવો મળ્યો નથી',
    'Try a different search term': 'અલગ શબ્દ શોધો',
    'Is this Puja for you?': 'શું આ પૂજા તમારા માટે છે?',
    "What's Included": 'શું શામેલ છે',
    'Sankalp Details': 'સંકલ્પ વિગતો',
    'Prasad Delivery': 'પ્રસાદ વિતરણ',
    'Review & Pay': 'સમીક્ષા અને ચૂકવણી',
    'Complete Your Booking': 'તમારું બુકિંગ પૂર્ણ કરો',
    'Available Pujas': 'ઉપલબ્ધ પૂજા',
    'Sun Details': 'સૂર્ય વિગતો',
    'Sunrise': 'સૂર્યોદય',
    'Sunset': 'સૂર્યાસ્ત',
    'Moon Details': 'ચંદ્ર વિગતો',
    'Moonrise': 'ચંદ્રોદય',
    'Moonset': 'ચંદ્રાસ્ત',
  },
  'te': {
    'Benefits': 'ప్రయోజనాలు',
    'How it works': 'ఇది ఎలా పనిచేస్తుంది',
    'Select Package': 'ప్యాకేజీని ఎంచుకోండి',
    'Devotee Experiences': 'భక్తుల అనుభవాలు',
    'About the Temple': 'గుడి గురించి',
    'Book Now': 'ఇప్పుడే బుక్ చేయండి',
    'Search': 'శోధించండి',
    'History': 'చరిత్ర',
    'Architecture': 'వాస్తుశిల్పం',
    'Travel': 'ప్రయాణం',
    'Verified Booking': 'ధృవీకరించబడిన బుకింగ్',
    "Today's Panchang": 'నేటి పంచాంగం',
    'Tithi': 'తిథి',
    'Nakshatra': 'నక్షత్రం',
    'Yoga': 'యోగం',
    'Karana': 'కరణం',
    'Trending Pujas': 'ట్రెండింగ్ పూజలు',
    'Maha Shivratri': 'మహా శివరాత్రి',
    'Book your Rudrabhishek now': 'మీ రుద్రాభిషేకం ఇప్పుడే బుక్ చేయండి',
    'View All': 'అన్నీ చూడండి',
    "Book authentic pujas performed by verified pandits at India's most sacred temples.": 'భారతదేశంలోని అత్యంత పవిత్రమైన దేవాలయాలలో ధృవీకరించబడిన పండితులచే ప్రామాణిక పూజలను బుక్ చేయండి.',
    'Offer Chadhava': 'చఢావా సమర్పించండి',
    'Offer sacred items to the deity from the comfort of your home.': 'మీ ఇంటి నుండి దేవతకు పవిత్రమైన వస్తువులను సమర్పించండి.',
    'Offer': 'సమర్పించండి',
    'No offerings found': 'ఎలాంటి కానుకలు కనుగొనబడలేదు',
    'Try a different search term': 'వేరే శోధన పదాన్ని ప్రయత్నించండి',
    'Is this Puja for you?': 'ఈ పూజ మీ కోసమేనా?',
    "What's Included": 'ఏమి చేర్చబడింది',
    'Sankalp Details': 'సంకల్ప వివరాలు',
    'Prasad Delivery': 'ప్రసాదం పంపిణీ',
    'Review & Pay': 'సమీక్షించి చెల్లించండి',
    'Complete Your Booking': 'మీ బుకింగ్‌ను పూర్తి చేయండి',
    'Available Pujas': 'అందుబాటులో ఉన్న పూజలు',
    'Sun Details': 'సూర్యుని వివరాలు',
    'Sunrise': 'సూర్యోదయం',
    'Sunset': 'సూర్యాస్తమయం',
    'Moon Details': 'చంద్రుని వివరాలు',
    'Moonrise': 'చంద్రోదయం',
    'Moonset': 'చంద్రాస్తమయం',
  },
  'ta': {
    'Benefits': 'நன்மைகள்',
    'How it works': 'எப்படி செயல்படுகிறது',
    'Select Package': 'தொகுப்பைத் தேர்ந்தெடுக்கவும்',
    'Devotee Experiences': 'பக்தர்களின் அனுபவங்கள்',
    'About the Temple': 'கோவில் பற்றி',
    'Book Now': 'இப்போதே பதிவு செய்யவும்',
    'Search': 'தேடுக',
    'History': 'வரலாறு',
    'Architecture': 'கட்டிடக்கலை',
    'Travel': 'பயணம்',
    'Verified Booking': 'சரிபார்க்கப்பட்ட முன்பதிவு',
    "Today's Panchang": 'இன்றைய பஞ்சாங்கம்',
    'Tithi': 'திதி',
    'Nakshatra': 'நட்சத்திரம்',
    'Yoga': 'யோகம்',
    'Karana': 'கரணம்',
    'Trending Pujas': 'பிரபலமான பூஜைகள்',
    'Maha Shivratri': 'மகா சிவராத்திரி',
    'Book your Rudrabhishek now': 'உங்கள் ருத்ராபிஷேகத்தை இப்போதே பதிவு செய்யுங்கள்',
    'View All': 'அனைத்தையும் காண்க',
    "Book authentic pujas performed by verified pandits at India's most sacred temples.": 'இந்தியாவின் புனிதமான கோவில்களில் சரிபார்க்கப்பட்ட பண்டிதர்களால் செய்யப்படும் பூஜைகளை பதிவு செய்யவும்.',
    'Offer Chadhava': 'காணிக்கை செலுத்துங்கள்',
    'Offer sacred items to the deity from the comfort of your home.': 'உங்கள் வீட்டில் இருந்தபடியே தெய்வத்திற்கு புனிதமான பொருட்களை காணிக்கையாக செலுத்துங்கள்.',
    'Offer': 'செலுத்துங்கள்',
    'No offerings found': 'காணிக்கைகள் எதுவும் காணப்படவில்லை',
    'Try a different search term': 'வேறு தேடல் சொல்லை முயற்சிக்கவும்',
    'Is this Puja for you?': 'இந்த பூஜை உங்களுக்கானதா?',
    "What's Included": 'என்ன சேர்க்கப்பட்டுள்ளது',
    'Sankalp Details': 'சங்கல்ப விவரங்கள்',
    'Prasad Delivery': 'பிரசாத விநியோகம்',
    'Review & Pay': 'மதிப்பாய்வு மற்றும் செலுத்துக',
    'Complete Your Booking': 'உங்கள் முன்பதிவை முடிக்கவும்',
    'Available Pujas': 'கிடைக்கக்கூடிய பூஜைகள்',
    'Sun Details': 'சூரிய விவரங்கள்',
    'Sunrise': 'சூரியோதயம்',
    'Sunset': 'சூரிய அஸ்தமனம்',
    'Moon Details': 'சந்திர விவரங்கள்',
    'Moonrise': 'சந்திரோதயம்',
    'Moonset': 'சந்திர அஸ்தமனம்',
  },
  'kn': {
    'Benefits': 'ಪ್ರಯೋಜನಗಳು',
    'How it works': 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    'Select Package': 'ಪ್ಯಾಕೇಜ್ ಆಯ್ಕೆಮಾಡಿ',
    'Devotee Experiences': 'ಭಕ್ತರ ಅನುಭವಗಳು',
    'About the Temple': 'ದೇವಾಲಯದ ಬಗ್ಗೆ',
    'Book Now': 'ಈಗ ಬುಕ್ ಮಾಡಿ',
    'Search': 'ಹುಡುಕಿ',
    'History': 'ಇತಿಹಾಸ',
    'Architecture': 'ವಾಸ್ತುಶಿಲ್ಪ',
    'Travel': 'ಪ್ರಯಾಣ',
    'Verified Booking': 'ಪರಿಶೀಲಿಸಲಾದ ಬುಕಿಂಗ್',
    "Today's Panchang": 'ಇಂದಿನ ಪಂಚಾಂಗ',
    'Tithi': 'ತಿಥಿ',
    'Nakshatra': 'ನಕ್ಷತ್ರ',
    'Yoga': 'ಯೋಗ',
    'Karana': 'ಕರಣ',
    'Trending Pujas': 'ಟ್ರೆಂಡಿಂಗ್ ಪೂಜೆಗಳು',
    'Maha Shivratri': 'ಮಹಾ ಶಿವರಾತ್ರಿ',
    'Book your Rudrabhishek now': 'ನಿಮ್ಮ ರುದ್ರಾಭಿಷೇಕವನ್ನು ಈಗ ಬುಕ್ ಮಾಡಿ',
    'View All': 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    "Book authentic pujas performed by verified pandits at India's most sacred temples.": 'ಭಾರತದ ಅತ್ಯಂತ ಪವಿತ್ರ ದೇವಾಲಯಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಿದ ಪಂಡಿತರಿಂದ ಅಧಿಕೃತ ಪೂಜೆಗಳನ್ನು ಬುಕ್ ಮಾಡಿ.',
    'Offer Chadhava': 'ಕಾಣಿಕೆ ಅರ್ಪಿಸಿ',
    'Offer sacred items to the deity from the comfort of your home.': 'ನಿಮ್ಮ ಮನೆಯಿಂದಲೇ ದೇವರಿಗೆ ಪವಿತ್ರ ವಸ್ತುಗಳನ್ನು ಅರ್ಪಿಸಿ.',
    'Offer': 'ಅರ್ಪಿಸಿ',
    'No offerings found': 'ಯಾವುದೇ ಕಾಣಿಕೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    'Try a different search term': 'ಬೇರೆ ಹುಡುಕಾಟ ಪದವನ್ನು ಪ್ರಯತ್ನಿಸಿ',
    'Is this Puja for you?': 'ಈ ಪೂಜೆ ನಿಮಗಾಗಿಯೇ?',
    "What's Included": 'ಏನೆಲ್ಲಾ ಸೇರಿದೆ',
    'Sankalp Details': 'ಸಂಕಲ್ಪ ವಿವರಗಳು',
    'Prasad Delivery': 'ಪ್ರಸಾದ ವಿತರಣೆ',
    'Review & Pay': 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಪಾವತಿಸಿ',
    'Complete Your Booking': 'ನಿಮ್ಮ ಬುಕಿಂಗ್ ಅನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ',
    'Available Pujas': 'ಲಭ್ಯವಿರುವ ಪೂಜೆಗಳು',
    'Sun Details': 'ಸೂರ್ಯನ ವಿವರಗಳು',
    'Sunrise': 'ಸೂರ್ಯೋದಯ',
    'Sunset': 'ಸೂರ್ಯಾಸ್ತ',
    'Moon Details': 'ಚಂದ್ರನ ವಿವರಗಳು',
    'Moonrise': 'ಚಂದ್ರೋದಯ',
    'Moonset': 'ಚಂದ್ರಾಸ್ತ',
  },
  'or': {
    'Benefits': 'ଲାଭ',
    'How it works': 'ଏହା କିପରି କାମ କରେ',
    'Select Package': 'ପ୍ୟାକେଜ୍ ବାଛନ୍ତୁ',
    'Devotee Experiences': 'ଭକ୍ତଙ୍କ ଅନୁଭୂତି',
    'About the Temple': 'ମନ୍ଦିର ବିଷୟରେ',
    'Book Now': 'ବର୍ତ୍ତମାନ ବୁକ୍ କରନ୍ତୁ',
    'Search': 'ସନ୍ଧାନ କରନ୍ତୁ',
    'History': 'ଇତିହାସ',
    'Architecture': 'ସ୍ଥାପତ୍ୟ',
    'Travel': 'କିପରି ଯିବେ',
    'Verified Booking': 'ଯାଞ୍ଚ ହୋଇଥିବା ବୁକିଂ',
    "Today's Panchang": 'ଆଜିର ପଞ୍ଚାଙ୍ଗ',
    'Tithi': 'ତିଥି',
    'Nakshatra': 'ନକ୍ଷତ୍ର',
    'Yoga': 'ଯୋଗ',
    'Karana': 'କରଣ',
    'Trending Pujas': 'ଟ୍ରେଣ୍ଡିଂ ପୂଜା',
    'Maha Shivratri': 'ମହା ଶିବରାତ୍ରୀ',
    'Book your Rudrabhishek now': 'ଆପଣଙ୍କର ରୁଦ୍ରାଭିଷେକ ବର୍ତ୍ତମାନ ବୁକ୍ କରନ୍ତୁ',
    'View All': 'ସବୁ ଦେଖନ୍ତୁ',
    "Book authentic pujas performed by verified pandits at India's most sacred temples.": 'ଭାରତର ସବୁଠାରୁ ପବିତ୍ର ମନ୍ଦିରଗୁଡ଼ିକରେ ପ୍ରାମାଣିକ ପୂଜା ବୁକ୍ କରନ୍ତୁ।',
    'Offer Chadhava': 'ଚଢ଼ାବା ଅର୍ପଣ କରନ୍ତୁ',
    'Offer sacred items to the deity from the comfort of your home.': 'ଆପଣଙ୍କ ଘରୁ ଦେବତାଙ୍କୁ ପବିତ୍ର ସାମଗ୍ରୀ ଅର୍ପଣ କରନ୍ତୁ।',
    'Offer': 'ଅର୍ପଣ କରନ୍ତୁ',
    'No offerings found': 'କୌଣସି ଅଫର୍ ମିଳିଲା ନାହିଁ',
    'Try a different search term': 'ଅଲଗା ଶବ୍ଦ ଖୋଜନ୍ତୁ',
    'Is this Puja for you?': 'ଏହି ପୂଜା ଆପଣଙ୍କ ପାଇଁ କି?',
    "What's Included": 'କଣ ଅନ୍ତର୍ଭୁକ୍ତ',
    'Sankalp Details': 'ସଂକଳ୍ପ ବିବରଣୀ',
    'Prasad Delivery': 'ପ୍ରସାଦ ବିତରଣ',
    'Review & Pay': 'ସମୀକ୍ଷା ଏବଂ ପେମେଣ୍ଟ',
    'Complete Your Booking': 'ଆପଣଙ୍କର ବୁକିଂ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ',
    'Available Pujas': 'ଉପଲବ୍ଧ ପୂଜା',
    'Sun Details': 'ସୂର୍ଯ୍ୟ ବିବରଣୀ',
    'Sunrise': 'ସୂର୍ଯ୍ୟୋଦୟ',
    'Sunset': 'ସୂର୍ଯ୍ୟାସ୍ତ',
    'Moon Details': 'ଚంద్ర ବିବରଣୀ',
    'Moonrise': 'ଚନ୍ଦ୍ରୋଦୟ',
    'Moonset': 'ଚନ୍ଦ୍ରାସ୍ତ',
  },
  'ml': {
    'Benefits': 'ഗുണങ്ങൾ',
    'How it works': 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു',
    'Select Package': 'പാക്കേജ് തിരഞ്ഞെടുക്കുക',
    'Devotee Experiences': 'ഭക്തരുടെ അനുഭവങ്ങൾ',
    'About the Temple': 'ക്ഷേത്രത്തെക്കുറിച്ച്',
    'Book Now': 'ഇപ്പോൾ ബുക്ക് ചെയ്യുക',
    'Search': 'തിരയുക',
    'History': 'ചരിത്രം',
    'Architecture': 'വാസ്തുവിദ്യ',
    'Travel': 'എങ്ങനെ എത്തിച്ചേരാം',
    'Verified Booking': 'പരിശോധിച്ച ബുക്കിംഗ്',
    "Today's Panchang": 'ഇന്നത്തെ പഞ്ചാംഗം',
    'Tithi': 'തിഥി',
    'Nakshatra': 'നക്ഷത്രം',
    'Yoga': 'യോഗം',
    'Karana': 'കരണം',
    'Trending Pujas': 'ട്രെൻഡിംഗ് പൂജകൾ',
    'Maha Shivratri': 'മഹാ ശിവരാത്രി',
    'Book your Rudrabhishek now': 'നിങ്ങളുടെ രുദ്രാഭിഷേകം ഇപ്പോൾ ബുക്ക് ചെയ്യുക',
    'View All': 'എല്ലാം കാണുക',
    "Book authentic pujas performed by verified pandits at India's most sacred temples.": 'ഇന്ത്യയിലെ ഏറ്റവും പുണ്യമായ ക്ഷേത്രങ്ങളിൽ പൂജകൾ ബുക്ക് ചെയ്യുക.',
    'Offer Chadhava': 'വഴിപാട് അർപ്പിക്കുക',
    'Offer sacred items to the deity from the comfort of your home.': 'നിങ്ങളുടെ വീട്ടിൽ നിന്ന് ദേവന് പുണ്യവസ്തുക്കൾ അർപ്പിക്കുക.',
    'Offer': 'അർപ്പിക്കുക',
    'No offerings found': 'വഴിപാടുകളൊന്നും കണ്ടെത്തിയില്ല',
    'Try a different search term': 'മറ്റൊരു പദം തിരയുക',
    'Is this Puja for you?': 'ഈ പൂജ നിങ്ങൾക്കുള്ളതാണോ?',
    "What's Included": 'എന്തെല്ലാം ഉൾപ്പെടുന്നു',
    'Sankalp Details': 'സങ്കൽപ വിവരങ്ങൾ',
    'Prasad Delivery': 'പ്രസാദം ഡെലിവറി',
    'Review & Pay': 'പരിശോധിച്ച് പണമടയ്ക്കുക',
    'Complete Your Booking': 'നിങ്ങളുടെ ബുക്കിംഗ് പൂർത്തിയാക്കുക',
    'Available Pujas': 'ലഭ്യമായ പൂജകൾ',
    'Sun Details': 'സൂര്യന്റെ വിവരങ്ങൾ',
    'Sunrise': 'സൂര്യോദയം',
    'Sunset': 'സൂര്യാസ്തമയം',
    'Moon Details': 'ചന്ദ്രന്റെ വിവരങ്ങൾ',
    'Moonrise': 'ചന്ദ്രോദയം',
    'Moonset': 'ചന്ദ്രാസ്തമയം',
  },
  'pa': {
    'Benefits': 'ਲਾਭ',
    'How it works': 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
    'Select Package': 'ਪੈਕੇਜ ਚੁਣੋ',
    'Devotee Experiences': 'ਭਗਤਾਂ ਦੇ ਅਨੁਭਵ',
    'About the Temple': 'ਮੰਦਰ ਬਾਰੇ',
    'Book Now': 'ਹੁਣੇ ਬੁੱਕ ਕਰੋ',
    'Search': 'ਖੋਜ',
    'History': 'ਇਤਿਹਾਸ',
    'Architecture': 'ਆਰਕੀਟੈਕਚਰ',
    'Travel': 'ਕਿਵੇਂ ਪਹੁੰਚਣਾ ਹੈ',
    'Verified Booking': 'ਪ੍ਰਮਾਣਿਤ ਬੁਕਿੰਗ',
    "Today's Panchang": 'ਅੱਜ ਦਾ ਪੰਚਾਂਗ',
    'Tithi': 'ਤਿਥੀ',
    'Nakshatra': 'ਨਕਸ਼ਤਰ',
    'Yoga': 'ਯੋਗ',
    'Karana': 'ਕਰਣ',
    'Trending Pujas': 'ਪ੍ਰਸਿੱਧ ਪੂਜਾਵਾਂ',
    'Maha Shivratri': 'ਮਹਾ ਸ਼ਿਵਰਾਤਰੀ',
    'Book your Rudrabhishek now': 'ਆਪਣਾ ਰੁਦ੍ਰਾਭਿਸ਼ੇਕ ਹੁਣੇ ਬੁੱਕ ਕਰੋ',
    'View All': 'ਸਭ ਦੇਖੋ',
    "Book authentic pujas performed by verified pandits at India's most sacred temples.": 'ਭਾਰਤ ਦੇ ਸਭ ਤੋਂ ਪਵਿੱਤਰ ਮੰਦਰਾਂ ਵਿੱਚ ਪ੍ਰਮਾਣਿਤ ਪੰਡਿਤਾਂ ਦੁਆਰਾ ਪੂਜਾ ਬੁੱਕ ਕਰੋ।',
    'Offer Chadhava': 'ਚੜ੍ਹਾਵਾ ਚੜ੍ਹਾਓ',
    'Offer sacred items to the deity from the comfort of your home.': 'ਆਪਣੇ ਘਰ ਤੋਂ ਦੇਵਤੇ ਨੂੰ ਪਵਿੱਤਰ ਵਸਤੂਆਂ ਚੜ੍ਹਾਓ।',
    'Offer': 'ਚੜ੍ਹਾਓ',
    'No offerings found': 'ਕੋਈ ਚੜ੍ਹਾਵਾ ਨਹੀਂ ਮਿਲਿਆ',
    'Try a different search term': 'ਕੋਈ ਹੋਰ ਸ਼ਬਦ ਖੋਜੋ',
    'Is this Puja for you?': 'ਕੀ ਇਹ ਪੂਜਾ ਤੁਹਾਡੇ ਲਈ ਹੈ?',
    "What's Included": 'ਇਸ ਵਿੱਚ ਕੀ ਸ਼ਾਮਲ ਹੈ',
    'Sankalp Details': 'ਸੰਕਲਪ ਵੇਰਵੇ',
    'Prasad Delivery': 'ਪ੍ਰਸਾਦ ਡਿਲਿਵਰੀ',
    'Review & Pay': 'ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਭੁਗਤਾਨ ਕਰੋ',
    'Complete Your Booking': 'ਆਪਣੀ ਬੁਕਿੰਗ ਪੂਰੀ ਕਰੋ',
    'Available Pujas': 'ਉਪਲਬਧ ਪੂਜਾਵਾਂ',
    'Sun Details': 'ਸੂਰਜ ਦੇ ਵੇਰਵੇ',
    'Sunrise': 'ਸੂਰਜ ਚੜ੍ਹਨਾ',
    'Sunset': 'ਸੂਰਜ ਡੁੱਬਣਾ',
    'Moon Details': 'ਚੰਦਰਮਾ ਦੇ ਵੇਰਵੇ',
    'Moonrise': 'ਚੰਦਰਮਾ ਚੜ੍ਹਨਾ',
    'Moonset': 'ਚੰਦਰਮਾ ਡੁੱਬਣਾ',
  },

  // We can add more as needed, falling back to Hindi if missing
};

interface LanguageContextType {
  language: string; // The selected regional language code
  setLanguage: (lang: string) => void;
  detectLanguageFromState: (stateName: string) => void;
  t: (englishText: string) => string; // Translates UI text (returns Dual Language string)
  getDualText: (englishText: string, dbTranslations: any, fieldKey: string, type?: 'temple' | 'puja') => string; // Gets dual text from DB object
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('hi'); // Default to Hindi
  const [mounted, setMounted] = useState(false);

  // On mount, restore from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && LANGUAGES[stored]) {
        setLanguageState(stored);
      }
    } catch (e) {
      // localStorage not available (SSR, etc.)
    }
    setMounted(true);
  }, []);

  // Wrap setLanguage to also persist to localStorage and mark as manual choice
  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem(MANUAL_CHOICE_KEY, 'true');
    } catch (e) {
      // localStorage not available
    }
  }, []);

  const detectLanguageFromState = useCallback((stateName: string) => {
    // If the user has explicitly chosen a language, don't override it
    try {
      if (localStorage.getItem(MANUAL_CHOICE_KEY) === 'true') {
        return;
      }
    } catch (e) {
      // localStorage not available
    }

    const stateKey = Object.keys(STATE_LANGUAGE_MAP).find(s => 
      stateName.toLowerCase().includes(s.toLowerCase())
    );
    
    if (stateKey) {
      const detectedLang = STATE_LANGUAGE_MAP[stateKey];
      setLanguageState(detectedLang);
      try {
        localStorage.setItem(STORAGE_KEY, detectedLang);
      } catch (e) {
        // localStorage not available
      }
    }
  }, []);

  // Helper to get static UI text in dual format (English | Regional)
  const t = useCallback((englishText: string) => {
    const dict = UI_DICTIONARY[language] || UI_DICTIONARY['hi'];
    const translation = dict[englishText] || UI_DICTIONARY['hi'][englishText];
    
    if (translation) {
      return `${englishText} | ${translation}`;
    }
    return englishText; // Fallback
  }, [language]);

  // Helper to parse DB JSONB translations or static dictionary
  const getDualText = useCallback((englishText: string, dbTranslations: any, fieldKey: string, type?: 'temple' | 'puja') => {
    if (!englishText) return "";
    
    // First try the static dictionary if type is provided
    if (type) {
      const staticTranslation = getTranslatedField(englishText, fieldKey, language, type);
      if (staticTranslation) {
        return `${englishText}\n\n${staticTranslation}`;
      }
    }
    
    // Fallback to JSONB object if it exists (for future compatibility)
    if (dbTranslations) {
      const translation = dbTranslations?.[language]?.[fieldKey];
      if (translation) {
        return `${englishText}\n\n${translation}`;
      }
      const hiTranslation = dbTranslations?.['hi']?.[fieldKey];
      if (hiTranslation) {
        return `${englishText}\n\n${hiTranslation}`;
      }
    }
    
    return englishText;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, detectLanguageFromState, t, getDualText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
