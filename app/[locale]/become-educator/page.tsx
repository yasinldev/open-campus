import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  Trophy, 
  Rocket,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Award,
  TrendingUp,
  BookOpen,
  Heart
} from 'lucide-react';

export default async function BecomeEducatorPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const isEnglish = locale === 'en';

  const benefits = [
    {
      icon: Trophy,
      title: isEnglish ? 'Share Your Expertise' : 'Uzmanlığınızı Paylaşın',
      description: isEnglish 
        ? 'Transform your knowledge into structured courses and help thousands of students learn'
        : 'Bilginizi yapılandırılmış kurslara dönüştürün ve binlerce öğrenciye öğretmenize yardımcı olun',
    },
    {
      icon: Users,
      title: isEnglish ? 'Global Impact' : 'Küresel Etki',
      description: isEnglish
        ? 'Reach students from around the world and make a lasting impact on their careers'
        : 'Dünyanın her yerinden öğrencilere ulaşın ve kariyerlerinde kalıcı bir etki bırakın',
    },
    {
      icon: TrendingUp,
      title: isEnglish ? 'Flexible Income' : 'Esnek Gelir',
      description: isEnglish
        ? 'Earn from your courses while maintaining the flexibility to work on your own schedule'
        : 'Kendi programınıza göre çalışırken kurslarınızdan kazanç elde edin',
    },
    {
      icon: BookOpen,
      title: isEnglish ? 'Professional Growth' : 'Profesyonel Gelişim',
      description: isEnglish
        ? 'Enhance your teaching skills and build your reputation as an industry expert'
        : 'Öğretim becerilerinizi geliştirin ve sektör uzmanı olarak itibarınızı oluşturun',
    },
    {
      icon: Heart,
      title: isEnglish ? 'Supportive Community' : 'Destekleyici Topluluk',
      description: isEnglish
        ? 'Join a community of passionate educators and collaborate on new teaching methods'
        : 'Tutkulu eğitimcilerden oluşan bir topluluğa katılın ve yeni öğretim yöntemleri üzerine işbirliği yapın',
    },
    {
      icon: Award,
      title: isEnglish ? 'Recognition & Rewards' : 'Tanınma ve Ödüller',
      description: isEnglish
        ? 'Get recognized for your contributions and unlock special perks as you grow'
        : 'Katkılarınız için takdir edilin ve büyüdükçe özel avantajların kilidini açın',
    },
  ];

  const steps = [
    {
      number: 1,
      title: isEnglish ? 'Identity Verification' : 'Kimlik Doğrulama',
      description: isEnglish
        ? 'Complete KYC verification and confirm your email and phone'
        : 'KYC doğrulamasını tamamlayın ve e-postanızı ve telefonunuzu onaylayın',
      duration: isEnglish ? '5-10 minutes' : '5-10 dakika',
    },
    {
      number: 2,
      title: isEnglish ? 'Competency Assessment' : 'Yeterlilik Değerlendirmesi',
      description: isEnglish
        ? 'Upload credentials (diploma, portfolio, GitHub) and optionally take an exam'
        : 'Kimlik belgelerini yükleyin (diploma, portföy, GitHub) ve isteğe bağlı olarak sınava girin',
      duration: isEnglish ? '15-30 minutes' : '15-30 dakika',
    },
    {
      number: 3,
      title: isEnglish ? 'Teaching Demo' : 'Öğretim Demosu',
      description: isEnglish
        ? 'Record a 10-15 minute demo video and submit a lesson plan'
        : '10-15 dakikalık bir demo videosu kaydedin ve bir ders planı gönderin',
      duration: isEnglish ? '2-4 hours' : '2-4 saat',
    },
    {
      number: 4,
      title: isEnglish ? 'Peer Review' : 'Akran İncelemesi',
      description: isEnglish
        ? 'Expert educators will review your submission based on quality rubrics'
        : 'Uzman eğitimciler, gönderiminizi kalite kriterleriyle inceler',
      duration: isEnglish ? '3-5 days' : '3-5 gün',
    },
    {
      number: 5,
      title: isEnglish ? 'Beta Course' : 'Beta Kursu',
      description: isEnglish
        ? 'Run a pilot course with 30-100 students to prove your teaching ability'
        : 'Öğretim yeteneğinizi kanıtlamak için 30-100 öğrenciyle bir pilot kurs çalıştırın',
      duration: isEnglish ? '2-4 weeks' : '2-4 hafta',
    },
    {
      number: 6,
      title: isEnglish ? 'Fellow Status' : 'Fellow Statüsü',
      description: isEnglish
        ? 'Pass the pilot and become an official Open Campus Fellow educator!'
        : 'Pilotu geçin ve resmi bir Open Campus Fellow eğitmeni olun!',
      duration: isEnglish ? 'Immediate' : 'Anında',
    },
  ];

  const requirements = [
    isEnglish ? 'Expertise in your field (academic or professional)' : 'Alanınızda uzmanlık (akademik veya profesyonel)',
    isEnglish ? 'At least 2 proof documents (diploma, portfolio, publications, etc.)' : 'En az 2 kanıt belgesi (diploma, portföy, yayınlar, vb.)',
    isEnglish ? 'Passion for teaching and helping students succeed' : 'Öğretme tutkusu ve öğrencilerin başarılı olmasına yardımcı olma',
    isEnglish ? 'Commitment to quality education' : 'Kaliteli eğitime bağlılık',
    isEnglish ? 'Good communication skills' : 'İyi iletişim becerileri',
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: isEnglish ? 'AI Faculty' : 'AI Faculty',
      avatar: '👩‍🏫',
      quote: isEnglish
        ? 'Joining Open Campus was the best decision for my career. I\'ve taught over 5,000 students and built a community I\'m proud of.'
        : 'Open Campus\'a katılmak kariyerim için en iyi karardı. 5.000\'den fazla öğrenciye ders verdim ve gurur duyduğum bir topluluk oluşturdum.',
      stats: { students: '5,234', rating: '4.9', courses: '8' },
    },
    {
      name: 'Prof. Michael Rodriguez',
      role: isEnglish ? 'Math Fellow' : 'Math Fellow',
      avatar: '👨‍🏫',
      quote: isEnglish
        ? 'The verification process was thorough but fair. It shows that Open Campus truly cares about education quality.'
        : 'Doğrulama süreci kapsamlıydı ama adaletliydi. Open Campus\'ın eğitim kalitesini gerçekten önemsediğini gösteriyor.',
      stats: { students: '3,892', rating: '4.8', courses: '5' },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/20">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        
        <div className="container relative mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 rounded-full px-4 py-1.5" variant="outline">
              <Rocket className="mr-2 h-3.5 w-3.5" />
              {isEnglish ? 'Join Our Educator Community' : 'Eğitimci Topluluğumuza Katılın'}
            </Badge>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {isEnglish ? 'Become an ' : 'Bir '}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                {isEnglish ? 'Open Campus' : 'Open Campus'}
              </span>
              <br />
              {isEnglish ? 'Educator' : 'Eğitmeni Olun'}
            </h1>
            
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              {isEnglish
                ? 'Share your knowledge with thousands of students worldwide. We welcome both traditionally educated experts and self-taught professionals.'
                : 'Bilginizi dünya çapında binlerce öğrenciyle paylaşın. Hem geleneksel olarak eğitilmiş uzmanları hem de kendi kendini yetiştirmiş profesyonelleri memnuniyetle karşılıyoruz.'}
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href={`/${locale}/apply-faculty`}>
                  {isEnglish ? 'Start Application' : 'Başvuruya Başla'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="#requirements">
                  {isEnglish ? 'View Requirements' : 'Gereksinimleri Gör'}
                </Link>
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">250+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{isEnglish ? 'Active Educators' : 'Aktif Eğitmen'}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">50K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{isEnglish ? 'Students Taught' : 'Öğretilen Öğrenci'}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">4.8</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{isEnglish ? 'Avg Rating' : 'Ortalama Puan'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              {isEnglish ? 'Why Become an Educator?' : 'Neden Eğitmen Olmalısınız?'}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              {isEnglish
                ? 'Join a platform that values quality education and supports its educators'
                : 'Kaliteli eğitime değer veren ve eğitmenlerini destekleyen bir platforma katılın'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              {isEnglish ? 'Application Process' : 'Başvuru Süreci'}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              {isEnglish
                ? 'A transparent, fair, and comprehensive verification process'
                : 'Şeffaf, adil ve kapsamlı bir doğrulama süreci'}
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-6">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg sm:text-xl font-bold">
                      {step.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-base sm:text-xl font-semibold text-foreground">{step.title}</h3>
                        <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs sm:text-sm">{step.duration}</span>
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section id="requirements" className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
                  {isEnglish ? 'Requirements' : 'Gereksinimler'}
                </CardTitle>
                <CardDescription>
                  {isEnglish
                    ? 'What you need to become an Open Campus educator'
                    : 'Open Campus eğitmeni olmak için neye ihtiyacınız var'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{req}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {isEnglish ? 'Success Stories' : 'Başarı Hikayeleri'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {isEnglish
                ? 'Hear from educators who are making an impact'
                : 'Etki yaratan eğitmenlerden dinleyin'}
            </p>
          </div>

          <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="text-5xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <p className="mb-6 text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  
                  <div className="flex gap-6 text-sm">
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.stats.students}</div>
                      <div className="text-muted-foreground">{isEnglish ? 'Students' : 'Öğrenci'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        {testimonial.stats.rating}
                      </div>
                      <div className="text-muted-foreground">{isEnglish ? 'Rating' : 'Puan'}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.stats.courses}</div>
                      <div className="text-muted-foreground">{isEnglish ? 'Courses' : 'Kurs'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <GraduationCap className="mx-auto mb-6 h-16 w-16 text-primary" />
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {isEnglish ? 'Ready to Get Started?' : 'Başlamaya Hazır Mısınız?'}
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {isEnglish
                ? 'Join Open Campus today and start making a difference in students\' lives'
                : 'Bugün Open Campus\'a katılın ve öğrencilerin hayatlarında fark yaratmaya başlayın'}
            </p>
            <Button size="lg" asChild>
              <Link href={`/${locale}/apply-faculty`}>
                {isEnglish ? 'Start Your Application' : 'Başvurunuza Başlayın'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

