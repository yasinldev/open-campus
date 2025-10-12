'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  Settings,
  Trophy,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  FileText,
  GraduationCap,
  ClipboardCheck,
  Library
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { FacultyApplication } from '@/types/faculty'

const baseMenuItems = [
  {
    title: 'Home',
    titleTr: 'Ana Sayfa',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'All Courses',
    titleTr: 'Tüm Kurslar',
    href: '/dashboard/all-courses',
    icon: BookOpen,
  },
  {
    title: 'AI Fellows',
    titleTr: 'AI Fellows',
    href: '/dashboard/fellows',
    icon: Sparkles,
  },
  {
    title: 'Blog',
    titleTr: 'Blog',
    href: '/dashboard/blog',
    icon: FileText,
  },
  {
    title: 'Achievements',
    titleTr: 'Başarılar',
    href: '/dashboard/achievements',
    icon: Trophy,
  },
  {
    title: 'Settings',
    titleTr: 'Ayarlar',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = pathname.split('/')[1] as 'en' | 'tr'
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [facultyApplication, setFacultyApplication] = useState<FacultyApplication | null>(null)
  const [loadingApplication, setLoadingApplication] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setProfile(profileData)

        // Fetch faculty application
        const { data: applicationData } = await supabase
          .from('faculty_applications')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        setFacultyApplication(applicationData)
        setLoadingApplication(false)
      }
    }

    getUser()
  }, [])

  // Build dynamic menu items based on faculty application status and user role
  const menuItems = [...baseMenuItems]
  
  // Add "My Courses" for educators and admins
  const userRole = profile?.role
  const canManageCourses = userRole === 'admin' || userRole === 'educator'
  
  if (canManageCourses) {
    // Insert "My Courses" after "All Courses" (index 2)
    menuItems.splice(2, 0, {
      title: 'My Courses',
      titleTr: 'Kurslarım',
      href: '/dashboard/my-courses',
      icon: Library,
    })
  }
  
  // Note: Blog menu item stays visible for all users (they can read)
  // Only the "New Post" button will be restricted to admin/educator
  
  if (!loadingApplication) {
    // Adjust index based on whether "My Courses" was added
    const facultyItemIndex = canManageCourses ? 5 : 4
    
    if (!facultyApplication) {
      // No application - show "Apply as Educator"
      menuItems.splice(facultyItemIndex, 0, {
        title: 'Apply as Educator',
        titleTr: 'Eğitmen Başvurusu',
        href: '/apply-faculty',
        icon: GraduationCap,
      })
    } else {
      // Has application - show "Faculty Application"
      menuItems.splice(facultyItemIndex, 0, {
        title: 'Faculty Application',
        titleTr: 'Öğretim Başvurusu',
        href: '/dashboard/faculty/application',
        icon: ClipboardCheck,
      })
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push(`/${locale}/auth`)
  }

  const getInitial = () => {
    if (profile?.display_name) {
      return profile.display_name[0].toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center justify-between px-4">
        <Link href={`/${locale}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg text-primary-foreground font-bold">
            OC
          </div>
        </Link>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 w-64 lg:w-20 flex flex-col h-full bg-background border-r border-border transition-transform duration-300 lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo - Desktop only */}
        <div className="hidden lg:flex h-20 items-center justify-center border-b border-border">
          <Link href={`/${locale}`}>
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity text-lg font-bold">
              OC
            </div>
          </Link>
        </div>

        {/* Mobile User Info */}
        <div className="lg:hidden p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-primary">{getInitial()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {profile?.display_name || user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 overflow-y-auto relative">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === `/${locale}${item.href}`
              const Icon = item.icon
              const isFacultyItem = item.href === '/dashboard/faculty/application'
              const showStatusBadge = isFacultyItem && facultyApplication && facultyApplication.status !== 'draft'

              return (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex lg:flex-col items-center lg:text-center gap-3 lg:gap-1.5 p-3 transition-all relative rounded-lg lg:mx-2",
                    isActive 
                      ? "text-primary-foreground bg-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                  title={locale === 'en' ? item.title : item.titleTr}
                >
                  <div className="relative flex-shrink-0">
                    <Icon className={cn(
                      "h-5 w-5 transition-transform",
                      isActive && "scale-110"
                    )} />
                    {/* Status badge for faculty application on mobile */}
                    {showStatusBadge && (
                      <span className="lg:hidden absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-500 border-2 border-background" />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm lg:text-[10px] leading-tight transition-all flex-1 lg:flex-initial",
                    isActive ? "font-bold" : "font-medium"
                  )}>
                    {locale === 'en' ? item.title : item.titleTr}
                  </span>
                  {/* Status badge for faculty application on mobile */}
                  {showStatusBadge && (
                    <Badge 
                      variant="outline" 
                      className="lg:hidden text-[10px] px-1.5 py-0 h-5"
                    >
                      {facultyApplication.status === 'submitted' && (locale === 'en' ? 'Pending' : 'Beklemede')}
                      {facultyApplication.status === 'in_review' && (locale === 'en' ? 'Review' : 'İnceleme')}
                      {facultyApplication.status === 'pilot_active' && (locale === 'en' ? 'Pilot' : 'Pilot')}
                      {(facultyApplication.status === 'approved_fellow' || facultyApplication.status === 'approved_faculty') && '✓'}
                      {facultyApplication.status === 'rejected' && '✗'}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Profile - Desktop only */}
        <div className="hidden lg:block p-3 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-auto p-0 rounded-xl hover:bg-accent"
              >
                <div className="w-full flex flex-col items-center gap-1.5 py-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-primary">{getInitial()}</span>
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-medium">
                    {locale === 'en' ? 'Profile' : 'Profil'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.display_name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {profile?.username && (
                <DropdownMenuItem onClick={() => router.push(`/${locale}/${profile.username}`)}>
                  <User className="mr-2 h-4 w-4" />
                  {locale === 'en' ? 'View Profile' : 'Profili Görüntüle'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/settings`)}>
                <Settings className="mr-2 h-4 w-4" />
                {locale === 'en' ? 'Settings' : 'Ayarlar'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                {locale === 'en' ? 'Sign Out' : 'Çıkış Yap'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Sign Out Button */}
        <div className="lg:hidden p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {locale === 'en' ? 'Sign Out' : 'Çıkış Yap'}
          </Button>
        </div>
      </aside>
    </>
  )
}
