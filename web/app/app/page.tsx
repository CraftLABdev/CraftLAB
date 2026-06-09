import dynamic from "next/dynamic"

const AppDashboard = dynamic(() => import("@/components/AppDashboard"), { ssr: false })

export default function AppPage() {
  return (
    <main className="pt-16 bg-grid min-h-screen">
      <AppDashboard />
    </main>
  )
}
