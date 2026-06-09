"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const STEPS = [
  {
    n: "01",
    title: "Stake SOL, open the mine",
    desc: "Deposit SOL into CraftLAB. Your pickaxe tier is determined by how much you stake — from Iron Pick (0.1 SOL) up to Netherite (5 SOL). The mine runs 24/7.",
    icon: "⛏",
  },
  {
    n: "02",
    title: "Mine $CRAFT every day",
    desc: "$CRAFT tokens accumulate in your wallet automatically. Higher tier = faster rate. Come back daily to claim, or let it stack up for a big craft session.",
    icon: "🌿",
  },
  {
    n: "03",
    title: "Combine ingredients to craft",
    desc: "Open the 3×3 crafting table. Arrange CRAFT, SOL, STONE, GOLD, and MANA in the right pattern to unlock blueprints — from common to legendary.",
    icon: "🧱",
  },
  {
    n: "04",
    title: "Blueprints multiply your yield",
    desc: "Each blueprint you hold boosts your mining output. Legendary blueprints deliver 20× base yield and include a DAO governance vote. Stack them to dominate the mine.",
    icon: "👑",
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="how" ref={ref} className="section max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <div className="label-pixel mb-4">HOW IT WORKS</div>
        <h2 className="font-black text-4xl md:text-5xl leading-tight" style={{ letterSpacing: "-0.025em" }}>
          Four steps.<br />
          <span className="italic text-green-DEFAULT">Infinite plays.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="card p-8 relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            {/* Pixel block accent */}
            <div className="pixel-block absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ width: 40, height: 40 }} />

            <div className="flex items-start gap-4">
              <div className="font-pixel text-border" style={{ fontSize: 11, minWidth: 28 }}>{s.n}</div>
              <div>
                <div className="text-2xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-xl mb-3 leading-snug">{s.title}</h3>
                <p className="text-muted text-[15px] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
