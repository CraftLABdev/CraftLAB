"use client"
import { useMemo, type ReactNode } from "react"
// @ts-ignore — wallet-adapter not yet compatible with React 19 FC types
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"

const RPC = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("mainnet-beta")

export default function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])
  return (
    // @ts-ignore
    <ConnectionProvider endpoint={RPC}>
      {/* @ts-ignore */}
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}
