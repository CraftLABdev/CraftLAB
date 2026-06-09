"use client"
import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"

type Ing = "CRAFT" | "SOL" | "STONE" | "GOLD" | "MANA" | null

const ING: Record<NonNullable<Ing>, { emoji: string; label: string; color: string }> = {
  CRAFT: { emoji: "🌿", label: "CRAFT", color: "#16a34a" },
  SOL:   { emoji: "💎", label: "SOL",   color: "#2563eb" },
  STONE: { emoji: "🪨", label: "STONE", color: "#6b7280" },
  GOLD:  { emoji: "⭐", label: "GOLD",  color: "#d97706" },
  MANA:  { emoji: "🌀", label: "MANA",  color: "#7c3aed" },
}
const ING_LIST = Object.keys(ING) as NonNullable<Ing>[]

function getResult(g: Ing[]) {
  const c: Record<string, number> = {}
  g.forEach(v => v && (c[v] = (c[v] || 0) + 1))
  if (c.CRAFT === 9)               return { name: "CRAFT Overdrive",  rarity: "legendary", emoji: "🏆" }
  if (c.GOLD >= 3 && c.CRAFT >= 3) return { name: "Gold Blueprint",   rarity: "legendary", emoji: "👑" }
  if (c.MANA >= 2 && c.SOL >= 2)   return { name: "Mana Vault",       rarity: "rare",      emoji: "🌀" }
  if (c.SOL >= 2 && c.CRAFT >= 3)  return { name: "SOL Blueprint",    rarity: "rare",      emoji: "💠" }
  if (c.CRAFT >= 4 && c.STONE >= 2)return { name: "Stone Vault",      rarity: "uncommon",  emoji: "🏠" }
  if (c.CRAFT >= 3 && c.SOL >= 1)  return { name: "Base Blueprint",   rarity: "uncommon",  emoji: "📋" }
  if (c.CRAFT >= 3)                return { name: "Starter Blueprint", rarity: "common",    emoji: "📄" }
  return null
}

export default function CraftingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [grid, setGrid] = useState<Ing[]>(Array(9).fill(null))
  const [sel, setSel] = useState<NonNullable<Ing>>("CRAFT")
  const result = getResult(grid)

  const toggle = (i: number) => {
    const next = [...grid]
    next[i] = next[i] === sel ? null : sel
    setGrid(next)
  }

  return (
    <section id="craft" ref={ref} className="section bg-bg2">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="label-pixel mb-4">CRAFTING TABLE</div>
          <h2 className="font-black text-4xl md:text-5xl mb-4" style={{ letterSpacing: "-0.025em" }}>
            Try the craft table.
          </h2>
          <p className="text-muted text-lg max-w-lg mx-auto">
            Select an ingredient, fill the 3×3 grid, see what blueprint emerges.
            Real crafting on-chain uses your connected wallet.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-10">

          {/* Ingredient picker */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="label-pixel mb-3 text-center lg:text-left">INGREDIENTS</div>
            <div className="flex lg:flex-col gap-2 flex-wrap justify-center">
              {ING_LIST.map(ing => (
                <button
                  key={ing}
                  onClick={() => setSel(ing)}
                  className={`flex items-center gap-2.5 px-4 py-3 border-2 card transition-all text-left min-w-[130px] ${sel === ing ? "pixel-border-green" : "opacity-60 hover:opacity-100"}`}
                >
                  <span className="text-lg">{ING[ing].emoji}</span>
                  <span className="font-pixel text-xs" style={{ color: ING[ing].color, fontSize: 9 }}>
                    {ING[ing].label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setGrid(Array(9).fill(null))}
              className="btn-outline text-xs mt-3 w-full py-2"
            >
              Clear grid
            </button>
          </motion.div>

          {/* Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="inline-grid grid-cols-3 gap-2 p-4 card pixel-border">
              {grid.map((cell, i) => (
                <motion.button
                  key={i}
                  onClick={() => toggle(i)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className={`w-16 h-16 border-2 flex items-center justify-center text-2xl transition-all ${cell ? `ing-${cell}` : "border-border bg-bg hover:border-light"}`}
                >
                  <AnimatePresence mode="wait">
                    {cell && (
                      <motion.span key={cell}
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 15 }}
                        transition={{ duration: 0.12 }}
                      >
                        {ING[cell].emoji}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Arrow */}
          <div className="text-2xl text-muted font-bold hidden lg:block">→</div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="w-44"
          >
            <div className="label-pixel mb-3 text-center">RESULT</div>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key={result.name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className={`card border-2 p-6 text-center rarity-${result.rarity} rarity-${result.rarity}-bg`}
                >
                  <div className="text-4xl mb-3">{result.emoji}</div>
                  <div className={`font-pixel mb-2 rarity-${result.rarity}`} style={{ fontSize: 8 }}>
                    {result.rarity.toUpperCase()}
                  </div>
                  <div className="font-semibold text-sm text-text">{result.name}</div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card border-2 border-dashed border-border p-6 text-center h-40 flex flex-col items-center justify-center gap-2"
                >
                  <div className="text-3xl opacity-20">?</div>
                  <div className="text-xs text-muted">Add ingredients</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
