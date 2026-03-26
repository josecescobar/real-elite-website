import type { Metadata } from 'next';
import Image from 'next/image';
import { BUSINESS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import { Shield, Hammer, MessageSquare, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: `About Us | ${BUSINESS.name}`,
  description:
    'Meet Real Elite Contracting, a veteran-owned contracting company serving the Eastern Panhandle with excellence and integrity since day one.',
  keywords: [
    'about us',
    'veteran-owned contractor',
    'Eastern Panhandle contractor',
    'Real Elite Contracting',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/about`,
  },
  openGraph: {
    title: `About Us | ${BUSINESS.name}`,
    description:
      'Meet Real Elite Contracting, a veteran-owned contracting company serving the Eastern Panhandle with excellence and integrity.',
    url: `${BUSINESS.url}/about`,
    type: 'website',
  },
};

const values = [
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We stand behind every project with honesty, transparency, and accountability.',
  },
  {
    icon: Hammer,
    title: 'Craftsmanship',
    description: 'Quality workmanship is our signature. Excellence in every detail matters.',
  },
  {
    icon: MessageSquare,
    title: 'Communication',
    description: 'Clear, honest communication throughout your project keeps you informed and confident.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We are proud to serve our neighbors and give back to the Eastern Panhandle.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">About Real Elite Contracting</h1>
          <p className="text-lg text-white max-w-2xl">
            Eastern Panhandle's most trusted veteran-owned contracting company
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8">
            Built on Service, Driven by Excellence
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Real Elite Contracting was founded on the principles of service, integrity, and
                excellence. As a veteran-owned business, we bring the same dedication and
                professionalism that we learned through our military service to every project we
                undertake in the Eastern Panhandle.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                For years, we've been the trusted choice for homeowners and businesses throughout
                West Virginia who demand quality workmanship without compromise. Our commitment to
                our community runs deep—we live and work here, and we take pride in building the
                places where our neighbors live their lives.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Whether it's a roof replacement, a custom deck, or a complete home remodel, we
                approach every project with the same attention to detail and respect for your home
                that we'd show our own families.
              </p>
            </div>

            <div className="relative h-96 md:h-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/crew-dusk.jpg"
                alt="Real Elite Contracting crew installing roof rafters at dusk"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 text-center">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
            These principles guide every decision we make and every project we complete.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-[#c0392b]/10 p-3 rounded-full">
                      <IconComponent className="w-8 h-8 text-[#c0392b]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3 text-center">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 text-center text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your project and see why we're the trusted choice for
            contractors in the Eastern Panhandle.
          </p>
          <Button href="https://calendly.com/realelitecontracting-info/free-estimate-call" variant="primary" size="lg">
            Book Free Estimate
          </Button>
        </div>
      </section>
    </>
  );
}
