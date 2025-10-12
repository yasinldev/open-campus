'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function JoinPage() {
  const t = useTranslations('join');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    field: '',
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
        body: JSON.stringify({ ...formData, subject: 'Open Campus Fellow Application' }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', field: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      <Section className="pt-20">
        <SectionHeader title={t('title')} subtitle={t('subtitle')} />

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {/* Application Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Application Form</CardTitle>
                <CardDescription>Tell us about yourself and why you want to join</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t('formName')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">{t('formEmail')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="field">{t('formField')}</Label>
                    <Input
                      id="field"
                      value={formData.field}
                      onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                      placeholder="e.g., Mathematics, AI, Web Development"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">{t('formMessage')}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      disabled={status === 'loading'}
                      rows={6}
                      placeholder="Tell us about your experience, interests, and what you hope to contribute..."
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={status === 'loading'}>
                    {status === 'success' ? t('formSuccess') : t('formSubmit')}
                  </Button>

                  {status === 'error' && (
                    <p className="text-sm text-red-500">
                      An error occurred. Please try again.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* What We're Looking For */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('whatWeExpectTitle')}</CardTitle>
                <CardDescription>{t('whatWeExpectDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold">Qualities We Value</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Passion for learning and teaching</li>
                    <li>Commitment to open-source values</li>
                    <li>Collaborative mindset</li>
                    <li>Drive to create and share</li>
                    <li>Curiosity and openness to new ideas</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">What You'll Get</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Mentorship from experienced educators</li>
                    <li>Platform to share your knowledge</li>
                    <li>Collaborative learning environment</li>
                    <li>Recognition in the community</li>
                    <li>Opportunity to shape the future of education</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>The Process</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                      1
                    </span>
                    <span>Submit your application</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                      2
                    </span>
                    <span>Initial review (1-2 weeks)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                      3
                    </span>
                    <span>Interview/discussion</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                      4
                    </span>
                    <span>Welcome to Open Campus!</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
