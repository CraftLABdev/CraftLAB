"use client"
import { useEffect, useState } from "react"
import AppHeader from "@/components/app/AppHeader"
import StatsBar from "@/components/app/StatsBar"
import TokenChart from "@/components/app/TokenChart"
import TokenTable, { type Coin } from "@/components/app/TokenTable"

export default function AppPage() {
  const [coins, setCoins]   = useState<Coin[]>([])
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState("solana")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/app/tokens")
      .then(r => r.json())
      .then((data: Coin[]) => { setCoins(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const selectedToken = coins.find(c => c.id === selectedId) ?? null

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#e8e8e8", fontFamily: "Inter, sans-serif" }}>
      <AppHeader search={search} onSearch={setSearch} />
      <StatsBar />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Chart + sidebar row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>

          <TokenChart token={selectedToken} />

          {/* Right sidebar: top movers */}
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.08em", marginBottom: 8 }}>
              TOP MOVERS 24H
            </div>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ height: 44, borderRadius: 8, background: "#1a1a1a", marginBottom: 4 }} />
                ))
              : [...coins]
                  .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
                  .slice(0, 8)
                  .map(coin => {
                    const pos = coin.price_change_percentage_24h >= 0
                    const isSelected = selectedId === coin.id
                    return (
                      <div
                        key={coin.id}
                        onClick={() => setSelectedId(coin.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                          borderRadius: 8, cursor: "pointer",
                          background: isSelected ? "#1a2a1a" : "transparent",
                          border: isSelected ? "1px solid #2a3a2a" : "1px solid transparent",
                          transition: "all 0.15s",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coin.image} alt={coin.symbol} width={22} height={22}
                          style={{ borderRadius: "50%", width: 22, height: 22, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#e8e8e8" }}>{coin.symbol.toUpperCase()}</div>
                          <div style={{ fontSize: 11, color: "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {coin.name}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: pos ? "#00d964" : "#ff4d4d" }}>
                            {pos ? "+" : ""}{coin.price_change_percentage_24h.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    )
                  })
            }

            {/* CraftLAB earn box */}
            <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 10, background: "linear-gradient(135deg, #0a1f0a, #0d270d)", border: "1px solid #1a3a1a" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#00d964", letterSpacing: "0.06em", marginBottom: 6 }}>⛏ CRAFTLAB EARN</div>
              <p style={{ fontSize: 11, color: "#6b9e6b", lineHeight: 1.5, marginBottom: 8 }}>
                Stake SOL → Mine $CRAFT from this market data in real-time
              </p>
              <button style={{
                width: "100%", padding: "7px 0", borderRadius: 7, fontSize: 11, fontWeight: 700,
                background: "linear-gradient(135deg, #00d964, #16a34a)", color: "#000",
                border: "none", cursor: "pointer",
              }}>
                Start Mining →
              </button>
            </div>
          </div>
        </div>

        {/* Token table */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontWeight: 900, fontSize: 16, color: "#fff", letterSpacing: "-0.01em" }}>
              Solana Ecosystem
              <span style={{ fontSize: 11, color: "#555", fontWeight: 400, marginLeft: 8 }}>
                {coins.length} tokens tracked
              </span>
            </h2>
            <div style={{ display: "flex", gap: 6 }}>
              {["All", "DeFi", "Meme", "Gaming"].map(f => (
                <button
                  key={f}
                  style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: f === "All" ? "#1e1e1e" : "transparent",
                    color: f === "All" ? "#e8e8e8" : "#555",
                    border: `1px solid ${f === "All" ? "#333" : "#1e1e1e"}`,
                    cursor: "pointer",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading
            ? (
              <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 40, textAlign: "center" }}>
                <span style={{ color: "#333", fontSize: 13 }}>Loading market data...</span>
              </div>
            )
            : <TokenTable coins={coins} search={search} selected={selectedId} onSelect={setSelectedId} />
          }
        </div>

        <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 8 }} />
      </div>
    </div>
  )
}
