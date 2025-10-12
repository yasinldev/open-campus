import { useTranslations } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateSEO } from '@/lib/seo';
import { Code, GitPullRequest, Bug } from 'lucide-react';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return generateSEO({
    title: 'Contribute - Open Campus',
    description: 'Contribute to Open Campus and help build the future of education.',
    path: '/contribute',
    locale: params.locale,
  });
}

export default function ContributePage() {
  const t = useTranslations('contribute');

  return (
    <>
      <Section className="pt-20">
        <SectionHeader title={t('title')} subtitle={t('subtitle')} />

        <div className="mx-auto max-w-4xl space-y-8">
          <Card>
            <CardHeader>
              <Code className="mb-4 h-10 w-10 text-primary" />
              <CardTitle>{t('howToTitle')}</CardTitle>
              <CardDescription>{t('howToDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Code Contributions</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Fix bugs and issues</li>
                  <li>Add new features</li>
                  <li>Improve documentation</li>
                  <li>Optimize performance</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Content Contributions</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Create new courses</li>
                  <li>Write blog posts</li>
                  <li>Improve existing content</li>
                  <li>Translate materials</li>
                </ul>
              </div>
              <Button asChild>
                <a href="https://github.com/opencampus" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Bug className="mb-4 h-10 w-10 text-primary" />
              <CardTitle>{t('issuesTitle')}</CardTitle>
              <CardDescription>{t('issuesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Check out issues labeled "good first issue" or "help wanted" on our GitHub
                repository. These are great entry points for new contributors!
              </p>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/opencampus/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Browse Issues
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <GitPullRequest className="mb-4 h-10 w-10 text-primary" />
              <CardTitle>Contribution Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ol className="list-inside list-decimal space-y-2">
                <li>Fork the repository</li>
                <li>Create a feature branch (git checkout -b feature/amazing-feature)</li>
                <li>Make your changes</li>
                <li>Write or update tests</li>
                <li>Ensure all tests pass (npm test)</li>
                <li>Commit your changes (git commit -m 'Add amazing feature')</li>
                <li>Push to your branch (git push origin feature/amazing-feature)</li>
                <li>Open a Pull Request</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
