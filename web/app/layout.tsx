import type { Metadata } from "next"
import { Press_Start_2P, Inter } from "next/font/google"
import "./globals.css"
import WalletProvider from "@/components/WalletProvider"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" })

export const metadata: Metadata = {
  title: "CraftLAB — On-chain Crafting Protocol on Solana",
  description: "Mine $CRAFT, combine resources, craft blueprints. The crafting protocol on Solana.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${pixel.variable}`}>
      <body>
        <WalletProvider>
          <Navbar />
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
