import { Section } from '@/components/ui/section';
import { generateSEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return generateSEO({
    title: 'Terms of Service - Open Campus',
    description: 'Terms of service for Open Campus.',
    path: '/legal/terms',
    locale: params.locale,
  });
}

export default function TermsPage() {
  return (
    <Section aria-labelledby="terms-title" className="pt-20">
      <article className="prose prose-invert mx-auto max-w-4xl">
        <h1 id="terms-title">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: <time dateTime="2025-10-11">October 11, 2025</time>
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Open Campus (<strong>&quot;Service&quot;</strong>), you agree to be
          bound by these Terms of Service (<strong>&quot;Terms&quot;</strong>) and all applicable
          laws. If you do not agree, do not use the Service.
        </p>

        <h2>2. Eligibility</h2>
        <ul>
          <li>You must be at least 13 years old (or the age of digital consent in your region).</li>
          <li>You represent that you have the authority to agree to these Terms.</li>
        </ul>

        <h2>3. Accounts</h2>
        <ul>
          <li>You are responsible for safeguarding your account and credentials.</li>
          <li>Provide accurate, current information and keep it updated.</li>
          <li>One natural person per account; do not share credentials.</li>
          <li>We may suspend or terminate accounts for violations (see Section 11).</li>
        </ul>

        <h2>4. License and Access</h2>
        <p>
          Subject to these Terms, we grant you a limited, non-exclusive, non-transferable,
          revocable license to access and use the Service for personal, non-commercial educational
          purposes. We reserve all rights not expressly granted to you.
        </p>

        <h2>5. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Violate any applicable law or regulation.</li>
          <li>Infringe, misappropriate, or violate intellectual property or privacy rights.</li>
          <li>Upload or transmit malware, harmful code, or spam.</li>
          <li>Harass, threaten, or harm others; post illegal or abusive content.</li>
          <li>Attempt to breach security or probe systems without authorization.</li>
          <li>Use automated scraping/crawling except as permitted by robots.txt or our APIs.</li>
          <li>Bypass rate limits or abuse free tiers/trials.</li>
        </ul>

        <h2>6. Your Content</h2>
        <p>
          You retain ownership of content you submit (<strong>&quot;User Content&quot;</strong>).
          You grant Open Campus a worldwide, non-exclusive, royalty-free license to host, store,
          reproduce, modify (e.g., format/resize), display, and distribute your User Content solely
          to operate and improve the Service. You are responsible for your User Content and must
          have necessary rights to grant this license.
        </p>

        <h2>7. Our Content and Open Source</h2>
        <p>
          The Service, its design, and original content are protected by intellectual property laws.
          Some components may be offered under separate open-source licenses; those licenses govern
          the use of those components. Where indicated, please comply with the specific license
          terms attached to code or content items.
        </p>

        <h2>8. AI Features</h2>
        <p>
          The Service may include AI-powered features (assistants, summaries, recommendations).
          Outputs can be inaccurate, incomplete, or unsuitable. You are responsible for evaluating
          outputs before relying on them. Unless explicitly stated, AI outputs are provided
          <em>as-is</em> without warranties (see Section 10).
        </p>

        <h2>9. Third-Party Services</h2>
        <p>
          The Service may integrate third-party services (e.g., hosting, email, analytics, OAuth).
          Your use of such services may be subject to their terms and policies. We are not
          responsible for third-party services beyond our contractual obligations.
        </p>

        <h2>10. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED <strong>&quot;AS IS&quot;</strong> AND <strong>&quot;AS AVAILABLE&quot;</strong>.
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED,
          INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT. We do not warrant uninterrupted, secure, or error-free operation.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, OPEN CAMPUS AND ITS AFFILIATES SHALL NOT BE
          LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES,
          OR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE
          OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>

        <h2>12. Suspension and Termination</h2>
        <ul>
          <li>
            We may suspend or terminate your access immediately for violations of these Terms, risk
            to the Service or users, unlawful activity, or as required by law.
          </li>
          <li>
            You may terminate at any time by closing your account. Some provisions survive
            termination (e.g., Sections 6–7 and 10–16).
          </li>
        </ul>

        <h2>13. Intellectual Property Notices and Takedowns</h2>
        <p>
          If you believe content infringes your rights, contact{' '}
          <a href="mailto:legal@opencampus.example">legal@opencampus.example</a> with sufficient
          detail to identify the material and your rights. We may remove content and, where
          appropriate, notify the submitter.
        </p>

        <h2>14. Changes to the Service and Terms</h2>
        <p>
          We may modify or discontinue features at any time. We may update these Terms; material
          changes will be notified via the Service or email. Continued use after changes constitutes
          acceptance of the updated Terms.
        </p>

        <h2>15. Governing Law; Venue</h2>
        <p>
          These Terms are governed by the laws applicable in your place of residence or, if
          specified by a local notice on the Site, the laws of that specified jurisdiction, without
          regard to conflict-of-law principles. Jurisdiction and venue will lie in the competent
          courts of that jurisdiction unless mandatory consumer protection laws provide otherwise.
        </p>

        <h2>16. Miscellaneous</h2>
        <ul>
          <li>
            <strong>Entire Agreement:</strong> These Terms are the entire agreement between you and
            us regarding the Service.
          </li>
          <li>
            <strong>Severability:</strong> If any provision is unenforceable, the remainder remains
            in effect.
          </li>
          <li>
            <strong>No Waiver:</strong> Failure to enforce a provision is not a waiver of our right
            to do so later.
          </li>
          <li>
            <strong>Assignment:</strong> You may not assign these Terms without our consent. We may
            assign under customary business conditions (e.g., merger, acquisition).
          </li>
          <li>
            <strong>Contact:</strong>{' '}
            <a href="mailto:legal@opencampus.example">legal@opencampus.example</a>
          </li>
        </ul>
      </article>
    </Section>
  );
}
