"use client"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

/* ─── Types ─── */
interface ChartPoint { ts: number; p: number }
interface Coin {
  id: string; symbol: string; name: string; image: string
  current_price: number; price_change_percentage_24h: number
  market_cap: number; total_volume: number
  sparkline_in_7d: { price: number[] }
}
interface MarketData { solChart: ChartPoint[]; coins: Coin[] }

/* ─── Helpers ─── */
function fmtPrice(p: number) {
  if (p >= 1000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  if (p >= 1)    return `$${p.toFixed(2)}`
  if (p >= 0.01) return `$${p.toFixed(4)}`
  return `$${p.toFixed(6)}`
}
function fmtCap(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toLocaleString()}`
}

/* ─── SVG Sparkline ─── */
function Sparkline({ data, positive, w = 80, h = 32 }: { data: number[]; positive: boolean; w?: number; h?: number }) {
  if (!data || data.length < 2) return <div style={{ width: w, height: h }} />
  const pts = data.slice(-40)
  const min = Math.min(...pts), max = Math.max(...pts)
  const range = max - min || 1
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w)
  const ys = pts.map(v => h - ((v - min) / range) * (h - 4) - 2)
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")
  const color = positive ? "#16a34a" : "#ef4444"
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Main SOL chart ─── */
function SolChart({ data }: { data: ChartPoint[] }) {
  const W = 480, H = 140
  if (!data || data.length < 2) return <div className="w-full" style={{ height: H }} />
  const prices = data.map(d => d.p)
  const min = Math.min(...prices), max = Math.max(...prices)
  const range = max - min || 1
  const xs = data.map((_, i) => (i / (data.length - 1)) * W)
  const ys = data.map(d => H - ((d.p - min) / range) * (H - 16) - 8)
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")
  const area = `${line} L${W},${H} L0,${H} Z`
  const positive = prices[prices.length - 1] >= prices[0]
  const color = positive ? "#16a34a" : "#ef4444"

  // X-axis labels — every 24h tick
  const dayTicks = data.filter((_, i) => i % Math.floor(data.length / 7) === 0).slice(0, 7)

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: H }}>
        <defs>
          <linearGradient id="solGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#solGrad)" />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Current price dot */}
        <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="4" fill={color} />
      </svg>
      {/* Day labels */}
      <div className="flex justify-between mt-1">
        {dayTicks.map((d, i) => (
          <span key={i} className="text-xs text-muted">
            {new Date(d.ts).toLocaleDateString("en", { month: "short", day: "numeric" })}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Token row ─── */
function TokenRow({ coin, i }: { coin: Coin; i: number }) {
  const pos = coin.price_change_percentage_24h >= 0
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.05 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg2 transition-colors"
    >
      <span className="text-xs text-muted w-5 text-right">{i + 1}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={coin.image} alt={coin.symbol} width={28} height={28} className="rounded-full" style={{ width: 28, height: 28 }} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-text leading-none">{coin.symbol.toUpperCase()}</div>
        <div className="text-xs text-muted truncate">{coin.name}</div>
      </div>
      <Sparkline data={coin.sparkline_in_7d?.price ?? []} positive={pos} />
      <div className="text-right min-w-[80px]">
        <div className="font-semibold text-sm text-text">{fmtPrice(coin.current_price)}</div>
        <div className={`text-xs font-medium ${pos ? "text-green-DEFAULT" : "text-red-500"}`}>
          {pos ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
        </div>
      </div>
      <div className="text-right min-w-[72px] hidden md:block">
        <div className="text-xs text-muted">MCap</div>
        <div className="text-xs font-medium text-text">{fmtCap(coin.market_cap)}</div>
      </div>
    </motion.div>
  )
}

/* ─── Main section ─── */
export default function MarketSection() {
  const [data, setData] = useState<MarketData | null>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!inView) return
    fetch("/api/market")
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [inView])

  const sol = data?.coins.find(c => c.id === "solana")
  const others = data?.coins.filter(c => c.id !== "solana") ?? []
  const solChange = sol?.price_change_percentage_24h ?? 0
  const solPos = solChange >= 0

  return (
    <section ref={ref} id="market" className="py-24 max-w-6xl mx-auto px-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <span className="label-pixel mb-3 block">SOLANA MARKET</span>
        <h2 className="font-black text-text mb-3" style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.02em" }}>
          The ecosystem you're<br />crafting on.
        </h2>
        <p className="text-muted text-base max-w-lg">
          $CRAFT is mined from staked SOL — here's what's moving in the Solana ecosystem right now.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left: SOL featured card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="lg:col-span-3 card p-6 flex flex-col gap-4"
        >
          {/* SOL header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {sol && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sol.image} alt="SOL" width={36} height={36} className="rounded-full" style={{ width: 36, height: 36 }} />
              )}
              <div>
                <div className="font-black text-text text-lg leading-none">Solana</div>
                <div className="label-pixel mt-0.5">SOL</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-2xl text-text" style={{ letterSpacing: "-0.02em" }}>
                {sol ? fmtPrice(sol.current_price) : "—"}
              </div>
              <div className={`text-sm font-semibold ${solPos ? "text-green-DEFAULT" : "text-red-500"}`}>
                {solPos ? "▲" : "▼"} {Math.abs(solChange).toFixed(2)}% (24h)
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-2">
            {data ? <SolChart data={data.solChart} /> : (
              <div className="w-full rounded-lg bg-bg2 animate-pulse" style={{ height: 140 }} />
            )}
          </div>

          {/* Stats row */}
          {sol && (
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="bg-bg2 rounded-lg px-4 py-3">
                <div className="text-xs text-muted mb-0.5">Market Cap</div>
                <div className="font-bold text-text">{fmtCap(sol.market_cap)}</div>
              </div>
              <div className="bg-bg2 rounded-lg px-4 py-3">
                <div className="text-xs text-muted mb-0.5">24h Volume</div>
                <div className="font-bold text-text">{fmtCap(sol.total_volume)}</div>
              </div>
            </div>
          )}

          {/* CraftLAB context note */}
          <div className="border border-border rounded-lg px-4 py-3 flex items-start gap-2 mt-1">
            <span className="text-green-DEFAULT text-base mt-0.5">⛏</span>
            <p className="text-xs text-muted leading-relaxed">
              Every SOL staked in CraftLAB generates $CRAFT tokens proportional to network yield.
              The stronger Solana performs, the more $CRAFT you mine.
            </p>
          </div>
        </motion.div>

        {/* Right: token list */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="lg:col-span-2 card p-4 flex flex-col"
        >
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
            <span className="label-pixel">TOP SOLANA TOKENS</span>
            <span className="text-xs text-muted">7d chart</span>
          </div>
          <div className="flex-1 overflow-auto mt-1">
            {data
              ? others.map((coin, i) => <TokenRow key={coin.id} coin={coin} i={i} />)
              : Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-bg2 animate-pulse" />
                    <div className="flex-1 h-8 rounded bg-bg2 animate-pulse" />
                  </div>
                ))
            }
          </div>
          <div className="border-t border-border pt-2 px-4 mt-1" />
        </motion.div>
      </div>
    </section>
  )
}
