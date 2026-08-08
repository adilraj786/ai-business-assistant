export type PosterLayout = "gradient-badge" | "split-panel" | "elegant-frame"

const CATEGORY_LAYOUT_MAP: Record<string, PosterLayout> = {
  "Restaurant / Cafe": "split-panel",
  "Retail / Clothing": "gradient-badge",
  "Salon / Beauty": "elegant-frame",
  "Electronics": "gradient-badge",
  "Medical Shop / Pharmacy": "split-panel",
}

export function getTemplateForCategory(category: string): PosterLayout {
  return CATEGORY_LAYOUT_MAP[category] || "gradient-badge"
}