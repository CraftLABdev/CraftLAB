import { NextRequest, NextResponse } from "next/server"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

const RPC = process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com"

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")
  if (!address) return NextResponse.json({ error: "address required" }, { status: 400 })

  try {
    const connection = new Connection(RPC, "confirmed")
    const pubkey = new PublicKey(address)
    const lamports = await connection.getBalance(pubkey)
    return NextResponse.json({ address, sol: lamports / LAMPORTS_PER_SOL, lamports })
  } catch {
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 })
  }
}
