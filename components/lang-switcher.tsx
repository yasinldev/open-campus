'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';

export function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'tr' : 'en';
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLocale}
      className="flex items-center space-x-1"
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-medium uppercase">{locale}</span>
    </Button>
  );
}
