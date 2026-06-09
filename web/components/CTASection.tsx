"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"

export default function CTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} className="section max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden card border-2 border-green-DEFAULT px-10 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f7f5ef 60%, #fffbeb 100%)" }}
      >
        {/* Deco blocks */}
        {[
          { s: 48, top: "-10px",  left: "-10px"  },
          { s: 32, top: "-8px",   right: "-8px"  },
          { s: 24, bottom: "-8px",left: "20%"    },
          { s: 40, bottom: "-10px",right: "15%"  },
        ].map((d, i) => (
          <div key={i} className="pixel-block absolute opacity-15" style={{ width: d.s, height: d.s, ...d as any }} />
        ))}

        <div className="relative z-10">
          <div className="label-pixel mb-6 text-green-DEFAULT">START TODAY</div>
          <h2 className="font-black text-5xl md:text-6xl mb-6 leading-none" style={{ letterSpacing: "-0.03em" }}>
            Your vein is waiting.
          </h2>
          <p className="text-muted text-lg max-w-lg mx-auto mb-10">
            Connect your wallet, stake SOL, and start mining $CRAFT in under 60 seconds.
            The crafting table is already open.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/app" className="btn-primary text-base px-8 py-4">
              Launch the app →
            </Link>
            <a href="https://t.me/craftlabbot" className="btn-outline text-base px-8 py-4">
              Open Telegram bot
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
