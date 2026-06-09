"use client"
import { useState, useMemo } from "react"

export interface Coin {
  id: string; symbol: string; name: string; image: string
  current_price: number
  price_change_percentage_1h_in_currency: number
  price_change_percentage_24h_in_currency: number
  price_change_percentage_7d_in_currency: number
  price_change_percentage_24h: number
  market_cap: number; total_volume: number
  sparkline_in_7d: { price: number[] }
}

type SortKey = "market_cap" | "current_price" | "price_change_percentage_24h_in_currency" | "price_change_percentage_7d_in_currency" | "total_volume"

function fmtPrice(p: number) {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  if (p >= 1)    return `$${p.toFixed(2)}`
  if (p >= 0.01) return `$${p.toFixed(4)}`
  return `$${p.toFixed(6)}`
}
function fmtB(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toLocaleString()}`
}

function PctCell({ v }: { v: number }) {
  const pos = v >= 0
  return (
    <span style={{ color: pos ? "#00d964" : "#ff4d4d", fontWeight: 600, fontSize: 12 }}>
      {pos ? "+" : ""}{v?.toFixed(2)}%
    </span>
  )
}

function MiniSpark({ data, pos }: { data: number[]; pos: boolean }) {
  if (!data || data.length < 2) return <div style={{ width: 64, height: 28 }} />
  const pts = data.slice(-40)
  const min = Math.min(...pts), max = Math.max(...pts), range = max - min || 1
  const W = 64, H = 28
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * W)
  const ys = pts.map(v => H - ((v - min) / range) * (H - 4) - 2)
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <path d={d} fill="none" stroke={pos ? "#00d964" : "#ff4d4d"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface Props {
  coins: Coin[]
  search: string
  selected: string | null
  onSelect: (id: string) => void
}

export default function TokenTable({ coins, search, selected, onSelect }: Props) {
  const [sort, setSort] = useState<SortKey>("market_cap")
  const [dir, setDir] = useState<1 | -1>(-1)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return coins
      .filter(c => !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      .sort((a, b) => dir * ((b[sort] ?? 0) - (a[sort] ?? 0)))
  }, [coins, search, sort, dir])

  function toggleSort(key: SortKey) {
    if (sort === key) setDir(d => d === 1 ? -1 : 1)
    else { setSort(key); setDir(-1) }
  }

  const thStyle = (key: SortKey) => ({
    fontSize: 11, color: sort === key ? "#e8e8e8" : "#555", fontWeight: 600,
    cursor: "pointer", userSelect: "none" as const, padding: "0 8px",
    whiteSpace: "nowrap" as const,
  })

  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
      {/* Table header */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #222" }}>
              <th style={{ ...thStyle("market_cap"), width: 36, paddingLeft: 16, textAlign: "left" }}>#</th>
              <th style={{ fontSize: 11, color: "#555", fontWeight: 600, padding: "10px 8px", textAlign: "left" }}>Token</th>
              <th style={{ ...thStyle("current_price"), textAlign: "right" }} onClick={() => toggleSort("current_price")}>
                Price {sort === "current_price" ? (dir === -1 ? "↓" : "↑") : ""}
              </th>
              <th style={{ ...thStyle("price_change_percentage_24h_in_currency"), textAlign: "right" }} onClick={() => toggleSort("price_change_percentage_24h_in_currency")}>
                1h% {sort === "price_change_percentage_24h_in_currency" ? (dir === -1 ? "↓" : "↑") : ""}
              </th>
              <th style={{ ...thStyle("price_change_percentage_24h_in_currency"), textAlign: "right" }} onClick={() => toggleSort("price_change_percentage_24h_in_currency")}>
                24h% {sort === "price_change_percentage_24h_in_currency" ? (dir === -1 ? "↓" : "↑") : ""}
              </th>
              <th style={{ ...thStyle("price_change_percentage_7d_in_currency"), textAlign: "right" }} onClick={() => toggleSort("price_change_percentage_7d_in_currency")}>
                7d% {sort === "price_change_percentage_7d_in_currency" ? (dir === -1 ? "↓" : "↑") : ""}
              </th>
              <th style={{ ...thStyle("market_cap"), textAlign: "right" }} onClick={() => toggleSort("market_cap")}>
                MCap {sort === "market_cap" ? (dir === -1 ? "↓" : "↑") : ""}
              </th>
              <th style={{ ...thStyle("total_volume"), textAlign: "right" }} onClick={() => toggleSort("total_volume")}>
                Volume 24h {sort === "total_volume" ? (dir === -1 ? "↓" : "↑") : ""}
              </th>
              <th style={{ fontSize: 11, color: "#555", fontWeight: 600, padding: "10px 16px 10px 8px", textAlign: "right" }}>7d Chart</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((coin, i) => {
              const pos24 = (coin.price_change_percentage_24h_in_currency ?? 0) >= 0
              const pos7  = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0
              const isSelected = selected === coin.id
              return (
                <tr
                  key={coin.id}
                  onClick={() => onSelect(coin.id)}
                  style={{
                    borderBottom: "1px solid #1a1a1a",
                    background: isSelected ? "#1a2a1a" : "transparent",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = "#161616" }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = "transparent" }}
                >
                  <td style={{ padding: "10px 8px 10px 16px", fontSize: 12, color: "#444", width: 36 }}>{i + 1}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coin.image} alt={coin.symbol} width={24} height={24}
                        style={{ borderRadius: "50%", width: 24, height: 24, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: 13, color: "#e8e8e8" }}>{coin.name}</span>
                      <span style={{ fontSize: 11, color: "#444", background: "#1a1a1a", padding: "1px 5px", borderRadius: 4 }}>
                        {coin.symbol.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#e8e8e8" }}>
                    {fmtPrice(coin.current_price)}
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "right" }}>
                    <PctCell v={coin.price_change_percentage_1h_in_currency ?? 0} />
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "right" }}>
                    <PctCell v={coin.price_change_percentage_24h_in_currency ?? 0} />
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "right" }}>
                    <PctCell v={coin.price_change_percentage_7d_in_currency ?? 0} />
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "right", fontSize: 12, color: "#aaa" }}>
                    {fmtB(coin.market_cap)}
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "right", fontSize: 12, color: "#aaa" }}>
                    {fmtB(coin.total_volume)}
                  </td>
                  <td style={{ padding: "10px 16px 10px 8px", textAlign: "right" }}>
                    <MiniSpark data={coin.sparkline_in_7d?.price ?? []} pos={pos7} />
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: 32, textAlign: "center", color: "#444", fontSize: 13 }}>
                  No tokens found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1px solid #1a1a1a", fontSize: 11, color: "#444" }}>
        {filtered.length} tokens
      </div>
    </div>
  )
}
