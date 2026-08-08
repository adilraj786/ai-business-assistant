import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  const supabase = await createClient()
  const { data: business } = await supabase
    .from("business")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  if (!business) {
    redirect("/onboarding")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">
        Welcome back, {business.business_name}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Here's what's happening with your marketing.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="mt-1 font-medium">{business.category}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">City</p>
            <p className="mt-1 font-medium">{business.city || "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Connect Telegram</p>
            <p className="mt-1 font-mono text-sm font-medium">
              {business.telegram_link_code}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 rounded-lg border border-dashed p-10 text-center">
        <p className="text-muted-foreground">
          Your generated content will show up here once you create your first
          campaign.
        </p>
      </div>

      <div className="mt-4 rounded-lg border p-6">
        <p className="font-medium">Use ShopAssist AI from Telegram</p>
        <p className="mt-2 text-sm text-muted-foreground">
          1. Open Telegram and search for <strong>@shopassistance_ai_bot</strong>{" "}
          (shopassistance_ai_bot)
          <br />
          2. Send:{" "}
          <code className="rounded bg-muted px-1">
            /start {business.telegram_link_code}
          </code>
          <br />
          3. Once linked, just type any request like "create a Diwali offer"
          directly in the chat.
        </p>
      </div>
    </div>
  )
}