import os
import logging
import asyncio
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


async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("💼 Wallets",    callback_data="wallet_menu"),
         InlineKeyboardButton("🤖 AI Lab",    callback_data="ai_lab")],
        [InlineKeyboardButton("⛏ Mining",     callback_data="mining_info"),
         InlineKeyboardButton("📜 Blueprints", callback_data="blueprints_info")],
        [InlineKeyboardButton("🌐 Website",   url="https://craftlab.xyz"),
         InlineKeyboardButton("❓ Help",      callback_data="help")],
    ])
    await update.message.reply_text(
        "🧱 *CraftLAB Bot*\n\n"
        "Mine $CRAFT · Craft blueprints · Build your DeFi strategy on Solana.\n\n"
        "Select an option below:",
        parse_mode="Markdown",
        reply_markup=kbd,
    )


async def main_menu_cb(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("💼 Wallets",    callback_data="wallet_menu"),
         InlineKeyboardButton("🤖 AI Lab",    callback_data="ai_lab")],
        [InlineKeyboardButton("⛏ Mining",     callback_data="mining_info"),
         InlineKeyboardButton("📜 Blueprints", callback_data="blueprints_info")],
        [InlineKeyboardButton("🌐 Website",   url="https://craftlab.xyz"),
         InlineKeyboardButton("❓ Help",      callback_data="help")],
    ])
    await update.callback_query.edit_message_text(
        "🧱 *CraftLAB Bot* — Main Menu",
        parse_mode="Markdown",
        reply_markup=kbd,
    )


async def mining_info(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    kbd = InlineKeyboardMarkup([[InlineKeyboardButton("🔙 Back", callback_data="main_menu")]])
    await update.callback_query.edit_message_text(
        "⛏ *Mining Info*\n\n"
        "Stake SOL → earn $CRAFT daily\n\n"
        "Tiers:\n"
        "• Iron Pick: 0.1 SOL → 12 CRAFT/day\n"
        "• Gold Pick: 0.5 SOL → 48 CRAFT/day\n"
        "• Diamond Pick: 2.0 SOL → 120 CRAFT/day\n"
        "• Netherite: 5.0 SOL → 300 CRAFT/day\n\n"
        "Visit the app to stake: craftlab.xyz/app",
        parse_mode="Markdown",
        reply_markup=kbd,
    )


async def blueprints_info(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    kbd = InlineKeyboardMarkup([[InlineKeyboardButton("🔙 Back", callback_data="main_menu")]])
    await update.callback_query.edit_message_text(
        "📜 *Blueprint Tiers*\n\n"
        "• 📄 Common — 3× CRAFT → 1.2× yield\n"
        "• 📋 Uncommon — CRAFT×4+SOL → 2.5× yield\n"
        "• 💠 Rare — SOL×2+CRAFT×3 → 6× yield\n"
        "• 👑 Legendary — GOLD×3+CRAFT×3 → 20× yield\n\n"
        "Use the crafting table at craftlab.xyz to mint blueprints.",
        parse_mode="Markdown",
        reply_markup=kbd,
    )


async def help_cb(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    kbd = InlineKeyboardMarkup([[InlineKeyboardButton("🔙 Back", callback_data="main_menu")]])
    await update.callback_query.edit_message_text(
        "❓ *Help*\n\n"
        "/start — Main menu\n"
        "Wallets — Create/import Solana wallets\n"
        "AI Lab — Get crafting strategy from AI\n"
        "Mining — View staking tiers\n"
        "Blueprints — View recipe list\n\n"
        "Website: craftlab.xyz\n"
        "GitHub: github.com/CraftLAB/CraftLAB",
        parse_mode="Markdown",
        reply_markup=kbd,
    )


def main():
    asyncio.get_event_loop().run_until_complete(init_db())

    app = Application.builder().token(TOKEN).build()

    # Wallet conversation
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

    # AI Lab conversation
    ai_conv = ConversationHandler(
        entry_points=[CallbackQueryHandler(ai_lab_menu, pattern="^ai_lab$")],
        states={AWAIT_RESOURCES: [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_resources)]},
        fallbacks=[CommandHandler("cancel", ai_cancel)],
        allow_reentry=True,
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(wallet_conv)
    app.add_handler(ai_conv)
    app.add_handler(CallbackQueryHandler(main_menu_cb,   pattern="^main_menu$"))
    app.add_handler(CallbackQueryHandler(wallet_menu,    pattern="^wallet_menu$"))
    app.add_handler(CallbackQueryHandler(list_wallets,   pattern="^wallet_list$"))
    app.add_handler(CallbackQueryHandler(wallet_detail,  pattern=r"^wallet_detail_\d+$"))
    app.add_handler(CallbackQueryHandler(confirm_delete, pattern=r"^wallet_delete_\d+$"))
    app.add_handler(CallbackQueryHandler(do_delete,      pattern=r"^wallet_confirmdelete_\d+$"))
    app.add_handler(CallbackQueryHandler(mining_info,    pattern="^mining_info$"))
    app.add_handler(CallbackQueryHandler(blueprints_info,pattern="^blueprints_info$"))
    app.add_handler(CallbackQueryHandler(help_cb,        pattern="^help$"))

    log.info("CraftLAB Bot started")
    app.run_polling()


if __name__ == "__main__":
    main()
