import { Section } from '@/components/ui/section';
import { generateSEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return generateSEO({
    title: 'Privacy Policy - Open Campus',
    description: 'Privacy policy for Open Campus.',
    path: '/legal/privacy',
    locale: params.locale,
  });
}

export default function PrivacyPage() {
  return (
    <Section aria-labelledby="privacy-title" className="pt-20">
      <article className="prose prose-invert mx-auto max-w-4xl">
        <h1 id="privacy-title">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated:{' '}
          <time dateTime="2025-10-11">October 11, 2025</time>
        </p>

        <h2>Introduction</h2>
        <p>
          Open Campus (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
          respects your privacy. This policy explains what data we collect,
          how we use it, and the rights you may have when using our platform.
          It applies to <code>opencampus.example</code> and its subdomains. Some
          features may include additional in-product notices.
        </p>

        <h2>Who We Are</h2>
        <ul>
          <li><strong>Controller:</strong> Open Campus</li>
          <li>
            <strong>Contact:</strong>{' '}
            <a href="mailto:privacy@opencampus.example">privacy@opencampus.example</a>
          </li>
        </ul>

        <h2>Information We Collect</h2>
        <h3>Information You Provide</h3>
        <ul>
          <li>Account details (name, email, password hash)</li>
          <li>Profile information (username, avatar, bio, preferences)</li>
          <li>Content you create or submit (courses, posts, comments, files)</li>
          <li>Forms and applications (fellow, event registrations, contact messages)</li>
          <li>Communication with us (support requests, feedback)</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <ul>
          <li>Usage analytics (pages viewed, clicks, timestamps)</li>
          <li>Device and browser information (OS, browser type/version)</li>
          <li>IP address and coarse location (derived from IP)</li>
          <li>Logs and diagnostic data (error/performance telemetry)</li>
          <li>Cookies and similar technologies (see &quot;Cookies&quot;)</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>Provide and operate the service (authentication, authorization, profiles)</li>
          <li>Community features (enrollments, progress tracking, comments, ratings)</li>
          <li>Personalize content and recommendations</li>
          <li>Security and abuse prevention (rate limiting, fraud detection)</li>
          <li>Analytics, debugging, and product improvement</li>
          <li>Legal compliance and record keeping</li>
          <li>Marketing/newsletters with your consent</li>
        </ul>

        <h2>Legal Bases (GDPR/UK GDPR)</h2>
        <ul>
          <li><strong>Contract:</strong> To create and operate your account and deliver the service.</li>
          <li><strong>Legitimate interests:</strong> Security, fraud prevention, product improvement.</li>
          <li><strong>Consent:</strong> Newsletters/marketing and optional cookies.</li>
          <li><strong>Legal obligation:</strong> Tax/audit and statutory requirements.</li>
        </ul>

        <h2>Cookies</h2>
        <ul>
          <li><strong>Strictly necessary:</strong> Session/auth cookies required for core functionality.</li>
          <li><strong>Preferences:</strong> Theme, language and similar settings.</li>
          <li><strong>Analytics:</strong> Aggregated traffic and performance statistics.</li>
        </ul>
        <p>
          You can manage cookies in your browser. Disabling strictly necessary cookies may break
          essential functionality.
        </p>

        <h2>AI Features</h2>
        <p>
          Certain features (e.g., recommendations, summaries, assistants) use AI components.
          Your inputs/interactions may be processed to generate outputs. By default, our AI
          providers are contractually restricted from using your data to train base models.
          AI outputs can be imperfect; you remain responsible for final decisions.
        </p>

        <h2>Information Sharing</h2>
        <p>We do not sell your personal information. We may share information:</p>
        <ul>
          <li>With service providers (hosting, email, analytics) acting under our instructions</li>
          <li>To comply with laws or lawful requests</li>
          <li>To protect rights, property, and safety of users and the public</li>
          <li>In connection with corporate transactions (with appropriate notice)</li>
        </ul>
        <p>
          A current list of subprocessors will be published at{' '}
          <code>/legal/subprocessors</code> when available.
        </p>

        <h2>International Transfers</h2>
        <p>
          Data may be transferred to countries where our providers operate. We use appropriate
          safeguards (e.g., Standard Contractual Clauses) and technical/organizational measures.
        </p>

        <h2>Retention</h2>
        <ul>
          <li>Account data: while the account remains active</li>
          <li>Legal/financial records: as required by applicable laws</li>
          <li>Upon deletion request: delete or anonymize within a reasonable timeframe unless retention is legally required</li>
        </ul>

        <h2>Security</h2>
        <ul>
          <li>Encryption in transit and at rest (where appropriate)</li>
          <li>Access controls, audit logs, least-privilege access</li>
          <li>Regular patching, monitoring, and vulnerability management</li>
        </ul>
        <p>
          No method is 100% secure. If a breach occurs, we will notify you and authorities as legally required.
        </p>

        <h2>Your Rights</h2>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify inaccurate or incomplete data</li>
          <li>Request deletion (subject to legal obligations)</li>
          <li>Restrict or object to processing based on legitimate interests</li>
          <li>Data portability for certain data</li>
          <li>Withdraw consent for consent-based processing</li>
        </ul>
        <p>
          To exercise rights, email{' '}
          <a href="mailto:privacy@opencampus.example">privacy@opencampus.example</a>. We may
          need to verify your identity and may be subject to legal exceptions.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          The service is not directed to children under 13 (or the minimum age in your jurisdiction).
          We do not knowingly collect data from children; if discovered, we will delete it.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. The date above reflects the latest version.
          For material changes, we will provide additional notice.
        </p>

        <h2>Contact Us</h2>
        <p>
          Questions or requests:{' '}
          <a href="mailto:privacy@opencampus.example">privacy@opencampus.example</a>
        </p>

        <hr />

        <h3>Quick Summary</h3>
        <ul>
          <li>We process data to run, secure, and improve the service.</li>
          <li>We do <strong>not</strong> sell personal data; subprocessors operate under strict terms.</li>
          <li>You control consent-based areas and can exercise privacy rights anytime.</li>
        </ul>
      </article>
    </Section>
  );
}
