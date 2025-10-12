'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Github } from 'lucide-react';
import { Separator } from './ui/separator';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const quickLinks = [
    { href: '/vision', label: tNav('vision') },
    { href: '/fellows', label: tNav('fellows') },
    { href: '/courses', label: tNav('courses') },
    { href: '/research', label: tNav('research') },
  ];

  const resources = [
    { href: '/docs', label: tNav('docs') },
    { href: '/blog', label: tNav('blog') },
    { href: '/faq', label: tNav('faq') },
  ];

  const community = [
    { href: '/community', label: tNav('community') },
    { href: '/contribute', label: tNav('contribute') },
    { href: '/join', label: tNav('join') },
  ];

  const legal = [
    { href: '/legal/privacy', label: t('privacy') },
    { href: '/legal/terms', label: t('terms') },
  ];

  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('resources')}</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('community')}</h3>
            <ul className="space-y-3">
              {community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">{t('legal')}</h3>
            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">{t('copyright')}</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
