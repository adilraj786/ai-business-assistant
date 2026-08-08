"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { GeneratedContent } from "@/lib/ai/generate-content"

export function ContentGenerator() {
  const [request, setRequest] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [businessName, setBusinessName] = useState("")
  const [brandColor, setBrandColor] = useState("#4F46E5")

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setContent(null)

    if (!request.trim()) return

    setLoading(true)

    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      return
    }

    const data = await res.json()
    setContent(data.content)
    setBusinessName(data.business.businessName)
    setBrandColor(data.business.brandColor)
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Create marketing content</h1>
      <p className="mt-1 text-muted-foreground">
        Describe what you need — an offer, a promotion, an announcement.
      </p>

      <form onSubmit={handleGenerate} className="mt-6 flex gap-2">
        <Input
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="e.g. Create a Diwali offer with 20% discount"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {content && (
        <div className="mt-8 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Caption</p>
              <p className="mt-2">{content.caption}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Hashtags</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {content.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">
                WhatsApp message
              </p>
              <p className="mt-2">{content.whatsappMessage}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">
                Call to action
              </p>
              <p className="mt-2 font-medium">{content.callToAction}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Poster</p>
              <img
                src={`/api/poster?businessName=${encodeURIComponent(
                  businessName
                )}&headline=${encodeURIComponent(
                  content.callToAction
                )}&subtext=${encodeURIComponent(
                  content.caption.slice(0, 80)
                )}&brandColor=${encodeURIComponent(brandColor)}`}
                alt="Generated poster"
                className="mt-3 w-full max-w-sm rounded-lg border"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}