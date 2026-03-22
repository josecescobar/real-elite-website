import type { Metadata } from 'next';
import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: `Custom Deck Construction | ${BUSINESS.name}`,
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
  openGraph: {
    title: `Custom Deck Construction | ${BUSINESS.name}`,
    description:
      'Custom deck design and construction using premium materials. Expand your living space with a beautiful outdoor area.',
    url: `${BUSINESS.url}/services/decks`,
    type: 'website',
  },
};

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
