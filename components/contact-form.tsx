'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export function ContactForm() {
  const t = useTranslations('contact');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="contact-name">{t('formName')}</Label>
        <Input
          id="contact-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <Label htmlFor="contact-email">{t('formEmail')}</Label>
        <Input
          id="contact-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <Label htmlFor="contact-message">{t('formMessage')}</Label>
        <Textarea
          id="contact-message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          disabled={status === 'loading'}
          rows={5}
        />
      </div>

      <Button type="submit" disabled={status === 'loading'}>
        {status === 'success' ? t('formSuccess') : t('formSubmit')}
      </Button>

      {status === 'error' && (
        <p className="text-sm text-red-500">An error occurred. Please try again.</p>
      )}
    </form>
  );
}
