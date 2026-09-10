import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { NepalFloodReliefPage } from "@/components/donation/NepalFloodReliefPage"

import { constructDynamicMetadata } from "@/lib/seo"

// Revalidate every 60 seconds so live totals stay fresh without a full rebuild
export const revalidate = 60

export const metadata: Metadata = constructDynamicMetadata({
  title: "Nepal Flood Relief Fund — Emergency Disaster Aid | Vandanam",
  description: "Flash floods have swept away entire Himalayan villages. Support emergency cooked meals, clean drinking water, medical kits, and shelter for stranded families in Timure & Syabrubesi.",
  path: "/nepal-flood-relief",
  subtitle: "Emergency Disaster Relief for Flooded Himalayan Villages",
  badge: "🚨 Urgent Disaster Relief",
  type: "donation",
  highlight: "Over 10,000+ Meals Distributed • 100% Direct On-Ground Relief",
})

export default async function Page() {
  const supabase = await createClient()

  const { data: seva } = await supabase
    .from("donations")
    .select("donors_count, total_raised, goal_amount")
    .eq("category", "nepal-flood-relief")
    .single()

  return (
    <NepalFloodReliefPage
      initialDonorsCount={seva?.donors_count ?? 23}
      initialTotalRaised={Number(seva?.total_raised) || 24500}
      goalAmount={Number(seva?.goal_amount) || 1000000}
    />
  )
}
