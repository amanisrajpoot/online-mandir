import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DonationFormPage } from "./DonationFormPage"

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
    .single()

  // If DB not seeded yet, use static fallback
  const STATIC_MAP: Record<string, any> = {
    "bhandara": { category: "bhandara", title: "भंडारा • Bhandara", subtitle: "Annadanam — Feed the Hungry", description: "Sponsor a community feast (Bhandara) and earn the highest spiritual merit. In the Vedas, Annadanam — gifting food — is considered the greatest of all donations. Your contribution directly feeds the poor, sadhus, and pilgrims at our temple community kitchens.", emoji: "🍲", suggested_amounts: [51, 101, 251, 501, 1001, 2101, 5100], min_amount: 51, impact_statement: "₹101 feeds 10 people • ₹501 feeds 50 people • ₹1001 feeds 108 people", donors_count: 1248 },
    "gau-seva": { category: "gau-seva", title: "गौ सेवा • Gau Seva", subtitle: "Cow Protection & Care", description: "The cow is revered as a symbol of Dharma. Your donation supports our Gaushala — providing food, shelter, medical care, and love to rescued and abandoned cows. Gau Seva is one of the most meritorious acts in Hindu Dharma.", emoji: "🐄", suggested_amounts: [51, 101, 251, 501, 1001, 2101, 5100], min_amount: 51, impact_statement: "₹101 feeds a cow for a day • ₹1001 covers a week of medical care", donors_count: 984 },
    "janwar-seva": { category: "janwar-seva", title: "जानवर सेवा • Janwar Seva", subtitle: "Stray Animal Rescue & Welfare", description: "Thousands of stray dogs, cats, and animals suffer on the streets without food or medical care. Your donation funds rescue operations, veterinary treatment, sterilization drives, and feeding programs for stray animals in our community.", emoji: "🐕", suggested_amounts: [51, 101, 251, 501, 1001, 2101, 5100], min_amount: 51, impact_statement: "₹101 feeds 20 strays • ₹501 covers a vet visit • ₹2101 sponsors monthly care", donors_count: 762 },
    "gav-seva": { category: "gav-seva", title: "गाँव सेवा • Gav Seva", subtitle: "Village Development & Rural Uplift", description: "Support underprivileged villages with clean water, sanitation, electricity, and basic infrastructure. Our Gav Seva mission transforms rural India one village at a time.", emoji: "🏘️", suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000], min_amount: 101, impact_statement: "₹1001 installs a hand pump • ₹5100 builds a community toilet", donors_count: 341 },
    "vriddha-seva": { category: "vriddha-seva", title: "वृद्ध आश्रम सेवा • Vriddha Seva", subtitle: "Care for the Elderly", description: "Many elderly people live abandoned and alone with no support. Your donation provides nutritious meals, medicines, warm clothes, and companionship to the elderly living in our ashram.", emoji: "👴", suggested_amounts: [51, 101, 251, 501, 1001, 2101, 5100], min_amount: 51, impact_statement: "₹251 feeds an elder for a month • ₹1001 covers monthly medicines", donors_count: 543 },
    "vidya-daan": { category: "vidya-daan", title: "विद्या दान • Vidya Daan", subtitle: "Education for Underprivileged Children", description: "Vidya Daan — the gift of education — is considered the highest form of charity. Your donation provides school fees, books, uniforms, and digital tools to children from economically weaker sections.", emoji: "📚", suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000], min_amount: 101, impact_statement: "₹501 covers a child's books for a year • ₹2101 sponsors a child for 6 months", donors_count: 891 },
    "vriksha-seva": { category: "vriksha-seva", title: "वृक्ष सेवा • Vriksha Seva", subtitle: "Plant a Sacred Tree", description: "In Hindu tradition, trees are living temples. Your donation plants trees in temple courtyards, roadsides, and forest areas — contributing to a greener, cooler, and more divine planet.", emoji: "🌳", suggested_amounts: [51, 101, 251, 501, 1001, 2101, 5100], min_amount: 51, impact_statement: "₹51 plants 1 tree • ₹501 plants 11 trees • ₹5100 creates a mini forest", donors_count: 1102 },
    "nadi-seva": { category: "nadi-seva", title: "नदी सेवा • Nadi Seva", subtitle: "Sacred River Cleanup", description: "Our sacred rivers — Ganga, Yamuna, Narmada — are the lifelines of Bharatiya civilization. Your donation funds river cleaning drives, ghats restoration, and awareness campaigns.", emoji: "🌊", suggested_amounts: [51, 101, 251, 501, 1001, 2101, 5100], min_amount: 51, impact_statement: "₹101 cleans 100m of riverbank • ₹1001 funds a full cleanup drive", donors_count: 427 },
    "swasthya-seva": { category: "swasthya-seva", title: "स्वास्थ्य सेवा • Swasthya Seva", subtitle: "Free Medical Aid & Health Camps", description: "Sponsor free medical camps, medicines, diagnostic tests, and health awareness programs in rural and tribal areas where access to healthcare is scarce.", emoji: "🏥", suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000], min_amount: 101, impact_statement: "₹251 provides medicines for a family • ₹1001 funds a complete health checkup camp", donors_count: 619 },
    "mandir-seva": { category: "mandir-seva", title: "मंदिर सेवा • Mandir Seva", subtitle: "Temple Restoration & Maintenance", description: "Ancient temples are living repositories of our culture, art, and spirituality. Many are crumbling and in urgent need of restoration. Your donation helps preserve, renovate, and maintain these sacred spaces.", emoji: "🛕", suggested_amounts: [101, 251, 501, 1001, 2101, 5100, 11000], min_amount: 101, impact_statement: "₹501 repairs a portion of a temple wall • ₹5100 restores a full shrine", donors_count: 788 },
  }

  const sevaData = seva || STATIC_MAP[category]

  if (!sevaData) {
    notFound()
  }

  return <DonationFormPage seva={sevaData} />
}
