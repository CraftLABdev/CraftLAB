"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const TIERS = [
  {
    rarity: "common",
    name: "Common",
    emoji: "📄",
    color: "#9ca3af",
    yield: "1.2× base",
    recipe: "3× CRAFT",
    supply: "Unlimited",
    desc: "Entry-level blueprint. Stack and burn to upgrade.",
  },
  {
    rarity: "uncommon",
    name: "Uncommon",
    emoji: "📋",
    color: "#4ade80",
    yield: "2.5× base",
    recipe: "CRAFT×4 + SOL",
    supply: "50,000",
    desc: "Activates a boosted mining vein for 7 days.",
  },
  {
    rarity: "rare",
    name: "Rare",
    emoji: "💠",
    color: "#60a5fa",
    yield: "6× base",
    recipe: "SOL×2 + CRAFT×3",
    supply: "8,000",
    desc: "Unlocks a DeFi strategy slot. Compound your yield.",
  },
  {
    rarity: "legendary",
    name: "Legendary",
    emoji: "👑",
    color: "#fbbf24",
    yield: "20× base",
    recipe: "GOLD×3 + CRAFT×3",
    supply: "500",
    desc: "Permanent yield multiplier. DAO governance vote included.",
  },
]

export default function BlueprintTiers() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="blueprints" ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="font-pixel text-green-DEFAULT text-xs mb-4 tracking-widest">📜 BLUEPRINTS</div>
        <h2 className="font-pixel text-2xl md:text-3xl text-[#e2f0e2] mb-4">Four Rarity Tiers.</h2>
        <p className="text-[#6b9e6b] max-w-lg mx-auto">
          Blueprints are on-chain assets minted when you craft the right combination.
          Higher rarity = higher multiplier, lower supply, more power.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TIERS.map((t, i) => (
          <motion.div
            key={t.rarity}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            whileHover={{ y: -6, boxShadow: `0 12px 40px ${t.color}25` }}
            className={`border-2 p-6 bg-card cursor-default transition-shadow rarity-${t.rarity}`}
          >
            <div className="text-4xl mb-4">{t.emoji}</div>
            <div className={`font-pixel text-xs mb-1 rarity-${t.rarity}`}>{t.name.toUpperCase()}</div>
            <p className="text-xs text-muted mb-5 leading-relaxed">{t.desc}</p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Yield boost</span>
                <span className="text-[#e2f0e2]">{t.yield}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Recipe</span>
                <span className="text-[#e2f0e2] text-right">{t.recipe}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Supply</span>
                <span style={{ color: t.color }}>{t.supply}</span>
              </div>
            </div>

            {/* Rarity bar */}
            <div className="mt-4 h-0.5 w-full" style={{ background: `${t.color}30` }}>
              <div className="h-full" style={{ width: `${25 * (i + 1)}%`, background: t.color }} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
