'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Github, Eye, EyeOff, User, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { authTranslations } from '@/lib/translations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthPageProps {
  params: {
    locale: 'en' | 'tr'
  }
}

type TabType = 'login' | 'register'

export default function AuthPage({ params: { locale } }: AuthPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const loginT = authTranslations[locale].login
  const registerT = authTranslations[locale].register

  const [activeTab, setActiveTab] = useState<TabType>('login')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Login States
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Register States
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (signInError) {
        console.error('Login error:', signInError)
        if (signInError.message.includes('Invalid login credentials')) {
          setError(loginT.errors.invalidCredentials)
        } else if (signInError.message.includes('Email not confirmed')) {
          setError(locale === 'en' ? 'Please verify your email first' : 'Lütfen önce e-postanızı doğrulayın')
        } else {
          setError(`${loginT.errors.generic}: ${signInError.message}`)
        }
        setIsLoading(false)
        return
      }

      if (data.session) {
        router.push(`/${locale}`)
        router.refresh()
      }
    } catch (err) {
      console.error('Login catch error:', err)
      setError(`${loginT.errors.generic}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validation
      if (!fullName.trim()) {
        setError(registerT.errors.required)
        return
      }

      if (!username.trim()) {
        setError(registerT.errors.required)
        return
      }

      if (username.length < 3) {
        setError(locale === 'en' ? 'Username must be at least 3 characters' : 'Kullanıcı adı en az 3 karakter olmalı')
        return
      }

      if (registerPassword.length < 8) {
        setError(registerT.errors.passwordTooShort)
        return
      }

      if (registerPassword !== confirmPassword) {
        setError(registerT.errors.passwordMismatch)
        return
      }

      if (!agreeToTerms) {
        setError(registerT.errors.acceptTerms)
        return
      }

      // Sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            full_name: fullName,
            username: username,
          },
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      })

      if (signUpError) {
        console.error('Register error:', signUpError)
        if (signUpError.message.includes('already registered')) {
          setError(registerT.errors.emailTaken)
        } else {
          setError(`${registerT.errors.generic}: ${signUpError.message}`)
        }
        setIsLoading(false)
        return
      }

      if (data) {
        console.log('Registration successful:', data)
        setSuccess(true)
      }
    } catch (err) {
      console.error('Register catch error:', err)
      setError(`${registerT.errors.generic}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }

  const handleGithubAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback`,
      },
    })
    
    if (error) {
      setError(loginT.errors.generic)
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
              <h2 className="text-2xl font-bold mb-2">{registerT.success.title}</h2>
              <p className="text-muted-foreground mb-6">{registerT.success.message}</p>
              <Button
                onClick={() => {
                  setSuccess(false)
                  setActiveTab('login')
                }}
                className="w-full"
              >
                {locale === 'en' ? 'Go to Login' : 'Giriş Sayfasına Git'}
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
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => {
                setActiveTab('login')
                setError('')
              }}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'login'
                  ? 'text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {loginT.title}
            </button>
            <button
              onClick={() => {
                setActiveTab('register')
                setError('')
              }}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'register'
                  ? 'text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {registerT.title}
            </button>
          </div>

          <CardContent className="pt-6 pb-6">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/50 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Login Tab */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{loginT.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={loginT.emailPlaceholder}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">{loginT.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={loginT.passwordPlaceholder}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                    <label htmlFor="remember-me" className="text-muted-foreground cursor-pointer select-none">
                      {loginT.rememberMe}
                    </label>
                  </div>
                  <Link
                    href={`/${locale}/auth/forgot-password`}
                    className="text-primary hover:underline"
                  >
                    {loginT.forgotPassword}
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? loginT.signingIn : loginT.signInButton}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {loginT.orContinueWith}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGithubAuth}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </form>
            )}

            {/* Register Tab */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{registerT.fullName}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={registerT.fullNamePlaceholder}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">{registerT.username}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder={registerT.usernamePlaceholder}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">{registerT.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="register-email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder={registerT.emailPlaceholder}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">{registerT.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder={registerT.passwordPlaceholder}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{registerT.confirmPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={registerT.confirmPasswordPlaceholder}
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

                <div className="flex items-start space-x-2 text-sm pt-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <label htmlFor="terms" className="text-muted-foreground cursor-pointer select-none">
                    {registerT.agreeToTerms}{' '}
                    <Link href={`/${locale}/legal/terms`} className="text-primary hover:underline">
                      {registerT.termsOfService}
                    </Link>{' '}
                    {registerT.and}{' '}
                    <Link href={`/${locale}/legal/privacy`} className="text-primary hover:underline">
                      {registerT.privacyPolicy}
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? registerT.creatingAccount : registerT.createAccountButton}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {registerT.orContinueWith}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGithubAuth}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </form>
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
