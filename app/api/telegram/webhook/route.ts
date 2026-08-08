import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateMarketingContent } from "@/lib/ai/generate-content"
import { getActiveSubscription } from "@/lib/subscription/check"
import { renderPosterImage } from "@/lib/poster/render"
import { getPosterFonts } from "@/lib/poster/fonts"
import { logGeneration, getUsageStats, getRecentHistory } from "@/lib/usage/track"

export const runtime = "edge"

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`
const DIVIDER = "──────────────"

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

async function sendMessage(chatId: string, text: string): Promise<number | null> {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  })
  const data = await res.json()
  return data?.result?.message_id ?? null
}

async function editMessage(chatId: string, messageId: number, text: string) {
  await fetch(`${TELEGRAM_API}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: "HTML" }),
  })
}

async function sendChatAction(chatId: string, action: string) {
  await fetch(`${TELEGRAM_API}/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action }),
  })
}

async function sendPhotoBuffer(chatId: string, imageBuffer: ArrayBuffer, caption: string) {
  const formData = new FormData()
  formData.append("chat_id", chatId)
  formData.append("caption", caption)
  formData.append("parse_mode", "HTML")
  formData.append("photo", new Blob([imageBuffer], { type: "image/png" }), "poster.png")

  await fetch(`${TELEGRAM_API}/sendPhoto`, {
    method: "POST",
    body: formData,
  })
}

export async function POST(req: Request) {
  const secretHeader = req.headers.get("x-telegram-bot-api-secret-token")
  if (secretHeader !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const update = await req.json()
  const message = update.message

  if (!message || !message.text) {
    return NextResponse.json({ ok: true })
  }

  const chatId = String(message.chat.id)
  const text = message.text.trim()
  const supabase = await createClient()

  // --- /start CODE ---
  if (text.startsWith("/start")) {
    const code = text.replace("/start", "").trim()

    if (!code) {
      await sendMessage(
        chatId,
        `<b>👋 Welcome to ShopAssist AI</b>\n${DIVIDER}\nSend <code>/start</code> followed by your link code from the dashboard to get connected.`
      )
      return NextResponse.json({ ok: true })
    }

    const { data: business, error } = await supabase
      .from("business")
      .update({ telegram_chat_id: chatId })
      .eq("telegram_link_code", code)
      .select()
      .single()

    if (error || !business) {
      await sendMessage(
        chatId,
        `<b>⚠️ That code didn't work</b>\n${DIVIDER}\nDouble-check the code on your dashboard and try again.`
      )
      return NextResponse.json({ ok: true })
    }

    await sendMessage(
      chatId,
      `<b>✅ You're connected, ${escapeHtml(business.business_name)}!</b>\n${DIVIDER}\n` +
        `Just type what you need — e.g. <i>"create a Diwali offer"</i> — and I'll generate it for you.\n\n` +
        `Send /help anytime to see everything I can do.`
    )
    return NextResponse.json({ ok: true })
  }

  const { data: business } = await supabase
    .from("business")
    .select("*")
    .eq("telegram_chat_id", chatId)
    .single()

  if (!business) {
    await sendMessage(
      chatId,
      `<b>🔒 Not connected yet</b>\n${DIVIDER}\nGo to your ShopAssist AI dashboard to get your link code, then send <code>/start CODE</code> here.`
    )
    return NextResponse.json({ ok: true })
  }

  const subscription = await getActiveSubscription(business.user_id)

  // --- /help ---
  if (text === "/help") {
    await sendMessage(
      chatId,
      `<b>🤖 What I can do</b>\n${DIVIDER}\n` +
        `<b>Generate content</b>\nJust type a request, e.g. <i>"create a Diwali offer"</i>\n\n` +
        `<b>/history</b>\nSee your last few requests\n\n` +
        `<b>/usage</b>\nSee generations used and remaining this month`
    )
    return NextResponse.json({ ok: true })
  }

  // --- /history ---
  if (text === "/history") {
    const history = await getRecentHistory(business.id, 5)

    if (history.length === 0) {
      await sendMessage(
        chatId,
        `<b>📂 No history yet</b>\n${DIVIDER}\nTry a request like <i>"create a Diwali offer"</i> to get started.`
      )
      return NextResponse.json({ ok: true })
    }

    const formatted = history
      .map((h, i) => {
        const date = new Date(h.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        })
        return `<b>${i + 1}.</b> ${escapeHtml(h.request_text)}\n<i>${date}</i>`
      })
      .join("\n\n")

    await sendMessage(chatId, `<b>📂 Your recent requests</b>\n${DIVIDER}\n${formatted}`)
    return NextResponse.json({ ok: true })
  }

  // --- /usage ---
  if (text === "/usage") {
    if (!subscription) {
      await sendMessage(
        chatId,
        `<b>⚠️ No active subscription</b>\n${DIVIDER}\nSubscribe on the dashboard to start generating content.`
      )
      return NextResponse.json({ ok: true })
    }

    const stats = await getUsageStats(business.id, subscription.plan_name, subscription.current_period_end)

    const usageLine =
      stats.limit === null
        ? `<b>Used:</b> ${stats.used}\n<b>Limit:</b> Unlimited ✨`
        : `<b>Used:</b> ${stats.used} / ${stats.limit}\n<b>Remaining:</b> ${stats.remaining}`

    await sendMessage(
      chatId,
      `<b>📊 Your usage</b>\n${DIVIDER}\n<b>Plan:</b> ${escapeHtml(
        subscription.plan_name
      )}\n${usageLine}`
    )
    return NextResponse.json({ ok: true })
  }

  // --- Regular content generation request ---
  if (!subscription) {
    await sendMessage(
      chatId,
      `<b>⚠️ Subscription required</b>\n${DIVIDER}\nPlease subscribe on the ShopAssist AI dashboard to keep generating content.`
    )
    return NextResponse.json({ ok: true })
  }

  const stats = await getUsageStats(business.id, subscription.plan_name, subscription.current_period_end)

  if (stats.limit !== null && stats.remaining !== null && stats.remaining <= 0) {
    await sendMessage(
      chatId,
      `<b>🚫 Monthly limit reached</b>\n${DIVIDER}\nYou've used all ${stats.limit} generations on the ${escapeHtml(
        subscription.plan_name
      )} plan. Upgrade on the dashboard to keep going.`
    )
    return NextResponse.json({ ok: true })
  }

  await sendChatAction(chatId, "typing")
  const loadingMessageId = await sendMessage(chatId, `<b>⏳ Generating your content...</b>`)

  try {
    const [content, fonts] = await Promise.all([
      generateMarketingContent({
        request: text,
        businessName: business.business_name,
        category: business.category,
        city: business.city,
        toneOfVoice: business.tone_of_voice,
      }),
      getPosterFonts(),
    ])

    const summary =
      `<b>✅ Here's your content</b>\n${DIVIDER}\n\n` +
      `<b>📝 Caption</b>\n${escapeHtml(content.caption)}\n\n` +
      `<b>🏷️ Hashtags</b>\n${content.hashtags.map((h) => `#${escapeHtml(h)}`).join(" ")}\n\n` +
      `<b>💬 WhatsApp message</b>\n${escapeHtml(content.whatsappMessage)}\n\n` +
      `<b>📣 Call to action</b>\n${escapeHtml(content.callToAction)}`

    if (loadingMessageId) {
      await editMessage(chatId, loadingMessageId, summary)
    } else {
      await sendMessage(chatId, summary)
    }

    const posterResponse = await renderPosterImage({
      businessName: business.business_name,
      headline: content.callToAction,
      subtext: content.caption.slice(0, 80),
      brandColor: business.brand_color || "#4F46E5",
      fonts,
    })

    const imageBuffer = await posterResponse.arrayBuffer()
    await sendPhotoBuffer(chatId, imageBuffer, `<b>🖼️ Your poster is ready</b>`)

    await logGeneration(business.id, text, "telegram")
  } catch (err) {
    console.error("Telegram AI generation failed:", err)
    if (loadingMessageId) {
      await editMessage(
        chatId,
        loadingMessageId,
        `<b>⚠️ Something went wrong</b>\n${DIVIDER}\nPlease try again in a moment.`
      )
    }
  }

  return NextResponse.json({ ok: true })
}