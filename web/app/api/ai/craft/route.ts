import { NextRequest, NextResponse } from "next/server"

const DEEPINFRA_KEY = process.env.DEEPINFRA_API_KEY || ""
const MODEL = "meta-llama/Meta-Llama-3.1-8B-Instruct"

const SYSTEM = `You are the CraftLAB AI — an on-chain crafting protocol advisor on Solana.
The user tells you what resources they have (CRAFT tokens, SOL, STONE, GOLD, MANA).
Suggest the best 1-2 crafting recipes they should attempt, which blueprint tier they can reach,
and a one-sentence yield strategy. Be concise (3-5 sentences max). No markdown headers.`

export async function POST(req: NextRequest) {
  const { resources } = await req.json()
  if (!resources?.trim()) return NextResponse.json({ error: "resources required" }, { status: 400 })

  if (!DEEPINFRA_KEY) {
    return NextResponse.json({
      suggestion: `With ${resources}, focus on accumulating at least 3 CRAFT tokens first to craft a Starter Blueprint. Once you have SOL + CRAFT, aim for a Base Blueprint (uncommon tier) for 2.5× yield boost. Stack and burn commons to upgrade faster.`,
    })
  }

  try {
    const res = await fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPINFRA_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `My resources: ${resources}` },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const suggestion = data.choices?.[0]?.message?.content?.trim() ?? "No suggestion available."
    return NextResponse.json({ suggestion })
  } catch {
    return NextResponse.json({ suggestion: "Lab AI temporarily offline. Try again shortly." }, { status: 500 })
  }
}
