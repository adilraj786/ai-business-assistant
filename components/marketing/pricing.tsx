import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "₹499",
    period: "/month",
    features: ["50 AI generations/month", "Basic templates", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹999",
    period: "/month",
    popular: true,
    features: [
      "200 AI generations/month",
      "All templates",
      "Priority support",
      "Customer broadcast messages",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹1,999",
    period: "/month",
    features: [
      "Unlimited AI generations",
      "All templates",
      "Priority support",
      "Advanced analytics",
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Simple pricing for every shop
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={plan.popular ? "border-indigo-600 shadow-md" : ""}
            >
              <CardHeader>
                {plan.popular && (
                  <Badge className="mb-2 w-fit bg-indigo-600">
                    Most popular
                  </Badge>
                )}
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <div className="mt-1">
                  <span className="text-3xl font-semibold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-indigo-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" asChild>
                  <Link href={`/checkout?plan=${plan.id}`}>Choose plan</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}