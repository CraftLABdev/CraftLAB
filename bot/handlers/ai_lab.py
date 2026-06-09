from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes, ConversationHandler
from core.deepinfra import craft_suggestion

AWAIT_RESOURCES = 0


async def ai_lab_menu(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    text = (
        "🤖 *AI Recipe Lab*\n\n"
        "Tell me what resources you have and I'll suggest the best crafting strategy.\n\n"
        "Example: _500 CRAFT, 2 SOL, some STONE_\n\n"
        "Send your resources:"
    )
    if update.callback_query:
        await update.callback_query.edit_message_text(text, parse_mode="Markdown")
    else:
        await update.message.reply_text(text, parse_mode="Markdown")
    return AWAIT_RESOURCES


async def handle_resources(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    resources = update.message.text.strip()
    msg = await update.message.reply_text("🧪 Analyzing your resources…")
    suggestion = await craft_suggestion(resources)
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("🔄 Ask Again", callback_data="ai_lab"),
         InlineKeyboardButton("🔙 Menu",      callback_data="main_menu")],
    ])
    await msg.edit_text(
        f"🧪 *Lab Result*\n\n{suggestion}",
        parse_mode="Markdown",
        reply_markup=kbd
    )
    return ConversationHandler.END


async def cancel(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Cancelled.")
    return ConversationHandler.END
