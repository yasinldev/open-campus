import { Inter, IBM_Plex_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import '../globals.css';
import { generateSEO } from '@/lib/seo';
import { ConditionalLayout } from '@/components/conditional-layout';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-mono',
});

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return generateSEO({
    title: 'Open Campus - Redefining Learning. Together.',
    locale: params.locale,
  });
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${ibmPlexMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <ConditionalLayout>{children}</ConditionalLayout>
            <Analytics />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
