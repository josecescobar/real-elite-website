import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BUSINESS,
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  EXPANSION_SERVICE_AREAS,
} from '@/lib/constants';
import Button from '@/components/shared/Button';
import { MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: `Service Areas | ${BUSINESS.name}`,
  description:
    'We proudly serve the Eastern Panhandle of West Virginia, including Martinsburg, Inwood, Charles Town, Ranson, Hedgesville, and many other communities.',
  keywords: [
    'service areas',
    'Eastern Panhandle',
    'Martinsburg WV',
    'Charles Town WV',
    'Ranson WV',
    'Hedgesville WV',
    'Inwood WV',
    'Spring Mills WV',
    'Falling Waters WV',
    'Berkeley Springs WV',
    'Shepherdstown WV',
    'contractor service area',
    'WV contractor',
    'local contractor',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/service-areas`,
  },
  openGraph: {
    title: `Service Areas | ${BUSINESS.name}`,
    description:
      'Real Elite Contracting proudly serves the Eastern Panhandle of West Virginia.',
    url: `${BUSINESS.url}/service-areas`,
    type: 'website',
  },
};

export default function ServiceAreasPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Service Areas</h1>
          <p className="text-lg text-white max-w-2xl">
            Proudly serving the Eastern Panhandle of West Virginia and beyond
          </p>
        </div>
      </section>

      {/* Service Area Overview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8 text-center">
            We Serve the Entire Eastern Panhandle
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed text-center mb-12">
            Based in Martinsburg, West Virginia, Real Elite Contracting proudly serves homeowners
            and businesses throughout the Eastern Panhandle region. We're deeply rooted in this
            community and committed to providing the same quality craftsmanship to every customer
            within our service area, whether they're just down the street or across the region.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed text-center">
            If you don't see your specific town listed below, please contact us. We frequently work
            in surrounding areas and would be happy to discuss your project.
          </p>
        </div>
      </section>

      {/* PRIMARY SERVICE AREAS */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3 text-center">
              Primary Service Areas
            </h2>
            <p className="text-gray-700 text-center max-w-2xl mx-auto">
              Our core service territory in the Eastern Panhandle where we provide rapid response times
              and priority scheduling.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRIMARY_SERVICE_AREAS.map((area) => (
              <Link key={area.slug} href={`/service-areas/${area.slug}`}>
                <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-gold-500 h-full cursor-pointer group">
                  <div className="flex items-start gap-4 mb-4">
                    <MapPin className="w-6 h-6 text-gold-600 mt-1 flex-shrink-0 group-hover:text-gold-700" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                        {area.city}
                      </h3>
                      <p className="text-gray-600 text-sm">{area.state}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Quality roofing, siding, decks, remodeling, additions, and exterior repair services.
                  </p>
                  <div className="flex items-center text-gold-600 font-semibold group-hover:text-gold-700 transition-colors">
                    View Area Details <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECONDARY SERVICE AREAS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3 text-center">
              Secondary Service Areas
            </h2>
            <p className="text-gray-700 text-center max-w-2xl mx-auto">
              Communities we actively serve with all our residential and commercial services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECONDARY_SERVICE_AREAS.map((area) => (
              <Link key={area.slug} href={`/service-areas/${area.slug}`}>
                <div className="bg-navy-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-gray-400 h-full cursor-pointer group">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0 group-hover:text-gold-600" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                        {area.city}
                      </h3>
                      <p className="text-gray-600 text-xs">{area.state}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-navy-700 font-semibold text-sm group-hover:text-gold-600 transition-colors">
                    View Details <ArrowRight className="w-3 h-3 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EXPANSION SERVICE AREAS */}
      <section className="py-16 md:py-24 bg-navy-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">
              Expansion Service Areas
            </h2>
            <p className="text-gold-300 text-center max-w-2xl mx-auto">
              We're expanding our service footprint to reach more homeowners in Virginia and Maryland.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {EXPANSION_SERVICE_AREAS.map((area) => (
              <div
                key={area.slug}
                className="bg-navy-800 p-6 rounded-lg border border-navy-700 text-center"
              >
                <h3 className="text-lg font-bold mb-2">{area.city}</h3>
                <p className="text-gray-400 text-sm">{area.state}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Whether you're in one of our primary service areas or nearby communities, we're ready to help
            with your home improvement project. Contact us today for a free estimate.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button href="https://calendly.com/realelitecontracting-info/free-estimate-call" variant="primary" size="lg">
              Book Free Estimate
            </Button>
            <Button href="/services" variant="outline" size="lg">
              View Our Services
            </Button>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-200 space-y-3">
            <p className="text-gray-700">
              <strong>Phone:</strong>{' '}
              <a href={`tel:${BUSINESS.phoneRaw}`} className="text-gold-600 hover:text-gold-700">
                {BUSINESS.phone}
              </a>
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong>{' '}
              <a href={`mailto:${BUSINESS.email}`} className="text-gold-600 hover:text-gold-700">
                {BUSINESS.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
