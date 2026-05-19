import type { Metadata } from 'next';
import { BUSINESS, SERVICES } from '@/lib/constants';
import Button from '@/components/shared/Button';
import * as LucideIcons from 'lucide-react';

export const metadata: Metadata = {
  title: `Services | ${BUSINESS.name}`,
  description:
    'Explore our full range of contracting services: roofing, siding, decks, remodeling, additions, and exterior repairs.',
  keywords: [
    'contractor services',
    'roofing services',
    'siding installation',
    'deck construction',
    'home remodeling',
    'home additions',
    'exterior repairs',
    'general repairs',
    'home maintenance',
    'handyman services',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/services`,
  },
  openGraph: {
    title: `Services | ${BUSINESS.name}`,
    description: 'Explore our full range of contracting services across the Eastern Panhandle.',
    url: `${BUSINESS.url}/services`,
    type: 'website',
  },
};

type IconName =
  | 'Home'
  | 'Layers'
  | 'Fence'
  | 'Hammer'
  | 'Plus'
  | 'Wrench'
  | 'Paintbrush'
  | 'Bath'
  | 'ChefHat';

const getIcon = (iconName: IconName) => {
  const icons: Record<IconName, typeof LucideIcons.Home> = {
    Home: LucideIcons.Home,
    Layers: LucideIcons.Layers,
    Fence: LucideIcons.Fence,
    Hammer: LucideIcons.Hammer,
    Plus: LucideIcons.Plus,
    Wrench: LucideIcons.Wrench,
    Paintbrush: LucideIcons.Paintbrush,
    Bath: LucideIcons.Bath,
    ChefHat: LucideIcons.ChefHat,
  };
  return icons[iconName] ?? LucideIcons.Hammer;
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-gold-300 max-w-2xl">
            Complete contracting solutions for every project, from roofing to full home remodels
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => {
              const IconComponent = getIcon(service.icon as IconName);

              return (
                <div
                  key={service.slug}
                  className="bg-white border-2 border-navy-100 rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:border-gold-300"
                >
                  <div className="flex justify-center mb-6">
                    <div className="bg-gold-100 p-4 rounded-full">
                      <IconComponent className="w-8 h-8 text-gold-600" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-navy-900 mb-3 text-center">
                    {service.title}
                  </h3>

                  <p className="text-gray-700 text-center mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex justify-center">
                    <Button href={`/services/${service.slug}`} variant="primary" size="md">
                      Learn More
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-navy-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't See Your Project Type?
          </h2>
          <p className="text-lg text-gold-300 mb-8 max-w-2xl mx-auto">
            We specialize in custom solutions. Contact us to discuss your unique project needs.
          </p>
          <Button href="https://calendly.com/realelitecontracting-info/free-estimate-call" variant="primary" size="lg">
            Book Free Estimate
          </Button>
        </div>
      </section>
    </>
  );
}
