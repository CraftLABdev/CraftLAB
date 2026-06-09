"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const TIERS = [
  { rarity: "common",    name: "Common",    emoji: "📄", color: "#6b7280", yield: "1.2×", recipe: "3× CRAFT",             supply: "∞"     },
  { rarity: "uncommon",  name: "Uncommon",  emoji: "📋", color: "#16a34a", yield: "2.5×", recipe: "CRAFT×4 + SOL",         supply: "50,000"},
  { rarity: "rare",      name: "Rare",      emoji: "💠", color: "#2563eb", yield: "6×",   recipe: "SOL×2 + CRAFT×3",       supply: "8,000" },
  { rarity: "legendary", name: "Legendary", emoji: "👑", color: "#d97706", yield: "20×",  recipe: "GOLD×3 + CRAFT×3",      supply: "500"   },
]

export default function BlueprintTiers() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="blueprints" ref={ref} className="section max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-start">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="lg:w-80 flex-shrink-0"
        >
          <div className="label-pixel mb-4">BLUEPRINTS</div>
          <h2 className="font-black text-4xl md:text-5xl leading-tight mb-6" style={{ letterSpacing: "-0.025em" }}>
            Four tiers.<br />
            <span className="italic text-green-DEFAULT">One path up.</span>
          </h2>
          <p className="text-muted text-[15px] leading-relaxed">
            Blueprints are on-chain assets minted from successful crafts.
            Hold them to multiply your mining yield permanently.
            Higher rarity = lower supply = more power.
          </p>
        </motion.div>

        {/* Right — cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.rarity}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              whileHover={{ y: -4, boxShadow: "0 10px 32px rgba(0,0,0,0.08)" }}
              className={`card border-2 p-6 rarity-${t.rarity} rarity-${t.rarity}-bg cursor-default transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{t.emoji}</span>
                <span className="font-pixel text-xs" style={{ color: t.color, fontSize: 8 }}>
                  {t.name.toUpperCase()}
                </span>
              </div>

              <div className="font-black text-3xl mb-1" style={{ color: t.color, letterSpacing: "-0.02em" }}>
                {t.yield}
              </div>
              <div className="text-xs text-muted mb-5">yield multiplier</div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Recipe</span>
                  <span className="font-medium text-right">{t.recipe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total supply</span>
                  <span className="font-bold" style={{ color: t.color }}>{t.supply}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
