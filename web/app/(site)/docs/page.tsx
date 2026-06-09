import type { Metadata } from "next"
import DocsPage from "@/components/DocsPage"

export const metadata: Metadata = {
  title: "CraftLAB Docs — Protocol Documentation",
  description: "Full documentation for the CraftLAB on-chain crafting protocol on Solana.",
}

export default function Docs() {
  return <DocsPage />
}
