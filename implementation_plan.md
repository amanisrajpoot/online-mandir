# DevMandir — Phase 1 Implementation Plan (v2)

A spiritual marketplace connecting devotees with temples, pandits, and pujas — built with Next.js 15, Supabase, Tailwind CSS v4, and Razorpay.

**Business model**: Religious D2C funnel — User pays ₹301–₹5100+ → Temple performs ritual → Video proof sent → Prasad shipped → Upsell next puja/chadhava → Retain via reels, panchang & notifications.

---

## User Review Required

> [!IMPORTANT]
> **Supabase Project**: You will need to create a Supabase project at [supabase.com](https://supabase.com) and provide the project URL + anon key. The plan assumes you have (or will create) one.

> [!IMPORTANT]
> **Razorpay Keys**: You will need Razorpay test/live API keys for payment integration. The plan uses test mode by default.

> [!WARNING]
> **OTP via SMS**: Supabase supports phone OTP via Twilio. For MVP, we'll implement **email OTP** first (free tier) with a mobile-number-styled UX. SMS OTP can be enabled later by configuring a Twilio provider in Supabase Auth settings.

> [!IMPORTANT]
> **Seed Data**: The plan includes realistic seed data (₹301–₹5100 pricing, 10 temples, 25+ pujas, 6 chadhava types) so the app looks production-ready from day one. All images will be AI-generated.

---

## Open Questions

1. **Domain/Branding**: Do you have a logo or color palette preference? The plan uses a saffron/gold/deep-purple spiritual theme by default.
2. **Multi-language**: Should we build Hindi support into Phase 1, or keep it English-only for now?
3. **Prasad Delivery**: Should we integrate a courier API (Shiprocket/Delhivery) in Phase 1, or just manual tracking entry by admin?

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                     DevMandir                        │
├──────────────────────────────────────────────────────┤
│  Next.js 15 (App Router, TypeScript)                 │
│  ├── /app/(auth)       → Login, OTP, Profile Setup   │
│  ├── /app/(main)       → 5-Tab App Experience        │
│  │   ├── Tab 1: Home   → Banners, Carousels, Orders  │
│  │   ├── Tab 2: Pujas  → Listing, Detail, Booking    │
│  │   ├── Tab 3: Chadhava → Offerings, Detail, Book   │
│  │   ├── Tab 4: Content → Reels (Coming Soon Phase2) │
│  │   └── Tab 5: Profile → Orders, Addresses, Wallet  │
│  ├── /app/(admin)      → Admin Panel                 │
│  └── /app/api          → Server Actions & Routes     │
├──────────────────────────────────────────────────────┤
│  Supabase                                            │
│  ├── Auth (Email/Phone OTP)                          │
│  ├── PostgreSQL (Database + RLS)                     │
│  ├── Storage (Images, Videos)                        │
│  ├── Edge Functions (Webhooks)                       │
│  └── Realtime (Order updates)                        │
├──────────────────────────────────────────────────────┤
│  Razorpay (Payments — UPI, Card, Wallet, Netbanking) │
│  Tailwind CSS v4 (Styling, CSS-first config)         │
│  Framer Motion (Animations, page transitions)        │
│  TanStack Query (Data Fetching, caching)             │
│  Recharts (Admin charts)                             │
│  Lucide React (Icons)                                │
└──────────────────────────────────────────────────────┘
```

### LifeGuru Feature Coverage Matrix

| LifeGuru Feature | Phase 1 | Phase 2 | Phase 3 |
|-----------------|---------|---------|---------|
| OTP Login | ✅ | | |
| Home (Banners, Carousels, Orders) | ✅ | | |
| Temple Directory | ✅ | | |
| Puja Listing + Categories | ✅ | | |
| Puja Detail (FOMO, Benefits, Process) | ✅ | | |
| Puja Booking + Sankalp | ✅ | | |
| Razorpay Payments | ✅ | | |
| Order Tracking (7 states) | ✅ | | |
| Chadhava (Full tab + booking) | ✅ | | |
| Daily Panchang | ✅ | | |
| Admin Panel (CRUD everything) | ✅ | | |
| Puja Video Upload/Viewing | | ✅ | |
| Prasad Courier Integration | | ✅ | |
| Push Notifications | | ✅ | |
| Referral System | | ✅ | |
| Reels/Content Feed | | | ✅ |
| Astrology (Chat/Call) | | | ✅ |
| Live Temple Darshan | | | ✅ |
| AI Guru Chat | | | ✅ |

---

## Proposed Changes

### 1. Project Scaffolding & Configuration

#### [NEW] Project root files

**Setup Next.js 15 project** with TypeScript, Tailwind v4, and ESLint.

| File | Purpose |
|------|---------|
| `package.json` | Dependencies: next, react, @supabase/ssr, @supabase/supabase-js, razorpay, framer-motion, @tanstack/react-query, lucide-react, date-fns, recharts |
| `postcss.config.mjs` | PostCSS with `@tailwindcss/postcss` |
| `.env.local.example` | Template for Supabase URL, keys, Razorpay keys |
| `next.config.ts` | Image domains (Supabase storage), redirects |
| `middleware.ts` | Supabase auth session refresh, route protection for `/book/*`, `/orders/*`, `/profile/*`, `/admin/*` |

---

### 2. Design System & Global Styles

#### [NEW] `src/app/globals.css`

CSS-first Tailwind v4 configuration with custom design tokens:

```css
@import "tailwindcss";

@theme {
  /* Spiritual color palette — Saffron/Gold/Deep Purple */
  --color-saffron-50: #fff7ed;
  --color-saffron-100: #ffedd5;
  --color-saffron-200: #fed7aa;
  --color-saffron-300: #fdba74;
  --color-saffron-400: #fb923c;
  --color-saffron-500: #f97316;
  --color-saffron-600: #ea580c;
  --color-saffron-700: #c2410c;
  --color-temple-gold: #d4a843;
  --color-temple-gold-light: #f0d78c;
  --color-sacred-red: #dc2626;
  --color-auspicious-green: #16a34a;
  --color-deep-purple: #581c87;
  --color-deep-purple-light: #7c3aed;

  /* Dark spiritual surfaces */
  --color-mandir-bg: #0f0a1a;
  --color-mandir-surface: #1a1128;
  --color-mandir-card: #241a35;
  --color-mandir-card-hover: #2e2244;
  --color-mandir-border: #3d2a5c;
  --color-mandir-text: #e8e0f0;
  --color-mandir-text-muted: #9b8fb5;

  /* Typography */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-devanagari: 'Tiro Devanagari Hindi', serif;

  /* Spacing & radius */
  --radius-card: 1rem;
  --radius-button: 0.75rem;
  --radius-full: 9999px;
}
```

**Design Philosophy**: Rich dark mode with saffron/gold accents, glassmorphism cards, temple-inspired ornamental borders, and smooth micro-animations. Premium spiritual aesthetic — the user should feel like they're entering a sacred digital space.

---

### 3. Supabase Client Setup

#### [NEW] `src/lib/supabase/client.ts`
Browser-side Supabase client using `createBrowserClient` from `@supabase/ssr`.

#### [NEW] `src/lib/supabase/server.ts`
Server-side Supabase client using `createServerClient` with cookie handling for App Router.

#### [NEW] `src/lib/supabase/middleware.ts`
Session refresh logic called from `middleware.ts`.

---

### 4. Database Schema (Supabase Migrations)

#### [NEW] `supabase/migrations/001_initial_schema.sql`

**Enums**:

```sql
CREATE TYPE user_role AS ENUM ('devotee', 'temple_admin', 'pandit', 'astrologer', 'admin');
CREATE TYPE order_status AS ENUM ('booked', 'assigned', 'in_progress', 'completed', 'video_uploaded', 'prasad_shipped', 'delivered', 'cancelled');
CREATE TYPE order_type AS ENUM ('puja', 'chadhava');
CREATE TYPE puja_category_type AS ENUM ('health', 'wealth', 'marriage', 'career', 'protection', 'dosh_nivaran');
CREATE TYPE chadhava_type AS ENUM ('deep_daan', 'pushp', 'vastra', 'tel', 'bhog', 'milk_abhishek', 'rudrabhishek');
CREATE TYPE shipment_status AS ENUM ('pending', 'shipped', 'in_transit', 'delivered');
```

**Tables** (with Row Level Security):

| Table | Key Columns | RLS |
|-------|------------|-----|
| `profiles` | id (FK → auth.users), name, mobile, email, gender, dob, avatar_url, role | Users read own; admins read all |
| `temples` | id, name, slug, city, state, deity, description, latitude, longitude, image_url, rating, review_count, is_active | Public read; admin write |
| `temple_images` | id, temple_id, image_url, caption, display_order | Public read |
| `puja_categories` | id, name, slug, icon, description, display_order | Public read |
| `pujas` | id, temple_id, category_id, title, slug, price, discount_price, description, **problem_statement**, benefits (jsonb array), **whats_included** (jsonb array), duration, ritual_process (jsonb steps), image_url, **countdown_end** (timestamp), is_active, is_featured, review_count, avg_rating | Public read; admin write |
| `puja_faqs` | id, puja_id, question, answer, display_order | Public read |
| **`chadhava_items`** | id, temple_id, type (chadhava_type enum), title, description, price, benefits, image_url, is_active | Public read; admin write |
| `orders` | id, user_id, puja_id (nullable), **chadhava_item_id** (nullable), **order_type** (enum: puja/chadhava), status, amount, discount_amount, final_amount, payment_id, razorpay_order_id, **expected_completion** (timestamp), created_at | User reads own; admin reads all |
| `sankalp_details` | id, order_id, devotee_name, gotra, wish, sankalp_name | Linked to order owner |
| `delivery_addresses` | id, order_id (nullable), user_id, name, phone, address_line, city, state, pincode, is_default | Linked to user |
| `order_status_history` | id, order_id, from_status, to_status, note, changed_by, created_at | Linked to order owner |
| `puja_videos` | id, order_id, video_url, thumbnail_url, uploaded_at | Linked to order owner |
| `prasad_shipments` | id, order_id, courier, tracking_number, tracking_url, status, shipped_at, delivered_at | Linked to order owner |
| `reviews` | id, user_id, puja_id, temple_id, order_id, rating, comment, is_verified, created_at | Public read; user writes own |
| `banners` | id, title, subtitle, image_url, link_url, link_type (puja/chadhava/temple/external), display_order, is_active, starts_at, ends_at | Public read; admin write |
| `daily_panchang` | id, date, tithi, nakshatra, yoga, karana, rahukaal, sunrise, sunset, moonrise, shubh_muhurat | Public read |
| `festivals` | id, name, date, description, image_url, is_major | Public read |
| `notifications` | id, user_id, title, body, link_url, is_read, created_at | User reads own |
| `coupons` | id, code, discount_percent, max_discount, min_order, valid_from, valid_till, usage_limit, used_count, is_active | Authenticated read; admin write |

**Order Status Flow**:
```
booked → assigned → in_progress → completed → video_uploaded → prasad_shipped → delivered
                                                                                     ↑
                                                              (any state) → cancelled ─┘
```

---

### 5. Authentication Flow

#### [NEW] `src/app/(auth)/layout.tsx`
- Full-screen spiritual background with animated floating diyas
- Centered auth card with glassmorphism

#### [NEW] `src/app/(auth)/login/page.tsx`
- Brand logo + "DevMandir" heading
- Tagline: "Your Spiritual Companion"
- Mobile number input with +91 prefix (styled as phone entry)
- "Send OTP" button → calls Supabase `signInWithOtp({ email })` (email constructed from phone: `{phone}@devmandir.app`)
- Trust badges: "Secure Payments", "Verified Temples", "10,000+ Devotees"

#### [NEW] `src/app/(auth)/verify/page.tsx`
- 6-digit OTP input with individual boxes, auto-advance between digits
- Countdown timer for resend (30s)
- Verify button → `verifyOtp()`
- Auto-redirect to profile setup if new user, home if existing

#### [NEW] `src/app/(auth)/profile-setup/page.tsx`
- Name, DOB (date picker), Gender (radio pills)
- Optional: Gotra selection (reusable for bookings)
- Upserts into `profiles` table
- Redirects to home

#### [NEW] `src/app/auth/callback/route.ts`
- Server-side auth callback handler for OTP token exchange

---

### 6. Home Screen — Tab 1: "Home"

#### [NEW] `src/app/(main)/page.tsx`

Mirrors LifeGuru home exactly. Widgets (top to bottom):

1. **Hero Banner Carousel** — Auto-sliding cards:
   - Featured puja (e.g., "Sarva Rog Nivaran — ₹301")
   - Limited-time puja with countdown
   - Festival-based offerings
   - Parallax effect, swipe dots indicator

2. **Temple Carousel** — Horizontal scrollable temple cards:
   - Maha Mrityunjay Mandir, Varanasi
   - Trimbakeshwar Jyotirlinga, Nashik
   - Hanuman Garhi, Ayodhya
   - Maa Baglamukhi Mandir, Datia
   - Glassmorphism cards with temple image + deity + city

3. **Trending Pujas Grid** — 2-column with:
   - Puja image
   - Benefit headline
   - Temple name
   - ₹ Price (strikethrough original)
   - **Countdown timer** ("Ends in 3 days")
   - "Book Now" CTA

4. **Chadhava Quick-Select** — Horizontal category pills:
   - 🪔 Deep Daan
   - 🌺 Pushp
   - 🧴 Tel
   - 👘 Vastra
   - 🍲 Bhog
   - Each links to chadhava detail

5. **Daily Panchang Widget** — Card with:
   - Today's Tithi, Nakshatra, Rahukaal
   - Sunrise/Sunset times
   - Shubh Muhurat

6. **My Current Orders** — (if logged in):
   - Compact order cards
   - Status: Booked / In Progress / Completed / Prasad Shipped
   - Quick link to order tracking

7. **Festival Countdown** — Next major festival with countdown timer

8. **CTA Banners** — "Talk to an Astrologer" (Phase 3 teaser, Coming Soon badge)

#### [NEW] Component files:
- `src/components/home/HeroBanner.tsx` — Auto-carousel with parallax
- `src/components/home/TempleCarousel.tsx` — Horizontal scroll
- `src/components/home/TrendingPujas.tsx` — Grid with countdown
- `src/components/home/ChadhavaQuickSelect.tsx` — Category pills
- `src/components/home/PanchangWidget.tsx` — Daily info card
- `src/components/home/CurrentOrders.tsx` — Mini order tracker
- `src/components/home/FestivalCountdown.tsx` — Timer widget

---

### 7. Puja Listing & Details — Tab 2: "Mandir Puja"

This is the **most important revenue page**.

#### [NEW] `src/app/(main)/pujas/page.tsx`

- **Category Filter Tabs** (horizontal scroll):
  - 🏥 Health
  - 💰 Wealth
  - 💍 Marriage
  - 💼 Career
  - 🛡️ Protection
  - ⭐ Dosh Nivaran
- Search with autocomplete suggestions
- Sort: Price (low→high), Popularity, Newest
- **Puja Listing Cards** (LifeGuru style):
  - Puja image (full-width card image)
  - Benefit headline (e.g., "Freedom from all diseases")
  - Temple name
  - Price: ~~₹1001~~ **₹301**
  - **Countdown timer** ("Ends in 4 days") — FOMO element
  - "Book Now" CTA button
- Infinite scroll with TanStack Query

#### [NEW] `src/app/(main)/pujas/[slug]/page.tsx` — **Deep-dive page (LifeGuru Sarva Rog Nivaran style)**

**Section 1 — Hero**:
- Puja name (large heading)
- Temple name with link
- Price: ~~₹1001~~ **₹301** (prominent discount)
- **Countdown timer** with urgency text ("Offer ends in 4 days")
- Star rating + review count
- Gradient overlay on hero image

**Section 2 — Problem Statement**:
- Emotional relevance copy
- e.g., "Are you or your loved ones suffering from health issues, illness, or slow recovery?"
- Relatable pain points that create urgency
- Icon-decorated list

**Section 3 — Benefits (Sell Outcome, Not Ritual)**:
- ✅ Better health & disease protection
- ✅ Positive energy in home
- ✅ Lord Shiva's blessings
- ✅ Removal of negative influences
- Icon + text list, visually prominent

**Section 4 — What's Included** (conversion section):
- ✅ Complete Puja performed at temple
- ✅ Video recording of your puja
- ✅ Sankalp in your Name & Gotra
- ✅ Temple Prasad delivered to your door
- ✅ Pandit with 15+ years experience
- Checkmark list with green accents

**Section 5 — Ritual Details (Operational Transparency)**:
- Step-by-step timeline:
  1. Sankalp with your name & gotra
  2. 1008 Maha Mrityunjay Jaap
  3. Havan with sacred herbs
  4. Aarti & Prasad blessing
- Temple location info
- Pandit credentials

**Section 6 — Temple Details** (Accordion):
- Temple images carousel
- History & significance
- Location with map preview

**Section 7 — FAQs** (Accordion):
- Common questions about the puja
- Delivery, timing, process

**Section 8 — Reviews**:
- Star distribution bar chart
- Individual review cards with verified badge
- "Write a Review" (post-completion only)

**Section 9 — Sticky Bottom Bar**:
- Price: ~~₹1001~~ **₹301**
- "Book Now" button (full-width, saffron gradient)
- Animates in on scroll past hero

---

### 8. Chadhava — Tab 3: "Chadhava"

Low-ticket entry product / micro-transaction engine. LifeGuru uses this to convert users who aren't ready for full pujas.

#### [NEW] `src/app/(main)/chadhava/page.tsx`

- Temple selector at top (horizontal carousel)
- **Chadhava Type Grid** — 2-column cards:
  - 🪔 **Deep Daan** — ₹51
  - 🌺 **Pushp Arpan** — ₹101
  - 👘 **Vastra Daan** — ₹151
  - 🧴 **Tel Abhishek** — ₹101
  - 🍲 **Bhog Prasad** — ₹201
  - 🔱 **Rudrabhishek** — ₹501
- Each card shows: Icon, Name, Temple, Price, "Offer" CTA

#### [NEW] `src/app/(main)/chadhava/[id]/page.tsx`

- Hero with chadhava type image
- Temple info
- Price (prominent)
- Description & significance
- Benefits (spiritual meaning)
- What you get:
  - ✅ Video of offering at temple
  - ✅ Blessing in your name
  - ✅ Prasad delivered (optional, extra charge)
- "Offer Now" CTA → opens booking form

#### [NEW] `src/app/(main)/chadhava/book/[id]/page.tsx`

Simplified booking (fewer steps than puja):
- **Step 1**: Devotee Name, Gotra (optional for chadhava)
- **Step 2**: Prasad delivery? (Yes/No toggle, address if yes)
- **Step 3**: Payment via Razorpay
- → Confirmation page (reuses puja confirmation component)

#### [NEW] Component files:
- `src/components/chadhava/ChadhavaCard.tsx`
- `src/components/chadhava/ChadhavaDetail.tsx`

---

### 9. Content/Reels — Tab 4: "Content" (Coming Soon)

Phase 2/3 feature, but we build the tab placeholder now to establish the 5-tab navigation.

#### [NEW] `src/app/(main)/content/page.tsx`

- Beautiful "Coming Soon" page with:
  - Animated spiritual mandala
  - "Bhajans, Aarti, Temple Stories & More"
  - "We're bringing you spiritual reels, mantras, and dharma education"
  - "Notify Me" email capture
  - Preview cards showing what's coming (Bhajan, Aarti, Mythology, Mantras)

---

### 10. Astrology — Accessible from Home CTA (Coming Soon)

#### [NEW] `src/app/(main)/astrology/page.tsx`

- "Coming Soon" page with:
  - "Chat with Expert Astrologers"
  - Features preview: Kundli, Tarot, Matchmaking, Daily Horoscope
  - "Notify Me" capture
  - Teaser cards for astrologer profiles

---

### 11. Temple Directory

#### [NEW] `src/app/(main)/temples/page.tsx`
- Search bar with debounced Supabase full-text search
- Filter chips: City, Deity, Popularity
- Temple cards in responsive grid showing:
  - Temple image
  - Name, City, State
  - Primary deity
  - Rating + review count
  - Number of available pujas
- Infinite scroll with TanStack Query

#### [NEW] `src/app/(main)/temples/[slug]/page.tsx`
- Hero image gallery (swipeable)
- Temple name, city, deity badges
- Rating + review count
- History & description (rich text)
- Map embed (Google Maps static or iframe)
- **Available Pujas** — linked puja cards
- **Available Chadhava** — linked chadhava cards
- Reviews section
- "Book a Puja at this Temple" floating CTA

---

### 12. Booking Flow (Shared for Puja & Chadhava)

#### [NEW] `src/app/(main)/book/[pujaId]/page.tsx`

Multi-step form with animated transitions (Framer Motion):

**Step 1 — Sankalp Details**:
- Devotee Name
- Gotra (dropdown: Bharadwaj, Kashyap, Vashishtha, Gautam, Atri, Vishwamitra, Jamadagni, Agastya, etc.)
- Sankalp Name
- Special Wish (textarea, max 200 chars)
- Mobile number (pre-filled from profile)

**Step 2 — Prasad Delivery Address**:
- Full Name, Phone
- Address Line 1 & 2
- City, State (dropdown of Indian states), Pincode
- "Use saved address" toggle (if addresses exist)
- "Save this address" checkbox

**Step 3 — Order Summary**:
- Puja/Chadhava details recap card
- Sankalp details recap
- Price breakdown:
  - Base price: ₹301
  - Prasad delivery: ₹49
  - Discount: -₹0
  - **Total: ₹350**
- Coupon code input with "Apply" button
- Trust badges row

**Step 4 — Payment**:
- Razorpay checkout trigger
- Loading state with animated diya lamp
- UPI, Card, Wallet, Netbanking options (Razorpay handles UI)

#### [NEW] `src/app/(main)/book/confirmation/page.tsx`
- Animated success: confetti particles + bell sounds
- Order number with copy-to-clipboard
- Expected completion date
- What happens next timeline:
  1. "Pandit will be assigned within 24 hours"
  2. "Puja will be performed at [Temple]"
  3. "Video of your puja will be shared"
  4. "Prasad will be shipped to your address"
- "Track Order" primary CTA
- "Book Another Puja" secondary CTA
- Share on WhatsApp button

---

### 13. Order Tracking

#### [NEW] `src/app/(main)/orders/page.tsx`
- Tab filters: Active, Completed, All
- Order cards showing:
  - Puja/Chadhava name + image thumbnail
  - Temple name
  - Status badge (color-coded)
  - Date, Amount
  - Quick action: "Track" or "Rebook"

#### [NEW] `src/app/(main)/orders/[id]/page.tsx`
- **Vertical Stepper Timeline** showing all status transitions:
  - ✅ Booked (date, time)
  - ✅ Pandit Assigned (pandit name)
  - 🔄 Puja In Progress
  - ⏳ Completed
  - ⏳ Video Uploaded
  - ⏳ Prasad Shipped
  - ⏳ Delivered
- Current status highlighted with pulse animation
- **Video Player** card (when video_uploaded) — embedded player
- **Prasad Tracking** — courier name + tracking link
- Order details card (sankalp, address)
- **"Rebook this Puja"** button → pre-fills booking form
- Real-time status updates via Supabase Realtime subscriptions

---

### 14. Payment Integration (Razorpay)

#### [NEW] `src/app/api/payments/create-order/route.ts`
- Validates order data
- Creates DB order with status `booked`
- Creates Razorpay order with amount (in paise), receipt
- Stores `razorpay_order_id` on the order
- Returns order_id + razorpay details to client

#### [NEW] `src/app/api/payments/verify/route.ts`
- Receives razorpay_payment_id, razorpay_order_id, razorpay_signature
- Verifies signature (HMAC SHA256 with secret)
- Updates order: payment_id, status to `booked`
- Returns confirmation

#### [NEW] `src/lib/razorpay.ts`
- Razorpay SDK initialization (server-side)
- Utility: create order, verify signature

#### [NEW] `src/components/payment/RazorpayCheckout.tsx`
- Dynamic Razorpay script loader
- Checkout options: key, amount, currency INR, order_id, prefill (name, email, contact)
- Theme: color saffron
- Success/failure/dismiss handlers

---

### 15. User Dashboard — Tab 5: "Profile"

#### [NEW] `src/app/(main)/profile/page.tsx`
- Profile card: avatar, name, member since date
- Quick stats row: Total Orders, Active Orders, Total Spent
- Menu items (icon + label + arrow):
  - 📦 My Orders
  - 📍 Saved Addresses
  - 🔔 Notifications
  - 💰 Wallet & Refunds (Coming Soon badge)
  - 🎁 Refer & Earn (Coming Soon badge)
  - ⚙️ Settings
  - 🚪 Logout

#### [NEW] `src/app/(main)/profile/addresses/page.tsx`
- CRUD for saved addresses
- Default address badge
- "Add New Address" floating button

#### [NEW] `src/app/(main)/profile/notifications/page.tsx`
- Notification list with read/unread states
- Types: order_update, promotion, panchang_reminder
- Mark all read button

---

### 16. Admin Panel

#### [NEW] `src/app/(admin)/layout.tsx`
- Collapsible sidebar navigation:
  - 📊 Dashboard
  - 🛕 Temples
  - 🪔 Pujas
  - 🌺 Chadhava
  - 📦 Orders
  - 🖼️ Banners
  - 📅 Panchang
  - 🎟️ Coupons
  - 👤 Users
- Top bar: admin name, role badge, notifications bell
- Role check: redirects non-admin users to home

#### [NEW] `src/app/(admin)/dashboard/page.tsx`
- **Revenue chart** (Recharts, last 30 days line chart)
- **Stat cards**: Total Revenue, Orders Today, Active Orders, Conversion Rate
- **Recent Orders table** (last 20, sortable)
- **Top Temples** by revenue (bar chart)
- **Order Status Distribution** (donut chart)

#### [NEW] `src/app/(admin)/temples/page.tsx`
- Data table: search, filter by city/state, pagination
- Create/Edit temple modal with:
  - Name, slug, city, state, deity, description
  - Location (lat/lng)
  - Image upload to Supabase Storage
  - Gallery images upload
- Activate/Deactivate toggle
- View temple's pujas shortcut

#### [NEW] `src/app/(admin)/pujas/page.tsx`
- Data table with temple & category filters
- Create/Edit puja form (full page or large modal):
  - Title, slug, temple (dropdown), category
  - Price, discount_price
  - Problem statement (textarea)
  - Benefits (dynamic list builder)
  - What's included (dynamic list builder)
  - Ritual process (step builder)
  - Duration
  - Countdown end date (optional)
  - Image upload
  - FAQs builder (add/remove Q&A pairs)
- Toggle: is_active, is_featured

#### [NEW] `src/app/(admin)/chadhava/page.tsx`
- Data table with temple & type filters
- Create/Edit chadhava item modal:
  - Type (dropdown: deep_daan, pushp, vastra, tel, bhog, etc.)
  - Temple (dropdown)
  - Title, description, benefits
  - Price
  - Image upload
- Activate/Deactivate toggle

#### [NEW] `src/app/(admin)/orders/page.tsx`
- Data table with:
  - Status filter (all states)
  - Order type filter (puja/chadhava)
  - Date range picker
  - Search by order ID, user name
- Order detail drawer showing:
  - Full sankalp details
  - Delivery address
  - Payment info
  - Status history timeline
- Actions:
  - Assign Pandit (dropdown)
  - Update Status (next state button)
  - Upload Video (file upload)
  - Add Tracking (courier + tracking number)
  - Refund / Cancel

#### [NEW] `src/app/(admin)/banners/page.tsx`
- Banner list with drag-and-drop ordering
- Create/Edit: title, subtitle, image upload, link (puja/chadhava/temple/URL), schedule (start/end dates)
- Preview card

#### [NEW] `src/app/(admin)/panchang/page.tsx`
- Calendar view of panchang entries
- Create/Edit daily entry: tithi, nakshatra, rahukaal, yoga, sunrise, sunset, etc.
- Bulk import option

#### [NEW] `src/app/(admin)/coupons/page.tsx`
- Coupon CRUD: code, discount %, max discount, min order, validity, usage limit
- Usage stats per coupon

---

### 17. Shared Components

#### [NEW] Layout components:

| Component | File | Purpose |
|-----------|------|---------|
| `Navbar` | `src/components/layout/Navbar.tsx` | Top nav: logo, search icon, notification bell, profile avatar |
| `BottomNav` | `src/components/layout/BottomNav.tsx` | **5-tab mobile bottom bar**: 🏠 Home, 🪔 Pujas, 🌺 Chadhava, 📺 Content, 👤 Profile |
| `Footer` | `src/components/layout/Footer.tsx` | Desktop footer: links, trust badges, social |
| `AdminSidebar` | `src/components/layout/AdminSidebar.tsx` | Collapsible admin sidebar |

#### [NEW] UI components:

| Component | File | Purpose |
|-----------|------|---------|
| `Button` | `src/components/ui/Button.tsx` | Variants: primary (saffron gradient), secondary, ghost, danger |
| `Card` | `src/components/ui/Card.tsx` | Glassmorphism card with hover glow |
| `Input` | `src/components/ui/Input.tsx` | Styled input with label, error state |
| `Select` | `src/components/ui/Select.tsx` | Styled dropdown |
| `Textarea` | `src/components/ui/Textarea.tsx` | Styled textarea |
| `Modal` | `src/components/ui/Modal.tsx` | Animated modal with backdrop blur |
| `Drawer` | `src/components/ui/Drawer.tsx` | Slide-in panel (mobile-friendly) |
| `Badge` | `src/components/ui/Badge.tsx` | Status badges (color-coded) |
| `Stepper` | `src/components/ui/Stepper.tsx` | Multi-step progress indicator |
| `StatusTimeline` | `src/components/ui/StatusTimeline.tsx` | Vertical order tracking stepper |
| `Rating` | `src/components/ui/Rating.tsx` | Star rating display + interactive |
| `CountdownTimer` | `src/components/ui/CountdownTimer.tsx` | FOMO countdown timer |
| `Skeleton` | `src/components/ui/Skeleton.tsx` | Loading skeleton states |
| `Toast` | `src/components/ui/Toast.tsx` | Notification toasts |
| `DataTable` | `src/components/ui/DataTable.tsx` | Admin sortable/filterable tables |
| `ImageUpload` | `src/components/ui/ImageUpload.tsx` | Drag-drop with Supabase Storage |
| `Accordion` | `src/components/ui/Accordion.tsx` | Collapsible FAQ sections |
| `Carousel` | `src/components/ui/Carousel.tsx` | Horizontal scroll carousel |
| `EmptyState` | `src/components/ui/EmptyState.tsx` | Empty list illustrations |
| `ComingSoon` | `src/components/ui/ComingSoon.tsx` | Reusable coming soon section |

---

### 18. Seed Data

#### [NEW] `supabase/seed.sql`

Comprehensive seed data matching LifeGuru's offerings:

**10 Temples**:

| Temple | City | State | Deity |
|--------|------|-------|-------|
| Maha Mrityunjay Mandir | Varanasi | UP | Lord Shiva |
| Trimbakeshwar Jyotirlinga | Nashik | Maharashtra | Lord Shiva |
| Hanuman Garhi | Ayodhya | UP | Lord Hanuman |
| Maa Baglamukhi Mandir | Datia | MP | Maa Baglamukhi |
| Kashi Vishwanath | Varanasi | UP | Lord Shiva |
| Mahakaleshwar | Ujjain | MP | Lord Shiva |
| Siddhivinayak | Mumbai | Maharashtra | Lord Ganesha |
| Tirupati Balaji | Tirumala | AP | Lord Venkateswara |
| Kedarnath | Rudraprayag | Uttarakhand | Lord Shiva |
| Somnath | Gir Somnath | Gujarat | Lord Shiva |

**6 Puja Categories**: Health, Wealth, Marriage, Career, Protection, Dosh Nivaran

**25+ Pujas** (with LifeGuru-style pricing):

| Puja | Temple | Category | Price | Original |
|------|--------|----------|-------|----------|
| Sarva Rog Nivaran Puja | Maha Mrityunjay Mandir | Health | ₹301 | ₹1001 |
| Maha Mrityunjay Jaap (1008) | Kashi Vishwanath | Health | ₹501 | ₹1501 |
| Kaal Sarp Dosh Nivaran | Trimbakeshwar | Dosh Nivaran | ₹1100 | ₹2100 |
| Mangal Dosh Nivaran | Mahakaleshwar | Dosh Nivaran | ₹751 | ₹1501 |
| Navgraha Shanti Puja | Kashi Vishwanath | Protection | ₹901 | ₹2001 |
| Rudrabhishek | Kedarnath | Health | ₹1100 | ₹2100 |
| Satyanarayan Katha | Siddhivinayak | Wealth | ₹501 | ₹1001 |
| Lakshmi Puja | Siddhivinayak | Wealth | ₹551 | ₹1101 |
| Vivah Puja (Marriage) | Maa Baglamukhi | Marriage | ₹1100 | ₹2501 |
| Baglamukhi Puja | Maa Baglamukhi | Protection | ₹1501 | ₹3001 |
| Hanuman Chalisa Path | Hanuman Garhi | Protection | ₹301 | ₹701 |
| Sundarkand Path | Hanuman Garhi | Career | ₹501 | ₹1101 |
| Career Success Puja | Kashi Vishwanath | Career | ₹701 | ₹1501 |
| Shani Dosh Nivaran | Mahakaleshwar | Dosh Nivaran | ₹901 | ₹1801 |
| Rahu-Ketu Dosh Puja | Trimbakeshwar | Dosh Nivaran | ₹1100 | ₹2100 |
| Griha Shanti Puja | Kashi Vishwanath | Protection | ₹751 | ₹1501 |
| Pitra Dosh Nivaran | Trimbakeshwar | Dosh Nivaran | ₹1100 | ₹2501 |
| Maha Lakshmi Puja | Tirupati Balaji | Wealth | ₹1501 | ₹3001 |
| Ganesh Chaturthi Special | Siddhivinayak | Wealth | ₹501 | ₹1001 |
| Santan Gopal Puja | Kashi Vishwanath | Marriage | ₹1100 | ₹2501 |
| Vastu Dosh Nivaran | Mahakaleshwar | Protection | ₹901 | ₹1801 |
| Navaratri Special Puja | Maa Baglamukhi | Protection | ₹701 | ₹1501 |
| Somnath Abhishek | Somnath | Health | ₹1100 | ₹2100 |
| Kedarnath Rudrabhishek | Kedarnath | Health | ₹2100 | ₹5100 |
| Tirupati Darshan Puja | Tirupati Balaji | Wealth | ₹1501 | ₹3001 |

Each puja includes: problem_statement, benefits array, whats_included array, ritual_process steps, 3-4 FAQs.

**Chadhava Items** (per temple, micro-transaction pricing):

| Type | Price | Description |
|------|-------|-------------|
| Deep Daan | ₹51 | Light a sacred lamp at the temple |
| Pushp Arpan | ₹101 | Offer fresh flowers to the deity |
| Vastra Daan | ₹151 | Offer sacred cloth to the deity |
| Tel Abhishek | ₹101 | Sacred oil abhishek on Shivling |
| Bhog Prasad | ₹201 | Offer Bhog and receive blessed Prasad |
| Milk Abhishek | ₹151 | Sacred milk abhishek on Shivling |

(Available at all 10 temples = 60 chadhava items)

**Banners**: 5 hero banners with festival themes & featured pujas

**Panchang**: 30 days of panchang data (auto-generated)

**Festivals**: Next 10 major Hindu festivals with dates

---

## User Journey Funnels (Implemented)

### Funnel A — Direct Purchase
```
Home Hero Banner → Puja Detail (FOMO countdown) → Book → Pay ₹301 → Confirmation → Track → Video → Prasad → Upsell next puja
```

### Funnel B — Temple Browse
```
Temple Directory → Temple Profile → Available Pujas → Puja Detail → Book → Pay → Track
```

### Funnel C — Chadhava Entry (Low-ticket conversion)
```
Chadhava Tab → ₹51 Deep Daan → Book → Pay → Confirmation → Notification → Full Puja Upsell
```

### Funnel D — Category Browse
```
Puja Tab → Health Category → Sarva Rog Nivaran → Problem resonates → Book → Pay
```

---

## File Structure

```
online-mandir/
├── public/
│   ├── fonts/
│   └── images/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── verify/page.tsx
│   │   │   └── profile-setup/page.tsx
│   │   ├── (main)/
│   │   │   ├── page.tsx                       # Home (Tab 1)
│   │   │   ├── layout.tsx                     # Main layout with nav
│   │   │   ├── pujas/                         # Tab 2: Mandir Puja
│   │   │   │   ├── page.tsx                   # Puja listing
│   │   │   │   └── [slug]/page.tsx            # Puja details
│   │   │   ├── chadhava/                      # Tab 3: Chadhava
│   │   │   │   ├── page.tsx                   # Chadhava listing
│   │   │   │   ├── [id]/page.tsx              # Chadhava details
│   │   │   │   └── book/[id]/page.tsx         # Chadhava booking
│   │   │   ├── content/                       # Tab 4: Content
│   │   │   │   └── page.tsx                   # Coming Soon
│   │   │   ├── temples/
│   │   │   │   ├── page.tsx                   # Temple directory
│   │   │   │   └── [slug]/page.tsx            # Temple details
│   │   │   ├── book/
│   │   │   │   ├── [pujaId]/page.tsx          # Puja booking form
│   │   │   │   └── confirmation/page.tsx      # Booking confirmation
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx                   # Order list
│   │   │   │   └── [id]/page.tsx              # Order tracking
│   │   │   ├── profile/                       # Tab 5: Profile
│   │   │   │   ├── page.tsx                   # User dashboard
│   │   │   │   ├── addresses/page.tsx
│   │   │   │   └── notifications/page.tsx
│   │   │   └── astrology/
│   │   │       └── page.tsx                   # Coming Soon
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── temples/page.tsx
│   │   │   ├── pujas/page.tsx
│   │   │   ├── chadhava/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── banners/page.tsx
│   │   │   ├── panchang/page.tsx
│   │   │   └── coupons/page.tsx
│   │   ├── api/
│   │   │   ├── payments/
│   │   │   │   ├── create-order/route.ts
│   │   │   │   └── verify/route.ts
│   │   │   └── auth/
│   │   │       └── callback/route.ts
│   │   ├── layout.tsx                         # Root layout
│   │   ├── globals.css
│   │   └── providers.tsx
│   ├── components/
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── TempleCarousel.tsx
│   │   │   ├── TrendingPujas.tsx
│   │   │   ├── ChadhavaQuickSelect.tsx
│   │   │   ├── PanchangWidget.tsx
│   │   │   ├── CurrentOrders.tsx
│   │   │   └── FestivalCountdown.tsx
│   │   ├── chadhava/
│   │   │   ├── ChadhavaCard.tsx
│   │   │   └── ChadhavaDetail.tsx
│   │   ├── puja/
│   │   │   ├── PujaCard.tsx
│   │   │   ├── PujaHero.tsx
│   │   │   ├── ProblemStatement.tsx
│   │   │   ├── BenefitsList.tsx
│   │   │   ├── WhatsIncluded.tsx
│   │   │   ├── RitualProcess.tsx
│   │   │   └── StickyBookBar.tsx
│   │   ├── booking/
│   │   │   ├── SankalpForm.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   ├── order/
│   │   │   ├── OrderCard.tsx
│   │   │   └── OrderTimeline.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── payment/
│   │   │   └── RazorpayCheckout.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Textarea.tsx
│   │       ├── Modal.tsx
│   │       ├── Drawer.tsx
│   │       ├── Badge.tsx
│   │       ├── Stepper.tsx
│   │       ├── StatusTimeline.tsx
│   │       ├── Rating.tsx
│   │       ├── CountdownTimer.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Toast.tsx
│   │       ├── DataTable.tsx
│   │       ├── ImageUpload.tsx
│   │       ├── Accordion.tsx
│   │       ├── Carousel.tsx
│   │       ├── EmptyState.tsx
│   │       └── ComingSoon.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── razorpay.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useOrders.ts
│   │   ├── useTemples.ts
│   │   ├── usePujas.ts
│   │   ├── useChadhava.ts
│   │   └── useCountdown.ts
│   └── types/
│       ├── database.ts
│       ├── order.ts
│       ├── puja.ts
│       └── chadhava.ts
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── middleware.ts
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── .env.local.example
```

---

## Implementation Order

| Step | Component | Est. Files | Dependencies |
|------|-----------|-----------|--------------|
| 1 | Project scaffolding (Next.js 15, deps, config) | 8 | None |
| 2 | Design system (globals.css, theme tokens) | 1 | Step 1 |
| 3 | UI components library (20 components) | 20 | Step 2 |
| 4 | Supabase client setup (browser + server + middleware) | 4 | Step 1 |
| 5 | Database schema + migrations + seed data | 2 | Step 4 |
| 6 | Auth flow (Login, OTP Verify, Profile Setup) | 5 | Steps 3-4 |
| 7 | Layout (Navbar, 5-Tab BottomNav, Footer) | 5 | Steps 3, 6 |
| 8 | Home screen + all 7 widgets | 9 | Steps 3, 5, 7 |
| 9 | Puja listing + detail page (all 9 sections) | 10 | Steps 3, 5, 7 |
| 10 | Chadhava listing + detail + booking | 6 | Steps 3, 5, 7 |
| 11 | Temple directory + detail page | 3 | Steps 3, 5, 7 |
| 12 | Booking flow (4-step form) | 5 | Steps 6, 9 |
| 13 | Payment integration (Razorpay) | 4 | Step 12 |
| 14 | Order tracking (list + detail + timeline) | 4 | Steps 6, 13 |
| 15 | User profile/dashboard | 4 | Steps 6, 7 |
| 16 | Admin panel (9 pages) | 11 | Steps 3-5 |
| 17 | Coming Soon pages (Content + Astrology) | 2 | Steps 3, 7 |
| 18 | Polish (animations, responsive, edge cases) | — | All |

**Total: ~100+ files, ~20 screens, 5 tabs**

---

## Verification Plan

### Automated Tests
```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build verification (catches SSR issues)
npm run build
```

### Manual Verification
Run `npm run dev` and verify each flow:

1. **Home page**: All 7 widgets render with seed data, banner carousel auto-slides
2. **Temple directory**: Search + filter works, cards link to detail
3. **Temple detail**: Gallery, pujas list, chadhava list, map
4. **Puja listing**: Category tabs filter correctly, countdown timers tick
5. **Puja detail**: All 9 sections render — Hero, Problem, Benefits, Included, Ritual, Temple, FAQs, Reviews, Sticky bar
6. **Chadhava listing**: Temple selector, type grid, prices correct
7. **Chadhava detail**: Description, benefits, "Offer Now" CTA
8. **Auth flow**: Login → OTP → Profile Setup → Redirect to Home
9. **Booking flow**: Sankalp → Address → Summary → Razorpay → Confirmation
10. **Chadhava booking**: Simplified 3-step flow
11. **Order tracking**: Status timeline, rebook button
12. **Profile**: Stats, orders link, addresses CRUD
13. **Admin panel**: All 9 sections — CRUD temples, pujas, chadhava, orders, banners, panchang, coupons
14. **Mobile responsive**: All screens on 375px viewport
15. **Coming Soon pages**: Content + Astrology tabs render beautifully
16. **Bottom nav**: 5 tabs highlight correctly on each route

### Browser Testing
- Razorpay checkout in test mode (test card: 4111 1111 1111 1111)
- Supabase auth redirect flow
- Responsive layout on mobile/tablet/desktop
- Dark theme consistency across all pages
