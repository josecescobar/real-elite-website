import { ShieldCheck, MessageSquareText, DollarSign } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';

const ASSURANCES = [
  {
    icon: DollarSign,
    title: 'Financing Available',
    body:
      'Monthly payment options on qualified projects. We walk you through the numbers on your free estimate so you know what fits before you commit.',
  },
  {
    icon: ShieldCheck,
    title: 'Workmanship Warranty',
    body:
      "Every project gets our written workmanship warranty. Manufacturer material warranties (architectural shingles, composite decking, fiber cement) stack on top — and we register them on your behalf.",
  },
  {
    icon: MessageSquareText,
    title: 'Communication Standards',
    body:
      'Named project lead. Daily updates while we work. 24-hour response standard. Clean job site every day. No ghosting, no surprises, no chasing your contractor.',
  },
];

export default function AssurancesBand() {
  return (
    <section className="bg-white py-20 md:py-28 border-t border-charcoal-100">
      <Container size="wide">
        <SectionHeader
          eyebrow="What You Can Count On"
          title="Three guarantees, every project."
          subtitle="The stuff most contractors quietly skip — and the reason homeowners stop calling them."
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
