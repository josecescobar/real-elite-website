import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: `Frequently Asked Questions | ${BUSINESS.name}`,
  description:
    'Get answers to common questions about Real Elite Contracting — licensing, pricing, project timelines, insurance claims, and more. Veteran-owned contractor serving the Eastern Panhandle.',
  keywords: [
    'FAQ',
    'frequently asked questions',
    'contractor FAQ',
    'roofing cost',
    'deck cost',
    'licensed contractor WV',
    'insurance claims contractor',
    'Real Elite Contracting',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/faq`,
  },
  openGraph: {
    title: `Frequently Asked Questions | ${BUSINESS.name}`,
    description:
      'Get answers to common questions about Real Elite Contracting — licensing, pricing, project timelines, insurance claims, and more.',
    url: `${BUSINESS.url}/faq`,
    type: 'website',
  },
};

const faqSections = [
  {
    heading: 'General Questions',
    faqs: [
      {
        question: 'Are you licensed and insured?',
        answer:
          'Yes. Real Elite Contracting is fully licensed and insured in West Virginia, Virginia, and Maryland. We carry general liability insurance and workers\u2019 compensation coverage on every project.',
      },
      {
        question: 'Are you really veteran-owned?',
        answer:
          'Yes. Real Elite Contracting is a proud veteran-owned and operated business. We bring the same discipline, attention to detail, and commitment to excellence that was instilled during military service to every project we take on.',
      },
      {
        question: 'What areas do you serve?',
        answer:
          'We serve the entire Eastern Panhandle of West Virginia including Martinsburg, Charles Town, Ranson, Hedgesville, Inwood, Spring Mills, Falling Waters, Berkeley Springs, and Shepherdstown. We\u2019ve also expanded to serve Winchester VA, Frederick MD, Leesburg VA, and Ashburn VA.',
      },
      {
        question: 'How do I get a free estimate?',
        answer:
          'You can book a free estimate three ways: call us at (681) 534-5515, fill out the estimate form on our contact page, or book directly through our online calendar.',
      },
    ],
  },
  {
    heading: 'Project & Pricing',
    faqs: [
      {
        question: 'How much does a new roof cost?',
        answer:
          'Residential roof replacements in the Eastern Panhandle typically range from $8,000 to $20,000 depending on roof size, materials, pitch, and complexity. We provide free, detailed estimates for every project.',
      },
      {
        question: 'How much does a new deck cost?',
        answer:
          'Deck costs vary based on size, materials, and design complexity. A standard 300\u2013400 sq ft deck typically ranges from $15,000 to $35,000. Composite materials cost more upfront but require less maintenance over time.',
      },
      {
        question: 'How long do projects typically take?',
        answer:
          'Timeline depends on the project scope. Roof replacements typically take 1\u20133 days, deck builds 1\u20133 weeks, siding installations 1\u20132 weeks, and full remodels 4\u201312 weeks. We\u2019ll provide a detailed timeline during your estimate.',
      },
      {
        question: 'Do you pull permits?',
        answer:
          'Yes. We handle all necessary permits and inspections required by local building codes. This is included as part of our project management \u2014 you don\u2019t have to worry about the paperwork.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept checks, credit cards, and bank transfers. For larger projects, we typically structure payments in milestones \u2014 a deposit to start, progress payments at key milestones, and a final payment upon completion and your satisfaction.',
      },
    ],
  },
  {
    heading: 'During Your Project',
    faqs: [
      {
        question: 'Can I live in my home during a remodel?',
        answer:
          'In most cases, yes. We take steps to minimize disruption, including dust barriers and clean work areas. For major kitchen or bathroom remodels, we\u2019ll discuss logistics upfront so you can plan accordingly.',
      },
      {
        question: 'Do you clean up after the job?',
        answer:
          'Absolutely. We leave your property as clean as we found it \u2014 often cleaner. Full debris removal, nail sweeps (for roofing), and site cleanup are standard on every project.',
      },
      {
        question: 'What happens if there\u2019s a problem after the job is done?',
        answer:
          'We stand behind our work. If you notice any issue related to our workmanship, call us and we\u2019ll make it right. We also provide manufacturer warranty information for all materials we install.',
      },
    ],
  },
  {
    heading: 'Insurance & Storm Damage',
    faqs: [
      {
        question: 'Do you work with insurance companies?',
        answer:
          'Yes. If your home has storm damage, we\u2019ll work directly with your insurance company to document the damage, provide detailed estimates, and ensure your claim is handled properly.',
      },
      {
        question: 'What should I do after a storm damages my home?',
        answer:
          'First, document the damage with photos. Then call us at (681) 534-5515 \u2014 we\u2019ll perform a thorough inspection and help you through the insurance claims process. Don\u2019t wait, as delays can lead to further damage.',
      },
    ],
  },
];

const allFaqs = faqSections.flatMap((section) => section.faqs);

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FAQPage() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-white max-w-2xl">
            Answers to the most common questions we hear from homeowners
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      {faqSections.map((section, sectionIndex) => (
        <section
          key={sectionIndex}
          className={`py-16 md:py-24 ${sectionIndex % 2 === 0 ? 'bg-white' : 'bg-navy-50'}`}
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
              {section.heading}
            </h2>

            <div className="max-w-3xl mx-auto space-y-8">
              {section.faqs.map((faq, faqIndex) => (
                <div
                  key={faqIndex}
                  className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <HelpCircle className="w-6 h-6 text-gold-600 mt-1" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy-900 mb-3">{faq.question}</h3>
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-lg text-gold-300 mb-8 max-w-2xl mx-auto">
            We&apos;re happy to answer anything we didn&apos;t cover here. Give us a call or book a
            free estimate to discuss your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="https://calendly.com/realelitecontracting-info/free-estimate-call"
              variant="primary"
              size="lg"
            >
              Book Free Estimate
            </Button>
            <Button href={`tel:${BUSINESS.phoneRaw}`} variant="secondary" size="lg">
              Call {BUSINESS.phone}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
