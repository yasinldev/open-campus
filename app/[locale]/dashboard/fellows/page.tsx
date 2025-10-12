'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  MessageSquare,
  Lightbulb,
  Code,
  Calculator,
  Zap,
  ChevronLeft,
  Plus,
  Trash2,
  MoreVertical,
  User,
  Bot,
} from 'lucide-react';

// Mock Fellows Data
const fellows = [
  {
    id: 'ai',
    name: 'AI Fellow',
    nameTr: 'AI Arkadaşı',
    expertise: 'Machine Learning, Deep Learning, Neural Networks',
    expertiseTr: 'Makine Öğrenmesi, Derin Öğrenme, Sinir Ağları',
    avatar: '🤖',
    color: 'from-blue-500/20 to-purple-500/20',
    borderColor: 'border-blue-500/30',
    icon: Brain,
  },
  {
    id: 'math',
    name: 'Math Fellow',
    nameTr: 'Matematik Arkadaşı',
    expertise: 'Calculus, Linear Algebra, Statistics',
    expertiseTr: 'Kalkülüs, Lineer Cebir, İstatistik',
    avatar: '📐',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    icon: Calculator,
  },
  {
    id: 'logic',
    name: 'Logic Fellow',
    nameTr: 'Mantık Arkadaşı',
    expertise: 'Computer Science, Algorithms, Programming',
    expertiseTr: 'Bilgisayar Bilimi, Algoritmalar, Programlama',
    avatar: '💡',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
    icon: Code,
  },
];

// Mock conversation history
const mockConversations = [
  { id: '1', title: 'Introduction to Machine Learning', fellowId: 'ai', timestamp: '2 hours ago' },
  { id: '2', title: 'Linear Algebra Basics', fellowId: 'math', timestamp: '1 day ago' },
  { id: '3', title: 'Sorting Algorithms', fellowId: 'logic', timestamp: '3 days ago' },
];

// Quick prompts
const quickPrompts = [
  { icon: '💡', textEn: 'Explain this concept simply', textTr: 'Bu konsepti basitçe açıkla' },
  { icon: '✏️', textEn: 'Give me practice problems', textTr: 'Bana pratik problemler ver' },
  { icon: '🔍', textEn: 'Help me debug my code', textTr: 'Kodumu debug etmeme yardım et' },
  { icon: '📚', textEn: 'Recommend learning resources', textTr: 'Öğrenme kaynakları öner' },
];

export default function DashboardFellowsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params?.locale as string || 'en';
  
  const [selectedFellow, setSelectedFellow] = useState('ai');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentFellow = fellows.find(f => f.id === selectedFellow) || fellows[0];

  // Parse context from URL
  useEffect(() => {
    const context = searchParams?.get('context');
    if (context) {
      // Parse: course:slug:lesson:id
      const parts = context.split(':');
      if (parts.length >= 4) {
        const initialMessage = locale === 'en' 
          ? `I'm currently studying "${parts[1]}" and need help with lesson "${parts[3]}". Can you help me?`
          : `Şu an "${parts[1]}" kursunu çalışıyorum ve "${parts[3]}" dersi ile ilgili yardıma ihtiyacım var. Yardımcı olabilir misiniz?`;
        handleSendMessage(initialMessage);
      }
    }
  }, [searchParams]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you understand this concept better. " +
        (locale === 'en' 
          ? "The key thing to remember is that this builds on fundamental principles we've discussed."
          : "Hatırlanması gereken önemli nokta, bunun daha önce tartıştığımız temel prensiplere dayandığıdır."),
        
        "I can see why this might be confusing. Let me break it down step by step:\n\n" +
        "1. First, consider the basic definition\n" +
        "2. Then, look at how it applies in practice\n" +
        "3. Finally, try solving a simple example\n\n" +
        (locale === 'en' ? "Would you like me to elaborate on any of these steps?" : "Bu adımlardan herhangi birini detaylandırmamı ister misiniz?"),
        
        "Excellent! Here's a practical approach:\n\n" +
        (locale === 'en' 
          ? "Think of it like building blocks - each concept stacks on the previous one. Let me give you a real-world analogy that might help..."
          : "Bunu yapı taşları gibi düşünün - her konsept bir öncekinin üzerine yığılır. Size yardımcı olabilecek gerçek dünya benzetmesi vereyim..."),
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        role: 'assistant' as const,
        content: randomResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none opacity-40" />

      <div className="relative h-full max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-[320px_1fr] h-full gap-0">
          {/* Mobile Overlay */}
          {showSidebar && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
            w-[280px] lg:w-auto
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            border-r border-border/50 bg-card/95 lg:bg-card/50 backdrop-blur-xl
            flex flex-col h-full overflow-hidden
          `}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {locale === 'en' ? 'AI Fellows' : 'AI Arkadaşlar'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNewChat}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleNewChat}
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'New Conversation' : 'Yeni Sohbet'}
              </Button>
            </div>

            {/* Fellows List */}
            <div className="p-4 space-y-3 border-b border-border/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {locale === 'en' ? 'Choose Fellow' : 'Fellow Seç'}
              </p>
              {fellows.map(fellow => {
                const FellowIcon = fellow.icon;
                return (
                  <button
                    key={fellow.id}
                    onClick={() => {
                      setSelectedFellow(fellow.id);
                      setShowSidebar(false);
                    }}
                    className={`group relative w-full text-left p-4 rounded-xl transition-all overflow-hidden ${
                      selectedFellow === fellow.id
                        ? `bg-gradient-to-br ${fellow.color} border-2 ${fellow.borderColor} shadow-lg`
                        : 'bg-background/50 border border-border/50 hover:bg-background/80 hover:border-border hover:shadow-md'
                    }`}
                  >
                    {/* Glow effect on active */}
                    {selectedFellow === fellow.id && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    )}
                    
                    <div className="relative flex items-start gap-3">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center transition-all ${
                        selectedFellow === fellow.id 
                          ? `bg-gradient-to-br ${fellow.color} ring-2 ring-offset-2 ring-offset-background ${fellow.borderColor.replace('border-', 'ring-')}`
                          : 'bg-background/80 group-hover:bg-background'
                      }`}>
                        <FellowIcon className={`h-5 w-5 ${selectedFellow === fellow.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-semibold text-sm truncate ${
                            selectedFellow === fellow.id ? 'text-primary' : 'text-foreground'
                          }`}>
                            {locale === 'en' ? fellow.name : fellow.nameTr}
                          </p>
                          {selectedFellow === fellow.id && (
                            <Badge variant="default" className="text-[9px] px-1.5 py-0 ml-2 flex-shrink-0">
                              {locale === 'en' ? 'Active' : 'Aktif'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
                          {locale === 'en' ? fellow.expertise : fellow.expertiseTr}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Recent Conversations */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {locale === 'en' ? 'Recent' : 'Son Sohbetler'}
              </p>
              <div className="space-y-2">
                {mockConversations.map(conv => {
                  const convFellow = fellows.find(f => f.id === conv.fellowId);
                  return (
                    <button
                      key={conv.id}
                      className="w-full text-left p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 hover:border-border hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-lg">
                          {convFellow?.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {conv.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-border/50">
              <Button variant="outline" asChild className="w-full" size="sm">
                <Link href="/fellows">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'About Fellows' : 'Fellows Hakkında'}
                </Link>
              </Button>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex flex-col h-full bg-background">
            {/* Chat Header */}
            <div className="border-b border-border/50 bg-card/50 backdrop-blur-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(true)}
                    className="lg:hidden h-9 w-9 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${currentFellow.color} border ${currentFellow.borderColor} flex items-center justify-center shadow-md`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
                      {React.createElement(currentFellow.icon, {
                        className: 'h-6 w-6 text-primary relative z-10',
                      })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base">
                        {locale === 'en' ? currentFellow.name : currentFellow.nameTr}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {locale === 'en' ? currentFellow.expertise : currentFellow.expertiseTr}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1.5 hidden sm:flex border-primary/30 bg-primary/5">
                    <Zap className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-xs">{locale === 'en' ? 'Online' : 'Çevrimiçi'}</span>
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-background/80">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="mb-8 space-y-6">
                    {/* Fellow Avatar with Glow */}
                    <div className="relative inline-block">
                      <div className={`absolute inset-0 bg-gradient-to-br ${currentFellow.color} blur-2xl opacity-50 animate-pulse`} />
                      <div className="relative">
                        <div className={`inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${currentFellow.color} border-2 ${currentFellow.borderColor} shadow-xl`}>
                          {React.createElement(currentFellow.icon, {
                            className: 'h-12 w-12 text-primary',
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Welcome Message */}
                    <div className="space-y-3">
                      <h3 className="text-2xl sm:text-3xl font-bold">
                        {locale === 'en' 
                          ? `Hi! I'm ${currentFellow.name}`
                          : `Merhaba! Ben ${currentFellow.nameTr}`}
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                        {locale === 'en'
                          ? 'I\'m here to help you with your learning journey. Ask me anything about your courses, concepts, or get practice problems.'
                          : 'Öğrenme yolculuğunuzda size yardımcı olmak için buradayım. Kurslarınız, konseptler hakkında bana herhangi bir şey sorun veya pratik problemler alın.'}
                      </p>
                    </div>
                  </div>

                  {/* Quick Prompts */}
                  <div className="grid sm:grid-cols-2 gap-3 w-full max-w-2xl">
                    {quickPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(locale === 'en' ? prompt.textEn : prompt.textTr)}
                        className="group relative p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all text-left overflow-hidden shadow-sm hover:shadow-md"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                            {prompt.icon}
                          </div>
                          <p className="text-sm text-foreground group-hover:text-primary transition-colors leading-relaxed">
                            {locale === 'en' ? prompt.textEn : prompt.textTr}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30 shadow-sm">
                            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                        </div>
                      )}
                      <div className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`group relative p-3 sm:p-4 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground'
                              : 'bg-card/90 backdrop-blur-sm border border-border/50 hover:border-border'
                          }`}
                        >
                          {message.role === 'user' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          )}
                          <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed relative">
                            {message.content}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground px-2">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30 shadow-sm">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30 shadow-sm">
                          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse" />
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-card/90 backdrop-blur-sm border border-border/50 shadow-sm">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border/50 bg-card/50 backdrop-blur-xl p-4">
              <div className="max-w-4xl mx-auto space-y-3">
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      placeholder={locale === 'en' ? 'Ask anything...' : 'Herhangi bir şey sor...'}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="min-h-[56px] max-h-[200px] resize-none pr-14 text-sm sm:text-base rounded-xl border-border/50 focus:border-primary/30 bg-background/80 backdrop-blur-sm shadow-sm"
                      rows={1}
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!input.trim() || isTyping}
                      size="sm"
                      className="absolute right-2 bottom-2 h-9 w-9 p-0 rounded-lg shadow-md disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">
                    {locale === 'en'
                      ? 'AI Fellows can make mistakes. Consider checking important information.'
                      : 'AI Fellows hata yapabilir. Önemli bilgileri kontrol etmeyi düşünün.'}
                  </p>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

