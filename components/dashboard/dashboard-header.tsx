'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, User, Settings as SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = pathname.split('/')[1] as 'en' | 'tr'
  const supabase = createClient()
  
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      
      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileData) {
        setProfile(profileData)
      }
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push(`/${locale}/auth`)
  }

  return (
    <header className="h-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex-1" />

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent transition-colors">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center">
                    {profile?.display_name?.[0]?.toUpperCase() || 
                     user?.user_metadata?.full_name?.[0]?.toUpperCase() || 
                     user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium leading-none">
                    {profile?.display_name || user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user?.email}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {profile?.display_name || user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/dashboard/profile`} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  {locale === 'en' ? 'Profile' : 'Profil'}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/dashboard/settings`} className="cursor-pointer">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  {locale === 'en' ? 'Settings' : 'Ayarlar'}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {locale === 'en' ? 'Sign Out' : 'Çıkış Yap'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
