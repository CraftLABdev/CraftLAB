"use client"
import { useEffect, useState } from "react"

interface ChartPt { ts: number; p: number }
interface Token { id: string; symbol: string; name: string; image: string; current_price: number; price_change_percentage_24h: number; market_cap: number; total_volume: number }

const RANGES = [
  { label: "1D", days: "1" },
  { label: "7D", days: "7" },
  { label: "30D", days: "30" },
  { label: "90D", days: "90" },
]

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

export default function TokenChart({ token }: { token: Token | null }) {
  const [range, setRange] = useState("7")
  const [chart, setChart] = useState<ChartPt[]>([])
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState<{ x: number; y: number; p: number; ts: number } | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(`/api/app/chart?id=${token.id}&days=${range}`)
      .then(r => r.json())
      .then(d => { setChart(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token?.id, range])

  const W = 800, H = 200
  const pos = (token?.price_change_percentage_24h ?? 0) >= 0
  const color = pos ? "#00d964" : "#ff4d4d"

  let svgContent = null
  if (chart.length >= 2) {
    const prices = chart.map(d => d.p)
    const min = Math.min(...prices), max = Math.max(...prices)
    const range2 = max - min || 1
    const xs = chart.map((_, i) => (i / (chart.length - 1)) * W)
    const ys = chart.map(d => H - ((d.p - min) / range2) * (H - 24) - 12)
    const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")
    const area = `${line} L${W},${H} L0,${H} Z`

    // Hover handler
    const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const xPct = (e.clientX - rect.left) / rect.width
      const idx = Math.min(chart.length - 1, Math.max(0, Math.round(xPct * (chart.length - 1))))
      setHovered({ x: xPct * 100, y: (ys[idx] / H) * 100, p: chart[idx].p, ts: chart[idx].ts })
    }

    svgContent = (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: H, cursor: "crosshair" }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1="0" y1={H * f} x2={W} y2={H * f} stroke="#1e1e1e" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#chartGrad)" />
        <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Hover crosshair */}
        {hovered && (
          <>
            <line x1={hovered.x / 100 * W} y1={0} x2={hovered.x / 100 * W} y2={H} stroke="#333" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx={hovered.x / 100 * W} cy={hovered.y / 100 * H} r="4" fill={color} stroke="#0d0d0d" strokeWidth="2" />
          </>
        )}
      </svg>
    )
  }

  if (!token) {
    return (
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 24, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#333", fontSize: 14 }}>Select a token to view chart</span>
      </div>
    )
  }

  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 20 }}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={token.image} alt={token.symbol} width={36} height={36} style={{ borderRadius: "50%", width: 36, height: 36 }} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: "#fff", letterSpacing: "-0.01em" }}>
              {token.name}
              <span style={{ fontWeight: 400, fontSize: 12, color: "#555", marginLeft: 6 }}>{token.symbol.toUpperCase()}/USD</span>
            </div>
            {hovered ? (
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
                {fmtPrice(hovered.p)}
                <span style={{ fontSize: 11, color: "#555", fontWeight: 400, marginLeft: 8 }}>
                  {new Date(hovered.ts).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ) : (
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
                {fmtPrice(token.current_price)}
                <span style={{ fontSize: 13, fontWeight: 700, color, marginLeft: 8 }}>
                  {pos ? "▲" : "▼"} {Math.abs(token.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#555" }}>Market Cap</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8" }}>{fmtB(token.market_cap)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#555" }}>24h Volume</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8" }}>{fmtB(token.total_volume)}</div>
          </div>
          {/* Range tabs */}
          <div className="flex gap-1">
            {RANGES.map(r => (
              <button
                key={r.days}
                onClick={() => setRange(r.days)}
                style={{
                  padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
                  background: range === r.days ? color : "#1a1a1a",
                  color: range === r.days ? "#000" : "#555",
                  border: `1px solid ${range === r.days ? color : "#2a2a2a"}`,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div style={{ position: "relative" }}>
        {loading && (
          <div style={{ position: "absolute", inset: 0, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, borderRadius: 8 }}>
            <span style={{ color: "#333", fontSize: 12 }}>Loading chart...</span>
          </div>
        )}
        {svgContent ?? (
          <div style={{ height: H, background: "#0d0d0d", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
        )}
      </div>

      {/* X-axis dates */}
      {chart.length > 1 && (
        <div className="flex justify-between mt-1">
          {[0, 0.25, 0.5, 0.75, 1].map(f => {
            const idx = Math.min(chart.length - 1, Math.round(f * (chart.length - 1)))
            return (
              <span key={f} style={{ fontSize: 10, color: "#444" }}>
                {new Date(chart[idx].ts).toLocaleDateString("en", { month: "short", day: "numeric" })}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
