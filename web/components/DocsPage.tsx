"use client"
import { useState } from "react"
import Link from "next/link"

const NAV = [
  { id: "overview",     label: "Overview"           },
  { id: "token",        label: "$CRAFT Token"        },
  { id: "mining",       label: "Mining System"       },
  { id: "crafting",     label: "Crafting System"     },
  { id: "blueprints",   label: "Blueprint Tiers"     },
  { id: "ai",           label: "AI Advisor"          },
  { id: "bot",          label: "Telegram Bot"        },
  { id: "contracts",    label: "Smart Contracts"     },
  { id: "tokenomics",   label: "Tokenomics"          },
  { id: "roadmap",      label: "Roadmap"             },
  { id: "faq",          label: "FAQ"                 },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2 className="font-black text-text mb-6" style={{ fontSize: 28, letterSpacing: "-0.02em", borderBottom: "2px solid var(--border)", paddingBottom: 12 }}>
        {title}
      </h2>
      <div className="prose-docs">{children}</div>
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-muted text-base leading-relaxed mb-4">{children}</p>
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-bold text-text text-lg mb-3 mt-6">{children}</h3>
}

function Code({ children }: { children: React.ReactNode }) {
  return <code style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 6px", fontSize: 13, fontFamily: "monospace", color: "var(--green)" }}>{children}</code>
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", fontSize: 13, fontFamily: "monospace", overflowX: "auto", marginBottom: 16, color: "var(--text)", lineHeight: 1.6 }}>
      {children}
    </pre>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 16 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border)" }}>
            {headers.map(h => (
              <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: "var(--text)", background: "var(--bg2)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "var(--bg2)" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "8px 12px", color: "var(--muted)" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Callout({ type, children }: { type: "info" | "warning" | "tip"; children: React.ReactNode }) {
  const cfg = {
    info:    { icon: "â„¹", bg: "#dbeafe", border: "#3b82f6", color: "#1e40af" },
    warning: { icon: "âš ", bg: "#fef9c3", border: "#eab308", color: "#713f12" },
    tip:     { icon: "âœ¦", bg: "#dcfce7", border: "#16a34a", color: "#14532d" },
  }[type]
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span style={{ color: cfg.color, fontWeight: 700, flexShrink: 0 }}>{cfg.icon}</span>
      <div style={{ color: cfg.color, fontSize: 14, lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

export default function DocsPage() {
  const [active, setActive] = useState("overview")

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Docs header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm" style={{ paddingTop: 56 }}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="CraftLAB" width={56} height={56} style={{ width: 56, height: 56, borderRadius: 12 }} />
          <div>
            <div className="label-pixel mb-1">DOCUMENTATION</div>
            <h1 className="font-black text-text" style={{ fontSize: 32, letterSpacing: "-0.02em" }}>CraftLAB Protocol</h1>
            <p className="text-muted text-sm mt-1">On-chain crafting protocol on Solana Â· v1.0</p>
          </div>
          <div className="ml-auto flex gap-3">
            <Link href="/app" className="btn-primary text-sm">Launch App â†’</Link>
            <a href="https://t.me/CraftLABisbot" className="btn-outline text-sm">Telegram Bot</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-10">

        {/* Sidebar nav */}
        <aside className="w-56 flex-shrink-0 sticky top-20 self-start hidden lg:block">
          <div className="label-pixel mb-4" style={{ fontSize: 9 }}>ON THIS PAGE</div>
          <nav className="flex flex-col gap-0.5">
            {NAV.map(n => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setActive(n.id)}
                className="text-sm py-1.5 px-3 rounded-lg transition-colors"
                style={{
                  color: active === n.id ? "var(--green)" : "var(--muted)",
                  background: active === n.id ? "var(--green-p)" : "transparent",
                  fontWeight: active === n.id ? 600 : 400,
                  textDecoration: "none",
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 p-4 rounded-xl border border-border bg-card">
            <div className="label-pixel mb-2" style={{ fontSize: 8 }}>QUICK LINKS</div>
            <div className="flex flex-col gap-1.5 text-xs">
              <a href="https://github.com/craftlabxyz" className="text-muted hover:text-text transition-colors">GitHub â†’</a>
              <a href="https://t.me/craftlabxyz" className="text-muted hover:text-text transition-colors">Telegram â†’</a>
              <a href="https://x.com/craftlabxyz" className="text-muted hover:text-text transition-colors">X (Twitter) â†’</a>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-3xl">

          {/* â”€â”€ OVERVIEW â”€â”€ */}
          <Section id="overview" title="Overview">
            <P>
              CraftLAB is an on-chain crafting protocol built on Solana. Users stake SOL to mine <Code>$CRAFT</Code> tokens,
              then combine ingredients in a 3Ã—3 crafting grid to produce blueprints â€” NFT-like on-chain receipts that
              grant boosted yield, governance weight, and exclusive access to protocol features.
            </P>
            <P>
              Inspired by Minecraft&apos;s crafting mechanic, CraftLAB translates the joy of recipe discovery into a
              DeFi-native loop: the more strategically you craft, the higher your returns. An embedded AI advisor
              analyzes your resource profile and suggests optimal crafting paths.
            </P>
            <Callout type="tip">
              CraftLAB is non-custodial. Your SOL never leaves your wallet â€” it is delegated to a Solana native
              staking validator and yield flows back through the protocol in real-time.
            </Callout>
            <H3>Core Loop</H3>
            <CodeBlock>{`1. Stake SOL  â†’  delegate to CraftLAB validator
2. Earn yield  â†’  converted to $CRAFT tokens (daily distribution)
3. Collect ingredients  â†’  CRAFT ðŸŒ¿  SOL ðŸ’Ž  STONE ðŸª¨  GOLD â­  MANA ðŸŒ€
4. Open crafting table  â†’  fill 3Ã—3 grid with ingredients
5. Mint blueprint  â†’  on-chain NFT receipt (4 rarity tiers)
6. Hold blueprints  â†’  earn multiplied yield + governance rights`}</CodeBlock>
          </Section>

          {/* â”€â”€ TOKEN â”€â”€ */}
          <Section id="token" title="$CRAFT Token">
            <P>
              <Code>$CRAFT</Code> is the native utility and governance token of the CraftLAB protocol. It is mined
              exclusively through SOL staking â€” there is no presale, no VC allocation, and no team mint.
              Every token in existence has been earned by a real staker.
            </P>
            <H3>Token Properties</H3>
            <Table
              headers={["Property", "Value"]}
              rows={[
                ["Ticker", "$CRAFT"],
                ["Network", "Solana (SPL Token)"],
                ["Max Supply", "420,000,000 CRAFT"],
                ["Mining Emission", "Dynamic â€” proportional to total SOL staked"],
                ["Burn Mechanism", "2% of blueprint crafting fees burned"],
                ["Governance", "1 CRAFT = 1 vote in protocol proposals"],
                ["Decimals", "9"],
              ]}
            />
            <H3>Earning $CRAFT</H3>
            <P>
              Mining rate is calculated per epoch (Solana epoch â‰ˆ 2â€“3 days). The formula distributes emissions
              proportionally to each staker&apos;s share of total staked SOL:
            </P>
            <CodeBlock>{`daily_craft_earned = (your_staked_sol / total_staked_sol) Ã— daily_emission_budget

daily_emission_budget decays by 0.5% per epoch (halving-style softcap)`}</CodeBlock>
            <Callout type="info">
              Emissions are front-loaded in the first year to reward early adopters. Total first-year emission
              cap: 168,000,000 CRAFT (40% of max supply).
            </Callout>
          </Section>

          {/* â”€â”€ MINING â”€â”€ */}
          <Section id="mining" title="Mining System">
            <P>
              Mining in CraftLAB is passive. Stake SOL once, and $CRAFT accumulates in your claimable balance
              every Solana epoch. No active transactions required until you choose to claim or craft.
            </P>
            <H3>How Staking Works</H3>
            <P>
              CraftLAB uses native Solana liquid staking. Your SOL is delegated to the CraftLAB validator cluster.
              You receive a <Code>cSOL</Code> receipt token (1:1 with SOL) that you can unstake at any time with
              a standard Solana 1â€“3 epoch cooldown period (~2â€“7 days).
            </P>
            <Table
              headers={["Parameter", "Value"]}
              rows={[
                ["Minimum stake", "0.1 SOL"],
                ["Unstaking cooldown", "1â€“3 Solana epochs (~2â€“7 days)"],
                ["Receipt token", "cSOL (redeemable 1:1 for SOL)"],
                ["APY (staking only)", "~6â€“8% (Solana native yield)"],
                ["CRAFT bonus APY", "Variable â€” depends on total stakers"],
                ["Claim frequency", "Any time (claim costs ~0.000005 SOL in fees)"],
              ]}
            />
            <H3>Ingredient Generation</H3>
            <P>
              Alongside $CRAFT tokens, staking generates crafting ingredients. Each epoch, stakers receive a
              randomized ingredient drop based on their staked amount:
            </P>
            <Table
              headers={["Ingredient", "Drop Rate", "Required for"]}
              rows={[
                ["CRAFT ðŸŒ¿", "Always (from yield)", "All recipes"],
                ["SOL ðŸ’Ž", "1 per 10 SOL staked / epoch", "SOL Blueprint, CRAFT Overdrive"],
                ["STONE ðŸª¨", "Common drop (40%)", "Basic recipes"],
                ["GOLD â­", "Uncommon drop (20%)", "Gold Blueprint (Legendary)"],
                ["MANA ðŸŒ€", "Rare drop (8%)", "Overdrive recipes"],
              ]}
            />
          </Section>

          {/* â”€â”€ CRAFTING â”€â”€ */}
          <Section id="crafting" title="Crafting System">
            <P>
              The crafting table is a 3Ã—3 grid. Place ingredients into cells, and the protocol detects which
              recipe your arrangement matches. Confirmed recipes are executed on-chain â€” ingredients are burned
              and a blueprint NFT is minted to your wallet.
            </P>
            <Callout type="warning">
              Crafting is irreversible. Once ingredients are placed and the transaction is confirmed,
              they are burned. There is no undo.
            </Callout>
            <H3>Recipe Book</H3>
            <Table
              headers={["Recipe", "Ingredients Required", "Result", "Rarity"]}
              rows={[
                ["Starter Blueprint",  "3Ã— CRAFT anywhere in grid",                         "Starter Blueprint NFT",  "Common"],
                ["Base Blueprint",     "3Ã— CRAFT + 1Ã— SOL (any position)",                  "Base Blueprint NFT",     "Uncommon"],
                ["SOL Blueprint",      "2Ã— SOL + 3Ã— CRAFT (any position)",                  "SOL Blueprint NFT",      "Rare"],
                ["Gold Blueprint",     "3Ã— GOLD + 3Ã— CRAFT (any position)",                 "Gold Blueprint NFT",     "Legendary"],
                ["CRAFT Overdrive",    "9Ã— CRAFT (fill entire grid)",                        "Overdrive Blueprint NFT","Legendary"],
              ]}
            />
            <H3>On-chain Recipe Validation</H3>
            <P>
              Recipe detection runs entirely on-chain via a Solana program. The program reads the grid state,
              counts ingredient types, and matches against the recipe registry. No off-chain oracle is involved.
            </P>
            <CodeBlock>{`// Pseudo-code: on-chain recipe matcher
pub fn detect_recipe(grid: [Option<Ingredient>; 9]) -> Option<Blueprint> {
    let counts = count_ingredients(grid);
    match counts {
        c if c[CRAFT] == 9                           => Some(Blueprint::Overdrive),
        c if c[GOLD] >= 3 && c[CRAFT] >= 3          => Some(Blueprint::Gold),
        c if c[SOL] >= 2 && c[CRAFT] >= 3           => Some(Blueprint::Sol),
        c if c[CRAFT] >= 3 && c[SOL] >= 1           => Some(Blueprint::Base),
        c if c[CRAFT] >= 3                           => Some(Blueprint::Starter),
        _                                            => None,
    }
}`}</CodeBlock>
          </Section>

          {/* â”€â”€ BLUEPRINTS â”€â”€ */}
          <Section id="blueprints" title="Blueprint Tiers">
            <P>
              Blueprints are on-chain NFTs (Solana compressed NFTs via Metaplex Bubblegum) minted as a result
              of crafting. They represent your crafting achievement and confer ongoing protocol benefits as long
              as you hold them.
            </P>
            <Table
              headers={["Tier", "Blueprint", "Yield Multiplier", "Governance Weight", "Max Supply", "Tradeable"]}
              rows={[
                ["Common",    "Starter Blueprint",  "1.25Ã—", "1Ã—",  "Unlimited", "Yes"],
                ["Uncommon",  "Base Blueprint",     "1.5Ã—",  "2Ã—",  "Unlimited", "Yes"],
                ["Rare",      "SOL Blueprint",      "2Ã—",    "5Ã—",  "50,000",    "Yes"],
                ["Legendary", "Gold / Overdrive",   "3Ã—",    "20Ã—", "500",       "Yes"],
              ]}
            />
            <Callout type="info">
              Blueprints stack additively. Holding 2Ã— Rare blueprints gives 4Ã— yield multiplier on your
              staked SOL. There is no cap on how many blueprints a wallet can hold.
            </Callout>
            <H3>Blueprint Mechanics</H3>
            <P>
              Blueprints are held in your wallet as cNFTs. The protocol reads your blueprint holdings each epoch
              during yield calculation. Transferring or selling a blueprint immediately transfers the yield
              multiplier to the new holder.
            </P>
          </Section>

          {/* â”€â”€ AI â”€â”€ */}
          <Section id="ai" title="AI Advisor">
            <P>
              CraftLAB integrates an AI crafting advisor powered by Meta Llama 3.1 8B via DeepInfra.
              The advisor analyzes your current ingredient inventory and suggests the highest-value
              crafting path given your resources and goals.
            </P>
            <H3>How to Use</H3>
            <P>
              Open the AI Lab section on the website or use <Code>/craft</Code> in the Telegram bot.
              Describe your inventory (e.g., &quot;I have 8 CRAFT, 2 SOL, 1 GOLD&quot;) and your goal
              (maximize yield / save for legendary / diversify). The AI returns a step-by-step crafting plan.
            </P>
            <H3>API Endpoint</H3>
            <CodeBlock>{`POST /api/ai/craft
Content-Type: application/json

{
  "resources": "8 CRAFT, 2 SOL, 1 GOLD",
  "goal": "maximize yield multiplier"
}

// Response
{
  "plan": "Craft a SOL Blueprint first (2 SOL + 3 CRAFT â†’ 2Ã— multiplier),
           then save remaining 5 CRAFT + 1 GOLD for a second drop before
           attempting Gold Blueprint.",
  "estimated_multiplier": "2Ã—",
  "ingredients_used": ["2Ã— SOL", "3Ã— CRAFT"]
}`}</CodeBlock>
            <Callout type="tip">
              The AI advisor is free to use and requires no wallet connection. It runs off-chain and
              does not submit any on-chain transactions.
            </Callout>
          </Section>

          {/* â”€â”€ BOT â”€â”€ */}
          <Section id="bot" title="Telegram Bot">
            <P>
              The CraftLAB Telegram bot (<Code>@craftlabbot</Code>) is a full-featured interface to the protocol.
              Generate wallets, check balances, get AI crafting advice, and receive mining notifications â€”
              all from Telegram.
            </P>
            <H3>Commands</H3>
            <Table
              headers={["Command", "Description"]}
              rows={[
                ["/start",         "Open main menu with inline keyboard"],
                ["/wallet",        "Wallet management (generate, import, export)"],
                ["/balance",       "Check SOL balance of connected wallet"],
                ["/craft",         "Open AI crafting advisor"],
                ["/mine",          "View current mining status and claimable CRAFT"],
                ["/blueprints",    "List blueprints held by connected wallet"],
                ["/help",          "Full command reference"],
              ]}
            />
            <H3>Wallet Security</H3>
            <P>
              Private keys are encrypted with AES-256-GCM using a user-provided password. The encrypted blob
              is stored in SQLite. The password is never stored â€” only you can decrypt your key.
              If you lose your password, the key cannot be recovered.
            </P>
            <CodeBlock>{`Encryption: AES-256-GCM
KDF: PBKDF2-SHA256, 260,000 iterations
Salt: protocol-specific per-user salt
Storage: encrypted ciphertext only (never plaintext)`}</CodeBlock>
            <Callout type="warning">
              The bot deletes any message containing a private key within 30 seconds of display.
              Never share your private key or password with anyone.
            </Callout>
          </Section>

          {/* â”€â”€ CONTRACTS â”€â”€ */}
          <Section id="contracts" title="Smart Contracts">
            <P>
              CraftLAB is implemented as a set of Solana programs (smart contracts) written in Rust using the
              Anchor framework. All programs are open source and audited prior to mainnet deployment.
            </P>
            <Table
              headers={["Program", "Description", "Address"]}
              rows={[
                ["craftlab_core",    "Main protocol: staking, mining, crafting, blueprint minting", "TBD (mainnet)"],
                ["craftlab_token",   "SPL token mint and emission controller for $CRAFT",          "TBD (mainnet)"],
                ["craftlab_vesting", "Linear vesting for any team/ecosystem allocations",          "TBD (mainnet)"],
              ]}
            />
            <H3>Program Architecture</H3>
            <CodeBlock>{`craftlab_core/
â”œâ”€â”€ instructions/
â”‚   â”œâ”€â”€ stake.rs         # Deposit SOL, mint cSOL receipt
â”‚   â”œâ”€â”€ unstake.rs       # Burn cSOL, begin cooldown period
â”‚   â”œâ”€â”€ claim.rs         # Claim accumulated $CRAFT to wallet
â”‚   â”œâ”€â”€ craft.rs         # Submit grid, validate recipe, mint blueprint
â”‚   â””â”€â”€ distribute.rs    # Epoch yield distribution (crank)
â”œâ”€â”€ state/
â”‚   â”œâ”€â”€ pool.rs          # Global staking pool state
â”‚   â”œâ”€â”€ user_stake.rs    # Per-user staking account
â”‚   â””â”€â”€ recipe_registry.rs
â””â”€â”€ errors.rs`}</CodeBlock>
          </Section>

          {/* â”€â”€ TOKENOMICS â”€â”€ */}
          <Section id="tokenomics" title="Tokenomics">
            <Table
              headers={["Allocation", "Amount", "% of Supply", "Vesting"]}
              rows={[
                ["Mining Rewards (Community)", "294,000,000", "70%", "Continuous â€” mined over ~5 years"],
                ["Ecosystem & Grants",         "63,000,000",  "15%", "24-month linear vesting, 6-month cliff"],
                ["Core Team",                  "42,000,000",  "10%", "36-month linear vesting, 12-month cliff"],
                ["Liquidity Bootstrap",        "21,000,000",  "5%",  "Locked in LP at launch, 12-month unlock"],
                ["TOTAL",                      "420,000,000", "100%", "â€”"],
              ]}
            />
            <Callout type="tip">
              There is <strong>no presale, no private sale, no VC round</strong>. 70% of all tokens
              can only be obtained by actively staking SOL and mining through the protocol.
            </Callout>
            <H3>Burn Mechanics</H3>
            <P>
              2% of all ingredients used in crafting are burned from the ecosystem supply.
              As crafting volume grows, burn rate increases â€” creating deflationary pressure
              on $CRAFT supply over time.
            </P>
          </Section>

          {/* â”€â”€ ROADMAP â”€â”€ */}
          <Section id="roadmap" title="Roadmap">
            <div className="flex flex-col gap-4">
              {[
                { phase: "Phase 1", title: "Foundation", status: "In Progress", items: ["Protocol design & tokenomics finalization", "Smart contract development (Anchor)", "Telegram bot v1 (wallet + AI advisor)", "Website v1 launch", "Testnet deployment & internal testing"] },
                { phase: "Phase 2", title: "Launch",     status: "Upcoming",    items: ["Independent security audit", "Mainnet deployment", "Liquidity bootstrap event", "PumpFun launch for $CRAFT", "Blueprint minting live (Starter + Base tiers)"] },
                { phase: "Phase 3", title: "Expansion",  status: "Planned",     items: ["Rare + Legendary blueprint tiers unlock", "Blueprint secondary market integration (Tensor)", "Governance portal â€” vote with $CRAFT + blueprints", "Mobile-optimized app", "Cross-protocol blueprint composability"] },
                { phase: "Phase 4", title: "Ecosystem",  status: "Planned",     items: ["CraftLAB SDK for third-party integrations", "Blueprint-gated community features", "Multi-validator staking diversification", "DAO transition â€” full community governance"] },
              ].map(p => (
                <div key={p.phase} className="card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="label-pixel">{p.phase}</span>
                    <span className="font-black text-text text-lg">{p.title}</span>
                    <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === "In Progress" ? "bg-green-100 text-green-700" : p.status === "Upcoming" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {p.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-muted text-sm">
                        <span className="text-green-DEFAULT mt-0.5 flex-shrink-0">âœ“</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* â”€â”€ FAQ â”€â”€ */}
          <Section id="faq" title="FAQ">
            {[
              { q: "Is CraftLAB audited?",
                a: "An independent security audit is scheduled for Phase 2 before mainnet launch. All program source code will be public on GitHub prior to audit." },
              { q: "Can I lose my SOL?",
                a: "No. Your SOL is held in a native Solana staking account. The protocol does not have custody of your principal. The only risk is smart contract bugs (mitigated by audits) or Solana validator downtime (mitigated by diversification)." },
              { q: "What happens if I transfer my blueprint?",
                a: "The yield multiplier transfers instantly to the new holder. Your mining rate drops back to base (1Ã—) until you craft or acquire new blueprints." },
              { q: "Is there a lockup for staked SOL?",
                a: "There is a 1â€“3 epoch (~2â€“7 day) cooldown when unstaking, which is the standard Solana unstaking period. There is no additional protocol lock." },
              { q: "How does the AI advisor work?",
                a: "The AI runs on Meta Llama 3.1 8B via DeepInfra. It receives your inventory and goal as a prompt, then generates a crafting plan. It is entirely advisory â€” no on-chain transactions are submitted without your explicit approval." },
              { q: "What is the $CRAFT contract address?",
                a: "The token will be deployed at mainnet launch (Phase 2). Contract address will be published on this page and all official social channels simultaneously. Do not trust any token claiming to be $CRAFT before the official announcement." },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border py-5 last:border-0">
                <h4 className="font-bold text-text mb-2">{q}</h4>
                <p className="text-muted text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </Section>

          {/* Footer CTA */}
          <div className="card p-8 text-center mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="CraftLAB" width={48} height={48} style={{ width: 48, height: 48, borderRadius: 10, margin: "0 auto 16px" }} />
            <h3 className="font-black text-text text-2xl mb-2" style={{ letterSpacing: "-0.02em" }}>Ready to mine?</h3>
            <p className="text-muted mb-6 max-w-sm mx-auto text-sm">Stake SOL, mine $CRAFT, craft rare blueprints. Non-custodial. Open source. Built on Solana.</p>
            <div className="flex justify-center gap-3">
              <Link href="/app" className="btn-primary">Launch App â†’</Link>
              <a href="https://t.me/CraftLABisbot" className="btn-outline">Open Telegram Bot</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

