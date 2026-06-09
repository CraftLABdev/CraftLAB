import aiosqlite
import os

DB_PATH = os.getenv("DB_PATH", "craftlab.db")

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS wallets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                public_key TEXT NOT NULL,
                encrypted_key TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            )
        """)
        await db.commit()

async def save_wallet(user_id: int, name: str, public_key: str, encrypted_key: str):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO wallets (user_id, name, public_key, encrypted_key) VALUES (?,?,?,?)",
            (user_id, name, public_key, encrypted_key)
        )
        await db.commit()

async def get_wallets(user_id: int) -> list[dict]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT id, name, public_key, created_at FROM wallets WHERE user_id=? ORDER BY id",
            (user_id,)
        ) as cur:
            rows = await cur.fetchall()
    return [dict(r) for r in rows]

async def get_wallet_by_id(wallet_id: int, user_id: int) -> dict | None:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM wallets WHERE id=? AND user_id=?",
            (wallet_id, user_id)
        ) as cur:
            row = await cur.fetchone()
    return dict(row) if row else None

async def delete_wallet(wallet_id: int, user_id: int):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("DELETE FROM wallets WHERE id=? AND user_id=?", (wallet_id, user_id))
        await db.commit()
