"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const PLAN_LABELS: Record<string, { name: string; price: string }> = {
  starter: { name: "Starter", price: "₹499/month" },
  growth: { name: "Growth", price: "₹999/month" },
  pro: { name: "Pro", price: "₹1,999/month" },
}

// 1. Internal content component handling searchParams and logic
function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "starter"
  const [loading, setLoading] = useState(false)

  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.starter

  async function handleMockPayment() {
    setLoading(true)

    const res = await fetch("/api/billing/mock-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })

    setLoading(false)

    if (res.ok) {
      router.push("/dashboard?subscribed=true")
    } else {
      alert("Something went wrong")
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center p-8">
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Test checkout</p>
          <h1 className="mt-1 text-xl font-semibold">
            {planInfo.name} — {planInfo.price}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This is a placeholder payment screen for testing. No real payment
            is processed here — this will be replaced with Razorpay once the
            core product is finished.
          </p>
          <Button
            className="mt-6 w-full"
            onClick={handleMockPayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Simulate successful payment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// 2. Main default export wrapped in a Suspense boundary for Next.js static engine
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center p-8">
        <Card className="w-full">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            Loading checkout...
          </CardContent>
        </Card>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
