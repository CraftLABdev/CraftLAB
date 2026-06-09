import Link from "next/link"

const LINKS = [
  { label: "Mine",       href: "/#mine"       },
  { label: "Craft",      href: "/#craft"      },
  { label: "Blueprints", href: "/#blueprints" },
  { label: "AI Lab",     href: "/#lab"        },
  { label: "App",        href: "/app"         },
  { label: "GitHub",     href: "https://github.com/CraftLAB/CraftLAB" },
  { label: "Telegram",   href: "https://t.me/craftlabbot" },
]

export default function Footer() {
  return (
    <footer className="border-t border-border">
      {/* Pixel grass row */}
      <div className="flex overflow-hidden opacity-30">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="pixel-block flex-shrink-0" style={{ width: 28, height: 20 }} />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="pixel-block w-5 h-5" />
          <span className="font-pixel text-green-DEFAULT" style={{ fontSize: 9 }}>CraftLAB</span>
          <span className="text-xs text-muted ml-2">— On-chain crafting on Solana</span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {LINKS.map(l => (
            <Link key={l.label} href={l.href}
              className="text-sm text-muted hover:text-text transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="text-xs text-light">MIT License · 2025</div>
      </div>
    </footer>
  )
}
