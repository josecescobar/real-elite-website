import type { Metadata } from 'next';
import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: `Home Additions | ${BUSINESS.name}`,
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
  openGraph: {
    title: `Home Additions | ${BUSINESS.name}`,
    description:
      'Home additions that seamlessly blend with your existing structure. Add the space your family needs.',
    url: `${BUSINESS.url}/services/additions`,
    type: 'website',
  },
};

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
