import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import { ClipboardList, Palette, FileCheck, CalendarClock, HardHat, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: `Our Process | How We Work | ${BUSINESS.name}`,
  description:
    'From free consultation to final walkthrough — learn how Real Elite Contracting delivers quality results on every project. Veteran-owned contractor serving the Eastern Panhandle.',
  keywords: [
    'our process',
    'how we work',
    'contractor process',
    'free estimate',
    'project management',
    'Real Elite Contracting',
    'Eastern Panhandle contractor',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/process`,
  },
  openGraph: {
    title: `Our Process | How We Work | ${BUSINESS.name}`,
    description:
      'From free consultation to final walkthrough — learn how Real Elite Contracting delivers quality results on every project.',
    url: `${BUSINESS.url}/process`,
    type: 'website',
  },
};

const steps = [
  {
    number: 1,
    title: 'Free Consultation & Estimate',
    description:
      'It starts with a conversation. Call us, fill out our online form, or book a time on our calendar. We\u2019ll visit your property, discuss your goals, assess the scope of work, and provide a detailed, no-obligation estimate \u2014 typically within 48 hours.',
    icon: ClipboardList,
  },
  {
    number: 2,
    title: 'Design & Planning',
    description:
      'Once you\u2019re ready to move forward, we\u2019ll finalize the project details \u2014 materials, colors, layout, timeline, and budget. For larger projects like additions or remodels, we\u2019ll walk you through design options and help you make informed decisions.',
    icon: Palette,
  },
  {
    number: 3,
    title: 'Permits & Approvals',
    description:
      'We handle all permit applications and coordinate with local building departments. You don\u2019t have to deal with the paperwork \u2014 we manage the entire approval process so your project is fully compliant with local codes.',
    icon: FileCheck,
  },
  {
    number: 4,
    title: 'Scheduling & Preparation',
    description:
      'We\u2019ll lock in your start date and prepare the site. You\u2019ll know exactly when our crew arrives, what to expect each day, and how long the project will take. No surprises.',
    icon: CalendarClock,
  },
  {
    number: 5,
    title: 'Construction & Quality Control',
    description:
      'Our experienced crews get to work. We maintain clean, organized job sites and perform quality checks throughout the build. You\u2019ll have a direct line to your project lead and regular progress updates.',
    icon: HardHat,
  },
  {
    number: 6,
    title: 'Final Walkthrough & Handoff',
    description:
      'When the work is complete, we do a final walkthrough together. We make sure every detail meets your expectations and ours. We handle all cleanup, provide warranty documentation, and make sure you\u2019re 100% satisfied before we consider the job done.',
    icon: CheckCircle2,
  },
];

export default function ProcessPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Our Process</h1>
          <p className="text-lg text-white max-w-2xl">
            From first call to final walkthrough &mdash; here&apos;s how we deliver.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 text-center">
            Six Steps to Your Finished Project
          </h2>
          <p className="text-lg text-gray-700 text-center mb-16 max-w-2xl mx-auto">
            We&apos;ve refined our process so every project runs smoothly, stays on budget, and
            exceeds your expectations.
          </p>

          <div className="space-y-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isEven = index % 2 === 1;

              return (
                <div
                  key={step.number}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Number Badge & Icon */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-20 h-20 bg-navy-900 text-white rounded-full flex items-center justify-center text-3xl font-black shadow-lg">
                      {step.number}
                    </div>
                    <div className="mt-3">
                      <IconComponent className="w-8 h-8 text-gold-600" />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-navy-50 rounded-lg p-8 border-l-4 border-gold-500 shadow-sm">
                    <h3 className="text-xl font-bold text-navy-900 mb-3">{step.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gold-300 mb-8 max-w-2xl mx-auto">
            The first step is always free. Book a consultation and let&apos;s talk about your
            project.
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
