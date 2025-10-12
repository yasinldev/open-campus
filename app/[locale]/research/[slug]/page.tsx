import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { allProjects } from 'contentlayer/generated';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { MDXContent } from '@/components/mdx-content';
import { generateSEO } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

export async function generateStaticParams() {
  return allProjects.map((project: any) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const project = allProjects.find((p: any) => p.slug === params.slug);

  if (!project) {
    return {};
  }

  return generateSEO({
    title: `${project.title} - Open Campus`,
    description: project.abstract,
    path: `/research/${project.slug}`,
    locale: params.locale,
  });
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const t = useTranslations('research');
  const project = allProjects.find((p: any) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Section className="pt-20">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">{project.title}</h1>
            {project.publishedAt && (
              <p className="text-sm text-muted-foreground">
                {t('publishedOn')} {formatDate(project.publishedAt)}
              </p>
            )}
          </div>

          {/* Abstract */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('abstractTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{project.abstract}</p>
            </CardContent>
          </Card>

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('linksTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.links.map((link: any, index: number) => (
                  <Button key={index} variant="outline" size="sm" asChild className="w-full justify-start">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {link.label}
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('metricsTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {project.metrics.map((metric: any, index: number) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-sm text-muted-foreground">{metric.name}</span>
                      <span className="text-2xl font-bold">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <MDXContent code={project.body.code} />
          </div>
        </div>
      </Section>
    </>
  );
}
