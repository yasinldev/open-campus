'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function NewsletterForm() {
  const t = useTranslations('home');
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <Label htmlFor="newsletter-email" className="sr-only">
          {t('newsletterPlaceholder')}
        </Label>
        <Input
          id="newsletter-email"
          type="email"
          placeholder={t('newsletterPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading' || status === 'success'}
        />
      </div>
      <Button type="submit" disabled={status === 'loading' || status === 'success'}>
        {status === 'success' ? t('newsletterSuccess') : t('newsletterButton')}
      </Button>
    </form>
  );
}
