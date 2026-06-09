"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const stats = [
  { label: "Total $CRAFT Mined", value: "2,421,880", suffix: "" },
  { label: "Active Miners",       value: "1,240",     suffix: "" },
  { label: "Daily Yield (avg)",   value: "84",         suffix: " CRAFT/day" },
]

const tiers = [
  { name: "Iron Pick",   rate: "12 CRAFT/day",  req: "0.1 SOL staked",  color: "#9ca3af" },
  { name: "Gold Pick",   rate: "48 CRAFT/day",  req: "0.5 SOL staked",  color: "#fbbf24" },
  { name: "Diamond Pick",rate: "120 CRAFT/day", req: "2.0 SOL staked",  color: "#60a5fa" },
  { name: "Netherite",   rate: "300 CRAFT/day", req: "5.0 SOL staked",  color: "#a855f7" },
]

export default function MiningSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="mine" ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="font-pixel text-green-DEFAULT text-xs mb-4 tracking-widest">⛏ THE MINE</div>
        <h2 className="font-pixel text-2xl md:text-3xl text-[#e2f0e2] mb-4">Stake SOL. Mine $CRAFT.</h2>
        <p className="text-[#6b9e6b] max-w-lg mx-auto">
          Deposit SOL into the mine. Your pickaxe tier determines how fast $CRAFT flows to your wallet.
          The longer you mine, the richer your vein.
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-card border border-border p-6 text-center animate-pulse-green"
            style={{ boxShadow: "inset 0 0 20px rgba(74,222,128,0.03)" }}
          >
            <div className="font-pixel text-green-DEFAULT text-xl mb-2">
              {s.value}{s.suffix}
            </div>
            <div className="text-xs text-muted">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, boxShadow: `0 8px 30px ${t.color}20` }}
            className="bg-card border border-border p-6 cursor-pointer transition-shadow"
          >
            <div className="font-pixel text-xs mb-3" style={{ color: t.color }}>
              {t.name}
            </div>
            <div className="text-green-DEFAULT font-semibold text-lg mb-1">{t.rate}</div>
            <div className="text-xs text-muted">{t.req}</div>

            {/* Mining bar */}
            <div className="mt-4 h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: t.color }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${25 * (i + 1)}%` } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
