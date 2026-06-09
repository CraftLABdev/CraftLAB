"use client"
import { motion } from "framer-motion"
import Link from "next/link"

const PILLS = [
  "⛏ Mine $CRAFT daily",
  "🧱 Craft rare blueprints",
  "🤖 AI strategy advisor",
  "🔒 Non-custodial",
]

const STATS = [
  { value: "65,000+", label: "Solana TPS"       },
  { value: "400ms",   label: "Block time"        },
  { value: "$0.0003", label: "Avg tx fee"        },
  { value: "4",       label: "Blueprint tiers"   },
]

/* Floating pixel blocks — fixed positions so no SSR mismatch */
const DECO = [
  { s: 52, top: "12%", left: "68%",  delay: 0,   dur: 7   },
  { s: 32, top: "28%", left: "82%",  delay: 1.2, dur: 5.5 },
  { s: 24, top: "58%", left: "75%",  delay: 0.6, dur: 8   },
  { s: 18, top: "72%", left: "88%",  delay: 2,   dur: 6   },
  { s: 14, top: "18%", left: "92%",  delay: 0.3, dur: 9   },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-14 bg-dots">

      {/* Warm radial */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 60% 40%, rgba(220,252,231,0.55) 0%, transparent 70%)" }}
      />

      {/* Floating pixel blocks right side */}
      {DECO.map((d, i) => (
        <motion.div
          key={i}
          className="pixel-block absolute hidden lg:block opacity-30"
          style={{ width: d.s, height: d.s, top: d.top, left: d.left }}
          animate={{ y: [-6, 8, -6], rotate: [0, i % 2 === 0 ? 5 : -5, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="max-w-2xl">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <span className="pill pill-green">
              <span className="w-2 h-2 rounded-full bg-green-DEFAULT inline-block" />
              Live on Solana mainnet
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-sans font-black leading-none mb-3"
            style={{ fontSize: "clamp(52px, 8vw, 90px)", letterSpacing: "-0.03em" }}
          >
            Mine $CRAFT.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-sans font-black italic leading-none mb-8 text-green-DEFAULT"
            style={{ fontSize: "clamp(52px, 8vw, 90px)", letterSpacing: "-0.03em" }}
          >
            Craft your future.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-muted text-lg leading-relaxed max-w-xl mb-10"
          >
            On-chain crafting protocol on Solana. Stake SOL to mine $CRAFT tokens,
            combine them into rare blueprints that unlock boosted yield — with an AI
            advisor that tells you exactly what to craft.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex items-center gap-3 flex-wrap mb-6"
          >
            <Link href="/app" className="btn-primary">
              Start crafting →
            </Link>
            <Link href="/#craft" className="btn-outline">
              See how it works
            </Link>
          </motion.div>

          {/* Prefer Telegram */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-sm text-muted mb-12"
          >
            Prefer Telegram?{" "}
            <a href="https://t.me/CraftLABisbot" className="underline hover:text-text transition-colors">
              Use the bot →
            </a>
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="flex flex-wrap gap-2"
          >
            {PILLS.map(p => (
              <span key={p} className="pill text-xs">{p}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {STATS.map(s => (
              <div key={s.label} className="px-6 py-5 text-center">
                <div className="font-black text-2xl text-text mb-0.5" style={{ letterSpacing: "-0.02em" }}>
                  {s.value}
                </div>
                <div className="text-xs text-muted uppercase tracking-wide font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
