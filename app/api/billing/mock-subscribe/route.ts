import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { plan } = await req.json()

  if (!plan) {
    return NextResponse.json({ error: "Plan is required" }, { status: 400 })
  }

  const supabase = await createClient()

  const oneMonthFromNow = new Date()
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

  const { error } = await supabase.from("subscription").upsert(
    {
      user_id: session.user.id,
      razorpay_subscription_id: `mock_${session.user.id}_${Date.now()}`,
      plan_name: plan,
      status: "active",
      current_period_end: oneMonthFromNow.toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}