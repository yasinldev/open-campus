import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth is handled by middleware
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 bg-grid-white/[0.02]">
        {children}
      </main>
    </div>
  )
}
