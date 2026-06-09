"use client"
import { useState, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

export default function AppDashboard() {
  const { publicKey, connecting, connected, select, wallets, disconnect } = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [craftBalance] = useState(1240) // mock
  const [aiInput, setAiInput] = useState("")
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const connectPhantom = () => {
    const phantom = wallets.find(w => w.adapter.name === "Phantom")
    if (phantom) select(phantom.adapter.name)
  }

  useEffect(() => {
    if (!publicKey) { setBalance(null); return }
    connection.getBalance(publicKey).then(b => setBalance(b / LAMPORTS_PER_SOL))
  }, [publicKey, connection])

  const runAI = async () => {
    if (!aiInput.trim()) return
    setAiLoading(true)
    setAiResult(null)
    try {
      const r = await axios.post("/api/ai/craft", { resources: aiInput })
      setAiResult(r.data.suggestion)
    } catch {
      setAiResult("AI Lab offline. Try again.")
    }
    setAiLoading(false)
  }

  if (!connected || !publicKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="pixel-block w-20 h-20 mx-auto mb-8 animate-float"
        />
        <h1 className="font-pixel text-xl md:text-2xl text-green-DEFAULT mb-4 text-center">
          Enter the Lab
        </h1>
        <p className="text-muted text-sm mb-10 text-center max-w-sm">
          Connect your Solana wallet to access mining dashboard, crafting table, and AI Recipe Lab.
        </p>
        <button className="btn-pixel" onClick={connectPhantom} disabled={connecting}>
          {connecting ? "Connecting..." : "Connect Phantom"}
        </button>
      </div>
    )
  }

  const addr = publicKey.toBase58()

  return (
    <div className="min-h-screen px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <div className="font-pixel text-xs text-muted mb-1">CONNECTED</div>
          <div className="font-pixel text-green-DEFAULT text-sm">
            {addr.slice(0,6)}…{addr.slice(-6)}
          </div>
        </div>
        <button className="btn-outline-pixel text-xs" onClick={disconnect}>Disconnect</button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "SOL Balance",     value: balance !== null ? `${balance.toFixed(4)} SOL` : "—" },
          { label: "$CRAFT Balance",  value: `${craftBalance.toLocaleString()} CRAFT` },
          { label: "Mining Rate",     value: "48 CRAFT/day" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border p-5"
          >
            <div className="text-xs text-muted mb-2 font-pixel">{s.label}</div>
            <div className="text-green-DEFAULT font-semibold text-xl">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* AI Recipe Lab */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border p-6 mb-6"
      >
        <div className="font-pixel text-green-DEFAULT text-xs mb-4">🤖 AI RECIPE LAB</div>
        <textarea
          className="w-full bg-bg2 border border-border text-[#e2f0e2] p-4 text-sm resize-none outline-none focus:border-green-DEFAULT transition-colors mb-4"
          rows={3}
          placeholder="Tell the AI what resources you have..."
          value={aiInput}
          onChange={e => setAiInput(e.target.value)}
        />
        <button className="btn-pixel text-xs" onClick={runAI} disabled={aiLoading}>
          {aiLoading ? "ANALYZING..." : "GET RECIPE →"}
        </button>

        <AnimatePresence>
          {aiResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 border border-green-dark bg-[rgba(74,222,128,0.04)] p-4"
            >
              <div className="font-pixel text-green-DEFAULT text-xs mb-2">RESULT</div>
              <p className="text-sm text-[#c8e6c8] leading-relaxed">{aiResult}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Recent blueprints (mock) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border p-6"
      >
        <div className="font-pixel text-green-DEFAULT text-xs mb-4">📜 MY BLUEPRINTS</div>
        <div className="space-y-3">
          {[
            { name: "Base Blueprint",  rarity: "uncommon", date: "2 days ago"  },
            { name: "Starter Blueprint", rarity: "common", date: "5 days ago"  },
          ].map(bp => (
            <div key={bp.name} className={`flex items-center justify-between p-3 border rarity-${bp.rarity} rarity-${bp.rarity}-bg`}>
              <div>
                <div className={`font-pixel text-xs rarity-${bp.rarity}`}>{bp.rarity.toUpperCase()}</div>
                <div className="text-sm text-[#e2f0e2] mt-0.5">{bp.name}</div>
              </div>
              <div className="text-xs text-muted">{bp.date}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
