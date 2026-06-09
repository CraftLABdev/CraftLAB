"use client"
import { motion } from "framer-motion"
import Link from "next/link"

const BLOCKS = [
  { x: 8,  y: 18, s: 44, d: 0,   dur: 7   },
  { x: 82, y: 12, s: 32, d: 1.2, dur: 5.5 },
  { x: 62, y: 68, s: 52, d: 0.4, dur: 8   },
  { x: 22, y: 62, s: 36, d: 1.8, dur: 6.5 },
  { x: 91, y: 48, s: 26, d: 0.9, dur: 5   },
  { x: 48, y: 84, s: 42, d: 0.2, dur: 9   },
  { x: 72, y: 30, s: 30, d: 2.1, dur: 6   },
  { x: 14, y: 78, s: 38, d: 1.5, dur: 7.5 },
  { x: 55, y: 22, s: 24, d: 0.7, dur: 6.8 },
  { x: 38, y: 48, s: 20, d: 3.0, dur: 5.8 },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {BLOCKS.map((b, i) => (
        <motion.div
          key={i}
          className="pixel-block absolute pointer-events-none"
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s, opacity: 0.18 }}
          animate={{ y: [-8, 10, -8], rotate: [0, b.d % 2 === 0 ? 6 : -6, 0] }}
          transition={{ duration: b.dur, delay: b.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="pixel-block w-20 h-20 mx-auto mb-10"
        />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-pixel text-4xl md:text-6xl text-green-DEFAULT mb-5 leading-tight"
          style={{ textShadow: "0 0 40px rgba(74,222,128,0.4)" }}
        >
          CraftLAB
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-pixel text-xs md:text-sm text-muted tracking-widest mb-4"
        >
          MINE · CRAFT · EARN
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-base md:text-lg text-[#6b9e6b] mb-10 max-w-xl mx-auto leading-relaxed"
        >
          On-chain crafting protocol on Solana. Mine{" "}
          <span className="text-green-DEFAULT">$CRAFT</span>, combine resources,
          unlock rare blueprints with AI-powered strategy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link href="/app" className="btn-pixel">
            Enter the Lab →
          </Link>
          <a
            href="https://github.com/CraftLAB/CraftLAB"
            target="_blank"
            rel="noopener"
            className="btn-outline-pixel"
          >
            GitHub
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-14 flex justify-center gap-8 text-xs text-muted font-pixel"
        >
          {[["2.4M", "$CRAFT mined"], ["1,240", "Crafters"], ["186", "Blueprints"]].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <div className="text-green-DEFAULT text-lg mb-1">{val}</div>
              <div>{lbl}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-green-DEFAULT/40" />
        <div className="w-1.5 h-1.5 bg-green-DEFAULT/60 rotate-45" />
      </motion.div>
    </section>
  )
}
