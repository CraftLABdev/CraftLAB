from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes, ConversationHandler
from core.solana import generate_wallet, import_wallet, encrypt_key, decrypt_key, get_balance
from core.db import save_wallet, get_wallets, get_wallet_by_id, delete_wallet

AWAIT_PASSWORD, AWAIT_IMPORT_KEY, AWAIT_IMPORT_PASS, AWAIT_EXPORT_PASS = range(4)

_pending: dict = {}


async def wallet_menu(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("➕ Create Wallet", callback_data="wallet_create"),
         InlineKeyboardButton("📥 Import Wallet", callback_data="wallet_import")],
        [InlineKeyboardButton("👛 My Wallets", callback_data="wallet_list")],
        [InlineKeyboardButton("🔙 Main Menu", callback_data="main_menu")],
    ])
    text = "💼 *Wallet Manager*\n\nCreate a new Solana wallet or import an existing one."
    if update.callback_query:
        await update.callback_query.edit_message_text(text, parse_mode="Markdown", reply_markup=kbd)
    else:
        await update.message.reply_text(text, parse_mode="Markdown", reply_markup=kbd)


async def start_create(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.callback_query.edit_message_text(
        "🔐 *Create Wallet*\n\nSet a password to encrypt your private key.\n\n⚠️ If you lose this password, you lose access to the key.\n\nReply with your password:",
        parse_mode="Markdown"
    )
    _pending[update.effective_user.id] = {"action": "create"}
    return AWAIT_PASSWORD


async def handle_password(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    password = update.message.text
    await update.message.delete()

    pending = _pending.get(user_id, {})
    pub, priv = generate_wallet()
    enc = encrypt_key(priv, password)
    name = f"Wallet {len(await get_wallets(user_id)) + 1}"
    await save_wallet(user_id, name, pub, enc)

    kbd = InlineKeyboardMarkup([[InlineKeyboardButton("👛 My Wallets", callback_data="wallet_list")]])
    await update.message.reply_text(
        f"✅ *Wallet Created*\n\n`{pub}`\n\nPassword set. Your private key is encrypted.",
        parse_mode="Markdown",
        reply_markup=kbd
    )
    _pending.pop(user_id, None)
    return ConversationHandler.END


async def start_import(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.callback_query.edit_message_text(
        "📥 *Import Wallet*\n\nSend your private key (base58 format):",
        parse_mode="Markdown"
    )
    _pending[update.effective_user.id] = {"action": "import"}
    return AWAIT_IMPORT_KEY


async def handle_import_key(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    raw_key = update.message.text.strip()
    await update.message.delete()
    try:
        pub, priv = import_wallet(raw_key)
        _pending[user_id]["pub"] = pub
        _pending[user_id]["priv"] = priv
        await update.message.reply_text("🔐 Now set a password to encrypt this key:")
        return AWAIT_IMPORT_PASS
    except Exception:
        await update.message.reply_text("❌ Invalid private key. Try again or /cancel")
        return AWAIT_IMPORT_KEY


async def handle_import_pass(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    password = update.message.text
    await update.message.delete()
    pending = _pending[user_id]
    enc = encrypt_key(pending["priv"], password)
    name = f"Wallet {len(await get_wallets(user_id)) + 1}"
    await save_wallet(user_id, name, pending["pub"], enc)
    kbd = InlineKeyboardMarkup([[InlineKeyboardButton("👛 My Wallets", callback_data="wallet_list")]])
    await update.message.reply_text(
        f"✅ *Wallet Imported*\n\n`{pending['pub']}`",
        parse_mode="Markdown", reply_markup=kbd
    )
    _pending.pop(user_id, None)
    return ConversationHandler.END


async def list_wallets(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    wallets = await get_wallets(user_id)
    if not wallets:
        kbd = InlineKeyboardMarkup([[InlineKeyboardButton("➕ Create Wallet", callback_data="wallet_create")]])
        await update.callback_query.edit_message_text("No wallets yet.", reply_markup=kbd)
        return

    lines = []
    for w in wallets:
        bal = await get_balance(w["public_key"])
        lines.append(f"*{w['name']}*\n`{w['public_key'][:20]}…`\n💰 {bal:.4f} SOL")

    buttons = [[InlineKeyboardButton(f"🔍 {w['name']}", callback_data=f"wallet_detail_{w['id']}")] for w in wallets]
    buttons.append([InlineKeyboardButton("🔙 Back", callback_data="wallet_menu")])
    await update.callback_query.edit_message_text(
        "👛 *Your Wallets*\n\n" + "\n\n".join(lines),
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(buttons)
    )


async def wallet_detail(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    wallet_id = int(update.callback_query.data.split("_")[-1])
    w = await get_wallet_by_id(wallet_id, user_id)
    if not w:
        await update.callback_query.answer("Wallet not found")
        return
    bal = await get_balance(w["public_key"])
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("🔑 Export Key", callback_data=f"wallet_export_{wallet_id}"),
         InlineKeyboardButton("🗑 Delete",     callback_data=f"wallet_delete_{wallet_id}")],
        [InlineKeyboardButton("🔙 Back",       callback_data="wallet_list")],
    ])
    await update.callback_query.edit_message_text(
        f"*{w['name']}*\n\n`{w['public_key']}`\n\n💰 Balance: *{bal:.6f} SOL*\n📅 Created: {w['created_at']}",
        parse_mode="Markdown", reply_markup=kbd
    )


async def start_export(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    wallet_id = int(update.callback_query.data.split("_")[-1])
    _pending[update.effective_user.id] = {"action": "export", "wallet_id": wallet_id}
    await update.callback_query.edit_message_text("🔐 Enter your wallet password to decrypt:")
    return AWAIT_EXPORT_PASS


async def handle_export_pass(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    password = update.message.text
    await update.message.delete()
    wallet_id = _pending[user_id]["wallet_id"]
    w = await get_wallet_by_id(wallet_id, user_id)
    try:
        priv = decrypt_key(w["encrypted_key"], password)
        import base58
        priv_b58 = base58.b58encode(priv).decode()
        msg = await update.message.reply_text(
            f"🔑 *Private Key* (deletes in 30s)\n\n`{priv_b58}`\n\n⚠️ Never share this.",
            parse_mode="Markdown"
        )
        import asyncio
        await asyncio.sleep(30)
        await msg.delete()
    except Exception:
        await update.message.reply_text("❌ Wrong password.")
    _pending.pop(user_id, None)
    return ConversationHandler.END


async def confirm_delete(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    wallet_id = int(update.callback_query.data.split("_")[-1])
    kbd = InlineKeyboardMarkup([
        [InlineKeyboardButton("✅ Yes, delete", callback_data=f"wallet_confirmdelete_{wallet_id}"),
         InlineKeyboardButton("❌ Cancel",      callback_data="wallet_list")],
    ])
    await update.callback_query.edit_message_text(
        "⚠️ Delete this wallet? This cannot be undone.", reply_markup=kbd
    )


async def do_delete(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    wallet_id = int(update.callback_query.data.split("_")[-1])
    await delete_wallet(wallet_id, user_id)
    await update.callback_query.edit_message_text("🗑 Wallet deleted.")


async def cancel(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    _pending.pop(update.effective_user.id, None)
    await update.message.reply_text("Cancelled.")
    return ConversationHandler.END
