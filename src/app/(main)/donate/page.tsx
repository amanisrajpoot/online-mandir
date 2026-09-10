import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DonatePage } from "./DonatePage"

import { constructDynamicMetadata } from "@/lib/seo"

// Refresh live donor counts & totals every 60 seconds
export const revalidate = 60

export const metadata: Metadata = constructDynamicMetadata({
  title: "Seva Daan — Sacred Donations & Disaster Relief | Vandanam",
  description: "Feed the hungry with Annadanam Bhandara, protect cows with Gau Seva, care for elderly in Vrindavan, and support urgent Himalayan disaster relief.",
  path: "/donate",
  subtitle: "Earn Divine Merit through Sacred Seva",
  badge: "Sacred Seva & Humanitarian Aid",
  type: "donation",
  highlight: "100% Direct Distribution • Verified NGO & Temple Partners",
})

export default async function Page() {
  const supabase = await createClient()
  const { data: sevas } = await supabase
    .from("donations")
    .select("category, title, subtitle, description, emoji, image_url, suggested_amounts, min_amount, impact_statement, donors_count, total_raised, goal_amount, is_active, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  return <DonatePage sevas={sevas || []} />
}

