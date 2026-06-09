import os
import logging
import asyncio
import httpx
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    ConversationHandler, MessageHandler, filters, ContextTypes,
)
from core.db import init_db
from handlers.wallet import (
    wallet_menu, start_create, handle_password,
    start_import, handle_import_key, handle_import_pass,
    list_wallets, wallet_detail, start_export, handle_export_pass,
    confirm_delete, do_delete, cancel as wallet_cancel,
    AWAIT_PASSWORD, AWAIT_IMPORT_KEY, AWAIT_IMPORT_PASS, AWAIT_EXPORT_PASS,
)
from handlers.ai_lab import ai_lab_menu, handle_resources, cancel as ai_cancel, AWAIT_RESOURCES

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

TOKEN = os.getenv("BOT_TOKEN", "")

MAIN_KBD = InlineKeyboardMarkup([
    [InlineKeyboardButton("💼 Wallets",      callback_data="wallet_menu"),
     InlineKeyboardButton("⛏ Mining",       callback_data="mining_info")],
    [InlineKeyboardButton("📜 Blueprints",   callback_data="blueprints_info"),
     InlineKeyboardButton("🤖 AI Advisor",  callback_data="ai_lab")],
    [InlineKeyboardButton("📊 Market",       callback_data="market_info"),
     InlineKeyboardButton("📖 Tokenomics",  callback_data="tokenomics_info")],
    [InlineKeyboardButton("🌐 Launch App",   url="https://craftlab.xyz/app"),
     InlineKeyboardButton("❓ Help",         callback_data="help")],
])

WELCOME = (
    "🌿 *Welcome to CraftLAB*\n"
    "━━━━━━━━━━━━━━━━━━━━\n\n"
    "The on\\-chain crafting protocol on Solana\\.\n\n"
    "⛏ *Mine* \\$CRAFT by staking SOL\n"
    "🧱 *Craft* ingredients into rare blueprints\n"
    "📜 *Hold* blueprints to multiply your yield\n"
    "🤖 *Ask AI* for the best crafting strategy\n\n"
    "━━━━━━━━━━━━━━━━━━━━\n"
    "Choose an option to get started:"
)


async def sol_price() -> str:
    try:
        async with httpx.AsyncClient(timeout=5) as c:
            r = await c.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true")
            d = r.json()["solana"]
            chg = d["usd_24h_change"]
            arrow = "▲" if chg >= 0 else "▼"
            return f"${d['usd']:.2f} {arrow} {abs(chg):.1f}%"
    except Exception:
        return "N/A"


async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(WELCOME, parse_mode="MarkdownV2", reply_markup=MAIN_KBD)


async def main_menu_cb(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.callback_query.edit_message_text(WELCOME, parse_mode="MarkdownV2", reply_markup=MAIN_KBD)


async def mining_info(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    price = await sol_price()
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("💼 My Wallets",  callback_data="wallet_menu"),
         InlineKeyboardButton("📜 Blueprints",  callback_data="blueprints_info")],
        [InlineKeyboardButton("🔙 Main Menu",   callback_data="main_menu")],
    ])
    await update.callback_query.edit_message_text(
        "⛏ *Mining System*\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "*How it works:*\n"
        "Stake SOL → delegate to CraftLAB validator\n"
        "Earn $CRAFT every Solana epoch \\(\\~2\\-3 days\\)\n"
        "No lockup — unstake anytime \\(1\\-3 epoch cooldown\\)\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        "💎 *Mining Tiers*\n\n"
        "🪓 *Iron Pick* — 0\\.1 SOL\n"
        "└ 12 CRAFT/epoch · Base yield\n\n"
        "⛏ *Gold Pick* — 0\\.5 SOL\n"
        "└ 48 CRAFT/epoch · 1\\.25× boost\n\n"
        "💎 *Diamond Pick* — 2\\.0 SOL\n"
        "└ 120 CRAFT/epoch · 1\\.5× boost\n\n"
        "🔱 *Netherite* — 5\\.0 SOL\n"
        "└ 300 CRAFT/epoch · 2× boost\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        f"💲 SOL Price: *{price}*\n"
        "Receipt token: *cSOL* \\(redeemable 1:1\\)",
        parse_mode="MarkdownV2",
        reply_markup=kbd,
    )


async def blueprints_info(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("🤖 AI Advisor",  callback_data="ai_lab"),
         InlineKeyboardButton("⛏ Mining",       callback_data="mining_info")],
        [InlineKeyboardButton("🔙 Main Menu",   callback_data="main_menu")],
    ])
    await update.callback_query.edit_message_text(
        "📜 *Blueprint System*\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "Craft ingredients in a 3×3 grid to mint blueprints\\.\n"
        "Blueprints multiply your SOL staking yield\\.\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        "🏷 *Rarity Tiers*\n\n"
        "📄 *Common* — Starter Blueprint\n"
        "└ Recipe: 3× CRAFT anywhere\n"
        "└ Yield: *1\\.25×* · Supply: Unlimited\n\n"
        "📋 *Uncommon* — Base Blueprint\n"
        "└ Recipe: 3× CRAFT \\+ 1× SOL\n"
        "└ Yield: *1\\.5×* · Supply: Unlimited\n\n"
        "💠 *Rare* — SOL Blueprint\n"
        "└ Recipe: 2× SOL \\+ 3× CRAFT\n"
        "└ Yield: *2×* · Supply: 50,000 max\n\n"
        "👑 *Legendary* — Gold Blueprint\n"
        "└ Recipe: 3× GOLD \\+ 3× CRAFT\n"
        "└ Yield: *3×* · Supply: 500 max\n\n"
        "⚡ *Overdrive* — CRAFT \\+ CRAFT \\+ CRAFT \\(x9\\)\n"
        "└ Fill entire grid with CRAFT\n"
        "└ Yield: *3×* · Supply: 500 max\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        "💡 Blueprints stack\\! 2× Rare = 4× total yield\n"
        "Use AI Advisor to find your best recipe path",
        parse_mode="MarkdownV2",
        reply_markup=kbd,
    )


async def market_info(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    price = await sol_price()
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("📊 Full Market",  url="https://craftlab.xyz/app"),
         InlineKeyboardButton("⛏ Mining",        callback_data="mining_info")],
        [InlineKeyboardButton("🔙 Main Menu",    callback_data="main_menu")],
    ])
    await update.callback_query.edit_message_text(
        "📊 *Solana Market*\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        f"💲 *SOL Price:* {price}\n"
        "🌐 *Network:* Mainnet Beta\n"
        "⚡ *Avg TPS:* \\~3,500\n"
        "💸 *Avg Fee:* $0\\.0003\n"
        "⏱ *Block Time:* 400ms\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        "📈 Full ecosystem market data with live charts\n"
        "available on the CraftLAB App\\.",
        parse_mode="MarkdownV2",
        reply_markup=kbd,
    )


async def tokenomics_info(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("⛏ Start Mining",  callback_data="mining_info"),
         InlineKeyboardButton("📜 Blueprints",    callback_data="blueprints_info")],
        [InlineKeyboardButton("🔙 Main Menu",    callback_data="main_menu")],
    ])
    await update.callback_query.edit_message_text(
        "📖 *$CRAFT Tokenomics*\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "🪙 *Max Supply:* 420,000,000 CRAFT\n"
        "🌐 *Network:* Solana \\(SPL Token\\)\n"
        "🔥 *Burn:* 2% of all crafting fees burned\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        "📊 *Allocation*\n\n"
        "⛏ Mining Rewards — *70%* \\(294M\\)\n"
        "└ Community mined over \\~5 years\n\n"
        "🌱 Ecosystem & Grants — *15%* \\(63M\\)\n"
        "└ 24\\-month linear vesting\n\n"
        "👥 Core Team — *10%* \\(42M\\)\n"
        "└ 36\\-month vesting, 12\\-month cliff\n\n"
        "💧 Liquidity — *5%* \\(21M\\)\n"
        "└ Locked in LP at launch\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        "🚫 *No presale\\. No VC\\. No team mint\\.*\n"
        "Every token must be mined through staking\\.",
        parse_mode="MarkdownV2",
        reply_markup=kbd,
    )


async def help_cb(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("🌐 Website",   url="https://craftlab.xyz"),
         InlineKeyboardButton("📖 Docs",      url="https://craftlab.xyz/docs")],
        [InlineKeyboardButton("🔙 Main Menu", callback_data="main_menu")],
    ])
    await update.callback_query.edit_message_text(
        "❓ *Help & Commands*\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "*/start* — Open main menu\n"
        "*/cancel* — Cancel current action\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        "📋 *Sections*\n\n"
        "💼 *Wallets* — Generate or import Solana wallets\\. "
        "Private keys encrypted with AES\\-256\\-GCM\\.\n\n"
        "⛏ *Mining* — View staking tiers and daily CRAFT emission rates\\.\n\n"
        "📜 *Blueprints* — Full recipe book and yield multiplier table\\.\n\n"
        "🤖 *AI Advisor* — Describe your ingredients, get the optimal crafting path\\.\n\n"
        "📊 *Market* — Live SOL price and Solana network stats\\.\n\n"
        "📖 *Tokenomics* — Supply, allocation, and burn mechanics\\.\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        "🔒 Your private keys never leave your device unencrypted\\.\n"
        "🌐 craftlab\\.xyz · github\\.com/CraftLABdev/CraftLAB",
        parse_mode="MarkdownV2",
        reply_markup=kbd,
    )


def main():
    asyncio.get_event_loop().run_until_complete(init_db())

    app = Application.builder().token(TOKEN).build()

    wallet_conv = ConversationHandler(
        entry_points=[
            CallbackQueryHandler(start_create, pattern="^wallet_create$"),
            CallbackQueryHandler(start_import, pattern="^wallet_import$"),
            CallbackQueryHandler(start_export, pattern=r"^wallet_export_\d+$"),
        ],
        states={
            AWAIT_PASSWORD:    [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_password)],
            AWAIT_IMPORT_KEY:  [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_import_key)],
            AWAIT_IMPORT_PASS: [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_import_pass)],
            AWAIT_EXPORT_PASS: [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_export_pass)],
        },
        fallbacks=[CommandHandler("cancel", wallet_cancel)],
        allow_reentry=True,
    )

    ai_conv = ConversationHandler(
        entry_points=[CallbackQueryHandler(ai_lab_menu, pattern="^ai_lab$")],
        states={AWAIT_RESOURCES: [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_resources)]},
        fallbacks=[CommandHandler("cancel", ai_cancel)],
        allow_reentry=True,
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(wallet_conv)
    app.add_handler(ai_conv)
    app.add_handler(CallbackQueryHandler(main_menu_cb,     pattern="^main_menu$"))
    app.add_handler(CallbackQueryHandler(wallet_menu,      pattern="^wallet_menu$"))
    app.add_handler(CallbackQueryHandler(list_wallets,     pattern="^wallet_list$"))
    app.add_handler(CallbackQueryHandler(wallet_detail,    pattern=r"^wallet_detail_\d+$"))
    app.add_handler(CallbackQueryHandler(confirm_delete,   pattern=r"^wallet_delete_\d+$"))
    app.add_handler(CallbackQueryHandler(do_delete,        pattern=r"^wallet_confirmdelete_\d+$"))
    app.add_handler(CallbackQueryHandler(mining_info,      pattern="^mining_info$"))
    app.add_handler(CallbackQueryHandler(blueprints_info,  pattern="^blueprints_info$"))
    app.add_handler(CallbackQueryHandler(market_info,      pattern="^market_info$"))
    app.add_handler(CallbackQueryHandler(tokenomics_info,  pattern="^tokenomics_info$"))
    app.add_handler(CallbackQueryHandler(help_cb,          pattern="^help$"))

    log.info("CraftLAB Bot started")
    app.run_polling()


if __name__ == "__main__":
    main()
