import { google } from "@ai-sdk/google"
import { generateText, Output } from "ai"
import { z } from "zod"

const contentSchema = z.object({
  caption: z.string().describe("Instagram/Facebook caption, engaging and on-brand"),
  hashtags: z.array(z.string()).describe("5-8 relevant hashtags, no # symbol"),
  whatsappMessage: z.string().describe("Short promotional WhatsApp broadcast message"),
  callToAction: z.string().describe("One-line call to action"),
})

export type GeneratedContent = z.infer<typeof contentSchema>

export async function generateMarketingContent({
  request,
  businessName,
  category,
  city,
  toneOfVoice,
}: {
  request: string
  businessName: string
  category: string
  city?: string
  toneOfVoice?: string
}): Promise<GeneratedContent> {
  const { output } = await generateText({
    model: google("gemini-3.6-flash"),
    output: Output.object({
      schema: contentSchema,
    }),
    prompt: `You are a marketing assistant for a small business called "${businessName}", 
a ${category}${city ? ` located in ${city}` : ""}. 
${toneOfVoice ? `The brand's tone of voice is: ${toneOfVoice}.` : ""}

The owner has requested: "${request}"

Generate a complete marketing content package for this request. Keep language simple, 
warm, and appropriate for local Indian small business customers. Do not use overly 
corporate language.`,
  })

  return output as GeneratedContent
}