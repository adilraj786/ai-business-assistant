import { renderPosterImage } from "@/lib/poster/render"

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  return await renderPosterImage({
    businessName: searchParams.get("businessName") || "Your Business",
    headline: searchParams.get("headline") || "Special Offer",
    subtext: searchParams.get("subtext") || undefined,
    brandColor: searchParams.get("brandColor") || "#4F46E5",
  })
}