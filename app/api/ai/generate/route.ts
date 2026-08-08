import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateMarketingContent } from "@/lib/ai/generate-content"
import { getActiveSubscription } from "@/lib/subscription/check"

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subscription = await getActiveSubscription(session.user.id)

  if (!subscription) {
    return NextResponse.json(
      { error: "An active subscription is required to generate content" },
      { status: 403 }
    )
  }

  const { request: userRequest } = await req.json()

  if (!userRequest || typeof userRequest !== "string") {
    return NextResponse.json({ error: "Request text is required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: business } = await supabase
    .from("business")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  if (!business) {
    return NextResponse.json({ error: "Business profile not found" }, { status: 404 })
  }

  try {
    const content = await generateMarketingContent({
      request: userRequest,
      businessName: business.business_name,
      category: business.category,
      city: business.city,
      toneOfVoice: business.tone_of_voice,
    })

    return NextResponse.json({
      content,
      business: {
        businessName: business.business_name,
        brandColor: business.brand_color,
        category: business.category,
      },
    })
  } catch (err) {
    console.error("AI generation failed:", err)
    return NextResponse.json(
      { error: "Content generation failed. Please try again." },
      { status: 500 }
    )
  }
}