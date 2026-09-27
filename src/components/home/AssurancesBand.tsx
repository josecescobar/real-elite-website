import { ShieldCheck, MessageSquareText, DollarSign } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';

const ASSURANCES = [
  { icon: DollarSign, title: 'Discuss the Scope', body: 'Bring your plans, priorities, and budget to the estimate. Review what is included before committing to construction.' },
  { icon: ShieldCheck, title: 'Review the Details', body: 'Ask for current license and insurance documents, proposed warranty terms, and the responsibilities of each contractor on your project.' },
  { icon: MessageSquareText, title: 'Plan Communication', body: 'Discuss site supervision, progress reporting, access, and cleanup arrangements before work begins.' },
];

export default function AssurancesBand() {
  return (
    <section className="bg-white py-20 md:py-28 border-t border-charcoal-100">
      <Container size="wide">
        <SectionHeader
          eyebrow="Before Work Begins"
          title="Start with a clear agreement."
          subtitle="Use the estimate to discuss the details that matter in your home."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ASSURANCES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-steel-50 border-t-4 border-brand-red rounded-lg p-7 lg:p-8 shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-navy-800 text-white mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-extrabold text-navy-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
