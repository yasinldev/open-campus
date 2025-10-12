'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UpdatePasswordPageProps {
  params: {
    locale: 'en' | 'tr'
  }
}

export default function UpdatePasswordPage({ params: { locale } }: UpdatePasswordPageProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)

  const t = locale === 'en' ? {
    title: 'Update Password',
    subtitle: 'Enter your new password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    passwordPlaceholder: '••••••••',
    updateButton: 'Update Password',
    updating: 'Updating...',
    backToLogin: 'Back to Login',
    success: {
      title: 'Password Updated',
      message: 'Your password has been successfully updated. You can now log in with your new password.'
    },
    errors: {
      required: 'Password is required',
      tooShort: 'Password must be at least 8 characters',
      mismatch: 'Passwords do not match',
      invalidSession: 'Invalid or expired reset link. Please request a new one.',
      generic: 'An error occurred. Please try again'
    }
  } : {
    title: 'Şifreyi Güncelle',
    subtitle: 'Yeni şifrenizi girin',
    newPassword: 'Yeni Şifre',
    confirmPassword: 'Şifreyi Onayla',
    passwordPlaceholder: '••••••••',
    updateButton: 'Şifreyi Güncelle',
    updating: 'Güncelleniyor...',
    backToLogin: 'Girişe Dön',
    success: {
      title: 'Şifre Güncellendi',
      message: 'Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.'
    },
    errors: {
      required: 'Şifre gerekli',
      tooShort: 'Şifre en az 8 karakter olmalı',
      mismatch: 'Şifreler eşleşmiyor',
      invalidSession: 'Geçersiz veya süresi dolmuş sıfırlama bağlantısı. Lütfen yeni bir tane isteyin.',
      generic: 'Bir hata oluştu. Lütfen tekrar deneyin'
    }
  }

  useEffect(() => {
    // Check if user has a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsValidSession(true)
      } else {
        setError(t.errors.invalidSession)
      }
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!password.trim()) {
        setError(t.errors.required)
        setIsLoading(false)
        return
      }

      if (password.length < 8) {
        setError(t.errors.tooShort)
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError(t.errors.mismatch)
        setIsLoading(false)
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        console.error('Update password error:', updateError)
        setError(`${t.errors.generic}: ${updateError.message}`)
        setIsLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error('Update password catch error:', err)
      setError(t.errors.generic)
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-border text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t.success.title}</h2>
              <p className="text-muted-foreground mb-6">{t.success.message}</p>
              <Button
                onClick={() => router.push(`/${locale}/auth`)}
                className="w-full"
              >
                {t.backToLogin}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-background font-bold text-lg">
              OC
            </div>
            <span className="text-2xl font-bold text-foreground">Open Campus</span>
          </Link>
        </div>

        {/* Card */}
        <Card className="border-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {isValidSession ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t.newPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t.updating : t.updateButton}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <Button
                  asChild
                  className="w-full"
                >
                  <Link href={`/${locale}/auth/forgot-password`}>
                    {locale === 'en' ? 'Request New Reset Link' : 'Yeni Sıfırlama Bağlantısı İste'}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2024 Open Campus. All rights reserved.
        </p>
      </div>
    </div>
  )
}
