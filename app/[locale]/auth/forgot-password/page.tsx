'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ForgotPasswordPageProps {
  params: {
    locale: 'en' | 'tr'
  }
}

export default function ForgotPasswordPage({ params: { locale } }: ForgotPasswordPageProps) {
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const t = locale === 'en' ? {
    title: 'Forgot Password',
    subtitle: 'Enter your email and we\'ll send you a reset link',
    email: 'Email Address',
    emailPlaceholder: 'your.email@example.com',
    sendLink: 'Send Reset Link',
    sending: 'Sending...',
    backToLogin: 'Back to Login',
    success: {
      title: 'Check Your Email',
      message: 'We\'ve sent a password reset link to your email address. Please check your inbox and follow the instructions.'
    },
    errors: {
      required: 'Email is required',
      invalidEmail: 'Please enter a valid email address',
      generic: 'An error occurred. Please try again'
    }
  } : {
    title: 'Şifremi Unuttum',
    subtitle: 'E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim',
    email: 'E-posta Adresi',
    emailPlaceholder: 'ornek@email.com',
    sendLink: 'Sıfırlama Bağlantısı Gönder',
    sending: 'Gönderiliyor...',
    backToLogin: 'Girişe Dön',
    success: {
      title: 'E-postanızı Kontrol Edin',
      message: 'E-posta adresinize şifre sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin ve talimatları izleyin.'
    },
    errors: {
      required: 'E-posta gerekli',
      invalidEmail: 'Geçerli bir e-posta adresi girin',
      generic: 'Bir hata oluştu. Lütfen tekrar deneyin'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!email.trim()) {
        setError(t.errors.required)
        setIsLoading(false)
        return
      }

      // Supabase automatically sends the email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/auth/update-password`,
      })

      if (resetError) {
        console.error('Password reset error:', resetError)
        setError(`${t.errors.generic}: ${resetError.message}`)
        setIsLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error('Forgot password error:', err)
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
                asChild
                className="w-full"
              >
                <Link href={`/${locale}/auth`}>
                  {t.backToLogin}
                </Link>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t.sending : t.sendLink}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href={`/${locale}/auth`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.backToLogin}
              </Link>
            </div>
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
