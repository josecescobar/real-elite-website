import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS, ALL_SERVICE_AREAS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: `Home Remodeling in Eastern Panhandle, WV | ${BUSINESS.name}`,
  description:
    'Interior and exterior remodeling that modernizes your home. Kitchen, bathroom, and full home renovations with expert craftsmanship.',
  keywords: [
    'home remodeling',
    'kitchen remodel',
    'bathroom remodel',
    'basement finishing',
    'home renovation',
    'interior remodeling',
    'Eastern Panhandle',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/services/remodeling`,
  },
  openGraph: {
    title: `Home Remodeling in Eastern Panhandle, WV | ${BUSINESS.name}`,
    description:
      'Interior and exterior remodeling that modernizes your home. Kitchens, bathrooms, and full home renovations.',
    url: `${BUSINESS.url}/services/remodeling`,
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
      name: 'How much does a kitchen remodel cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kitchen remodel costs vary widely based on scope and materials. A minor kitchen update in the Eastern Panhandle typically starts around $10,000, while a full kitchen remodel can range from $20,000 to $50,000 or more. We provide detailed, transparent estimates before any work begins.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a home remodel take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Timelines depend on the scope of the project. A bathroom remodel typically takes 2-4 weeks, a kitchen remodel 4-8 weeks, and a full home renovation can take several months. We provide a realistic timeline during your consultation and keep you updated throughout the project.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you handle permits for remodeling projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we handle all necessary permits and ensure your remodeling project meets local building codes. Proper permitting protects your investment and ensures the work is done safely and to code.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I live in my home during a remodel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In most cases, yes. We take steps to minimize disruption — containing dust, maintaining access to essential rooms, and cleaning up daily. For major renovations that affect kitchens or bathrooms, we work with you to plan around your daily routine.',
      },
    },
  ],
};

const faqs = [
  {
    question: 'How much does a kitchen remodel cost?',
    answer: 'Kitchen remodel costs vary widely based on scope and materials. A minor kitchen update in the Eastern Panhandle typically starts around $10,000, while a full kitchen remodel can range from $20,000 to $50,000 or more. We provide detailed, transparent estimates before any work begins.',
  },
  {
    question: 'How long does a home remodel take?',
    answer: 'Timelines depend on the scope of the project. A bathroom remodel typically takes 2-4 weeks, a kitchen remodel 4-8 weeks, and a full home renovation can take several months. We provide a realistic timeline during your consultation and keep you updated throughout the project.',
  },
  {
    question: 'Do you handle permits for remodeling projects?',
    answer: 'Yes, we handle all necessary permits and ensure your remodeling project meets local building codes. Proper permitting protects your investment and ensures the work is done safely and to code.',
  },
  {
    question: 'Can I live in my home during a remodel?',
    answer: 'In most cases, yes. We take steps to minimize disruption — containing dust, maintaining access to essential rooms, and cleaning up daily. For major renovations that affect kitchens or bathrooms, we work with you to plan around your daily routine.',
  },
];

const remodelingServices = [
  'Kitchen remodeling and updates',
  'Bathroom renovation and design',
  'Basement finishing and development',
  'Interior updates and modernization',
  'Flooring installation',
  'Custom built-ins and storage solutions',
];

const whyChooseUs = [
  'Full project management from design through completion',
  'Quality materials and skilled trades for lasting results',
  'Transparent communication and realistic timelines',
];

export default function RemodelingPage() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-4">Home Remodeling</h1>
          <p className="text-lg text-white max-w-2xl">
            Modernize your home with expert interior and exterior remodeling
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Your home should grow and evolve with your family's needs. Real Elite Contracting
                specializes in kitchen remodels, bathroom renovations, basement finishing, and
                complete interior updates that transform your living spaces while maintaining the
                integrity and character of your home.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you're looking to increase home value, improve functionality, or simply
                create a more beautiful space, we approach every remodeling project with careful
                planning and attention to detail. We manage every aspect—from design consultation
                through final inspections—ensuring your project stays on schedule and within budget.
              </p>
            </div>

            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/flooring-dark-living.jpg"
                alt="Dark laminate flooring installed in remodeled living room"
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
            {remodelingServices.map((service, index) => (
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
            Why Choose Real Elite for Remodeling?
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
            Remodeling Services Across the Region
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
                Ready to Remodel?
              </h2>
              <p className="text-lg text-gold-300 mb-8">
                Schedule your free remodeling consultation. We'll tour your home, discuss your
                vision, and create a detailed plan for your project with transparent pricing.
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

            <EstimateForm service="remodeling" />
          </div>
        </div>
      </section>
    </>
  );
}
