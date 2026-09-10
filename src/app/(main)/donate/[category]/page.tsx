import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DonationFormPage } from "./DonationFormPage"
import { NepalFloodReliefPage } from "@/components/donation/NepalFloodReliefPage"

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const supabase = await createClient()
  const { data: seva } = await supabase
    .from("donations")
    .select("title, subtitle, description")
    .eq("category", category)
    .single()

  const title = seva?.title || category
  return {
    title: `${title} — Donate | Vandanam`,
    description: seva?.description?.slice(0, 155) || `Donate to ${title} and earn divine blessings.`,
  }
}

export default async function Page({ params }: Props) {
  const { category } = await params
  const supabase = await createClient()

  const { data: seva } = await supabase
    .from("donations")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .single()  // If DB not seeded yet, use static fallback
  const STATIC_MAP: Record<string, any> = {
    "nepal-flood-relief": {
      category: "nepal-flood-relief",
      title: "नेपाल बाढ़ राहत • Nepal Flood Relief",
      subtitle: "Emergency Disaster Relief for Flooded Himalayan Villages",
      description: "Catastrophic flash floods swept through the Nepal-China border region along the Trishuli and Bhotekoshi river systems. Hundreds dead, thousands missing, and whole villages washed away overnight. Families in Rasuwa, Nuwakot, Timure, and Syabrubesi are stranded in relief camps with nothing left. In partnership with on-ground teams, your contribution delivers emergency cooked meals, clean drinking water, emergency medical supplies, and temporary shelter kits.",
      emoji: "🚨",
      image_url: "/images/nepal-flood/nepal-flood-hero.jpg",
      suggested_amounts: [101, 251, 501, 1001, 2001, 5001, 11000, 21000, 51000],
      min_amount: 10,
      impact_statement: "₹101 feeds a survivor • ₹501 sends emergency nutrition • ₹1,001 sends emergency medical kit",
      donors_count: 1840,
    },
    "wayanad-relief": {
      category: "wayanad-relief",
      title: "वायनाड भूस्खलन एवं बाढ़ राहत • Wayanad Disaster Relief",
      subtitle: "Emergency Landslide & Flood Relief in Kerala",
      description: "Devastating landslides and flash floods buried Chooralmala, Mundakkai, and Meppadi in Wayanad, Kerala. Thousands of survivors are living in emergency relief camps having lost their homes and livelihoods. Your donation directly funds community kitchen meals, grocery rations, warm blankets, and long-term family rehabilitation assistance.",
      emoji: "⛰️",
      image_url: "/images/donations/wayanad-relief.jpg",
      suggested_amounts: [101, 251, 501, 1001, 2001, 5001, 11000, 21000],
      min_amount: 10,
      impact_statement: "₹101 provides 1 hot meal • ₹251 feeds a family for 2 days • ₹1,001 sends emergency essentials",
      donors_count: 340,
      total_raised: 184500,
    },
    "assam-flood-relief": {
      category: "assam-flood-relief",
      title: "असम ब्रह्मपुत्र बाढ़ राहत • Assam Flood Relief",
      subtitle: "Urgent Monsoon Flood Relief & Boat Rescue Rations",
      description: "Massive monsoon flooding across the Brahmaputra and Dikhow river basins has submerged hundreds of villages in Assam (Sivasagar, Jorhat, Dibrugarh, Morigaon). Thousands of families are cut off on river embankments without drinking water or dry food. Your contribution powers emergency boat rescue rations, water purification kits, infant formula, and mosquito nets.",
      emoji: "🌊",
      image_url: "/images/donations/assam-flood-relief.jpg",
      suggested_amounts: [101, 251, 501, 1001, 2001, 5001, 11000, 21000],
      min_amount: 10,
      impact_statement: "₹101 supplies drinking water • ₹251 supplies dry rations • ₹1,001 sends flood medical kit",
      donors_count: 195,
      total_raised: 98200,
    },
    "bhandara": { 
      category: "bhandara", 
      title: "भंडारा • Bhandara", 
      subtitle: "Annadanam — Feed the Hungry", 
      description: "Sponsor a community feast (Bhandara) and earn the highest spiritual merit. In the Vedas, Annadanam — gifting food — is considered the greatest of all donations. Your contribution directly feeds the poor, sadhus, and pilgrims at our temple community kitchens.", 
      emoji: "🍲", 
      image_url: "/images/donations/bhandara-annadanam.jpg", 
      suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000], 
      min_amount: 51, 
      impact_statement: "₹101 feeds 10 people • ₹501 feeds 50 people • ₹1001 feeds 108 people", 
      donors_count: 1248 
    },
    "gau-seva": { 
      category: "gau-seva", 
      title: "गौ सेवा • Gau Seva", 
      subtitle: "Cow Protection & Care", 
      description: "The cow is revered as a symbol of Dharma. Your donation supports our Gaushala — providing food, shelter, medical care, and love to rescued and abandoned cows. Gau Seva is one of the most meritorious acts in Hindu Dharma.", 
      emoji: "🐄", 
      image_url: "/images/donations/gau-seva.png", 
      suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000], 
      min_amount: 51, 
      impact_statement: "₹101 feeds a cow for a day • ₹1001 covers medical care and tonics", 
      donors_count: 984 
    },
    "vriddha-seva": { 
      category: "vriddha-seva", 
      title: "वृद्ध आश्रम सेवा • Vriddha Seva", 
      subtitle: "Care for the Elderly", 
      description: "Many elderly people live abandoned and alone with no support in holy towns like Vrindavan and Kashi. Your donation provides nutritious meals, medicines, warm clothes, and companionship to the elderly living in our ashram.", 
      emoji: "👴", 
      image_url: "/images/donations/vriddha-seva.png", 
      suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000], 
      min_amount: 51, 
      impact_statement: "₹101 provides a day's nutritious meals • ₹1001 covers monthly medicines", 
      donors_count: 543 
    },
    "mandir-seva": { 
      category: "mandir-seva", 
      title: "मंदिर सेवा • Mandir Seva", 
      subtitle: "Temple Restoration & Maintenance", 
      description: "Ancient temples are living repositories of our culture, art, and spirituality. Many are crumbling and in urgent need of restoration. Your donation helps preserve, renovate, and maintain these sacred spaces.", 
      emoji: "🛕", 
      image_url: "/images/donations/mandir-seva.jpg", 
      suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000], 
      min_amount: 101, 
      impact_statement: "₹101 sponsors sanctum oil & diya • ₹501 restores ancient stone carving", 
      donors_count: 788 
    },
    "nadi-seva": { 
      category: "nadi-seva", 
      title: "नदी सेवा • Nadi Seva", 
      subtitle: "Sacred River Cleanup", 
      description: "Our sacred rivers — Ganga, Yamuna, Narmada — are the lifelines of Bharatiya civilization. Your donation funds river cleaning drives, ghats restoration, and awareness campaigns.", 
      emoji: "🌊", 
      image_url: "/images/donations/nadi-seva.jpg", 
      suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000], 
      min_amount: 51, 
      impact_statement: "₹101 clears 50m of riverbank • ₹1001 funds riverbed skimmer operations", 
      donors_count: 427 
    },
  }

  const sevaData = seva || STATIC_MAP[category]

  if (category === "nepal-flood-relief") {
    return (
      <NepalFloodReliefPage
        initialDonorsCount={seva?.donors_count || 1840}
        initialTotalRaised={Number(seva?.total_raised) || 924500}
      />
    )
  }

  return <DonationFormPage seva={sevaData} />
}
