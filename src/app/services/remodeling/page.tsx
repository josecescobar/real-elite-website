import type { Metadata } from 'next';
import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight } from 'lucide-react';

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
  openGraph: {
    title: `Home Remodeling in Eastern Panhandle, WV | ${BUSINESS.name}`,
    description:
      'Interior and exterior remodeling that modernizes your home. Kitchens, bathrooms, and full home renovations.',
    url: `${BUSINESS.url}/services/remodeling`,
    type: 'website',
  },
};

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
