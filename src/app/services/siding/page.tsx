import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS, ALL_SERVICE_AREAS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: `Siding in Eastern Panhandle, WV | ${BUSINESS.name}`,
  description:
    'Professional vinyl, fiber cement, and wood siding installation. Transform your home\'s exterior with expert craftsmanship and premium materials.',
  keywords: [
    'siding installation',
    'siding repair',
    'vinyl siding',
    'fiber cement siding',
    'James Hardie',
    'wood siding',
    'Eastern Panhandle contractor',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/services/siding`,
  },
  openGraph: {
    title: `Siding in Eastern Panhandle, WV | ${BUSINESS.name}`,
    description:
      'Professional siding installation that transforms your home\'s exterior and boosts curb appeal.',
    url: `${BUSINESS.url}/services/siding`,
    type: 'website',
    images: [{ url: 'https://www.realelitecontracting.com/images/og-image.jpg', width: 1200, height: 630 }],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does new siding cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Siding costs depend on material, home size, and complexity. Vinyl siding typically ranges from $5,000 to $15,000, while fiber cement (James Hardie) ranges from $10,000 to $25,000 for a full installation. Contact us for a free estimate tailored to your home.',
      },
    },
    {
      '@type': 'Question',
      name: 'What siding materials do you offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We install vinyl siding, fiber cement siding (including James Hardie), and wood siding. Each material has unique benefits — we help you choose the best option based on your budget, style preferences, and maintenance expectations.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does siding installation take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most full siding installations take 1-2 weeks depending on the size of your home and the material selected. Smaller repair projects can often be completed in just a day or two.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does new siding increase home value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. New siding is one of the highest-ROI home improvements you can make. According to industry data, fiber cement siding replacement can recoup over 70% of its cost at resale, while dramatically improving curb appeal and energy efficiency.',
      },
    },
  ],
};

const faqs = [
  {
    question: 'How much does new siding cost?',
    answer: 'Siding costs depend on material, home size, and complexity. Vinyl siding typically ranges from $5,000 to $15,000, while fiber cement (James Hardie) ranges from $10,000 to $25,000 for a full installation. Contact us for a free estimate tailored to your home.',
  },
  {
    question: 'What siding materials do you offer?',
    answer: 'We install vinyl siding, fiber cement siding (including James Hardie), and wood siding. Each material has unique benefits — we help you choose the best option based on your budget, style preferences, and maintenance expectations.',
  },
  {
    question: 'How long does siding installation take?',
    answer: 'Most full siding installations take 1-2 weeks depending on the size of your home and the material selected. Smaller repair projects can often be completed in just a day or two.',
  },
  {
    question: 'Does new siding increase home value?',
    answer: 'Absolutely. New siding is one of the highest-ROI home improvements you can make. According to industry data, fiber cement siding replacement can recoup over 70% of its cost at resale, while dramatically improving curb appeal and energy efficiency.',
  },
];

const sidingServices = [
  'Vinyl siding installation',
  'Fiber cement siding (James Hardie)',
  'Wood siding installation and repair',
  'Siding repair and replacement',
  'Window wrapping and trim work',
  'Complete exterior makeovers',
];

const whyChooseUs = [
  'Extensive experience with all major siding brands and materials',
  'Expert installation that maximizes durability and weather protection',
  'Transparent pricing with no hidden costs or surprises',
];

export default function SidingPage() {
  return (
    <>
      {/* FAQPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Banner */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Siding Installation & Repair</h1>
          <p className="text-lg text-white max-w-2xl">
            Transform your home's exterior with premium siding materials and expert craftsmanship
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Your home's siding is more than aesthetics—it's your first line of defense against
                the elements. Real Elite Contracting specializes in vinyl, fiber cement, and wood
                siding installation using premium materials that protect your home while enhancing
                its beauty and curb appeal.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you're upgrading dated siding, repairing storm damage, or giving your home a
                complete exterior makeover, our experienced team delivers flawless installations with
                attention to every detail. We work with leading brands like James Hardie to ensure
                your investment stands the test of time.
              </p>
            </div>

            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/siding-windows.jpg"
                alt="Siding and window replacement showing house wrap to siding transition"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
            What We Offer
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {sidingServices.map((service, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-gold-600 mt-1" />
                </div>
                <span className="text-lg text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8">
            Why Choose Real Elite for Siding?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div
                key={index}
                className="bg-navy-50 p-6 rounded-lg border-l-4 border-gold-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-gold-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-lg">{reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-navy-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8 text-center">
            Siding Services Across the Region
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {ALL_SERVICE_AREAS.map((area) => (
              <Link key={area.slug} href={`/service-areas/${area.slug}`} className="flex items-center gap-2 text-navy-700 hover:text-gold-600 transition-colors p-2">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>{area.city}, {area.state}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA and Estimate Form */}
      <section className="py-16 md:py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transform Your Home's Exterior
              </h2>
              <p className="text-lg text-gold-300 mb-8">
                Get a free estimate for your siding project. Our team will evaluate your home,
                discuss material options, and provide a detailed quote with no pressure or hidden
                costs.
              </p>
              <div className="space-y-4">
                <p className="text-white">
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:${BUSINESS.phoneRaw}`} className="text-gold-300 hover:text-gold-400">
                    {BUSINESS.phone}
                  </a>
                </p>
                <p className="text-white">
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${BUSINESS.email}`} className="text-gold-300 hover:text-gold-400">
                    {BUSINESS.email}
                  </a>
                </p>
              </div>
            </div>

            <EstimateForm service="siding" />
          </div>
        </div>
      </section>
    </>
  );
}
