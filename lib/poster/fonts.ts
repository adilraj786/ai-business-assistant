async function loadGoogleFont(font: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${font.replace(
    " ",
    "+"
  )}:wght@${weight}`
  const css = await (await fetch(url)).text()
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/)

  if (!match) {
    throw new Error(`Could not load font: ${font}`)
  }

  const res = await fetch(match[1])
  return res.arrayBuffer()
}

async function loadPosterFontsInternal() {
  const [poppinsExtraBold, interRegular, interSemiBold] = await Promise.all([
    loadGoogleFont("Poppins", 800),
    loadGoogleFont("Inter", 400),
    loadGoogleFont("Inter", 600),
  ])

  return [
    { name: "Poppins", data: poppinsExtraBold, weight: 800 as const, style: "normal" as const },
    { name: "Inter", data: interRegular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: interSemiBold, weight: 600 as const, style: "normal" as const },
  ]
}

// Cache the promise itself — so even concurrent requests during a cold
// instance share one fetch instead of each re-downloading fonts.
let cachedFontsPromise: ReturnType<typeof loadPosterFontsInternal> | null = null

export function getPosterFonts() {
  if (!cachedFontsPromise) {
    cachedFontsPromise = loadPosterFontsInternal()
  }
  return cachedFontsPromise
}