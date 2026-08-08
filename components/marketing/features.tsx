import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, MessageSquareText, Image, Send } from "lucide-react"

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-generated offers",
    description:
      "Say 'create a Diwali offer' and get a complete campaign — no writing required.",
  },
  {
    icon: Image,
    title: "Branded posters instantly",
    description:
      "Every poster uses your logo, colors, and business name automatically.",
  },
  {
    icon: MessageSquareText,
    title: "Captions & hashtags",
    description:
      "Ready-to-post Instagram and Facebook captions with relevant hashtags.",
  },
  {
    icon: Send,
    title: "Send straight to customers",
    description:
      "Push promotions directly to your customer list in a few taps.",
  },
]

export function Features() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Everything your shop needs to market itself
          </h2>
          <p className="mt-3 text-muted-foreground">
            Skip the agency. Skip the learning curve. Just ask.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="border-none shadow-sm">
              <CardContent className="pt-6">
                <feature.icon className="h-8 w-8 text-indigo-600" />
                <h3 className="mt-4 font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}