import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { NepalFloodReliefPage } from "@/components/donation/NepalFloodReliefPage"

// Revalidate every 60 seconds so live totals stay fresh without a full rebuild
export const revalidate = 60

export const metadata: Metadata = {
  title: "Nepal Flood Relief Fund — Emergency Disaster Aid | Vandanam",
  description: "Nepal is devastated. Flash floods have swept away entire Himalayan villages overnight. Support our on-ground teams sending emergency meals, drinking water, medical kits, and shelter to stranded families in Timure & Syabrubesi.",
  openGraph: {
    title: "Nepal Flood Relief Fund — Emergency Disaster Aid | Vandanam",
    description: "Entire villages wiped out. Over 10,000+ meals distributed. Support emergency relief efforts — UPI, Cards, NetBanking supported.",
    images: [
      {
        url: "/images/nepal-flood/nepal-flood-hero.jpg",
        width: 1080,
        height: 1350,
        alt: "Nepal Flood Relief Operations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepal Flood Relief Fund | Urgent Emergency Appeal",
    description: "Send immediate food, water, and shelter essentials to flood survivors in Nepal.",
    images: ["/images/nepal-flood/nepal-flood-hero.jpg"],
  },
}

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
