'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Github, Eye, EyeOff, User, CheckCircle2, Check, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { authTranslations } from '@/lib/translations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface AuthPageProps {
  params: {
    locale: 'en' | 'tr'
  }
}

type TabType = 'login' | 'register'
type RegisterStep = 'plan' | 'details' | 'success'

interface Plan {
  id: string
  name: string
  description: string
  priceUSD: number | null
  interval: string
  aiQuota: string
  seats?: string
  features: string[]
  highlighted?: boolean
  isEnterprise?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free (Community)',
    description: 'Perfect for exploring and learning',
    priceUSD: 0,
    interval: 'monthly',
    aiQuota: '50K tokens/month',
    features: [
      'Public course access',
      'Basic progress tracking',
      'Community support',
      '50k AI tokens/month',
    ],
  },
  {
    id: 'pro',
    name: 'Pro (Individual)',
    description: 'For students and independent educators',
    priceUSD: 12,
    interval: 'monthly',
    aiQuota: '2-5M tokens/month',
    highlighted: true,
    features: [
      'Create unlimited courses',
      '1 private AI Fellow',
      'Basic analytics',
      'Priority queue',
      '2M AI tokens/month',
      'Public publishing',
    ],
  },
  {
    id: 'studio',
    name: 'Studio / Educator',
    description: 'For teachers with small classes',
    priceUSD: 29,
    interval: 'monthly',
    aiQuota: '5-15M tokens/month',
    seats: '20-100 students',
    features: [
      'Class management (100 students)',
      'Quiz & certificates',
      'In-course comments',
      '5 private AI Fellows',
      'Basic integrations',
      '10M AI tokens/month',
    ],
  },
  {
    id: 'team',
    name: 'Team / Org',
    description: 'For departments and bootcamps',
    priceUSD: 6,
    interval: 'per seat/month',
    seats: 'min. 10 seats',
    aiQuota: '50-200M tokens/month',
    features: [
      'Seat-based pricing (min 10)',
      'SSO support',
      'Role & permissions',
      'Shared library',
      'Advanced analytics',
      'Webhooks',
      '100M AI tokens/month',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For universities and large organizations',
    priceUSD: null,
    interval: 'custom',
    aiQuota: 'Custom',
    isEnterprise: true,
    features: [
      'SAML SSO',
      'Private deployment',
      'Data residency',
      'Audit logs',
      '99.9% SLA',
      'Custom model/finetune',
      'Dedicated support',
      'Custom AI quota',
    ],
  },
]

export default function AuthPage({ params: { locale } }: AuthPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const loginT = authTranslations[locale].login
  const registerT = authTranslations[locale].register

  const [activeTab, setActiveTab] = useState<TabType>('login')
  const [registerStep, setRegisterStep] = useState<RegisterStep>('plan')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Selected Plan
  const [selectedPlan, setSelectedPlan] = useState<string>('pro')

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
        // Check if user completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .single()

        if (profile?.onboarding_completed) {
          router.push(`/${locale}/dashboard`)
        } else {
          router.push(`/${locale}/onboard`)
        }
        router.refresh()
      }
    } catch (err) {
      console.error('Login catch error:', err)
      setError(`${loginT.errors.generic}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }

  const handlePlanContinue = () => {
    setRegisterStep('details')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validation
      if (!fullName.trim()) {
        setError(registerT.errors.required)
        setIsLoading(false)
        return
      }

      if (!username.trim()) {
        setError(registerT.errors.required)
        setIsLoading(false)
        return
      }

      if (!registerEmail.trim()) {
        setError(registerT.errors.required)
        setIsLoading(false)
        return
      }

      if (registerPassword.length < 6) {
        setError(registerT.errors.passwordTooShort)
        setIsLoading(false)
        return
      }

      if (registerPassword !== confirmPassword) {
        setError(registerT.errors.passwordMismatch)
        setIsLoading(false)
        return
      }

      if (!agreeToTerms) {
        setError(registerT.errors.acceptTerms)
        setIsLoading(false)
        return
      }

      // Create user with metadata
      // NOTE: Temporarily assigning everyone to 'free' plan
      // Selected plan is stored but not activated until payment integration
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            full_name: fullName,
            username: username,
            selected_plan: selectedPlan, // Store selected plan
            active_plan: 'free', // Everyone starts with free
          },
        },
      })

      if (signUpError) {
        console.error('Sign up error:', signUpError)
        if (signUpError.message.includes('already registered')) {
          setError(registerT.errors.emailTaken)
        } else {
          setError(`${registerT.errors.generic}: ${signUpError.message}`)
        }
        setIsLoading(false)
        return
      }

      if (data.user) {
        setRegisterStep('success')
        setSuccess(true)
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Register catch error:', err)
      setError(`${registerT.errors.generic}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/${locale}/auth/callback`,
        },
      })

      if (error) {
        setError(`${loginT.errors.generic}: ${error.message}`)
      }
    } catch (err) {
      console.error('GitHub login error:', err)
      setError(`${loginT.errors.generic}: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Static Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4 py-12">
        <div className="w-full max-w-6xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href={`/${locale}`} className="flex items-center space-x-2 text-2xl font-bold">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              OC
            </div>
            <span>Open Campus</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-card border border-border rounded-lg p-1">
            <button
              onClick={() => {
                setActiveTab('login')
                setError('')
              }}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'login'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {loginT.title}
            </button>
            <button
              onClick={() => {
                setActiveTab('register')
                setRegisterStep('plan')
                setError('')
              }}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'register'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {registerT.title}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'login' ? (
          <Card className="max-w-md mx-auto bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
            <CardHeader>
              <CardTitle>{loginT.title}</CardTitle>
              <CardDescription>{loginT.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="login-email">{loginT.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder={loginT.emailPlaceholder}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">{loginT.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder={loginT.passwordPlaceholder}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer">
                      {loginT.rememberMe}
                    </label>
                  </div>

                  <Link
                    href={`/${locale}/auth/forgot-password`}
                    className="text-sm text-primary hover:underline"
                  >
                    {loginT.forgotPassword}
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? loginT.signingIn : loginT.signInButton}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">{loginT.orContinueWith}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGithubLogin}
                >
                  <Github className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Continue with GitHub' : 'GitHub ile Devam Et'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Register - Plan Selection */}
            {registerStep === 'plan' && (
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {locale === 'en' ? 'Choose Your Plan' : 'Planınızı Seçin'}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {locale === 'en' 
                      ? 'Start your learning journey with the perfect plan for your needs' 
                      : 'İhtiyaçlarınıza uygun planla öğrenme yolculuğunuza başlayın'}
                  </p>
                </div>

                <div className="relative px-16">
                  <Carousel
                    opts={{
                      align: "center",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {plans.map((plan) => (
                        <CarouselItem key={plan.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                          <Card
                            className={`cursor-pointer transition-all duration-200 relative overflow-hidden h-[580px] flex flex-col bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl ${
                              selectedPlan === plan.id
                                ? 'border-primary ring-2 ring-primary/50'
                                : plan.highlighted
                                ? 'border-primary/30'
                                : 'border-border/50 hover:border-border'
                            }`}
                            onClick={() => setSelectedPlan(plan.id)}
                          >

                            {/* Popular Badge */}
                            {plan.highlighted && (
                              <div className="absolute -top-1 -right-1 z-10">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-primary blur-sm"></div>
                                  <div className="relative bg-primary text-primary-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl rounded-tr-lg shadow-lg">
                                    <Sparkles className="inline h-3 w-3 mr-1 -mt-0.5" />
                                    {locale === 'en' ? 'Popular' : 'Popüler'}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Selected Check Badge */}
                            {selectedPlan === plan.id && (
                              <div className="absolute top-4 left-4 z-10 animate-in zoom-in duration-200">
                                <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg ring-2 ring-primary/20">
                                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                                </div>
                              </div>
                            )}

                            <CardHeader className="pb-6 relative z-[1]">
                              <div className="space-y-1 mb-4">
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="text-sm leading-relaxed">
                                  {plan.description}
                                </CardDescription>
                              </div>
                              
                              {/* Price Display */}
                              <div className="pt-4 border-t border-border/50">
                                {plan.priceUSD === null ? (
                                  <div className="space-y-1 h-[72px] flex flex-col justify-center">
                                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                      {locale === 'en' ? 'Custom' : 'Özel'}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {locale === 'en' ? 'Contact sales' : 'Satış ekibiyle iletişime geçin'}
                                    </p>
                                  </div>
                                ) : plan.priceUSD === 0 ? (
                                  <div className="space-y-1 h-[72px] flex flex-col justify-center">
                                    <div className="text-4xl font-bold">
                                      {locale === 'en' ? 'Free' : 'Ücretsiz'}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {locale === 'en' ? 'Forever' : 'Sonsuza kadar'}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-1 h-[72px] flex flex-col justify-center">
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-5xl font-bold tracking-tight">${plan.priceUSD}</span>
                                      <span className="text-muted-foreground text-base font-medium">/{plan.interval}</span>
                                    </div>
                                    {plan.seats ? (
                                      <p className="text-xs text-muted-foreground font-medium">{plan.seats}</p>
                                    ) : (
                                      <div className="h-[16px]"></div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* AI Quota Badge */}
                              <div className="mt-4">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 py-2 rounded-lg text-xs font-semibold border border-primary/10">
                                  <Sparkles className="h-3.5 w-3.5" />
                                  <span>{plan.aiQuota}</span>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0 pb-6 space-y-4 relative z-[1] flex-1 flex flex-col">
                              {/* Features List */}
                              <div className="space-y-2.5 flex-1">
                                {plan.features.slice(0, 5).map((feature, idx) => (
                                  <div key={idx} className="flex items-start gap-2.5">
                                    <div className="mt-0.5 rounded-full bg-primary/10 p-1 ring-1 ring-primary/20">
                                      <Check className="h-3 w-3 text-primary stroke-[2.5]" />
                                    </div>
                                    <span className="text-sm text-muted-foreground leading-snug">{feature}</span>
                                  </div>
                                ))}
                                {plan.features.length > 5 && (
                                  <div className="pl-7 pt-1">
                                    <span className="text-xs text-muted-foreground font-medium">
                                      +{plan.features.length - 5} {locale === 'en' ? 'more features' : 'özellik daha'}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Action Button */}
                              <div className="pt-2">
                                {selectedPlan === plan.id ? (
                                  <Button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePlanContinue();
                                    }}
                                    className="w-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" 
                                    size="default"
                                  >
                                    {locale === 'en' ? 'Continue' : 'Devam Et'}
                                    <span className="ml-1">→</span>
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    className="w-full group-hover:border-primary/50 transition-colors" 
                                    size="default"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPlan(plan.id);
                                    }}
                                  >
                                    {locale === 'en' ? 'Select Plan' : 'Planı Seç'}
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-14 h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary" />
                    <CarouselNext className="-right-14 h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary" />
                  </Carousel>
                </div>

                {/* Bottom Info */}
                <div className="text-center mt-8 text-sm text-muted-foreground">
                  {locale === 'en' ? 'All plans include 14-day free trial • Cancel anytime' : 'Tüm planlar 14 günlük ücretsiz deneme içerir • İstediğiniz zaman iptal edebilirsiniz'}
                </div>
              </div>
            )}

            {/* Register - User Details */}
            {registerStep === 'details' && (
              <Card className="max-w-md mx-auto bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
                <CardHeader>
                  <CardTitle>{registerT.title}</CardTitle>
                  <CardDescription>
                    {locale === 'en' 
                      ? `Creating account for ${plans.find(p => p.id === selectedPlan)?.name}` 
                      : `${plans.find(p => p.id === selectedPlan)?.name} için hesap oluşturuluyor`}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRegisterStep('plan')}
                    className="mt-2"
                  >
                    ← {locale === 'en' ? 'Change Plan' : 'Planı Değiştir'}
                  </Button>
                  
                  {/* Temporary Free Plan Notice */}
                  {selectedPlan !== 'free' && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex gap-2 text-sm text-amber-600 dark:text-amber-500">
                        <span className="text-lg">⚠️</span>
                        <div>
                          <p className="font-medium">
                            {locale === 'en' ? 'Payment Integration Coming Soon' : 'Ödeme Entegrasyonu Yakında'}
                          </p>
                          <p className="text-xs mt-1 text-muted-foreground">
                            {locale === 'en' 
                              ? `You'll start with the Free plan. We'll notify you when ${plans.find(p => p.id === selectedPlan)?.name} is available.`
                              : `Ücretsiz plan ile başlayacaksınız. ${plans.find(p => p.id === selectedPlan)?.name} hazır olduğunda sizi bilgilendireceğiz.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    {error && (
                      <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="full-name">{registerT.fullName}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="full-name"
                          type="text"
                          placeholder={registerT.fullNamePlaceholder}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">{registerT.username}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          type="text"
                          placeholder={registerT.usernamePlaceholder}
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">{registerT.email}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder={registerT.emailPlaceholder}
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">{registerT.password}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type={showRegisterPassword ? 'text' : 'password'}
                          placeholder={registerT.passwordPlaceholder}
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">{registerT.confirmPassword}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder={registerT.confirmPasswordPlaceholder}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="agree-terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="h-4 w-4 rounded border-border mt-1"
                        required
                      />
                      <label htmlFor="agree-terms" className="text-sm text-muted-foreground cursor-pointer">
                        {registerT.agreeToTerms}
                      </label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? registerT.creatingAccount : registerT.createAccountButton}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Register - Success */}
            {registerStep === 'success' && (
              <Card className="max-w-md mx-auto bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border-border/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold">{registerT.success.title}</h3>
                    <p className="text-muted-foreground">{registerT.success.message}</p>
                    
                    {/* Plan Info */}
                    {selectedPlan !== 'free' && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                        <p className="text-sm font-medium mb-2">
                          {locale === 'en' ? 'Your Selected Plan' : 'Seçtiğiniz Plan'}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {plans.find(p => p.id === selectedPlan)?.name}
                        </p>
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span>💡</span>
                          <p>
                            {locale === 'en' 
                              ? 'You currently have access to the Free plan. We\'ll send you an email when payment integration is ready to upgrade.'
                              : 'Şu anda Ücretsiz plana erişiminiz var. Ödeme entegrasyonu hazır olduğunda yükseltme için e-posta göndereceğiz.'}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <Button onClick={() => router.push(`/${locale}/onboard`)} className="w-full">
                      {locale === 'en' ? 'Complete Profile Setup' : 'Profil Kurulumunu Tamamla'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  )
}
