import { ImageResponse } from "next/og"
import { getPosterFonts } from "./fonts"

function shadeColor(hex: string, percent: number) {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + percent))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent))
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent))
  return `rgb(${r}, ${g}, ${b})`
}

function extractBadgeText(...sources: (string | undefined)[]) {
  const combined = sources.filter(Boolean).join(" ")
  const match = combined.match(/(\d{1,3})\s?%/)
  if (match) {
    return { big: `${match[1]}%`, small: "OFF" }
  }
  return { big: "SALE", small: "NOW ON" }
}

const GOLD = "#F0B429"
const CREAM = "#FFF8ED"
const INK = "#1A1A1A"

export async function renderPosterImage({
  businessName,
  headline,
  subtext,
  brandColor,
  fonts,
}: {
  businessName: string
  headline: string
  subtext?: string
  brandColor?: string
  fonts?: Awaited<ReturnType<typeof getPosterFonts>>
}) {
  const color = brandColor || "#4F46E5"
  const darkerColor = shadeColor(color, -55)
  const resolvedFonts = fonts ?? (await getPosterFonts())
  const badge = extractBadgeText(headline, subtext)

  // Decorative dot texture behind the headline
  const dots = Array.from({ length: 8 }).map((_, i) => ({
    top: 20 + (i % 4) * 60,
    left: 700 + Math.floor(i / 4) * 60,
  }))

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter",
          position: "relative",
          background: CREAM,
        }}
      >
        {/* Top gradient zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "60%",
            background: `linear-gradient(150deg, ${color} 0%, ${darkerColor} 100%)`,
            padding: "56px 56px 0 56px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Dot texture */}
          {dots.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: d.top,
                left: d.left,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
              }}
            />
          ))}

          {/* Die-cut ribbon */}
          <div
            style={{
              position: "absolute",
              top: 36,
              right: -70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 260,
              padding: "9px 0",
              background: INK,
              color: "white",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: 2,
              transform: "rotate(40deg)",
            }}
          >
            LIMITED TIME
          </div>

          <div
            style={{
              display: "flex",
              color: "rgba(255,255,255,0.82)",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {businessName}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 22,
              color: "white",
              fontFamily: "Poppins",
              fontWeight: 800,
              fontSize: 56,
              lineHeight: 1.05,
              maxWidth: "72%",
              letterSpacing: -1,
            }}
          >
            {headline}
          </div>
        </div>

        {/* Circular badge straddling the seam */}
        <div
          style={{
            position: "absolute",
            top: "60%",
            right: 64,
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: GOLD,
            border: `7px solid ${CREAM}`,
          }}
        >
          <div
            style={{
              display: "flex",
              color: INK,
              fontFamily: "Poppins",
              fontWeight: 800,
              fontSize: badge.big.length > 3 ? 38 : 50,
              lineHeight: 1,
            }}
          >
            {badge.big}
          </div>
          <div
            style={{
              display: "flex",
              color: INK,
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: 17,
              letterSpacing: 2,
              marginTop: 4,
            }}
          >
            {badge.small}
          </div>
        </div>

        {/* Bottom cream zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "56px",
            justifyContent: "space-between",
          }}
        >
          {subtext && (
            <div
              style={{
                display: "flex",
                color: INK,
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: 21,
                lineHeight: 1.5,
                maxWidth: "58%",
                opacity: 0.72,
              }}
            >
              {subtext}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                color: INK,
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 24,
              }}
            >
              Visit us today
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: color,
                color: "white",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              →
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: resolvedFonts,
    }
  )
}