import { auth } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getActiveSubscription } from "@/lib/subscription/check"
import { ContentGenerator } from "@/components/dashboard/content-generator"

export default async function ContentPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  const subscription = await getActiveSubscription(session.user.id)

  if (!subscription) {
    redirect("/checkout?plan=starter")
  }

  return <ContentGenerator />
}