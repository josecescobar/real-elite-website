import Link from 'next/link';
import Container from '@/components/shared/Container';
import { buildMetadata } from '@/lib/seo';
import { BUSINESS } from '@/lib/constants';

export const metadata = buildMetadata({
  path: '/privacy',
  title: `Privacy Policy | ${BUSINESS.name}`,
  description:
    'How Real Elite Contracting collects, uses, protects, and shares information submitted through this website.',
});

const sections = [
  {
    title: 'Information we collect',
    body: [
      'When you request an estimate, roof quote, consultation, or other service, we may collect your name, email address, phone number, project address or ZIP code, project details, timing, and budget range.',
      'We also collect limited technical and attribution information such as the page you entered on, referring website, campaign tags, browser information, and site interactions. We do not intentionally collect sensitive personal information through this website.',
    ],
  },
  {
    title: 'How we use information',
    body: [
      'We use submitted information to respond to your request, prepare or confirm estimates, schedule conversations and site visits, provide customer service, improve our website, understand which marketing produces qualified inquiries, prevent abuse, and maintain business records.',
      'Submitting a form authorizes us to contact you about that request by phone, email, or text. We do not sell or rent personal information, and we do not enroll form submissions in unrelated marketing campaigns without additional permission.',
    ],
  },
  {
    title: 'Service providers',
    body: [
      'We use trusted providers to operate the website and deliver requested services. Depending on which features are configured, these may include Vercel for hosting, Google Analytics for site measurement, Resend for email delivery, Twilio for call and text delivery, Supabase for lead records, Upstash for abuse prevention, and Google Maps or Solar APIs for address and roof measurements.',
      'These providers receive only the information needed to perform their function and process it under their own privacy and security terms.',
    ],
  },
  {
    title: 'Cookies and analytics',
    body: [
      'The website may use cookies or similar browser storage for analytics, campaign attribution, security, and essential site behavior. You can restrict cookies through your browser settings, though some measurement and convenience features may no longer work as intended.',
    ],
  },
  {
    title: 'Retention and security',
    body: [
      'We keep inquiry and project information only as long as reasonably necessary for customer service, estimating, business records, dispute prevention, and legal obligations. We use administrative and technical safeguards designed to protect that information, but no online system can guarantee absolute security.',
    ],
  },
  {
    title: 'Your choices',
    body: [
      `You may ask what information we hold about you, request a correction or deletion where applicable, or ask us to stop non-essential contact by emailing ${BUSINESS.email}. Transactional messages about an active estimate or project may still be necessary.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="wide">
          <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
            Your Information
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-charcoal-200 mt-5 max-w-2xl leading-relaxed">
            A plain-language explanation of what this website collects and how Real Elite
            Contracting uses it.
          </p>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl space-y-10">
            <div className="rounded-lg border border-gold-300 bg-gold-50 p-5 text-sm text-charcoal-700 leading-relaxed">
              <strong className="text-navy-800">Effective July 12, 2026.</strong> This policy is
              drafted from the website&apos;s current data flows and should be reviewed whenever a
              new analytics, messaging, financing, or customer-data provider is added.
            </div>

            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-4 text-charcoal-600 leading-relaxed">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-4">
                Contact us
              </h2>
              <p className="text-charcoal-600 leading-relaxed">
                Questions or privacy requests can be sent to{' '}
                <a className="font-semibold text-navy-800 underline" href={`mailto:${BUSINESS.email}`}>
                  {BUSINESS.email}
                </a>{' '}
                or discussed by calling{' '}
                <a className="font-semibold text-navy-800 underline" href={`tel:${BUSINESS.phoneRaw}`}>
                  {BUSINESS.phone}
                </a>
                . You can also return to the <Link className="font-semibold text-navy-800 underline" href="/contact">contact page</Link>.
              </p>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}
