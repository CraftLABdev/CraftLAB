# CraftLAB

**On-chain crafting protocol on Solana.** Mine $CRAFT, combine resources, unlock rare blueprints with AI-powered strategy.

## What is CraftLAB?

CraftLAB brings Minecraft-style crafting mechanics to DeFi on Solana:
- **Mine** — stake SOL to earn $CRAFT tokens daily
- **Craft** — combine ingredients in a 3×3 grid to mint blueprints
- **Earn** — blueprints multiply your yield (1.2× → 20× based on rarity)
- **AI Lab** — tell the AI what you have, get the optimal crafting strategy

## Stack

| Layer | Tech |
|-------|------|
| Website | Next.js 14, Framer Motion, Tailwind CSS |
| Wallet Connect | Solana Wallet Adapter (Phantom, Solflare) |
| AI | DeepInfra — Llama 3.1 8B |
| Telegram Bot | python-telegram-bot v21 async |
| Key Encryption | AES-256-GCM via Python `cryptography` |
| Storage | SQLite (aiosqlite) |
| Chain | Solana (RPC) |

## Quick Start

```bash
# Website
cd web
npm install
cp .env.example .env   # add DEEPINFRA_API_KEY
npm run dev            # → http://localhost:3000

# Telegram Bot
cd bot
pip install -r requirements.txt
cp .env.example .env   # add TELEGRAM_TOKEN + DEEPINFRA_API_KEY
python bot.py
```

## Blueprint Tiers

| Tier | Recipe | Yield Boost | Supply |
|------|--------|-------------|--------|
| Common | 3× CRAFT | 1.2× | Unlimited |
| Uncommon | CRAFT×4 + SOL | 2.5× | 50,000 |
| Rare | SOL×2 + CRAFT×3 | 6× | 8,000 |
| Legendary | GOLD×3 + CRAFT×3 | 20× | 500 |

## Mining Tiers

| Tier | Stake | Yield |
|------|-------|-------|
| Iron Pick | 0.1 SOL | 12 CRAFT/day |
| Gold Pick | 0.5 SOL | 48 CRAFT/day |
| Diamond Pick | 2.0 SOL | 120 CRAFT/day |
| Netherite | 5.0 SOL | 300 CRAFT/day |

## License

MIT
