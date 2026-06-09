import { NextResponse } from "next/server"

const CG = "https://api.coingecko.com/api/v3"
let cache: { data: unknown; ts: number } | null = null

export async function GET() {
  if (cache && Date.now() - cache.ts < 3 * 60 * 1000) {
    return NextResponse.json(cache.data)
  }
  try {
    const res = await fetch(
      `${CG}/coins/markets?vs_currency=usd&category=solana-ecosystem&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d`,
      { headers: { Accept: "application/json" }, next: { revalidate: 180 } }
    )
    if (!res.ok) throw new Error("CoinGecko error")
    const data = await res.json()
    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(FALLBACK)
  }
}

const mk = (id: string, sym: string, name: string, img: string, p: number, h1: number, h24: number, h7: number, mc: number, vol: number) => ({
  id, symbol: sym, name, image: img,
  current_price: p,
  price_change_percentage_1h_in_currency: h1,
  price_change_percentage_24h_in_currency: h24,
  price_change_percentage_7d_in_currency: h7,
  price_change_percentage_24h: h24,
  market_cap: mc, total_volume: vol,
  sparkline_in_7d: { price: Array.from({ length: 168 }, (_, i) => p * (1 + Math.sin(i * 0.18 + id.length) * 0.08)) },
})

const FALLBACK = [
  mk("solana","sol","Solana","https://assets.coingecko.com/coins/images/4128/small/solana.png",148.2,0.4,2.4,8.1,69000000000,2800000000),
  mk("bonk","bonk","Bonk","https://assets.coingecko.com/coins/images/28600/small/bonk.jpg",0.000021,-0.2,-1.2,-4.5,1500000000,180000000),
  mk("dogwifcoin","wif","dogwifhat","https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg",1.82,0.8,3.1,12.4,1800000000,210000000),
  mk("jupiter-exchange-solana","jup","Jupiter","https://assets.coingecko.com/coins/images/34188/small/jup.png",0.71,0.1,1.5,3.2,960000000,85000000),
  mk("raydium","ray","Raydium","https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg",3.42,-0.5,-2.1,-6.3,980000000,95000000),
  mk("orca-so","orca","Orca","https://assets.coingecko.com/coins/images/17547/small/Orca_Logo.png",2.81,0.3,0.9,2.1,280000000,24000000),
  mk("pyth-network","pyth","Pyth Network","https://assets.coingecko.com/coins/images/31891/small/pyth.png",0.18,-0.1,-1.4,-3.8,540000000,42000000),
  mk("jito-governance-token","jto","Jito","https://assets.coingecko.com/coins/images/33228/small/jto.png",2.14,0.6,1.8,5.5,320000000,28000000),
  mk("marinade","mnde","Marinade","https://assets.coingecko.com/coins/images/17274/small/MNDE.png",0.058,-0.2,-0.5,1.2,85000000,8000000),
  mk("peanut-the-squirrel","pnut","Peanut","https://assets.coingecko.com/coins/images/50566/small/pnut.png",0.39,1.2,5.2,18.3,420000000,65000000),
  mk("mew","mew","cat in a dogs world","https://assets.coingecko.com/coins/images/36440/small/mew.png",0.0054,-0.8,-3.2,-9.1,195000000,18000000),
  mk("fartcoin","fartcoin","Fartcoin","https://assets.coingecko.com/coins/images/51787/small/fartcoin.jpg",0.87,2.1,8.1,22.4,890000000,145000000),
  mk("moodeng","moodeng","Moo Deng","https://assets.coingecko.com/coins/images/50525/small/moodeng.png",0.11,-1.2,-4.5,-11.2,240000000,32000000),
  mk("pengu","pengu","Pudgy Penguins","https://assets.coingecko.com/coins/images/50561/small/PENGU_LOGO.png",0.0086,0.4,-1.1,2.8,540000000,48000000),
  mk("trump","trump","Official Trump","https://assets.coingecko.com/coins/images/52726/small/trump.png",11.2,0.9,2.8,6.7,2240000000,380000000),
]
