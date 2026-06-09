"use client"
import { useEffect, useState, useRef } from "react"

interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

const FEATURES = [
  "⛏ Mine $CRAFT daily",
  "✦ Bonding curve crafting",
  "🧱 4 blueprint tiers",
  "✦ AI recipe advisor",
  "🔒 Non-custodial",
  "✦ Solana mainnet",
  "⚡ Sub-second finality",
  "✦ No lock-up periods",
  "📜 500 legendary blueprints",
  "✦ Telegram bot included",
  "🌿 Open source",
  "✦ MIT license",
]

function fmt(price: number) {
  if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  if (price >= 1)    return `$${price.toFixed(2)}`
  if (price >= 0.01) return `$${price.toFixed(4)}`
  return `$${price.toFixed(6)}`
}

export default function CoinTicker() {
  const [coins, setCoins] = useState<Coin[]>([])

  useEffect(() => {
    fetch("/api/coins")
      .then(r => r.json())
      .then(data => Array.isArray(data) && setCoins(data))
      .catch(() => {})
  }, [])

  // Duplicate arrays for seamless loop
  const coinLoop = [...coins, ...coins]
  const featureLoop = [...FEATURES, ...FEATURES]

  if (!coins.length) return null

  return (
    <div className="border-y border-border overflow-hidden bg-card">
      {/* Row 1: Coin logos */}
      <div className="relative border-b border-border py-3">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #ffffff 0%, transparent 100%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(270deg, #ffffff 0%, transparent 100%)" }} />

        <div className="flex gap-0 w-max" style={{ animation: "ticker 40s linear infinite" }}>
          {coinLoop.map((coin, i) => (
            <div key={`${coin.id}-${i}`}
              className="flex items-center gap-2 px-4 border-r border-border whitespace-nowrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coin.image}
                alt={coin.symbol}
                width={22}
                height={22}
                className="rounded-full object-cover"
                style={{ width: 22, height: 22 }}
              />
              <span className="font-semibold text-sm text-text">
                {coin.symbol.toUpperCase()}
              </span>
              <span className="text-xs text-muted">{fmt(coin.current_price)}</span>
              <span className={`text-xs font-medium ${coin.price_change_percentage_24h >= 0 ? "text-green-DEFAULT" : "text-red-500"}`}>
                {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                {coin.price_change_percentage_24h?.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Feature text ticker (yellow bar like magpie) */}
      <div className="relative py-2.5" style={{ background: "#fef9c3" }}>
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #fef9c3 0%, transparent 100%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(270deg, #fef9c3 0%, transparent 100%)" }} />

        <div className="flex gap-0 w-max" style={{ animation: "ticker 28s linear infinite reverse" }}>
          {featureLoop.map((feat, i) => (
            <span key={i} className="px-6 text-xs font-semibold text-yellow-800 whitespace-nowrap border-r border-yellow-200">
              {feat}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
