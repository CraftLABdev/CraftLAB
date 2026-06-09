"use client"
import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import axios from "axios"

export default function AILabSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [input, setInput] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!input.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const r = await axios.post("/api/ai/craft", { resources: input })
      setResult(r.data.suggestion)
    } catch {
      setResult("Lab connection failed. Try again.")
    }
    setLoading(false)
  }

  return (
    <section id="lab" ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="font-pixel text-green-DEFAULT text-xs mb-4 tracking-widest">🤖 AI RECIPE LAB</div>
          <h2 className="font-pixel text-2xl md:text-3xl text-[#e2f0e2] mb-4">Ask the Lab.</h2>
          <p className="text-[#6b9e6b]">
            Tell the AI what resources you have. It suggests the best crafting strategy to maximize your blueprint tier.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-card border border-border p-6"
          style={{ boxShadow: "0 0 40px rgba(74,222,128,0.04)" }}
        >
          <div className="font-pixel text-xs text-muted mb-3">RESOURCES YOU HAVE</div>
          <textarea
            className="w-full bg-bg2 border border-border text-[#e2f0e2] p-4 text-sm resize-none outline-none focus:border-green-DEFAULT transition-colors"
            rows={3}
            placeholder="e.g. 500 CRAFT, 2 SOL, some STONE..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button
            className="btn-pixel w-full mt-4 text-xs"
            onClick={run}
            disabled={loading || !input.trim()}
          >
            {loading ? "ANALYZING..." : "GET RECIPE →"}
          </button>

          {loading && (
            <div className="mt-6 flex gap-2 items-center text-xs text-muted font-pixel">
              <motion.div
                className="w-2 h-2 bg-green-DEFAULT"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              Lab AI thinking...
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border border-green-dark bg-[rgba(74,222,128,0.04)] p-4"
            >
              <div className="font-pixel text-green-DEFAULT text-xs mb-2">🧪 LAB RESULT</div>
              <p className="text-sm text-[#c8e6c8] leading-relaxed">{result}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
