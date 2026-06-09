"use client"
import Link from "next/link"
import { useWallet } from "@solana/wallet-adapter-react"
import { motion } from "framer-motion"

export default function Navbar() {
  const { publicKey, connecting, connected, disconnect, select, wallets } = useWallet()

  const handleConnect = () => {
    const phantom = wallets.find(w => w.adapter.name === "Phantom")
    if (phantom) select(phantom.adapter.name)
  }

  const addr = publicKey ? publicKey.toBase58() : null

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="pixel-block w-7 h-7" />
          <span className="font-pixel text-green text-xs tracking-wider">CraftLAB</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <Link href="/#mine" className="hover:text-green transition-colors">Mine</Link>
          <Link href="/#craft" className="hover:text-green transition-colors">Craft</Link>
          <Link href="/#blueprints" className="hover:text-green transition-colors">Blueprints</Link>
          <Link href="/#lab" className="hover:text-green transition-colors">AI Lab</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/app" className="btn-pixel text-xs hidden sm:inline-block">
            Launch App
          </Link>
          {connecting ? (
            <span className="text-xs text-muted font-pixel">Connecting…</span>
          ) : connected && addr ? (
            <button className="btn-outline-pixel text-xs" onClick={disconnect}>
              {addr.slice(0,4)}…{addr.slice(-4)}
            </button>
          ) : (
            <button className="btn-outline-pixel text-xs" onClick={handleConnect}>
              Connect
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
