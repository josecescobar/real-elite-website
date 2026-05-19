import Link from 'next/link';
import { MapPin } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import {
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  EXPANSION_SERVICE_AREAS,
} from '@/lib/constants';

/**
 * Equal-tier regional service area display (WV / VA / MD).
 * The plan eliminated the gray "Expansion" tier — VA + MD markets are
 * now first-class, indexed alongside the Eastern Panhandle WV cities.
 */
type Area = { city: string; state: string; slug: string };

const REGIONS: { state: string; full: string; areas: Area[] }[] = [
  {
    state: 'WV',
    full: 'West Virginia',
    areas: [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS].filter(
      (a) => a.state === 'WV'
    ),
  },
  {
    state: 'VA',
    full: 'Virginia',
    areas: EXPANSION_SERVICE_AREAS.filter((a) => a.state === 'VA'),
  },
  {
    state: 'MD',
    full: 'Maryland',
    areas: EXPANSION_SERVICE_AREAS.filter((a) => a.state === 'MD'),
  },
];

export default function ServiceAreaMap() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container size="wide">
        <SectionHeader
          eyebrow="Where We Work"
          title="Premium contracting across WV, VA, and MD."
          subtitle="Headquartered in Martinsburg. Trusted across the Eastern Panhandle, the Shenandoah Valley, Loudoun County, and Frederick County."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {REGIONS.map((region) => (
            <div
              key={region.state}
              className="bg-steel-50 rounded-lg p-7 lg:p-8 border-t-4 border-navy-800"
            >
              <div className="flex items-center gap-3 mb-5">
                <MapPin className="w-5 h-5 text-brand-red" aria-hidden="true" />
                <h3 className="font-heading text-2xl font-extrabold text-navy-800">
                  {region.full}
                </h3>
              </div>
              <ul className="space-y-2">
                {region.areas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      href={`/service-areas/${area.slug}`}
                      className="inline-flex items-center justify-between w-full text-sm font-medium text-charcoal-700 hover:text-brand-red transition-colors py-1.5 group"
                    >
                      <span>
                        {area.city}, <span className="text-charcoal-500">{area.state}</span>
                      </span>
                      <span className="text-charcoal-300 group-hover:text-brand-red group-hover:translate-x-1 transition-all">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-charcoal-500 text-sm mt-10">
          Don&apos;t see your area?{' '}
          <Link href="/contact" className="text-navy-800 font-semibold hover:text-brand-red transition-colors underline">
            Contact us
          </Link>{' '}
          — we may still be able to help.
        </p>
      </Container>
    </section>
  );
}
