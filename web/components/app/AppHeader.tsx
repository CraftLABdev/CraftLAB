"use client"
import Link from "next/link"

interface Props {
  search: string
  onSearch: (v: string) => void
}

export default function AppHeader({ search, onSearch }: Props) {
  return (
    <header style={{
      background: "#111111", borderBottom: "1px solid #222",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 16px", height: 52 }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="CraftLAB" width={26} height={26} style={{ width: 26, height: 26, borderRadius: 5 }} />
          <span style={{ fontWeight: 900, fontSize: 14, color: "#fff", letterSpacing: "-0.02em" }}>CraftLAB</span>
          <span style={{ fontSize: 9, color: "#00d964", fontFamily: "'Press Start 2P', monospace", lineHeight: 1 }}>APP</span>
        </Link>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "#2a2a2a", flexShrink: 0 }} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {["Market", "Trending"].map((t, i) => (
            <button
              key={t}
              style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: i === 0 ? "#1e1e1e" : "transparent",
                color: i === 0 ? "#fff" : "#555",
                border: i === 0 ? "1px solid #333" : "1px solid transparent",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search â€” takes remaining space */}
        <div style={{ flex: 1, maxWidth: 320, position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: 14, pointerEvents: "none" }}>âŒ•</span>
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search token..."
            style={{
              width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a",
              borderRadius: 8, padding: "7px 10px 7px 30px", color: "#e8e8e8",
              fontSize: 13, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Right â€” push to end */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{
            padding: "4px 10px", borderRadius: 6, background: "#1a1a1a",
            border: "1px solid #2a2a2a", fontSize: 11, color: "#00d964", flexShrink: 0,
          }}>
            â— Solana
          </div>
          <button style={{
            padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: "linear-gradient(135deg, #00d964, #16a34a)", color: "#000",
            cursor: "pointer", border: "none", flexShrink: 0,
          }}>
            Connect Wallet
          </button>
          <Link href="/" style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 11, color: "#555",
            border: "1px solid #222", textDecoration: "none", flexShrink: 0,
          }}>
            â† Site
          </Link>
        </div>
      </div>
    </header>
  )
}

