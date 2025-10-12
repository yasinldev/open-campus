'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Dashboard, onboard ve auth sayfalarında Header/Footer gösterme
  const isDashboard = pathname.includes('/dashboard') || 
                      pathname.includes('/onboard') ||
                      pathname.includes('/auth')

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
