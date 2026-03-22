import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

export const ServicesGrid = () => {
  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-[#1a2744] mb-12">What We Build</h2>

        <div className="divide-y divide-gray-100">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="flex items-center gap-4 py-5 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors group"
            >
              <span className="w-2 h-2 rounded-full bg-[#c0392b] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-[#1a2744] group-hover:text-[#c0392b] transition-colors">
                  {service.title}
                </span>
                <p className="text-gray-500 text-sm mt-0.5 leading-snug">{service.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#c0392b] transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
