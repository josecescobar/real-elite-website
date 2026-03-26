import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS, ALL_SERVICE_AREAS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: `Roofing in Eastern Panhandle, WV | ${BUSINESS.name}`,
  description:
    'Expert roof replacement and repair with premium architectural shingles. Protect your home with professional roofing installation in the Eastern Panhandle.',
  keywords: [
    'roofing',
    'roof replacement',
    'roof repair',
    'architectural shingles',
    'roofing contractor',
    'Martinsburg',
    'Charles Town',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/services/roofing`,
  },
  openGraph: {
    title: `Roofing in Eastern Panhandle, WV | ${BUSINESS.name}`,
    description:
      'Expert roof replacement and repair with premium architectural shingles. Protect your home with professional roofing installation.',
    url: `${BUSINESS.url}/services/roofing`,
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
      name: 'How much does a new roof cost in the Eastern Panhandle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The cost varies based on roof size, materials, and complexity. Most residential roof replacements in the Eastern Panhandle range from $8,000 to $20,000. Contact us for a free estimate specific to your home.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a roof replacement take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most residential roof replacements are completed in 1-3 days, depending on the size and complexity of the project.',
      },
    },
    {
      '@type': 'Question',
      name: 'What roofing materials do you use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We primarily install premium architectural shingles from GAF and Owens Corning, which offer superior durability and manufacturer warranties.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you handle insurance claims for storm damage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we work directly with your insurance company to simplify the claims process for storm-damaged roofs.',
      },
    },
  ],
};

const faqs = [
  {
    question: 'How much does a new roof cost in the Eastern Panhandle?',
    answer: 'The cost varies based on roof size, materials, and complexity. Most residential roof replacements in the Eastern Panhandle range from $8,000 to $20,000. Contact us for a free estimate specific to your home.',
  },
  {
    question: 'How long does a roof replacement take?',
    answer: 'Most residential roof replacements are completed in 1-3 days, depending on the size and complexity of the project.',
  },
  {
    question: 'What roofing materials do you use?',
    answer: 'We primarily install premium architectural shingles from GAF and Owens Corning, which offer superior durability and manufacturer warranties.',
  },
  {
    question: 'Do you handle insurance claims for storm damage?',
    answer: 'Yes, we work directly with your insurance company to simplify the claims process for storm-damaged roofs.',
  },
];

const roofingServices = [
  'Architectural shingles installation',
  'Flat roofing solutions',
  'Roof repairs and leak fixes',
  'Storm damage assessment and repair',
  'Gutter installation and maintenance',
  'Roof inspections',
];

const whyChooseUs = [
  'Premium materials from industry-leading manufacturers',
  'Licensed and insured roofing specialists',
  'Workmanship guarantees on all installations',
];

export default function RoofingPage() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-4">Roofing Services</h1>
          <p className="text-lg text-white max-w-2xl">
            Complete roof replacement and repair with premium architectural shingles
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Your roof is one of the most important investments in your home's protection and
                curb appeal. At Real Elite Contracting, we deliver expert roofing services using
                only premium architectural shingles that combine durability, aesthetics, and
                superior weather protection.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you need a complete roof replacement, storm damage repair, or gutter work,
                our experienced team handles every project with precision and care. We understand
                that roofing is a significant decision, which is why we provide detailed inspections,
                honest recommendations, and transparent pricing.
              </p>
            </div>

            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/roofing-hero.jpg"
                alt="Completed dark architectural shingle roof with clean ridge cap"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
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
            {roofingServices.map((service, index) => (
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

      {/* Project Gallery Strip */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8">
            Recent Roofing Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/roofing-valley.jpg" alt="Roof valley and flashing detail" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/roofing-slope.jpg" alt="New charcoal shingle roof slope" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/roofing-crew.jpg" alt="Roofing crew working on residential roof" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8">
            Why Choose Real Elite for Roofing?
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
            Roofing Services Across the Region
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
                Ready for a Roof That Lasts?
              </h2>
              <p className="text-lg text-gold-300 mb-8">
                Schedule your free roofing inspection and estimate. Our team will assess your
                roof's condition and provide honest recommendations tailored to your home and
                budget.
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

            <EstimateForm service="roofing" />
          </div>
        </div>
      </section>
    </>
  );
}
