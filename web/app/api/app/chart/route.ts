import { NextResponse, NextRequest } from "next/server"

const CG = "https://api.coingecko.com/api/v3"
const chartCache = new Map<string, { data: unknown; ts: number }>()

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || "solana"
  const days = req.nextUrl.searchParams.get("days") || "7"
  const key = `${id}:${days}`

  const hit = chartCache.get(key)
  if (hit && Date.now() - hit.ts < 3 * 60 * 1000) {
    return NextResponse.json(hit.data)
  }

  try {
    const res = await fetch(
      `${CG}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${days === "1" ? "hourly" : "daily"}`,
      { headers: { Accept: "application/json" }, next: { revalidate: 180 } }
    )
    if (!res.ok) throw new Error("CoinGecko error")
    const raw = await res.json()

    // Downsample to max 100 points
    const prices: [number, number][] = raw.prices
    const step = Math.max(1, Math.floor(prices.length / 100))
    const data = prices
      .filter((_: unknown, i: number) => i % step === 0)
      .map(([ts, p]: [number, number]) => ({ ts, p }))

    chartCache.set(key, { data, ts: Date.now() })
    return NextResponse.json(data)
  } catch {
    // Sine-wave fallback
    const n = 100
    const base = 148
    return NextResponse.json(
      Array.from({ length: n }, (_, i) => ({
        ts: Date.now() - (n - i) * (parseInt(days) * 86400000 / n),
        p: base + Math.sin(i * 0.18) * 12 + i * 0.1,
      }))
    )
  }
}
