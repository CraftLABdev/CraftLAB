import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CraftLAB App — Solana Market",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell" style={{ minHeight: "100vh", background: "#0d0d0d", color: "#e8e8e8" }}>
      {children}
    </div>
  )
}
