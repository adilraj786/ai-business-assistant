"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIES = [
  "Restaurant / Cafe",
  "Retail / Clothing",
  "Salon / Beauty",
  "Electronics",
  "Medical Shop / Pharmacy",
  "Other",
]

export default function OnboardingPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState("")
  const [category, setCategory] = useState("")
  const [city, setCity] = useState("")
  const [toneOfVoice, setToneOfVoice] = useState("")
  const [brandColor, setBrandColor] = useState("#4F46E5")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!businessName || !category) {
      setError("Business name and category are required")
      return
    }

    setLoading(true)

    const res = await fetch("/api/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName,
        category,
        city,
        toneOfVoice,
        brandColor,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      setError("Something went wrong. Please try again.")
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Tell us about your business</h1>
          <p className="text-sm text-muted-foreground">
            This helps us create content that actually fits your brand
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Sharma General Store"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Business category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Ahmedabad"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone of voice</Label>
            <Input
              id="tone"
              value={toneOfVoice}
              onChange={(e) => setToneOfVoice(e.target.value)}
              placeholder="e.g. friendly and casual, or formal and premium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandColor">Brand color</Label>
            <Input
              id="brandColor"
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-10 w-20 p-1"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Continue to dashboard"}
          </Button>
        </form>
      </div>
    </div>
  )
}