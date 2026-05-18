import Link from 'next/link';
import { MapPin } from 'lucide-react';
import {
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  EXPANSION_SERVICE_AREAS,
} from '@/lib/constants';

export const ServiceAreaMap = () => {
  return (
    <section className="w-full bg-white py-20 md:py-24 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-[#c0392b] font-semibold text-sm uppercase tracking-widest mb-3">
            Service Area
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2744]">
            Proudly Serving the Eastern Panhandle
          </h2>
          <p className="text-gray-500 mt-4">
            Based in Martinsburg, WV — serving West Virginia, Virginia, and Maryland.
          </p>
        </div>

        <div className="space-y-8">
          {/* Primary */}
          <div>
            <h3 className="text-xs font-bold text-[#1a2744] uppercase tracking-widest mb-4 text-center">
              Core Service Areas
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {PRIMARY_SERVICE_AREAS.map((area) => (
                <Link
                  key={area.slug}
                  href={`/service-areas/${area.slug}`}
                  className="bg-[#1a2744] text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#c0392b] transition-colors"
                >
                  {area.city}, {area.state}
                </Link>
              ))}
            </div>
          </div>

          {/* Secondary */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">
              Also Serving
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {SECONDARY_SERVICE_AREAS.map((area) => (
                <Link
                  key={area.slug}
                  href={`/service-areas/${area.slug}`}
                  className="bg-white text-[#1a2744] px-3.5 py-1.5 rounded-full font-medium text-sm border border-gray-200 hover:border-[#1a2744] transition-colors"
                >
                  {area.city}, {area.state}
                </Link>
              ))}
            </div>
          </div>

          {/* Expansion */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
              Expanding To
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {EXPANSION_SERVICE_AREAS.map((area) => (
                <Link
                  key={area.slug}
                  href={`/service-areas/${area.slug}`}
                  className="bg-gray-50 text-gray-600 px-3.5 py-1.5 rounded-full font-medium text-sm border border-gray-100 hover:bg-white hover:border-gray-300 transition-colors"
                >
                  {area.city}, {area.state}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-10 flex items-center justify-center gap-1.5">
          <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
          Don&apos;t see your area?{' '}
          <Link href="/contact" className="text-[#c0392b] font-semibold hover:underline ml-1">
            Contact us
          </Link>
          <span>— we may still be able to help.</span>
        </p>
      </div>
    </section>
  );
};

export default ServiceAreaMap;
