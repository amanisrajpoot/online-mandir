import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DonatePage } from "./DonatePage"

// Refresh live donor counts & totals every 60 seconds
export const revalidate = 60

export const metadata: Metadata = {
  title: "Seva Daan — Donate | Vandanam",
  description:
    "Donate to meaningful Hindu charitable causes — Bhandara, Gau Seva, Janwar Seva, Gav Seva, Vriddha Seva, Vidya Daan, Vriksha Seva, Nadi Seva, Swasthya Seva, and Mandir Seva. Earn divine blessings through your generosity.",
  openGraph: {
    title: "Seva Daan — Donate to a Sacred Cause | Vandanam",
    description: "Feed the hungry, protect cows, educate children, and care for the elderly. Every donation earns divine blessings.",
    type: "website",
  },
}

export default async function Page() {
  const supabase = await createClient()
  const { data: sevas } = await supabase
    .from("donations")
    .select("category, title, subtitle, description, emoji, image_url, suggested_amounts, min_amount, impact_statement, donors_count, total_raised, goal_amount, is_active, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  return <DonatePage sevas={sevas || []} />
}

