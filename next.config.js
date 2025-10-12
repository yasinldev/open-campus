import createNextIntlPlugin from 'next-intl/plugin';
import { withContentlayer } from 'next-contentlayer2';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'mrrkoswbdthjilksvhof.supabase.co', // Supabase Storage
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default withNextIntl(withContentlayer(nextConfig));
