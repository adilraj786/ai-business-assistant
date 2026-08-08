import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { businessName, category, city, toneOfVoice, brandColor } = body

  if (!businessName || !category) {
    return NextResponse.json(
      { error: "Business name and category are required" },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { error } = await supabase.from("business").upsert(
    {
      user_id: session.user.id,
      business_name: businessName,
      category,
      city,
      tone_of_voice: toneOfVoice,
      brand_color: brandColor,
      telegram_link_code: Math.random().toString(36).substring(2, 10),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}