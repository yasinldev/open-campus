import { notFound } from 'next/navigation';
import { allFellows } from 'contentlayer/generated';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { MDXContent } from '@/components/mdx-content';
import { generateSEO } from '@/lib/seo';
import { Github, FileText } from 'lucide-react';

export async function generateStaticParams() {
  return allFellows.map((fellow) => ({
    slug: fellow.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const fellow = allFellows.find((f) => f.slug === params.slug);

  if (!fellow) {
    return {};
  }

  return generateSEO({
    title: `${fellow.name} - Open Campus`,
    description: fellow.short,
    path: `/fellows/${fellow.slug}`,
    locale: params.locale,
  });
}

export default function FellowPage({ params }: { params: { slug: string } }) {
  const fellow = allFellows.find((f) => f.slug === params.slug);

  if (!fellow) {
    notFound();
  }

  return (
    <>
      <Section className="pt-20">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {fellow.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <h1 className="mb-4 text-4xl font-bold">{fellow.name}</h1>
            <p className="text-xl text-muted-foreground">{fellow.short}</p>
          </div>

          {/* Model & Links */}
          {(fellow.model || fellow.repo || fellow.docs) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fellow.model && (
                  <div>
                    <span className="font-semibold">Model:</span>{' '}
                    <span className="font-mono text-sm text-muted-foreground">{fellow.model}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {fellow.repo && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={fellow.repo} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Repository
                      </a>
                    </Button>
                  )}
                  {fellow.docs && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={fellow.docs}>
                        <FileText className="mr-2 h-4 w-4" />
                        Documentation
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <MDXContent code={fellow.body.code} />
          </div>
        </div>
      </Section>
    </>
  );
}
