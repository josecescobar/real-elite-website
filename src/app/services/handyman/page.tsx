import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { Check, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: `Handyman Services in Martinsburg, WV | ${BUSINESS.name}`,
  description:
    'Reliable handyman services in the Eastern Panhandle. Drywall repair, door installation, pressure washing, gutter cleaning, fence repair, and more. Veteran-owned. Call (681) 534-5515.',
  keywords: [
    'handyman services',
    'handyman Martinsburg WV',
    'home repairs Eastern Panhandle',
    'drywall repair',
    'door installation',
    'pressure washing',
    'gutter cleaning',
    'fence repair',
    'TV mounting',
    'veteran-owned handyman',
  ],
  openGraph: {
    title: `Handyman Services in Martinsburg, WV | ${BUSINESS.name}`,
    description:
      'Reliable handyman services in the Eastern Panhandle. Drywall repair, door installation, pressure washing, gutter cleaning, fence repair, and more.',
    url: `${BUSINESS.url}/services/handyman`,
    type: 'website',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a handyman charge per hour in WV?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Handyman rates in West Virginia typically range from $50–$100 per hour depending on the task and the provider. At Real Elite Contracting, we provide upfront pricing by the job rather than by the hour whenever possible — so you know exactly what you\'re paying before we start.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a licensed contractor for small repairs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For many small repairs — drywall patching, caulking, furniture assembly, TV mounting — a license is not legally required in WV. However, for anything involving electrical, plumbing, or structural work, a licensed contractor is required and protects you from liability. Real Elite Contracting is fully licensed and insured for all the work we perform.',
      },
    },
    {
      '@type': 'Question',
      name: 'What\'s the difference between a handyman and a general contractor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A handyman typically handles smaller, individual tasks without a formal license. A general contractor like Real Elite is licensed, insured, and experienced managing both small repairs and large projects. When you hire us for handyman work, you get the same accountability, craftsmanship, and warranty protection we apply to every job.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer same-day or emergency handyman services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We do our best to accommodate urgent requests. Call us at (681) 534-5515 to discuss your timeline. While we can\'t always guarantee same-day availability, we work hard to fit in urgent repairs as quickly as possible for our customers in the Eastern Panhandle.',
      },
    },
  ],
};

const handymanServices = [
  {
    title: 'Drywall Repair & Patching',
    description: 'Holes, cracks, water damage, or texture matching — we leave walls looking like nothing happened.',
  },
  {
    title: 'Door & Window Installation',
    description: 'Interior and exterior door installation, adjustments, weatherstripping, and window replacement.',
  },
  {
    title: 'Pressure Washing',
    description: 'Driveways, decks, siding, fences, and more — cleaned down to the surface.',
  },
  {
    title: 'Gutter Cleaning & Repair',
    description: 'Clear out clogs, reseal joints, reattach loose gutters, and keep water flowing away from your foundation.',
  },
  {
    title: 'Fence Repair & Installation',
    description: 'Broken posts, damaged panels, sagging gates — repaired or replaced with matching materials.',
  },
  {
    title: 'Caulking & Weatherproofing',
    description: 'Seal gaps around windows, doors, tubs, and siding to keep drafts and moisture out.',
  },
  {
    title: 'Minor Electrical',
    description: 'Outlet and switch replacement, light fixture installation, ceiling fan hanging, and GFCI upgrades.',
  },
  {
    title: 'Minor Plumbing',
    description: 'Faucet replacement, toilet repairs, garbage disposal installation, and shutoff valve work.',
  },
  {
    title: 'Furniture Assembly',
    description: 'IKEA, Amazon, big-box store — we assemble it right the first time so you don\'t have to.',
  },
  {
    title: 'Shelving & Storage Installation',
    description: 'Wall-mounted shelves, closet organizers, garage storage systems, and custom built-ins.',
  },
  {
    title: 'Deck & Porch Repairs',
    description: 'Rotted boards, loose railings, popped fasteners — get your outdoor space safe and solid again.',
  },
  {
    title: 'Interior & Exterior Painting Touch-ups',
    description: 'Touch up scuffs, cover repairs, and freshen trim without a full repaint.',
  },
  {
    title: 'TV Mounting',
    description: 'Flat-screen mounting with cable concealment on any wall type, including brick and concrete.',
  },
  {
    title: 'General Home Repairs',
    description: 'If something is broken, worn out, or just needs fixing — odds are we can handle it.',
  },
];

const whyRealElite = [
  {
    heading: 'Licensed & Insured',
    body: 'Not just some guy from Craigslist. We carry full liability insurance and proper licensing — protecting you and your home on every job.',
  },
  {
    heading: 'Veteran-Owned & Trustworthy',
    body: 'Military values mean we show up on time, do what we say, and stand behind our work. No surprises, no excuses.',
  },
  {
    heading: 'Same Standards, Any Job Size',
    body: 'We bring the same professionalism to a drywall patch as we do to a full roof replacement. No job is too small to do right.',
  },
  {
    heading: 'One Call Handles Everything',
    body: 'Stop juggling five different contractors. Real Elite handles repairs across every trade so you only need one number in your phone.',
  },
];

const faqs = [
  {
    question: 'How much does a handyman charge per hour in WV?',
    answer:
      'Handyman rates in West Virginia typically range from $50–$100 per hour depending on the task and the provider. At Real Elite Contracting, we provide upfront pricing by the job rather than by the hour whenever possible — so you know exactly what you\'re paying before we start.',
  },
  {
    question: 'Do I need a licensed contractor for small repairs?',
    answer:
      'For many small repairs — drywall patching, caulking, furniture assembly, TV mounting — a license is not legally required in WV. However, for anything involving electrical, plumbing, or structural work, a licensed contractor is required and protects you from liability. Real Elite Contracting is fully licensed and insured for all the work we perform.',
  },
  {
    question: "What's the difference between a handyman and a general contractor?",
    answer:
      'A handyman typically handles smaller, individual tasks without a formal license. A general contractor like Real Elite is licensed, insured, and experienced managing both small repairs and large projects. When you hire us for handyman work, you get the same accountability, craftsmanship, and warranty protection we apply to every job.',
  },
  {
    question: 'Do you offer same-day or emergency handyman services?',
    answer:
      "We do our best to accommodate urgent requests. Call us at (681) 534-5515 to discuss your timeline. While we can't always guarantee same-day availability, we work hard to fit in urgent repairs as quickly as possible for our customers in the Eastern Panhandle.",
  },
];

export default function HandymanPage() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-4">Handyman Services</h1>
          <p className="text-lg text-white max-w-2xl">
            Fast, reliable repairs and improvements for your home
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Your home is always generating a list — the door that sticks, the gutter pulling away
              from the fascia, the drywall patch you keep meaning to fix. These aren't major projects,
              but they add up and they matter. Real Elite Contracting handles all of it.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We bring the same licensed, insured, veteran-owned professionalism to handyman work that
              we do to full roof replacements and deck builds. You get a skilled crew, real
              accountability, and repairs that are done right — not just done fast.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Serving Martinsburg, Inwood, Charles Town, Hedgesville, and the surrounding Eastern
              Panhandle, we handle everything from TV mounting and furniture assembly to gutter repair
              and minor electrical work. One call, one crew, zero hassle.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
            What We Handle
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {handymanServices.map((service, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-gold-600 mt-1" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-navy-900">{service.title}</p>
                  <p className="text-gray-600 mt-1">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Real Elite */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            Why Hire Real Elite for Handyman Work?
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl">
            There's a difference between a licensed contractor and a random handyman. Here's what you
            get when you call us.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {whyRealElite.map((item, index) => (
              <div
                key={index}
                className="bg-navy-50 p-6 rounded-lg border-l-4 border-gold-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-gold-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-navy-900 font-bold text-lg mb-1">{item.heading}</p>
                    <p className="text-gray-700">{item.body}</p>
                  </div>
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

      {/* CTA and Estimate Form */}
      <section className="py-16 md:py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Got a To-Do List? Let's Knock It Out.
              </h2>
              <p className="text-lg text-gold-300 mb-8">
                Book a free estimate and tell us what needs doing. We'll give you honest pricing and
                get it scheduled — no minimum job size, no runaround.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  href="https://calendly.com/realelitecontracting-info/free-estimate-call"
                  variant="primary"
                  size="lg"
                >
                  Book Free Estimate →
                </Button>
                <Button
                  href={`tel:${BUSINESS.phoneRaw}`}
                  variant="secondary"
                  size="lg"
                >
                  Call {BUSINESS.phone}
                </Button>
              </div>

              <div className="space-y-3">
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

            <EstimateForm service="handyman" />
          </div>
        </div>
      </section>
    </>
  );
}
