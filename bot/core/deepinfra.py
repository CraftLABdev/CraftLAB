import os
import httpx

DEEPINFRA_KEY = os.getenv("DEEPINFRA_API_KEY", "")
MODEL = "meta-llama/Meta-Llama-3.1-8B-Instruct"
BASE_URL = "https://api.deepinfra.com/v1/openai"

SYSTEM = """You are the CraftLAB AI — a crafting protocol advisor on Solana.
The user tells you what resources they have (CRAFT tokens, SOL, STONE, GOLD, MANA).
Suggest the best crafting recipe, which blueprint tier they can reach, and a yield strategy.
Be concise — 3 sentences max. Plain text only."""


async def craft_suggestion(resources: str) -> str:
    if not DEEPINFRA_KEY:
        return (
            f"With {resources}: accumulate 3+ CRAFT for a Starter Blueprint, "
            "then combine CRAFT+SOL for a rare SOL Blueprint at 6× yield. "
            "Stack commons and burn to upgrade faster."
        )
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.post(
                f"{BASE_URL}/chat/completions",
                headers={"Authorization": f"Bearer {DEEPINFRA_KEY}"},
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM},
                        {"role": "user", "content": f"My resources: {resources}"},
                    ],
                    "max_tokens": 180,
                    "temperature": 0.7,
                },
            )
            return r.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return f"Lab AI offline: {e}"
