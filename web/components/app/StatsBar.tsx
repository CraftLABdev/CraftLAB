"use client"
import { useEffect, useState } from "react"

interface Stats {
  solPrice: number
  solChange: number
  totalMcap: number
  totalVol: number
}

function fmtB(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  return `$${(n / 1e6).toFixed(0)}M`
}

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch("/api/app/tokens")
      .then(r => r.json())
      .then((coins: { id: string; current_price: number; price_change_percentage_24h: number; market_cap: number; total_volume: number }[]) => {
        const sol = coins.find(c => c.id === "solana")
        const totalMcap = coins.reduce((s, c) => s + (c.market_cap || 0), 0)
        const totalVol = coins.reduce((s, c) => s + (c.total_volume || 0), 0)
        setStats({
          solPrice: sol?.current_price ?? 0,
          solChange: sol?.price_change_percentage_24h ?? 0,
          totalMcap,
          totalVol,
        })
      })
      .catch(() => {})
  }, [])

  const items = stats ? [
    { label: "SOL", value: `$${stats.solPrice.toFixed(2)}`, change: stats.solChange },
    { label: "Solana Ecosystem MCap", value: fmtB(stats.totalMcap), change: null },
    { label: "24h Volume", value: fmtB(stats.totalVol), change: null },
    { label: "Network", value: "Mainnet Beta", change: null },
    { label: "Avg TPS", value: "~3,500", change: null },
    { label: "Avg Fee", value: "$0.0003", change: null },
  ] : []

  return (
    <div style={{ background: "#0d0d0d", borderBottom: "1px solid #1e1e1e", overflowX: "auto" }}>
      <div className="flex items-center gap-0 px-4" style={{ height: 36, minWidth: "max-content" }}>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5" style={{ padding: "0 14px", borderRight: "1px solid #1e1e1e" }}>
            <span style={{ fontSize: 11, color: "#555" }}>{item.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#e8e8e8" }}>{item.value}</span>
            {item.change !== null && (
              <span style={{ fontSize: 11, fontWeight: 600, color: item.change >= 0 ? "#00d964" : "#ff4d4d" }}>
                {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
              </span>
            )}
          </div>
        ))}
        {!stats && (
          <span style={{ fontSize: 11, color: "#444", padding: "0 12px" }}>Loading market data...</span>
        )}
      </div>
    </div>
  )
}
