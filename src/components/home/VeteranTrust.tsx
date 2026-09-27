import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';

/**
 * Who is behind the work: veteran-owned, family-run, bilingual. Written as
 * character rather than slogan, and without owner names, which the public site
 * does not publish. No portrait yet; the composition is typographic until a
 * photograph of the owners exists.
 */
const FACTS = [
  {
    title: 'Veteran-owned and family-run',
    body: 'Real Elite is owned and run by two brothers. The discipline shows up where it matters to a homeowner: a written scope, a real schedule, a protected house and a decision-maker who answers the phone.',
  },
  {
    title: 'English and Spanish, fluently',
    body: 'Consultations, contracts and site conversations in either language. Hablamos español, and it changes what a homeowner and a crew can agree on without a translator in the middle.',
  },
  {
    title: 'Licensed for the size of the work',
    body: 'Virginia Class A (2705198604) for projects over $150,000, West Virginia licence WV062432, and registration in SAM.gov. The paperwork a Loudoun HOA, a lender or a property manager will ask for is ready before they ask.',
  },
] as const;

export default function VeteranTrust() {
  return (
    <section className="bg-steel-50 py-20 md:py-28 border-y border-steel-200">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              Who builds it
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy-900 leading-[1.05]">
              Veteran-owned.
              <br />
              Family-run.
              <br />
              <em>Bilingual.</em>
            </h2>
            <p className="text-charcoal-600 mt-6 leading-relaxed max-w-md">
              Based in Martinsburg, West Virginia, and working Loudoun County from Leesburg and
              Ashburn out to Middleburg and Purcellville. The owners are on the project, not
              in an office three counties away.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-navy-900 link-editorial"
            >
              About Real Elite
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <dl className="lg:col-span-7 divide-y divide-steel-200 border-y border-steel-200">
            {FACTS.map((f) => (
              <div key={f.title} className="reveal grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-7">
                <dt className="md:col-span-5 font-heading text-2xl text-navy-900 leading-tight">
                  {f.title}
                </dt>
                <dd className="md:col-span-7 text-charcoal-600 leading-relaxed">{f.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
