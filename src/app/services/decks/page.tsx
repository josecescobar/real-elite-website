import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS, ALL_SERVICE_AREAS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: `Decks in Eastern Panhandle, WV | ${BUSINESS.name}`,
  description:
    'Custom deck design and construction with premium materials. Expand your living space and create the outdoor area of your dreams.',
  keywords: [
    'deck construction',
    'deck building',
    'custom decks',
    'pressure-treated decks',
    'composite decking',
    'deck repairs',
    'Eastern Panhandle',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/services/decks`,
  },
  openGraph: {
    title: `Decks in Eastern Panhandle, WV | ${BUSINESS.name}`,
    description:
      'Custom deck design and construction using premium materials. Expand your living space with a beautiful outdoor area.',
    url: `${BUSINESS.url}/services/decks`,
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
      name: 'How much does a new deck cost in WV?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Deck costs vary based on size, materials, and design complexity. A standard pressure-treated wood deck typically ranges from $5,000 to $15,000, while composite decking ranges from $10,000 to $25,000 or more. Contact us for a free estimate specific to your project.',
      },
    },
    {
      '@type': 'Question',
      name: 'What deck materials do you recommend?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We build with both pressure-treated lumber and composite decking materials. Pressure-treated wood is a budget-friendly, durable option. Composite decking (like Trex or TimberTech) costs more upfront but requires virtually no maintenance and lasts decades. We help you choose the best fit for your budget and lifestyle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a permit for a deck in West Virginia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In most cases, yes. Decks over a certain height or size typically require a building permit in West Virginia. Real Elite Contracting handles the permitting process for you, ensuring your deck meets all local building codes and passes inspection.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build a deck?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most standard deck builds are completed in 1-2 weeks, depending on size, complexity, and weather conditions. Larger or multi-level decks may take slightly longer. We provide a realistic timeline during your free estimate consultation.',
      },
    },
  ],
};

const faqs = [
  {
    question: 'How much does a new deck cost in WV?',
    answer: 'Deck costs vary based on size, materials, and design complexity. A standard pressure-treated wood deck typically ranges from $5,000 to $15,000, while composite decking ranges from $10,000 to $25,000 or more. Contact us for a free estimate specific to your project.',
  },
  {
    question: 'What deck materials do you recommend?',
    answer: 'We build with both pressure-treated lumber and composite decking materials. Pressure-treated wood is a budget-friendly, durable option. Composite decking (like Trex or TimberTech) costs more upfront but requires virtually no maintenance and lasts decades. We help you choose the best fit for your budget and lifestyle.',
  },
  {
    question: 'Do I need a permit for a deck in West Virginia?',
    answer: 'In most cases, yes. Decks over a certain height or size typically require a building permit in West Virginia. Real Elite Contracting handles the permitting process for you, ensuring your deck meets all local building codes and passes inspection.',
  },
  {
    question: 'How long does it take to build a deck?',
    answer: 'Most standard deck builds are completed in 1-2 weeks, depending on size, complexity, and weather conditions. Larger or multi-level decks may take slightly longer. We provide a realistic timeline during your free estimate consultation.',
  },
];

const deckServices = [
  'Pressure-treated lumber decks',
  'Composite decking solutions',
  'Multi-level deck designs',
  'Deck repairs and refinishing',
  'Custom railings and stairs',
  'Deck upgrades and expansions',
];

const whyChooseUs = [
  'Custom designs tailored to your home and lifestyle',
  'Premium materials that resist weather and last for years',
  'Expert craftsmanship with attention to detail and structural integrity',
];

export default function DecksPage() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-4">Custom Deck Construction</h1>
          <p className="text-lg text-white max-w-2xl">
            Build the outdoor living space you've always wanted
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                A well-built deck extends your living space and becomes the heart of outdoor
                entertainment. Real Elite Contracting specializes in custom deck design and
                construction that seamlessly integrates with your home while providing years of
                enjoyment.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                From traditional pressure-treated lumber decks to modern composite options, we
                understand the unique demands of Eastern Panhandle weather. We build decks that are
                not only beautiful but built to last, with proper support structures, superior
                craftsmanship, and quality railings that prioritize safety and aesthetics.
              </p>
            </div>

            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/deck-night-lights.jpg"
                alt="Finished deck with solar post lights at night"
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
            {deckServices.map((service, index) => (
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
            Recent Deck Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/deck-lounge.jpg" alt="Deck with outdoor lounge furniture" fill className="object-cover" />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/deck-finished-railings.jpg" alt="Composite deck with white railings" fill className="object-cover" />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/deck-railing-install.jpg" alt="Installing white railing on deck" fill className="object-cover" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8">
            Why Choose Real Elite for Decks?
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
            Deck Building Services Across the Region
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
                Let's Build Your Dream Deck
              </h2>
              <p className="text-lg text-gold-300 mb-8">
                Schedule a free consultation and deck design estimate. We'll discuss your vision,
                explore material options, and create a plan that fits your budget and lifestyle.
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

            <EstimateForm service="decks" />
          </div>
        </div>
      </section>
    </>
  );
}
