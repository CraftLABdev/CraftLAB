"use client"
import Link from "next/link"
import { motion } from "framer-motion"

const LINKS = [
  { label: "Mine",       href: "/#mine"       },
  { label: "Craft",      href: "/#craft"      },
  { label: "Blueprints", href: "/#blueprints" },
  { label: "AI Lab",     href: "/#lab"        },
  { label: "Docs",       href: "/docs"        },
]

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="CraftLAB" width={28} height={28} style={{ width: 28, height: 28, borderRadius: 6 }} />
          <span className="font-pixel text-green-DEFAULT" style={{ fontSize: 10 }}>CraftLAB</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map(l => (
            <Link key={l.label} href={l.href}
              className="text-sm text-muted hover:text-text transition-colors font-medium">
              {l.label}
            </Link>
          ))}
          <span className="pill pill-green text-xs">$CRAFT</span>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/app" className="btn-primary text-sm py-2 px-5">
            Launch App
          </Link>
        </div>
      </div>
    </motion.header>
  )
}

