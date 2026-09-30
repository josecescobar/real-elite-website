import Link from 'next/link';
import Container from '@/components/shared/Container';
import { buildMetadata } from '@/lib/seo';
import { BUSINESS } from '@/lib/constants';
import PhoneLink from '@/components/analytics/PhoneLink';

export const metadata = buildMetadata({
  path: '/sms-terms',
  title: `Text Messaging Terms | ${BUSINESS.name}`,
  description:
    'Terms for Real Elite Contracting customer update texts, including opt-in, message frequency, rates, and how to stop messages.',
});

const PROGRAM_NAME = 'Real Elite Contracting customer updates';

const sections = [
  {
    title: 'Program',
    body: [
      PROGRAM_NAME,
      'These messages are call follow-ups, estimate scheduling, and project updates from Real Elite Contracting. They are about a conversation, estimate, or job you already have with us.',
    ],
  },
  {
    title: 'How you opt in',
    body: [
      'You opt in by calling us and agreeing on the call, or by checking the text-consent box on the quote form. Checking that box or agreeing on the call is how we get permission to text the number you gave us. Consent is not required to request a quote or to buy services.',
    ],
  },
  {
    title: 'Message frequency',
    body: ['Message frequency varies. It depends on your call, estimate, and project.'],
  },
  {
    title: 'Rates',
    body: ['Message and data rates may apply. Your carrier sets those rates. We do not charge a fee to send or receive these texts.'],
  },
  {
    title: 'STOP and HELP',
    body: [
      'Reply STOP to opt out. After STOP, we will not send more texts in this program to that number.',
      'Reply HELP for help. You can also contact us using the support details below.',
    ],
  },
  {
    title: 'Privacy',
    body: [
      'No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.',
    ],
  },
];

export default function SmsTermsPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <Container size="wide">
          <p className="text-brand-red-light text-xs uppercase tracking-[0.18em] font-semibold mb-4">
            Customer texts
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Text Messaging Terms
          </h1>
          <p className="text-charcoal-200 mt-5 max-w-2xl leading-relaxed">
            How {PROGRAM_NAME} works, including how you opt in and how you stop messages.
          </p>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl space-y-10">
            <div className="rounded-lg border border-gold-300 bg-gold-50 p-5 text-sm text-charcoal-700 leading-relaxed">
              <strong className="text-navy-800">Effective September 30, 2026.</strong> These terms
              cover texts from {BUSINESS.name} about your call, estimate, or project.
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
                Support
              </h2>
              <p className="text-charcoal-600 leading-relaxed">
                Contact{' '}
                <a className="font-semibold text-navy-800 underline" href={`mailto:${BUSINESS.email}`}>
                  {BUSINESS.email}
                </a>{' '}
                or call{' '}
                <PhoneLink className="font-semibold text-navy-800 underline" location="sms_terms_body">
                  {BUSINESS.phone}
                </PhoneLink>
                . Read how we handle information in our{' '}
                <Link className="font-semibold text-navy-800 underline" href="/privacy">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}
