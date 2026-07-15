'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Brain,
  Calculator,
  Code,
  Sparkles,
  Zap,
  ChevronLeft,
  Menu,
  Bot,
  User,
  Send,
  X,
  type LucideIcon,
} from 'lucide-react';

type Fellow = {
  id: string;
  name: string;
  nameTr: string;
  expertise: string;
  expertiseTr: string;
  avatar: string;
  icon: LucideIcon;
  accent: {
    iconBg: string;
    iconBorder: string;
    iconText: string;
    badge: string;
  };
};

type ConversationPreview = {
  id: string;
  title: string;
  fellowId: string;
  timestamp: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const FELLOWS: Fellow[] = [
  {
    id: 'ai',
    name: 'AI Fellow',
    nameTr: 'AI Arkadaşı',
    expertise: 'Machine Learning, Deep Learning, Neural Networks',
    expertiseTr: 'Makine Öğrenmesi, Derin Öğrenme, Sinir Ağları',
    avatar: '🤖',
    icon: Brain,
    accent: {
      iconBg: 'bg-sky-500/10',
      iconBorder: 'border-sky-500/30',
      iconText: 'text-sky-600',
      badge: 'border-sky-500/40 text-sky-600',
    },
  },
  {
    id: 'math',
    name: 'Math Fellow',
    nameTr: 'Matematik Arkadaşı',
    expertise: 'Calculus, Linear Algebra, Statistics',
    expertiseTr: 'Kalkülüs, Lineer Cebir, İstatistik',
    avatar: '📐',
    icon: Calculator,
    accent: {
      iconBg: 'bg-emerald-500/10',
      iconBorder: 'border-emerald-500/30',
      iconText: 'text-emerald-600',
      badge: 'border-emerald-500/40 text-emerald-600',
    },
  },
  {
    id: 'logic',
    name: 'Logic Fellow',
    nameTr: 'Mantık Arkadaşı',
    expertise: 'Computer Science, Algorithms, Programming',
    expertiseTr: 'Bilgisayar Bilimi, Algoritmalar, Programlama',
    avatar: '💡',
    icon: Code,
    accent: {
      iconBg: 'bg-amber-500/10',
      iconBorder: 'border-amber-500/30',
      iconText: 'text-amber-600',
      badge: 'border-amber-500/40 text-amber-600',
    },
  },
];

const MOCK_CONVERSATIONS: ConversationPreview[] = [
  { id: '1', title: 'Intro to Machine Learning', fellowId: 'ai', timestamp: '2h ago' },
  { id: '2', title: 'Linear Algebra Basics', fellowId: 'math', timestamp: '1d ago' },
  { id: '3', title: 'Sorting Algorithms', fellowId: 'logic', timestamp: '3d ago' },
];

const QUICK_PROMPTS = [
  { icon: '💡', textEn: 'Explain this concept simply', textTr: 'Bu konsepti basitçe açıkla' },
  { icon: '✏️', textEn: 'Give me practice problems', textTr: 'Bana pratik problemler ver' },
  { icon: '🔍', textEn: 'Help me debug my code', textTr: 'Kodumu hata ayıklamada yardımcı ol' },
  { icon: '📚', textEn: 'Recommend learning resources', textTr: 'Öğrenme kaynakları öner' },
];

const INTRO_STEPS = [
  {
    icon: Brain,
    title: {
      en: 'Switch between fellows',
      tr: 'Arkadaşlar arasında geçiş yap',
    },
    body: {
      en: 'Each fellow is tuned for a different learning style. Swap whenever you need a new angle or deeper theory.',
      tr: 'Her arkadaş farklı bir öğrenme tarzına göre ayarlanmıştır. Yeni bir bakış açısı ya da daha derin teori gerektiğinde geçiş yap.',
    },
    chips: {
      en: ['AI Fellow · Fast recaps', 'Math Fellow · Proof support'],
      tr: ['AI Arkadaşı · Hızlı özet', 'Matematik Arkadaşı · İspat desteği'],
    },
    conversationTitle: {
      en: 'Watch the fellows collaborate',
      tr: 'Arkadaşların birlikte çalışmasına bak',
    },
    conversation: [
      {
        role: 'user',
        en: 'I have 20 minutes before the exam. Which fellow should I talk to?',
        tr: 'Sınavdan önce 20 dakikam var. Hangi arkadaşla konuşmalıyım?',
        delay: 0,
      },
      {
        role: 'assistant',
        en: 'Start with AI Fellow for a big-picture recap, then pass the conversation to Math Fellow for proofs.',
        tr: 'Önce genel hatlar için AI Arkadaşıyla başla, sonra ispatlar için Matematik Arkadaşına devret.',
        delay: 150,
      },
      {
        role: 'user',
        en: 'Can you hand the thread over to Logic Fellow when I’m ready for code examples?',
        tr: 'Kod örneklerine hazır olduğumda sohbeti Mantık Arkadaşına devredebilir misin?',
        delay: 300,
      },
      {
        role: 'assistant-typing',
        en: '',
        tr: '',
        delay: 450,
      },
      {
        role: 'assistant',
        en: 'Absolutely. I’ll keep the context so Logic Fellow can jump straight into algorithm walk-throughs.',
        tr: 'Elbette. Bağlamı koruyorum; Mantık Arkadaşı doğrudan algoritma anlatımına geçer.',
        delay: 900,
      },
    ],
    spotlights: [
      {
        accent: 'border-sky-500/40 bg-sky-500/10 text-sky-700',
        title: {
          en: 'AI Fellow · Fast recaps',
          tr: 'AI Arkadaşı · Hızlı özet',
        },
        body: {
          en: 'Turns lectures into concise bullet points and remembers your last session.',
          tr: 'Dersleri kısa maddelere dönüştürür ve son oturumunu hatırlar.',
        },
      },
      {
        accent: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700',
        title: {
          en: 'Math Fellow · Proof partner',
          tr: 'Matematik Arkadaşı · İspat ortağı',
        },
        body: {
          en: 'Checks your derivations line by line and suggests alternative approaches.',
          tr: 'Türetmelerini satır satır kontrol eder ve alternatif yaklaşımlar önerir.',
        },
      },
      {
        accent: 'border-amber-500/40 bg-amber-500/10 text-amber-700',
        title: {
          en: 'Logic Fellow · Code companion',
          tr: 'Mantık Arkadaşı · Kod yoldaşı',
        },
        body: {
          en: 'Links theory with runnable snippets and debugging tips.',
          tr: 'Teoriyi çalıştırılabilir kod parçaları ve hata ayıklama ipuçlarıyla birleştirir.',
        },
      },
    ],
    bullets: {
      en: [
        'Open the sidebar to pick the fellow that fits the current hurdle.',
        'Swap mid-conversation—context is retained so you never repeat yourself.',
      ],
      tr: [
        'Mevcut engeline uyan arkadaşı seçmek için yan paneli aç.',
        'Sohbet ortasında değiştir—bağlam korunur, kendini tekrar etmezsin.',
      ],
    },
    note: {
      en: 'Tip: fellows remember which course you came from, so mention the lesson title for sharper help.',
      tr: 'İpucu: arkadaşlar hangi dersten geldiğini hatırlar, ders adını belirtirsen daha net yardım alırsın.',
    },
  },
  {
    icon: Sparkles,
    title: {
      en: 'Kickstart with quick prompts',
      tr: 'Hızlı istemlerle başlat',
    },
    body: {
      en: 'Short on time? Tap a prompt to get instant structure and follow-up suggestions.',
      tr: 'Zamanın kısıtlı mı? Bir isteme dokun ve anında yapı ile takip önerileri al.',
    },
    chips: {
      en: ['Concept checkpoint', 'Debug request'],
      tr: ['Kavram kontrolü', 'Hata ayıklama isteği'],
    },
    conversationTitle: {
      en: 'Prompts in motion',
      tr: 'İstemler işbaşında',
    },
    conversation: [
      {
        role: 'user',
        en: 'Give me three spaced-repetition questions about eigenvalues.',
        tr: 'Eigenvalue konusunda üç tekrar eden soru hazırlar mısın?',
        delay: 0,
      },
      {
        role: 'assistant',
        en: 'Absolutely! Question 1 (1-day interval): “What does the determinant tell you about eigenvalues?”',
        tr: 'Elbette! Soru 1 (1 günlük aralık): “Determinant sana eigenvalue hakkında ne söyler?”',
        delay: 200,
      },
      {
        role: 'assistant',
        en: 'Question 2 (3-day interval): “How do eigenvectors behave when eigenvalues are repeated?”',
        tr: 'Soru 2 (3 günlük aralık): “Eigenvalue tekrarlandığında eigenvector nasıl davranır?”',
        delay: 400,
      },
      {
        role: 'assistant-typing',
        en: '',
        tr: '',
        delay: 550,
      },
      {
        role: 'assistant',
        en: 'Question 3 (7-day interval): “Connect geometric multiplicity to diagonalisation.” Want hints with answers?',
        tr: 'Soru 3 (7 günlük aralık): “Geometrik çokluğu diagonalizasyonla ilişkilendir.” İpuçları da ister misin?',
        delay: 900,
      },
      {
        role: 'user',
        en: 'Yes please, and add them to my notes.',
        tr: 'Evet lütfen, notlarıma da ekle.',
        delay: 1150,
      },
      {
        role: 'assistant',
        en: 'Done! I also scheduled a reminder so you’ll revisit these questions automatically.',
        tr: 'Tamamdır! Bu soruları otomatik tekrar etmek için hatırlatıcı da ekledim.',
        delay: 1350,
      },
    ],
    spotlights: [
      {
        accent: 'border-violet-500/40 bg-violet-500/10 text-violet-700',
        title: {
          en: 'Concept check prompts',
          tr: 'Kavram kontrol istemleri',
        },
        body: {
          en: 'Request analogies, bridges to prior knowledge, or “explain like I’m 12” rewrites.',
          tr: 'Benzerlik, önceki bilgiye köprü veya “12 yaşındaymışım gibi anlat” yeniden yazımları iste.',
        },
      },
      {
        accent: 'border-sky-500/40 bg-sky-500/10 text-sky-700',
        title: {
          en: 'Practice loops',
          tr: 'Pratik döngüleri',
        },
        body: {
          en: 'Generate spaced repetition drills with reminders and optional hints.',
          tr: 'Hatırlatıcı ve isteğe bağlı ipuçlarıyla aralıklı tekrar pratikleri oluştur.',
        },
      },
      {
        accent: 'border-rose-500/40 bg-rose-500/10 text-rose-700',
        title: {
          en: 'Debug helpers',
          tr: 'Hata ayıklama yardımcıları',
        },
        body: {
          en: 'Share code + failing output to get “spot the bug” guided questions.',
          tr: 'Kodu ve hatalı çıktıyı paylaşarak “hata nerede” sorularıyla yönlendirme al.',
        },
      },
    ],
    bullets: {
      en: [
        'Prompts adapt to your locale—edit text before sending if you prefer.',
        'Stack multiple prompts in one message to build a personalised study playlist.',
      ],
      tr: [
        'İstemler diline uyum sağlar—göndermeden önce metni düzenleyebilirsin.',
        'Tek mesajda birden çok istemi birleştirerek kişisel çalışma listesi oluştur.',
      ],
    },
    note: {
      en: 'Hint: long-press a prompt on mobile to copy it for later or pin it to your notes.',
      tr: 'İpucu: mobilde bir isteme uzun basarak kopyalayıp notlarına sabitleyebilirsin.',
    },
  },
  {
    icon: Code,
    title: {
      en: 'Stay in flow',
      tr: 'Akışta kal',
    },
    body: {
      en: 'Move from concept to practice without switching tools—fellows review code, maths, or notes in one place.',
      tr: 'Araç değiştirmeden kavramdan uygulamaya geç—arkadaşlar kodu, matematiği veya notları tek yerde inceleyebilir.',
    },
    chips: {
      en: ['Live feedback', 'Shared notes'],
      tr: ['Anlık geri bildirim', 'Paylaşılan notlar'],
    },
    conversationTitle: {
      en: 'From plan to execution',
      tr: 'Plandan uygulamaya',
    },
    conversation: [
      {
        role: 'user',
        en: 'Here’s my quicksort implementation—why is it timing out?',
        tr: 'İşte quicksort uygulamam—neden zaman aşımına uğruyor?',
        delay: 0,
      },
      {
        role: 'assistant',
        en: 'Your pivot always picks the first element. Shall I switch it to a random pivot and annotate the code?',
        tr: 'Pivot her zaman ilk elemanı seçiyor. Rastgele pivota geçirip kodu açıklamamı ister misin?',
        delay: 180,
      },
      {
        role: 'user',
        en: 'Yes, and add a quick note for future me.',
        tr: 'Evet, ayrıca gelecekteki ben için not ekle.',
        delay: 360,
      },
      {
        role: 'assistant-typing',
        en: '',
        tr: '',
        delay: 520,
      },
      {
        role: 'assistant',
        en: 'Patched! I added “randomPivot” plus a reminder to analyse worst-case input. Want Math Fellow to sanity-check complexity?',
        tr: 'Yamalandı! “randomPivot” ekledim ve en kötü giriş analizi için not bıraktım. Karmaşıklığı kontrol etmesi için Matematik Arkadaşını çağırayım mı?',
        delay: 900,
      },
      {
        role: 'user',
        en: 'Please loop them in.',
        tr: 'Lütfen onu da dahil et.',
        delay: 1100,
      },
      {
        role: 'assistant',
        en: 'Done. You now have a shared note with both code and complexity breakdown.',
        tr: 'Tamam. Kod ve karmaşıklık analizini içeren ortak bir notun var.',
        delay: 1300,
      },
    ],
    spotlights: [
      {
        accent: 'border-amber-500/40 bg-amber-500/10 text-amber-700',
        title: {
          en: 'Capture outcomes',
          tr: 'Çıktıları kaydet',
        },
        body: {
          en: 'Every recommendation can be pushed to your notes for later review.',
          tr: 'Her öneriyi daha sonra gözden geçirmek için notlarınıza atabilirsiniz.',
        },
      },
      {
        accent: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700',
        title: {
          en: 'Bring others in',
          tr: 'Başkalarını çağır',
        },
        body: {
          en: 'Loop another fellow mid-thread; context carries over without repeating yourself.',
          tr: 'Sohbet ortasında başka bir arkadaşı davet et; bağlam korunur, anlattıklarını tekrar etmezsin.',
        },
      },
      {
        accent: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-700',
        title: {
          en: 'See the history',
          tr: 'Geçmişi gör',
        },
        body: {
          en: 'Scroll back through the shared timeline to understand every adjustment.',
          tr: 'Yapılan her ayarlamayı görmek için paylaşılan zaman çizelgesinde geri gez.',
        },
      },
    ],
    bullets: {
      en: [
        'Attach context (lesson, repo, or notebook) so fellows respond faster.',
        'Toggle between fellows mid-thread without losing the conversation.',
      ],
      tr: [
        'Bağlam (ders, repo veya not) ekleyerek arkadaşların daha hızlı yanıt vermesini sağla.',
        'Konuşmayı kaybetmeden sohbet ortasında arkadaş değiştirebilirsin.',
      ],
    },
    note: {
      en: 'Remember: everything is saved locally until you clear it, so feel free to experiment.',
      tr: 'Unutma: her şey temizleyene kadar yerelde saklanır, istediğin kadar deneme yapabilirsin.',
    },
  },
];

export default function DashboardFellowsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) ?? 'en';
  const isEnglish = locale === 'en';

  const [selectedFellow, setSelectedFellow] = useState<string>(FELLOWS[0]?.id ?? '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [visibleConversationIndexes, setVisibleConversationIndexes] = useState<number[]>([]);
  const INTRO_CONVERSATION_SLOWDOWN = 2.4;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentFellow = useMemo(
    () => FELLOWS.find((fellow) => fellow.id === selectedFellow) ?? FELLOWS[0],
    [selectedFellow],
  );

  const CurrentFellowIcon = currentFellow.icon;

  const localizedFellowName = isEnglish ? currentFellow.name : currentFellow.nameTr;
  const localizedExpertise = isEnglish ? currentFellow.expertise : currentFellow.expertiseTr;

  const quickPromptItems = useMemo(
    () =>
      QUICK_PROMPTS.map((prompt) => ({
        key: prompt.textEn,
        label: isEnglish ? prompt.textEn : prompt.textTr,
        icon: prompt.icon,
      })),
    [isEnglish],
  );

  const introSlides = useMemo(
    () =>
      INTRO_STEPS.flatMap((step, stepIndex) => {
        const spotlightsCount = step.spotlights?.length ?? 0;
        const bulletCountEn = step.bullets?.en?.length ?? 0;
        const bulletCountTr = step.bullets?.tr?.length ?? 0;
        const hasNote = Boolean(step.note?.en || step.note?.tr);
        const hasDetails = spotlightsCount > 0 || bulletCountEn > 0 || bulletCountTr > 0 || hasNote;

        const slides = [{ stepIndex, view: 'conversation' } as const];
        if (hasDetails) {
          slides.push({ stepIndex, view: 'details' } as const);
        }
        return slides;
      }),
    [],
  );
  const totalIntroSlides = introSlides.length;

  const focusTextarea = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, []);

  const handlePromptClick = useCallback(
    (promptText: string) => {
      setInput(promptText);
      focusTextarea();
    },
    [focusTextarea],
  );

  const scheduleAssistantResponse = useCallback(() => {
    const responses = [
      isEnglish
        ? 'That is a thoughtful question. The key is to link this back to the foundations we covered earlier—shall we walk through it together?'
        : 'Bu gerçekten güzel bir soru. Bunu daha önce ele aldığımız temellere bağlamak önemli—istersen birlikte adım adım ilerleyelim.',
      isEnglish
        ? 'Let’s break it down:\n\n1. Start from the definition\n2. Check how it behaves in practice\n3. Try a quick example to cement it\n\nWould you like more detail on any step?'
        : 'Bunu parçalayalım:\n\n1. Tanımdan başlayalım\n2. Pratikte nasıl davrandığına bakalım\n3. Küçük bir örnek ile pekiştirelim\n\nHerhangi bir adımı daha detaylı anlatmamı ister misin?',
      isEnglish
        ? 'Great! Think of this like stacking blocks—each concept supports the next. I can share an analogy if that helps.'
        : 'Harika! Bunu üst üste dizilen bloklar gibi düşün—her konsept bir sonrakini destekler. İşe yararsa benzetme de paylaşabilirim.',
    ];

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      typingTimeoutRef.current = null;
    }, 1100);
  }, [isEnglish]);

  const dispatchUserMessage = useCallback(
    (rawText: string) => {
      const text = rawText.trim();
      if (!text) return;

      const userMessage: ChatMessage = {
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      scheduleAssistantResponse();
    },
    [scheduleAssistantResponse],
  );

  const handleSendMessage = useCallback(
    (messageText?: string) => {
      const text = (messageText ?? input).trim();
      if (!text || isTyping) return;
      setInput('');
      dispatchUserMessage(text);
    },
    [dispatchUserMessage, input, isTyping],
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSendMessage();
    },
    [handleSendMessage],
  );

  const handleNewChat = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setMessages([]);
    setIsTyping(false);
    setInput('');
    setShowSidebar(false);
    focusTextarea();
  }, [focusTextarea]);

  const handleSelectFellow = useCallback((fellowId: string) => {
    setSelectedFellow(fellowId);
    setShowSidebar(false);
  }, []);

  const handleIntroClose = useCallback(() => {
    setShowIntro(false);
    setIntroStep(0);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fellowsIntroSeen', 'true');
    }
  }, []);

  const handleIntroBack = useCallback(() => {
    setIntroStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleIntroNext = useCallback(() => {
    setIntroStep((prev) => {
      const next = prev + 1;
      if (totalIntroSlides === 0 || next >= totalIntroSlides) {
        handleIntroClose();
        return prev;
      }
      return next;
    });
  }, [handleIntroClose, totalIntroSlides]);

  useEffect(() => {
    const context = searchParams?.get('context');
    if (!context) return;

    const parts = context.split(':');
    if (parts.length >= 4) {
      const initialMessage = isEnglish
        ? `I'm studying "${parts[1]}" and need help with lesson "${parts[3]}". Can you clarify it for me?`
        : `Şu an "${parts[1]}" üzerine çalışıyorum ve "${parts[3]}" dersi için yardıma ihtiyacım var. Açıklayabilir misin?`;
      dispatchUserMessage(initialMessage);
    }
  }, [dispatchUserMessage, isEnglish, searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const introSeen = window.localStorage.getItem('fellowsIntroSeen');
    const forceTour = searchParams?.get('tour') === 'on';
    if (forceTour) {
      window.localStorage.removeItem('fellowsIntroSeen');
      setShowIntro(true);
      return;
    }
    if (!introSeen) {
      setShowIntro(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!showIntro) {
      setVisibleConversationIndexes([]);
      return;
    }

    const currentSlide = introSlides[introStep];
    if (!currentSlide || currentSlide.view !== 'conversation') {
      setVisibleConversationIndexes([]);
      return;
    }

    const step = INTRO_STEPS[currentSlide.stepIndex];
    if (!step || !step.conversation || step.conversation.length === 0) {
      setVisibleConversationIndexes([]);
      return;
    }

    const conversation = step.conversation;
    const timeouts: Array<ReturnType<typeof setTimeout>> = [];
    setVisibleConversationIndexes([]);

    conversation.forEach((message, idx) => {
      const baseDelay = message.delay ?? idx * 200;
      const delay = Math.max(0, baseDelay) * INTRO_CONVERSATION_SLOWDOWN;
      timeouts.push(
        setTimeout(() => {
          setVisibleConversationIndexes((prev) => {
            if (prev.includes(idx)) {
              return prev;
            }
            return [...prev, idx].sort((a, b) => a - b);
          });
        }, delay),
      );
    });

    return () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [showIntro, introStep, introSlides]);

  const fellowListCard = (
    <Card className="border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold text-foreground">
            {isEnglish ? 'AI Fellows' : 'AI Arkadaşlar'}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleNewChat} className="h-8 gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            {isEnglish ? 'New chat' : 'Yeni sohbet'}
          </Button>
        </div>
        <CardDescription>
          {isEnglish
            ? 'Pick a fellow to guide you through questions, explanations, and practice.'
            : 'Sorular, açıklamalar ve pratikte size eşlik etmesi için bir arkadaş seçin.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {FELLOWS.map((fellow) => {
          const FellowIcon = fellow.icon;
          const isActive = fellow.id === selectedFellow;
          const fellowName = isEnglish ? fellow.name : fellow.nameTr;
          const fellowExpertise = isEnglish ? fellow.expertise : fellow.expertiseTr;

          return (
            <button
              key={fellow.id}
              type="button"
              onClick={() => handleSelectFellow(fellow.id)}
              className={`w-full rounded-xl border px-3.5 py-3 text-left transition-all ${
                isActive
                  ? 'border-primary/40 bg-primary/10 text-foreground shadow-sm'
                  : 'border-border/60 bg-card hover:border-primary/30 hover:bg-card/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border ${fellow.accent.iconBorder} ${fellow.accent.iconBg} ${
                    isActive ? fellow.accent.iconText : 'text-muted-foreground'
                  }`}
                >
                  <FellowIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{fellowName}</p>
                    {isActive && (
                      <Badge variant="secondary" className={`${fellow.accent.badge} bg-transparent px-1.5 py-0 text-[11px]`}>
                        {isEnglish ? 'Active' : 'Aktif'}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{fellowExpertise}</p>
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );

  const recentConversationsCard = (
    <Card className="border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="space-y-1.5">
        <CardTitle className="text-base font-semibold text-foreground">
          {isEnglish ? 'Recent conversations' : 'Son sohbetler'}
        </CardTitle>
        <CardDescription>
          {isEnglish
            ? 'Jump back into a discussion you started earlier.'
            : 'Önceden başlattığın bir konuşmaya geri dön.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {MOCK_CONVERSATIONS.map((conversation) => {
          const fellow = FELLOWS.find((item) => item.id === conversation.fellowId);
          return (
            <button
              key={conversation.id}
              type="button"
              className="w-full rounded-lg border border-border/60 bg-card px-3.5 py-3 text-left transition-all hover:border-primary/30 hover:bg-card/80"
            >
              <div className="flex items-start gap-3">
                <div className="text-xl">{fellow?.avatar ?? '💬'}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{conversation.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    {fellow && (
                      <span className={`font-medium ${fellow.accent.iconText}`}>
                        {isEnglish ? fellow.name : fellow.nameTr}
                      </span>
                    )}
                    <span>•</span>
                    <span>{conversation.timestamp}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );

  const quickPromptsCard = (
    <Card className="border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="space-y-1.5">
        <CardTitle className="text-base font-semibold text-foreground">
          {isEnglish ? 'Quick prompts' : 'Hızlı istemler'}
        </CardTitle>
        <CardDescription>
          {isEnglish
            ? 'Use a ready-made prompt to get started quickly.'
            : 'Hızlı başlamak için hazır bir istem kullan.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {quickPromptItems.map((prompt) => (
            <button
              key={prompt.key}
              type="button"
              onClick={() => handlePromptClick(prompt.label)}
              className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3.5 py-2.5 text-left text-sm transition-colors hover:border-primary/30 hover:bg-card/80"
            >
              <span className="text-lg">{prompt.icon}</span>
              <span className="text-muted-foreground group-hover:text-primary transition-colors">
                {prompt.label}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const guideSection = (
    <div />
  );

  const sidebarContent = (
    <div className="flex flex-col gap-6">
      {fellowListCard}
      {recentConversationsCard}
      {quickPromptsCard}
    </div>
  );

  const effectiveIntroStep = totalIntroSlides > 0 ? Math.min(introStep, totalIntroSlides - 1) : 0;
  const currentIntroSlide = totalIntroSlides > 0 ? introSlides[effectiveIntroStep] : null;
  const currentIntroStepIndex = currentIntroSlide?.stepIndex ?? 0;
  const currentIntroStep = INTRO_STEPS[currentIntroStepIndex];
  const isConversationSlide = currentIntroSlide?.view === 'conversation';
  const stepIcon = currentIntroStep.icon;
  const stepTitle = isEnglish ? currentIntroStep.title.en : currentIntroStep.title.tr;
  const stepBody = isEnglish ? currentIntroStep.body.en : currentIntroStep.body.tr;
  const stepChips = isEnglish ? currentIntroStep.chips.en : currentIntroStep.chips.tr;
  const conversationTitle = isEnglish
    ? currentIntroStep.conversationTitle.en
    : currentIntroStep.conversationTitle.tr;
  const stepConversation = isConversationSlide ? currentIntroStep.conversation : [];
  const spotlights = currentIntroStep.spotlights ?? [];
  const bullets = isEnglish ? currentIntroStep.bullets.en : currentIntroStep.bullets.tr;
  const note = isEnglish ? currentIntroStep.note.en : currentIntroStep.note.tr;
  const detailsHighlightsTitle = isEnglish ? 'Highlights' : 'Öne çıkanlar';
  const detailsTakeawaysTitle = isEnglish ? 'Keep in mind' : 'Aklında kalsın';
  const detailsNoteLabel = isEnglish ? 'Note' : 'Not';
  const progress =
    totalIntroSlides > 0 ? Math.round(((effectiveIntroStep + 1) / totalIntroSlides) * 100) : 100;
  const displaySlideCount = Math.max(totalIntroSlides, 1);
  const displaySlidePosition = Math.min(effectiveIntroStep + 1, displaySlideCount);
  const visibleConversationSet = useMemo(
    () => (isConversationSlide ? new Set<number>(visibleConversationIndexes) : new Set<number>()),
    [isConversationSlide, visibleConversationIndexes],
  );

  return (
    <>
      {showIntro && currentIntroStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4 py-6 sm:px-6 sm:py-10">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-2xl sm:w-[92%] lg:max-w-4xl max-h-[calc(100vh-3rem)]">
            <div className="relative">
              <div className="absolute -top-24 -left-10 h-56 w-56 rounded-full bg-primary/20 blur-3xl animate-pulse" />
              <div className="absolute bottom-[-40px] right-[-30px] h-60 w-60 rounded-full bg-secondary/20 blur-3xl animate-pulse" />
              <div className="relative flex max-h-[calc(100vh-4.5rem)] flex-col gap-8 overflow-y-auto p-6 sm:gap-10 sm:p-8 md:p-10">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                        currentIntroStep.icon === Brain
                          ? 'border-sky-500/40 bg-sky-500/10 text-sky-600'
                          : currentIntroStep.icon === Sparkles
                          ? 'border-violet-500/40 bg-violet-500/10 text-violet-600'
                          : 'border-amber-500/40 bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {React.createElement(stepIcon, { className: 'h-6 w-6' })}
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        {isEnglish ? 'Fellow onboarding' : 'Arkadaş tanıtımı'}
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {stepTitle}
                      </h2>
                      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {stepBody}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {stepChips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleIntroClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid gap-6">
                  {isConversationSlide ? (
                    <div className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-6">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        {conversationTitle}
                      </h3>
                      <div className="space-y-3">
                        {stepConversation.map((message, idx) => {
                          if (!visibleConversationSet.has(idx)) {
                            return null;
                          }
                          if (message.role === 'assistant-typing' && visibleConversationSet.has(idx + 1)) {
                            return null;
                          }
                          const text = isEnglish ? message.en : message.tr;
                          const isAssistant = message.role.startsWith('assistant');
                          const isTyping = message.role === 'assistant-typing';
                          return (
                            <div
                              key={`${effectiveIntroStep}-${message.role}-${idx}`}
                              className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3"
                            >
                              <div
                                className={`mt-1 h-6 w-6 rounded-full border ${
                                  isAssistant ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border/50 bg-card text-muted-foreground'
                                } flex items-center justify-center text-[10px] uppercase`}
                              >
                                {isAssistant ? 'AI' : 'You'}
                              </div>
                              <div
                                className={`max-w-[90%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm backdrop-blur-sm transition-all duration-300 ${
                                  isAssistant
                                    ? 'border-primary/40 bg-primary/10 text-foreground'
                                    : 'border-border/50 bg-card/80 text-foreground'
                                }`}
                              >
                                {isTyping ? (
                                  <div className="flex items-center gap-1 text-primary/80">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '120ms' }} />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '240ms' }} />
                                  </div>
                                ) : (
                                  <p>{text}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <>
                      {spotlights.length > 0 && (
                        <div className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-6">
                          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                            {detailsHighlightsTitle}
                          </h3>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {spotlights.map((spotlight) => {
                              const title = isEnglish ? spotlight.title.en : spotlight.title.tr;
                              const body = isEnglish ? spotlight.body.en : spotlight.body.tr;
                              return (
                                <div
                                  key={title}
                                  className={`rounded-2xl border px-4 py-4 text-sm shadow-sm ${spotlight.accent}`}
                                >
                                  <p className="font-semibold">{title}</p>
                                  <p className="mt-1 text-xs sm:text-sm">{body}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-6">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                          {detailsTakeawaysTitle}
                        </h3>
                        <div className="space-y-2">
                          {bullets.map((bullet) => (
                            <div key={bullet} className="flex items-start gap-3">
                              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                              <p className="text-sm text-muted-foreground">{bullet}</p>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm text-primary">
                          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                            {detailsNoteLabel}
                          </span>
                          <p className="mt-2 text-sm text-primary">{note}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {displaySlidePosition}/{displaySlideCount}
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      {introStep > 0 && (
                        <Button variant="outline" onClick={handleIntroBack}>
                          {isEnglish ? 'Back' : 'Geri'}
                        </Button>
                      )}
                      <Button onClick={handleIntroNext}>
                        {totalIntroSlides > 0 && effectiveIntroStep === totalIntroSlides - 1
                          ? isEnglish
                            ? 'Get started'
                            : 'Başla'
                          : isEnglish
                            ? 'Next step'
                            : 'Sonraki adım'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSidebar(false)}
          />
          <div className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col gap-6 border-l border-border/60 bg-background px-5 py-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {isEnglish ? 'AI Fellows' : 'AI Arkadaşlar'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label={isEnglish ? 'Close panel' : 'Paneli kapat'}
                onClick={() => setShowSidebar(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto pb-4">{sidebarContent}</div>
          </div>
        </div>
      )}

      <div className="flex h-[100svh] flex-col overflow-hidden bg-muted/10 lg:h-screen lg:flex-row">
        <aside className="hidden h-screen w-[320px] shrink-0 flex-col gap-6 overflow-y-auto border-r border-border/60 bg-card/50 px-4 py-6 backdrop-blur-sm lg:flex">
          {sidebarContent}
        </aside>

        <main className="flex flex-1 min-h-0 flex-col overflow-hidden">
          <div className="hidden sm:flex items-center justify-between gap-6 border-b border-border/60 bg-background/80 px-6 py-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${currentFellow.accent.iconBorder} ${currentFellow.accent.iconBg} ${currentFellow.accent.iconText}`}
              >
                <CurrentFellowIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{localizedFellowName}</p>
                <p className="text-sm text-muted-foreground">{localizedExpertise}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1 border-primary/30 text-xs text-primary">
                <Zap className="h-3 w-3" />
                {isEnglish ? 'Online now' : 'Şu anda çevrimiçi'}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleNewChat}>
                {isEnglish ? 'Start new chat' : 'Yeni sohbet başlat'}
              </Button>
            </div>
          </div>
          <div className="sm:hidden flex items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(true)}
              aria-label={isEnglish ? 'Open fellows list' : 'Arkadaş listesini aç'}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Badge variant="outline" className="flex items-center gap-1 border-primary/30 text-xs text-primary">
              <Zap className="h-3 w-3" />
              {isEnglish ? 'Online' : 'Çevrimiçi'}
            </Badge>
          </div>

          <div className="flex flex-1 min-h-0 flex-col">
            <div className="flex flex-1 min-h-0 flex-col">
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
                {messages.length === 0 && !showIntro ? (
                  <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-6 text-center">
                    <div
                      className={`flex h-20 w-20 items-center justify-center rounded-2xl border ${currentFellow.accent.iconBorder} ${currentFellow.accent.iconBg} ${currentFellow.accent.iconText}`}
                    >
                      <CurrentFellowIcon className="h-8 w-8" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                        {isEnglish
                          ? `Ready when you are, ${currentFellow.name.split(' ')[0]}`
                          : `${currentFellow.nameTr.split(' ')[0]} hazır, sen hazırsan`}
                      </h2>
                      <p className="text-sm text-muted-foreground sm:text-base">
                        {isEnglish
                          ? 'Not sure where to start? Use one of the quick prompts or ask anything that is blocking you.'
                          : 'Nereden başlayacağını bilmiyor musun? Hızlı istemlerden birini kullan veya seni durduran soruyu yaz.'}
                      </p>
                    </div>
                    <div className="w-full space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {isEnglish ? 'Quick prompts' : 'Hızlı istemler'}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {quickPromptItems.map((prompt) => (
                          <button
                            key={prompt.key}
                            type="button"
                            onClick={() => handlePromptClick(prompt.label)}
                            className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3.5 py-2.5 text-left text-sm transition-colors hover:border-primary/30 hover:bg-card/80"
                          >
                            <span className="text-lg">{prompt.icon}</span>
                            <span className="text-muted-foreground group-hover:text-primary transition-colors">
                              {prompt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {messages.map((message, idx) => {
                      const isUser = message.role === 'user';
                      const formattedTime = message.timestamp.toLocaleTimeString(isEnglish ? 'en-US' : 'tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <div
                          key={`${message.role}-${message.timestamp.getTime()}-${idx}`}
                          className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isUser && (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                              <Bot className="h-4 w-4" />
                            </div>
                          )}
                          <div className={`max-w-[80%] sm:max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
                            <div
                              className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm sm:px-5 sm:py-4 sm:text-base ${
                                isUser
                                  ? 'border-primary/40 bg-primary text-primary-foreground'
                                  : 'border-border/60 bg-card'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <p className={`mt-1 text-xs text-muted-foreground ${isUser ? 'pr-1' : 'pl-1'}`}>
                              {formattedTime}
                            </p>
                          </div>
                          {isUser && (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-1 rounded-2xl border border-border/60 bg-card px-3 py-2 text-xs text-muted-foreground">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '120ms' }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: '240ms' }} />
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="border-t border-border/60 bg-background/70 px-6 py-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <Textarea
                      ref={textareaRef}
                      placeholder={isEnglish ? 'Ask anything…' : 'Her şeyi sorabilirsiniz…'}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyPress}
                      className="min-h-[80px] w-full resize-none rounded-xl border-border/60 bg-background/60 text-sm shadow-sm focus:border-primary/40 focus:shadow-none focus-visible:ring-0 sm:text-base"
                      rows={2}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!input.trim() || isTyping}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 text-primary-foreground shadow-md transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40"
                  >
                    <Send className="h-4 w-4" />
                    {isEnglish ? 'Send' : 'Gönder'}
                  </Button>
                </form>
                <p className="mt-3 text-xs text-muted-foreground">
                  {isEnglish
                    ? 'AI Fellows may sometimes be inaccurate. Double-check important answers.'
                    : 'AI Arkadaşlar zaman zaman yanılabilir. Önemli yanıtları doğrulamayı unutmayın.'}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
