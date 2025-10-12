'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar,
  Award,
  BookOpen,
  Settings,
  Share2,
  Trophy,
  Loader2,
  GraduationCap,
  TrendingUp
} from 'lucide-react'

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const username = params?.username as string
  const locale = (params?.locale as string) || 'en'
  
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [stats, setStats] = useState({
    courses: 0,
    completed: 0,
    certificates: 0,
    points: 0
  })

  const t = {
    en: {
      loading: 'Loading profile...',
      notFound: 'Profile not found',
      notFoundDesc: 'The user you are looking for does not exist.',
      goBack: 'Go Back',
      joined: 'Joined',
      editProfile: 'Edit Profile',
      share: 'Share',
      courses: 'Courses',
      completed: 'Completed',
      certificates: 'Certificates',
      points: 'Points',
      about: 'About',
      achievements: 'Achievements',
      recentActivity: 'Recent Activity',
      noActivity: 'No recent activity',
      stats: 'Statistics',
    },
    tr: {
      loading: 'Profil yükleniyor...',
      notFound: 'Profil bulunamadı',
      notFoundDesc: 'Aradığınız kullanıcı mevcut değil.',
      goBack: 'Geri Dön',
      joined: 'Katılma',
      editProfile: 'Profili Düzenle',
      share: 'Paylaş',
      courses: 'Kurslar',
      completed: 'Tamamlanan',
      certificates: 'Sertifikalar',
      points: 'Puan',
      about: 'Hakkında',
      achievements: 'Başarılar',
      recentActivity: 'Son Aktiviteler',
      noActivity: 'Son aktivite yok',
      stats: 'İstatistikler',
    },
  }

  const text = t[locale as keyof typeof t]

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      // Get profile by username
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (error || !profileData) {
        setProfile(null)
        setLoading(false)
        return
      }

      setProfile(profileData)
      setIsOwnProfile(user?.id === profileData.id)
      
      // Mock stats - replace with real data
      setStats({
        courses: 12,
        completed: 8,
        certificates: 5,
        points: 2450
      })
      
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const shareProfile = async () => {
    const url = `${window.location.origin}/${locale}/${username}`
    if (navigator.share) {
      await navigator.share({
        title: `${profile.display_name || username}'s Profile`,
        url: url
      })
    } else {
      navigator.clipboard.writeText(url)
      alert('Profile link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{text.loading}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">😕</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            {text.notFound}
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            {text.notFoundDesc}
          </p>
          
          <Button 
            onClick={() => router.push(`/${locale}`)}
            size="lg"
          >
            ← {text.goBack}
          </Button>
        </div>
      </div>
    )
  }

  const joinedDate = new Date(profile.created_at).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  })

  // Role badge configuration
  const getRoleBadge = (role: string) => {
    const badges = {
      student: {
        label: { en: 'Student', tr: 'Öğrenci' },
        variant: 'secondary' as const,
        icon: BookOpen,
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      },
      educator: {
        label: { en: 'Educator', tr: 'Eğitmen' },
        variant: 'default' as const,
        icon: GraduationCap,
        className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
      },
      contributor: {
        label: { en: 'Contributor', tr: 'Katkıda Bulunan' },
        variant: 'outline' as const,
        icon: Trophy,
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      },
      admin: {
        label: { en: 'Admin', tr: 'Yönetici' },
        variant: 'destructive' as const,
        icon: Award,
        className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
      }
    }
    
    return badges[role as keyof typeof badges] || badges.student
  }

  const roleBadge = getRoleBadge(profile.role || 'student')
  const RoleIcon = roleBadge.icon

  return (
    <div className="min-h-screen bg-background relative">
      {/* Static Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      {/* Hero Section - Clean */}
      <div className="relative border-b border-border/50">
        <div className="relative px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-center">
              {/* Left Side - Profile Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                      {profile.display_name || username}
                    </span>
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-lg text-muted-foreground">
                      @{username}
                    </p>
                    <Badge 
                      variant={roleBadge.variant} 
                      className={`text-xs font-medium flex items-center gap-1.5 ${roleBadge.className}`}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {roleBadge.label[locale as keyof typeof roleBadge.label]}
                    </Badge>
                  </div>
                </div>
                
                {profile.bio && (
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-6 text-sm">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <a 
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span className="font-medium">{profile.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{text.joined} {joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Avatar & Actions */}
              <div className="flex flex-col items-center space-y-6">
                {/* Avatar */}
                <div className="relative">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.display_name || username}
                      className="w-32 h-32 rounded-full border-4 border-background shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-background shadow-lg bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center text-white text-4xl font-bold">
                      {(profile.display_name || username).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={shareProfile}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {text.share}
                  </Button>
                  {isOwnProfile && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => router.push(`/${locale}/dashboard/settings`)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {text.editProfile}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">

        {/* Stats Grid - Clean */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-primary/10">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold">12</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">{text.courses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-green-500/10">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold">8</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">{text.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-yellow-500/10">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold">5</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">{text.certificates}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-500/10">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold">2,450</p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">{text.points}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            {/* About */}
            {profile.bio && (
              <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    {text.about}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  </div>
                  {text.recentActivity}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">{text.noActivity}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            {/* Achievements */}
            <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50 sticky top-4">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-yellow-500/10">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  </div>
                  {text.achievements}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Award className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Early Adopter</div>
                        <div className="text-xs text-muted-foreground">Joined in the first month</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <GraduationCap className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Course Completer</div>
                        <div className="text-xs text-muted-foreground">Completed 5+ courses</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Goal Setter</div>
                        <div className="text-xs text-muted-foreground">Set and achieved goals</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

