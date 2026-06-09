import Hero from "@/components/Hero"
import MiningSection from "@/components/MiningSection"
import CraftingSection from "@/components/CraftingSection"
import BlueprintTiers from "@/components/BlueprintTiers"
import AILabSection from "@/components/AILabSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="bg-grid">
      <Hero />
      <hr className="section-divider" />
      <MiningSection />
      <hr className="section-divider" />
      <CraftingSection />
      <hr className="section-divider" />
      <BlueprintTiers />
      <hr className="section-divider" />
      <AILabSection />
      <Footer />
    </main>
  )
}
