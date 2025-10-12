# Open Campus

![Open Campus](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Redefining Learning. Together.**

Open Campus is an open-source platform for AI-powered education and collaborative learning. Built with Next.js 14, TypeScript, and cutting-edge AI technology.

## ✨ Features

- 🤖 **AI Fellows**: Specialized AI guides for every subject
- 📚 **Open Courses**: Free, high-quality educational content
- 🌍 **Internationalization**: Support for English and Turkish (easily extensible)
- 🎨 **Modern UI**: Built with TailwindCSS and shadcn/ui
- 📝 **MDX Content**: Flexible content management with Contentlayer
- ⚡ **Performance**: Optimized with Next.js 14 App Router
- ♿ **Accessibility**: WCAG AA compliant
- 📊 **Analytics**: Integrated Vercel Analytics
- 🧪 **Tested**: Playwright end-to-end tests

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+ 
- npm 9.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/open-campus.git
cd open-campus

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Set up Supabase (see Authentication Setup below)

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 🔐 Authentication Setup

Open Campus uses Supabase for authentication. Follow these steps:

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your database to initialize (2-3 minutes)

### 2. Configure Environment Variables

Update `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in: Supabase Dashboard → Settings → API

### 3. Set Up Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `sql/schema.sql`
3. Paste and run the SQL

This will create all necessary tables for authentication and user profiles.

### 4. Configure OAuth Providers (Optional)

For GitHub OAuth:

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable GitHub provider
3. Add your GitHub OAuth credentials
4. Set the callback URL: `https://your-project.supabase.co/auth/v1/callback`

### 5. Test Authentication

Visit `/auth/login` or `/auth/register` to test the authentication flow.

For more details, see the [Database Setup Guide](./sql/README.md).

## 📦 Tech Stack

### Core
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Database**: [Supabase PostgreSQL](https://supabase.com)

### Content & Data
- **Content**: [Contentlayer](https://contentlayer.dev/) + MDX
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)

### Features
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

### Development
- **Testing**: [Playwright](https://playwright.dev/)
- **Linting**: ESLint
- **Formatting**: Prettier
- **SEO**: next-sitemap

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run typecheck    # Type check with TypeScript

# Testing
npm run test         # Run Playwright tests
npm run test:ui      # Run tests in UI mode
```

## 📁 Project Structure

```
open-campus/
├── app/                    # Next.js app directory
│   ├── [locale]/          # Internationalized routes
│   │   ├── page.tsx       # Homepage
│   │   ├── auth/          # Authentication pages (login, register)
│   │   ├── fellows/       # AI Fellows pages
│   │   ├── courses/       # Courses pages
│   │   ├── research/      # Research pages
│   │   ├── blog/          # Blog pages
│   │   └── ...
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── content/              # MDX content files
│   ├── fellows/         # Fellow profiles
│   ├── courses/         # Course materials
│   ├── research/        # Research projects
│   ├── blog/            # Blog posts
│   └── docs/            # Documentation
├── lib/                 # Utility functions
│   ├── supabase/        # Supabase client utilities
│   └── translations/    # Translation files
├── messages/            # i18n translation files
├── public/              # Static assets
├── sql/                 # Database schema and migrations
├── tests/               # Playwright tests
└── types/               # TypeScript type definitions
```

## 🌐 Internationalization

Open Campus supports multiple languages:

- English (en-US) - Default
- Turkish (tr-TR)

To add a new language:

1. Create a new message file in `messages/{locale}.json`
2. Update `i18n.ts` with the new locale
3. Content will be automatically available in the new language

## 🎨 Design System

### Colors

```css
--background: #0B0F14    /* Dark background */
--foreground: #E6F0FF    /* Light text */
--accent: #00E0C7        /* Teal accent */
--accent-2: #39BDF8      /* Blue accent */
--muted: #101820         /* Muted background */
--border: #12202B        /* Border color */
```

### Typography

- **UI**: Inter
- **Code**: IBM Plex Mono

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 Content Management

### Adding Content

All content is managed through MDX files in the `content/` directory:

#### Add a Fellow

Create a new file in `content/fellows/`:

```mdx
---
slug: "your-fellow"
name: "Your Fellow Name"
short: "Brief description"
tags: ["tag1", "tag2"]
---

## Content here...
```

#### Add a Course

Create a new file in `content/courses/`:

```mdx
---
slug: "your-course"
title: "Course Title"
level: "intro"
summary: "Course summary"
---

## Course content...
```

The content will be automatically picked up by Contentlayer and rendered.

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/open-campus)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy!

### Docker

```bash
# Build image
docker build -t open-campus .

# Run container
docker run -p 3000:3000 open-campus
```

## 📊 Performance

Open Campus is optimized for performance:

- Lighthouse scores: 90+ across all metrics
- Image optimization with next/image
- Code splitting and lazy loading
- Efficient MDX compilation
- Static generation where possible

## 🔒 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Inspired by the open-source education movement

## 📧 Contact

- Website: [opencampus.example.com](https://opencampus.example.com)
- GitHub: [@opencampus](https://github.com/opencampus)
- Twitter: [@opencampus](https://twitter.com/opencampus)

---

**Made with ❤️ by the Open Campus community**

## TODO:

1. kullanıcı kota kullanım tespiti yapılacak.
2. opencampus.example.com adresi değişecek
3. terms ve privacy policy değişecek
4. blog kısmı yapılacak
5. video kısımları halledilecek, keypoints vs. eklenecek, md özelliği eklenecek.