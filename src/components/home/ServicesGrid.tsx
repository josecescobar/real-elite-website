import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

export const ServicesGrid = () => {
  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 mb-12">
          What We Build
        </h2>

        <div className="divide-y divide-charcoal-100">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="flex items-center gap-4 py-5 hover:bg-charcoal-50 -mx-4 px-4 rounded-lg transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
            >
              <span className="w-2 h-2 rounded-full bg-brand-red flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-navy-800 group-hover:text-brand-red transition-colors">
                  {service.title}
                </span>
                <p className="text-charcoal-500 text-sm mt-0.5 leading-snug">
                  {service.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-charcoal-300 group-hover:text-brand-red transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
