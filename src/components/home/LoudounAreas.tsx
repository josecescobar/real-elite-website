import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';

/**
 * Where we work — Loudoun first.
 *
 * Towns with a live page link to it; towns whose pages are still being
 * written render as plain text so the homepage never links to a 404. When a
 * town page lands, add its `href` here.
 */
const LOUDOUN_TOWNS: readonly { name: string; href?: string; note: string }[] = [
  { name: 'Leesburg', href: '/service-areas/leesburg-va', note: 'Old Town, River Creek, Lansdowne' },
  { name: 'Ashburn', href: '/service-areas/ashburn-va', note: 'Broadlands, Ashburn Farm, One Loudoun' },
  { name: 'Brambleton', href: '/service-areas/brambleton-va', note: 'Planned villages, active ARB' },
  { name: 'Middleburg', href: '/service-areas/middleburg-va', note: 'Hunt Country, historic district' },
  { name: 'Purcellville', note: 'Western Loudoun, well and septic' },
  { name: 'Lansdowne', note: 'On the Potomac, golf-course lots' },
  { name: 'Waterford', note: 'National Historic Landmark village' },
  { name: 'Round Hill', note: 'Foothill estates and acreage' },
];

export default function LoudounAreas() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-brand-red text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              Where we work
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy-900 leading-[1.05]">
              Loudoun County, first.
            </h2>
            <p className="text-charcoal-600 mt-5 leading-relaxed">
              Eastern Loudoun&rsquo;s planned communities and the estates and villages west of
              Route 15. Fairfax County by conversation, and the Eastern Panhandle of West
              Virginia, where the company is based.
            </p>
            <Link
              href="/service-areas"
              className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-navy-900 link-editorial"
            >
              All service areas
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
            {LOUDOUN_TOWNS.map((t) => (
              <li key={t.name} className="reveal border-t border-steel-200 pt-4">
                {t.href ? (
                  <Link
                    href={t.href}
                    className="font-heading text-2xl text-navy-900 hover:text-brand-red transition-colors leading-tight"
                  >
                    {t.name}
                  </Link>
                ) : (
                  <span className="font-heading text-2xl text-navy-900 leading-tight">{t.name}</span>
                )}
                <p className="text-charcoal-500 text-sm mt-1.5 leading-snug">{t.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
