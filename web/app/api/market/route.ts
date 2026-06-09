import { NextResponse } from "next/server"

const CG = "https://api.coingecko.com/api/v3"

let cache: { data: unknown; ts: number } | null = null

export async function GET() {
  if (cache && Date.now() - cache.ts < 3 * 60 * 1000) {
    return NextResponse.json(cache.data)
  }

  try {
    const [chartRes, coinsRes] = await Promise.all([
      fetch(`${CG}/coins/solana/market_chart?vs_currency=usd&days=7&interval=hourly`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 180 },
      }),
      fetch(
        `${CG}/coins/markets?vs_currency=usd&ids=solana,bonk,dogwifcoin,jupiter-exchange-solana,raydium,pyth-network,jito-governance-token,orca-so&order=market_cap_desc&per_page=8&sparkline=true&price_change_percentage=24h`,
        { headers: { Accept: "application/json" }, next: { revalidate: 180 } }
      ),
    ])

    if (!chartRes.ok || !coinsRes.ok) throw new Error("CoinGecko error")

    const [chart, coins] = await Promise.all([chartRes.json(), coinsRes.json()])

    // Downsample SOL chart to 42 points (every 4h) for clean rendering
    const prices: [number, number][] = chart.prices
    const step = Math.max(1, Math.floor(prices.length / 42))
    const solChart = prices.filter((_: unknown, i: number) => i % step === 0).map(([ts, p]: [number, number]) => ({ ts, p }))

    const data = { solChart, coins }
    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(FALLBACK)
  }
}

const FALLBACK = {
  solChart: Array.from({ length: 42 }, (_, i) => ({
    ts: Date.now() - (41 - i) * 4 * 3600 * 1000,
    p: 148 + Math.sin(i * 0.4) * 8 + i * 0.3,
  })),
  coins: [
    { id: "solana",   symbol: "sol",   name: "Solana",   image: "https://assets.coingecko.com/coins/images/4128/small/solana.png",   current_price: 148.20, price_change_percentage_24h: 2.4,  market_cap: 69000000000, total_volume: 2800000000, sparkline_in_7d: { price: [] } },
    { id: "bonk",     symbol: "bonk",  name: "Bonk",     image: "https://assets.coingecko.com/coins/images/28600/small/bonk.jpg",   current_price: 0.000021, price_change_percentage_24h: -1.2, market_cap: 1500000000, total_volume: 180000000, sparkline_in_7d: { price: [] } },
    { id: "dogwifcoin",symbol:"wif",   name: "dogwifhat",image: "https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg", current_price: 1.82, price_change_percentage_24h: 3.1, market_cap: 1800000000, total_volume: 210000000, sparkline_in_7d: { price: [] } },
    { id: "jupiter-exchange-solana", symbol: "jup", name: "Jupiter", image: "https://assets.coingecko.com/coins/images/34188/small/jup.png", current_price: 0.71, price_change_percentage_24h: 1.5, market_cap: 960000000, total_volume: 85000000, sparkline_in_7d: { price: [] } },
    { id: "raydium",  symbol: "ray",   name: "Raydium",  image: "https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg", current_price: 3.42, price_change_percentage_24h: -2.1, market_cap: 980000000, total_volume: 95000000, sparkline_in_7d: { price: [] } },
    { id: "pyth-network", symbol: "pyth", name: "Pyth", image: "https://assets.coingecko.com/coins/images/31891/small/pyth.png", current_price: 0.18, price_change_percentage_24h: -1.4, market_cap: 540000000, total_volume: 42000000, sparkline_in_7d: { price: [] } },
    { id: "jito-governance-token", symbol: "jto", name: "Jito", image: "https://assets.coingecko.com/coins/images/33228/small/jto.png", current_price: 2.14, price_change_percentage_24h: 1.8, market_cap: 320000000, total_volume: 28000000, sparkline_in_7d: { price: [] } },
    { id: "orca-so",  symbol: "orca",  name: "Orca",     image: "https://assets.coingecko.com/coins/images/17547/small/Orca_Logo.png", current_price: 2.81, price_change_percentage_24h: 0.9, market_cap: 280000000, total_volume: 24000000, sparkline_in_7d: { price: [] } },
  ],
}
