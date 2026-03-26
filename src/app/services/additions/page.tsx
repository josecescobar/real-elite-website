import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS, ALL_SERVICE_AREAS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: `Home Additions in Eastern Panhandle, WV | ${BUSINESS.name}`,
  description:
    'Home additions that seamlessly blend with your existing structure. Add the space your family needs with expert design and construction.',
  keywords: [
    'home additions',
    'room additions',
    'sunrooms',
    'garage additions',
    'second story additions',
    'in-law suites',
    'Eastern Panhandle',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/services/additions`,
  },
  openGraph: {
    title: `Home Additions in Eastern Panhandle, WV | ${BUSINESS.name}`,
    description:
      'Home additions that seamlessly blend with your existing structure. Add the space your family needs.',
    url: `${BUSINESS.url}/services/additions`,
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
      name: 'How much does a home addition cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Home addition costs in the Eastern Panhandle typically range from $100 to $250 per square foot depending on the type of addition, finishes, and complexity. A simple room addition might start around $30,000, while a full second-story addition can range from $100,000 and up. We provide detailed estimates during your free consultation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a permit for a home addition?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, home additions require building permits in West Virginia. This includes structural permits, electrical, and plumbing permits depending on the scope. Real Elite Contracting handles the entire permitting process for you, ensuring full code compliance.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build an addition?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most home additions take 2-4 months from start to finish, depending on size and complexity. A simple room addition may take 6-8 weeks, while a second-story addition or in-law suite can take 3-4 months or more. We provide a detailed project timeline during your consultation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will an addition increase my home\'s value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, a well-designed home addition typically increases your home\'s value significantly. Additions that add functional living space — like bedrooms, bathrooms, or in-law suites — tend to offer the best return on investment, often recouping 50-70% or more of the project cost at resale.',
      },
    },
  ],
};

const faqs = [
  {
    question: 'How much does a home addition cost?',
    answer: 'Home addition costs in the Eastern Panhandle typically range from $100 to $250 per square foot depending on the type of addition, finishes, and complexity. A simple room addition might start around $30,000, while a full second-story addition can range from $100,000 and up. We provide detailed estimates during your free consultation.',
  },
  {
    question: 'Do I need a permit for a home addition?',
    answer: 'Yes, home additions require building permits in West Virginia. This includes structural permits, electrical, and plumbing permits depending on the scope. Real Elite Contracting handles the entire permitting process for you, ensuring full code compliance.',
  },
  {
    question: 'How long does it take to build an addition?',
    answer: 'Most home additions take 2-4 months from start to finish, depending on size and complexity. A simple room addition may take 6-8 weeks, while a second-story addition or in-law suite can take 3-4 months or more. We provide a detailed project timeline during your consultation.',
  },
  {
    question: 'Will an addition increase my home\'s value?',
    answer: 'Yes, a well-designed home addition typically increases your home\'s value significantly. Additions that add functional living space — like bedrooms, bathrooms, or in-law suites — tend to offer the best return on investment, often recouping 50-70% or more of the project cost at resale.',
  },
];

const additionServices = [
  'Room additions and expansions',
  'Sunroom and three-season room construction',
  'Garage additions and upgrades',
  'Second story additions',
  'In-law suite construction',
  'Seamless architectural integration',
];

const whyChooseUs = [
  'Expert design that matches your home\'s existing style and character',
  'Proper permitting and code compliance for all additions',
  'Quality craftsmanship that ensures lasting value',
];

export default function AdditionsPage() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-4">Home Additions</h1>
          <p className="text-lg text-white max-w-2xl">
            Expand your home and add the space your family needs
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                When your family outgrows your current home, an addition is often a smarter
                investment than moving. Real Elite Contracting specializes in home additions—from
                simple room expansions to complex second-story builds—that seamlessly integrate with
                your existing home while adding real value and functionality.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                We handle every detail: architectural design that complements your home's style,
                proper permitting and building code compliance, and meticulous construction that
                ensures your addition looks like it was always meant to be there. Whether you need
                an extra bedroom, a sunroom for year-round enjoyment, or a complete second story,
                we bring both vision and expertise to every project.
              </p>
            </div>

            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/shed-trim.jpg"
                alt="Custom built shed with siding, trim, and fall foliage"
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
            {additionServices.map((service, index) => (
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
            Why Choose Real Elite for Additions?
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
            Home Addition Services Across the Region
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
                Add Space, Add Value
              </h2>
              <p className="text-lg text-gold-300 mb-8">
                Schedule your free addition consultation. We'll evaluate your home, discuss your
                needs, and create a design plan that adds value and functionality while maintaining
                your home's character.
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

            <EstimateForm service="additions" />
          </div>
        </div>
      </section>
    </>
  );
}
