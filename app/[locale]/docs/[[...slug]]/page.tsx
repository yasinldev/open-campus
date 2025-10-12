import { notFound } from 'next/navigation';
import { allDocs } from 'contentlayer/generated';
import { Section } from '@/components/ui/section';
import { MDXContent } from '@/components/mdx-content';
import { generateSEO } from '@/lib/seo';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
  return allDocs.map((doc: any) => ({
    slug: doc.slug.split('/'),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[]; locale: string };
}) {
  const slug = params.slug?.join('/') || 'getting-started';
  const doc = allDocs.find((d: any) => d.slug === slug);

  if (!doc) {
    return {};
  }

  return generateSEO({
    title: `${doc.title} - Documentation`,
    description: doc.description,
    path: `/docs/${slug}`,
    locale: params.locale,
  });
}

export default function DocPage({ params }: { params: { slug?: string[] } }) {
  const slug = params.slug?.join('/') || 'getting-started';
  const doc = allDocs.find((d: any) => d.slug === slug);

  if (!doc) {
    notFound();
  }

  return (
    <Section className="pt-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <h4 className="mb-4 text-sm font-semibold">Documentation</h4>
              <nav className="space-y-2">
                {allDocs
                  .sort((a: any, b: any) => (a.order || 999) - (b.order || 999))
                  .map((d: any) => (
                    <a
                      key={d.slug}
                      href={`/docs/${d.slug}`}
                      className={`block text-sm transition-colors hover:text-primary ${
                        d.slug === slug ? 'font-medium text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {d.title}
                    </a>
                  ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main>
            <article>
              <h1 className="mb-4 text-4xl font-bold">{doc.title}</h1>
              {doc.description && (
                <p className="mb-8 text-xl text-muted-foreground">{doc.description}</p>
              )}
              <Separator className="mb-8" />
              <div className="prose prose-invert max-w-none">
                <MDXContent code={doc.body.code} />
              </div>
            </article>
          </main>
        </div>
      </div>
    </Section>
  );
}
