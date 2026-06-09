# CraftLAB

Minecraft-inspired on-chain crafting protocol on Solana. Two parts: Next.js website + Python Telegram bot.

## web/ — Next.js 14 App Router
- `app/page.tsx` → landing page (Hero, Mining, CraftingGrid, BlueprintTiers, AILab, Footer)
- `app/app/page.tsx` → connected app (wallet balance, mining dashboard, AI Lab)
- `app/api/ai/craft/route.ts` → DeepInfra Llama crafting suggestion
- `app/api/balance/route.ts` → Solana RPC balance fetch
- `components/WalletProvider.tsx` → Phantom/Solflare wallet adapter
- All animated components use Framer Motion (`"use client"`)

## bot/ — Telegram Bot (python-telegram-bot v21)
- Wallet create/import/export (AES-256-GCM encrypted keys via `cryptography`)
- Balance check via Solana RPC (`httpx` JSON-RPC)
- AI Recipe Lab via DeepInfra (Llama 3.1 8B)
- SQLite storage via `aiosqlite`
- Key derivation: PBKDF2-SHA256, 260k iterations, salt=`craftlab-salt-v1`

## Env vars
```
# web/.env
NEXT_PUBLIC_RPC_URL=...
DEEPINFRA_API_KEY=...

# bot/.env
TELEGRAM_TOKEN=...
DEEPINFRA_API_KEY=...
SOLANA_RPC=...
```

## Run
```bash
# Web
cd web && npm install && npm run dev

# Bot
cd bot && pip install -r requirements.txt && python bot.py
```
