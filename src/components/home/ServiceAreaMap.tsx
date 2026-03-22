import Link from 'next/link';
import { MapPin } from 'lucide-react';
import {
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  EXPANSION_SERVICE_AREAS,
} from '@/lib/constants';

export const ServiceAreaMap = () => {
  return (
    <section className="w-full bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-gold-500" />
            <h2 className="text-4xl sm:text-5xl font-bold text-navy-900">
              Proudly Serving the Eastern Panhandle
            </h2>
          </div>
          <p className="text-charcoal-600 text-lg mt-4 max-w-2xl mx-auto">
            Based in Martinsburg, WV — delivering quality craftsmanship across West Virginia, Virginia, and Maryland.
          </p>
        </div>

        {/* Primary Areas — Dominant */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-navy-700 uppercase tracking-wider mb-4 text-center">
            Core Service Areas
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {PRIMARY_SERVICE_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/service-areas/${area.slug}`}
                className="bg-navy-900 text-white px-5 py-2.5 rounded-full font-semibold text-base hover:bg-gold-500 hover:text-navy-900 transition-colors duration-200"
              >
                {area.city}, {area.state}
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary Areas */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-charcoal-500 uppercase tracking-wider mb-4 text-center">
            Also Serving
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {SECONDARY_SERVICE_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/service-areas/${area.slug}`}
                className="bg-navy-100 text-navy-700 px-4 py-2 rounded-full font-medium border border-navy-200 hover:bg-navy-200 transition-colors duration-200"
              >
                {area.city}, {area.state}
              </Link>
            ))}
          </div>
        </div>

        {/* Expansion Areas */}
        <div>
          <h3 className="text-sm font-bold text-charcoal-400 uppercase tracking-wider mb-4 text-center">
            Expanding To
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {EXPANSION_SERVICE_AREAS.map((area) => (
              <span
                key={area.slug}
                className="bg-charcoal-50 text-charcoal-500 px-4 py-2 rounded-full font-medium border border-charcoal-200"
              >
                {area.city}, {area.state}
              </span>
            ))}
          </div>
        </div>

        <p className="text-center text-charcoal-500 text-sm mt-10">
          Don&apos;t see your area? <Link href="/contact" className="text-gold-600 font-semibold hover:underline">Contact us</Link> — we may still be able to help.
        </p>
      </div>
    </section>
  );
};

export default ServiceAreaMap;
