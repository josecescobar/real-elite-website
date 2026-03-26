import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS, ALL_SERVICE_AREAS } from '@/lib/constants';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: `General Repairs in Eastern Panhandle, WV | ${BUSINESS.name}`,
  description:
    'Professional home repair and maintenance services in the Eastern Panhandle. Door repairs, drywall patching, trim work, deck fixes, and more.',
  keywords: [
    'home repairs',
    'general maintenance',
    'handyman services',
    'drywall repair',
    'door repair',
    'trim work',
    'deck repair',
    'Martinsburg',
    'Eastern Panhandle',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/services/general-repairs`,
  },
  openGraph: {
    title: `General Repairs in Eastern Panhandle, WV | ${BUSINESS.name}`,
    description:
      'Professional home repair and maintenance services. No job too small when it comes to keeping your home in great shape.',
    url: `${BUSINESS.url}/services/general-repairs`,
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
      name: 'What types of repairs do you handle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We handle a wide range of general home repairs including door and window repairs, drywall patching, interior and exterior trim work, deck and fence repairs, pressure washing, weather damage repairs, caulking and sealing, and general carpentry. If it\'s broken, worn out, or needs fixing, odds are we can handle it.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly can you schedule a repair?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We typically schedule repair work within 1-2 weeks, though availability varies by season. For urgent issues that could cause further damage to your home, we do our best to prioritize and get out sooner. Call us at (681) 534-5515 to discuss your timeline.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer emergency repair services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'While we don\'t offer 24/7 emergency service, we prioritize urgent repairs that could lead to further damage — like storm damage, water intrusion, or structural safety concerns. Call us and we\'ll work to get your repair scheduled as quickly as possible.',
      },
    },
  ],
};

const faqs = [
  {
    question: 'What types of repairs do you handle?',
    answer: 'We handle a wide range of general home repairs including door and window repairs, drywall patching, interior and exterior trim work, deck and fence repairs, pressure washing, weather damage repairs, caulking and sealing, and general carpentry. If it\'s broken, worn out, or needs fixing, odds are we can handle it.',
  },
  {
    question: 'How quickly can you schedule a repair?',
    answer: 'We typically schedule repair work within 1-2 weeks, though availability varies by season. For urgent issues that could cause further damage to your home, we do our best to prioritize and get out sooner. Call us at (681) 534-5515 to discuss your timeline.',
  },
  {
    question: 'Do you offer emergency repair services?',
    answer: 'While we don\'t offer 24/7 emergency service, we prioritize urgent repairs that could lead to further damage — like storm damage, water intrusion, or structural safety concerns. Call us and we\'ll work to get your repair scheduled as quickly as possible.',
  },
];

const repairServices = [
  'Door and window repairs',
  'Drywall patching and repair',
  'Interior and exterior trim work',
  'Deck and fence repairs',
  'Pressure washing',
  'Weather damage repairs',
  'Caulking and sealing',
  'General carpentry',
];

const notIncluded = [
  'Electrical work',
  'Plumbing',
  'HVAC systems',
];

const whyChooseUs = [
  'Same quality craftsmanship we bring to our major projects — applied to your smaller repairs',
  'One contractor for everything means no more juggling multiple service calls',
  'Honest assessments — we\'ll tell you if a repair is all you need instead of upselling a replacement',
];

export default function GeneralRepairsPage() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-4">General Repairs & Maintenance</h1>
          <p className="text-lg text-white max-w-2xl">
            The smaller jobs that keep your home in great shape — done right, by a crew you already trust
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Not every home project is a full roof replacement or a deck build. Sometimes it's a
              door that won't close right, drywall that needs patching, or trim that's seen
              better days. These smaller repairs matter — they protect your home's value
              and keep things running smoothly.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At Real Elite Contracting, we handle general repairs and maintenance with the same
              attention to detail we bring to our large-scale projects. With 40+ years of hands-on
              building experience, there's very little we haven't fixed, repaired, or rebuilt.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              And here's the real benefit: when your repair guy is also your roofer, your deck
              builder, and your siding contractor, you only need one number in your phone. We
              get to know your home and can spot bigger issues before they become expensive problems.
            </p>
          </div>
        </div>
      </section>

      {/* What We Handle */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
            What We Handle
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
            {repairServices.map((service, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-gold-600 mt-1" />
                </div>
                <span className="text-lg text-gray-700">{service}</span>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-lg font-bold text-navy-900 mb-4">
              Services we don't cover (but can refer you to someone who does):
            </h3>
            <div className="flex flex-wrap gap-4">
              {notIncluded.map((item, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8">
            Why Call a Contractor Instead of a Handyman?
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
            General Repair Services Across the Region
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
                Got a Repair That Needs Doing?
              </h2>
              <p className="text-lg text-gold-300 mb-8">
                Tell us what needs fixing. We'll give you an honest assessment and a fair price —
                no minimum job size, no upselling, no hassle.
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

            <EstimateForm service="general-repairs" />
          </div>
        </div>
      </section>
    </>
  );
}
