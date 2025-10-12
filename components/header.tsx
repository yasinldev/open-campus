'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, LogIn, User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { LangSwitcher } from './lang-switcher';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/vision', key: 'vision' },
  { href: '/fellows', key: 'fellows' },
  { href: '/courses', key: 'courses' },
  { href: '/research', key: 'research' },
  { href: '/docs', key: 'docs' },
  { href: '/blog', key: 'blog' },
  { href: '/community', key: 'community' },
  { href: '/become-educator', key: 'becomeEducator' },
];

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [username, setUsername] = React.useState<string>('');
  const supabase = createClient();
  const locale = pathname.startsWith('/tr') ? 'tr' : 'en';
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Get username from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()
        
        if (profile?.username) {
          setUsername(profile.username)
        }
      }
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = `/${locale}`;
  };

  const isActive = (href: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|tr)/, '');
    return pathWithoutLocale === href || pathWithoutLocale.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background font-bold">
            OC
          </div>
          <span className="text-xl font-bold">Open Campus</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-foreground',
                isActive(item.href) ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {t(item.key as any)}
            </Link>
          ))}
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <LangSwitcher />
          
          {/* Auth Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-sm">
                    {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {username && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/${username}`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {locale === 'en' ? 'View Profile' : 'Profili Görüntüle'}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard/settings`} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    {locale === 'en' ? 'Settings' : 'Ayarlar'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {locale === 'en' ? 'Sign Out' : 'Çıkış Yap'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="gap-2">
              <Link href={`/${locale}/auth`}>
                <LogIn className="h-4 w-4" />
                {locale === 'en' ? 'Sign In' : 'Giriş Yap'}
              </Link>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-4 md:hidden">
          <LangSwitcher />
          
          {/* Mobile Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-xs">
                    {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/profile`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {locale === 'en' ? 'Profile' : 'Profil'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/settings`} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    {locale === 'en' ? 'Settings' : 'Ayarlar'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {locale === 'en' ? 'Sign Out' : 'Çıkış Yap'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="ghost">
              <Link href={`/${locale}/auth`}>
                <LogIn className="h-4 w-4" />
              </Link>
            </Button>
          )}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-primary',
                      isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {t(item.key as any)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
