import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { allBlogPosts } from 'contentlayer/generated';
import { Section } from '@/components/ui/section';
import { MDXContent } from '@/components/mdx-content';
import { generateSEO } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
  return allBlogPosts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const post = allBlogPosts.find((p: any) => p.slug === params.slug);

  if (!post) {
    return {};
  }

  return generateSEO({
    title: `${post.title} - Open Campus`,
    description: post.summary,
    path: `/blog/${post.slug}`,
    locale: params.locale,
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const t = useTranslations('blog');
  const post = allBlogPosts.find((p: any) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Section className="pt-20">
        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>
                {t('author')} {post.author}
              </span>
              <Separator orientation="vertical" className="mx-3 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <MDXContent code={post.body.code} />
          </div>
        </article>
      </Section>
    </>
  );
}
