import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';

/**
 * Where we work — Loudoun first.
 *
 * Every town here links to its own service-area page (all live as of the
 * 2026-09 towns work). A town without an `href` renders as plain text so the
 * homepage never links to a 404; the built-links suite enforces it.
 */
const LOUDOUN_TOWNS: readonly { name: string; href?: string; note: string }[] = [
  { name: 'Leesburg', href: '/service-areas/leesburg-va', note: 'Old Town, River Creek, Raspberry Falls' },
  { name: 'Ashburn', href: '/service-areas/ashburn-va', note: 'Broadlands, Ashburn Farm, One Loudoun' },
  { name: 'Brambleton', href: '/service-areas/brambleton-va', note: 'Planned villages, active ARB' },
  { name: 'Lansdowne', href: '/service-areas/lansdowne-va', note: 'On the Potomac, golf-course lots' },
  { name: 'Middleburg', href: '/service-areas/middleburg-va', note: 'Hunt Country, historic district' },
  { name: 'Purcellville', href: '/service-areas/purcellville-va', note: 'Western Loudoun, well and septic' },
  { name: 'Waterford', href: '/service-areas/waterford-va', note: 'National Historic Landmark village' },
  { name: 'Round Hill', href: '/service-areas/round-hill-va', note: 'Foothill estates and acreage' },
  { name: 'Hamilton', href: '/service-areas/hamilton-va', note: 'Village lots and farmettes' },
  { name: 'Lovettsville', href: '/service-areas/lovettsville-va', note: 'North of Route 9, near the river' },
  { name: 'Aldie', href: '/service-areas/aldie-va', note: 'Historic village, county review' },
  { name: 'South Riding', href: '/service-areas/south-riding-va', note: 'Planned community, active HOA' },
  { name: 'Sterling', href: '/service-areas/sterling-va', note: 'Eastern Loudoun, older homes' },
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
              Route 15. Also{' '}
              <Link href="/service-areas/fairfax-county-va" className="link-editorial font-medium text-navy-900">
                Fairfax County
              </Link>
              ,{' '}
              <Link href="/service-areas/prince-william-county-va" className="link-editorial font-medium text-navy-900">
                Prince William County
              </Link>
              ,{' '}
              <Link href="/service-areas/frederick-md" className="link-editorial font-medium text-navy-900">
                Frederick
              </Link>
              {' '}and{' '}
              <Link href="/service-areas/hagerstown-md" className="link-editorial font-medium text-navy-900">
                Hagerstown
              </Link>
              {' '}in Maryland, and the Eastern Panhandle of West Virginia, where the company is based.
            </p>
            <ul className="mt-5 space-y-2 text-sm font-semibold">
              <li>
                <Link href="/services/kitchens/ashburn-va" className="text-navy-900 underline hover:text-brand-red">
                  Kitchen remodel Ashburn VA
                </Link>
              </li>
              <li>
                <Link href="/services/bathrooms/ashburn-va" className="text-navy-900 underline hover:text-brand-red">
                  Bathroom remodel Ashburn VA
                </Link>
              </li>
              <li>
                <Link href="/services/decks/martinsburg-wv" className="text-navy-900 underline hover:text-brand-red">
                  Deck builders Martinsburg WV
                </Link>
              </li>
              <li>
                <Link href="/service-areas/martinsburg-wv" className="text-navy-900 underline hover:text-brand-red">
                  General contractor Martinsburg WV
                </Link>
              </li>
            </ul>
            <Link
              href="/service-areas"
              className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-navy-900 link-editorial"
            >
              All service areas
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-8">
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
