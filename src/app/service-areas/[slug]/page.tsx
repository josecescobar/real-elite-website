import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BUSINESS,
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  EXPANSION_SERVICE_AREAS,
  EXPANSION_CITY_DATA,
  ALL_SERVICE_AREAS,
  SERVICES,
} from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { MapPin, Check, Phone, ArrowRight } from 'lucide-react';

// City-specific data lookup
const CITY_DATA: Record<
  string,
  {
    description: string;
    neighborhoods: string[];
  }
> = {
  'martinsburg-wv': {
    description:
      'Martinsburg is the county seat of Berkeley County and the largest city in the Eastern Panhandle. Located along the I-81 corridor, it serves as the regional hub for commerce, services, and community life. Berkeley County is the fastest-growing county in West Virginia, and Martinsburg sits at the center of that growth — attracting families and professionals drawn by affordable housing, a revitalizing historic downtown, and easy commuter access to the Washington, D.C. metro via MARC train. The local economy blends government employers like the IRS and Coast Guard operations center with a growing small-business community along Queen Street and Foxcroft Avenue. Homes here range from beautifully preserved Victorian-era properties in the historic district to modern developments in the surrounding suburbs. Each style brings its own set of maintenance and improvement needs, from period-appropriate trim and siding repairs to full roof replacements with architectural shingles rated for our four-season climate. Real Elite Contracting has deep roots in Martinsburg and understands these challenges firsthand. We are proud to be the contractor our neighbors trust for quality craftsmanship that protects and enhances their most valuable investment.',
    neighborhoods: ['South Martinsburg', 'North End', 'Pikeside', 'Foxcroft Area', 'Burke Street Historic District'],
  },
  'inwood-wv': {
    description:
      'Inwood is an unincorporated community in Berkeley County that has been experiencing a remarkable residential boom over the past decade. Located near I-81 and just minutes from Martinsburg, Inwood offers a blend of rural charm and convenient access to regional amenities. The Route 51 corridor has become a focal point of new housing development, with subdivisions and single-family homes replacing farmland as the area transitions from a quiet rural crossroads to a thriving suburban community. Inwood\'s proximity to the Virginia border gives residents easy access to jobs and shopping in Winchester and the northern Shenandoah Valley, while maintaining the lower cost of living and property taxes that West Virginia offers. New construction here often features modern open floor plans on generous lots, while older homes along the back roads retain the character of the area\'s agricultural heritage. Whether homeowners need roofing for a brand-new build, siding upgrades on an established ranch, or a custom deck to take advantage of the mountain views, Real Elite Contracting delivers professional results. We understand the specific building codes and soil conditions in this part of Berkeley County and bring that local knowledge to every project we take on.',
    neighborhoods: ['Route 51 Corridor', 'Ridge Road Area', 'Highway 9 Community', 'Inwood Orchards', 'Gerrardstown Road Area'],
  },
  'charles-town-wv': {
    description:
      'Charles Town is the county seat of Jefferson County and boasts a rich historical downtown character dating back to its founding by Charles Washington, brother of George Washington. Home to the famous Hollywood Casino at Charles Town Races and surrounded by beautiful orchards and rolling landscapes, Charles Town attracts residents who value both history and progress. Jefferson County has seen significant growth as a commuter destination, with many residents working in Northern Virginia and the Washington, D.C. metro area while enjoying the lower cost of living and scenic beauty of the Eastern Panhandle. The town\'s proximity to Harpers Ferry National Historical Park adds to its appeal, drawing history enthusiasts and outdoor lovers alike. Many properties in the historic downtown are subject to preservation guidelines that require contractors who understand period-appropriate materials and techniques — from wood siding restoration to historically sympathetic roofing choices. Beyond the historic core, newer subdivisions offer modern homes where families invest in decks, additions, and energy-efficient upgrades. Real Elite Contracting is proud to serve this community, helping preserve the character of historic homes while modernizing living spaces with quality improvements and repairs that meet the highest standards.',
    neighborhoods: ['Historic Downtown', 'Ranson Border', 'Jefferson Orchards Area', 'Cavaland', 'Flowing Springs Road Area'],
  },
  'ranson-wv': {
    description:
      'Ranson is rapidly transforming from a small community into one of the Eastern Panhandle\'s most dynamic residential destinations, with new developments and growing infrastructure reshaping the landscape. The Flowing Springs and Powhatan Place developments have brought hundreds of new homes to the area, attracting young families and first-time buyers with modern floor plans, community amenities, and competitive pricing. Along Fairfax Boulevard, a wave of urban renewal has introduced mixed-use development and revitalized commercial spaces that are giving Old Town Ranson a fresh identity while respecting its roots. Adjacent to Charles Town, Ranson appeals to families and young professionals who want newer homes and walkable neighborhoods without sacrificing the small-town feel of the Eastern Panhandle. The demographic here skews younger than many surrounding communities, and homeowners are actively investing in their properties — finishing basements, building decks for entertaining, upgrading siding, and adding square footage as their families grow. Real Elite Contracting serves the many construction and remodeling needs of Ranson\'s expanding population, from finishing new construction details to updating established homes with modern materials and energy-efficient solutions.',
    neighborhoods: ['Old Town Ranson', 'Flowing Springs Development', 'Harpers Ferry Road Area', 'Powhatan Place', 'Fairfax Boulevard Corridor'],
  },
  'hedgesville-wv': {
    description:
      'Hedgesville is a rural community in Berkeley County known for its family-oriented atmosphere, peaceful surroundings, and one of the most highly regarded school districts in the state. The Hedgesville school district is a major draw for families relocating to the Eastern Panhandle, and that demand has fueled steady residential growth throughout the area. Properties here tend to sit on larger lots — often an acre or more — which means homeowners face unique exterior maintenance challenges that suburban homes do not, from longer rooflines and more expansive siding to outbuildings, detached garages, and wraparound porches. The rolling terrain and wooded parcels also expose homes to more wind, fallen debris, and moisture, making regular roof inspections and gutter maintenance essential. Despite its rural character, Hedgesville is a growing community with new subdivisions appearing along the main corridors and a local commercial base that continues to expand. Families here take pride in their properties and invest in improvements that enhance both livability and long-term value. Real Elite Contracting understands the specific needs of rural homeowners in the Hedgesville area and delivers dependable, high-quality service to this tight-knit community — whether the project is a full roof replacement, new siding, a backyard deck, or critical exterior repairs.',
    neighborhoods: ['Hedgesville Pike Area', 'Route 9 Community', 'Mill Creek District', 'Shanghai Road Area', 'Back Creek Valley'],
  },
  'spring-mills-wv': {
    description:
      'Spring Mills is a census-designated place in Berkeley County and one of the fastest-growing communities in all of West Virginia. What was once a quiet stretch of Route 11 south of Martinsburg has evolved into a thriving suburban corridor anchored by Spring Mills High School, new commercial development, and a wave of residential construction that shows no signs of slowing down. Families and professionals relocate here seeking newer housing developments, well-rated schools, and the suburban convenience of nearby shopping centers and medical facilities — all while remaining within easy commuting distance of Martinsburg, Hagerstown, and the MARC train. New subdivisions like Sunridge and Spring Ridge feature modern homes with composite decks, vinyl and fiber cement siding, and architectural shingle roofs that benefit from professional installation and maintenance. Along the Route 11 corridor, new retail and dining options are creating a self-sustaining community where residents can live, work, and shop locally. Real Elite Contracting is actively serving the many homeowners in Spring Mills who are building and improving their dream properties, offering everything from roof replacements and siding upgrades to custom decks and full remodeling projects tailored to the area\'s modern housing stock.',
    neighborhoods: ['Sunridge Development', 'Spring Ridge Area', 'Route 11 Corridor', 'Eagle School Road Area', 'Spring Mills High School Community'],
  },
  'falling-waters-wv': {
    description:
      'Falling Waters is a scenic rural community nestled along the Potomac River in Berkeley County, offering some of the most picturesque residential settings in the Eastern Panhandle. Properties near the river enjoy stunning views and direct access to fishing, kayaking, and other outdoor recreation, but they also come with practical considerations that homeowners must plan for — including flood zone designations, higher moisture exposure, and the need for durable exterior materials that can withstand river-valley humidity. The community features an interesting mix of older homes with decades of character and newer construction built to take advantage of the natural surroundings. Many homeowners here invest in covered porches, screened-in additions, and multi-level decks designed for enjoying the outdoors year-round. Along the Route 9 corridor connecting Martinsburg to the river, residential development continues to grow as families discover this quiet alternative to more congested suburban areas. Real Elite Contracting serves the unique exterior maintenance and improvement needs of Falling Waters properties, from weather-resistant roofing and siding solutions to custom deck builds that complement the riverside lifestyle. Our team understands the specific challenges of building near water and delivers results that are both beautiful and built to last.',
    neighborhoods: ['Potomac Riverside', 'Route 9 Corridor', 'Woods Edge Area', 'River Country Estates', 'Dam Number 5 Road Area'],
  },
  'berkeley-springs-wv': {
    description:
      'Berkeley Springs is the county seat of Morgan County and famous for its warm mineral springs — a natural attraction that George Washington himself visited — and a vibrant tourism industry that drives much of the local economy. The charming historic downtown is home to art galleries, spas, boutique shops, and restaurants that draw visitors year-round, while the surrounding hills and hollows are dotted with cabins, vacation rentals, and full-time residences that reflect Morgan County\'s distinctive building styles. The arts community here is one of the most active in West Virginia, and many property owners take special pride in maintaining and enhancing the visual character of their homes and businesses. Seasonal property maintenance is a major consideration in Berkeley Springs, particularly for vacation homes and rental properties that must stay in top condition to attract guests. From roof inspections after harsh mountain winters to siding repairs, deck staining, and full exterior makeovers before the busy tourist season, year-round upkeep is essential. Real Elite Contracting serves both permanent residents and absentee property owners in Berkeley Springs who want reliable, high-quality contracting services. We understand the historic character of this unique community and bring craftsmanship that preserves it while delivering modern performance and durability.',
    neighborhoods: ['Historic Downtown', 'Warm Springs Area', 'Market Street District', 'Cacapon Road Corridor', 'Ridge Road Community'],
  },
  'shepherdstown-wv': {
    description:
      'Shepherdstown is the oldest town in West Virginia, founded in 1762, and home to Shepherd University, giving it a unique blend of historic charm and youthful vitality. The university\'s presence shapes the community in meaningful ways — it supports a walkable, culturally rich downtown with locally owned shops, restaurants, and performance venues, while also creating steady demand for well-maintained rental properties and faculty housing. The picturesque German Street corridor and surrounding neighborhoods attract professionals, academics, and families who value quality living in a town that feels both timeless and vibrant. Many properties in the historic preservation district require contractors experienced with older construction methods, period-appropriate materials, and the permitting process that comes with designated historic structures. Beyond the downtown core, Shepherdstown offers Potomac riverfront properties with sweeping views and unique site considerations, as well as newer residential areas where modern homes sit on wooded lots along the Kearneysville and Moler Crossroads corridors. Whether the project involves restoring a 19th-century facade, replacing a roof on a university-area rental, or building a custom deck overlooking the Potomac, Real Elite Contracting brings the expertise and attention to detail that Shepherdstown homeowners expect and deserve.',
    neighborhoods: ['Historic Downtown', 'University Area', 'Potomac Riverfront', 'Moler Crossroads', 'Shepherd Grade Road Area'],
  },
};

const FULL_CITY_DATA = { ...CITY_DATA, ...EXPANSION_CITY_DATA };
type CitySlug = keyof typeof FULL_CITY_DATA;

export function generateStaticParams() {
  return ALL_SERVICE_AREAS.map((area) => ({
    slug: area.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = ALL_SERVICE_AREAS.find((c) => c.slug === slug);

  if (!city) {
    return {
      title: 'Not Found',
    };
  }

  const title = `General Contractor in ${city.city}, ${city.state} | ${BUSINESS.name}`;
  const description = `Real Elite Contracting serves ${city.city}, ${city.state} with expert roofing, siding, decks, remodeling, and exterior repairs. Veteran-owned. Call for a free estimate.`;

  return {
    title,
    description,
    keywords: [
      `${city.city} contractor`,
      `${city.city} general contractor`,
      `${city.city} roofing`,
      `${city.city} siding`,
      `${city.city} decks`,
      `${city.city} remodeling`,
      `${city.city} home improvement`,
      `${city.state} contractor`,
      'contractor near me',
    ],
    alternates: {
      canonical: `${BUSINESS.url}/service-areas/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BUSINESS.url}/service-areas/${slug}`,
      type: 'website',
    },
  };
}

export default async function CityServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = ALL_SERVICE_AREAS.find((c) => c.slug === slug);
  const cityData = FULL_CITY_DATA[slug as CitySlug];

  if (!city || !cityData) {
    notFound();
  }

  const isPrimary = PRIMARY_SERVICE_AREAS.some((a) => a.slug === slug);

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    url: BUSINESS.url,
    telephone: BUSINESS.phoneRaw,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.zip,
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'City',
      name: city.city,
      containedInPlace: {
        '@type': 'State',
        name: city.state,
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Home Improvement Services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title },
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BUSINESS.url },
      { '@type': 'ListItem', position: 2, name: 'Service Areas', item: `${BUSINESS.url}/service-areas` },
      { '@type': 'ListItem', position: 3, name: `${city.city}, ${city.state}`, item: `${BUSINESS.url}/service-areas/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4 mb-4">
            <MapPin className="w-8 h-8 text-gold-400 flex-shrink-0" />
            <div>
              <p className="text-gold-300 text-lg font-semibold mb-2">Service Area</p>
              <h1 className="text-4xl md:text-5xl font-bold">
                {city.city}, {city.state}
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-300 mt-4">
            Your Trusted Local Contractor
          </p>
          {isPrimary && (
            <div className="mt-4 inline-block bg-gold-500 text-navy-900 px-3 py-1 rounded-full text-sm font-bold">
              Primary Service Area
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8 text-center">
            About {city.city}
          </h2>

          <div className="space-y-6 mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              {cityData.description}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Real Elite Contracting has served the {city.city} area for years, building relationships
              with homeowners and understanding their unique needs. Whether you need a complete roof
              replacement, new siding, a custom deck, a full remodel, a home addition, or exterior
              repairs, we bring the same professional standards and attention to detail to every project.
              Our team knows {city.city} and is committed to delivering exceptional results that enhance
              your home and increase its value.
            </p>
          </div>

          <div className="bg-navy-50 p-8 rounded-lg border border-navy-200">
            <h3 className="text-xl font-bold text-navy-900 mb-4">
              Local Communities &amp; Areas We Serve
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {cityData.neighborhoods.map((neighborhood, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-gold-600 flex-shrink-0" />
                  <span className="text-gray-700">{neighborhood}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Available Section */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
            Services Available in {city.city}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-b-4 border-gold-500 h-full cursor-pointer group">
                  <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-gold-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center text-gold-600 font-semibold group-hover:text-gold-700 transition-colors text-sm">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
            Why {city.city} Residents Choose Real Elite Contracting
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gold-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                Local Expertise
              </h3>
              <p className="text-gray-700">
                We know {city.city} and its unique architectural styles, climate challenges, and local
                building codes. Our experience in this area means better solutions for your home.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                Quality Craftsmanship
              </h3>
              <p className="text-gray-700">
                Every project receives our full attention and commitment to excellence. We use premium
                materials and proven techniques to ensure your improvements last for years.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                Trusted by Your Neighbors
              </h3>
              <p className="text-gray-700">
                Real Elite Contracting has built a reputation for reliability, professionalism, and
                customer satisfaction in {city.city}. Ask your neighbors—they trust us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estimate CTA Section */}
      <section className="py-16 md:py-24 bg-navy-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready for Your Home Improvement?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Get a free, no-obligation estimate for your roofing, siding, deck, remodeling, addition,
                or exterior repair project in {city.city}. Our team will assess your needs and provide a
                detailed quote.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-gold-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Call us today</p>
                    <a
                      href={`tel:${BUSINESS.phoneRaw}`}
                      className="text-xl font-bold text-gold-400 hover:text-gold-300"
                    >
                      {BUSINESS.phone}
                    </a>
                  </div>
                </div>
                <div className="pt-4 border-t border-navy-700">
                  <p className="text-sm text-gray-400 mb-2">Or fill out the form and we'll contact you</p>
                </div>
              </div>
            </div>

            <div>
              <EstimateForm />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 mb-6">
            Not sure where to start? Browse all our services or visit our main service areas page.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button variant="outline">View All Services</Button>
            </Link>
            <Link href="/service-areas">
              <Button variant="outline">View All Service Areas</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
