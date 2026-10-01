import Link from 'next/link';
import Container from '@/components/shared/Container';
import { buildMetadata } from '@/lib/seo';
import { BUSINESS } from '@/lib/constants';
import PhoneLink from '@/components/analytics/PhoneLink';
import { SMS_CONSENT_TEXT, SMS_VERBAL_OPT_IN_SCRIPT } from '@/lib/sms-consent';

export const metadata = buildMetadata({
  path: '/sms-terms',
  title: `Terms & Conditions | ${BUSINESS.name}`,
  description:
    'Terms for Real Elite Contracting customer update texts, including opt-in, message frequency, rates, and how to stop messages.',
});

const PROGRAM_NAME = 'Real Elite Contracting customer updates';

const sections = [
  {
    title: 'SMS Terms',
    body: [
      PROGRAM_NAME,
      'These messages are call follow-ups, estimate scheduling, and project updates from Real Elite Contracting. They are about a conversation, estimate, or job you already have with us.',
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
            SMS Terms
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Terms &amp; Conditions
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
              cover texts from Real Elite Contracting LLC ({BUSINESS.name}) about your call, estimate, or project.
            </div>

            {sections.slice(0, 1).map((section) => (
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

            <section id="how-you-opt-in">
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-4">
                How you opt in
              </h2>
              <div className="space-y-4 text-charcoal-600 leading-relaxed">
                <p>
                  We text you only after one of these two opt-ins. Consent is not a condition of
                  purchase.
                </p>
                <h3 className="font-heading text-xl font-extrabold text-navy-800">Phone call</h3>
                <p>Our phone assistant reads this script, and we text only if you say yes:</p>
                <blockquote className="border-l-4 border-gold-300 pl-4 text-navy-800">
                  {SMS_VERBAL_OPT_IN_SCRIPT}
                </blockquote>
                <h3 className="font-heading text-xl font-extrabold text-navy-800">Web form</h3>
                <p>
                  The{' '}
                  <Link className="font-semibold text-navy-800 underline" href="/estimate">
                    estimate form
                  </Link>{' '}
                  includes a separate optional checkbox. It starts unchecked, and you can submit
                  the form without checking it. The same checkbox is on the contact page and on
                  service-page estimate forms. The checkbox says:
                </p>
                <blockquote className="border-l-4 border-gold-300 pl-4 text-navy-800">
                  {SMS_CONSENT_TEXT}
                </blockquote>
              </div>
            </section>

            {sections.slice(1).map((section) => (
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
