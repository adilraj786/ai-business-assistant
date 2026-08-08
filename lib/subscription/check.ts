import { createClient } from "@/lib/supabase/server"

export async function getActiveSubscription(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("subscription")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single()

  if (!data) return null

  // Also check it hasn't expired
  const periodEnd = new Date(data.current_period_end)
  if (periodEnd < new Date()) return null

  return data
}