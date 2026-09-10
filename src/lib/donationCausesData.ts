export interface DonationTier {
  amount: number
  label: string
  impact: string
  popular?: boolean
}

export interface GalleryPhoto {
  src: string
  title: string
  location: string
  caption: string
}

export interface ImpactCounter {
  value: string
  label: string
  icon?: string
}

export interface AllocationItem {
  percentage: number
  title: string
  desc: string
  icon?: string
}

export interface TimelineStep {
  step: string
  title: string
  desc: string
}

export interface FAQItem {
  q: string
  a: string
}

export interface CauseDetail {
  category: string
  type: "disaster" | "seva"
  title: string
  subtitle: string
  badge: string
  isUrgent: boolean
  heroImage: string
  donorsCount: number
  totalRaised: number
  taxNote: string
  partnerBadges: string[]
  impactCounters: ImpactCounter[]
  story: {
    headline: string
    subheadline?: string
    paragraphs: string[]
    quote?: {
      text: string
      author: string
    }
    keyPoints: string[]
  }
  allocation: AllocationItem[]
  timeline: TimelineStep[]
  gallery: GalleryPhoto[]
  donationTiers: DonationTier[]
  faqs: FAQItem[]
}

export const CAUSES_DATA: Record<string, CauseDetail> = {
  "wayanad-relief": {
    category: "wayanad-relief",
    type: "disaster",
    title: "वायनाड भूस्खलन एवं बाढ़ राहत • Wayanad Disaster Relief",
    subtitle: "Emergency Flash Flood & Landslide Rehabilitation Mission in Kerala",
    badge: "🚨 Urgent Disaster Relief",
    isUrgent: true,
    heroImage: "/images/donations/wayanad-relief.jpg",
    donorsCount: 340,
    totalRaised: 184500,
    taxNote: "100% Direct Field Distribution • 80G Tax Exemption Eligible • Zero Administrative Cuts",
    partnerBadges: ["Kerala Community Aid", "White Guard Relief Volunteers", "Local Panchayat Relief Camps", "Kerala Disaster Coalition"],
    impactCounters: [
      { value: "18,000+", label: "Hot Meals Cooked & Distributed", icon: "🍲" },
      { value: "850+", label: "Survivors Reached in Camps", icon: "⛺" },
      { value: "420+", label: "Children Provided Care Kits", icon: "🧒" },
      { value: "14", label: "Relief Centers Supported", icon: "📍" },
    ],
    story: {
      headline: "The Ground Reality in Chooralmala & Mundakkai",
      subheadline: "Massive midnight landslides tore through the Western Ghats, leaving entire hillside settlements buried beneath mud and boulders.",
      paragraphs: [
        "In the early hours, catastrophic torrential rains triggered multiple severe landslides in Meppadi panchayat, completely erasing the hamlets of Chooralmala, Mundakkai, and Attamala. Over 400 lives were lost, hundreds remain unaccounted for, and thousands of tea plantation workers and families lost their ancestral homes in an instant.",
        "While emergency armed forces and volunteer rescue groups like the White Guard worked tirelessly through debris and severed bridges, survivors now face the long, agonizing battle for basic survival inside makeshift relief shelters. Displaced families have lost everything — clothing, identification, utensils, and livelihoods.",
        "Our humanitarian seva mission operates continuous community kitchens at Meppadi and surrounding rehabilitation schools. Every rupee you donate directly funds bulk grocery rations (rice, lentils, cooking oil), clean mineral water cans, hygiene essentials, warm blankets, and long-term family survival kits."
      ],
      quote: {
        text: "When the mountain collapsed, we ran with just our children in our arms. Without the hot food and medicines from relief volunteers, we could not have survived these weeks.",
        author: "Lakshmi M., Displaced Resident, Meppadi Relief Camp"
      },
      keyPoints: [
        "Daily hot meals and clean drinking water dispatched to 14 active relief centers in Wayanad.",
        "Emergency medical kits containing tetanus prophylactics, wound dressings, and chronic medication.",
        "Waterproof family kits with blankets, sleeping mats, solar lanterns, and sanitary packs.",
        "Direct procurement from local Kerala farmers and suppliers for immediate on-ground delivery."
      ]
    },
    allocation: [
      { percentage: 60, title: "Community Kitchen Rations & Clean Water", desc: "Rice, dal, fresh vegetables, baby formula, and clean mineral water." },
      { percentage: 25, title: "Emergency Medical & Hygiene Aid", desc: "First-aid dressings, water chlorination tablets, ORS, and infant hygiene." },
      { percentage: 15, title: "Bedding, Tarpaulins & Camp Essentials", desc: "Warm fleece blankets, waterproof floor mats, and solar lights for shelter." }
    ],
    timeline: [
      { step: "01", title: "Instant Bulk Procurement", desc: "Your contribution purchases bulk rations directly from local warehouses within 4 hours of receipt." },
      { step: "02", title: "Camp Kitchen Cooking & Packing", desc: "Volunteer teams cook fresh hot meals twice daily at central Meppadi relief kitchens." },
      { step: "03", title: "Direct Distribution & Live Audit", desc: "Field sevaks hand-deliver ration kits directly to verified displaced families with transparent geo-tagged logs." }
    ],
    gallery: [
      {
        src: "/images/donations/wayanad-kitchen.jpg",
        title: "Community Relief Kitchen in Meppadi",
        location: "Meppadi Relief Camp, Wayanad",
        caption: "Volunteers and cooks preparing massive cauldrons of nutritious sambar-rice and packaging fresh hot meals for camp residents."
      },
      {
        src: "/images/donations/wayanad-relief.jpg",
        title: "Emergency Relief Supplies Dispatch",
        location: "Chooralmala Valley Center",
        caption: "Field teams offloading emergency family ration cartons, clean drinking water cans, and bedding supplies."
      },
      {
        src: "/images/donations/wayanad-chooralmala-volunteer.jpg",
        title: "Volunteer Rescue Worker on Ground",
        location: "Chooralmala Disaster Site",
        caption: "Brave local volunteer rescue teams navigating deep mud and hazardous terrain to reach isolated households."
      }
    ],
    donationTiers: [
      { amount: 101, label: "₹101", impact: "Provides 1 warm cooked meal and clean drinking water for a survivor", popular: false },
      { amount: 251, label: "₹251", impact: "Feeds a displaced family of 4 with 2 days of hot meals & water", popular: false },
      { amount: 501, label: "₹501", impact: "Provides 2 warm blankets and an infant nutrition & hygiene package", popular: false },
      { amount: 1001, label: "₹1,001", impact: "Supplies a full Emergency Family Survival Kit with dry groceries & medicines", popular: true },
      { amount: 2001, label: "₹2,001", impact: "Sponsors 10 days of community kitchen meals for 10 camp survivors", popular: false },
      { amount: 5001, label: "₹5,001", impact: "Funds long-term family shelter rehabilitation and kitchen utensils kit", popular: false },
      { amount: 11000, label: "₹11,000", impact: "Operates an entire relief kitchen unit feeding 120+ people for a day", popular: false },
      { amount: 21000, label: "₹21,000", impact: "Disaster patron: Mobile doctor clinic & emergency medicine dispensary", popular: false }
    ],
    faqs: [
      { q: "How quickly does my donation reach the survivors in Wayanad?", a: "Donations are batched into our on-ground operating fund every 6 hours to purchase bulk staples and cooking essentials directly in Wayanad and Calicut, ensuring near-instantaneous deployment." },
      { q: "Is 80G tax exemption available?", a: "Yes. All donations through Vandanam's verified relief partners are eligible for tax deduction under Section 80G of the Income Tax Act." },
      { q: "Can I donate via UPI without creating an account?", a: "Yes. You can complete your donation in under 30 seconds via Google Pay, PhonePe, Paytm, BHIM UPI, or cards by providing just your mobile number for the receipt." },
      { q: "How is transparency ensured?", a: "We publish direct photographic dispatches and verified distribution reports from our partner field volunteers at Meppadi camps." }
    ]
  },

  "assam-flood-relief": {
    category: "assam-flood-relief",
    type: "disaster",
    title: "असम ब्रह्मपुत्र बाढ़ राहत • Assam Flood Relief",
    subtitle: "Emergency Boat Rescue, Water Purification & Rations along the Brahmaputra",
    badge: "🚨 Urgent Flood Crisis",
    isUrgent: true,
    heroImage: "/images/donations/assam-flood-relief.jpg",
    donorsCount: 195,
    totalRaised: 98200,
    taxNote: "100% Direct Field Distribution • 80G Tax Exemption Eligible • Certified Boat Rescue Operations",
    partnerBadges: ["SDRF Field Volunteers", "Brahmaputra Seva Samiti", "Assam River Relief Coalition", "Disaster Response India"],
    impactCounters: [
      { value: "25,000+", label: "Water Purification Kits Given", icon: "💧" },
      { value: "3,200+", label: "Family Dry Ration Bags Delivered", icon: "📦" },
      { value: "45+", label: "Boat Rescue & Relief Missions", icon: "🚤" },
      { value: "22", label: "Submerged Char Villages Supported", icon: "🏝️" },
    ],
    story: {
      headline: "Submerged Villages Cut Off Along the Brahmaputra Basin",
      subheadline: "Relentless monsoon downpours caused the mighty Brahmaputra and its tributaries to breach embankments, submerging over 2,000 rural villages.",
      paragraphs: [
        "Every monsoon, the Brahmaputra, Barak, and Dikhow river basins swallow whole districts across Assam, including Sivasagar, Jorhat, Dibrugarh, Morigaon, and Dhubri. However, this year's ferocious flash surges wiped out bamboo stilt houses, inundated agricultural paddy lands, and left over 1.5 million people marooned on high river embankments and highway dividers.",
        "The single most critical killer in flooded Assam is contaminated drinking water. With tubewells fully submerged beneath muddy torrents, waterborne epidemics (cholera, acute diarrhea, dysentery) threaten thousands of infants and elderly villagers cut off on isolated river islands ('chars').",
        "Our specialized relief flotilla deploys motorized rescue boats equipped with water purification units, dry food rations (chira, gur, biscuits, puffed rice), mosquito nets, and anti-venom medical supplies directly to families perched on bamboo roofs and embankments who cannot reach mainland relief points."
      ],
      quote: {
        text: "The flood water rose 8 feet in 2 hours. We climbed to our tin roof with our grandchildren. When the orange rescue boat arrived with drinking water and dry food, it was like God had answered our prayers.",
        author: "Ranjit Gogoi, Flood Survivor, Majuli Char Area"
      },
      keyPoints: [
        "Dedicated boat missions reaching isolated char island villages inaccessible by road.",
        "Distribution of zero-electricity water purification pouches delivering 20 liters of safe drinking water per family.",
        "Nutritious dry food kits resistant to flood humidity: flattened rice (chira), organic jaggery (gur), infant formula, and high-calorie biscuits.",
        "Mosquito nets and chlorine disinfectant sprays to stop malaria and waterborne dengue outbreaks."
      ]
    },
    allocation: [
      { percentage: 55, title: "Dry Rations & High-Nutrition Food Kits", desc: "Chira, gur, pulses, salt, mustard oil, and emergency baby milk powder." },
      { percentage: 30, title: "Water Purification & Medical Supplies", desc: "Water purification tablets, ORS packets, zinc supplements, and snakebite first-aid." },
      { percentage: 15, title: "Rescue Boat Fuel & Mosquito Net Kits", desc: "Fueling daily motorized relief boats and distributing heavy-duty protective nets." }
    ],
    timeline: [
      { step: "01", title: "Boat Fleet Deployment", desc: "Motorized rescue boats are loaded at mainland staging ghats at first light with sealed relief cartons." },
      { step: "02", title: "In-Stream Island Navigation", desc: "Experienced local boat pilots navigate dangerous river currents to reach cutoff char households." },
      { step: "03", title: "Direct Handover & Health Check", desc: "Volunteers deliver safe drinking water canisters and conduct on-the-spot child health screenings." }
    ],
    gallery: [
      {
        src: "/images/donations/assam-boat.jpg",
        title: "SDRF Relief Boat Distribution",
        location: "Brahmaputra Embankment, Morigaon",
        caption: "Rescue boats delivering fresh drinking water canisters and packaged dry food rations to submerged stilt houses."
      },
      {
        src: "/images/donations/assam-flood-relief.jpg",
        title: "Displaced Families on High Ground",
        location: "Dibrugarh Flood Defense Ring",
        caption: "Emergency distribution lines providing hot meals and water purification packets to thousands living in temporary roadside shacks."
      },
      {
        src: "/images/donations/assam-aid-eu.jpg",
        title: "On-Ground Humanitarian Relief Camp",
        location: "Jorhat Relief Hub",
        caption: "Dedicated humanitarian depot sorting relief materials, baby nutrition kits, and halogen water purification systems."
      }
    ],
    donationTiers: [
      { amount: 101, label: "₹101", impact: "Provides clean water canisters and emergency high-calorie biscuits for a child", popular: false },
      { amount: 251, label: "₹251", impact: "Provides 100 liters of purified water and 3 days dry rations for a family", popular: false },
      { amount: 501, label: "₹501", impact: "Supplies a Flood Medical Kit with ORS, bandages, water purification tablets & antiseptic", popular: false },
      { amount: 1001, label: "₹1,001", impact: "Delivers a Comprehensive Family Flood Kit (chira, gur, mosquito net, medicines)", popular: true },
      { amount: 2001, label: "₹2,001", impact: "Fuels 2 rescue boat missions reaching 3 isolated char villages with rations", popular: false },
      { amount: 5001, label: "₹5,001", impact: "Sponsors water purification units providing safe water for an entire cut-off hamlet", popular: false },
      { amount: 11000, label: "₹11,000", impact: "Funds an entire day's boat relief convoy and 100 family emergency grocery kits", popular: false },
      { amount: 21000, label: "₹21,000", impact: "Disaster patron: Provides emergency inflatable rescue equipment and floating dispensary", popular: false }
    ],
    faqs: [
      { q: "How do relief boats reach submerged villages during peak floods?", a: "Our volunteer partners collaborate with local SDRF pilots and Brahmaputra boatmen who have generational knowledge of water channels and hidden currents." },
      { q: "What is included in the dry ration pack?", a: "Flood-proof sealed packs containing chira (flattened rice), gur (pure jaggery for immediate calories), roasted gram, salt, matchboxes, candles, infant formula, and chlorine tablets." },
      { q: "Can I track my contribution?", a: "Yes. Donors receive WhatsApp updates with verified photos from boat dispatches and distribution camps." }
    ]
  },

  "bhandara": {
    category: "bhandara",
    type: "seva",
    title: "भंडारा • Bhandara (Annadanam Mahadaan)",
    subtitle: "Sacred Daily Community Feasts Feeding Pilgrims, Sadhus & the Needy",
    badge: "🙏 Sacred Mahadaan",
    isUrgent: false,
    heroImage: "/images/donations/bhandara-annadanam.jpg",
    donorsCount: 1248,
    totalRaised: 532000,
    taxNote: "100% Pure Desi Ghee & Fresh Produce • Vedic Annadanam Tradition • Zero Waste Certified",
    partnerBadges: ["Ayodhya Mahaprasadam Trust", "Kashi Annapurna Rasoi", "Vrindavan Sadhu Seva", "Vandanam Seva Foundation"],
    impactCounters: [
      { value: "1,50,000+", label: "Hot Meals Lovingly Served", icon: "🍲" },
      { value: "100%", label: "Pure Desi Ghee & Fresh Vegetables", icon: "✨" },
      { value: "3", label: "Sacred Pilgrim Centers (Ayodhya, Kashi, Vrindavan)", icon: "🛕" },
      { value: "365", label: "Days Unbroken Continuous Service", icon: "☀️" },
    ],
    story: {
      headline: "Annadanam: The Greatest of All Vedic Charities",
      subheadline: "अन्नं वै प्राणाः — Food is Life Itself (Taittiriya Upanishad). No act of charity in Sanatana Dharma surpasses feeding a hungry soul.",
      paragraphs: [
        "In our sacred scriptures, Annadanam is hailed as Mahadaan — the ultimate offering that purifies one's karma and brings immense spiritual merit. Every single day, thousands of wandering sadhus, elderly pilgrims who have walked hundreds of miles, daily wage workers, and impoverished families gather at our temple community kitchens.",
        "Unlike ordinary charity, our Bhandara is conducted with the utmost sanctity. Food is prepared in spotless brass and copper cauldrons with pure Desi Ghee, freshly ground spices, organic grains, and wholesome vegetables. Before serving, the meal is offered as Bhog to the Divine with sacred Vedic chanting.",
        "Everyone is seated with love and equal dignity in traditional rows (Pangat) — regardless of caste, creed, or status. With your support, we ensure that in the sacred lands of Ayodhya, Varanasi, and Vrindavan, not a single seeker or hungry soul goes to bed on an empty stomach."
      ],
      quote: {
        text: "Gifting food to a hungry human or sadhu is equivalent to offering prasad directly to Lord Shiva. It satisfies both body and soul.",
        author: "Pujya Swami Raghavananda, Vrindavan Annadanam Seva"
      },
      keyPoints: [
        "Daily nutritious hot meals: dal, seasonal sabzi, hot puris/rotis, fragrant rice, and kheer prasadam.",
        "Strict adherence to sattvic hygiene: cooked in pure cow ghee with fresh local market vegetables.",
        "Direct feeding of wandering ascetics (sadhus), destitute widows, and rural pilgrims.",
        "100% transparent procurement and video documentation shared with donors."
      ]
    },
    allocation: [
      { percentage: 70, title: "Fresh Groceries, Desi Ghee & Vegetables", desc: "Wholesome grains, lentils, fresh seasonal vegetables, spices, and pure cow ghee." },
      { percentage: 20, title: "Cooking Fuel, Clean Utensils & Pangat Mats", desc: "Eco-friendly leaf plates (pattals), bio-gas/clean fuel, and sanitary cleaning supplies." },
      { percentage: 10, title: "Temple Sevak Kitchen Honorarium", desc: "Supporting the devoted sevaks and cooks who wake up at 4 AM to prepare the morning feast." }
    ],
    timeline: [
      { step: "01", title: "4:00 AM Fresh Sourcing & Cooking", desc: "Temple sevaks source fresh local produce and begin cooking with morning Vedic mantras." },
      { step: "02", title: "11:30 AM Sacred Bhog Offering", desc: "The prepared Annadanam feast is offered to the temple deity with full aarti." },
      { step: "03", title: "12:00 PM Pangat Community Feast", desc: "Hundreds of seated sadhus and pilgrims are served with boundless love and respect." }
    ],
    gallery: [
      {
        src: "/images/donations/bhandara-annadanam.jpg",
        title: "Sacred Pangat Feast in Progress",
        location: "Ayodhya Temple Annakshetra",
        caption: "Devotees and sadhus seated in clean traditional rows being served piping hot dal, sabzi, and khichdi with genuine reverence."
      },
      {
        src: "/images/donations/bhandara.png",
        title: "Preparation of the Divine Bhog",
        location: "Kashi Annapurna Rasoi",
        caption: "Temple sevaks stirring massive vessels of nutritious pulses cooked in aromatic desi ghee."
      }
    ],
    donationTiers: [
      { amount: 101, label: "₹101", impact: "Feeds 10 hungry pilgrims/sadhus with a full nutritious hot meal", popular: false },
      { amount: 251, label: "₹251", impact: "Feeds 25 people with a wholesome thali (dal, sabzi, puris, kheer)", popular: false },
      { amount: 501, label: "₹501", impact: "Feeds 50 people at the sacred noon Pangat feast", popular: true },
      { amount: 1001, label: "₹1,001", impact: "Sponsors full meals for 108 devotees in your name / your family's name", popular: false },
      { amount: 2101, label: "₹2,101", impact: "Feeds an entire afternoon crowd of 220+ pilgrims with special sweet prasadam", popular: false },
      { amount: 5100, label: "₹5,100", impact: "Sponsors an entire day's Bhandara feast on auspicious occasions (birthdays, anniversaries, shraddh)", popular: false },
      { amount: 11000, label: "₹11,000", impact: "Maha Annadanam Patron: Feeds 1,100+ sadhus and pilgrims with special royal bhog", popular: false }
    ],
    faqs: [
      { q: "Can I sponsor a Bhandara on my birthday or a family anniversary?", a: "Yes! You can enter your sankalp/message during donation. The Annadanam will be dedicated in your name and a special video blessing will be shared." },
      { q: "What food is served in the Bhandara?", a: "Pure sattvic, vegetarian meals cooked in pure cow ghee: aromatic rice/khichdi, arhar/moong dal, fresh seasonal vegetables, hot puris, pickle, and sweet kheer." },
      { q: "Where does the feeding take place?", a: "At our partner community kitchens in Ayodhya, Varanasi (Kashi), and Vrindavan." }
    ]
  },

  "gau-seva": {
    category: "gau-seva",
    type: "seva",
    title: "गौ सेवा • Gau Seva (Gaushala & Desi Cow Protection)",
    subtitle: "Shelter, Medical Treatment & Fresh Green Fodder for Abandoned & Injured Desi Cows",
    badge: "🙏 Param Punya Seva",
    isUrgent: false,
    heroImage: "/images/donations/gau-seva.png",
    donorsCount: 984,
    totalRaised: 412000,
    taxNote: "Registered Gaushala Partner • 100% Desi Cow Care • Full-Time Veterinary Care",
    partnerBadges: ["Mathura Surabhi Gaushala", "Gir Sanrakshan Trust", "Desi Gau Raksha Samiti", "Vandanam Seva Foundation"],
    impactCounters: [
      { value: "650+", label: "Rescued & Sheltered Desi Cows", icon: "🐄" },
      { value: "12,000 kg", label: "Fresh Green Fodder (Hara Chara) Daily", icon: "🌾" },
      { value: "24/7", label: "On-Site Veterinary Doctor & Care", icon: "🩺" },
      { value: "100%", label: "Non-Commercial Lifelong Sanctuary", icon: "🏡" },
    ],
    story: {
      headline: "Maa Gau: The Abode of 33 Koti Divine Energies",
      subheadline: "गावो विश्वस्य मातरः — The Cow is the Mother of the Universe. Protecting and serving Gau Mata brings peace, prosperity, and spiritual liberation.",
      paragraphs: [
        "In Sanatana Dharma, Gau Mata is not merely an animal — she is revered as a sacred mother harboring all divine energies. Tragically, in modern times, hundreds of non-milking aging cows, injured bulls, and abandoned calves are left to wander busy highways, ingesting toxic plastic bags and suffering hit-and-run fractures.",
        "Our dedicated Gaushalas in the sacred Brij Bhoomi (Mathura-Vrindavan) and Gujarat provide a peaceful, lifelong sanctuary for over 650 rescued indigenous cows (Gir, Sahiwal, Tharparkar, Rathi). Here, they are treated with the love and veneration they truly deserve.",
        "Every cow receives daily nutritious green grass (hara chara), protein-rich cattle feed, wheat bran, pure jaggery, and mineral licks. Our full-time veterinary doctors tend to sick, blind, and paralyzed cows with round-the-clock medication, surgery, and comfortable straw bedding."
      ],
      quote: {
        text: "Serving Gau Mata with your own hands washes away past sins and invites Lakshmi, the goddess of abundance, into your home.",
        author: "Acharya Radheshyam Ji, Mathura Gaushala"
      },
      keyPoints: [
        "Fresh green grass (hara chara), dry straw (bhusa), and nutritious khali-gur provided daily.",
        "Emergency rescue ambulance equipped to rescue cows injured in traffic accidents.",
        "Lifelong shelter for non-milking, elderly, and specially-abled cows — no animal is ever sold or abandoned.",
        "Organic preparation of Panchagavya, promoting soil regeneration and chemical-free agriculture."
      ]
    },
    allocation: [
      { percentage: 65, title: "Fresh Green Grass, Jaggery & Nutrition", desc: "Daily truckloads of fresh green fodder, wheat bran, mustard cake (khali), and jaggery." },
      { percentage: 25, title: "Veterinary Medicines, Surgery & Care", desc: "Wound treatment, antibiotics, digestive tonics, orthopedic splints, and vaccinations." },
      { percentage: 10, title: "Clean Shed Maintenance & Caretaker Seva", desc: "Clean water troughs, fly-repellent smoke, fresh bedding straw, and dedicated gopala seva." }
    ],
    timeline: [
      { step: "01", title: "Dawn Feeding & Milking Ritual", desc: "Cows are gently awakened, sheds are washed, and first round of fresh green fodder is served." },
      { step: "02", title: "Daily Veterinary Rounds", desc: "Veterinary doctors inspect every shed, dress wounds, and administer supplements to ailing calves." },
      { step: "03", title: "Evening Gau Aarti & Jaggery Offering", desc: "Devotees perform traditional Gau Puja and offer jaggery, rotis, and fresh water." }
    ],
    gallery: [
      {
        src: "/images/donations/gau-seva.png",
        title: "Healthy Desi Gir Cows at Sanctuary",
        location: "Surabhi Gaushala, Mathura",
        caption: "Rescued cows enjoying fresh green grass in clean, airy sheds surrounded by trees."
      }
    ],
    donationTiers: [
      { amount: 101, label: "₹101", impact: "Feeds a cow with fresh green fodder and jaggery for a day", popular: false },
      { amount: 251, label: "₹251", impact: "Provides nutritious fodder and grain feed for 3 cows for a day", popular: false },
      { amount: 501, label: "₹501", impact: "Feeds a cow for a whole week with complete nutrition and mineral salts", popular: true },
      { amount: 1001, label: "₹1,001", impact: "Covers emergency medical care, wound dressings, and tonics for an injured cow", popular: false },
      { amount: 2101, label: "₹2,101", impact: "Sponsors 1 month of fresh green grass and health supplements for a rescued calf", popular: false },
      { amount: 5100, label: "₹5,100", impact: "Adopts a cow for an entire month — full food, shelter, doctor care & daily seva", popular: false },
      { amount: 11000, label: "₹11,000", impact: "Sponsors a full truckload (1,500 kg) of fresh green fodder dispatched to the Gaushala", popular: false }
    ],
    faqs: [
      { q: "Are these cows kept even when they stop giving milk?", a: "Yes! Our Gaushalas are 100% non-commercial lifelong sanctuaries. Cows, bulls, and calves live out their natural lives with dignified care until their last breath." },
      { q: "Can I visit the Gaushala?", a: "Absolutely. Donors are always welcome to visit our partner Gaushalas in Mathura, Vrindavan, and Ahmedabad to perform Gau Seva in person." },
      { q: "Will I get photos of the seva performed?", a: "Yes. Every donor receives photographic confirmation of green fodder distribution on WhatsApp." }
    ]
  },

  "vriddha-seva": {
    category: "vriddha-seva",
    type: "seva",
    title: "वृद्ध आश्रम सेवा • Vriddha Seva (Elderly Dignity & Care)",
    subtitle: "Nutritious Meals, Healthcare & Companionship for Abandoned Elders in Vrindavan & Kashi",
    badge: "🙏 Matri-Pitri Seva",
    isUrgent: false,
    heroImage: "/images/donations/vriddha-seva.png",
    donorsCount: 543,
    totalRaised: 289000,
    taxNote: "Registered Ashram Partner • Geriatric Healthcare Support • Dignity in Old Age",
    partnerBadges: ["Vrindavan Matri Seva Trust", "Kashi Moksha Ashram", "Elder Care India", "Vandanam Seva Foundation"],
    impactCounters: [
      { value: "320+", label: "Destitute Elders Sheltered with Love", icon: "👵" },
      { value: "3 Daily", label: "Nutritious Hot Sattvic Meals", icon: "🍲" },
      { value: "100%", label: "Free Geriatric Medicines & Doctor Visits", icon: "💊" },
      { value: "24/7", label: "Dignified, Compassionate Spiritual Home", icon: "🏡" },
    ],
    story: {
      headline: "Honoring Our Elders: Shelter, Warmth & Spiritual Solace",
      subheadline: "मातृ देवो भव, पितृ देवो भव — Treat your mother and father as living divinities (Taittiriya Upanishad).",
      paragraphs: [
        "It is one of the greatest heartbreaks of our society that thousands of elderly mothers and fathers — after sacrificing their entire youth to raise their families — find themselves abandoned in holy towns like Vrindavan, Haridwar, and Varanasi with neither savings nor support.",
        "Many of these elderly women, often widows in frail health, have no one to care for them when they fall ill. They struggle with joint pain, failing eyesight, hypertension, and loneliness.",
        "Our partner ashrams provide these elders with a clean, loving, and permanent home where their dignity is fiercely protected. Here, they receive three warm home-cooked meals every day, soft bedding, clean clothes, daily prescribed medicines, specialized geriatric doctor visits, and an atmosphere filled with devotional bhajans and laughter."
      ],
      quote: {
        text: "When my family forgot me, this ashram embraced me as a mother. I eat warm food, sleep on a clean bed, and chant Radha-Krishna with peace in my heart.",
        author: "Shanti Devi (82 yrs), Ashram Resident, Vrindavan"
      },
      keyPoints: [
        "Warm, soft, easily digestible sattvic meals: khichdi, dalia, steamed vegetables, milk, and seasonal fruits.",
        "Complete regular medicines for diabetes, blood pressure, arthritis, and cardiac ailments.",
        "Cataract surgeries, hearing aids, and orthopedic walker support provided free of cost.",
        "Loving caretakers and daily spiritual satsangs ensuring an uplifting, joy-filled life."
      ]
    },
    allocation: [
      { percentage: 50, title: "Nutritious Daily Meals, Milk & Fruits", desc: "Fresh milk, seasonal soft fruits, lentils, vegetables, and high-protein elderly diet." },
      { percentage: 35, title: "Chronic Medicines & Specialist Healthcare", desc: "Doctor consultations, BP/sugar strips, prescription medicines, and mobility aids." },
      { percentage: 15, title: "Comfortable Bedding, Clothes & Hygiene", desc: "Clean cotton sarees/dhotis, winter blankets, geyser heating, and personal care." }
    ],
    timeline: [
      { step: "01", title: "Morning Health & Tea Routine", desc: "Elders are served herbal tea, milk, and blood sugar checks are recorded by visiting nurses." },
      { step: "02", title: "Nutritious Meals & Satsang", desc: "Fresh lunch is served, followed by rest and afternoon devotional bhajan gatherings." },
      { step: "03", title: "Evening Aarti & Medicine Distribution", desc: "Evening dinner is served and individual medicine dosage boxes are organized for each elder." }
    ],
    gallery: [
      {
        src: "/images/donations/vriddha-seva.png",
        title: "Elders in Peaceful Ashram Courtyard",
        location: "Matri Ashram, Vrindavan",
        caption: "Elderly mothers enjoying warm sunlight, nutritious meals, and shared companionship in a secure home."
      }
    ],
    donationTiers: [
      { amount: 101, label: "₹101", impact: "Provides a full day's nutritious meals, milk, and fruit for an elderly mother", popular: false },
      { amount: 251, label: "₹251", impact: "Covers a monthly health checkup and essential vitamin supplements", popular: false },
      { amount: 501, label: "₹501", impact: "Provides 2 warm fleece blankets and winter clothing for an elderly resident", popular: false },
      { amount: 1001, label: "₹1,001", impact: "Sponsors an entire month of chronic medicines (BP, diabetes, pain relief) for an elder", popular: true },
      { amount: 2101, label: "₹2,101", impact: "Provides full monthly boarding, food, and medical care for an elder", popular: false },
      { amount: 5100, label: "₹5,100", impact: "Funds specialized medical intervention (cataract surgery / eye glasses / mobility aid)", popular: false },
      { amount: 11000, label: "₹11,000", impact: "Ashram Patron: Sponsors complete care, food, and lodging for 5 elders for an entire month", popular: false }
    ],
    faqs: [
      { q: "Where are these elderly ashrams located?", a: "Our partner ashrams are located in Vrindavan and Varanasi, catering specifically to abandoned elderly mothers, widows, and destitute seniors." },
      { q: "Can I sponsor food on my parents' birthday or anniversary?", a: "Yes! Sponsoring meals for ashram elders on your parents' special days brings extraordinary blessings and spiritual satisfaction." },
      { q: "How are medical emergencies handled?", a: "The ashram maintains on-call doctors and direct tie-ups with local charitable hospitals for immediate 24/7 hospitalization if needed." }
    ]
  },

  "mandir-seva": {
    category: "mandir-seva",
    type: "seva",
    title: "मंदिर सेवा • Mandir Seva (Ancient Temple Restoration & Sanrakshan)",
    subtitle: "Restoring Crumbling Historic Shrines, Stone Shikharas & Reigniting Daily Pujas in Forgotten Villages",
    badge: "🛕 Dharma Sanrakshan",
    isUrgent: false,
    heroImage: "/images/donations/mandir-seva.jpg",
    donorsCount: 788,
    totalRaised: 395000,
    taxNote: "Heritage Temple Restoration • Traditional Shilpa Shastra Artisans • Daily Puja Revival",
    partnerBadges: ["Bharatiya Shilpa Sanrakshan", "Ancient Shrines Preservation Trust", "Gramin Mandir Seva", "Vandanam Seva Foundation"],
    impactCounters: [
      { value: "48+", label: "Forgotten Village Temples Restored", icon: "🛕" },
      { value: "100%", label: "Traditional Stone & Lime Shilpa Techniques", icon: "⚒️" },
      { value: "70+", label: "Daily Akhanda Diyas Reignited", icon: "🪔" },
      { value: "45", label: "Rural Purohits Supported with Monthly Seva", icon: "🙏" },
    ],
    story: {
      headline: "Reviving the Living Sacred Heritage of Sanatana Dharma",
      subheadline: "Across rural India, thousands of sacred medieval temples are crumbling in neglect. We restore their stone sanctums and reignite daily worship.",
      paragraphs: [
        "Ancient Hindu temples were not merely prayer halls — they were vibrant epicenters of spiritual energy, community cohesion, classical arts, and dharma. Centuries of invasions, followed by post-independence rural migration, left thousands of profound stone temples in remote villages abandoned and overgrown with banyan roots.",
        "In many forgotten shrines dating back to the Chola, Hoysala, Chandela, and Gupta eras, roofs have collapsed, sanctum deities (murtis) sit in darkness with no daily diya, and impoverished village priests struggle without even oil for the lamps.",
        "Our Mandir Seva mission locates these endangered heritage temples, employs traditional master stone sculptors (shilpis) to restore cracked pillars and stone shikharas without synthetic cement, repairs leaky sanctum roofs, and provides a sustained monthly allowance for daily diya oil, flowers, and priest honorarium to ensure the sound of temple bells echoes once again."
      ],
      quote: {
        text: "Whoever restores a broken temple or relights the lamp in an abandoned sanctum earns the merit of building a thousand new temples.",
        author: "Agni Purana, Temple Restoration Chapter"
      },
      keyPoints: [
        "Authentic stone restoration using traditional lime-mortar, rock carving, and ancient Shilpa Shastra guidelines.",
        "Reigniting daily puja (Nitya Puja) with monthly oil, batti, camphor, and dhoop sponsorship.",
        "Monthly honorarium support (Purohit Sahayata) for dedicated rural temple priests.",
        "Installation of secure gates and solar perimeter lighting to protect ancient stone murtis from theft."
      ]
    },
    allocation: [
      { percentage: 55, title: "Stone Masonry, Shikhara & Roof Restoration", desc: "Traditional shilpi sculptors, stone sourcing, roof waterproofing, and structural repairs." },
      { percentage: 25, title: "Daily Puja Samagri & Akhanda Diya Oil", desc: "Pure sesame/mustard oil, cotton wicks, dhoop, chandan, and daily temple flowers." },
      { percentage: 20, title: "Rural Priest Support & Security Gates", desc: "Monthly purohit dakshina and brass bells, metal security grilles for murti protection." }
    ],
    timeline: [
      { step: "01", title: "Archaeological Assessment & Shuddhi", desc: "Surveying the endangered temple structure, clearing jungle vegetation, and performing purification rituals." },
      { step: "02", title: "Artisan Stone Restoration", desc: "Skilled shilpis carefully chisel and replace broken stone blocks and waterproof sanctum domes." },
      { step: "03", title: "Prana Pratishtha & Daily Puja Revival", desc: "Re-consecrating the sanctum with Vedic chanting and inaugurating uninterrupted daily aarti." }
    ],
    gallery: [
      {
        src: "/images/donations/mandir-seva.jpg",
        title: "Artisans Restoring Ancient Stone Sanctum",
        location: "Heritage Temple Site, Tamil Nadu / Karnataka Border",
        caption: "Master traditional sculptors painstakingly carving and restoring detailed temple pillar reliefs under soft temple lighting."
      }
    ],
    donationTiers: [
      { amount: 101, label: "₹101", impact: "Sponsors pure sesame oil and wicks for sanctum lamps (Akhanda Diya) for 10 days", popular: false },
      { amount: 251, label: "₹251", impact: "Provides full monthly puja samagri (dhoop, camphor, chandan, fresh flowers) for a rural shrine", popular: false },
      { amount: 501, label: "₹501", impact: "Restores a weathered stone pillar relief carving by traditional shilpis", popular: false },
      { amount: 1001, label: "₹1,001", impact: "Provides 1 month of living honorarium (dakshina) to an impoverished rural temple priest", popular: true },
      { amount: 2101, label: "₹2,101", impact: "Repairs and waterproofs a section of a crumbling sanctum (Garbhagriha) roof", popular: false },
      { amount: 5100, label: "₹5,100", impact: "Installs protective brass security gates and solar sanctum lighting for a remote temple", popular: false },
      { amount: 11000, label: "₹11,000", impact: "Temple Sanrakshan Patron: Funds comprehensive sanctum restoration of an ancient village shrine", popular: false }
    ],
    faqs: [
      { q: "How are temples chosen for restoration?", a: "We prioritize ancient historic shrines (100+ years old) in remote villages that have no wealthy patrons or government endowment support." },
      { q: "Are traditional materials used in restoration?", a: "Yes. In strict accordance with the Shilpa Shastras, we use seasoned stone, lime-surkhi mortar, and natural herbs rather than corrosive cement." },
      { q: "Will my family's name be placed at the restored temple?", a: "For contributions of ₹5,100 and above, your name is inscribed on the patron plaque with a special blessing puja performed in your gotra." }
    ]
  },

  "nadi-seva": {
    category: "nadi-seva",
    type: "seva",
    title: "नदी सेवा • Nadi Seva (Sacred River & Ghat Swachhata Abhiyan)",
    subtitle: "Daily Cleaning Drives, Plastic Removal & Eco-Restoration along Maa Ganga, Yamuna & Narmada Ghats",
    badge: "🌊 Pavitra Nadi Seva",
    isUrgent: false,
    heroImage: "/images/donations/nadi-seva.jpg",
    donorsCount: 427,
    totalRaised: 218000,
    taxNote: "Clean River Movement • Certified Plastic Removal • Riverbank Waste Segregation",
    partnerBadges: ["Swachh Ganga Sevak Dal", "Yamuna Restoration Mission", "Pavitra Ghat Samiti", "Vandanam Seva Foundation"],
    impactCounters: [
      { value: "120+ km", label: "Riverbanks & Ghats Cleaned", icon: "🌊" },
      { value: "45 Tonnes", label: "Plastic Waste & Debris Extracted", icon: "♻️" },
      { value: "350+", label: "Youth Volunteers in Daily Action", icon: "🤝" },
      { value: "18", label: "Sacred Ghats Maintained Pristine Daily", icon: "🪷" },
    ],
    story: {
      headline: "Protecting Our Lifelines: Maa Ganga, Yamuna & Narmada",
      subheadline: "नमामि गङ्गे तव पादपङ्कजम् — O Mother Ganga, I bow to your lotus feet. Keeping our sacred rivers clean is the highest duty of every Bharatiya.",
      paragraphs: [
        "In our Vedic heritage, rivers are not merely geological bodies of water — they are living goddesses, divine mothers who have nourished Indian civilization for millennia. A single dip in the sacred waters of Maa Ganga, Yamuna, or Narmada is said to cleanse one's spiritual impurities.",
        "However, millions of pilgrims visiting pilgrimage ghats leave behind thousands of tons of non-biodegradable plastics, synthetic flower bags, discarded clothing, and chemical waste. These choke aquatic life, dirty holy bathing steps, and desecrate the sanctity of our most revered waters.",
        "Our Nadi Seva movement organizes daily early-morning volunteer cleanup teams at major river ghats in Varanasi, Rishikesh, Haridwar, Prayagraj, and Mathura. Equipped with heavy-duty gloves, collection nets, trash skimmers, and bio-segregation bins, our sevaks remove floating debris, scrub algae off slippery stone steps, and conduct public awareness drives to keep our river mothers pristine."
      ],
      quote: {
        text: "To offer prayers to Ganga Maa while allowing plastic to choke her sacred waters is a contradiction. True devotion is keeping her waters as pure as divine nectar.",
        author: "Acharya Devavrat, Ganga Ghat Seva Volunteer"
      },
      keyPoints: [
        "Daily morning trash skimming and bank cleanup operations before pilgrim rush hours.",
        "Deployment of floating eco-barriers at river tributaries to intercept floating plastic waste.",
        "Scrubbing and pressure-washing of historic stone ghat steps to prevent devotee slipping accidents.",
        "Installation of eco-friendly flower disposal pits where puja offerings are converted into organic compost."
      ]
    },
    allocation: [
      { percentage: 50, title: "Cleanup Equipment, Skimmers & Safety Gear", desc: "Trash-skimming boats, heavy-duty collection nets, puncture-proof gloves, and waste bags." },
      { percentage: 30, title: "Waste Segregation, Recycling & Transport", desc: "Transporting collected river plastic to certified recycling facilities and composting organic flora." },
      { percentage: 20, title: "Ghat Hygiene Sevaks & Youth Awareness", desc: "Honorarium for full-time sanitation sevaks and conducting river conservation workshops." }
    ],
    timeline: [
      { step: "01", title: "5:30 AM Sunrise Skimming Drive", desc: "Volunteer boat crews skim floating plastic debris and bottles from the river surface before dawn." },
      { step: "02", title: "7:00 AM Ghat Steps Scrubbing", desc: "Sevaks sweep, scrub, and wash stone steps, clearing silt and discarded clothes." },
      { step: "03", title: "10:00 AM Eco-Composting & Recycling", desc: "Collected marigold flowers are diverted to organic incense pits, and dry plastics are sent for shredding." }
    ],
    gallery: [
      {
        src: "/images/donations/nadi-seva.jpg",
        title: "Morning Ghat Cleanup Drive",
        location: "Kashi Ghats, Varanasi",
        caption: "Devotees and volunteers collecting plastic bottles and debris along the sacred stone steps as the golden sunrise reflects across the river."
      }
    ],
    donationTiers: [
      { amount: 101, label: "₹101", impact: "Clears 50 meters of sacred riverbank and removes 15 kg of toxic plastic", popular: false },
      { amount: 251, label: "₹251", impact: "Provides heavy-duty safety gloves, gumboots, and collection nets for 2 volunteers", popular: false },
      { amount: 501, label: "₹501", impact: "Sponsors a full morning cleanup brigade for an entire sacred ghat section", popular: true },
      { amount: 1001, label: "₹1,001", impact: "Funds 1 week of trash-skimming boat operations extracting riverbed plastics", popular: false },
      { amount: 2101, label: "₹2,101", impact: "Installs a durable stainless-steel eco-collection bin on a busy pilgrim ghat", popular: false },
      { amount: 5100, label: "₹5,100", impact: "Installs a 100-meter floating river barrier intercepting floating plastic at an inlet", popular: false },
      { amount: 11000, label: "₹11,000", impact: "Pavitra Nadi Patron: Sponsors a month-long sustained ghat cleanup campaign along 2 km of river", popular: false }
    ],
    faqs: [
      { q: "Where do these river cleanup drives take place?", a: "Currently active at major pilgrim ghats along the Ganga in Varanasi, Haridwar, Rishikesh, and along the Yamuna in Mathura-Vrindavan." },
      { q: "What happens to the waste collected from the river?", a: "Plastics are segregated and sent to certified recycling plants. Holy flower offerings are segregated into vermicompost pits to create organic fertilizer." },
      { q: "Can I participate in person as a volunteer?", a: "Yes! Donors and devotees are encouraged to join our morning ghat cleanliness drives whenever they visit Varanasi or Haridwar." }
    ]
  }
}
