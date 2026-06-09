import Hero from "@/components/Hero"
import CoinTicker from "@/components/CoinTicker"
import HowItWorks from "@/components/HowItWorks"
import MiningSection from "@/components/MiningSection"
import MarketSection from "@/components/MarketSection"
import BlueprintTiers from "@/components/BlueprintTiers"
import AILabSection from "@/components/AILabSection"
import CTASection from "@/components/CTASection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <CoinTicker />
      <HowItWorks />
      <div className="border-t border-border" />
      <MiningSection />
      <div className="border-t border-border" />
      <MarketSection />
      <div className="border-t border-border" />
      <BlueprintTiers />
      <div className="border-t border-border" />
      <AILabSection />
      <div className="border-t border-border" />
      <CTASection />
      <Footer />
    </main>
  )
}
