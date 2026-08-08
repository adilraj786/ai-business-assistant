import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Nav() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold">
          ShopAssist AI
        </Link>
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <Link href="#how-it-works">How it works</Link>
          <Link href="#pricing">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}