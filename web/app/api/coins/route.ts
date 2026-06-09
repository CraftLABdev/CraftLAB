import { NextResponse } from "next/server"

const COINGECKO = "https://api.coingecko.com/api/v3"

// Cache 5 minutes
let cache: { data: unknown; ts: number } | null = null

export async function GET() {
  if (cache && Date.now() - cache.ts < 5 * 60 * 1000) {
    return NextResponse.json(cache.data)
  }

  try {
    const res = await fetch(
      `${COINGECKO}/coins/markets?vs_currency=usd&category=solana-ecosystem&order=market_cap_desc&per_page=24&page=1&sparkline=false&price_change_percentage=24h`,
      { headers: { Accept: "application/json" }, next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error("CoinGecko error")
    const data = await res.json()
    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch {
    // Fallback static list if CoinGecko is rate-limited
    return NextResponse.json(FALLBACK)
  }
}

const FALLBACK = [
  { id: "solana",         symbol: "SOL",     name: "Solana",       image: "https://assets.coingecko.com/coins/images/4128/small/solana.png",                current_price: 148.20, price_change_percentage_24h: 2.4  },
  { id: "bonk",           symbol: "BONK",    name: "Bonk",         image: "https://assets.coingecko.com/coins/images/28600/small/bonk.jpg",                  current_price: 0.000021, price_change_percentage_24h: -1.2 },
  { id: "dogwifcoin",     symbol: "WIF",     name: "dogwifhat",    image: "https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg",              current_price: 1.82,  price_change_percentage_24h: 3.1  },
  { id: "popcat",         symbol: "POPCAT",  name: "Popcat",       image: "https://assets.coingecko.com/coins/images/39487/small/popcat.png",                 current_price: 0.52,  price_change_percentage_24h: -0.8 },
  { id: "jupiter-exchange-solana", symbol: "JUP", name: "Jupiter", image: "https://assets.coingecko.com/coins/images/34188/small/jup.png",                   current_price: 0.71,  price_change_percentage_24h: 1.5  },
  { id: "raydium",        symbol: "RAY",     name: "Raydium",      image: "https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg",       current_price: 3.42,  price_change_percentage_24h: -2.1 },
  { id: "orca-so",        symbol: "ORCA",    name: "Orca",         image: "https://assets.coingecko.com/coins/images/17547/small/Orca_Logo.png",              current_price: 2.81,  price_change_percentage_24h: 0.9  },
  { id: "pyth-network",   symbol: "PYTH",    name: "Pyth Network", image: "https://assets.coingecko.com/coins/images/31891/small/pyth.png",                   current_price: 0.18,  price_change_percentage_24h: -1.4 },
  { id: "peanut-the-squirrel", symbol: "PNUT", name: "Peanut",    image: "https://assets.coingecko.com/coins/images/50566/small/pnut.png",                   current_price: 0.39,  price_change_percentage_24h: 5.2  },
  { id: "mew",            symbol: "MEW",     name: "cat in a dogs world", image: "https://assets.coingecko.com/coins/images/36440/small/mew.png",             current_price: 0.0054, price_change_percentage_24h: -3.2 },
  { id: "fartcoin",       symbol: "FARTCOIN",name: "Fartcoin",     image: "https://assets.coingecko.com/coins/images/51787/small/fartcoin.jpg",               current_price: 0.87,  price_change_percentage_24h: 8.1  },
  { id: "moodeng",        symbol: "MOODENG", name: "Moo Deng",     image: "https://assets.coingecko.com/coins/images/50525/small/moodeng.png",                current_price: 0.11,  price_change_percentage_24h: -4.5 },
  { id: "trump",          symbol: "TRUMP",   name: "Official Trump",image: "https://assets.coingecko.com/coins/images/52726/small/trump.png",                 current_price: 11.20, price_change_percentage_24h: 2.8  },
  { id: "pengu",          symbol: "PENGU",   name: "Pudgy Penguins",image: "https://assets.coingecko.com/coins/images/50561/small/PENGU_LOGO.png",            current_price: 0.0086, price_change_percentage_24h: -1.1 },
  { id: "jito-governance-token", symbol: "JTO", name: "Jito",     image: "https://assets.coingecko.com/coins/images/33228/small/jto.png",                    current_price: 2.14,  price_change_percentage_24h: 1.8  },
  { id: "marinade",       symbol: "MNDE",    name: "Marinade",     image: "https://assets.coingecko.com/coins/images/17274/small/MNDE.png",                   current_price: 0.058, price_change_percentage_24h: -0.5 },
]
