import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS, ALL_SERVICE_AREAS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: `Exterior Repairs in Eastern Panhandle, WV | ${BUSINESS.name}`,
  description:
    'Stone veneer installation, foundation repair, trim work, and general exterior maintenance to keep your home in top shape.',
  keywords: [
    'exterior repairs',
    'stone veneer',
    'foundation repair',
    'trim and fascia',
    'soffit repair',
    'exterior maintenance',
    'Eastern Panhandle',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/services/exterior-repairs`,
  },
  openGraph: {
    title: `Exterior Repairs in Eastern Panhandle, WV | ${BUSINESS.name}`,
    description:
      'Stone veneer installation, foundation repair, trim work, and general exterior maintenance to keep your home in top shape.',
    url: `${BUSINESS.url}/services/exterior-repairs`,
    type: 'website',
    images: [{ url: 'https://www.realelitecontracting.com/images/og-image.jpg', width: 1200, height: 630 }],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I know if I need exterior repairs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Common signs include cracking or crumbling foundation, peeling or rotting trim, loose or damaged fascia and soffit, gaps in caulking, and visible water damage or staining on your exterior walls. If you notice any of these issues, schedule a free inspection before they become more costly problems.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do exterior repairs cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Exterior repair costs vary widely depending on the scope of work. Minor trim and soffit repairs may start at a few hundred dollars, while stone veneer installation or foundation repairs can range from $3,000 to $15,000 or more. We provide honest, detailed estimates after inspecting your home.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you repair stone veneer and foundations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we specialize in stone veneer installation and repair as well as foundation repair and waterproofing. Our team has extensive experience with the specific soil and weather conditions in the Eastern Panhandle that affect foundations and exterior materials.',
      },
    },
  ],
};

const faqs = [
  {
    question: 'How do I know if I need exterior repairs?',
    answer: 'Common signs include cracking or crumbling foundation, peeling or rotting trim, loose or damaged fascia and soffit, gaps in caulking, and visible water damage or staining on your exterior walls. If you notice any of these issues, schedule a free inspection before they become more costly problems.',
  },
  {
    question: 'How much do exterior repairs cost?',
    answer: 'Exterior repair costs vary widely depending on the scope of work. Minor trim and soffit repairs may start at a few hundred dollars, while stone veneer installation or foundation repairs can range from $3,000 to $15,000 or more. We provide honest, detailed estimates after inspecting your home.',
  },
  {
    question: 'Do you repair stone veneer and foundations?',
    answer: 'Yes, we specialize in stone veneer installation and repair as well as foundation repair and waterproofing. Our team has extensive experience with the specific soil and weather conditions in the Eastern Panhandle that affect foundations and exterior materials.',
  },
];

const repairServices = [
  'Stone veneer installation',
  'Foundation repair and waterproofing',
  'Trim and fascia replacement',
  'Soffit repair and replacement',
  'General exterior maintenance',
  'Custom exterior detailing',
];

const whyChooseUs = [
  'Expert diagnosis of exterior issues before they become major problems',
  'Quality materials and proven repair techniques',
  'Local expertise with Eastern Panhandle building conditions',
];

export default function ExteriorRepairsPage() {
  return (
    <>
      {/* FAQPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Banner */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Exterior Repairs & Maintenance</h1>
          <p className="text-lg text-white max-w-2xl">
            Keep your home protected with professional exterior repairs and maintenance
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Your home's exterior is constantly exposed to the elements—harsh weather, moisture,
                and UV damage can quickly turn minor issues into expensive problems. Real Elite
                Contracting offers comprehensive exterior repair and maintenance services to catch
                problems early and keep your home protected for years to come.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                From beautiful stone veneer installations to critical foundation repairs, trim and
                fascia work, and general maintenance, we handle all aspects of keeping your home's
                exterior in excellent condition. Our team understands the specific challenges of
                Eastern Panhandle weather and provides solutions built to last.
              </p>
            </div>

            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/stone-facade-finished.jpg"
                alt="Finished stone veneer porch facade with white railings and walkway"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
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
            {repairServices.map((service, index) => (
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
            Why Choose Real Elite for Exterior Repairs?
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

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-navy-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8 text-center">
            Exterior Repair Services Across the Region
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {ALL_SERVICE_AREAS.map((area) => (
              <Link key={area.slug} href={`/service-areas/${area.slug}`} className="flex items-center gap-2 text-navy-700 hover:text-gold-600 transition-colors p-2">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>{area.city}, {area.state}</span>
              </Link>
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
                Protect Your Home Today
              </h2>
              <p className="text-lg text-gold-300 mb-8">
                Schedule your free exterior inspection and repair estimate. We'll evaluate your
                home's exterior condition and recommend necessary repairs and maintenance to keep
                everything in top shape.
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

            <EstimateForm service="exterior-repairs" />
          </div>
        </div>
      </section>
    </>
  );
}
