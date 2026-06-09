import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="pixel-block w-6 h-6" />
          <span className="font-pixel text-green-DEFAULT text-xs">CraftLAB</span>
        </div>

        <div className="flex gap-6 text-xs text-muted font-pixel">
          <Link href="/app" className="hover:text-green-DEFAULT transition-colors">App</Link>
          <a href="https://github.com/CraftLAB/CraftLAB" target="_blank" rel="noopener" className="hover:text-green-DEFAULT transition-colors">GitHub</a>
          <a href="https://t.me/craftlabbot" target="_blank" rel="noopener" className="hover:text-green-DEFAULT transition-colors">Telegram</a>
        </div>

        <div className="font-pixel text-xs text-muted">
          Built on Solana · MIT License
        </div>
      </div>

      {/* Pixel grass row */}
      <div className="mt-8 flex overflow-hidden opacity-20">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="pixel-block flex-shrink-0" style={{ width: 32, height: 22 }} />
        ))}
      </div>
    </footer>
  )
}
