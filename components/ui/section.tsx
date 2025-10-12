'use client';

import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-12 md:py-20', className)}>
      <div className="container">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ title, subtitle, align = 'center' }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12', align === 'center' && 'text-center')}>
      <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
