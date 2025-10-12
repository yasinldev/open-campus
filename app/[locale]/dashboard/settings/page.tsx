'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast, Toaster } from 'sonner'
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Globe, 
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Camera,
  CheckCircle2,
  Languages,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  Download,
  FileText,
  Key,
  Smartphone,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Award,
  Target,
  TrendingUp
} from 'lucide-react'

interface SettingsPageProps {
  params: {
    locale: 'en' | 'tr'
  }
}

export default function SettingsPage({ params: { locale } }: SettingsPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  
  // Profile states
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [username, setUsername] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [avatar, setAvatar] = useState('')
  const [joinedDate, setJoinedDate] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [courseUpdates, setCourseUpdates] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [achievementAlerts, setAchievementAlerts] = useState(true)
  const [communityMessages, setCommunityMessages] = useState(false)
  
  // Preferences states
  const [language, setLanguage] = useState(locale)
  const [autoplay, setAutoplay] = useState(true)
  const [showProgress, setShowProgress] = useState(true)

  const t = {
    en: {
      title: 'Settings',
      subtitle: 'Manage your account settings and preferences',
      
      // Profile
      profileTitle: 'Profile Information',
      profileDesc: 'Update your personal information and public profile',
      displayName: 'Display Name',
      displayNamePlaceholder: 'Enter your display name',
      username: 'Username',
      usernamePlaceholder: 'your-username',
      email: 'Email Address',
      bio: 'Bio',
      bioPlaceholder: 'Tell us about yourself...',
      location: 'Location',
      locationPlaceholder: 'City, Country',
      website: 'Website',
      websitePlaceholder: 'https://yoursite.com',
      avatar: 'Profile Picture',
      avatarChange: 'Change Avatar',
      avatarUploadHint: 'Click the camera icon to upload a new picture',
      avatarSizeLimit: 'Max file size: 5MB',
      avatarRateLimit: 'Maximum 5 uploads per hour',
      joined: 'Joined',
      
      // Stats
      statsTitle: 'Account Statistics',
      statsDesc: 'Overview of your learning journey',
      totalCourses: 'Total Courses',
      completedCourses: 'Completed',
      totalHours: 'Learning Hours',
      certificates: 'Certificates',
      
      // Password
      passwordTitle: 'Password & Security',
      passwordDesc: 'Update your password and security settings',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordStrength: 'Password Strength',
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong',
      veryStrong: 'Very Strong',
      twoFactor: 'Two-Factor Authentication',
      twoFactorDesc: 'Add an extra layer of security',
      enable: 'Enable',
      enabled: 'Enabled',
      sessions: 'Active Sessions',
      sessionsDesc: 'Manage your active sessions',
      
      // Notifications
      notificationsTitle: 'Notifications',
      notificationsDesc: 'Manage how you receive notifications',
      emailNotif: 'Email Notifications',
      emailNotifDesc: 'Receive notifications via email',
      pushNotif: 'Push Notifications',
      pushNotifDesc: 'Receive push notifications',
      courseUpdates: 'Course Updates',
      courseUpdatesDesc: 'Get notified about new course content',
      weeklyDigest: 'Weekly Digest',
      weeklyDigestDesc: 'Receive weekly summary of your progress',
      achievements: 'Achievement Alerts',
      achievementsDesc: 'Get notified when you earn achievements',
      community: 'Community Messages',
      communityDesc: 'Receive messages from community',
      
      // Preferences
      preferencesTitle: 'Preferences',
      preferencesDesc: 'Customize your learning experience',
      languagePref: 'Language',
      languageDesc: 'Choose your preferred language',
      themePref: 'Theme',
      themeDesc: 'Select your interface theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'System',
      autoplayPref: 'Autoplay Videos',
      autoplayDesc: 'Automatically play next video',
      progressPref: 'Show Progress',
      progressDesc: 'Display learning progress indicators',
      
      // Data
      dataTitle: 'Data & Privacy',
      dataDesc: 'Manage your data and privacy settings',
      exportData: 'Export Your Data',
      exportDesc: 'Download a copy of your data',
      downloadBtn: 'Download Data',
      activityLog: 'Activity Log',
      activityDesc: 'View your account activity',
      viewLog: 'View Log',
      
      // Danger Zone
      dangerTitle: 'Danger Zone',
      dangerDesc: 'Irreversible actions',
      deleteAccount: 'Delete Account',
      deleteWarning: 'Once you delete your account, there is no going back. Please be certain.',
      deleteBtn: 'Delete Account',
      
      // Actions
      saveChanges: 'Save Changes',
      updatePassword: 'Update Password',
      cancel: 'Cancel',
      saving: 'Saving...',
      saved: 'Saved!',
      error: 'Error',
      success: 'Success!',
    },
    tr: {
      title: 'Ayarlar',
      subtitle: 'Hesap ayarlarınızı ve tercihlerinizi yönetin',
      
      // Profile
      profileTitle: 'Profil Bilgileri',
      profileDesc: 'Kişisel bilgilerinizi ve genel profilinizi güncelleyin',
      displayName: 'Görünen Ad',
      displayNamePlaceholder: 'Görünen adınızı girin',
      username: 'Kullanıcı Adı',
      usernamePlaceholder: 'kullanici-adiniz',
      email: 'E-posta Adresi',
      bio: 'Biyografi',
      bioPlaceholder: 'Kendinizden bahsedin...',
      location: 'Konum',
      locationPlaceholder: 'Şehir, Ülke',
      website: 'Website',
      websitePlaceholder: 'https://siteniz.com',
      avatar: 'Profil Resmi',
      avatarChange: 'Avatar Değiştir',
      avatarUploadHint: 'Yeni resim yüklemek için kamera ikonuna tıklayın',
      avatarSizeLimit: 'Maksimum dosya boyutu: 5MB',
      avatarRateLimit: 'Saatte en fazla 5 yükleme',
      joined: 'Katılım',
      
      // Stats
      statsTitle: 'Hesap İstatistikleri',
      statsDesc: 'Öğrenme yolculuğunuzun özeti',
      totalCourses: 'Toplam Kurs',
      completedCourses: 'Tamamlanan',
      totalHours: 'Öğrenme Saati',
      certificates: 'Sertifika',
      
      // Password
      passwordTitle: 'Şifre & Güvenlik',
      passwordDesc: 'Şifrenizi ve güvenlik ayarlarınızı güncelleyin',
      currentPassword: 'Mevcut Şifre',
      newPassword: 'Yeni Şifre',
      confirmPassword: 'Şifreyi Onayla',
      passwordStrength: 'Şifre Gücü',
      weak: 'Zayıf',
      medium: 'Orta',
      strong: 'Güçlü',
      veryStrong: 'Çok Güçlü',
      twoFactor: 'İki Faktörlü Doğrulama',
      twoFactorDesc: 'Ekstra güvenlik katmanı ekleyin',
      enable: 'Etkinleştir',
      enabled: 'Etkin',
      sessions: 'Aktif Oturumlar',
      sessionsDesc: 'Aktif oturumlarınızı yönetin',
      
      // Notifications
      notificationsTitle: 'Bildirimler',
      notificationsDesc: 'Bildirimleri nasıl alacağınızı yönetin',
      emailNotif: 'E-posta Bildirimleri',
      emailNotifDesc: 'E-posta ile bildirim alın',
      pushNotif: 'Push Bildirimleri',
      pushNotifDesc: 'Push bildirimleri alın',
      courseUpdates: 'Kurs Güncellemeleri',
      courseUpdatesDesc: 'Yeni kurs içeriği hakkında bildirim alın',
      weeklyDigest: 'Haftalık Özet',
      weeklyDigestDesc: 'İlerlemenizin haftalık özetini alın',
      achievements: 'Başarı Bildirimleri',
      achievementsDesc: 'Başarı kazandığınızda bildirim alın',
      community: 'Topluluk Mesajları',
      communityDesc: 'Topluluktan mesaj alın',
      
      // Preferences
      preferencesTitle: 'Tercihler',
      preferencesDesc: 'Öğrenme deneyiminizi özelleştirin',
      languagePref: 'Dil',
      languageDesc: 'Tercih ettiğiniz dili seçin',
      themePref: 'Tema',
      themeDesc: 'Arayüz temanızı seçin',
      themeLight: 'Açık',
      themeDark: 'Koyu',
      themeSystem: 'Sistem',
      autoplayPref: 'Videoları Otomatik Oynat',
      autoplayDesc: 'Sonraki videoyu otomatik oynat',
      progressPref: 'İlerlemeyi Göster',
      progressDesc: 'Öğrenme ilerleme göstergelerini göster',
      
      // Data
      dataTitle: 'Veri & Gizlilik',
      dataDesc: 'Verilerinizi ve gizlilik ayarlarınızı yönetin',
      exportData: 'Verilerinizi Dışa Aktarın',
      exportDesc: 'Verilerinizin bir kopyasını indirin',
      downloadBtn: 'Verileri İndir',
      activityLog: 'Aktivite Günlüğü',
      activityDesc: 'Hesap aktivitenizi görüntüleyin',
      viewLog: 'Günlüğü Görüntüle',
      
      // Danger Zone
      dangerTitle: 'Tehlikeli Bölge',
      dangerDesc: 'Geri alınamaz işlemler',
      deleteAccount: 'Hesabı Sil',
      deleteWarning: 'Hesabınızı sildiğinizde geri dönüş olmaz. Lütfen emin olun.',
      deleteBtn: 'Hesabı Sil',
      
      // Actions
      saveChanges: 'Değişiklikleri Kaydet',
      updatePassword: 'Şifreyi Güncelle',
      cancel: 'İptal',
      saving: 'Kaydediliyor...',
      saved: 'Kaydedildi!',
      error: 'Hata',
      success: 'Başarılı!',
    },
  }

  const text = t[locale]

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Calculate password strength
    if (newPassword.length === 0) {
      setPasswordStrength(0)
      return
    }
    
    let strength = 0
    if (newPassword.length >= 6) strength += 25
    if (newPassword.length >= 10) strength += 25
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength += 25
    if (/\d/.test(newPassword)) strength += 12.5
    if (/[^a-zA-Z\d]/.test(newPassword)) strength += 12.5
    
    setPasswordStrength(strength)
  }, [newPassword])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push(`/${locale}/auth`)
      return
    }

    setUser(user)
    setEmail(user.email || '')
    setJoinedDate(new Date(user.created_at).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))

    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileData) {
      setProfile(profileData)
      setDisplayName(profileData.display_name || '')
      setBio(profileData.bio || '')
      setUsername(profileData.username || '')
      setLocation(profileData.location || '')
      setWebsite(profileData.website || '')
      setAvatar(profileData.avatar_url || '')
      
      // Load notification preferences
      setEmailNotifications(profileData.email_notifications ?? true)
      setPushNotifications(profileData.push_notifications ?? false)
      setCourseUpdates(profileData.course_updates ?? true)
      setWeeklyDigest(profileData.weekly_digest ?? true)
      setAchievementAlerts(profileData.achievement_alerts ?? true)
      setCommunityMessages(profileData.community_messages ?? false)
      
      // Load preferences
      setLanguage(profileData.language_preference || locale)
      // Set theme using useTheme hook
      const savedTheme = profileData.theme_preference || 'system'
      setTheme(savedTheme)
      setAutoplay(profileData.autoplay_enabled ?? true)
      setShowProgress(profileData.show_progress ?? true)
    }

    setLoading(false)
  }

  const updateProfile = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          bio: bio,
          username: username.toLowerCase(), // Ensure lowercase
          location: location,
          website: website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      
      toast.success(text.success, {
        description: locale === 'en' ? 'Your profile has been updated successfully' : 'Profiliniz başarıyla güncellendi',
      })
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(text.error, {
        description: error.message || (locale === 'en' ? 'Failed to update profile' : 'Profil güncellenemedi'),
      })
    } finally {
      setSaving(false)
    }
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0]
    
    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        locale === 'en' ? 'File too large' : 'Dosya çok büyük',
        {
          description: locale === 'en' 
            ? 'Please select an image smaller than 5MB' 
            : 'Lütfen 5MB\'dan küçük bir resim seçin'
        }
      )
      event.target.value = '' // Reset input
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error(
        locale === 'en' ? 'Invalid file type' : 'Geçersiz dosya tipi',
        {
          description: locale === 'en' 
            ? 'Please select a valid image file (JPG, PNG, GIF, WebP)' 
            : 'Lütfen geçerli bir resim dosyası seçin (JPG, PNG, GIF, WebP)'
        }
      )
      event.target.value = '' // Reset input
      return
    }

    // Check rate limit (max 5 uploads per hour)
    try {
      const { data: uploadLogs, error: logError } = await supabase
        .from('avatar_upload_log')
        .select('uploaded_at')
        .eq('user_id', user.id)
        .gte('uploaded_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .order('uploaded_at', { ascending: false })

      if (logError) {
        console.warn('Could not check rate limit:', logError)
        // Continue anyway - don't block user if log check fails
      } else if (uploadLogs && uploadLogs.length >= 5) {
        toast.error(
          locale === 'en' ? 'Upload limit reached' : 'Yükleme limiti aşıldı',
          {
            description: locale === 'en' 
              ? 'You can upload maximum 5 profile pictures per hour. Please try again later.' 
              : 'Saatte en fazla 5 profil resmi yükleyebilirsiniz. Lütfen daha sonra tekrar deneyin.'
          }
        )
        event.target.value = '' // Reset input
        return
      }
    } catch (error) {
      console.warn('Rate limit check failed:', error)
      // Continue anyway - don't block user
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    setUploadingAvatar(true)

    try {
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      setAvatar(publicUrl)
      
      toast.success(text.success, {
        description: locale === 'en' ? 'Profile picture updated successfully' : 'Profil resmi başarıyla güncellendi',
      })
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      
      // Check for rate limit error
      if (error.message && error.message.includes('rate limit')) {
        toast.error(
          locale === 'en' ? 'Upload limit reached' : 'Yükleme limiti aşıldı',
          {
            description: locale === 'en' 
              ? 'You can upload maximum 5 profile pictures per hour' 
              : 'Saatte en fazla 5 profil resmi yükleyebilirsiniz'
          }
        )
      } else {
        toast.error(text.error, {
          description: error.message || (locale === 'en' ? 'Failed to upload profile picture' : 'Profil resmi yüklenemedi'),
        })
      }
    } finally {
      setUploadingAvatar(false)
      event.target.value = '' // Reset input
    }
  }

  const updatePassword = async () => {
    if (!user) return
    
    if (newPassword !== confirmPassword) {
      toast.error(locale === 'en' ? 'Passwords do not match' : 'Şifreler eşleşmiyor')
      return
    }
    
    if (newPassword.length < 6) {
      toast.error(locale === 'en' ? 'Password must be at least 6 characters' : 'Şifre en az 6 karakter olmalı')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setNewPassword('')
      setConfirmPassword('')
      setCurrentPassword('')
      
      toast.success(text.success, {
        description: locale === 'en' ? 'Your password has been updated successfully' : 'Şifreniz başarıyla güncellendi',
      })
    } catch (error: any) {
      console.error('Error updating password:', error)
      toast.error(text.error, {
        description: error.message || (locale === 'en' ? 'Failed to update password' : 'Şifre güncellenemedi'),
      })
    } finally {
      setSaving(false)
    }
  }

  const updateNotifications = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email_notifications: emailNotifications,
          push_notifications: pushNotifications,
          course_updates: courseUpdates,
          weekly_digest: weeklyDigest,
          achievement_alerts: achievementAlerts,
          community_messages: communityMessages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      
      toast.success(text.success, {
        description: locale === 'en' ? 'Notification preferences updated' : 'Bildirim tercihleri güncellendi',
      })
    } catch (error: any) {
      console.error('Error updating notifications:', error)
      toast.error(text.error, {
        description: error.message || (locale === 'en' ? 'Failed to update notifications' : 'Bildirimler güncellenemedi'),
      })
    } finally {
      setSaving(false)
    }
  }

  const updatePreferences = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          language_preference: language,
          theme_preference: theme,
          autoplay_enabled: autoplay,
          show_progress: showProgress,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      
      toast.success(text.success, {
        description: locale === 'en' ? 'Preferences updated successfully' : 'Tercihler başarıyla güncellendi',
      })
    } catch (error: any) {
      console.error('Error updating preferences:', error)
      toast.error(text.error, {
        description: error.message || (locale === 'en' ? 'Failed to update preferences' : 'Tercihler güncellenemedi'),
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteAccount = async () => {
    const confirmed = confirm(
      locale === 'en'
        ? 'Are you absolutely sure? This action cannot be undone. Type "DELETE" to confirm.'
        : 'Kesinlikle emin misiniz? Bu işlem geri alınamaz. Onaylamak için "SİL" yazın.'
    )

    if (!confirmed) return

    setSaving(true)
    try {
      toast.info(locale === 'en' ? 'Account deletion initiated' : 'Hesap silme işlemi başlatıldı')
      // In production, call an API endpoint to delete the account
      setTimeout(() => {
        router.push(`/${locale}/auth`)
      }, 2000)
    } catch (error: any) {
      console.error('Error deleting account:', error)
      toast.error(text.error, {
        description: error.message || (locale === 'en' ? 'Failed to delete account' : 'Hesap silinemedi'),
      })
    } finally {
      setSaving(false)
    }
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return ''
    if (passwordStrength < 40) return text.weak
    if (passwordStrength < 60) return text.medium
    if (passwordStrength < 80) return text.strong
    return text.veryStrong
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500'
    if (passwordStrength < 60) return 'bg-yellow-500'
    if (passwordStrength < 80) return 'bg-blue-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster 
        position="top-right" 
        richColors
        expand={false}
        duration={3000}
      />
      
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">{text.title}</h1>
          </div>
          <p className="text-muted-foreground">{text.subtitle}</p>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
        
        {/* Profile Information */}
        <Card className="border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>{text.profileTitle}</CardTitle>
                <CardDescription>{text.profileDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-border">
                    {displayName.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                
                {/* Upload overlay */}
                <label 
                  htmlFor="avatar-upload" 
                  className={`absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${uploadingAvatar ? 'opacity-100' : ''}`}
                >
                  {uploadingAvatar ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </label>
                
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={uploadAvatar}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
                
                {/* Camera button */}
                <label 
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 p-2 bg-primary rounded-full border-2 border-background hover:scale-110 transition-transform cursor-pointer ${uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Camera className="w-4 h-4" />
                </label>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{displayName || 'User'}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {text.joined}: {joinedDate}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {text.avatarUploadHint}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span>{text.avatarSizeLimit}</span>
                  <span>•</span>
                  <span>{text.avatarRateLimit}</span>
                </p>
              </div>
            </div>

            <Separator />

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">{text.displayName}</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={text.displayNamePlaceholder}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">{text.username}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={text.usernamePlaceholder}
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">{text.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={email}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">{text.bio}</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={text.bioPlaceholder}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{text.location}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={text.locationPlaceholder}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">{text.website}</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder={text.websitePlaceholder}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={updateProfile} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                {saving ? text.saving : text.saveChanges}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card className="border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <CardTitle>{text.statsTitle}</CardTitle>
                <CardDescription>{text.statsDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <p className="text-sm text-muted-foreground">{text.totalCourses}</p>
                </div>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-muted-foreground">{text.completedCourses}</p>
                </div>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <p className="text-sm text-muted-foreground">{text.totalHours}</p>
                </div>
                <p className="text-2xl font-bold">156</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <p className="text-sm text-muted-foreground">{text.certificates}</p>
                </div>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password & Security */}
        <Card className="border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <CardTitle>{text.passwordTitle}</CardTitle>
                <CardDescription>{text.passwordDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{text.currentPassword}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">{text.newPassword}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{text.passwordStrength}</span>
                      <span className={`font-medium ${
                        passwordStrength < 40 ? 'text-red-500' :
                        passwordStrength < 60 ? 'text-yellow-500' :
                        passwordStrength < 80 ? 'text-blue-500' : 'text-green-500'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{text.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Smartphone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{text.twoFactor}</p>
                  <p className="text-sm text-muted-foreground">{text.twoFactorDesc}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {text.enable}
              </Button>
            </div>

            {/* Active Sessions */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Key className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">{text.sessions}</p>
                  <p className="text-sm text-muted-foreground">{text.sessionsDesc}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {locale === 'en' ? 'Manage' : 'Yönet'}
              </Button>
            </div>

            <div className="flex justify-end">
              <Button onClick={updatePassword} disabled={saving} className="gap-2">
                <Lock className="w-4 h-4" />
                {saving ? text.saving : text.updatePassword}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Bell className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <CardTitle>{text.notificationsTitle}</CardTitle>
                <CardDescription>{text.notificationsDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <p className="font-medium">{text.emailNotif}</p>
                <p className="text-sm text-muted-foreground">{text.emailNotifDesc}</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <p className="font-medium">{text.pushNotif}</p>
                <p className="text-sm text-muted-foreground">{text.pushNotifDesc}</p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <p className="font-medium">{text.courseUpdates}</p>
                <p className="text-sm text-muted-foreground">{text.courseUpdatesDesc}</p>
              </div>
              <Switch
                checked={courseUpdates}
                onCheckedChange={setCourseUpdates}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <p className="font-medium">{text.weeklyDigest}</p>
                <p className="text-sm text-muted-foreground">{text.weeklyDigestDesc}</p>
              </div>
              <Switch
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <p className="font-medium">{text.achievements}</p>
                <p className="text-sm text-muted-foreground">{text.achievementsDesc}</p>
              </div>
              <Switch
                checked={achievementAlerts}
                onCheckedChange={setAchievementAlerts}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <p className="font-medium">{text.community}</p>
                <p className="text-sm text-muted-foreground">{text.communityDesc}</p>
              </div>
              <Switch
                checked={communityMessages}
                onCheckedChange={setCommunityMessages}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={updateNotifications} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                {saving ? text.saving : text.saveChanges}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Globe className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <CardTitle>{text.preferencesTitle}</CardTitle>
                <CardDescription>{text.preferencesDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="font-medium">{text.languagePref}</p>
                  <p className="text-sm text-muted-foreground">{text.languageDesc}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                >
                  EN
                </Button>
                <Button
                  variant={language === 'tr' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('tr')}
                >
                  TR
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="font-medium">{text.themePref}</p>
                  <p className="text-sm text-muted-foreground">{text.themeDesc}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={async () => {
                    setTheme('light')
                    // Save to database
                    if (user) {
                      await supabase
                        .from('profiles')
                        .update({ theme_preference: 'light' })
                        .eq('id', user.id)
                    }
                  }}
                >
                  <Sun className="w-4 h-4" />
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={async () => {
                    setTheme('dark')
                    // Save to database
                    if (user) {
                      await supabase
                        .from('profiles')
                        .update({ theme_preference: 'dark' })
                        .eq('id', user.id)
                    }
                  }}
                >
                  <Moon className="w-4 h-4" />
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={async () => {
                    setTheme('system')
                    // Save to database
                    if (user) {
                      await supabase
                        .from('profiles')
                        .update({ theme_preference: 'system' })
                        .eq('id', user.id)
                    }
                  }}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <p className="font-medium">{text.autoplayPref}</p>
                <p className="text-sm text-muted-foreground">{text.autoplayDesc}</p>
              </div>
              <Switch
                checked={autoplay}
                onCheckedChange={setAutoplay}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <p className="font-medium">{text.progressPref}</p>
                <p className="text-sm text-muted-foreground">{text.progressDesc}</p>
              </div>
              <Switch
                checked={showProgress}
                onCheckedChange={setShowProgress}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={updatePreferences} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                {saving ? text.saving : text.saveChanges}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <CardTitle>{text.dataTitle}</CardTitle>
                <CardDescription>{text.dataDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="font-medium">{text.exportData}</p>
                  <p className="text-sm text-muted-foreground">{text.exportDesc}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                {text.downloadBtn}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="font-medium">{text.activityLog}</p>
                  <p className="text-sm text-muted-foreground">{text.activityDesc}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {text.viewLog}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-destructive/50 bg-destructive/5 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-destructive">{text.dangerTitle}</CardTitle>
                <CardDescription>{text.dangerDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
              <div className="flex items-start gap-3 mb-4">
                <Trash2 className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">{text.deleteAccount}</p>
                  <p className="text-sm text-muted-foreground mt-1">{text.deleteWarning}</p>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={deleteAccount}
                disabled={saving}
                className="w-full gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {text.deleteBtn}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
