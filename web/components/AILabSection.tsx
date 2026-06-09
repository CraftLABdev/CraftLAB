"use client"
import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import axios from "axios"

const EXAMPLES = [
  "I have 500 CRAFT and 1.5 SOL",
  "Just started, only 3 CRAFT so far",
  "200 CRAFT, 2 SOL, some GOLD",
]

export default function AILabSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [input, setInput] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async (text?: string) => {
    const q = text ?? input
    if (!q.trim()) return
    if (!text) setInput(q)
    setLoading(true)
    setResult(null)
    try {
      const r = await axios.post("/api/ai/craft", { resources: q })
      setResult(r.data.suggestion)
    } catch {
      setResult("Lab connection issue. Try again.")
    }
    setLoading(false)
  }

  return (
    <section id="lab" ref={ref} className="section bg-bg2">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-14 items-start">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:w-96 flex-shrink-0"
          >
            <div className="label-pixel mb-4">AI RECIPE LAB</div>
            <h2 className="font-black text-4xl md:text-5xl leading-tight mb-6" style={{ letterSpacing: "-0.025em" }}>
              Ask the lab.<br />
              <span className="italic text-green-DEFAULT">Get the recipe.</span>
            </h2>
            <p className="text-muted text-[15px] leading-relaxed mb-8">
              Tell the AI what resources you have. It analyzes your inventory and
              suggests the best crafting path to maximize blueprint rarity and yield.
            </p>

            <div className="space-y-2">
              <div className="text-xs text-muted font-medium mb-1">Try an example:</div>
              {EXAMPLES.map(e => (
                <button
                  key={e}
                  onClick={() => run(e)}
                  className="block w-full text-left text-sm px-4 py-3 card border hover:border-green-DEFAULT hover:bg-green-pale transition-all"
                >
                  "{e}" →
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — lab input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex-1"
          >
            <div className="card p-6 border">
              <div className="label-pixel mb-4">YOUR RESOURCES</div>
              <textarea
                rows={4}
                className="w-full bg-bg border border-border p-4 text-sm resize-none outline-none focus:border-green-DEFAULT transition-colors text-text placeholder-light"
                placeholder="e.g. 500 CRAFT, 2 SOL, some STONE..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && e.metaKey && run()}
              />
              <button
                className="btn-primary w-full mt-4"
                onClick={() => run()}
                disabled={loading || !input.trim()}
              >
                {loading ? "Analyzing…" : "Get crafting strategy →"}
              </button>

              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 flex items-center gap-3 text-sm text-muted"
                  >
                    <motion.div
                      className="w-2 h-2 bg-green-DEFAULT rounded-full"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 0.7, repeat: Infinity }}
                    />
                    Lab AI is analyzing your inventory…
                  </motion.div>
                )}

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 border border-green-DEFAULT/30 bg-green-pale p-5"
                  >
                    <div className="label-pixel text-green-DEFAULT mb-3">LAB RESULT</div>
                    <p className="text-[15px] text-text leading-relaxed">{result}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-xs text-muted mt-3">
              Powered by Llama 3.1 via DeepInfra · Not financial advice
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
