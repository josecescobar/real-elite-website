import Link from 'next/link';
import { ArrowRight, Hammer, Home, Layers, Fence, Plus, Wrench, Paintbrush } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

const ICONS = {
  Home,
  Layers,
  Fence,
  Hammer,
  Plus,
  Wrench,
  Paintbrush,
} as const;

export const ServicesGrid = () => {
  return (
    <section className="w-full bg-white py-20 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="text-[#c0392b] font-semibold text-sm uppercase tracking-widest mb-3">
            Services
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2744]">
            What We Build
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service) => {
            const Icon = ICONS[service.icon as keyof typeof ICONS];
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#c0392b]/30 hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#c0392b]/10 flex items-center justify-center text-[#c0392b] group-hover:bg-[#c0392b] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-bold text-[#1a2744] group-hover:text-[#c0392b] transition-colors">
                      {service.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#c0392b] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                  </div>
                  <p className="text-gray-500 text-sm leading-snug">
                    {service.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
