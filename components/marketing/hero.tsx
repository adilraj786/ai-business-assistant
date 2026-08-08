import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-20 sm:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
          Built for small business owners
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Your marketing,{" "}
          <span className="text-indigo-600">handled by AI</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          Just type what you need — a poster, an offer, a caption — and get
          professional marketing content in seconds. No design skills, no
          social media expertise required.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/sign-up">Get started free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}