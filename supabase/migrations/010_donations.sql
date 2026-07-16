-- =============================================
-- 010_donations.sql — Seva Daan Donation Module
-- =============================================

-- DONATIONS CATALOG TABLE (Admin-managed)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL UNIQUE, -- slug e.g. 'bhandara', 'gau-seva'
  title TEXT NOT NULL,           -- "भंडारा • Bhandara"
  subtitle TEXT,                 -- "Annadanam - Feed the Hungry"
  description TEXT,
  emoji TEXT NOT NULL DEFAULT '🙏',
  image_url TEXT,
  suggested_amounts INT[] DEFAULT ARRAY[51, 101, 251, 501, 1001, 2101, 5100],
  min_amount INT DEFAULT 11,
  impact_statement TEXT,         -- "₹101 feeds 10 people for a day"
  donors_count INT DEFAULT 0,
  total_raised BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 99,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DONATION ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.donation_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  donor_name TEXT,
  donor_message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  cashfree_order_id TEXT UNIQUE,
  cashfree_session_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donations are viewable by everyone." ON public.donations FOR SELECT USING (true);
CREATE POLICY "Users can view their own donation orders." ON public.donation_orders FOR SELECT USING (auth.uid() = user_id OR is_anonymous = TRUE);
CREATE POLICY "Anyone can insert donation orders." ON public.donation_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own donation orders." ON public.donation_orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage donations" ON public.donations
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- =============================================
-- SEED: 10 Trending Seva Categories
-- =============================================

INSERT INTO public.donations (category, title, subtitle, description, emoji, image_url, suggested_amounts, min_amount, impact_statement, display_order)
VALUES
  (
    'bhandara',
    'भंडारा • Bhandara',
    'Annadanam — Feed the Hungry',
    'Sponsor a community feast (Bhandara) and earn the highest spiritual merit. In the Vedas, Annadanam — gifting food — is considered the greatest of all donations. Your contribution directly feeds the poor, sadhus, and pilgrims at our temple community kitchens.',
    '🍲',
    NULL,
    ARRAY[51, 101, 251, 501, 1001, 2101, 5100],
    51,
    '₹101 feeds 10 people • ₹501 feeds 50 people • ₹1001 feeds 108 people',
    1
  ),
  (
    'gau-seva',
    'गौ सेवा • Gau Seva',
    'Cow Protection & Care',
    'The cow is revered as a symbol of Dharma. Your donation supports our Gaushala — providing food, shelter, medical care, and love to rescued and abandoned cows. Gau Seva is one of the most meritorious acts in Hindu Dharma.',
    '🐄',
    NULL,
    ARRAY[51, 101, 251, 501, 1001, 2101, 5100],
    51,
    '₹101 feeds a cow for a day • ₹1001 covers a week of medical care',
    2
  ),
  (
    'janwar-seva',
    'जानवर सेवा • Janwar Seva',
    'Stray Animal Rescue & Welfare',
    'Thousands of stray dogs, cats, and animals suffer on the streets without food or medical care. Your donation funds rescue operations, veterinary treatment, sterilization drives, and feeding programs for stray animals in our community.',
    '🐕',
    NULL,
    ARRAY[51, 101, 251, 501, 1001, 2101, 5100],
    51,
    '₹101 feeds 20 strays • ₹501 covers a vet visit • ₹2101 sponsors monthly care',
    3
  ),
  (
    'gav-seva',
    'गाँव सेवा • Gav Seva',
    'Village Development & Rural Uplift',
    'Support underprivileged villages with clean water, sanitation, electricity, and basic infrastructure. Our Gav Seva mission transforms rural India one village at a time, inspired by the Vedic vision of a prosperous and dignified society.',
    '🏘️',
    NULL,
    ARRAY[101, 251, 501, 1001, 2101, 5100, 11000],
    101,
    '₹1001 installs a hand pump • ₹5100 builds a community toilet',
    4
  ),
  (
    'vriddha-seva',
    'वृद्ध आश्रम सेवा • Vriddha Seva',
    'Care for the Elderly',
    'Many elderly people live abandoned and alone with no support. Your donation provides nutritious meals, medicines, warm clothes, and companionship to the elderly living in our ashram. In Dharma, serving the elderly is equivalent to serving God.',
    '👴',
    NULL,
    ARRAY[51, 101, 251, 501, 1001, 2101, 5100],
    51,
    '₹251 feeds an elder for a month • ₹1001 covers monthly medicines',
    5
  ),
  (
    'vidya-daan',
    'विद्या दान • Vidya Daan',
    'Education for Underprivileged Children',
    'Vidya Daan — the gift of education — is considered the highest form of charity. Your donation provides school fees, books, uniforms, and digital tools to children from economically weaker sections. Also supports Vedic pathshalas and Sanskrit gurukuls.',
    '📚',
    NULL,
    ARRAY[101, 251, 501, 1001, 2101, 5100, 11000],
    101,
    '₹501 covers a child''s books for a year • ₹2101 sponsors a child for 6 months',
    6
  ),
  (
    'vriksha-seva',
    'वृक्ष सेवा • Vriksha Seva',
    'Plant a Sacred Tree',
    'In Hindu tradition, trees are living temples. The Peepal, Tulsi, Banyan, and Neem are sacred. Your donation plants trees in temple courtyards, roadsides, and forest areas — contributing to a greener, cooler, and more divine planet.',
    '🌳',
    NULL,
    ARRAY[51, 101, 251, 501, 1001, 2101, 5100],
    51,
    '₹51 plants 1 tree • ₹501 plants 11 trees • ₹5100 creates a mini forest',
    7
  ),
  (
    'nadi-seva',
    'नदी सेवा • Nadi Seva',
    'Sacred River Cleanup',
    'Our sacred rivers — Ganga, Yamuna, Narmada — are the lifelines of Bharatiya civilization. Your donation funds river cleaning drives, ghats restoration, and awareness campaigns to restore the purity and divinity of our holy rivers.',
    '🌊',
    NULL,
    ARRAY[51, 101, 251, 501, 1001, 2101, 5100],
    51,
    '₹101 cleans 100m of riverbank • ₹1001 funds a full cleanup drive',
    8
  ),
  (
    'swasthya-seva',
    'स्वास्थ्य सेवा • Swasthya Seva',
    'Free Medical Aid & Health Camps',
    'Sponsor free medical camps, medicines, diagnostic tests, and health awareness programs in rural and tribal areas where access to healthcare is scarce. Every donation helps a family receive the medical care they deserve.',
    '🏥',
    NULL,
    ARRAY[101, 251, 501, 1001, 2101, 5100, 11000],
    101,
    '₹251 provides medicines for a family • ₹1001 funds a complete health checkup camp',
    9
  ),
  (
    'mandir-seva',
    'मंदिर सेवा • Mandir Seva',
    'Temple Restoration & Maintenance',
    'Ancient temples are living repositories of our culture, art, and spirituality. Many are crumbling and in urgent need of restoration. Your donation helps preserve, renovate, and maintain these sacred spaces for future generations.',
    '🛕',
    NULL,
    ARRAY[101, 251, 501, 1001, 2101, 5100, 11000],
    101,
    '₹501 repairs a portion of a temple wall • ₹5100 restores a full shrine',
    10
  );
