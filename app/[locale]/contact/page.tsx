import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/section';
import { ContactForm } from '@/components/contact-form';
import { generateSEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return generateSEO({
    title: 'Contact Us - Open Campus',
    description: 'Get in touch with the Open Campus team.',
    path: '/contact',
    locale: params.locale,
  });
}

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <Section className="pt-20">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="mx-auto max-w-2xl">
        <ContactForm />
      </div>
    </Section>
  );
}
