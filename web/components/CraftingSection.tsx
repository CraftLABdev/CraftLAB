"use client"
import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"

type Ing = "CRAFT" | "SOL" | "STONE" | "GOLD" | "MANA" | null

const ING_META: Record<NonNullable<Ing>, { emoji: string; label: string; cls: string }> = {
  CRAFT: { emoji: "🌿", label: "CRAFT", cls: "ing-CRAFT" },
  SOL:   { emoji: "💎", label: "SOL",   cls: "ing-SOL"   },
  STONE: { emoji: "🪨", label: "STONE", cls: "ing-STONE" },
  GOLD:  { emoji: "⭐", label: "GOLD",  cls: "ing-GOLD"  },
  MANA:  { emoji: "🌀", label: "MANA",  cls: "ing-MANA"  },
}
const ING_LIST = Object.keys(ING_META) as NonNullable<Ing>[]

function checkRecipe(g: Ing[]) {
  const c: Record<string, number> = {}
  g.forEach(v => v && (c[v] = (c[v] || 0) + 1))
  const filled = g.filter(Boolean).length

  if (filled === 9 && c.CRAFT === 9)         return { name: "CRAFT Overdrive",   rarity: "legendary", emoji: "🏆" }
  if (c.GOLD >= 3 && c.CRAFT >= 3)           return { name: "Gold Blueprint",     rarity: "legendary", emoji: "👑" }
  if (c.MANA >= 2 && c.SOL >= 2)             return { name: "Mana Vault",         rarity: "rare",      emoji: "🌀" }
  if (c.SOL >= 2 && c.CRAFT >= 3)            return { name: "SOL Blueprint",      rarity: "rare",      emoji: "💠" }
  if (c.CRAFT >= 4 && c.STONE >= 2)          return { name: "Stone Vault",        rarity: "uncommon",  emoji: "🏠" }
  if (c.CRAFT >= 3 && c.SOL >= 1)            return { name: "Base Blueprint",     rarity: "uncommon",  emoji: "📋" }
  if (c.CRAFT >= 3)                          return { name: "Starter Blueprint",  rarity: "common",    emoji: "📄" }
  return null
}

export default function CraftingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [grid, setGrid] = useState<Ing[]>(Array(9).fill(null))
  const [selected, setSelected] = useState<NonNullable<Ing>>("CRAFT")

  const result = checkRecipe(grid)

  const handleCell = (i: number) => {
    const next = [...grid]
    next[i] = next[i] === selected ? null : selected
    setGrid(next)
  }

  const clear = () => setGrid(Array(9).fill(null))

  return (
    <section id="craft" ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="font-pixel text-green-DEFAULT text-xs mb-4 tracking-widest">🧪 THE CRAFTING TABLE</div>
        <h2 className="font-pixel text-2xl md:text-3xl text-[#e2f0e2] mb-4">Combine. Create. Unlock.</h2>
        <p className="text-[#6b9e6b] max-w-lg mx-auto">
          Select an ingredient, click the grid slots to fill them, then watch your blueprint emerge.
          Different combinations unlock different rarity tiers.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Ingredient picker */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <div className="font-pixel text-xs text-muted mb-2">INGREDIENTS</div>
          {ING_LIST.map(ing => (
            <button
              key={ing}
              onClick={() => setSelected(ing)}
              className={`flex items-center gap-3 px-4 py-3 border text-left transition-all ${ING_META[ing].cls} ${selected === ing ? "opacity-100 scale-105" : "opacity-50 hover:opacity-80"}`}
            >
              <span className="text-xl">{ING_META[ing].emoji}</span>
              <span className="font-pixel text-xs text-[#e2f0e2]">{ING_META[ing].label}</span>
            </button>
          ))}
          <button onClick={clear} className="btn-outline-pixel text-xs mt-2">CLEAR</button>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="grid grid-cols-3 gap-2 p-4 bg-card border border-border">
            {grid.map((cell, i) => (
              <motion.button
                key={i}
                onClick={() => handleCell(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-16 h-16 border-2 flex items-center justify-center text-2xl transition-all ${cell ? ING_META[cell].cls : "border-border bg-bg2 hover:border-muted"}`}
              >
                <AnimatePresence mode="wait">
                  {cell && (
                    <motion.span
                      key={cell}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 20 }}
                      transition={{ duration: 0.15 }}
                    >
                      {ING_META[cell].emoji}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-green-DEFAULT font-pixel text-2xl hidden lg:block"
        >
          →
        </motion.div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-52"
        >
          <div className="font-pixel text-xs text-muted mb-2">RESULT</div>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`border-2 p-6 text-center ${`rarity-${result.rarity}`} ${`rarity-${result.rarity}-bg`}`}
              >
                <div className="text-4xl mb-3">{result.emoji}</div>
                <div className={`font-pixel text-xs mb-2 rarity-${result.rarity}`}>
                  {result.rarity.toUpperCase()}
                </div>
                <div className="text-sm text-[#e2f0e2] font-medium">{result.name}</div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-dashed border-border p-6 text-center h-40 flex flex-col items-center justify-center gap-2"
              >
                <div className="text-3xl opacity-30">?</div>
                <div className="font-pixel text-xs text-muted">Add ingredients</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
