import { BottomNavigation } from "@/components/bottom-navigation"
import { StoreProvider } from "@/lib/store"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-background pb-20">
        {children}
        <BottomNavigation />
      </div>
    </StoreProvider>
  )
}
