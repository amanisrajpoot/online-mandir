import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query params with sensible spiritual fallbacks
    const title = searchParams.get("title") || "Vandanam | Online Puja & Chadhava Services"
    const subtitle = searchParams.get("subtitle") || "Connect with sacred temples across India"
    const badge = searchParams.get("badge") || "Vandanam Sacred Seva"
    const type = searchParams.get("type") || "puja" // puja, temple, festival, donation, chadhava, astrology
    const highlight = searchParams.get("highlight") || "Personalized Sankalp with Panditji"

    // Dynamic badge color schemes
    const badgeBg = type === "donation" 
      ? "rgba(220, 38, 38, 0.2)" 
      : "rgba(245, 158, 11, 0.2)"
    const badgeBorder = type === "donation" ? "#ef4444" : "#f59e0b"
    const badgeText = type === "donation" ? "#fca5a5" : "#fde68a"

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "50px 60px",
            backgroundColor: "#0d0703",
            backgroundImage: "radial-gradient(circle at 85% 15%, rgba(234, 88, 12, 0.28) 0%, rgba(13, 7, 3, 0) 65%), radial-gradient(circle at 10% 90%, rgba(217, 119, 6, 0.18) 0%, rgba(13, 7, 3, 0) 50%)",
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            position: "relative",
          }}
        >
          {/* Outer Ornamental Frame */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              right: "20px",
              bottom: "20px",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "20px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "24px",
              left: "24px",
              right: "24px",
              bottom: "24px",
              border: "1px dashed rgba(245, 158, 11, 0.15)",
              borderRadius: "16px",
              pointerEvents: "none",
            }}
          />

          {/* Top Bar: Brand + Category Badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #f59e0b, #ea580c)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(234, 88, 12, 0.4)",
                  fontSize: "30px",
                }}
              >
                ॐ
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    color: "#fef3c7",
                    textTransform: "uppercase",
                  }}
                >
                  Vandanam
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#f59e0b",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Sacred Temple Network
                </span>
              </div>
            </div>

            {/* Dynamic Pill Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 22px",
                backgroundColor: badgeBg,
                border: `1.5px solid ${badgeBorder}`,
                borderRadius: "9999px",
                fontSize: "15px",
                fontWeight: 700,
                color: badgeText,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </div>
          </div>

          {/* Center Content: Title, Subtitle, Highlight */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              maxWidth: "1020px",
              marginTop: "10px",
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: title.length > 50 ? "46px" : "56px",
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#ffffff",
                letterSpacing: "-0.5px",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </div>

            {/* Subtitle / Temple */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "24px",
                fontWeight: 500,
                color: "#fed7aa",
              }}
            >
              <span>{subtitle}</span>
            </div>

            {/* Highlight Banner */}
            {highlight && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 18px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.07)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    fontSize: "16px",
                    color: "#fde68a",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>{highlight}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar: Trust Indicators & URL */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingTop: "24px",
              borderTop: "1px solid rgba(245, 158, 11, 0.2)",
            }}
          >
            {/* Trust Badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "28px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#d4d4d8",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Verified Temple Priests</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Video Proof on WhatsApp</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Pure Temple Prasad</span>
              </div>
            </div>

            {/* CTA / Domain */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#1c1917",
                fontSize: "16px",
                fontWeight: 800,
                boxShadow: "0 2px 12px rgba(245, 158, 11, 0.3)",
              }}
            >
              <span>vandanam.online</span>
              <span>→</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, immutable, no-transform, max-age=86400, s-maxage=604800",
        },
      }
    )
  } catch (error: any) {
    console.error("Error generating dynamic OG image:", error)
    return new Response("Failed to generate dynamic image", { status: 500 })
  }
}
