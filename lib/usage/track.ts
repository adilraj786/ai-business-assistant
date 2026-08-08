import { createClient } from "@/lib/supabase/server"

const PLAN_LIMITS: Record<string, number | null> = {
  starter: 50,
  growth: 200,
  pro: null, // unlimited
}

export async function logGeneration(businessId: string, requestText: string, source: string) {
  const supabase = await createClient()
  await supabase.from("generation_log").insert({
    business_id: businessId,
    request_text: requestText,
    source,
  })
}

export async function getUsageStats(businessId: string, planName: string, periodEnd: string) {
  const supabase = await createClient()
  const periodStart = new Date(periodEnd)
  periodStart.setMonth(periodStart.getMonth() - 1)

  const { count } = await supabase
    .from("generation_log")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", periodStart.toISOString())

  const limit = PLAN_LIMITS[planName] ?? null
  const used = count ?? 0
  const remaining = limit === null ? null : Math.max(0, limit - used)

  return { used, limit, remaining }
}

export async function getRecentHistory(businessId: string, take: number = 5) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("generation_log")
    .select("request_text, created_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(take)

  return data ?? []
}