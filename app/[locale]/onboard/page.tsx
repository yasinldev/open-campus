'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Rocket, Sparkles, ArrowRight, BookOpen, Users, Camera, Check, Loader2 } from 'lucide-react'

interface OnboardPageProps {
  params: {
    locale: 'en' | 'tr'
  }
}

const interests = [
  { id: 'programming', icon: '💻', en: 'Programming', tr: 'Programlama' },
  { id: 'design', icon: '🎨', en: 'Design', tr: 'Tasarım' },
  { id: 'business', icon: '💼', en: 'Business', tr: 'İş Dünyası' },
  { id: 'marketing', icon: '📢', en: 'Marketing', tr: 'Pazarlama' },
  { id: 'data-science', icon: '📊', en: 'Data Science', tr: 'Veri Bilimi' },
  { id: 'ai-ml', icon: '🤖', en: 'AI & ML', tr: 'Yapay Zeka & ML' },
  { id: 'web-dev', icon: '🌐', en: 'Web Development', tr: 'Web Geliştirme' },
  { id: 'mobile-dev', icon: '📱', en: 'Mobile Dev', tr: 'Mobil Geliştirme' },
  { id: 'cybersecurity', icon: '🔒', en: 'Cybersecurity', tr: 'Siber Güvenlik' },
  { id: 'blockchain', icon: '⛓️', en: 'Blockchain', tr: 'Blockchain' },
  { id: 'game-dev', icon: '🎮', en: 'Game Dev', tr: 'Oyun Geliştirme' },
  { id: 'photography', icon: '📷', en: 'Photography', tr: 'Fotoğrafçılık' },
]

export default function OnboardPage({ params: { locale } }: OnboardPageProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState<'welcome' | 'profile' | 'interests'>('welcome')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  
  // Form data
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push(`/${locale}/auth`)
      return
    }

    // Check if onboarding is already completed
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (profile?.onboarding_completed) {
      router.push(`/${locale}/dashboard`)
      return
    }

    setUser(user)
    setDisplayName(user.user_metadata?.full_name || '')
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 2 * 1024 * 1024) { // Max 2MB
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null
    
    try {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, avatarFile)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Avatar upload error:', error)
      return null
    }
  }

  const handleComplete = async () => {
    if (selectedInterests.length < 3) return
    
    setLoading(true)
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) throw new Error('User not found')

      // Upload avatar
      const avatarUrl = await uploadAvatar(currentUser.id)

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          full_name: displayName || currentUser.user_metadata?.full_name,
          display_name: displayName,
          bio: bio,
          avatar_url: avatarUrl,
          interests: selectedInterests,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })

      if (profileError) throw profileError

      // Update auth metadata
      await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          onboarding_completed: true
        }
      })

      router.push(`/${locale}/dashboard`)
    } catch (error) {
      console.error('Onboarding error:', error)
      setLoading(false)
    }
  }

  const translations = {
    welcome: {
      title: locale === 'en' ? 'Welcome to Open Campus' : 'Open Campus\'e Hoş Geldin',
      subtitle: locale === 'en' ? 'Let\'s set up your learning journey in just 3 steps' : 'Öğrenme yolculuğunu 3 adımda başlatalım',
      cta: locale === 'en' ? 'Get Started' : 'Başlayalım'
    },
    profile: {
      title: locale === 'en' ? 'Create Your Profile' : 'Profilini Oluştur',
      subtitle: locale === 'en' ? 'Tell us a bit about yourself' : 'Kendinden biraz bahset',
      displayName: locale === 'en' ? 'Display Name' : 'Görünen Ad',
      displayNamePlaceholder: locale === 'en' ? 'Your name' : 'Adın',
      bio: locale === 'en' ? 'Bio' : 'Hakkında',
      bioPlaceholder: locale === 'en' ? 'Tell us about your learning goals...' : 'Öğrenme hedeflerinden bahset...',
      skip: locale === 'en' ? 'Skip' : 'Atla',
      next: locale === 'en' ? 'Continue' : 'Devam Et'
    },
    interests: {
      title: locale === 'en' ? 'Choose Your Interests' : 'İlgi Alanlarını Seç',
      subtitle: locale === 'en' ? 'Select at least 3 topics you want to learn' : 'Öğrenmek istediğin en az 3 konu seç',
      minSelection: locale === 'en' ? 'Select at least 3 interests' : 'En az 3 ilgi alanı seç',
      next: locale === 'en' ? 'Complete Setup' : 'Kurulumu Tamamla'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-border z-50">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ width: step === 'welcome' ? '33%' : step === 'profile' ? '66%' : '100%' }}
        />
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-20">
        {/* Welcome Step */}
        {step === 'welcome' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight">
                {translations.welcome.title}
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {translations.welcome.subtitle}
              </p>
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              {[
                { icon: BookOpen, title: locale === 'en' ? 'Learn' : 'Öğren', desc: locale === 'en' ? 'Access curated courses' : 'Seçilmiş kurslara eriş' },
                { icon: Sparkles, title: locale === 'en' ? 'AI Fellows' : 'AI Fellows', desc: locale === 'en' ? 'Personal AI assistants' : 'Kişisel AI asistanlar' },
                { icon: Users, title: locale === 'en' ? 'Community' : 'Topluluk', desc: locale === 'en' ? 'Connect with learners' : 'Öğrencilerle bağlan' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => setStep('profile')}
                className="group"
              >
                {translations.welcome.cta}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {/* Profile Step */}
        {step === 'profile' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-4xl font-bold">{translations.profile.title}</h2>
              <p className="text-muted-foreground">{translations.profile.subtitle}</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Avatar Upload */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <label htmlFor="avatar-upload" className="cursor-pointer block">
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-bold text-primary">
                            {displayName ? displayName[0].toUpperCase() : user?.email?.[0].toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform">
                        <Camera className="h-4 w-4" />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="display-name">{translations.profile.displayName}</Label>
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={translations.profile.displayNamePlaceholder}
                    className="h-11"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">{translations.profile.bio}</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 200))}
                    placeholder={translations.profile.bioPlaceholder}
                    rows={4}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {bio.length}/200
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep('interests')}
                    className="flex-1"
                  >
                    {translations.profile.skip}
                  </Button>
                  <Button
                    onClick={() => setStep('interests')}
                    disabled={!displayName.trim()}
                    className="flex-1 group"
                  >
                    {translations.profile.next}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interests Step */}
        {step === 'interests' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-4xl font-bold">{translations.interests.title}</h2>
              <p className="text-muted-foreground">{translations.interests.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    selectedInterests.includes(interest.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }`}
                >
                  {selectedInterests.includes(interest.id) && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">{interest.icon}</span>
                    <p className="text-sm font-medium text-center">
                      {locale === 'en' ? interest.en : interest.tr}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {selectedInterests.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {selectedInterests.length} {locale === 'en' ? 'selected' : 'seçildi'}
                  {selectedInterests.length < 3 && ` • ${translations.interests.minSelection}`}
                </p>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={selectedInterests.length < 3 || loading}
                className="w-full group"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {locale === 'en' ? 'Setting up...' : 'Kuruluyor...'}
                  </>
                ) : (
                  <>
                    {translations.interests.next}
                    <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
