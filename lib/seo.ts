import { Metadata } from 'next';
import { absoluteUrl } from './utils';

interface PageSEOProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  locale?: string;
}

export function generateSEO({
  title,
  description = 'Open Campus - Redefining Learning. Together. AI-powered learning, open-source education, and production-focused ecosystem.',
  path = '',
  image,
  locale = 'en-US',
}: PageSEOProps): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image || absoluteUrl('/og-image.png');

  return {
    title,
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    openGraph: {
      title,
      description,
      url,
      siteName: 'Open Campus',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}
