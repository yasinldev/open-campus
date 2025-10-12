import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/section';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateSEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return generateSEO({
    title: 'FAQ - Open Campus',
    description: 'Frequently asked questions about Open Campus.',
    path: '/faq',
    locale: params.locale,
  });
}

export default function FAQPage() {
  const t = useTranslations('faq');

  const faqs = [
    {
      question: 'What is Open Campus?',
      answer: 'Open Campus is an open-source platform for AI-powered education. We provide free courses, AI Fellows for personalized learning, and a global community of learners and educators.',
    },
    {
      question: 'Are the courses really free?',
      answer: 'Yes! All our courses, materials, and AI Fellows are completely free. We believe education should be accessible to everyone.',
    },
    {
      question: 'How do AI Fellows work?',
      answer: 'AI Fellows are specialized AI agents trained for specific subjects. They provide personalized guidance, answer questions, and adapt to your learning style. Think of them as 24/7 tutors that never get tired or impatient.',
    },
    {
      question: 'Can I contribute my own courses?',
      answer: 'Absolutely! Open Campus is built by the community. You can contribute courses, improve existing content, or help with platform development. Check our Contribute page for details.',
    },
    {
      question: 'What languages are supported?',
      answer: 'Currently, we support English and Turkish. We plan to add more languages based on community contributions. If you\'d like to help translate, please reach out!',
    },
    {
      question: 'Is there a certificate program?',
      answer: 'We\'re currently focused on learning itself rather than credentials. However, we\'re exploring options for community-recognized certificates in the future.',
    },
    {
      question: 'How is this funded?',
      answer: 'Open Campus operates as an open-source project with community contributions. We may explore sustainable funding models like corporate sponsorships or optional premium features in the future.',
    },
    {
      question: 'Can I use Open Campus offline?',
      answer: 'While the platform requires internet access, you can download course materials and work offline. We\'re working on better offline support.',
    },
    {
      question: 'How do I report bugs or suggest features?',
      answer: 'Visit our GitHub repository and open an issue. We welcome all feedback and contributions!',
    },
    {
      question: 'What\'s the difference between Open Campus and other online learning platforms?',
      answer: 'Open Campus is fully open-source, AI-powered, and community-driven. There are no paywalls, all code is public, and you can contribute directly to the platform\'s development.',
    },
  ];

  return (
    <Section className="pt-20">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} />
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
