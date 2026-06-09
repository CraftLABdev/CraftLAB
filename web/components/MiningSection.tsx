"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const TIERS = [
  { name: "Iron Pick",    stake: "0.1 SOL", rate: "12",  color: "#6b7280", pct: 12 },
  { name: "Gold Pick",    stake: "0.5 SOL", rate: "48",  color: "#d97706", pct: 36 },
  { name: "Diamond Pick", stake: "2.0 SOL", rate: "120", color: "#2563eb", pct: 64 },
  { name: "Netherite",    stake: "5.0 SOL", rate: "300", color: "#7c3aed", pct: 100 },
]

export default function MiningSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="mine" ref={ref} className="section max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-start">

        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="lg:w-5/12 flex-shrink-0"
        >
          <div className="label-pixel mb-4">THE MINE</div>
          <h2 className="font-black text-4xl md:text-5xl leading-tight mb-6" style={{ letterSpacing: "-0.025em" }}>
            Stake SOL.<br />
            <span className="italic text-green-DEFAULT">Mine every day.</span>
          </h2>
          <p className="text-muted text-[16px] leading-relaxed mb-8">
            Four pickaxe tiers. The more you stake, the faster your vein produces.
            No lock-ups, no hidden fees — withdraw your stake anytime.
          </p>

          {/* Big pixel block decoration */}
          <motion.div
            animate={{ y: [-4, 6, -4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="pixel-block inline-block"
            style={{ width: 72, height: 72 }}
          />
        </motion.div>

        {/* Right — tier cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.09, duration: 0.45 }}
              whileHover={{ y: -3, boxShadow: "0 8px 28px rgba(0,0,0,0.08)" }}
              className="card p-6 transition-shadow cursor-default"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-bold text-base">{t.name}</span>
                <span className="font-pixel text-xs" style={{ color: t.color, fontSize: 8 }}>PICK</span>
              </div>

              <div className="font-black text-3xl mb-0.5" style={{ letterSpacing: "-0.02em", color: t.color }}>
                {t.rate}
              </div>
              <div className="text-xs text-muted mb-5">$CRAFT per day</div>

              {/* Bar */}
              <div className="h-1.5 bg-bg2 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: t.color }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${t.pct}%` } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Required stake</span>
                <span className="font-semibold">{t.stake}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
